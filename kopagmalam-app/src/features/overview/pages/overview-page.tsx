import {
  ArrowRight,
  Calculator,
  ListOrdered,
  Package,
  TriangleAlert,
} from "lucide-react"
import { Link } from "react-router"
import { EmptyState } from "@/components/shared/empty-state"
import { KpiCard } from "@/components/shared/kpi-card"
import { PageHeader } from "@/components/shared/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { canManage, useAuthStore } from "@/lib/stores/auth"

export function OverviewPage() {
  const user = useAuthStore((state) => state.user)
  const canViewReports = canManage(user)

  return (
    <div className="space-y-5">
      <PageHeader
        title={`Halo, ${user?.name ?? "Staff"}`}
        description="Ringkasan operasional shift hari ini."
      />

      <div className="grid grid-cols-2 gap-3">
        <KpiCard label="Omset hari ini" value="—" hint="Menunggu data" />
        <KpiCard label="Order lunas" value="—" hint="Menunggu data" />
        <KpiCard
          label="Antrean aktif"
          value="—"
          hint="Menunggu data"
          tone="info"
        />
        <KpiCard
          label="Rata-rata order"
          value="—"
          hint="Menunggu data"
          tone="success"
        />
      </div>

      <section>
        <h2 className="mb-2 font-heading text-sm font-bold text-foreground">
          Aksi cepat
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <Button asChild size="lg" className="justify-start">
            <Link to="/cash">
              <Calculator aria-hidden="true" />
              Kasir baru
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="justify-start"
          >
            <Link to="/queue">
              <ListOrdered aria-hidden="true" />
              Lihat antrean
            </Link>
          </Button>
        </div>
      </section>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <TriangleAlert
              className="size-4 text-warning"
              aria-hidden="true"
            />
            Stok kritis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={Package}
            title="Belum ada data stok"
            description="Produk dengan stok menipis akan tampil di sini."
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle className="text-sm">Antrean seduh</CardTitle>
          <Button asChild variant="ghost" size="sm">
            <Link to="/queue">
              Semua
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={ListOrdered}
            title="Antrean kosong"
            description="Tiket baru muncul otomatis dari order yang sudah lunas."
          />
        </CardContent>
      </Card>

      {canViewReports ? (
        <Button asChild variant="outline" className="w-full" size="lg">
          <Link to="/reports">
            Buka laporan penjualan
            <ArrowRight aria-hidden="true" />
          </Link>
        </Button>
      ) : null}
    </div>
  )
}
