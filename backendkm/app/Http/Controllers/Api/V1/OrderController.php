<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Services\OrderService;
use Illuminate\Http\Request;
use Spatie\QueryBuilder\QueryBuilder;

class OrderController extends Controller
{
    public function __construct(protected OrderService $orderService) {}

    public function index(Request $request)
    {
        $query = Order::with(['customer', 'cashier', 'items', 'coupon']);

        if (! $request->user()->hasAnyRole(['admin', 'manager', 'cashier'])) {
            $query->where('user_id', $request->user()->id);
        }

        $orders = QueryBuilder::for($query)
            ->allowedFilters('status', 'payment_status', 'payment_method')
            ->allowedSorts('', '')
            ->defaultSort('-created_at')
            ->paginate($request->integer('per_page', 15))
            ->appends($request->query());

        return response()->json($orders);
    }

    public function show(Order $order)
    {
        return response()->json($order->load(['customer', 'cashier', 'items.product', 'items.variant', 'payments', 'coupon']));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'payment_method' => ['nullable', 'string', 'in:cash,midtrans'],
            'coupon_code' => ['nullable', 'string'],
            'notes' => ['nullable', 'string'],
            'customer_id' => ['nullable', 'exists:customers,id'],
            'pay_now' => ['nullable', 'boolean'],
            'paid_amount' => ['nullable', 'numeric', 'min:0'],
            'tax_total' => ['nullable', 'numeric', 'min:0'],
            'table_number' => ['nullable', 'string', 'max:20'],
        ]);

        $order = $this->orderService->createFromCart($request->user(), $data);

        if (($data['payment_method'] ?? null) === 'cash' && ($data['pay_now'] ?? false)) {
            $paidAmount = (float) ($data['paid_amount'] ?? $order->total);
            $this->orderService->markPaid($order, 'cash', $paidAmount);
            $order = $order->fresh(['items', 'customer', 'payments']);
        }

        return response()->json($order->load(['items', 'customer', 'payments']), 201);
    }

    public function cancel(Request $request, Order $order)
    {
        $data = $request->validate([
            'reason' => ['nullable', 'string'],
        ]);

        $order = $this->orderService->cancel($order, $data['reason'] ?? null);

        return response()->json($order);
    }

    public function updateStatus(Request $request, Order $order)
    {
        $data = $request->validate([
            'status' => ['required', 'string', 'in:pending,paid,processing,completed,cancelled,refunded'],
        ]);

        $order->status = $data['status'];
        $order->save();

        return response()->json($order);
    }
}
