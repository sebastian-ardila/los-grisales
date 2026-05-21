import { useTranslation } from 'react-i18next'

export type Lang = 'es' | 'en' | 'fr'

export function toLang(raw: string | undefined): Lang {
  const v = (raw ?? '').toLowerCase()
  if (v.startsWith('en')) return 'en'
  if (v.startsWith('fr')) return 'fr'
  return 'es'
}

export function useLang(): Lang {
  const { i18n } = useTranslation()
  return toLang(i18n.language)
}

/** Pick a value per language. Fallbacks to Spanish if a key is missing. */
export function pick<T>(lang: Lang, options: { es: T; en: T; fr?: T }): T {
  if (lang === 'en') return options.en
  if (lang === 'fr') return (options.fr ?? options.es) as T
  return options.es
}
