const StatCard = ({ label, value, change }) => {
  return (
    <div className="rounded-3xl border border-white/40 bg-white/80 p-5">
      <div className="text-xs uppercase tracking-[0.2em] text-brand-slate">{label}</div>
      <div className="mt-2 text-2xl font-semibold text-brand-charcoal">{value}</div>
      {change ? <div className="mt-1 text-xs text-brand-navy">{change}</div> : null}
    </div>
  )
}

export default StatCard
