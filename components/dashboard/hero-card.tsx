import { IconPlus } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

function HeroCard() {
  return (
    <Card className="bg-linear-to-br from-primary/16 via-background to-background">
      <CardHeader>
        <CardTitle className="text-2xl leading-tight">
          Audit Energi Toko
        </CardTitle>
        <CardDescription>
          Hitung konsumsi energi toko secara akurat.
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <Button className="w-full">
          <IconPlus data-icon="inline-start" />
          Mulai Audit Baru
        </Button>
      </CardFooter>
    </Card>
  )
}

export { HeroCard }
