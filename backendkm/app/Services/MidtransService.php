<?php

namespace App\Services;

use App\Models\Order;
use Midtrans\Config as MidtransConfig;
use Midtrans\Snap;
use Midtrans\Transaction;

class MidtransService
{
    public function __construct()
    {
        MidtransConfig::$serverKey = config('midtrans.server_key');
        MidtransConfig::$isProduction = (bool) config('midtrans.is_production');
        MidtransConfig::$isSanitized = (bool) config('midtrans.is_sanitized', true);
        MidtransConfig::$is3ds = (bool) config('midtrans.is_3ds', true);
    }

    public function createSnapToken(Order $order): array
    {
        $order->loadMissing('items', 'customer');

        $itemDetails = [];
        foreach ($order->items as $item) {
            $itemDetails[] = [
                'id' => (string) ($item->product_id ?? $item->id),
                'price' => (int) round((float) $item->price),
                'quantity' => $item->qty,
                'name' => substr($item->name, 0, 50),
            ];
        }

        if ((float) $order->discount_total > 0) {
            $itemDetails[] = [
                'id' => 'DISCOUNT',
                'price' => -(int) round((float) $order->discount_total),
                'quantity' => 1,
                'name' => 'Discount',
            ];
        }

        $params = [
            'transaction_details' => [
                'order_id' => $order->midtrans_order_id ?: $order->order_number,
                'gross_amount' => (int) round((float) $order->total),
            ],
            'item_details' => $itemDetails,
            'customer_details' => [
                'first_name' => $order->customer?->name ?? 'Customer',
                'email' => $order->customer?->email ?? 'customer@example.com',
                'phone' => $order->customer?->phone ?? '',
            ],
        ];

        if (config('midtrans.notification_url')) {
            $params['callbacks'] = [];
        }

        $snapToken = Snap::getSnapToken($params);
        $redirectUrl = 'https://'.(config('midtrans.is_production') ? 'app' : 'sandbox').'.'.'midtrans.com/snap/v2/vtweb/'.$snapToken;

        return [
            'snap_token' => $snapToken,
            'redirect_url' => $redirectUrl,
            'client_key' => config('midtrans.client_key'),
        ];
    }

    public function status(string $orderId): ?array
    {
        try {
            $status = Transaction::status($orderId);

            return json_decode(json_encode($status), true);
        } catch (\Throwable $e) {
            return null;
        }
    }

    public function verifySignature(array $payload): bool
    {
        $orderId = $payload['order_id'] ?? '';
        $statusCode = $payload['status_code'] ?? '';
        $grossAmount = $payload['gross_amount'] ?? '';
        $serverKey = config('midtrans.server_key');
        $signature = hash('sha512', $orderId.$statusCode.$grossAmount.$serverKey);

        return hash_equals($signature, (string) ($payload['signature_key'] ?? ''));
    }

    public function isPaidStatus(array $payload): bool
    {
        $transactionStatus = $payload['transaction_status'] ?? '';
        $fraudStatus = $payload['fraud_status'] ?? 'accept';

        return in_array($transactionStatus, ['capture', 'settlement'], true)
            && ($transactionStatus !== 'capture' || $fraudStatus === 'accept');
    }
}
