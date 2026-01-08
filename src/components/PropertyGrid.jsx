import PropertyCard from "./PropertyCard"

const PropertyGrid = ({ properties, compareIds, onToggleCompare }) => {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {properties.map((property) => (
        <PropertyCard
          key={property.id}
          property={property}
          showCompare={Boolean(compareIds)}
          selected={compareIds?.includes(property.id)}
          onToggleCompare={onToggleCompare}
        />
      ))}
    </div>
  )
}

export default PropertyGrid
