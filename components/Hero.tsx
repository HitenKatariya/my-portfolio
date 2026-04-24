"use client"

import { useRef, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { motion } from "framer-motion"
import type * as THREE from "three"
import { useTheme } from "next-themes"
import { profile } from "@/lib/constants/profile"

const CoreLattice = () => {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!groupRef.current) return
    groupRef.current.rotation.y += 0.004
    groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.35) * 0.12
  })

  return (
    <group ref={groupRef}>
      <mesh>
        <torusKnotGeometry args={[1.35, 0.38, 160, 18]} />
        <meshStandardMaterial color="#22d3ee" emissive="#0ea5e9" emissiveIntensity={0.35} metalness={0.85} roughness={0.18} wireframe />
      </mesh>
      <mesh scale={1.08}>
        <icosahedronGeometry args={[1.05, 1]} />
        <meshStandardMaterial color="#a855f7" emissive="#7c3aed" emissiveIntensity={0.2} metalness={0.6} roughness={0.35} transparent opacity={0.22} />
      </mesh>
    </group>
  )
}

const DataNodes = () => {
  const nodes = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        position: [(Math.random() - 0.5) * 14, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10] as [number, number, number],
        scale: Math.random() * 0.12 + 0.05,
      })),
    [],
  )

  return (
    <>
      {nodes.map((node, i) => (
        <mesh key={i} position={node.position} scale={node.scale}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={0.6} />
        </mesh>
      ))}
    </>
  )
}

const Hero = () => {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme !== "light"

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-slate-100 to-white transition-colors duration-300 dark:from-[#030712] dark:to-[#030712]"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-blue-300/30 blur-[120px] dark:bg-cyan-500/20" />
        <div className="absolute bottom-0 right-0 h-[420px] w-[420px] translate-x-1/4 rounded-full bg-indigo-300/30 blur-[110px] dark:bg-violet-600/25" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(71,85,105,0.12)_1px,transparent_0)] [background-size:28px_28px] opacity-60 dark:bg-[radial-gradient(circle_at_1px_1px,rgba(148,163,184,0.12)_1px,transparent_0)] dark:opacity-70" />
      </div>

      <div className="absolute inset-0 z-0 opacity-80 dark:opacity-90">
        <Canvas camera={{ position: [0, 0, 9], fov: 55 }}>
          <color attach="background" args={[isDark ? "#030712" : "#f8fafc"]} />
          <ambientLight intensity={0.35} />
          <pointLight position={[8, 8, 8]} intensity={1.1} color="#67e8f9" />
          <pointLight position={[-8, -6, -4]} intensity={0.55} color="#c084fc" />
          <CoreLattice />
          <DataNodes />
        </Canvas>
      </div>

      <div className="relative z-10 max-w-5xl px-4 text-center">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }}>
          <motion.h1
            className="mb-5 text-5xl font-bold tracking-tight text-slate-900 md:text-7xl dark:text-white"
            initial={{ scale: 0.92 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.75, delay: 0.1 }}
          >
            <span className="bg-gradient-to-r from-blue-700 via-slate-800 to-indigo-700 bg-clip-text text-transparent dark:from-cyan-200 dark:via-white dark:to-violet-200">
              {profile.name}
            </span>
          </motion.h1>
          <motion.p
            className="mx-auto mb-4 max-w-2xl text-lg text-slate-700 md:text-2xl dark:text-slate-200/90"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.25 }}
          >
            {profile.role}
          </motion.p>
          <motion.p
            className="mx-auto mb-10 max-w-2xl text-sm text-slate-600 md:text-base dark:text-slate-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.35 }}
          >
            MERN · AI/ML · Cloud · Security-minded architecture. Built for clarity, speed, and real-world deployability.
          </motion.p>
          <motion.div
            className="flex flex-wrap items-center justify-center gap-3"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
          >
            <button
              type="button"
              onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
              className="rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/30 dark:from-cyan-500 dark:to-violet-500 dark:shadow-cyan-500/25 dark:hover:shadow-cyan-500/35"
            >
              Explore projects
            </button>
            <button
              type="button"
              onClick={() => document.getElementById("certifications")?.scrollIntoView({ behavior: "smooth" })}
              className="rounded-full border border-slate-300 bg-white px-8 py-3 text-sm font-semibold text-slate-800 shadow-sm backdrop-blur transition duration-300 hover:scale-[1.02] hover:border-blue-500/50 hover:bg-blue-50 hover:shadow-md dark:border-white/15 dark:bg-white/5 dark:text-white dark:hover:border-cyan-400/50 dark:hover:bg-white/10"
            >
              Certifications
            </button>
            <a
              href={profile.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-blue-300 bg-blue-50 px-8 py-3 text-sm font-semibold text-blue-700 backdrop-blur transition duration-300 hover:scale-[1.02] hover:border-blue-600/70 hover:bg-blue-100 hover:shadow-md dark:border-cyan-300/30 dark:bg-cyan-500/10 dark:text-cyan-100 dark:hover:border-cyan-200/70 dark:hover:bg-cyan-500/20"
            >
              Resume
            </a>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
      >
        <div className="flex h-10 w-6 justify-center rounded-full border border-slate-400/40 dark:border-white/25">
          <div className="mt-2 h-2 w-1 rounded-full bg-slate-600/70 dark:bg-white/60" />
        </div>
      </motion.div>
    </section>
  )
}

export default Hero
