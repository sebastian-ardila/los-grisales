import { useTranslation } from 'react-i18next'

type Lang = 'es' | 'en'

export default function LanguageToggle() {
  const { i18n } = useTranslation()
  const current: Lang = i18n.language?.startsWith('en') ? 'en' : 'es'

  const switchTo = (target: Lang) => {
    if (target === current) return
    // Change i18n language — components using useTranslation re-render automatically.
    i18n.changeLanguage(target)
    // Update the URL hash in place so deep links / refresh use the new language.
    // history.replaceState does NOT trigger React Router, so HomePage does NOT
    // unmount and the user's scroll position is preserved.
    if (typeof window !== 'undefined') {
      const hash = window.location.hash || `#/${current}`
      const newHash = hash.replace(new RegExp(`^#/${current}\\b`), `#/${target}`)
      window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}${newHash}`)
    }
  }

  return (
    <div
      style={{
        backgroundColor: 'rgba(6, 73, 71, 0.08)',
        borderColor: '#064947',
      }}
      className="inline-flex items-center gap-0.5 rounded-full border p-0.5"
    >
      <LangChip
        flag="🇪🇸"
        code="ES"
        active={current === 'es'}
        onClick={() => switchTo('es')}
        ariaLabel="Cambiar a Español"
      />
      <LangChip
        flag="🇬🇧"
        code="EN"
        active={current === 'en'}
        onClick={() => switchTo('en')}
        ariaLabel="Switch to English"
      />
    </div>
  )
}

function LangChip({
  flag,
  code,
  active,
  onClick,
  ariaLabel,
}: {
  flag: string
  code: string
  active: boolean
  onClick: () => void
  ariaLabel: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      aria-pressed={active}
      style={
        active
          ? {
              backgroundColor: '#3a7e7a',
              color: '#ffffff',
              boxShadow: '0 1px 4px rgba(6, 73, 71, 0.18)',
            }
          : { color: 'rgba(6, 73, 71, 0.55)' }
      }
      className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide transition hover:opacity-90"
    >
      <span aria-hidden="true" className="text-sm leading-none">{flag}</span>
      <span>{code}</span>
    </button>
  )
}
