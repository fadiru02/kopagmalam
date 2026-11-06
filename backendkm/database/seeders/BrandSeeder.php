<?php

namespace Database\Seeders;

use App\Models\Brand;
use Illuminate\Database\Seeder;

class BrandSeeder extends Seeder
{
    public function run(): void
    {
        foreach (['Kopag', 'Indofood', 'Unilever', 'Mayora'] as $name) {
            Brand::firstOrCreate(['name' => $name], ['is_active' => true]);
        }
    }
}
