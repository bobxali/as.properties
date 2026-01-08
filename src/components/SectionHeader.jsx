const SectionHeader = ({
  eyebrow,
  title,
  subtitle,
  align = "left",
  className = "",
  titleClass = "",
  subtitleClass = ""
}) => {
  const alignClass = align === "center" ? "text-center" : "text-left"
  return (
    <div className={`space-y-3 ${alignClass} ${className}`.trim()}>
      {eyebrow ? (
        <div className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-gold">{eyebrow}</div>
      ) : null}
      <h2 className={`text-3xl font-semibold text-brand-charcoal md:text-4xl ${titleClass}`.trim()}>{title}</h2>
      {subtitle ? (
        <p className={`text-sm text-brand-slate md:text-base ${subtitleClass}`.trim()}>{subtitle}</p>
      ) : null}
    </div>
  )
}

export default SectionHeader
