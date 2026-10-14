import { Section } from "@/components/layout/section"
import { FeaturedProjectCard, ProjectCard } from "@/components/work/project-card"
import { featuredProject, otherProjects } from "@/data/projects"

export function WorkSection() {
  return (
    <Section
      id="work"
      label="Selected work"
      title="Five things I've built."
      intro="Three of them have a write-up explaining the decision that shaped them — the constraint, what I did about it, and what I'd defend in a review."
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
