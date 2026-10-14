# Portfolio — Abid Arham

Personal site and engineering write-ups. Built with Next.js 16, React 19, TypeScript and
Tailwind CSS 4.

**Live:** https://abidarham.pro.bd

![Home page](public/work/white-h.webp)

## What's here

- **Work** — five projects, each with a real screenshot of the running software.
- **Write-ups** — long-form case studies at `/work/[slug]` for the three projects with a
  decision worth defending: White.H, DevPulse, FixItNow. Each is structured as *the
  constraint → what I built → what I'd defend in review*.
- **Contact** — a real form backed by Resend, with server-side validation, a honeypot, and
  rate limiting. If it isn't configured it returns a clear error instead of pretending to send.

## Stack

| | |
|---|---|
| Framework | Next.js 16 (App Router, Cache Components) |
| Language | TypeScript |
| Styling | Tailwind CSS 4, CSS-first theme tokens |
| Fonts | Instrument Serif, Inter, JetBrains Mono — self-hosted via `next/font` |
| Forms | react-hook-form + Zod |
| Email | Resend REST API |
| Theming | next-themes, class strategy |

No UI component library. The handful of primitives in `src/components/ui` are a few dozen
lines each.

## Local setup

```bash
npm install
cp .env.example .env.local   # fill in the values you need
npm run dev                  # http://localhost:3000
```

`npm run build && npm start` for a production build.

## Environment

| Variable | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | for deploys | Canonical origin for metadata, sitemap, robots, OG images |
| `RESEND_API_KEY` | for the contact form | [resend.com/api-keys](https://resend.com/api-keys) |
| `CONTACT_TO_EMAIL` | for the contact form | Where messages are delivered |
| `CONTACT_FROM_EMAIL` | optional | Must be a Resend-verified domain |

Without the Resend variables the form responds 503 and tells visitors to email directly.

## Layout

```
src/
  app/
    page.tsx              home
    work/[slug]/page.tsx  case studies, statically generated
    api/contact/route.ts  form handler
    opengraph-image.tsx   social preview
    sitemap.ts robots.ts
  components/
    layout/  header, footer, section shell
    work/    project cards and the work section
    ui/      button, tag, icons
  data/      all copy and content — edit here, not in components
  lib/       utils, site URL, contact schema
```

**All content lives in `src/data`.** Adding a project means adding one object to
`src/data/projects.ts`; nothing in `components/` needs to change.

## Notes

- `src/data/profile.ts` has `showLeetCodeStats` — a single flag that adds or removes the
  LeetCode panel.
- `portraitUrl` in the same file can be set to `null`; the hero reflows to one column and
  stays complete without a photo.
- LeetCode numbers are fetched live and revalidate daily, falling back to a committed
  snapshot if the request fails.
- Project covers in `public/work/` are WebP, 1440×900, ~240 KB for all five.
