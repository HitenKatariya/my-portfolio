"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Award, ExternalLink, FileText, Loader2, Sparkles, Trophy } from "lucide-react"
import type { AchievementRecord, CertificateRecord } from "@/lib/career/types"
import { cn } from "@/lib/utils"

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
    <section id="certifications" className="relative overflow-hidden bg-slate-50 py-24 px-4 transition-colors duration-300 dark:bg-[#020617]">
      <div className="pointer-events-none absolute inset-x-0 top-24 h-64 bg-gradient-to-b from-blue-400/15 to-transparent blur-3xl dark:from-cyan-500/10" />
      <div className="relative mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-14 text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-1 text-xs font-semibold uppercase tracking-widest text-indigo-700 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-violet-200/90">
            <Award className="h-3.5 w-3.5" />
            Credentials
          </div>
          <h2 className="mb-4 text-4xl font-bold text-slate-900 dark:text-white md:text-5xl">
            Certifications <span className="text-slate-500">&</span>{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-violet-300 dark:to-cyan-300">Achievements</span>
          </h2>
          <p className="mx-auto max-w-2xl text-slate-600 dark:text-slate-400">
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
            <div className="mb-6 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
              <Sparkles className="h-4 w-4 text-cyan-300" />
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
                    "group relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br p-[1px] shadow-md shadow-slate-200/70 transition duration-300 hover:-translate-y-0.5 hover:scale-[1.01] hover:shadow-lg dark:border-white/10 dark:shadow-lg dark:shadow-black/40",
                    cert.accent,
                  )}
                >
                  <div className="flex h-full flex-col rounded-[15px] bg-white p-5 backdrop-blur-xl dark:bg-[#050816]/95">
                    <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                      <Award className="h-3.5 w-3.5 text-blue-500 dark:text-cyan-300" />
                      {cert.category}
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-slate-900 transition group-hover:text-blue-700 dark:text-white dark:group-hover:text-cyan-100">{cert.title}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{cert.issuer}</p>
                    {typeof cert.hours === "number" && (
                      <p className="mt-3 text-xs font-medium uppercase tracking-widest text-indigo-700 dark:text-violet-200/90">{cert.hours} hours</p>
                    )}
                    {(cert.credentialUrl || cert.pdfUrl) && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {cert.credentialUrl && (
                          <a
                            href={cert.credentialUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-full border border-blue-300 bg-blue-50 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-blue-700 transition hover:border-blue-500 hover:bg-blue-100 dark:border-cyan-400/40 dark:bg-cyan-500/10 dark:text-cyan-200 dark:hover:bg-cyan-500/20"
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
                            className="inline-flex items-center gap-1.5 rounded-full border border-indigo-300 bg-indigo-50 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-indigo-700 transition hover:border-indigo-500 hover:bg-indigo-100 dark:border-violet-400/40 dark:bg-violet-500/10 dark:text-violet-200 dark:hover:bg-violet-500/20"
                          >
                            <FileText className="h-3.5 w-3.5" />
                            View PDF
                          </a>
                        )}
                      </div>
                    )}
                    <div className="mt-6 h-px w-full bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-white/15" />
                    <p className="mt-4 text-[11px] uppercase tracking-widest text-slate-500">Verified credential</p>
                  </div>
                </motion.article>
              ))}
            </div>

            <div className="mt-16">
              <div className="mb-6 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                <Trophy className="h-4 w-4 text-amber-300" />
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
                    className="relative overflow-hidden rounded-2xl border border-indigo-300/30 bg-gradient-to-br from-white via-slate-50 to-indigo-50 p-6 shadow-md shadow-slate-200/70 transition duration-300 hover:-translate-y-0.5 hover:scale-[1.01] hover:shadow-lg dark:border-amber-400/20 dark:from-amber-500/10 dark:via-[#050816] dark:to-violet-500/10 dark:shadow-none"
                  >
                    <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-amber-400/10 blur-2xl" />
                    <div className="relative flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-400/15 text-amber-200">
                        <Trophy className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{item.title}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-300">{item.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  )
}

export default Certifications
