import { headers } from "next/headers"
import { NextResponse } from "next/server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

const excludedBranchNames = [
  "DEMO",
  "Demo",
  "demo",
  "HEAD OFFICE",
  "Head Office",
  "head office",
]

async function isAdmin() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return false

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  })

  return user?.role === "ADMIN"
}

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const branches = await prisma.store.findMany({
    where: {
      branch: {
        not: null,
        notIn: excludedBranchNames,
      },
    },
    distinct: ["branch"],
    orderBy: { branch: "asc" },
    select: { branch: true },
  })

  return NextResponse.json({
    branches: branches
      .map((item) => item.branch?.trim())
      .filter((item): item is string => Boolean(item)),
  })
}
