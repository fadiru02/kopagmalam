# AGENTS.md — Kopag Malam Mobile POS

> Aplikasi mobile staff (kasir, admin, manager) untuk **Kopag Malam**.
> Web katalog pelanggan berada di repo terpisah: `../kopagmalam-web` (Next.js).
> Dokumen ini adalah konteks utama untuk agent yang bekerja di repo ini.

---

## 1. Overview

Repo ini berisi aplikasi **POS & admin mobile**:

- Kasir/barista: susun pesanan, scan barcode, pembayaran tunai, antrean seduh, koreksi stok.
- Admin/manager: kelola menu, stok, laporan penjualan, pengaturan.
- **Bukan** aplikasi pelanggan. Checkout Midtrans pelanggan tetap di web.

Target perangkat: tablet/HP Android (utama), iOS menyusul. Aplikasi berjalan sebagai web app saat development dan dibungkus **Capacitor** untuk build native.

---

## 2. Hubungan dengan web

| | Mobile (repo ini) | Web (`../kopagmalam-web`) |
|---|---|---|
| Framework | Vite + React SPA | Next.js App Router |
| UI | shadcn/ui + Radix | Radix Themes |
| Auth | Bearer token + secure storage | httpOnly cookie via BFF |
| Fokus | POS, antrean, stok, laporan | Katalog, cart, checkout Midtrans |
| Rendering | client-only | SSR/ISR |

Tidak ada package bersama. Kontrak API dijaga manual; jika berubah, perbarui `src/lib/api/types.ts` dan dokumen ini.

---

## 3. Stack & versi

| Area | Teknologi |
|---|---|
| Build | Vite 8.3, TypeScript 7 (strict, `erasableSyntaxOnly`) |
| UI | React 19.3, Tailwind CSS 4.3, shadcn/ui (`radix-nova`, `radix-ui`), lucide-react, sonner |
| Routing | React Router 8.5 (`createBrowserRouter`) |
| Data | TanStack Query 5.105 |
| State UI | Zustand 5 |
| Form | react-hook-form 7 + Zod 4 |
| Tanggal | date-fns (timezone `Asia/Jakarta`) |
| Grafik | Recharts 3 |
| Native | Capacitor 8.6 + Android platform |
| Test | Vitest 5 + Testing Library |
| Lint | oxlint |

Dependency baru harus disetujui. Jangan mengganti library inti tanpa alasan kuat.

---

## 4. Perintah

```bash
npm install
npm run dev            # Vite dev server (http://localhost:5173)
npm run build          # tsc -b && vite build → dist/
npm run typecheck      # tsc -b
npm run lint           # oxlint
npm run test           # vitest run
npm run test:watch
npm run preview

npm run cap:sync       # build + cap sync
npm run cap:android    # buka Android Studio
npm run android        # build + cap run android
```

Backend lokal:

```bash
php artisan serve --host=0.0.0.0 --port=8000
```

Catatan:

- `dist/` dan `android/app/src/main/assets/public/` adalah hasil generate. Jangan diedit manual.
- Setelah mengubah kode web, jalankan `npm run cap:sync` sebelum build native.
- Android Studio/SDK diperlukan untuk `cap:android` dan `android`.

---

## 5. Struktur

```
src/
  main.tsx                    # entry, render router, bootstrap native
  index.css                   # Tailwind + token brand + shadcn variables
  app/
    router.tsx                # definisi route
    root-layout.tsx           # providers + Outlet
    providers.tsx             # QueryClient, Toaster, hydrate auth
    guards.tsx                # RequireAuth
  components/
    ui/                       # komponen shadcn (generated)
    shared/                   # AppShell, BottomNav, SideRail, PageHeader, KpiCard, EmptyState
  features/
    auth/pages/
    overview/pages/
    pos/pages/
    queue/pages/
    menu/pages/
    inventory/pages/
    reports/pages/
    settings/pages/
    shared/pages/
  lib/
    api/                      # client, endpoints, types
    native/                   # bootstrap, secure-storage
    query/                    # client, keys
    stores/                   # Zustand auth
    format.ts                 # uang, tanggal, nomor order
  test/                       # setup Vitest
```

Konvensi:

- Komponen `PascalCase.tsx`, file halaman `*-page.tsx`.
- Hook `use-*.ts`, util `kebab-case.ts`.
- Import lintas domain lewat `@/components/shared` atau `@/lib`.
- Jangan membuat folder baru di luar struktur ini tanpa alasan.

---

## 6. Environment

Salin `.env.example` → `.env.local`:

```env
VITE_API_URL=http://10.0.2.2:8000/api/v1
VITE_APP_ENV=development
VITE_STORE_NAME="Kopag Malam"
VITE_STORE_CODE="POS-JKT-04"
VITE_TAX_PERCENTAGE=0
VITE_PRINTER_MODE=none
```

| Konteks | Nilai `VITE_API_URL` |
|---|---|
| Browser dev | `http://localhost:8000/api/v1` |
| Android emulator | `http://10.0.2.2:8000/api/v1` |
| Device fisik | `http://<IP-LAN>:8000/api/v1` |
| Produksi | `https://<domain>/api/v1` |

Semua `VITE_*` ter-bundle ke aplikasi. **Jangan** menaruh server key, secret, atau token permanen di sini.

---

## 7. Kontrak API

Base: `VITE_API_URL`. Auth: `Authorization: Bearer <token>`.

| Method | Path | Role | Kegunaan |
|---|---|---|---|
| POST | `/auth/login` | staff | `{ user, token }` |
| GET | `/auth/me` | staff | Validasi sesi |
| POST | `/auth/logout` | staff | Hapus token aktif |
| GET | `/orders` | cashier/admin/manager | Antrean, KPI, riwayat |
| GET | `/orders/{id}` | auth | Detail order |
| POST | `/orders` | auth | Order tunai (`pay_now: true`) |
| POST | `/orders/{id}/cancel` | auth | Void/cancel |
| PATCH | `/orders/{id}/status` | cashier/admin/manager | `processing`, `completed` |
| GET | `/cart` | auth | Cart kasir |
| POST | `/cart/items` | auth | Tambah item |
| PATCH | `/cart/items/{id}` | auth | Ubah qty |
| DELETE | `/cart/items/{id}` | auth | Hapus item |
| DELETE | `/cart` | auth | Kosongkan cart |
| POST | `/stock/adjust` | cashier/admin/manager | Koreksi stok |
| GET | `/stock/movements` | cashier/admin/manager | Riwayat stok |
| GET | `/products` | publik | Produk (`filter[is_active]=1`) |
| GET | `/products/{slug}` | publik | Detail produk (slug) |
| GET | `/admin/products` | admin/manager | Kelola menu |
| PUT | `/admin/products/{id}` | admin/manager | Ubah produk |
| GET | `/admin/reports/sales` | admin/manager | Ringkasan |
| GET | `/admin/reports/daily` | admin/manager | Tren harian |
| GET | `/admin/reports/top-products` | admin/manager | Menu terlaris |
| GET | `/admin/settings` | admin/manager | Setting toko |

### Bentuk respons

- Login: `{ user: { id, name, email, phone, roles: [{ id, name }] }, token }`.
- Paginator: `{ data, current_page, last_page, per_page, total }`.
- Order: `order_number`, `status`, `payment_status`, `payment_method`, `subtotal`, `discount_total`, `tax_total`, `total`, `paid_amount`, `change_amount`, `items[]`, `payments[]`.
- Cart: `{ cart: { items[] }, total }`.
- Error 422: `{ message, errors: { field: [pesan] } }`.

### Status

- `order.status`: `pending`, `paid`, `processing`, `completed`, `cancelled`, `refunded`.
- `payment_status`: `unpaid`, `paid`, `failed`, `refunded`.
- `payment_method`: `cash`, `midtrans`, atau `null`.

Gunakan helper di `src/lib/api/client.ts` (`apiRequest`, `buildQuery`, `ApiError`) dan endpoint di `src/lib/api/endpoints.ts`. Jangan menulis URL literal di komponen.

---

## 8. Auth & role

- Login memanggil `POST /auth/login`, lalu `setSession(token, user)`.
- Token disimpan lewat `src/lib/native/secure-storage.ts` (`@aparajita/capacitor-secure-storage`). **Jangan** memakai `localStorage` langsung.
- Saat app dibuka, `hydrate()` membaca sesi. Status: `loading` → `authenticated` / `guest`.
- `RequireAuth` mengarahkan ke `/login` dengan `state.from`.
- Role diizinkan: `cashier`, `admin`, `manager`. Tolak `customer`.
- Helper: `hasRole`, `isStaff`, `canManage`.
- 401 → logout + kembali ke login. 403 → tampilkan pesan akses, jangan logout.

---

## 9. State & data

- Server state hanya TanStack Query. Query key di `src/lib/query/keys.ts`.
- Zustand hanya untuk sesi user dan state UI.
- Mutasi wajib invalidate key terkait.
- Polling antrean: `refetchInterval: 10_000`, `refetchIntervalInBackground: false`.
- Optimistic update hanya untuk qty cart; rollback saat gagal.
- Total akhir selalu dari server. Kembalian boleh dipreview di client, angka final dari `change_amount`.

---

## 10. Format uang & tanggal

- API mengirim decimal string (`"15000.00"`). Gunakan `parseMoney` sebelum menghitung.
- Tampilkan dengan `formatCurrency` → `Rp 156.000`.
- Tanggal/jam: `formatDateTime` (`Asia/Jakarta`).
- Nomor order: `formatOrderNumber` (suffix 4 digit) + font mono.
- Nominal memakai `tabular-nums`.

---

## 11. Capacitor

Konfigurasi di `capacitor.config.ts`:

- `appId: id.kopagmalam.pos`
- `appName: Kopag Malam POS`
- `webDir: dist`
- `server.androidScheme: https`
- Splash screen tidak auto-hide; disembunyikan di `src/lib/native/bootstrap.ts`.
- Status bar dark content di background krem.
- Keyboard `resize: body`.

Alur build:

```bash
npm run build
npx cap sync
npm run cap:android
```

### Permission Android

Sudah dideklarasikan di `android/app/src/main/AndroidManifest.xml`:

- `INTERNET`, `ACCESS_NETWORK_STATE`
- `CAMERA`
- `BLUETOOTH_SCAN` (`neverForLocation`), `BLUETOOTH_CONNECT`
- `uses-feature camera` dengan `required=false`

Minta izin saat fitur dipakai, bukan saat app dibuka. Tangani penolakan dengan input manual.

### CORS backend

Tambahkan origin Capacitor di backend:

```env
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000,capacitor://localhost,http://localhost,https://localhost
```

Jika CORS bermasalah di device, gunakan `CapacitorHttp` sebagai fallback terpusat di `src/lib/api/client.ts`.

### Modul native

| File | Status | Fungsi |
|---|---|---|
| `lib/native/bootstrap.ts` | ada | Status bar, splash screen |
| `lib/native/secure-storage.ts` | ada | Simpan token & user |
| `lib/native/scanner.ts` | belum | Barcode scanner |
| `lib/native/printer.ts` | belum | ESC/POS |
| `lib/native/network.ts` | belum | Deteksi online |
| `lib/native/keep-awake.ts` | belum | Layar tetap menyala |

Jangan memanggil plugin Capacitor langsung dari komponen; bungkus di `lib/native/*` dengan fallback web.

---

## 12. Offline

Rencana (belum diimplementasikan):

- Banner "Mode offline" dari `@capacitor/network`.
- Cache read-only TanStack Query ke IndexedDB.
- **Tidak** membuat order saat offline; risiko stok tidak sinkron.
- Saat online kembali: invalidate query + toast "Tersinkron".
- Cart tetap di server.

---

## 13. Scanner & printer

### Scanner

- **Tidak digunakan untuk produk.** Backend tidak menyediakan barcode/scan; menu dipilih manual dari daftar.
- Modul `lib/native/scanner.ts` tetap "belum" dan opsional untuk kebutuhan lain.

### Printer

- Prioritas: network ESC/POS → Bluetooth LE → share/print OS.
- Verifikasi kompatibilitas plugin dengan Capacitor 8 sebelum menambah dependency.
- Auto-kick drawer hanya jika printer mendukung perintah ESC/POS; bukan blocker MVP.
- Jika printer gagal, gunakan `@capacitor/share` untuk membagikan struk.

---

## 14. Aturan kode

- TypeScript strict; hindari `any`.
- `verbatimModuleSyntax` aktif → gunakan `import type` untuk tipe.
- `erasableSyntaxOnly` aktif → jangan memakai `enum` atau parameter properties.
- Validasi input dengan Zod; validasi respons API kritis.
- Semua request lewat `apiRequest`; tidak ada `fetch` langsung di komponen.
- Jangan menyimpan salinan server state di Zustand.
- Komponen sentuh minimal 44×44 px; icon button wajib `aria-label`.
- Teks UI berbahasa Indonesia; kode berbahasa Inggris.
- Tidak ada `console.log` di produksi.
- Error boundary per route (rencana) + toast untuk kegagalan mutasi.
- Gunakan `cn` dari `@/lib/utils` untuk className kondisional.

---

## 15. Testing & Definition of Done

```bash
npm run typecheck
npm run lint
npm run test
npm run build
npx cap sync
```

- Unit: formatter uang/tanggal, mapper status, guard role, kalkulasi kembalian.
- Component: numpad kasir, quick cash, kartu antrean, stepper stok.
- E2E native (rencana): Maestro — login → scan → bayar tunai → struk.
- Uji di emulator Android + minimal satu device fisik.
- Tidak ada error console; izin kamera ditolak tetap bisa input manual.
- Perubahan UI diuji pada 360×640, 390×844, dan tablet 768×1024.

---

## 16. Guardrails

- Jangan mengubah skema/endpoint backend dari repo ini; usulkan ke repo `backendkm`.
- Jangan menambah dependency tanpa persetujuan.
- Jangan menyimpan token di `localStorage`.
- Jangan menghitung total final di client.
- Jangan memakai `window.print()` sebagai satu-satunya jalur cetak.
- Jangan mengakses `/admin/*` dari akun cashier; sembunyikan UI dan tangani 403.
- Jangan commit `android/local.properties`, keystore, `google-services.json`, atau `dist/`.
- Jangan mengedit `android/app/src/main/assets/public/` secara manual.

---

## 17. Gap backend yang diketahui

| Gap | Dampak | Workaround |
|---|---|---|
| Tidak ada `/pos/summary` | Cashier tidak bisa akses `/admin/reports` | Turunkan KPI dari `GET /orders` di client |
| Tidak ada `queue_number` | Desain tiket `#A-18` | Tampilkan suffix `order_number` |
| Tidak ada komposisi pembayaran & Z-Report | Laporan belum lengkap | Placeholder "segera hadir" |
| Tidak ada endpoint setting publik | Cashier tidak tahu `tax_rate` | `VITE_TAX_PERCENTAGE` sementara |
| Tidak ada resep/ingredient | Fitur "ubah resep" | Sembunyikan |
| `GET /orders/{id}` tanpa cek pemilik | Risiko keamanan | Perbaiki di backend sebelum rilis |
| Gambar produk tanpa thumbnail | Boros kuota | Konversi/kompresi di backend |
| `POST /orders` menerima `tax_total` dari client | Pajak bisa dimanipulasi | Hitung pajak di backend |

Jika gap menghalangi, gunakan feature flag dan catat issue. Jangan mengisi dengan data palsu.

---

## 18. Roadmap

1. **F0 — Fondasi** ✅ Vite, Tailwind, shadcn, router, auth shell, Capacitor Android, test.
2. **F1 — Auth & shell** ✅ Login, guard, bottom nav, side rail, settings.
3. **F2 — Kasir** ⏳ Pilih menu manual, cart, pembayaran tunai, struk.
4. **F3 — Antrean/KDS** ⏳ Daftar tiket, ubah status, polling.
5. **F4 — Menu & stok** ⏳ Produk, koreksi stok, riwayat.
6. **F5 — Laporan** ⏳ Sales, daily, top products, chart.
7. **F6 — Native** ⏳ Scanner, printer, offline, kiosk.
