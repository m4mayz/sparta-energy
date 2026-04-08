import { ReactNode } from "react"
import { IconAlertTriangle, IconLeaf } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

type AuditStatus = "hemat" | "boros"

interface AuditCardProps {
  status: AuditStatus
  title: ReactNode
  standardAverage: number
  actualAverage: number
  efficiency: number
}

export function AuditCard({
  status,
  title,
  standardAverage,
  actualAverage,
  efficiency,
}: AuditCardProps) {
  return (
    <Card
      size="sm"
      className="overflow-hidden border-l-4 transition-shadow hover:shadow-sm"
      style={{
        borderLeftColor: status === "hemat" ? "var(--chart-2)" : "#d85a53",
      }}
    >
      <CardContent>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1 space-y-2">
            <div>
              <p className="truncate text-xs leading-none font-semibold">
                {title}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-xl bg-muted/30 px-3 py-2">
                <p className="text-[9px] tracking-[0.14em] text-muted-foreground uppercase">
                  Standar
                </p>
                <p className="mt-1 text-xs leading-none font-semibold text-foreground">
                  {standardAverage.toFixed(1)} kWh/m2
                </p>
              </div>

              <div className="rounded-xl bg-muted/30 px-3 py-2">
                <p className="text-[9px] tracking-[0.14em] text-muted-foreground uppercase">
                  Aktual
                </p>
                <p className="mt-1 text-xs leading-none font-semibold text-foreground">
                  {actualAverage.toFixed(1)} kWh/m2
                </p>
              </div>
            </div>
          </div>

          <div className="flex shrink-0 flex-col items-center gap-2 self-stretch">
            <Badge
              variant={status === "hemat" ? "default" : "destructive"}
              className="h-5 rounded-full px-2 text-[9px] capitalize"
            >
              {status === "hemat" ? (
                <IconLeaf data-icon="inline-start" />
              ) : (
                <IconAlertTriangle data-icon="inline-start" />
              )}
              {status}
            </Badge>

            <div className="text-center">
              <p className="text-[9px] tracking-[0.14em] text-muted-foreground uppercase">
                Efisiensi
              </p>
              <p className="mt-2 text-sm leading-none font-black text-primary">
                {efficiency.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export type { AuditCardProps }
