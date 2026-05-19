import Link from "next/link"
import {
  IconAlertTriangle,
  IconBuildingStore,
  IconLeaf,
  IconTrendingUp,
} from "@tabler/icons-react"

import {
  EfficiencyBreakdownChart,
  ConsumptionTrendChart,
} from "@/components/admin/admin-dashboard-charts"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { prisma } from "@/lib/prisma"

const numberFormat = new Intl.NumberFormat("id-ID")
const compactNumberFormat = new Intl.NumberFormat("id-ID", {
  notation: "compact",
  maximumFractionDigits: 1,
})

type CompletedAuditRow = {
  id: string
  storeId: string
  auditDate: Date
  isBoros: boolean | null
  totalEstimatedKwhPerMonth: unknown
  avgActualPlnKwhPerMonth: unknown
  store: {
    code: string
    name: string
    branch: string | null
  }
  plnHistory: Array<{
    billingMonth: string
    monthIdx: number
    plnUsageKwh: unknown
  }>
}

const excludedBranchNames = [
  "DEMO",
  "Demo",
  "demo",
  "HEAD OFFICE",
  "Head Office",
  "head office",
]

const storeBranchFilter = {
  OR: [
    { branch: null },
    {
      branch: { notIn: excludedBranchNames },
    },
  ],
}

function formatNumber(value: number) {
  return numberFormat.format(Math.round(value))
}

function formatCompact(value: number) {
  return compactNumberFormat.format(Math.round(value))
}

function calculateGapPercent(actual: unknown, baseline: unknown) {
  const actualValue = Number(actual ?? 0)
  const baselineValue = Number(baseline ?? 0)
  if (baselineValue <= 0) return 0
  return Math.round(((actualValue - baselineValue) / baselineValue) * 1000) / 10
}

function getMonthSortValue(label: string, fallback: number) {
  const parsed = Date.parse(label)
  if (Number.isFinite(parsed)) return parsed

  const normalized = label.trim().toLowerCase().slice(0, 3)
  const monthIndex: Record<string, number> = {
    jan: 1,
    feb: 2,
    mar: 3,
    apr: 4,
    mei: 5,
    may: 5,
    jun: 6,
    jul: 7,
    agu: 8,
    aug: 8,
    sep: 9,
    okt: 10,
    oct: 10,
    nov: 11,
    des: 12,
    dec: 12,
  }

  return monthIndex[normalized] ?? fallback
}

function getLatestAuditByStore(audits: CompletedAuditRow[]) {
  const latestByStore = new Map<string, CompletedAuditRow>()

  for (const audit of audits) {
    if (!latestByStore.has(audit.storeId)) {
      latestByStore.set(audit.storeId, audit)
    }
  }

  return Array.from(latestByStore.values())
}

function getConsumptionTrend(audits: CompletedAuditRow[]) {
  const grouped = new Map<
    string,
    {
      month: string
      sortValue: number
      actualTotal: number
      baselineTotal: number
      count: number
    }
  >()

  for (const audit of audits) {
    const baseline = Number(audit.totalEstimatedKwhPerMonth ?? 0)

    for (const row of audit.plnHistory) {
      const month = row.billingMonth || `M-${row.monthIdx}`
      const current = grouped.get(month) ?? {
        month,
        sortValue: getMonthSortValue(month, row.monthIdx),
        actualTotal: 0,
        baselineTotal: 0,
        count: 0,
      }

      current.actualTotal += Number(row.plnUsageKwh ?? 0)
      current.baselineTotal += baseline
      current.count += 1
      grouped.set(month, current)
    }
  }

  return Array.from(grouped.values())
    .sort((a, b) => a.sortValue - b.sortValue)
    .slice(-6)
    .map((item) => ({
      month: item.month.slice(0, 3),
      actualPln: item.count > 0 ? Math.round(item.actualTotal / item.count) : 0,
      baseline:
        item.count > 0 ? Math.round(item.baselineTotal / item.count) : 0,
    }))
}

export default async function AdminDashboardPage() {
  const [totalStores, completedAudits] = await Promise.all([
    prisma.store.count({
      where: storeBranchFilter,
    }),
    prisma.audit.findMany({
      where: {
        status: "COMPLETED",
        store: storeBranchFilter,
      },
      orderBy: { auditDate: "desc" },
      select: {
        id: true,
        storeId: true,
        auditDate: true,
        isBoros: true,
        totalEstimatedKwhPerMonth: true,
        avgActualPlnKwhPerMonth: true,
        store: {
          select: {
            code: true,
            name: true,
            branch: true,
          },
        },
        plnHistory: {
          orderBy: { monthIdx: "asc" },
          select: {
            billingMonth: true,
            monthIdx: true,
            plnUsageKwh: true,
          },
        },
      },
    }),
  ])

  const latestAudits = getLatestAuditByStore(completedAudits)
  const auditedStores = latestAudits.length
  const hematStores = latestAudits.filter((audit) => !audit.isBoros).length
  const borosStores = latestAudits.filter((audit) => audit.isBoros).length
  const coverage =
    totalStores > 0 ? Math.round((auditedStores / totalStores) * 1000) / 10 : 0

  const avgActual =
    auditedStores > 0
      ? latestAudits.reduce(
          (total, audit) => total + Number(audit.avgActualPlnKwhPerMonth ?? 0),
          0
        ) / auditedStores
      : 0

  const avgBaseline =
    auditedStores > 0
      ? latestAudits.reduce(
          (total, audit) =>
            total + Number(audit.totalEstimatedKwhPerMonth ?? 0),
          0
        ) / auditedStores
      : 0

  const consumptionGap = calculateGapPercent(avgActual, avgBaseline)
  const consumptionTrend = getConsumptionTrend(completedAudits)

  const topWastefulStores = latestAudits
    .filter((audit) => audit.isBoros)
    .map((audit) => ({
      id: audit.id,
      code: audit.store.code,
      name: audit.store.name,
      branch: audit.store.branch ?? "-",
      gapPercent: calculateGapPercent(
        audit.avgActualPlnKwhPerMonth,
        audit.totalEstimatedKwhPerMonth
      ),
    }))
    .sort((a, b) => b.gapPercent - a.gapPercent)
    .slice(0, 10)

  return (
    <div className="flex flex-col gap-6">
      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <Card size="sm">
          <CardHeader>
            <CardDescription>Total Stores</CardDescription>
            <CardTitle className="text-3xl">
              {numberFormat.format(totalStores)}
            </CardTitle>
            <CardAction>
              <IconBuildingStore className="size-5 text-muted-foreground" />
            </CardAction>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between gap-3 text-xs">
              <span className="text-muted-foreground">Audited Stores</span>
              <span className="font-medium">{formatNumber(auditedStores)}</span>
            </div>
            <div className="mt-2 flex items-center justify-between gap-3 text-xs">
              <span className="text-muted-foreground">Coverage</span>
              <span className="font-medium">{coverage.toFixed(1)}%</span>
            </div>
          </CardContent>
        </Card>

        <Card size="sm">
          <CardHeader>
            <CardDescription>Hemat</CardDescription>
            <CardTitle className="text-3xl">
              {numberFormat.format(hematStores)}
            </CardTitle>
            <CardAction>
              <IconLeaf className="size-5 text-muted-foreground" />
            </CardAction>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Efficient Stores</p>
          </CardContent>
        </Card>

        <Card size="sm" className="ring-destructive/30">
          <CardHeader>
            <CardDescription>Boros</CardDescription>
            <CardTitle className="text-3xl">
              {numberFormat.format(borosStores)}
            </CardTitle>
            <CardAction>
              <IconAlertTriangle className="size-5 text-muted-foreground" />
            </CardAction>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Wasteful Stores</p>
          </CardContent>
        </Card>

        <Card size="sm" className="justify-between">
          <CardHeader>
            <CardDescription>Consumption Overview</CardDescription>

            <CardAction>
              <Badge
                variant={consumptionGap > 0 ? "destructive" : "default"}
                className="capitalize"
              >
                <IconTrendingUp data-icon="inline-start" />
                Gap {consumptionGap > 0 ? "+" : ""}
                {consumptionGap.toFixed(1)}%
              </Badge>
            </CardAction>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <p className="text-muted-foreground">Avg PLN kWh</p>
                <p className="mt-1 text-base font-semibold">
                  {formatCompact(avgActual)}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Avg Baseline</p>
                <p className="mt-1 text-base font-semibold">
                  {formatCompact(avgBaseline)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <Card>
          <CardHeader>
            <CardTitle>Consumption Trend</CardTitle>
            <CardDescription>
              Rata-rata actual PLN dibanding baseline audit.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ConsumptionTrendChart data={consumptionTrend} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Efficiency Breakdown</CardTitle>
            <CardDescription>
              Komposisi toko hemat dan boros dari toko yang sudah diaudit.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <EfficiencyBreakdownChart
              auditedStores={auditedStores}
              hematStores={hematStores}
              borosStores={borosStores}
            />
          </CardContent>
        </Card>
      </section>

      <section>
        <Card>
          <CardHeader>
            <CardTitle>Top 10 Wasteful Stores</CardTitle>
            <CardDescription>
              Toko boros dengan gap aktual PLN terbesar terhadap baseline.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Store Name</TableHead>
                  <TableHead>Branch</TableHead>
                  <TableHead className="text-right">Gap %</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topWastefulStores.map((store) => (
                  <TableRow key={store.id}>
                    <TableCell className="font-medium">
                      <Link href={`/audit/${store.id}`}>{store.code}</Link>
                    </TableCell>
                    <TableCell>
                      <p className="max-w-72 truncate">{store.name}</p>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {store.branch}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="destructive">
                        +{store.gapPercent.toFixed(1)}%
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
