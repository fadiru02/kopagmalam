import { useMemo, useState } from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { ChartColumn, ShieldAlert } from "lucide-react"
import { KpiCard } from "@/components/shared/kpi-card"
import { PageHeader } from "@/components/shared/page-header"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { canManage, useAuthStore } from "@/lib/stores/auth"
import { formatCurrency, parseMoney } from "@/lib/format"
import {
  useDailyReport,
  useSalesReport,
  useTopProductsReport,
} from "@/features/reports/hooks/use-reports"

function toDateInput(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

export function ReportsPage() {
  const user = useAuthStore((state) => state.user)

  const today = new Date()
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)

  const [from, setFrom] = useState(toDateInput(monthStart))
  const [to, setTo] = useState(toDateInput(today))

  const sales = useSalesReport(from, to)
  const topProducts = useTopProductsReport(from, to, 8)
  const daily = useDailyReport(from, to)

  const summary = sales.data?.summary
  const chartData = useMemo(
    () =>
      (daily.data ?? []).map((row) => ({
        date: row.date.slice(5),
        revenue: parseMoney(row.revenue),
        orders: row.orders,
      })),
    [daily.data],
  )

  if (!canManage(user)) {
    return (
      <div className="space-y-5">
        <PageHeader title="Laporan" />
        <Card>
          <CardContent className="flex flex-col items-center py-10 text-center">
            <ShieldAlert
              className="size-8 text-warning"
              aria-hidden="true"
            />
            <p className="mt-3 font-heading text-base font-bold">
              Akses terbatas
            </p>
            <p className="mt-1 max-w-xs text-sm text-muted-foreground">
              Laporan penjualan hanya tersedia untuk admin dan manager.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Laporan"
        description="Ringkasan penjualan dan performa menu."
      />

      <Card size="sm">
        <CardContent className="flex flex-wrap items-end gap-3">
          <div className="space-y-1.5">
            <label
              htmlFor="report-from"
              className="text-xs font-medium text-muted-foreground"
            >
              Dari
            </label>
            <Input
              id="report-from"
              type="date"
              value={from}
              onChange={(event) => setFrom(event.target.value)}
              className="h-9"
            />
          </div>
          <div className="space-y-1.5">
            <label
              htmlFor="report-to"
              className="text-xs font-medium text-muted-foreground"
            >
              Sampai
            </label>
            <Input
              id="report-to"
              type="date"
              value={to}
              onChange={(event) => setTo(event.target.value)}
              className="h-9"
            />
          </div>
        </CardContent>
      </Card>

      {sales.isLoading ? (
        <p className="text-sm text-muted-foreground">Memuat laporan…</p>
      ) : sales.isError ? (
        <p className="text-sm text-destructive">Laporan gagal dimuat.</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <KpiCard
            label="Order lunas"
            value={summary?.orders_count ?? 0}
            hint="Periode ini"
          />
          <KpiCard
            label="Omset"
            value={formatCurrency(summary?.revenue)}
            hint="Periode ini"
            tone="success"
          />
          <KpiCard
            label="Diskon"
            value={formatCurrency(summary?.discount)}
            hint="Periode ini"
          />
          <KpiCard
            label="Pajak"
            value={formatCurrency(summary?.tax)}
            hint="Periode ini"
          />
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <ChartColumn className="size-4" aria-hidden="true" />
            Ritme penjualan
          </CardTitle>
        </CardHeader>
        <CardContent>
          {daily.isLoading ? (
            <div className="flex h-48 items-center justify-center rounded-xl bg-muted text-sm text-muted-foreground">
              Memuat grafik…
            </div>
          ) : chartData.length === 0 ? (
            <div className="flex h-48 items-center justify-center rounded-xl bg-muted text-sm text-muted-foreground">
              Belum ada data penjualan.
            </div>
          ) : (
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" fontSize={11} />
                  <YAxis fontSize={11} />
                  <Tooltip
                    formatter={(value) => formatCurrency(value as number)}
                  />
                  <Bar dataKey="revenue" fill="var(--color-primary)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Menu terlaris</CardTitle>
        </CardHeader>
        <CardContent>
          {topProducts.isLoading ? (
            <p className="text-sm text-muted-foreground">Memuat…</p>
          ) : (topProducts.data ?? []).length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Belum ada data.
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {(topProducts.data ?? []).map((item, index) => (
                <li
                  key={`${item.product_id ?? index}`}
                  className="flex items-center justify-between gap-3 py-2"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium text-foreground">
                      {index + 1}. {item.name}
                    </p>
                    <p className="text-xs text-muted-foreground tabular-nums">
                      {item.qty_sold} terjual
                    </p>
                  </div>
                  <span className="text-sm font-semibold tabular-nums">
                    {formatCurrency(item.revenue)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
