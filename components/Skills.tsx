"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import PageContainer from "@/components/PageContainer"
import SectionLabel from "@/components/SectionLabel"
import SkillCard from "@/components/SkillCard"
import { logoMap } from "@/components/SkillLogos"
import { skillCategories } from "@/lib/content/skills"

type FilterId = "frontend" | "backend" | "database" | "tools-devops" | "ai-ml"

const filters: { id: FilterId; label: string }[] = [
  { id: "frontend", label: "Frontend" },
  { id: "backend", label: "Backend" },
  { id: "database", label: "Database" },
  { id: "tools-devops", label: "Tools & DevOps" },
  { id: "ai-ml", label: "AI & ML" },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
  exit: {
    opacity: 0,
    transition: { staggerChildren: 0.03, staggerDirection: -1 },
  },
}

const Skills = () => {
  const [activeFilter, setActiveFilter] = useState<FilterId>("frontend")

  const visibleCategories = skillCategories.filter((c) => c.id === activeFilter)

  return (
    <section id="skills" className="relative overflow-hidden py-24">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#27cbcb]/30 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-full bg-[radial-gradient(ellipse_at_50%_0%,rgba(39,203,203,0.06),transparent_60%)]" />

      <PageContainer className="relative">
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <SectionLabel label="skills & stack" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold text-white md:text-4xl">
            Tech <span className="bg-gradient-to-r from-[#27cbcb] via-[#26d868] to-[#80978f] bg-clip-text text-transparent">toolkit</span>
          </h2>
          <p className="mt-2 max-w-xl text-sm text-slate-500">
            Languages, frameworks, and infrastructure I work with daily.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mb-12 flex flex-wrap gap-2"
        >
          {filters.map((f) => {
            const isActive = activeFilter === f.id
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setActiveFilter(f.id)}
                className={`relative rounded-full px-4 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-wider transition-all duration-300 sm:text-[12px] ${
                  isActive
                    ? "text-white shadow-[0_0_14px_-2px_rgba(39,203,203,0.25)]"
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="filterBg"
                    className="absolute inset-0 rounded-full border border-[#27cbcb]/40 bg-[#27cbcb]/10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{f.label}</span>
              </button>
            )
          })}
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-14"
          >
            {visibleCategories.map((category) => {
              const globalStartIndex = skillCategories
                .slice(0, skillCategories.indexOf(category))
                .reduce((sum, c) => sum + c.skills.length, 0)

              return (
                <motion.div
                  key={category.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
                    exit: { opacity: 0, y: -10, transition: { duration: 0.25 } },
                  }}
                >
                  <div className="mb-6 flex items-center gap-4">
                    <h3 className="font-mono text-sm font-semibold uppercase tracking-[0.15em] text-white/90">
                      {category.label}
                    </h3>
                    <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
                  </div>

                  <AnimatePresence mode="popLayout">
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 sm:gap-4">
                      {category.skills.map((skill, skillIndex) => {
                        const LogoComponent = logoMap[skill.logo]
                        if (!LogoComponent) return null

                        return (
                          <SkillCard
                            key={skill.name}
                            name={skill.name}
                            logoSvg={LogoComponent}
                            index={globalStartIndex + skillIndex}
                          />
                        )
                      })}
                    </div>
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </motion.div>
        </AnimatePresence>
      </PageContainer>
    </section>
  )
}

export default Skills
