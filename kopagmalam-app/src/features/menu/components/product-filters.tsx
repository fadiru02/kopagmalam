import { RotateCcw, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Category, ProductStatusFilter } from "@/lib/api/types"

interface ProductFiltersProps {
  search: string
  onSearchChange: (value: string) => void
  status: ProductStatusFilter
  onStatusChange: (value: ProductStatusFilter) => void
  categoryId: number | null
  onCategoryChange: (value: number | null) => void
  categories: Category[]
  onReset: () => void
  canReset: boolean
}

export function ProductFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
  categoryId,
  onCategoryChange,
  categories,
  onReset,
  canReset,
}: ProductFiltersProps) {
  return (
    <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
      <div className="relative flex-1">
        <Search
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          type="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Cari nama atau SKU"
          aria-label="Cari produk"
          className="h-10 pl-9"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Select
          value={status}
          onValueChange={(value) =>
            onStatusChange(value as ProductStatusFilter)
          }
        >
          <SelectTrigger
            className="h-10 w-36"
            aria-label="Filter status produk"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua status</SelectItem>
            <SelectItem value="active">Aktif</SelectItem>
            <SelectItem value="inactive">Nonaktif</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={categoryId === null ? "all" : String(categoryId)}
          onValueChange={(value) =>
            onCategoryChange(value === "all" ? null : Number(value))
          }
        >
          <SelectTrigger
            className="h-10 w-40"
            aria-label="Filter kategori produk"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua kategori</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={String(category.id)}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {canReset ? (
          <Button variant="ghost" size="sm" onClick={onReset}>
            <RotateCcw aria-hidden="true" />
            Reset
          </Button>
        ) : null}
      </div>
    </div>
  )
}
