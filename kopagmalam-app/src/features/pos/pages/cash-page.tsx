import { PageHeader } from "@/components/shared/page-header"
import { useAddToCart } from "@/features/pos/hooks/use-cart"
import { CartPanel } from "@/features/pos/components/cart-panel"
import { ProductPicker } from "@/features/pos/components/product-picker"

export function CashPage() {
  const addToCart = useAddToCart()

  return (
    <div className="space-y-5">
      <PageHeader
        title="Kasir"
        description="Pilih menu, susun pesanan, lalu bayar tunai."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <ProductPicker
          onAdd={(product) =>
            addToCart.mutate({ productId: product.id, qty: 1 })
          }
          isAdding={addToCart.isPending}
        />
        <CartPanel />
      </div>
    </div>
  )
}
