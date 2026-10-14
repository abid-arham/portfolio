import { Section } from "@/components/layout/section"
import { FeaturedProjectCard, ProjectCard } from "@/components/work/project-card"
import { caseStudies, featuredProject, otherProjects, projects } from "@/data/projects"

/** Counted from the data, so adding a project can't leave the heading lying. */
const WORDS = ["No", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"]

function count(n: number) {
  return WORDS[n] ?? String(n)
}

export function WorkSection() {
  return (
    <Section
      id="work"
      label="Selected work"
      title={`${count(projects.length)} things I've built.`}
      intro={`${count(caseStudies.length)} of them have a write-up explaining the decision that shaped them — the constraint, what I did about it, and what I'd defend in a review.`}
    >
      <FeaturedProjectCard project={featuredProject} />

      <div className="mt-14 grid gap-6 sm:grid-cols-2">
        {otherProjects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </Section>
  )
}
