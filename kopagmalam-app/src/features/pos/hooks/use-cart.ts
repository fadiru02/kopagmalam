import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { apiRequest } from "@/lib/api/client"
import { endpoints } from "@/lib/api/endpoints"
import type { CartResponse } from "@/lib/api/types"
import { queryKeys } from "@/lib/query/keys"
import { useAuthStore } from "@/lib/stores/auth"

export function useCart() {
  const token = useAuthStore((state) => state.token)

  return useQuery({
    queryKey: queryKeys.cart,
    queryFn: () =>
      apiRequest<CartResponse>(endpoints.cart.show, { token }),
  })
}

export function useAddToCart() {
  const token = useAuthStore((state) => state.token)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      productId,
      variantId = null,
      qty = 1,
    }: {
      productId: number
      variantId?: number | null
      qty?: number
    }) =>
      apiRequest(endpoints.cart.items, {
        method: "POST",
        body: {
          product_id: productId,
          product_variant_id: variantId,
          qty,
        },
        token,
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.cart })
    },
  })
}

export function useUpdateCartItem() {
  const token = useAuthStore((state) => state.token)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, qty }: { id: number; qty: number }) =>
      apiRequest(endpoints.cart.item(id), {
        method: "PATCH",
        body: { qty },
        token,
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.cart })
    },
  })
}

export function useRemoveCartItem() {
  const token = useAuthStore((state) => state.token)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) =>
      apiRequest(endpoints.cart.item(id), {
        method: "DELETE",
        token,
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.cart })
    },
  })
}

export function useClearCart() {
  const token = useAuthStore((state) => state.token)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () =>
      apiRequest(endpoints.cart.clear, {
        method: "DELETE",
        token,
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.cart })
    },
  })
}
