import { NavLink } from 'react-router-dom'
import { X } from '@phosphor-icons/react'
import { useTranslation } from 'react-i18next'
import { routes } from '../../config/routes'
import LanguageToggle from '../ui/LanguageToggle'

interface MobileMenuProps {
  onClose: () => void
}

export default function MobileMenu({ onClose }: MobileMenuProps) {
  const { t, i18n } = useTranslation()
  const lang = i18n.language?.startsWith('en') ? 'en' : 'es'

  const menuRoutes = routes.filter((r) => r.showInMenu)

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-primary animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4">
        <img
          src={`${import.meta.env.BASE_URL}los-grisales-logo-mini.webp`}
          alt="Los Grisales"
          className="h-10"
        />
        <button onClick={onClose} className="p-2 text-white">
          <X size={28} weight="bold" />
        </button>
      </div>

      {/* Nav links */}
      <nav className="flex flex-1 flex-col pt-2">
        {menuRoutes.map((route) => {
          const Icon = route.icon
          const label = lang === 'en' ? route.nameEn : route.nameEs
          const tKey = route.path === '/' ? 'nav.home' : `nav.${route.path.replace('/', '')}`
          return (
            <NavLink
              key={route.path}
              to={`/${lang}${route.path}`}
              end={route.path === '/'}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-4 border-b border-white/10 px-6 py-4 text-xl transition ${
                  isActive
                    ? 'border-l-4 border-l-brand bg-brand/5 font-bold text-brand'
                    : 'text-white/80 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              {Icon && <Icon size={26} />}
              <span>{t(tKey, label)}</span>
            </NavLink>
          )
        })}
      </nav>

      {/* Language toggle at bottom */}
      <div className="px-6 py-6">
        <LanguageToggle />
      </div>
    </div>
  )
}
