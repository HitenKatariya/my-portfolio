import { appendFile, mkdir } from "node:fs/promises"
import { join } from "node:path"
import { NextResponse } from "next/server"
import { Resend } from "resend"

type ContactPayload = {
  name?: string
  email?: string
  message?: string
}

const defaultFrom = "Portfolio <onboarding@resend.dev>"

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as ContactPayload
  const name = body.name?.trim()
  const email = body.email?.trim()
  const message = body.message?.trim()

  if (!name || !email || !message) {
    return NextResponse.json({ ok: false, error: "Missing required fields." }, { status: 400 })
  }

  const entry = {
    at: new Date().toISOString(),
    name,
    email,
    message,
  }

  const apiKey = process.env.RESEND_API_KEY?.trim()
  const to = process.env.CONTACT_TO_EMAIL?.trim()

  if (apiKey && to) {
    try {
      const resend = new Resend(apiKey)
      const from = process.env.RESEND_FROM_EMAIL?.trim() || defaultFrom

      const { error } = await resend.emails.send({
        from,
        to: [to],
        replyTo: email,
        subject: `Portfolio contact from ${name}`,
        text: `From: ${name} <${email}>\n\n${message}`,
      })

      if (error) {
        console.error("[contact] Resend error:", error)
        return NextResponse.json({ ok: false, error: "Could not send email. Try again later." }, { status: 502 })
      }

      return NextResponse.json({ ok: true })
    } catch (e) {
      console.error("[contact] Resend exception:", e)
      return NextResponse.json({ ok: false, error: "Could not send email. Try again later." }, { status: 502 })
    }
  }

  try {
    const dir = join(process.cwd(), "data")
    await mkdir(dir, { recursive: true })
    const filePath = join(dir, "inquiries.jsonl")
    await appendFile(filePath, `${JSON.stringify(entry)}\n`, "utf8")
  } catch {
    return NextResponse.json({ ok: false, error: "Could not persist message. Try again later." }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
