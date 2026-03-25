"use client"

import * as React from "react"
import Link from "next/link"
import { IconChevronLeft, IconLayoutRows } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type DashboardLogoHeaderProps = {
  variant: "dashboard"
  appName?: string
  logoHref?: string
}

type DashboardBackHeaderProps = {
  variant: "dashboard-back"
  title: string
  backHref?: string
  backLabel?: string
}

type DashboardHeaderProps = (
  | DashboardLogoHeaderProps
  | DashboardBackHeaderProps
) & {
  className?: string
}

function Header(props: DashboardHeaderProps) {
  const [isVisible, setIsVisible] = React.useState(true)
  const lastScrollYRef = React.useRef(0)

  React.useEffect(() => {
    lastScrollYRef.current = window.scrollY

    function controlHeader() {
      const currentScrollY = window.scrollY

      if (currentScrollY > lastScrollYRef.current && currentScrollY > 100) {
        setIsVisible(false)
      } else {
        setIsVisible(true)
      }

      lastScrollYRef.current = currentScrollY
    }

    window.addEventListener("scroll", controlHeader, { passive: true })

    return () => {
      window.removeEventListener("scroll", controlHeader)
    }
  }, [])

  return (
    <header
      className={cn(
        "sticky top-0 z-10 -mx-4 mb-5 border-b border-border/70 bg-background/95 px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-3 backdrop-blur transition-transform duration-300 ease-out will-change-transform motion-reduce:transition-none supports-backdrop-filter:bg-background/70",
        isVisible ? "translate-y-0" : "-translate-y-full",
        props.className
      )}
    >
      {props.variant === "dashboard" ? (
        <Link
          href={props.logoHref ?? "/"}
          className="flex items-center gap-2.5"
        >
          <span className="flex size-8 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <IconLayoutRows className="size-4" />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-xs text-muted-foreground">
              Building & Maintenance
            </span>
            <span className="text-sm font-semibold">
              {props.appName ?? "SPARTA Energy"}
            </span>
          </span>
        </Link>
      ) : (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="rounded-full px-2"
            asChild
          >
            <Link href={props.backHref ?? "/"}>
              <IconChevronLeft className="size-4" />
            </Link>
          </Button>
          <h1 className="text-base font-semibold">{props.title}</h1>
        </div>
      )}
    </header>
  )
}

export { Header }
