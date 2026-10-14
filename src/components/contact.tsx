"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Mail, MapPin, Phone, Send } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { Section } from "@/components/layout/section"
import { Button } from "@/components/ui/button"
import { profile } from "@/data/profile"
import { contactSchema, type ContactInput } from "@/lib/contact-schema"
import { cn } from "@/lib/utils"

const field =
  "w-full rounded-lg border border-rule bg-paper-raised px-4 py-3 text-[0.9375rem] text-ink placeholder:text-ink-faint transition-colors focus:border-accent focus:outline-none"

export function Contact() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", message: "", company: "" },
  })

  async function onSubmit(values: ContactInput) {
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })
      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        toast.error(data.error ?? "Something went wrong. Please try again.")
        return
      }

      toast.success("Message sent — I'll get back to you.")
      reset()
    } catch {
      toast.error("Network error. Please check your connection and try again.")
    }
  }

  return (
    <Section
      id="contact"
      label="Contact"
      title="Get in touch."
      intro="If you're hiring for an internship or a junior engineering role, or you have a problem you want a second pair of eyes on, I'd like to hear about it."
      bleed
    >
      <div className="grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:gap-16">
        <ul className="space-y-4 text-[0.9375rem]">
          <li>
            <a
              href={`mailto:${profile.email}`}
              className="inline-flex items-center gap-3 text-ink-muted transition-colors hover:text-accent-strong"
            >
              <Mail className="size-4 shrink-0 text-accent" />
              {profile.email}
            </a>
          </li>
          <li>
            <a
              href={`tel:${profile.phone}`}
              className="inline-flex items-center gap-3 text-ink-muted transition-colors hover:text-accent-strong"
            >
              <Phone className="size-4 shrink-0 text-accent" />
              {profile.phone}
            </a>
          </li>
          <li className="inline-flex items-center gap-3 text-ink-muted">
            <MapPin className="size-4 shrink-0 text-accent" />
            {profile.location}
          </li>
        </ul>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
          {/* Honeypot — hidden from people, visible to bots. */}
          <div aria-hidden className="absolute left-[-9999px]">
            <label htmlFor="company">Company</label>
            <input id="company" tabIndex={-1} autoComplete="off" {...register("company")} />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="label mb-2 block">
                Name
              </label>
              <input
                id="name"
                autoComplete="name"
                placeholder="Your name"
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "name-error" : undefined}
                className={cn(field, errors.name && "border-accent")}
                {...register("name")}
              />
              {errors.name && (
                <p id="name-error" role="alert" className="mt-2 text-xs text-accent-strong">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="label mb-2 block">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@company.com"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
                className={cn(field, errors.email && "border-accent")}
                {...register("email")}
              />
              {errors.email && (
                <p id="email-error" role="alert" className="mt-2 text-xs text-accent-strong">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="message" className="label mb-2 block">
              Message
            </label>
            <textarea
              id="message"
              rows={6}
              placeholder="What are you working on?"
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? "message-error" : undefined}
              className={cn(field, "resize-y", errors.message && "border-accent")}
              {...register("message")}
            />
            {errors.message && (
              <p id="message-error" role="alert" className="mt-2 text-xs text-accent-strong">
                {errors.message.message}
              </p>
            )}
          </div>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Sending…" : "Send message"}
            <Send className="size-4" />
          </Button>
        </form>
      </div>
    </Section>
  )
}
