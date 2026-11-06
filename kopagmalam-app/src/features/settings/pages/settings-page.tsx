import { LogOut, Printer, Store, UserRound } from "lucide-react"
import { useNavigate } from "react-router"
import { PageHeader } from "@/components/shared/page-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { canManage, useAuthStore } from "@/lib/stores/auth"
import { useSettings } from "@/features/settings/hooks/use-settings"

export function SettingsPage() {
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const navigate = useNavigate()
  const canViewSettings = canManage(user)
  const settings = useSettings(canViewSettings)

  async function handleLogout() {
    await logout()
    navigate("/login", { replace: true })
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Pengaturan"
        description="Profil, perangkat, dan sesi."
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <UserRound className="size-4" aria-hidden="true" />
            Profil
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="font-heading text-lg font-bold">{user?.name}</p>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {user?.roles.map((role) => (
              <Badge key={role.id} variant="secondary">
                {role.name}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {canViewSettings ? (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Store className="size-4" aria-hidden="true" />
                Toko
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {settings.isLoading ? (
                <p className="text-muted-foreground">Memuat pengaturan…</p>
              ) : settings.isError ? (
                <p className="text-destructive">
                  Pengaturan gagal dimuat.
                </p>
              ) : (
                <>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-muted-foreground">Nama toko</span>
                    <span className="font-medium">
                      {settings.data?.general.store_name ??
                        (import.meta.env.VITE_STORE_NAME ?? "Kopag Malam")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-muted-foreground">Alamat</span>
                    <span className="text-right font-medium">
                      {settings.data?.general.store_address ?? "-"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-muted-foreground">Telepon</span>
                    <span className="font-medium">
                      {settings.data?.general.store_phone ?? "-"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-muted-foreground">Mata uang</span>
                    <span className="font-medium">
                      {settings.data?.general.currency ?? "IDR"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-muted-foreground">Pajak</span>
                    <span className="font-medium tabular-nums">
                      {settings.data?.general.tax_rate ?? 0}%
                    </span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Store className="size-4" aria-hidden="true" />
                Pembayaran
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {settings.isLoading ? (
                <p className="text-muted-foreground">Memuat…</p>
              ) : settings.isError ? (
                <p className="text-destructive">
                  Pengaturan gagal dimuat.
                </p>
              ) : (
                <>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-muted-foreground">Tunai</span>
                    <span className="font-medium">
                      {settings.data?.payment.cash_enabled
                        ? "Aktif"
                        : "Nonaktif"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-muted-foreground">Midtrans</span>
                    <span className="font-medium">
                      {settings.data?.payment.midtrans_enabled
                        ? "Aktif"
                        : "Nonaktif"}
                    </span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <Printer className="size-4" aria-hidden="true" />
            Printer
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Integrasi printer dan cash drawer akan tersedia pada pembaruan
          berikutnya.
        </CardContent>
      </Card>

      <Button
        variant="destructive"
        size="lg"
        className="w-full"
        onClick={handleLogout}
      >
        <LogOut aria-hidden="true" />
        Keluar
      </Button>
    </div>
  )
}
