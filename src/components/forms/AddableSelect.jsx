import { useState } from "react"

const AddableSelect = ({
  label,
  options,
  value,
  onChange,
  onAdd,
  placeholder = "Select",
  allowAdd = true,
  bilingual = true
}) => {
  const [adding, setAdding] = useState(false)
  const [custom, setCustom] = useState("")
  const [customAr, setCustomAr] = useState("")
  const [customEn, setCustomEn] = useState("")

  const handleSelect = (event) => {
    const next = event.target.value
    if (next === "__add__") {
      setAdding(true)
      return
    }
    onChange(next)
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
    onChange(next)
    setCustom("")
    setCustomAr("")
    setCustomEn("")
    setAdding(false)
  }

  return (
    <div className="space-y-2">
      {label ? <label className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-slate">{label}</label> : null}
      <select
        className="w-full rounded-2xl border border-white/40 bg-white/80 px-4 py-3 text-sm"
        value={value || ""}
        onChange={handleSelect}
      >
        <option value="">{placeholder}</option>
        {options.map((option, index) => (
          <option key={`${option}-${index}`} value={option}>{option}</option>
        ))}
        {allowAdd ? <option value="__add__">+ Add New</option> : null}
      </select>
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

export default AddableSelect
