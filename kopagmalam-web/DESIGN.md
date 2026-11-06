# Design System & Architecture Specification (design.md)
**Roast & Co. Specialty Coffee Bar & Roastery Ecosystem**

---

## 1. Ikhtisar Proyek (Project Overview)
Ekosistem aplikasi digital untuk **Roast & Co.**, specialty coffee bar & artisan roastery. Sistem ini mencakup dua platform utama:
1. **Web Aplikasi Pelanggan (Customer Self-Order & Web Catalog)**: Antarmuka web responsif berbasis **Radix Themes** yang memungkinkan pelanggan menjelajah katalog minuman kopi spesialti, mengustomisasi pesanan, melakukan checkout online dengan payment gateway **Midtrans Snap**, serta memantau status penyeduhan kopi live (KDS Sync).
2. **Mobile Admin & Kasir Barista (Mobile POS & Management)**: Antarmuka mobile berbasis **shadcn/ui** untuk barista dan manajer bar di lapangan, mencakup operasional order real-time, penerimaan pembayaran tunai (Cash POS dengan kalkulator kembalian otomatis & auto-kick drawer), manajemen stok resep bahan kritis, serta laporan analitik per shift.

---

## 2. Brand Identity & Design System Tokens

### Palet Warna Utama (Brand Palette)
Sistem warna mengusung karakter *warm artisanal coffee, tactile craft, & modern minimalism*:
- **Primary / Espresso Roast**: `#6F4E37` — Warna utama identitas brand, tombol CTA utama, dan aksen aktif.
- **Secondary / Warm Latte & Terracotta**: `#905837` — Aksen sekunder, indikator status seduhan, border hangat.
- **Accent Wine / Cold Cascara**: `#6F3749` — Aksen pada menu fermentasi/cold brew & badge spesialti.
- **Muted Earth / Coffee Jute**: `#806946` — Elemen netral hangat, label kategori, secondary chips.
- **Deep Roastery / Midnight Brew**: `#574B92` — Indikator status live, sync cloud POS, badge analitik.

### Palet Permukaan & Latar Belakang (Radix & shadcn Neutral Tokens)
- `surface`: `#FFF8F5` (Warm Creamy Canvas)
- `surface-dim`: `#E0D8D5`
- `surface-container-lowest`: `#FFFFFF` (Card Backgrounds)
- `surface-container-low`: `#FAF2EE` (Subtle Section Backgrounds)
- `surface-container-high`: `#EFE6E1` (Border & Divider)
- `on-surface`: `#251B17` (High Contrast Espresso Typography)
- `on-surface-variant`: `#6E625B` (Secondary Text / Metadata)

### Tipografi & Bentuk (Typography & Geometry)
- **Primary Font Family**: `Plus Jakarta Sans`, sans-serif (modern, humanis, sangat terbaca di layar sentuh).
- **Type Scale**:
  - Display: 32px - 36px (Bold / Extrabold) — Judul utama & total tagihan.
  - Headings (H1/H2/H3): 18px - 24px (Semibold / Bold).
  - Body Text: 14px - 15px (Regular / Medium).
  - Captions / Metadata / SKU: 11px - 12px (Medium / Semibold, Monospace untuk ID transaksi & barcode).
- **Border Radius**: `ROUND_FOUR` (4px – 16px konsisten).
  - Cards: `rounded-2xl` (16px)
  - Buttons & Inputs: `rounded-xl` (12px)
  - Badges & Chips: `rounded-full` (9999px)

---

## 3. Arsitektur Informasi & Pemetaan Layar (Screen Inventory)

### A. Web Pelanggan (Customer Facing - Radix Themes)

| Layar | Path / Route | Komponen Utama | Keterangan |
|---|---|---|---|
| **Katalog Minuman Kopi Web** | `/catalog` atau `/beverages` | Filter kategori (*Espresso, Milk-based, Cold Brew, Mocktails*), Grid Card Menu Minuman, Filter Suhu/Tingkat Manis, Search Bar dengan shortcut `⌘K`, Scanner Barcode Kemasan | Pengalaman katalog visual imersif untuk pelanggan *dine-in* maupun *takeaway*. |
| **Katalog Produk Biji Kopi Artisan** | `/products` | Filter Roast Level, Process (*Honey, Washed, Anaerobic*), Q-Score Badge, Stok Pack, Tombol Tambah ke Keranjang | Eksplorasi biji kopi sangrai mikro-batch bagi penikmat kopi seduh manual. |
| **Cart Drawer & Detail Pesanan** | `/cart` (Slide-over Drawer) | Toggle *Dine-in (Meja #04)* vs *Takeaway*, Modifikasi cup (*Less Sugar, Oatmilk, Extra Shot*), Catatan Barista, Estimasi Waktu Barista (~8-12 mnt), CTA Lanjut Pembayaran | Drawer interaktif dengan update harga instan dan kalkulasi item. |
| **Checkout & Popup Midtrans Snap** | `/checkout` | Order Breakdown, Form Data Pemesan, Live Modal Midtrans Snap (QRIS Nasional, VA Bank, Kartu Kredit, E-Wallet), Timer Countdown, Tombol Unduh QR & Cek Status | Integrasi `snap.js` modal popup pembayaran tanpa meninggalkan halaman. |
| **Status Pembayaran & Struk Digital** | `/orders/[id]/success` | Stepper Live Barista (*Lunas -> Barista Sedang Menyeduh -> Sajikan ke Meja*), Tiket Antrean `#A-18`, QR Code Pick-up Bar, E-Receipt Resmi (PB1 & Service), Unduh PDF / WhatsApp | Konfirmasi instan tersinkronisasi dengan KDS (*Kitchen Display System*). |

---

### B. Mobile Admin & Kasir Barista (Staff Facing - shadcn/ui)

| Layar | Path / Route | Komponen Utama | Keterangan |
|---|---|---|---|
| **Mobile Overview Operasional** | `/pos/overview` | Bar Status Header (*Bar Buka / Shift Barista*), 4 KPI Cards (*Omset, Cup Terjual, Antrean Bar, Tempo Seduh*), Alert Stok Kritis Bahan Baku, Live Antrean Seduh KDS Tiket, Top 3 Menu Terlaris, Aksi Cepat Barista | Command center mobile untuk efisiensi ritme kerja barista selama jam sibuk. |
| **Mobile Kasir - Pembayaran Tunai (Cash)** | `/pos/payment/cash` | Tagihan Bersih (*Rp 156.000*), Quick Cash Chips (*Uang Pas, 160k, 200k, 500k*), Numpad 3x4 Touch-friendly, Kalkulator Kembalian Otomatis (*Rp 44.000*), Panduan Pecahan Laci (Denomination Guide), Switch Auto-Kick Drawer & Cetak Struk | Dirancang khusus untuk meminimalkan human error saat melayani antrean kasir cepat. |
| **Mobile Admin - Laporan & Analitik** | `/admin/reports` | Filter Periode (*Hari Ini, 7 Hari, Bulan Ini*), Ringkasan Finansial (AOV, Margin 68.4%), Visual Bar Chart Ritme Jam Sibuk Bar (Peak 14:30 WIB), Komposisi Penjualan, Rincian Pembayaran (QRIS, E-Wallet, EDC, Tunai), Rekonsiliasi Laci Kasir (*Tutup Shift & Z-Report*) | Audit berkala dan penutupan shift kasir (*cash balancing*). |
| **Mobile Admin - Katalog Minuman Kopi** | `/admin/menu` | Metrik Menu (*36 Total, 3 Kritis, 2 Sold Out*), Switch Aktif di POS, Quick Stepper Stok Porsi Cup, Tombol Ubah Resep & Harga, Toast Pindai Cepat Bahan Baku (*Gula Aren 5L, Oat Milk*) | Manajemen ketersediaan menu barista *on-the-fly*. |
| **Mobile Admin - Pembaruan Stok Produk** | `/admin/inventory` | Daftar SKU Biji Kopi, Toggle Tampil di POS, Kontrol Tambah/Kurang Pack Stok, Tombol Cetak Label QR Barcode, Modal Scanner Barcode Kamera | Manajemen inventaris fisik toko dan batch sangrai. |

---

## 4. Pola Interaksi & Alur Kerja (Core User Flows)

### Flow 1: Pelanggan Scan Meja -> Pesan -> Bayar Midtrans QRIS
```
Pelanggan Scan QR Meja #04
  └─► Buka Katalog Web (/beverages)
        └─► Pilih Iced Aren Sea Salt Latte (Kustomisasi: Oatmilk + Less Sugar)
              └─► Masuk ke Cart Drawer (Validasi Ringkasan Item & Meja #04)
                    └─► Klik "Lanjut ke Pembayaran"
                          └─► Muncul Popup Midtrans Snap (Pilih QRIS GPN)
                                └─► Pelanggan Scan & Bayar via M-Banking / GoPay
                                      └─► Redirect ke Order Success & E-Receipt
                                            └─► KDS Barista otomatis menerima tiket #A-18
```

### Flow 2: Pelanggan Pesan di Kasir -> Pembayaran Tunai (Cash POS)
```
Barista Input Pesanan di POS Mobile
  └─► Total Tagihan Muncul: Rp 156.000
        └─► Pilih Metode: "Tunai (Cash)"
              └─► Tekan Chip Quick Cash "Rp 200.000" atau Input via Numpad
                    └─► Sistem Otomatis Hitung Kembalian: Rp 44.000
                          └─► Muncul Panduan Pecahan: "2 lembar Rp 20.000 + 2 koin/lembar Rp 2.000"
                                └─► Tekan "Konfirmasi & Buka Laci" (Laci Kasir Terbuka)
                                      └─► Struk Dapur Dicetak & e-Receipt dikirim ke WhatsApp
```

### Flow 3: Barista Tutup Shift & Rekonsiliasi Kas (Z-Report)
```
Barista Buka Tab Laporan di Mobile (/admin/reports)
  └─► Tinjau Omset Harian & Distribusi Pembayaran (QRIS 62%, Tunai 5%, dll.)
        └─► Verifikasi Rekonsiliasi Laci Kasir:
              ├─ Modal Awal Floating Kas: Rp 500.000
              ├─ Penerimaan Tunai Bersih: Rp 1.622.500
              └─ Total Fisik di Laci Seharusnya: Rp 2.122.500
        └─► Klik "Tutup Shift & Cetak Z-Report"
              └─► Sistem mengunci transaksi shift dan mengirim rekap ke Cloud Backend
```

---

## 5. Spesifikasi Teknis Frontend (Implementation Details)

### Rekomendasi Tech Stack
- **Framework**: Next.js 14+ (App Router) dengan TypeScript.
- **Styling**: Tailwind CSS dikombinasikan dengan token Radix Themes (Web) dan Tailwind Variants / shadcn/ui primitives (Mobile).
- **State Management**:
  - `authStore` (Zustand): Token autentikasi, role guard (`admin`, `cashier`, `barista`).
  - `cartStore` (Zustand): Persistensi item belanja pelanggan, modifier per cup, catatan barista, dan nomor meja.
- **Data Fetching & Cache**: TanStack Query v5 (`useQuery`, `useMutation`) dengan kunci query:
  - `['menu', 'beverages']`
  - `['pos', 'queue']`
  - `['pos', 'daily-kpi']`
  - `['orders', orderNumber]`
- **Payment SDK**: Midtrans Snap.js (`NEXT_PUBLIC_MIDTRANS_CLIENT_KEY`).
- **Hardware Integration**:
  - Web Bluetooth / ESC-POS Network Printer untuk pencetakan thermal struk kasir & dapur.
  - Web Barcode Detection API / `html5-qrcode` untuk scan cepat barcode bahan baku & cup.

### Struktur Variabel Lingkungan (.env)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=SB-Mid-client-XXXXX
NEXT_PUBLIC_STORE_NAME="Roast & Co. Senopati"
NEXT_PUBLIC_STORE_CODE="POS-JKT-04"
NEXT_PUBLIC_TAX_PERCENTAGE=10
```

---

## 6. Ringkasan Desain yang Telah Diselesaikan
1. **Desktop**: `Katalog Produk Web (Radix Themes)`
2. **Desktop**: `Katalog Minuman Kopi Web (Radix Themes)`
3. **Desktop**: `Cart Drawer & Detail Pesanan Pelanggan (Radix Themes)`
4. **Desktop**: `Checkout & Pembayaran Midtrans Snap (Radix Themes)`
5. **Desktop**: `Status Pembayaran Berhasil & Struk Digital (Radix Themes)`
6. **Mobile**: `Mobile Admin - Overview Operasional (shadcn/ui)`
7. **Mobile**: `Mobile Kasir - Pembayaran Tunai (Cash)`
8. **Mobile**: `Mobile Admin - Laporan & Analitik (shadcn/ui)`
9. **Mobile**: `Mobile Admin - Katalog Minuman Kopi (shadcn/ui)`
10. **Mobile**: `Mobile Admin - Pembaruan Katalog & Stok (shadcn/ui)`
