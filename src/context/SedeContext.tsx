import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { SedeConfig, SedeId } from '../data/types'
import { sedes } from '../config/sedes'

interface SedeContextValue {
  sedeId: SedeId | null
  sedeConfig: SedeConfig | null
  setSede: (id: SedeId) => void
  showSelector: boolean
  setShowSelector: (show: boolean) => void
}

const SedeContext = createContext<SedeContextValue | null>(null)

export function SedeProvider({ children }: { children: ReactNode }) {
  const [sedeId, setSedeId] = useState<SedeId | null>(() => {
    const saved = localStorage.getItem('los-grisales-sede')
    if (saved === 'pereira-plaza' || saved === 'unicentro' || saved === 'coffee-tour') return saved
    return null
  })
  const [showSelector, setShowSelector] = useState(false)

  useEffect(() => {
    if (!sedeId) {
      setShowSelector(true)
    }
  }, [sedeId])

  const setSede = (id: SedeId) => {
    setSedeId(id)
    localStorage.setItem('los-grisales-sede', id)
    setShowSelector(false)
    // Clear cart when switching to a sede without ordering
    if (!sedes[id]?.whatsappOrderingEnabled) {
      localStorage.removeItem('los-grisales-cart')
    }
  }

  const sedeConfig = sedeId ? sedes[sedeId] : null

  return (
    <SedeContext.Provider value={{ sedeId, sedeConfig, setSede, showSelector, setShowSelector }}>
      {children}
    </SedeContext.Provider>
  )
}

export function useSede() {
  const ctx = useContext(SedeContext)
  if (!ctx) throw new Error('useSede must be used within SedeProvider')
  return ctx
}
