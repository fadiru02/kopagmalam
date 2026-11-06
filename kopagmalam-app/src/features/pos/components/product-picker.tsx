import { useState } from "react"
import { Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import type { Product } from "@/lib/api/types"
import { formatCurrency } from "@/lib/format"
import { useDebouncedValue } from "@/features/menu/hooks/use-debounced-value"
import { useProducts } from "@/features/menu/hooks/use-products"

interface ProductPickerProps {
  onAdd: (product: Product) => void
  isAdding: boolean
}

const PAGE_SIZE = 12

export function ProductPicker({ onAdd, isAdding }: ProductPickerProps) {
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const debouncedSearch = useDebouncedValue(search, 300)

  function handleSearchChange(value: string) {
    setSearch(value)
    setPage(1)
  }

  const { data, isLoading, isError, refetch } = useProducts({
    page,
    perPage: PAGE_SIZE,
    search: debouncedSearch,
    status: "active",
    categoryId: null,
  })

  const products = data?.data ?? []

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          type="search"
          value={search}
          onChange={(event) => handleSearchChange(event.target.value)}
          placeholder="Cari menu"
          aria-label="Cari menu"
          className="h-10 pl-9"
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-24 rounded-xl" />
          ))}
        </div>
      ) : isError ? (
        <Card className="p-4 text-center">
          <p className="text-sm text-muted-foreground">
            Menu gagal dimuat.
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
      ) : products.length === 0 ? (
        <Card className="p-4 text-center">
          <p className="text-sm text-muted-foreground">
            Tidak ada menu yang cocok.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {products.map((product) => (
            <Card
              key={product.id}
              className="flex flex-col justify-between gap-2 p-3"
            >
              <div>
                <p className="font-medium text-foreground line-clamp-2">
                  {product.name}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {product.sku}
                </p>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-semibold tabular-nums">
                  {formatCurrency(product.price)}
                </span>
                <Button
                  size="icon-sm"
                  aria-label={`Tambah ${product.name}`}
                  disabled={isAdding || product.stock <= 0}
                  onClick={() => onAdd(product)}
                >
                  <Plus aria-hidden="true" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {data && data.last_page > 1 ? (
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
            {page} / {data.last_page}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= data.last_page}
            onClick={() =>
              setPage((current) => Math.min(current + 1, data.last_page))
            }
          >
            Berikutnya
          </Button>
        </div>
      ) : null}
    </div>
  )
}
