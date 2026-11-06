import { useState } from "react"
import { LoaderCircle, Package } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { EmptyState } from "@/components/shared/empty-state"
import { PageHeader } from "@/components/shared/page-header"
import { formatDateTime } from "@/lib/format"
import type { ProductListParams } from "@/lib/api/types"
import {
  useStockAdjust,
  useStockMovements,
} from "@/features/inventory/hooks/use-stock"
import { useProducts } from "@/features/menu/hooks/use-products"

const PRODUCT_PARAMS: ProductListParams = {
  page: 1,
  perPage: 100,
  search: "",
  status: "all",
  categoryId: null,
}

export function InventoryPage() {
  const { data: productsData } = useProducts(PRODUCT_PARAMS)
  const products = productsData?.data ?? []

  const [productId, setProductId] = useState<number | null>(null)
  const [type, setType] = useState<"in" | "out" | "adjustment">("in")
  const [qty, setQty] = useState("")
  const [note, setNote] = useState("")
  const [page, setPage] = useState(1)

  const movements = useStockMovements(page, 15)
  const adjust = useStockAdjust()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!productId) {
      toast.error("Pilih produk terlebih dahulu.")
      return
    }

    const quantity = Number(qty)
    if (!Number.isFinite(quantity) || quantity === 0) {
      toast.error("Jumlah harus berupa angka selain nol.")
      return
    }

    try {
      await adjust.mutateAsync({
        product_id: productId,
        type,
        qty: quantity,
        note: note.trim() || undefined,
      })
      toast.success("Stok berhasil disesuaikan.")
      setQty("")
      setNote("")
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Gagal menyesuaikan stok.",
      )
    }
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Inventaris"
        description="Koreksi stok dan riwayat pergerakan."
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Koreksi stok</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="stock-product">Produk</Label>
              <Select
                value={productId === null ? "" : String(productId)}
                onValueChange={(value) =>
                  setProductId(value ? Number(value) : null)
                }
              >
                <SelectTrigger id="stock-product" className="h-9 w-full">
                  <SelectValue placeholder="Pilih produk" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={String(product.id)}>
                      {product.name} ({product.sku}) — stok {product.stock}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="stock-type">Tipe</Label>
                <Select
                  value={type}
                  onValueChange={(value) =>
                    setType(value as "in" | "out" | "adjustment")
                  }
                >
                  <SelectTrigger id="stock-type" className="h-9 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="in">Masuk (+)</SelectItem>
                    <SelectItem value="out">Keluar (-)</SelectItem>
                    <SelectItem value="adjustment">Penyesuaian</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="stock-qty">Jumlah</Label>
                <Input
                  id="stock-qty"
                  type="number"
                  step={1}
                  inputMode="numeric"
                  value={qty}
                  onChange={(event) => setQty(event.target.value)}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="stock-note">Catatan</Label>
              <Textarea
                id="stock-note"
                value={note}
                onChange={(event) => setNote(event.target.value)}
                placeholder="Opsional"
              />
            </div>

            <Button type="submit" disabled={adjust.isPending}>
              {adjust.isPending ? (
                <LoaderCircle className="animate-spin" aria-hidden="true" />
              ) : null}
              {adjust.isPending ? "Menyimpan…" : "Simpan koreksi"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="gap-0 overflow-hidden py-0">
        <CardHeader className="border-b border-border py-3">
          <CardTitle className="text-sm">Riwayat pergerakan</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {movements.isLoading ? (
            <p className="p-4 text-sm text-muted-foreground">
              Memuat riwayat…
            </p>
          ) : movements.isError ? (
            <p className="p-4 text-sm text-destructive">
              Riwayat gagal dimuat.
            </p>
          ) : (movements.data?.data ?? []).length === 0 ? (
            <EmptyState
              icon={Package}
              title="Belum ada pergerakan"
              description="Koreksi stok akan tercatat di sini."
            />
          ) : (
            <ul className="divide-y divide-border">
              {(movements.data?.data ?? []).map((movement) => (
                <li key={movement.id} className="px-3 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-medium text-foreground">
                        {movement.product?.name ?? "Produk"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {movement.type} · {movement.note ?? "-"} ·{" "}
                        {movement.user?.name ?? "-"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold tabular-nums">
                        {movement.qty > 0 ? "+" : ""}
                        {movement.qty}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {formatDateTime(movement.created_at)}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {movements.data && movements.data.last_page > 1 ? (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((current) => Math.max(current - 1, 1))}
          >
            Sebelumnya
          </Button>
          <span className="text-sm tabular-nums">
            {page} / {movements.data.last_page}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= movements.data.last_page}
            onClick={() =>
              setPage((current) =>
                Math.min(current + 1, movements.data!.last_page),
              )
            }
          >
            Berikutnya
          </Button>
        </div>
      ) : null}
    </div>
  )
}
