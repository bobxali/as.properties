import { useLocation } from "react-router-dom"
import Navbar from "./Navbar"
import Footer from "./Footer"
import { useLanguage } from "../hooks/useLanguage"
import { useEffect } from "react"

const Layout = ({ children }) => {
  const { dir } = useLanguage()
  const location = useLocation()

  useEffect(() => {
    document.documentElement.dir = dir
    document.body.classList.toggle("rtl", dir === "rtl")
  }, [dir])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [location.pathname])

  useEffect(() => {
    const elements = document.querySelectorAll(".reveal")
    if (!elements.length) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible")
          }
        })
      },
      { threshold: 0.2 }
    )
    elements.forEach((el) => {
      el.classList.add("is-visible")
      observer.observe(el)
    })
    return () => observer.disconnect()
  }, [location.pathname])

  return (
    <div className={dir === "rtl" ? "rtl" : ""}>
      <Navbar />
      <main className="min-h-screen">
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default Layout
