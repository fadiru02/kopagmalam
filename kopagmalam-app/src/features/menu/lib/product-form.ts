import { z } from "zod"
import type { ApiError } from "@/lib/api/client"
import { parseMoney } from "@/lib/format"
import type { Product, ProductInput } from "@/lib/api/types"

export const productFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Nama produk wajib diisi")
    .max(255, "Nama produk maksimal 255 karakter"),
  sku: z
    .string()
    .trim()
    .min(1, "SKU wajib diisi")
    .max(100, "SKU maksimal 100 karakter"),
  category_id: z.number().int().nullable(),
  brand_id: z.number().int().nullable(),
  price: z
    .number({ error: "Harga wajib diisi" })
    .min(0, "Harga tidak boleh negatif"),
  stock: z
    .number({ error: "Stok wajib diisi" })
    .int("Stok harus bilangan bulat")
    .min(0, "Stok tidak boleh negatif"),
  min_stock: z
    .number({ error: "Stok minimum wajib diisi" })
    .int("Stok minimum harus bilangan bulat")
    .min(0, "Stok minimum tidak boleh negatif"),
  unit: z
    .string()
    .trim()
    .min(1, "Satuan wajib diisi")
    .max(20, "Satuan maksimal 20 karakter"),
  description: z
    .string()
    .trim()
    .max(1000, "Deskripsi maksimal 1000 karakter"),
  is_active: z.boolean(),
  is_featured: z.boolean(),
})

export type ProductFormValues = z.infer<typeof productFormSchema>

export const emptyProductForm: ProductFormValues = {
  name: "",
  sku: "",
  category_id: null,
  brand_id: null,
  price: 0,
  stock: 0,
  min_stock: 0,
  unit: "pcs",
  description: "",
  is_active: true,
  is_featured: false,
}

export function productToFormValues(
  product: Product | null,
): ProductFormValues {
  if (!product) {
    return { ...emptyProductForm }
  }

  return {
    name: product.name,
    sku: product.sku,
    category_id: product.category_id,
    brand_id: product.brand_id,
    price: parseMoney(product.price),
    stock: product.stock,
    min_stock: product.min_stock,
    unit: product.unit,
    description: product.description ?? "",
    is_active: product.is_active,
    is_featured: product.is_featured,
  }
}

export function formValuesToInput(values: ProductFormValues): ProductInput {
  return {
    name: values.name.trim(),
    sku: values.sku.trim(),
    category_id: values.category_id,
    brand_id: values.brand_id,
    description: values.description.trim() || null,
    price: values.price,
    stock: values.stock,
    min_stock: values.min_stock,
    unit: values.unit.trim(),
    is_active: values.is_active,
    is_featured: values.is_featured,
  }
}

export function applyProductServerErrors(
  error: unknown,
  setError: (
    field: keyof ProductFormValues,
    options: { type: string; message: string },
  ) => void,
): boolean {
  const apiError = error as ApiError | null

  if (
    !apiError ||
    apiError.status !== 422 ||
    !apiError.errors ||
    typeof apiError.errors !== "object"
  ) {
    return false
  }

  let applied = false

  for (const [field, messages] of Object.entries(apiError.errors)) {
    const key = field.split(".")[0] as keyof ProductFormValues
    const message = messages[0]

    if (key in productFormSchema.shape && message) {
      setError(key, { type: "server", message })
      applied = true
    }
  }

  return applied
}
