import type { MetadataRoute } from "next"

import { caseStudies } from "@/data/projects"
import { siteUrl } from "@/lib/site"

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  return [
    { url: siteUrl, lastModified: now, changeFrequency: "monthly", priority: 1 },
    ...caseStudies.map((project) => ({
      url: `${siteUrl}/work/${project.slug}`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.8,
    })),
  ]
}
