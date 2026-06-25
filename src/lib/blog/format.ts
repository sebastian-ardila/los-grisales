import type { Lang } from './types'

/** Formatea una fecha ISO (YYYY-MM-DD) a texto legible localizado por idioma.
 * Parsea YYYY-MM-DD como fecha local para evitar el off-by-one que ocurre en
 * zonas UTC-N cuando JS interpreta la cadena como medianoche UTC.
 */
export function formatPostDate(date: string, lang: Lang): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date)
  const parsed = match
    ? new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
    : new Date(date)
  if (Number.isNaN(parsed.getTime())) return date
  return parsed.toLocaleDateString(lang, { year: 'numeric', month: 'long', day: 'numeric' })
}
