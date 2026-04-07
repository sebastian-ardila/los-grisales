import { useTranslation } from 'react-i18next'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import { GlobeSimple } from '@phosphor-icons/react'

export default function LanguageToggle() {
  const { i18n } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const { lang } = useParams()
  const current = i18n.language?.startsWith('en') ? 'en' : 'es'
  const next = current === 'es' ? 'en' : 'es'

  const switchLang = () => {
    i18n.changeLanguage(next)
    const rest = location.pathname.replace(`/${lang}`, '') || ''
    navigate(`/${next}${rest}`, { replace: true })
  }

  return (
    <button
      onClick={switchLang}
      className="flex items-center gap-1 text-xs text-white/60 transition hover:text-white/90"
    >
      <GlobeSimple size={16} />
      <span className="font-medium uppercase">{next}</span>
    </button>
  )
}
