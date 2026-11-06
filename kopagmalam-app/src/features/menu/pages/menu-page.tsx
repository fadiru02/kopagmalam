import { useState } from "react"
import { Plus } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { Button } from "@/components/ui/button"
import type { Product, ProductListParams } from "@/lib/api/types"
import { canManage, useAuthStore } from "@/lib/stores/auth"
import { DeleteProductDialog } from "@/features/menu/components/delete-product-dialog"
import { ProductFilters } from "@/features/menu/components/product-filters"
import { ProductFormDialog } from "@/features/menu/components/product-form-dialog"
import { ProductPagination } from "@/features/menu/components/product-pagination"
import { ProductTable } from "@/features/menu/components/product-table"
import { useDebouncedValue } from "@/features/menu/hooks/use-debounced-value"
import { useCategories } from "@/features/menu/hooks/use-product-options"
import { useProducts } from "@/features/menu/hooks/use-products"

const PAGE_SIZE = 20

export function MenuPage() {
  const user = useAuthStore((state) => state.user)
  const canEdit = canManage(user)

  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState<ProductListParams["status"]>("all")
  const [categoryId, setCategoryId] = useState<number | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null)

  const debouncedSearch = useDebouncedValue(search, 300)
  const { categories } = useCategories()

  const { data, isLoading, isError, isFetching, refetch } = useProducts({
    page,
    perPage: PAGE_SIZE,
    search: debouncedSearch,
    status,
    categoryId,
  })

  const products = data?.data ?? []

  function openCreateDialog() {
    setEditingProduct(null)
    setFormOpen(true)
  }

  function openEditDialog(product: Product) {
    setEditingProduct(product)
    setFormOpen(true)
  }

  function resetFilters() {
    setSearch("")
    setStatus("all")
    setCategoryId(null)
    setPage(1)
  }

  function handleSearchChange(value: string) {
    setSearch(value)
    setPage(1)
  }

  function handleStatusChange(value: ProductListParams["status"]) {
    setStatus(value)
    setPage(1)
  }

  function handleCategoryChange(value: number | null) {
    setCategoryId(value)
    setPage(1)
  }

  const hasActiveFilters =
    search.trim().length > 0 || status !== "all" || categoryId !== null

  return (
    <div className="space-y-5">
      <PageHeader
        title="Menu"
        description="Kelola katalog, harga, dan ketersediaan produk."
        action={
          canEdit ? (
            <Button size="sm" onClick={openCreateDialog}>
              <Plus aria-hidden="true" />
              Tambah
            </Button>
          ) : null
        }
      />

      {!canEdit ? (
        <p className="rounded-xl bg-muted px-3 py-2 text-sm text-muted-foreground">
          Anda dapat melihat katalog. Perubahan menu hanya tersedia untuk admin
          dan manager.
        </p>
      ) : null}

      <ProductFilters
        search={search}
        onSearchChange={handleSearchChange}
        status={status}
        onStatusChange={handleStatusChange}
        categoryId={categoryId}
        onCategoryChange={handleCategoryChange}
        categories={categories}
        onReset={resetFilters}
        canReset={hasActiveFilters}
      />

      <ProductTable
        products={products}
        isLoading={isLoading}
        isError={isError}
        canManage={canEdit}
        onRetry={() => void refetch()}
        onEdit={openEditDialog}
        onDelete={setDeletingProduct}
      />

      {data && data.total > 0 ? (
        <ProductPagination
          page={data.current_page}
          lastPage={data.last_page}
          total={data.total}
          from={data.from}
          to={data.to}
          disabled={isFetching}
          onPrevious={() => setPage((current) => Math.max(current - 1, 1))}
          onNext={() =>
            setPage((current) => Math.min(current + 1, data.last_page))
          }
        />
      ) : null}

      <ProductFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        product={editingProduct}
      />

      <DeleteProductDialog
        product={deletingProduct}
        onClose={() => setDeletingProduct(null)}
      />
    </div>
  )
}
