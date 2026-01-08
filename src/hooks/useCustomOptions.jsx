import { useEffect, useState } from "react"
import { api } from "../lib/api"

export const useCustomOptions = (category, defaults = []) => {
  const [options, setOptions] = useState(defaults)

  useEffect(() => {
    let mounted = true
    api.listCustomOptions(category).then((data) => {
      if (mounted) {
        const merged = Array.from(new Set([...(defaults || []), ...(data || [])]))
        setOptions(merged)
      }
    })
    return () => {
      mounted = false
    }
  }, [category, defaults])

  const addOption = async (value) => {
    await api.addCustomOption(category, value)
    setOptions((prev) => Array.from(new Set([...prev, value])))
  }

  return { options, addOption }
}
