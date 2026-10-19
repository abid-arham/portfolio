import { Fragment } from "react"

import { Section } from "@/components/layout/section"
import { TechIcon } from "@/components/ui/icons"
import { profile } from "@/data/profile"
import { skills } from "@/data/skills"

export function About() {
  return (
    <Section id="about" label="About" title="How I work." bleed>
      <div className="grid gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
        <div className="space-y-5 text-[1.0625rem] leading-relaxed text-ink-muted">
          {profile.about.map((paragraph) => (
            <p key={paragraph.slice(0, 32)}>{paragraph}</p>
          ))}
        </div>

        <dl className="space-y-6">
          {skills.map((group) => (
            <div
              key={group.category}
              className="border-t border-rule pt-4 first:border-t-0 first:pt-0"
            >
              <dt className="label mb-2.5">{group.category}</dt>
              <dd className="text-[0.9375rem] leading-relaxed text-ink-muted">
                {group.items.map((item, i) => (
                  <Fragment key={item}>
                    {i > 0 && " · "}
                    <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                      <TechIcon label={item} className="size-3.5" />
                      {item}
                    </span>
                  </Fragment>
                ))}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </Section>
  )
}
