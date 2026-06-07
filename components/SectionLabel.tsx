type SectionLabelProps = {
  label: string
}

const SectionLabel = ({ label }: SectionLabelProps) => {
  return (
    <div className="mb-10 flex items-center gap-4">
      <span className="shrink-0 font-mono text-sm text-[#27cbcb]">{`/${label}`}</span>
      <div className="h-px flex-1 bg-white/10" />
    </div>
  )
}

export default SectionLabel
