import { useTranslation } from 'react-i18next'
import { useNavigate, useLocation } from 'react-router-dom'
import { toLang, type Lang } from '../../utils/lang'

const LANGS: { code: Lang; flag: string; label: string; aria: string }[] = [
  { code: 'es', flag: '🇪🇸', label: 'ES', aria: 'Cambiar a Español' },
  { code: 'en', flag: '🇬🇧', label: 'EN', aria: 'Switch to English' },
  { code: 'fr', flag: '🇫🇷', label: 'FR', aria: 'Passer au français' },
]

interface Props {
  /** "dark" → on dark backgrounds (navbar). "light" → on light card backgrounds. */
  variant?: 'dark' | 'light'
  /** Hide the language label, keep just the flag (extra compact). */
  hideLabel?: boolean
}

/**
 * Shared language switcher. Updates global i18n language AND the URL hash so
 * deep-links and refresh keep the selected language. Used by Navbar and any
 * section-level switcher.
 */
export default function LanguageSwitcher({ variant = 'light', hideLabel = false }: Props) {
  const { i18n } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const current = toLang(i18n.language)

  const switchTo = (target: Lang) => {
    if (target === current) return
    i18n.changeLanguage(target)
    // Update the URL path (lang prefix) so react-router useParams stays consistent
    // and Layout's sync effect doesn't revert the change on next navigation.
    const newPath = location.pathname.replace(/^\/(es|en|fr)/, `/${target}`)
    navigate(`${newPath}${location.search}`, { replace: true })
  }

  const containerStyle =
    variant === 'dark'
      ? { backgroundColor: 'rgba(255,255,255,0.95)', borderColor: 'rgba(255,255,255,0.4)' }
      : { backgroundColor: '#ffffff', borderColor: 'rgba(0,0,0,0.18)' }

  return (
    <div
      role="tablist"
      aria-label="Language"
      style={containerStyle}
      className="inline-flex shrink-0 items-center gap-0.5 rounded-full border p-0.5 shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)]"
    >
      {LANGS.map(({ code, flag, label, aria }) => (
        <Chip
          key={code}
          active={current === code}
          onClick={() => switchTo(code)}
          flag={flag}
          label={label}
          aria={aria}
          hideLabel={hideLabel}
        />
      ))}
    </div>
  )
}

function Chip({
  active,
  onClick,
  flag,
  label,
  aria,
  hideLabel,
}: {
  active: boolean
  onClick: () => void
  flag: string
  label: string
  aria: string
  hideLabel: boolean
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      aria-label={aria}
      onClick={onClick}
      style={active ? { backgroundColor: '#064947', color: '#ffffff' } : { color: 'rgba(0,0,0,0.7)' }}
      className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-extrabold uppercase tracking-wider transition ${
        active ? 'shadow-[0_2px_6px_-1px_rgba(0,0,0,0.25)]' : 'hover:bg-black/5'
      }`}
    >
      <span aria-hidden="true" className="text-sm leading-none">{flag}</span>
      {!hideLabel && <span>{label}</span>}
    </button>
  )
}
