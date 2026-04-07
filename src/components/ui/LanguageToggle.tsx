import { useTranslation } from 'react-i18next'

export default function LanguageToggle() {
  const { i18n } = useTranslation()
  const current = i18n.language?.startsWith('en') ? 'en' : 'es'

  return (
    <div className="flex items-center gap-1 text-xs">
      <button
        onClick={() => i18n.changeLanguage('es')}
        className={`px-1 transition-colors ${
          current === 'es' ? 'text-brand font-bold' : 'text-white/50 hover:text-white/70'
        }`}
      >
        ES
      </button>
      <span className="text-white/30">|</span>
      <button
        onClick={() => i18n.changeLanguage('en')}
        className={`px-1 transition-colors ${
          current === 'en' ? 'text-brand font-bold' : 'text-white/50 hover:text-white/70'
        }`}
      >
        EN
      </button>
    </div>
  )
}
