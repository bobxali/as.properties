import { Link } from "react-router-dom"
import { useMemo, useRef, useState } from "react"
import { useTranslation } from "react-i18next"

const statusClass = {
  Available: "badge-available",
  Reserved: "badge-reserved",
  Sold: "badge-sold",
  Negotiation: "badge-negotiation"
}

const statusLabelKey = {
  Available: "status.available",
  Reserved: "status.reserved",
  Sold: "status.sold",
  Negotiation: "status.negotiation",
  "متوفر": "status.available",
  "محجوز": "status.reserved",
  "مباع": "status.sold",
  "قيد التفاوض": "status.negotiation"
}

const listingTypeKey = {
  Sale: "listing.forSale",
  Rent: "listing.forRent",
  "للبيع": "listing.forSale",
  "للإيجار": "listing.forRent"
}

const PropertyCard = ({ property, showWhatsapp = true }) => {
  const { t, i18n } = useTranslation()
  const splitBilingual = (value) => {
    const raw = String(value || "")
    if (!raw.includes("|")) return { ar: raw, en: "" }
    const [ar, en] = raw.split("|").map((part) => part.trim())
    return { ar: ar || en || "", en: en || ar || "" }
  }
  const images = useMemo(() => {
    if (property.media?.images && Array.isArray(property.media.images)) {
      return property.media.images.map((item) => item?.url || item?.path || item).filter(Boolean)
    }
    if (Array.isArray(property.media) && property.media.length) {
      return property.media.map((item) => (item?.url ? item.url : item)).filter(Boolean)
    }
    return [property.image].filter(Boolean)
  }, [property])
  const [activeIndex, setActiveIndex] = useState(0)
  const activeImage = images[activeIndex] || property.image
  const touchStartX = useRef(null)
  const touchDeltaX = useRef(0)
  const rawStatus = property.status || "Available"
  const statusLabel = statusLabelKey[rawStatus] ? t(statusLabelKey[rawStatus]) : rawStatus
  const statusClassKey = (() => {
    if (["Available", "متوفر"].includes(rawStatus)) return "Available"
    if (["Reserved", "محجوز"].includes(rawStatus)) return "Reserved"
    if (["Sold", "مباع"].includes(rawStatus)) return "Sold"
    if (["Negotiation", "قيد التفاوض"].includes(rawStatus)) return "Negotiation"
    return "Available"
  })()
  const rawListingType = property.listingType || property.listing_type || ""
  const listingTypeRaw = String(rawListingType)
  const listingTypeLabel = listingTypeKey[listingTypeRaw]
    ? t(listingTypeKey[listingTypeRaw])
    : listingTypeRaw.toLowerCase().includes("rent")
      ? t("listing.forRent")
      : listingTypeRaw.toLowerCase().includes("sale")
        ? t("listing.forSale")
        : ""
  const listingTypeInline = listingTypeKey[listingTypeRaw]
    ? t(listingTypeKey[listingTypeRaw] === "listing.forSale" ? "listing.forSaleInline" : "listing.forRentInline")
    : listingTypeRaw.toLowerCase().includes("rent")
      ? t("listing.forRentInline")
      : listingTypeRaw.toLowerCase().includes("sale")
        ? t("listing.forSaleInline")
        : ""
  const locationLabel = (() => {
    const raw = String(property.location || "")
    if (!raw.includes("|")) return raw
    const [ar, en] = raw.split("|").map((part) => part.trim())
    return i18n.language === "ar" ? ar || en : en || ar
  })()
  const formatNumber = (value) => {
    if (value === null || value === undefined || value === "") return ""
    const number = Number(value)
    if (Number.isNaN(number)) return value
    return new Intl.NumberFormat(i18n.language === "ar" ? "ar" : "en").format(number)
  }
  const typeLabel = (() => {
    const list = Array.isArray(property.propertyTypes) ? property.propertyTypes : []
    const rawType = list[0] || property.propertyType || ""
    const { ar, en } = splitBilingual(rawType)
    const localizedType = i18n.language === "ar" ? ar || en : en || ar
    const normalizedType = String(localizedType || rawType)
      .replace(/[^\p{L}\s]/gu, "")
      .replace(/\s+/g, " ")
      .trim()
    const map = {
      Apartment: "types.apartment",
      Villa: "types.villa",
      Land: "types.land",
      Commercial: "types.commercial",
      Office: "types.office",
      Duplex: "types.duplex",
      Store: "types.store",
      Shop: "types.store",
      "شقة": "types.apartment",
      "فيلا": "types.villa",
      "أرض": "types.land",
      "تجاري": "types.commercial",
      "مكتب": "types.office",
      "دوبلكس": "types.duplex",
      "متجر": "types.store",
      "محل": "types.store"
    }
    const key = map[localizedType] || map[normalizedType] || map[rawType]
    return key ? t(key) : normalizedType || localizedType || rawType
  })()
  const viewSuffix = (() => {
    const features = Array.isArray(property.specs?.features) ? property.specs.features : []
    const normalized = features.map((item) => String(item).toLowerCase())
    const hasSea = normalized.some((item) => item.includes("sea") || item.includes("بحر"))
    const hasMountain = normalized.some((item) => item.includes("mountain") || item.includes("جبل"))
    if (hasSea && hasMountain) return t("listing.viewSeaMountain")
    if (hasSea) return t("listing.viewSea")
    if (hasMountain) return t("listing.viewMountain")
    return ""
  })()
  const buildTitle = () => {
    const areaValue = formatNumber(property.area)
    const locationValue = locationLabel || property.location || ""
    if (!areaValue || !typeLabel || !listingTypeInline || !locationValue) return ""
    return t("listing.cardTitle", {
      area: areaValue,
      type: typeLabel,
      listingType: listingTypeInline,
      location: locationValue,
      view: viewSuffix
    })
  }
  const cardTitle = (() => {
    const autoTitle = buildTitle()
    if (autoTitle) return autoTitle
    const descriptions = property.specs?.descriptions || {}
    if (i18n.language === "ar") return descriptions.ar || property.title || ""
    return descriptions.en || property.title || ""
  })()
  const whatsappMessage = encodeURIComponent(
    `Hi AS.Properties, I'm interested in ${cardTitle || property.title}.`
  )
  const whatsappLink = `https://wa.me/96171115980?text=${whatsappMessage}`

  return (
    <Link
      to={`/properties/${property.id}`}
      className={`card-lift group overflow-hidden rounded-3xl bg-white shadow-lg ${property.hotDeal ? "ring-2 ring-brand-gold/60" : ""}`}
    >
      <div
        className="relative h-52 overflow-hidden"
        onTouchStart={(event) => {
          if (event.touches.length !== 1) return
          touchStartX.current = event.touches[0].clientX
          touchDeltaX.current = 0
        }}
        onTouchMove={(event) => {
          if (touchStartX.current === null) return
          touchDeltaX.current = event.touches[0].clientX - touchStartX.current
        }}
        onTouchEnd={() => {
          if (touchStartX.current === null || images.length < 2) return
          const delta = touchDeltaX.current
          const threshold = 40
          if (Math.abs(delta) >= threshold) {
            const direction = delta < 0 ? 1 : -1
            setActiveIndex((prev) => (prev + direction + images.length) % images.length)
          }
          touchStartX.current = null
          touchDeltaX.current = 0
        }}
      >
        <img
          src={activeImage}
          alt={cardTitle}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {property.hotDeal ? (
          <div className="absolute top-4 right-4 rounded-full border border-brand-gold/80 bg-black px-3 py-1 text-xs font-semibold text-brand-gold shadow-lg">
            {t("listing.hotDeal")}
          </div>
        ) : null}
        <div className={`badge absolute left-4 top-4 ${statusClass[statusClassKey] || "badge-available"}`}>
          {statusLabel}
        </div>
        {listingTypeLabel ? (
          <div className="absolute left-4 top-11 rounded-full bg-brand-charcoal/80 px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-white">
            {listingTypeLabel}
          </div>
        ) : null}
        {showWhatsapp ? (
          <button
            type="button"
            className="absolute bottom-4 right-4 rounded-full bg-green-500/90 px-3 py-1 text-xs text-white"
            onClick={(event) => {
              event.preventDefault()
              event.stopPropagation()
              window.open(whatsappLink, "_blank", "noopener,noreferrer")
            }}
          >
            {t("listing.whatsapp")}
          </button>
        ) : null}
        <div className="absolute bottom-4 left-4 rounded-full bg-brand-charcoal/80 px-3 py-1 text-xs text-white">
          {formatNumber(property.views)} {t("listing.views")}
        </div>
        {images.length > 1 ? (
          <div className="absolute bottom-4 right-16 flex items-center gap-1 rounded-full bg-white/80 px-2 py-1 text-[10px]">
            {images.map((_, index) => (
              <button
                key={`${property.id}-dot-${index}`}
                type="button"
                className={`h-2 w-2 rounded-full ${index === activeIndex ? "bg-brand-navy" : "bg-brand-silver"}`}
                onClick={(event) => {
                  event.preventDefault()
                  event.stopPropagation()
                  setActiveIndex(index)
                }}
              />
            ))}
          </div>
        ) : null}
      </div>
      <div className="space-y-2 p-5">
        <div className="text-xs uppercase tracking-[0.2em] text-brand-slate">{locationLabel || property.location}</div>
        <h3 className="text-lg font-semibold text-brand-charcoal">{cardTitle}</h3>
        <div className="text-xl font-semibold text-brand-navy">
          {property.currency} {formatNumber(property.price)}
        </div>
        <div className="flex flex-wrap gap-3 text-xs text-brand-slate">
          <span>{formatNumber(property.rooms)} {t("listing.rooms")}</span>
          <span>{formatNumber(property.baths)} {t("listing.baths")}</span>
          <span>{formatNumber(property.area)} {t("listing.area")}</span>
        </div>
      </div>
    </Link>
  )
}

export default PropertyCard
