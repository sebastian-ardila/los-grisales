import { useLocation } from 'react-router-dom'
import { House } from '@phosphor-icons/react'
import { useTranslation } from 'react-i18next'
import { routes } from '../../config/routes'

export default function Breadcrumb() {
  const location = useLocation()
  const { t, i18n } = useTranslation()
  const lang = i18n.language?.startsWith('en') ? 'en' : 'es'

  // Strip /:lang prefix to get the actual page path
  const pagePath = location.pathname.replace(/^\/(es|en)/, '') || '/'

  // Don't show breadcrumb on home or carta
  if (pagePath === '/' || pagePath === '' || pagePath === '/carta') return null

  const currentRoute = routes.find((r) => r.path === pagePath)
  if (!currentRoute) return null

  const Icon = currentRoute.icon
  const pageName = lang === 'en' ? currentRoute.nameEn : currentRoute.nameEs

  return (
    <div className="sticky top-16 z-40 bg-primary/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl items-center gap-2 px-4 py-2 text-sm text-white/70">
        <House size={16} className="shrink-0" />
        <span>{t('breadcrumb.home')}</span>
        <span className="text-white/30">/</span>
        <span className="flex items-center gap-1.5 text-white">
          {Icon && <Icon size={16} />}
          {pageName}
        </span>
      </div>
    </div>
  )
}
