"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import type { MouseEvent } from "react"
import useEmblaCarousel from "embla-carousel-react"
import { motion } from "framer-motion"
import { ArrowUpRight, ChevronLeft, ChevronRight, Github, Sparkles } from "lucide-react"
import Image from "next/image"
import { projects, type ProjectDetail } from "@/lib/content/projects"
import PageContainer from "@/components/PageContainer"
import SectionLabel from "@/components/SectionLabel"
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"

const filters = [
  { id: "all", label: "All work" },
  { id: "fullstack", label: "Full stack" },
  { id: "cloud", label: "Cloud/Infra" },
  { id: "ai", label: "AI/ML" },
] as const

type FilterId = (typeof filters)[number]["id"]

type FilterCategory = Exclude<FilterId, "all">

const categoryMap: Record<FilterCategory, ProjectDetail["category"]> = {
  fullstack: "Full stack",
  cloud: "Cloud / Infra",
  ai: "AI / ML",
}

const getPreviewText = (project: ProjectDetail) => {
  const source = project.tagline || project.highlights[0] || ""
  const firstSentence = source.split(/(?<=[.!?])\s+/)[0]
  return firstSentence.length > 180 ? `${firstSentence.slice(0, 177)}...` : firstSentence
}

const getLinkByPattern = (project: ProjectDetail, pattern: RegExp) =>
  project.links.find((link) => pattern.test(link.label)) ?? project.links[0] ?? null

const getTechBadgeLabel = (tech: string) =>
  tech
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("") || tech.slice(0, 2).toUpperCase()

type ProjectCardProps = {
  project: ProjectDetail
  selected: boolean
  onOpen: (project: ProjectDetail) => void
}

const ProjectCard = ({ project, selected, onOpen }: ProjectCardProps) => {
  const liveLink = getLinkByPattern(project, /live|demo/i)
  const sourceLink = getLinkByPattern(project, /github|source/i)
  const previewText = getPreviewText(project)

  return (
    <article
      onClick={() => onOpen(project)}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onOpen(project) }}
      className={`group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border bg-[#0d1117] transition-all duration-300 ${
        selected
          ? "border-zinc-600 shadow-[0_0_40px_rgba(255,255,255,0.06)]"
          : "border-zinc-800 opacity-70"
      }`}
    >
      <div className="relative h-56 overflow-hidden md:h-64">
        <Image
          src={project.heroImage}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 70vw, 760px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/30 to-transparent" />

        <div className="absolute right-4 top-4 flex gap-2">
          {liveLink && (
            <a
              href={liveLink.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${project.title} live demo`}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/55 text-white backdrop-blur transition hover:border-white/30 hover:bg-white hover:text-black"
              onClick={(event) => event.stopPropagation()}
            >
              <ArrowUpRight className="h-4 w-4" />
            </a>
          )}
          {sourceLink && (
            <a
              href={sourceLink.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${project.title} source code`}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/55 text-white backdrop-blur transition hover:border-white/30 hover:bg-white hover:text-black"
              onClick={(event) => event.stopPropagation()}
            >
              <Github className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4 md:p-5">
        <span className="mb-2 inline-flex w-fit rounded-full border border-zinc-700 bg-zinc-800/80 px-2.5 py-0.5 text-[11px] text-zinc-400">
          {project.category}
        </span>

        <h3 className="text-xl font-bold text-white md:text-2xl">{project.title}</h3>
        <p className="mt-1.5 line-clamp-2 text-sm leading-5 text-zinc-400">{previewText}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {project.techStack.slice(0, 4).map((tech) => (
            <span
              key={tech}
              title={tech}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900 text-[10px] font-semibold text-zinc-300"
            >
              {getTechBadgeLabel(tech)}
            </span>
          ))}
        </div>

        <div className="mt-auto pt-4">
          <div className="flex flex-wrap gap-3 text-sm">
            {project.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-zinc-300 transition hover:text-white"
                onClick={(event) => event.stopPropagation()}
              >
                <span>{link.label}</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </article>
  )
}

const ProjectDetailModal = ({ project }: { project: ProjectDetail }) => {
  const liveLink = getLinkByPattern(project, /live|demo/i)
  const sourceLink = getLinkByPattern(project, /github|source/i)

  return (
    <div className="flex flex-col">
      <div className="relative h-56 w-full overflow-hidden rounded-lg sm:h-72">
        <Image
          src={project.heroImage}
          alt={project.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 720px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/10 to-transparent" />
      </div>

      <div className="mt-6 space-y-6">
        <div>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <h3 className="text-2xl font-bold text-white">{project.title}</h3>
            <span className="inline-flex shrink-0 rounded-full border border-zinc-700 bg-zinc-800/80 px-3 py-1 text-xs text-zinc-400">
              {project.category}
            </span>
          </div>
          <p className="mt-1 text-sm text-zinc-500">
            {project.role} &middot; {project.year}
          </p>
        </div>

        <p className="text-sm leading-6 text-zinc-400">{project.tagline}</p>

        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-500">Highlights</h4>
          <ul className="space-y-2">
            {project.highlights.map((h, i) => (
              <li key={i} className="flex gap-2 text-sm text-zinc-300">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#27cbcb]" />
                {h}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-500">Tech Stack</h4>
          <div className="flex flex-wrap gap-2">
            {project.stack.map((tech) => (
              <span
                key={tech}
                className="inline-flex rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 text-xs text-zinc-300"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-500">Architecture</h4>
          <ul className="space-y-2">
            {project.architecture.map((a, i) => (
              <li key={i} className="flex gap-2 text-sm text-zinc-300">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-600" />
                {a}
              </li>
            ))}
          </ul>
        </div>

        {project.readmeSections.map((section) => (
          <div key={section.heading}>
            <h4 className="mb-2 text-sm font-semibold uppercase tracking-wider text-zinc-500">{section.heading}</h4>
            <div className="space-y-1">
              {section.body.map((text, i) => (
                <p key={i} className="text-sm leading-6 text-zinc-400">{text}</p>
              ))}
            </div>
          </div>
        ))}

        <div className="flex flex-wrap gap-3 border-t border-zinc-800 pt-6">
          {liveLink && (
            <a
              href={liveLink.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#27cbcb]/40 bg-[#27cbcb]/10 px-4 py-2 text-sm text-white transition hover:bg-[#27cbcb]/20"
            >
              <ArrowUpRight className="h-4 w-4" />
              {liveLink.label}
            </a>
          )}
          {sourceLink && (
            <a
              href={sourceLink.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm text-zinc-300 transition hover:border-zinc-500 hover:text-white"
            >
              <Github className="h-4 w-4" />
              {sourceLink.label}
            </a>
          )}
          {project.links
            .filter((l) => l !== liveLink && l !== sourceLink)
            .map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm text-zinc-300 transition hover:border-zinc-500 hover:text-white"
              >
                <ArrowUpRight className="h-4 w-4" />
                {link.label}
              </a>
            ))}
        </div>
      </div>
    </div>
  )
}

const Projects = () => {
  const [filter, setFilter] = useState<FilterId>("all")
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [dialogProject, setDialogProject] = useState<ProjectDetail | null>(null)
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
    skipSnaps: false,
    containScroll: false,
    dragFree: false,
  })

  const filteredProjects = useMemo(() => {
    if (filter === "all") return projects
    return projects.filter((project) => project.category === categoryMap[filter])
  }, [filter])

  useEffect(() => {
    setSelectedIndex(0)
    if (emblaApi) {
      emblaApi.scrollTo(0, true)
      emblaApi.reInit()
    }
  }, [emblaApi, filter, filteredProjects.length])

  useEffect(() => {
    if (!emblaApi) return

    const handleSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap())
    }

    handleSelect()
    emblaApi.on("select", handleSelect)
    emblaApi.on("reInit", handleSelect)

    return () => {
      emblaApi.off("select", handleSelect)
      emblaApi.off("reInit", handleSelect)
    }
  }, [emblaApi])

  const scrollPrev = useCallback(() => {
    emblaApi?.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext()
  }, [emblaApi])

  const handleFilterChange = (nextFilter: FilterId) => {
    setFilter(nextFilter)
  }

  return (
    <section id="projects" className="relative overflow-hidden bg-zinc-950 py-20">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 top-24 h-48 bg-gradient-to-b from-white/5 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#27cbcb]/10 to-transparent blur-3xl" />

      <PageContainer className="relative">
        <SectionLabel label="projects" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65 }}
          className="mb-8"
        >
          <h2 className="text-4xl font-bold text-white md:text-5xl">Things I&apos;ve Built</h2>
          <p className="mt-3 max-w-2xl text-slate-400">
            Real-world projects focused on system design, scalability, and clean engineering.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {filters.map((tab) => {
              const active = filter === tab.id

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleFilterChange(tab.id)}
                  aria-pressed={active}
                  className={`rounded-full border px-4 py-1 text-sm transition ${
                    active
                      ? "border-[#27cbcb]/40 bg-[#27cbcb]/15 text-white"
                      : "border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              )
            })}
          </div>
        </motion.div>

        <div className="relative">
          <button
            type="button"
            onClick={scrollPrev}
            aria-label="Previous project"
            className="absolute left-0 top-1/2 z-20 hidden h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/50 text-white backdrop-blur transition hover:border-white/30 hover:bg-white hover:text-black md:inline-flex"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={scrollNext}
            aria-label="Next project"
            className="absolute right-0 top-1/2 z-20 hidden h-12 w-12 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/50 text-white backdrop-blur transition hover:border-white/30 hover:bg-white hover:text-black md:inline-flex"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex items-stretch py-2">
              {filteredProjects.map((project, index) => {
                const selected = index === selectedIndex

                return (
                  <div
                    key={project.slug}
                    className="min-w-0 flex-[0_0_100%] px-3 sm:flex-[0_0_92%] md:flex-[0_0_72%] lg:flex-[0_0_64%] xl:flex-[0_0_58%]"
                  >
                    <div className={`transition-all duration-300 ${selected ? "scale-100 opacity-100" : "scale-[0.96] opacity-70"}`}>
                      <ProjectCard project={project} selected={selected} onOpen={setDialogProject} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <Dialog open={!!dialogProject} onOpenChange={(open) => { if (!open) setDialogProject(null) }}>
          <DialogContent
            className="max-h-[90vh] max-w-3xl overflow-y-auto border-zinc-800 bg-zinc-950 text-white [&>button]:text-zinc-400"
            showCloseButton
          >
            <DialogTitle className="sr-only">{dialogProject?.title ?? "Project details"}</DialogTitle>
            {dialogProject && <ProjectDetailModal project={dialogProject} />}
          </DialogContent>
        </Dialog>
      </PageContainer>
    </section>
  )
}

export default Projects
