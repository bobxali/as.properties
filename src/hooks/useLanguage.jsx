import { createContext, useContext, useMemo, useState } from "react"
import { translations } from "../i18n/translations"

const LanguageContext = createContext(null)

const directionMap = {
  en: "ltr",
  fr: "ltr",
  ar: "rtl"
}

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState("en")
  const value = useMemo(() => {
    const dir = directionMap[lang] || "ltr"
    return {
      lang,
      dir,
      setLang,
      t: translations[lang] || translations.en
    }
  }, [lang])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export const useLanguage = () => {
  const ctx = useContext(LanguageContext)
  if (!ctx) {
    throw new Error("useLanguage must be used inside LanguageProvider")
  }
  return ctx
}
