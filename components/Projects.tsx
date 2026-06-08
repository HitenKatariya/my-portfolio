"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import type { MouseEvent } from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
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

type ProjectCardProps = {
  project: ProjectDetail
  selected: boolean
  onOpen: (project: ProjectDetail) => void
  onClick?: () => void
}

const ProjectCard = ({ project, selected, onOpen, onClick }: ProjectCardProps) => {
  const liveLink = getLinkByPattern(project, /live|demo/i)
  const sourceLink = getLinkByPattern(project, /github|source/i)
  const previewText = getPreviewText(project)

  // Motion values for magnetic card hover
  const mouseX = useMotionValue(0.5)
  const mouseY = useMotionValue(0.5)

  // Spring physics for smooth magnetic movement
  const springConfig = { damping: 20, stiffness: 200 }
  const rotateX = useSpring(useTransform(mouseY, [0, 1], [8, -8]), springConfig)
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-8, 8]), springConfig)

  // Spring physics for parallax image movement
  const imageX = useSpring(useTransform(mouseX, [0, 1], [15, -15]), springConfig)
  const imageY = useSpring(useTransform(mouseY, [0, 1], [15, -15]), springConfig)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!selected) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    mouseX.set(x)
    mouseY.set(y)
  }

  const handleMouseLeave = () => {
    mouseX.set(0.5)
    mouseY.set(0.5)
  }

  return (
    <motion.article
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={(e) => {
        if (!selected) {
          e.stopPropagation()
          onClick?.()
        } else {
          onOpen(project)
        }
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          if (selected) onOpen(project)
          else onClick?.()
        }
      }}
      tabIndex={0}
      style={{
        transformStyle: "preserve-3d",
        rotateX: selected ? rotateX : 0,
        rotateY: selected ? rotateY : 0,
      }}
      className={`group relative flex h-full w-full cursor-pointer flex-col overflow-hidden rounded-3xl border bg-zinc-950/40 backdrop-blur-xl transition-all duration-500 outline-none select-none ${
        selected
          ? "border-[#27cbcb]/50 shadow-[0_30px_60px_rgba(0,0,0,0.85),_0_0_50px_rgba(39,203,203,0.15)]"
          : "border-zinc-800/60 opacity-30 hover:opacity-60 hover:border-zinc-700 shadow-md"
      }`}
    >
      {/* Glossy top border highlight */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      {/* Hover glow background */}
      {selected && (
        <div className="absolute -inset-2 -z-10 rounded-3xl bg-gradient-to-r from-[#27cbcb]/8 to-transparent opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />
      )}

      {/* Card Hero Image Container */}
      <div className="relative h-48 overflow-hidden sm:h-56">
        <motion.div
          style={{
            x: selected ? imageX : 0,
            y: selected ? imageY : 0,
            scale: selected ? 1.12 : 1.0,
          }}
          transition={{ type: "spring", stiffness: 200, damping: 22 }}
          className="absolute inset-0 w-full h-full"
        >
          <Image
            src={project.heroImage}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 480px"
            priority={selected}
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/95 via-zinc-950/20 to-transparent" />

        {/* Hover/Access quick actions */}
        <div className="absolute right-4 top-4 flex gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          {liveLink && (
            <a
              href={liveLink.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${project.title} live demo`}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-black/60 text-white backdrop-blur-md transition hover:scale-105 hover:bg-white hover:text-black"
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
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-black/60 text-white backdrop-blur-md transition hover:scale-105 hover:bg-white hover:text-black"
              onClick={(event) => event.stopPropagation()}
            >
              <Github className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>

      {/* Card Content */}
      <div className="flex flex-1 flex-col p-5 sm:p-6 justify-between">
        <div>
          <span className="mb-2 inline-flex w-fit rounded-full border border-zinc-700 bg-zinc-900/60 px-3 py-0.5 text-[10px] font-medium tracking-wide uppercase text-[#27cbcb]">
            {project.category}
          </span>
          <h3 className="text-xl font-bold tracking-tight text-white sm:text-2xl mt-1 group-hover:text-[#27cbcb] transition-colors duration-300">{project.title}</h3>
          <p className="mt-2 line-clamp-3 text-xs sm:text-sm leading-relaxed text-zinc-400">{previewText}</p>
        </div>

        <div className="mt-4">
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.techStack.slice(0, 4).map((tech) => (
              <span
                key={tech}
                title={tech}
                className="inline-flex items-center rounded-md bg-zinc-900/80 px-2 py-1 text-[10px] font-medium text-zinc-300 border border-zinc-800"
              >
                {tech}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between border-t border-zinc-800/80 pt-4 text-xs font-semibold text-[#27cbcb] group-hover:text-white transition-colors">
            <span>Explore Details</span>
            <ArrowUpRight className="h-4 w-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </div>
      </div>
    </motion.article>
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
  const [activeIndex, setActiveIndex] = useState(0)
  const [dialogProject, setDialogProject] = useState<ProjectDetail | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [dragStart, setDragStart] = useState(0)

  const filteredProjects = useMemo(() => {
    if (filter === "all") return projects
    return projects.filter((project) => project.category === categoryMap[filter])
  }, [filter])

  useEffect(() => {
    setActiveIndex(0)
  }, [filter, filteredProjects.length])

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const scrollPrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + filteredProjects.length) % filteredProjects.length)
  }, [filteredProjects.length])

  const scrollNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % filteredProjects.length)
  }, [filteredProjects.length])

  const handleFilterChange = (nextFilter: FilterId) => {
    setFilter(nextFilter)
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        scrollPrev()
      } else if (e.key === "ArrowRight") {
        scrollNext()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [scrollPrev, scrollNext])

  return (
    <section id="projects" className="relative overflow-hidden bg-zinc-950 py-24">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 top-24 h-48 bg-gradient-to-b from-white/5 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-[#27cbcb]/10 via-transparent to-transparent blur-3xl" />

      <PageContainer className="relative">
        <SectionLabel label="projects" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65 }}
          className="mb-8"
        >
          <h2 className="text-4xl font-bold tracking-tight text-white md:text-5xl">Things I&apos;ve Built</h2>
          <p className="mt-3 max-w-2xl text-zinc-400">
            Real-world projects focused on system design, scalability, and clean engineering.
          </p>

          <div className="mt-8 flex flex-wrap gap-2.5">
            {filters.map((tab) => {
              const active = filter === tab.id

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleFilterChange(tab.id)}
                  aria-pressed={active}
                  className={`rounded-full border px-5 py-1.5 text-xs font-semibold tracking-wide uppercase transition-all duration-300 ${
                    active
                      ? "border-[#27cbcb]/50 bg-[#27cbcb]/15 text-white shadow-[0_0_20px_rgba(39,203,203,0.15)]"
                      : "border-zinc-800 text-zinc-400 bg-zinc-900/40 hover:border-zinc-600 hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              )
            })}
          </div>
        </motion.div>

        {/* 3D Showcase Area Container */}
        <div className="relative flex items-center justify-center w-full h-[540px] md:h-[620px] overflow-hidden select-none">
          {/* Navigation Controls */}
          <button
            type="button"
            onClick={scrollPrev}
            aria-label="Previous project"
            className="absolute left-2 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-black/60 text-white backdrop-blur-md transition hover:scale-105 hover:border-[#27cbcb]/40 hover:bg-[#27cbcb]/10 focus:outline-none md:left-4"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <button
            type="button"
            onClick={scrollNext}
            aria-label="Next project"
            className="absolute right-2 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-black/60 text-white backdrop-blur-md transition hover:scale-105 hover:border-[#27cbcb]/40 hover:bg-[#27cbcb]/10 focus:outline-none md:right-4"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* 3D Showcase Perspective Box */}
          <div
            className="relative w-full h-full flex items-center justify-center"
            style={{
              perspective: "1200px",
              transformStyle: "preserve-3d"
            }}
          >
            {filteredProjects.map((project, index) => {
              let offset = index - activeIndex
              const len = filteredProjects.length
              if (offset > Math.floor(len / 2)) offset -= len
              if (offset < -Math.floor(len / 2)) offset += len

              const absOffset = Math.abs(offset)
              const selected = index === activeIndex

              // Coverflow + Stacked card positioning logic
              const stepX = isMobile ? 120 : 220
              const stepY = absOffset * (isMobile ? 10 : 18)
              const stepZ = absOffset * -130
              const rotateYVal = offset * (isMobile ? -20 : -30)
              const rotateXVal = absOffset * 6 // Slight tilt back

              if (absOffset > 2) return null

              return (
                <motion.div
                  key={project.slug}
                  initial={false}
                  animate={{
                    x: offset * stepX,
                    y: stepY,
                    z: stepZ,
                    scale: selected ? 1.0 : 0.88 - absOffset * 0.08,
                    rotateY: rotateYVal,
                    rotateX: rotateXVal,
                    opacity: selected ? 1 : absOffset === 1 ? 0.65 : 0.25,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 240,
                    damping: 25,
                  }}
                  style={{
                    position: "absolute",
                    width: isMobile ? "290px" : "450px",
                    height: isMobile ? "440px" : "530px",
                    zIndex: 10 - absOffset,
                    transformStyle: "preserve-3d",
                  }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.4}
                  onDragStart={(e, info) => setDragStart(info.point.x)}
                  onDragEnd={(e, info) => {
                    const threshold = 60
                    const dragDistance = info.point.x - dragStart
                    if (dragDistance > threshold) {
                      scrollPrev()
                    } else if (dragDistance < -threshold) {
                      scrollNext()
                    }
                  }}
                >
                  <ProjectCard
                    project={project}
                    selected={selected}
                    onOpen={setDialogProject}
                    onClick={() => setActiveIndex(index)}
                  />
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Carousel Pagination indicator */}
        <div className="mt-4 flex justify-center items-center gap-1.5 text-xs text-zinc-500 font-mono">
          <span className="text-[#27cbcb] font-bold">{(activeIndex + 1).toString().padStart(2, "0")}</span>
          <span className="opacity-40">/</span>
          <span>{filteredProjects.length.toString().padStart(2, "0")}</span>
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
