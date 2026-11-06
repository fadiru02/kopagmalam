<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $products = QueryBuilder::for(Product::class)
            ->allowedFilters(
                AllowedFilter::exact('category_id'),
                AllowedFilter::exact('brand_id'),
                AllowedFilter::exact('is_featured'),
                AllowedFilter::exact('is_active'),
                AllowedFilter::scope('search', 'search'),
            )
            ->allowedSorts('name', 'price', 'stock', 'created_at')
            ->allowedIncludes('category', 'brand', 'variants')
            ->with(['category', 'brand', 'media'])
            ->withCount('variants')
            ->defaultSort('-created_at')
            ->paginate($request->integer('per_page', 15))
            ->appends($request->query());

        return response()->json($products);
    }

    public function show(string $slugOrId)
    {
        $product = Product::with(['category', 'brand', 'variants', 'media'])
            ->where('slug', $slugOrId)
            ->orWhere('id', $slugOrId)
            ->firstOrFail();

        return response()->json($product);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'category_id' => ['nullable', 'exists:categories,id'],
            'brand_id' => ['nullable', 'exists:brands,id'],
            'name' => ['required', 'string', 'max:255'],
            'sku' => ['required', 'string', 'max:100', 'unique:products,sku'],
            'description' => ['nullable', 'string'],
            'price' => ['required', 'numeric', 'min:0'],
            'cost' => ['nullable', 'numeric', 'min:0'],
            'stock' => ['nullable', 'integer', 'min:0'],
            'min_stock' => ['nullable', 'integer', 'min:0'],
            'unit' => ['nullable', 'string', 'max:20'],
            'weight' => ['nullable', 'numeric', 'min:0'],
            'is_active' => ['nullable', 'boolean'],
            'is_featured' => ['nullable', 'boolean'],
            'published_at' => ['nullable', 'date'],
            'images' => ['nullable', 'array'],
            'images.*' => ['file', 'image', 'max:4096'],
        ]);

        $product = Product::create($data);

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $product->addMedia($image)->toMediaCollection('images');
            }
        }

        return response()->json($product->load(['category', 'brand', 'media']), 201);
    }

    public function update(Request $request, Product $product)
    {
        $data = $request->validate([
            'category_id' => ['nullable', 'exists:categories,id'],
            'brand_id' => ['nullable', 'exists:brands,id'],
            'name' => ['sometimes', 'string', 'max:255'],
            'sku' => ['sometimes', 'string', 'max:100', 'unique:products,sku,'.$product->id],
            'description' => ['nullable', 'string'],
            'price' => ['nullable', 'numeric', 'min:0'],
            'cost' => ['nullable', 'numeric', 'min:0'],
            'stock' => ['nullable', 'integer', 'min:0'],
            'min_stock' => ['nullable', 'integer', 'min:0'],
            'unit' => ['nullable', 'string', 'max:20'],
            'weight' => ['nullable', 'numeric', 'min:0'],
            'is_active' => ['nullable', 'boolean'],
            'is_featured' => ['nullable', 'boolean'],
            'published_at' => ['nullable', 'date'],
            'images' => ['nullable', 'array'],
            'images.*' => ['file', 'image', 'max:4096'],
        ]);

        $product->update($data);

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $product->addMedia($image)->toMediaCollection('images');
            }
        }

        return response()->json($product->load(['category', 'brand', 'media', 'variants']));
    }

    public function destroy(Product $product)
    {
        $product->delete();

        return response()->json(['message' => 'Product deleted.']);
    }
}
