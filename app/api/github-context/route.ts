import { NextResponse } from "next/server"
import { getGitHubData, fetchRepositories, buildContextData, validateToken } from "@/lib/github/api"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    await validateToken()
    const data = await getGitHubData(false)
    return NextResponse.json(data)
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST() {
  try {
    await validateToken()
    const repos = await fetchRepositories()
    const data = await buildContextData(repos)
    return NextResponse.json(data)
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
