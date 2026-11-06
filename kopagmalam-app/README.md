# Kopag Malam POS (Mobile)

Aplikasi mobile staff untuk **Kopag Malam**: kasir, antrean seduh, menu/stok, laporan, dan pengaturan. Dibangun dengan Vite + React + TypeScript, UI shadcn/ui (Radix), dan dibungkus Capacitor untuk Android.

Web katalog pelanggan berada di repo terpisah: `../kopagmalam-web`.

## Stack

- Vite 8 + React 19 + TypeScript 7
- Tailwind CSS 4 + shadcn/ui (`radix-nova`)
- React Router 8
- TanStack Query 5 + Zustand 5
- React Hook Form + Zod
- Capacitor 8 (Android)
- Vitest + Testing Library
- oxlint

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Sesuaikan `VITE_API_URL`:

| Konteks | Nilai |
|---|---|
| Browser dev | `http://localhost:8000/api/v1` |
| Android emulator | `http://10.0.2.2:8000/api/v1` |
| Device fisik | `http://<IP-LAN>:8000/api/v1` |
| Produksi | `https://<domain>/api/v1` |

Backend lokal:

```bash
php artisan serve --host=0.0.0.0 --port=8000
```

Akun staff hasil seeder: `cashier@kopagmalam.test`, `admin@kopagmalam.test`, `manager@kopagmalam.test` — password `password`.

## Perintah

```bash
npm run dev            # dev server http://localhost:5173
npm run build          # typecheck + build ke dist/
npm run typecheck
npm run lint
npm run test
npm run test:watch
npm run preview

npm run cap:sync       # build + cap sync
npm run cap:android    # buka Android Studio
npm run android        # build + cap run android
```

Build native pertama kali:

```bash
npm run build
npx cap sync
npm run cap:android
```

`dist/` dan `android/app/src/main/assets/public/` adalah hasil generate — jangan diedit manual.

## Struktur

```text
src/
  app/          # router, providers, guards, root layout
  components/   # ui (shadcn) + shared (shell, nav, header, kpi, empty state)
  features/     # auth, overview, pos, queue, menu, inventory, reports, settings
  lib/          # api, native, query, stores, format
  test/         # setup Vitest
```

## Status

- ✅ F0 Fondasi: Vite, Tailwind, shadcn, router, Capacitor Android, test.
- ✅ F1 Auth & shell: login, guard sesi, bottom nav, side rail, settings.
- ⏳ F2 Kasir: scan, cart, pembayaran tunai, struk.
- ⏳ F3 Antrean/KDS, F4 Menu & stok, F5 Laporan, F6 Native.

Lihat `AGENTS.md` untuk konvensi dan kontrak API, serta `DESIGN.md` untuk design system dan spesifikasi layar.
