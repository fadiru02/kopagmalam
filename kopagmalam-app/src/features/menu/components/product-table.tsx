import {
  CircleAlert,
  Ellipsis,
  PackageOpen,
  Pencil,
  Star,
  Trash2,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { Product } from "@/lib/api/types"
import { formatCurrency } from "@/lib/format"
import { cn } from "@/lib/utils"

interface ProductTableProps {
  products: Product[]
  isLoading: boolean
  isError: boolean
  canManage: boolean
  onRetry: () => void
  onEdit: (product: Product) => void
  onDelete: (product: Product) => void
}

const SKELETON_ROWS = 5

export function ProductTable({
  products,
  isLoading,
  isError,
  canManage,
  onRetry,
  onEdit,
  onDelete,
}: ProductTableProps) {
  return (
    <Card className="gap-0 overflow-hidden py-0">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="pl-4">Produk</TableHead>
            <TableHead className="hidden md:table-cell">Kategori</TableHead>
            <TableHead className="text-right">Harga</TableHead>
            <TableHead>Stok</TableHead>
            <TableHead>Status</TableHead>
            {canManage ? (
              <TableHead className="w-12 pr-4 text-right">
                <span className="sr-only">Aksi</span>
              </TableHead>
            ) : null}
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading ? (
            Array.from({ length: SKELETON_ROWS }).map((_, index) => (
              <TableRow key={index}>
                <TableCell className="pl-4">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="mt-1.5 h-3 w-20" />
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <Skeleton className="h-4 w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="ml-auto h-4 w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-14 rounded-full" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-16 rounded-full" />
                </TableCell>
                {canManage ? (
                  <TableCell className="pr-4">
                    <Skeleton className="ml-auto size-8" />
                  </TableCell>
                ) : null}
              </TableRow>
            ))
          ) : isError ? (
            <TableRow>
              <TableCell colSpan={canManage ? 6 : 5} className="py-10">
                <div className="flex flex-col items-center gap-2 text-center">
                  <CircleAlert
                    className="size-6 text-destructive"
                    aria-hidden="true"
                  />
                  <p className="font-medium text-foreground">
                    Menu gagal dimuat
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Periksa koneksi lalu coba lagi.
                  </p>
                  <Button variant="outline" size="sm" onClick={onRetry}>
                    Coba lagi
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ) : products.length === 0 ? (
            <TableRow>
              <TableCell colSpan={canManage ? 6 : 5} className="py-10">
                <div className="flex flex-col items-center gap-2 text-center">
                  <PackageOpen
                    className="size-6 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <p className="font-medium text-foreground">
                    Tidak ada produk
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Ubah kata kunci atau filter untuk melihat produk lain.
                  </p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            products.map((product) => {
              const isLowStock = product.stock <= product.min_stock

              return (
                <TableRow key={product.id}>
                  <TableCell className="pl-4 whitespace-normal">
                    <div className="flex items-center gap-1.5">
                      <span className="font-medium text-foreground">
                        {product.name}
                      </span>
                      {product.is_featured ? (
                        <Star
                          className="size-3.5 shrink-0 fill-current text-warning"
                          aria-label="Produk unggulan"
                        />
                      ) : null}
                    </div>
                    <p className="mt-0.5 font-mono text-xs text-muted-foreground">
                      {product.sku}
                    </p>
                  </TableCell>

                  <TableCell className="hidden text-muted-foreground md:table-cell">
                    {product.category?.name ?? "—"}
                  </TableCell>

                  <TableCell className="text-right font-medium tabular-nums">
                    {formatCurrency(product.price)}
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant={isLowStock ? "destructive" : "secondary"}
                      className="tabular-nums"
                    >
                      {product.stock} {product.unit}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant={product.is_active ? "secondary" : "outline"}
                      className={cn(
                        !product.is_active && "text-muted-foreground",
                      )}
                    >
                      {product.is_active ? "Aktif" : "Nonaktif"}
                    </Badge>
                  </TableCell>

                  {canManage ? (
                    <TableCell className="pr-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            aria-label={`Aksi untuk ${product.name}`}
                          >
                            <Ellipsis aria-hidden="true" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onSelect={() => onEdit(product)}>
                            <Pencil aria-hidden="true" />
                            Ubah
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            variant="destructive"
                            onSelect={() => onDelete(product)}
                          >
                            <Trash2 aria-hidden="true" />
                            Hapus
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  ) : null}
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>
    </Card>
  )
}
