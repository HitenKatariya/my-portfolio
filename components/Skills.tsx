"use client"

import { motion } from "framer-motion"
import PageContainer from "@/components/PageContainer"

const Skills = () => {
  const skillCategories = [
    {
      title: "Frontend",
      icon: "⚛️",
      skills: ["React 19", "Vite", "Redux + Thunk", "TailwindCSS", "Responsive UX", "Design systems"],
    },
    {
      title: "Backend & APIs",
      icon: "🛰️",
      skills: ["Node.js", "Express", "REST design", "JWT auth", "MongoDB + Mongoose", "FastAPI"],
    },
    {
      title: "AI / ML",
      icon: "🤖",
      skills: ["Model integration", "HF Inference", "Prompt + caption pipelines", "Image gen (SDXL)", "Evaluation mindset"],
    },
    {
      title: "Cloud & Security",
      icon: "☁️",
      skills: ["AWS VPC patterns", "EC2 tiers", "DevOps basics", "Secrets hygiene", "Cryptography awareness"],
    },
  ]

  return (
    <section id="skills" className="relative overflow-hidden py-24">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#27cbcb]/30 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 top-10 h-48 bg-gradient-to-b from-[#26d868]/12 to-transparent blur-3xl" />
      <PageContainer className="relative">
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.75 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-4xl font-bold text-slate-900 dark:text-white md:text-5xl">
            Skills <span className="bg-gradient-to-r from-teal-600 via-emerald-600 to-slate-700 bg-clip-text text-transparent dark:from-[#27cbcb] dark:via-[#26d868] dark:to-[#80978f]">&amp; stack</span>
          </h2>
          <div className="mx-auto mb-6 h-1 w-24 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 dark:from-[#27cbcb] dark:to-[#26d868]" />
          <p className="mx-auto max-w-2xl text-lg text-slate-600 dark:text-slate-400">
            A concise map of the tools I reach for when shipping full-stack products, AI features, and cloud-ready systems.
          </p>
        </motion.div>



        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {skillCategories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: index * 0.06 }}
              viewport={{ once: true }}
              className="rounded-2xl border border-slate-200/80 bg-white/90 p-6 shadow-lg shadow-slate-300/40 backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:border-teal-400/40 hover:shadow-xl dark:border-white/10 dark:bg-[#101318]/90 dark:shadow-black/30 dark:hover:border-[#27cbcb]/40"
              whileHover={{ y: -4 }}
            >
              <div className="mb-4 text-center text-3xl">{category.icon}</div>
              <h3 className="mb-4 text-center text-lg font-semibold text-slate-900 dark:text-white">{category.title}</h3>
              <ul className="space-y-2">
                {category.skills.map((skill) => (
                  <li key={skill} className="flex items-center text-sm text-slate-700 dark:text-slate-300">
                    <span className="mr-3 h-1.5 w-1.5 rounded-full bg-teal-500 dark:bg-[#27cbcb]" />
                    {skill}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </PageContainer>
    </section>
  )
}

export default Skills
