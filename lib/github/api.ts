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

/**
 * Fetches the README for a repository using the JSON Contents API.
 * The v3+json endpoint reliably returns { content, encoding } — we decode
 * the Base64 `content` field. This avoids all the content-type ambiguity of
 * the `application/vnd.github.raw` Accept header.
 */
async function fetchReadme(fullName: string): Promise<string | null> {
  try {
    const response = await fetch(`${GITHUB_API}/repos/${fullName}/readme`, {
      headers: {
        ...getAuthHeaders(),
        Accept: "application/vnd.github.v3+json",
      },
    })

    if (!response.ok) return null

    const json = (await response.json()) as {
      content?: string
      encoding?: string
      download_url?: string
    }

    // Primary path: decode Base64 content
    if (json.content && json.encoding === "base64") {
      const decoded = Buffer.from(json.content.replace(/\n/g, ""), "base64").toString("utf8")
      // Cap at 15,000 chars to keep cache and PDF manageable
      return decoded.length > 15000 ? decoded.slice(0, 15000) : decoded
    }

    // Fallback: fetch the raw download URL
    if (json.download_url) {
      const rawResponse = await fetch(json.download_url, {
        headers: getAuthHeaders(),
      })
      if (rawResponse.ok) {
        const text = await rawResponse.text()
        return text.length > 15000 ? text.slice(0, 15000) : text
      }
    }

    return null
  } catch {
    return null
  }
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

    // Fetch readme, languages, and topics in parallel
    const [readme, languagesResult, topicsResult] = await Promise.allSettled([
      fetchReadme(repo.full_name),
      fetchWithRetry(`${GITHUB_API}/repos/${repo.full_name}/languages`),
      fetch(`${GITHUB_API}/repos/${repo.full_name}/topics`, {
        headers: {
          ...getAuthHeaders(),
          Accept: "application/vnd.github.mercy-preview+json",
        },
      }),
    ])

    const readmeText = readme.status === "fulfilled" ? readme.value : null

    let languages: Record<string, number> = {}
    if (languagesResult.status === "fulfilled" && languagesResult.value.ok) {
      try {
        languages = (await languagesResult.value.json()) as Record<string, number>
      } catch {}
    }

    let topics: string[] = []
    if (topicsResult.status === "fulfilled" && topicsResult.value.ok) {
      try {
        const topicData = (await topicsResult.value.json()) as { names: string[] }
        topics = topicData.names || []
      } catch {}
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
      readme: readmeText,
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
