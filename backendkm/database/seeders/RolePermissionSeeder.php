<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        $resources = ['products', 'categories', 'brands', 'customers', 'coupons', 'users', 'orders', 'stock', 'reports', 'settings'];
        $actions = ['view', 'create', 'update', 'delete'];

        $permissions = [];
        foreach ($resources as $resource) {
            foreach ($actions as $action) {
                $permissions[] = $action.' '.$resource;
            }
        }
        $permissions[] = 'view reports';
        $permissions[] = 'manage settings';

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission, 'guard_name' => 'web']);
        }

        $admin = Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
        $admin->syncPermissions(Permission::all());

        $manager = Role::firstOrCreate(['name' => 'manager', 'guard_name' => 'web']);
        $manager->syncPermissions(Permission::where('name', 'like', 'view%')->get());

        $cashier = Role::firstOrCreate(['name' => 'cashier', 'guard_name' => 'web']);
        $cashier->syncPermissions(['view products', 'view categories', 'view brands', 'view customers', 'view orders', 'create orders', 'view coupons']);

        $customer = Role::firstOrCreate(['name' => 'customer', 'guard_name' => 'web']);
        $customer->syncPermissions(['view products', 'view categories', 'view brands']);
    }
}
