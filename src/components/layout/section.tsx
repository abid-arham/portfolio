import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

/** Shared page gutter. One definition so columns line up across sections. */
export const container = "mx-auto w-full max-w-5xl px-6 sm:px-8"

export function Section({
  id,
  label,
  title,
  intro,
  children,
  className,
  bleed,
}: {
  id?: string
  label?: string
  title?: string
  intro?: string
  children: ReactNode
  className?: string
  /** Tinted band, used to break up the page rhythm. */
  bleed?: boolean
}) {
  return (
    <section
      id={id}
      className={cn(
        "scroll-mt-24 border-t border-rule py-20 sm:py-28",
        bleed && "bg-paper-sunken",
        className
      )}
    >
      <div className={container}>
        {(label || title || intro) && (
          <header className="mb-12 max-w-2xl">
            {label && <p className="label mb-4">{label}</p>}
            {title && (
              <h2 className="display text-4xl sm:text-5xl">{title}</h2>
            )}
            {intro && (
              <p className="mt-5 text-lg leading-relaxed text-ink-muted">{intro}</p>
            )}
          </header>
        )}
        {children}
      </div>
    </section>
  )
}
