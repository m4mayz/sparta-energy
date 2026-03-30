import { cn } from "@/lib/utils"

type AuditStepIndicatorProps = {
  currentStep: 1 | 2 | 3
  label: string
  className?: string
}

function AuditStepIndicator({
  currentStep,
  label,
  className,
}: AuditStepIndicatorProps) {
  return (
    <div className={cn("flex items-center justify-between gap-3", className)}>
      <div className="flex items-center gap-2">
        <span
          className={cn(
            "size-2 rounded-full",
            currentStep >= 1 ? "bg-primary" : "border border-border"
          )}
        />
        <span
          className={cn(
            "h-0.5 w-7 rounded-full",
            currentStep >= 2 ? "bg-primary" : "bg-border"
          )}
        />
        <span
          className={cn(
            "size-2 rounded-full",
            currentStep >= 2 ? "bg-primary" : "border border-border"
          )}
        />
        <span
          className={cn(
            "h-0.5 w-7 rounded-full",
            currentStep >= 3 ? "bg-primary" : "bg-border"
          )}
        />
        <span
          className={cn(
            "size-2 rounded-full",
            currentStep >= 3 ? "bg-primary" : "border border-border"
          )}
        />
      </div>

      <p className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
        {label}
      </p>
    </div>
  )
}

export { AuditStepIndicator }
