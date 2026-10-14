import { ArrowDown, ArrowRight } from "lucide-react"
import Image from "next/image"

import { container } from "@/components/layout/section"
import { ButtonAnchor, ButtonLink } from "@/components/ui/button"
import { DepthText } from "@/components/ui/depth-text"
import { profile } from "@/data/profile"
import { cn } from "@/lib/utils"

function Portrait() {
  if (!profile.portraitUrl) return null

  return (
    <div className="rise lg:pt-14" style={{ animationDelay: "200ms" }}>
      {/* A soft rounded rectangle, not a circle — the circular avatar is the
          most template-looking shape on the web. */}
      <div className="relative aspect-square w-44 overflow-hidden rounded-[2rem] border border-rule bg-paper-sunken sm:w-52 lg:w-72">
        <Image
          src={profile.portraitUrl}
          alt={profile.portraitAlt}
          width={800}
          height={800}
          priority
          sizes="(min-width: 1024px) 18rem, 13rem"
          className="size-full object-cover"
        />
      </div>
    </div>
  )
}

export function Hero() {
  return (
    <section className="relative overflow-hidden pb-16 pt-14 sm:pb-24 sm:pt-20">
      {/* Warm bloom behind the headline. Subtle — it should read as paper,
          not as a gradient. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[32rem] w-[48rem] -translate-x-1/2 rounded-full bg-accent-wash opacity-60 blur-3xl"
      />

      <div className={cn(container, "relative")}>
        <div
          className={cn(
            "grid items-start gap-10",
            profile.portraitUrl && "lg:grid-cols-[1fr_auto] lg:gap-14"
          )}
        >
          <div>
            <div className="rise mb-7">
              <DepthText
                text={profile.name}
                fontSize="clamp(2.25rem,6.5vw,4rem)"
                layers={18}
                depth={1.8}
                tilt={6}
              />
              <p className="label mt-3">{profile.role}</p>
            </div>

            <h1
              className="rise display max-w-3xl text-[clamp(2.25rem,5.5vw,3.75rem)]"
              style={{ animationDelay: "60ms" }}
            >
              I build web apps from the{" "}
              <span className="italic text-accent">schema</span> up.
            </h1>

            <p
              className="rise mt-8 max-w-xl text-lg leading-relaxed text-ink-muted sm:text-xl"
              style={{ animationDelay: "80ms" }}
            >
              {profile.positioning}
            </p>

            <div
              className="rise mt-10 flex flex-wrap items-center gap-3"
              style={{ animationDelay: "160ms" }}
            >
              <ButtonLink href="/#work">
                View the work <ArrowRight className="size-4" />
              </ButtonLink>
              <ButtonAnchor href={profile.resumeUrl} variant="outline" download>
                Résumé <ArrowDown className="size-4" />
              </ButtonAnchor>
            </div>
          </div>

          <Portrait />
        </div>

        <div
          className="rise mt-14 flex flex-wrap items-center justify-between gap-x-8 gap-y-3 border-t border-rule pt-6 text-sm"
          style={{ animationDelay: "240ms" }}
        >
          <p className="max-w-md text-ink-faint">
            Final-year CSE student at AIUB, graduating April 2027. Open to
            internship and junior engineering roles.
          </p>
          <nav className="flex gap-5" aria-label="Profiles">
            {profile.socials.map((social) => (
              <a
                key={social.href}
                href={social.href}
                target="_blank"
                rel="noreferrer noopener"
                className="text-ink-muted underline decoration-rule-strong underline-offset-4 transition-colors hover:text-accent-strong hover:decoration-accent"
              >
                {social.label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </section>
  )
}
