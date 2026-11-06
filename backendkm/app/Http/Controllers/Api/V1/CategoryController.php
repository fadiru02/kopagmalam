<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Spatie\QueryBuilder\QueryBuilder;

class CategoryController extends Controller
{
    public function index(Request $request)
    {
        $categories = QueryBuilder::for(Category::class)
            ->allowedFilters('parent_id', 'is_active')
            ->allowedSorts('', '', '')
            ->allowedIncludes('children', 'parent', 'products')
            ->defaultSort('sort_order')
            ->get();

        return response()->json($categories);
    }

    public function show(Category $category)
    {
        return response()->json($category->load(['parent', 'children', 'products']));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'parent_id' => ['nullable', 'exists:categories,id'],
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'image' => ['nullable', 'string'],
            'sort_order' => ['nullable', 'integer'],
            'is_active' => ['nullable', 'boolean'],
        ]);

        $category = Category::create($data);

        return response()->json($category, 201);
    }

    public function update(Request $request, Category $category)
    {
        $data = $request->validate([
            'parent_id' => ['nullable', 'exists:categories,id'],
            'name' => ['sometimes', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'image' => ['nullable', 'string'],
            'sort_order' => ['nullable', 'integer'],
            'is_active' => ['nullable', 'boolean'],
        ]);

        $category->update($data);

        return response()->json($category);
    }

    public function destroy(Category $category)
    {
        $category->delete();

        return response()->json(['message' => 'Category deleted.']);
    }
}
