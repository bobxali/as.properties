import { createContext, useContext, useEffect, useMemo, useState } from "react"
import { supabase } from "../lib/supabase"

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let subscription = null

    const init = async () => {
      if (!supabase) {
        setLoading(false)
        return
      }
      const { data } = await supabase.auth.getSession()
      setSession(data?.session ?? null)
      subscription = supabase.auth.onAuthStateChange((_event, nextSession) => {
        setSession(nextSession)
      })
      setLoading(false)
    }

    init()

    return () => {
      if (subscription?.data?.subscription) {
        subscription.data.subscription.unsubscribe()
      }
    }
  }, [])

  const value = useMemo(() => ({ session, loading }), [session, loading])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider")
  }
  return ctx
}
