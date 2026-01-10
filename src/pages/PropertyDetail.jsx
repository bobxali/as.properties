import { useEffect, useMemo, useState } from "react"
import { useParams } from "react-router-dom"
import { useTranslation } from "react-i18next"
import PropertyGrid from "../components/PropertyGrid"
import InquiryForm from "../components/InquiryForm"
import { sampleProperties } from "../data/mock"
import { api } from "../lib/api"

const fallbackGallery = [
  "https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?q=80&w=1600&auto=format&fit=crop"
]

const PropertyDetail = () => {
  const { t, i18n } = useTranslation()
  const tEn = i18n.getFixedT("en")
  const { id } = useParams()
  const [property, setProperty] = useState(null)
  const [activeImage, setActiveImage] = useState(fallbackGallery[0])
  const [lightbox, setLightbox] = useState(false)

  useEffect(() => {
    const load = async () => {
      const data = await api.listProperties()
      const found = (data || []).find((item) => String(item.id) === String(id))
      const normalized = found
        ? {
            id: found.id,
            title: found.title || "Untitled listing",
            price: Number(found.price || 0),
            currency: found.currency || "USD",
            location: found.location || "Lebanon",
            propertyTypes: found.propertyTypes || found.property_types || [],
            listingType: found.listingType || found.listing_type || "",
            rooms: Number(found.rooms || 0),
            baths: Number(found.baths || 0),
            area: Number(found.area || 0),
            status: found.status || "Available",
            views: Number(found.views || 0),
            media: found.media || [],
            specs: found.specs || {}
          }
        : null
      if (normalized) {
        setProperty(normalized)
        if (normalized.media?.images?.length) {
          const first = normalized.media.images[0]
          setActiveImage(first?.url || first?.path || first)
        } else if (normalized.media?.length) {
          const first = normalized.media[0]
          setActiveImage(first?.url || first)
        }
      } else {
        setProperty(sampleProperties.find((item) => item.id === id) || sampleProperties[0])
      }
    }
    load()
  }, [id])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!property) {
        setProperty(sampleProperties.find((item) => item.id === id) || sampleProperties[0])
      }
    }, 1500)
    return () => clearTimeout(timer)
  }, [id, property])

  const galleryImages = useMemo(() => {
    if (property?.media?.images && Array.isArray(property.media.images)) {
      return property.media.images.map((item) => item?.url || item?.path || item).filter(Boolean)
    }
    if (property?.media?.length) return property.media.map((item) => item?.url || item).filter(Boolean)
    return fallbackGallery
  }, [property])

  const translateValue = (value) => {
    const valueMap = {
      "O3U+O_ OœOrO\u0014Oñ": "values.ownershipGreen",
      "Green deed": "values.ownershipGreen",
      "O-O_USO®": "values.conditionRecent",
      "Recent": "values.conditionRecent",
      "OñO\u0015UŸO\"": "values.kitchenInstalled",
      "Installed": "values.kitchenInstalled",
      "O_USU,U^UŸO3": "values.finishingDeluxe",
      "Deluxe": "values.finishingDeluxe",
      "O\"OÝOñ O\u0014OñO¦U^O\u0014OýUS": "values.waterArtesian",
      "Artesian well": "values.waterArtesian",
      "U.U^U,U? OrO\u0014Oæ": "values.amenityParking",
      "Private parking": "values.amenityParking",
      "U.OæO1O_": "values.amenityElevator",
      "Elevator": "values.amenityElevator",
      "U.U^U,O_ UŸUØOñO\"O\u0014O­": "values.amenityGenerator",
      "Generator": "values.amenityGenerator",
      "O¦UŸUSUSU?": "values.amenityAc",
      "A/C": "values.amenityAc",
      "O-OñO\u0014O3Oc": "values.amenitySecurity",
      "Security": "values.amenitySecurity",
      "OOúU,O\u0014U,Oc OªO\"U,": "values.featureMountainView",
      "Mountain view": "values.featureMountainView",
      "UŸO\u0014O'": "values.paymentCash",
      "Cash": "values.paymentCash"
    }
    const key = valueMap[value]
    return key ? t(key) : value
  }

  const locationLabel = useMemo(() => {
    const raw = String(property?.location || "")
    if (!raw.includes("|")) return raw
    const [ar, en] = raw.split("|").map((part) => part.trim())
    return i18n.language === "ar" ? ar || en : en || ar
  }, [property, i18n.language])
  const formatNumber = (value) => {
    if (value === null || value === undefined || value === "") return ""
    const number = Number(value)
    if (Number.isNaN(number)) return value
    return new Intl.NumberFormat(i18n.language === "ar" ? "ar" : "en").format(number)
  }
  const typeLabel = useMemo(() => {
    const list = Array.isArray(property?.propertyTypes) ? property.propertyTypes : []
    const rawType = list[0] || ""
    const normalizedType = String(rawType)
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
      "شقة": "types.apartment",
      "فيلا": "types.villa",
      "أرض": "types.land",
      "تجاري": "types.commercial",
      "مكتب": "types.office",
      "دوبلكس": "types.duplex"
    }
    const key = map[rawType] || map[normalizedType]
    return key ? t(key) : normalizedType || rawType
  }, [property, t])
  const listingTypeInline = useMemo(() => {
    const raw = String(property?.listingType || "")
    if (raw === "Sale" || raw === "للبيع") return t("listing.forSaleInline")
    if (raw === "Rent" || raw === "للإيجار") return t("listing.forRentInline")
    if (raw.toLowerCase().includes("rent")) return t("listing.forRentInline")
    if (raw.toLowerCase().includes("sale")) return t("listing.forSaleInline")
    return ""
  }, [property, t])
  const viewSuffix = useMemo(() => {
    const features = Array.isArray(property?.specs?.features) ? property.specs.features : []
    const normalized = features.map((item) => String(item).toLowerCase())
    const hasSea = normalized.some((item) => item.includes("sea") || item.includes("بحر"))
    const hasMountain = normalized.some((item) => item.includes("mountain") || item.includes("جبل"))
    if (hasSea && hasMountain) return t("listing.viewSeaMountain")
    if (hasSea) return t("listing.viewSea")
    if (hasMountain) return t("listing.viewMountain")
    return ""
  }, [property, t])
  const displayTitle = useMemo(() => {
    const areaValue = formatNumber(property?.area)
    if (areaValue && typeLabel && listingTypeInline && locationLabel) {
      return t("listing.cardTitle", {
        area: areaValue,
        type: typeLabel,
        listingType: listingTypeInline,
        location: locationLabel,
        view: viewSuffix
      })
    }
    const descriptions = property?.specs?.descriptions || {}
    if (i18n.language === "ar") return descriptions.ar || property?.title || ""
    return descriptions.en || property?.title || ""
  }, [formatNumber, i18n.language, listingTypeInline, locationLabel, property, t, typeLabel, viewSuffix])
  const statusLabel = useMemo(() => {
    const raw = property?.status || ""
    const statusMap = {
      Available: "status.available",
      Reserved: "status.reserved",
      Sold: "status.sold",
      Negotiation: "status.negotiation",
      "متوفر": "status.available",
      "محجوز": "status.reserved",
      "مباع": "status.sold",
      "قيد التفاوض": "status.negotiation"
    }
    return statusMap[raw] ? t(statusMap[raw]) : raw
  }, [property, t])
  const specItems = useMemo(() => {
    if (!property?.specs) return []
    const specs = property.specs || {}
    const formatList = (items) => {
      const list = items.map((item) => translateValue(item))
      return list.join(i18n.language === "ar" ? "، " : ", ")
    }
    const items = [
      { label: t("detail.specOwnership"), value: translateValue(specs.ownershipDoc) },
      { label: t("detail.specCondition"), value: translateValue(specs.condition) },
      { label: t("detail.specFloor"), value: formatNumber(specs.floor) },
      { label: t("detail.specFloorsTotal"), value: formatNumber(specs.floorsTotal) },
      { label: t("detail.specYearBuilt"), value: formatNumber(specs.yearBuilt) },
      { label: t("detail.specKitchen"), value: translateValue(specs.kitchen) },
      { label: t("detail.specFinishing"), value: translateValue(specs.finishing) },
      { label: t("detail.specWaterSource"), value: Array.isArray(specs.waterSources) ? formatList(specs.waterSources) : translateValue(specs.waterSources) },
      { label: t("detail.specAmenities"), value: Array.isArray(specs.amenities) ? formatList(specs.amenities) : translateValue(specs.amenities) },
      { label: t("detail.specFeatures"), value: Array.isArray(specs.features) ? formatList(specs.features) : translateValue(specs.features) },
      { label: t("detail.specPaymentTerms"), value: Array.isArray(specs.paymentTerms) ? formatList(specs.paymentTerms) : translateValue(specs.paymentTerms) },
      { label: t("detail.specNegotiable"), value: specs.negotiable ? t("common.yes") : specs.negotiable === false ? t("common.no") : "" }
    ]
    return items.filter((item) => item.value !== null && item.value !== undefined && String(item.value).trim() !== "")
  }, [property, i18n.language])

  if (!property) {
    return (
      <section className="mx-auto w-full max-w-6xl px-6 py-12 text-sm text-brand-slate">
          {tEn("detail.loading")}
      </section>
    )
  }

  return (
    <section className="reveal is-visible mx-auto w-full max-w-6xl space-y-10 px-6 py-12">
      <div className="grid gap-8 lg:grid-cols-[2fr,1fr]">
        <div className="space-y-4">
          <div className="relative overflow-hidden rounded-3xl">
            <img
              src={activeImage}
              alt={property.title}
              className="h-96 w-full object-cover"
              onClick={() => setLightbox(true)}
            />
            <div className="absolute bottom-4 left-4 rounded-full bg-brand-charcoal/80 px-3 py-1 text-xs text-white">
              {formatNumber(property.views)} {t("listing.views")}
            </div>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {galleryImages.map((image) => (
              <button
                key={image}
                className={`h-20 w-28 overflow-hidden rounded-2xl border ${
                  image === activeImage ? "border-brand-gold" : "border-white/40"
                }`}
                onClick={() => setActiveImage(image)}
              >
                <img src={image} alt="Gallery" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
          <div className="rounded-3xl border border-white/40 bg-white/80 p-6">
            <div className="text-xs uppercase tracking-[0.2em] text-brand-slate">{t("detail.specs")}</div>
            {specItems.length ? (
              <ul className="mt-3 space-y-2 text-sm text-brand-slate">
                {specItems.map((item) => (
                  <li key={item.label}>
                    <span className="font-semibold text-brand-charcoal">{item.label}:</span> {item.value}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="mt-3 text-sm text-brand-slate">{t("detail.specsEmpty")}</div>
            )}
          </div>
        </div>
        <div className="space-y-6">
          <div className="rounded-3xl border border-white/40 bg-white/80 p-6">
            <div className="text-xs uppercase tracking-[0.2em] text-brand-slate">{locationLabel || property.location}</div>
            <h1 className="mt-2 text-3xl font-semibold text-brand-charcoal">{displayTitle}</h1>
            <div className="mt-3 text-2xl font-semibold text-brand-navy">
              {property.currency} {formatNumber(property.price)}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-brand-slate">
              <div>{t("detail.rooms")}: {formatNumber(property.rooms)}</div>
              <div>{t("detail.baths")}: {formatNumber(property.baths)}</div>
              <div>{t("detail.area")}: {formatNumber(property.area)} {t("listing.area")}</div>
              <div>{t("detail.status")}: {statusLabel}</div>
            </div>
          </div>
          <div className="rounded-3xl border border-white/40 bg-white/80 p-6">
            <div className="text-xs uppercase tracking-[0.2em] text-brand-slate">{tEn("detail.contact")}</div>
            <div className="mt-4 flex flex-col gap-3">
              <a
                href={`https://wa.me/96171115980?text=${encodeURIComponent(`Hi AS.Properties, I'm interested in ${property.title}.`)}`
                }
                className="rounded-2xl bg-green-500 px-4 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white text-center"
                target="_blank"
                rel="noreferrer"
              >
                {tEn("detail.whatsappCta")}
              </a>
              <button className="rounded-2xl border border-brand-navy px-4 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-brand-navy">
                {tEn("detail.schedule")}
              </button>
            </div>
            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              <button className="rounded-full border border-white/40 px-3 py-1">{tEn("detail.shareFacebook")}</button>
              <button className="rounded-full border border-white/40 px-3 py-1">{tEn("detail.shareInstagram")}</button>
              <button className="rounded-full border border-white/40 px-3 py-1">{tEn("detail.shareWhatsApp")}</button>
              <button className="rounded-full border border-white/40 px-3 py-1">{tEn("detail.shareCopy")}</button>
            </div>
          </div>
          <InquiryForm propertyTitle={property.title} />
          <div className="flex justify-center">
            <a
              href={`https://wa.me/96171115980?text=${encodeURIComponent(`Hi AS.Properties, I'm interested in ${property.title}.`)}`
              }
              className="rounded-full bg-green-500 px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white"
              target="_blank"
              rel="noreferrer"
            >
              {tEn("detail.whatsappCta")}
            </a>
          </div>
        </div>
      </div>
      <div>
        <h2 className="text-2xl font-semibold text-brand-charcoal">{tEn("detail.similar")}</h2>
        <div className="mt-6">
          <PropertyGrid properties={sampleProperties.slice(1)} />
        </div>
      </div>

      {lightbox ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6" onClick={() => setLightbox(false)}>
          <img src={activeImage} alt="Preview" className="max-h-[80vh] rounded-3xl" />
        </div>
      ) : null}
    </section>
  )
}

export default PropertyDetail
