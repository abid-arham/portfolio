import { ArrowLeft, ArrowUpRight, Lock } from "lucide-react"
import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"

import { container } from "@/components/layout/section"
import { SiteFooter } from "@/components/layout/site-footer"
import { SiteHeader } from "@/components/layout/site-header"
import { GitHubMark } from "@/components/ui/icons"
import { Tag } from "@/components/ui/tag"
import { caseStudies, projects } from "@/data/projects"
import { cn } from "@/lib/utils"

type Params = { slug: string }

export function generateStaticParams() {
  return caseStudies.map((project) => ({ slug: project.slug }))
}

/**
 * Renders `backtick spans` in case-study prose as inline code. The copy was
 * already written with them; without this they render as literal backticks.
 */
function withInlineCode(text: string) {
  return text.split(/`([^`]+)`/g).map((part, index) =>
    index % 2 === 1 ? (
      <code
        key={index}
        className="rounded bg-paper-sunken px-1 py-0.5 font-mono text-[0.875em] text-ink"
      >
        {part}
      </code>
    ) : (
      part
    )
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { slug } = await params
  const project = projects.find((p) => p.slug === slug)
  if (!project) return {}

  return {
    title: `${project.title} — ${project.subtitle}`,
    description: project.summary,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: {
      type: "article",
      title: `${project.title} — ${project.subtitle}`,
      description: project.summary,
      url: `/work/${project.slug}`,
    },
  }
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<Params>
}) {
  const { slug } = await params
  const project = projects.find((p) => p.slug === slug)

  if (!project?.caseStudy) notFound()

  const { caseStudy } = project

  return (
    <>
      <SiteHeader />

      <main id="main">
        <article className="pb-8 pt-12 sm:pt-16">
          <div className={container}>
            <Link
              href="/#work"
              className="inline-flex items-center gap-2 text-sm text-ink-muted transition-colors hover:text-accent-strong"
            >
              <ArrowLeft className="size-4" /> All work
            </Link>

            <header className="mt-10 max-w-3xl">
              <p className="label mb-4">
                {project.year} · {project.subtitle}
              </p>
              <h1 className="display text-[clamp(2.5rem,7vw,4.5rem)]">
                {project.title}
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-ink-muted sm:text-xl">
                {caseStudy.intro}
              </p>
            </header>

            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-1.5 font-medium text-accent-strong underline decoration-accent/40 underline-offset-4 transition-colors hover:decoration-accent"
                >
                  Visit the live site <ArrowUpRight className="size-3.5" />
                </a>
              )}
              {project.repoUrl && (
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-1.5 text-ink-muted transition-colors hover:text-ink"
                >
                  <GitHubMark className="size-3.5" /> Source
                </a>
              )}
              {project.extraLinks?.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-1.5 text-ink-muted transition-colors hover:text-ink"
                >
                  {link.label} <ArrowUpRight className="size-3.5" />
                </a>
              ))}
              {project.privateRepo && (
                <span className="inline-flex items-center gap-1.5 text-ink-faint">
                  <Lock className="size-3.5" /> Private repo — client work
                </span>
              )}
            </div>

            <div className="mt-6 flex flex-wrap gap-1.5">
              {project.stack.map((tech) => (
                <Tag key={tech}>{tech}</Tag>
              ))}
            </div>

            <figure className="mt-12">
              <Image
                src={project.cover.src}
                alt={project.cover.alt}
                width={project.cover.width}
                height={project.cover.height}
                priority
                sizes="(min-width: 1024px) 64rem, 100vw"
                className="w-full rounded-xl border border-rule"
              />
            </figure>
          </div>
        </article>

        <div className={cn(container, "pb-24 pt-16")}>
          <div className="max-w-2xl space-y-14">
            {caseStudy.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="display mb-5 text-3xl">{section.heading}</h2>
                <div className="space-y-4 text-[1.0625rem] leading-relaxed text-ink-muted">
                  {section.body.map((block, index) =>
                    typeof block === "string" ? (
                      <p key={`${section.heading}-${index}`}>{withInlineCode(block)}</p>
                    ) : (
                      <pre
                        key={`${section.heading}-${index}`}
                        className="overflow-x-auto rounded-xl border border-rule bg-paper-sunken p-4 font-mono text-[0.8125rem] leading-relaxed text-ink"
                      >
                        <code>{block.code}</code>
                      </pre>
                    )
                  )}
                </div>
              </section>
            ))}
          </div>

          <nav className="mt-20 border-t border-rule pt-8">
            <p className="label mb-5">More write-ups</p>
            <ul className="flex flex-wrap gap-x-8 gap-y-3">
              {caseStudies
                .filter((p) => p.slug !== project.slug)
                .map((p) => (
                  <li key={p.slug}>
                    <Link
                      href={`/work/${p.slug}`}
                      className="group inline-flex items-baseline gap-2"
                    >
                      <span className="display text-2xl transition-colors group-hover:text-accent-strong">
                        {p.title}
                      </span>
                      <span className="text-sm text-ink-faint">{p.subtitle}</span>
                    </Link>
                  </li>
                ))}
            </ul>
          </nav>
        </div>
      </main>

      <SiteFooter />
    </>
  )
}
