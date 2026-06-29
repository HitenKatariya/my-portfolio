export type GitHubRepo = {
  id: number
  name: string
  full_name: string
  description: string | null
  html_url: string
  homepage: string | null
  visibility: "public" | "private"
  fork: boolean
  archived: boolean
  topics: string[]
  language: string | null
  languages: Record<string, number>
  stargazers_count: number
  forks_count: number
  license: { spdx_id: string } | null
  default_branch: string
  updated_at: string
  pushed_at: string
  created_at: string
  owner: { login: string; avatar_url: string }
  readme: string | null
}

export type AiMetadata = {
  /** 2-3 sentence human-readable summary of what the project does */
  summary: string
  /** Key feature bullets extracted from the README (up to 6 items) */
  keyFeatures: string[]
  projectPurpose: string
  repositoryType: string
  frontend: string[]
  backend: string[]
  fullStack: boolean
  api: boolean
  cli: boolean
  machineLearning: boolean
  utility: boolean
  library: boolean
  mobile: boolean
  desktop: boolean
  framework: string[]
  primaryLanguage: string
  database: string[]
  authentication: string[]
  deployment: string[]
  technologies: string[]
  buildTool: string[]
  packageManager: string[]
  entryPoint: string
  architecture: string
  mainComponents: string[]
  folderStructureSummary: string
  complexity: "low" | "medium" | "high"
  topics: string[]
}

export type RepoContext = {
  repo: GitHubRepo
  metadata: AiMetadata
}

export type GitHubContextData = {
  repos: RepoContext[]
  stats: {
    total: number
    public: number
    private: number
    stars: number
    forks: number
    languages: Record<string, number>
  }
  lastSync: string | null
}
