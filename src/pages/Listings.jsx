import { useEffect, useMemo, useState } from "react"
import SearchBar from "../components/SearchBar"
import PropertyGrid from "../components/PropertyGrid"
import MapPanel from "../components/MapPanel"
import { sampleProperties } from "../data/mock"
import { api } from "../lib/api"

const Listings = () => {
  const [filters, setFilters] = useState(null)
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
          propertyTypes: item.propertyTypes || item.property_types || [],
          rooms: Number(item.rooms || 0),
          baths: Number(item.baths || 0),
          area: Number(item.area || 0),
          status: item.status || "Available",
          views: Number(item.views || 0),
          hotDeal: Boolean(item.specs?.marketing?.hot),
          media: item.media || [],
          specs: item.specs || {},
          image:
            (item.media?.images?.[0]?.url || item.media?.images?.[0]?.path) ||
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
      <div className="grid gap-8 lg:grid-cols-[2fr,1fr]">
        <PropertyGrid properties={filtered} />
        <MapPanel
          pins={filtered.map((property, index) => ({
            id: property.id,
            label: property.location,
            x: 20 + index * 15,
            y: 25 + index * 10
          }))}
        />
      </div>
      <SearchBar onSearch={setFilters} />
    </section>
  )
}

export default Listings
