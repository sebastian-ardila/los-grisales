import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Coffee } from '@phosphor-icons/react'
import type { MenuItem } from '../../data/types'
import { useCart } from '../../context/CartContext'
import { useSede } from '../../context/SedeContext'
import { formatPrice } from '../../utils/currency'
import { buildConsultarUrl } from '../../utils/whatsapp'
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

  const ingredientText = item.ingredients
    .map((ing) => ing)
    .join(', ')

  const handleConsultar = () => {
    if (sedeConfig?.whatsappNumber) {
      const url = buildConsultarUrl(item.name[lang], sedeConfig.whatsappNumber)
      window.open(url, '_blank')
    }
  }

  return (
    <>
      <div className="bg-card-bg rounded-xl overflow-hidden h-[280px] flex flex-col text-black">
        {/* Placeholder image area */}
        <div className="h-24 bg-[#d4c4b4] flex items-center justify-center">
          <Coffee size={32} className="text-black/30" />
        </div>

        {/* Content */}
        <div className="flex-1 p-3 flex flex-col">
          <p className="font-bold text-sm line-clamp-1">{item.name[lang]}</p>
          <p className="text-xs text-black/60 line-clamp-2">{ingredientText}</p>
          {item.volumeLabel && (
            <p className="text-xs text-black/50 mt-1">{item.volumeLabel}</p>
          )}
          <div className="flex-1" />
          <p className={`font-bold text-sm ${isConsultar ? 'text-brand' : 'text-primary'}`}>
            {formatPrice(item.price)}
          </p>
        </div>

        {/* Bottom buttons */}
        <div className="flex gap-2 p-3 pt-0">
          <button
            onClick={() => setShowModal(true)}
            className={`text-xs py-1.5 rounded-lg border border-primary/20 text-primary hover:bg-primary/10 text-center ${canOrder ? 'flex-1' : 'flex-1'}`}
          >
            {t('menu.viewDish')}
          </button>

          {canOrder && (
            isConsultar ? (
              <button
                onClick={handleConsultar}
                className="flex-1 text-xs py-1.5 rounded-lg bg-brand text-primary text-center font-bold"
              >
                {t('menu.consultar')}
              </button>
            ) : quantity > 0 ? (
              <div className="flex-1 flex items-center justify-center gap-2 text-xs py-1.5 rounded-lg bg-primary text-white">
                <button
                  onClick={() =>
                    quantity === 1
                      ? removeItem(item.id)
                      : updateQuantity(item.id, quantity - 1)
                  }
                  className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center"
                >
                  -
                </button>
                <span className="font-bold min-w-[16px] text-center">{quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, quantity + 1)}
                  className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center"
                >
                  +
                </button>
              </div>
            ) : (
              <button
                onClick={() => addItem(item)}
                className="flex-1 text-xs py-1.5 rounded-lg bg-primary text-white text-center"
              >
                {t('menu.add')}
              </button>
            )
          )}
        </div>
      </div>

      {showModal && (
        <ProductModal item={item} onClose={() => setShowModal(false)} />
      )}
    </>
  )
}
