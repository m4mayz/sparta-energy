"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react"

type CategoryItem = {
  name: string
  count: number
}

type AdminMasterCategoriesListProps = {
  categories: CategoryItem[]
}

const numberFormat = new Intl.NumberFormat("id-ID")

function formatNumber(value: number, suffix = "") {
  return `${numberFormat.format(Math.round(value * 10) / 10)}${suffix}`
}

export function AdminMasterCategoriesList({
  categories,
}: AdminMasterCategoriesListProps) {
  const [page, setPage] = useState(0)
  const pageSize = 3
  const totalPages = Math.ceil(categories.length / pageSize)

  const currentItems = categories.slice(page * pageSize, (page + 1) * pageSize)

  return (
    <div className="flex flex-col gap-1 mt-1.5">
      {/* Fixed min-height to prevent card vertical layout shift */}
      <div className="flex flex-col gap-1 min-h-[3.75rem]">
        {currentItems.map((cat) => (
          <div
            key={cat.name}
            className="flex items-center justify-between text-xs transition-opacity duration-200"
          >
            <span className="truncate text-muted-foreground">{cat.name}</span>
            <span className="shrink-0 font-medium">
              {formatNumber(cat.count, " Merek")}
            </span>
          </div>
        ))}
        {currentItems.length === 0 && (
          <div className="text-xs text-muted-foreground italic text-center py-4">
            Tidak ada kategori
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 border-t border-muted/30 pt-1 mt-0">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-5 rounded hover:bg-muted/80"
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
            aria-label="Halaman sebelumnya"
          >
            <IconChevronLeft className="size-3" />
          </Button>
          <span className="text-[10px] font-medium text-muted-foreground select-none">
            {page + 1} / {totalPages}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-5 rounded hover:bg-muted/80"
            disabled={page === totalPages - 1}
            onClick={() => setPage((p) => p + 1)}
            aria-label="Halaman berikutnya"
          >
            <IconChevronRight className="size-3" />
          </Button>
        </div>
      )}
    </div>
  )
}
