import { useState, type FormEvent } from "react"
import { Coffee, LoaderCircle } from "lucide-react"
import { Navigate, useLocation, useNavigate } from "react-router"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ApiError, apiRequest } from "@/lib/api/client"
import { endpoints } from "@/lib/api/endpoints"
import type { LoginResponse } from "@/lib/api/types"
import { useAuthStore } from "@/lib/stores/auth"

export function LoginPage() {
  const status = useAuthStore((state) => state.status)
  const setSession = useAuthStore((state) => state.setSession)
  const navigate = useNavigate()
  const location = useLocation()
  const from =
    (location.state as { from?: string } | null)?.from ?? "/overview"

  const [email, setEmail] = useState("cashier@kopagmalam.test")
  const [password, setPassword] = useState("password")
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (status === "authenticated") {
    return <Navigate to={from} replace />
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      const response = await apiRequest<LoginResponse>(endpoints.auth.login, {
        method: "POST",
        body: { email, password },
      })

      await setSession(response.token, response.user)
      navigate(from, { replace: true })
    } catch (caught) {
      setError(
        caught instanceof ApiError
          ? caught.message
          : "Tidak dapat terhubung ke server.",
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-surface-low px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <Coffee className="size-7" aria-hidden="true" />
          </div>
          <h1 className="mt-4 font-heading text-2xl font-extrabold tracking-tight text-foreground">
            Kopag Malam POS
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Masuk untuk memulai shift
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Masuk Staff</CardTitle>
            <CardDescription>
              Gunakan akun kasir, admin, atau manager.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-1.5">
                <label
                  htmlFor="email"
                  className="text-sm font-semibold text-foreground"
                >
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  placeholder="nama@kopagmalam.test"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="password"
                  className="text-sm font-semibold text-foreground"
                >
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
              </div>

              {error ? (
                <p
                  role="alert"
                  className="rounded-lg bg-danger-soft px-3 py-2 text-sm font-medium text-danger"
                >
                  {error}
                </p>
              ) : null}

              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <LoaderCircle
                    className="animate-spin"
                    aria-hidden="true"
                  />
                ) : null}
                {isSubmitting ? "Memproses…" : "Masuk"}
              </Button>
            </form>

            <p className="mt-4 text-center text-[11px] text-muted-foreground">
              Demo: cashier@kopagmalam.test / password
            </p>
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-[11px] text-muted-foreground">
          {import.meta.env.VITE_STORE_NAME ?? "Kopag Malam"} ·{" "}
          {import.meta.env.VITE_STORE_CODE ?? "POS-JKT-04"}
        </p>
      </div>
    </div>
  )
}
