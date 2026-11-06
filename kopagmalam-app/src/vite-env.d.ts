/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string
  readonly VITE_APP_ENV?: "development" | "production"
  readonly VITE_STORE_NAME?: string
  readonly VITE_STORE_CODE?: string
  readonly VITE_TAX_PERCENTAGE?: string
  readonly VITE_PRINTER_MODE?: "none" | "network" | "bluetooth"
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
