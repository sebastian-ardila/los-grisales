import { Mountains, Storefront, BookOpen, House } from '@phosphor-icons/react'

export const routes = [
  { path: '/', nameEs: 'Inicio', nameEn: 'Home', icon: House, showInMenu: true, anchor: null },
  { path: '/', nameEs: 'Coffee Tour', nameEn: 'Coffee Tour', icon: Mountains, showInMenu: true, anchor: 'tour' },
  { path: '/', nameEs: 'Café Bar', nameEn: 'Café Bar', icon: Storefront, showInMenu: true, anchor: 'cafe-bar' },
  { path: '/historia', nameEs: 'Historia', nameEn: 'History', icon: BookOpen, showInMenu: true, anchor: null },
] as const
