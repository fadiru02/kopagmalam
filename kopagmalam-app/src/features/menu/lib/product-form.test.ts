import { describe, expect, it } from "vitest"
import {
  emptyProductForm,
  formValuesToInput,
  productFormSchema,
} from "./product-form"

describe("productFormSchema", () => {
  it("lolos untuk data valid", () => {
    const result = productFormSchema.safeParse({
      ...emptyProductForm,
      name: "Kopi Susu",
      sku: "KOPI-001",
      price: 25000,
      stock: 10,
      min_stock: 2,
    })

    expect(result.success).toBe(true)
  })

  it("menolak nama kosong", () => {
    const result = productFormSchema.safeParse({
      ...emptyProductForm,
      name: "   ",
      sku: "KOPI-001",
    })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe("Nama produk wajib diisi")
    }
  })

  it("menolak harga negatif dan stok desimal", () => {
    const result = productFormSchema.safeParse({
      ...emptyProductForm,
      name: "Americano",
      sku: "AME-001",
      price: -1,
      stock: 1.5,
    })

    expect(result.success).toBe(false)
  })
})

describe("formValuesToInput", () => {
  it("mengubah teks kosong menjadi null", () => {
    const input = formValuesToInput({
      ...emptyProductForm,
      name: "  Latte  ",
      sku: " LAT-001 ",
      description: "  ",
      unit: " cup ",
    })

    expect(input.name).toBe("Latte")
    expect(input.sku).toBe("LAT-001")
    expect(input.description).toBeNull()
    expect(input.unit).toBe("cup")
  })
})
