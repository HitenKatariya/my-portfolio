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
    <section
      id="projects"
      className="relative overflow-hidden bg-gradient-to-b from-slate-100 to-white py-24 px-4 transition-colors duration-300 dark:from-[#020617] dark:to-[#030712]"
    >
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-blue-400/15 to-transparent blur-3xl dark:from-cyan-500/10" />
      <div className="relative mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-12 text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-1 text-xs font-semibold uppercase tracking-widest text-blue-700 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-cyan-200/90">
            <Layers className="h-3.5 w-3.5" />
            Selected work
          </div>
          <h2 className="mb-4 text-4xl font-bold text-slate-900 md:text-5xl dark:text-white">
            Projects <span className="bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent dark:from-cyan-300 dark:to-violet-300">with depth</span>
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-slate-600 dark:text-slate-400">
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
                    ? "border-blue-500/50 bg-blue-50 text-blue-700 dark:border-cyan-400/60 dark:bg-cyan-500/15 dark:text-white"
                    : "border-slate-300 bg-white text-slate-500 hover:border-blue-400/40 hover:text-slate-800 dark:border-white/10 dark:bg-white/5 dark:text-slate-400 dark:hover:border-cyan-400/40 dark:hover:text-slate-100"
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
                className="group relative w-full overflow-hidden rounded-3xl border border-slate-200 bg-white text-left shadow-md shadow-slate-200/70 transition hover:border-blue-400/40 hover:shadow-lg dark:border-white/10 dark:bg-white/[0.03] dark:shadow-xl dark:shadow-black/40 dark:hover:border-cyan-400/40 dark:hover:bg-white/[0.05]"
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
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 via-slate-900/10 to-transparent dark:from-[#020617] dark:via-[#020617]/40" />
                  <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white/85 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-blue-700 backdrop-blur dark:border-white/15 dark:bg-black/50 dark:text-cyan-100">
                    <Sparkles className="h-3.5 w-3.5" />
                    {project.year}
                  </div>
                </div>
                <div className="space-y-3 px-6 pb-6 pt-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-xl font-semibold text-slate-900 transition group-hover:text-blue-700 dark:text-white dark:group-hover:text-cyan-100">{project.title}</h3>
                      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{project.tagline}</p>
                    </div>
                    <span className="mt-1 inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-slate-300 bg-slate-50 text-slate-700 transition group-hover:border-blue-400/50 group-hover:text-blue-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:group-hover:border-cyan-400/50 dark:group-hover:text-white">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </div>
                  <p className="text-xs font-medium uppercase tracking-widest text-slate-500 dark:text-slate-500">{project.role}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.stack.slice(0, 4).map((tech) => (
                      <Badge key={tech} variant="outline" className="border-slate-300 bg-slate-50 text-[11px] text-slate-700 dark:border-white/15 dark:bg-black/40 dark:text-slate-200">
                        {tech}
                      </Badge>
                    ))}
                    {project.stack.length > 4 && (
                      <Badge variant="outline" className="border-dashed border-slate-300 text-[11px] text-slate-500 dark:border-white/20 dark:text-slate-400">
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
          className="max-h-[min(90vh,900px)] w-[min(100vw-2rem,1100px)] max-w-none translate-y-[-50%] gap-0 overflow-hidden border-slate-200 bg-white p-0 text-slate-800 dark:border-white/10 dark:bg-[#020617] dark:text-slate-100 sm:max-w-none"
        >
          {active && (
            <>
              <div className="relative h-56 w-full sm:h-64">
                <Image src={active.heroImage} alt={active.title} fill className="object-cover" sizes="1100px" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-100/70 via-slate-100/35 to-transparent dark:from-[#020617] dark:via-[#020617]/55" />
                <button
                  type="button"
                  aria-label="Close project"
                  onClick={() => setActive(null)}
                  className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 bg-white/85 text-slate-700 backdrop-blur transition hover:bg-white dark:border-white/15 dark:bg-black/60 dark:text-white dark:hover:bg-black/80"
                >
                  <X className="h-5 w-5" />
                </button>
                <div className="absolute bottom-4 left-4 right-4 sm:left-6">
                  <DialogHeader className="space-y-2 text-left">
                    <DialogTitle className="text-2xl text-slate-900 dark:text-white sm:text-3xl">{active.title}</DialogTitle>
                    <DialogDescription className="text-sm text-slate-700 dark:text-slate-300 sm:text-base">{active.tagline}</DialogDescription>
                  </DialogHeader>
                </div>
              </div>

              <div className="max-h-[calc(min(90vh,900px)-16rem)] overflow-y-auto px-4 pb-6 pt-4 sm:px-6">
                <div className="space-y-6 pr-1">
                  <div className="flex flex-wrap gap-2">
                    {active.stack.map((tech) => (
                      <Badge key={tech} className="bg-blue-100 text-xs font-medium text-blue-700 hover:bg-blue-200 dark:bg-cyan-500/15 dark:text-cyan-50 dark:hover:bg-cyan-500/20">
                        {tech}
                      </Badge>
                    ))}
                  </div>

                  <div className="grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/[0.02]">
                      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-white">
                        <Sparkles className="h-4 w-4 text-blue-500 dark:text-cyan-300" />
                        Highlights
                      </div>
                      <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                        {active.highlights.map((line) => (
                          <li key={line} className="flex gap-2">
                            <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-500 dark:bg-cyan-400" />
                            <span>{line}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/[0.02]">
                      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-white">
                        <Boxes className="h-4 w-4 text-indigo-500 dark:text-violet-300" />
                        Architecture
                      </div>
                      <ul className="space-y-2 font-mono text-xs text-slate-700 dark:text-slate-300 sm:text-[13px]">
                        {active.architecture.map((line) => (
                          <li key={line} className="rounded-lg bg-white px-3 py-2 shadow-sm dark:bg-black/40 dark:shadow-none">
                            {line}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <Separator className="bg-slate-200 dark:bg-white/10" />

                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-white">
                      <BookOpen className="h-4 w-4 text-blue-500 dark:text-cyan-300" />
                      README-style narrative
                    </div>
                    {active.readmeSections.map((section) => (
                      <div key={section.heading} className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-4 dark:border-white/10 dark:from-white/[0.04] dark:to-transparent">
                        <h4 className="text-sm font-semibold text-blue-700 dark:text-cyan-100">{section.heading}</h4>
                        <div className="mt-2 space-y-2 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
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
                        className="rounded-full border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
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
