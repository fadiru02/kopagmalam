import { useState } from "react"
import { LoaderCircle, Minus, Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { EmptyState } from "@/components/shared/empty-state"
import { formatCurrency, parseMoney } from "@/lib/format"
import type { Order } from "@/lib/api/types"
import {
  useCart,
  useClearCart,
  useRemoveCartItem,
  useUpdateCartItem,
} from "@/features/pos/hooks/use-cart"
import { useCreateOrder } from "@/features/pos/hooks/use-orders"

export function CartPanel() {
  const { data, isLoading, isError, refetch } = useCart()
  const updateItem = useUpdateCartItem()
  const removeItem = useRemoveCartItem()
  const clearCart = useClearCart()
  const createOrder = useCreateOrder()

  const [paidAmount, setPaidAmount] = useState("")
  const [lastOrder, setLastOrder] = useState<Order | null>(null)

  const cart = data?.cart
  const items = cart?.items ?? []
  const total = parseMoney(data?.total)
  const paid = parseMoney(paidAmount)
  const changePreview = paid > total ? paid - total : 0
  const canCheckout =
    items.length > 0 &&
    paid >= total &&
    total > 0 &&
    !createOrder.isPending

  async function handleCheckout() {
    try {
      const order = await createOrder.mutateAsync({
        payment_method: "cash",
        pay_now: true,
        paid_amount: paid,
        tax_total: 0,
      })
      setLastOrder(order)
      setPaidAmount("")
      toast.success(`Pesanan ${order.order_number} berhasil`)
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Pesanan gagal diproses.",
      )
    }
  }

  if (isLoading) {
    return (
      <Card className="p-4">
        <p className="text-sm text-muted-foreground">Memuat pesanan…</p>
      </Card>
    )
  }

  if (isError) {
    return (
      <Card className="p-4 text-center">
        <p className="text-sm text-muted-foreground">
          Pesanan gagal dimuat.
        </p>
        <Button
          variant="outline"
          size="sm"
          className="mt-2"
          onClick={() => void refetch()}
        >
          Coba lagi
        </Button>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {lastOrder ? (
        <Card className="border-success/30 bg-success/5 p-4">
          <p className="font-heading text-base font-bold text-success">
            Pesanan berhasil
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Nomor:{" "}
            <span className="font-mono font-semibold text-foreground">
              {lastOrder.order_number}
            </span>
          </p>
          <p className="text-sm text-muted-foreground">
            Kembalian:{" "}
            <span className="font-semibold tabular-nums text-foreground">
              {formatCurrency(lastOrder.change_amount)}
            </span>
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() => setLastOrder(null)}
          >
            Pesanan baru
          </Button>
        </Card>
      ) : null}

      <Card className="gap-0 overflow-hidden py-0">
        <CardHeader className="border-b border-border py-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">Pesanan saat ini</CardTitle>
            {items.length > 0 ? (
              <Button
                variant="ghost"
                size="sm"
                disabled={clearCart.isPending}
                onClick={() => clearCart.mutate()}
              >
                Kosongkan
              </Button>
            ) : null}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {items.length === 0 ? (
            <EmptyState
              icon={Trash2}
              title="Belum ada item"
              description="Pilih menu dari daftar untuk mulai menyusun pesanan."
            />
          ) : (
            <ul className="divide-y divide-border">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center gap-3 px-3 py-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-foreground">
                      {item.product.name}
                    </p>
                    <p className="text-xs text-muted-foreground tabular-nums">
                      {formatCurrency(item.price)} × {item.qty}
                    </p>
                  </div>

                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="icon-sm"
                      aria-label="Kurangi jumlah"
                      disabled={updateItem.isPending}
                      onClick={() =>
                        updateItem.mutate({
                          id: item.id,
                          qty: Math.max(item.qty - 1, 0),
                        })
                      }
                    >
                      <Minus aria-hidden="true" />
                    </Button>
                    <span className="w-6 text-center text-sm font-medium tabular-nums">
                      {item.qty}
                    </span>
                    <Button
                      variant="outline"
                      size="icon-sm"
                      aria-label="Tambah jumlah"
                      disabled={updateItem.isPending}
                      onClick={() =>
                        updateItem.mutate({ id: item.id, qty: item.qty + 1 })
                      }
                    >
                      <Plus aria-hidden="true" />
                    </Button>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Hapus ${item.product.name}`}
                    disabled={removeItem.isPending}
                    onClick={() => removeItem.mutate(item.id)}
                  >
                    <Trash2 aria-hidden="true" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {items.length > 0 ? (
        <Card className="p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Total</span>
            <span className="font-heading text-lg font-bold tabular-nums">
              {formatCurrency(total)}
            </span>
          </div>

          <div className="mt-3 space-y-1.5">
            <label
              htmlFor="paid-amount"
              className="text-sm font-semibold text-foreground"
            >
              Uang diterima
            </label>
            <Input
              id="paid-amount"
              type="number"
              min={0}
              step="any"
              inputMode="decimal"
              value={paidAmount}
              onChange={(event) => setPaidAmount(event.target.value)}
              placeholder="0"
            />
          </div>

          <div className="mt-2 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Kembalian</span>
            <span className="font-semibold tabular-nums">
              {formatCurrency(changePreview)}
            </span>
          </div>

          <Button
            size="lg"
            className="mt-3 w-full"
            disabled={!canCheckout}
            onClick={() => void handleCheckout()}
          >
            {createOrder.isPending ? (
              <LoaderCircle className="animate-spin" aria-hidden="true" />
            ) : null}
            {createOrder.isPending ? "Memproses…" : "Bayar tunai"}
          </Button>
        </Card>
      ) : null}
    </div>
  )
}
