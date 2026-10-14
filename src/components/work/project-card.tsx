import { ArrowUpRight, Lock } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { GitHubMark } from "@/components/ui/icons"
import { Tag } from "@/components/ui/tag"
import type { Project } from "@/data/projects"
import { cn } from "@/lib/utils"

function Links({ project }: { project: Project }) {
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
      {project.caseStudy && (
        <Link
          href={`/work/${project.slug}`}
          className="inline-flex items-center gap-1.5 font-medium text-accent-strong underline decoration-accent/40 underline-offset-4 transition-colors hover:decoration-accent"
        >
          Read the write-up <ArrowUpRight className="size-3.5" />
        </Link>
      )}
      {project.liveUrl && (
        <a
          href={project.liveUrl}
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex items-center gap-1.5 text-ink-muted transition-colors hover:text-ink"
        >
          Live site <ArrowUpRight className="size-3.5" />
        </a>
      )}
      {project.repoUrl && (
        <a
          href={project.repoUrl}
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex items-center gap-1.5 text-ink-muted transition-colors hover:text-ink"
        >
          <GitHubMark className="size-3.5" /> Code
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
  )
}

function Cover({ project, priority }: { project: Project; priority?: boolean }) {
  return (
    <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-rule bg-paper-sunken">
      <Image
        src={project.cover.src}
        alt={project.cover.alt}
        width={project.cover.width}
        height={project.cover.height}
        priority={priority}
        sizes="(min-width: 1024px) 50vw, 100vw"
        className="size-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
      />
    </div>
  )
}

/** Full-width, image beside copy. Used for the strongest project. */
export function FeaturedProjectCard({ project }: { project: Project }) {
  return (
    <article className="group grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-12">
      <Cover project={project} priority />

      <div>
        <div className="mb-3 flex flex-wrap items-center gap-3">
          <span className="label">{project.year}</span>
          {project.badge && (
            <span className="rounded-full bg-accent px-2.5 py-1 font-mono text-[0.625rem] uppercase tracking-wider text-accent-contrast">
              {project.badge}
            </span>
          )}
        </div>

        <h3 className="display text-3xl sm:text-4xl">{project.title}</h3>
        <p className="mt-2 text-ink-muted">{project.subtitle}</p>

        <ul className="mt-6 space-y-2.5 text-[0.9375rem] leading-relaxed text-ink-muted">
          {project.highlights.map((highlight) => (
            <li key={highlight} className="flex gap-3">
              <span aria-hidden className="mt-2.5 size-1 shrink-0 rounded-full bg-accent" />
              {highlight}
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-wrap gap-1.5">
          {project.stack.map((tech) => (
            <Tag key={tech}>{tech}</Tag>
          ))}
        </div>

        <div className="mt-6">
          <Links project={project} />
        </div>
      </div>
    </article>
  )
}

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article
      className={cn(
        "group flex flex-col rounded-2xl border border-rule bg-paper-raised p-5 transition-colors",
        "hover:border-rule-strong"
      )}
    >
      <Cover project={project} />

      <div className="flex flex-1 flex-col pt-5">
        <div className="mb-2 flex items-baseline justify-between gap-3">
          <h3 className="display text-2xl">{project.title}</h3>
          <span className="label shrink-0">{project.year}</span>
        </div>

        <p className="text-sm text-ink-muted">{project.subtitle}</p>
        <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-muted">
          {project.summary}
        </p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.stack.map((tech) => (
            <Tag key={tech}>{tech}</Tag>
          ))}
        </div>

        <div className="mt-5 pt-1">
          <Links project={project} />
        </div>
      </div>
    </article>
  )
}
