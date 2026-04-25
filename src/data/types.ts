export type SedeId = 'pereira-plaza' | 'unicentro' | 'coffee-tour'

export type BookingAppIcon = 'airbnb' | 'getyourguide' | 'tripadvisor' | 'viator'

export interface BookingApp {
  name: string
  url: string
  brandColor?: string
  iconKey?: BookingAppIcon
}

export interface MenuItem {
  id: string
  name: { es: string; en: string }
  price: number | null
  ingredients: string[]
  volumeLabel?: string
  description?: { es: string; en: string }
  steps?: string[]
  isVegetarian: boolean
  categoryId: string
  image?: string
}

export interface MenuCategory {
  id: string
  name: { es: string; en: string }
  emoji: string
  icon: string
  sortOrder: number
  items: MenuItem[]
}

export interface CartItem {
  product: MenuItem
  quantity: number
}

export interface SedeConfig {
  id: SedeId
  name: string
  nameShort: string
  address: string
  whatsappNumber: string
  whatsappOrderingEnabled: boolean
  googleMapsUrl: string
  googleReviewsUrl: string
  schedule: DaySchedule[]
  tableCount: number
  isCoffeeTour?: boolean
  bookingApps?: BookingApp[]
  heroImage?: string
}

export interface DaySchedule {
  days: { es: string; en: string }
  open: string
  close: string
}
