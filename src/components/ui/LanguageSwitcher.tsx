import type { ComponentType, SVGProps } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useLocation } from 'react-router-dom'
import ES from 'country-flag-icons/react/3x2/ES'
import GB from 'country-flag-icons/react/3x2/GB'
import FR from 'country-flag-icons/react/3x2/FR'
import { toLang, type Lang } from '../../utils/lang'

type FlagIcon = ComponentType<SVGProps<SVGSVGElement>>

const LANGS: { code: Lang; Flag: FlagIcon; label: string; aria: string }[] = [
  { code: 'es', Flag: ES as FlagIcon, label: 'ES', aria: 'Cambiar a Español' },
  { code: 'en', Flag: GB as FlagIcon, label: 'EN', aria: 'Switch to English' },
  { code: 'fr', Flag: FR as FlagIcon, label: 'FR', aria: 'Passer au français' },
]

interface Props {
  /** "dark" → on dark backgrounds (navbar). "light" → on light card backgrounds. */
  variant?: 'dark' | 'light'
}

/**
 * Shared language switcher. A single pill with one segment per supported
 * language: flag on top, 2-letter code below. Active segment fills with the
 * brand green; the rest stay transparent. Container has no background and a
 * thin border that picks up the surrounding text colour so it works on both
 * dark navbars and light section cards.
 *
 * Updates global i18n language AND the URL prefix so deep-links and refresh
 * keep the selected language.
 */
export default function LanguageSwitcher({ variant = 'light' }: Props) {
  const { i18n } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const current = toLang(i18n.language)

  const switchTo = (target: Lang) => {
    if (target === current) return
    i18n.changeLanguage(target)
    const newPath = location.pathname.replace(/^\/(es|en|fr)/, `/${target}`)
    navigate(`${newPath}${location.search}`, { replace: true })
  }

  // Mobile: una sola bandera que cicla al siguiente idioma en cada click.
  const currentIdx = Math.max(0, LANGS.findIndex((l) => l.code === current))
  const nextLang = LANGS[(currentIdx + 1) % LANGS.length]
  const currentLang = LANGS[currentIdx]

  // Border colour: same brand-green family on both backgrounds.
  //  - light card: brand dark green at full strength
  //  - dark variant (navbar over the cream theme): a very soft, dusty sage so
  //    the pill outlines the chips without competing with anything. No opacity.
  const borderColor = variant === 'dark' ? '#b3c2bb' : '#064947'
  // Inactive label colour. The navbar sits on the cream theme primary so the
  // text needs to be dark to keep contrast; full brand green pairs with the
  // active chip without looking like a hard black.
  const inactiveFg = variant === 'dark' ? '#064947' : '#064947'

  return (
    <>
      {/* Mobile: una sola bandera (la actual); click → siguiente idioma */}
      <button
        type="button"
        onClick={() => switchTo(nextLang.code)}
        aria-label={nextLang.aria}
        style={{ borderColor }}
        className="inline-flex shrink-0 items-center rounded-2xl border bg-transparent p-1 sm:hidden"
      >
        <span
          style={{ backgroundColor: '#064947', color: '#ffffff' }}
          className="inline-flex flex-col items-center justify-center gap-0.5 rounded-xl px-2 py-1 text-[10px] font-extrabold uppercase leading-none tracking-wider shadow-[0_2px_6px_-2px_rgba(0,0,0,0.2)]"
        >
          <currentLang.Flag
            aria-hidden="true"
            className="h-3 w-[18px] shrink-0 overflow-hidden rounded-[2px] shadow-[0_0_0_1px_rgba(0,0,0,0.1)]"
          />
          <span>{currentLang.label}</span>
        </span>
      </button>

      {/* Desktop: selector con las 3 banderas */}
      <div
        role="tablist"
        aria-label="Language"
        style={{ borderColor }}
        className="hidden shrink-0 items-stretch gap-1 rounded-2xl border bg-transparent p-1 sm:inline-flex"
      >
        {LANGS.map(({ code, Flag, label, aria }) => (
          <Chip
            key={code}
            active={current === code}
            onClick={() => switchTo(code)}
            Flag={Flag}
            label={label}
            aria={aria}
            inactiveFg={inactiveFg}
          />
        ))}
      </div>
    </>
  )
}

function Chip({
  active,
  onClick,
  Flag,
  label,
  aria,
  inactiveFg,
}: {
  active: boolean
  onClick: () => void
  Flag: FlagIcon
  label: string
  aria: string
  inactiveFg: string
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      aria-label={aria}
      onClick={onClick}
      style={
        active
          ? { backgroundColor: '#064947', color: '#ffffff' }
          : { color: inactiveFg, backgroundColor: 'transparent' }
      }
      className={`inline-flex flex-col items-center justify-center gap-0.5 rounded-xl px-2 py-1 text-[10px] font-extrabold uppercase leading-none tracking-wider transition ${
        active ? 'shadow-[0_2px_6px_-2px_rgba(0,0,0,0.2)]' : 'hover:bg-white/10'
      }`}
    >
      <Flag
        aria-hidden="true"
        className="h-3 w-[18px] shrink-0 overflow-hidden rounded-[2px] shadow-[0_0_0_1px_rgba(0,0,0,0.1)]"
      />
      <span>{label}</span>
    </button>
  )
}
