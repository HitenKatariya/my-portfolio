"use client"

import { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X } from "lucide-react"
import { useTheme } from "next-themes"
import { profile } from "@/lib/constants/profile"

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("home")
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme, setTheme } = useTheme()

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

  useEffect(() => {
    setMounted(true)
  }, [])

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
      className="fixed top-0 left-0 right-0 z-50 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl transition-colors duration-300 dark:border-white/10 dark:bg-[#020617]/80"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            onClick={() => scrollToSection("#home")}
            className="text-left text-lg font-bold tracking-tight text-slate-900 dark:text-white"
          >
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-cyan-300 dark:to-violet-300">
              {profile.name}
            </span>
            <span className="ml-2 hidden text-xs font-medium text-slate-500 dark:text-slate-400 sm:inline">{profile.role}</span>
          </motion.button>

          <div className="hidden md:block">
            <div className="flex items-center gap-1">
              {navItems.map((item) => (
                <motion.button
                  key={item.name}
                  type="button"
                  onClick={() => scrollToSection(item.href)}
                  className={`relative rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-wide transition ${
                    activeSection === item.href.substring(1)
                      ? "text-blue-700 dark:text-cyan-200"
                      : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                  }`}
                  whileHover={{ scale: 1.04 }}
                >
                  {item.name}
                  {activeSection === item.href.substring(1) && (
                    <motion.span
                      layoutId="navPill"
                      className="absolute inset-0 -z-10 rounded-full bg-slate-100 ring-1 ring-blue-500/30 dark:bg-white/5 dark:ring-cyan-400/30"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                </motion.button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Toggle theme"
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              className="group relative inline-flex h-11 w-24 items-center rounded-full border border-[#2b2d34] bg-[#17191f] p-1 shadow-[0_6px_18px_rgba(0,0,0,0.35)] transition-all duration-300"
            >
              <span className="flex w-full items-center justify-between px-2 text-[17px] leading-none">
                <span className={`transition-all duration-300 ${mounted && resolvedTheme === "dark" ? "scale-100 text-slate-300 opacity-90" : "scale-90 text-slate-500 opacity-45"}`}>
                  ☾
                </span>
                <span className={`transition-all duration-300 ${mounted && resolvedTheme === "dark" ? "scale-90 text-slate-500 opacity-45" : "scale-100 text-slate-300 opacity-90"}`}>
                  ☀
                </span>
              </span>
              <span
                className={`absolute top-1 h-9 w-9 rounded-full border border-[#5a61ff] bg-[#3f46da] text-white shadow-[0_5px_14px_rgba(63,70,218,0.55)] transition-all duration-300 ${
                  mounted && resolvedTheme === "dark"
                    ? "left-1"
                    : "left-[50px]"
                } flex items-center justify-center text-[19px]`}
              >
                {mounted && resolvedTheme === "dark" ? "☾" : "☀"}
              </span>
              <span className="sr-only">Toggle theme</span>
            </button>
          </div>

          <div className="md:hidden">
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-800 transition hover:text-blue-600 dark:text-white dark:hover:text-cyan-300"
              aria-label="Toggle menu"
            >
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
            className="border-t border-slate-200/80 bg-white/95 backdrop-blur-xl transition-colors duration-300 dark:border-white/10 dark:bg-[#020617]/95 md:hidden"
          >
            <div className="space-y-1 px-2 py-3">
              {navItems.map((item) => (
                <motion.button
                  key={item.name}
                  type="button"
                  onClick={() => scrollToSection(item.href)}
                  className={`block w-full rounded-xl px-3 py-3 text-left text-sm font-semibold uppercase tracking-wide transition ${
                    activeSection === item.href.substring(1)
                      ? "bg-blue-50 text-blue-700 dark:bg-white/10 dark:text-cyan-200"
                      : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/5"
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
