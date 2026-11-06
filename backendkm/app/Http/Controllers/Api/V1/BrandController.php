<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use Illuminate\Http\Request;
use Spatie\QueryBuilder\QueryBuilder;

class BrandController extends Controller
{
    public function index(Request $request)
    {
        $brands = QueryBuilder::for(Brand::class)
            ->allowedFilters('is_active')
            ->allowedSorts('', '')
            ->defaultSort('name')
            ->get();

        return response()->json($brands);
    }

    public function show(Brand $brand)
    {
        return response()->json($brand->load('products'));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'logo' => ['nullable', 'string'],
            'is_active' => ['nullable', 'boolean'],
        ]);

        $brand = Brand::create($data);

        return response()->json($brand, 201);
    }

    public function update(Request $request, Brand $brand)
    {
        $data = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'logo' => ['nullable', 'string'],
            'is_active' => ['nullable', 'boolean'],
        ]);

        $brand->update($data);

        return response()->json($brand);
    }

    public function destroy(Brand $brand)
    {
        $brand->delete();

        return response()->json(['message' => 'Brand deleted.']);
    }
}
