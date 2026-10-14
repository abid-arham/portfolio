"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <button
      type="button"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      aria-label="Toggle colour theme"
      className="inline-flex size-9 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-paper-sunken hover:text-ink"
    >
      {/*
        Which icon shows is decided by CSS from the class next-themes puts on
        <html>, not by React state. That avoids the usual mounted flag — the
        server renders both icons and the right one is visible immediately,
        with no hydration mismatch and no flash of the wrong glyph.
      */}
      <Sun className="hidden size-[1.05rem] dark:block" />
      <Moon className="size-[1.05rem] dark:hidden" />
    </button>
  )
}
