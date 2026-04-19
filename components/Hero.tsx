"use client"

import { useRef, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { motion } from "framer-motion"
import type * as THREE from "three"
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
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#030712]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-cyan-500/20 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-[420px] w-[420px] translate-x-1/4 rounded-full bg-violet-600/25 blur-[110px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(148,163,184,0.12)_1px,transparent_0)] [background-size:28px_28px] opacity-70" />
      </div>

      <div className="absolute inset-0 z-0 opacity-90">
        <Canvas camera={{ position: [0, 0, 9], fov: 55 }}>
          <color attach="background" args={["#030712"]} />
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
            className="mb-5 text-5xl font-bold tracking-tight text-white md:text-7xl"
            initial={{ scale: 0.92 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.75, delay: 0.1 }}
          >
            <span className="bg-gradient-to-r from-cyan-200 via-white to-violet-200 bg-clip-text text-transparent">{profile.name}</span>
          </motion.h1>
          <motion.p
            className="mx-auto mb-4 max-w-2xl text-lg text-slate-200/90 md:text-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.25 }}
          >
            {profile.role}
          </motion.p>
          <motion.p
            className="mx-auto mb-10 max-w-2xl text-sm text-slate-400 md:text-base"
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
              className="rounded-full bg-gradient-to-r from-cyan-500 to-violet-500 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/25 transition hover:brightness-110"
            >
              Explore projects
            </button>
            <button
              type="button"
              onClick={() => document.getElementById("certifications")?.scrollIntoView({ behavior: "smooth" })}
              className="rounded-full border border-white/15 bg-white/5 px-8 py-3 text-sm font-semibold text-white backdrop-blur transition hover:border-cyan-400/50 hover:bg-white/10"
            >
              Certifications
            </button>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
      >
        <div className="flex h-10 w-6 justify-center rounded-full border border-white/25">
          <div className="mt-2 h-2 w-1 rounded-full bg-white/60" />
        </div>
      </motion.div>
    </section>
  )
}

export default Hero
