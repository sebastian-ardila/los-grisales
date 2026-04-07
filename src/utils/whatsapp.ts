import type { CartItem } from '../data/types'
import { formatPrice } from './currency'

interface WhatsAppOrderParams {
  items: CartItem[]
  total: number
  customerName: string
  paymentMethod: string
  orderType: 'dine-in' | 'delivery'
  tableNumber?: string
  address?: string
  phone: string
  sedeName: string
}

export function buildOrderWhatsAppUrl(params: WhatsAppOrderParams): string {
  const { items, total, customerName, paymentMethod, orderType, tableNumber, address, phone, sedeName } = params

  const lines: string[] = [
    `🌿 *Pedido Los Grisales - ${sedeName}*`,
    '',
    `👤 ${customerName}`,
    `💳 ${paymentMethod}`,
  ]

  if (orderType === 'dine-in' && tableNumber) {
    lines.push(`📍 En mesa`)
    lines.push(`🪑 Mesa ${tableNumber}`)
  } else if (orderType === 'delivery' && address) {
    lines.push(`📍 Domicilio`)
    lines.push(`🏠 ${address}`)
  }

  lines.push('')

  items.forEach(item => {
    const price = item.product.price !== null
      ? formatPrice(item.product.price * item.quantity)
      : 'Consultar'
    lines.push(`${item.quantity}x ${item.product.name.es} ${price}`)
  })

  lines.push('')
  lines.push(`*Total: ${formatPrice(total)}*`)

  const text = encodeURIComponent(lines.join('\n'))
  return `https://wa.me/${phone}?text=${text}`
}

export function buildReservationWhatsAppUrl(params: {
  name: string
  people: number
  date: string
  time: string
  comments: string
  phone: string
  sedeName: string
}): string {
  const { name, people, date, time, comments, phone, sedeName } = params

  const lines = [
    `🌿 *Reserva Los Grisales - ${sedeName}*`,
    '',
    `👤 ${name}`,
    `👥 ${people} personas`,
    `📅 ${date}`,
    `🕐 ${time}`,
  ]

  if (comments.trim()) {
    lines.push(`💬 ${comments}`)
  }

  const text = encodeURIComponent(lines.join('\n'))
  return `https://wa.me/${phone}?text=${text}`
}

export function buildContactWhatsAppUrl(params: {
  name: string
  email: string
  phone: string
  reason: string
  message: string
  whatsappNumber: string
}): string {
  const lines = [
    `🌿 *Contacto Los Grisales*`,
    '',
    `👤 ${params.name}`,
    `📧 ${params.email}`,
  ]

  if (params.phone.trim()) {
    lines.push(`📞 ${params.phone}`)
  }

  lines.push(`📋 ${params.reason}`)
  lines.push('')
  lines.push(params.message)

  const text = encodeURIComponent(lines.join('\n'))
  return `https://wa.me/${params.whatsappNumber}?text=${text}`
}

export function buildConsultarUrl(itemName: string, phone: string): string {
  const text = encodeURIComponent(`Hola, quisiera consultar el precio de: *${itemName}*`)
  return `https://wa.me/${phone}?text=${text}`
}
