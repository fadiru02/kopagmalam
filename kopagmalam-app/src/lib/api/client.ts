import type { ApiValidationError } from "./types"

export const API_URL = (
  import.meta.env.VITE_API_URL ?? "http://localhost:8000/api/v1"
).replace(/\/$/, "")

export class ApiError extends Error {
  readonly status: number
  readonly errors?: Record<string, string[]>

  constructor(
    message: string,
    status: number,
    errors?: Record<string, string[]>,
  ) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.errors = errors
  }
}

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown
  token?: string | null
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { body, token, headers, ...init } = options
  const isFormData = body instanceof FormData

  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      Accept: "application/json",
      ...(body !== undefined && !isFormData
        ? { "Content-Type": "application/json" }
        : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body:
      body === undefined
        ? undefined
        : isFormData
          ? body
          : JSON.stringify(body),
  })

  const raw = await response.text()
  let payload: unknown = null

  if (raw) {
    try {
      payload = JSON.parse(raw)
    } catch {
      payload = raw
    }
  }

  if (!response.ok) {
    const error = payload as Partial<ApiValidationError> | null
    throw new ApiError(
      error?.message ?? "Permintaan gagal.",
      response.status,
      error?.errors,
    )
  }

  return payload as T
}

export function buildQuery(
  params: Record<string, string | number | boolean | undefined | null>,
): string {
  const search = new URLSearchParams()

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") {
      continue
    }
    search.set(key, String(value))
  }

  const query = search.toString()
  return query ? `?${query}` : ""
}
