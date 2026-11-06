# DESIGN.md — Kopag Malam Mobile POS

> Design system dan spesifikasi layar untuk aplikasi mobile staff (`kopagmalam-app`).
> Web katalog pelanggan memakai design system terpisah di repo `../kopagmalam-web`.
> Implementasi token ada di `src/index.css`.

---

## 1. Prinsip

1. **Cepat dibaca, cepat ditekan.** Kasir berdiri, satu tangan, cahaya campur.
2. **Satu layar, satu tugas.** Hindari modal bertumpuk.
3. **Angka adalah raja.** Total, kembalian, dan qty paling menonjol.
4. **Tahan gangguan.** Offline, printer error, izin kamera ditolak → tetap bisa lanjut.
5. **Konsisten dengan brand.** Warm artisanal coffee, bukan dashboard generik.

---

## 2. Token warna

Sumber: `src/index.css` (Tailwind `@theme` + variabel shadcn).

| Token | Hex | Pemakaian |
|---|---|---|
| `espresso` | `#6F4E37` | Primary, CTA, aksen aktif |
| `latte` | `#905837` | Aksen sekunder, status seduh |
| `cascara` | `#6F3749` | Badge spesialti |
| `jute` | `#806946` | Label kategori |
| `midnight` | `#574B92` | Info, analitik |
| `surface` | `#FFF8F5` | Background aplikasi |
| `surface-dim` | `#E0D8D5` | Input border |
| `surface-card` | `#FFFFFF` | Kartu |
| `surface-low` | `#FAF2EE` | Section lembut |
| `surface-high` | `#EFE6E1` | Border/divider |
| `on-surface` | `#251B17` | Teks utama |
| `on-surface-variant` | `#6E625B` | Metadata |

Semantik:

| Status | Teks | Latar |
|---|---|---|
| Sukses / lunas / selesai | `#2F7D5B` | `#E8F5EE` |
| Peringatan / pending | `#B7791F` | `#FDF3E1` |
| Bahaya / batal / gagal | `#B23A3A` | `#FBE9E9` |
| Info / diproses | `#574B92` | `#EEECF8` |

Pemetaan shadcn:

- `--primary` = espresso, `--primary-foreground` = surface.
- `--background` = surface, `--foreground` = on-surface.
- `--card` = surface-card, `--border` = surface-high.
- `--radius` = `0.75rem` (kontrol 12 px, kartu 16 px via `rounded-xl`/`rounded-2xl`).
- Dark mode tersedia di `.dark` (warm dark), default terang.

---

## 3. Tipografi

Font: **Plus Jakarta Sans Variable** (`@fontsource-variable/plus-jakarta-sans`).

| Peran | Ukuran | Berat |
|---|---|---|
| Display total | 32 px | 800 |
| H1 halaman | 20–22 px | 700 |
| H2 section / judul kartu | 14–16 px | 700 |
| Body | 14–15 px | 500 |
| Caption / metadata | 11–12 px | 500–600 |
| Mono (order/SKU) | 12–13 px | 600 |

Aturan:

- Uang memakai `tabular-nums`.
- Tidak ada teks di bawah 11 px.
- Judul memakai `font-heading`; body default `font-sans`.

---

## 4. Layout & shell

Implementasi: `src/components/shared/app-shell.tsx`.

### Ponsel

```
┌─────────────────────────┐
│ Status bar (native)      │
├─────────────────────────┤
│ Header 56px              │  wordmark + nama user + settings
├─────────────────────────┤
│ Content px-4 pt-4        │
│ padding-bottom 96px      │
├─────────────────────────┤
│ Bottom nav 64px + safe   │
└─────────────────────────┘
```

- Header sticky, `bg-background/95`, border bawah.
- Bottom nav: 5 item, ikon 20 px + label 11 px, target 64 px.
- Safe area bawah: `env(safe-area-inset-bottom)`.
- Konten maksimal `max-w-5xl`.

### Tablet (≥ 768 px)

- Bottom nav disembunyikan.
- Rail kiri `w-20`, sticky, item 56 px, logo "KM" di atas.
- Konten tetap `max-w-5xl`, padding 16 px.
- Untuk antrean/menu, gunakan dua kolom (daftar + detail) saat data sudah ada.

### Navigasi per role

| Item | Route | Cashier | Admin/Manager |
|---|---|---|---|
| Overview | `/overview` | ✅ | ✅ |
| Kasir | `/cash` | ✅ | ✅ |
| Antrean | `/queue` | ✅ | ✅ |
| Menu | `/menu` | ✅ | ✅ |
| Laporan | `/reports` | ❌ | ✅ |
| Pengaturan | `/settings` | ✅ (nav) | ✅ (header) |

Aturan: cashier melihat 5 item (termasuk Pengaturan), admin/manager melihat Laporan dan mengakses Pengaturan lewat header.

---

## 5. Komponen

### Sudah ada

| Komponen | Lokasi | Catatan |
|---|---|---|
| `Button` | `components/ui/button.tsx` | Default 44 px, `lg` 48 px, `icon` 44 px |
| `Card` | `components/ui/card.tsx` | Radius 12–16 px, ring halus |
| `Input` | `components/ui/input.tsx` | Tinggi 44 px |
| `Badge` | `components/ui/badge.tsx` | Untuk role/status |
| `Tabs` | `components/ui/tabs.tsx` | Filter antrean |
| `PageHeader` | `components/shared/page-header.tsx` | Judul + deskripsi + aksi |
| `KpiCard` | `components/shared/kpi-card.tsx` | Label, nilai, hint, tone |
| `EmptyState` | `components/shared/empty-state.tsx` | Ikon, judul, deskripsi, aksi |
| `BottomNav` | `components/shared/bottom-nav.tsx` | Mobile |
| `SideRail` | `components/shared/side-rail.tsx` | Tablet |
| `FullScreenLoader` | `components/shared/full-screen-loader.tsx` | Saat hydrate sesi |

### Direncanakan

| Komponen | Kegunaan |
|---|---|
| `QueueTicket` | Tiket antrean: nomor, item, status, aksi |
| `ProductRow` | Baris produk: gambar, nama, harga, stok |
| `VariantChip` | Pilihan varian |
| `QtyStepper` | Tambah/kurang qty 44 px |
| `QuickCashChip` | Uang pas, 50k, 100k, 150k, 200k |
| `Numpad` | Grid 3×4, tombol 64 px |
| `ChangePanel` | Kembalian, latar `success-soft` |
| `ReceiptPreview` | Struk 58 mm, font mono |
| `ScannerOverlay` | Kamera fullscreen |
| `OfflineBanner` | Banner mode offline |
| `StockStepper` | Koreksi stok |
| `ConfirmDialog` | Aksi destruktif |

Spesifikasi umum:

- Radius kartu 16 px, kontrol 12 px, pill full.
- Border 1 px `surface-high`; hindari shadow berat.
- Status tidak hanya warna: sertakan teks/ikon.
- Tombol utama minimal 44 px; jarak antar target 8 px.

---

## 6. Layar

| Route | Role | Status | Isi |
|---|---|---|---|
| `/login` | semua | ✅ | Form email/password, error inline, info toko |
| `/overview` | semua | ✅ scaffold | KPI, aksi cepat, stok kritis, antrean |
| `/cash` | cashier+ | ✅ scaffold | Empty state, tombol scan, catatan kontrak |
| `/queue` | cashier+ | ✅ scaffold | Tabs Baru/Diproses/Selesai |
| `/menu` | cashier+ | ✅ scaffold | Ketersediaan & stok |
| `/inventory` | cashier+ | ✅ scaffold | SKU, koreksi stok, label |
| `/reports` | admin/manager | ✅ scaffold | KPI, chart placeholder, guard akses |
| `/settings` | semua | ✅ | Profil, role, toko, backend, printer, logout |
| `*` | semua | ✅ | Halaman 404 |

### 6.1 `/login`

- Logo kopi, judul "Kopag Malam POS", subjudul "Masuk untuk memulai shift".
- Field email & password (44 px), tombol "Masuk" 48 px.
- Loading state dengan spinner; error di kotak `danger-soft`.
- Kredensial demo ditampilkan kecil di bawah.
- Redirect ke `state.from` atau `/overview`.

### 6.2 `/overview`

1. Sapaan + nama user.
2. Grid 2×2 KPI: Omset, Order lunas, Antrean aktif, Rata-rata order.
3. Aksi cepat: "Kasir baru", "Lihat antrean".
4. Kartu stok kritis (empty state sampai data tersedia).
5. Kartu antrean seduh + tautan "Semua".
6. Tombol laporan hanya untuk admin/manager.

### 6.3 `/cash`

- Header + tombol scan (44 px).
- Kartu pesanan saat ini dengan empty state.
- Tombol "Scan produk" dan "Input manual" (aktif setelah F2).
- Catatan kontrak: `POST /orders` + `payment_method=cash`, `pay_now=true`, `paid_amount`.

Tahap berikutnya:

- Pencarian/scan → varian → cart.
- Ringkasan bawah: jumlah item, subtotal, "Lanjut Bayar".
- Layar tunai: total 32 px, quick cash, numpad, kembalian, konfirmasi.
- Struk: preview 58 mm, cetak/bagikan, "Order Baru".

### 6.4 `/queue`

- Tabs: Baru (`paid`), Diproses (`processing`), Selesai (`completed`).
- Kartu tiket: nomor, waktu, item + qty, catatan, aksi "Mulai Seduh"/"Selesai".
- Polling 10 detik; pull-to-refresh.
- Tablet: daftar kiri, detail kanan.

### 6.5 `/menu`

- Ringkasan total menu, stok kritis, habis.
- Search + filter kategori.
- Baris produk: gambar, nama, harga, stok, toggle tampil (admin), stepper stok.
- Cashier: lihat + "Koreksi stok".
- Admin: edit harga, toggle `is_active`, unggah gambar.
- Aksi cetak label barcode.

### 6.6 `/inventory`

- Daftar SKU + stok + min stok + status.
- Stepper → `POST /stock/adjust` (`in`, `out`, `adjustment`).
- Riwayat 10 movement terakhir.
- Scanner kamera + input manual.
- Cetak label QR/barcode.

### 6.7 `/reports`

- Guard: hanya admin/manager.
- Filter periode: Hari ini, 7 hari, Bulan ini.
- KPI: omset, order, AOV.
- Bar chart ritme penjualan.
- Top produk.
- Placeholder untuk komposisi pembayaran dan Z-Report (belum ada endpoint).

### 6.8 `/settings`

- Profil: nama, email, badge role.
- Toko: nama, kode, environment.
- Backend URL (read-only, mono, break-all).
- Printer: mode dari env, catatan integrasi.
- Logout dengan konfirmasi.

---

## 7. Alur utama

### 7.1 Bayar tunai (target F2)

```
Login → /cash
  ├─ Scan / pilih produk → varian → cart server
  ├─ "Lanjut Bayar"
  ├─ Input tunai (chip/numpad)
  ├─ Preview kembalian
  ├─ "Konfirmasi & Bayar"
  │    └─ POST /orders { payment_method: "cash", pay_now: true, paid_amount }
  └─ /receipt/:id → cetak / bagikan → order baru
```

### 7.2 Antrean (target F3)

```
Order lunas → /queue (status paid)
  ├─ "Mulai Seduh" → PATCH /orders/{id}/status { status: "processing" }
  └─ "Selesai"     → PATCH /orders/{id}/status { status: "completed" }
```

### 7.3 Koreksi stok (target F4)

```
/menu atau /inventory → pilih produk → qty + tipe → POST /stock/adjust
  └─ invalidate products + stock movements
```

### 7.4 Sesi berakhir

```
Request → 401 → hapus sesi → toast "Sesi berakhir" → /login?next=<route>
```

---

## 8. State & feedback

| State | Tampilan |
|---|---|
| Hydrate sesi | `FullScreenLoader` |
| Loading data | Skeleton sesuai layout |
| Kosong | `EmptyState` + CTA |
| Error jaringan | Kartu error + "Coba lagi" |
| Offline | Banner kuning + aksi jaringan disabled |
| Sukses | Toast 2 detik + haptic |
| Gagal validasi | Pesan inline |
| Gagal server | Toast + kode referensi |

Aturan:

- Tombol submit disabled + spinner saat proses.
- Aksi destruktif konfirmasi.
- Jangan menutup sheet sebelum mutasi selesai.
- Setelah bayar sukses, cegah double submit.

---

## 9. Interaksi & motion

- Transisi 150–200 ms, `ease-out`.
- Bottom sheet slide-up 220 ms.
- Haptic ringan (numpad), sedang (sukses), berat (error).
- Hormati `prefers-reduced-motion`.
- Pull-to-refresh di Overview, Queue, Reports.
- Back Android: tutup sheet dulu, baru navigasi.

---

## 10. Aksesibilitas

- Target sentuh ≥ 44×44 px, jarak ≥ 8 px.
- Kontras teks ≥ 4.5:1.
- Icon button wajib `aria-label`.
- Fokus terlihat (`ring` espresso).
- Dukung font scaling OS sampai 130%.
- Status disertai teks/ikon, bukan warna saja.
- Form: label eksplisit, error terhubung `aria-describedby`.
- Scanner selalu punya input manual.

---

## 11. Hardware

| Fitur | Native | Fallback |
|---|---|---|
| Scan barcode | `@capacitor-mlkit/barcode-scanning` | Input manual |
| Printer struk | ESC/POS network / BLE | Share teks / print OS |
| Cash drawer | Perintah printer | Catat manual |
| Layar tetap menyala | `@capacitor-community/keep-awake` | No-op |
| Getar | `@capacitor/haptics` | No-op |
| Kiosk | Android Lock Task / MDM | Fullscreen browser |

Tampilkan status koneksi printer di header kasir. Jika putus, pembayaran tetap bisa diselesaikan dan struk dicetak ulang.

---

## 12. Format konten

- Mata uang: `Rp 156.000` (tanpa desimal).
- Tanggal: `04 Nov 2026`; jam: `14:30 WIB`.
- Nomor order: suffix 4 digit, mono.
- Label status:
  - `pending` → "Menunggu"
  - `paid` → "Lunas"
  - `processing` → "Disiapkan"
  - `completed` → "Selesai"
  - `cancelled` → "Dibatalkan"
  - `refunded` → "Dikembalikan"
- Metode: `cash` → "Tunai", `midtrans` → "Online".

---

## 13. Definition of Done visual

- Diuji pada 360×640, 390×844, 768×1024, dan tablet 1280×800.
- Tidak ada teks terpotong pada font scaling 130%.
- Safe area iOS/Android benar.
- Bottom nav tidak menutupi konten terakhir.
- Semua state (loading, kosong, error, offline) punya tampilan.
- Mode terang konsisten; mode gelap memenuhi kontras.
- Tidak ada layout shift saat data masuk.
- Aksi utama bisa dilakukan dengan satu tangan.
- `npm run typecheck`, `lint`, `test`, dan `build` lolos.
