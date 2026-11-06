<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\CartItem;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Services\CartService;
use Illuminate\Http\Request;

class CartController extends Controller
{
    public function __construct(protected CartService $cartService) {}

    public function index(Request $request)
    {
        $cart = $this->cartService->getCart($request->user());
        $cart->load(['items.product.media', 'items.variant']);

        return response()->json([
            'cart' => $cart,
            'total' => $cart->total(),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'product_id' => ['required', 'exists:products,id'],
            'product_variant_id' => ['nullable', 'exists:product_variants,id'],
            'qty' => ['nullable', 'integer', 'min:1'],
        ]);

        $product = Product::findOrFail($data['product_id']);
        $variant = ! empty($data['product_variant_id'])
            ? ProductVariant::findOrFail($data['product_variant_id'])
            : null;

        $item = $this->cartService->addItem($request->user(), $product, $variant, $data['qty'] ?? 1);

        return response()->json($item->load(['product', 'variant']), 201);
    }

    public function update(Request $request, CartItem $cartItem)
    {
        $data = $request->validate([
            'qty' => ['required', 'integer', 'min:0'],
        ]);

        $this->cartService->updateQty($cartItem, $data['qty']);

        return response()->json(['message' => 'Cart updated.']);
    }

    public function destroy(CartItem $cartItem)
    {
        $this->cartService->remove($cartItem);

        return response()->json(['message' => 'Item removed.']);
    }

    public function clear(Request $request)
    {
        $cart = $this->cartService->getCart($request->user());
        $this->cartService->clear($cart);

        return response()->json(['message' => 'Cart cleared.']);
    }
}
