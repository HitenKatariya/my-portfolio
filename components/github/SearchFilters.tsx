"use client"

import { Search } from "lucide-react"

type SearchFiltersProps = {
  search: string
  onSearchChange: (value: string) => void
  languageFilter: string
  onLanguageFilterChange: (value: string) => void
  visibilityFilter: string
  onVisibilityFilterChange: (value: string) => void
  sortBy: string
  onSortChange: (value: string) => void
  languages: string[]
}

export default function SearchFilters({
  search,
  onSearchChange,
  languageFilter,
  onLanguageFilterChange,
  visibilityFilter,
  onVisibilityFilterChange,
  sortBy,
  onSortChange,
  languages,
}: SearchFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
        <input
          type="text"
          placeholder="Search repositories..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-lg border border-zinc-800 bg-zinc-950/60 py-2.5 pl-10 pr-4 text-sm text-white placeholder-zinc-500 backdrop-blur-sm transition focus:border-[#27cbcb]/50 focus:outline-none focus:ring-1 focus:ring-[#27cbcb]/30"
        />
      </div>

      <select
        value={languageFilter}
        onChange={(e) => onLanguageFilterChange(e.target.value)}
        className="rounded-lg border border-zinc-800 bg-zinc-950/60 px-3 py-2.5 text-sm text-zinc-300 backdrop-blur-sm transition focus:border-[#27cbcb]/50 focus:outline-none focus:ring-1 focus:ring-[#27cbcb]/30"
      >
        <option value="all">All Languages</option>
        {languages.map((lang) => (
          <option key={lang} value={lang}>{lang}</option>
        ))}
      </select>

      <select
        value={visibilityFilter}
        onChange={(e) => onVisibilityFilterChange(e.target.value)}
        className="rounded-lg border border-zinc-800 bg-zinc-950/60 px-3 py-2.5 text-sm text-zinc-300 backdrop-blur-sm transition focus:border-[#27cbcb]/50 focus:outline-none focus:ring-1 focus:ring-[#27cbcb]/30"
      >
        <option value="all">All Visibility</option>
        <option value="public">Public</option>
        <option value="private">Private</option>
      </select>

      <select
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value)}
        className="rounded-lg border border-zinc-800 bg-zinc-950/60 px-3 py-2.5 text-sm text-zinc-300 backdrop-blur-sm transition focus:border-[#27cbcb]/50 focus:outline-none focus:ring-1 focus:ring-[#27cbcb]/30"
      >
        <option value="updated">Sort by Updated</option>
        <option value="name">Sort by Name</option>
        <option value="stars">Sort by Stars</option>
        <option value="language">Sort by Language</option>
      </select>
    </div>
  )
}
