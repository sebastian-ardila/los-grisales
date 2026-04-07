import { useTranslation } from 'react-i18next'
import type { CartItem } from '../../data/types'
import { useCart } from '../../context/CartContext'
import { formatPrice } from '../../utils/currency'

interface Props {
  item: CartItem
}

export default function CartItemRow({ item }: Props) {
  const { i18n } = useTranslation()
  const lang = i18n.language === 'en' ? 'en' : 'es'
  const { updateQuantity, removeItem } = useCart()

  const subtotal = (item.product.price || 0) * item.quantity

  return (
    <div className="flex items-center gap-3 py-3 border-b border-white/10">
      <div className="flex-1 min-w-0">
        <p className="text-sm text-white truncate">{item.product.name[lang]}</p>
        <p className="text-xs text-white/60">
          {item.product.price !== null ? formatPrice(item.product.price) : 'Consultar'}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() =>
            item.quantity === 1
              ? removeItem(item.product.id)
              : updateQuantity(item.product.id, item.quantity - 1)
          }
          className="w-7 h-7 rounded-full bg-white/10 text-white flex items-center justify-center text-sm"
        >
          -
        </button>
        <span className="text-sm font-bold min-w-[20px] text-center text-white">
          {item.quantity}
        </span>
        <button
          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
          className="w-7 h-7 rounded-full bg-white/10 text-white flex items-center justify-center text-sm"
        >
          +
        </button>
      </div>

      <span className="font-bold text-brand text-sm min-w-[60px] text-right">
        {formatPrice(subtotal)}
      </span>
    </div>
  )
}
