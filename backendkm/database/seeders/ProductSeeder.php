<?php

namespace Database\Seeders;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $categories = Category::all();
        $brands = Brand::all();
        $faker = fake('id_ID');

        for ($i = 1; $i <= 40; $i++) {
            $category = $categories->random();
            $brand = $brands->random();
            $price = $faker->numberBetween(5000, 100000);
            $cost = (int) round($price * 0.7);

            $product = Product::create([
                'category_id' => $category->id,
                'brand_id' => $brand->id,
                'name' => $faker->words(3, true),
                'sku' => 'SKU-'.str_pad((string) $i, 5, '0', STR_PAD_LEFT),
                'description' => $faker->sentence(),
                'price' => $price,
                'cost' => $cost,
                'stock' => $faker->numberBetween(10, 200),
                'min_stock' => 5,
                'unit' => 'pcs',
                'weight' => $faker->randomFloat(3, 0.1, 2),
                'is_active' => true,
                'is_featured' => $faker->boolean(20),
                'published_at' => now(),
            ]);

            // add variants for some products
            if ($i % 5 === 0) {
                foreach (['S', 'M', 'L'] as $size) {
                    ProductVariant::create([
                        'product_id' => $product->id,
                        'name' => 'Size '.$size,
                        'sku' => $product->sku.'-'.$size,
                        'price' => $price + 5000,
                        'cost' => $cost + 3000,
                        'stock' => $faker->numberBetween(5, 50),
                        'attributes' => ['size' => $size],
                        'is_active' => true,
                    ]);
                }
            }
        }
    }
}
