/**
 * Shared PDF generation utilities — used by both the "Download All" button
 * and per-repo card download buttons.
 *
 * Import only in "use client" components (jsPDF runs in the browser).
 */

// ─────────────────────────────────────────────────────────────────────────────
// README decoder
// ─────────────────────────────────────────────────────────────────────────────
export function decodeReadme(raw: string | null | undefined): string | null {
  if (!raw || !raw.trim()) return null
  const trimmed = raw.trimStart()
  if (!trimmed.startsWith("{")) return raw
  try {
    const parsed = JSON.parse(raw) as { content?: string; encoding?: string }
    if (parsed.content && parsed.encoding === "base64") {
      try { return atob(parsed.content.replace(/\n/g, "")) } catch { return null }
    }
    return null
  } catch {
    return null // truncated / invalid JSON — discard
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Strip HTML / inline Markdown for plain text extraction
// ─────────────────────────────────────────────────────────────────────────────
export function cleanText(text: string): string {
  return text
    .replace(/<[^>]+>/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[[^\]]*\]\([^)]*\)/g, (m) => {
      const label = m.match(/\[([^\]]*)\]/)
      return label ? label[1] : ""
    })
    .replace(/`[^`]*`/g, (m) => m.slice(1, -1))
    .replace(/\s{2,}/g, " ")
    .trim()
}

// ─────────────────────────────────────────────────────────────────────────────
// Colour palette (shared)
// ─────────────────────────────────────────────────────────────────────────────
export type RGB = readonly [number, number, number]

export const COLORS = {
  TEAL:       [39, 203, 203]   as RGB,
  WHITE:      [235, 235, 235]  as RGB,
  BODY:       [185, 185, 185]  as RGB,
  SUB:        [145, 145, 145]  as RGB,
  FAINT:      [90, 90, 95]     as RGB,
  BG_PAGE:    [18, 20, 24]     as RGB,
  BG_CODE:    [26, 30, 36]     as RGB,
  BG_BQ:      [24, 36, 36]     as RGB,
  BG_SECT:    [24, 42, 42]     as RGB,
  BG_STRIPE:  [22, 26, 32]     as RGB,
  LINK:       [80, 155, 240]   as RGB,
  CODE_FG:    [170, 210, 130]  as RGB,
  BAR_COLORS: [
    [39, 203, 203], [38, 216, 104], [200, 120, 240],
    [240, 160, 60], [80, 160, 240], [240, 80, 120],
  ] as RGB[],
}

// ─────────────────────────────────────────────────────────────────────────────
// Core PDF builder — accepts one or more RepoContext items
// ─────────────────────────────────────────────────────────────────────────────
export async function buildRepoPdf(
  repos: any[],      // RepoContext[]
  stats?: any,       // GitHubContextData["stats"]
  lastSync?: string | null,
  opts?: { singleRepo?: boolean },
): Promise<any /* jsPDF */> {
  const { default: jsPDF } = await import("jspdf")
  const { Lexer, Tokens } = await import("marked")
  const { COLORS: C } = await import("./pdfUtils")

  const doc = new jsPDF("p", "mm", "a4")
  const PW = doc.internal.pageSize.getWidth()
  const PH = doc.internal.pageSize.getHeight()
  const LM = 18
  const RM = PW - LM
  const CW = PW - LM * 2

  let y = 22

  const fillPageBg = () => {
    doc.setFillColor(...C.BG_PAGE)
    doc.rect(0, 0, PW, PH, "F")
    doc.setFillColor(...C.TEAL)
    doc.rect(0, 0, PW, 2, "F")
    doc.rect(0, PH - 2, PW, 2, "F")
  }

  const writeFooter = (pageNum: number, total?: number) => {
    doc.setFontSize(6.5)
    doc.setTextColor(...C.FAINT)
    const label = total ? `Page ${pageNum} of ${total}` : `Page ${pageNum}`
    doc.text(`${label}  ·  Hiten Katariya — AI Context`, PW / 2, PH - 5, { align: "center" })
    doc.setDrawColor(45, 50, 60)
    doc.setLineWidth(0.15)
    doc.line(LM, PH - 9, RM, PH - 9)
  }

  const ensureSpace = (needed: number): boolean => {
    if (y + needed > PH - 14) {
      writeFooter(doc.getNumberOfPages())
      doc.addPage()
      fillPageBg()
      y = 22
      return true
    }
    return false
  }

  const sectionLabel = (label: string) => {
    ensureSpace(14)
    y += 2
    doc.setFontSize(7)
    doc.setFont(undefined, "bold")
    const textW = doc.getStringUnitWidth(label.toUpperCase()) * 7 * 0.352 + 8
    doc.setFillColor(...C.BG_SECT)
    doc.roundedRect(LM, y - 4, textW, 6, 1.5, 1.5, "F")
    doc.setTextColor(...C.TEAL)
    doc.text(label.toUpperCase(), LM + 4, y)
    doc.setFont(undefined, "normal")
    y += 4
    doc.setDrawColor(...C.TEAL)
    doc.setLineWidth(0.25)
    doc.line(LM, y, RM, y)
    y += 5
  }

  const tokensToText = (tokens: any[]): string => {
    if (!tokens) return ""
    return tokens.map((t: any) => {
      switch (t.type) {
        case "strong": case "em": case "del": return tokensToText(t.tokens || [])
        case "link": return tokensToText(t.tokens || []) || t.href || ""
        case "codespan": return t.text || ""
        case "text": return t.tokens && t.tokens.length > 0 ? tokensToText(t.tokens) : (t.text || "")
        case "html": case "tag": return ""
        case "image": return t.text || ""
        default: return t.text || t.raw || ""
      }
    }).join("")
  }

  const renderMarkdown = (md: string) => {
    const cleanMd = md
      .replace(/^<div[\s\S]*?<\/div>/gim, "")
      .replace(/^<[^>]+>.*<\/[^>]+>$/gim, "")
      .replace(/^\[!\[.*?\]\(.*?\)\]\(.*?\)$/gm, "")
      .replace(/!\[.*?\]\(https?:\/\/(?:img\.shields\.io|github\.com\/badges|badge\.fury|travis)[^\)]*\)/gi, "")
      .replace(/\n{3,}/g, "\n\n")
      .trim()

    let tokens: any[]
    try { tokens = Lexer.lex(cleanMd, { gfm: true }) } catch { return }

    let lineCount = 0
    const MAX_LINES = 120

    for (const token of tokens) {
      if (lineCount > MAX_LINES) {
        ensureSpace(8)
        doc.setFontSize(8); doc.setFont(undefined, "italic"); doc.setTextColor(...C.FAINT)
        doc.text("[ README truncated — see GitHub for full content ]", LM, y)
        doc.setFont(undefined, "normal"); y += 6
        break
      }

      switch (token.type) {
        case "heading": {
          const h = token as Tokens.Heading
          const SIZES: Record<number, number> = { 1: 13, 2: 11, 3: 10, 4: 9, 5: 8.5, 6: 8 }
          const sz = SIZES[h.depth] ?? 9
          const pad = h.depth <= 2 ? 5 : 2
          ensureSpace(sz + pad + 8)
          y += pad
          const text = cleanText(tokensToText(h.tokens as any[]))
          if (!text.trim()) break
          doc.setFontSize(sz); doc.setFont(undefined, "bold")
          doc.setTextColor(...(h.depth === 1 ? C.WHITE : h.depth === 2 ? [210, 210, 210] as RGB : C.BODY))
          const lines = doc.splitTextToSize(text, CW)
          doc.text(lines, LM, y)
          y += lines.length * (sz * 0.45 + 1) + 3
          if (h.depth <= 2) {
            doc.setDrawColor(...(h.depth === 1 ? C.TEAL : [70, 75, 80] as RGB))
            doc.setLineWidth(h.depth === 1 ? 0.4 : 0.2)
            doc.line(LM, y - 1, h.depth === 1 ? RM : LM + CW * 0.5, y - 1); y += 2
          }
          doc.setFont(undefined, "normal"); lineCount += lines.length; break
        }
        case "paragraph": {
          const p = token as Tokens.Paragraph
          const text = cleanText(tokensToText(p.tokens as any[]))
          if (!text.trim() || text.length < 3) break
          ensureSpace(8); doc.setFontSize(9); doc.setTextColor(...C.BODY)
          const lines = doc.splitTextToSize(text, CW)
          doc.text(lines, LM, y); y += lines.length * 5 + 3; lineCount += lines.length; break
        }
        case "code": {
          const c = token as Tokens.Code
          const codeLinesList = (c.text || "").split("\n")
          const truncated = codeLinesList.length > 40
          const displayText = (truncated ? codeLinesList.slice(0, 40) : codeLinesList).join("\n")
          const wrapped = doc.splitTextToSize(displayText, CW - 10)
          const blockH = wrapped.length * 3.6 + (c.lang ? 12 : 8)
          ensureSpace(blockH + 6)
          doc.setFillColor(...C.BG_CODE); doc.roundedRect(LM, y - 2, CW, blockH + (truncated ? 5 : 0), 2, 2, "F")
          let textY = y
          if (c.lang) {
            doc.setFontSize(6.5); doc.setTextColor(...C.TEAL); doc.text(c.lang.toUpperCase(), LM + 4, y + 3.5)
            doc.setDrawColor(...C.FAINT); doc.setLineWidth(0.15); doc.line(LM + 2, y + 5.5, LM + CW - 2, y + 5.5)
            textY = y + 8
          } else { textY = y + 4 }
          doc.setFontSize(7); doc.setTextColor(...C.CODE_FG)
          for (let i = 0; i < wrapped.length; i++) doc.text(wrapped[i], LM + 4, textY + i * 3.6)
          if (truncated) {
            doc.setFontSize(6.5); doc.setTextColor(...C.FAINT)
            doc.text(`… (${codeLinesList.length - 40} more lines)`, LM + 4, textY + wrapped.length * 3.6 + 2)
            y += blockH + 10
          } else { y += blockH + 5 }
          lineCount += wrapped.length; break
        }
        case "list": {
          const l = token as Tokens.List; let counter = 1
          for (const item of l.items) {
            const li = item as Tokens.ListItem
            let text = ""
            for (const lt of li.tokens || []) {
              if (lt.type === "text") text += tokensToText(lt.tokens && lt.tokens.length > 0 ? lt.tokens : [lt])
              else if (lt.type === "paragraph") text += tokensToText((lt as Tokens.Paragraph).tokens as any[])
              else text += lt.text || lt.raw || ""
            }
            text = cleanText(text).trim(); if (!text) continue
            ensureSpace(6); doc.setFontSize(9)
            const prefix = l.ordered ? `${counter}.` : "•"
            const lines = doc.splitTextToSize(text, CW - 7)
            doc.setTextColor(...C.TEAL); doc.text(prefix, LM, y)
            doc.setTextColor(...C.BODY); doc.text(lines, LM + 6, y)
            y += lines.length * 4.8 + 1; lineCount += lines.length; counter++
          }
          y += 2; break
        }
        case "blockquote": {
          const bq = token as Tokens.Blockquote
          const bqText = bq.tokens.map((t: any) =>
            t.type === "paragraph" ? tokensToText((t as Tokens.Paragraph).tokens as any[]) : t.text || t.raw || ""
          ).join(" ")
          const text = cleanText(bqText).trim(); if (!text) break
          const lines = doc.splitTextToSize(text, CW - 10)
          const bqH = lines.length * 4.8 + 8; ensureSpace(bqH + 4)
          doc.setFillColor(...C.BG_BQ); doc.roundedRect(LM, y - 3, CW, bqH, 2, 2, "F")
          doc.setFillColor(...C.TEAL); doc.rect(LM, y - 3, 2.5, bqH, "F")
          doc.setFontSize(9); doc.setFont(undefined, "italic"); doc.setTextColor(...C.SUB)
          doc.text(lines, LM + 7, y + 1); doc.setFont(undefined, "normal")
          y += bqH + 4; lineCount += lines.length; break
        }
        case "hr": {
          ensureSpace(8); y += 3
          doc.setDrawColor(55, 58, 68); doc.setLineWidth(0.25); doc.line(LM, y, RM, y); y += 5; break
        }
        case "table": {
          const t = token as Tokens.Table
          const cols = t.header.length || 1; const colW = CW / cols; ensureSpace(14)
          doc.setFillColor(32, 44, 44); doc.rect(LM, y - 4, CW, 8, "F")
          doc.setFontSize(7.5); doc.setFont(undefined, "bold"); doc.setTextColor(...C.TEAL)
          t.header.forEach((cell: any, i: number) => {
            const txt = cleanText(tokensToText(cell.tokens || [{ text: cell.text }]))
            doc.text(doc.splitTextToSize(txt, colW - 4), LM + colW * i + 3, y)
          })
          y += 6; doc.setFont(undefined, "normal"); let alt = false
          for (const row of t.rows) {
            ensureSpace(7)
            if (alt) { doc.setFillColor(...C.BG_STRIPE); doc.rect(LM, y - 3, CW, 7, "F") }
            doc.setFontSize(7.5); doc.setTextColor(...C.BODY)
            row.forEach((cell: any, i: number) => {
              const txt = cleanText(tokensToText(cell.tokens || [{ text: cell.text }]))
              doc.text(doc.splitTextToSize(txt, colW - 4), LM + colW * i + 3, y)
            })
            y += 5.5; alt = !alt; lineCount++
          }
          doc.setDrawColor(50, 60, 60); doc.setLineWidth(0.2); doc.line(LM, y + 1, RM, y + 1); y += 5; break
        }
        case "space": y += 3; break
        default: break
      }
    }
  }

  // ── Render one repo page (header + all 8 sections) ──────────────────────
  const renderRepoPage = (item: any) => {
    fillPageBg()
    y = 22
    const repo = item.repo
    const meta = item.metadata ?? {}

    // 1. Name
    doc.setFontSize(21); doc.setFont(undefined, "bold"); doc.setTextColor(...C.WHITE)
    const nameLines = doc.splitTextToSize(repo.name, CW)
    doc.text(nameLines, LM, y); y += nameLines.length * 9 + 2; doc.setFont(undefined, "normal")

    // Visibility badge + stars/forks
    const vis = (repo.visibility || "public").toUpperCase()
    const isPrivate = vis === "PRIVATE"
    const badgeW = doc.getStringUnitWidth(vis) * 7 * 0.352 + 8
    doc.setFillColor(isPrivate ? 55 : 25, isPrivate ? 30 : 45, isPrivate ? 30 : 45)
    doc.roundedRect(LM, y, badgeW, 5.5, 1.5, 1.5, "F")
    doc.setFontSize(6.5); doc.setFont(undefined, "bold")
    doc.setTextColor(isPrivate ? 220 : 39, isPrivate ? 100 : 203, isPrivate ? 100 : 203)
    doc.text(vis, LM + 4, y + 3.7); doc.setFont(undefined, "normal")
    doc.setFontSize(7.5); doc.setTextColor(...C.FAINT)
    doc.text(`★ ${repo.stargazers_count}   ⑂ ${repo.forks_count}   Updated: ${new Date(repo.updated_at).toLocaleDateString()}`, LM + badgeW + 4, y + 3.7)
    y += 9
    doc.setDrawColor(...C.FAINT); doc.setLineWidth(0.15); doc.line(LM, y, RM, y); y += 7

    // 2. GitHub Link
    sectionLabel("GitHub Link")
    doc.setFontSize(9); doc.setTextColor(...C.LINK)
    doc.textWithLink(repo.html_url, LM, y, { url: repo.html_url }); y += 7
    if (repo.homepage) {
      doc.setFontSize(8); doc.setTextColor(...C.SUB)
      doc.textWithLink(`Live: ${repo.homepage}`, LM, y, { url: repo.homepage }); y += 6
    }

    // 3. Description
    sectionLabel("Description")
    doc.setFontSize(9); doc.setTextColor(...C.BODY)
    const descLines = doc.splitTextToSize(repo.description || "No description provided.", CW)
    doc.text(descLines, LM, y); y += descLines.length * 5 + 5

    // 4. Tags
    if (repo.topics?.length > 0) {
      sectionLabel("Tags")
      let tx = LM; let rowY = y
      const TAG_H = 5.5, TAG_PX = 4, TAG_GAP = 3
      for (const topic of repo.topics) {
        const label = `#${topic}`; doc.setFontSize(7)
        const tw = doc.getStringUnitWidth(label) * 7 * 0.352 + TAG_PX * 2
        if (tx + tw > RM) { tx = LM; rowY += TAG_H + 4; ensureSpace(TAG_H + 4) }
        doc.setFillColor(22, 42, 42); doc.roundedRect(tx, rowY, tw, TAG_H, 1.5, 1.5, "F")
        doc.setDrawColor(...C.TEAL); doc.setLineWidth(0.18); doc.roundedRect(tx, rowY, tw, TAG_H, 1.5, 1.5, "S")
        doc.setTextColor(...C.TEAL); doc.text(label, tx + TAG_PX, rowY + 3.8); tx += tw + TAG_GAP
      }
      y = rowY + TAG_H + 7
    }

    // 5. Primary Language
    sectionLabel("Primary Language")
    doc.setFontSize(11); doc.setFont(undefined, "bold"); doc.setTextColor(...C.WHITE)
    doc.text(repo.language || "Not specified", LM, y); doc.setFont(undefined, "normal"); y += 9

    // 6. Language Breakdown
    const langEntries = Object.entries(repo.languages ?? {}) as [string, number][]
    if (langEntries.length > 0) {
      sectionLabel("Language Breakdown")
      const total = langEntries.reduce((s, [, v]) => s + v, 0)
      const sorted = [...langEntries].sort(([, a], [, b]) => b - a)
      for (let bi = 0; bi < sorted.length; bi++) {
        const [lang, bytes] = sorted[bi]; ensureSpace(10)
        const pct = ((bytes / total) * 100).toFixed(1)
        const barColor = C.BAR_COLORS[bi % C.BAR_COLORS.length]
        doc.setFontSize(8); doc.setTextColor(...C.BODY); doc.text(lang, LM, y)
        doc.setTextColor(...C.SUB); doc.text(`${pct}%`, RM, y, { align: "right" }); y += 3.5
        doc.setFillColor(38, 42, 48); doc.roundedRect(LM, y, CW, 3, 1, 1, "F")
        doc.setFillColor(...barColor); doc.roundedRect(LM, y, Math.max(CW * (bytes / total), 1.5), 3, 1, 1, "F")
        y += 7
      }
      y += 2
    }

    // 7. README
    sectionLabel("README")
    const readmeMd = decodeReadme(repo.readme)
    if (readmeMd?.trim()) {
      renderMarkdown(readmeMd); y += 4
    } else {
      doc.setFontSize(9); doc.setFont(undefined, "italic"); doc.setTextColor(...C.FAINT)
      doc.text("No README available for this repository.", LM, y)
      doc.setFont(undefined, "normal"); y += 8
    }

    // 8. AI Summary
    ensureSpace(24); sectionLabel("AI Summary")
    if (meta.summary) {
      doc.setFontSize(9); doc.setTextColor(...C.BODY)
      const sumLines = doc.splitTextToSize(meta.summary, CW)
      doc.text(sumLines, LM, y); y += sumLines.length * 5 + 5
    }
    if (meta.keyFeatures?.length > 0) {
      doc.setFontSize(8); doc.setFont(undefined, "bold"); doc.setTextColor(...C.TEAL)
      doc.text("Key Features", LM, y); doc.setFont(undefined, "normal"); y += 5
      for (const feat of meta.keyFeatures) {
        ensureSpace(6)
        const fLines = doc.splitTextToSize(feat, CW - 7)
        doc.setFontSize(8.5); doc.setTextColor(...C.TEAL); doc.text("•", LM, y)
        doc.setTextColor(...C.BODY); doc.text(fLines, LM + 5, y)
        y += fLines.length * 4.5 + 1.5
      }
      y += 4
    }
    const metaRows: [string, string][] = [
      ["Purpose",     meta.projectPurpose || "N/A"],
      ["Type",        meta.repositoryType || "N/A"],
      ["Architecture",meta.architecture || "N/A"],
      ["Frameworks",  (meta.framework || []).filter((f: string) => !["TypeScript","JavaScript","Python","Java","Go"].includes(f)).join(", ") || "N/A"],
      ["Databases",   (meta.database || []).join(", ") || "N/A"],
      ["Auth",        (meta.authentication || []).join(", ") || "N/A"],
      ["Deployment",  (meta.deployment || []).join(", ") || "N/A"],
      ["Complexity",  meta.complexity || "N/A"],
    ]
    const colW2 = CW / 2 - 4
    for (let i = 0; i < metaRows.length; i += 2) {
      ensureSpace(11)
      if (Math.floor(i / 2) % 2 === 0) { doc.setFillColor(...C.BG_STRIPE); doc.rect(LM - 1, y - 3, CW + 2, 11, "F") }
      const [lL, lV] = metaRows[i]
      doc.setFontSize(7); doc.setFont(undefined, "bold"); doc.setTextColor(...C.TEAL); doc.text(lL, LM, y)
      doc.setFont(undefined, "normal"); doc.setTextColor(...C.BODY)
      doc.text(doc.splitTextToSize(lV, colW2), LM, y + 4)
      if (i + 1 < metaRows.length) {
        const [rL, rV] = metaRows[i + 1]; const rx = LM + colW2 + 8
        doc.setFont(undefined, "bold"); doc.setTextColor(...C.TEAL); doc.text(rL, rx, y)
        doc.setFont(undefined, "normal"); doc.setTextColor(...C.BODY)
        doc.text(doc.splitTextToSize(rV, colW2), rx, y + 4)
      }
      y += 11
    }
  }

  // ── Cover page (only for multi-repo / full export) ────────────────────────
  if (!opts?.singleRepo) {
    // ── Zone 1: Full-page dark base ───────────────────────────────────────
    doc.setFillColor(...COLORS.BG_PAGE)
    doc.rect(0, 0, PW, PH, "F")

    // Left teal accent bar (full height)
    doc.setFillColor(...COLORS.TEAL)
    doc.rect(0, 0, 4, PH, "F")

    // Right subtle bar
    doc.setFillColor(28, 38, 38)
    doc.rect(PW - 4, 0, 4, PH, "F")

    // ── Zone 2: Top header band (y=0 → 48mm) ────────────────────────────
    doc.setFillColor(20, 24, 30)
    doc.rect(4, 0, PW - 8, 48, "F")

    // Header: name in teal small-caps
    doc.setFontSize(8)
    doc.setFont(undefined, "bold")
    doc.setTextColor(...COLORS.TEAL)
    doc.text("HITEN KATARIYA", PW / 2, 17, { align: "center" })

    // Tagline
    doc.setFontSize(6.5)
    doc.setFont(undefined, "normal")
    doc.setTextColor(...COLORS.SUB)
    doc.text("Full-Stack Developer  ·  Cloud Engineer  ·  AI Integration", PW / 2, 25, { align: "center" })

    // Bottom border of header band
    doc.setDrawColor(...COLORS.TEAL)
    doc.setLineWidth(0.35)
    doc.line(4, 48, PW - 4, 48)

    // ── Zone 3: Hero title (y=60 → 130mm) ───────────────────────────────
    // Large "AI" in teal
    doc.setFontSize(68)
    doc.setFont(undefined, "bold")
    doc.setTextColor(...COLORS.TEAL)
    doc.text("AI", PW / 2, 98, { align: "center" })

    // "CONTEXT" in white below
    doc.setFontSize(32)
    doc.setFont(undefined, "normal")
    doc.setTextColor(...COLORS.WHITE)
    doc.text("C O N T E X T", PW / 2, 116, { align: "center" })

    // Decorative divider
    doc.setDrawColor(...COLORS.TEAL)
    doc.setLineWidth(0.5)
    doc.line(PW / 2 - 40, 122, PW / 2 + 40, 122)

    // Thin subtitle
    doc.setFontSize(7.5)
    doc.setFont(undefined, "normal")
    doc.setTextColor(...COLORS.SUB)
    doc.text("AI-ready context generated from GitHub repositories", PW / 2, 130, { align: "center" })

    // ── Zone 4: Stats row (y=140 → 170mm) ───────────────────────────────
    const statsBoxY = 140
    const statsBoxH = 28
    doc.setFillColor(20, 30, 30)
    doc.roundedRect(LM, statsBoxY, CW, statsBoxH, 3, 3, "F")
    doc.setDrawColor(...COLORS.TEAL)
    doc.setLineWidth(0.2)
    doc.roundedRect(LM, statsBoxY, CW, statsBoxH, 3, 3, "S")

    // Vertical dividers inside stats box
    const statCols = 4
    const statColW = CW / statCols
    for (let d = 1; d < statCols; d++) {
      doc.setDrawColor(35, 50, 50)
      doc.setLineWidth(0.15)
      doc.line(LM + statColW * d, statsBoxY + 4, LM + statColW * d, statsBoxY + statsBoxH - 4)
    }

    const statItems = [
      { label: "REPOS",   value: String(stats?.total  ?? 0) },
      { label: "STARS",   value: String(stats?.stars  ?? 0) },
      { label: "FORKS",   value: String(stats?.forks  ?? 0) },
      { label: "PUBLIC",  value: String(stats?.public ?? 0) },
    ]
    statItems.forEach((s, i) => {
      const cx = LM + statColW * i + statColW / 2
      doc.setFontSize(15)
      doc.setFont(undefined, "bold")
      doc.setTextColor(...COLORS.TEAL)
      doc.text(s.value, cx, statsBoxY + 14, { align: "center" })
      doc.setFontSize(6)
      doc.setFont(undefined, "normal")
      doc.setTextColor(...COLORS.FAINT)
      doc.text(s.label, cx, statsBoxY + 22, { align: "center" })
    })

    // ── Zone 5: Description (y=178 → 210mm) ─────────────────────────────
    doc.setFontSize(8.5)
    doc.setFont(undefined, "normal")
    doc.setTextColor(...COLORS.BODY)
    const desc1 = "Contains README content, metadata, language breakdown,"
    const desc2 = "AI-generated summaries, and key features for every repository."
    doc.text(desc1, PW / 2, 182, { align: "center" })
    doc.text(desc2, PW / 2, 190, { align: "center" })

    // Generation date
    const dateStr = lastSync
      ? new Date(lastSync).toLocaleDateString("en-US", {
          year: "numeric", month: "long", day: "numeric",
          hour: "2-digit", minute: "2-digit",
        })
      : "N/A"
    doc.setFontSize(7.5)
    doc.setTextColor(...COLORS.SUB)
    doc.text(`Generated: ${dateStr}`, PW / 2, 202, { align: "center" })

    // ── Zone 6: Bottom accent zone (y=218 → PH) ─────────────────────────
    doc.setFillColor(16, 20, 26)
    doc.rect(4, 218, PW - 8, PH - 218, "F")

    // Separator
    doc.setDrawColor(...COLORS.TEAL)
    doc.setLineWidth(0.3)
    doc.line(4, 218, PW - 4, 218)

    // Large watermark-style repo count
    doc.setFontSize(72)
    doc.setFont(undefined, "bold")
    doc.setTextColor(22, 30, 30)   // very dark teal — visible only subtly
    doc.text(String(stats?.total ?? ""), PW / 2, 272, { align: "center" })

    // Label over watermark
    doc.setFontSize(10)
    doc.setFont(undefined, "bold")
    doc.setTextColor(...COLORS.TEAL)
    doc.text("repositories indexed", PW / 2, 255, { align: "center" })

    // GitHub URL
    doc.setFontSize(7)
    doc.setFont(undefined, "normal")
    doc.setTextColor(...COLORS.FAINT)
    doc.text("github.com/HitenKatariya", PW / 2, 284, { align: "center" })

    // Bottom teal bar
    doc.setFillColor(...COLORS.TEAL)
    doc.rect(0, PH - 3, PW, 3, "F")

    // TOC
    doc.addPage(); fillPageBg(); y = 26
    doc.setFontSize(18); doc.setFont(undefined, "bold"); doc.setTextColor(...COLORS.WHITE)
    doc.text("Contents", LM, y); doc.setFont(undefined, "normal"); y += 5
    doc.setDrawColor(...COLORS.TEAL); doc.setLineWidth(0.4); doc.line(LM, y, RM, y); y += 10
    let tocIdx = 1
    for (const item of repos) {
      ensureSpace(8)
      doc.setFontSize(9); doc.setTextColor(...COLORS.TEAL); doc.text(`${tocIdx}.`, LM, y)
      doc.setTextColor(...COLORS.BODY); doc.text(item.repo.name, LM + 8, y)
      const nameW = LM + 8 + doc.getStringUnitWidth(item.repo.name) * 9 * 0.352 + 3
      doc.setTextColor(...COLORS.FAINT)
      for (let dx = nameW; dx < RM - 20; dx += 2.5) doc.text(".", dx, y)
      if (item.repo.language) {
        doc.setFontSize(7.5); doc.setTextColor(...COLORS.FAINT); doc.text(item.repo.language, RM, y, { align: "right" })
      }
      y += 7; tocIdx++
    }
  }

  // ── Render each repo ──────────────────────────────────────────────────────
  for (const item of repos) {
    if (!opts?.singleRepo || repos.indexOf(item) > 0) doc.addPage()
    renderRepoPage(item)
  }

  // ── Footers ───────────────────────────────────────────────────────────────
  const total = doc.getNumberOfPages()
  for (let p = 1; p <= total; p++) {
    doc.setPage(p); writeFooter(p, total)
  }

  return doc
}
