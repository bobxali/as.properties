import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { supabase } from "../lib/supabase"

const AdminLogin = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError(null)

    if (!supabase) {
      setError("Supabase is not configured. Add your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.")
      return
    }

    setLoading(true)
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)

    if (authError) {
      setError(authError.message)
      return
    }

    const redirectTo = location.state?.from || "/admin"
    navigate(redirectTo, { replace: true })
  }

  return (
    <section className="mx-auto w-full max-w-md px-6 py-16">
      <div className="rounded-3xl border border-white/40 bg-white/80 p-8 shadow-glow">
        <div className="logo-text text-xs uppercase tracking-[0.3em] text-brand-gold">AS.Properties</div>
        <h1 className="mt-3 text-2xl font-semibold text-brand-charcoal">Admin login</h1>
        <p className="mt-2 text-sm text-brand-slate">Sign in to manage listings and inquiries.</p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            type="email"
            className="w-full rounded-2xl border border-white/40 bg-white/80 px-4 py-3 text-sm"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
          <input
            type="password"
            className="w-full rounded-2xl border border-white/40 bg-white/80 px-4 py-3 text-sm"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
          <button
            className="w-full rounded-2xl bg-brand-navy px-4 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white"
            type="submit"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
        {error ? <div className="mt-3 text-xs text-red-500">{error}</div> : null}
      </div>
    </section>
  )
}

export default AdminLogin
