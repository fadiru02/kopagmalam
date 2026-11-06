# Plan: Backend Kasir Coffee Shop (UMKM) + Katalog Menu (Laravel API Server)

## Tujuan
Backend API-only (Laravel 13) untuk kasir coffee shop (UMKM) dengan berbagai menu, terintegrasi dengan website katalog menu. Database MySQL. Payment gateway Midtrans (Snap popup). Menggunakan berbagai paket Spatie.

## Keputusan arsitektur
- DB name: `kopagmalam` (user root, password kosong di dev).
- API prefix: `/api/v1`.
- Auth: Laravel Sanctum (token). Role: Spatie Permission.
- Katalog publik: endpoint tanpa auth (browse/filter menu).
- Produk = menu (coffee, non-coffee, food, snack, dessert). Tanpa barcode.
- Midtrans: Sandbox default, Snap popup.

## Stack & paket
Core: laravel/sanctum, spatie/laravel-permission, activitylog, medialibrary, query-builder, data, sluggable, settings, model-states, midtrans/midtrans-php, maatwebsite/excel, barryvdh/laravel-dompdf, laravel/boost (dev).

## Skema database
users (extend), categories, brands, products (menu), product_variants, stock_movements, customers, coupons, carts/cart_items, orders, order_items, payments, settings (spatie), activity_log, media, permission tables.

## Endpoint API
Public (katalog):
- GET /products, GET /products/{slug}
- GET /categories, GET /brands

Auth:
- POST /auth/register, /auth/login, /auth/logout, GET /auth/me
- Cart: GET/POST/PATCH/DELETE /cart...
- Orders: GET/POST /orders, GET /orders/{id}, POST /orders/{id}/cancel
- Payment: POST /orders/{id}/pay/midtrans, POST /orders/{id}/sync-payment
- POST /payments/midtrans/notification (webhook)

Staff (cashier/admin/manager):
- POST /stock/adjust, GET /stock/movements, PATCH /orders/{id}/status

Admin (admin/manager):
- CRUD /admin/products, categories, brands, customers, coupons, users
- Reports: /admin/reports/sales, /top-products, /daily
- Settings: /admin/settings

## Spatie usage map
- Permission: roles admin, manager, cashier, customer.
- Activitylog: audit perubahan.
- MediaLibrary: gambar menu.
- QueryBuilder: filter/sort/include.
- Data: DTO response.
- Sluggable: product/category/brand.
- Settings: GeneralSettings, PaymentSettings.
- ModelStates: order/payment status.

## Seeders
RolePermissionSeeder, UserSeeder, CategorySeeder, BrandSeeder, ProductSeeder, CouponSeeder, SettingSeeder. Default password: password. Kategori coffee shop: Coffee, Non-Coffee, Food, Snack, Dessert.

## Milestone
M1 setup & infra, M2 auth & roles, M3 katalog domain, M4 cart & order, M5 payment, M6 admin & reports, M7 seeders, M8 docs & tests.

## Env vars
DB_DATABASE=kopagmalam
FRONTEND_URL=http://localhost:3000
MIDTRANS_SERVER_KEY=
MIDTRANS_CLIENT_KEY=
MIDTRANS_IS_PRODUCTION=false
MIDTRANS_NOTIFICATION_URL=http://localhost:8000/api/v1/payments/midtrans/notification

## Catatan
Tidak ada barcode. Scan tidak digunakan; katalog diakses langsung via web.