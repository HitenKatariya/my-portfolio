"use client"

import { useState } from "react"
import { FileDown, FileText, FileJson, Loader2 } from "lucide-react"

// ---------------------------------------------------------------------------
// Helper: decode a cached readme value which may be
//   1. A plain Markdown string  (the happy path after the API fix)
//   2. A JSON-stringified GitHub API response with a Base64 `content` field
//      (old cache entries that were captured before the API fix)
// ---------------------------------------------------------------------------
function decodeReadme(raw: string | null | undefined): string | null {
  if (!raw) return null

  const trimmed = raw.trimStart()

  // If it doesn't look like JSON, it's already Markdown — use it directly.
  if (!trimmed.startsWith("{")) return raw

  try {
    const parsed = JSON.parse(raw) as {
      content?: string
      encoding?: string
      name?: string
    }

    // GitHub contents API JSON with Base64 payload
    if (parsed.content && parsed.encoding === "base64") {
      const b64 = parsed.content.replace(/\n/g, "")
      return atob(b64)
    }

    // Some other JSON object — not a README, discard
    return null
  } catch {
    // Wasn't valid JSON after all — treat as raw Markdown
    return raw
  }
}

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
      const ph = doc.internal.pageSize.getHeight()
      const lm = 18          // left margin
      const rm = pw - lm     // right margin x-coord
      const contentW = pw - lm * 2
      let y = 22

      // ── Colours ───────────────────────────────────────────────────────────
      const TEAL   = [39, 203, 203] as const
      const WHITE  = [240, 240, 240] as const
      const GREY1  = [180, 180, 180] as const  // body text
      const GREY2  = [140, 140, 140] as const  // secondary
      const GREY3  = [100, 100, 100] as const  // faint
      const DARK   = [22, 24, 28] as const     // dark background
      const DARK2  = [30, 32, 38] as const     // code background
      const LABEL_BG = [28, 42, 42] as const   // section label pill bg

      // ── Page check ────────────────────────────────────────────────────────
      const checkPage = (needed: number) => {
        if (y + needed > ph - 14) {
          addPageFooter()
          doc.addPage()
          y = 22
          return true
        }
        return false
      }

      // ── Footer ────────────────────────────────────────────────────────────
      const addPageFooter = () => {
        const pg = doc.getNumberOfPages()
        doc.setPage(pg)
        doc.setFontSize(7)
        doc.setTextColor(...GREY3)
        doc.text(`Page ${pg}  ·  AI Context — Hiten Katariya`, pw / 2, ph - 6, { align: "center" })
        doc.setDrawColor(50, 50, 60)
        doc.setLineWidth(0.2)
        doc.line(lm, ph - 10, rm, ph - 10)
      }

      // ── Section label (pill-style) ────────────────────────────────────────
      const sectionLabel = (label: string) => {
        checkPage(12)
        y += 3
        doc.setFillColor(...LABEL_BG)
        doc.roundedRect(lm, y - 4, 6 + doc.getStringUnitWidth(label.toUpperCase()) * 7 * 0.35 + 6, 6, 1.5, 1.5, "F")
        doc.setFontSize(7)
        doc.setFont(undefined, "bold")
        doc.setTextColor(...TEAL)
        doc.text(label.toUpperCase(), lm + 3, y)
        doc.setFont(undefined, "normal")
        y += 5
        doc.setDrawColor(...TEAL)
        doc.setLineWidth(0.25)
        doc.line(lm, y - 1, rm, y - 1)
        y += 4
      }

      // ── Inline-text extractor (strips Markdown inline tokens) ─────────────
      const extractText = (tokens: any[]): string =>
        tokens
          .map((t: any) => {
            if (t.type === "strong" || t.type === "em" || t.type === "link") {
              return extractText(t.tokens || [])
            }
            return t.text || t.raw || ""
          })
          .join("")

      // ── Markdown renderer ─────────────────────────────────────────────────
      const renderMarkdown = (md: string) => {
        const tokens = parseMarkdown(md, { gfm: true })

        for (const token of tokens) {
          checkPage(10)

          switch (token.type) {
            case "heading": {
              const h = token as Tokens.Heading
              const sizes: Record<number, number> = { 1: 14, 2: 12, 3: 10, 4: 9, 5: 8, 6: 8 }
              const size = sizes[h.depth] ?? 10
              const topPad = h.depth === 1 ? 6 : h.depth === 2 ? 4 : 2
              checkPage(size + topPad + 6)
              y += topPad
              doc.setFontSize(size)
              doc.setTextColor(...(h.depth <= 2 ? WHITE : GREY1))
              doc.setFont(undefined, "bold")
              const text = extractText(h.tokens as any[])
              const lines = doc.splitTextToSize(text, contentW)
              doc.text(lines, lm, y)
              y += lines.length * (size * 0.4) + 4
              // underline for h1/h2
              if (h.depth <= 2) {
                doc.setDrawColor(...GREY3)
                doc.setLineWidth(0.2)
                doc.line(lm, y - 2, rm, y - 2)
                y += 2
              }
              doc.setFont(undefined, "normal")
              break
            }

            case "paragraph": {
              const p = token as Tokens.Paragraph
              const text = extractText(p.tokens as any[])
              if (!text.trim()) break
              checkPage(8)
              doc.setFontSize(9)
              doc.setTextColor(...GREY1)
              const lines = doc.splitTextToSize(text, contentW)
              doc.text(lines, lm, y)
              y += lines.length * 4.8 + 3
              break
            }

            case "code": {
              const c = token as Tokens.Code
              const codeLines = doc.splitTextToSize(c.text, contentW - 10)
              const blockH = codeLines.length * 3.8 + 10
              checkPage(blockH + 6)
              doc.setFillColor(...DARK2)
              doc.roundedRect(lm, y - 2, contentW, blockH, 2, 2, "F")
              // lang label
              if (c.lang) {
                doc.setFontSize(6.5)
                doc.setTextColor(...TEAL)
                doc.text(c.lang.toUpperCase(), lm + 4, y + 3)
                doc.setFontSize(7.5)
                doc.setTextColor(180, 210, 130)
                for (let i = 0; i < codeLines.length; i++) {
                  doc.text(codeLines[i], lm + 4, y + 8 + 3.8 * i)
                }
                y += blockH + 6
              } else {
                doc.setFontSize(7.5)
                doc.setTextColor(180, 210, 130)
                for (let i = 0; i < codeLines.length; i++) {
                  doc.text(codeLines[i], lm + 4, y + 4 + 3.8 * i)
                }
                y += blockH + 6
              }
              break
            }

            case "list": {
              const l = token as Tokens.List
              let counter = 1
              for (const item of l.items) {
                const li = item as Tokens.ListItem
                const text = li.tokens
                  .map((t: any) => {
                    if (t.type === "text") return extractText(t.tokens || [{ text: t.text }])
                    return t.text || t.raw || ""
                  })
                  .join("")
                if (!text.trim()) continue
                checkPage(6)
                doc.setFontSize(9)
                doc.setTextColor(...GREY1)
                const prefix = l.ordered ? `${counter}.` : "•"
                const indentW = 6
                const lines = doc.splitTextToSize(text, contentW - indentW - 2)
                doc.setTextColor(...TEAL)
                doc.text(prefix, lm, y)
                doc.setTextColor(...GREY1)
                doc.text(lines, lm + indentW, y)
                y += lines.length * 4.5 + 1.5
                counter++
              }
              y += 2
              break
            }

            case "blockquote": {
              const bq = token as Tokens.Blockquote
              const bqText = bq.tokens.map((t: any) => t.text || t.raw || "").join(" ")
              checkPage(10)
              const bqLines = doc.splitTextToSize(bqText, contentW - 8)
              const bqH = bqLines.length * 4.5 + 8
              doc.setFillColor(28, 38, 38)
              doc.roundedRect(lm, y - 3, contentW, bqH, 2, 2, "F")
              doc.setFillColor(...TEAL)
              doc.rect(lm, y - 3, 2.5, bqH, "F")
              doc.setFontSize(9)
              doc.setTextColor(...GREY2)
              doc.setFont(undefined, "italic")
              doc.text(bqLines, lm + 6, y + 1)
              doc.setFont(undefined, "normal")
              y += bqH + 4
              break
            }

            case "hr": {
              checkPage(8)
              y += 2
              doc.setDrawColor(55, 55, 65)
              doc.setLineWidth(0.3)
              doc.line(lm, y, rm, y)
              y += 6
              break
            }

            case "table": {
              const t = token as Tokens.Table
              checkPage(14)
              const colCount = t.header.length || 1
              const colW = contentW / colCount
              // header row background
              doc.setFillColor(35, 45, 45)
              doc.rect(lm, y - 4, contentW, 7, "F")
              doc.setFontSize(7.5)
              doc.setTextColor(...TEAL)
              doc.setFont(undefined, "bold")
              t.header.forEach((cell: any, i: number) => {
                doc.text(cell.text || "", lm + colW * i + 2, y)
              })
              y += 5
              doc.setFont(undefined, "normal")
              let rowAlt = false
              for (const row of t.rows) {
                checkPage(7)
                if (rowAlt) {
                  doc.setFillColor(28, 32, 36)
                  doc.rect(lm, y - 3, contentW, 6, "F")
                }
                doc.setFontSize(7.5)
                doc.setTextColor(...GREY1)
                row.forEach((cell: any, i: number) => {
                  const cellText = doc.splitTextToSize(cell.text || "", colW - 4)
                  doc.text(cellText, lm + colW * i + 2, y)
                })
                y += 5.5
                rowAlt = !rowAlt
              }
              doc.setDrawColor(50, 60, 60)
              doc.setLineWidth(0.2)
              doc.line(lm, y, rm, y)
              y += 5
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

      // ======================================================================
      // COVER PAGE
      // ======================================================================
      doc.setFillColor(...DARK)
      doc.rect(0, 0, pw, ph, "F")

      // Teal accent bar at top
      doc.setFillColor(...TEAL)
      doc.rect(0, 0, pw, 2.5, "F")

      // Title area
      doc.setFontSize(32)
      doc.setFont(undefined, "bold")
      doc.setTextColor(...WHITE)
      doc.text("AI Context", pw / 2, 85, { align: "center" })

      doc.setFontSize(16)
      doc.setFont(undefined, "normal")
      doc.setTextColor(...TEAL)
      doc.text("Hiten Katariya", pw / 2, 97, { align: "center" })

      doc.setDrawColor(...TEAL)
      doc.setLineWidth(0.4)
      doc.line(pw / 2 - 35, 104, pw / 2 + 35, 104)

      doc.setFontSize(9.5)
      doc.setTextColor(...GREY2)
      const dateStr = data.lastSync
        ? new Date(data.lastSync).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })
        : "N/A"
      doc.text(`Generated: ${dateStr}`, pw / 2, 114, { align: "center" })

      // Stats pills
      const stats = [
        `${data.stats?.total || 0} Repositories`,
        `${data.stats?.stars || 0} Stars`,
        `${data.stats?.forks || 0} Forks`,
      ]
      let sx = pw / 2 - 55
      for (const stat of stats) {
        const sw = doc.getStringUnitWidth(stat) * 9 * 0.35 + 8
        doc.setFillColor(35, 55, 55)
        doc.roundedRect(sx, 122, sw, 8, 2, 2, "F")
        doc.setFontSize(8)
        doc.setTextColor(...TEAL)
        doc.text(stat, sx + sw / 2, 127.5, { align: "center" })
        sx += sw + 4
      }

      // Bottom bar
      doc.setFillColor(...TEAL)
      doc.rect(0, ph - 2.5, pw, 2.5, "F")

      // ======================================================================
      // TABLE OF CONTENTS
      // ======================================================================
      doc.addPage()
      doc.setFillColor(...DARK)
      doc.rect(0, 0, pw, ph, "F")
      doc.setFillColor(...TEAL)
      doc.rect(0, 0, pw, 2.5, "F")

      y = 26
      doc.setFontSize(18)
      doc.setFont(undefined, "bold")
      doc.setTextColor(...WHITE)
      doc.text("Contents", lm, y)
      doc.setFont(undefined, "normal")
      y += 4

      doc.setDrawColor(...TEAL)
      doc.setLineWidth(0.4)
      doc.line(lm, y, rm, y)
      y += 10

      let tocIdx = 1
      for (const item of data.repos || []) {
        checkPage(8)
        doc.setFontSize(9)
        doc.setTextColor(...TEAL)
        doc.text(`${tocIdx}.`, lm, y)
        doc.setTextColor(...GREY1)
        doc.text(item.repo.name, lm + 8, y)
        // dots
        doc.setTextColor(...GREY3)
        const nameW = doc.getStringUnitWidth(item.repo.name) * 9 * 0.35
        const dotStart = lm + 8 + nameW + 2
        const dotEnd = rm - 12
        if (dotEnd > dotStart) {
          let dx = dotStart
          while (dx < dotEnd) {
            doc.text(".", dx, y)
            dx += 3
          }
        }
        if (item.repo.language) {
          doc.setFontSize(7.5)
          doc.setTextColor(...GREY3)
          doc.text(item.repo.language, rm, y, { align: "right" })
        }
        y += 7
        tocIdx++
      }

      // ======================================================================
      // REPOSITORY SECTIONS
      // ======================================================================
      for (const item of data.repos || []) {
        doc.addPage()
        doc.setFillColor(...DARK)
        doc.rect(0, 0, pw, ph, "F")
        doc.setFillColor(...TEAL)
        doc.rect(0, 0, pw, 2.5, "F")
        y = 22

        // ── 1. Repository Name ────────────────────────────────────────────
        doc.setFontSize(20)
        doc.setFont(undefined, "bold")
        doc.setTextColor(...WHITE)
        const nameLines = doc.splitTextToSize(item.repo.name, contentW)
        doc.text(nameLines, lm, y)
        y += nameLines.length * 9 + 4
        doc.setFont(undefined, "normal")

        // Repo type badge
        const vis = (item.repo.visibility || "public").toUpperCase()
        const visW = doc.getStringUnitWidth(vis) * 7.5 * 0.35 + 6
        doc.setFillColor(vis === "PRIVATE" ? 60 : 35, vis === "PRIVATE" ? 30 : 55, vis === "PRIVATE" ? 30 : 35)
        doc.roundedRect(lm, y, visW, 5.5, 1.5, 1.5, "F")
        doc.setFontSize(6.5)
        doc.setTextColor(vis === "PRIVATE" ? 220 : 39, vis === "PRIVATE" ? 100 : 203, vis === "PRIVATE" ? 100 : 203)
        doc.text(vis, lm + 3, y + 3.7)
        y += 9

        doc.setDrawColor(...GREY3)
        doc.setLineWidth(0.2)
        doc.line(lm, y, rm, y)
        y += 8

        // ── 2. GitHub Link ────────────────────────────────────────────────
        sectionLabel("GitHub Link")
        doc.setFontSize(9)
        doc.setTextColor(70, 150, 240)
        doc.textWithLink(item.repo.html_url, lm, y, { url: item.repo.html_url })
        y += 8

        // ── 3. Description ────────────────────────────────────────────────
        sectionLabel("Description")
        doc.setFontSize(9)
        doc.setTextColor(...GREY1)
        const desc = item.repo.description || "No description provided."
        const descLines = doc.splitTextToSize(desc, contentW)
        doc.text(descLines, lm, y)
        y += descLines.length * 4.8 + 6

        // ── 4. Tags ───────────────────────────────────────────────────────
        if (item.repo.topics?.length > 0) {
          sectionLabel("Tags")
          let tx = lm
          const tagY = y
          const tagH = 5.5
          const tagPadX = 4
          const tagPadBetween = 3

          for (const topic of item.repo.topics) {
            const label = `#${topic}`
            const tw = doc.getStringUnitWidth(label) * 8 * 0.35 + tagPadX * 2
            if (tx + tw > rm) {
              tx = lm
              y += tagH + 4
            }
            checkPage(tagH + 6)
            doc.setFillColor(25, 45, 45)
            doc.roundedRect(tx, y, tw, tagH, 1.5, 1.5, "F")
            doc.setDrawColor(...TEAL)
            doc.setLineWidth(0.2)
            doc.roundedRect(tx, y, tw, tagH, 1.5, 1.5, "S")
            doc.setFontSize(7)
            doc.setTextColor(...TEAL)
            doc.text(label, tx + tagPadX, y + 3.8)
            tx += tw + tagPadBetween
          }
          y = tagY + tagH + 8
        }

        // ── 5. Primary Language ───────────────────────────────────────────
        sectionLabel("Primary Language")
        doc.setFontSize(10)
        doc.setFont(undefined, "bold")
        doc.setTextColor(...WHITE)
        doc.text(item.repo.language || "N/A", lm, y)
        doc.setFont(undefined, "normal")
        y += 8

        // ── 6. Language Breakdown ─────────────────────────────────────────
        const langEntries = Object.entries(item.repo.languages || {}) as [string, number][]
        if (langEntries.length > 0) {
          sectionLabel("Language Breakdown")
          const total = langEntries.reduce((s, [, v]) => s + v, 0)
          const sorted = langEntries.sort(([, a], [, b]) => b - a)

          // Bar chart colours cycle
          const barColors = [
            [39, 203, 203] as const,
            [38, 216, 104] as const,
            [200, 120, 240] as const,
            [240, 160, 60] as const,
            [80, 160, 240] as const,
            [240, 80, 120] as const,
          ]

          for (let bi = 0; bi < sorted.length; bi++) {
            const [lang, bytes] = sorted[bi]
            checkPage(10)
            const pct = ((bytes / total) * 100).toFixed(1)
            const barColor = barColors[bi % barColors.length]

            doc.setFontSize(8)
            doc.setTextColor(...GREY1)
            doc.text(lang, lm, y)
            doc.setTextColor(...GREY2)
            doc.text(`${pct}%`, rm, y, { align: "right" })
            y += 3

            // Track bar background
            doc.setFillColor(40, 45, 50)
            doc.roundedRect(lm, y, contentW, 3, 1, 1, "F")
            // Filled portion
            const fillW = Math.max(contentW * (bytes / total), 2)
            doc.setFillColor(...barColor)
            doc.roundedRect(lm, y, fillW, 3, 1, 1, "F")
            y += 7
          }
          y += 2
        }

        // ── 7. README ─────────────────────────────────────────────────────
        sectionLabel("README")
        const readmeMd = decodeReadme(item.repo.readme)
        if (readmeMd) {
          renderMarkdown(readmeMd)
          y += 4
        } else {
          doc.setFontSize(9)
          doc.setTextColor(...GREY3)
          doc.setFont(undefined, "italic")
          doc.text("No README available for this repository.", lm, y)
          doc.setFont(undefined, "normal")
          y += 8
        }

        // ── 8. AI Summary ─────────────────────────────────────────────────
        checkPage(20)
        sectionLabel("AI Summary")

        const meta = item.metadata || {}
        const summaryRows: [string, string][] = [
          ["Purpose",          meta.projectPurpose   || "N/A"],
          ["Repository Type",  meta.repositoryType   || "N/A"],
          ["Framework",        (meta.framework || []).join(", ")      || "N/A"],
          ["Primary Language", meta.primaryLanguage  || "N/A"],
          ["Technologies",     (meta.technologies || []).join(", ")   || "N/A"],
          ["Database",         (meta.database || []).join(", ")       || "N/A"],
          ["Authentication",   (meta.authentication || []).join(", ") || "N/A"],
          ["Deployment",       (meta.deployment || []).join(", ")     || "N/A"],
          ["Entry Point",      meta.entryPoint       || "N/A"],
          ["Architecture",     meta.architecture     || "N/A"],
          ["Complexity",       meta.complexity       || "N/A"],
        ]

        // Two-column layout for summary
        const summaryColW = contentW / 2 - 4
        let sumRow = 0
        for (const [label, value] of summaryRows) {
          if (sumRow % 2 === 0) {
            // Left column — also check for page break every two rows
            if (sumRow > 0) checkPage(10)
            // background stripe
            if (Math.floor(sumRow / 2) % 2 === 0) {
              doc.setFillColor(25, 30, 35)
              doc.rect(lm - 1, y - 3, contentW + 2, 9, "F")
            }
            doc.setFontSize(7)
            doc.setFont(undefined, "bold")
            doc.setTextColor(...TEAL)
            doc.text(label, lm, y)
            doc.setFont(undefined, "normal")
            doc.setTextColor(...GREY1)
            const valLines = doc.splitTextToSize(value, summaryColW)
            doc.text(valLines, lm, y + 4)
          } else {
            // Right column
            const rx = lm + summaryColW + 8
            doc.setFontSize(7)
            doc.setFont(undefined, "bold")
            doc.setTextColor(...TEAL)
            doc.text(label, rx, y)
            doc.setFont(undefined, "normal")
            doc.setTextColor(...GREY1)
            const valLines = doc.splitTextToSize(value, summaryColW)
            doc.text(valLines, rx, y + 4)
            y += 12
          }
          sumRow++
        }
        if (sumRow % 2 !== 0) y += 12  // flush last left-only row
      }

      // ======================================================================
      // FOOTER on every page
      // ======================================================================
      const totalPages = doc.getNumberOfPages()
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i)
        doc.setFontSize(7)
        doc.setTextColor(...GREY3)
        doc.text(`Page ${i} of ${totalPages}  ·  AI Context — Hiten Katariya`, pw / 2, ph - 6, { align: "center" })
        doc.setDrawColor(45, 50, 60)
        doc.setLineWidth(0.2)
        doc.line(lm, ph - 10, rm, ph - 10)
      }

      doc.save("AI_Context.pdf")
    } catch (err) {
      console.error("PDF generation failed:", err)
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
