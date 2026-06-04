import { NextResponse } from "next/server"

import { requireAdmin } from "@/lib/admin-auth"
import {
  getMasterEquipmentRows,
  masterEquipmentPageSize,
  parseMasterEquipmentArea,
  parseMasterEquipmentPowerMode,
  parseMasterEquipmentSort,
  parseSortOrder,
} from "@/lib/admin-master-data-queries"

function getFilter(searchParams: URLSearchParams, key: string) {
  return searchParams.get(key)?.trim() || "all"
}

export async function GET(request: Request) {
  await requireAdmin()

  const url = new URL(request.url)
  const offset = Math.max(0, Number(url.searchParams.get("offset") ?? 0) || 0)
  const filters = {
    q: url.searchParams.get("q")?.trim() ?? "",
    category: getFilter(url.searchParams, "category"),
    storeType: getFilter(url.searchParams, "storeType"),
    area: parseMasterEquipmentArea(url.searchParams.get("area")),
    powerMode: parseMasterEquipmentPowerMode(
      url.searchParams.get("powerMode")
    ),
    sort: parseMasterEquipmentSort(url.searchParams.get("sort")),
    order: parseSortOrder(url.searchParams.get("order")),
  }

  const result = await getMasterEquipmentRows({
    filters,
    offset,
    limit: masterEquipmentPageSize,
  })

  return NextResponse.json(result)
}
