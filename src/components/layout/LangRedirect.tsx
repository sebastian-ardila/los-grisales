import { Navigate } from 'react-router-dom'

function detectLang(): 'es' | 'en' {
  const saved = localStorage.getItem('i18nextLng')?.toLowerCase()
  if (saved?.startsWith('en')) return 'en'
  if (saved?.startsWith('es')) return 'es'
  const navLangs = [
    ...((typeof navigator !== 'undefined' && navigator.languages) || []),
    typeof navigator !== 'undefined' ? navigator.language : '',
  ].filter(Boolean)
  for (const l of navLangs) {
    const low = l.toLowerCase()
    if (low.startsWith('en')) return 'en'
    if (low.startsWith('es')) return 'es'
  }
  return 'es'
}

export default function LangRedirect() {
  return <Navigate to={`/${detectLang()}`} replace />
}
