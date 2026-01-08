import { useEffect, useMemo, useState } from "react"
import { useParams } from "react-router-dom"
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
            rooms: Number(found.rooms || 0),
            baths: Number(found.baths || 0),
            area: Number(found.area || 0),
            status: found.status || "Available",
            views: Number(found.views || 0),
            media: Array.isArray(found.media) ? found.media : []
          }
        : null
      if (normalized) {
        setProperty(normalized)
        if (normalized.media.length) {
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
    if (property?.media?.length) return property.media.map((item) => item?.url || item)
    return fallbackGallery
  }, [property])

  if (!property) {
    return (
      <section className="mx-auto w-full max-w-6xl px-6 py-12 text-sm text-brand-slate">
        Loading listing...
      </section>
    )
  }

  return (
    <section className="reveal mx-auto w-full max-w-6xl space-y-10 px-6 py-12">
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
              {property.views} views
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
        </div>
        <div className="space-y-6">
          <div className="rounded-3xl border border-white/40 bg-white/80 p-6">
            <div className="text-xs uppercase tracking-[0.2em] text-brand-slate">{property.location}</div>
            <h1 className="mt-2 text-3xl font-semibold text-brand-charcoal">{property.title}</h1>
            <div className="mt-3 text-2xl font-semibold text-brand-navy">
              {property.currency} {property.price.toLocaleString()}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-brand-slate">
              <div>Rooms: {property.rooms}</div>
              <div>Bathrooms: {property.baths}</div>
              <div>Area: {property.area} sqm</div>
              <div>Status: {property.status}</div>
            </div>
          </div>
          <div className="rounded-3xl border border-white/40 bg-white/80 p-6">
            <div className="text-xs uppercase tracking-[0.2em] text-brand-slate">Contact</div>
            <div className="mt-4 flex flex-col gap-3">
              <a
                href={`https://wa.me/96171115980?text=${encodeURIComponent(`Hi AS.Properties, I'm interested in ${property.title}.`)}`}
                className="rounded-2xl bg-green-500 px-4 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white text-center"
                target="_blank"
                rel="noreferrer"
              >
                WhatsApp for details
              </a>
              <button className="rounded-2xl border border-brand-navy px-4 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-brand-navy">
                Schedule viewing
              </button>
            </div>
            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              <button className="rounded-full border border-white/40 px-3 py-1">Facebook</button>
              <button className="rounded-full border border-white/40 px-3 py-1">Instagram</button>
              <button className="rounded-full border border-white/40 px-3 py-1">WhatsApp</button>
              <button className="rounded-full border border-white/40 px-3 py-1">Copy link</button>
            </div>
          </div>
          <InquiryForm propertyTitle={property.title} />
          <div className="rounded-3xl border border-white/40 bg-white/80 p-6">
            <div className="text-xs uppercase tracking-[0.2em] text-brand-slate">Specifications</div>
            <ul className="mt-3 space-y-2 text-sm text-brand-slate">
              <li>Sea view, private parking, concierge service</li>
              <li>Smart home system, high-end finishing level</li>
              <li>Pet friendly, elevator access, storage room</li>
            </ul>
          </div>
          <div className="flex justify-center">
            <a
              href={`https://wa.me/96171115980?text=${encodeURIComponent(`Hi AS.Properties, I'm interested in ${property.title}.`)}`}
              className="rounded-full bg-green-500 px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white"
              target="_blank"
              rel="noreferrer"
            >
              WhatsApp for details
            </a>
          </div>
        </div>
      </div>
      <div>
        <h2 className="text-2xl font-semibold text-brand-charcoal">Similar properties</h2>
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
