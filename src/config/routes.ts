import { Mountains, Storefront, BookOpen, House, CoffeeBean, Package, Notebook } from '@phosphor-icons/react'

export const routes = [
  { path: '/', nameEs: 'Inicio', nameEn: 'Home', nameFr: 'Accueil', icon: House, showInMenu: true, anchor: null },
  { path: '/', nameEs: 'Coffee Tour', nameEn: 'Coffee Tour', nameFr: 'Coffee Tour', icon: Mountains, showInMenu: true, anchor: 'tour' },
  { path: '/', nameEs: 'Tiendas de Café', nameEn: 'Coffee Shops', nameFr: 'Boutiques de Café', icon: Storefront, showInMenu: true, anchor: 'cafe-bar' },
  { path: '/', nameEs: 'Nuestro Café', nameEn: 'Our Coffee', nameFr: 'Notre Café', icon: CoffeeBean, showInMenu: true, anchor: 'especialidad' },
  { path: '/historia', nameEs: 'Historia', nameEn: 'History', nameFr: 'Histoire', icon: BookOpen, showInMenu: true, anchor: null },
  { path: '/blog', nameEs: 'Blog', nameEn: 'Blog', nameFr: 'Blog', icon: Notebook, showInMenu: true, anchor: null },
  // Products page still exists, but is reached from the "Nuestro Café" section CTA, not the navbar.
  { path: '/productos', nameEs: 'Productos', nameEn: 'Products', nameFr: 'Produits', icon: Package, showInMenu: false, anchor: null },
] as const
