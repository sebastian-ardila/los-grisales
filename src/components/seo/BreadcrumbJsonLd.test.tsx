import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import BreadcrumbJsonLd from './BreadcrumbJsonLd'

const items = [
  { name: 'Inicio', url: 'https://cafelosgrisales.com/es' },
  { name: 'Blog', url: 'https://cafelosgrisales.com/es/blog' },
  { name: 'Artículo', url: 'https://cafelosgrisales.com/es/blog/articulo' },
]

describe('BreadcrumbJsonLd', () => {
  it('inyecta JSON-LD BreadcrumbList con los ítems correctos', () => {
    render(<BreadcrumbJsonLd items={items} />)
    const script = document.head.querySelector('script[type="application/ld+json"]')
    expect(script).not.toBeNull()
    const json = JSON.parse(script!.textContent!)
    expect(json['@type']).toBe('BreadcrumbList')
    expect(json.itemListElement).toHaveLength(3)
    expect(json.itemListElement[0].position).toBe(1)
    expect(json.itemListElement[0].name).toBe('Inicio')
    expect(json.itemListElement[1].position).toBe(2)
    expect(json.itemListElement[1].name).toBe('Blog')
    expect(json.itemListElement[2].position).toBe(3)
    expect(json.itemListElement[2].name).toBe('Artículo')
  })
})
