import {
  Calculator,
  ChartColumn,
  Coffee,
  LayoutDashboard,
  ListOrdered,
  Settings,
  type LucideIcon,
} from "lucide-react"

export interface NavItem {
  to: string
  label: string
  icon: LucideIcon
}

const baseItems: NavItem[] = [
  { to: "/overview", label: "Overview", icon: LayoutDashboard },
  { to: "/cash", label: "Kasir", icon: Calculator },
  { to: "/queue", label: "Antrean", icon: ListOrdered },
  { to: "/menu", label: "Menu", icon: Coffee },
]

const reportsItem: NavItem = {
  to: "/reports",
  label: "Laporan",
  icon: ChartColumn,
}

const settingsItem: NavItem = {
  to: "/settings",
  label: "Pengaturan",
  icon: Settings,
}

export function getNavItems(canViewReports: boolean): NavItem[] {
  return canViewReports
    ? [...baseItems, reportsItem]
    : [...baseItems, settingsItem]
}
