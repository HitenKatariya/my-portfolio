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
      const { parse: parseMarkdown, Tokens } = await import("marked")

      const response = await fetch("/api/github-context")
      if (!response.ok) {
        alert("No data available. Sync GitHub first.")
        return
      }
      const data = await response.json()
      const doc = new jsPDF("p", "mm", "a4")
      const pw = doc.internal.pageSize.getWidth()
      const lm = 20
      const rm = pw - lm
      const contentW = pw - 40
      let y = 20

      const checkPage = (needed: number) => {
        if (y + needed > 285) {
          doc.addPage()
          y = 20
          return true
        }
        return false
      }

      const sectionLabel = (label: string) => {
        checkPage(10)
        doc.setFontSize(7)
        doc.setTextColor(39, 203, 203)
        doc.text(label.toUpperCase(), lm, y)
        y += 4
        doc.setDrawColor(39, 203, 203)
        doc.setLineWidth(0.3)
        doc.line(lm, y, lm + 20, y)
        y += 5
      }

      const renderMarkdown = (md: string) => {
        const tokens = parseMarkdown(md, { gfm: true })
        for (const token of tokens) {
          if (checkPage(10)) {}

          switch (token.type) {
            case "heading": {
              const h = token as Tokens.Heading
              const sizes: Record<number, number> = { 1: 16, 2: 13, 3: 11, 4: 10, 5: 9, 6: 9 }
              const size = sizes[h.depth] || 11
              checkPage(size + 4)
              doc.setFontSize(size)
              doc.setTextColor(220, 220, 220)
              doc.setFont(undefined, "bold")
              const text = h.tokens.map((t: any) => t.text || t.raw || "").join("")
              doc.text(text, lm, y)
              y += size + 3
              doc.setFont(undefined, "normal")
              break
            }
            case "paragraph": {
              const p = token as Tokens.Paragraph
              const text = p.tokens.map((t: any) => t.text || t.raw || "").join("")
              checkPage(8)
              doc.setFontSize(9)
              doc.setTextColor(180, 180, 180)
              const lines = doc.splitTextToSize(text, contentW)
              doc.text(lines, lm, y)
              y += lines.length * 4.5 + 3
              break
            }
            case "code": {
              const c = token as Tokens.Code
              checkPage(8)
              const codeLines = doc.splitTextToSize(c.text, contentW - 8)
              const blockH = codeLines.length * 3.5 + 8
              checkPage(blockH + 4)
              doc.setFillColor(30, 32, 36)
              doc.roundedRect(lm, y - 3, contentW, blockH, 2, 2, "F")
              doc.setFontSize(7)
              doc.setTextColor(180, 200, 120)
              doc.setFont(undefined, "normal")
              for (let i = 0; i < codeLines.length; i++) {
                doc.text(codeLines[i], lm + 4, y + 3.5 * i + 1)
              }
              y += blockH + 4
              break
            }
            case "list": {
              const l = token as Tokens.List
              let counter = 1
              for (const item of l.items) {
                const li = item as Tokens.ListItem
                const text = li.tokens.map((t: any) => t.text || t.raw || "").join("")
                checkPage(6)
                doc.setFontSize(9)
                doc.setTextColor(180, 180, 180)
                const prefix = l.ordered ? `${counter}.` : "•"
                const lines = doc.splitTextToSize(text, contentW - 8)
                doc.text(`${prefix} `, lm, y)
                doc.text(lines, lm + 5, y)
                y += lines.length * 4 + 2
                counter++
              }
              y += 2
              break
            }
            case "blockquote": {
              const bq = token as Tokens.Blockquote
              const bqText = bq.tokens.map((t: any) => t.text || t.raw || "").join("")
              checkPage(8)
              doc.setDrawColor(39, 203, 203)
              doc.setLineWidth(0.5)
              doc.line(lm, y - 2, lm, y + 6)
              doc.setFontSize(9)
              doc.setTextColor(150, 150, 150)
              const bqLines = doc.splitTextToSize(bqText, contentW - 6)
              doc.text(bqLines, lm + 4, y)
              y += bqLines.length * 4.5 + 4
              break
            }
            case "hr": {
              checkPage(6)
              doc.setDrawColor(60, 60, 60)
              doc.setLineWidth(0.3)
              doc.line(lm, y, rm, y)
              y += 6
              break
            }
            case "table": {
              const t = token as Tokens.Table
              checkPage(12)
              const colW = contentW / (t.header.length || 1)
              doc.setFontSize(7)
              doc.setTextColor(200, 200, 200)
              doc.setFont(undefined, "bold")
              t.header.forEach((cell: any, i: number) => {
                doc.text(cell.text, lm + colW * i, y)
              })
              y += 5
              doc.setFont(undefined, "normal")
              doc.setDrawColor(60, 60, 60)
              doc.setLineWidth(0.2)
              doc.line(lm, y - 1, rm, y - 1)
              for (const row of t.rows) {
                checkPage(6)
                doc.setTextColor(170, 170, 170)
                row.forEach((cell: any, i: number) => {
                  doc.text(cell.text, lm + colW * i, y)
                })
                y += 4
              }
              y += 3
              break
            }
            case "space":
              y += 3
              break
            default:
              break
          }
        }
      }

      // --- Cover Page ---
      doc.setFontSize(28)
      doc.setTextColor(39, 203, 203)
      doc.text("AI Context", pw / 2, 80, { align: "center" })
      doc.setFontSize(16)
      doc.setTextColor(255, 255, 255)
      doc.text("Hiten Katariya", pw / 2, 92, { align: "center" })
      doc.setDrawColor(39, 203, 203)
      doc.setLineWidth(0.5)
      doc.line(pw / 2 - 30, 100, pw / 2 + 30, 100)
      doc.setFontSize(10)
      doc.setTextColor(140, 140, 140)
      const dateStr = data.lastSync
        ? new Date(data.lastSync).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })
        : "N/A"
      doc.text(`Generated: ${dateStr}`, pw / 2, 112, { align: "center" })
      doc.setFontSize(9)
      doc.text(`Total: ${data.stats?.total || 0} repos  |  ${data.stats?.stars || 0} stars  |  ${data.stats?.forks || 0} forks`, pw / 2, 122, { align: "center" })

      // --- Table of Contents ---
      doc.addPage()
      y = 20
      doc.setFontSize(16)
      doc.setTextColor(39, 203, 203)
      doc.text("Contents", lm, y)
      y += 8
      doc.setFontSize(9)
      doc.setTextColor(180, 180, 180)
      for (const item of data.repos || []) {
        checkPage(6)
        doc.text(`  ${item.repo.name}`, lm, y)
        y += 5
      }

      // --- Repository Sections ---
      for (const item of data.repos || []) {
        doc.addPage()
        y = 20

        // Repository Name (large heading)
        doc.setFontSize(22)
        doc.setTextColor(255, 255, 255)
        doc.setFont(undefined, "bold")
        doc.text(item.repo.name, lm, y)
        y += 10
        doc.setFont(undefined, "normal")

        // GitHub Link
        sectionLabel("GitHub Link")
        doc.setFontSize(9)
        doc.setTextColor(60, 140, 230)
        doc.textWithLink(item.repo.html_url, lm, y, { url: item.repo.html_url })
        y += 7

        // Description
        sectionLabel("Description")
        doc.setFontSize(9)
        doc.setTextColor(200, 200, 200)
        const desc = item.repo.description || "No description provided."
        const descLines = doc.splitTextToSize(desc, contentW)
        doc.text(descLines, lm, y)
        y += descLines.length * 4.5 + 4

        // Tags
        if (item.repo.topics?.length > 0) {
          sectionLabel("Tags")
          doc.setFontSize(8)
          doc.setTextColor(160, 160, 160)
          const tagStr = item.repo.topics.join("    ")
          const tagLines = doc.splitTextToSize(tagStr, contentW)
          doc.text(tagLines, lm, y)
          y += tagLines.length * 4 + 4
        }

        // Primary Language
        sectionLabel("Primary Language")
        doc.setFontSize(9)
        doc.setTextColor(200, 200, 200)
        doc.text(item.repo.language || "N/A", lm, y)
        y += 6

        // Language Breakdown
        const langEntries = Object.entries(item.repo.languages || {}) as [string, number][]
        if (langEntries.length > 0) {
          sectionLabel("Language Breakdown")
          const total = langEntries.reduce((s, [, v]) => s + v, 0)
          for (const [lang, bytes] of langEntries.sort(([, a], [, b]) => b - a)) {
            checkPage(8)
            const pct = ((bytes / total) * 100).toFixed(1)
            doc.setFontSize(8)
            doc.setTextColor(200, 200, 200)
            doc.text(`${lang}`, lm, y)
            doc.setTextColor(140, 140, 140)
            doc.text(`${pct}%`, rm, y, { align: "right" })
            y += 2
            doc.setFillColor(39, 60, 60)
            doc.rect(lm, y, contentW * (bytes / total), 2.5, "F")
            y += 5
          }
        }

        // README
        sectionLabel("README")
        if (item.repo.readme) {
          renderMarkdown(item.repo.readme)
        } else {
          doc.setFontSize(9)
          doc.setTextColor(120, 120, 120)
          doc.text("No README available.", lm, y)
          y += 6
        }

        // AI Summary
        checkPage(14)
        sectionLabel("AI Summary")
        const meta = item.metadata || {}
        const summaryItems: [string, string][] = [
          ["Purpose", meta.projectPurpose || "N/A"],
          ["Repository Type", meta.repositoryType || "N/A"],
          ["Framework", (meta.framework || []).join(", ") || "N/A"],
          ["Primary Language", meta.primaryLanguage || "N/A"],
          ["Technologies", (meta.technologies || []).join(", ") || "N/A"],
          ["Database", (meta.database || []).join(", ") || "N/A"],
          ["Authentication", (meta.authentication || []).join(", ") || "N/A"],
          ["Deployment", (meta.deployment || []).join(", ") || "N/A"],
          ["Entry Point", meta.entryPoint || "N/A"],
          ["Architecture", meta.architecture || "N/A"],
        ]
        doc.setFontSize(7)
        doc.setTextColor(140, 140, 140)
        for (const [label, value] of summaryItems) {
          checkPage(5)
          doc.setFont(undefined, "bold")
          doc.text(`${label}:  `, lm, y)
          doc.setFont(undefined, "normal")
          const valW = doc.getTextWidth(`${label}:  `)
          doc.text(`${value}`, lm + valW, y)
          y += 4
        }
        doc.setFont(undefined, "normal")

        // Section divider
        checkPage(6)
        doc.setDrawColor(40, 40, 40)
        doc.setLineWidth(0.5)
        doc.line(lm, y, rm, y)
        y += 6
      }

      // --- Footer pages ---
      const totalPages = doc.getNumberOfPages()
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i)
        doc.setFontSize(7)
        doc.setTextColor(80, 80, 80)
        doc.text(`Page ${i} of ${totalPages}`, pw / 2, 293, { align: "center" })
        if (i === 1) {
          doc.text("AI Context — Hiten Katariya", lm, 293)
        }
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
