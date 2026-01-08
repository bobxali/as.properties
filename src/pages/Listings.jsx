import { useEffect, useMemo, useState } from "react"
import SearchBar from "../components/SearchBar"
import PropertyGrid from "../components/PropertyGrid"
import MapPanel from "../components/MapPanel"
import { sampleProperties } from "../data/mock"
import { api } from "../lib/api"

const Listings = () => {
  const [filters, setFilters] = useState(null)
  const [compareIds, setCompareIds] = useState([])
  const [properties, setProperties] = useState(sampleProperties)

  useEffect(() => {
    const load = async () => {
      const data = await api.listProperties()
      if (data && data.length) {
        const normalized = data.map((item, index) => ({
          id: item.id || `prop-${index}`,
          title: item.title || "Untitled listing",
          price: Number(item.price || 0),
          currency: item.currency || "USD",
          location: item.location || "Lebanon",
          listingType: item.listingType || item.listing_type || "",
          rooms: Number(item.rooms || 0),
          baths: Number(item.baths || 0),
          area: Number(item.area || 0),
          status: item.status || "Available",
          views: Number(item.views || 0),
          hotDeal: Boolean(item.specs?.marketing?.hot),
          media: Array.isArray(item.media) ? item.media : [],
          image:
            (Array.isArray(item.media) && (item.media[0]?.url || item.media[0])) ||
            "https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1200&auto=format&fit=crop"
        }))
        setProperties(normalized)
      }
    }
    load()
  }, [])

  const filtered = useMemo(() => {
    const source = properties
      .slice()
      .sort((a, b) => Number(b.hotDeal) - Number(a.hotDeal))
    if (!filters) return source
    return source.filter((property) => {
      if (filters.location && !property.location.toLowerCase().includes(filters.location.toLowerCase())) {
        return false
      }
      if (filters.type && property.title.toLowerCase().indexOf(filters.type.toLowerCase()) === -1) {
        return false
      }
      if (filters.rooms && property.rooms < Number(filters.rooms)) {
        return false
      }
      if (filters.baths && property.baths < Number(filters.baths)) {
        return false
      }
      if (filters.priceMin && property.price < filters.priceMin) {
        return false
      }
      if (filters.priceMax && property.price > filters.priceMax) {
        return false
      }
      return true
    })
  }, [filters, properties])

  return (
    <section className="reveal mx-auto w-full max-w-6xl space-y-8 px-6 py-12">
      <SearchBar onSearch={setFilters} />
      {compareIds.length ? (
        <div className="rounded-3xl border border-white/40 bg-white/80 p-4 text-sm text-brand-slate">
          Comparing {compareIds.length} properties
          <div className="mt-3 flex flex-wrap gap-2">
            {properties
              .filter((property) => compareIds.includes(property.id))
              .map((property) => (
                <div key={property.id} className="rounded-full bg-brand-charcoal/10 px-3 py-1 text-xs text-brand-charcoal">
                  {property.title}
                </div>
              ))}
          </div>
        </div>
      ) : null}
      <div className="grid gap-8 lg:grid-cols-[2fr,1fr]">
        <PropertyGrid
          properties={filtered}
          compareIds={compareIds}
          onToggleCompare={(id) => {
            setCompareIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
          }}
        />
        <MapPanel
          pins={filtered.map((property, index) => ({
            id: property.id,
            label: property.location,
            x: 20 + index * 15,
            y: 25 + index * 10
          }))}
        />
      </div>
    </section>
  )
}

export default Listings
