import Link from "next/link"
import type { ComponentProps, ReactNode } from "react"

import { cn } from "@/lib/utils"

type Variant = "solid" | "outline" | "ghost"
type Size = "sm" | "md"

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors duration-150 disabled:pointer-events-none disabled:opacity-50 whitespace-nowrap"

const variants: Record<Variant, string> = {
  solid: "bg-ink text-paper hover:bg-accent-strong hover:text-accent-contrast",
  outline:
    "border border-rule-strong text-ink hover:border-accent hover:text-accent-strong",
  ghost: "text-ink-muted hover:text-ink hover:bg-paper-sunken",
}

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-[0.9375rem]",
}

function classes(variant: Variant, size: Size, className?: string) {
  return cn(base, variants[variant], sizes[size], className)
}

export function Button({
  variant = "solid",
  size = "md",
  className,
  ...props
}: ComponentProps<"button"> & { variant?: Variant; size?: Size }) {
  return <button className={classes(variant, size, className)} {...props} />
}

/** Internal navigation. */
export function ButtonLink({
  variant = "solid",
  size = "md",
  className,
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant; size?: Size }) {
  return <Link className={classes(variant, size, className)} {...props} />
}

/** External links and downloads — plain anchor, with rel set correctly. */
export function ButtonAnchor({
  variant = "solid",
  size = "md",
  className,
  external,
  children,
  ...props
}: ComponentProps<"a"> & {
  variant?: Variant
  size?: Size
  external?: boolean
  children: ReactNode
}) {
  return (
    <a
      className={classes(variant, size, className)}
      {...(external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
      {...props}
    >
      {children}
    </a>
  )
}
