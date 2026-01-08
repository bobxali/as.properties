const StepIndicator = ({ steps, current }) => {
  const progress = Math.round(((current + 1) / steps.length) * 100)

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        {steps.map((step, index) => (
          <div
            key={step}
            className={`step-pill ${index === current ? "bg-brand-navy text-white" : "text-brand-slate"}`}
          >
            {step}
          </div>
        ))}
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-white/60">
        <div className="h-full rounded-full bg-brand-gold" style={{ width: `${progress}%` }} />
      </div>
    </div>
  )
}

export default StepIndicator
