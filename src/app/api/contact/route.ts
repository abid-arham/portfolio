import { contactSchema } from "@/lib/contact-schema"

/**
 * Best-effort in-memory rate limit. On serverless this resets per instance, so
 * it blunts casual abuse rather than guaranteeing a cap. Enough to stop a
 * public, unauthenticated form being trivially used as a spam relay.
 */
const WINDOW_MS = 10 * 60 * 1000
const MAX_PER_WINDOW = 5
const hits = new Map<string, number[]>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS)
  recent.push(now)
  hits.set(ip, recent)
  return recent.length > MAX_PER_WINDOW
}

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 })
  }

  // Honeypot: a filled "company" field means a bot. Report success so it
  // doesn't retry, but send nothing.
  const honeypot = (body as Record<string, unknown> | null)?.company
  if (typeof honeypot === "string" && honeypot.trim() !== "") {
    return Response.json({ ok: true })
  }

  // Server-side validation is the real boundary; the client schema is only UX.
  const parsed = contactSchema.safeParse(body)
  if (!parsed.success) {
    return Response.json(
      { error: "Please check the form and try again." },
      { status: 400 }
    )
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  if (isRateLimited(ip)) {
    return Response.json(
      { error: "Too many messages. Please try again in a little while." },
      { status: 429 }
    )
  }

  const apiKey = process.env.RESEND_API_KEY
  const to = process.env.CONTACT_TO_EMAIL
  if (!apiKey || !to) {
    // Fail loudly rather than pretending the message was sent. A contact form
    // that silently swallows messages is worse than no contact form.
    console.error("Contact form not configured: set RESEND_API_KEY and CONTACT_TO_EMAIL.")
    return Response.json(
      { error: "The form isn't configured yet — please email me directly." },
      { status: 503 }
    )
  }

  const { name, email, message } = parsed.data

  // Resend's REST API directly — no SDK dependency, and the key stays server-side.
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM_EMAIL || "Portfolio <onboarding@resend.dev>",
      to: [to],
      reply_to: email,
      subject: `Portfolio message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
    }),
  })

  if (!res.ok) {
    console.error("Resend send failed:", res.status, await res.text().catch(() => ""))
    return Response.json(
      { error: "Couldn't send that right now. Please try again later." },
      { status: 502 }
    )
  }

  return Response.json({ ok: true })
}
