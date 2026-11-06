export type RoleName = "admin" | "manager" | "cashier" | "customer"

export interface Role {
  id: number
  name: RoleName
  guard_name?: string
}

export interface AuthUser {
  id: number
  name: string
  email: string
  phone?: string | null
  is_active?: boolean
  roles: Role[]
}

export interface LoginResponse {
  user: AuthUser
  token: string
}

export interface Paginated<T> {
  data: T[]
  current_page: number
  last_page: number
  per_page: number
  total: number
  from: number | null
  to: number | null
}

export interface ApiValidationError {
  message: string
  errors: Record<string, string[]>
}

export interface MediaItem {
  id: number
  file_name: string
  mime_type: string
  original_url: string
  preview_url?: string
}

export interface Category {
  id: number
  parent_id: number | null
  name: string
  slug: string
  description: string | null
  image: string | null
  sort_order: number
  is_active: boolean
}

export interface Brand {
  id: number
  name: string
  slug?: string
  logo: string | null
  is_active: boolean
}

export interface ProductVariant {
  id: number
  product_id: number
  name: string
  sku: string
  price: string | null
  stock: number
  attributes: Record<string, string> | null
  is_active: boolean
}

export interface Product {
  id: number
  category_id: number | null
  brand_id: number | null
  name: string
  slug: string
  sku: string
  description: string | null
  price: string
  cost?: string | null
  stock: number
  min_stock: number
  unit: string
  weight?: string | null
  is_active: boolean
  is_featured: boolean
  published_at?: string | null
  category?: Category | null
  brand?: Brand | null
  variants?: ProductVariant[]
  variants_count?: number
  media?: MediaItem[]
}

export interface ProductInput {
  name: string
  sku: string
  category_id: number | null
  brand_id: number | null
  description: string | null
  price: number
  stock: number
  min_stock: number
  unit: string
  is_active: boolean
  is_featured: boolean
}

export type ProductStatusFilter = "all" | "active" | "inactive"

export type ProductListParams = {
  page: number
  perPage: number
  search: string
  status: ProductStatusFilter
  categoryId: number | null
}

export interface SalesReportSummary {
  orders_count: number
  revenue: string | number
  discount: string | number
  tax: string | number
}

export interface SalesReportResponse {
  from: string
  to: string
  summary: SalesReportSummary
}

export interface TopProductReport {
  product_id: number | null
  name: string
  qty_sold: string | number
  revenue: string | number
}

export interface DailyReportRow {
  date: string
  orders: number
  revenue: string | number
}

export interface StockMovement {
  id: number
  product_id: number
  product_variant_id: number | null
  type: "in" | "out" | "adjustment"
  qty: number
  note: string | null
  user?: { id: number; name: string } | null
  product?: { id: number; name: string; sku: string } | null
  variant?: { id: number; name: string } | null
  created_at: string
}

export interface GeneralSettings {
  store_name: string
  store_address: string | null
  store_phone: string | null
  tax_rate: number
  currency: string
}

export interface PaymentSettings {
  cash_enabled: boolean
  midtrans_enabled: boolean
}

export interface AppSettings {
  general: GeneralSettings
  payment: PaymentSettings
}

export interface CartItem {
  id: number
  cart_id: number
  product_id: number
  product_variant_id: number | null
  qty: number
  price: string
  product: Product
  variant: ProductVariant | null
}

export interface CartResponse {
  cart: {
    id: number
    user_id: number
    items: CartItem[]
  }
  total: number
}

export type OrderStatus =
  | "pending"
  | "paid"
  | "processing"
  | "completed"
  | "cancelled"
  | "refunded"

export type PaymentStatus = "unpaid" | "paid" | "failed" | "refunded"
export type PaymentMethod = "cash" | "midtrans" | null

export interface OrderItem {
  id: number
  product_id: number | null
  product_variant_id: number | null
  name: string
  sku: string | null
  price: string
  qty: number
  subtotal: string
  discount: string
}

export interface Payment {
  id: number
  method: string
  amount: string
  status: PaymentStatus
  gateway: string | null
  paid_at: string | null
}

export interface Order {
  id: number
  order_number: string
  status: OrderStatus
  payment_status: PaymentStatus
  payment_method: PaymentMethod
  subtotal: string
  discount_total: string
  tax_total: string
  total: string
  paid_amount: string
  change_amount: string
  notes: string | null
  table_number: string | null
  items: OrderItem[]
  payments?: Payment[]
  customer?: {
    id: number
    name: string
    email: string | null
    phone: string | null
  } | null
  cashier?: {
    id: number
    name: string
  } | null
  created_at: string
  paid_at: string | null
}
