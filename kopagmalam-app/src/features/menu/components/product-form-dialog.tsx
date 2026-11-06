import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { LoaderCircle } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ApiError, apiRequest } from "@/lib/api/client"
import { endpoints } from "@/lib/api/endpoints"
import type { Product } from "@/lib/api/types"
import { useAuthStore } from "@/lib/stores/auth"
import {
  applyProductServerErrors,
  emptyProductForm,
  formValuesToInput,
  productFormSchema,
  productToFormValues,
  type ProductFormValues,
} from "@/features/menu/lib/product-form"
import {
  useCreateProduct,
  useUpdateProduct,
} from "@/features/menu/hooks/use-product-mutations"
import {
  useBrands,
  useCategories,
} from "@/features/menu/hooks/use-product-options"

interface ProductFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: Product | null
}

interface FieldProps {
  label: string
  htmlFor: string
  error?: string
  children: React.ReactNode
}

function Field({ label, htmlFor, error, children }: FieldProps) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {error ? (
        <p className="text-xs font-medium text-destructive">{error}</p>
      ) : null}
    </div>
  )
}

export function ProductFormDialog({
  open,
  onOpenChange,
  product,
}: ProductFormDialogProps) {
  const token = useAuthStore((state) => state.token)
  const { categories } = useCategories()
  const { brands } = useBrands()
  const createProduct = useCreateProduct()
  const updateProduct = useUpdateProduct()
  const isPending = createProduct.isPending || updateProduct.isPending
  const isEditing = product !== null
  const [files, setFiles] = useState<File[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const isBusy = isPending || isUploading

  const {
    register,
    handleSubmit,
    control,
    reset,
    setError,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: emptyProductForm,
  })

  useEffect(() => {
    if (open) {
      reset(productToFormValues(product))
      setFiles([])
    }
  }, [open, product, reset])

  async function onSubmit(values: ProductFormValues) {
    const input = formValuesToInput(values)

    try {
      const saved = product
        ? await updateProduct.mutateAsync({ id: product.id, input })
        : await createProduct.mutateAsync(input)

      if (files.length > 0) {
        setIsUploading(true)
        const formData = new FormData()
        files.forEach((file) => formData.append("images[]", file))

        try {
          await apiRequest(endpoints.admin.productMedia(saved.id), {
            method: "POST",
            body: formData,
            token,
          })
        } catch {
          toast.warning(
            "Produk tersimpan, tetapi gambar gagal diunggah.",
          )
        } finally {
          setIsUploading(false)
        }
      }

      toast.success(
        product ? "Produk berhasil diperbarui" : "Produk berhasil ditambahkan",
      )
      onOpenChange(false)
    } catch (error) {
      if (!applyProductServerErrors(error, setError)) {
        toast.error(
          error instanceof ApiError
            ? error.message
            : "Produk tidak dapat disimpan. Coba lagi.",
        )
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Ubah produk" : "Tambah produk"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Perbarui detail menu yang tampil di katalog."
              : "Lengkapi detail menu baru untuk katalog."}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-3"
          noValidate
        >
          <Field
            label="Nama produk"
            htmlFor="product-name"
            error={errors.name?.message}
          >
            <Input
              id="product-name"
              placeholder="Contoh: Kopi Susu Gula Aren"
              aria-invalid={Boolean(errors.name)}
              {...register("name")}
            />
          </Field>

          <Field
            label="SKU"
            htmlFor="product-sku"
            error={errors.sku?.message}
          >
            <Input
              id="product-sku"
              placeholder="KOPI-001"
              aria-invalid={Boolean(errors.sku)}
              {...register("sku")}
            />
          </Field>

          <div className="grid gap-3 sm:grid-cols-2">
            <Field
              label="Harga"
              htmlFor="product-price"
              error={errors.price?.message}
            >
              <Input
                id="product-price"
                type="number"
                min={0}
                step="any"
                inputMode="decimal"
                aria-invalid={Boolean(errors.price)}
                {...register("price", { valueAsNumber: true })}
              />
            </Field>

            <Field
              label="Satuan"
              htmlFor="product-unit"
              error={errors.unit?.message}
            >
              <Input
                id="product-unit"
                placeholder="pcs"
                aria-invalid={Boolean(errors.unit)}
                {...register("unit")}
              />
            </Field>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Field
              label="Stok"
              htmlFor="product-stock"
              error={errors.stock?.message}
            >
              <Input
                id="product-stock"
                type="number"
                min={0}
                step={1}
                inputMode="numeric"
                aria-invalid={Boolean(errors.stock)}
                {...register("stock", { valueAsNumber: true })}
              />
            </Field>

            <Field
              label="Stok minimum"
              htmlFor="product-min-stock"
              error={errors.min_stock?.message}
            >
              <Input
                id="product-min-stock"
                type="number"
                min={0}
                step={1}
                inputMode="numeric"
                aria-invalid={Boolean(errors.min_stock)}
                {...register("min_stock", { valueAsNumber: true })}
              />
            </Field>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Field
              label="Kategori"
              htmlFor="product-category"
              error={errors.category_id?.message}
            >
              <Controller
                control={control}
                name="category_id"
                render={({ field }) => (
                  <Select
                    value={field.value === null ? "none" : String(field.value)}
                    onValueChange={(value) =>
                      field.onChange(value === "none" ? null : Number(value))
                    }
                  >
                    <SelectTrigger
                      id="product-category"
                      className="h-9 w-full"
                    >
                      <SelectValue placeholder="Pilih kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Tanpa kategori</SelectItem>
                      {categories.map((category) => (
                        <SelectItem
                          key={category.id}
                          value={String(category.id)}
                        >
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>

            <Field
              label="Brand"
              htmlFor="product-brand"
              error={errors.brand_id?.message}
            >
              <Controller
                control={control}
                name="brand_id"
                render={({ field }) => (
                  <Select
                    value={field.value === null ? "none" : String(field.value)}
                    onValueChange={(value) =>
                      field.onChange(value === "none" ? null : Number(value))
                    }
                  >
                    <SelectTrigger id="product-brand" className="h-9 w-full">
                      <SelectValue placeholder="Pilih brand" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Tanpa brand</SelectItem>
                      {brands.map((brand) => (
                        <SelectItem key={brand.id} value={String(brand.id)}>
                          {brand.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="product-images">Gambar (opsional)</Label>
            <Input
              id="product-images"
              type="file"
              accept="image/*"
              multiple
              onChange={(event) =>
                setFiles(Array.from(event.target.files ?? []))
              }
            />
            {files.length > 0 ? (
              <p className="text-xs text-muted-foreground">
                {files.length} file dipilih
              </p>
            ) : null}
          </div>

          <Field
            label="Deskripsi"
            htmlFor="product-description"
            error={errors.description?.message}
          >
            <Textarea
              id="product-description"
              placeholder="Catatan singkat tentang produk"
              aria-invalid={Boolean(errors.description)}
              {...register("description")}
            />
          </Field>

          <div className="flex flex-wrap gap-x-6 gap-y-2 pt-1">
            <Controller
              control={control}
              name="is_active"
              render={({ field }) => (
                <Label
                  htmlFor="product-active"
                  className="cursor-pointer font-normal"
                >
                  <Checkbox
                    id="product-active"
                    checked={field.value}
                    onCheckedChange={(checked) =>
                      field.onChange(checked === true)
                    }
                  />
                  Aktif dijual
                </Label>
              )}
            />

            <Controller
              control={control}
              name="is_featured"
              render={({ field }) => (
                <Label
                  htmlFor="product-featured"
                  className="cursor-pointer font-normal"
                >
                  <Checkbox
                    id="product-featured"
                    checked={field.value}
                    onCheckedChange={(checked) =>
                      field.onChange(checked === true)
                    }
                  />
                  Tampilkan sebagai unggulan
                </Label>
              )}
            />
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isBusy}
            >
              Batal
            </Button>
            <Button type="submit" disabled={isBusy}>
              {isBusy ? (
                <LoaderCircle className="animate-spin" aria-hidden="true" />
              ) : null}
              {isBusy
                ? "Menyimpan…"
                : isEditing
                  ? "Simpan perubahan"
                  : "Tambah produk"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
