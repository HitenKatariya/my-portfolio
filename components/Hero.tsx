"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { ArrowDown, ArrowRight } from "lucide-react"
import { profile } from "@/lib/constants/profile"
import PageContainer from "@/components/PageContainer"

const typingLines = [
  "Building scalable digital products.",
  "Connecting frontends with cloud systems.",
  "Shipping production-ready applications.",
]

const Hero = () => {
  const [lineIndex, setLineIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const current = typingLines[lineIndex]
    const delay = deleting ? 28 : 52

    const timer = window.setTimeout(() => {
      if (!deleting && charIndex < current.length) {
        setCharIndex((prev) => prev + 1)
        return
      }

      if (!deleting && charIndex === current.length) {
        window.setTimeout(() => setDeleting(true), 1800)
        return
      }

      if (deleting && charIndex > 0) {
        setCharIndex((prev) => prev - 1)
        return
      }

      setDeleting(false)
      setLineIndex((prev) => (prev + 1) % typingLines.length)
    }, delay)

    return () => window.clearTimeout(timer)
  }, [charIndex, deleting, lineIndex])

  const typedText = typingLines[lineIndex].slice(0, charIndex)

  return (
    <section id="home" className="relative flex min-h-screen items-center overflow-hidden pb-20 pt-28">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[20%] top-32 h-80 w-80 rounded-full bg-[#27cbcb]/20 blur-[120px]" />
        <div className="absolute bottom-16 right-[10%] h-72 w-72 rounded-full bg-[#26d868]/15 blur-[100px]" />
        <span className="absolute left-[12%] top-[22%] font-mono text-4xl text-white/[0.03]">{`{ }`}</span>
      </div>

      <PageContainer className="relative z-10 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="mb-6 font-mono text-sm sm:text-base">
            <span className="text-[#27cbcb]">const</span>
            <span className="text-slate-300">{` developer = "${profile.name}";`}</span>
          </p>

          <h1 className="mb-2 max-w-3xl text-4xl font-bold leading-[1.12] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-[4.25rem]">
            Cloud Engineer
            <br />
            <span className="text-slate-300">&amp; Full Stack Developer</span>
          </h1>

          <p className="mb-6 min-h-[3.5rem] max-w-2xl text-2xl font-semibold text-slate-500 sm:text-3xl">
            {typedText}
            <span className="ml-0.5 inline-block h-[1.1em] w-[2px] animate-pulse bg-[#27cbcb] align-[-0.1em]" />
          </p>

          <p className="mb-8 max-w-xl text-base leading-relaxed text-slate-400 sm:text-lg">
            {profile.summary[0]}
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
              className="inline-flex items-center gap-2 rounded-md bg-[#26d868] px-6 py-3 text-sm font-semibold text-black transition hover:bg-[#2ee070]"
            >
              View Projects
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
              className="rounded-md border border-white/25 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/5"
            >
              Get in Touch
            </button>
            <span className="hidden font-mono text-xs text-slate-600 md:inline">
              // cloud // full-stack // problem-solver
            </span>
          </div>
        </motion.div>
      </PageContainer>

      <motion.button
        type="button"
        aria-label="Scroll to about section"
        onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 rounded-full border border-white/15 bg-white/5 p-3 text-slate-400 backdrop-blur transition hover:border-[#27cbcb]/40 hover:text-[#27cbcb]"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2.2, repeat: Number.POSITIVE_INFINITY }}
      >
        <ArrowDown className="h-4 w-4" />
      </motion.button>
    </section>
  )
}

export default Hero
