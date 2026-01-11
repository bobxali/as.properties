import { Link } from "react-router-dom"
import { Helmet } from "react-helmet-async"
import { investAreas, investFaq, investKeywords, investProcess } from "../data/investContent"

const InvestInLebanon = () => {
  const origin = typeof window !== "undefined" ? window.location.origin : ""
  const canonicalUrl = `${origin}/invest-in-lebanon`
  const title = "Invest in Lebanon | AS.Properties Lebanon"
  const description =
    "Discover premium real estate opportunities in Lebanon for GCC investors and the Lebanese diaspora. Explore high-yield areas, clear buying steps, and trusted guidance."

  return (
    <section className="reveal is-visible mx-auto w-full max-w-6xl space-y-12 px-6 py-12">
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
      </Helmet>

      <div className="space-y-4 rounded-3xl border border-white/30 bg-white/80 p-8 shadow-lg">
        <div className="text-xs uppercase tracking-[0.3em] text-brand-gold">Invest in Lebanon</div>
        <h1 className="text-4xl font-semibold text-brand-charcoal">Premium real estate for GCC buyers & diaspora investors</h1>
        <p className="text-base text-brand-slate">
          AS.Properties helps Saudi and UAE investors, as well as Lebanese expats, access vetted opportunities across Beirut,
          Metn, Aley, and the coast.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/listings"
            className="rounded-full bg-brand-navy px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white"
          >
            View listings
          </Link>
          <a
            href="https://wa.me/96171115980?text=Hi%20AS.Properties%2C%20I%20want%20to%20invest%20in%20Lebanon."
            className="rounded-full border border-brand-gold px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-brand-navy"
            target="_blank"
            rel="noreferrer"
          >
            WhatsApp us
          </a>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr,1fr]">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-brand-charcoal">Why Lebanon real estate?</h2>
          <p className="text-sm text-brand-slate">
            Lebanon offers diversification, lifestyle appeal, and competitive pricing in select markets. We focus on locations
            with stable demand, strong resale prospects, and clear documentation.
          </p>
          <div className="flex flex-wrap gap-2 text-xs text-brand-slate">
            {[...investKeywords.primary, ...investKeywords.secondary].map((keyword) => (
              <span key={keyword} className="rounded-full border border-white/40 bg-white/80 px-3 py-1">
                {keyword}
              </span>
            ))}
          </div>
        </div>
        <div className="space-y-4 rounded-3xl border border-white/30 bg-white/80 p-6">
          <h3 className="text-lg font-semibold text-brand-charcoal">Popular areas</h3>
          <div className="space-y-3 text-sm text-brand-slate">
            {investAreas.map((area) => (
              <div key={area.name} className="flex items-start justify-between gap-4">
                <span className="font-semibold text-brand-charcoal">{area.name}</span>
                <span className="text-right">{area.detail}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-white/30 bg-white/80 p-8">
        <h2 className="text-2xl font-semibold text-brand-charcoal">How the process works</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {investProcess.map((step, index) => (
            <div key={step.title} className="rounded-2xl border border-white/40 bg-white/80 p-5">
              <div className="text-xs uppercase tracking-[0.2em] text-brand-gold">Step {index + 1}</div>
              <h3 className="mt-2 text-lg font-semibold text-brand-charcoal">{step.title}</h3>
              <p className="mt-2 text-sm text-brand-slate">{step.copy}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-white/30 bg-white/80 p-8">
        <h2 className="text-2xl font-semibold text-brand-charcoal">Investor FAQ</h2>
        <div className="mt-6 space-y-4 text-sm text-brand-slate">
          {investFaq.map((item) => (
            <div key={item.question} className="rounded-2xl border border-white/40 bg-white/80 p-4">
              <div className="font-semibold text-brand-charcoal">{item.question}</div>
              <p className="mt-2">{item.answer}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-white/30 bg-white/80 p-8 text-center">
        <h2 className="text-2xl font-semibold text-brand-charcoal">Ready to invest?</h2>
        <p className="mt-2 text-sm text-brand-slate">
          Explore curated listings or speak to our team for private opportunities.
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          <Link
            to="/listings"
            className="rounded-full bg-brand-navy px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white"
          >
            Explore listings
          </Link>
          <a
            href="https://wa.me/96171115980?text=Hi%20AS.Properties%2C%20I%20want%20to%20invest%20in%20Lebanon."
            className="rounded-full border border-brand-gold px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-brand-navy"
            target="_blank"
            rel="noreferrer"
          >
            Contact on WhatsApp
          </a>
        </div>
      </div>
    </section>
  )
}

export default InvestInLebanon
