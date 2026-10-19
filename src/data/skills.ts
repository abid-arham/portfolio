export interface SkillGroup {
  category: string
  items: string[]
}

export const skills: SkillGroup[] = [
  {
    category: "Languages",
    items: ["TypeScript", "JavaScript", "PHP", "SQL", "C++", "Java"],
  },
  {
    category: "Backend",
    items: [
      "Node.js",
      "Express",
      "REST API design",
      "JWT",
      "Passport",
      "RBAC",
      "Prisma",
      "Mongoose",
      "Zod",
    ],
  },
  {
    category: "Frontend",
    items: ["React", "Next.js", "Redux Toolkit", "RTK Query", "Tailwind CSS", "EJS"],
  },
  {
    category: "Databases",
    items: ["PostgreSQL", "MongoDB", "MySQL"],
  },
  {
    category: "Tools & platforms",
    items: ["Git", "Docker", "Postman", "Vercel", "Render", "Cloudinary"],
  },
  {
    category: "Fundamentals",
    items: ["Data structures & algorithms", "OOP", "Design patterns"],
  },
]
