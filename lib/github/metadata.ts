import type { GitHubRepo, AiMetadata } from "./types"
import { detectFrameworks, detectDatabase, detectDeployment, detectBuildTool } from "./framework"

function inferPurpose(repo: GitHubRepo): string {
  const desc = (repo.description || "").toLowerCase()
  const readme = (repo.readme || "").toLowerCase()
  const combined = `${desc} ${readme} ${repo.topics.join(" ")}`

  if (/portfolio|personal website|blog/i.test(combined)) return "Personal portfolio or blog"
  if (/api|backend|server|rest|graphql/i.test(combined)) return "API or backend service"
  if (/cli|command line|terminal/i.test(combined)) return "CLI tool"
  if (/machine learning|ml|ai|deep learning|neural|tensorflow|pytorch/i.test(combined))
    return "Machine learning or AI project"
  if (/dashboard|analytics|visualization|chart/i.test(combined)) return "Dashboard or data visualization"
  if (/ecommerce|shop|store|payment/i.test(combined)) return "E-commerce platform"
  if (/game|gaming|unity|godot/i.test(combined)) return "Game or gaming utility"
  if (/mobile|react native|flutter/i.test(combined)) return "Mobile application"
  if (/auth|authentication|oauth|jwt|login/i.test(combined)) return "Authentication system"
  if (/template|starter|boilerplate/i.test(combined)) return "Project template or starter"
  if (/test|testing|jest|cypress/i.test(combined)) return "Testing or quality assurance"
  if (/devops|ci\/cd|deploy|infrastructure|terraform/i.test(combined))
    return "DevOps or infrastructure tool"
  if (/library|package|sdk|sdk/i.test(combined)) return "Library or SDK"
  if (/doc|documentation|wiki/i.test(combined)) return "Documentation project"
  if (/tutorial|learn|example|demo/i.test(combined)) return "Learning resource or demo"

  return "Full-stack web application"
}

function inferType(repo: GitHubRepo): string {
  const text = [repo.description || "", repo.readme || "", ...repo.topics].join(" ").toLowerCase()

  if (/mobile|react native|flutter/i.test(text)) return "Mobile"
  if (/cli|command line/i.test(text)) return "CLI"
  if (/desktop|electron/i.test(text)) return "Desktop"
  if (/machine learning|ai|ml/i.test(text)) return "Machine Learning"
  if (/library|package/i.test(text)) return "Library"
  if (/api|backend/i.test(text)) return "API"
  if (/plugin|extension/i.test(text)) return "Plugin"
  if (/template|starter/i.test(text)) return "Template"
  if (/game/i.test(text)) return "Game"

  return "Web Application"
}

function inferComponents(repo: GitHubRepo): string[] {
  const components: string[] = []
  const readme = (repo.readme || "").toLowerCase()

  if (/authentication|auth|login|sign.?up/i.test(readme)) components.push("Authentication")
  if (/database|orm|prisma|mongo/i.test(readme)) components.push("Database Layer")
  if (/api|rest|endpoint|route/i.test(readme)) components.push("API Layer")
  if (/ui|component|page|view|layout/i.test(readme)) components.push("UI Components")
  if (/test|testing/i.test(readme)) components.push("Test Suite")
  if (/docker|deploy|ci/i.test(readme)) components.push("Deployment Configuration")
  if (/middleware|guard|interceptor/i.test(readme)) components.push("Middleware")
  if (/cache|redis|memcached/i.test(readme)) components.push("Caching Layer")
  if (/queue|rabbitmq|kafka|bull/i.test(readme)) components.push("Message Queue")
  if (/websocket|socket/i.test(readme)) components.push("WebSocket Handler")
  if (/email|resend|nodemailer/i.test(readme)) components.push("Email Service")
  if (/file|upload|storage|s3/i.test(readme)) components.push("File Storage")

  if (components.length === 0) components.push("Core Application Logic")

  return components
}

function inferAuth(repo: GitHubRepo): string[] {
  const text = [repo.description || "", repo.readme || "", ...repo.topics].join(" ").toLowerCase()
  const auth: string[] = []

  if (/jwt/i.test(text)) auth.push("JWT")
  if (/oauth/i.test(text)) auth.push("OAuth")
  if (/nextauth|next-auth/i.test(text)) auth.push("NextAuth.js")
  if (/clerk/i.test(text)) auth.push("Clerk")
  if (/auth0/i.test(text)) auth.push("Auth0")
  if (/firebase.*auth/i.test(text)) auth.push("Firebase Auth")
  if (/session/i.test(text)) auth.push("Session-based")
  if (/magic.link|magic\s+link/i.test(text)) auth.push("Magic Link")

  return auth
}

function inferPackageManager(repo: GitHubRepo): string[] {
  const readme = (repo.readme || "").toLowerCase()
  const managers: string[] = []

  if (/pnpm/i.test(readme) || repo.topics.some((t) => /pnpm/i.test(t))) managers.push("pnpm")
  if (/yarn/i.test(readme)) managers.push("Yarn")
  if (/npm/i.test(readme)) managers.push("npm")

  return managers
}

function inferEntryPoint(repo: GitHubRepo): string {
  const readme = (repo.readme || "").toLowerCase()

  if (/src\/index/i.test(readme) || /src\/app/i.test(readme)) return "src/index.ts or src/app/"
  if (/app\/page/i.test(readme) || /next/i.test(readme)) return "app/page.tsx (Next.js App Router)"
  if (/server\.(ts|js)/i.test(readme)) return "server.ts or server.js"
  if (/index\.(ts|js)/i.test(readme)) return "index.ts or index.js"
  if (/main\.(py)/i.test(readme)) return "main.py"
  if (/cli\.(ts|js|py)/i.test(readme)) return "CLI entry point"

  return repo.language === "TypeScript" || repo.language === "JavaScript"
    ? "src/index.ts"
    : repo.language === "Python"
      ? "main.py"
      : "index.js"
}

function inferComplexity(repo: GitHubRepo): "low" | "medium" | "high" {
  const readmeLen = (repo.readme || "").length
  const descLen = (repo.description || "").length
  const langCount = Object.keys(repo.languages).length
  const hasTopics = repo.topics.length > 0

  let score = 0
  if (readmeLen > 1000) score += 2
  else if (readmeLen > 300) score += 1
  if (descLen > 100) score += 1
  if (langCount >= 3) score += 2
  else if (langCount >= 2) score += 1
  if (hasTopics) score += 1
  if (repo.stargazers_count > 10) score += 1
  if (repo.forks_count > 5) score += 1

  if (score >= 5) return "high"
  if (score >= 3) return "medium"
  return "low"
}

function inferFolderStructure(repo: GitHubRepo): string {
  const readme = (repo.readme || "").toLowerCase()
  const patterns = [
    [/src\//i, "src/ based structure"],
    [/app\//i, "app/ based structure (Next.js)"],
    [/components\//i, "components/ directory for UI"],
    [/lib\//i, "lib/ for shared utilities"],
    [/utils?\//i, "utils/ for helper functions"],
    [/pages\//i, "pages/ based routing"],
    [/public\//i, "public/ for static assets"],
    [/api\//i, "api/ for backend routes"],
    [/hooks\//i, "hooks/ for custom React hooks"],
    [/styles?\//i, "styles/ for CSS files"],
    [/tests?\//i, "tests/ for test files"],
    [/docker/i, "Docker configuration"],
    [/\.github/i, "GitHub Actions workflows"],
  ]

  const found: string[] = []
  for (const [pattern, label] of patterns) {
    if (pattern.test(readme)) {
      found.push(label)
    }
  }

  return found.length > 0 ? found.join(", ") : "Standard project structure"
}

export function generateMetadata(repo: GitHubRepo): AiMetadata {
  const frameworks = detectFrameworks(repo)
  const databases = detectDatabase(repo)
  const deployments = detectDeployment(repo)
  const buildTools = detectBuildTool(repo)

  const hasFrontend = frameworks.some((f) =>
    ["React", "Next.js", "Vue", "Angular", "Tailwind CSS", "Vite"].includes(f),
  )
  const hasBackend = frameworks.some((f) =>
    ["Express", "NestJS", "FastAPI", "Flask", "Django", "Spring Boot", "Laravel"].includes(f),
  )
  const isML = frameworks.some((f) => ["Python", "Streamlit"].includes(f)) || 
    /machine learning|ai|ml|tensorflow|pytorch/i.test(repo.description || "")

  return {
    projectPurpose: inferPurpose(repo),
    repositoryType: inferType(repo),
    frontend: hasFrontend ? frameworks.filter((f) =>
      ["React", "Next.js", "Vue", "Angular", "Tailwind CSS", "Vite", "TypeScript", "JavaScript"].includes(f),
    ) : [],
    backend: hasBackend ? frameworks.filter((f) =>
      ["Express", "NestJS", "FastAPI", "Flask", "Django", "Spring Boot", "Laravel", "TypeScript", "Python", "Go"].includes(f),
    ) : [],
    fullStack: hasFrontend && hasBackend,
    api: frameworks.some((f) => ["Express", "NestJS", "FastAPI"].includes(f)),
    cli: /cli|command line/i.test(repo.description || ""),
    machineLearning: isML,
    utility: /utility|helper|tool/i.test(repo.description || ""),
    library: /library|package/i.test(repo.description || ""),
    mobile: /mobile|react native|flutter/i.test(repo.description || ""),
    desktop: /desktop|electron/i.test(repo.description || ""),
    framework: frameworks,
    primaryLanguage: repo.language || "Unknown",
    database: databases,
    authentication: inferAuth(repo),
    deployment: deployments,
    technologies: [...new Set([...(repo.language ? [repo.language] : []), ...frameworks, ...databases, ...deployments])],
    buildTool: buildTools,
    packageManager: inferPackageManager(repo),
    entryPoint: inferEntryPoint(repo),
    architecture: hasFrontend && hasBackend ? "Full-stack architecture with separate frontend and backend layers" : "Single-layer application",
    mainComponents: inferComponents(repo),
    folderStructureSummary: inferFolderStructure(repo),
    complexity: inferComplexity(repo),
    topics: repo.topics,
  }
}
