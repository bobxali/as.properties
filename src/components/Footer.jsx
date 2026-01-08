import { useLanguage } from "../hooks/useLanguage"

const Footer = () => {
  const { t } = useLanguage()

  return (
    <footer className="bg-brand-charcoal text-white">
      <div className="mx-auto grid w-full max-w-6xl gap-6 px-6 py-10 md:grid-cols-3">
        <div>
          <div className="inline-flex rounded-2xl bg-white/95 p-2 shadow-lg">
            <img src="/logo.png" alt="AS.Properties logo" className="h-16 w-auto" />
          </div>
          <p className="mt-4 text-sm text-brand-silver">
            {t.hero.subtitle}
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-gold">Contact</h4>
          <div className="mt-3 space-y-2 text-sm text-brand-silver">
            <div>{t.footer.address}</div>
            <div>{t.footer.phone}</div>
            <div>{t.footer.email}</div>
          </div>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-gold">Social</h4>
          <div className="mt-3 flex flex-wrap gap-3 text-sm">
            <a
              href="https://instagram.com/as.properties.lb"
              className="rounded-full border border-white/20 px-4 py-2"
              target="_blank"
              rel="noreferrer"
            >
              Instagram: @as.properties.lb
            </a>
            <div className="rounded-full border border-white/20 px-4 py-2">Facebook: AS. Properties</div>
            <a
              href="https://wa.me/96171115980?text=Hi%20AS.Properties%2C%20I%20would%20like%20to%20know%20more."
              className="rounded-full border border-white/20 px-4 py-2"
              target="_blank"
              rel="noreferrer"
            >
              WhatsApp: +961 71 115 980
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-brand-silver">
        AS.Properties (c) 2026. All rights reserved.
      </div>
    </footer>
  )
}

export default Footer
