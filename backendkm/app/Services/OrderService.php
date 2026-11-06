<?php

namespace App\Services;

use App\Enums\OrderStatus;
use App\Enums\PaymentMethod;
use App\Enums\PaymentStatus;
use App\Models\Cart;
use App\Models\Coupon;
use App\Models\Customer;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payment;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class OrderService
{
    public function __construct(
        protected StockService $stockService,
        protected CartService $cartService,
    ) {}

    public function createFromCart(User $user, array $data = []): Order
    {
        return DB::transaction(function () use ($user, $data) {
            $cart = Cart::with('items.product', 'items.variant')->where('user_id', $user->id)->firstOrFail();

            if ($cart->items->isEmpty()) {
                throw new \RuntimeException('Cart is empty.');
            }

            // resolve customer
            $customer = null;
            if (! empty($data['customer_id'])) {
                $customer = Customer::find($data['customer_id']);
            } elseif ($user->hasRole('customer')) {
                $customer = Customer::firstOrCreate(
                    ['user_id' => $user->id],
                    ['name' => $user->name, 'email' => $user->email, 'phone' => $user->phone]
                );
            }

            // compute subtotal
            $subtotal = 0;
            foreach ($cart->items as $item) {
                $subtotal += $item->qty * (float) $item->price;
            }

            // coupon
            $coupon = null;
            $discountTotal = 0;
            if (! empty($data['coupon_code'])) {
                $coupon = Coupon::where('code', $data['coupon_code'])->first();
                if ($coupon && $coupon->isValid($subtotal)) {
                    $discountTotal = $coupon->discountFor($subtotal);
                } else {
                    $coupon = null;
                }
            }

            $taxTotal = (float) ($data['tax_total'] ?? 0);
            $total = max(0, $subtotal - $discountTotal + $taxTotal);

            $order = Order::create([
                'order_number' => $this->generateOrderNumber(),
                'customer_id' => $customer?->id,
                'user_id' => $user->id,
                'coupon_id' => $coupon?->id,
                'status' => OrderStatus::Pending->value,
                'payment_status' => PaymentStatus::Unpaid->value,
                'payment_method' => $data['payment_method'] ?? null,
                'subtotal' => $subtotal,
                'discount_total' => $discountTotal,
                'tax_total' => $taxTotal,
                'total' => $total,
                'notes' => $data['notes'] ?? null,
                'table_number' => $data['table_number'] ?? null,
            ]);

            foreach ($cart->items as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item->product_id,
                    'product_variant_id' => $item->product_variant_id,
                    'name' => $item->product->name.($item->variant ? ' - '.$item->variant->name : ''),
                    'sku' => $item->variant?->sku ?? $item->product->sku,
                    'price' => $item->price,
                    'qty' => $item->qty,
                    'subtotal' => $item->qty * (float) $item->price,
                    'discount' => 0,
                ]);
            }

            // reserve stock
            $this->stockService->deductForOrder($order->load('items'));

            // clear cart
            $this->cartService->clear($cart);

            return $order->fresh(['items', 'customer', 'coupon']);
        });
    }

    public function markPaid(Order $order, string $method, float $paidAmount, ?array $payload = null): Payment
    {
        return DB::transaction(function () use ($order, $method, $paidAmount, $payload) {
            $order = Order::lockForUpdate()->find($order->id);

            if ($order->payment_status === PaymentStatus::Paid->value) {
                // idempotent: return existing payment
                return $order->payments()->latest()->firstOrFail();
            }

            $payment = Payment::create([
                'order_id' => $order->id,
                'method' => $method,
                'amount' => $paidAmount,
                'status' => PaymentStatus::Paid->value,
                'gateway' => $method === PaymentMethod::Midtrans->value ? 'midtrans' : null,
                'transaction_id' => $payload['transaction_id'] ?? null,
                'payload' => $payload,
                'paid_at' => now(),
            ]);

            $order->payment_status = PaymentStatus::Paid->value;
            $order->payment_method = $method;
            $order->status = OrderStatus::Paid->value;
            $order->paid_amount = $paidAmount;
            $order->change_amount = max(0, $paidAmount - (float) $order->total);
            $order->paid_at = now();
            if (! empty($payload['transaction_id'])) {
                $order->midtrans_transaction_id = $payload['transaction_id'];
            }
            $order->save();

            // coupon usage
            if ($order->coupon_id) {
                $order->coupon?->increment('used_count');
            }

            return $payment;
        });
    }

    public function cancel(Order $order, ?string $reason = null): Order
    {
        return DB::transaction(function () use ($order, $reason) {
            $order = Order::lockForUpdate()->find($order->id);

            if ($order->status === OrderStatus::Cancelled->value) {
                return $order;
            }

            // restore stock if reserved (order not yet cancelled)
            if ($order->status !== OrderStatus::Completed->value) {
                $this->stockService->restoreForOrder($order->load('items'));
            }

            $order->status = OrderStatus::Cancelled->value;
            $order->payment_status = in_array($order->payment_status, [PaymentStatus::Paid->value], true)
                ? PaymentStatus::Refunded->value
                : $order->payment_status;
            $order->cancelled_at = now();
            if ($reason) {
                $order->notes = trim(($order->notes ?? '')."\nCancelled: ".$reason);
            }
            $order->save();

            return $order;
        });
    }

    public function generateOrderNumber(): string
    {
        return 'ORD-'.now()->format('YmdHis').'-'.random_int(100, 999);
    }
}
