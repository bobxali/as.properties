import { Link, NavLink } from "react-router-dom"
import { useLanguage } from "../hooks/useLanguage"

const LanguageToggle = () => {
  const { lang, setLang } = useLanguage()
  const options = ["en", "ar", "fr"]

  return (
    <div className="flex items-center gap-2 rounded-full border border-white/30 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => setLang(option)}
          className={`rounded-full px-2 py-1 transition ${
            option === lang ? "bg-brand-navy text-white" : "text-brand-slate hover:text-brand-navy"
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  )
}

const Navbar = () => {
  const { t } = useLanguage()
  const logoSrc = "/as-logo.png"

  return (
    <header className="sticky top-0 z-30 bg-gradient-to-r from-[#0e0f12] via-[#151821] to-[#1c202a] text-white backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-3">
          <img
            src={logoSrc}
            alt="AS.Properties logo"
            className="h-16 w-auto md:h-20"
            onError={(event) => {
              event.currentTarget.src = "/logo.png"
            }}
          />
          <span className="sr-only">AS.Properties</span>
          <div>
            <div className="logo-text text-base uppercase tracking-[0.28em] text-brand-silver md:text-lg">AS.Properties</div>
            <div className="text-[11px] uppercase tracking-[0.35em] text-brand-silver md:text-xs">Lebanon</div>
          </div>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-semibold uppercase tracking-[0.2em] md:flex">
          <NavLink to="/" className="transition hover:text-brand-gold">{t("nav.home")}</NavLink>
          <NavLink to="/listings" className="transition hover:text-brand-gold">{t("nav.listings")}</NavLink>
          <NavLink to="/admin" className="transition hover:text-brand-gold">{t("nav.admin")}</NavLink>
        </nav>
        <div className="flex items-center gap-3">
          <LanguageToggle />
          <a
            href="#contact"
            className="hidden rounded-full border border-brand-gold px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold transition hover:bg-brand-gold hover:text-brand-charcoal md:inline"
          >
            {t("nav.contact")}
          </a>
        </div>
      </div>
    </header>
  )
}

export default Navbar
