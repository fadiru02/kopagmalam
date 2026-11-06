import { Link } from "react-router"
import { Button } from "@/components/ui/button"

export function NotFoundPage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-background px-6 text-center">
      <p className="font-heading text-5xl font-extrabold text-primary">404</p>
      <h1 className="font-heading text-lg font-bold">Halaman tidak ditemukan</h1>
      <p className="max-w-xs text-sm text-muted-foreground">
        Tautan yang dibuka tidak tersedia di aplikasi POS.
      </p>
      <Button asChild>
        <Link to="/overview">Kembali ke Overview</Link>
      </Button>
    </div>
  )
}
