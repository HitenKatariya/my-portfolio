"use client"

import { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X } from "lucide-react"
import { profile } from "@/lib/constants/profile"

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("home")

  const navItems = useMemo(
    () =>
      [
        { name: "Home", href: "#home" },
        { name: "About", href: "#about" },
        { name: "Projects", href: "#projects" },
        { name: "Certs", href: "#certifications" },
        { name: "Skills", href: "#skills" },
        { name: "Contact", href: "#contact" },
      ] as const,
    [],
  )

  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map((item) => item.href.substring(1))
      const scrollPosition = window.scrollY + 120

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const offsetTop = element.offsetTop
          const offsetHeight = element.offsetHeight

          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [navItems])

  const scrollToSection = (href: string) => {
    const id = href.substring(1)

    const performScroll = () => {
      if (id === "home") {
        window.scrollTo({ top: 0, behavior: "smooth" })
        setActiveSection("home")
        return
      }

      const element = document.getElementById(id)
      if (!element) return

      const navOffset = 76
      const top = element.getBoundingClientRect().top + window.scrollY - navOffset
      window.scrollTo({ top: Math.max(0, top), behavior: "smooth" })
      setActiveSection(id)
    }

    if (isOpen) {
      setIsOpen(false)
      window.setTimeout(performScroll, 180)
      return
    }

    performScroll()
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[#020617]/80 backdrop-blur-xl"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            onClick={() => scrollToSection("#home")}
            className="text-left text-lg font-bold tracking-tight text-white"
          >
            <span className="bg-gradient-to-r from-cyan-300 to-violet-300 bg-clip-text text-transparent">{profile.name}</span>
            <span className="ml-2 hidden text-xs font-medium text-slate-400 sm:inline">{profile.role}</span>
          </motion.button>

          <div className="hidden md:block">
            <div className="flex items-center gap-1">
              {navItems.map((item) => (
                <motion.button
                  key={item.name}
                  type="button"
                  onClick={() => scrollToSection(item.href)}
                  className={`relative rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-wide transition ${
                    activeSection === item.href.substring(1) ? "text-cyan-200" : "text-slate-300 hover:text-white"
                  }`}
                  whileHover={{ scale: 1.04 }}
                >
                  {item.name}
                  {activeSection === item.href.substring(1) && (
                    <motion.span
                      layoutId="navPill"
                      className="absolute inset-0 -z-10 rounded-full bg-white/5 ring-1 ring-cyan-400/30"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                </motion.button>
              ))}
            </div>
          </div>

          <div className="md:hidden">
            <button type="button" onClick={() => setIsOpen(!isOpen)} className="text-white transition hover:text-cyan-300" aria-label="Toggle menu">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-white/10 bg-[#020617]/95 backdrop-blur-xl md:hidden"
          >
            <div className="space-y-1 px-2 py-3">
              {navItems.map((item) => (
                <motion.button
                  key={item.name}
                  type="button"
                  onClick={() => scrollToSection(item.href)}
                  className={`block w-full rounded-xl px-3 py-3 text-left text-sm font-semibold uppercase tracking-wide transition ${
                    activeSection === item.href.substring(1) ? "bg-white/10 text-cyan-200" : "text-slate-200 hover:bg-white/5"
                  }`}
                  whileTap={{ scale: 0.98 }}
                >
                  {item.name}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

export default Navbar
