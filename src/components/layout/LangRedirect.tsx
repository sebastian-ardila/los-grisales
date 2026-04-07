import { Navigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function LangRedirect() {
  const { i18n } = useTranslation()
  const lang = i18n.language?.startsWith('en') ? 'en' : 'es'
  return <Navigate to={`/${lang}`} replace />
}
