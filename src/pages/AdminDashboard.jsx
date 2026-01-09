import { Link, useNavigate } from "react-router-dom"
import { useEffect, useMemo, useRef, useState } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts"
import SectionHeader from "../components/SectionHeader"
import StatCard from "../components/StatCard"
import CustomOptionsManager from "../components/forms/CustomOptionsManager"
import { analyticsMock, inquiriesMock, sampleProperties } from "../data/mock"
import { supabase } from "../lib/supabase"
import { api } from "../lib/api"

const AdminDashboard = () => {
  const colors = ["#1a237e", "#c9a45c", "#3f51b5", "#9aa0a6"]
  const navigate = useNavigate()
  const [properties, setProperties] = useState([])
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [toast, setToast] = useState(null)
  const toastTimer = useRef(null)

  useEffect(() => {
    const load = async () => {
      const data = await api.listProperties()
      const normalized = (data || []).map((item, index) => ({
        id: item.id || `prop-${index}`,
        title: item.title || "Untitled listing",
        location: item.location || "Lebanon",
        price: Number(item.price || 0),
        currency: item.currency || "USD",
        status: item.status || "Available",
        created_at: item.created_at || item.createdAt || ""
      }))
      setProperties(normalized)
    }
    load()
  }, [])

  const filteredListings = useMemo(() => {
    return properties.filter((item) => {
      if (statusFilter !== "All" && item.status !== statusFilter) return false
      if (search) {
        const haystack = `${item.title} ${item.location} ${item.currency} ${item.price}`.toLowerCase()
        if (!haystack.includes(search.toLowerCase())) return false
      }
      return true
    })
  }, [properties, search, statusFilter])

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut()
    }
    navigate("/admin/login")
  }

  const showToast = (type, message) => {
    setToast({ type, message })
    if (toastTimer.current) {
      clearTimeout(toastTimer.current)
    }
    toastTimer.current = setTimeout(() => setToast(null), 4000)
  }

  return (
    <section className="mx-auto w-full max-w-6xl space-y-8 px-6 py-12 text-base md:text-[15px]">
      {toast ? (
        <div
          className={`fixed right-6 top-6 z-50 rounded-2xl px-4 py-3 text-sm shadow-lg ${
            toast.type === "error" ? "bg-red-500 text-white" : "bg-emerald-500 text-white"
          }`}
        >
          {toast.message}
        </div>
      ) : null}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <SectionHeader
          eyebrow="Admin"
          title="Analytics Dashboard"
          subtitle="Monitor performance, inquiries, and traffic sources in real time."
        />
        <div className="flex flex-wrap items-center gap-3">
          <select className="rounded-2xl border border-white/40 bg-white/80 px-4 py-2 text-xs uppercase tracking-[0.2em] text-brand-slate">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>All time</option>
          </select>
          <Link
            to="/admin/new"
            className="rounded-2xl bg-brand-navy px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white"
          >
            + Add new listing
          </Link>
          <button
            className="rounded-2xl border border-brand-navy px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-navy"
            onClick={handleLogout}
          >
            Sign out
          </button>
        </div>
      </div>
      <div className="rounded-3xl border border-white/40 bg-white/80 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-slate">Listings management</div>
          <div className="flex flex-wrap items-center gap-2">
            <input
              className="rounded-2xl border border-white/40 bg-white/80 px-3 py-2 text-sm"
              placeholder="Search listings..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <select
              className="rounded-2xl border border-white/40 bg-white/80 px-3 py-2 text-sm"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option>All</option>
              <option>Available</option>
              <option>Reserved</option>
              <option>Sold</option>
              <option>Negotiation</option>
            </select>
            <button className="rounded-2xl border border-brand-gold px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-navy">
              Export CSV
            </button>
          </div>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead className="text-xs uppercase tracking-[0.2em] text-brand-slate">
              <tr className="border-b border-white/40">
                <th className="py-2 text-left">Title</th>
                <th className="py-2 text-left">Location</th>
                <th className="py-2 text-left">Price</th>
                <th className="py-2 text-left">Status</th>
                <th className="py-2 text-left">Created</th>
                <th className="py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredListings.length ? (
                filteredListings.map((item) => (
                  <tr key={item.id} className="border-b border-white/20">
                    <td className="py-3 pr-3 font-semibold text-brand-charcoal">{item.title}</td>
                    <td className="py-3 pr-3 text-brand-slate">{item.location}</td>
                    <td className="py-3 pr-3 text-brand-slate">
                      {item.currency} {item.price.toLocaleString()}
                    </td>
                    <td className="py-3 pr-3 text-brand-slate">{item.status}</td>
                    <td className="py-3 pr-3 text-brand-slate">
                      {item.created_at ? new Date(item.created_at).toLocaleDateString() : "-"}
                    </td>
                    <td className="py-3">
                      <div className="flex flex-wrap gap-2">
                        <button
                          className="rounded-full border border-brand-navy px-3 py-1 text-xs"
                          onClick={() => navigate("/admin/new", { state: { property: item } })}
                        >
                          Edit
                        </button>
                        <button
                          className="rounded-full border border-brand-gold px-3 py-1 text-xs"
                          onClick={async () => {
                            await api.duplicateProperty(item)
                            const refreshed = await api.listProperties()
                            setProperties(
                              refreshed.map((row, index) => ({
                                id: row.id || `prop-${index}`,
                                title: row.title || "Untitled listing",
                                location: row.location || "Lebanon",
                                price: Number(row.price || 0),
                                currency: row.currency || "USD",
                                status: row.status || "Available",
                                created_at: row.created_at || row.createdAt || ""
                              }))
                            )
                          }}
                        >
                          Duplicate
                        </button>
                        <button
                          className="rounded-full border border-red-500 px-3 py-1 text-xs text-red-500"
                          onClick={async () => {
                            if (!window.confirm("Delete this listing?")) return
                            try {
                              await api.deleteProperty(item.id)
                              setProperties((prev) => prev.filter((row) => row.id !== item.id))
                            } catch (error) {
                              showToast("error", error.message || "Delete failed. Check permissions.")
                            }
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-6 text-center text-brand-slate">
                    No listings found yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <CustomOptionsManager />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total visitors" value={analyticsMock.totalVisitors.toLocaleString()} change="+12% vs last 30 days" />
        <StatCard label="Unique visitors" value={analyticsMock.uniqueVisitors.toLocaleString()} change="+9%" />
        <StatCard label="Page views" value={analyticsMock.pageViews.toLocaleString()} change="+18%" />
        <StatCard label="Conversion rate" value={`${analyticsMock.conversionRate}%`} change="+0.4%" />
      </div>
      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <div className="rounded-3xl border border-white/40 bg-white/80 p-6">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-slate">Most viewed</div>
          <div className="mt-6 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsMock.viewsByProperty}>
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#1a237e" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-3xl border border-white/40 bg-white/80 p-6">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-slate">Traffic sources</div>
          <div className="mt-6 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={analyticsMock.trafficSources} dataKey="value" nameKey="name" outerRadius={90}>
                  {analyticsMock.trafficSources.map((entry, index) => (
                    <Cell key={entry.name} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-white/40 bg-white/80 p-6">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-slate">Inquiries per property</div>
          <div className="mt-4 space-y-3 text-sm">
            {analyticsMock.inquiriesByProperty.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="font-semibold text-brand-charcoal">{item.name}</div>
                <div className="text-xs text-brand-navy">{item.value}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-3xl border border-white/40 bg-white/80 p-6">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-slate">Popular searches</div>
          <div className="mt-4 space-y-3 text-sm">
            {analyticsMock.popularSearches.map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <div className="font-semibold text-brand-charcoal">{item.label}</div>
                <div className="text-xs text-brand-navy">{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-white/40 bg-white/80 p-6">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-slate">Latest inquiries</div>
          <div className="mt-4 space-y-3">
            {inquiriesMock.map((inq) => (
              <div key={inq.id} className="flex items-center justify-between rounded-2xl border border-white/40 bg-white/70 px-4 py-3 text-sm">
                <div>
                  <div className="font-semibold text-brand-charcoal">{inq.name}</div>
                  <div className="text-xs text-brand-slate">{inq.property}</div>
                </div>
                <div className="text-xs text-brand-navy">{inq.status}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-3xl border border-white/40 bg-white/80 p-6">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-slate">Top listings</div>
          <div className="mt-4 space-y-3 text-sm">
            {sampleProperties.map((property) => (
              <div key={property.id} className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-brand-charcoal">{property.title}</div>
                  <div className="text-xs text-brand-slate">{property.location}</div>
                </div>
                <div className="text-xs text-brand-navy">{property.views} views</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="rounded-3xl border border-white/40 bg-white/80 p-6">
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-slate">Inquiry management</div>
        <div className="mt-4 space-y-3 text-sm">
          {inquiriesMock.map((inq) => (
            <div key={inq.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/40 bg-white/70 px-4 py-3">
              <div>
                <div className="font-semibold text-brand-charcoal">{inq.name}</div>
                <div className="text-xs text-brand-slate">{inq.property}</div>
              </div>
              <div className="text-xs text-brand-slate">{inq.phone}</div>
              <div className="text-xs text-brand-navy">{inq.status}</div>
              <div className="flex gap-2 text-xs">
                <button className="rounded-full border border-brand-navy px-3 py-1">Contacted</button>
                <button className="rounded-full border border-brand-gold px-3 py-1">Scheduled</button>
                <button className="rounded-full border border-red-500 px-3 py-1">Closed</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default AdminDashboard
