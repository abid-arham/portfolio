import { ArrowUpRight } from "lucide-react"

import { getLeetCodeStats } from "@/data/leetcode"

const ROWS = [
  { key: "easy", label: "Easy" },
  { key: "medium", label: "Medium" },
  { key: "hard", label: "Hard" },
] as const

export async function LeetCodeCard() {
  const stats = await getLeetCodeStats()

  return (
    <div className="rounded-2xl border border-rule bg-paper-raised p-6">
      <div className="mb-5 flex items-baseline justify-between gap-3">
        <p className="label">LeetCode</p>
        <a
          href={stats.profileUrl}
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex items-center gap-1 text-sm text-ink-muted transition-colors hover:text-accent-strong"
        >
          @{stats.username} <ArrowUpRight className="size-3.5" />
        </a>
      </div>

      <p className="display text-4xl">
        {stats.solved.total}
        <span className="ml-2 text-xl text-ink-faint">solved</span>
      </p>

      <dl className="mt-5 space-y-3">
        {ROWS.map((row) => {
          const solved = stats.solved[row.key]
          const total = stats.totals[row.key]
          const pct = total > 0 ? (solved / total) * 100 : 0
          return (
            <div key={row.key} className="grid grid-cols-[4.5rem_1fr_auto] items-center gap-3">
              <dt className="font-mono text-xs text-ink-faint">{row.label}</dt>
              <dd
                className="h-1 overflow-hidden rounded-full bg-paper-sunken"
                aria-hidden
              >
                <div
                  className="h-full rounded-full bg-accent"
                  // Floor the width so a non-zero count is still visible;
                  // zero stays genuinely empty.
                  style={{ width: solved > 0 ? `max(0.25rem, ${pct}%)` : 0 }}
                />
              </dd>
              <dd className="font-mono text-xs tabular-nums text-ink-muted">
                {solved}
                <span className="text-ink-faint"> / {total}</span>
              </dd>
            </div>
          )
        })}
      </dl>
    </div>
  )
}
