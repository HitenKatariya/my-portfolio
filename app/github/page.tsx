"use client"

import { useEffect, useState, useMemo, useCallback } from "react"
import type { GitHubContextData, RepoContext } from "@/lib/github/types"
import PageContainer from "@/components/PageContainer"
import GitHubStats from "@/components/github/GitHubStats"
import SearchFilters from "@/components/github/SearchFilters"
import RepoCard from "@/components/github/RepoCard"
import SyncButton from "@/components/github/SyncButton"
import DownloadButtons from "@/components/github/DownloadButtons"
import { AlertCircle, Github, Loader2, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function GitHubPage() {
  const [data, setData] = useState<GitHubContextData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [languageFilter, setLanguageFilter] = useState("all")
  const [visibilityFilter, setVisibilityFilter] = useState("all")
  const [sortBy, setSortBy] = useState("updated")

  const fetchData = useCallback(async (forceSync = false) => {
    setLoading(true)
    setError(null)
    try {
      const url = forceSync ? "/api/github-context" : "/api/github-context"
      const response = await fetch(url, { method: forceSync ? "POST" : "GET" })
      if (!response.ok) {
        const err = await response.json().catch(() => ({ error: "Failed to fetch" }))
        throw new Error(err.error || "Failed to fetch data")
      }
      const result = (await response.json()) as GitHubContextData
      if ("error" in result) {
        throw new Error((result as any).error)
      }
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData(false)
  }, [fetchData])

  const handleSync = useCallback(async () => {
    await fetchData(true)
  }, [fetchData])

  const languages = useMemo(() => {
    if (!data) return []
    const langSet = new Set<string>()
    for (const { repo } of data.repos) {
      if (repo.language) langSet.add(repo.language)
    }
    return Array.from(langSet).sort()
  }, [data])

  const filteredRepos = useMemo(() => {
    if (!data) return []
    let repos = [...data.repos]

    if (search) {
      const q = search.toLowerCase()
      repos = repos.filter(
        ({ repo }) =>
          repo.name.toLowerCase().includes(q) ||
          (repo.description || "").toLowerCase().includes(q) ||
          repo.topics.some((t) => t.toLowerCase().includes(q)),
      )
    }

    if (languageFilter !== "all") {
      repos = repos.filter(({ repo }) => repo.language === languageFilter)
    }

    if (visibilityFilter !== "all") {
      repos = repos.filter(({ repo }) => repo.visibility === visibilityFilter)
    }

    switch (sortBy) {
      case "name":
        repos.sort((a, b) => a.repo.name.localeCompare(b.repo.name))
        break
      case "stars":
        repos.sort((a, b) => b.repo.stargazers_count - a.repo.stargazers_count)
        break
      case "language":
        repos.sort((a, b) => (a.repo.language || "").localeCompare(b.repo.language || ""))
        break
      case "updated":
      default:
        repos.sort(
          (a, b) => new Date(b.repo.updated_at).getTime() - new Date(a.repo.updated_at).getTime(),
        )
        break
    }

    return repos
  }, [data, search, languageFilter, visibilityFilter, sortBy])

  if (loading && !data) {
    return (
      <main className="min-h-screen bg-[#0a0c10] text-white">
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#27cbcb]" />
            <p className="mt-4 text-sm text-zinc-500">Loading GitHub data...</p>
          </div>
        </div>
      </main>
    )
  }

  if (error && !data) {
    return (
      <main className="min-h-screen bg-[#0a0c10] text-white">
        <div className="flex min-h-screen items-center justify-center">
          <div className="max-w-md text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-red-400" />
            <h2 className="mt-4 text-xl font-bold text-white">Failed to Load</h2>
            <p className="mt-2 text-sm text-zinc-400">{error}</p>
            <p className="mt-1 text-xs text-zinc-600">
              Make sure GITHUB_TOKEN and GITHUB_USERNAME are set in your environment.
            </p>
            <button
              type="button"
              onClick={() => fetchData(true)}
              className="mt-6 inline-flex items-center gap-2 rounded-lg border border-[#27cbcb]/40 bg-[#27cbcb]/10 px-5 py-2.5 text-sm font-semibold text-[#27cbcb] transition hover:bg-[#27cbcb]/20"
            >
              <Github className="h-4 w-4" />
              Retry
            </button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#0a0c10] text-white">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06] bg-[#0a0c10]/90 backdrop-blur-md">
        <PageContainer>
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="font-mono text-[15px] text-slate-400 transition-colors hover:text-white sm:text-base">
              {`<hiten>`}
            </Link>
            <div className="flex items-center gap-6">
              <Link
                href="/"
                className="font-mono text-[15px] text-slate-400 transition-colors hover:text-white sm:text-base"
              >
                /home
              </Link>
              <span className="font-mono text-[15px] text-[#27cbcb] sm:text-base">
                /github
              </span>
            </div>
          </div>
        </PageContainer>
      </nav>
      <div className="relative overflow-hidden pt-16">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[10%] top-20 h-72 w-72 rounded-full bg-[#27cbcb]/10 blur-[120px]" />
          <div className="absolute right-[15%] bottom-40 h-64 w-64 rounded-full bg-[#26d868]/8 blur-[100px]" />
        </div>

        <PageContainer className="relative py-24">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <Github className="h-8 w-8 text-[#27cbcb]" />
                <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  GitHub AI Context
                </h1>
              </div>
              <p className="mt-2 text-zinc-400">
                Explore my repositories and generate AI-ready project context.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <SyncButton onSync={handleSync} />
              <DownloadButtons />
            </div>
          </div>

          {data && (
            <div className="mb-8">
              <p className="mb-4 text-xs text-zinc-600">
                {data.lastSync
                  ? `Last synced: ${new Date(data.lastSync).toLocaleString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}`
                  : "Not synced yet"}
              </p>
              <GitHubStats data={data} />
            </div>
          )}

          <div className="mb-8">
            <SearchFilters
              search={search}
              onSearchChange={setSearch}
              languageFilter={languageFilter}
              onLanguageFilterChange={setLanguageFilter}
              visibilityFilter={visibilityFilter}
              onVisibilityFilterChange={setVisibilityFilter}
              sortBy={sortBy}
              onSortChange={setSortBy}
              languages={languages}
            />
          </div>

          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-zinc-500">
              Showing {filteredRepos.length} of {data?.stats.total || 0} repositories
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {filteredRepos.map((repoContext: RepoContext) => (
              <RepoCard key={repoContext.repo.id} repoContext={repoContext} />
            ))}
          </div>

          {filteredRepos.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-zinc-500">No repositories match your filters.</p>
            </div>
          )}
        </PageContainer>
      </div>
    </main>
  )
}
