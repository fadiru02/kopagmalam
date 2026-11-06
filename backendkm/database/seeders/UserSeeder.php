<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::firstOrCreate(['email' => 'admin@kopagmalam.test'], [
            'name' => 'Admin',
            'password' => Hash::make('password'),
            'phone' => '0811111111',
            'is_active' => true,
        ]);
        $admin->syncRoles(['admin']);

        $manager = User::firstOrCreate(['email' => 'manager@kopagmalam.test'], [
            'name' => 'Manager',
            'password' => Hash::make('password'),
            'phone' => '0822222222',
            'is_active' => true,
        ]);
        $manager->syncRoles(['manager']);

        $cashier = User::firstOrCreate(['email' => 'cashier@kopagmalam.test'], [
            'name' => 'Cashier',
            'password' => Hash::make('password'),
            'phone' => '0833333333',
            'is_active' => true,
        ]);
        $cashier->syncRoles(['cashier']);

        $customer = User::firstOrCreate(['email' => 'customer@kopagmalam.test'], [
            'name' => 'Customer Demo',
            'password' => Hash::make('password'),
            'phone' => '0844444444',
            'is_active' => true,
        ]);
        $customer->syncRoles(['customer']);
    }
}
