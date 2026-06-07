"use client"

import Navbar from "@/components/Navbar"
import Hero from "@/components/Hero"
import About from "@/components/About"
import Projects from "@/components/Projects"
import Certifications from "@/components/Certifications"
import Skills from "@/components/Skills"
import Contact from "@/components/Contact"
import Footer from "@/components/Footer"
import PortfolioBackground from "@/components/PortfolioBackground"
import InteractiveGridCanvas from "@/components/InteractiveGridCanvas"

export default function Home() {
  return (
    <main className="relative isolate min-h-screen overflow-x-clip text-white">
      <PortfolioBackground />
      <InteractiveGridCanvas />
      <Navbar />
      <div className="relative z-10">
        <Hero />
        <About />
        <Projects />
        <Certifications />
        <Skills />
        <Contact />
        <Footer />
      </div>
    </main>
  )
}
