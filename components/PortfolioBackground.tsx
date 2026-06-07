"use client"

const PortfolioBackground = () => {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[#080c12]" />

      <div className="absolute -left-32 top-[-12%] h-[520px] w-[520px] rounded-full bg-[#27cbcb]/20 blur-[120px]" />
      <div className="absolute right-[-10%] top-[18%] h-[460px] w-[460px] rounded-full bg-[#26d868]/15 blur-[110px]" />
      <div className="absolute bottom-[-8%] left-[28%] h-[500px] w-[500px] rounded-full bg-[#80978f]/10 blur-[130px]" />

      <div className="absolute inset-0 bg-gradient-to-b from-[#080c12]/20 via-transparent to-[#080c12]/90" />
    </div>
  )
}

export default PortfolioBackground
