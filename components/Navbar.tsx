"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FileText, Menu, X } from "lucide-react"
import { profile } from "@/lib/constants/profile"
import { pageContainerClass } from "@/components/PageContainer"
import { ResumeDialog } from "@/components/ResumeDialog"
import { cn } from "@/lib/utils"

const SCROLL_BG_THRESHOLD = 48
const HIDE_SCROLL_THRESHOLD = 120

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("home")
  const [scrolled, setScrolled] = useState(false)
  const [visible, setVisible] = useState(true)
  const lastScrollY = useRef(0)

  const navItems = useMemo(
    () =>
      [
        { label: "home", href: "#home" },
        { label: "about", href: "#about" },
        { label: "projects", href: "#projects" },
        { label: "certs", href: "#certifications" },
        { label: "skills", href: "#skills" },
        { label: "contact", href: "#contact" },
      ] as const,
    [],
  )

  const logoSlug = profile.name.split(" ")[0].toLowerCase()

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY
      setScrolled(currentY > SCROLL_BG_THRESHOLD)

      if (currentY <= HIDE_SCROLL_THRESHOLD) {
        setVisible(true)
      } else if (currentY > lastScrollY.current + 6) {
        setVisible(false)
        setIsOpen(false)
      } else if (currentY < lastScrollY.current - 6) {
        setVisible(true)
      }

      lastScrollY.current = currentY

      const scrollPosition = currentY + 120
      for (const item of navItems) {
        const section = item.href.substring(1)
        const element = document.getElementById(section)
        if (!element) continue

        const offsetTop = element.offsetTop
        const offsetHeight = element.offsetHeight
        if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
          setActiveSection(section)
          break
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
    <motion.header
      initial={{ y: -80 }}
      animate={{ y: visible ? 0 : -96 }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500 ${
        scrolled
          ? "border-b border-white/[0.06] bg-[#0a0c10]/90 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav className={cn(pageContainerClass, "flex h-[4.25rem] items-center justify-between")}>
        <button
          type="button"
          onClick={() => scrollToSection("#home")}
          className="font-mono text-[15px] text-slate-400 transition-colors hover:text-white sm:text-base"
        >
          {`<${logoSlug}>`}
        </button>

        <div className="hidden items-center gap-7 md:flex">
          {navItems.map((item) => {
            const sectionId = item.href.substring(1)
            const isActive = activeSection === sectionId

            return (
              <button
                key={item.label}
                type="button"
                onClick={() => scrollToSection(item.href)}
                className={`relative font-mono text-[15px] transition-colors duration-300 sm:text-base ${
                  isActive
                    ? "text-[#27cbcb]"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {`/${item.label}`}
                {isActive && (
                  <motion.span
                    layoutId="navUnderline"
                    className="absolute -bottom-1 left-0 right-0 h-px bg-[#27cbcb]"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
              </button>
            )
          })}
          <ResumeDialog>
            <button
              type="button"
              className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-[#26d868]/40 bg-[#26d868]/10 px-4 py-1.5 font-mono text-[13px] font-semibold text-[#26d868] transition hover:bg-[#26d868]/20"
            >
              <FileText size={14} />
              Resume
            </button>
          </ResumeDialog>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="text-slate-300 transition hover:text-[#27cbcb] md:hidden"
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-white/10 bg-[#0a0c10]/95 backdrop-blur-md md:hidden"
          >
            <div className={cn(pageContainerClass, "space-y-1 py-3")}>
              {navItems.map((item) => {
                const sectionId = item.href.substring(1)
                const isActive = activeSection === sectionId

                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => scrollToSection(item.href)}
                    className={`block w-full rounded-lg px-2 py-2.5 text-left font-mono text-[15px] transition sm:text-base ${
                      isActive
                        ? "text-[#27cbcb]"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {`/${item.label}`}
                  </button>
                )
              })}
              <ResumeDialog>
                <button
                  type="button"
                  className="mt-2 flex w-full cursor-pointer items-center gap-2 rounded-lg border border-[#26d868]/40 bg-[#26d868]/10 px-2 py-2.5 font-mono text-[15px] text-[#26d868] transition hover:bg-[#26d868]/20"
                >
                  <FileText size={16} />
                  Resume
                </button>
              </ResumeDialog>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}

export default Navbar
