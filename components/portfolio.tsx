'use client'

import Image from 'next/image'
import { FormEvent, useEffect, useState } from 'react'
import {
  ArrowDownToLine,
  ArrowUpRight,
  Check,
  Code2,
  ContactRound,
  Mail,
  Menu,
  Moon,
  Phone,
  Send,
  Sun,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Textarea } from '@/components/ui/textarea'

type Project = { title: string; subtitle: string; tech: string[]; details: string[]; live?: string; github?: string; private?: boolean }

const techStackIcons = 'https://skillicons.dev/icons?i=js,ts,react,redux,nextjs,nodejs,express,postgres,mongodb,mysql,php,docker,git,tailwind'

const skillIcons: Record<string, string> = {
  Frontend: 'html,css,js,ts,react,redux,nextjs,tailwind',
  Backend: 'nodejs,express,php',
  Databases: 'postgres,mysql,mongodb',
  Tools: 'git,docker',
  Fundamentals: 'cpp,java',
}

const skills = {
  Frontend: ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'Redux Toolkit', 'Next.js', 'Tailwind CSS'],
  Backend: ['Node.js', 'Express', 'PHP', 'REST APIs', 'JWT / Passport', 'RBAC', 'Prisma ORM', 'Mongoose'],
  Databases: ['PostgreSQL', 'MySQL', 'MongoDB'],
  Tools: ['Git', 'GitHub', 'Docker', 'Postman', 'Vercel', 'Render'],
  Fundamentals: ['DSA', 'C++', 'Java', 'OOP', 'Design Patterns'],
}

const projects: Project[] = [
  { title: 'White.H', subtitle: 'Clothing & Beauty E-Commerce Store', tech: ['React', 'Redux Toolkit', 'Express', 'TypeScript', 'MongoDB'], details: ['Production store for a real client with manual bKash/Nagad verification and duplicate transaction flagging.', 'JWT auth, bcrypt, RBAC, Zod validation, rate limiting, Resend alerts, Cloudinary uploads, and Docker.', 'Admin approval queue and MongoDB aggregation dashboard for operational insights.'], live: 'https://client-orcin-alpha-86.vercel.app', private: true },
  { title: 'FixItNow', subtitle: 'Home-Services Marketplace', tech: ['Next.js', 'Express', 'TypeScript', 'Prisma', 'PostgreSQL'], details: ['Independently deployed frontend and backend for technicians, categories, bookings, payments, and reviews.', 'Idempotent seed scripts keep environments predictable and repeatable.'], live: 'https://assignment-5-alpha-brown.vercel.app', github: 'https://github.com/abid-arham/FixItNow' },
  { title: 'Wanderlust', subtitle: 'Travel Listing App', tech: ['Node.js', 'Express', 'MongoDB', 'EJS', 'Passport'], details: ['MVC travel listings app with owner-only edit/delete middleware.', 'Cloudinary uploads and Mapbox maps make each listing useful and visual.'], live: 'https://wanderlust-oa2t.onrender.com', github: 'https://github.com/abid-arham/Wanderlust' },
  { title: 'NextCart', subtitle: 'Multi-Vendor E-Commerce Platform', tech: ['PHP', 'MySQL'], details: ['Four-portal marketplace for customers, sellers, delivery partners, and admins.', 'Built and owned the admin portal for managing the marketplace.'], github: 'https://github.com/abid-arham/Project-NextCart' },
  { title: 'DevPulse', subtitle: 'Issue Tracker REST API', tech: ['Node.js', 'TypeScript', 'PostgreSQL', 'JWT'], details: ['RBAC and issue CRUD backed by raw SQL under a strict no-ORM / no-JOIN constraint.', 'Focused API architecture that keeps authorization explicit and testable.'], github: 'https://github.com/abid-arham/devpulse' },
]

const navItems = ['about', 'skills', 'projects', 'education', 'experience', 'contact']

function SectionHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description?: string }) {
  return <div className="mb-10 max-w-2xl"><p className="mb-3 font-mono text-xs uppercase tracking-[0.25em] text-primary">{eyebrow}</p><h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2>{description && <p className="mt-4 leading-7 text-muted-foreground">{description}</p>}</div>
}

export default function Portfolio() {
  const [dark, setDark] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])
  const [sent, setSent] = useState(false)

  function submitContact(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    // TODO: connect this validated form to a real email provider before production use.
    setSent(true)
  }

  const toggleTheme = () => { setDark(!dark); document.documentElement.classList.toggle('dark', !dark) }

  return <div className={dark ? 'dark min-h-screen bg-background' : 'min-h-screen bg-background'}>
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 lg:px-8">
        <a href="#top" className="font-mono text-sm font-semibold tracking-tight">AA<span className="text-primary">.</span></a>
        <nav className="hidden items-center gap-6 md:flex">{navItems.map((item) => <a key={item} href={`#${item}`} className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground">{item}</a>)}</nav>
        <div className="flex items-center gap-2"><Button variant="ghost" size="icon" aria-label="Toggle color theme" onClick={toggleTheme}>{mounted ? (dark ? <Sun /> : <Moon />) : <span className="size-4" aria-hidden="true" />}</Button><Sheet open={menuOpen} onOpenChange={setMenuOpen}><SheetTrigger className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-sm transition-all outline-none hover:bg-muted focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:hidden" aria-label="Open menu"><Menu /></SheetTrigger><SheetContent><SheetTitle className="font-mono">Navigation</SheetTitle><nav className="mt-8 flex flex-col gap-5">{navItems.map((item) => <a key={item} href={`#${item}`} onClick={() => setMenuOpen(false)} className="font-mono text-sm uppercase tracking-wider">{item}</a>)}</nav></SheetContent></Sheet></div>
      </div>
    </header>

    <main id="top">
      <section className="relative overflow-hidden border-b border-border/60"><div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_75%_25%,color-mix(in_oklch,var(--primary)_12%,transparent),transparent_28%)]" /><div className="mx-auto grid max-w-6xl gap-12 px-5 py-24 sm:py-32 lg:grid-cols-[1.2fr_.8fr] lg:px-8 lg:py-40"><div className="relative"><p className="mb-6 font-mono text-sm text-primary">&gt; hello, world_</p><h1 className="max-w-3xl text-5xl font-semibold leading-[1.04] tracking-[-0.05em] sm:text-7xl">Abid Arham<span className="text-primary">.</span></h1><p className="mt-6 max-w-xl text-xl text-muted-foreground sm:text-2xl">Full-Stack Developer <span className="text-border">/</span> Software Engineering Intern</p><p className="mt-5 max-w-lg leading-7 text-muted-foreground">I build reliable, thoughtful web products from database to interface — with a bias toward clear APIs and useful details.</p><div className="mt-9 flex flex-wrap gap-3"><Button render={<a href="#projects" />}>View projects <ArrowUpRight data-icon="inline-end" /></Button><Button variant="outline" render={<a href="/resume.pdf" download />}>Download resume <ArrowDownToLine data-icon="inline-end" /></Button><Button variant="ghost" render={<a href="#contact" />}>Contact me</Button></div><div className="mt-10 flex items-center gap-5 text-muted-foreground"><a aria-label="GitHub" href="https://github.com/abid-arham" target="_blank" rel="noreferrer"><Code2 className="size-5 transition-colors hover:text-foreground" /></a><a aria-label="Email" href="mailto:mix.arham@gmail.com"><Mail className="size-5 transition-colors hover:text-foreground" /></a><a aria-label="LinkedIn placeholder" href="#contact"><ContactRound className="size-5 transition-colors hover:text-foreground" /></a></div></div><div className="relative flex flex-col items-center gap-8 lg:items-end"><div className="relative size-40 overflow-hidden rounded-full border border-primary/50 p-1 shadow-[0_0_35px_color-mix(in_oklch,var(--primary)_22%,transparent)]"><Image src="/placeholder.svg" alt="Portrait placeholder for Abid Arham" fill sizes="160px" className="rounded-full object-cover" priority /></div><div className="w-full max-w-sm border border-border bg-card p-5 font-mono text-xs text-muted-foreground shadow-2xl shadow-primary/5"><div className="mb-8 flex gap-2"><span className="size-2 rounded-full bg-primary/70" /><span className="size-2 rounded-full bg-muted-foreground/30" /><span className="size-2 rounded-full bg-muted-foreground/30" /></div><p><span className="text-primary">const</span> developer = &#123;</p><p className="pl-5">name: <span className="text-foreground">&quot;Abid Arham&quot;</span>,</p><p className="pl-5">location: <span className="text-foreground">&quot;Dhaka, BD&quot;</span>,</p><p className="pl-5">focus: <span className="text-foreground">&quot;full-stack&quot;</span>,</p><p className="pl-5">available: <span className="text-primary">true</span>,</p><p>&#125;</p><p className="mt-6 text-primary">// let&apos;s build something useful</p></div></div></div></section>

      <section id="about" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-24 lg:px-8"><SectionHeading eyebrow="01 / about" title="Curious about how things work." /><div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]"><p className="text-lg leading-8 text-muted-foreground">I&apos;m a final-year Computer Science and Engineering student at AIUB, graduating in April 2027 with a 3.78 CGPA. I enjoy turning messy requirements into maintainable systems — from REST APIs and auth flows to responsive interfaces that feel calm and intentional.</p><div className="flex items-center"><img src={techStackIcons} alt="JavaScript, TypeScript, React, Redux, Next.js, Node.js, Express, PostgreSQL, MongoDB, MySQL, PHP, Docker, Git, and Tailwind CSS" className="h-auto max-w-full" /></div></div></section>

      <section id="skills" className="scroll-mt-20 border-y border-border/60 bg-muted/20"><div className="mx-auto max-w-6xl px-5 py-24 lg:px-8"><SectionHeading eyebrow="02 / toolkit" title="Tools I reach for." description="A practical stack for shipping complete products, not just isolated screens." /><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{Object.entries(skills).map(([category, items]) => <Card key={category} className="bg-background/60"><CardHeader><CardTitle className="font-mono text-sm">{category}</CardTitle></CardHeader><CardContent><img src={`https://skillicons.dev/icons?i=${skillIcons[category]}`} alt={`${category} skills: ${items.join(', ')}`} className="h-auto max-w-full" /></CardContent></Card>)}</div></div></section>

      <section id="projects" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-24 lg:px-8"><SectionHeading eyebrow="03 / selected work" title="Things I&apos;ve shipped." description="A few systems where the interesting parts lived below the surface." /><div className="grid gap-5 lg:grid-cols-2">{projects.map((project, index) => <Card key={project.title} className={index === 0 ? 'border-primary/40 bg-primary/[0.03] lg:col-span-2' : ''}><div className="relative aspect-video w-full overflow-hidden rounded-t-xl border-b border-border"><Image src="/placeholder.svg" alt={`${project.title} project cover placeholder`} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" /></div><CardHeader><div className="flex items-start justify-between gap-4"><div><p className="mb-2 font-mono text-xs text-primary">0{index + 1}</p><CardTitle>{project.title}</CardTitle><CardDescription className="mt-1">{project.subtitle}</CardDescription></div>{project.private && <Badge variant="outline">Client work</Badge>}</div></CardHeader><CardContent><div className="mb-5 flex flex-wrap gap-2">{project.tech.map((tech) => <Badge key={tech} variant="secondary" className="font-mono text-[10px]">{tech}</Badge>)}</div><ul className="flex flex-col gap-2 text-sm leading-6 text-muted-foreground">{project.details.map((detail) => <li key={detail} className="flex gap-3"><Check className="mt-1 size-4 shrink-0 text-primary" />{detail}</li>)}</ul></CardContent><CardFooter className="gap-2">{project.live && <Button variant="outline" size="sm" render={<a href={project.live} target="_blank" rel="noreferrer" />}>Live site <ArrowUpRight data-icon="inline-end" /></Button>}{project.private ? <Badge variant="outline" className="h-8 px-3">Private repo — client project</Badge> : project.github && <Button variant="ghost" size="sm" render={<a href={project.github} target="_blank" rel="noreferrer" />}><Code2 data-icon="inline-start" /> GitHub</Button>}</CardFooter></Card>)}</div></section>

      <section id="education" className="scroll-mt-20 border-y border-border/60 bg-muted/20"><div className="mx-auto max-w-6xl px-5 py-24 lg:px-8"><SectionHeading eyebrow="04 / education" title="Learning by building." /><div className="grid gap-5 lg:grid-cols-3"><Card className="lg:col-span-2"><CardHeader><CardTitle>American International University-Bangladesh</CardTitle><CardDescription>B.Sc. in Computer Science & Engineering · Expected April 2027</CardDescription></CardHeader><CardContent className="flex flex-wrap gap-3"><Badge>CGPA 3.78</Badge><p className="text-sm leading-6 text-muted-foreground">Coursework note: Software Architecture — design patterns applied to database configuration and payment modules.</p></CardContent></Card><Card><CardHeader><CardTitle>Square High School & College</CardTitle><CardDescription>Pabna, Bangladesh</CardDescription></CardHeader><CardContent className="flex gap-2"><Badge variant="secondary">HSC 2021 · GPA 5.00</Badge><Badge variant="secondary">SSC 2019 · GPA 5.00</Badge></CardContent></Card></div></div></section>

      <section id="experience" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-24 lg:px-8"><SectionHeading eyebrow="05 / experience" title="Beyond the commit history." /><div className="grid gap-5 md:grid-cols-3">{[['IT Support Specialist Trainee', 'SEIP Pabna', 'Sep–Dec 2022'], ['Programming Contest Participant', 'AIUB', 'Mar 2024'], ['Founding Member', 'Pabna Students Association · COVID-19 relief program', 'Aug 2020–Jan 2021']].map(([role, org, date]) => <Card key={role}><CardHeader><CardTitle className="text-base">{role}</CardTitle><CardDescription>{org}</CardDescription></CardHeader><CardContent><p className="font-mono text-xs text-primary">{date}</p></CardContent></Card>)}</div></section>

      <section id="contact" className="scroll-mt-20 border-t border-border/60 bg-muted/20"><div className="mx-auto grid max-w-6xl gap-12 px-5 py-24 lg:grid-cols-[.8fr_1.2fr] lg:px-8"><div><SectionHeading eyebrow="06 / contact" title="Let&apos;s make something useful." description="Have a project, an internship opportunity, or a good problem to solve? I&apos;d love to hear about it." /><div className="flex flex-col gap-4 text-sm text-muted-foreground"><a className="flex items-center gap-3 hover:text-foreground" href="mailto:mix.arham@gmail.com"><Mail className="size-4 text-primary" />mix.arham@gmail.com</a><a className="flex items-center gap-3 hover:text-foreground" href="tel:+8801751921343"><Phone className="size-4 text-primary" />+88 01751921343</a></div></div><form onSubmit={submitContact} suppressHydrationWarning className="flex flex-col gap-5"><div className="grid gap-5 sm:grid-cols-2"><div className="flex flex-col gap-2"><Label htmlFor="name">Name</Label><Input id="name" name="name" required placeholder="Your name" /></div><div className="flex flex-col gap-2"><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" required placeholder="you@example.com" /></div></div><div className="flex flex-col gap-2"><Label htmlFor="message">Message</Label><Textarea id="message" name="message" required placeholder="Tell me a little about what you&apos;re working on..." rows={6} /></div><div className="flex items-center gap-4"><Button type="submit">{sent ? 'Message noted' : 'Send message'} {sent ? <Check data-icon="inline-end" /> : <Send data-icon="inline-end" />}</Button>{sent && <p className="text-sm text-muted-foreground">Thanks — I&apos;ll get back to you at your email.</p>}</div></form></div></section>
    </main>

    <footer><Separator /><div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-8 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between lg:px-8"><p>© 2026 Abid Arham. Built with Next.js &amp; shadcn/ui.</p><div className="flex gap-4"><a href="https://github.com/abid-arham" target="_blank" rel="noreferrer" className="hover:text-foreground">GitHub</a><a href="mailto:mix.arham@gmail.com" className="hover:text-foreground">Email</a></div></div></footer>
  </div>
}
