import { useCallback, useEffect, useMemo, useState } from 'react'
import { allProducts, type Product } from '../data/products'

export type ProductCart = Record<string, number>

const STORAGE_KEY = 'los-grisales-products-cart'

function loadCart(validKeys: Set<string>): ProductCart {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as ProductCart
    // Drop any stale entries whose product key no longer exists (e.g. after
    // a rename of product keys in the catalogue).
    const clean: ProductCart = {}
    for (const [key, qty] of Object.entries(parsed)) {
      if (validKeys.has(key) && typeof qty === 'number' && qty > 0) {
        clean[key] = qty
      }
    }
    return clean
  } catch { /* ignore */ }
  return {}
}

export interface ProductCartApi {
  cart: ProductCart
  /** Total de unidades, calculado sobre el catálogo vivo. */
  totalCount: number
  /** Productos con cantidad > 0, en el orden del catálogo. */
  selected: Product[]
  setQty: (key: string, delta: number) => void
  clear: () => void
}

/** Carrito de café con persistencia en localStorage. */
export function useProductCart(): ProductCartApi {
  const validKeys = useMemo(() => new Set(allProducts.map((p) => p.key)), [])
  const [cart, setCart] = useState<ProductCart>(() => loadCart(validKeys))

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart))
  }, [cart])

  // El contador sale del catálogo vivo — nunca de entradas arbitrarias de
  // localStorage — para que renombrar o quitar un producto no lo infle.
  const totalCount = useMemo(
    () => allProducts.reduce<number>((sum, p) => sum + (cart[p.key] ?? 0), 0),
    [cart],
  )

  const selected = useMemo(
    () => allProducts.filter((p) => (cart[p.key] ?? 0) > 0),
    [cart],
  )

  const setQty = useCallback((key: string, delta: number) => {
    setCart((prev) => {
      const next = { ...prev }
      const updated = Math.max(0, (next[key] ?? 0) + delta)
      if (updated === 0) delete next[key]
      else next[key] = updated
      return next
    })
  }, [])

  const clear = useCallback(() => setCart({}), [])

  return { cart, totalCount, selected, setQty, clear }
}
