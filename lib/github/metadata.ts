import type { GitHubRepo, AiMetadata } from "./types"
import { detectFrameworks, detectDatabase, detectDeployment, detectBuildTool } from "./framework"

// ─────────────────────────────────────────────────────────────────────────────
// Text helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Strip Markdown syntax and HTML tags, returning plain text */
function stripMarkdown(text: string): string {
  return text
    .replace(/<[^>]+>/g, " ")           // HTML tags
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "") // images
    .replace(/\[[^\]]*\]\([^)]*\)/g, (m) => {
      const label = m.match(/\[([^\]]*)\]/)
      return label ? label[1] : ""
    })                                   // links → label only
    .replace(/```[\s\S]*?```/g, "")      // fenced code blocks
    .replace(/`[^`]+`/g, "")            // inline code
    .replace(/#{1,6}\s/g, "")           // headings
    .replace(/[*_~]{1,3}/g, "")         // bold/italic/strikethrough
    .replace(/^\s*[-*+]\s+/gm, "")      // list bullets
    .replace(/^\s*\d+\.\s+/gm, "")      // ordered list numbers
    .replace(/\|/g, " ")                // table cells
    .replace(/\s{2,}/g, " ")            // collapse whitespace
    .trim()
}

/** Extract the first meaningful paragraph from README (skips badges, images, headings) */
function extractFirstParagraph(readme: string): string {
  if (!readme) return ""
  const lines = readme.split("\n")
  const paragraphLines: string[] = []

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) {
      if (paragraphLines.length > 0) break // end of first paragraph
      continue
    }
    // Skip headings, badges (shields.io), HTML tags, image lines, dividers
    if (
      /^#{1,6}\s/.test(trimmed) ||
      /shields\.io|badge/i.test(trimmed) ||
      /^</.test(trimmed) ||
      /!\[.*\]\(/.test(trimmed) ||
      /^[-=]{3,}$/.test(trimmed) ||
      /^\[!\[/.test(trimmed) ||  // badge links
      trimmed.length < 15
    ) continue

    const cleaned = stripMarkdown(trimmed)
    if (cleaned.length > 20) {
      paragraphLines.push(cleaned)
      if (paragraphLines.join(" ").length > 300) break
    }
  }

  return paragraphLines.join(" ").slice(0, 400)
}

/** Extract bullet-point features from README (looks for Features/What's included sections) */
function extractKeyFeatures(readme: string): string[] {
  if (!readme) return []

  const features: string[] = []
  const lines = readme.split("\n")
  let inFeatureSection = false
  let bulletCount = 0

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const trimmed = line.trim()

    // Detect feature section headings
    if (/^#{1,3}\s*(features?|what.?s\s+(included|inside)|highlights?|capabilities|overview|key\s+features?)/i.test(trimmed)) {
      inFeatureSection = true
      bulletCount = 0
      continue
    }

    // Exit section at next heading
    if (inFeatureSection && /^#{1,3}\s/.test(trimmed) && bulletCount > 0) {
      break
    }

    if (inFeatureSection) {
      // Match bullet items (- item, * item, • item)
      const bulletMatch = trimmed.match(/^[-*•]\s+\*{0,2}([^*\n]+)\*{0,2}/)
      if (bulletMatch) {
        const featureText = stripMarkdown(bulletMatch[1]).trim()
        if (featureText.length > 5 && featureText.length < 120) {
          // Remove trailing — description after the em-dash or colon
          const shortText = featureText.split(/\s+[—–-]\s+/)[0].replace(/:\s*$/, "").trim()
          features.push(shortText)
          bulletCount++
          if (features.length >= 6) break
        }
      }
    }
  }

  // Fallback: extract first 4 non-feature-section bullets if no feature section found
  if (features.length === 0) {
    for (const line of lines) {
      const trimmed = line.trim()
      const bulletMatch = trimmed.match(/^[-*•]\s+\*{0,2}([^*\n]{10,100})\*{0,2}/)
      if (bulletMatch) {
        const text = stripMarkdown(bulletMatch[1]).trim()
        if (text.length > 8) {
          features.push(text.split(/\s+[—–-]\s+/)[0].trim())
          if (features.length >= 4) break
        }
      }
    }
  }

  return features.slice(0, 6)
}

/** Generate a 2-3 sentence AI summary from repo metadata + README */
function generateSummary(repo: GitHubRepo, frameworks: string[], databases: string[], deployments: string[]): string {
  const name = repo.name.replace(/[-_]/g, " ")
  const desc = repo.description ? repo.description.trim() : ""
  const readmePara = extractFirstParagraph(repo.readme || "")
  const lang = repo.language || "code"

  // Sentence 1: What the project is (prefer description, then README first para)
  let sentence1 = ""
  if (desc && desc.length > 20) {
    sentence1 = desc.endsWith(".") ? desc : desc + "."
  } else if (readmePara && readmePara.length > 20) {
    sentence1 = readmePara.endsWith(".") ? readmePara : readmePara + "."
  } else {
    sentence1 = `${name} is a ${lang} project.`
  }

  // Sentence 2: Tech stack
  const parts: string[] = []
  if (frameworks.length > 0) {
    // Exclude language names from framework list for readability
    const techFrameworks = frameworks.filter(f => !["TypeScript", "JavaScript", "Python", "Java", "Go", "Rust", "Ruby", "PHP", "C", "C++", "C#", "Dart"].includes(f))
    if (techFrameworks.length > 0) parts.push(`built with ${techFrameworks.slice(0, 3).join(", ")}`)
  }
  if (databases.length > 0) parts.push(`using ${databases.slice(0, 2).join(" and ")} for data storage`)
  if (deployments.length > 0) parts.push(`deployed on ${deployments.slice(0, 2).join(" and ")}`)

  let sentence2 = ""
  if (parts.length > 0) {
    sentence2 = `It is ${parts.join(", ")}.`
  }

  // Sentence 3: Complexity/scope
  const langCount = Object.keys(repo.languages).length
  const isFullStack = frameworks.some(f => ["React", "Next.js", "Vue", "Angular"].includes(f)) &&
    frameworks.some(f => ["Express", "NestJS", "FastAPI", "Flask", "Django"].includes(f))

  let sentence3 = ""
  if (isFullStack) {
    sentence3 = "The project follows a full-stack architecture with separate frontend and backend layers."
  } else if (langCount >= 3) {
    sentence3 = `The codebase spans ${langCount} languages, indicating a multi-technology project.`
  } else if (repo.topics.length > 3) {
    sentence3 = `Key topics include: ${repo.topics.slice(0, 4).join(", ")}.`
  }

  return [sentence1, sentence2, sentence3].filter(Boolean).join(" ").replace(/\s{2,}/g, " ").trim()
}

// ─────────────────────────────────────────────────────────────────────────────
// Individual inference functions
// ─────────────────────────────────────────────────────────────────────────────

function inferPurpose(repo: GitHubRepo): string {
  const desc = (repo.description || "").toLowerCase()
  const readme = stripMarkdown(repo.readme || "").toLowerCase()
  const combined = `${desc} ${readme} ${repo.topics.join(" ")}`

  if (/portfolio|personal website|blog/i.test(combined)) return "Personal portfolio or blog"
  if (/api|backend|server|rest|graphql/i.test(combined)) return "API or backend service"
  if (/cli|command line|terminal/i.test(combined)) return "CLI tool"
  if (/machine learning|ml|ai|deep learning|neural|tensorflow|pytorch/i.test(combined))
    return "Machine learning or AI project"
  if (/dashboard|analytics|visualization|chart/i.test(combined)) return "Dashboard or data visualization"
  if (/ecommerce|shop|store|payment|razorpay|stripe/i.test(combined)) return "E-commerce platform"
  if (/game|gaming|unity|godot/i.test(combined)) return "Game or gaming utility"
  if (/mobile|react native|flutter/i.test(combined)) return "Mobile application"
  if (/auth|authentication|oauth|jwt|login/i.test(combined)) return "Authentication system"
  if (/template|starter|boilerplate/i.test(combined)) return "Project template or starter"
  if (/test|testing|jest|cypress/i.test(combined)) return "Testing or quality assurance"
  if (/devops|ci\/cd|deploy|infrastructure|terraform/i.test(combined))
    return "DevOps or infrastructure tool"
  if (/library|package|sdk/i.test(combined)) return "Library or SDK"
  if (/doc|documentation|wiki/i.test(combined)) return "Documentation project"
  if (/tutorial|learn|example|demo/i.test(combined)) return "Learning resource or demo"
  if (/fintech|finance|stock|ticker|trading|investment/i.test(combined)) return "Fintech or finance application"
  if (/health|medical|hospital|patient/i.test(combined)) return "Healthcare application"
  if (/chat|messaging|social|community/i.test(combined)) return "Social or messaging platform"
  if (/erp|crm|management|enterprise/i.test(combined)) return "Enterprise management system"

  return "Full-stack web application"
}

function inferType(repo: GitHubRepo): string {
  const text = [repo.description || "", stripMarkdown(repo.readme || ""), ...repo.topics].join(" ").toLowerCase()

  if (/mobile|react native|flutter/i.test(text)) return "Mobile"
  if (/cli|command line/i.test(text)) return "CLI"
  if (/desktop|electron/i.test(text)) return "Desktop"
  if (/machine learning|ai|ml/i.test(text)) return "Machine Learning"
  if (/library|package/i.test(text)) return "Library"
  if (/api|backend/i.test(text)) return "API / Backend"
  if (/plugin|extension/i.test(text)) return "Plugin"
  if (/template|starter/i.test(text)) return "Template"
  if (/game/i.test(text)) return "Game"

  return "Web Application"
}

function inferComponents(repo: GitHubRepo): string[] {
  const components: string[] = []
  const readme = (repo.readme || "").toLowerCase()

  if (/authentication|auth|login|sign.?up/i.test(readme)) components.push("Authentication")
  if (/database|orm|prisma|mongo|postgres|mysql/i.test(readme)) components.push("Database Layer")
  if (/api|rest|endpoint|route/i.test(readme)) components.push("API Layer")
  if (/ui|component|page|view|layout/i.test(readme)) components.push("UI Components")
  if (/test|testing/i.test(readme)) components.push("Test Suite")
  if (/docker|deploy|ci\/cd/i.test(readme)) components.push("Deployment Configuration")
  if (/middleware|guard|interceptor/i.test(readme)) components.push("Middleware")
  if (/cache|redis|memcached/i.test(readme)) components.push("Caching Layer")
  if (/queue|rabbitmq|kafka|bull/i.test(readme)) components.push("Message Queue")
  if (/websocket|socket\.io/i.test(readme)) components.push("WebSocket Handler")
  if (/email|resend|nodemailer|smtp/i.test(readme)) components.push("Email Service")
  if (/upload|storage|s3|cloudinary/i.test(readme)) components.push("File Storage")

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
  if (/magic.?link/i.test(text)) auth.push("Magic Link")
  if (/bcrypt/i.test(text) && auth.length === 0) auth.push("Password hashing (bcrypt)")

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
  if (readmeLen > 3000) score += 3
  else if (readmeLen > 1000) score += 2
  else if (readmeLen > 300) score += 1
  if (descLen > 100) score += 1
  if (langCount >= 4) score += 2
  else if (langCount >= 2) score += 1
  if (hasTopics) score += 1
  if (repo.stargazers_count > 10) score += 1
  if (repo.forks_count > 5) score += 1

  if (score >= 6) return "high"
  if (score >= 3) return "medium"
  return "low"
}

function inferFolderStructure(repo: GitHubRepo): string {
  const readme = (repo.readme || "").toLowerCase()
  const patterns: [RegExp, string][] = [
    [/src\//i, "src/ based structure"],
    [/app\//i, "app/ based structure (Next.js)"],
    [/components\//i, "components/ directory for UI"],
    [/lib\//i, "lib/ for shared utilities"],
    [/utils?\//, "utils/ for helper functions"],
    [/pages\//i, "pages/ based routing"],
    [/public\//i, "public/ for static assets"],
    [/api\//i, "api/ for backend routes"],
    [/hooks\//i, "hooks/ for custom React hooks"],
    [/styles?\//, "styles/ for CSS files"],
    [/tests?\//, "tests/ for test files"],
    [/docker/i, "Docker configuration"],
    [/\.github/i, "GitHub Actions workflows"],
  ]

  const found: string[] = []
  for (const [pattern, label] of patterns) {
    if (pattern.test(readme)) found.push(label)
  }

  return found.length > 0 ? found.join(", ") : "Standard project structure"
}

// ─────────────────────────────────────────────────────────────────────────────
// Main export
// ─────────────────────────────────────────────────────────────────────────────

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
  const isML =
    frameworks.some((f) => ["Python", "Streamlit"].includes(f)) ||
    /machine learning|ai|ml|tensorflow|pytorch/i.test(repo.description || "")

  const summary = generateSummary(repo, frameworks, databases, deployments)
  const keyFeatures = extractKeyFeatures(repo.readme || "")

  return {
    summary,
    keyFeatures,
    projectPurpose: inferPurpose(repo),
    repositoryType: inferType(repo),
    frontend: hasFrontend
      ? frameworks.filter((f) =>
          ["React", "Next.js", "Vue", "Angular", "Tailwind CSS", "Vite", "TypeScript", "JavaScript"].includes(f),
        )
      : [],
    backend: hasBackend
      ? frameworks.filter((f) =>
          ["Express", "NestJS", "FastAPI", "Flask", "Django", "Spring Boot", "Laravel", "TypeScript", "Python", "Go"].includes(f),
        )
      : [],
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
    technologies: [
      ...new Set([
        ...(repo.language ? [repo.language] : []),
        ...frameworks,
        ...databases,
        ...deployments,
      ]),
    ],
    buildTool: buildTools,
    packageManager: inferPackageManager(repo),
    entryPoint: inferEntryPoint(repo),
    architecture:
      hasFrontend && hasBackend
        ? "Full-stack architecture with separate frontend and backend layers"
        : "Single-layer application",
    mainComponents: inferComponents(repo),
    folderStructureSummary: inferFolderStructure(repo),
    complexity: inferComplexity(repo),
    topics: repo.topics,
  }
}
