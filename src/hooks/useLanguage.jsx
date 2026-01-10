import { createContext, useContext, useEffect, useMemo } from "react"
import { useTranslation } from "react-i18next"

const LanguageContext = createContext(null)

const directionMap = {
  en: "ltr",
  fr: "ltr",
  ar: "rtl"
}

export const LanguageProvider = ({ children }) => {
  const { i18n } = useTranslation()
  const lang = i18n.language || "en"
  const fixedT = i18n.getFixedT("en")
  const value = useMemo(() => {
    const dir = directionMap[lang] || "ltr"
    return {
      lang,
      dir,
      setLang: (next) => i18n.changeLanguage(next),
      t: fixedT
    }
  }, [lang, i18n, fixedT])

  useEffect(() => {
    try {
      localStorage.setItem("as_lang", lang)
    } catch (error) {
      // ignore storage errors
    }
    document.documentElement.lang = lang
    document.documentElement.dir = directionMap[lang] || "ltr"
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
