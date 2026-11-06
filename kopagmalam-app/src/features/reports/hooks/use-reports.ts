import { useQuery } from "@tanstack/react-query"
import { apiRequest, buildQuery } from "@/lib/api/client"
import { endpoints } from "@/lib/api/endpoints"
import type {
  DailyReportRow,
  SalesReportResponse,
  TopProductReport,
} from "@/lib/api/types"
import { useAuthStore } from "@/lib/stores/auth"

const REPORTS_STALE_TIME = 60_000

export function useSalesReport(from: string, to: string) {
  const token = useAuthStore((state) => state.token)

  return useQuery({
    queryKey: ["reports", "sales", from, to],
    queryFn: () =>
      apiRequest<SalesReportResponse>(
        `${endpoints.admin.reports.sales}${buildQuery({ from, to })}`,
        { token },
      ),
    staleTime: REPORTS_STALE_TIME,
  })
}

export function useTopProductsReport(from: string, to: string, limit = 10) {
  const token = useAuthStore((state) => state.token)

  return useQuery({
    queryKey: ["reports", "top-products", from, to, limit],
    queryFn: () =>
      apiRequest<TopProductReport[]>(
        `${endpoints.admin.reports.topProducts}${buildQuery({ from, to, limit })}`,
        { token },
      ),
    staleTime: REPORTS_STALE_TIME,
  })
}

export function useDailyReport(from: string, to: string) {
  const token = useAuthStore((state) => state.token)

  return useQuery({
    queryKey: ["reports", "daily", from, to],
    queryFn: () =>
      apiRequest<DailyReportRow[]>(
        `${endpoints.admin.reports.daily}${buildQuery({ from, to })}`,
        { token },
      ),
    staleTime: REPORTS_STALE_TIME,
  })
}
