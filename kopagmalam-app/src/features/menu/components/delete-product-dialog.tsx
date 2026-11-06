import { LoaderCircle } from "lucide-react"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { ApiError } from "@/lib/api/client"
import type { Product } from "@/lib/api/types"
import { useDeleteProduct } from "@/features/menu/hooks/use-product-mutations"

interface DeleteProductDialogProps {
  product: Product | null
  onClose: () => void
}

export function DeleteProductDialog({
  product,
  onClose,
}: DeleteProductDialogProps) {
  const deleteProduct = useDeleteProduct()

  async function handleDelete() {
    if (!product) {
      return
    }

    try {
      await deleteProduct.mutateAsync(product.id)
      toast.success("Produk berhasil dihapus")
    } catch (error) {
      toast.error(
        error instanceof ApiError
          ? error.message
          : "Produk tidak dapat dihapus. Coba lagi.",
      )
    } finally {
      onClose()
    }
  }

  return (
    <AlertDialog
      open={product !== null}
      onOpenChange={(open) => {
        if (!open) {
          onClose()
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus produk?</AlertDialogTitle>
          <AlertDialogDescription>
            {product?.name} akan dihapus dari katalog. Tindakan ini tidak dapat
            dibatalkan.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteProduct.isPending}>
            Batal
          </AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={deleteProduct.isPending}
            onClick={(event) => {
              event.preventDefault()
              void handleDelete()
            }}
          >
            {deleteProduct.isPending ? (
              <LoaderCircle className="animate-spin" aria-hidden="true" />
            ) : null}
            {deleteProduct.isPending ? "Menghapus…" : "Hapus"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
