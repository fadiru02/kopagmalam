# Design Frontend (Katalog Menu Coffee Shop)

## 1. Tujuan & Ruang Lingkup
Frontend website katalog menu coffee shop + kasir web yang mengonsumsi API backend (`/api/v1`). Semua data/state lewat API. Produk adalah menu (coffee, non-coffee, food, snack, dessert), tanpa barcode.

## 2. Tech Stack (disarankan)
- Framework: Next.js (App Router) + TypeScript atau Nuxt 3.
- Styling: Tailwind CSS + shadcn/ui (opsional).
- Data fetching: TanStack Query.
- State: Zustand (cart, auth token).
- HTTP: Axios dengan interceptor token.
- Form: React Hook Form + Zod.
- Tabel: TanStack Table (admin).

## 3. Struktur Halaman (Routes)
Public (katalog):
- / Home (featured, new arrivals)
- /products List (filter kategori/brand/harga/search, sort, pagination)
- /products/[slug] Detail
- /categories/[slug], /brands/[slug]

Auth:
- /login, /register

Customer:
- /cart
- /checkout
- /orders, /orders/[number]

Cashier/Admin (role-based):
- /pos (pilih menu -> cart -> bayar cash)
- /admin/* (produk/menu, kategori, brand, customer, kupon, user, laporan, settings)

## 4. Integrasi API (sesuai backend)
Base URL: NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1

Auth: token di memory/localStorage; interceptor Authorization: Bearer {token}.

Endpoint map:
- Katalog: GET /products, /products/{slug}, /categories, /brands
- Cart: GET /cart, POST /cart/items, PATCH /cart/items/{id}, DELETE /cart/items/{id}
- Order: POST /orders, GET /orders, GET /orders/{number}, POST /orders/{number}/cancel
- Payment: POST /orders/{number}/pay/midtrans, POST /orders/{number}/sync-payment
- Admin: /admin/*

Query params (Spatie): filter[category_id], filter[brand_id], filter[is_featured], filter[search], sort=name, per_page, include.

## 5. Flow Checkout & Payment
- Cart -> Checkout: POST /orders (payment_method: cash/midtrans, coupon_code, paid_amount).
- Cash: pay_now=true -> order langsung paid.
- Midtrans: POST /orders/{number}/pay/midtrans -> snap_token -> buka Snap popup dengan client_key. Polling status setelah bayar.
- Webhook backend memperbarui status otomatis.

## 6. State & Data
- TanStack Query keys: ['products', filters], ['product', slug], ['cart'], ['orders'].
- Zustand: authStore, cartStore.
- Invalidation setelah mutasi.

## 7. Komponen UI
- ProductCard, ProductGrid, VariantSelector, StockBadge
- CartDrawer, CheckoutForm
- OrderStatusBadge, PaymentMethodSelector
- Admin: DataTable, ProductForm, MediaUploader

## 8. Role-based Access
- Guard berdasarkan token + user.roles.
- Admin routes hanya admin/manager.
- POS routes cashier/admin/manager.

## 9. Environment Variables (frontend)
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000

## 10. Error Handling & UX
- Toast error/success.
- Skeleton loading.
- Empty state & retry.
- Validasi form Zod.
- 401 -> redirect login.

## 11. Responsiveness & Aksesibilitas
- Mobile-first.
- ARIA labels, keyboard nav, kontras.

## 12. Testing Frontend
- Unit: Vitest + Testing Library.
- E2E: Playwright.

## 13. Deliverables
- Repo frontend terpisah.
- README setup + env.
- Integrasi dengan backend ini.