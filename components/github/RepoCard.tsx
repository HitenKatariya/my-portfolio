"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, ExternalLink, Star, GitFork } from "lucide-react"
import type { RepoContext } from "@/lib/github/types"

type RepoCardProps = {
  repoContext: RepoContext
}

export default function RepoCard({ repoContext }: RepoCardProps) {
  const { repo, metadata } = repoContext
  const [expanded, setExpanded] = useState(false)
  const [loadingReadme, setLoadingReadme] = useState(false)

  const languageColors: Record<string, string> = {
    TypeScript: "#3178c6",
    JavaScript: "#f7df1e",
    Python: "#3572a5",
    Go: "#00add8",
    Rust: "#dea584",
    Java: "#b07219",
    Ruby: "#701516",
    PHP: "#4f5d95",
    "C++": "#f34b7d",
    C: "#555555",
    HTML: "#e34f26",
    CSS: "#563d7c",
    Shell: "#89e051",
    Dockerfile: "#384d54",
    Dart: "#00b4ab",
    Kotlin: "#a97bff",
    Swift: "#f05138",
  }

  const langColor = repo.language ? languageColors[repo.language] || "#8b8b8b" : "#8b8b8b"

  return (
    <div className="group rounded-xl border border-zinc-800 bg-zinc-950/60 backdrop-blur-sm transition hover:border-zinc-700">
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="truncate text-lg font-bold text-white">{repo.name}</h3>
              <span
                className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                  repo.visibility === "public"
                    ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                    : "border border-zinc-600/30 bg-zinc-600/10 text-zinc-400"
                }`}
              >
                {repo.visibility}
              </span>
            </div>
            {repo.description && (
              <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-zinc-400">
                {repo.description}
              </p>
            )}
          </div>
          <a
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 rounded-lg border border-zinc-800 p-2 text-zinc-500 transition hover:border-zinc-600 hover:text-white"
            aria-label={`${repo.name} on GitHub`}
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-zinc-500">
          {repo.language && (
            <span className="flex items-center gap-1.5">
              <span
                className="inline-block h-3 w-3 rounded-full"
                style={{ backgroundColor: langColor }}
              />
              {repo.language}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5" />
            {repo.stargazers_count}
          </span>
          <span className="flex items-center gap-1">
            <GitFork className="h-3.5 w-3.5" />
            {repo.forks_count}
          </span>
          <span>
            Updated {new Date(repo.updated_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>

        {repo.topics.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {repo.topics.slice(0, 6).map((topic) => (
              <span
                key={topic}
                className="rounded-md border border-[#27cbcb]/20 bg-[#27cbcb]/5 px-2 py-0.5 text-[10px] font-medium text-[#27cbcb]"
              >
                {topic}
              </span>
            ))}
            {repo.topics.length > 6 && (
              <span className="text-[10px] text-zinc-500">+{repo.topics.length - 6} more</span>
            )}
          </div>
        )}

        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-lg border border-zinc-800 py-2 text-xs font-medium text-zinc-400 transition hover:border-zinc-700 hover:text-white"
        >
          <ChevronDown
            className={`h-4 w-4 transition-transform ${expanded ? "rotate-180" : ""}`}
          />
          {expanded ? "Show Less" : "Show More"}
        </button>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="border-t border-zinc-800 px-5 pb-5 pt-4 space-y-5">
              {repo.readme && (
                <div>
                  <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    README Preview
                  </h4>
                  <div className="max-h-60 overflow-y-auto rounded-lg border border-zinc-800 bg-zinc-900/50 p-3">
                    <pre className="whitespace-pre-wrap text-xs leading-relaxed text-zinc-400 font-mono">
                      {repo.readme.length > 3000
                        ? repo.readme.slice(0, 3000) + "\n... (truncated)"
                        : repo.readme}
                    </pre>
                  </div>
                </div>
              )}

              {Object.keys(repo.languages).length > 0 && (
                <div>
                  <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    Languages
                  </h4>
                  <div className="space-y-1.5">
                    {Object.entries(repo.languages)
                      .sort(([, a], [, b]) => b - a)
                      .map(([lang, bytes]) => {
                        const total = Object.values(repo.languages).reduce((s, v) => s + v, 0)
                        const pct = ((bytes / total) * 100).toFixed(1)
                        const color = languageColors[lang] || "#8b8b8b"
                        return (
                          <div key={lang} className="flex items-center gap-2 text-xs">
                            <span className="inline-block h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
                            <span className="w-24 text-zinc-300">{lang}</span>
                            <div className="flex-1 h-2 rounded-full bg-zinc-800 overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all"
                                style={{ width: `${pct}%`, backgroundColor: color }}
                              />
                            </div>
                            <span className="w-14 text-right text-zinc-500">{pct}%</span>
                          </div>
                        )
                      })}
                  </div>
                </div>
              )}

              <div>
                <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  AI Metadata
                </h4>
                <div className="grid grid-cols-1 gap-x-6 gap-y-1.5 sm:grid-cols-2">
                  <MetaItem label="Purpose" value={metadata.projectPurpose} />
                  <MetaItem label="Type" value={metadata.repositoryType} />
                  <MetaItem label="Primary Language" value={metadata.primaryLanguage} />
                  <MetaItem label="Complexity" value={metadata.complexity} />
                  {metadata.framework.length > 0 && (
                    <MetaItem label="Frameworks" value={metadata.framework.join(", ")} />
                  )}
                  {metadata.database.length > 0 && (
                    <MetaItem label="Databases" value={metadata.database.join(", ")} />
                  )}
                  {metadata.deployment.length > 0 && (
                    <MetaItem label="Deployment" value={metadata.deployment.join(", ")} />
                  )}
                  {metadata.technologies.length > 0 && (
                    <MetaItem label="Technologies" value={metadata.technologies.join(", ")} />
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-600">
        {label}
      </span>
      <p className="mt-0.5 text-sm text-zinc-300">{value}</p>
    </div>
  )
}
