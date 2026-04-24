"use client"

import { useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { motion } from "framer-motion"
import type * as THREE from "three"

const SkillOrb = ({ position, color }: { position: [number, number, number]; color: string }) => {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!meshRef.current) return
    meshRef.current.rotation.y += 0.012
    meshRef.current.position.x = position[0] + Math.sin(state.clock.elapsedTime + position[0]) * 0.35
    meshRef.current.position.z = position[2] + Math.cos(state.clock.elapsedTime + position[2]) * 0.35
  })

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.55, 28, 28]} />
      <meshStandardMaterial color={color} metalness={0.75} roughness={0.22} emissive={color} emissiveIntensity={0.18} />
    </mesh>
  )
}

const SkillsOrbit = () => {
  const nodes = [
    { color: "#22d3ee", position: [2.4, 0.4, 0] as [number, number, number] },
    { color: "#a855f7", position: [-2.4, -0.2, 0] as [number, number, number] },
    { color: "#34d399", position: [0, 0.6, 2.2] as [number, number, number] },
    { color: "#f97316", position: [0, -0.6, -2.2] as [number, number, number] },
    { color: "#38bdf8", position: [1.6, 1.3, 1.4] as [number, number, number] },
    { color: "#e879f9", position: [-1.7, -1.2, -1.3] as [number, number, number] },
  ]

  return (
    <>
      {nodes.map((node) => (
        <SkillOrb key={`${node.position.join("-")}`} position={node.position} color={node.color} />
      ))}
    </>
  )
}

const Skills = () => {
  const skillCategories = [
    {
      title: "Frontend",
      icon: "⚛️",
      skills: ["React 19", "Vite", "Redux + Thunk", "TailwindCSS", "Responsive UX", "Design systems"],
    },
    {
      title: "Backend & APIs",
      icon: "🛰️",
      skills: ["Node.js", "Express", "REST design", "JWT auth", "MongoDB + Mongoose", "FastAPI"],
    },
    {
      title: "AI / ML",
      icon: "🤖",
      skills: ["Model integration", "HF Inference", "Prompt + caption pipelines", "Image gen (SDXL)", "Evaluation mindset"],
    },
    {
      title: "Cloud & Security",
      icon: "☁️",
      skills: ["AWS VPC patterns", "EC2 tiers", "DevOps basics", "Secrets hygiene", "Cryptography awareness"],
    },
  ]

  return (
    <section
      id="skills"
      className="relative overflow-hidden bg-gradient-to-b from-white to-slate-100 py-24 px-4 transition-colors duration-300 dark:from-[#030712] dark:to-[#020617]"
    >
      <div className="pointer-events-none absolute inset-x-0 top-10 h-48 bg-gradient-to-b from-indigo-300/25 to-transparent blur-3xl dark:from-violet-500/15" />
      <div className="relative mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.75 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-4xl font-bold text-slate-900 dark:text-white md:text-5xl">
            Skills <span className="bg-gradient-to-r from-cyan-300 to-violet-300 bg-clip-text text-transparent">&amp; stack</span>
          </h2>
          <div className="mx-auto mb-6 h-1 w-24 rounded-full bg-gradient-to-r from-cyan-400 to-violet-500" />
          <p className="mx-auto max-w-2xl text-lg text-slate-600 dark:text-slate-400">
            A concise map of the tools I reach for when shipping full-stack products, AI features, and cloud-ready systems.
          </p>
        </motion.div>

        <div className="mb-16 h-80">
          <Canvas camera={{ position: [0, 0, 7.5], fov: 55 }}>
            <ambientLight intensity={0.45} />
            <pointLight position={[8, 8, 6]} intensity={1} color="#67e8f9" />
            <pointLight position={[-8, -6, -4]} intensity={0.55} color="#c084fc" />
            <SkillsOrbit />
          </Canvas>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {skillCategories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: index * 0.06 }}
              viewport={{ once: true }}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md shadow-slate-200/70 backdrop-blur transition hover:border-blue-400/40 hover:shadow-lg dark:border-white/10 dark:bg-white/[0.03] dark:shadow-lg dark:shadow-black/30 dark:hover:border-cyan-400/40 dark:hover:bg-white/[0.05]"
              whileHover={{ y: -4 }}
            >
              <div className="mb-4 text-center text-3xl">{category.icon}</div>
              <h3 className="mb-4 text-center text-lg font-semibold text-slate-900 dark:text-white">{category.title}</h3>
              <ul className="space-y-2">
                {category.skills.map((skill) => (
                  <li key={skill} className="flex items-center text-sm text-slate-700 dark:text-slate-300">
                    <span className="mr-3 h-1.5 w-1.5 rounded-full bg-cyan-400" />
                    {skill}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Skills
