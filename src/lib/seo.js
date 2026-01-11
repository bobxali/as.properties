const normalizeText = (value) => {
  if (!value) return ""
  return String(value)
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

export const splitBilingual = (value) => {
  const raw = normalizeText(value)
  if (!raw.includes("|")) return { ar: raw, en: "" }
  const [ar, en] = raw.split("|").map((part) => part.trim())
  return { ar: ar || en || "", en: en || ar || "" }
}

export const buildPropertyTitle = ({ titleEn, locationAr, locationEn }) => {
  const safeLocationAr = locationAr || locationEn || "Lebanon"
  if (titleEn) {
    return `${titleEn} | ${safeLocationAr} | AS.Properties Lebanon`
  }
  const safeLocationEn = locationEn || locationAr || "Lebanon"
  return `Property in ${safeLocationEn} | AS.Properties Lebanon`
}

const formatPrice = (price, currency) => {
  if (!price) return ""
  const formatted = Number(price).toLocaleString("en-US")
  return currency ? `${currency} ${formatted}` : formatted
}

export const buildPropertyDescription = ({ descriptionEn, descriptionAr, fallback }) => {
  const candidate = normalizeText(descriptionEn) || normalizeText(descriptionAr)
  if (candidate) return candidate
  return normalizeText(fallback)
}

export const buildPropertyFallbackDescription = ({
  typeEn,
  listingTypeEn,
  area,
  rooms,
  baths,
  price,
  currency,
  locationEn
}) => {
  const parts = []
  if (typeEn && listingTypeEn && locationEn) {
    parts.push(`${typeEn} ${listingTypeEn} in ${locationEn}.`)
  }
  if (area) parts.push(`${area} sqm`)
  if (rooms) parts.push(`${rooms} bedrooms`)
  if (baths) parts.push(`${baths} bathrooms`)
  if (price) parts.push(formatPrice(price, currency))
  return parts.join(", ")
}

const cleanObject = (input) => {
  if (Array.isArray(input)) {
    return input.filter(Boolean)
  }
  if (input && typeof input === "object") {
    return Object.entries(input).reduce((acc, [key, value]) => {
      if (value === null || value === undefined || value === "") return acc
      const cleaned = cleanObject(value)
      if (cleaned === null || cleaned === undefined || cleaned === "") return acc
      if (Array.isArray(cleaned) && cleaned.length === 0) return acc
      acc[key] = cleaned
      return acc
    }, {})
  }
  return input
}

export const buildPropertyJsonLd = ({
  url,
  title,
  description,
  image,
  currency,
  price,
  availability,
  createdAt,
  locality
}) => {
  const offer = cleanObject({
    "@type": "Offer",
    price,
    priceCurrency: currency,
    availability,
    url
  })
  return cleanObject({
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: title,
    description,
    datePosted: createdAt,
    url,
    image: image ? [image] : undefined,
    primaryImageOfPage: image,
    offers: offer,
    address: cleanObject({
      "@type": "PostalAddress",
      addressLocality: locality,
      addressCountry: "LB"
    })
  })
}

export const availabilityFromStatus = (status) => {
  if (!status) return undefined
  const normalized = String(status).toLowerCase()
  if (normalized.includes("sold") || normalized.includes("مباع")) return "https://schema.org/SoldOut"
  if (normalized.includes("reserved") || normalized.includes("محجوز")) return "https://schema.org/PreOrder"
  return "https://schema.org/InStock"
}

