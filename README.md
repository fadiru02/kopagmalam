# Kopag Malam

Ekosistem aplikasi untuk **Kopag Malam** coffee shop:
- `backendkm` — Laravel 13 API server (POS + katalog)
- `kopagmalam-web` — Next.js web katalog pelanggan (scan QR meja)
- `kopagmalam-app` — Mobile POS & admin (Vite + React + Capacitor)

## Prasyarat
- PHP 8.4+, Composer
- Node.js 20+, npm
- MySQL 8 (Laragon/XAMPP)
- Git

## Struktur Repo
```
kopagmalam/
├── backendkm/        # Laravel API
├── kopagmalam-web/   # Next.js customer web
└── kopagmalam-app/   # Mobile POS (Vite/Capacitor)
```

## 1. Setup Backend (`backendkm`)

```powershell
cd backendkm
composer install
copy .env.example .env
php artisan key:generate
```

Edit `.env`:
```env
DB_DATABASE=kopagmalam
DB_USERNAME=root
DB_PASSWORD=
FRONTEND_URL=http://localhost:3000
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173,http://127.0.0.1:3000,http://127.0.0.1:5173
MIDTRANS_SERVER_KEY=
MIDTRANS_CLIENT_KEY=
MIDTRANS_IS_PRODUCTION=false
```

Buat database `kopagmalam`, lalu:
```powershell
php artisan migrate --force
php artisan db:seed --force
php artisan serve --host=0.0.0.0 --port=8000
```

Health check: `http://localhost:8000/api/v1/health`

## 2. Setup Web Pelanggan (`kopagmalam-web`)

```powershell
cd kopagmalam-web
npm install
```

Buat `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=SB-Mid-client-XXXXX
NEXT_PUBLIC_STORE_NAME="Kopag Malam"
NEXT_PUBLIC_STORE_CODE="POS-01"
NEXT_PUBLIC_TAX_PERCENTAGE=10
```

Untuk akses dari HP (scan QR), gunakan IP LAN:
```env
NEXT_PUBLIC_API_URL=http://<IP-LAN>:8000/api/v1
```

Jalankan:
```powershell
npm run dev -- --hostname 0.0.0.0 --port 3000
```

Akses dari HP: `http://<IP-LAN>:3000`

## 3. Setup Mobile POS (`kopagmalam-app`)

```powershell
cd kopagmalam-app
npm install
copy .env.example .env.local
```

Edit `.env.local`:
```env
VITE_API_URL=http://localhost:8000/api/v1
VITE_APP_ENV=development
VITE_STORE_NAME="Kopag Malam"
VITE_STORE_CODE="POS-JKT-04"
VITE_TAX_PERCENTAGE=0
VITE_PRINTER_MODE=none
```

Jalankan:
```powershell
npm run dev
```

Untuk device fisik, gunakan `VITE_API_URL=http://<IP-LAN>:8000/api/v1`.

## 4. Akses Web via QR Code Meja

Setiap meja memiliki QR unik yang mengarah ke:
```
http://<host>:3000/t/{nomor_meja}
```
Contoh: `http://192.168.55.138:3000/t/4`

Alur:
1. Pelanggan scan QR di meja.
2. Web menyimpan nomor meja (localStorage `kopagmalam.table_number`) dan redirect ke katalog.
3. Saat checkout, `table_number` dikirim ke `POST /api/v1/orders`.
4. Backend menyimpan `table_number` pada order; mobile antrean dapat menampilkan meja.

Generate QR (dev):
```powershell
npx qrcode "http://192.168.55.138:3000/t/1" -o public\qr\meja-1.png
```

## 5. Akun Default (password: `password`)
- admin@kopagmalam.test
- manager@kopagmalam.test
- cashier@kopagmalam.test
- customer@kopagmalam.test

## 6. Perintah Penting

Backend:
```powershell
php artisan migrate --force
php artisan db:seed --force
php artisan test
```

Web:
```powershell
npm run build
```

Mobile:
```powershell
npm run typecheck
npm run lint
npm run test
npm run build
```

## Catatan
- Untuk pembayaran Midtrans di device, gunakan HTTPS (tunnel/ngrok) jika diperlukan.
- Jangan commit `.env`, keystore, atau `dist/`.