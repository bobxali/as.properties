import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import en from "./en.json"
import ar from "./ar.json"

const storedLang = (() => {
  try {
    return localStorage.getItem("as_lang")
  } catch (error) {
    return null
  }
})()

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ar: { translation: ar }
    },
    lng: storedLang || "en",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    },
    debug: import.meta.env.DEV,
    saveMissing: import.meta.env.DEV,
    missingKeyHandler: (_lng, _ns, key) => {
      if (import.meta.env.DEV) {
        console.warn(`Missing translation key: ${key}`)
      }
    }
  })

export default i18n
