import { Link } from "react-router-dom"
import { useLanguage } from "../hooks/useLanguage"

const Footer = () => {
  const { t } = useLanguage()
  const logoSrc = "/as-logo.png"

  return (
    <footer className="bg-brand-charcoal text-white">
      <div className="mx-auto grid w-full max-w-6xl gap-6 px-6 py-10 md:grid-cols-3">
        <div>
          <img
            src={logoSrc}
            alt="AS.Properties logo"
            className="h-16 w-auto"
            onError={(event) => {
              event.currentTarget.src = "/logo.png"
            }}
          />
          <span className="sr-only">AS.Properties</span>
          <p className="mt-4 text-sm text-brand-silver">
            {t("hero.subtitle")}
          </p>
        </div>
        <div id="contact">
          <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-gold">{t("footer.contact")}</h4>
          <div className="mt-3 space-y-2 text-sm text-brand-silver">
            <div>{t("footer.address")}</div>
            <div>{t("footer.phone")}</div>
            <a
              href="mailto:sayed2441999@gmail.com"
              className="inline-flex items-center gap-2"
            >
              {t("footer.email")}
            </a>
          </div>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-gold">{t("footer.social")}</h4>
          <div className="mt-3 flex flex-wrap gap-3 text-sm">
            <a
              href="https://instagram.com/as.properties.lb"
              className="rounded-full border border-white/20 px-4 py-2"
              target="_blank"
              rel="noreferrer"
            >
              {t("footer.instagram")}
            </a>
            <a
              href="https://www.facebook.com/asproperties.lb"
              className="rounded-full border border-white/20 px-4 py-2"
              target="_blank"
              rel="noreferrer"
            >
              {t("footer.facebook")}
            </a>
            <a
              href="https://wa.me/96171115980?text=Hi%20AS.Properties%2C%20I%20would%20like%20to%20know%20more."
              className="rounded-full border border-white/20 px-4 py-2"
              target="_blank"
              rel="noreferrer"
            >
              {t("footer.whatsapp")}
            </a>
            <Link
              to="/invest-in-lebanon"
              className="rounded-full border border-white/20 px-4 py-2"
            >
              Invest in Lebanon
            </Link>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-brand-silver">
        <div>{t("footer.copyright")}</div>
        <div>{t("footer.credit")}</div>
      </div>
    </footer>
  )
}

export default Footer
