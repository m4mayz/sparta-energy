"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  IconBuildingStore,
  IconChevronRight,
  IconClipboardList,
  IconDatabase,
  IconFileExport,
  IconKey,
  IconLayoutDashboard,
  IconLogout,
  IconMapPin,
  IconTool,
  IconUsers,
} from "@tabler/icons-react"
import {
  Fragment,
  type ComponentType,
  type CSSProperties,
  type ReactNode,
} from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"
import { useIsMobile } from "@/hooks/use-mobile"
import { signOut } from "@/lib/auth-client"

type AdminUser = {
  fullName: string | null
  email: string
  image: string | null
}

type AdminShellProps = {
  user: AdminUser
  children: ReactNode
}

type AdminNavItem = {
  label: string
  href: string
  icon: ComponentType<React.ComponentProps<"svg">>
  disabled?: boolean
}

type AdminNavGroup = {
  label: string
  items: AdminNavItem[]
}

const dashboardNavItem: AdminNavItem = {
  label: "Dashboard",
  href: "/admin/dashboard",
  icon: IconLayoutDashboard,
}

const navGroups: AdminNavGroup[] = [
  {
    label: "Monitoring",
    items: [
      {
        label: "Monitoring Toko",
        href: "/admin/stores",
        icon: IconBuildingStore,
      },
      {
        label: "Riwayat Audit",
        href: "/admin/audits",
        icon: IconClipboardList,
        disabled: true,
      },
      {
        label: "Analitik Equipment",
        href: "/admin/equipment",
        icon: IconTool,
        disabled: true,
      },
      {
        label: "Performa Cabang",
        href: "/admin/branches",
        icon: IconMapPin,
        disabled: true,
      },
    ],
  },
  {
    label: "Output",
    items: [
      {
        label: "Reports & Export",
        href: "/admin/reports",
        icon: IconFileExport,
        disabled: true,
      },
    ],
  },
  {
    label: "Administrasi",
    items: [
      {
        label: "User & Akses",
        href: "/admin/users",
        icon: IconUsers,
        disabled: true,
      },
      {
        label: "Master Data",
        href: "/admin/master-data",
        icon: IconDatabase,
        disabled: true,
      },
    ],
  },
]

const navItems = [
  dashboardNavItem,
  ...navGroups.flatMap((group) => group.items),
]

function getInitials(name: string | null, email: string) {
  const source = name?.trim() || email
  return source
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("")
}

function getCurrentPage(pathname: string) {
  return navItems.find(
    (item) => pathname === item.href || pathname.startsWith(`${item.href}/`)
  )
}

function getBreadcrumbItems(pathname: string) {
  const currentPage = getCurrentPage(pathname)

  if (pathname === "/admin/dashboard") {
    return [{ label: "Dashboard" }]
  }

  if (pathname.startsWith("/admin/stores/")) {
    return [
      { label: "Monitoring Toko", href: "/admin/stores" },
      { label: "Detail Toko" },
    ]
  }

  if (currentPage) {
    return [{ label: currentPage.label }]
  }

  return [{ label: "Dashboard" }]
}

function AdminSidebar({ user }: { user: AdminUser }) {
  const pathname = usePathname()
  const isMobile = useIsMobile()

  const handleLogout = async () => {
    await signOut()
    window.location.href = "/login"
  }

  return (
    <Sidebar collapsible="icon" variant="sidebar">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              size="lg"
              tooltip="SPARTA Energy"
              className="h-auto justify-center p-2 group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-0!"
            >
              <Link href="/admin/dashboard">
                <div className="flex items-center gap-2 rounded-xl border border-border/40 bg-muted/40 px-3 py-2 backdrop-blur-sm group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:rounded-lg group-data-[collapsible=icon]:border-0 group-data-[collapsible=icon]:bg-transparent group-data-[collapsible=icon]:p-0">
                  <Image
                    src="/assets/Building-Logo.png"
                    alt="SPARTA Energy"
                    width={60}
                    height={60}
                    className="size-7 object-contain drop-shadow-sm group-data-[collapsible=icon]:size-6"
                    priority
                  />
                  <div className="flex flex-col leading-none text-foreground group-data-[collapsible=icon]:hidden">
                    <span className="text-sm font-bold tracking-wider">
                      SPARTA
                    </span>
                    <span className="text-[10px] font-medium opacity-80">
                      Energy
                    </span>
                  </div>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <AdminSidebarItem item={dashboardNavItem} pathname={pathname} />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {navGroups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <AdminSidebarItem
                    key={item.href}
                    item={item}
                    pathname={pathname}
                  />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton size="lg" className="group/profile-trigger">
                  <Avatar size="sm">
                    {user.image && (
                      <AvatarImage
                        src={user.image}
                        alt={user.fullName ?? user.email}
                      />
                    )}
                    <AvatarFallback>
                      {getInitials(user.fullName, user.email)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                    <span className="truncate font-medium">
                      {user.fullName ?? "Admin"}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      {user.email}
                    </span>
                  </span>
                  <IconChevronRight className="ml-auto transition-transform group-data-[collapsible=icon]:hidden group-data-[state=open]/profile-trigger:rotate-90" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side={isMobile ? "top" : "right"}
                align="end"
                className="w-(--radix-popper-anchor-width)"
              >
                <DropdownMenuLabel>
                  <span className="block truncate font-medium text-foreground">
                    {user.fullName ?? "Admin"}
                  </span>
                  <span className="block truncate">{user.email}</span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link href="#">
                      <IconKey />
                      Ganti Password
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={handleLogout}
                  >
                    <IconLogout />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

function AdminSidebarItem({
  item,
  pathname,
}: {
  item: AdminNavItem
  pathname: string
}) {
  const Icon = item.icon
  const isActive =
    pathname === item.href || pathname.startsWith(`${item.href}/`)

  return (
    <SidebarMenuItem key={item.href}>
      <SidebarMenuButton
        asChild={!item.disabled}
        disabled={item.disabled}
        isActive={isActive}
        tooltip={item.label}
      >
        {item.disabled ? (
          <>
            <Icon />
            <span>{item.label}</span>
          </>
        ) : (
          <Link href={item.href}>
            <Icon />
            <span>{item.label}</span>
          </Link>
        )}
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

function AdminSiteHeader() {
  const pathname = usePathname()
  const breadcrumbItems = getBreadcrumbItems(pathname)

  return (
    <header className="sticky top-0 z-30 flex h-(--header-height) shrink-0 items-center gap-2 border-b border-border/60 bg-background/78 shadow-[0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-xl transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height) supports-[backdrop-filter]:bg-background/70">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <div className="flex h-full items-center">
          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-4"
          />
        </div>
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbItems.map((item, index) => {
              const isLast = index === breadcrumbItems.length - 1

              return (
                <Fragment key={`${item.label}-${index}`}>
                  {index > 0 && <BreadcrumbSeparator />}
                  <BreadcrumbItem>
                    {isLast || !item.href ? (
                      <BreadcrumbPage className="font-medium">
                        {item.label}
                      </BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        <Link href={item.href}>{item.label}</Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </Fragment>
              )
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  )
}

export function AdminShell({ user, children }: AdminShellProps) {
  return (
    <TooltipProvider>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "18rem",
            "--header-height": "3.5rem",
          } as CSSProperties
        }
      >
        <AdminSidebar user={user} />
        <SidebarInset>
          <AdminSiteHeader />
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">
                {children}
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}
