<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Coffee', 'sort_order' => 1],
            ['name' => 'Non-Coffee', 'sort_order' => 2],
            ['name' => 'Food', 'sort_order' => 3],
            ['name' => 'Snack', 'sort_order' => 4],
            ['name' => 'Dessert', 'sort_order' => 5],
        ];

        foreach ($categories as $cat) {
            Category::firstOrCreate(['name' => $cat['name']], $cat + ['is_active' => true]);
        }
    }
}
