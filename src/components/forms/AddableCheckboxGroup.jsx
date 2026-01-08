import { useState } from "react"

const AddableCheckboxGroup = ({ label, options, values, onChange, onAdd }) => {
  const [adding, setAdding] = useState(false)
  const [custom, setCustom] = useState("")

  const toggleValue = (option) => {
    if (values.includes(option)) {
      onChange(values.filter((item) => item !== option))
    } else {
      onChange([...values, option])
    }
  }

  const handleAdd = () => {
    const trimmed = custom.trim()
    if (!trimmed) return
    onAdd?.(trimmed)
    onChange([...values, trimmed])
    setCustom("")
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

export default AddableCheckboxGroup
