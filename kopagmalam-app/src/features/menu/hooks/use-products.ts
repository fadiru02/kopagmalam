import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { apiRequest, buildQuery } from "@/lib/api/client"
import { endpoints } from "@/lib/api/endpoints"
import type { Paginated, Product, ProductListParams } from "@/lib/api/types"
import { queryKeys } from "@/lib/query/keys"
import { useAuthStore } from "@/lib/stores/auth"

export function useProducts(params: ProductListParams) {
  const token = useAuthStore((state) => state.token)

  const query = buildQuery({
    include: "category,brand",
    per_page: params.perPage,
    page: params.page,
    "filter[search]": params.search.trim() || undefined,
    "filter[is_active]":
      params.status === "all" ? undefined : params.status === "active" ? 1 : 0,
    "filter[category_id]": params.categoryId ?? undefined,
  })

  return useQuery({
    queryKey: queryKeys.products.list(params),
    queryFn: () =>
      apiRequest<Paginated<Product>>(`${endpoints.products.list}${query}`, {
        token,
      }),
    placeholderData: keepPreviousData,
  })
}
