import { Navigate } from 'react-router-dom'

type Lang = 'es' | 'en' | 'fr'

function detectLang(): Lang {
  const saved = localStorage.getItem('i18nextLng')?.toLowerCase()
  if (saved?.startsWith('en')) return 'en'
  if (saved?.startsWith('fr')) return 'fr'
  if (saved?.startsWith('es')) return 'es'
  const navLangs = [
    ...((typeof navigator !== 'undefined' && navigator.languages) || []),
    typeof navigator !== 'undefined' ? navigator.language : '',
  ].filter(Boolean)
  for (const l of navLangs) {
    const low = l.toLowerCase()
    if (low.startsWith('en')) return 'en'
    if (low.startsWith('fr')) return 'fr'
    if (low.startsWith('es')) return 'es'
  }
  return 'es'
}

export default function LangRedirect() {
  return <Navigate to={`/${detectLang()}`} replace />
}
