# Kopag Malam — Backend Kasir & Katalog (API Server)

Backend API-only (Laravel 13) untuk sistem kasir (POS) yang terintegrasi dengan website katalog produk. Database MySQL. Payment gateway Midtrans (Snap popup). Menggunakan berbagai paket Spatie.

## Fitur utama
- Auth token (Sanctum) untuk customer & staff.
- Role & permission (Spatie Permission): admin, manager, cashier, customer.
- Katalog produk publik dengan filter/sort/pagination (Spatie QueryBuilder), pencarian, barcode lookup.
- Produk dengan varian (size/warna), stok, media gambar (Spatie MediaLibrary).
- Cart & checkout, order status, pembayaran cash & Midtrans.
- Manajemen stok & riwayat pergerakan.
- Kupon diskon.
- Admin CRUD produk/kategori/brand/customer/kupon/user.
- Laporan penjualan & produk terlaris.
- Settings aplikasi (Spatie Settings).
- Activity log (Spatie Activitylog).
- Seeder data awal.

## Persyaratan
- PHP 8.3+
- Composer
- MySQL 8+
- Node (opsional, untuk asset)

## Setup
```bash
composer install
cp .env.example .env
php artisan key:generate
```

Konfigurasi `.env`:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=kopagmalam
DB_USERNAME=root
DB_PASSWORD=

FRONTEND_URL=http://localhost:3000

MIDTRANS_SERVER_KEY=
MIDTRANS_CLIENT_KEY=
MIDTRANS_IS_PRODUCTION=false
MIDTRANS_NOTIFICATION_URL=http://localhost:8000/api/v1/payments/midtrans/notification
```

Buat database `kopagmalam`, lalu:
```bash
php artisan migrate --force
php artisan db:seed --force
php artisan serve
```

## Akun default (password: `password`)
- admin@kopagmalam.test
- manager@kopagmalam.test
- cashier@kopagmalam.test
- customer@kopagmalam.test

## API
Base URL: `http://localhost:8000/api/v1`

Endpoint utama:
- `POST /auth/register`, `POST /auth/login`, `POST /auth/logout`, `GET /auth/me`
- Katalog publik: `GET /products`, `GET /products/{slug}`, `GET /products/barcode/{barcode}`, `GET /categories`, `GET /brands`
- Cart: `GET /cart`, `POST /cart/items`, `PATCH /cart/items/{id}`, `DELETE /cart/items/{id}`
- Order: `POST /orders`, `GET /orders`, `GET /orders/{id}`, `POST /orders/{id}/cancel`
- Payment: `POST /orders/{id}/pay/midtrans`, `POST /orders/{id}/sync-payment`, `POST /payments/midtrans/notification`
- POS: `POST /pos/scan`
- Admin (role admin/manager): `/admin/*`

Detail route: `php artisan route:list --path=api`.

## Midtrans
- Gunakan Snap (popup) di frontend dengan `snap_token` & `client_key` dari endpoint `pay/midtrans`.
- Set Notification URL di dashboard Midtrans ke `/api/v1/payments/midtrans/notification` atau env `MIDTRANS_NOTIFICATION_URL`.
- Untuk dev, gunakan ngrok untuk expose localhost.

## Struktur folder
- `app/Models` — Eloquent models.
- `app/Services` — OrderService, CartService, StockService, MidtransService.
- `app/Http/Controllers/Api/V1` — controllers.
- `app/Settings` — Spatie settings.
- `database/seeders` — seeder.

## Testing
```bash
php artisan test
```

## Lisensi
MIT.