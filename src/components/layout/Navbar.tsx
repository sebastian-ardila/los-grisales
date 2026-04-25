import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { ShoppingCart, List } from '@phosphor-icons/react'
import { MdTableRestaurant } from 'react-icons/md'
import { useTranslation } from 'react-i18next'
import { routes } from '../../config/routes'
import { useTable } from '../../context/TableContext'
import { useCart } from '../../context/CartContext'
import { useSede } from '../../context/SedeContext'
import LanguageToggle from '../ui/LanguageToggle'
import MobileMenu from './MobileMenu'

export default function Navbar() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language?.startsWith('en') ? 'en' : 'es'
  const { tableNumber, hasTable, setShowTableModal } = useTable()
  const { itemCount, setIsCartOpen } = useCart()
  const { sedeConfig } = useSede()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [logoAnimKey, setLogoAnimKey] = useState(0)

  const menuRoutes = routes.filter((r) => r.showInMenu)

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-primary">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          {/* Left: Logo */}
          <Link to={`/${lang}`} className="relative inline-block shrink-0" onClick={() => setLogoAnimKey(k => k + 1)}>
            <img
              src={`${import.meta.env.BASE_URL}grisales-mini.webp`}
              alt="Los Grisales"
              className="block h-10 w-auto"
            />
            {logoAnimKey > 0 && (
              <img
                key={logoAnimKey}
                src={`${import.meta.env.BASE_URL}grisales-mini.webp`}
                alt=""
                aria-hidden="true"
                className="animate-logo-wipe pointer-events-none absolute inset-0 block h-10 w-auto [filter:brightness(0)_invert(1)]"
              />
            )}
          </Link>

          {/* Center: Desktop nav links */}
          <nav className="hidden items-center gap-1 md:flex">
            {menuRoutes.map((route) => {
              const Icon = route.icon
              const label = lang === 'en' ? route.nameEn : route.nameEs
              const tKey = route.path === '/' ? 'nav.home' : `nav.${route.path.replace('/', '')}`
              return (
                <NavLink
                  key={route.path}
                  to={`/${lang}${route.path}`}
                  end={route.path === '/'}
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 px-3 py-2 text-sm transition ${
                      isActive
                        ? 'border-b-2 border-brand font-bold text-brand'
                        : 'text-white/70 hover:text-white'
                    }`
                  }
                >
                  {Icon && <Icon size={18} />}
                  <span>{t(tKey, label)}</span>
                </NavLink>
              )
            })}
          </nav>

          {/* Right group */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Table badge - only for sedes with ordering */}
            {sedeConfig?.whatsappOrderingEnabled && (
              <button
                onClick={() => setShowTableModal(true)}
                className={`flex items-center gap-1 transition ${
                  hasTable
                    ? 'rounded-full bg-black px-2 py-1 text-brand'
                    : 'text-white/50 hover:text-white/70'
                }`}
              >
                <MdTableRestaurant size={18} />
                <span className="text-[11px] sm:text-xs">
                  {hasTable ? `Mesa ${tableNumber}` : 'Mesa'}
                </span>
              </button>
            )}

            {/* Language toggle - hidden on mobile */}
            <div className="hidden sm:block">
              <LanguageToggle />
            </div>

            {/* Cart badge - only for sedes with ordering */}
            {sedeConfig?.whatsappOrderingEnabled && (
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-1 text-white transition hover:text-brand"
              >
                <ShoppingCart size={24} />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand text-[10px] font-bold text-primary">
                    {itemCount}
                </span>
              )}
              </button>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(true)}
              className="p-1 text-white md:hidden"
            >
              <List size={28} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {mobileOpen && <MobileMenu onClose={() => setMobileOpen(false)} />}
    </>
  )
}
