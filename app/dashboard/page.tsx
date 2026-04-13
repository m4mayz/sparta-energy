import { BottomNavigation } from "@/components/bottom-navigation"
import { HeroCard } from "@/components/dashboard/hero-card"
import {
  RecentAuditSection,
  type RecentAuditItem,
} from "@/components/dashboard/recent-audit-section"
import { Header } from "@/components/header"
import { Card, CardContent } from "@/components/ui/card"

const userStore = {
  name: "Alfamart Cibubur Raya",
  code: "ALF-0123",
  branch: "Jakarta Timur",
  owner: "Budi Santoso",
}

const recentAudits: RecentAuditItem[] = [
  {
    period: "April 2026",
    status: "hemat",
    standardAverage: 13.2,
    actualAverage: 12.4,
    efficiency: 82.7,
  },
  {
    period: "Maret 2026",
    status: "hemat",
    standardAverage: 13.0,
    actualAverage: 13.0,
    efficiency: 100,
  },
  {
    period: "Januari 2026",
    status: "boros",
    standardAverage: 13.2,
    actualAverage: 13.8,
    efficiency: 104.5,
  },
]

export default function DashboardPage() {
  return (
    <main className="mx-auto flex min-h-svh w-full max-w-sm flex-col bg-background px-4 pb-32">
      <Header variant="dashboard" logoHref="/dashboard" />

      <section className="flex flex-col gap-5">
        {/* <Card className="border-primary/10 bg-muted/30">
          <CardContent className="space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="truncate text-lg font-semibold text-foreground">
                  {userStore.name}
                </h2>
                <p className="text-xs text-muted-foreground">
                  {userStore.code} · {userStore.branch}
                </p>
              </div>
            </div>
          </CardContent>
        </Card> */}

        <HeroCard />

        <RecentAuditSection items={recentAudits} />
      </section>

      <BottomNavigation />
    </main>
  )
}
