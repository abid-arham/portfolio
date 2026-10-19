import {
  type SimpleIcon,
  siCloudinary,
  siCplusplus,
  siDocker,
  siEjs,
  siExpress,
  siGit,
  siJavascript,
  siJsonwebtokens,
  siMongodb,
  siMongoose,
  siMysql,
  siNextdotjs,
  siNodedotjs,
  siOpenjdk,
  siPassport,
  siPhp,
  siPostgresql,
  siPostman,
  siPrisma,
  siReact,
  siRedux,
  siRender,
  siStripe,
  siTailwindcss,
  siTanstack,
  siTypescript,
  siVercel,
  siZod,
} from "simple-icons"

/**
 * Tech label → brand mark, shared by the project stack chips and the skills
 * list. Named imports keep the bundle to these paths rather than all of
 * simple-icons, and the SVG renders inline, so the zero-third-party-requests
 * rule holds. A label with no entry renders as plain text, so a new tech never
 * breaks a card.
 */
const ICONS: Record<string, SimpleIcon> = {
  "C++": siCplusplus,
  Cloudinary: siCloudinary,
  Docker: siDocker,
  EJS: siEjs,
  Express: siExpress,
  Git: siGit,
  // simple-icons dropped the Java mark at Oracle's request; OpenJDK's is the stand-in.
  Java: siOpenjdk,
  JavaScript: siJavascript,
  JWT: siJsonwebtokens,
  MongoDB: siMongodb,
  Mongoose: siMongoose,
  MySQL: siMysql,
  "Next.js": siNextdotjs,
  "Node.js": siNodedotjs,
  Passport: siPassport,
  PHP: siPhp,
  PostgreSQL: siPostgresql,
  Postman: siPostman,
  Prisma: siPrisma,
  React: siReact,
  "Redux Toolkit": siRedux,
  Render: siRender,
  "RTK Query": siRedux,
  Stripe: siStripe,
  "Tailwind CSS": siTailwindcss,
  "TanStack Query": siTanstack,
  TypeScript: siTypescript,
  Vercel: siVercel,
  Zod: siZod,
}

/** Version suffixes ("Next.js 16", "React 19") share the unversioned mark. */
export function getTechIcon(label: string): SimpleIcon | undefined {
  return ICONS[label.replace(/\s+\d+(\.\d+)*$/, "")]
}
