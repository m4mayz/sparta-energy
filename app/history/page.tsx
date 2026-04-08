"use client"

import { useState } from "react"
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react"

import { BottomNavigation } from "@/components/bottom-navigation"
import { Header } from "@/components/header"
import { AuditCard } from "@/components/dashboard/audit-card"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type AuditStatus = "hemat" | "boros"
type AuditFilterStatus = "all" | AuditStatus

type HistoryItem = {
  period: string
  status: AuditStatus
  standardAverage: number
  actualAverage: number
  efficiency: number
}

const singleStoreHistory: HistoryItem[] = [
  {
    period: "April 2026",
    status: "hemat",
    standardAverage: 13.0,
    actualAverage: 12.4,
    efficiency: 95.4,
  },
  {
    period: "Maret 2026",
    status: "hemat",
    standardAverage: 13.0,
    actualAverage: 13.0,
    efficiency: 100.0,
  },
  {
    period: "Februari 2026",
    status: "boros",
    standardAverage: 13.0,
    actualAverage: 13.2,
    efficiency: 98.5,
  },
  {
    period: "Januari 2026",
    status: "boros",
    standardAverage: 13.0,
    actualAverage: 13.2,
    efficiency: 98.5,
  },
  {
    period: "Desember 2025",
    status: "hemat",
    standardAverage: 13.0,
    actualAverage: 12.8,
    efficiency: 98.5,
  },
]

function getYearFromPeriod(period: string) {
  const parts = period.trim().split(" ")
  return parts[parts.length - 1] ?? ""
}

export default function HistoryPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedYear, setSelectedYear] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<AuditFilterStatus>("all")
  const itemsPerPage = 5

  const allHistory = singleStoreHistory // user-only untuk sekarang
  const availableYears = Array.from(
    new Set(allHistory.map((item) => getYearFromPeriod(item.period)))
  ).sort((a, b) => Number(b) - Number(a))

  const filteredHistory = allHistory.filter((item) => {
    const itemYear = getYearFromPeriod(item.period)
    const matchesYear = selectedYear === "all" || itemYear === selectedYear
    const matchesStatus =
      selectedStatus === "all" || item.status === selectedStatus

    return matchesYear && matchesStatus
  })

  const totalItems = filteredHistory.length
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage))
  const safeCurrentPage = Math.min(currentPage, totalPages)
  const startIndex = (safeCurrentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const visibleHistory = filteredHistory.slice(startIndex, endIndex)

  return (
    <main className="mx-auto flex min-h-svh w-full max-w-sm flex-col bg-background px-4 pb-32">
      <Header variant="title-only" title="History" />

      <section className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <label
              htmlFor="history-year-filter"
              className="text-[11px] text-muted-foreground"
            >
              Tahun
            </label>
            <Select
              value={selectedYear}
              onValueChange={(value: string) => {
                setSelectedYear(value)
                setCurrentPage(1)
              }}
            >
              <SelectTrigger
                id="history-year-filter"
                className="h-9 w-full text-xs"
              >
                <SelectValue placeholder="Semua Tahun" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Tahun</SelectItem>
                {availableYears.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <label
              htmlFor="history-status-filter"
              className="text-[11px] text-muted-foreground"
            >
              Status
            </label>
            <Select
              value={selectedStatus}
              onValueChange={(value: string) => {
                setSelectedStatus(value as AuditFilterStatus)
                setCurrentPage(1)
              }}
            >
              <SelectTrigger
                id="history-status-filter"
                className="h-9 w-full text-xs"
              >
                <SelectValue placeholder="Semua Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="hemat">Hemat</SelectItem>
                <SelectItem value="boros">Boros</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {visibleHistory.length > 0 ? (
            visibleHistory.map((item) => (
              <AuditCard
                key={item.period}
                status={item.status}
                title={item.period}
                standardAverage={item.standardAverage}
                actualAverage={item.actualAverage}
                efficiency={item.efficiency}
              />
            ))
          ) : (
            <div className="rounded-xl border border-dashed border-border px-3 py-6 text-center text-sm text-muted-foreground">
              Data tidak ditemukan untuk filter yang dipilih.
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center justify-between gap-2 pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setCurrentPage((prev) =>
                Math.max(1, Math.min(totalPages, prev - 1))
              )
            }
            disabled={safeCurrentPage === 1}
            className="h-8 w-8 rounded-lg p-0"
          >
            <IconChevronLeft className="size-4" />
          </Button>

          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span>
              {totalItems === 0
                ? "0-0"
                : `${startIndex + 1}-${Math.min(endIndex, totalItems)}`}
            </span>
            <span className="text-muted-foreground/50">dari</span>
            <span className="font-semibold">{totalItems}</span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setCurrentPage((prev) =>
                Math.max(1, Math.min(totalPages, prev + 1))
              )
            }
            disabled={safeCurrentPage === totalPages || totalItems === 0}
            className="h-8 w-8 rounded-lg p-0"
          >
            <IconChevronRight className="size-4" />
          </Button>
        </div>
      </section>

      <BottomNavigation />
    </main>
  )
}
