"use client"

import { useState } from "react"
import { FileDown, FileText, FileJson, Loader2 } from "lucide-react"

export default function DownloadButtons() {
  const [downloading, setDownloading] = useState<string | null>(null)

  const download = async (format: string, label: string) => {
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
      const { default: jsPDF } = await import("jspdf")
      const response = await fetch("/api/github-context")
      if (!response.ok) {
        alert("No data available. Sync GitHub first.")
        return
      }
      const data = await response.json()
      const doc = new jsPDF("p", "mm", "a4")
      const pw = doc.internal.pageSize.getWidth()
      const lm = 18
      const rm = pw - lm
      let y = 18

      const addPageIfNeeded = (needed: number) => {
        if (y + needed > 285) {
          doc.addPage()
          y = 18
        }
      }

      // --- Cover ---
      doc.setFontSize(26)
      doc.setTextColor(39, 203, 203)
      doc.text("AI Context — Hiten Katariya", pw / 2, y + 40, { align: "center" })
      doc.setFontSize(12)
      doc.setTextColor(140, 140, 140)
      const dateStr = data.lastSync
        ? new Date(data.lastSync).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })
        : "N/A"
      doc.text(`Generated: ${dateStr}`, pw / 2, y + 50, { align: "center" })
      doc.setFontSize(10)
      doc.text(`Total Repositories: ${data.stats?.total || 0}  |  Stars: ${data.stats?.stars || 0}  |  Forks: ${data.stats?.forks || 0}`, pw / 2, y + 60, { align: "center" })

      // --- Table of Contents ---
      doc.addPage()
      y = 18
      doc.setFontSize(18)
      doc.setTextColor(39, 203, 203)
      doc.text("Table of Contents", lm, y)
      y += 10
      doc.setFontSize(10)
      doc.setTextColor(180, 180, 180)
      data.repos?.forEach((item: any, i: number) => {
        addPageIfNeeded(6)
        doc.text(`${i + 1}. ${item.repo.name}`, lm, y)
        y += 6
      })

      // --- Repository Sections ---
      for (const item of data.repos || []) {
        doc.addPage()
        y = 18

        // Name
        doc.setFontSize(18)
        doc.setTextColor(39, 203, 203)
        doc.text(item.repo.name, lm, y)
        y += 10

        // Link
        doc.setFontSize(9)
        doc.setTextColor(80, 160, 255)
        doc.textWithLink("GitHub Repository", lm, y, { url: item.repo.html_url })
        y += 7

        // Visibility badge
        doc.setTextColor(140, 140, 140)
        doc.text(`Visibility: ${item.repo.visibility}`, rm - 40, y - 7, { align: "right" })

        // Description
        doc.setTextColor(200, 200, 200)
        doc.setFontSize(11)
        const desc = item.repo.description || "No description"
        const descLines = doc.splitTextToSize(desc, pw - 36)
        doc.text(descLines, lm, y)
        y += descLines.length * 5 + 6

        // Tags (Topics)
        if (item.repo.topics?.length > 0) {
          addPageIfNeeded(18)
          doc.setFontSize(10)
          doc.setTextColor(39, 203, 203)
          doc.text("Tags", lm, y)
          y += 5
          doc.setFontSize(9)
          doc.setTextColor(160, 160, 160)
          const tagsStr = item.repo.topics.join("  •  ")
          const tagLines = doc.splitTextToSize(tagsStr, pw - 36)
          doc.text(tagLines, lm, y)
          y += tagLines.length * 4 + 4
        }

        // Metadata row
        addPageIfNeeded(12)
        doc.setFontSize(9)
        doc.setTextColor(120, 120, 120)
        doc.text(`Language: ${item.repo.language || "N/A"}  |  Stars: ${item.repo.stargazers_count}  |  Forks: ${item.repo.forks_count}  |  License: ${item.repo.license?.spdx_id || "N/A"}`, lm, y)
        y += 6
        doc.text(`Purpose: ${item.metadata?.projectPurpose || "N/A"}  |  Type: ${item.metadata?.repositoryType || "N/A"}`, lm, y)
        y += 6
        doc.text(`Technologies: ${item.metadata?.technologies?.slice(0, 10).join(", ") || "N/A"}`, lm, y)
        y += 8

        // README
        if (item.repo.readme) {
          addPageIfNeeded(14)
          doc.setFontSize(11)
          doc.setTextColor(39, 203, 203)
          doc.text("README.md", lm, y)
          y += 6

          doc.setFontSize(8)
          doc.setTextColor(170, 170, 170)
          const readmeText = item.repo.readme
          const readmeLines = doc.splitTextToSize(readmeText, pw - 36)
          for (let i = 0; i < readmeLines.length; i++) {
            if (y > 280) {
              doc.addPage()
              y = 18
            }
            doc.text(readmeLines[i], lm, y)
            y += 4
          }
          y += 4
        }

        // Separator
        addPageIfNeeded(4)
        doc.setDrawColor(50, 50, 50)
        doc.setLineWidth(0.3)
        doc.line(lm, y, rm, y)
        y += 4
      }

      doc.save("AI_Context.pdf")
    } catch {
      alert("PDF generation failed. Make sure to sync GitHub data first.")
    } finally {
      setDownloading(null)
    }
  }

  return (
    <div className="flex flex-wrap gap-3">
      <button
        type="button"
        onClick={() => download("json", "JSON")}
        disabled={downloading === "json"}
        className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900/80 px-4 py-2 text-sm font-medium text-zinc-300 transition hover:border-zinc-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        {downloading === "json" ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileJson className="h-4 w-4" />}
        Download JSON
      </button>
      <button
        type="button"
        onClick={() => download("md", "Markdown")}
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
        Download PDF
      </button>
    </div>
  )
}
