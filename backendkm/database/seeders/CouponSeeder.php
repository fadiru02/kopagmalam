<?php

namespace Database\Seeders;

use App\Models\Coupon;
use Illuminate\Database\Seeder;

class CouponSeeder extends Seeder
{
    public function run(): void
    {
        Coupon::firstOrCreate(['code' => 'DISKON10'], [
            'type' => 'percent',
            'value' => 10,
            'min_purchase' => 50000,
            'max_discount' => 20000,
            'usage_limit' => 100,
            'is_active' => true,
        ]);

        Coupon::firstOrCreate(['code' => 'HEMAT5000'], [
            'type' => 'fixed',
            'value' => 5000,
            'min_purchase' => 30000,
            'is_active' => true,
        ]);
    }
}
