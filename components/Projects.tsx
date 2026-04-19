"use client"

import { useMemo, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowUpRight, BookOpen, Boxes, Layers, Sparkles, X } from "lucide-react"
import Image from "next/image"
import { projects, type ProjectDetail } from "@/lib/content/projects"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"

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
    <section id="projects" className="relative overflow-hidden bg-gradient-to-b from-[#020617] to-[#030712] py-24 px-4">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-cyan-500/10 to-transparent blur-3xl" />
      <div className="relative mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-12 text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-cyan-200/90">
            <Layers className="h-3.5 w-3.5" />
            Selected work
          </div>
          <h2 className="mb-4 text-4xl font-bold text-white md:text-5xl">
            Projects <span className="bg-gradient-to-r from-cyan-300 to-violet-300 bg-clip-text text-transparent">with depth</span>
          </h2>
            <p className="mx-auto mb-8 max-w-2xl text-slate-400">
              Explore project case studies with key outcomes, architecture decisions, and the tech stack behind each build.
            </p>
          <div className="mx-auto flex flex-wrap justify-center gap-2">
            {categories.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setFilter(c.id)}
                className={`rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-wide transition ${
                  filter === c.id
                    ? "border-cyan-400/60 bg-cyan-500/15 text-white"
                    : "border-white/10 bg-white/5 text-slate-400 hover:border-cyan-400/40 hover:text-slate-100"
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
                layout
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 16 }}
                transition={{ duration: 0.45, delay: index * 0.04 }}
                onClick={() => setActive(project)}
                className="group relative w-full overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] text-left shadow-xl shadow-black/40 transition hover:border-cyan-400/40 hover:bg-white/[0.05]"
              >
                <div className="relative h-56 w-full overflow-hidden">
                  <Image
                    src={project.heroImage}
                    alt={project.title}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-[1.03]"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority={index < 2}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/40 to-transparent" />
                  <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-cyan-100 backdrop-blur">
                    <Sparkles className="h-3.5 w-3.5" />
                    {project.year}
                  </div>
                </div>
                <div className="space-y-3 px-6 pb-6 pt-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-xl font-semibold text-white transition group-hover:text-cyan-100">{project.title}</h3>
                      <p className="mt-1 text-sm text-slate-400">{project.tagline}</p>
                    </div>
                    <span className="mt-1 inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-200 transition group-hover:border-cyan-400/50 group-hover:text-white">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </div>
                  <p className="text-xs font-medium uppercase tracking-widest text-slate-500">{project.role}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.stack.slice(0, 4).map((tech) => (
                      <Badge key={tech} variant="outline" className="border-white/15 bg-black/40 text-[11px] text-slate-200">
                        {tech}
                      </Badge>
                    ))}
                    {project.stack.length > 4 && (
                      <Badge variant="outline" className="border-dashed border-white/20 text-[11px] text-slate-400">
                        +{project.stack.length - 4} more
                      </Badge>
                    )}
                  </div>
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <Dialog open={!!active} onOpenChange={(open) => !open && setActive(null)}>
        <DialogContent
          showCloseButton={false}
          className="max-h-[min(90vh,900px)] w-[min(100vw-2rem,1100px)] max-w-none translate-y-[-50%] gap-0 overflow-hidden border-white/10 bg-[#020617] p-0 text-slate-100 sm:max-w-none"
        >
          {active && (
            <>
              <div className="relative h-56 w-full sm:h-64">
                <Image src={active.heroImage} alt={active.title} fill className="object-cover" sizes="1100px" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/55 to-transparent" />
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
                      <Badge key={tech} className="bg-cyan-500/15 text-xs font-medium text-cyan-50 hover:bg-cyan-500/20">
                        {tech}
                      </Badge>
                    ))}
                  </div>

                  <div className="grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
                        <Sparkles className="h-4 w-4 text-cyan-300" />
                        Highlights
                      </div>
                      <ul className="space-y-2 text-sm text-slate-300">
                        {active.highlights.map((line) => (
                          <li key={line} className="flex gap-2">
                            <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-cyan-400" />
                            <span>{line}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
                        <Boxes className="h-4 w-4 text-violet-300" />
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
                      <BookOpen className="h-4 w-4 text-cyan-300" />
                      README-style narrative
                    </div>
                    {active.readmeSections.map((section) => (
                      <div key={section.heading} className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-transparent p-4">
                        <h4 className="text-sm font-semibold text-cyan-100">{section.heading}</h4>
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
                      <Button key={link.href} asChild variant="secondary" className="rounded-full border border-white/10 bg-white/10 text-white hover:bg-white/15">
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
