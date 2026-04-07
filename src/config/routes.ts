import { Coffee, CalendarDots, Clock, BookOpen, Envelope } from '@phosphor-icons/react'

export const routes = [
  { path: '/', nameEs: 'Inicio', nameEn: 'Home', icon: null, showInMenu: false },
  { path: '/carta', nameEs: 'Carta', nameEn: 'Menu', icon: Coffee, showInMenu: true },
  { path: '/reservas', nameEs: 'Reservas', nameEn: 'Reservations', icon: CalendarDots, showInMenu: true },
  { path: '/horarios', nameEs: 'Horarios', nameEn: 'Schedule', icon: Clock, showInMenu: true },
  { path: '/historia', nameEs: 'Historia', nameEn: 'History', icon: BookOpen, showInMenu: true },
  { path: '/contacto', nameEs: 'Contacto', nameEn: 'Contact', icon: Envelope, showInMenu: true },
] as const
