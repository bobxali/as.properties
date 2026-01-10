import { useEffect, useMemo, useRef, useState } from "react"
import { useLanguage } from "../hooks/useLanguage"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { api } from "../lib/api"
import { supabase } from "../lib/supabase"
import StepIndicator from "../components/forms/StepIndicator"
import AddableSelect from "../components/forms/AddableSelect"
import AddableCheckboxGroup from "../components/forms/AddableCheckboxGroup"
import { useCustomOptions } from "../hooks/useCustomOptions"

const AdminWizard = () => {
  const { t } = useLanguage()
  const location = useLocation()
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditing = Boolean(id)
  const steps = useMemo(
    () => [
      t("admin.wizard.stepBasic"),
      t("admin.wizard.stepDetails"),
      t("admin.wizard.stepAmenities"),
      t("admin.wizard.stepPricing"),
      t("admin.wizard.stepMedia"),
      t("admin.wizard.stepContact"),
      t("admin.wizard.stepDescription")
    ],
    [t]
  )
  const [step, setStep] = useState(0)
  const [lastAddress, setLastAddress] = useState("")
  const [mediaItems, setMediaItems] = useState([])
  const [loadedMedia, setLoadedMedia] = useState(null)
  const [mediaDirty, setMediaDirty] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [dragId, setDragId] = useState(null)
  const [toast, setToast] = useState(null)
  const toastTimer = useRef(null)
  const [form, setForm] = useState({
    propertyTypes: [],
    listingType: "Sale",
    title: "",
    titleAuto: true,
    location: "",
    locations: [],
    address: "",
    ownershipDoc: "",
    area: 150,
    floor: 0,
    floorsTotal: 5,
    rooms: 3,
    baths: 2,
    balconies: 1,
    condition: "New",
    yearBuilt: "2020",
    customFields: [{ label: "", value: "", display: true }],
    marketing: { featured: false, urgent: false, hot: false },
    customBadges: [],
    amenities: [],
    kitchen: "Installed",
    finishing: "Deluxe",
    waterSources: [],
    features: [],
    price: 165000,
    currency: "USD",
    paymentTerms: [],
    installment: false,
    downPayment: 20,
    installments: 12,
    monthlyPayment: 0,
    negotiable: false,
    media: [],
    videoLinks: [""],
    tourLinks: [""],
    whatsapp: "+961 71 115 980",
    phones: [""],
    emails: [""],
    agent: "",
    status: "Available",
    descriptionAr: "",
    descriptionEn: "",
    descriptionFr: "",
    descriptionAutoAr: true,
    descriptionAutoEn: true,
    descriptionAutoFr: true,
    metaTitleAuto: true,
    metaTitle: "",
    metaDescriptionAuto: true,
    metaDescription: "",
    keywords: [],
    slugAuto: true,
    slug: "",
    storageFolder: "",
    notes: ""
  })
  const [draftSaved, setDraftSaved] = useState(false)

  const normalizeMedia = (media) => {
    if (!media) return { images: [], videos: [], tours: [] }
    if (Array.isArray(media)) {
      return { images: media, videos: [], tours: [] }
    }
    return {
      images: Array.isArray(media.images) ? media.images : [],
      videos: Array.isArray(media.videos) ? media.videos : [],
      tours: Array.isArray(media.tours) ? media.tours : []
    }
  }

  const getPreviewUrl = async (path, url) => {
    if (url) return url
    if (!supabase || !path) return ""
    const { data } = supabase.storage.from("property-images").getPublicUrl(path)
    if (data?.publicUrl) return data.publicUrl
    const signed = await supabase.storage.from("property-images").createSignedUrl(path, 3600)
    return signed?.data?.signedUrl || ""
  }

  const propertyTypes = useCustomOptions("property_type", ["شقة 🏢", "فيلا 🏡", "أرض 🏞️", "محل تجاري 🏪", "مكتب 🏢", "دوبلكس 🏘️"])
  const listingTypes = useCustomOptions("listing_type", ["للبيع", "للإيجار"])
  const locations = useCustomOptions("locations", [
    "الحمرا | Hamra",
    "رأس بيروت | Ras Beirut",
    "عين المريسة | Ain El Mreisseh",
    "المنارة | Manara",
    "كليمنصو | Clemenceau",
    "فردان | Verdun",
    "ميناء الحصن | Minet El Hosn",
    "زيتونة باي | Zaitunay Bay",
    "وسط بيروت | Downtown Beirut",
    "الصيفي | Saifi",
    "الجميزة | Gemmayzeh",
    "مار مخايل | Mar Mikhael",
    "الأشرفية | Achrafieh",
    "بدارو | Badaro",
    "الباشورة | Bachoura",
    "الطريق الجديدة | Tariq El Jdideh",
    "المصيطبة | Msaytbeh",
    "الكرنتينا | Karantina",
    "المزرعة | Mazraa",
    "قنطاري | Kantari",
    "الرملة البيضاء | Ramlet El Baida",
    "زقاق البلاط | Zokak El Blat",
    "الضاحية الجنوبية | Dahye (Southern Suburbs)",
    "حارة حريك | Haret Hreik",
    "الغبيري | Ghobeiry",
    "المريجة | Mreijeh",
    "الشياح | Chiyah",
    "الحدث | Hadath",
    "برج البراجنة | Burj El Barajneh",
    "تحويطة الغدير | Tahouitat El Ghadir",
    "الليلكي | Laylaki",
    "الأوزاعي | Ouzai",
    "حي السلم | Hay El Sellom",
    "الكفاءات | Kafaat",
    "الجاموس | Jammous",
    "الرويس | Rweiss",
    "المشرفية | Msharafieh",
    "السان تيريز | Sainte Thérèse",
    "بئر حسن | Bir Hassan",
    "بعبدا القديمة | Old Baabda",
    "الجمهور | Jamhour",
    "اليرزة | Yarzeh",
    "الحدث الجامعية | Hadath University Area",
    "محيط قصر بعبدا | Near Baabda Palace",
    "محيط جامعة القديس يوسف | Near Saint Joseph University",
    "حي الأميركان | Hay El Amrikan",
    "حي الأبيض | Hay El Abyad",
    "الجديدة | Jdeideh",
    "سن الفيل | Sin El Fil",
    "الدكوانة | Dekwaneh",
    "انطلياس | Antelias",
    "جل الديب | Jal El Dib",
    "الزلقا | Zalka",
    "المنصورية | Mansourieh",
    "المكلس | Mkalles",
    "الفنار | Fanar",
    "الربوة | Rabweh",
    "بياقوت | Biakout",
    "بيت مري | Beit Mery",
    "برمانا | Broummana",
    "بصاليم | Bsalim",
    "بيت شباب | Beit Chabab",
    "الشويفات | Choueifat",
    "شويفات العمروسية | Choueifat - Amroussieh",
    "شويفات الأوتوستراد | Choueifat Highway",
    "شويفات الصناعية | Choueifat Industrial Area",
    "بشامون | Bshamoun",
    "بشامون المدارس | Bshamoun - Schools Area",
    "بشامون العالية | Upper Bshamoun",
    "بشامون السفلية | Lower Bshamoun",
    "بشامون الصناعية | Bshamoun Industrial Area",
    "بشامون الأميركان | Bshamoun American Area",
    "بشامون الشارع العام | Bshamoun Main Road",
    "محيط بشامون | Bshamoun Surroundings",
    "عرمون | Aramoun",
    "عرمون العالية | Upper Aramoun",
    "عرمون السفلية | Lower Aramoun",
    "عرمون الشارع العام | Aramoun Main Road",
    "عرمون الأوتوستراد | Aramoun Highway",
    "عرمون قرب الشويفات | Aramoun - Near Choueifat",
    "عرمون قرب خلدة | Aramoun - Near Khalde",
    "محيط عرمون | Aramoun Surroundings",
    "خلدة | Khalde",
    "خلدة البحرية | Khalde Seafront",
    "خلدة الأوتوستراد | Khalde Highway",
    "خلدة القديمة | Old Khalde",
    "خلدة الجديدة | New Khalde",
    "خلدة قرب المطار | Khalde - Near Airport",
    "محيط خلدة | Khalde Surroundings",
    "دير قوبل | Der Qoubel",
    "دوحة الحص | Dawhet El Hoss",
    "الحازمية | Hazmieh",
    "جونيه | Jounieh",
    "جبيل | Byblos",
    "صور | Tyre",
    "صيدا | Sidon",
    "طرابلس | Tripoli"
  ])
  const ownershipDocs = useCustomOptions("ownership_doc", [
    "سند أخضر",
    "سند قيد الإنجاز",
    "أوراق كاتب عدل"
  ])
  const conditions = useCustomOptions("conditions", ["جديد", "قيد الإنشاء", "حديث", "قديم", "يحتاج تجديد"])
  const yearBuiltOptions = useCustomOptions("year_built", ["2020", "2021", "2022", "2023", "2024"])
  const amenities = useCustomOptions("amenities", [
    "موقف خاص",
    "مصعد",
    "مولد كهرباء",
    "تدفئة مركزية",
    "تكييف",
    "حديقة",
    "مسبح",
    "حراسة",
    "مستودع",
    "نادي رياضي",
    "ملعب",
    "يسمح بالحيوانات",
    "مخصص لذوي الاحتياجات",
    "انترنت",
    "دش",
    "انتركوم"
  ])
  const kitchens = useCustomOptions("kitchens", ["راكب", "تشطيب", "على الهيكل", "على طلبكم"])
  const finishing = useCustomOptions("finishing", ["سوبر ديلوكس", "ديلوكس", "عادي"])
  const waterSources = useCustomOptions("water", ["مياه شبكة", "بئر ارتوازي"])
  const features = useCustomOptions("features", [
    "طاقة شمسية",
    "شبابيك مزدوجة",
    "باب مصفح",
    "إطلالة بحر",
    "إطلالة جبل"
  ])
  const currencies = useCustomOptions("currencies", ["USD", "LBP", "EUR"])
  const paymentTerms = useCustomOptions("payment_terms", ["كاش", "شيكات", "تقسيط", "قرض مصرفي"])
  const agents = useCustomOptions("agents", ["Owner", "AS.Properties Team"])
  const statuses = useCustomOptions("statuses", ["متوفر", "محجوز", "مباع", "قيد التفاوض"])

  useEffect(() => {
    try {
      const saved = localStorage.getItem("as_last_address")
      if (saved) setLastAddress(saved)
    } catch (error) {
      setLastAddress("")
    }
  }, [])

  useEffect(() => {
    if (!isEditing || !supabase) return
    let isMounted = true
    const loadProperty = async () => {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("id", id)
        .single()
      if (error || !data || !isMounted) return
      const specs = data.specs || {}
      const media = normalizeMedia(data.media)
      const images = await Promise.all(
        (media.images || []).map(async (image, index) => {
          const preview = await getPreviewUrl(image.path, image.url)
          return {
            id: `existing-${index}`,
            name: image.path ? image.path.split("/").slice(-1)[0] : `image-${index + 1}`,
            preview,
            url: image.url || preview,
            path: image.path || "",
            featured: Boolean(image.isCover),
            isCover: Boolean(image.isCover),
            caption: image.caption || "",
            tags: Array.isArray(image.tags) ? image.tags : [],
            existing: true
          }
        })
      )
      setLoadedMedia({
        images: images.map((item) => ({
          path: item.path,
          url: item.url,
          caption: item.caption,
          tags: item.tags,
          isCover: item.isCover
        })),
        videos: media.videos || [],
        tours: media.tours || []
      })
      setMediaItems(images)
      setMediaDirty(false)
      setForm((prev) => ({
        ...prev,
        propertyTypes: data.property_types || [],
        listingType: data.listing_type || "",
        title: data.title || "",
        location: data.location || "",
        locations: data.locations || [],
        address: specs.address || "",
        ownershipDoc: specs.ownershipDoc || "",
        area: data.area || prev.area,
        floor: specs.floor ?? prev.floor,
        floorsTotal: specs.floorsTotal ?? prev.floorsTotal,
        rooms: data.rooms ?? prev.rooms,
        baths: data.baths ?? prev.baths,
        balconies: specs.balconies ?? prev.balconies,
        condition: specs.condition || prev.condition,
        yearBuilt: specs.yearBuilt || prev.yearBuilt,
        customFields: data.custom_fields || prev.customFields,
        marketing: specs.marketing || prev.marketing,
        customBadges: specs.customBadges || prev.customBadges,
        amenities: specs.amenities || prev.amenities,
        kitchen: specs.kitchen || prev.kitchen,
        finishing: specs.finishing || prev.finishing,
        waterSources: specs.waterSources || prev.waterSources,
        features: specs.features || prev.features,
        price: data.price ?? prev.price,
        currency: data.currency || prev.currency,
        paymentTerms: specs.paymentTerms || prev.paymentTerms,
        installment: specs.installment || false,
        downPayment: specs.downPayment ?? prev.downPayment,
        installments: specs.installments ?? prev.installments,
        monthlyPayment: specs.monthlyPayment ?? prev.monthlyPayment,
        negotiable: specs.negotiable || false,
        media: data.media || prev.media,
        videoLinks: specs.videoLinks || prev.videoLinks,
        tourLinks: specs.tourLinks || prev.tourLinks,
        whatsapp: specs.whatsapp || prev.whatsapp,
        phones: specs.phones || prev.phones,
        emails: specs.emails || prev.emails,
        agent: specs.agent || prev.agent,
        status: data.status || prev.status,
        descriptionAr: specs.descriptions?.ar || prev.descriptionAr,
        descriptionEn: specs.descriptions?.en || prev.descriptionEn,
        descriptionFr: specs.descriptions?.fr || prev.descriptionFr,
        metaTitle: specs.meta?.title || prev.metaTitle,
        metaDescription: specs.meta?.description || prev.metaDescription,
        keywords: specs.meta?.keywords || prev.keywords,
        slug: specs.meta?.slug || prev.slug,
        storageFolder: specs.meta?.storage_folder || prev.storageFolder
      }))
    }
    loadProperty()
    return () => {
      isMounted = false
    }
  }, [id, isEditing])

  useEffect(() => {
    const stateData = location.state?.property
    if (stateData && !isEditing) {
      const normalizedMedia = normalizeMedia(stateData.media)
      const existingItems = (normalizedMedia.images || []).map((item, index) => {
        if (typeof item === "string") {
          return {
            id: `existing-${index}`,
            name: `image-${index + 1}`,
            preview: item,
            url: item,
            featured: stateData.featured_image === item,
            existing: true
          }
        }
        return {
          id: `existing-${index}`,
          name: item.url ? item.url.split("/").slice(-1)[0] : `image-${index + 1}`,
          preview: item.url || "",
          url: item.url || "",
          path: item.path || "",
          featured: stateData.featured_image === item.url,
          existing: true
        }
      })
      setMediaItems(existingItems)
      setLoadedMedia(normalizedMedia)
      setMediaDirty(false)
      setForm((prev) => ({
        ...prev,
        ...stateData,
        media: normalizedMedia
      }))
    }
  }, [location.state])

  useEffect(() => {
    if (isEditing) return
    const interval = setInterval(() => {
      api.saveDraft({ ...form, updatedAt: new Date().toISOString() })
      setDraftSaved(true)
      setTimeout(() => setDraftSaved(false), 1500)
    }, 30000)
    return () => clearInterval(interval)
  }, [form, isEditing])

  useEffect(() => {
    const handler = (event) => {
      if (event.ctrlKey && event.key.toLowerCase() === "s") {
        event.preventDefault()
        api.saveDraft({ ...form, updatedAt: new Date().toISOString() })
        setDraftSaved(true)
      }
      if (event.ctrlKey && event.key.toLowerCase() === "p") {
        event.preventDefault()
        alert("Preview opened in new tab (placeholder).")
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [form])

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const showToast = (type, message) => {
    setToast({ type, message })
    if (toastTimer.current) {
      clearTimeout(toastTimer.current)
    }
    toastTimer.current = setTimeout(() => setToast(null), 4000)
  }

  const addMediaFiles = (files) => {
    const remaining = Math.max(0, 3 - mediaItems.length)
    if (remaining === 0) {
      alert("Maximum 3 photos allowed.")
      return
    }
    const limitedFiles = files.slice(0, remaining)
    if (files.length > remaining) {
      alert("Only 3 photos allowed. Extra files were ignored.")
    }
    const nextItems = limitedFiles.map((file) => ({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      file,
      name: file.name,
      preview: URL.createObjectURL(file),
      featured: false,
      existing: false
    }))
    setMediaItems((prev) => [...prev, ...nextItems])
    handleChange("media", [...form.media, ...nextItems.map((item) => item.preview)])
    setMediaDirty(true)
  }

  const moveMediaItem = (fromId, toId) => {
    if (!fromId || !toId || fromId === toId) return
    setMediaItems((prev) => {
      const fromIndex = prev.findIndex((entry) => entry.id === fromId)
      const toIndex = prev.findIndex((entry) => entry.id === toId)
      if (fromIndex === -1 || toIndex === -1) return prev
      const next = [...prev]
      const [moved] = next.splice(fromIndex, 1)
      next.splice(toIndex, 0, moved)
      return next
    })
    setMediaDirty(true)
  }

  const removeMediaItem = (id) => {
    setMediaItems((prev) => {
      const item = prev.find((entry) => entry.id === id)
      if (item?.preview) {
        URL.revokeObjectURL(item.preview)
      }
      const next = prev.filter((entry) => entry.id !== id)
      handleChange("media", next.map((entry) => entry.preview))
      return next
    })
    setMediaDirty(true)
  }

  const setFeatured = (id) => {
    setMediaItems((prev) => {
      const next = prev.map((entry) => ({ ...entry, featured: entry.id === id, isCover: entry.id === id }))
      handleChange("media", next.map((entry) => entry.preview))
      return next
    })
    setMediaDirty(true)
  }

  const getPrimaryLocation = () => form.location || form.locations.join(", ") || "Lebanon"
  const getPrimaryType = () => (form.propertyTypes.length ? form.propertyTypes[0] : "Property")
  const formatAmenities = (items) => items.slice(0, 5).join(", ")
  const parseLocation = (value) => {
    const raw = value || ""
    const normalized = raw.replace(/\s*\|\s*/g, "|").replace(/\s*\/\s*/g, "|")
    if (normalized.includes("|")) {
      const [ar, en] = normalized.split("|")
      return { ar: (ar || raw).trim(), en: (en || ar || raw).trim() }
    }
    return { ar: raw, en: raw }
  }
  const translatePaymentTerms = (items, lang) => {
    if (lang === "ar") return items
    const mapEn = { "كاش": "cash", "شيكات": "checks", "تقسيط": "installments", "قرض مصرفي": "bank loan" }
    const mapFr = { "كاش": "cash", "شيكات": "cheques", "تقسيط": "mensualites", "قرض مصرفي": "credit bancaire" }
    const map = lang === "fr" ? mapFr : mapEn
    return items.map((item) => map[item] || item)
  }

  const typeMapEn = {
    "شقة 🏢": "apartment",
    "شقة": "apartment",
    "فيلا 🏡": "villa",
    "فيلا": "villa",
    "أرض 🏞️": "land",
    "أرض": "land",
    "محل تجاري 🏪": "commercial space",
    "محل تجاري": "commercial space",
    "مكتب 🏢": "office",
    "مكتب": "office",
    "دوبلكس 🏘️": "duplex",
    "دوبلكس": "duplex"
  }

  const listingTypeMapEn = {
    "للبيع": "for sale",
    "للإيجار": "for rent",
    "Sale": "for sale",
    "Rent": "for rent"
  }

  const typeMapFr = {
    "شقة 🏢": "appartement",
    "شقة": "appartement",
    "فيلا 🏡": "villa",
    "فيلا": "villa",
    "أرض 🏞️": "terrain",
    "أرض": "terrain",
    "محل تجاري 🏪": "local commercial",
    "محل تجاري": "local commercial",
    "مكتب 🏢": "bureau",
    "مكتب": "bureau",
    "دوبلكس 🏘️": "duplex",
    "دوبلكس": "duplex"
  }

  const locationMapEn = {
    "دوحة الحص": "Dawhet El Hoss",
    "الحمرا": "Hamra",
    "فردان": "Verdun",
    "الأشرفية": "Achrafieh",
    "الحازمية": "Hazmieh",
    "جونيه": "Jounieh",
    "جبيل": "Byblos",
    "صور": "Tyre",
    "صيدا": "Sidon",
    "طرابلس": "Tripoli"
  }

  const locationMapFr = {
    "دوحة الحص": "Dawhet El Hoss",
    "الحمرا": "Hamra",
    "فردان": "Verdun",
    "الأشرفية": "Achrafieh",
    "الحازمية": "Hazmieh",
    "جونيه": "Jounieh",
    "جبيل": "Byblos",
    "صور": "Tyr",
    "صيدا": "Sidon",
    "طرابلس": "Tripoli"
  }

  const amenityMapEn = {
    "موقف خاص": "private parking",
    "مصعد": "elevator",
    "مولد كهرباء": "generator",
    "تدفئة مركزية": "central heating",
    "تكييف": "A/C",
    "حديقة": "garden",
    "مسبح": "swimming pool",
    "حراسة": "security",
    "مستودع": "storage room",
    "نادي رياضي": "gym",
    "ملعب": "playground",
    "يسمح بالحيوانات": "pet friendly",
    "مخصص لذوي الاحتياجات": "wheelchair accessible",
    "انترنت": "internet",
    "دش": "satellite dish",
    "انتركوم": "intercom"
  }

  const amenityMapFr = {
    "موقف خاص": "parking prive",
    "مصعد": "ascenseur",
    "مولد كهرباء": "generateur",
    "تدفئة مركزية": "chauffage central",
    "تكييف": "climatisation",
    "حديقة": "jardin",
    "مسبح": "piscine",
    "حراسة": "securite",
    "مستودع": "debarras",
    "نادي رياضي": "salle de sport",
    "ملعب": "aire de jeux",
    "يسمح بالحيوانات": "animaux acceptes",
    "مخصص لذوي الاحتياجات": "accessible PMR",
    "انترنت": "internet",
    "دش": "parabole",
    "انتركوم": "interphone"
  }

  const ownershipMapEn = {
    "سند أخضر": "green deed",
    "سند قيد الإنجاز": "under construction deed",
    "أوراق كاتب عدل": "notary papers"
  }

  const ownershipMapFr = {
    "سند أخضر": "titre vert",
    "سند قيد الإنجاز": "titre en construction",
    "أوراق كاتب عدل": "documents notaries"
  }

  const translateList = (items, map) => items.map((item) => map[item] || item)
  const translateLocation = (location, map, lang) => {
    const parsed = parseLocation(location)
    const preferred = lang === "ar" ? parsed.ar : parsed.en
    return map[preferred] || preferred
  }
  const formatAmenitiesTranslated = (items, map) => translateList(items, map).slice(0, 5).join(", ")

  const conditionMapEn = {
    "جديد": "new",
    "قيد الإنشاء": "under construction",
    "حديث": "recent",
    "قديم": "classic",
    "يحتاج تجديد": "needs renovation"
  }

  const conditionMapFr = {
    "جديد": "neuf",
    "قيد الإنشاء": "en construction",
    "حديث": "recent",
    "قديم": "ancien",
    "يحتاج تجديد": "a renover"
  }

  const buildDescriptionAr = () => {
    const type = getPrimaryType()
    const location = parseLocation(getPrimaryLocation()).ar
    const amenitiesText = form.amenities.length ? `المزايا: ${formatAmenities(form.amenities)}.` : ""
    return `${type} في ${location} بمساحة ${form.area} متر، ${form.condition}، ${form.rooms} غرف و${form.baths} حمام و${form.balconies} شرفات. الطابق ${form.floor}، سند ${form.ownershipDoc || "متوفر"}. ${amenitiesText} السعر ${Number(form.price || 0).toLocaleString()} ${form.currency} ${form.paymentTerms.length ? `(${form.paymentTerms.join("، ")})` : ""}.`
  }

  const buildTitleEn = () => {
    const type = typeMapEn[getPrimaryType()] || "property"
    const listing = listingTypeMapEn[form.listingType] || "for sale"
    const location = translateLocation(getPrimaryLocation(), locationMapEn, "en")
    const areaLabel = form.area ? `${form.area}m2` : "spacious"
    const hasSea = form.features.includes("إطلالة بحر")
    const hasMountain = form.features.includes("إطلالة جبل")
    let viewText = ""
    if (hasSea && hasMountain) viewText = " with sea and mountain view"
    else if (hasSea) viewText = " with sea view"
    else if (hasMountain) viewText = " with mountain view"
    return `${areaLabel} ${type} ${listing} in ${location}${viewText}`
  }

  const buildDescriptionEn = () => {
    const type = typeMapEn[getPrimaryType()] || "property"
    const location = translateLocation(getPrimaryLocation(), locationMapEn, "en")
    const condition = conditionMapEn[form.condition] || form.condition || "updated"
    const amenitiesText = form.amenities.length ? `Highlights: ${formatAmenitiesTranslated(form.amenities, amenityMapEn)}.` : ""
    const terms = translatePaymentTerms(form.paymentTerms, "en")
    const deed = ownershipMapEn[form.ownershipDoc] || form.ownershipDoc || "available"
    return `Premium ${type} in ${location} with ${form.area} sqm, ${condition} condition, ${form.rooms} rooms, ${form.baths} baths, and ${form.balconies} balconies. Floor ${form.floor}, deed: ${deed}. ${amenitiesText} Price ${Number(form.price || 0).toLocaleString()} ${form.currency} ${terms.length ? `(${terms.join(", ")})` : ""}.`
  }

  const buildDescriptionFr = () => {
    const type = typeMapFr[getPrimaryType()] || "bien"
    const location = translateLocation(getPrimaryLocation(), locationMapFr, "en")
    const condition = conditionMapFr[form.condition] || form.condition || "renove"
    const amenitiesText = form.amenities.length ? `Atouts: ${formatAmenitiesTranslated(form.amenities, amenityMapFr)}.` : ""
    const terms = translatePaymentTerms(form.paymentTerms, "fr")
    const deed = ownershipMapFr[form.ownershipDoc] || form.ownershipDoc || "disponible"
    return `${type} de standing a ${location}, ${form.area} m2, etat ${condition}, ${form.rooms} chambres, ${form.baths} salles de bain, ${form.balconies} balcons. Etage ${form.floor}, titre: ${deed}. ${amenitiesText} Prix ${Number(form.price || 0).toLocaleString()} ${form.currency} ${terms.length ? `(${terms.join(", ")})` : ""}.`
  }

  useEffect(() => {
    const updates = {}
    if (form.descriptionAutoAr) updates.descriptionAr = buildDescriptionAr()
    if (form.descriptionAutoEn) updates.descriptionEn = buildDescriptionEn()
    if (form.descriptionAutoFr) updates.descriptionFr = buildDescriptionFr()
    if (Object.keys(updates).length) {
      setForm((prev) => ({ ...prev, ...updates }))
    }
  }, [
    form.title,
    form.location,
    form.locations,
    form.propertyTypes,
    form.area,
    form.condition,
    form.rooms,
    form.baths,
    form.balconies,
    form.floor,
    form.ownershipDoc,
    form.amenities,
    form.price,
    form.currency,
    form.paymentTerms,
    form.descriptionAutoAr,
    form.descriptionAutoEn,
    form.descriptionAutoFr
  ])

  useEffect(() => {
    if (!form.titleAuto) return
    const title = buildTitleEn()
    setForm((prev) => ({ ...prev, title }))
  }, [form.area, form.propertyTypes, form.listingType, form.location, form.locations, form.features, form.titleAuto])

  useEffect(() => {
    if (!form.metaTitleAuto) return
    const base = form.title?.trim()
    if (base) {
      setForm((prev) => ({ ...prev, metaTitle: `AS.Properties | ${base}` }))
    }
  }, [form.title, form.metaTitleAuto])

  useEffect(() => {
    if (!form.slugAuto) return
    const base = form.title?.trim()
    if (base) {
      const slug = base
        .toLowerCase()
        .replace(/[^a-z0-9\u0600-\u06ff]+/g, "-")
        .replace(/^-+|-+$/g, "")
      setForm((prev) => ({ ...prev, slug }))
    }
  }, [form.title, form.slugAuto])

  useEffect(() => {
    if (!form.metaDescriptionAuto) return
    const source = form.descriptionAr?.trim() || form.descriptionEn?.trim()
    if (source) {
      setForm((prev) => ({ ...prev, metaDescription: source.slice(0, 155) }))
    }
  }, [form.descriptionAr, form.descriptionEn, form.metaDescriptionAuto])

  useEffect(() => {
    if (form.installment) {
      const remainder = form.price * (1 - form.downPayment / 100)
      const monthly = form.installments ? remainder / form.installments : 0
      handleChange("monthlyPayment", Math.round(monthly))
    }
  }, [form.installment, form.downPayment, form.installments, form.price])

  const preview = useMemo(() => {
    return {
      title: form.title || "Untitled listing",
      price: `${form.currency} ${Number(form.price || 0).toLocaleString()}`,
      location: form.location || form.locations.join(", ") || "Location TBD",
      status: form.status
    }
  }, [form])

  const uploadMediaFiles = async () => {
    const folderBase = form.slug || `listing-${Date.now()}`
    const folderSafe = folderBase.toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "")
    const images = []
    if (!supabase || mediaItems.length === 0) {
      mediaItems.forEach((item) => {
        images.push({
          path: item.path || "",
          url: item.url || item.preview || "",
          caption: item.caption || "",
          tags: Array.isArray(item.tags) ? item.tags : [],
          isCover: Boolean(item.featured || item.isCover)
        })
      })
      return { images, folderSafe }
    }
    for (const item of mediaItems) {
      if (item.existing && (item.url || item.path)) {
        images.push({
          path: item.path || "",
          url: item.url || item.preview || "",
          caption: item.caption || "",
          tags: Array.isArray(item.tags) ? item.tags : [],
          isCover: Boolean(item.featured || item.isCover)
        })
        continue
      }
      if (!item.file) continue
      const safeName = item.name.replace(/[^a-zA-Z0-9._-]/g, "-")
      const path = `properties/${folderSafe}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safeName}`
      const { error } = await supabase.storage.from("property-images").upload(path, item.file)
      if (error) {
        throw new Error(`Upload failed for ${item.name}`)
      }
      const { data } = supabase.storage.from("property-images").getPublicUrl(path)
      images.push({
        path,
        url: data?.publicUrl || "",
        caption: item.caption || "",
        tags: Array.isArray(item.tags) ? item.tags : [],
        isCover: Boolean(item.featured || item.isCover)
      })
    }
    return { images, folderSafe }
  }

  const handlePublish = async () => {
    try {
      if (!supabase) {
        showToast("error", t("admin.wizard.supabaseMissing"))
        return
      }
      setUploading(true)
        const uploadResult = await uploadMediaFiles()
        const mediaPayload = mediaDirty
          ? {
              images: uploadResult.images,
              videos: form.videoLinks.filter(Boolean).map((url) => ({ url })),
              tours: form.tourLinks.filter(Boolean).map((url) => ({ url }))
            }
          : {
              ...(loadedMedia || { images: uploadResult.images }),
              videos: form.videoLinks.filter(Boolean).map((url) => ({ url })),
              tours: form.tourLinks.filter(Boolean).map((url) => ({ url }))
            }
        const featuredEntry = mediaPayload.images?.find((item) => item?.isCover)
        const featuredUrl = featuredEntry?.url || featuredEntry?.path || ""
        const record = {
          title: form.title,
          listing_type: form.listingType || null,
          location: form.location || null,
          locations: form.locations || [],
          property_types: form.propertyTypes || [],
          price: form.price || null,
          currency: form.currency || null,
          rooms: form.rooms || null,
          baths: form.baths || null,
          area: form.area || null,
          status: form.status || null,
          views: isEditing ? undefined : Math.floor(120 + Math.random() * 330),
          media: mediaPayload,
          custom_fields: form.customFields || [],
          specs: {
            address: form.address || null,
            ownershipDoc: form.ownershipDoc || null,
            floor: form.floor ?? null,
            floorsTotal: form.floorsTotal ?? null,
            balconies: form.balconies ?? null,
            condition: form.condition || null,
            yearBuilt: form.yearBuilt || null,
            marketing: form.marketing || null,
            customBadges: form.customBadges || [],
            amenities: form.amenities || [],
            kitchen: form.kitchen || null,
            finishing: form.finishing || null,
            waterSources: form.waterSources || [],
            features: form.features || [],
            paymentTerms: form.paymentTerms || [],
            installment: form.installment || false,
            downPayment: form.downPayment || null,
            installments: form.installments || null,
            monthlyPayment: form.monthlyPayment || null,
            negotiable: form.negotiable || false,
            videoLinks: form.videoLinks || [],
            tourLinks: form.tourLinks || [],
            whatsapp: form.whatsapp || null,
            phones: form.phones || [],
            emails: form.emails || [],
            agent: form.agent || null,
            descriptions: {
              ar: form.descriptionAr || "",
              en: form.descriptionEn || "",
              fr: form.descriptionFr || ""
            },
            meta: {
              title: form.metaTitle || "",
              description: form.metaDescription || "",
              keywords: form.keywords || [],
              slug: form.slug || "",
              storage_folder: isEditing ? form.storageFolder || "" : uploadResult.folderSafe || ""
            },
            featured_image: featuredUrl || null
          }
        }
        if (isEditing) {
          delete record.views
          const { error } = await supabase.from("properties").update(record).eq("id", id)
          if (error) throw error
        } else {
          const { error } = await supabase.from("properties").insert([record]).select().single()
          if (error) throw error
        }
        showToast("success", isEditing ? t("admin.wizard.successUpdate") : t("admin.wizard.successPublish"))
        navigate("/admin")
      } catch (error) {
        showToast("error", error.message || t("admin.wizard.errorPublish"))
      } finally {
      setUploading(false)
    }
  }

  return (
    <section className="mx-auto w-full max-w-6xl space-y-8 px-6 py-12 text-base md:text-[15px]">
      {toast ? (
        <div
          className={`fixed right-6 top-6 z-50 rounded-2xl px-4 py-3 text-sm shadow-lg ${
            toast.type === "error" ? "bg-red-500 text-white" : "bg-emerald-500 text-white"
          }`}
        >
          {toast.message}
        </div>
      ) : null}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-brand-gold">Admin</div>
          <h1 className="text-3xl font-semibold text-brand-charcoal">Property Wizard</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="rounded-full border border-brand-navy px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-navy">
            Save & Continue Later
          </button>
          <button
            className="rounded-full bg-brand-navy px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white"
            onClick={handlePublish}
            disabled={uploading}
          >
            {uploading ? t("admin.wizard.publishing") : t("admin.wizard.publish")}
          </button>
        </div>
      </div>
      <StepIndicator steps={steps} current={step} />
      {draftSaved ? <div className="text-xs text-brand-navy">Draft auto-saved.</div> : null}

      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <div className="space-y-6">
          {step === 0 ? (
            <div className="space-y-6 rounded-3xl border border-white/40 bg-white/80 p-6">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-slate">Step 1: Basic info</div>
              <AddableCheckboxGroup
                label="Property type"
                options={propertyTypes.options}
                values={form.propertyTypes}
                onChange={(values) => handleChange("propertyTypes", values)}
                onAdd={propertyTypes.addOption}
              />
              <AddableSelect
                label="Listing type"
                options={listingTypes.options}
                value={form.listingType}
                onChange={(value) => handleChange("listingType", value)}
                onAdd={listingTypes.addOption}
                placeholder="Select listing type"
              />
              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-slate">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  className="mt-2 w-full rounded-2xl border border-white/40 bg-white/80 px-4 py-3 text-sm"
                  value={form.title}
                  maxLength={100}
                  onChange={(event) => handleChange("title", event.target.value)}
                  placeholder="Auto-generate or edit"
                />
                <label className="mt-2 flex items-center gap-2 text-sm text-brand-slate">
                  <input
                    type="checkbox"
                    checked={form.titleAuto}
                    onChange={(event) => handleChange("titleAuto", event.target.checked)}
                  />
                  Auto-generate English title
                </label>
                <div className="mt-1 text-xs text-brand-slate">{form.title.length}/100</div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-slate">
                  Primary location *
                </label>
                <input
                  list="location-options"
                  className="w-full rounded-2xl border border-white/40 bg-white/80 px-4 py-3 text-sm"
                  placeholder="Type to search location"
                  value={form.location}
                  onChange={(event) => handleChange("location", event.target.value)}
                />
                <datalist id="location-options">
                  {locations.options.map((option, index) => (
                    <option key={`${option}-${index}`} value={option} />
                  ))}
                </datalist>
              </div>
              <div className="rounded-2xl border border-white/40 bg-white/70 p-4">
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-slate">Add new location (Arabic + English)</div>
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  <input
                    className="rounded-2xl border border-white/40 bg-white/80 px-3 py-2 text-sm"
                    placeholder="Arabic name"
                    value={form.newLocationAr || ""}
                    onChange={(event) => handleChange("newLocationAr", event.target.value)}
                  />
                  <input
                    className="rounded-2xl border border-white/40 bg-white/80 px-3 py-2 text-sm"
                    placeholder="English name"
                    value={form.newLocationEn || ""}
                    onChange={(event) => handleChange("newLocationEn", event.target.value)}
                  />
                </div>
                <button
                  type="button"
                  className="mt-3 rounded-2xl border border-brand-gold px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-navy"
                  onClick={() => {
                    const ar = (form.newLocationAr || "").trim()
                    const en = (form.newLocationEn || "").trim()
                    if (!ar || !en) return
                    const label = `${ar} | ${en}`
                    locations.addOption(label)
                    handleChange("location", label)
                    handleChange("newLocationAr", "")
                    handleChange("newLocationEn", "")
                  }}
                >
                  Add location
                </button>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-slate">Specific address</label>
                <input
                  className="mt-2 w-full rounded-2xl border border-white/40 bg-white/80 px-4 py-3 text-sm"
                  value={form.address}
                  onChange={(event) => {
                    handleChange("address", event.target.value)
                    try {
                      localStorage.setItem("as_last_address", event.target.value)
                      setLastAddress(event.target.value)
                    } catch (error) {
                      setLastAddress(event.target.value)
                    }
                  }}
                  placeholder="Optional"
                />
                <button
                  className="mt-2 rounded-full border border-brand-gold px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-brand-navy"
                  type="button"
                  onClick={() => handleChange("address", lastAddress)}
                >
                  Copy from previous
                </button>
              </div>
            </div>
          ) : null}

          {step === 1 ? (
            <div className="space-y-6 rounded-3xl border border-white/40 bg-white/80 p-6">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-slate">Step 2: Property details</div>
              <AddableSelect
                label="Ownership document"
                options={ownershipDocs.options}
                value={form.ownershipDoc}
                onChange={(value) => handleChange("ownershipDoc", value)}
                onAdd={ownershipDocs.addOption}
              />
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-slate">Area (sqm)</label>
                  <input
                    type="number"
                    min="1"
                    className="mt-2 w-full rounded-2xl border border-white/40 bg-white/80 px-4 py-3 text-sm"
                    value={form.area}
                    onChange={(event) => handleChange("area", Number(event.target.value))}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-slate">Floor number</label>
                  <input
                    type="number"
                    className="mt-2 w-full rounded-2xl border border-white/40 bg-white/80 px-4 py-3 text-sm"
                    value={form.floor}
                    onChange={(event) => handleChange("floor", Number(event.target.value))}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-slate">Total floors</label>
                  <input
                    type="number"
                    className="mt-2 w-full rounded-2xl border border-white/40 bg-white/80 px-4 py-3 text-sm"
                    value={form.floorsTotal}
                    onChange={(event) => handleChange("floorsTotal", Number(event.target.value))}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-slate">Rooms</label>
                  <input
                    type="number"
                    className="mt-2 w-full rounded-2xl border border-white/40 bg-white/80 px-4 py-3 text-sm"
                    value={form.rooms}
                    onChange={(event) => handleChange("rooms", Number(event.target.value))}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-slate">Bathrooms</label>
                  <input
                    type="number"
                    className="mt-2 w-full rounded-2xl border border-white/40 bg-white/80 px-4 py-3 text-sm"
                    value={form.baths}
                    onChange={(event) => handleChange("baths", Number(event.target.value))}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-slate">Balconies</label>
                  <input
                    type="number"
                    className="mt-2 w-full rounded-2xl border border-white/40 bg-white/80 px-4 py-3 text-sm"
                    value={form.balconies}
                    onChange={(event) => handleChange("balconies", Number(event.target.value))}
                  />
                </div>
              </div>
              <AddableSelect
                label="Building condition"
                options={conditions.options}
                value={form.condition}
                onChange={(value) => handleChange("condition", value)}
                onAdd={conditions.addOption}
              />
              <AddableSelect
                label="Year built"
                options={[...Array.from({ length: 77 }, (_, i) => String(1950 + i)), ...yearBuiltOptions.options]}
                value={form.yearBuilt}
                onChange={(value) => handleChange("yearBuilt", value)}
                onAdd={yearBuiltOptions.addOption}
              />
            </div>
          ) : null}

          {step === 2 ? (
            <div className="space-y-6 rounded-3xl border border-white/40 bg-white/80 p-6">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-slate">Step 3: Amenities & features</div>
              <AddableCheckboxGroup
                label="Amenities"
                options={amenities.options}
                values={form.amenities}
                onChange={(values) => handleChange("amenities", values)}
                onAdd={amenities.addOption}
              />
              <AddableSelect
                label="Kitchen type"
                options={kitchens.options}
                value={form.kitchen}
                onChange={(value) => handleChange("kitchen", value)}
                onAdd={kitchens.addOption}
              />
              <AddableSelect
                label="Finishing level"
                options={finishing.options}
                value={form.finishing}
                onChange={(value) => handleChange("finishing", value)}
                onAdd={finishing.addOption}
              />
              <AddableCheckboxGroup
                label="Water source"
                options={waterSources.options}
                values={form.waterSources}
                onChange={(values) => handleChange("waterSources", values)}
                onAdd={waterSources.addOption}
              />
              <AddableCheckboxGroup
                label="Additional features"
                options={features.options}
                values={form.features}
                onChange={(values) => handleChange("features", values)}
                onAdd={features.addOption}
              />
            </div>
          ) : null}

          {step === 3 ? (
            <div className="space-y-6 rounded-3xl border border-white/40 bg-white/80 p-6">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-slate">Step 4: Pricing & terms</div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-slate">Price</label>
                  <input
                    type="number"
                    className="mt-2 w-full rounded-2xl border border-white/40 bg-white/80 px-4 py-3 text-sm"
                    value={form.price}
                    onChange={(event) => handleChange("price", Number(event.target.value))}
                  />
                </div>
                <AddableSelect
                  label="Currency"
                  options={currencies.options}
                  value={form.currency}
                  onChange={(value) => handleChange("currency", value)}
                  onAdd={currencies.addOption}
                />
              </div>
              <AddableCheckboxGroup
                label="Payment terms"
                options={paymentTerms.options}
                values={form.paymentTerms}
                onChange={(values) => handleChange("paymentTerms", values)}
                onAdd={paymentTerms.addOption}
              />
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={form.installment}
                  onChange={(event) => handleChange("installment", event.target.checked)}
                />
                <div className="text-sm text-brand-slate">Enable installment plan</div>
              </div>
              {form.installment ? (
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-slate">Down payment %</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      className="mt-2 w-full rounded-2xl border border-white/40 bg-white/80 px-4 py-3 text-sm"
                      value={form.downPayment}
                      onChange={(event) => handleChange("downPayment", Number(event.target.value))}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-slate">Installments</label>
                    <input
                      type="number"
                      className="mt-2 w-full rounded-2xl border border-white/40 bg-white/80 px-4 py-3 text-sm"
                      value={form.installments}
                      onChange={(event) => handleChange("installments", Number(event.target.value))}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-slate">Monthly</label>
                    <input
                      disabled
                      className="mt-2 w-full rounded-2xl border border-white/40 bg-white/80 px-4 py-3 text-sm"
                      value={`${form.monthlyPayment} ${form.currency}`}
                    />
                  </div>
                </div>
              ) : null}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={form.negotiable}
                  onChange={(event) => handleChange("negotiable", event.target.checked)}
                />
                <div className="text-sm text-brand-slate">Price negotiable</div>
              </div>
            </div>
          ) : null}

          {step === 4 ? (
            <div className="space-y-6 rounded-3xl border border-white/40 bg-white/80 p-6">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-slate">Step 5: Media upload</div>
              <div className="rounded-3xl border border-dashed border-brand-navy/40 bg-white/60 p-6 text-center text-sm text-brand-slate">
                Drag & drop images here or click to upload. Recommended 1920x1080px.
                <div className="mt-4">
                  <input
                    id="media-upload"
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={(event) => {
                      const files = Array.from(event.target.files || [])
                      if (!files.length) return
                      addMediaFiles(files)
                    }}
                  />
                  <button
                    type="button"
                    className="rounded-2xl bg-brand-navy px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white"
                    onClick={() => document.getElementById("media-upload")?.click()}
                  >
                    {t("admin.wizard.mediaUpload")}
                  </button>
                </div>
              </div>
              <div className="text-xs text-brand-slate">{t("admin.wizard.mediaMax")}</div>
              {mediaItems.length ? (
                <div className="grid gap-4 md:grid-cols-3">
                  {mediaItems.map((item) => (
                    <div
                      key={item.id}
                      className="relative cursor-move overflow-hidden rounded-2xl border border-white/40 bg-white/80"
                      draggable
                      onDragStart={() => setDragId(item.id)}
                      onDragOver={(event) => event.preventDefault()}
                      onDrop={() => {
                        moveMediaItem(dragId, item.id)
                        setDragId(null)
                      }}
                    >
                      <img src={item.preview} alt={item.name} className="h-36 w-full object-cover" />
                      <div className="flex items-center justify-between gap-2 px-3 py-2 text-xs text-brand-slate">
                        <button
                          type="button"
                          className="rounded-full border border-brand-gold px-3 py-1"
                          onClick={() => setFeatured(item.id)}
                        >
                          {item.featured ? t("admin.wizard.mediaFeatured") : t("admin.wizard.mediaSetFeatured")}
                        </button>
                        <button
                          type="button"
                          className="rounded-full border border-red-400 px-3 py-1 text-red-500"
                          onClick={() => removeMediaItem(item.id)}
                        >
                          {t("admin.wizard.mediaRemove")}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-slate">{t("admin.wizard.videoLinks")}</label>
                {form.videoLinks.map((link, index) => (
                  <input
                    key={`video-${index}`}
                    className="mt-2 w-full rounded-2xl border border-white/40 bg-white/80 px-4 py-2 text-sm"
                    value={link}
                    onChange={(event) => {
                      const next = [...form.videoLinks]
                      next[index] = event.target.value
                      handleChange("videoLinks", next)
                    }}
                    placeholder="https://youtube.com/..."
                  />
                ))}
                <button
                  className="mt-2 rounded-2xl border border-brand-gold px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-navy"
                  onClick={() => handleChange("videoLinks", [...form.videoLinks, ""]) }
                >
                  {t("admin.wizard.videoAdd")}
                </button>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-slate">{t("admin.wizard.tourLinks")}</label>
                {form.tourLinks.map((link, index) => (
                  <input
                    key={`tour-${index}`}
                    className="mt-2 w-full rounded-2xl border border-white/40 bg-white/80 px-4 py-2 text-sm"
                    value={link}
                    onChange={(event) => {
                      const next = [...form.tourLinks]
                      next[index] = event.target.value
                      handleChange("tourLinks", next)
                    }}
                    placeholder="https://matterport.com/..."
                  />
                ))}
                <button
                  className="mt-2 rounded-2xl border border-brand-gold px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-navy"
                  onClick={() => handleChange("tourLinks", [...form.tourLinks, ""]) }
                >
                  {t("admin.wizard.tourAdd")}
                </button>
              </div>
            </div>
          ) : null}

          {step === 5 ? (
            <div className="space-y-6 rounded-3xl border border-white/40 bg-white/80 p-6">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-slate">{t("admin.wizard.contactTitle")}</div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-slate">WhatsApp</label>
                  <input
                    className="mt-2 w-full rounded-2xl border border-white/40 bg-white/80 px-4 py-3 text-sm"
                    value={form.whatsapp}
                    readOnly
                  />
                  <div className="mt-1 text-xs text-brand-slate">Fixed number for all listings.</div>
                </div>
                <AddableSelect
                  label="Agent"
                  options={agents.options}
                  value={form.agent}
                  onChange={(value) => handleChange("agent", value)}
                  onAdd={agents.addOption}
                />
              </div>
              <AddableSelect
                label="Status"
                options={statuses.options}
                value={form.status}
                onChange={(value) => handleChange("status", value)}
                onAdd={statuses.addOption}
              />
              <div className="rounded-2xl border border-white/40 bg-white/70 p-4">
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-slate">Marketing options</div>
                <div className="mt-3 flex flex-wrap gap-4 text-sm text-brand-slate">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={form.marketing.featured}
                      onChange={(event) => handleChange("marketing", { ...form.marketing, featured: event.target.checked })}
                    />
                    Featured
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={form.marketing.urgent}
                      onChange={(event) => handleChange("marketing", { ...form.marketing, urgent: event.target.checked })}
                    />
                    Urgent sale
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={form.marketing.hot}
                      onChange={(event) => handleChange("marketing", { ...form.marketing, hot: event.target.checked })}
                    />
                    Hot deal
                  </label>
                </div>
              </div>
              <div className="rounded-2xl border border-white/40 bg-white/70 p-4">
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-slate">Custom badges</div>
                <div className="mt-3 space-y-3">
                  {form.customBadges.map((badge, index) => (
                    <input
                      key={`badge-${index}`}
                      className="w-full rounded-2xl border border-white/40 bg-white/80 px-3 py-2 text-sm"
                      placeholder="Badge text"
                      value={badge}
                      onChange={(event) => {
                        const next = [...form.customBadges]
                        next[index] = event.target.value
                        handleChange("customBadges", next)
                      }}
                    />
                  ))}
                  <button
                    className="rounded-2xl border border-brand-gold px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-navy"
                    onClick={() => handleChange("customBadges", [...form.customBadges, ""])}
                  >
                    + Add Custom Badge
                  </button>
                </div>
              </div>
            </div>
          ) : null}

          {step === 6 ? (
            <div className="space-y-6 rounded-3xl border border-white/40 bg-white/80 p-6">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-slate">{t("admin.wizard.descriptionTitle")}</div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-slate">Description (Arabic)</label>
                <div className="mt-2 flex items-center gap-2 text-sm text-brand-slate">
                  <input
                    type="checkbox"
                    checked={form.descriptionAutoAr}
                    onChange={(event) => handleChange("descriptionAutoAr", event.target.checked)}
                  />
                  {t("admin.wizard.autoGenerate")}
                </div>
                <textarea
                  className="mt-2 w-full rounded-2xl border border-white/40 bg-white/80 px-4 py-3 text-sm"
                  rows="4"
                  value={form.descriptionAr}
                  onChange={(event) => handleChange("descriptionAr", event.target.value)}
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-slate">Description (English)</label>
                <button
                  type="button"
                  className="ml-2 rounded-full border border-brand-gold px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-navy"
                  onClick={() => handleChange("descriptionEn", form.descriptionAr)}
                >
                  {t("admin.wizard.copyArabic")}
                </button>
                <div className="mt-2 flex items-center gap-2 text-sm text-brand-slate">
                  <input
                    type="checkbox"
                    checked={form.descriptionAutoEn}
                    onChange={(event) => handleChange("descriptionAutoEn", event.target.checked)}
                  />
                  {t("admin.wizard.autoGenerate")}
                </div>
                <textarea
                  className="mt-2 w-full rounded-2xl border border-white/40 bg-white/80 px-4 py-3 text-sm"
                  rows="4"
                  value={form.descriptionEn}
                  onChange={(event) => handleChange("descriptionEn", event.target.value)}
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-slate">Description (French)</label>
                <button
                  type="button"
                  className="ml-2 rounded-full border border-brand-gold px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-navy"
                  onClick={() => handleChange("descriptionFr", form.descriptionAr)}
                >
                  {t("admin.wizard.copyArabic")}
                </button>
                <div className="mt-2 flex items-center gap-2 text-sm text-brand-slate">
                  <input
                    type="checkbox"
                    checked={form.descriptionAutoFr}
                    onChange={(event) => handleChange("descriptionAutoFr", event.target.checked)}
                  />
                  {t("admin.wizard.autoGenerate")}
                </div>
                <textarea
                  className="mt-2 w-full rounded-2xl border border-white/40 bg-white/80 px-4 py-3 text-sm"
                  rows="4"
                  value={form.descriptionFr}
                  onChange={(event) => handleChange("descriptionFr", event.target.value)}
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-slate">{t("admin.wizard.metaTitle")}</label>
                  <input
                    className="mt-2 w-full rounded-2xl border border-white/40 bg-white/80 px-4 py-3 text-sm"
                    value={form.metaTitle}
                    onChange={(event) => handleChange("metaTitle", event.target.value)}
                  />
                  <label className="mt-2 flex items-center gap-2 text-xs text-brand-slate">
                    <input
                      type="checkbox"
                      checked={form.metaTitleAuto}
                      onChange={(event) => handleChange("metaTitleAuto", event.target.checked)}
                    />
                    Auto-generate from title
                  </label>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-slate">{t("admin.wizard.slug")}</label>
                  <input
                    className="mt-2 w-full rounded-2xl border border-white/40 bg-white/80 px-4 py-3 text-sm"
                    value={form.slug}
                    onChange={(event) => handleChange("slug", event.target.value)}
                  />
                  <label className="mt-2 flex items-center gap-2 text-xs text-brand-slate">
                    <input
                      type="checkbox"
                      checked={form.slugAuto}
                      onChange={(event) => handleChange("slugAuto", event.target.checked)}
                    />
                    Auto-generate from title
                  </label>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-slate">{t("admin.wizard.metaDescription")}</label>
                <textarea
                  className="mt-2 w-full rounded-2xl border border-white/40 bg-white/80 px-4 py-3 text-sm"
                  rows="3"
                  value={form.metaDescription}
                  onChange={(event) => handleChange("metaDescription", event.target.value)}
                />
                <label className="mt-2 flex items-center gap-2 text-xs text-brand-slate">
                  <input
                    type="checkbox"
                    checked={form.metaDescriptionAuto}
                    onChange={(event) => handleChange("metaDescriptionAuto", event.target.checked)}
                  />
                  Auto-generate from description
                </label>
              </div>
              <div className="rounded-2xl border border-white/40 bg-white/70 p-4">
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-slate">{t("admin.wizard.customFields")}</div>
                <div className="mt-3 space-y-3">
                  {form.customFields.map((field, index) => (
                    <div key={`custom-${index}`} className="grid gap-2 md:grid-cols-[1fr,1fr,auto]">
                      <input
                        className="rounded-2xl border border-white/40 bg-white/80 px-3 py-2 text-sm"
                        placeholder="Label"
                        value={field.label}
                        onChange={(event) => {
                          const next = [...form.customFields]
                          next[index] = { ...field, label: event.target.value }
                          handleChange("customFields", next)
                        }}
                      />
                      <input
                        className="rounded-2xl border border-white/40 bg-white/80 px-3 py-2 text-sm"
                        placeholder="Value"
                        value={field.value}
                        onChange={(event) => {
                          const next = [...form.customFields]
                          next[index] = { ...field, value: event.target.value }
                          handleChange("customFields", next)
                        }}
                      />
                      <label className="flex items-center gap-2 text-xs text-brand-slate">
                        <input
                          type="checkbox"
                          checked={field.display}
                          onChange={(event) => {
                            const next = [...form.customFields]
                            next[index] = { ...field, display: event.target.checked }
                            handleChange("customFields", next)
                          }}
                        />
                        Show on listing
                      </label>
                    </div>
                  ))}
                  <button
                    className="rounded-2xl border border-brand-gold px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-navy"
                    onClick={() => handleChange("customFields", [...form.customFields, { label: "", value: "", display: true }])}
                  >
                    {t("admin.wizard.addCustomField")}
                  </button>
                </div>
              </div>
            </div>
          ) : null}

          <div className="flex items-center justify-between">
            <button
              className="rounded-full border border-brand-navy px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-navy"
              disabled={step === 0}
              onClick={() => setStep((prev) => Math.max(0, prev - 1))}
            >
              {t("admin.wizard.previous")}
            </button>
            <button
              className="rounded-full bg-brand-navy px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white"
              onClick={() => {
                if (step === steps.length - 1) {
                  setStep(0)
                } else {
                  setStep((prev) => Math.min(steps.length - 1, prev + 1))
                }
              }}
            >
              {step === steps.length - 1 ? t("admin.wizard.finish") : t("admin.wizard.next")}
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-3xl border border-white/40 bg-white/80 p-6">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-slate">{t("admin.wizard.previewTitle")}</div>
            <h3 className="mt-3 text-xl font-semibold text-brand-charcoal">{preview.title}</h3>
            <div className="mt-2 text-2xl font-semibold text-brand-navy">{preview.price}</div>
            <div className="mt-2 text-sm text-brand-slate">{preview.location}</div>
            <div className="mt-4 rounded-full bg-brand-charcoal/10 px-3 py-1 text-xs text-brand-charcoal">
              {t("admin.wizard.statusLabel")} {preview.status}
            </div>
          </div>
          <div className="rounded-3xl border border-white/40 bg-white/80 p-6 text-sm text-brand-slate">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-slate">{t("admin.wizard.validationTips")}</div>
            <ul className="mt-3 list-disc pl-4">
              <li>{t("admin.wizard.tipRequired")}</li>
              <li>{t("admin.wizard.tipPrice")}</li>
              <li>{t("admin.wizard.tipAutosave")}</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AdminWizard
