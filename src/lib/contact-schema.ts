import { z } from "zod"

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(100),
  email: z.email("Please enter a valid email address.").max(200),
  message: z
    .string()
    .trim()
    .min(10, "A little more detail would help.")
    .max(4000, "That's longer than the form accepts — email me directly."),
  /** Honeypot. Real people leave it empty; bots fill every field they find. */
  company: z.string().max(0).optional().or(z.literal("")),
})

export type ContactInput = z.infer<typeof contactSchema>
