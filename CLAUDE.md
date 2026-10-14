# Portfolio — working notes

Personal portfolio for Abid Arham. Next.js 16 App Router, React 19, TypeScript, Tailwind 4.

## Rules that matter here

**Content lives in `src/data`, never in components.** Adding a project is one object in
`src/data/projects.ts`. If you find yourself editing copy inside a component, the content
belongs in a data file instead.

**Every claim on this site must be checkable against the repo it describes.** The projects
link to public GitHub repos, and recruiters open them. A write-up that describes code the
repo doesn't contain is worse than no write-up. When editing `projects.ts`, verify the claim
against the actual source before shipping it.

**No placeholder images, ever.** Every cover in `public/work/` is either a screenshot of the
running software or a deliberately designed card. A grey box is the single most damaging
thing that can appear on this page.

**No fabricated metrics.** No invented user counts, uptime figures, or performance numbers.

## Design system

Defined entirely in `src/app/globals.css` as CSS custom properties, mapped to Tailwind
utilities via `@theme inline`. Warm paper, warm ink, one burnt-amber accent.

Two accent tokens, and the distinction is load-bearing:
- `--accent` — large text, fills, rules.
- `--accent-strong` — small text and links; darkened to clear 4.5:1.

Contrast was measured, not estimated. Light: ink 16.7:1, muted 8.0:1, faint 4.6:1. Keep it
that way — if you change the ramp, re-measure rather than assuming.

Type: Instrument Serif (display), Inter (body), JetBrains Mono (metadata labels, via the
`.label` class). All self-hosted through `next/font` — the site makes **zero** third-party
requests at runtime, and it should stay that way.

## Gotchas

- `cacheComponents: true` is on. `new Date()` and other unstable values break the prerender.
  This is why the footer has no copyright year.
- Satori (the OG image renderer) requires explicit `display: flex` on any element with more
  than one child, text nodes included.
- `lucide-react` v1 has no brand icons. The GitHub mark is an inline SVG in
  `src/components/ui/icons.tsx`.
- `turbopack.root` is pinned in `next.config.ts` — without it Turbopack walks up and finds an
  unrelated lockfile in the home directory.

## Commands

```bash
npm run dev
NODE_OPTIONS=--max-old-space-size=3072 npm run build   # 6.6 GB box; it thrashes otherwise
npm run lint
```
