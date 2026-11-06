const currency = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
})

export function parseMoney(value: string | number | null | undefined): number {
  const parsed = Number(value ?? 0)
  return Number.isFinite(parsed) ? parsed : 0
}

export function formatCurrency(
  value: string | number | null | undefined,
): string {
  return currency.format(parseMoney(value))
}

export function formatDateTime(value: string | null | undefined): string {
  if (!value) {
    return "-"
  }

  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Jakarta",
  }).format(new Date(value))
}

export function formatOrderNumber(orderNumber: string): string {
  const parts = orderNumber.split("-")
  return parts.at(-1) ?? orderNumber
}
