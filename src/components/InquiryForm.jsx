import { useState } from "react"
import { useLanguage } from "../hooks/useLanguage"
import { api } from "../lib/api"

const InquiryForm = ({ propertyTitle, propertyId }) => {
  const { t } = useLanguage()
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
    const result = await api.saveInquiry({
      ...form,
      propertyTitle,
      propertyId,
      status: "New",
      createdAt: new Date().toISOString()
    })
    setStatus(result?.via === "local" ? t("inquiry.savedLocal") : t("inquiry.sent"))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-3xl border border-white/40 bg-white/80 p-6">
      <div className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-slate">{t("inquiry.title")}</div>
      <input
        className="w-full rounded-2xl border border-white/40 bg-white/80 px-4 py-3 text-sm"
        placeholder={t("inquiry.name")}
        value={form.name}
        onChange={(event) => handleChange("name", event.target.value)}
        required
      />
      <input
        className="w-full rounded-2xl border border-white/40 bg-white/80 px-4 py-3 text-sm"
        placeholder={t("inquiry.phone")}
        value={form.phone}
        onChange={(event) => handleChange("phone", event.target.value)}
        required
      />
      <input
        className="w-full rounded-2xl border border-white/40 bg-white/80 px-4 py-3 text-sm"
        placeholder={t("inquiry.email")}
        value={form.email}
        onChange={(event) => handleChange("email", event.target.value)}
      />
      <textarea
        className="w-full rounded-2xl border border-white/40 bg-white/80 px-4 py-3 text-sm"
        rows="3"
        placeholder={t("inquiry.message")}
        value={form.message}
        onChange={(event) => handleChange("message", event.target.value)}
      />
      <select
        className="w-full rounded-2xl border border-white/40 bg-white/80 px-4 py-3 text-sm"
        value={form.preferredContact}
        onChange={(event) => handleChange("preferredContact", event.target.value)}
      >
        <option>{t("listing.whatsapp")}</option>
        <option>{t("inquiry.preferredCall")}</option>
        <option>{t("inquiry.preferredEmail")}</option>
      </select>
      <input
        type="datetime-local"
        className="w-full rounded-2xl border border-white/40 bg-white/80 px-4 py-3 text-sm"
        value={form.appointment}
        onChange={(event) => handleChange("appointment", event.target.value)}
      />
      <button className="w-full rounded-2xl bg-brand-navy px-4 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white">
        {t("inquiry.submit")}
      </button>
      {status ? <div className="text-xs text-brand-navy">{status}</div> : null}
    </form>
  )
}

export default InquiryForm
