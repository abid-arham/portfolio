import { Section } from "@/components/layout/section"
import { education } from "@/data/education"
import { experience } from "@/data/experience"

export function Background() {
  return (
    <Section id="background" label="Background" title="Education and experience.">
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <h3 className="label mb-6">Education</h3>
          <ul className="space-y-7">
            {education.map((entry) => (
              <li
                key={`${entry.institution}-${entry.credential}`}
                className="border-l-2 border-rule pl-5"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h4 className="font-medium">{entry.institution}</h4>
                  <span className="font-mono text-xs text-ink-faint">{entry.date}</span>
                </div>
                <p className="mt-1 text-[0.9375rem] text-ink-muted">
                  {entry.credential}
                  {entry.detail && (
                    <>
                      {" · "}
                      <span className="text-accent-strong">{entry.detail}</span>
                    </>
                  )}
                </p>
                {entry.note && (
                  <p className="mt-2 text-sm leading-relaxed text-ink-faint">{entry.note}</p>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="label mb-6">Experience and activities</h3>
          <ul className="space-y-7">
            {experience.map((entry) => (
              <li key={entry.role} className="border-l-2 border-rule pl-5">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h4 className="font-medium">{entry.role}</h4>
                  <span className="font-mono text-xs text-ink-faint">{entry.date}</span>
                </div>
                <p className="mt-1 text-[0.9375rem] text-ink-muted">{entry.org}</p>
                <p className="mt-2 text-sm leading-relaxed text-ink-faint">{entry.detail}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  )
}
