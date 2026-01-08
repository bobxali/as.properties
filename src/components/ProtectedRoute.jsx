import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"

const ProtectedRoute = ({ children }) => {
  const { session, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return <div className="mx-auto w-full max-w-6xl px-6 py-20 text-center text-sm text-brand-slate">Loading...</div>
  }

  if (!session) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />
  }

  return children
}

export default ProtectedRoute
