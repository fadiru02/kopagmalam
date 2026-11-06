import type { ReactNode } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface KpiCardProps {
  label: string
  value: ReactNode
  hint?: string
  tone?: "default" | "success" | "warning" | "info"
}

const toneClass = {
  default: "text-foreground",
  success: "text-success",
  warning: "text-warning",
  info: "text-info",
} as const

export function KpiCard({ label, value, hint, tone = "default" }: KpiCardProps) {
  return (
    <Card size="sm" className="gap-1 py-3">
      <CardContent className="px-3">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <p
          className={cn(
            "mt-1 font-heading text-2xl font-extrabold tabular-nums",
            toneClass[tone],
          )}
        >
          {value}
        </p>
        {hint ? (
          <p className="mt-0.5 text-[11px] text-muted-foreground">{hint}</p>
        ) : null}
      </CardContent>
    </Card>
  )
}
