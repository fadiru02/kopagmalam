<?php

use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\BrandController;
use App\Http\Controllers\Api\V1\CartController;
use App\Http\Controllers\Api\V1\CategoryController;
use App\Http\Controllers\Api\V1\CouponController;
use App\Http\Controllers\Api\V1\CustomerController;
use App\Http\Controllers\Api\V1\OrderController;
use App\Http\Controllers\Api\V1\PaymentController;
use App\Http\Controllers\Api\V1\ProductController;
use App\Http\Controllers\Api\V1\ReportController;
use App\Http\Controllers\Api\V1\SettingController;
use App\Http\Controllers\Api\V1\StockController;
use App\Http\Controllers\Api\V1\UserController;
use Illuminate\Support\Facades\Route;

Route::get('/health', fn () => response()->json(['status' => 'ok', 'version' => 'v1']));

// Auth
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

// Public catalog
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{product:slug}', [ProductController::class, 'show']);
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{category}', [CategoryController::class, 'show']);
Route::get('/brands', [BrandController::class, 'index']);
Route::get('/brands/{brand}', [BrandController::class, 'show']);

// Midtrans webhook (public, verified by signature)
Route::post('/payments/midtrans/notification', [PaymentController::class, 'notification']);

// Authenticated
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);

    // Cart
    Route::get('/cart', [CartController::class, 'index']);
    Route::post('/cart/items', [CartController::class, 'store']);
    Route::patch('/cart/items/{cartItem}', [CartController::class, 'update']);
    Route::delete('/cart/items/{cartItem}', [CartController::class, 'destroy']);
    Route::delete('/cart', [CartController::class, 'clear']);

    // Orders
    Route::get('/orders', [OrderController::class, 'index']);
    Route::post('/orders', [OrderController::class, 'store']);
    Route::get('/orders/{order}', [OrderController::class, 'show']);
    Route::post('/orders/{order}/cancel', [OrderController::class, 'cancel']);
    Route::post('/orders/{order}/pay/midtrans', [PaymentController::class, 'createMidtrans']);
    Route::post('/orders/{order}/sync-payment', [PaymentController::class, 'sync']);

    // Coupons
    Route::post('/coupons/validate', [CouponController::class, 'validate']);

    // POS (cashier/staff)
    Route::middleware('role:cashier|admin|manager')->group(function () {
        Route::post('/stock/adjust', [StockController::class, 'adjust']);
        Route::get('/stock/movements', [StockController::class, 'movements']);
        Route::patch('/orders/{order}/status', [OrderController::class, 'updateStatus']);
    });

    // Admin
    Route::middleware('role:admin|manager')->prefix('admin')->group(function () {
        // Products
        Route::apiResource('products', ProductController::class)->except(['index', 'show']);
        Route::post('products/{product}/media', [ProductController::class, 'update']); // reuse upload via update

        // Categories & Brands
        Route::apiResource('categories', CategoryController::class)->except(['index', 'show']);
        Route::apiResource('brands', BrandController::class)->except(['index', 'show']);

        // Customers
        Route::apiResource('customers', CustomerController::class);

        // Coupons
        Route::apiResource('coupons', CouponController::class)->except(['show']);

        // Users
        Route::get('users/roles', [UserController::class, 'roles']);
        Route::apiResource('users', UserController::class);

        // Reports
        Route::get('reports/sales', [ReportController::class, 'sales']);
        Route::get('reports/top-products', [ReportController::class, 'topProducts']);
        Route::get('reports/daily', [ReportController::class, 'daily']);

        // Settings
        Route::get('settings', [SettingController::class, 'show']);
        Route::put('settings/general', [SettingController::class, 'updateGeneral']);
        Route::put('settings/payment', [SettingController::class, 'updatePayment']);
    });
});
