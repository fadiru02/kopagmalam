import { describe, expect, it } from "vitest"
import {
  formatCurrency,
  formatOrderNumber,
  parseMoney,
} from "@/lib/format"

describe("formatCurrency", () => {
  it("formats decimal strings as IDR without decimals", () => {
    expect(formatCurrency("156000.00")).toMatch(/156\.000/)
  })

  it("handles empty values", () => {
    expect(formatCurrency(null)).toMatch(/0/)
  })
})

describe("parseMoney", () => {
  it("parses decimal strings", () => {
    expect(parseMoney("15000.50")).toBe(15000.5)
  })

  it("falls back to zero", () => {
    expect(parseMoney("bukan angka")).toBe(0)
  })
})

describe("formatOrderNumber", () => {
  it("returns the last segment", () => {
    expect(formatOrderNumber("ORD-20261104120000-123")).toBe("123")
  })
})
