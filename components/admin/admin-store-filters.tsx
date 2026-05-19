"use client"

import { useMemo, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { IconFilterOff, IconSearch } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type AdminStoreFiltersProps = {
  branches: string[]
  storeTypes: string[]
}

function getParam(searchParams: URLSearchParams, key: string) {
  return searchParams.get(key) ?? ""
}

export function AdminStoreFilters({
  branches,
  storeTypes,
}: AdminStoreFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [query, setQuery] = useState(getParam(searchParams, "q"))
  const [branch, setBranch] = useState(
    getParam(searchParams, "branch") || "all"
  )
  const [status, setStatus] = useState(
    getParam(searchParams, "status") || "all"
  )
  const [storeType, setStoreType] = useState(
    getParam(searchParams, "type") || "all"
  )
  const branchOptions = useMemo(
    () => branches.map((item) => item.trim()).filter(Boolean),
    [branches]
  )
  const storeTypeOptions = useMemo(
    () => storeTypes.map((item) => item.trim()).filter(Boolean),
    [storeTypes]
  )

  const hasFilters = useMemo(
    () =>
      Boolean(
        query.trim() ||
        branch !== "all" ||
        status !== "all" ||
        storeType !== "all"
      ),
    [query, branch, status, storeType]
  )

  function updateParams(next: {
    q?: string
    branch?: string
    status?: string
    type?: string
  }) {
    const params = new URLSearchParams(searchParams)
    const nextQuery = next.q ?? query
    const nextBranch = next.branch ?? branch
    const nextStatus = next.status ?? status
    const nextType = next.type ?? storeType

    if (nextQuery.trim()) params.set("q", nextQuery.trim())
    else params.delete("q")

    if (nextBranch !== "all") params.set("branch", nextBranch)
    else params.delete("branch")

    if (nextStatus !== "all") params.set("status", nextStatus)
    else params.delete("status")

    if (nextType !== "all") params.set("type", nextType)
    else params.delete("type")

    params.delete("page")

    const qs = params.toString()
    router.push(qs ? `${pathname}?${qs}` : pathname)
  }

  function clearFilters() {
    setQuery("")
    setBranch("all")
    setStatus("all")
    setStoreType("all")
    router.push(pathname)
  }

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <form
        className="flex min-w-0 flex-1 gap-2"
        onSubmit={(event) => {
          event.preventDefault()
          updateParams({ q: query })
        }}
      >
        <div className="relative min-w-0 flex-1">
          <IconSearch className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cari kode atau nama toko..."
            className="pl-9"
          />
        </div>
        <Button type="submit" variant="secondary">
          Cari
        </Button>
      </form>

      <div className="flex flex-col gap-2 sm:flex-row">
        <Select
          value={branch}
          onValueChange={(value) => {
            setBranch(value)
            updateParams({ branch: value })
          }}
        >
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Semua Cabang" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">Semua Cabang</SelectItem>
              {branchOptions.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select
          value={status}
          onValueChange={(value) => {
            setStatus(value)
            updateParams({ status: value })
          }}
        >
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Semua Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="hemat">Hemat</SelectItem>
              <SelectItem value="boros">Boros</SelectItem>
              <SelectItem value="not-audited">Belum Audit</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select
          value={storeType}
          onValueChange={(value) => {
            setStoreType(value)
            updateParams({ type: value })
          }}
        >
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Semua Tipe" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">Semua Tipe</SelectItem>
              {storeTypeOptions.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        {hasFilters && (
          <Button type="button" variant="ghost" onClick={clearFilters}>
            <IconFilterOff data-icon="inline-start" />
            Reset
          </Button>
        )}
      </div>
    </div>
  )
}
