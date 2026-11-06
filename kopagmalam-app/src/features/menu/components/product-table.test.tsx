import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import type { Product } from "@/lib/api/types"
import { ProductTable } from "./product-table"

const product: Product = {
  id: 1,
  category_id: 2,
  brand_id: null,
  name: "Kopi Susu Gula Aren",
  slug: "kopi-susu-gula-aren",
  sku: "KOPI-001",
  description: null,
  price: "25000.00",
  stock: 12,
  min_stock: 3,
  unit: "cup",
  is_active: true,
  is_featured: false,
  category: {
    id: 2,
    parent_id: null,
    name: "Kopi",
    slug: "kopi",
    description: null,
    image: null,
    sort_order: 1,
    is_active: true,
  },
}

const baseProps = {
  products: [product],
  isLoading: false,
  isError: false,
  onRetry: vi.fn(),
  onEdit: vi.fn(),
  onDelete: vi.fn(),
}

describe("ProductTable", () => {
  it("menampilkan produk beserta harga dan stok", () => {
    render(<ProductTable {...baseProps} canManage={false} />)

    expect(screen.getByText("Kopi Susu Gula Aren")).toBeInTheDocument()
    expect(screen.getByText("KOPI-001")).toBeInTheDocument()
    expect(screen.getByText(/25\.000/)).toBeInTheDocument()
    expect(screen.getByText("12 cup")).toBeInTheDocument()
    expect(screen.getByText("Aktif")).toBeInTheDocument()
  })

  it("menyembunyikan aksi untuk pengguna tanpa izin kelola", () => {
    render(<ProductTable {...baseProps} canManage={false} />)

    expect(
      screen.queryByRole("button", { name: /Aksi untuk/ }),
    ).not.toBeInTheDocument()
  })

  it("menampilkan tombol aksi untuk admin atau manager", () => {
    render(<ProductTable {...baseProps} canManage />)

    expect(
      screen.getByRole("button", { name: "Aksi untuk Kopi Susu Gula Aren" }),
    ).toBeInTheDocument()
  })

  it("menampilkan pesan saat katalog gagal dimuat", () => {
    render(
      <ProductTable {...baseProps} canManage={false} isError products={[]} />,
    )

    expect(screen.getByText("Menu gagal dimuat")).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: "Coba lagi" }),
    ).toBeInTheDocument()
  })
})
