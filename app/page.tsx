"use client"

import Navbar from "@/components/Navbar"
import Hero from "@/components/Hero"
import About from "@/components/About"
import Projects from "@/components/Projects"
import Certifications from "@/components/Certifications"
import Skills from "@/components/Skills"
import Contact from "@/components/Contact"
import Footer from "@/components/Footer"

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-[#020617] dark:text-white">
      <Navbar />
      <Hero />
      <About />
      <Projects />
      <Certifications />
      <Skills />
      <Contact />
      <Footer />
    </main>
  )
}
