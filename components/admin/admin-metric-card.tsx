import type { ReactNode } from "react"
import type { Icon } from "@tabler/icons-react"

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"

export type AdminMetricTone = "default" | "danger" | "success" | "info"

const metricToneStyles: Record<
  AdminMetricTone,
  {
    card: string
    halo: string
    chip: string
    value: string
    watermark: string
  }
> = {
  default: {
    card: "bg-linear-to-br from-card via-card to-muted/40 ring-muted-foreground/15",
    halo: "bg-muted-foreground/12",
    chip: "bg-muted text-muted-foreground ring-muted-foreground/15",
    value: "text-foreground",
    watermark: "text-muted-foreground",
  },
  danger: {
    card: "bg-linear-to-br from-destructive/10 via-card to-amber-500/8 ring-destructive/25",
    halo: "bg-destructive/20",
    chip: "bg-destructive/10 text-destructive ring-destructive/20",
    value: "text-destructive",
    watermark: "text-destructive",
  },
  success: {
    card: "bg-linear-to-br from-primary/12 via-card to-chart-1/10 ring-primary/25",
    halo: "bg-primary/20",
    chip: "bg-primary/10 text-primary ring-primary/20",
    value: "text-primary",
    watermark: "text-primary",
  },
  info: {
    card: "bg-linear-to-br from-chart-1/14 via-card to-chart-4/8 ring-chart-2/25",
    halo: "bg-chart-2/20",
    chip: "bg-chart-1/20 text-chart-4 ring-chart-2/20",
    value: "text-chart-4",
    watermark: "text-chart-4",
  },
}

export function AdminMetricCard({
  label,
  value,
  description,
  icon: Icon,
  tone = "default",
  rows,
  children,
  className,
  valueClassName,
}: {
  label: string
  value: ReactNode
  description?: ReactNode
  icon: Icon
  tone?: AdminMetricTone
  rows?: Array<{ label: string; value: ReactNode }>
  children?: ReactNode
  className?: string
  valueClassName?: string
}) {
  const styles = metricToneStyles[tone]

  return (
    <Card
      size="sm"
      className={cn("relative overflow-hidden", styles.card, className)}
    >
      <div
        aria-hidden="true"
        className={cn(
          "absolute -top-8 -right-6 size-24 rounded-full blur-2xl",
          styles.halo
        )}
      />
      <Icon
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute right-5 bottom-4 size-16 opacity-[0.06]",
          styles.watermark
        )}
      />
      <CardHeader className="relative">
        <CardDescription>{label}</CardDescription>
        <CardTitle className={cn("text-2xl", styles.value, valueClassName)}>
          {value}
        </CardTitle>
        <CardAction>
          <div
            className={cn(
              "flex size-9 items-center justify-center rounded-xl ring-1",
              styles.chip
            )}
          >
            <Icon className="size-5" />
          </div>
        </CardAction>
      </CardHeader>
      {(description || rows?.length || children) && (
        <CardContent className="relative">
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
          {rows?.length ? (
            <div
              className={cn(
                "flex flex-col gap-2 text-xs",
                description && "mt-3"
              )}
            >
              {rows.map((row) => (
                <div
                  key={row.label}
                  className="flex items-center justify-between gap-3"
                >
                  <span className="truncate text-muted-foreground">
                    {row.label}
                  </span>
                  <span className="shrink-0 font-medium">{row.value}</span>
                </div>
              ))}
            </div>
          ) : null}
          {children}
        </CardContent>
      )}
    </Card>
  )
}
