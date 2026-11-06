import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ProductPaginationProps {
  page: number
  lastPage: number
  total: number
  from: number | null
  to: number | null
  disabled?: boolean
  onPrevious: () => void
  onNext: () => void
}

export function ProductPagination({
  page,
  lastPage,
  total,
  from,
  to,
  disabled = false,
  onPrevious,
  onNext,
}: ProductPaginationProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <p className="text-sm text-muted-foreground tabular-nums">
        Menampilkan {from ?? 0}–{to ?? 0} dari {total}
      </p>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon-sm"
          aria-label="Halaman sebelumnya"
          disabled={disabled || page <= 1}
          onClick={onPrevious}
        >
          <ChevronLeft aria-hidden="true" />
        </Button>
        <span className="text-sm font-medium tabular-nums">
          {page} / {Math.max(lastPage, 1)}
        </span>
        <Button
          variant="outline"
          size="icon-sm"
          aria-label="Halaman berikutnya"
          disabled={disabled || page >= lastPage}
          onClick={onNext}
        >
          <ChevronRight aria-hidden="true" />
        </Button>
      </div>
    </div>
  )
}
