import { NavLink } from "react-router"
import { cn } from "@/lib/utils"
import type { NavItem } from "./nav-items"

export function SideRail({ items }: { items: NavItem[] }) {
  return (
    <aside className="sticky top-0 hidden h-dvh w-20 shrink-0 flex-col border-r border-border bg-card md:flex">
      <div className="flex h-16 items-center justify-center border-b border-border">
        <span className="font-heading text-lg font-extrabold tracking-tight text-primary">
          KM
        </span>
      </div>
      <nav aria-label="Navigasi utama" className="flex flex-1 flex-col gap-1 p-2">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl px-1 text-[10px] font-semibold text-muted-foreground transition-colors hover:bg-muted",
                isActive && "bg-secondary text-primary",
              )
            }
          >
            <item.icon className="size-5" aria-hidden="true" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
