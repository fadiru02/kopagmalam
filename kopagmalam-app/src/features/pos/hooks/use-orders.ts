import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiRequest } from "@/lib/api/client"
import { endpoints } from "@/lib/api/endpoints"
import type { Order } from "@/lib/api/types"
import { queryKeys } from "@/lib/query/keys"
import { useAuthStore } from "@/lib/stores/auth"

export function useCreateOrder() {
  const token = useAuthStore((state) => state.token)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: {
      payment_method: "cash" | "midtrans"
      pay_now: boolean
      paid_amount: number
      tax_total?: number
      notes?: string
      customer_id?: number
      coupon_code?: string
      table_number?: string
    }) =>
      apiRequest<Order>(endpoints.orders.list, {
        method: "POST",
        body: payload,
        token,
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.cart })
      void queryClient.invalidateQueries({ queryKey: queryKeys.orders.all })
    },
  })
}