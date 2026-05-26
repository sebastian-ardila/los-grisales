import { useEffect, useRef, useState } from 'react'
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom'
import { CaretDown, List, ShareNetwork } from '@phosphor-icons/react'
import { useTranslation } from 'react-i18next'
import { routes } from '../../config/routes'
import LanguageSwitcher from '../ui/LanguageSwitcher'
import SocialModal from '../ui/SocialModal'
import { useLang, type Lang } from '../../utils/lang'
import MobileMenu from './MobileMenu'

type MenuRoute = (typeof routes)[number]
type LangMap = Record<Lang, string>

interface NavGroup {
  label: LangMap
  /** Children identified by path + anchor. Anchor null = page route. */
  children: { path: string; anchor: string | null }[]
}

/**
 * Desktop navbar structure: `Inicio` standalone, then two grouped dropdowns
 * to keep the navbar uncluttered. Mobile menu remains flat (see MobileMenu).
 */
const navGroups: NavGroup[] = [
  {
    label: { es: 'Visítanos', en: 'Visit us', fr: 'Nous visiter' },
    children: [
      { path: '/', anchor: 'tour' },
      { path: '/', anchor: 'cafe-bar' },
    ],
  },
  {
    label: { es: 'Nosotros', en: 'About us', fr: 'À propos' },
    children: [
      { path: '/', anchor: 'especialidad' },
      { path: '/historia', anchor: null },
    ],
  },
]

const isGrouped = (r: MenuRoute) =>
  navGroups.some((g) =>
    g.children.some((c) => c.path === r.path && (c.anchor ?? null) === (r.anchor ?? null)),
  )

export default function Navbar() {
  const lang = useLang()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [socialOpen, setSocialOpen] = useState(false)
  const followLabel = { es: 'Síguenos en redes', en: 'Follow us on social', fr: 'Suivez-nous sur les réseaux' }[lang]
  const navbarLogo = `${import.meta.env.BASE_URL}logos/logo-verde.webp`

  const menuRoutes = routes.filter((r) => r.showInMenu)
  const standaloneRoutes = menuRoutes.filter((r) => !isGrouped(r))

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

  const groupItems = (group: NavGroup): MenuRoute[] =>
    group.children
      .map((c) =>
        menuRoutes.find(
          (r) => r.path === c.path && (r.anchor ?? null) === (c.anchor ?? null),
        ),
      )
      .filter(Boolean) as MenuRoute[]

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
            {standaloneRoutes.map((route, idx) => (
              <StandaloneItem
                key={`${route.path}-${route.anchor ?? 'none'}-${idx}`}
                route={route}
                lang={lang}
                goToAnchor={goToAnchor}
              />
            ))}
            {navGroups.map((group, idx) => (
              <NavDropdown
                key={idx}
                label={group.label[lang]}
                items={groupItems(group)}
                lang={lang}
                goToAnchor={goToAnchor}
              />
            ))}
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
              style={{ borderColor: '#b3c2bb' }}
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

function labelOf(route: MenuRoute, lang: Lang): string {
  return lang === 'en' ? route.nameEn : lang === 'fr' ? route.nameFr : route.nameEs
}

interface ItemProps {
  route: MenuRoute
  lang: Lang
  goToAnchor: (anchor: string) => void
  onAfterClick?: () => void
}

function StandaloneItem({ route, lang, goToAnchor }: ItemProps) {
  const { t } = useTranslation()
  const Icon = route.icon
  const label = labelOf(route, lang)

  if (route.anchor) {
    return (
      <button
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
}

interface DropdownProps {
  label: string
  items: MenuRoute[]
  lang: Lang
  goToAnchor: (anchor: string) => void
}

const OPEN_DELAY_MS = 120
const CLOSE_DELAY_MS = 200

function NavDropdown({ label, items, lang, goToAnchor }: DropdownProps) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const openTimerRef = useRef<number | null>(null)
  const closeTimerRef = useRef<number | null>(null)
  const location = useLocation()

  // Highlight the group when any of its child page routes matches the URL.
  const isActive = items.some((r) => {
    if (r.anchor) return false
    const target = `/${lang}${r.path === '/' ? '' : r.path}`
    return location.pathname === target
  })

  const clearTimers = () => {
    if (openTimerRef.current !== null) {
      window.clearTimeout(openTimerRef.current)
      openTimerRef.current = null
    }
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
  }

  const scheduleOpen = () => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
    if (open || openTimerRef.current !== null) return
    openTimerRef.current = window.setTimeout(() => {
      setOpen(true)
      openTimerRef.current = null
    }, OPEN_DELAY_MS)
  }

  const scheduleClose = () => {
    if (openTimerRef.current !== null) {
      window.clearTimeout(openTimerRef.current)
      openTimerRef.current = null
    }
    if (!open || closeTimerRef.current !== null) return
    closeTimerRef.current = window.setTimeout(() => {
      setOpen(false)
      closeTimerRef.current = null
    }, CLOSE_DELAY_MS)
  }

  const closeNow = () => {
    clearTimers()
    setOpen(false)
  }

  useEffect(() => () => clearTimers(), [])

  useEffect(() => {
    if (!open) return
    const handlePointer = (e: MouseEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) closeNow()
    }
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeNow()
    }
    document.addEventListener('mousedown', handlePointer)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handlePointer)
      document.removeEventListener('keydown', handleKey)
    }
  }, [open])

  return (
    <div
      ref={wrapperRef}
      className="relative"
      onMouseEnter={scheduleOpen}
      onMouseLeave={scheduleClose}
    >
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => (open ? closeNow() : setOpen(true))}
        onFocus={() => {
          clearTimers()
          setOpen(true)
        }}
        className={`flex items-center gap-1.5 whitespace-nowrap px-2.5 py-2 text-[13px] transition ${
          isActive ? 'font-bold text-brand' : 'text-white/70 hover:text-white'
        }`}
      >
        <span>{label}</span>
        <CaretDown
          size={12}
          weight="bold"
          className={`transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div
          role="menu"
          style={{ borderColor: '#b3c2bb' }}
          className="animate-fade-in absolute right-0 top-full mt-2 min-w-[200px] rounded-2xl border bg-primary/95 shadow-[0_18px_40px_-15px_rgba(0,0,0,0.45)] backdrop-blur-md before:absolute before:-top-2 before:left-0 before:right-0 before:h-2 before:content-['']"
        >
          <ul className="flex flex-col overflow-hidden rounded-[inherit] py-1.5">
            {items.map((route, idx) => {
              const Icon = route.icon
              const itemLabel = labelOf(route, lang)
              if (route.anchor) {
                return (
                  <li key={idx} role="none">
                    <button
                      role="menuitem"
                      onClick={() => {
                        goToAnchor(route.anchor!)
                        closeNow()
                      }}
                      className="flex w-full items-center gap-2.5 px-4 py-2 text-left text-[13px] text-white/80 transition hover:bg-white/10 hover:text-white"
                    >
                      {Icon && <Icon size={16} />}
                      <span>{t(`nav.${route.anchor}`, itemLabel)}</span>
                    </button>
                  </li>
                )
              }
              const tKey = `nav.${route.path.replace('/', '')}`
              return (
                <li key={idx} role="none">
                  <NavLink
                    role="menuitem"
                    to={`/${lang}${route.path}`}
                    onClick={closeNow}
                    className={({ isActive: childActive }) =>
                      `flex w-full items-center gap-2.5 px-4 py-2 text-[13px] transition hover:bg-white/10 ${
                        childActive ? 'font-bold text-brand' : 'text-white/80 hover:text-white'
                      }`
                    }
                  >
                    {Icon && <Icon size={16} />}
                    <span>{t(tKey, itemLabel)}</span>
                  </NavLink>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}
