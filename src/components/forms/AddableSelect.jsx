import { useState } from "react"

const AddableSelect = ({
  label,
  options,
  value,
  onChange,
  onAdd,
  placeholder = "Select",
  allowAdd = true
}) => {
  const [adding, setAdding] = useState(false)
  const [custom, setCustom] = useState("")

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
    if (!trimmed) return
    onAdd?.(trimmed)
    onChange(trimmed)
    setCustom("")
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
        <div className="flex gap-2">
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
          <button
            type="button"
            className="rounded-2xl bg-brand-navy px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white"
            onClick={handleAdd}
          >
            Add
          </button>
        </div>
      ) : null}
    </div>
  )
}

export default AddableSelect
