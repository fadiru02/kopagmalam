<?php

namespace App\Services;

use App\Enums\StockMovementType;
use App\Models\Order;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\StockMovement;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class StockService
{
    public function adjust(Product $product, ?ProductVariant $variant, int $qty, StockMovementType $type, ?string $note = null, ?User $user = null, ?string $referenceType = null, ?int $referenceId = null): StockMovement
    {
        return DB::transaction(function () use ($product, $variant, $qty, $type, $note, $user, $referenceType, $referenceId) {
            if ($variant) {
                $variant = ProductVariant::lockForUpdate()->find($variant->id);
            } else {
                $product = Product::lockForUpdate()->find($product->id);
            }

            $delta = match ($type) {
                StockMovementType::In => abs($qty),
                StockMovementType::Out => -abs($qty),
                StockMovementType::Adjustment => $qty,
            };

            if ($variant) {
                $variant->stock = max(0, $variant->stock + $delta);
                $variant->save();
            } else {
                $product->stock = max(0, $product->stock + $delta);
                $product->save();
            }

            return StockMovement::create([
                'product_id' => $product->id,
                'product_variant_id' => $variant?->id,
                'type' => $type->value,
                'qty' => $qty,
                'reference_type' => $referenceType,
                'reference_id' => $referenceId,
                'user_id' => $user?->id,
                'note' => $note,
            ]);
        });
    }

    public function deductForOrder(Order $order): void
    {
        DB::transaction(function () use ($order) {
            foreach ($order->items as $item) {
                $product = Product::lockForUpdate()->find($item->product_id);
                if (! $product) {
                    continue;
                }
                $variant = $item->product_variant_id
                    ? ProductVariant::lockForUpdate()->find($item->product_variant_id)
                    : null;

                $qty = $item->qty;
                if ($variant) {
                    $variant->stock = max(0, $variant->stock - $qty);
                    $variant->save();
                } else {
                    $product->stock = max(0, $product->stock - $qty);
                    $product->save();
                }

                StockMovement::create([
                    'product_id' => $product->id,
                    'product_variant_id' => $variant?->id,
                    'type' => StockMovementType::Out->value,
                    'qty' => $qty,
                    'reference_type' => Order::class,
                    'reference_id' => $order->id,
                    'user_id' => $order->user_id,
                    'note' => 'Order '.$order->order_number,
                ]);
            }
        });
    }

    public function restoreForOrder(Order $order): void
    {
        DB::transaction(function () use ($order) {
            foreach ($order->items as $item) {
                $product = Product::lockForUpdate()->find($item->product_id);
                if (! $product) {
                    continue;
                }
                $variant = $item->product_variant_id
                    ? ProductVariant::lockForUpdate()->find($item->product_variant_id)
                    : null;

                $qty = $item->qty;
                if ($variant) {
                    $variant->stock += $qty;
                    $variant->save();
                } else {
                    $product->stock += $qty;
                    $product->save();
                }

                StockMovement::create([
                    'product_id' => $product->id,
                    'product_variant_id' => $variant?->id,
                    'type' => StockMovementType::In->value,
                    'qty' => $qty,
                    'reference_type' => Order::class,
                    'reference_id' => $order->id,
                    'user_id' => $order->user_id,
                    'note' => 'Cancel '.$order->order_number,
                ]);
            }
        });
    }
}
