"use client"

import type { GitHubContextData } from "@/lib/github/types"

type GitHubStatsProps = {
  data: GitHubContextData
}

export default function GitHubStats({ data }: GitHubStatsProps) {
  const stats = [
    { label: "Total", value: data.stats.total },
    { label: "Public", value: data.stats.public },
    { label: "Private", value: data.stats.private },
    { label: "Stars", value: data.stats.stars },
    { label: "Forks", value: data.stats.forks },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4 text-center backdrop-blur-sm"
        >
          <div className="text-2xl font-bold text-white">{stat.value}</div>
          <div className="mt-1 text-xs font-medium uppercase tracking-wider text-zinc-500">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  )
}
