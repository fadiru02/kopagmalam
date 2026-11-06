import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { apiRequest, buildQuery } from "@/lib/api/client"
import { endpoints } from "@/lib/api/endpoints"
import type { Paginated, StockMovement } from "@/lib/api/types"
import { useAuthStore } from "@/lib/stores/auth"

export function useStockMovements(page = 1, perPage = 15) {
  const token = useAuthStore((state) => state.token)

  return useQuery({
    queryKey: ["stock", "movements", page, perPage],
    queryFn: () =>
      apiRequest<Paginated<StockMovement>>(
        `${endpoints.stock.movements}${buildQuery({ page, per_page: perPage })}`,
        { token },
      ),
  })
}

export function useStockAdjust() {
  const token = useAuthStore((state) => state.token)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: {
      product_id: number
      product_variant_id?: number | null
      type: "in" | "out" | "adjustment"
      qty: number
      note?: string
    }) =>
      apiRequest(endpoints.stock.adjust, {
        method: "POST",
        body: payload,
        token,
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["stock", "movements"] })
      void queryClient.invalidateQueries({ queryKey: ["products"] })
    },
  })
}
