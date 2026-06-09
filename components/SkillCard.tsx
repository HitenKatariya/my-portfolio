"use client"

import { type ElementType } from "react"
import { motion } from "framer-motion"

type SkillCardProps = {
  name: string
  logoSvg: ElementType
  index: number
}

const SkillCard = ({ name, logoSvg: Logo, index }: SkillCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -12, scale: 0.95 }}
      transition={{ duration: 0.35, delay: index * 0.035, ease: "easeOut" }}
      layout
      className="group relative"
    >
      <div className="relative rounded-2xl border border-white/[0.06] bg-[#101318]/80 p-5 backdrop-blur-xl transition-all duration-500 ease-out hover:-translate-y-1.5 hover:border-[#27cbcb]/30 sm:rounded-3xl sm:p-6">
        <div className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-br from-[#27cbcb]/0 via-transparent to-[#27cbcb]/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 sm:rounded-3xl" />
        <div className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 shadow-[0_0_24px_-4px_rgba(39,203,203,0.15)] transition-opacity duration-500 group-hover:opacity-100 sm:rounded-3xl" />

        <div className="relative flex flex-col items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center transition-transform duration-500 ease-out group-hover:scale-110 sm:h-16 sm:w-16">
            <Logo />
          </div>
          <span className="text-center text-[11px] font-medium text-slate-400 transition-colors duration-300 group-hover:text-white sm:text-xs">
            {name}
          </span>
        </div>
      </div>
    </motion.div>
  )
}

export default SkillCard
