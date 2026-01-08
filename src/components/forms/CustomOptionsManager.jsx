import AddableSelect from "./AddableSelect"
import { useCustomOptions } from "../../hooks/useCustomOptions"

const CustomOptionsManager = () => {
  const locations = useCustomOptions("locations", [])
  const propertyTypes = useCustomOptions("property_type", [])
  const amenities = useCustomOptions("amenities", [])
  const statuses = useCustomOptions("statuses", [])

  return (
    <div className="rounded-3xl border border-white/40 bg-white/80 p-6">
      <div className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-slate">Custom options</div>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <AddableSelect
          label="Locations"
          options={locations.options}
          value=""
          onChange={() => null}
          onAdd={locations.addOption}
          placeholder="Add new location"
        />
        <AddableSelect
          label="Property types"
          options={propertyTypes.options}
          value=""
          onChange={() => null}
          onAdd={propertyTypes.addOption}
          placeholder="Add new property type"
        />
        <AddableSelect
          label="Amenities"
          options={amenities.options}
          value=""
          onChange={() => null}
          onAdd={amenities.addOption}
          placeholder="Add new amenity"
        />
        <AddableSelect
          label="Statuses"
          options={statuses.options}
          value=""
          onChange={() => null}
          onAdd={statuses.addOption}
          placeholder="Add new status"
        />
      </div>
    </div>
  )
}

export default CustomOptionsManager
