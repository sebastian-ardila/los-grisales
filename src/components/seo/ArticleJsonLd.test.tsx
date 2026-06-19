import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import ArticleJsonLd from './ArticleJsonLd'
import type { BlogPost } from '../../lib/blog/types'

const post: BlogPost = {
  id: 'x', slug: 'x', title: 'T', description: 'D', excerpt: 'E',
  keywords: ['k1', 'k2'], date: '2026-06-01', updated: '2026-06-02',
  author: 'Café Los Grisales', cover: '/c.jpg', coverAlt: 'alt', tags: ['t'], faq: [],
  translations: { es: 'x', en: 'x', fr: 'x' }, body: 'b', readingMinutes: 1,
}

describe('ArticleJsonLd', () => {
  it('inyecta JSON-LD BlogPosting con datos del post', () => {
    render(
      <ArticleJsonLd post={post} lang="es" url="https://cafelosgrisales.com/es/blog/x" />,
    )
    const script = document.head.querySelector('script[type="application/ld+json"]')
    expect(script).not.toBeNull()
    const json = JSON.parse(script!.textContent!)
    expect(json['@type']).toBe('BlogPosting')
    expect(json.headline).toBe('T')
    expect(json.image).toBe('https://cafelosgrisales.com/c.jpg')
    expect(json.keywords).toBe('k1, k2')
  })
})
