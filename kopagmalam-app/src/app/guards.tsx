import { Navigate, Outlet, useLocation } from "react-router"
import { FullScreenLoader } from "@/components/shared/full-screen-loader"
import { useAuthStore } from "@/lib/stores/auth"

export function RequireAuth() {
  const status = useAuthStore((state) => state.status)
  const location = useLocation()

  if (status === "loading") {
    return <FullScreenLoader />
  }

  if (status === "guest") {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: `${location.pathname}${location.search}` }}
      />
    )
  }

  return <Outlet />
}
