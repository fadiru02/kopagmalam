<?php

namespace App\Services;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class CartService
{
    public function getCart(User $user): Cart
    {
        return Cart::firstOrCreate(['user_id' => $user->id]);
    }

    public function addItem(User $user, Product $product, ?ProductVariant $variant, int $qty = 1): CartItem
    {
        return DB::transaction(function () use ($user, $product, $variant, $qty) {
            $cart = $this->getCart($user);
            $price = $variant ? $variant->effectivePrice() : (float) $product->price;

            $item = CartItem::where('cart_id', $cart->id)
                ->where('product_id', $product->id)
                ->where('product_variant_id', $variant?->id)
                ->first();

            if ($item) {
                $item->qty += $qty;
                $item->price = $price;
                $item->save();

                return $item;
            }

            return CartItem::create([
                'cart_id' => $cart->id,
                'product_id' => $product->id,
                'product_variant_id' => $variant?->id,
                'qty' => $qty,
                'price' => $price,
            ]);
        });
    }

    public function updateQty(CartItem $item, int $qty): CartItem
    {
        if ($qty <= 0) {
            $item->delete();

            return $item;
        }
        $item->qty = $qty;
        $item->save();

        return $item;
    }

    public function remove(CartItem $item): void
    {
        $item->delete();
    }

    public function clear(Cart $cart): void
    {
        $cart->items()->delete();
    }
}
