"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Award, ExternalLink, FileText, Loader2, Sparkles, Trophy } from "lucide-react"
import type { AchievementRecord, CertificateRecord } from "@/lib/career/types"
import { cn } from "@/lib/utils"
import PageContainer from "@/components/PageContainer"
import SectionLabel from "@/components/SectionLabel"

type CareerPayload = {
  certificates: CertificateRecord[]
  achievements: AchievementRecord[]
}

const Certifications = () => {
  const [data, setData] = useState<CareerPayload | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch("/api/career", { cache: "no-store" })
        if (!res.ok) throw new Error("Failed to load")
        const json = (await res.json()) as CareerPayload
        if (!cancelled) setData(json)
      } catch {
        if (!cancelled) setError("Could not load certifications from the API.")
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section id="certifications" className="relative overflow-hidden py-24">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#27cbcb]/30 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 top-24 h-64 bg-gradient-to-b from-[#27cbcb]/10 to-transparent blur-3xl" />
      <PageContainer className="relative">
        <SectionLabel label="certs" />

        <motion.div
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-14"
        >
          <h2 className="mb-3 text-4xl font-bold text-white md:text-5xl">
            Certifications <span className="text-slate-500">&</span>{" "}
            <span className="bg-gradient-to-r from-[#27cbcb] via-[#26d868] to-[#80978f] bg-clip-text text-transparent">
              Achievements
            </span>
          </h2>
          <p className="max-w-2xl text-slate-400">
            Explore verified certifications and key milestones loaded dynamically from the career API to keep this section current and easy to update.
          </p>
        </motion.div>

        {error && (
          <p className="mb-8 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-center text-sm text-red-200">{error}</p>
        )}

        {!data && !error && (
          <div className="flex items-center justify-center gap-2 py-16 text-slate-400">
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading credentials…
          </div>
        )}

        {data && (
          <>
            <div className="mb-6 flex items-center gap-2 text-sm font-semibold text-slate-300">
              <Sparkles className="h-4 w-4 text-[#27cbcb]" />
              Certifications
            </div>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {data.certificates.map((cert, index) => (
                <motion.article
                  key={cert.id}
                  initial={{ opacity: 0, y: 26 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.04 }}
                  className={cn(
                    "group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br p-[1px] shadow-lg shadow-black/40 transition duration-300 hover:-translate-y-0.5 hover:border-[#27cbcb]/30",
                    cert.accent,
                  )}
                >
                  <div className="flex h-full flex-col rounded-[15px] bg-[#101318]/95 p-5">
                    <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-300">
                      <Award className="h-3.5 w-3.5 text-[#27cbcb]" />
                      {cert.category}
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-white">{cert.title}</h3>
                    <p className="text-sm text-slate-400">{cert.issuer}</p>
                    {typeof cert.hours === "number" && (
                      <p className="mt-3 font-mono text-xs font-medium uppercase tracking-widest text-[#26d868]">{cert.hours} hours</p>
                    )}
                    {(cert.credentialUrl || cert.pdfUrl) && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {cert.credentialUrl && (
                          <a
                            href={cert.credentialUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-full border border-[#27cbcb]/40 bg-[#27cbcb]/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#27cbcb] transition hover:bg-[#27cbcb]/20"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                            Verify
                          </a>
                        )}
                        {cert.pdfUrl && (
                          <a
                            href={cert.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-full border border-[#26d868]/40 bg-[#26d868]/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#26d868] transition hover:bg-[#26d868]/20"
                          >
                            <FileText className="h-3.5 w-3.5" />
                            View PDF
                          </a>
                        )}
                      </div>
                    )}
                    <div className="mt-6 h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent" />
                    <p className="mt-4 text-[11px] uppercase tracking-widest text-slate-500">Verified credential</p>
                  </div>
                </motion.article>
              ))}
            </div>

            <div className="mt-16">
              <div className="mb-6 flex items-center gap-2 text-sm font-semibold text-slate-300">
                <Trophy className="h-4 w-4 text-[#26d868]" />
                Achievements
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                {data.achievements.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 22 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.55, delay: index * 0.06 }}
                    className="relative overflow-hidden rounded-2xl border border-[#27cbcb]/20 bg-[#101318]/90 p-6 shadow-black/30 transition duration-300 hover:-translate-y-0.5 hover:border-[#27cbcb]/30"
                  >
                    <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#26d868]/10 blur-2xl" />
                    <div className="relative flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#26d868]/15 text-[#26d868]">
                        <Trophy className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-slate-300">{item.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </>
        )}
      </PageContainer>
    </section>
  )
}

export default Certifications
