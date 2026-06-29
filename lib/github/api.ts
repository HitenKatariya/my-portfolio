import type { GitHubRepo, RepoContext, GitHubContextData } from "./types"
import { generateMetadata } from "./metadata"
import { getCachedData, setCachedData } from "./cache"

const GITHUB_API = "https://api.github.com"

function getAuthHeaders(): Record<string, string> {
  const token = process.env.GITHUB_TOKEN
  if (!token) {
    throw new Error("GITHUB_TOKEN environment variable is not set")
  }
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "portfolio-github-dashboard",
  }
}

async function fetchAllPages<T>(url: string): Promise<T[]> {
  const results: T[] = []
  let page = 1
  let hasMore = true

  while (hasMore) {
    const response = await fetch(`${url}&page=${page}`, {
      headers: getAuthHeaders(),
    })

    if (!response.ok) {
      if (response.status === 403) {
        const resetTime = response.headers.get("X-RateLimit-Reset")
        throw new Error(`GitHub API rate limit exceeded. Resets at ${resetTime}`)
      }
      if (response.status === 401) {
        throw new Error("Invalid GitHub token. Please check your GITHUB_TOKEN.")
      }
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`)
    }

    const data = (await response.json()) as T[]
    results.push(...data)

    const linkHeader = response.headers.get("Link")
    hasMore = linkHeader?.includes('rel="next"') ?? false
    page++
  }

  return results
}

async function fetchWithRetry(url: string, retries = 2): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    const response = await fetch(url, { headers: getAuthHeaders() })
    if (response.ok || response.status === 404) return response
    if (response.status === 403 || response.status === 401) return response
    if (i < retries - 1) await new Promise((r) => setTimeout(r, 1000 * (i + 1)))
  }
  return fetch(url, { headers: getAuthHeaders() })
}

export async function validateToken(): Promise<{ login: string }> {
  const response = await fetch(`${GITHUB_API}/user`, { headers: getAuthHeaders() })
  if (!response.ok) {
    throw new Error(response.status === 401 ? "Invalid GitHub token" : "GitHub API error")
  }
  return response.json() as Promise<{ login: string }>
}

export async function fetchRepositories(): Promise<GitHubRepo[]> {
  const username = process.env.GITHUB_USERNAME
  if (!username) {
    throw new Error("GITHUB_USERNAME environment variable is not set")
  }

  const repos = await fetchAllPages<any>(`${GITHUB_API}/user/repos?visibility=all&sort=updated&per_page=100`)

  const enriched: GitHubRepo[] = []

  for (const repo of repos) {
    if (repo.fork) continue

    let readme: string | null = null
    try {
      // First attempt: request raw text directly
      const readmeResponse = await fetch(
        `${GITHUB_API}/repos/${repo.full_name}/readme`,
        {
          headers: {
            ...getAuthHeaders(),
            Accept: "application/vnd.github.raw",
          },
        },
      )
      if (readmeResponse.ok) {
        const contentType = readmeResponse.headers.get("content-type") || ""
        if (contentType.includes("application/json")) {
          // Fallback: API returned JSON with Base64 content — decode it
          const jsonBody = (await readmeResponse.json()) as { content?: string; encoding?: string }
          if (jsonBody.content && jsonBody.encoding === "base64") {
            const decoded = Buffer.from(
              jsonBody.content.replace(/\n/g, ""),
              "base64",
            ).toString("utf8")
            readme = decoded.length > 12000 ? decoded.slice(0, 12000) : decoded
          }
        } else {
          const rawText = await readmeResponse.text()
          // Guard: if the raw text looks like JSON (starts with '{'), decode it
          const trimmed = rawText.trimStart()
          if (trimmed.startsWith("{")) {
            try {
              const jsonBody = JSON.parse(rawText) as { content?: string; encoding?: string }
              if (jsonBody.content && jsonBody.encoding === "base64") {
                const decoded = Buffer.from(
                  jsonBody.content.replace(/\n/g, ""),
                  "base64",
                ).toString("utf8")
                readme = decoded.length > 12000 ? decoded.slice(0, 12000) : decoded
              } else {
                readme = null
              }
            } catch {
              readme = rawText.length > 12000 ? rawText.slice(0, 12000) : rawText
            }
          } else {
            readme = rawText.length > 12000 ? rawText.slice(0, 12000) : rawText
          }
        }
      }
    } catch {
      readme = null
    }

    let languages: Record<string, number> = {}
    try {
      const langResponse = await fetchWithRetry(
        `${GITHUB_API}/repos/${repo.full_name}/languages`,
      )
      if (langResponse.ok) {
        languages = (await langResponse.json()) as Record<string, number>
      }
    } catch {
      languages = {}
    }

    let topics: string[] = []
    try {
      const topicResponse = await fetch(
        `${GITHUB_API}/repos/${repo.full_name}/topics`,
        {
          headers: {
            ...getAuthHeaders(),
            Accept: "application/vnd.github.mercy-preview+json",
          },
        },
      )
      if (topicResponse.ok) {
        const topicData = (await topicResponse.json()) as { names: string[] }
        topics = topicData.names || []
      }
    } catch {
      topics = []
    }

    enriched.push({
      id: repo.id,
      name: repo.name,
      full_name: repo.full_name,
      description: repo.description,
      html_url: repo.html_url,
      homepage: repo.homepage,
      visibility: repo.visibility,
      fork: repo.fork,
      archived: repo.archived,
      topics,
      language: repo.language,
      languages,
      stargazers_count: repo.stargazers_count,
      forks_count: repo.forks_count,
      license: repo.license ? { spdx_id: repo.license.spdx_id } : null,
      default_branch: repo.default_branch,
      updated_at: repo.updated_at,
      pushed_at: repo.pushed_at,
      created_at: repo.created_at,
      owner: { login: repo.owner.login, avatar_url: repo.owner.avatar_url },
      readme,
    })
  }

  return enriched
}

export async function buildContextData(repos: GitHubRepo[]): Promise<GitHubContextData> {
  const repoContexts: RepoContext[] = repos.map((repo) => ({
    repo,
    metadata: generateMetadata(repo),
  }))

  const langCount: Record<string, number> = {}
  for (const repo of repos) {
    for (const [lang, bytes] of Object.entries(repo.languages)) {
      langCount[lang] = (langCount[lang] || 0) + bytes
    }
  }

  const stats = {
    total: repos.length,
    public: repos.filter((r) => r.visibility === "public").length,
    private: repos.filter((r) => r.visibility === "private").length,
    stars: repos.reduce((sum, r) => sum + r.stargazers_count, 0),
    forks: repos.reduce((sum, r) => sum + r.forks_count, 0),
    languages: langCount,
  }

  const data: GitHubContextData = {
    repos: repoContexts,
    stats,
    lastSync: new Date().toISOString(),
  }

  await setCachedData(data)
  return data
}

export async function getGitHubData(forceSync = false): Promise<GitHubContextData> {
  if (!forceSync) {
    const cached = await getCachedData()
    if (cached && cached.repos.length > 0) {
      return cached
    }
  }

  const repos = await fetchRepositories()
  return buildContextData(repos)
}
