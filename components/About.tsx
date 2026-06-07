"use client"

import { motion, useInView } from "framer-motion"
import Image from "next/image"
import { useRef } from "react"
import { Briefcase, ExternalLink, Github, GraduationCap, Instagram, Linkedin, MapPin, Phone } from "lucide-react"
import { profile } from "@/lib/constants/profile"
import PageContainer from "@/components/PageContainer"
import SectionLabel from "@/components/SectionLabel"

const iconMap = {
  linkedin: Linkedin,
  github: Github,
  instagram: Instagram,
} as const

const About = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="about" className="relative overflow-hidden py-24">
      <PageContainer>
        <SectionLabel label="about" />

        <div ref={ref} className="grid items-start gap-10 lg:grid-cols-[0.95fr_1.25fr] lg:gap-14">
          <motion.div
            initial={{ opacity: 0, x: -28 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -28 }}
            transition={{ duration: 0.75 }}
            className="relative mx-auto w-full max-w-sm lg:mx-0"
          >
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#101318]/90">
              <div className="border-b border-white/10 px-6 py-5">
                <p className="text-lg font-semibold text-[#26d868]">{profile.name}</p>
                <p className="font-mono text-sm text-[#27cbcb]">{profile.role}</p>
              </div>

              <div className="relative aspect-[4/5] w-full overflow-hidden bg-gradient-to-b from-[#0f141c] to-[#101318]">
                <Image
                  src={profile.photoUrl}
                  alt={profile.name}
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 1024px) 90vw, 380px"
                  priority
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#101318]/80 via-transparent to-[#27cbcb]/10" />
              </div>

              <div className="border-t border-white/10 p-4">
                <div className="-mt-10 mx-4 rounded-xl border border-white/10 bg-[#0d1016]/95 p-4 backdrop-blur">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="relative h-10 w-10 overflow-hidden rounded-full border border-white/10">
                      <Image
                        src={profile.photoUrl}
                        alt={profile.name}
                        fill
                        className="object-cover object-top"
                        sizes="40px"
                      />
                    </div>
                    <div>
                      <p className="font-mono text-sm text-[#27cbcb]">{profile.handle}</p>
                      <p className="text-xs text-slate-500">{profile.location}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                    className="w-full rounded-lg border border-[#26d868]/40 py-2.5 text-sm font-semibold text-[#26d868] transition hover:bg-[#26d868]/10"
                  >
                    Let&apos;s Connect
                  </button>
                </div>

                <div className="mt-8 flex justify-center gap-3">
                  {profile.social.map((item) => {
                    const Icon = iconMap[item.icon]
                    return (
                      <a
                        key={item.label}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={item.label}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition hover:border-[#27cbcb]/40 hover:text-[#27cbcb]"
                      >
                        <Icon className="h-4 w-4" />
                      </a>
                    )
                  })}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 28 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 28 }}
            transition={{ duration: 0.75, delay: 0.1 }}
            className="space-y-8"
          >
            <h2 className="max-w-2xl text-3xl font-bold leading-tight text-white md:text-4xl lg:text-5xl">
              A developer who{" "}
              <span className="text-[#27cbcb]">cares</span>{" "}
              <span className="text-[#26d868]">about the details</span>
            </h2>

            <div className="max-w-2xl border-l-2 border-[#27cbcb]/60 pl-5">
              <p className="text-lg leading-relaxed text-slate-300">
                Cloud-focused Full Stack Developer skilled in MERN, AWS, and scalable system design. Experienced in
                building AI-powered and production-ready applications with strong focus on{" "}
                <span className="text-[#27cbcb]">performance, security, and clean architecture</span>.
              </p>
            </div>

            <div className="max-w-2xl rounded-xl border border-white/10 bg-[#101318]/60 p-5">
              <p className="text-base italic leading-relaxed text-slate-400">
                &ldquo;{profile.summary[1]}&rdquo;
              </p>
            </div>

            <div className="grid max-w-2xl gap-3 sm:grid-cols-3">
              {[
                { title: "Stack", body: "MERN · FastAPI · AWS" },
                { title: "Focus", body: "AI systems · Cloud" },
                { title: "Mindset", body: "Security · Scale" },
              ].map((card) => (
                <div
                  key={card.title}
                  className="rounded-xl border border-white/10 bg-[#101318]/50 p-4 transition hover:border-[#27cbcb]/30"
                >
                  <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-[#27cbcb]">
                    {card.title}
                  </p>
                  <p className="mt-2 text-sm text-slate-300">{card.body}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-slate-400">
              <span className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2">
                <MapPin className="h-4 w-4 text-[#27cbcb]" />
                {profile.location}
              </span>
              <a
                href={`tel:${profile.phone.replace(/\s/g, "")}`}
                className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 transition hover:text-white"
              >
                <Phone className="h-4 w-4 text-[#27cbcb]" />
                {profile.phone}
              </a>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.75, delay: 0.2 }}
          className="mt-14 grid items-start gap-6 lg:grid-cols-2"
        >
          <div className="h-fit space-y-4 rounded-2xl border border-white/10 bg-[#101318]/70 p-6">
            <div className="flex items-center gap-2 font-mono text-sm font-semibold uppercase tracking-[0.18em] text-[#27cbcb]">
              <GraduationCap className="h-4 w-4" />
              Education
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-base font-semibold text-white">{profile.education.degree}</p>
              <p className="mt-1 text-sm text-slate-400">{profile.education.institution}</p>
              <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-slate-400">
                <p>
                  Current GPA: <span className="font-semibold text-white">{profile.education.currentGpa}</span>
                </p>
                <p>
                  Expected Graduation: <span className="font-semibold text-white">{profile.education.expectedGraduation}</span>
                </p>
              </div>
            </div>
          </div>

          <div className="h-fit space-y-4 rounded-2xl border border-white/10 bg-[#101318]/70 p-6">
            <div className="flex items-center gap-2 font-mono text-sm font-semibold uppercase tracking-[0.18em] text-[#27cbcb]">
              <Briefcase className="h-4 w-4" />
              Experience
            </div>
            <div className="space-y-4">
              {profile.experience.map((item) => (
                <div key={item.company} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="text-base font-semibold text-white">{item.company}</p>
                      <p className="text-sm italic text-slate-400">{item.role}</p>
                    </div>
                    <span className="rounded-full border border-[#27cbcb]/20 bg-[#27cbcb]/10 px-2.5 py-1 font-mono text-[11px] text-[#27cbcb]">
                      {item.period}
                    </span>
                  </div>

                  <ul className="mt-3 space-y-1.5 text-sm leading-relaxed text-slate-300">
                    {item.points.map((point) => (
                      <li key={point} className="flex gap-2">
                        <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#27cbcb]" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>

                  {item.link && (
                    <a
                      href={item.link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-[#27cbcb] transition hover:text-[#26d868]"
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
      </PageContainer>
    </section>
  )
}

export default About
