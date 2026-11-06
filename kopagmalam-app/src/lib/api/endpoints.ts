export const endpoints = {
  auth: {
    login: "/auth/login",
    me: "/auth/me",
    logout: "/auth/logout",
  },
  cart: {
    show: "/cart",
    items: "/cart/items",
    item: (id: number | string) => `/cart/items/${id}`,
    clear: "/cart",
  },
  orders: {
    list: "/orders",
    detail: (id: number | string) => `/orders/${id}`,
    cancel: (id: number | string) => `/orders/${id}/cancel`,
    status: (id: number | string) => `/orders/${id}/status`,
  },
  stock: {
    adjust: "/stock/adjust",
    movements: "/stock/movements",
  },
  products: {
    list: "/products",
    show: (slug: string) => `/products/${encodeURIComponent(slug)}`,
  },
  categories: {
    list: "/categories",
  },
  brands: {
    list: "/brands",
  },
  admin: {
    products: "/admin/products",
    product: (id: number | string) => `/admin/products/${id}`,
    productMedia: (id: number | string) => `/admin/products/${id}/media`,
    reports: {
      sales: "/admin/reports/sales",
      daily: "/admin/reports/daily",
      topProducts: "/admin/reports/top-products",
    },
    settings: "/admin/settings",
  },
} as const
