import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { RouterProvider } from "react-router"
import { router } from "@/app/router"
import { bootstrapNative } from "@/lib/native/bootstrap"
import "./index.css"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)

void bootstrapNative()
