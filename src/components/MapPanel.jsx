const MapPanel = ({ pins = [] }) => {
  return (
    <div className="relative h-80 overflow-hidden rounded-3xl border border-white/40 bg-gradient-to-br from-white via-white to-brand-sand">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(26,35,126,0.2),transparent_60%)]" />
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=1600&auto=format&fit=crop')] bg-cover bg-center opacity-30" />
      <div className="absolute inset-0 bg-brand-charcoal/5" />
      <div className="relative p-6">
        <div className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-navy">Interactive map</div>
        <div className="mt-2 text-sm text-brand-slate">Pinned properties across Beirut and the coast.</div>
      </div>
      {pins.map((pin, index) => (
        <div
          key={pin.id}
          className="absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-brand-gold shadow"
          style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
          title={pin.label}
        />
      ))}
      <div className="absolute bottom-4 right-4 rounded-full bg-white/80 px-4 py-2 text-xs text-brand-slate">Map view</div>
    </div>
  )
}

export default MapPanel
