/**
 * Canonical site URL for metadata, sitemap, robots, and OG images.
 * Set NEXT_PUBLIC_SITE_URL in the environment to the production origin.
 */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
).replace(/\/$/, "")
