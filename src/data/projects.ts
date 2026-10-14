export interface CaseStudySection {
  heading: string
  body: string[]
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
  /** Client work with a private repo — say so rather than leaving a dead link. */
  privateRepo?: boolean
  featured?: boolean
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
    slug: "white-h",
    title: "White.H",
    subtitle: "Clothing and beauty e-commerce store",
    summary:
      "A production store for a Bangladeshi clothing and beauty brand, built around manual bKash and Nagad payments because card rails weren't an option.",
    year: "2026",
    stack: ["React", "Redux Toolkit", "TypeScript", "Express", "MongoDB", "Docker"],
    liveUrl: "https://client-orcin-alpha-86.vercel.app",
    privateRepo: true,
    featured: true,
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
    slug: "fixitnow",
    title: "FixItNow",
    subtitle: "Home-services marketplace",
    summary:
      "A marketplace connecting customers with technicians, and the project where I learned to distrust a cache.",
    year: "2026",
    stack: ["Next.js", "Express", "TypeScript", "Prisma", "PostgreSQL"],
    liveUrl: "https://assignment-5-alpha-brown.vercel.app",
    repoUrl: "https://github.com/abid-arham/FixItNow",
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
