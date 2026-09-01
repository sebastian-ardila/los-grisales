import { createContext, useContext, useState, type ReactNode } from 'react'
import type { SedeConfig, SedeId } from '../data/types'
import { sedes } from '../config/sedes'

interface SedeContextValue {
  sedeId: SedeId
  sedeConfig: SedeConfig
  setSede: (id: SedeId) => void
  showSelector: boolean
  setShowSelector: (show: boolean) => void
}

const SedeContext = createContext<SedeContextValue | null>(null)

const DEFAULT_SEDE: SedeId = 'unicentro'

export function SedeProvider({ children }: { children: ReactNode }) {
  const [sedeId, setSedeId] = useState<SedeId>(() => {
    const saved = localStorage.getItem('los-grisales-sede')
    // Una sede oculta guardada de antes (p. ej. Pereira Plaza) vuelve al valor
    // por defecto en lugar de resucitar una sede que ya no se muestra.
    if ((saved === 'unicentro' || saved === 'coffee-tour') && !sedes[saved]?.hidden) return saved
    return DEFAULT_SEDE
  })
  const [showSelector, setShowSelector] = useState(false)

  const setSede = (id: SedeId) => {
    setSedeId(id)
    localStorage.setItem('los-grisales-sede', id)
    setShowSelector(false)
    if (!sedes[id]?.whatsappOrderingEnabled) {
      localStorage.removeItem('los-grisales-cart')
    }
  }

  const sedeConfig = sedes[sedeId]

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
