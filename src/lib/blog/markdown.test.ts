import { describe, it, expect } from 'vitest'
import { parseDoc, estimateReadingMinutes } from './markdown'

describe('parseDoc', () => {
  it('separa frontmatter y cuerpo', () => {
    const raw = `---\ntitle: Hola\nkeywords:\n  - a\n  - b\n---\nCuerpo del texto.`
    const { attributes, body } = parseDoc(raw)
    expect(attributes.title).toBe('Hola')
    expect(attributes.keywords).toEqual(['a', 'b'])
    expect(body.trim()).toBe('Cuerpo del texto.')
  })
})

describe('estimateReadingMinutes', () => {
  it('estima ~200 palabras por minuto, mínimo 1', () => {
    expect(estimateReadingMinutes('una palabra')).toBe(1)
    const words = Array.from({ length: 400 }, () => 'palabra').join(' ')
    expect(estimateReadingMinutes(words)).toBe(2)
  })
})
