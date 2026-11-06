import { useEffect, type ReactNode } from "react"
import { QueryClientProvider } from "@tanstack/react-query"
import { Toaster } from "sonner"
import { queryClient } from "@/lib/query/client"
import { useAuthStore } from "@/lib/stores/auth"

export function AppProviders({ children }: { children: ReactNode }) {
  const hydrate = useAuthStore((state) => state.hydrate)

  useEffect(() => {
    void hydrate()
  }, [hydrate])

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster position="top-center" richColors closeButton />
    </QueryClientProvider>
  )
}
