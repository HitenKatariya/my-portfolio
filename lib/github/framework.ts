import type { GitHubRepo } from "./types"

const frameworkPatterns: [RegExp, string][] = [
  [/next[\s.-]?js/i, "Next.js"],
  [/react(?:\s?native)?/i, "React"],
  [/vite/i, "Vite"],
  [/express/i, "Express"],
  [/nestjs/i, "NestJS"],
  [/angular/i, "Angular"],
  [/vue/i, "Vue"],
  [/fastapi/i, "FastAPI"],
  [/flask/i, "Flask"],
  [/django/i, "Django"],
  [/streamlit/i, "Streamlit"],
  [/flutter/i, "Flutter"],
  [/spring[\s-]?boot/i, "Spring Boot"],
  [/laravel/i, "Laravel"],
  [/tailwind(?:\s?css)?/i, "Tailwind CSS"],
  [/docker[\s-]?compose/i, "Docker Compose"],
  [/docker/i, "Docker"],
  [/github[\s_]actions/i, "GitHub Actions"],
  [/supabase/i, "Supabase"],
  [/firebase/i, "Firebase"],
  [/aws/i, "AWS"],
  [/azure/i, "Azure"],
  [/gcp/i, "GCP"],
  [/redis/i, "Redis"],
  [/postgresql/i, "PostgreSQL"],
  [/mongo/i, "MongoDB"],
]

const languageFrameworkMap: Record<string, string[]> = {
  TypeScript: ["TypeScript"],
  JavaScript: ["JavaScript"],
  Python: ["Python"],
  Java: ["Java"],
  Kotlin: ["Kotlin"],
  Swift: ["Swift"],
  Go: ["Go"],
  Rust: ["Rust"],
  Ruby: ["Ruby"],
  PHP: ["PHP"],
  C: ["C"],
  "C++": ["C++"],
  Dart: ["Dart"],
  "C#": ["C#"],
}

export function detectFrameworks(repo: GitHubRepo): string[] {
  const detected = new Set<string>()
  const textToSearch = [
    repo.description || "",
    repo.readme || "",
    ...repo.topics,
    repo.language || "",
  ].join(" ")

  for (const [pattern, name] of frameworkPatterns) {
    if (pattern.test(textToSearch)) {
      detected.add(name)
    }
  }

  if (repo.language && languageFrameworkMap[repo.language]) {
    for (const lang of languageFrameworkMap[repo.language]) {
      detected.add(lang)
    }
  }

  if (detected.has("React") || detected.has("Next.js")) {
    detected.add("React")
  }
  if (detected.has("Next.js")) {
    detected.add("React")
  }

  return Array.from(detected)
}

export function detectDatabase(repo: GitHubRepo): string[] {
  const dbs: string[] = []
  const text = [repo.description || "", repo.readme || "", ...repo.topics].join(" ").toLowerCase()

  const patterns: [RegExp, string][] = [
    [/mongo/i, "MongoDB"],
    [/postgres/i, "PostgreSQL"],
    [/redis/i, "Redis"],
    [/mysql/i, "MySQL"],
    [/sqlite/i, "SQLite"],
    [/firestore/i, "Firestore"],
    [/supabase/i, "Supabase"],
    [/prisma/i, "Prisma"],
    [/dynamodb/i, "DynamoDB"],
    [/cassandra/i, "Cassandra"],
  ]

  for (const [pattern, name] of patterns) {
    if (pattern.test(text)) {
      dbs.push(name)
    }
  }

  return dbs
}

export function detectDeployment(repo: GitHubRepo): string[] {
  const deployment: string[] = []
  const text = [repo.description || "", repo.readme || "", ...repo.topics].join(" ").toLowerCase()

  if (/vercel/i.test(text)) deployment.push("Vercel")
  if (/netlify/i.test(text)) deployment.push("Netlify")
  if (/railway/i.test(text)) deployment.push("Railway")
  if (/render/i.test(text)) deployment.push("Render")
  if (/aws/i.test(text)) deployment.push("AWS")
  if (/gcp|google cloud/i.test(text)) deployment.push("GCP")
  if (/azure/i.test(text)) deployment.push("Azure")
  if (/docker/i.test(text)) deployment.push("Docker")
  if (/github pages/i.test(text)) deployment.push("GitHub Pages")
  if (/heroku/i.test(text)) deployment.push("Heroku")
  if (/cloudflare/i.test(text)) deployment.push("Cloudflare")

  return deployment
}

export function detectBuildTool(repo: GitHubRepo): string[] {
  const tools: string[] = []
  const readme = repo.readme || ""

  if (/vite/i.test(readme) || repo.topics.some((t) => /vite/i.test(t))) tools.push("Vite")
  if (/webpack/i.test(readme)) tools.push("Webpack")
  if (/esbuild/i.test(readme)) tools.push("esbuild")
  if (/turbopack/i.test(readme)) tools.push("Turbopack")
  if (/rollup/i.test(readme)) tools.push("Rollup")
  if (/parcel/i.test(readme)) tools.push("Parcel")

  return tools
}
