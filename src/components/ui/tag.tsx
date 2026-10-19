import type { ReactNode } from "react"

import { TechIcon } from "@/components/ui/icons"
import { cn } from "@/lib/utils"

/**
 * Stack chip. Monospace, quiet — the list should read as data, not decoration.
 * Known techs get their mark in currentColor rather than brand colours, so a
 * row of chips stays inside the one-accent palette.
 */
export function Tag({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-rule bg-paper-raised px-2.5 py-1 font-mono text-[0.6875rem] leading-none text-ink-muted",
        className
      )}
    >
      {typeof children === "string" && <TechIcon label={children} className="size-3" />}
      {children}
    </span>
  )
}
