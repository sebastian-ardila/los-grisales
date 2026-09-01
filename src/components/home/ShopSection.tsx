import { useState } from 'react'
import { CoffeeBean, Minus, Plus, WhatsappLogo } from '@phosphor-icons/react'
import { useLang, type Lang } from '../../utils/lang'
import { allProducts } from '../../data/products'
import { useProductCart } from '../../hooks/useProductCart'
import SectionHeader from '../ui/SectionHeader'
import OrderPanel from '../shop/OrderPanel'

const BASE = import.meta.env.BASE_URL
const backdrop = `${BASE}coffeetour/coffeetour3.webp`

type T = Record<Lang, string>

const L = {
  title: { es: 'Nuestros Productos', en: 'Our Products', fr: 'Nos Produits' } as T,
  tagline: {
    es: 'Café cultivado, cosechado y procesado por nuestra familia en la Finca Vista Hermosa.',
    en: 'Coffee grown, harvested and processed by our family at Finca Vista Hermosa.',
    fr: 'Café cultivé, récolté et traité par notre famille à la Finca Vista Hermosa.',
  } as T,
  add: { es: 'Agregar', en: 'Add', fr: 'Ajouter' } as T,
  viewOrder: { es: 'Ver pedido', en: 'View order', fr: 'Voir la commande' } as T,
  items: { es: 'productos', en: 'items', fr: 'articles' } as T,
}

/**
 * Tienda de café dentro de la home, justo debajo de "Nuestro Café". La píldora
 * del pedido es `sticky` dentro de la sección: se mantiene al pie mientras la
 * tienda está en pantalla y se va con ella, sin taparle el resto de la página.
 */
export default function ShopSection() {
  const lang = useLang()
  const cart = useProductCart()
  const { cart: cantidades, totalCount, setQty } = cart
  const [orderOpen, setOrderOpen] = useState(false)

  return (
    <section id="tienda" className="scroll-mt-20 px-4 pb-16 md:pb-24">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          index="04"
          title={L.title[lang]}
          tagline={L.tagline[lang]}
          backdrop={backdrop}
        />

        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {allProducts.map((p) => {
            const qty = cantidades[p.key] ?? 0
            return (
              <article
                key={p.key}
                style={{ backgroundColor: 'rgba(255,255,255,0.7)' }}
                className="flex flex-col overflow-hidden rounded-xl border border-black/10 shadow-[0_6px_20px_-12px_rgba(0,0,0,0.12)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-18px_rgba(6,73,71,0.35)]"
              >
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
                  <span
                    style={{ backgroundColor: p.accent, color: '#ffffff' }}
                    className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em] shadow-[0_4px_12px_-4px_rgba(0,0,0,0.25)]"
                  >
                    <CoffeeBean size={10} weight="fill" />
                    {p.process[lang]}
                  </span>
                  <span
                    style={{ backgroundColor: 'rgba(255,255,255,0.95)', color: '#064947' }}
                    className="absolute right-2 top-2 inline-flex items-center rounded-full border border-black/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em] shadow-[0_4px_12px_-4px_rgba(0,0,0,0.18)]"
                  >
                    {p.unit[lang]}
                  </span>
                </div>

                <div className="flex flex-1 flex-col gap-2.5 p-3 sm:p-4">
                  <h3 className="font-display text-sm font-bold leading-tight sm:text-base">
                    {p.name[lang]}
                  </h3>

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
                      <span>{L.add[lang]}</span>
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

        {/* Pedido: pegado al pie mientras la tienda está en pantalla */}
        {totalCount > 0 && !orderOpen && (
          <div className="pointer-events-none sticky bottom-5 z-40 mt-6">
            <button
              type="button"
              onClick={() => setOrderOpen(true)}
              style={{ backgroundColor: '#064947', color: '#ffffff' }}
              className="animate-slide-up pointer-events-auto mx-auto flex w-full max-w-sm items-center justify-between gap-3 rounded-2xl px-5 py-3.5 shadow-[0_20px_40px_-12px_rgba(6,73,71,0.55)] transition hover:brightness-110"
            >
              <span className="flex items-center gap-2.5">
                <span
                  style={{ backgroundColor: '#C4A962', color: '#064947' }}
                  className="flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold"
                >
                  {totalCount}
                </span>
                <span className="text-sm font-bold">{L.viewOrder[lang]}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold opacity-90">
                <WhatsappLogo size={16} weight="fill" />
                {totalCount} {L.items[lang]}
              </span>
            </button>
          </div>
        )}
      </div>

      {orderOpen && <OrderPanel lang={lang} cart={cart} onClose={() => setOrderOpen(false)} />}
    </section>
  )
}
