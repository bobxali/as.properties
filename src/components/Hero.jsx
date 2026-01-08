import SectionHeader from "./SectionHeader"
import { useLanguage } from "../hooks/useLanguage"

const Hero = () => {
  const { t } = useLanguage()

  return (
    <section className="relative overflow-hidden bg-brand-charcoal text-white">
      <div className="hero-glow absolute inset-0 opacity-70" />
      <div className="relative mx-auto grid w-full max-w-6xl gap-10 px-6 py-16 md:grid-cols-2 md:py-24">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-brand-gold">
            Luxury Lebanon Realty
          </div>
          <SectionHeader
            eyebrow={t.brand}
            title={t.hero.title}
            subtitle={t.hero.subtitle}
            titleClass="text-white drop-shadow"
            subtitleClass="text-white/80"
          />
          <div className="flex flex-wrap gap-4">
            <button className="rounded-full bg-brand-gold px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-brand-charcoal transition hover:opacity-90">
              {t.hero.ctaPrimary}
            </button>
            <button className="rounded-full border border-white/30 px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-white/10">
              {t.hero.ctaSecondary}
            </button>
          </div>
        </div>
        <div className="relative">
          <div className="hero-card relative overflow-hidden rounded-3xl p-7 shadow-glow">
            <div className="flex items-center justify-between">
              <div className="logo-text text-xs uppercase tracking-[0.45em] text-brand-gold">AS.Properties</div>
              <div className="rounded-full border border-brand-gold/40 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-brand-gold">
                Prime
              </div>
            </div>
            <h3 className="mt-4 text-3xl font-semibold text-white">Signature Collection</h3>
            <div className="mt-2 h-1 w-16 rounded-full bg-brand-gold" />
            <p className="mt-3 text-sm text-white/80">
              Premium villas, waterfront apartments, and commercial investments across Beirut and the coast.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-4 text-xs text-white">
              <div className="rounded-2xl border border-white/15 bg-white/5 p-4">
                <div className="text-brand-gold text-lg font-semibold">23+</div>
                <div className="text-white/70">Active listings</div>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/5 p-4">
                <div className="text-brand-gold text-lg font-semibold">86%</div>
                <div className="text-white/70">Client satisfaction</div>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/5 p-4">
                <div className="text-brand-gold text-lg font-semibold">24/7</div>
                <div className="text-white/70">Concierge support</div>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/5 p-4">
                <div className="text-brand-gold text-lg font-semibold">15</div>
                <div className="text-white/70">Elite agents</div>
              </div>
            </div>
          </div>
          <div className="absolute -right-6 top-8 hidden h-24 w-24 rounded-full border border-brand-gold/40 md:block" />
          <div className="absolute -bottom-10 left-10 hidden h-28 w-28 rounded-full border border-white/10 md:block" />
        </div>
      </div>
    </section>
  )
}

export default Hero
