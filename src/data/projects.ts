/**
 * A paragraph, or a code block. Case studies about data access are much
 * weaker when the one line that carries the argument is paraphrased.
 */
export type CaseStudyBlock = string | { code: string }

export interface CaseStudySection {
  heading: string
  body: CaseStudyBlock[]
}

export interface Project {
  slug: string
  title: string
  subtitle: string
  /** One sentence for the card. Concrete, not adjectival. */
  summary: string
  year: string
  stack: string[]
  liveUrl?: string
  repoUrl?: string
  /**
   * For projects that span more than one repo or deployment. The primary
   * liveUrl/repoUrl stay the front door; these sit beside them.
   */
  extraLinks?: { label: string; href: string }[]
  /** Client work with a private repo — say so rather than leaving a dead link. */
  privateRepo?: boolean
  featured?: boolean
  /**
   * Small caption on the featured card. Must be literally true of this
   * project — it used to be hardcoded, which made it a lie for anything
   * that wasn't client work.
   */
  badge?: string
  cover: {
    src: string
    alt: string
    width: number
    height: number
  }
  /** Three or four bullets for the card. */
  highlights: string[]
  /**
   * Long-form write-up. Only the projects with a decision worth defending get
   * one — a case study with nothing to say is worse than no case study.
   */
  caseStudy?: {
    intro: string
    sections: CaseStudySection[]
  }
}

export const projects: Project[] = [
  {
    slug: "quad",
    title: "Quad",
    subtitle: "University management system",
    summary:
      "Course registration, grading, transcripts and tuition for three different roles — a TypeScript API and a Next.js front end, both deployed, with demo accounts you can sign into.",
    year: "2026",
    stack: [
      "Next.js 16",
      "React 19",
      "TypeScript",
      "Express",
      "Prisma",
      "PostgreSQL",
      "TanStack Query",
      "Stripe",
    ],
    liveUrl: "https://assignment-7-three-xi.vercel.app/",
    repoUrl: "https://github.com/abid-arham/assignment-7",
    extraLinks: [
      { label: "API code", href: "https://github.com/abid-arham/assignment-6" },
      { label: "Live API", href: "https://assignment-6-tau-wine.vercel.app/" },
    ],
    featured: true,
    badge: "Live demo · sign in as any role",
    cover: {
      src: "/work/quad.webp",
      alt: "The Quad course catalogue, filtered by department",
      width: 1440,
      height: 900,
    },
    highlights: [
      "Three role-based workspaces — student, instructor, registrar — over one Express and Prisma API.",
      "The last seat in a section is claimed with a conditional SQL UPDATE, so two students racing for it can't both win.",
      "Access and refresh tokens live in httpOnly cookies; refresh tokens are stored hashed and revoked the moment they're rotated.",
      "Prerequisite chains are walked before insert, and a cycle is rejected with a 409 instead of being stored.",
    ],
    caseStudy: {
      intro:
        "Quad is a university management system: students register for courses and pay tuition, instructors grade their sections, and the registrar runs the catalogue. It's the largest thing I've built, and the parts worth talking about are all places where the obvious implementation is quietly wrong.",
      sections: [
        {
          heading: "Two students, one seat",
          body: [
            "Enrolling a student means checking that a section has room and then taking a seat. Written the obvious way — read the count, compare it to the capacity, write the enrollment — that is a race. Two requests can both read 29 of 30 and both proceed, and the section ends up over capacity. Wrapping it in a transaction alone doesn't fix it either; under the default isolation level both reads still see the pre-update value.",
            "The check and the increment have to be the same statement, so the database decides the winner. That turned out to need raw SQL, because Prisma's where clause can't compare one column against another:",
            {
              code: 'UPDATE "Section" SET "enrolledCount" = "enrolledCount" + 1\nWHERE id = ${sectionId} AND "enrolledCount" < capacity',
            },
            "If that reports zero rows updated, the section was full and the request gets a 409. The row lock PostgreSQL takes for the UPDATE is what serialises the two requests. A unique constraint on (student, section) catches the other race — the same student double-clicking register — and the P2002 it throws is translated into the same 409 rather than leaking as a 500.",
          ],
        },
        {
          heading: "Tokens the browser can't read",
          body: [
            "Both tokens are httpOnly cookies, so client JavaScript never touches them and an XSS bug can't walk off with a session. The access token expires with its JWT; the refresh token lasts seven days.",
            "Refresh tokens are stored as hashes, not plaintext — the database holds a `tokenHash`, so a dump of that table doesn't hand over working sessions. Rotating one revokes the old row in the same step, and refresh re-checks that the user still exists and is still active, so deactivating an account ends its sessions rather than waiting for them to expire.",
            "On the front end, `proxy.ts` verifies the access token's signature with `jose` and enforces which role may enter which area, and each role layout checks again on the server. The duplication is deliberate: the middleware is a gate, not a guarantee.",
          ],
        },
        {
          heading: "A cache I was willing to trust this time",
          body: [
            "On an earlier project I shipped a cache that served authenticated, per-user responses to the wrong user. That bug is why the caching here is deliberately narrow.",
            "Only the public course catalogue is cached, keyed by the full query, for sixty seconds — data that is identical for every visitor, signed in or not. Nothing scoped to a user goes near it. Every write to a course invalidates the whole `courses:list:` prefix rather than trying to work out which cached queries a given edit affected, because that calculation is exactly the kind of cleverness that gets it wrong.",
            "Catalogue rows are soft-deleted with a `deletedAt` timestamp and filtered out on read, so removing a course can't orphan the enrollment history that points at it.",
          ],
        },
        {
          heading: "Prerequisites that can't loop",
          body: [
            "Prerequisites form a graph, and nothing stops an administrator from making A require B while B already requires A. Stored, that cycle makes enrollment unsatisfiable for every student and the error surfaces far away from the edit that caused it.",
            "So adding a prerequisite walks the existing chain first and refuses with a 409 if the new edge would close a loop. Rejecting bad data at the write is cheaper than detecting it at every read, and the registrar gets the error while still looking at the form that caused it.",
          ],
        },
      ],
    },
  },

  {
    slug: "white-h",
    title: "White.H",
    subtitle: "Clothing and beauty e-commerce store",
    summary:
      "A production store for a Bangladeshi clothing and beauty brand, built around manual bKash and Nagad payments because card rails weren't an option.",
    year: "2026",
    stack: ["React", "Redux Toolkit", "TypeScript", "Express", "MongoDB", "Docker"],
    liveUrl: "https://client-orcin-alpha-86.vercel.app",
    badge: "Client work · in production",
    privateRepo: true,
    cover: {
      src: "/work/white-h.webp",
      alt: "The White.H storefront home page",
      width: 1440,
      height: 900,
    },
    highlights: [
      "Client project, live in production and taking real orders.",
      "Manual bKash/Nagad payment flow with an admin verification queue — fulfillment stays blocked until payment clears.",
      "Duplicate transaction IDs are flagged against already-verified orders.",
      "JWT access and refresh tokens, bcrypt, role-based admin routes, Zod validation, Helmet, rate-limited auth.",
    ],
    caseStudy: {
      intro:
        "White.H is the first thing I built that other people's money depends on. A Bangladeshi clothing and beauty brand needed a storefront, and the constraint that shaped the whole system was the one I had no control over: they could not accept card payments.",
      sections: [
        {
          heading: "The constraint",
          body: [
            "Card processing wasn't available to the client, so payment happens the way most small Bangladeshi commerce happens: the customer sends money through bKash or Nagad from their own phone, then types the transaction ID into the checkout form.",
            "That means the system has no authoritative confirmation that payment occurred. A transaction ID is a string a customer typed. It can be mistyped, invented, or — the case that actually costs the client money — reused from an order that was already paid and fulfilled.",
          ],
        },
        {
          heading: "What I built",
          body: [
            "Checkout accepts the order and the claimed transaction ID, but the order enters a pending state rather than a paid one. Fulfillment is blocked at the data level, not just hidden in the UI — an unverified order cannot move forward regardless of which screen an admin is looking at.",
            "Admins work a verification queue: each pending order shows the claimed transaction ID alongside the order total, and they approve or reject it against the payment app. Approval is the only transition that marks an order paid.",
            "Before an order reaches the queue, its transaction ID is checked against transaction IDs on already-verified orders. A match gets flagged for the admin rather than silently accepted. That one check is the difference between catching a reused ID and shipping goods for a payment that happened once.",
            "Email alerts go out through Resend so the client isn't required to sit in the admin panel to know an order came in.",
          ],
        },
        {
          heading: "Decisions I'd defend",
          body: [
            "Pending is the default, not an exception. Making the unpaid state the one the system falls into naturally means a bug in the verification path fails toward not shipping, rather than toward shipping for free.",
            "The duplicate check flags rather than rejects. A customer can legitimately mistype an ID that collides, and auto-rejecting a real order is worse for the client than asking an admin to look. Surfacing it to a human was the right call for the volume this store does.",
            "The API is secured in depth rather than at one gate: JWT access and refresh tokens, bcrypt password hashing, role-based admin routes, Zod request validation, Helmet, rate-limited auth endpoints, and a centralized error handler so failures return a consistent shape instead of leaking internals.",
          ],
        },
        {
          heading: "The rest of it",
          body: [
            "Admin panel: dashboard statistics via MongoDB aggregation, product and category CRUD with Cloudinary image uploads, paginated order search and filtering, and store settings.",
            "A React frontend built with Vite, Redux Toolkit and RTK Query, deployed on Vercel. The Express and TypeScript API runs on Render against MongoDB Atlas, containerized with a multi-stage Dockerfile.",
          ],
        },
      ],
    },
  },

  {
    slug: "devpulse",
    title: "DevPulse",
    subtitle: "Issue tracker REST API",
    summary:
      "An issue-tracking API written under a deliberate no-ORM, no-JOIN constraint — which turned a routine fetch into an interesting problem.",
    year: "2026",
    stack: ["Node.js", "TypeScript", "PostgreSQL", "JWT"],
    repoUrl: "https://github.com/abid-arham/devpulse",
    featured: false,
    cover: {
      src: "/work/devpulse.webp",
      alt: "A DevPulse API request and response pair",
      width: 1440,
      height: 900,
    },
    highlights: [
      "Raw SQL throughout — no ORM and no JOINs, by constraint.",
      "Reporter identity comes from the authenticated token, never the request body.",
      "Filters are composed as numbered placeholders, never string-concatenated.",
      "Role-gated routes via an auth(...roles) middleware.",
    ],
    caseStudy: {
      intro:
        "DevPulse is a REST API for tracking issues, written under two rules I didn't get to choose: no ORM, and no JOINs. Both sound like arbitrary obstacles until you hit the first query that wants one — and then they turn into a useful exercise in what an ORM has been doing for you.",
      sections: [
        {
          heading: "Composing filters without opening a SQL injection",
          body: [
            "Issues can be filtered by type and by status, and sorted oldest or newest first. Any subset of those can be present on a request, so the WHERE clause has to be built at runtime.",
            "The tempting version interpolates the values straight into the query string. That is how SQL injection happens, and it happens specifically in the dynamic-filter code, because that is the one place where building the string by hand feels unavoidable.",
            "Instead I push each value onto a values array and derive its placeholder from the array's own length — the filter becomes `type = $${n}` where n is the position the value just took. The clause is assembled from placeholders, the values travel separately to the driver, and nothing a client sends is ever part of the SQL text. Sort direction is the one piece that can't be a placeholder, so it's mapped from a fixed pair of options rather than passed through.",
          ],
        },
        {
          heading: "Fetching a reporter without a JOIN",
          body: [
            "Reading a single issue means returning the user who reported it. With an ORM that's an include; with SQL it's a JOIN. I had neither.",
            "So it's two queries: fetch the issue, read its reporter_id, fetch that user, and compose the two in application code. The user query selects id, name and role explicitly rather than SELECT *, so the password hash never leaves the database on a read path.",
            "This is the honest version of the constraint. It works cleanly for one issue. Doing the same thing across a list is where it would need a batched second query to avoid N+1, and that is the next thing I'd write.",
          ],
        },
        {
          heading: "Decisions I'd defend",
          body: [
            "The reporter is set from the authenticated token, never from the request body — in the controller it's `req.user.id`, and the field is simply not read off the payload. If a client can name the reporter, a client can forge the reporter. The body is attacker-controlled input; the verified token is not.",
            "Authorization is a middleware that takes the permitted roles as arguments, so a route declares who may call it at the point of definition. Keeping the check visible at the route rather than buried in a service is what makes it reviewable.",
            "Writing raw SQL was more work than reaching for Prisma, and given a free choice I'd use an ORM. But doing it by hand is why I can now read a generated query and know what it is actually asking the database to do.",
          ],
        },
      ],
    },
  },

  {
    slug: "aegis",
    title: "Aegis",
    subtitle: "Layered safety architecture for an LLM finance assistant",
    summary:
      "A software-architecture term project, built with Ratul Ferdous Hasan, that moves an LLM finance assistant's safety out of the model and into a layer every request has to cross — with a TypeScript prototype that runs the evaluation.",
    year: "2026",
    stack: ["TypeScript", "Node.js 22", "node:test", "Design patterns"],
    cover: {
      src: "/work/aegis.webp",
      alt: "Aegis ablation output: 15 of 15 policy-violating prompts blocked with mediation on, none with it off",
      width: 1440,
      height: 900,
    },
    highlights: [
      "The reasoning layer is untrusted: it imports nothing from the data layer, and every request, tool call and drafted answer crosses one mediation layer.",
      "Account IDs never enter the reasoning context — it gets opaque handles like H-0001, resolved only inside the trust boundary.",
      "Tools are deny-by-default; adding a sixth took a new file and a one-line grant, with zero lines changed in the enforcement layer.",
      "Chain of Responsibility, Adapter, Command, Repository and Observer, with zero runtime dependencies and 13 node:test tests.",
    ],
    caseStudy: {
      intro:
        "Aegis was our term project for Software Architecture & Design Patterns, designed and built with Ratul Ferdous Hasan. The brief was a personal-finance assistant driven by a language model, and the question we kept coming back to was where its safety actually lives. In most designs it lives in the prompt — inside the one component nobody on the team controls. We moved it out.",
      sections: [
        {
          heading: "Safety the model can't opt out of",
          body: [
            "The usual way to stop an LLM assistant from recommending stocks or reading out account numbers is to ask it not to: a system prompt, a classifier, a trained-in refusal. All of that sits inside the model. It's probabilistic, it can't be audited request by request, and a provider update can change it without anyone touching the application.",
            "Aegis splits the system into four layers. L1 takes the request. L2 plans, calls tools and drafts the answer, and is treated as untrusted. L4 holds the data and five read-only tools. L3 sits between them as a reference monitor: the request is screened on the way in, every tool call is authorised on the way down, and every drafted answer is screened on the way out. The orchestrator in L2 holds a reference to the mediator and imports nothing from L4, so there is no second route to the data.",
            "Each check is a small policy object in an ordered chain — Chain of Responsibility — and the first deny wins. The rule in that chain that matters most is what happens when a policy itself breaks:",
            {
              code: "} catch (err) {\n  v = {\n    allow: false,\n    stage: `${this.label}:${p.name}`,\n    reason: `fail-closed:${(err as Error).message}`,\n  };",
            },
            "A bug in enforcement becomes a refusal, never a pass. Every verdict, allow or deny, is published to an event bus, so the audit trail records what the system actually decided rather than what the model says it did.",
          ],
        },
        {
          heading: "An account number the model never sees",
          body: [
            "On DevPulse the rule was that the reporter comes from the verified token, never from the request body — the untrusted side doesn't get to name the identity. Aegis takes that one step further: the untrusted side never holds the identity at all.",
            "When a session opens, the mediator issues an opaque handle for the account, and the reasoning context is built with the handle instead of the ID. The real ID stays in a map inside L3, and only the mediator can resolve it:",
            {
              code: "resolve(handle: Handle): string {\n  const real = this.toReal.get(handle);\n  if (!real)\n    throw new Error(`handle vault: unresolvable handle ${String(handle)}`);\n  return real;\n}",
            },
            "A forged or stale handle throws instead of falling back to some default account. On the way out, a disclosure policy also refuses any answer containing a raw account ID, a card-like number or the handle itself — but that is the second check, not the main one. The point of the handle is that no filter is what stands between the model and the leak. There is nothing in its context to leak.",
          ],
        },
        {
          heading: "Closed by default",
          body: [
            "The model chooses which tool to call, so the tool name is untrusted input too. The capability broker allows only the names in the session's grant set; anything else — including a tool that exists in L4 but was never granted — is denied:",
            {
              code: 'if (this.granted.has(tool)) {\n  return { allow: true, stage: "broker", reason: `granted:${tool}` };\n}\nreturn { allow: false, stage: "broker", reason: `ungranted-capability:${tool}` };',
            },
            "That shape is what made our modifiability claim testable rather than asserted. Tools in L4 are Command objects behind one interface, so adding a sixth — a category breakdown — was one new file plus one line in the grant list, and one keyword route in L2 so the test backend could pick it. Before the grant the broker refuses it; after, its answers pass through the same, unmodified egress checks. Zero lines changed in the mediator, the policies, the broker or the vault.",
            "A security layer that has to be edited every time a feature lands will eventually be edited wrong. Keeping new features to data and leaf code is how you avoid that.",
          ],
        },
        {
          heading: "Every number has to come from a tool",
          body: [
            "In finance the expensive failure is a wrong number — a figure the model made up reads exactly like one it computed. So before an answer leaves, the grounding verifier pulls every number out of it and checks each against the numbers the tools actually returned in that turn:",
            {
              code: 'if (!allowed.some((a) => Math.abs(a - c) <= 0.01)) {\n  return deny("grounding", `ungrounded-number:${c}`);\n}',
            },
            "Numbers inside identifiers are stripped before the check, so an account ID can't slip through as a grounded figure; it falls to the disclosure policy instead. It's a narrow check — it proves a number came from a tool, not that the sentence around it uses that number correctly. But it turns \"the model shouldn't invent figures\" into something the code enforces.",
          ],
        },
        {
          heading: "Measuring the layer, not the model",
          body: [
            "Test a guard-railed assistant built on a real model and you can't tell whether a refusal came from your architecture or from the model's own training. So the default backend isn't a model. It's keyword-routed behind the same Adapter interface an API backend would use, and when it doesn't recognise a request it simply complies. It has no safety behaviour of its own.",
            "That leaves the mediation switch as the only variable. Over 21 labelled prompts — 15 policy-violating, 6 benign — mediation on blocked 15 of 15 and refused none of the benign ones; mediation off blocked none. The data is a seeded synthetic corpus of 1,830 transactions across 8 users, with one prompt-injection payload planted in a transaction description to exercise the indirect path.",
            "We were careful about what that does and doesn't show. The block patterns were written against those same 15 prompts, so 15/15 is an in-sample result: it shows the mechanism fires and that it lives in L3, not that it generalises to paraphrases. And 0/15 with mediation off isn't a discovered failure rate — we removed the only enforcement there was. The honest next step is a held-out paraphrase set; until then the pattern-based ingress checks are defence in depth, not a guarantee.",
          ],
        },
      ],
    },
  },

  {
    slug: "fixitnow",
    title: "FixItNow",
    subtitle: "Home-services marketplace",
    summary:
      "A marketplace connecting customers with technicians, and the project where I learned to distrust a cache.",
    year: "2026",
    stack: ["Next.js", "Express", "TypeScript", "Prisma", "PostgreSQL"],
    liveUrl: "https://assignment-5-alpha-brown.vercel.app",
    repoUrl: "https://github.com/abid-arham/FixItNow",
    extraLinks: [
      { label: "API code", href: "https://github.com/abid-arham/Assignment-4-1" },
    ],
    featured: false,
    cover: {
      src: "/work/fixitnow.webp",
      alt: "The FixItNow marketplace home page",
      width: 1440,
      height: 900,
    },
    highlights: [
      "Next.js frontend and an Express/Prisma/PostgreSQL API, deployed independently.",
      "Modelled technicians, categories, services, bookings, payments, and reviews.",
      "Idempotent find-or-create seed scripts, so re-running them never duplicates data.",
      "Fixed an auth middleware bug and a per-user response-caching bug.",
    ],
    caseStudy: {
      intro:
        "FixItNow connects customers with technicians: browse a category, book a service, pay, leave a review. The interesting part wasn't building it — it was two bugs that both looked like something else first.",
      sections: [
        {
          heading: "The caching bug",
          body: [
            "Responses on authenticated, per-user routes were being served from cache. Which means one signed-in user could be handed a response generated for a different signed-in user.",
            "It presented as a UI bug — the wrong data showing up on a page — and it would have been easy to 'fix' at the component level and move on. The actual problem was that a cache was treating per-user responses as if they were shared. Anything user-specific has to be excluded from a shared cache, or keyed by the user. There is no version of this that is only a display issue.",
          ],
        },
        {
          heading: "The auth middleware bug",
          body: [
            "The middleware was comparing on the whole user object where it should have been comparing on the id. Object comparison doesn't do what it reads like it does, so the check was passing or failing on identity rather than value.",
            "It's a small mistake with a large blast radius, and it is the reason I now treat anything in an authorization path as code that deserves a second read rather than a quick one.",
          ],
        },
        {
          heading: "The part that saved me time",
          body: [
            "Seed scripts are written find-or-create, so running them twice doesn't duplicate anything. Being able to re-seed freely without first tearing the database down made every subsequent debugging session faster.",
            "Frontend and backend deploy independently on Vercel. I also worked through a set of Next.js prerendering errors caused by Suspense boundary violations, which is its own lesson in what the App Router actually does at build time.",
          ],
        },
      ],
    },
  },

  {
    slug: "wanderlust",
    title: "Wanderlust",
    subtitle: "Travel listing app",
    summary:
      "An MVC travel listings app with authentication, reviews, image uploads, and geocoded maps.",
    year: "2026",
    stack: ["Node.js", "Express", "MongoDB", "EJS", "Passport"],
    liveUrl: "https://wanderlust-oa2t.onrender.com/listings",
    repoUrl: "https://github.com/abid-arham/Wanderlust",
    cover: {
      src: "/work/wanderlust.webp",
      alt: "The Wanderlust listings page",
      width: 1440,
      height: 900,
    },
    highlights: [
      "Passport authentication with owner-only edit and delete middleware.",
      "Cloudinary image uploads and Mapbox-geocoded location previews.",
      "Ratings and reviews on each listing.",
    ],
  },

  {
    slug: "nextcart",
    title: "NextCart",
    subtitle: "Multi-vendor e-commerce platform",
    summary:
      "A four-portal marketplace in core PHP and MySQL — customer, seller, delivery, and admin. I owned the admin portal.",
    year: "2025",
    stack: ["PHP", "MySQL"],
    repoUrl: "https://github.com/abid-arham/Project-NextCart",
    cover: {
      src: "/work/nextcart.webp",
      alt: "NextCart — four role-based portals",
      width: 1440,
      height: 900,
    },
    highlights: [
      "Four role-based portals over one MySQL schema.",
      "Built and owned the admin portal.",
      "Written in core PHP — no framework.",
    ],
  },
]

export const featuredProject = projects.find((p) => p.featured) ?? projects[0]
export const otherProjects = projects.filter((p) => p !== featuredProject)
export const caseStudies = projects.filter((p) => p.caseStudy)
