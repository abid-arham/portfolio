"use client"

import Link from "next/link"
import { useEffect, useState } from "react"

import { ThemeToggle } from "@/components/theme-toggle"
import { container } from "@/components/layout/section"
import { cn } from "@/lib/utils"

const nav = [
  { label: "Work", href: "/#work" },
  { label: "About", href: "/#about" },
  { label: "Background", href: "/#background" },
  { label: "Contact", href: "/#contact" },
]

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={cn(
        "sticky top-0 z-40 transition-colors duration-200",
        scrolled
          ? "border-b border-rule bg-paper/85 backdrop-blur-md"
          : "border-b border-transparent"
      )}
    >
      <div className={cn(container, "flex h-16 items-center justify-between gap-4")}>
        <Link
          href="/"
          className="font-display text-xl tracking-tight transition-colors hover:text-accent-strong"
        >
          Abid Arham
        </Link>

        <nav className="hidden items-center gap-7 sm:flex" aria-label="Main">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-ink-muted transition-colors hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <Link
            href="/#contact"
            className="text-sm text-ink-muted transition-colors hover:text-ink sm:hidden"
          >
            Contact
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
