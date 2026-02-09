import { useState } from "react"
import { useLanguage } from "../hooks/useLanguage"

const SearchBar = ({ onSearch }) => {
  const { t } = useLanguage()
  const [filters, setFilters] = useState({
    location: "",
    priceMin: 50000,
    priceMax: 1200000,
    type: "",
    rooms: "",
    baths: "",
    sort: "newest"
  })

  const handleChange = (key, value) => {
    const next = { ...filters, [key]: value }
    setFilters(next)
    if (onSearch) {
      onSearch(next)
    }
  }

  return (
    <div className="glass-panel w-full rounded-3xl p-6 shadow-glow">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-navy">{t("search.title")}</div>
        <div className="text-xs text-brand-slate">{t("search.map")} • {t("search.mapRegion")}</div>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <input
          className="w-full rounded-2xl border border-white/40 bg-white/80 px-4 py-3 text-sm"
          placeholder={t("search.location")}
          value={filters.location}
          onChange={(event) => handleChange("location", event.target.value)}
        />
        <div className="rounded-2xl border border-white/40 bg-white/80 px-4 py-3 text-sm">
          <label className="text-xs uppercase tracking-[0.2em] text-brand-slate">{t("search.priceMin")}</label>
          <input
            type="range"
            min="20000"
            max="2000000"
            value={filters.priceMin}
            onChange={(event) => handleChange("priceMin", Number(event.target.value))}
            className="mt-2 w-full"
          />
          <div className="text-xs text-brand-slate">${filters.priceMin.toLocaleString()}</div>
        </div>
        <div className="rounded-2xl border border-white/40 bg-white/80 px-4 py-3 text-sm">
          <label className="text-xs uppercase tracking-[0.2em] text-brand-slate">{t("search.priceMax")}</label>
          <input
            type="range"
            min="60000"
            max="3000000"
            value={filters.priceMax}
            onChange={(event) => handleChange("priceMax", Number(event.target.value))}
            className="mt-2 w-full"
          />
          <div className="text-xs text-brand-slate">${filters.priceMax.toLocaleString()}</div>
        </div>
        <select
          className="w-full rounded-2xl border border-white/40 bg-white/80 px-4 py-3 text-sm"
          value={filters.type}
          onChange={(event) => handleChange("type", event.target.value)}
        >
          <option value="">{t("search.type")}</option>
          <option value="Apartment">{t("search.typeApartment")}</option>
          <option value="Villa">{t("search.typeVilla")}</option>
          <option value="Land">{t("search.typeLand")}</option>
          <option value="Commercial">{t("search.typeCommercial")}</option>
          <option value="Office">{t("search.typeOffice")}</option>
          <option value="Duplex">{t("search.typeDuplex")}</option>
          <option value="Store">{t("search.typeStore")}</option>
        </select>
        <select
          className="w-full rounded-2xl border border-white/40 bg-white/80 px-4 py-3 text-sm"
          value={filters.rooms}
          onChange={(event) => handleChange("rooms", event.target.value)}
        >
          <option value="">{t("search.rooms")}</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4+</option>
        </select>
        <select
          className="w-full rounded-2xl border border-white/40 bg-white/80 px-4 py-3 text-sm"
          value={filters.baths}
          onChange={(event) => handleChange("baths", event.target.value)}
        >
          <option value="">{t("search.baths")}</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3+</option>
        </select>
        <select
          className="w-full rounded-2xl border border-white/40 bg-white/80 px-4 py-3 text-sm"
          value={filters.sort}
          onChange={(event) => handleChange("sort", event.target.value)}
        >
          <option value="newest">{t("search.sortNewest")}</option>
          <option value="price-low">{t("search.sortPriceLow")}</option>
          <option value="price-high">{t("search.sortPriceHigh")}</option>
          <option value="views">{t("search.sortViews")}</option>
        </select>
        <button
          className="w-full rounded-2xl bg-brand-navy px-4 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:opacity-90"
          onClick={() => onSearch?.(filters)}
        >
          {t("search.apply")}
        </button>
      </div>
    </div>
  )
}

export default SearchBar
