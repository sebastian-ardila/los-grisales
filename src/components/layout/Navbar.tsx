import { useState } from 'react'
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom'
import { List, ShareNetwork } from '@phosphor-icons/react'
import { useTranslation } from 'react-i18next'
import { routes } from '../../config/routes'
import LanguageSwitcher from '../ui/LanguageSwitcher'
import SocialModal from '../ui/SocialModal'
import { useLang } from '../../utils/lang'
import MobileMenu from './MobileMenu'

export default function Navbar() {
  const { t } = useTranslation()
  const lang = useLang()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [socialOpen, setSocialOpen] = useState(false)
  const followLabel = { es: 'Síguenos en redes', en: 'Follow us on social', fr: 'Suivez-nous sur les réseaux' }[lang]
  const navbarLogo = `${import.meta.env.BASE_URL}logos/logo-verde.webp`

  const menuRoutes = routes.filter((r) => r.showInMenu)

  const goToAnchor = (anchor: string) => {
    const onHome = location.pathname === `/${lang}` || location.pathname === `/${lang}/`
    if (onHome) {
      document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth' })
    } else {
      navigate(`/${lang}`)
      setTimeout(() => {
        document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth' })
      }, 80)
    }
  }

  const labelFor = (r: (typeof menuRoutes)[number]) =>
    lang === 'en' ? r.nameEn : lang === 'fr' ? r.nameFr : r.nameEs

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-primary">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          {/* Left: Logo */}
          <Link
            to={`/${lang}`}
            className="inline-block shrink-0"
            onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })}
          >
            <img
              src={navbarLogo}
              alt="Los Grisales"
              className="block h-14 w-auto"
            />
          </Link>

          {/* Center: Desktop nav links */}
          <nav className="hidden items-center gap-0.5 md:flex">
            {menuRoutes.map((route, idx) => {
              const Icon = route.icon
              const label = labelFor(route)
              const key = `${route.path}-${route.anchor ?? 'none'}-${idx}`

              if (route.anchor) {
                return (
                  <button
                    key={key}
                    onClick={() => goToAnchor(route.anchor!)}
                    className="flex items-center gap-1.5 whitespace-nowrap px-2.5 py-2 text-[13px] text-white/70 transition hover:text-white"
                  >
                    {Icon && <Icon size={16} />}
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
                    if (isHomeBtn) {
                      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
                    }
                  }}
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 whitespace-nowrap px-2.5 py-2 text-[13px] transition ${
                      isActive
                        ? 'border-b-2 border-brand font-bold text-brand'
                        : 'text-white/70 hover:text-white'
                    }`
                  }
                >
                  {Icon && <Icon size={16} />}
                  <span>{t(tKey, label)}</span>
                </NavLink>
              )
            })}
          </nav>

          {/* Right group */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Social trigger — matches the LanguageSwitcher's transparent-
                bg + thin-green-border treatment so the pair reads as a
                consistent unit. */}
            <button
              type="button"
              onClick={() => setSocialOpen(true)}
              aria-label={followLabel}
              title={followLabel}
              style={{ borderColor: 'rgba(196, 226, 213, 0.5)' }}
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border bg-transparent text-white/85 transition hover:bg-white/10 hover:text-white"
            >
              <ShareNetwork size={16} weight="duotone" />
            </button>

            <LanguageSwitcher variant="dark" />

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(true)}
              className="ml-0.5 p-1 text-white md:hidden"
            >
              <List size={26} />
            </button>
          </div>
        </div>
      </header>

      <SocialModal open={socialOpen} onClose={() => setSocialOpen(false)} />

      {/* Mobile menu */}
      {mobileOpen && <MobileMenu onClose={() => setMobileOpen(false)} />}
    </>
  )
}
