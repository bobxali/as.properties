import { useState } from "react"
import { api } from "../lib/api"

const InquiryForm = ({ propertyTitle }) => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
    preferredContact: "WhatsApp",
    appointment: ""
  })
  const [status, setStatus] = useState(null)

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    await api.saveInquiry({ ...form, property: propertyTitle, status: "New", createdAt: new Date().toISOString() })
    setStatus("Inquiry sent. We will contact you shortly.")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-3xl border border-white/40 bg-white/80 p-6">
      <div className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-slate">Send inquiry</div>
      <input
        className="w-full rounded-2xl border border-white/40 bg-white/80 px-4 py-3 text-sm"
        placeholder="Full name"
        value={form.name}
        onChange={(event) => handleChange("name", event.target.value)}
        required
      />
      <input
        className="w-full rounded-2xl border border-white/40 bg-white/80 px-4 py-3 text-sm"
        placeholder="Phone"
        value={form.phone}
        onChange={(event) => handleChange("phone", event.target.value)}
        required
      />
      <input
        className="w-full rounded-2xl border border-white/40 bg-white/80 px-4 py-3 text-sm"
        placeholder="Email"
        value={form.email}
        onChange={(event) => handleChange("email", event.target.value)}
      />
      <textarea
        className="w-full rounded-2xl border border-white/40 bg-white/80 px-4 py-3 text-sm"
        rows="3"
        placeholder="Message"
        value={form.message}
        onChange={(event) => handleChange("message", event.target.value)}
      />
      <select
        className="w-full rounded-2xl border border-white/40 bg-white/80 px-4 py-3 text-sm"
        value={form.preferredContact}
        onChange={(event) => handleChange("preferredContact", event.target.value)}
      >
        <option>WhatsApp</option>
        <option>Call</option>
        <option>Email</option>
      </select>
      <input
        type="datetime-local"
        className="w-full rounded-2xl border border-white/40 bg-white/80 px-4 py-3 text-sm"
        value={form.appointment}
        onChange={(event) => handleChange("appointment", event.target.value)}
      />
      <button className="w-full rounded-2xl bg-brand-navy px-4 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white">
        Submit inquiry
      </button>
      {status ? <div className="text-xs text-brand-navy">{status}</div> : null}
    </form>
  )
}

export default InquiryForm
