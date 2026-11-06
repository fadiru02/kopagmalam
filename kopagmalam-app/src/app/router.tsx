import { createBrowserRouter, Navigate } from "react-router"
import { AppShell } from "@/components/shared/app-shell"
import { RootLayout } from "@/app/root-layout"
import { RequireAuth } from "@/app/guards"
import { LoginPage } from "@/features/auth/pages/login-page"
import { OverviewPage } from "@/features/overview/pages/overview-page"
import { CashPage } from "@/features/pos/pages/cash-page"
import { QueuePage } from "@/features/queue/pages/queue-page"
import { MenuPage } from "@/features/menu/pages/menu-page"
import { InventoryPage } from "@/features/inventory/pages/inventory-page"
import { ReportsPage } from "@/features/reports/pages/reports-page"
import { SettingsPage } from "@/features/settings/pages/settings-page"
import { NotFoundPage } from "@/features/shared/pages/not-found-page"

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        element: <RequireAuth />,
        children: [
          {
            element: <AppShell />,
            children: [
              {
                index: true,
                element: <Navigate to="/overview" replace />,
              },
              {
                path: "/overview",
                element: <OverviewPage />,
              },
              {
                path: "/cash",
                element: <CashPage />,
              },
              {
                path: "/queue",
                element: <QueuePage />,
              },
              {
                path: "/menu",
                element: <MenuPage />,
              },
              {
                path: "/inventory",
                element: <InventoryPage />,
              },
              {
                path: "/reports",
                element: <ReportsPage />,
              },
              {
                path: "/settings",
                element: <SettingsPage />,
              },
            ],
          },
        ],
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
])
