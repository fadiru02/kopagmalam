<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Services\MidtransService;
use App\Services\OrderService;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function __construct(
        protected MidtransService $midtrans,
        protected OrderService $orders,
    ) {}

    public function createMidtrans(Request $request, Order $order)
    {
        if (! $order->midtrans_order_id) {
            $order->midtrans_order_id = $order->order_number;
            $order->save();
        }

        $result = $this->midtrans->createSnapToken($order);

        $order->midtrans_snap_token = $result['snap_token'];
        $order->payment_method = 'midtrans';
        $order->save();

        return response()->json($result);
    }

    public function notification(Request $request)
    {
        $payload = $request->all();

        if (! $this->midtrans->verifySignature($payload)) {
            return response()->json(['message' => 'Invalid signature.'], 403);
        }

        $orderId = $payload['order_id'] ?? null;
        $order = Order::where('midtrans_order_id', $orderId)
            ->orWhere('order_number', $orderId)
            ->first();

        if (! $order) {
            return response()->json(['message' => 'Order not found.'], 404);
        }

        if ($this->midtrans->isPaidStatus($payload)) {
            $this->orders->markPaid($order, 'midtrans', (float) ($payload['gross_amount'] ?? $order->total), [
                'transaction_id' => $payload['transaction_id'] ?? null,
                'payload' => $payload,
            ]);
        } elseif (in_array($payload['transaction_status'] ?? '', ['deny', 'cancel', 'expire'], true)) {
            $this->orders->cancel($order, 'Midtrans: '.($payload['transaction_status'] ?? ''));
        }

        return response()->json(['message' => 'OK']);
    }

    public function sync(Request $request, Order $order)
    {
        $midtransOrderId = $order->midtrans_order_id ?: $order->order_number;
        $status = $this->midtrans->status($midtransOrderId);

        if (! $status) {
            return response()->json(['message' => 'Unable to fetch status.'], 502);
        }

        if ($this->midtrans->isPaidStatus($status)) {
            $this->orders->markPaid($order, 'midtrans', (float) ($status['gross_amount'] ?? $order->total), [
                'transaction_id' => $status['transaction_id'] ?? null,
                'payload' => $status,
            ]);
        }

        return response()->json($order->fresh(['payments']));
    }
}
