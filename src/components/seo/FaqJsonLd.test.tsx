import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import FaqJsonLd from './FaqJsonLd'
import type { FaqItem } from '../../lib/blog/types'

const items: FaqItem[] = [
  { q: '¿Qué es el café de especialidad?', a: 'Es un café con más de 80 puntos SCA.' },
  { q: '¿Dónde está Café Los Grisales?', a: 'En Pereira Plaza y Unicentro Pereira.' },
  { q: '¿Tienen Coffee Tour?', a: 'Sí, del grano a la taza.' },
]

describe('FaqJsonLd', () => {
  it('no renderiza nada con items vacíos', () => {
    render(<FaqJsonLd items={[]} />)
    const scripts = document.head.querySelectorAll('script[type="application/ld+json"]')
    // no debe haber script de FAQPage cuando items está vacío
    const faqScript = Array.from(scripts).find((s) => {
      try {
        return JSON.parse(s.textContent!)['@type'] === 'FAQPage'
      } catch {
        return false
      }
    })
    expect(faqScript).toBeUndefined()
  })

  it('inyecta JSON-LD FAQPage con mainEntity correcto', () => {
    render(<FaqJsonLd items={items} />)
    const scripts = document.head.querySelectorAll('script[type="application/ld+json"]')
    const faqScript = Array.from(scripts).find((s) => {
      try {
        return JSON.parse(s.textContent!)['@type'] === 'FAQPage'
      } catch {
        return false
      }
    })
    expect(faqScript).not.toBeUndefined()
    const json = JSON.parse(faqScript!.textContent!)
    expect(json['@context']).toBe('https://schema.org')
    expect(json['@type']).toBe('FAQPage')
    expect(Array.isArray(json.mainEntity)).toBe(true)
    expect(json.mainEntity).toHaveLength(3)
    expect(json.mainEntity[0]['@type']).toBe('Question')
    expect(json.mainEntity[0].name).toBe('¿Qué es el café de especialidad?')
    expect(json.mainEntity[0].acceptedAnswer['@type']).toBe('Answer')
    expect(json.mainEntity[0].acceptedAnswer.text).toBe('Es un café con más de 80 puntos SCA.')
  })
})
