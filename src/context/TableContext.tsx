import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import { getHashParams, updateHashParams } from '../utils/hashParams'

interface TableContextValue {
  tableNumber: string
  setTableNumber: (num: string) => void
  hasTable: boolean
  clearTable: () => void
  showTableModal: boolean
  setShowTableModal: (show: boolean) => void
}

const TableContext = createContext<TableContextValue | null>(null)

function readTableFromHash(): string {
  const params = getHashParams()
  const mesa = params.get('mesa')
  if (mesa && /^[1-9]$|^10$/.test(mesa)) return mesa
  return ''
}

export function TableProvider({ children }: { children: ReactNode }) {
  const [tableNumber, setTableNumberState] = useState<string>(readTableFromHash)
  const [showTableModal, setShowTableModal] = useState(false)

  const setTableNumber = useCallback((num: string) => {
    setTableNumberState(num)
    updateHashParams('mesa', num || null)
  }, [])

  const clearTable = useCallback(() => {
    setTableNumberState('')
    updateHashParams('mesa', null)
  }, [])

  useEffect(() => {
    const handleUrlChange = () => {
      const mesa = readTableFromHash()
      setTableNumberState(prev => (mesa !== prev ? mesa : prev))
    }

    window.addEventListener('hashchange', handleUrlChange)
    window.addEventListener('popstate', handleUrlChange)

    const interval = setInterval(handleUrlChange, 1000)

    return () => {
      window.removeEventListener('hashchange', handleUrlChange)
      window.removeEventListener('popstate', handleUrlChange)
      clearInterval(interval)
    }
  }, [])

  return (
    <TableContext.Provider value={{
      tableNumber,
      setTableNumber,
      hasTable: tableNumber !== '',
      clearTable,
      showTableModal,
      setShowTableModal,
    }}>
      {children}
    </TableContext.Provider>
  )
}

export function useTable() {
  const ctx = useContext(TableContext)
  if (!ctx) throw new Error('useTable must be used within TableProvider')
  return ctx
}
