export interface LeetCodeStats {
  username: string
  profileUrl: string
  solved: { easy: number; medium: number; hard: number; total: number }
  totals: { easy: number; medium: number; hard: number; total: number }
  /** True when these numbers came from LeetCode just now rather than the snapshot. */
  live: boolean
}

const USERNAME = "abidarham"

/**
 * Committed snapshot, used when the live fetch fails. Verified 2026-10-14.
 * Keeping a fallback means a LeetCode outage degrades to slightly stale
 * numbers rather than a broken section.
 */
const SNAPSHOT: LeetCodeStats = {
  username: USERNAME,
  profileUrl: `https://leetcode.com/u/${USERNAME}/`,
  solved: { easy: 3, medium: 7, hard: 0, total: 10 },
  totals: { easy: 971, medium: 2128, hard: 983, total: 4082 },
  live: false,
}

const QUERY = `query($u: String!) {
  matchedUser(username: $u) {
    submitStatsGlobal { acSubmissionNum { difficulty count } }
  }
  allQuestionsCount { difficulty count }
}`

type Bucket = { difficulty: string; count: number }

function pick(buckets: Bucket[] | undefined, difficulty: string): number | null {
  const found = buckets?.find((b) => b.difficulty === difficulty)
  return typeof found?.count === "number" ? found.count : null
}

/**
 * Fetches live counts, revalidating daily. Falls back to the snapshot on any
 * failure — a bad shape, a non-200, a network error, or a renamed account.
 * The card should never be the reason a page fails to render.
 */
export async function getLeetCodeStats(): Promise<LeetCodeStats> {
  try {
    const res = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json", Referer: "https://leetcode.com" },
      body: JSON.stringify({ query: QUERY, variables: { u: USERNAME } }),
      next: { revalidate: 86_400 },
    })
    if (!res.ok) return SNAPSHOT

    const json = await res.json()
    const solvedBuckets: Bucket[] | undefined =
      json?.data?.matchedUser?.submitStatsGlobal?.acSubmissionNum
    const totalBuckets: Bucket[] | undefined = json?.data?.allQuestionsCount

    const solved = {
      easy: pick(solvedBuckets, "Easy"),
      medium: pick(solvedBuckets, "Medium"),
      hard: pick(solvedBuckets, "Hard"),
      total: pick(solvedBuckets, "All"),
    }
    const totals = {
      easy: pick(totalBuckets, "Easy"),
      medium: pick(totalBuckets, "Medium"),
      hard: pick(totalBuckets, "Hard"),
      total: pick(totalBuckets, "All"),
    }

    const values = [...Object.values(solved), ...Object.values(totals)]
    if (values.some((v) => v === null)) return SNAPSHOT

    return {
      ...SNAPSHOT,
      solved: solved as LeetCodeStats["solved"],
      totals: totals as LeetCodeStats["totals"],
      live: true,
    }
  } catch {
    return SNAPSHOT
  }
}
