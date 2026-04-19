import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const filePath = join(process.cwd(), "data", "career.json")
    const raw = await readFile(filePath, "utf8")
    const data = JSON.parse(raw) as {
      certificates: unknown[]
      achievements: unknown[]
    }
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ certificates: [], achievements: [] }, { status: 200 })
  }
}
