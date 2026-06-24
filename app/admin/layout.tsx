import type { ReactNode } from "react"

import { AdminShell } from "@/components/admin/admin-shell"
import { requireAdmin } from "@/lib/admin-auth"

export default async function AdminLayout({
  children,
}: {
  children: ReactNode
}) {
  const user = await requireAdmin()

  return <AdminShell user={user}>{children}</AdminShell>
}
