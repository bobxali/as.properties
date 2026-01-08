import { ensureSupabase } from "./supabase"

const storage = {
  get(key, fallback) {
    try {
      const raw = localStorage.getItem(key)
      return raw ? JSON.parse(raw) : fallback
    } catch (error) {
      return fallback
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      return null
    }
  }
}

export const api = {
  async listProperties() {
    try {
      const supabase = ensureSupabase()
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .order("created_at", { ascending: false })
      if (error) throw error
      if (data && data.length) {
        return data
      }
      return storage.get("properties", [])
    } catch (error) {
      return storage.get("properties", [])
    }
  },
  async listCustomOptions(category) {
    try {
      const supabase = ensureSupabase()
      const { data, error } = await supabase
        .from("custom_options")
        .select("value")
        .eq("category", category)
        .order("value")
      if (error) throw error
      return data.map((row) => row.value)
    } catch (error) {
      return storage.get(`custom_options_${category}`, [])
    }
  },
  async addCustomOption(category, value) {
    try {
      const supabase = ensureSupabase()
      const { error } = await supabase
        .from("custom_options")
        .insert([{ category, value }])
      if (error) throw error
      return value
    } catch (error) {
      const existing = storage.get(`custom_options_${category}`, [])
      const next = Array.from(new Set([...existing, value]))
      storage.set(`custom_options_${category}`, next)
      return value
    }
  },
  async saveInquiry(payload) {
    try {
      const supabase = ensureSupabase()
      const { error } = await supabase.from("inquiries").insert([payload])
      if (error) throw error
      return true
    } catch (error) {
      const existing = storage.get("inquiries", [])
      storage.set("inquiries", [...existing, { ...payload, id: Date.now() }])
      return true
    }
  },
  async saveDraft(payload) {
    try {
      const supabase = ensureSupabase()
      const { error } = await supabase.from("drafts").insert([{ payload }])
      if (error) throw error
      return true
    } catch (error) {
      storage.set("draft_latest", payload)
      return true
    }
  },
  async saveProperty(payload) {
    try {
      const supabase = ensureSupabase()
      const record = {
        title: payload.title,
        listing_type: payload.listingType || payload.listing_type || null,
        location: payload.location || null,
        locations: payload.locations || [],
        property_types: payload.propertyTypes || payload.property_types || [],
        price: payload.price || null,
        currency: payload.currency || null,
        rooms: payload.rooms || null,
        baths: payload.baths || null,
        area: payload.area || null,
        status: payload.status || null,
        views: payload.views || 0,
        media: payload.media || [],
        custom_fields: payload.customFields || payload.custom_fields || [],
        specs: {
          address: payload.address || null,
          ownershipDoc: payload.ownershipDoc || null,
          floor: payload.floor ?? null,
          floorsTotal: payload.floorsTotal ?? null,
          balconies: payload.balconies ?? null,
          condition: payload.condition || null,
          yearBuilt: payload.yearBuilt || null,
          marketing: payload.marketing || null,
          customBadges: payload.customBadges || [],
          amenities: payload.amenities || [],
          kitchen: payload.kitchen || null,
          finishing: payload.finishing || null,
          waterSources: payload.waterSources || [],
          features: payload.features || [],
          paymentTerms: payload.paymentTerms || [],
          installment: payload.installment || false,
          downPayment: payload.downPayment || null,
          installments: payload.installments || null,
          monthlyPayment: payload.monthlyPayment || null,
          negotiable: payload.negotiable || false,
          videoLinks: payload.videoLinks || [],
          tourLinks: payload.tourLinks || [],
          whatsapp: payload.whatsapp || null,
          phones: payload.phones || [],
          emails: payload.emails || [],
          agent: payload.agent || null,
          descriptions: {
            ar: payload.descriptionAr || "",
            en: payload.descriptionEn || "",
            fr: payload.descriptionFr || ""
          },
          meta: {
            title: payload.metaTitle || "",
            description: payload.metaDescription || "",
            keywords: payload.keywords || [],
            slug: payload.slug || "",
            storage_folder: payload.storageFolder || ""
          },
          featured_image: payload.featured_image || null
        },
        created_at: payload.createdAt || new Date().toISOString()
      }
      const { error } = await supabase.from("properties").insert([record])
      if (error) throw error
      return true
    } catch (error) {
      const existing = storage.get("properties", [])
      const withId = { id: payload.id || `local-${Date.now()}`, ...payload }
      storage.set("properties", [...existing, withId])
      return true
    }
  }
  ,
  async deleteProperty(id) {
    const isUuid = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/.test(id)
    if (!isUuid) {
      const existing = storage.get("properties", [])
      storage.set("properties", existing.filter((item) => item.id !== id))
      return true
    }
    let supabase = null
    try {
      supabase = ensureSupabase()
    } catch (error) {
      const existing = storage.get("properties", [])
      storage.set("properties", existing.filter((item) => item.id !== id))
      return true
    }

    const { data: existing, error: fetchError } = await supabase
      .from("properties")
      .select("media, specs")
      .eq("id", id)
      .single()
    if (fetchError) throw fetchError
    const media = Array.isArray(existing?.media) ? existing.media : []
    const paths = media.map((item) => item?.path).filter(Boolean)
    if (paths.length) {
      const { error: storageError } = await supabase.storage.from("property-images").remove(paths)
      if (storageError) throw storageError
    } else {
      const folder = existing?.specs?.meta?.storage_folder || existing?.specs?.meta?.slug
      if (folder) {
        const { data: files, error: listError } = await supabase.storage
          .from("property-images")
          .list(`properties/${folder}`)
        if (listError) throw listError
        const folderPaths = (files || []).map((file) => `properties/${folder}/${file.name}`)
        if (folderPaths.length) {
          const { error: folderRemoveError } = await supabase.storage.from("property-images").remove(folderPaths)
          if (folderRemoveError) throw folderRemoveError
        }
      }
    }
    const { error } = await supabase.from("properties").delete().eq("id", id)
    if (error) throw error
    return true
  },
  async duplicateProperty(payload) {
    const copy = { ...payload }
    delete copy.id
    return this.saveProperty({ ...copy, createdAt: new Date().toISOString() })
  }
}
