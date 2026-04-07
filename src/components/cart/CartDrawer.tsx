import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { X } from '@phosphor-icons/react'
import { useCart } from '../../context/CartContext'
import { useTable } from '../../context/TableContext'
import { useSede } from '../../context/SedeContext'
import { formatPrice } from '../../utils/currency'
import { buildOrderWhatsAppUrl } from '../../utils/whatsapp'
import CartItemRow from './CartItemRow'

export default function CartDrawer() {
  const { t } = useTranslation()
  const { items, total, isCartOpen, setIsCartOpen, clearCart } = useCart()
  const { tableNumber: globalTable, hasTable, setTableNumber: setGlobalTable } = useTable()
  const { sedeConfig } = useSede()

  const [step, setStep] = useState<1 | 2>(1)
  const [customerName, setCustomerName] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('')
  const [orderType, setOrderType] = useState<'dine-in' | 'delivery' | ''>('')
  const [address, setAddress] = useState('')
  const [tableNumber, setTableNumber] = useState('')
  const [tried, setTried] = useState(false)

  if (!isCartOpen) return null

  const handleClose = () => {
    setIsCartOpen(false)
    setStep(1)
    setTried(false)
  }

  const handleDeleteOrder = () => {
    clearCart()
    handleClose()
  }

  const effectiveTable = hasTable ? globalTable : tableNumber

  const isValid =
    customerName.trim() !== '' &&
    paymentMethod !== '' &&
    orderType !== '' &&
    (orderType === 'delivery' ? address.trim() !== '' : true) &&
    (orderType === 'dine-in' ? effectiveTable !== '' : true)

  const handleSubmit = () => {
    setTried(true)
    if (!isValid) return
    if (!sedeConfig) return

    const url = buildOrderWhatsAppUrl({
      items,
      total,
      customerName: customerName.trim(),
      paymentMethod,
      orderType: orderType as 'dine-in' | 'delivery',
      tableNumber: orderType === 'dine-in' ? effectiveTable : undefined,
      address: orderType === 'delivery' ? address.trim() : undefined,
      phone: sedeConfig.whatsappNumber,
      sedeName: sedeConfig.name,
    })

    window.open(url, '_blank')
  }

  const paymentOptions = [
    { key: 'transfer', label: t('cart.transfer') },
    { key: 'card', label: t('cart.card') },
    { key: 'cash', label: t('cart.cash') },
  ]

  const orderTypeOptions = [
    { key: 'dine-in' as const, label: t('cart.dineIn') },
    { key: 'delivery' as const, label: t('cart.delivery') },
  ]

  const tableNumbers = Array.from({ length: 10 }, (_, i) => String(i + 1))

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-[60] bg-black/40"
        onClick={handleClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-primary animate-slide-in-right z-[61] flex flex-col">
        {step === 1 ? (
          <>
            {/* Step 1: Cart items */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h2 className="text-lg font-bold text-white">{t('cart.title')}</h2>
              <button onClick={handleClose} className="text-white/70 hover:text-white">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4">
              {items.length === 0 ? (
                <p className="text-white/60 text-center py-8">{t('cart.empty')}</p>
              ) : (
                items.map((item) => (
                  <CartItemRow key={item.product.id} item={item} />
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="p-4 border-t border-white/10">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-white font-bold">{t('cart.total')}</span>
                  <span className="text-brand font-bold text-lg">{formatPrice(total)}</span>
                </div>
                <button
                  onClick={() => setStep(2)}
                  className="w-full bg-brand text-primary font-bold rounded-xl py-3 transition-colors hover:bg-brand/90"
                >
                  {t('cart.continue')}
                </button>
                <button
                  onClick={handleDeleteOrder}
                  className="w-full text-white/60 text-sm mt-3 py-2"
                >
                  {t('cart.deleteOrder')}
                </button>
              </div>
            )}
          </>
        ) : (
          <>
            {/* Step 2: Order details */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h2 className="text-lg font-bold text-white">{t('cart.step2Title')}</h2>
              <button onClick={handleClose} className="text-white/70 hover:text-white">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
              {/* Name */}
              <div>
                <label className="text-white text-sm font-medium mb-1 block">
                  {t('cart.name')}
                </label>
                <input
                  type="text"
                  autoComplete="name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder={t('cart.namePlaceholder')}
                  className={`w-full bg-white/10 text-white rounded-xl px-4 py-3 text-[16px] placeholder:text-white/40 outline-none focus:ring-2 focus:ring-brand ${
                    tried && !customerName.trim() ? 'ring-2 ring-white/60' : ''
                  }`}
                />
                {tried && !customerName.trim() && (
                  <p className="text-white/60 text-xs mt-1">{t('cart.completeFields')}</p>
                )}
              </div>

              {/* Payment method */}
              <div>
                <label className="text-white text-sm font-medium mb-2 block">
                  {t('cart.paymentMethod')}
                </label>
                <div className="flex gap-2">
                  {paymentOptions.map((opt) => (
                    <button
                      key={opt.key}
                      onClick={() => setPaymentMethod(opt.label)}
                      className={`flex-1 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                        paymentMethod === opt.label
                          ? 'bg-brand text-primary'
                          : 'bg-white/10 text-white/70 hover:bg-white/20'
                      } ${tried && !paymentMethod ? 'ring-2 ring-white/60' : ''}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
                {tried && !paymentMethod && (
                  <p className="text-white/60 text-xs mt-1">{t('cart.completeFields')}</p>
                )}
              </div>

              {/* Order type */}
              <div>
                <label className="text-white text-sm font-medium mb-2 block">
                  {t('cart.orderType')}
                </label>
                <div className="flex gap-2">
                  {orderTypeOptions.map((opt) => (
                    <button
                      key={opt.key}
                      onClick={() => setOrderType(opt.key)}
                      className={`flex-1 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                        orderType === opt.key
                          ? 'bg-brand text-primary'
                          : 'bg-white/10 text-white/70 hover:bg-white/20'
                      } ${tried && !orderType ? 'ring-2 ring-white/60' : ''}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
                {tried && !orderType && (
                  <p className="text-white/60 text-xs mt-1">{t('cart.completeFields')}</p>
                )}
              </div>

              {/* Dine-in: table selection */}
              {orderType === 'dine-in' && (
                <div>
                  <label className="text-white text-sm font-medium mb-2 block">
                    {t('cart.table')}
                  </label>
                  {hasTable ? (
                    <div className="flex items-center gap-3">
                      <span className="bg-brand text-primary px-4 py-2 rounded-xl font-bold text-sm">
                        {t('table.mesa')} {globalTable}
                      </span>
                      <button
                        onClick={() => {
                          setGlobalTable('')
                          setTableNumber('')
                        }}
                        className="text-brand text-sm underline"
                      >
                        {t('cart.change')}
                      </button>
                    </div>
                  ) : (
                    <>
                      <p className="text-white/60 text-xs mb-2">{t('cart.selectTable')}</p>
                      <div className="grid grid-cols-5 gap-2">
                        {tableNumbers.map((num) => (
                          <button
                            key={num}
                            onClick={() => setTableNumber(num)}
                            className={`py-2 rounded-xl text-sm font-bold transition-colors ${
                              tableNumber === num
                                ? 'bg-brand text-primary'
                                : 'bg-white/10 text-white/70 hover:bg-white/20'
                            } ${tried && !effectiveTable ? 'ring-2 ring-white/60' : ''}`}
                          >
                            {num}
                          </button>
                        ))}
                      </div>
                      {tried && !effectiveTable && (
                        <p className="text-white/60 text-xs mt-1">{t('cart.completeFields')}</p>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* Delivery: address */}
              {orderType === 'delivery' && (
                <div>
                  <label className="text-white text-sm font-medium mb-1 block">
                    {t('cart.address')}
                  </label>
                  <input
                    type="text"
                    autoComplete="street-address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder={t('cart.addressPlaceholder')}
                    className={`w-full bg-white/10 text-white rounded-xl px-4 py-3 text-[16px] placeholder:text-white/40 outline-none focus:ring-2 focus:ring-brand ${
                      tried && !address.trim() ? 'ring-2 ring-white/60' : ''
                    }`}
                  />
                  {tried && !address.trim() && (
                    <p className="text-white/60 text-xs mt-1">{t('cart.completeFields')}</p>
                  )}
                </div>
              )}

              {/* Order summary */}
              <div className="bg-white/5 rounded-xl p-3 space-y-2">
                {items.map((item) => (
                  <div key={item.product.id} className="flex justify-between text-sm">
                    <span className="text-white/80">
                      {item.quantity}x {item.product.name.es}
                    </span>
                    <span className="text-white/60">
                      {formatPrice((item.product.price || 0) * item.quantity)}
                    </span>
                  </div>
                ))}
                <div className="flex justify-between text-sm font-bold pt-2 border-t border-white/10">
                  <span className="text-white">{t('cart.total')}</span>
                  <span className="text-brand">{formatPrice(total)}</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-white/10 space-y-3">
              {sedeConfig?.whatsappOrderingEnabled === false ? (
                <p className="text-white/40 text-center text-sm py-3">
                  {t('cart.whatsappDisabled')}
                </p>
              ) : (
                <button
                  onClick={handleSubmit}
                  className={`w-full rounded-xl py-3 font-bold transition-colors ${
                    isValid
                      ? 'bg-brand text-primary hover:bg-brand/90'
                      : 'bg-brand/30 text-white/40 cursor-not-allowed'
                  }`}
                >
                  {t('cart.sendWhatsApp')}
                </button>
              )}
              <button
                onClick={() => {
                  setStep(1)
                  setTried(false)
                }}
                className="w-full text-white/60 text-sm py-2 hover:text-white"
              >
                {t('cart.back')}
              </button>
            </div>
          </>
        )}
      </div>
    </>
  )
}
