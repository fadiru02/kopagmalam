import { NavLink } from "react-router"
import { cn } from "@/lib/utils"
import type { NavItem } from "./nav-items"

export function BottomNav({ items }: { items: NavItem[] }) {
  return (
    <nav
      aria-label="Navigasi utama"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 backdrop-blur md:hidden"
    >
      <ul className="mx-auto grid max-w-lg grid-cols-5">
        {items.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "flex min-h-16 flex-col items-center justify-center gap-1 px-1 pb-[env(safe-area-inset-bottom)] text-[11px] font-semibold text-muted-foreground transition-colors",
                  isActive && "text-primary",
                )
              }
            >
              <item.icon className="size-5" aria-hidden="true" />
              <span>{item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
