"use client"

import { useMemo, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowUpRight, BookOpen, Boxes, Sparkles, X } from "lucide-react"
import Image from "next/image"
import { projects, type ProjectDetail } from "@/lib/content/projects"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import PageContainer from "@/components/PageContainer"
import SectionLabel from "@/components/SectionLabel"

const Projects = () => {
  const [active, setActive] = useState<ProjectDetail | null>(null)
  const [filter, setFilter] = useState<"all" | "fullstack" | "cloud" | "ai">("all")

  const categories = useMemo(
    () =>
      [
        { id: "all" as const, label: "All work" },
        { id: "fullstack" as const, label: "Full stack" },
        { id: "cloud" as const, label: "Cloud / Infra" },
        { id: "ai" as const, label: "AI / ML" },
      ] as const,
    [],
  )

  const filtered = useMemo(() => {
    if (filter === "all") return projects
    if (filter === "cloud") return projects.filter((p) => p.slug.includes("aws"))
    if (filter === "ai") return projects.filter((p) => p.slug.includes("ai-"))
    return projects.filter((p) => !p.slug.includes("aws") && !p.slug.includes("ai-"))
  }, [filter])

  return (
    <section id="projects" className="relative overflow-hidden py-24">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#27cbcb]/10 to-transparent blur-3xl" />

      <PageContainer className="relative">
        <SectionLabel label="projects" />

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-10"
        >
          <h2 className="mb-3 text-4xl font-bold text-[#27cbcb] md:text-5xl">Things I&apos;ve Built</h2>
          <p className="max-w-2xl text-slate-400">
            Real-world projects focused on system design, scalability, and clean engineering.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setFilter(c.id)}
                className={`rounded-full border px-4 py-1.5 font-mono text-xs transition ${
                  filter === c.id
                    ? "border-[#27cbcb]/40 bg-[#27cbcb]/15 text-white"
                    : "border-white/10 bg-white/5 text-slate-400 hover:border-[#27cbcb]/30 hover:text-slate-200"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {filtered.map((project, index) => (
              <motion.button
                type="button"
                key={project.slug}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 16 }}
                transition={{ duration: 0.45, delay: index * 0.04 }}
                onClick={() => setActive(project)}
                className="group relative w-full overflow-hidden rounded-2xl border border-white/10 bg-[#101318]/90 text-left transition duration-300 hover:-translate-y-0.5 hover:border-[#27cbcb]/30"
              >
                <div className="relative h-52 w-full overflow-hidden">
                  <Image
                    src={project.heroImage}
                    alt={project.title}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-[1.02]"
                    sizes="(max-width: 768px) 100%, 560px"
                    priority={index < 2}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#101318] via-[#101318]/50 to-transparent" />
                </div>

                <div className="space-y-3 px-5 pb-5 pt-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-xl font-semibold text-white transition group-hover:text-[#27cbcb]">
                        {project.title}
                      </h3>
                      <p className="mt-1 font-mono text-sm text-[#27cbcb]">{project.tagline}</p>
                    </div>
                    <span className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-300 transition group-hover:border-[#27cbcb]/40 group-hover:text-[#27cbcb]">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </div>

                  <p className="text-sm leading-relaxed text-slate-400">
                    {project.highlights[0]}
                  </p>

                  <ul className="space-y-1.5 border-t border-white/10 pt-3">
                    {project.highlights.slice(0, 3).map((line) => (
                      <li key={line} className="flex gap-2 text-xs text-slate-500">
                        <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-[#27cbcb]" />
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      </PageContainer>

      <Dialog open={!!active} onOpenChange={(open) => !open && setActive(null)}>
        <DialogContent
          showCloseButton={false}
          className="max-h-[min(90vh,900px)] w-[min(100vw-2rem,1100px)] max-w-none translate-y-[-50%] gap-0 overflow-hidden border-white/10 bg-[#101318]/95 p-0 text-slate-100 sm:max-w-none"
        >
          {active && (
            <>
              <div className="relative h-56 w-full sm:h-64">
                <Image src={active.heroImage} alt={active.title} fill className="object-cover" sizes="1100px" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#101318] via-[#101318]/55 to-transparent" />
                <button
                  type="button"
                  aria-label="Close project"
                  onClick={() => setActive(null)}
                  className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/60 text-white backdrop-blur transition hover:bg-black/80"
                >
                  <X className="h-5 w-5" />
                </button>
                <div className="absolute bottom-4 left-4 right-4 sm:left-6">
                  <DialogHeader className="space-y-2 text-left">
                    <DialogTitle className="text-2xl text-white sm:text-3xl">{active.title}</DialogTitle>
                    <DialogDescription className="text-sm text-slate-300 sm:text-base">{active.tagline}</DialogDescription>
                  </DialogHeader>
                </div>
              </div>

              <div className="max-h-[calc(min(90vh,900px)-16rem)] overflow-y-auto px-4 pb-6 pt-4 sm:px-6">
                <div className="space-y-6 pr-1">
                  <div className="flex flex-wrap gap-2">
                    {active.stack.map((tech) => (
                      <Badge key={tech} className="bg-[#27cbcb]/15 text-xs font-medium text-[#27cbcb] hover:bg-[#27cbcb]/25">
                        {tech}
                      </Badge>
                    ))}
                  </div>

                  <div className="grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
                        <Sparkles className="h-4 w-4 text-[#27cbcb]" />
                        Highlights
                      </div>
                      <ul className="space-y-2 text-sm text-slate-300">
                        {active.highlights.map((line) => (
                          <li key={line} className="flex gap-2">
                            <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#27cbcb]" />
                            <span>{line}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
                        <Boxes className="h-4 w-4 text-[#26d868]" />
                        Architecture
                      </div>
                      <ul className="space-y-2 font-mono text-xs text-slate-300 sm:text-[13px]">
                        {active.architecture.map((line) => (
                          <li key={line} className="rounded-lg bg-black/40 px-3 py-2">
                            {line}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <Separator className="bg-white/10" />

                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-white">
                      <BookOpen className="h-4 w-4 text-[#27cbcb]" />
                      README-style narrative
                    </div>
                    {active.readmeSections.map((section) => (
                      <div key={section.heading} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                        <h4 className="text-sm font-semibold text-[#27cbcb]">{section.heading}</h4>
                        <div className="mt-2 space-y-2 text-sm leading-relaxed text-slate-300">
                          {section.body.map((p) => (
                            <p key={p}>{p}</p>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-3 pb-2">
                    {active.links.map((link) => (
                      <Button
                        key={link.href}
                        asChild
                        variant="secondary"
                        className="rounded-full border border-white/10 bg-white/10 text-white hover:bg-white/15"
                      >
                        <a href={link.href} target="_blank" rel="noopener noreferrer">
                          {link.label}
                          <ArrowUpRight className="ml-2 h-4 w-4" />
                        </a>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  )
}

export default Projects
