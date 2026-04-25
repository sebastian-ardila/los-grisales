import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Coffee, Plus, Minus, Eye } from '@phosphor-icons/react'
import type { MenuItem } from '../../data/types'
import { useCart } from '../../context/CartContext'
import { useSede } from '../../context/SedeContext'
import { formatPrice } from '../../utils/currency'
import { buildConsultarUrl } from '../../utils/whatsapp'
import { getDishImage } from '../../data/dishImages'
import ProductModal from './ProductModal'

interface Props {
  item: MenuItem
}

export default function ProductCard({ item }: Props) {
  const { t, i18n } = useTranslation()
  const lang = i18n.language === 'en' ? 'en' : 'es'
  const { items, addItem, removeItem, updateQuantity } = useCart()
  const { sedeConfig } = useSede()
  const [showModal, setShowModal] = useState(false)

  const canOrder = sedeConfig?.whatsappOrderingEnabled !== false
  const cartItem = items.find((ci) => ci.product.id === item.id)
  const quantity = cartItem?.quantity || 0
  const isConsultar = item.price === null

  const ingredientText = item.ingredients.join(', ')
  const dishImage = getDishImage(item.id)

  const handleConsultar = () => {
    if (sedeConfig?.whatsappNumber) {
      const url = buildConsultarUrl(item.name[lang], sedeConfig.whatsappNumber)
      window.open(url, '_blank')
    }
  }

  return (
    <>
      <article className="group/card flex flex-col overflow-hidden rounded-xl border border-white/10 bg-white/[0.04] backdrop-blur-sm transition hover:border-brand/30 hover:bg-white/[0.07]">
        {/* Image / fallback */}
        <div className="relative aspect-[4/3] overflow-hidden bg-primary-light">
          {dishImage ? (
            <img
              src={`${import.meta.env.BASE_URL}${dishImage}`}
              alt={item.name[lang]}
              loading="lazy"
              className="h-full w-full object-cover transition duration-500 group-hover/card:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Coffee size={32} className="text-white/20" />
            </div>
          )}
          {/* Subtle bottom fade for image-text transition */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent" />
          {item.isVegetarian && (
            <span className="absolute right-2 top-2 rounded-full bg-primary/85 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.15em] text-brand backdrop-blur-sm">
              🌿 Veg
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col gap-1.5 p-3">
          <h3 className="line-clamp-1 text-sm font-bold leading-tight text-white">
            {item.name[lang]}
          </h3>
          <p className="line-clamp-2 text-[11px] leading-snug text-white/60">{ingredientText}</p>
          {item.volumeLabel && (
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/40">
              {item.volumeLabel}
            </p>
          )}
          <div className="flex-1" />
          <p className={`text-sm font-bold ${isConsultar ? 'text-brand' : 'text-brand'}`}>
            {formatPrice(item.price)}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-1.5 border-t border-white/8 p-3 pt-2 md:flex-row">
          {canOrder && (
            isConsultar ? (
              <button
                onClick={handleConsultar}
                className="w-full rounded-lg bg-brand py-1.5 text-xs font-bold text-primary transition hover:bg-brand-light md:flex-1"
              >
                {t('menu.consultar')}
              </button>
            ) : quantity > 0 ? (
              <div className="flex w-full items-center justify-center gap-3 rounded-lg bg-brand/15 px-2 py-1.5 text-xs ring-1 ring-brand/30 md:flex-1">
                <button
                  onClick={() =>
                    quantity === 1 ? removeItem(item.id) : updateQuantity(item.id, quantity - 1)
                  }
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-brand/25 text-brand transition hover:bg-brand/40"
                  aria-label="-"
                >
                  <Minus size={12} weight="bold" />
                </button>
                <span className="min-w-[16px] text-center font-bold text-brand">{quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, quantity + 1)}
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-brand/25 text-brand transition hover:bg-brand/40"
                  aria-label="+"
                >
                  <Plus size={12} weight="bold" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => addItem(item)}
                className="inline-flex w-full items-center justify-center gap-1 rounded-lg bg-brand py-1.5 text-xs font-bold text-primary transition hover:bg-brand-light md:flex-1"
              >
                <Plus size={12} weight="bold" />
                {t('menu.add')}
              </button>
            )
          )}
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex w-full items-center justify-center gap-1 rounded-lg border border-white/15 py-1.5 text-xs font-semibold text-white/80 transition hover:border-brand/40 hover:bg-white/5 hover:text-white md:flex-1"
          >
            <Eye size={12} weight="bold" />
            {t('menu.viewDish')}
          </button>
        </div>
      </article>

      {showModal && <ProductModal item={item} onClose={() => setShowModal(false)} />}
    </>
  )
}
