import { useState } from "react"

const AddableCheckboxGroup = ({ label, options, values, onChange, onAdd, bilingual = true }) => {
  const [adding, setAdding] = useState(false)
  const [custom, setCustom] = useState("")
  const [customAr, setCustomAr] = useState("")
  const [customEn, setCustomEn] = useState("")

  const toggleValue = (option) => {
    if (values.includes(option)) {
      onChange(values.filter((item) => item !== option))
    } else {
      onChange([...values, option])
    }
  }

  const handleAdd = () => {
    const trimmed = custom.trim()
    const ar = customAr.trim()
    const en = customEn.trim()
    if (bilingual && (!ar || !en)) {
      return
    }
    const next = bilingual ? `${ar} | ${en}` : trimmed
    if (!next) return
    onAdd?.(next)
    onChange([...values, next])
    setCustom("")
    setCustomAr("")
    setCustomEn("")
    setAdding(false)
  }

  return (
    <div className="space-y-3">
      {label ? <div className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-slate">{label}</div> : null}
      <div className="grid gap-3 md:grid-cols-2">
        {options.map((option) => (
          <label key={option} className="flex items-center gap-2 rounded-2xl border border-white/40 bg-white/80 px-4 py-2 text-base">
            <input
              type="checkbox"
              checked={values.includes(option)}
              onChange={() => toggleValue(option)}
            />
            <span>{option}</span>
          </label>
        ))}
        <button
          type="button"
          className="rounded-2xl border border-dashed border-brand-gold px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-navy"
          onClick={() => setAdding(true)}
        >
          + Add New
        </button>
      </div>
      {adding ? (
        <div className="space-y-2">
          {bilingual ? (
            <>
              <input
                className="w-full rounded-2xl border border-white/40 bg-white/80 px-4 py-2 text-sm"
                placeholder="Arabic value"
                value={customAr}
                onChange={(event) => setCustomAr(event.target.value)}
              />
              <input
                className="w-full rounded-2xl border border-white/40 bg-white/80 px-4 py-2 text-sm"
                placeholder="English value"
                value={customEn}
                onChange={(event) => setCustomEn(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault()
                    handleAdd()
                  }
                }}
              />
              <div className="text-[11px] text-brand-slate">Use “Arabic | English” format for bilingual values.</div>
            </>
          ) : (
            <input
              className="w-full rounded-2xl border border-white/40 bg-white/80 px-4 py-2 text-sm"
              placeholder="Type new option"
              value={custom}
              onChange={(event) => setCustom(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault()
                  handleAdd()
                }
              }}
            />
          )}
          <button
            type="button"
            className="rounded-2xl bg-brand-navy px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white disabled:cursor-not-allowed disabled:opacity-50"
            onClick={handleAdd}
            disabled={bilingual ? !customAr.trim() || !customEn.trim() : !custom.trim()}
          >
            Add
          </button>
        </div>
      ) : null}
    </div>
  )
}

export default AddableCheckboxGroup
