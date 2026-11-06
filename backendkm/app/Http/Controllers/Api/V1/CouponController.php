<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Coupon;
use Illuminate\Http\Request;
use Spatie\QueryBuilder\QueryBuilder;

class CouponController extends Controller
{
    public function index(Request $request)
    {
        $coupons = QueryBuilder::for(Coupon::class)
            ->allowedFilters('code', 'is_active')
            ->allowedSorts('', '')
            ->defaultSort('-created_at')
            ->paginate($request->integer('per_page', 15));

        return response()->json($coupons);
    }

    public function show(Coupon $coupon)
    {
        return response()->json($coupon);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'code' => ['required', 'string', 'max:50', 'unique:coupons,code'],
            'type' => ['required', 'string', 'in:percent,fixed'],
            'value' => ['required', 'numeric', 'min:0'],
            'min_purchase' => ['nullable', 'numeric', 'min:0'],
            'max_discount' => ['nullable', 'numeric', 'min:0'],
            'usage_limit' => ['nullable', 'integer', 'min:1'],
            'starts_at' => ['nullable', 'date'],
            'expires_at' => ['nullable', 'date'],
            'is_active' => ['nullable', 'boolean'],
        ]);

        $coupon = Coupon::create($data);

        return response()->json($coupon, 201);
    }

    public function update(Request $request, Coupon $coupon)
    {
        $data = $request->validate([
            'code' => ['sometimes', 'string', 'max:50', 'unique:coupons,code,'.$coupon->id],
            'type' => ['sometimes', 'string', 'in:percent,fixed'],
            'value' => ['nullable', 'numeric', 'min:0'],
            'min_purchase' => ['nullable', 'numeric', 'min:0'],
            'max_discount' => ['nullable', 'numeric', 'min:0'],
            'usage_limit' => ['nullable', 'integer', 'min:1'],
            'starts_at' => ['nullable', 'date'],
            'expires_at' => ['nullable', 'date'],
            'is_active' => ['nullable', 'boolean'],
        ]);

        $coupon->update($data);

        return response()->json($coupon);
    }

    public function destroy(Coupon $coupon)
    {
        $coupon->delete();

        return response()->json(['message' => 'Coupon deleted.']);
    }

    public function validate(Request $request)
    {
        $data = $request->validate([
            'code' => ['required', 'string'],
            'subtotal' => ['required', 'numeric', 'min:0'],
        ]);

        $coupon = Coupon::where('code', $data['code'])->first();

        if (! $coupon || ! $coupon->isValid((float) $data['subtotal'])) {
            return response()->json(['valid' => false, 'message' => 'Coupon invalid or expired.'], 422);
        }

        return response()->json([
            'valid' => true,
            'coupon' => $coupon,
            'discount' => $coupon->discountFor((float) $data['subtotal']),
        ]);
    }
}
