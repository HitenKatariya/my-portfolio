"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { Mail, MapPin, Phone, Send } from "lucide-react"
import { profile } from "@/lib/constants/profile"

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMessage(null)

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string }

      if (!res.ok || !data.ok) {
        setSubmitStatus("error")
        setErrorMessage(data.error ?? "Something went wrong.")
        return
      }

      setSubmitStatus("success")
      setFormData({ name: "", email: "", message: "" })
    } catch {
      setSubmitStatus("error")
      setErrorMessage("Network error. Please try again.")
    } finally {
      setIsSubmitting(false)
      setTimeout(() => {
        setSubmitStatus("idle")
        setErrorMessage(null)
      }, 4000)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <section id="contact" className="relative overflow-hidden bg-[#030712] py-24 px-4">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />
      <div className="relative mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75 }}
          viewport={{ once: true }}
          className="mb-14 text-center"
        >
          <h2 className="mb-4 text-4xl font-bold text-white md:text-5xl">
            Let&apos;s <span className="bg-gradient-to-r from-cyan-300 to-violet-300 bg-clip-text text-transparent">connect</span>
          </h2>
          <div className="mx-auto mb-6 h-1 w-24 rounded-full bg-gradient-to-r from-cyan-400 to-violet-500" />
          <p className="mx-auto max-w-2xl text-lg text-slate-400">
            Have a project, internship, or collaboration in mind? Send a message and I will get back to you as soon as possible.
          </p>
        </motion.div>

        <div className="grid gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.75 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <h3 className="mb-3 text-2xl font-semibold text-white">Availability</h3>
              <p className="leading-relaxed text-slate-400">
                Open to cloud + full-stack collaborations, internships, and product teams that care about craft. Prefer async-first communication with crisp
                context.
              </p>
            </div>

            <div className="space-y-5">
              <motion.div className="flex items-center gap-4" whileHover={{ x: 6 }} transition={{ duration: 0.2 }}>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/15 text-cyan-200">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Email</p>
                  <a className="text-sm text-slate-400 transition hover:text-cyan-200" href={`mailto:${profile.email}`}>
                    {profile.email}
                  </a>
                </div>
              </motion.div>

              <motion.div className="flex items-center gap-4" whileHover={{ x: 6 }} transition={{ duration: 0.2 }}>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/15 text-cyan-200">
                  <Phone size={20} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Phone</p>
                  <a className="text-sm text-slate-400 transition hover:text-cyan-200" href={`tel:${profile.phone.replace(/\s/g, "")}`}>
                    {profile.phone}
                  </a>
                </div>
              </motion.div>

              <motion.div className="flex items-center gap-4" whileHover={{ x: 6 }} transition={{ duration: 0.2 }}>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/15 text-cyan-200">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Location</p>
                  <p className="text-sm text-slate-400">{profile.location}</p>
                </div>
              </motion.div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-cyan-500/10 via-transparent to-violet-500/10 p-6 backdrop-blur">
              <p className="text-sm font-semibold text-white">{profile.name}</p>
              <p className="text-xs text-cyan-200/90">{profile.role}</p>
              <p className="mt-3 text-xs leading-relaxed text-slate-400">
                I build cloud-ready, full-stack products with a focus on reliability, performance, and thoughtful user experience.
              </p>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 32 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.75 }} viewport={{ once: true }}>
            <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-white/10 bg-white/[0.02] p-6 shadow-xl shadow-black/30 backdrop-blur">
              <div>
                <label htmlFor="name" className="mb-2 block text-sm font-semibold text-slate-200">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400/60 focus:outline-none"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-semibold text-slate-200">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400/60 focus:outline-none"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label htmlFor="message" className="mb-2 block text-sm font-semibold text-slate-200">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full resize-none rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400/60 focus:outline-none"
                  placeholder="What are you building?"
                />
              </div>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
                whileHover={{ scale: isSubmitting ? 1 : 1.01 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.99 }}
              >
                {isSubmitting ? <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : <Send size={18} />}
                <span>{isSubmitting ? "Sending…" : "Send message"}</span>
              </motion.button>

              {submitStatus === "success" && (
                <motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="text-center text-sm font-medium text-emerald-400">
                  Received — I&apos;ll get back to you soon.
                </motion.p>
              )}

              {submitStatus === "error" && errorMessage && (
                <motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="text-center text-sm font-medium text-red-400">
                  {errorMessage}
                </motion.p>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Contact
