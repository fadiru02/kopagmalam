export const queryKeys = {
  auth: {
    me: ["auth", "me"] as const,
  },
  cart: ["cart"] as const,
  orders: {
    all: ["orders"] as const,
    list: (filters: Record<string, unknown> = {}) =>
      ["orders", "list", filters] as const,
    queue: ["orders", "queue"] as const,
    detail: (id: number | string) => ["orders", "detail", String(id)] as const,
  },
  products: {
    all: ["products"] as const,
    list: (filters: Record<string, unknown> = {}) =>
      ["products", "list", filters] as const,
  },
  categories: {
    list: ["categories", "list"] as const,
  },
  brands: {
    list: ["brands", "list"] as const,
  },
  stock: {
    movements: ["stock", "movements"] as const,
  },
  reports: {
    sales: (range: string) => ["reports", "sales", range] as const,
    daily: (range: string) => ["reports", "daily", range] as const,
    topProducts: (range: string) => ["reports", "top-products", range] as const,
  },
} as const
