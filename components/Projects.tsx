"use client"

import { useMemo, useRef, useState } from "react"
import type { MouseEvent } from "react"
import { motion } from "framer-motion"
import { ArrowUpRight, BookOpen, Boxes, Sparkles, X } from "lucide-react"
import Image from "next/image"
import { projects, type ProjectDetail } from "@/lib/content/projects"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import PageContainer from "@/components/PageContainer"
import SectionLabel from "@/components/SectionLabel"

type FilterId = "all" | "fullstack" | "cloud" | "ai"

const filterMap: Record<Exclude<FilterId, "all">, ProjectDetail["category"]> = {
  fullstack: "Full stack",
  cloud: "Cloud / Infra",
  ai: "AI / ML",
}

const filterLabels: Array<{ id: FilterId; label: string }> = [
  { id: "all", label: "All work" },
  { id: "fullstack", label: "Full stack" },
  { id: "cloud", label: "Cloud & Infra" },
  { id: "ai", label: "AI & ML" },
]

type ProjectCardProps = {
  project: ProjectDetail
  onClick: (project: ProjectDetail) => void
  compact?: boolean
}

const ProjectCard = ({ project, onClick, compact = false }: ProjectCardProps) => {
  const cardRef = useRef<HTMLButtonElement>(null)
  const [transform, setTransform] = useState("perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0px)")

  const handleMouseMove = (event: MouseEvent<HTMLButtonElement>) => {
    const element = cardRef.current
    if (!element) return

    const rect = element.getBoundingClientRect()
    const offsetX = event.clientX - rect.left
    const offsetY = event.clientY - rect.top
    const rotateY = ((offsetX - rect.width / 2) / (rect.width / 2)) * 8
    const rotateX = ((rect.height / 2 - offsetY) / (rect.height / 2)) * 8

    setTransform(
      `perspective(800px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-2px)`,
    )
  }

  const resetTransform = () => {
    setTransform("perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0px)")
  }

  return (
    <button
      ref={cardRef}
      type="button"
      onClick={() => onClick(project)}
      onMouseMove={handleMouseMove}
      onMouseLeave={resetTransform}
      style={{ transform }}
      aria-label={`Open ${project.title}`}
      className={`group relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 text-left transition-all duration-300 hover:border-zinc-500 hover:shadow-[0_0_30px_rgba(255,255,255,0.05)] focus-visible:border-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 ${compact ? "w-full" : "w-[340px] shrink-0"}`}
    >
      <div className="relative h-44 w-full overflow-hidden">
        <Image
          src={project.heroImage}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 340px"
          priority={false}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/35 to-transparent" />
      </div>

      <div className="p-5">
        <span className="mb-2 inline-block rounded-full bg-zinc-800 px-2 py-0.5 text-xs text-zinc-400">
          {project.category}
        </span>

        <h3 className="text-base font-bold text-white">{project.title}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-zinc-400">{project.tagline}</p>

        <div className="mt-4 flex items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {project.stack.slice(0, 3).map((tech) => (
              <span key={tech} className="rounded-full border border-zinc-700 px-2 py-0.5 text-xs text-zinc-400">
                {tech}
              </span>
            ))}
          </div>

          <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-zinc-700 text-white transition group-hover:bg-white group-hover:text-black">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </button>
  )
}

type MarqueeRowProps = {
  projects: ProjectDetail[]
  direction: "left" | "right"
  isPaused: boolean
  onCardClick: (project: ProjectDetail) => void
  rowKey: string
}

const MarqueeRow = ({ projects, direction, isPaused, onCardClick, rowKey }: MarqueeRowProps) => {
  const repeatedProjects = [...projects, ...projects]

  return (
    <div className="overflow-hidden">
      <div
        key={rowKey}
        className={`flex w-max gap-6 ${direction === "left" ? "animate-marquee" : "animate-marquee-reverse"}`}
        style={{ animationPlayState: isPaused ? "paused" : "running" }}
      >
        {repeatedProjects.map((project, index) => (
          <ProjectCard key={`${project.slug}-${index}`} project={project} onClick={onCardClick} />
        ))}
      </div>
    </div>
  )
}

const Projects = () => {
  const [active, setActive] = useState<ProjectDetail | null>(null)
  const [filter, setFilter] = useState<FilterId>("all")
  const [pausedRow, setPausedRow] = useState<"left" | "right" | null>(null)
  const [layoutSeed, setLayoutSeed] = useState(0)

  const filteredProjects = useMemo(() => {
    if (filter === "all") return projects
    return projects.filter((project) => project.category === filterMap[filter])
  }, [filter])

  const splitIndex = Math.ceil(filteredProjects.length / 2)
  const topRowProjects = filteredProjects.slice(0, splitIndex)
  const bottomRowProjects = filteredProjects.slice(splitIndex)
  const fallbackBottomRow = bottomRowProjects.length > 0 ? bottomRowProjects : topRowProjects

  const handleFilterChange = (nextFilter: FilterId) => {
    setFilter(nextFilter)
    setActive(null)
    setPausedRow(null)
    setLayoutSeed((value) => value + 1)
  }

  return (
    <section id="projects" className="relative overflow-hidden bg-zinc-950 py-24">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 top-24 h-48 bg-gradient-to-b from-white/5 to-transparent blur-3xl" />
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
          <h2 className="mb-3 text-4xl font-bold text-white md:text-5xl">Things I&apos;ve Built</h2>
          <p className="max-w-2xl text-slate-400">
            Real-world projects focused on system design, scalability, and clean engineering.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {filterLabels.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => handleFilterChange(c.id)}
                aria-pressed={filter === c.id}
                className={`rounded-full border px-4 py-1 text-sm transition ${
                  filter === c.id
                    ? "border-white bg-white text-black"
                    : "border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-white"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </motion.div>

        <div className="space-y-6 md:hidden">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} onClick={setActive} compact />
          ))}
        </div>

        <div className="hidden space-y-6 md:block">
          <div
            className="group/row"
            onMouseEnter={() => setPausedRow("left")}
            onMouseLeave={() => setPausedRow(null)}
          >
            <MarqueeRow
              key={`top-${filter}-${layoutSeed}`}
              projects={topRowProjects.length > 0 ? topRowProjects : filteredProjects}
              direction="left"
              isPaused={pausedRow === "left"}
              onCardClick={setActive}
              rowKey={`top-${filter}-${layoutSeed}`}
            />
          </div>

          <div
            className="group/row"
            onMouseEnter={() => setPausedRow("right")}
            onMouseLeave={() => setPausedRow(null)}
          >
            <MarqueeRow
              key={`bottom-${filter}-${layoutSeed}`}
              projects={fallbackBottomRow.length > 0 ? fallbackBottomRow : filteredProjects}
              direction="right"
              isPaused={pausedRow === "right"}
              onCardClick={setActive}
              rowKey={`bottom-${filter}-${layoutSeed}`}
            />
          </div>
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
