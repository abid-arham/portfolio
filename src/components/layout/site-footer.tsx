import { container } from "@/components/layout/section"
import { profile } from "@/data/profile"
import { cn } from "@/lib/utils"

export function SiteFooter() {
  return (
    <footer className="border-t border-rule py-10">
      <div
        className={cn(
          container,
          "flex flex-col gap-4 text-sm text-ink-faint sm:flex-row sm:items-center sm:justify-between"
        )}
      >
        {/* No year on purpose — it would either go stale or force the whole
            footer out of the prerender for something nobody reads. */}
        <p>
          © {profile.name} · {profile.location}
        </p>
        <nav className="flex gap-5" aria-label="Elsewhere">
          {profile.socials.map((social) => (
            <a
              key={social.href}
              href={social.href}
              target="_blank"
              rel="noreferrer noopener"
              className="transition-colors hover:text-ink"
            >
              {social.label}
            </a>
          ))}
          <a
            href={`mailto:${profile.email}`}
            className="transition-colors hover:text-ink"
          >
            Email
          </a>
        </nav>
      </div>
    </footer>
  )
}
