import { useEffect, useState } from "react"
import Hero from "../components/Hero"
import SearchBar from "../components/SearchBar"
import PropertyGrid from "../components/PropertyGrid"
import MapPanel from "../components/MapPanel"
import SectionHeader from "../components/SectionHeader"
import { sampleProperties } from "../data/mock"
import { api } from "../lib/api"

const Home = () => {
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

  return (
    <div>
      <Hero />
      <section className="reveal mx-auto w-full max-w-6xl space-y-10 px-6 py-12">
        <SearchBar />
        <div className="grid gap-8 lg:grid-cols-[2fr,1fr]">
          <div className="space-y-6">
            <SectionHeader
              eyebrow="Featured"
              title="Signature listings"
              subtitle="Handpicked properties that define AS.Properties' luxury standard."
            />
            <PropertyGrid
              properties={properties.slice().sort((a, b) => Number(b.hotDeal) - Number(a.hotDeal))}
              showWhatsapp={false}
            />
          </div>
          <div className="space-y-6">
            <SectionHeader
              eyebrow="Live"
              title="Map view"
              subtitle="Track availability and micro-markets instantly."
            />
            <MapPanel
              pins={properties.map((property, index) => ({
                id: property.id,
                label: property.location,
                x: 18 + index * 18,
                y: 30 + index * 12
              }))}
            />
          </div>
        </div>
        <div className="space-y-6">
          <SectionHeader
            eyebrow="Social"
            title="Instagram highlights"
            subtitle="Curated snapshots from AS.Properties listings."
            align="center"
          />
          <div className="text-center text-xs uppercase tracking-[0.3em] text-brand-slate">
            Instagram: @as.properties.lb
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?q=80&w=900&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?q=80&w=900&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=900&auto=format&fit=crop"
            ].map((src) => (
              <div key={src} className="card-lift overflow-hidden rounded-3xl">
                <img src={src} alt="Instagram preview" className="h-52 w-full object-cover" loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
