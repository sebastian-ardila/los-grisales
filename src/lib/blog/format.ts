import type { Lang } from './types'

/** Formatea una fecha ISO (YYYY-MM-DD) a texto legible localizado por idioma. */
export function formatPostDate(date: string, lang: Lang): string {
  const parsed = new Date(date)
  if (Number.isNaN(parsed.getTime())) return date
  return parsed.toLocaleDateString(lang, { year: 'numeric', month: 'long', day: 'numeric' })
}
