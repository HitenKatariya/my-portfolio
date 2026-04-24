"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { Briefcase, ExternalLink, Github, GraduationCap, Instagram, Linkedin, MapPin, Phone, Sparkles } from "lucide-react"
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
    <section
      id="about"
      className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-100 py-24 px-4 transition-colors duration-300 dark:from-[#030712] dark:via-[#050816] dark:to-[#020617]"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/40 to-transparent dark:via-cyan-400/40" />
      <div className="mx-auto max-w-6xl">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.75 }}
          className="mb-16 text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-1 text-xs font-semibold uppercase tracking-widest text-blue-700 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-cyan-200/90">
            <Sparkles className="h-3.5 w-3.5" />
            Developer profile
          </div>
          <h2 className="mb-4 text-4xl font-bold text-slate-900 dark:text-white md:text-5xl">
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-cyan-300 dark:to-violet-300">About</span>{" "}
            <span className="text-slate-900 dark:text-white">{profile.name}</span>
          </h2>
          <p className="mx-auto max-w-2xl text-slate-600 dark:text-slate-400">{profile.role}</p>
        </motion.div>

        <div className="grid items-start gap-12 lg:grid-cols-[1.05fr_1.2fr]">
          <motion.div
            initial={{ opacity: 0, x: -36 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -36 }}
            transition={{ duration: 0.75, delay: 0.1 }}
            className="relative mx-auto w-full max-w-md"
          >
            <div className="absolute inset-0 rounded-[32px] bg-gradient-to-br from-blue-400/25 via-transparent to-indigo-400/25 blur-2xl dark:from-cyan-500/30 dark:to-violet-500/30" />
            <div className="relative overflow-hidden rounded-[32px] border border-slate-200 bg-white p-8 shadow-lg shadow-slate-300/60 backdrop-blur-xl transition duration-300 hover:shadow-xl dark:border-white/10 dark:bg-white/[0.04] dark:shadow-2xl dark:shadow-cyan-500/10">
              <div className="mb-6 flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-violet-600 text-2xl font-bold text-white">
                  {profile.initials}
                </div>
                <div>
                  <p className="text-lg font-semibold text-slate-900 dark:text-white">{profile.name}</p>
                  <p className="text-sm text-slate-600 dark:text-cyan-200/90">{profile.role}</p>
                </div>
              </div>
              <div className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
                <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 dark:border-white/5 dark:bg-black/30">
                  <MapPin className="h-4 w-4 text-blue-500 dark:text-cyan-300" />
                  <span>{profile.location}</span>
                </div>
                <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 dark:border-white/5 dark:bg-black/30">
                  <Phone className="h-4 w-4 text-blue-500 dark:text-cyan-300" />
                  <a className="hover:text-slate-900 dark:hover:text-white" href={`tel:${profile.phone.replace(/\s/g, "")}`}>
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
                        className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:scale-[1.03] hover:border-blue-400/60 hover:text-blue-700 hover:shadow-md dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:border-cyan-400/60 dark:hover:text-white"
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
              <p key={idx} className="text-lg leading-relaxed text-slate-700 dark:text-slate-300">
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
                  className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-4 backdrop-blur dark:border-white/10 dark:from-white/[0.06] dark:to-transparent"
                >
                  <p className="text-xs font-semibold uppercase tracking-widest text-blue-700/90 dark:text-cyan-200/80">{card.title}</p>
                  <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">{card.body}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
          transition={{ duration: 0.75, delay: 0.2 }}
          className="mt-10 space-y-6"
        >
          <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.03] dark:shadow-none">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-blue-700 dark:text-cyan-200/90">
              <GraduationCap className="h-4 w-4" />
              Education
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-black/20">
              <p className="text-base font-semibold text-slate-900 dark:text-white">{profile.education.degree}</p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{profile.education.institution}</p>
              <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-slate-600 dark:text-slate-300">
                <p>
                  Current GPA: <span className="font-semibold text-slate-900 dark:text-white">{profile.education.currentGpa}</span>
                </p>
                <p>
                  Expected Graduation: <span className="font-semibold text-slate-900 dark:text-white">{profile.education.expectedGraduation}</span>
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.03] dark:shadow-none">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-blue-700 dark:text-cyan-200/90">
              <Briefcase className="h-4 w-4" />
              Experience
            </div>
            <div className="space-y-4">
              {profile.experience.map((item) => (
                <div key={item.company} className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-black/20">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="text-base font-semibold text-slate-900 dark:text-white">{item.company}</p>
                      <p className="text-sm italic text-slate-600 dark:text-slate-300">{item.role}</p>
                    </div>
                    <span className="text-sm text-slate-500 dark:text-slate-400">{item.period}</span>
                  </div>

                  <ul className="mt-3 space-y-1 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                    {item.points.map((point) => (
                      <li key={point}>- {point}</li>
                    ))}
                  </ul>

                  {item.link && (
                    <a
                      href={item.link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-blue-700 transition hover:text-blue-800 dark:text-cyan-200 dark:hover:text-cyan-100"
                    >
                      {item.link.label}
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default About
