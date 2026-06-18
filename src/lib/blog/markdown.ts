import fm from 'front-matter'

export function parseDoc(raw: string): {
  attributes: Record<string, unknown>
  body: string
} {
  const parsed = fm<Record<string, unknown>>(raw)
  return { attributes: parsed.attributes, body: parsed.body }
}

export function estimateReadingMinutes(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
}
