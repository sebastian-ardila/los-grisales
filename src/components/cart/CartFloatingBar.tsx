import { useTranslation } from 'react-i18next'
import { useCart } from '../../context/CartContext'
import { useSede } from '../../context/SedeContext'
import { formatPrice } from '../../utils/currency'

export default function CartFloatingBar() {
  const { t } = useTranslation()
  const { items, total, itemCount, isCartOpen, setIsCartOpen } = useCart()
  const { sedeConfig } = useSede()

  if (items.length === 0 || isCartOpen || !sedeConfig?.whatsappOrderingEnabled) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 p-4">
      <div
        onClick={() => setIsCartOpen(true)}
        className="bg-black rounded-2xl mx-auto max-w-md flex items-center justify-between px-4 py-3 cursor-pointer animate-slide-up"
      >
        <div className="flex items-center gap-3">
          <span className="bg-brand text-primary rounded-full w-7 h-7 text-sm font-bold flex items-center justify-center">
            {itemCount}
          </span>
          <span className="text-white text-sm font-medium">
            {t('cart.viewOrder')}
          </span>
        </div>
        <span className="text-brand font-bold">
          {formatPrice(total)}
        </span>
      </div>
    </div>
  )
}
