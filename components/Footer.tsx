"use client"

import { motion } from "framer-motion"
import { ArrowUp, Github, Instagram, Linkedin, Mail } from "lucide-react"
import { profile } from "@/lib/constants/profile"

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const socialLinks = [
    { icon: Linkedin, href: profile.social.find((s) => s.icon === "linkedin")?.href ?? "#", label: "LinkedIn" },
    { icon: Github, href: profile.social.find((s) => s.icon === "github")?.href ?? "#", label: "GitHub" },
    { icon: Instagram, href: profile.social.find((s) => s.icon === "instagram")?.href ?? "#", label: "Instagram" },
    { icon: Mail, href: `mailto:${profile.email}`, label: "Email" },
  ]

  const quick = [
    { label: "Home", id: "home" },
    { label: "About", id: "about" },
    { label: "Projects", id: "projects" },
    { label: "Certifications", id: "certifications" },
    { label: "Skills", id: "skills" },
    { label: "Contact", id: "contact" },
  ]

  return (
    <footer className="relative overflow-hidden bg-gradient-to-t from-black via-[#020617] to-[#030712] pb-10 pt-20">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-violet-500/10" />

      <div className="relative mx-auto max-w-6xl px-4">
        <div className="mb-12 grid gap-12 md:grid-cols-3">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55 }} className="space-y-4">
            <h3 className="text-2xl font-bold tracking-tight text-white">
              <span className="bg-gradient-to-r from-cyan-300 to-violet-300 bg-clip-text text-transparent">{profile.name}</span>
            </h3>
            <p className="text-sm font-medium text-cyan-100/90">{profile.role}</p>
            <p className="text-sm leading-relaxed text-slate-400">
              Full-stack engineering with an AI/ML lens — shipping products that are deployable, observable, and pleasant to use.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55, delay: 0.05 }} className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-widest text-slate-300">Explore</h4>
            <ul className="space-y-2">
              {quick.map((link) => (
                <li key={link.id}>
                  <motion.button
                    type="button"
                    onClick={() => document.getElementById(link.id)?.scrollIntoView({ behavior: "smooth" })}
                    className="text-sm text-slate-400 transition hover:text-cyan-200"
                    whileHover={{ x: 4 }}
                  >
                    {link.label}
                  </motion.button>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55, delay: 0.1 }} className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-widest text-slate-300">Capabilities</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>Product-grade MERN builds</li>
              <li>AI-assisted workflows</li>
              <li>AWS architecture studies</li>
              <li>Security-aware defaults</li>
            </ul>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.15 }}
          className="mb-10 flex justify-center gap-4"
        >
          {socialLinks.map((social) => (
            <motion.a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition hover:border-cyan-400/50 hover:text-white"
              whileHover={{ scale: 1.08, y: -2 }}
              whileTap={{ scale: 0.96 }}
            >
              <social.icon size={20} />
            </motion.a>
          ))}
        </motion.div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 md:flex-row">
          <p className="text-center text-xs text-slate-500 md:text-left">© {new Date().getFullYear()} {profile.name}. Built with Next.js, TypeScript, and Tailwind CSS.</p>
          <motion.button
            type="button"
            onClick={scrollToTop}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-cyan-400/30 bg-cyan-500/10 text-cyan-200 transition hover:bg-cyan-500/20"
            whileHover={{ scale: 1.06, y: -2 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Back to top"
          >
            <ArrowUp size={16} />
          </motion.button>
        </div>
      </div>
    </footer>
  )
}

export default Footer
