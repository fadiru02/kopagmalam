<?php

namespace App\Http\Controllers\Api\V1;

use App\Enums\StockMovementType;
use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\StockMovement;
use App\Services\StockService;
use Illuminate\Http\Request;

class StockController extends Controller
{
    public function __construct(protected StockService $stockService) {}

    public function movements(Request $request)
    {
        $movements = StockMovement::with(['product', 'variant', 'user'])
            ->when($request->product_id, fn ($q, $v) => $q->where('product_id', $v))
            ->latest()
            ->paginate($request->integer('per_page', 15));

        return response()->json($movements);
    }

    public function adjust(Request $request)
    {
        $data = $request->validate([
            'product_id' => ['required', 'exists:products,id'],
            'product_variant_id' => ['nullable', 'exists:product_variants,id'],
            'type' => ['required', 'string', 'in:in,out,adjustment'],
            'qty' => ['required', 'integer'],
            'note' => ['nullable', 'string'],
        ]);

        $product = Product::findOrFail($data['product_id']);
        $variant = ! empty($data['product_variant_id'])
            ? ProductVariant::findOrFail($data['product_variant_id'])
            : null;

        $movement = $this->stockService->adjust(
            $product,
            $variant,
            $data['qty'],
            StockMovementType::from($data['type']),
            $data['note'] ?? null,
            $request->user(),
        );

        return response()->json($movement->load(['product', 'variant']), 201);
    }
}
