import { Route, Routes } from "react-router-dom"
import Layout from "./components/Layout"
import Home from "./pages/Home"
import Listings from "./pages/Listings"
import PropertyDetail from "./pages/PropertyDetail"
import InvestInLebanon from "./pages/InvestInLebanon"
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
        <Route path="/invest-in-lebanon" element={<InvestInLebanon />} />
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
        <Route
          path="/admin/properties/:id/edit"
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
