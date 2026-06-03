import { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import {
  WhatsappLogo,
  Package,
  CoffeeBean,
  Plus,
  Minus,
  X,
  ShoppingBag,
} from '@phosphor-icons/react'
import { useLang, type Lang } from '../utils/lang'
import { sedes } from '../config/sedes'
import SEO from '../components/seo/SEO'

const BASE = import.meta.env.BASE_URL
const beansImg = `${BASE}products/cafe.webp`
const dripsImg = `${BASE}products/drips.webp`
const backdrop = `${BASE}coffeetour/coffeetour3.webp`

type T = Record<Lang, string>

interface Product {
  key: string
  name: T
  /** Small unit/format badge (e.g. "340 g", "x 8"). */
  unit: T
  process: T
  notes: T[]
  accent: string
  image: string
  /** Spanish-only label used in the WhatsApp order message. */
  orderName: string
}

const beans: Product[] = [
  {
    key: 'cafe-natural-340',
    name: {
      es: 'Café Natural Los Grisales',
      en: 'Natural Coffee Los Grisales',
      fr: 'Café Naturel Los Grisales',
    },
    unit: { es: '340 g', en: '340 g', fr: '340 g' },
    process: { es: 'Natural', en: 'Natural', fr: 'Naturel' },
    accent: '#a04949',
    image: beansImg,
    orderName: 'Café Natural Los Grisales 340 g',
    notes: [
      { es: 'Mora', en: 'Blackberry', fr: 'Mûre' },
      { es: 'Caramelo', en: 'Caramel', fr: 'Caramel' },
      { es: 'Chocolate', en: 'Chocolate', fr: 'Chocolat' },
      { es: 'Panela', en: 'Panela', fr: 'Panela' },
    ],
  },
  {
    key: 'cafe-honey-340',
    name: {
      es: 'Café Honey Los Grisales',
      en: 'Honey Coffee Los Grisales',
      fr: 'Café Honey Los Grisales',
    },
    unit: { es: '340 g', en: '340 g', fr: '340 g' },
    process: { es: 'Honey', en: 'Honey', fr: 'Honey' },
    accent: '#b88539',
    image: beansImg,
    orderName: 'Café Honey Los Grisales 340 g',
    notes: [
      { es: 'Panela', en: 'Panela', fr: 'Panela' },
      { es: 'Cocoa', en: 'Cocoa', fr: 'Cacao' },
      { es: 'Almendra', en: 'Almond', fr: 'Amande' },
      { es: 'Mora', en: 'Blackberry', fr: 'Mûre' },
    ],
  },
  {
    key: 'cafe-lavado-500',
    name: {
      es: 'Café Lavado Los Grisales',
      en: 'Washed Coffee Los Grisales',
      fr: 'Café Lavé Los Grisales',
    },
    unit: { es: '500 g', en: '500 g', fr: '500 g' },
    process: { es: 'Lavado', en: 'Washed', fr: 'Lavé' },
    accent: '#3a7e7a',
    image: beansImg,
    orderName: 'Café Lavado Los Grisales 500 g',
    notes: [
      { es: 'Avellana', en: 'Hazelnut', fr: 'Noisette' },
      { es: 'Chocolate', en: 'Chocolate', fr: 'Chocolat' },
      { es: 'Panela', en: 'Panela', fr: 'Panela' },
      { es: 'Almendra', en: 'Almond', fr: 'Amande' },
    ],
  },
  {
    key: 'cafe-lavado-250',
    name: {
      es: 'Café Lavado Los Grisales',
      en: 'Washed Coffee Los Grisales',
      fr: 'Café Lavé Los Grisales',
    },
    unit: { es: '250 g', en: '250 g', fr: '250 g' },
    process: { es: 'Lavado', en: 'Washed', fr: 'Lavé' },
    accent: '#3a7e7a',
    image: beansImg,
    orderName: 'Café Lavado Los Grisales 250 g',
    notes: [
      { es: 'Avellana', en: 'Hazelnut', fr: 'Noisette' },
      { es: 'Chocolate', en: 'Chocolate', fr: 'Chocolat' },
      { es: 'Panela', en: 'Panela', fr: 'Panela' },
      { es: 'Almendra', en: 'Almond', fr: 'Amande' },
    ],
  },
]

const drips: Product[] = [
  {
    key: 'drip-natural',
    name: {
      es: 'Drips Café Natural Los Grisales',
      en: 'Natural Coffee Drips Los Grisales',
      fr: 'Drips Café Naturel Los Grisales',
    },
    unit: { es: 'Caja x 8', en: 'Box x 8', fr: 'Boîte x 8' },
    process: { es: 'Natural', en: 'Natural', fr: 'Naturel' },
    accent: '#a04949',
    image: dripsImg,
    orderName: 'Drips Café Natural Los Grisales (caja x 8)',
    notes: [
      { es: 'Mora', en: 'Blackberry', fr: 'Mûre' },
      { es: 'Caramelo', en: 'Caramel', fr: 'Caramel' },
      { es: 'Chocolate', en: 'Chocolate', fr: 'Chocolat' },
    ],
  },
  {
    key: 'drip-honey',
    name: {
      es: 'Drips Café Honey Los Grisales',
      en: 'Honey Coffee Drips Los Grisales',
      fr: 'Drips Café Honey Los Grisales',
    },
    unit: { es: 'Caja x 8', en: 'Box x 8', fr: 'Boîte x 8' },
    process: { es: 'Honey', en: 'Honey', fr: 'Honey' },
    accent: '#b88539',
    image: dripsImg,
    orderName: 'Drips Café Honey Los Grisales (caja x 8)',
    notes: [
      { es: 'Panela', en: 'Panela', fr: 'Panela' },
      { es: 'Cocoa', en: 'Cocoa', fr: 'Cacao' },
      { es: 'Almendra', en: 'Almond', fr: 'Amande' },
    ],
  },
  {
    key: 'drip-lavado',
    name: {
      es: 'Drips Café Lavado Los Grisales',
      en: 'Washed Coffee Drips Los Grisales',
      fr: 'Drips Café Lavé Los Grisales',
    },
    unit: { es: 'Caja x 8', en: 'Box x 8', fr: 'Boîte x 8' },
    process: { es: 'Lavado', en: 'Washed', fr: 'Lavé' },
    accent: '#3a7e7a',
    image: dripsImg,
    orderName: 'Drips Café Lavado Los Grisales (caja x 8)',
    notes: [
      { es: 'Avellana', en: 'Hazelnut', fr: 'Noisette' },
      { es: 'Chocolate', en: 'Chocolate', fr: 'Chocolat' },
      { es: 'Panela', en: 'Panela', fr: 'Panela' },
    ],
  },
]

const allProducts: Product[] = [...beans, ...drips]

type ProductCart = Record<string, number>
const STORAGE_KEY = 'los-grisales-products-cart'

function loadCart(validKeys: Set<string>): ProductCart {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as ProductCart
    // Drop any stale entries whose product key no longer exists (e.g. after
    // a rename of product keys in this file).
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

export default function ProductsPage() {
  const { t } = useTranslation()
  const lang = useLang()
  const whatsappNumber = sedes['pereira-plaza'].whatsappNumber

  const validKeys = useMemo(() => new Set(allProducts.map((p) => p.key)), [])
  const [cart, setCart] = useState<ProductCart>(() => loadCart(validKeys))
  const [orderOpen, setOrderOpen] = useState(false)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart))
  }, [cart])

  // Compute the badge count from the live product list — never from arbitrary
  // localStorage entries — so renames or removals can't inflate the count.
  const totalCount = useMemo(
    () => allProducts.reduce<number>((sum, p) => sum + (cart[p.key] ?? 0), 0),
    [cart],
  )

  const setQty = (key: string, delta: number) => {
    setCart((prev) => {
      const next = { ...prev }
      const current = next[key] ?? 0
      const updated = Math.max(0, current + delta)
      if (updated === 0) delete next[key]
      else next[key] = updated
      return next
    })
  }

  const sendOrder = () => {
    const lines = allProducts
      .filter((p) => (cart[p.key] ?? 0) > 0)
      .map((p) => `• ${cart[p.key]}× ${p.orderName}`)
    if (lines.length === 0) return
    const message = `¡Hola Café Los Grisales! Estoy interesado en pedir:\n\n${lines.join(
      '\n',
    )}\n\n¿Me podrían confirmar disponibilidad y forma de envío? ¡Gracias!`
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
    setOrderOpen(false)
  }

  const cartLabel: T = { es: 'Ver pedido', en: 'View order', fr: 'Voir la commande' }
  const orderTitle: T = { es: 'Tu pedido', en: 'Your order', fr: 'Votre commande' }
  const sendLabel: T = { es: 'Pedir por WhatsApp', en: 'Order via WhatsApp', fr: 'Commander par WhatsApp' }
  const clearLabel: T = { es: 'Vaciar', en: 'Clear', fr: 'Vider' }
  const itemsLabel: T = { es: 'productos', en: 'items', fr: 'articles' }
  const emptyLabel: T = { es: 'Aún no has agregado productos', en: 'No products yet', fr: 'Aucun produit pour le moment' }
  const addLabel: T = { es: 'Agregar', en: 'Add', fr: 'Ajouter' }

  return (
    <>
      <SEO
        title={{
          es: 'Productos — Café de especialidad Los Grisales',
          en: 'Products — Los Grisales Specialty Coffee',
          fr: 'Produits — Café de spécialité Los Grisales',
        }}
        description={{
          es: 'Café en grano (Honey, Natural, Lavado) y drips listos para preparar. Cultivado por la familia Grisales en la Finca Vista Hermosa, Risaralda.',
          en: 'Whole-bean coffee (Honey, Natural, Washed) and ready-to-brew drip bags. Grown by the Grisales family at Finca Vista Hermosa, Risaralda.',
          fr: 'Café en grains (Honey, Naturel, Lavé) et drips prêts à infuser. Cultivé par la famille Grisales à la Finca Vista Hermosa, Risaralda.',
        }}
      />
      <section className="px-4 py-10 md:py-16">
      <div className="mx-auto max-w-6xl">
        {/* Compact landing-style header */}
        <header className="relative mb-8 overflow-hidden rounded-3xl border border-brand/15 px-5 py-10 md:mb-12 md:px-8 md:py-14">
          <div
            className="pointer-events-none absolute inset-0 bg-cover bg-top opacity-[0.16]"
            style={{ backgroundImage: `url(${backdrop})` }}
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse at center, rgba(245,239,223,0.55) 0%, rgba(245,239,223,0.88) 70%, rgba(245,239,223,1) 100%)',
            }}
            aria-hidden="true"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -right-4 -top-2 select-none text-brand/[0.10] md:-right-2 md:-top-4"
          >
            <Package size={180} weight="duotone" />
          </span>

          <div className="relative flex flex-col items-center text-center">
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-10 bg-brand" />
              <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.4em] text-brand">
                <Package size={14} weight="duotone" />
                {t('products.title')}
              </span>
              <span className="h-px w-10 bg-brand" />
            </div>
            <h1 className="font-display text-3xl font-bold leading-[1.05] tracking-tight text-brand md:text-5xl lg:text-6xl">
              {t('products.title')}
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-sm italic opacity-75 md:mt-4 md:text-base">
              {t('products.subtitle')}
            </p>
          </div>
        </header>

        {/* Product grid */}
        <div className="grid grid-cols-2 gap-3 pb-32 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {allProducts.map((p) => {
            const qty = cart[p.key] ?? 0
            return (
              <article
                key={p.key}
                style={{ backgroundColor: 'rgba(255,255,255,0.7)' }}
                className="flex flex-col overflow-hidden rounded-xl border border-black/10 shadow-[0_6px_20px_-12px_rgba(0,0,0,0.12)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-18px_rgba(6,73,71,0.35)]"
              >
                {/* Image */}
                <div
                  className="relative aspect-square overflow-hidden"
                  style={{ backgroundColor: `${p.accent}10` }}
                >
                  <img
                    src={p.image}
                    alt={p.name[lang]}
                    loading="lazy"
                    className="h-full w-full object-contain p-3 sm:p-5"
                  />
                  {/* Process badge */}
                  <span
                    style={{ backgroundColor: p.accent, color: '#ffffff' }}
                    className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em] shadow-[0_4px_12px_-4px_rgba(0,0,0,0.25)]"
                  >
                    <CoffeeBean size={10} weight="fill" />
                    {p.process[lang]}
                  </span>
                  {/* Unit/format badge */}
                  <span
                    style={{ backgroundColor: 'rgba(255,255,255,0.95)', color: '#064947' }}
                    className="absolute right-2 top-2 inline-flex items-center rounded-full border border-black/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em] shadow-[0_4px_12px_-4px_rgba(0,0,0,0.18)]"
                  >
                    {p.unit[lang]}
                  </span>
                </div>

                {/* Body */}
                <div className="flex flex-1 flex-col gap-2.5 p-3 sm:p-4">
                  <h2 className="font-display text-sm font-bold leading-tight sm:text-base">
                    {p.name[lang]}
                  </h2>

                  <div className="flex flex-wrap gap-1">
                    {p.notes.slice(0, 3).map((note) => (
                      <span
                        key={note.es}
                        className="inline-flex items-center rounded-full border border-brand/25 bg-brand/8 px-1.5 py-0.5 text-[9px] font-semibold text-brand sm:px-2 sm:text-[10px]"
                      >
                        {note[lang]}
                      </span>
                    ))}
                  </div>

                  <div className="flex-1" />

                  {qty === 0 ? (
                    <button
                      type="button"
                      onClick={() => setQty(p.key, 1)}
                      style={{ color: '#ffffff' }}
                      className="mt-1 inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-brand px-3 py-2 text-xs font-bold transition hover:brightness-110 sm:text-sm"
                    >
                      <Plus size={14} weight="bold" />
                      <span>{addLabel[lang]}</span>
                    </button>
                  ) : (
                    <div
                      style={{ backgroundColor: '#064947', color: '#ffffff' }}
                      className="mt-1 flex items-center justify-between gap-2 rounded-lg px-1.5 py-1"
                    >
                      <button
                        type="button"
                        onClick={() => setQty(p.key, -1)}
                        aria-label="-1"
                        className="flex h-7 w-7 items-center justify-center rounded-md transition hover:bg-white/15"
                      >
                        <Minus size={14} weight="bold" />
                      </button>
                      <span className="font-display text-base font-bold leading-none">{qty}</span>
                      <button
                        type="button"
                        onClick={() => setQty(p.key, +1)}
                        aria-label="+1"
                        className="flex h-7 w-7 items-center justify-center rounded-md transition hover:bg-white/15"
                      >
                        <Plus size={14} weight="bold" />
                      </button>
                    </div>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      </div>

      {/* Floating cart pill */}
      {totalCount > 0 && !orderOpen && (
        <div className="pointer-events-none fixed bottom-0 left-0 right-0 z-40 px-4 pb-5">
          <button
            type="button"
            onClick={() => setOrderOpen(true)}
            style={{ backgroundColor: '#064947', color: '#ffffff' }}
            className="pointer-events-auto mx-auto flex w-full max-w-sm animate-slide-up items-center justify-between gap-3 rounded-2xl px-5 py-3.5 shadow-[0_20px_40px_-12px_rgba(6,73,71,0.55)] transition hover:brightness-110"
          >
            <span className="flex items-center gap-2.5">
              <span
                style={{ backgroundColor: '#C4A962', color: '#064947' }}
                className="flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold"
              >
                {totalCount}
              </span>
              <span className="text-sm font-bold">{cartLabel[lang]}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold opacity-90">
              <WhatsappLogo size={16} weight="fill" />
              {totalCount} {itemsLabel[lang]}
            </span>
          </button>
        </div>
      )}

      {/* Order drawer */}
      {orderOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 sm:items-center sm:p-4"
          onClick={() => setOrderOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ backgroundColor: '#f5efdf' }}
            className="w-full max-w-md animate-slide-up overflow-hidden rounded-t-2xl sm:rounded-2xl"
          >
            <header className="flex items-center justify-between gap-3 border-b border-black/10 px-5 py-4">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand/12 text-brand">
                  <ShoppingBag size={18} weight="duotone" />
                </span>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-brand/70">
                    Café Los Grisales
                  </p>
                  <h2 className="font-display text-lg font-bold leading-tight">
                    {orderTitle[lang]}
                  </h2>
                </div>
              </div>
              <button
                onClick={() => setOrderOpen(false)}
                className="rounded-full p-1.5 hover:bg-black/5"
                aria-label="close"
              >
                <X size={20} />
              </button>
            </header>

            <div className="max-h-[55vh] overflow-y-auto px-5 py-4">
              {totalCount === 0 ? (
                <p className="py-6 text-center text-sm opacity-60">{emptyLabel[lang]}</p>
              ) : (
                <ul className="space-y-3">
                  {allProducts
                    .filter((p) => (cart[p.key] ?? 0) > 0)
                    .map((p) => {
                      const qty = cart[p.key] ?? 0
                      return (
                        <li
                          key={p.key}
                          style={{ backgroundColor: 'rgba(255,255,255,0.7)' }}
                          className="flex items-center gap-3 rounded-xl border border-black/10 p-2.5"
                        >
                          <span
                            style={{ backgroundColor: `${p.accent}1a` }}
                            className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg"
                          >
                            <img
                              src={p.image}
                              alt={p.name[lang]}
                              className="h-full w-full object-contain p-1.5"
                            />
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="font-display text-sm font-bold leading-tight">
                              {p.name[lang]}
                            </p>
                            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-brand/70">
                              {p.process[lang]} · {p.unit[lang]}
                            </p>
                          </div>
                          <div
                            style={{ backgroundColor: '#064947', color: '#ffffff' }}
                            className="flex shrink-0 items-center gap-1 rounded-lg px-1 py-0.5"
                          >
                            <button
                              type="button"
                              onClick={() => setQty(p.key, -1)}
                              aria-label="-1"
                              className="flex h-7 w-7 items-center justify-center rounded-md transition hover:bg-white/15"
                            >
                              <Minus size={12} weight="bold" />
                            </button>
                            <span className="min-w-[1.25rem] text-center font-bold">{qty}</span>
                            <button
                              type="button"
                              onClick={() => setQty(p.key, +1)}
                              aria-label="+1"
                              className="flex h-7 w-7 items-center justify-center rounded-md transition hover:bg-white/15"
                            >
                              <Plus size={12} weight="bold" />
                            </button>
                          </div>
                        </li>
                      )
                    })}
                </ul>
              )}
            </div>

            <footer className="flex flex-col gap-2 border-t border-black/10 px-5 py-4">
              <button
                type="button"
                onClick={sendOrder}
                disabled={totalCount === 0}
                style={
                  totalCount > 0 ? { backgroundColor: '#064947', color: '#ffffff' } : undefined
                }
                className={`inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold transition ${
                  totalCount > 0
                    ? 'hover:brightness-110 shadow-[0_8px_24px_-10px_rgba(6,73,71,0.55)]'
                    : 'cursor-not-allowed bg-black/10 opacity-50'
                }`}
              >
                <WhatsappLogo size={18} weight="fill" />
                {sendLabel[lang]}
              </button>
              {totalCount > 0 && (
                <button
                  type="button"
                  onClick={() => setCart({})}
                  className="text-xs font-semibold uppercase tracking-[0.2em] text-brand/60 transition hover:text-brand"
                >
                  {clearLabel[lang]}
                </button>
              )}
            </footer>
          </div>
        </div>
      )}
    </section>
    </>
  )
}
