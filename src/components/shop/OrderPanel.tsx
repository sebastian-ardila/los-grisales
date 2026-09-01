import { useEffect, useRef, useState } from 'react'
import { Minus, Plus, ShoppingBag, WhatsappLogo, X } from '@phosphor-icons/react'
import type { Lang } from '../../utils/lang'
import type { ProductCartApi } from '../../hooks/useProductCart'
import { SHOP_WHATSAPP_NUMBER } from '../../data/products'

type T = Record<Lang, string>

const L = {
  eyebrow: { es: 'Café Los Grisales', en: 'Café Los Grisales', fr: 'Café Los Grisales' } as T,
  title: { es: 'Tu pedido', en: 'Your order', fr: 'Votre commande' } as T,
  close: { es: 'Cerrar', en: 'Close', fr: 'Fermer' } as T,
  empty: {
    es: 'Aún no has agregado productos',
    en: 'No products yet',
    fr: 'Aucun produit pour le moment',
  } as T,
  dataHeading: { es: 'Tus datos', en: 'Your details', fr: 'Vos coordonnées' } as T,
  dataHint: {
    es: 'Los enviamos contigo en el mensaje de WhatsApp para agilizar tu pedido.',
    en: 'We send them along in the WhatsApp message to speed up your order.',
    fr: "Nous les envoyons dans le message WhatsApp pour accélérer votre commande.",
  } as T,
  name: { es: 'Nombre completo', en: 'Full name', fr: 'Nom complet' } as T,
  phone: { es: 'Teléfono / WhatsApp', en: 'Phone / WhatsApp', fr: 'Téléphone / WhatsApp' } as T,
  email: { es: 'Correo electrónico', en: 'Email', fr: 'E-mail' } as T,
  city: { es: 'Ciudad', en: 'City', fr: 'Ville' } as T,
  address: { es: 'Dirección de envío', en: 'Shipping address', fr: 'Adresse de livraison' } as T,
  optional: { es: 'opcional', en: 'optional', fr: 'facultatif' } as T,
  required: {
    es: 'Completa nombre, teléfono, ciudad y dirección.',
    en: 'Please fill in name, phone, city and address.',
    fr: 'Renseignez le nom, le téléphone, la ville et l’adresse.',
  } as T,
  send: { es: 'Pedir por WhatsApp', en: 'Order via WhatsApp', fr: 'Commander par WhatsApp' } as T,
  clear: { es: 'Vaciar', en: 'Clear', fr: 'Vider' } as T,
  items: { es: 'productos', en: 'items', fr: 'articles' } as T,
}

const PLACEHOLDER = {
  name: { es: 'María Grisales', en: 'María Grisales', fr: 'María Grisales' } as T,
  phone: { es: '300 123 4567', en: '300 123 4567', fr: '300 123 4567' } as T,
  email: { es: 'tucorreo@ejemplo.com', en: 'you@example.com', fr: 'vous@exemple.com' } as T,
  city: { es: 'Pereira', en: 'Pereira', fr: 'Pereira' } as T,
  address: { es: 'Calle 00 # 00-00, Barrio', en: 'Street 00 # 00-00', fr: 'Rue 00 # 00-00' } as T,
}

interface Buyer {
  name: string
  phone: string
  email: string
  city: string
  address: string
}

const EMPTY_BUYER: Buyer = { name: '', phone: '', email: '', city: '', address: '' }
const BUYER_KEY = 'los-grisales-buyer'

function loadBuyer(): Buyer {
  try {
    const raw = localStorage.getItem(BUYER_KEY)
    if (raw) return { ...EMPTY_BUYER, ...(JSON.parse(raw) as Partial<Buyer>) }
  } catch { /* ignore */ }
  return EMPTY_BUYER
}

interface Props {
  lang: Lang
  cart: ProductCartApi
  onClose: () => void
}

/**
 * Resumen del pedido anclado al borde derecho: ocupa todo el alto del
 * viewport en escritorio y la pantalla completa en móvil. La lista de
 * productos hace scroll y el formulario queda fijo bajo ella.
 */
export default function OrderPanel({ lang, cart, onClose }: Props) {
  const { totalCount, selected, setQty, clear } = cart
  const [buyer, setBuyer] = useState<Buyer>(loadBuyer)
  const [tried, setTried] = useState(false)
  const closeRef = useRef<HTMLButtonElement>(null)

  // Recordamos los datos para que la siguiente compra no vuelva a pedirlos.
  useEffect(() => {
    localStorage.setItem(BUYER_KEY, JSON.stringify(buyer))
  }, [buyer])

  // Esc cierra el panel y el foco entra en él al abrirse.
  useEffect(() => {
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  // Con el panel abierto la página de detrás no debe desplazarse.
  useEffect(() => {
    const previo = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previo }
  }, [])

  const field = (key: keyof Buyer) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setBuyer((prev) => ({ ...prev, [key]: e.target.value }))

  const faltan =
    buyer.name.trim() === '' ||
    buyer.phone.trim() === '' ||
    buyer.city.trim() === '' ||
    buyer.address.trim() === ''
  const puedeEnviar = totalCount > 0 && !faltan

  const sendOrder = () => {
    setTried(true)
    if (!puedeEnviar) return
    const lines = selected.map((p) => `• ${cart.cart[p.key]}× ${p.orderName}`)
    const datos = [
      `Nombre: ${buyer.name.trim()}`,
      `Teléfono: ${buyer.phone.trim()}`,
      buyer.email.trim() ? `Correo: ${buyer.email.trim()}` : null,
      `Ciudad: ${buyer.city.trim()}`,
      `Dirección: ${buyer.address.trim()}`,
    ].filter(Boolean)
    const message = `¡Hola Café Los Grisales! Estoy interesado en pedir:\n\n${lines.join(
      '\n',
    )}\n\nMis datos:\n${datos.join('\n')}\n\n¿Me podrían confirmar disponibilidad y forma de envío? ¡Gracias!`
    const url = `https://wa.me/${SHOP_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
    onClose()
  }

  // Ojo: el tema redefine `--color-white` a negro, así que `bg-white/*` pinta
  // oscuro. Los formularios del sitio usan `bg-black/5` sobre el fondo crema.
  const inputBase =
    'w-full rounded-lg border bg-black/5 px-3 py-2.5 text-[16px] outline-none transition placeholder-black/30 focus:ring-2 focus:ring-brand'
  const inputClass = (valor: string, requerido = true) =>
    `${inputBase} ${tried && requerido && valor.trim() === '' ? 'border-red-400/70' : 'border-black/10'}`

  const labelClass = 'mb-1 block text-[11px] font-semibold uppercase tracking-[0.15em] text-brand/70'

  return (
    <div className="fixed inset-0 z-[60]">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={L.title[lang]}
        style={{ backgroundColor: '#f5efdf' }}
        className="animate-slide-in-right absolute inset-y-0 right-0 flex h-full w-full flex-col shadow-[-20px_0_60px_-20px_rgba(0,0,0,0.45)] sm:max-w-md"
      >
        <header className="flex shrink-0 items-center justify-between gap-3 border-b border-black/10 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand/12 text-brand">
              <ShoppingBag size={18} weight="duotone" />
            </span>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-brand/70">
                {L.eyebrow[lang]}
              </p>
              <h2 className="font-display text-lg font-bold leading-tight">{L.title[lang]}</h2>
            </div>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 transition hover:bg-black/5"
            aria-label={L.close[lang]}
          >
            <X size={20} />
          </button>
        </header>

        {/* Resumen de productos — la única zona con scroll */}
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
          {totalCount === 0 ? (
            <p className="py-8 text-center text-sm opacity-60">{L.empty[lang]}</p>
          ) : (
            <ul className="space-y-3">
              {selected.map((p) => (
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
                    <p className="font-display text-sm font-bold leading-tight">{p.name[lang]}</p>
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
                    <span className="min-w-[1.25rem] text-center font-bold">{cart.cart[p.key]}</span>
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
              ))}
            </ul>
          )}
        </div>

        {/* Datos del comprador + envío. El tope de altura evita que en
            pantallas cortas el formulario aplaste el resumen del pedido:
            se desplaza por dentro cuando no cabe. */}
        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault()
            sendOrder()
          }}
          className="flex max-h-[55%] shrink-0 flex-col border-t border-black/10"
        >
          <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-1 pt-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-brand/70">
            {L.dataHeading[lang]}
          </p>
          <p className="mt-1 text-[11px] leading-snug opacity-60">{L.dataHint[lang]}</p>

          <div className="mt-3 grid grid-cols-2 gap-2.5">
            <div className="col-span-2">
              <label className={labelClass} htmlFor="pedido-nombre">{L.name[lang]}</label>
              <input
                id="pedido-nombre"
                name="name"
                type="text"
                autoComplete="name"
                placeholder={PLACEHOLDER.name[lang]}
                value={buyer.name}
                onChange={field('name')}
                className={inputClass(buyer.name)}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="pedido-telefono">{L.phone[lang]}</label>
              <input
                id="pedido-telefono"
                name="tel"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder={PLACEHOLDER.phone[lang]}
                value={buyer.phone}
                onChange={field('phone')}
                className={inputClass(buyer.phone)}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="pedido-ciudad">{L.city[lang]}</label>
              <input
                id="pedido-ciudad"
                name="city"
                type="text"
                autoComplete="address-level2"
                placeholder={PLACEHOLDER.city[lang]}
                value={buyer.city}
                onChange={field('city')}
                className={inputClass(buyer.city)}
              />
            </div>
            <div className="col-span-2">
              <label className={labelClass} htmlFor="pedido-direccion">{L.address[lang]}</label>
              <input
                id="pedido-direccion"
                name="street-address"
                type="text"
                autoComplete="street-address"
                placeholder={PLACEHOLDER.address[lang]}
                value={buyer.address}
                onChange={field('address')}
                className={inputClass(buyer.address)}
              />
            </div>
            <div className="col-span-2">
              <label className={labelClass} htmlFor="pedido-email">
                {L.email[lang]} <span className="normal-case tracking-normal opacity-60">({L.optional[lang]})</span>
              </label>
              <input
                id="pedido-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder={PLACEHOLDER.email[lang]}
                value={buyer.email}
                onChange={field('email')}
                className={inputClass(buyer.email, false)}
              />
            </div>
          </div>

          {tried && faltan && (
            <p className="mt-2.5 text-xs text-red-700/80">{L.required[lang]}</p>
          )}
          </div>

          {/* El CTA nunca se va con el scroll del formulario */}
          <div className="shrink-0 px-5 pb-4 pt-2">
          <button
            type="submit"
            disabled={totalCount === 0}
            style={totalCount > 0 ? { backgroundColor: '#064947', color: '#ffffff' } : undefined}
            className={`inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold transition ${
              totalCount > 0
                ? 'shadow-[0_8px_24px_-10px_rgba(6,73,71,0.55)] hover:brightness-110'
                : 'cursor-not-allowed bg-black/10 opacity-50'
            }`}
          >
            <WhatsappLogo size={18} weight="fill" />
            {L.send[lang]}
            {totalCount > 0 && (
              <span className="opacity-75">
                · {totalCount} {L.items[lang]}
              </span>
            )}
          </button>

          {totalCount > 0 && (
            <button
              type="button"
              onClick={clear}
              className="mt-2 w-full text-xs font-semibold uppercase tracking-[0.2em] text-brand/60 transition hover:text-brand"
            >
              {L.clear[lang]}
            </button>
          )}
          </div>
        </form>
      </aside>
    </div>
  )
}
