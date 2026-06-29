"use client"

import { useState } from "react"
import { FileDown, FileText, FileJson, Loader2 } from "lucide-react"
import { buildRepoPdf } from "@/lib/github/pdfUtils"

export default function DownloadButtons() {
  const [downloading, setDownloading] = useState<string | null>(null)

  const download = async (format: string) => {
    setDownloading(format)
    try {
      const response = await fetch(`/api/github-context/download?format=${format}`)
      if (!response.ok) {
        const err = await response.json().catch(() => ({ error: "Download failed" }))
        alert(err.error || "Download failed")
        return
      }
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `AI_Context.${format === "md" ? "md" : "json"}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch {
      alert("Download failed. Make sure to sync GitHub data first.")
    } finally {
      setDownloading(null)
    }
  }

  const downloadPdf = async () => {
    setDownloading("pdf")
    try {
      const response = await fetch("/api/github-context")
      if (!response.ok) {
        alert("No data available. Sync GitHub first.")
        return
      }
      const data = await response.json()
      const doc = await buildRepoPdf(
        data.repos ?? [],
        data.stats,
        data.lastSync,
        { singleRepo: false },
      )
      doc.save("AI_Context.pdf")
    } catch (err) {
      console.error("PDF generation error:", err)
      alert("PDF generation failed. Check console for details.")
    } finally {
      setDownloading(null)
    }
  }

  return (
    <div className="flex flex-wrap gap-3">
      <button
        type="button"
        onClick={() => download("json")}
        disabled={downloading === "json"}
        className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900/80 px-4 py-2 text-sm font-medium text-zinc-300 transition hover:border-zinc-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        {downloading === "json" ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileJson className="h-4 w-4" />}
        Download JSON
      </button>
      <button
        type="button"
        onClick={() => download("md")}
        disabled={downloading === "md"}
        className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900/80 px-4 py-2 text-sm font-medium text-zinc-300 transition hover:border-zinc-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        {downloading === "md" ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
        Download Markdown
      </button>
      <button
        type="button"
        onClick={downloadPdf}
        disabled={downloading === "pdf"}
        className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900/80 px-4 py-2 text-sm font-medium text-zinc-300 transition hover:border-zinc-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        {downloading === "pdf" ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileDown className="h-4 w-4" />}
        Download All PDF
      </button>
    </div>
  )
}
