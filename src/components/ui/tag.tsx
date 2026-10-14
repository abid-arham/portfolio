import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

/** Stack chip. Monospace, quiet — the list should read as data, not decoration. */
export function Tag({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-rule bg-paper-raised px-2.5 py-1 font-mono text-[0.6875rem] leading-none text-ink-muted",
        className
      )}
    >
      {children}
    </span>
  )
}
