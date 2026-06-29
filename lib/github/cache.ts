import { readFile, writeFile, mkdir } from "node:fs/promises"
import { join } from "node:path"
import type { GitHubContextData } from "./types"

const CACHE_DIR = join(process.cwd(), "data", "github-cache")
const CACHE_FILE = join(CACHE_DIR, "context.json")

export async function getCachedData(): Promise<GitHubContextData | null> {
  try {
    const raw = await readFile(CACHE_FILE, "utf8")
    return JSON.parse(raw) as GitHubContextData
  } catch {
    return null
  }
}

export async function setCachedData(data: GitHubContextData): Promise<void> {
  await mkdir(CACHE_DIR, { recursive: true })
  await writeFile(CACHE_FILE, JSON.stringify(data, null, 2), "utf8")
}

export async function clearCache(): Promise<void> {
  try {
    await writeFile(CACHE_FILE, JSON.stringify({ repos: [], stats: { total: 0, public: 0, private: 0, stars: 0, forks: 0, languages: {} }, lastSync: null }), "utf8")
  } catch {
  }
}
