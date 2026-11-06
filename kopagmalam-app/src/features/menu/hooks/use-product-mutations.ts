import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiRequest } from "@/lib/api/client"
import { endpoints } from "@/lib/api/endpoints"
import type { Product, ProductInput } from "@/lib/api/types"
import { queryKeys } from "@/lib/query/keys"
import { useAuthStore } from "@/lib/stores/auth"

export function useCreateProduct() {
  const token = useAuthStore((state) => state.token)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: ProductInput) =>
      apiRequest<Product>(endpoints.admin.products, {
        method: "POST",
        body: input,
        token,
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.products.all })
    },
  })
}

export function useUpdateProduct() {
  const token = useAuthStore((state) => state.token)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: ProductInput }) =>
      apiRequest<Product>(endpoints.admin.product(id), {
        method: "PUT",
        body: input,
        token,
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.products.all })
    },
  })
}

export function useDeleteProduct() {
  const token = useAuthStore((state) => state.token)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) =>
      apiRequest<{ message: string }>(endpoints.admin.product(id), {
        method: "DELETE",
        token,
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.products.all })
    },
  })
}
