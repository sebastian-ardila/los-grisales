import { describe, it, expect } from 'vitest'
import { formatPostDate } from './format'

describe('formatPostDate', () => {
  it('parsea YYYY-MM-DD como fecha local (sin off-by-one por timezone)', () => {
    // Debe mostrar el día 25, no el 24 (bug en UTC-5 con new Date('2026-06-25'))
    expect(formatPostDate('2026-06-25', 'es')).toBe('25 de junio de 2026')
  })

  it('devuelve el string original si la fecha no es válida', () => {
    expect(formatPostDate('not-a-date', 'es')).toBe('not-a-date')
  })
})
