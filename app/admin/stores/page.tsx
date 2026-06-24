import { AdminStoreFilters } from "@/components/admin/admin-store-filters"
import { AdminStoresTable } from "@/components/admin/admin-stores-table"
import {
  adminStoresPageSize,
  getAdminStoreBranches,
  getAdminStoreCount,
  getAdminStoreRows,
  getAdminStoreTypes,
  parseAdminStoreSort,
  parseSortOrder,
  type StoreStatus,
} from "@/lib/admin-store-queries"

type SearchParams = Promise<{
  q?: string
  branch?: string
  status?: string
  type?: string
  sort?: string
  order?: string
}>

function getFilter(value: string | undefined) {
  return value?.trim() || "all"
}

function formatNumber(value: number | bigint) {
  return new Intl.NumberFormat("id-ID").format(Number(value))
}

export default async function AdminStoresPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const params = await searchParams
  const filters = {
    q: params.q?.trim() ?? "",
    branch: getFilter(params.branch),
    status: getFilter(params.status) as StoreStatus | "all",
    type: getFilter(params.type),
    sort: parseAdminStoreSort(params.sort),
    order: parseSortOrder(params.order),
  }

  const [branches, storeTypes, totalFilteredRows, initialResult] =
    await Promise.all([
      getAdminStoreBranches(),
      getAdminStoreTypes(),
      getAdminStoreCount(filters),
      getAdminStoreRows({
        filters,
        offset: 0,
        limit: adminStoresPageSize,
      }),
    ])

  return (
    <div className="-mt-4 flex min-h-[calc(100svh-var(--header-height)-1rem)] flex-col md:-mt-6 md:min-h-[calc(100svh-var(--header-height))]">
      <section className="flex min-h-0 flex-1 flex-col">
        <div className="sticky top-(--header-height) z-20 -mx-4 border-y bg-background/90 px-4 py-4 backdrop-blur supports-backdrop-filter:bg-background/75 md:-mx-6 md:px-6">
          <AdminStoreFilters branches={branches} storeTypes={storeTypes} />
        </div>

        <div className="-mx-4 flex min-h-0 flex-1 flex-col border-y px-3 md:-mx-6 md:px-4">
          <div className="py-3 text-xs text-muted-foreground">
            Menampilkan {formatNumber(totalFilteredRows)} toko sesuai filter.
          </div>
          <div className="flex min-h-0 flex-1 flex-col border-t">
            <AdminStoresTable
              initialRows={initialResult.rows}
              initialHasMore={initialResult.hasMore}
              totalRows={totalFilteredRows}
              filters={filters}
            />
          </div>
        </div>
      </section>
    </div>
  )
}
