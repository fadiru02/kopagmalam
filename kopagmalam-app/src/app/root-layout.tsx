import { Outlet } from "react-router"
import { AppProviders } from "./providers"

export function RootLayout() {
  return (
    <AppProviders>
      <Outlet />
    </AppProviders>
  )
}
