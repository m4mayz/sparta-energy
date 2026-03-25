import {
  IconAlertTriangle,
  IconMapPin,
  IconTrendingDown,
} from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

function SummaryCards() {
  return (
    <div className="grid grid-cols-2 gap-2">
      <Card size="sm" className="gap-3">
        <CardHeader className="gap-1">
          <CardDescription className="text-[11px] font-semibold tracking-widest uppercase">
            Total Toko
          </CardDescription>
          <CardTitle className="text-3xl leading-none">24</CardTitle>
        </CardHeader>
        <CardFooter className="pt-0">
          <p className="flex items-center gap-1 text-xs text-muted-foreground">
            <IconMapPin className="size-3.5" />5 Cabang
          </p>
        </CardFooter>
      </Card>

      <Card size="sm" className="gap-3">
        <CardHeader className="gap-1">
          <CardDescription className="text-[11px] font-semibold tracking-widest uppercase">
            Hemat
          </CardDescription>
          <CardTitle className="text-3xl leading-none">18</CardTitle>
        </CardHeader>
        <CardFooter className="pt-0">
          <p className="flex items-center gap-1 text-xs text-muted-foreground">
            <IconTrendingDown className="size-3.5" />
            Target tercapai
          </p>
        </CardFooter>
      </Card>

      <Card size="sm" className="col-span-2 gap-3">
        <CardHeader className="gap-1">
          <CardDescription className="text-[11px] font-semibold tracking-widest uppercase">
            Boros
          </CardDescription>
          <CardTitle className="text-4xl leading-none">06</CardTitle>
        </CardHeader>
        <CardFooter className="pt-0">
          <Badge variant="destructive">
            <IconAlertTriangle data-icon="inline-start" />
            Butuh perhatian
          </Badge>
        </CardFooter>
      </Card>
    </div>
  )
}

export { SummaryCards }
