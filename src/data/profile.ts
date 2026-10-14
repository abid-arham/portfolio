export interface SocialLink {
  label: string
  href: string
}

export const profile = {
  name: "Abid Arham",
  role: "Full-Stack Developer",
  /** The one line that has to earn the next ten seconds of attention. */
  positioning:
    "I build web applications end to end — REST APIs, auth, data models, and the interface on top of them.",
  location: "Dhaka, Bangladesh",
  email: "mix.arham@gmail.com",
  phone: "+8801751921343",
  resumeUrl: "/resume.pdf",

  /**
   * Set to null to drop the portrait entirely — the hero reflows to a single
   * column and stays complete. Never point this at a placeholder.
   */
  portraitUrl: "/portrait.jpg" as string | null,
  portraitAlt: "Abid Arham",

  /**
   * LeetCode is currently at 10 solved. The card is deliberately a single
   * flag so it can be turned off in one edit if it ever reads as thin.
   */
  showLeetCodeStats: true,

  socials: [
    { label: "GitHub", href: "https://github.com/abid-arham" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/abid-arham-111457245/" },
    { label: "LeetCode", href: "https://leetcode.com/u/abidarham/" },
  ] satisfies SocialLink[],

  about: [
    "I'm a final-year Computer Science and Engineering student at AIUB in Dhaka, graduating in April 2027. Most of what I know came from building things that had to actually work for someone other than me.",
    "The work I care about sits below the interface: modelling data properly, designing REST APIs that are predictable, getting authentication and authorization right, and making sure the failure cases are handled rather than hoped away. I've shipped a store that takes real money from real customers, which is a good teacher for that last part.",
    "Day to day that means TypeScript, Node and Express, Next.js and React, on PostgreSQL or MongoDB. I'm comfortable owning a feature from the schema to the deployed UI.",
  ],
} as const
