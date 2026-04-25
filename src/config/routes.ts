import { Coffee, CalendarDots, BookOpen, Envelope, House } from '@phosphor-icons/react'

export const routes = [
  { path: '/', nameEs: 'Inicio', nameEn: 'Home', icon: House, showInMenu: true },
  { path: '/carta', nameEs: 'Carta', nameEn: 'Menu', icon: Coffee, showInMenu: true },
  { path: '/reservas', nameEs: 'Visítanos', nameEn: 'Visit Us', icon: CalendarDots, showInMenu: true },
  { path: '/historia', nameEs: 'Historia', nameEn: 'History', icon: BookOpen, showInMenu: true },
  { path: '/contacto', nameEs: 'Contacto', nameEn: 'Contact', icon: Envelope, showInMenu: true },
] as const
