export const propertyTypes = ["Apartment", "Villa", "Land", "Commercial", "Office", "Duplex"]

export const locations = [
  "Doha El Hoss",
  "Hamra",
  "Verdun",
  "Achrafieh",
  "Hazmieh",
  "Jounieh",
  "Byblos",
  "Tyre",
  "Sidon",
  "Tripoli"
]

export const sampleProperties = [
  {
    id: "prop-001",
    title: "Sea-view duplex in Achrafieh",
    price: 425000,
    currency: "USD",
    location: "Achrafieh",
    rooms: 3,
    baths: 4,
    area: 280,
    status: "Available",
    views: 182,
    image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: "prop-002",
    title: "Modern villa in Hazmieh",
    price: 1250000,
    currency: "USD",
    location: "Hazmieh",
    rooms: 5,
    baths: 6,
    area: 560,
    status: "Reserved",
    views: 312,
    image: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: "prop-003",
    title: "Penthouse with marina view",
    price: 790000,
    currency: "USD",
    location: "Jounieh",
    rooms: 4,
    baths: 4,
    area: 330,
    status: "Negotiation",
    views: 221,
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: "prop-004",
    title: "Boutique retail space in Hamra",
    price: 240000,
    currency: "USD",
    location: "Hamra",
    rooms: 1,
    baths: 1,
    area: 95,
    status: "Available",
    views: 140,
    image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=1200&auto=format&fit=crop"
  }
]

export const inquiriesMock = [
  {
    id: "inq-001",
    name: "Nour K.",
    phone: "+96170111222",
    email: "nour@example.com",
    property: "Sea-view duplex in Achrafieh",
    status: "New",
    preferredContact: "WhatsApp",
    date: "2026-01-02"
  },
  {
    id: "inq-002",
    name: "Karim S.",
    phone: "+96176123456",
    email: "karim@example.com",
    property: "Modern villa in Hazmieh",
    status: "Scheduled",
    preferredContact: "Call",
    date: "2026-01-03"
  }
]

export const analyticsMock = {
  totalVisitors: 12420,
  uniqueVisitors: 7580,
  pageViews: 48210,
  inquiries: 312,
  conversionRate: 2.5,
  popularSearches: [
    { label: "Achrafieh • Apartment", value: 124 },
    { label: "Hamra • Office", value: 98 },
    { label: "Jounieh • Villa", value: 86 }
  ],
  inquiriesByProperty: [
    { name: "Sea-view duplex", value: 18 },
    { name: "Hazmieh villa", value: 26 },
    { name: "Jounieh penthouse", value: 14 }
  ],
  trafficSources: [
    { name: "Direct", value: 38 },
    { name: "Social", value: 24 },
    { name: "Search", value: 28 },
    { name: "Referral", value: 10 }
  ],
  viewsByProperty: [
    { name: "Sea-view duplex", value: 182 },
    { name: "Hazmieh villa", value: 312 },
    { name: "Jounieh penthouse", value: 221 },
    { name: "Hamra retail", value: 140 }
  ]
}
