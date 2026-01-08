import { Route, Routes } from "react-router-dom"
import Layout from "./components/Layout"
import Home from "./pages/Home"
import Listings from "./pages/Listings"
import PropertyDetail from "./pages/PropertyDetail"
import AdminDashboard from "./pages/AdminDashboard"
import AdminWizard from "./pages/AdminWizard"
import AdminLogin from "./pages/AdminLogin"
import ProtectedRoute from "./components/ProtectedRoute"

const App = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/listings" element={<Listings />} />
        <Route path="/properties/:id" element={<PropertyDetail />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/new"
          element={
            <ProtectedRoute>
              <AdminWizard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Layout>
  )
}

export default App
