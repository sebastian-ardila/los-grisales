import { useTranslation } from 'react-i18next'
import { X, Coffee } from '@phosphor-icons/react'
import type { MenuItem } from '../../data/types'
import { useCart } from '../../context/CartContext'
import { formatPrice } from '../../utils/currency'

interface Props {
  item: MenuItem | null
  onClose: () => void
}

export default function ProductModal({ item, onClose }: Props) {
  const { t, i18n } = useTranslation()
  const lang = i18n.language === 'en' ? 'en' : 'es'
  const { addItem } = useCart()

  if (!item) return null

  const isConsultar = item.price === null

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div
      className="fixed inset-0 z-[60] bg-black/60 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-card-bg rounded-2xl max-w-md w-full max-h-[80vh] overflow-y-auto text-black animate-fade-in">
        {/* Header */}
        <div className="p-4 flex justify-between items-start">
          <h2 className="text-xl font-bold">{item.name[lang]}</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-black/10 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Placeholder image */}
        <div className="h-48 bg-[#d4c4b4] flex items-center justify-center">
          <Coffee size={48} className="text-black/30" />
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          <p className="text-2xl font-bold text-primary">
            {isConsultar ? (lang === 'en' ? 'Ask for price' : 'Consultar precio') : formatPrice(item.price)}
          </p>

          {item.volumeLabel && (
            <p className="text-sm text-black/60">{item.volumeLabel}</p>
          )}

          {item.description && (
            <p className="text-sm text-black/70">{item.description[lang]}</p>
          )}

          {item.ingredients.length > 0 && (
            <div>
              <h3 className="font-bold text-sm mb-1">{t('menu.ingredients')}</h3>
              <ul className="space-y-1">
                {item.ingredients.map((ing, idx) => (
                  <li key={idx} className="text-sm text-black/70">{ing}</li>
                ))}
              </ul>
            </div>
          )}

          {item.steps && item.steps.length > 0 && (
            <div>
              <h3 className="font-bold text-sm mb-1">{t('menu.steps')}</h3>
              <ol className="space-y-1 list-decimal list-inside">
                {item.steps.map((step, idx) => (
                  <li key={idx} className="text-sm text-black/70">{step}</li>
                ))}
              </ol>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-black/10">
          <button
            onClick={() => {
              addItem(item)
              onClose()
            }}
            className="w-full bg-primary text-white rounded-xl py-3 font-bold transition-colors hover:bg-primary/90"
          >
            {t('menu.add')}
          </button>
        </div>
      </div>
    </div>
  )
}
