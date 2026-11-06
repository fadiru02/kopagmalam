import { Link, Outlet } from "react-router"
import { Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { canManage, useAuthStore } from "@/lib/stores/auth"
import { BottomNav } from "./bottom-nav"
import { SideRail } from "./side-rail"
import { getNavItems } from "./nav-items"

export function AppShell() {
  const user = useAuthStore((state) => state.user)
  const items = getNavItems(canManage(user))

  return (
    <div className="flex min-h-dvh">
      <SideRail items={items} />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b border-border bg-background/95 pt-safe backdrop-blur">
          <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between gap-2 px-4">
            <Link
              to="/overview"
              className="font-heading text-base font-extrabold tracking-tight text-foreground"
            >
              Kopag Malam <span className="text-primary">POS</span>
            </Link>
            <div className="flex items-center gap-1">
              <span className="hidden max-w-32 truncate text-xs font-medium text-muted-foreground sm:inline">
                {user?.name}
              </span>
              <Button asChild variant="ghost" size="icon">
                <Link to="/settings" aria-label="Pengaturan">
                  <Settings aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>
        </header>
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 pt-4 pb-24 md:pb-8">
          <Outlet />
        </main>
      </div>
      <BottomNav items={items} />
    </div>
  )
}
