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
    <section id="contact" className="relative overflow-hidden bg-white py-24 px-4 transition-colors duration-300 dark:bg-[#030712]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/40 to-transparent dark:via-cyan-400/40" />
      <div className="relative mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75 }}
          viewport={{ once: true }}
          className="mb-14 text-center"
        >
          <h2 className="mb-4 text-4xl font-bold text-slate-900 dark:text-white md:text-5xl">
            Let&apos;s <span className="bg-gradient-to-r from-cyan-300 to-violet-300 bg-clip-text text-transparent">connect</span>
          </h2>
          <div className="mx-auto mb-6 h-1 w-24 rounded-full bg-gradient-to-r from-cyan-400 to-violet-500" />
          <p className="mx-auto max-w-2xl text-lg text-slate-600 dark:text-slate-400">
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
              <h3 className="mb-3 text-2xl font-semibold text-slate-900 dark:text-white">Availability</h3>
              <p className="leading-relaxed text-slate-600 dark:text-slate-400">
                Open to cloud + full-stack collaborations, internships, and product teams that care about craft. Prefer async-first communication with crisp
                context.
              </p>
            </div>

            <div className="space-y-5">
              <motion.div className="flex items-center gap-4" whileHover={{ x: 6 }} transition={{ duration: 0.2 }}>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-700 dark:bg-cyan-500/15 dark:text-cyan-200">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">Email</p>
                  <a className="text-sm text-slate-600 transition hover:text-blue-700 dark:text-slate-400 dark:hover:text-cyan-200" href={`mailto:${profile.email}`}>
                    {profile.email}
                  </a>
                </div>
              </motion.div>

              <motion.div className="flex items-center gap-4" whileHover={{ x: 6 }} transition={{ duration: 0.2 }}>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-700 dark:bg-cyan-500/15 dark:text-cyan-200">
                  <Phone size={20} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">Phone</p>
                  <a className="text-sm text-slate-600 transition hover:text-blue-700 dark:text-slate-400 dark:hover:text-cyan-200" href={`tel:${profile.phone.replace(/\s/g, "")}`}>
                    {profile.phone}
                  </a>
                </div>
              </motion.div>

              <motion.div className="flex items-center gap-4" whileHover={{ x: 6 }} transition={{ duration: 0.2 }}>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-700 dark:bg-cyan-500/15 dark:text-cyan-200">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">Location</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{profile.location}</p>
                </div>
              </motion.div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-blue-50/80 via-transparent to-indigo-50/80 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:from-cyan-500/10 dark:to-violet-500/10 dark:shadow-none">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">{profile.name}</p>
              <p className="text-xs text-blue-700 dark:text-cyan-200/90">{profile.role}</p>
              <p className="mt-3 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                I build cloud-ready, full-stack products with a focus on reliability, performance, and thoughtful user experience.
              </p>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 32 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.75 }} viewport={{ once: true }}>
            <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/70 backdrop-blur dark:border-white/10 dark:bg-white/[0.02] dark:shadow-xl dark:shadow-black/30">
              <div>
                <label htmlFor="name" className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-500 focus:border-blue-400/60 focus:outline-none dark:border-white/10 dark:bg-black/40 dark:text-white dark:focus:border-cyan-400/60"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-500 focus:border-blue-400/60 focus:outline-none dark:border-white/10 dark:bg-black/40 dark:text-white dark:focus:border-cyan-400/60"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label htmlFor="message" className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-500 focus:border-blue-400/60 focus:outline-none dark:border-white/10 dark:bg-black/40 dark:text-white dark:focus:border-cyan-400/60"
                  placeholder="What are you building?"
                />
              </div>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition duration-300 hover:scale-[1.01] hover:shadow-xl hover:shadow-blue-500/30 dark:from-cyan-500 dark:to-violet-600 dark:shadow-cyan-500/20 dark:hover:shadow-cyan-500/30 disabled:cursor-not-allowed disabled:opacity-50"
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
