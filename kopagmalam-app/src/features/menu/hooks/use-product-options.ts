import { useQuery } from "@tanstack/react-query"
import { apiRequest } from "@/lib/api/client"
import { endpoints } from "@/lib/api/endpoints"
import type { Brand, Category } from "@/lib/api/types"
import { queryKeys } from "@/lib/query/keys"
import { useAuthStore } from "@/lib/stores/auth"

const OPTIONS_STALE_TIME = 5 * 60_000

export function useCategories() {
  const token = useAuthStore((state) => state.token)

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.categories.list,
    queryFn: () => apiRequest<Category[]>(endpoints.categories.list, { token }),
    staleTime: OPTIONS_STALE_TIME,
  })

  return { categories: data ?? [], isLoading }
}

export function useBrands() {
  const token = useAuthStore((state) => state.token)

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.brands.list,
    queryFn: () => apiRequest<Brand[]>(endpoints.brands.list, { token }),
    staleTime: OPTIONS_STALE_TIME,
  })

  return { brands: data ?? [], isLoading }
}
