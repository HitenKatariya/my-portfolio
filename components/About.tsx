"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { Github, Instagram, Linkedin, MapPin, Phone, Sparkles } from "lucide-react"
import { profile } from "@/lib/constants/profile"

const iconMap = {
  linkedin: Linkedin,
  github: Github,
  instagram: Instagram,
} as const

const About = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="about" className="relative overflow-hidden bg-gradient-to-b from-[#030712] via-[#050816] to-[#020617] py-24 px-4">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />
      <div className="mx-auto max-w-6xl">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.75 }}
          className="mb-16 text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-cyan-200/90">
            <Sparkles className="h-3.5 w-3.5" />
            Developer profile
          </div>
          <h2 className="mb-4 text-4xl font-bold text-white md:text-5xl">
            <span className="bg-gradient-to-r from-cyan-300 to-violet-300 bg-clip-text text-transparent">About</span>{" "}
            <span className="text-white">{profile.name}</span>
          </h2>
          <p className="mx-auto max-w-2xl text-slate-400">{profile.role}</p>
        </motion.div>

        <div className="grid items-start gap-12 lg:grid-cols-[1.05fr_1.2fr]">
          <motion.div
            initial={{ opacity: 0, x: -36 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -36 }}
            transition={{ duration: 0.75, delay: 0.1 }}
            className="relative mx-auto w-full max-w-md"
          >
            <div className="absolute inset-0 rounded-[32px] bg-gradient-to-br from-cyan-500/30 via-transparent to-violet-500/30 blur-2xl" />
            <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04] p-8 shadow-2xl shadow-cyan-500/10 backdrop-blur-xl">
              <div className="mb-6 flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-violet-600 text-2xl font-bold text-white">
                  {profile.initials}
                </div>
                <div>
                  <p className="text-lg font-semibold text-white">{profile.name}</p>
                  <p className="text-sm text-cyan-200/90">{profile.role}</p>
                </div>
              </div>
              <div className="space-y-3 text-sm text-slate-300">
                <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-black/30 px-3 py-2">
                  <MapPin className="h-4 w-4 text-cyan-300" />
                  <span>{profile.location}</span>
                </div>
                <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-black/30 px-3 py-2">
                  <Phone className="h-4 w-4 text-cyan-300" />
                  <a className="hover:text-white" href={`tel:${profile.phone.replace(/\s/g, "")}`}>
                    {profile.phone}
                  </a>
                </div>
              </div>
              <div className="mt-6 border-t border-white/10 pt-6">
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-500">Connect</p>
                <div className="flex flex-wrap gap-3">
                  {profile.social.map((item) => {
                    const Icon = iconMap[item.icon]
                    return (
                      <motion.a
                        key={item.label}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={item.label}
                        className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-200 transition hover:border-cyan-400/60 hover:text-white"
                        whileHover={{ y: -2, scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <Icon className="h-5 w-5" />
                      </motion.a>
                    )
                  })}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 36 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 36 }}
            transition={{ duration: 0.75, delay: 0.15 }}
            className="space-y-6"
          >
            {profile.summary.map((paragraph, idx) => (
              <p key={idx} className="text-lg leading-relaxed text-slate-300">
                {paragraph}
              </p>
            ))}
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { title: "Stack", body: "MERN · FastAPI · AWS" },
                { title: "Focus", body: "AI systems · Cloud" },
                { title: "Mindset", body: "Security · Scale" },
              ].map((card) => (
                <div
                  key={card.title}
                  className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-transparent p-4 backdrop-blur"
                >
                  <p className="text-xs font-semibold uppercase tracking-widest text-cyan-200/80">{card.title}</p>
                  <p className="mt-2 text-sm text-slate-200">{card.body}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default About
