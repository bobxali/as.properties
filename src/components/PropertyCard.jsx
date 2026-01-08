import { Link } from "react-router-dom"
import { useMemo, useState } from "react"

const statusClass = {
  Available: "badge-available",
  Reserved: "badge-reserved",
  Sold: "badge-sold",
  Negotiation: "badge-negotiation"
}

const statusLabelMap = {
  متوفر: "Available",
  محجوز: "Reserved",
  مباع: "Sold",
  "قيد التفاوض": "Negotiation"
}

const listingTypeMap = {
  للبيع: "For sale",
  للإيجار: "For rent"
}

const PropertyCard = ({ property, showCompare = false, selected = false, onToggleCompare, showWhatsapp = true }) => {
  const images = useMemo(() => {
    if (Array.isArray(property.media) && property.media.length) {
      return property.media.map((item) => (item?.url ? item.url : item))
    }
    return [property.image].filter(Boolean)
  }, [property])
  const [activeIndex, setActiveIndex] = useState(0)
  const activeImage = images[activeIndex] || property.image
  const rawStatus = property.status || "Available"
  const statusLabel = statusLabelMap[rawStatus] || rawStatus
  const rawListingType = property.listingType || property.listing_type || ""
  const listingTypeKey = rawListingType.toLowerCase()
  const listingTypeLabel =
    listingTypeMap[rawListingType] ||
    (listingTypeKey.includes("rent") ? "For rent" : listingTypeKey.includes("sale") ? "For sale" : "")
  const whatsappMessage = encodeURIComponent(
    `Hi AS.Properties, I'm interested in ${property.title}.`
  )
  const whatsappLink = `https://wa.me/96171115980?text=${whatsappMessage}`

  return (
    <Link
      to={`/properties/${property.id}`}
      className={`card-lift group overflow-hidden rounded-3xl bg-white shadow-lg ${property.hotDeal ? "ring-2 ring-brand-gold/60" : ""}`}
    >
      <div className="relative h-52 overflow-hidden">
        <img
          src={activeImage}
          alt={property.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {showCompare ? (
          <button
            className="absolute right-4 top-4 rounded-full border border-white/50 bg-white/90 px-3 py-1 text-xs text-brand-slate"
            onClick={(event) => {
              event.preventDefault()
              event.stopPropagation()
              onToggleCompare?.(property.id)
            }}
          >
            {selected ? "Compared" : "Compare"}
          </button>
        ) : null}
        {property.hotDeal ? (
          <div className="absolute top-4 right-4 rounded-full bg-brand-gold px-3 py-1 text-xs font-semibold text-brand-charcoal shadow-lg">
            Hot deal
          </div>
        ) : null}
        <div className={`badge absolute left-4 top-4 ${statusClass[statusLabel] || "badge-available"}`}>
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
            WhatsApp
          </button>
        ) : null}
        <div className="absolute bottom-4 left-4 rounded-full bg-brand-charcoal/80 px-3 py-1 text-xs text-white">
          {property.views} views
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
        <div className="text-xs uppercase tracking-[0.2em] text-brand-slate">{property.location}</div>
        <h3 className="text-lg font-semibold text-brand-charcoal">{property.title}</h3>
        <div className="text-xl font-semibold text-brand-navy">
          {property.currency} {property.price.toLocaleString()}
        </div>
        <div className="flex flex-wrap gap-3 text-xs text-brand-slate">
          <span>{property.rooms} rooms</span>
          <span>{property.baths} baths</span>
          <span>{property.area} sqm</span>
        </div>
      </div>
    </Link>
  )
}

export default PropertyCard
