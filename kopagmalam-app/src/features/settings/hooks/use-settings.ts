import { useQuery } from "@tanstack/react-query"
import { apiRequest } from "@/lib/api/client"
import { endpoints } from "@/lib/api/endpoints"
import type { AppSettings } from "@/lib/api/types"
import { useAuthStore } from "@/lib/stores/auth"

export function useSettings(enabled: boolean) {
  const token = useAuthStore((state) => state.token)

  return useQuery({
    queryKey: ["settings"],
    queryFn: () => apiRequest<AppSettings>(endpoints.admin.settings, { token }),
    enabled,
    staleTime: 60_000,
  })
}
