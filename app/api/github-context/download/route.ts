import { NextRequest, NextResponse } from "next/server"
import { getCachedData } from "@/lib/github/cache"
import type { GitHubContextData } from "@/lib/github/types"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  const format = request.nextUrl.searchParams.get("format") || "json"
  const data = await getCachedData()

  if (!data) {
    return NextResponse.json({ error: "No cached data. Sync GitHub first." }, { status: 404 })
  }

  switch (format) {
    case "json":
      return serveJson(data)
    case "markdown":
    case "md":
      return serveMarkdown(data)
    case "pdf":
      return NextResponse.json({ error: "PDF generation is handled on the client side." }, { status: 400 })
    default:
      return NextResponse.json({ error: "Invalid format. Use json, md, or pdf." }, { status: 400 })
  }
}

function serveJson(data: GitHubContextData) {
  const json = generateJsonExport(data)
  return new NextResponse(json, {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": 'attachment; filename="AI_Context.json"',
    },
  })
}

function serveMarkdown(data: GitHubContextData) {
  const md = generateMarkdownExport(data)
  return new NextResponse(md, {
    headers: {
      "Content-Type": "text/markdown",
      "Content-Disposition": 'attachment; filename="AI_Context.md"',
    },
  })
}

function generateJsonExport(data: GitHubContextData): string {
  const exportData = {
    generatedAt: data.lastSync,
    totalRepositories: data.stats.total,
    stats: data.stats,
    repositories: data.repos.map(({ repo, metadata }) => ({
      name: repo.name,
      description: repo.description,
      url: repo.html_url,
      visibility: repo.visibility,
      language: repo.language,
      languages: repo.languages,
      topics: repo.topics,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      license: repo.license?.spdx_id || null,
      defaultBranch: repo.default_branch,
      updatedAt: repo.updated_at,
      metadata,
    })),
  }
  return JSON.stringify(exportData, null, 2)
}

function generateMarkdownExport(data: GitHubContextData): string {
  const lines: string[] = []
  const date = data.lastSync ? new Date(data.lastSync).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }) : "N/A"

  lines.push("# AI Context — Hiten Katariya")
  lines.push("")
  lines.push(`> Generated on ${date}`)
  lines.push("")
  lines.push("## Overview")
  lines.push("")
  lines.push(`- **Total Repositories:** ${data.stats.total}`)
  lines.push(`- **Public:** ${data.stats.public}`)
  lines.push(`- **Private:** ${data.stats.private}`)
  lines.push(`- **Total Stars:** ${data.stats.stars}`)
  lines.push(`- **Total Forks:** ${data.stats.forks}`)
  lines.push("")
  lines.push("## Languages")
  lines.push("")
  lines.push("| Language | Bytes |")
  lines.push("|----------|-------|")
  const sortedLangs = Object.entries(data.stats.languages)
    .sort(([, a], [, b]) => b - a)
  for (const [lang, bytes] of sortedLangs) {
    lines.push(`| ${lang} | ${bytes.toLocaleString()} |`)
  }
  lines.push("")
  lines.push("---")
  lines.push("")

  for (const { repo, metadata } of data.repos) {
    lines.push(`## ${repo.name}`)
    lines.push("")
    if (repo.description) lines.push(`${repo.description}`)
    lines.push("")
    lines.push(`- **URL:** ${repo.html_url}`)
    lines.push(`- **Visibility:** ${repo.visibility}`)
    lines.push(`- **Language:** ${repo.language || "N/A"}`)
    lines.push(`- **Stars:** ${repo.stargazers_count}`)
    lines.push(`- **Forks:** ${repo.forks_count}`)
    lines.push(`- **License:** ${repo.license?.spdx_id || "N/A"}`)
    lines.push(`- **Last Updated:** ${new Date(repo.updated_at).toLocaleDateString()}`)
    lines.push("")
    lines.push("### AI Metadata")
    lines.push("")
    lines.push(`- **Purpose:** ${metadata.projectPurpose}`)
    lines.push(`- **Type:** ${metadata.repositoryType}`)
    lines.push(`- **Primary Language:** ${metadata.primaryLanguage}`)
    lines.push(`- **Complexity:** ${metadata.complexity}`)
    if (metadata.framework.length > 0) lines.push(`- **Frameworks:** ${metadata.framework.join(", ")}`)
    if (metadata.database.length > 0) lines.push(`- **Databases:** ${metadata.database.join(", ")}`)
    if (metadata.deployment.length > 0) lines.push(`- **Deployment:** ${metadata.deployment.join(", ")}`)
    if (metadata.technologies.length > 0) lines.push(`- **Technologies:** ${metadata.technologies.join(", ")}`)
    lines.push("")
    lines.push("### Topics")
    lines.push("")
    if (repo.topics.length > 0) {
      lines.push(repo.topics.map((t) => `- ${t}`).join("\n"))
    } else {
      lines.push("_No topics_")
    }
    lines.push("")
    if (repo.readme) {
      lines.push("### README Preview")
      lines.push("")
      lines.push("```")
      lines.push(repo.readme.length > 2000 ? repo.readme.slice(0, 2000) + "\n... (truncated)" : repo.readme)
      lines.push("```")
      lines.push("")
    }
    lines.push("---")
    lines.push("")
  }

  return lines.join("\n")
}
