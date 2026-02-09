import PropertyCard from "./PropertyCard"

const PropertyGrid = ({ properties, showWhatsapp = true }) => {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {properties.map((property) => (
        <PropertyCard
          key={property.id}
          property={property}
          showWhatsapp={showWhatsapp}
        />
      ))}
    </div>
  )
}

export default PropertyGrid
