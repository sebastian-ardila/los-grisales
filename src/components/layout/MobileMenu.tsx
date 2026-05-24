import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { X } from '@phosphor-icons/react'
import { useTranslation } from 'react-i18next'
import { routes } from '../../config/routes'
import LanguageSwitcher from '../ui/LanguageSwitcher'
import { useLang } from '../../utils/lang'

interface MobileMenuProps {
  onClose: () => void
}

export default function MobileMenu({ onClose }: MobileMenuProps) {
  const { t } = useTranslation()
  const lang = useLang()
  const navigate = useNavigate()
  const location = useLocation()
  const logoSrc = `${import.meta.env.BASE_URL}logos/logo-verde.webp`

  const menuRoutes = routes.filter((r) => r.showInMenu)

  const goToAnchor = (anchor: string) => {
    onClose()
    const onHome = location.pathname === `/${lang}` || location.pathname === `/${lang}/`
    if (onHome) {
      setTimeout(() => {
        document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth' })
      }, 30)
    } else {
      navigate(`/${lang}`)
      setTimeout(() => {
        document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    }
  }

  const labelFor = (r: (typeof menuRoutes)[number]) =>
    lang === 'en' ? r.nameEn : lang === 'fr' ? r.nameFr : r.nameEs

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-primary animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4">
        <img src={logoSrc} alt="Los Grisales" className="h-16 w-auto" />
        <button onClick={onClose} className="p-2 text-white">
          <X size={28} weight="bold" />
        </button>
      </div>

      {/* Nav links */}
      <nav className="flex flex-1 flex-col pt-2">
        {menuRoutes.map((route, idx) => {
          const Icon = route.icon
          const label = labelFor(route)
          const key = `${route.path}-${route.anchor ?? 'none'}-${idx}`

          if (route.anchor) {
            return (
              <button
                key={key}
                onClick={() => goToAnchor(route.anchor!)}
                className="flex items-center gap-4 border-b border-white/10 px-6 py-4 text-xl text-white/80 transition hover:bg-white/5 hover:text-white"
              >
                {Icon && <Icon size={26} />}
                <span>{t(`nav.${route.anchor}`, label)}</span>
              </button>
            )
          }

          const tKey = route.path === '/' ? 'nav.home' : `nav.${route.path.replace('/', '')}`
          const isHomeBtn = route.path === '/'
          return (
            <NavLink
              key={key}
              to={`/${lang}${route.path === '/' ? '' : route.path}`}
              end={route.path === '/'}
              onClick={() => {
                onClose()
                if (isHomeBtn) {
                  setTimeout(() => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' }), 30)
                }
              }}
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

      {/* Language switcher at bottom */}
      <div className="px-6 py-6">
        <LanguageSwitcher variant="dark" />
      </div>
    </div>
  )
}
