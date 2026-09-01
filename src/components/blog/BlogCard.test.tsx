import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import BlogCard from './BlogCard'
import type { BlogListItem } from '../../lib/blog/types'

const base: BlogListItem = {
  id: 'p1',
  slug: 'p1',
  title: 'Un post',
  description: '',
  excerpt: 'Resumen',
  keywords: [],
  date: '2026-06-25',
  updated: '2026-06-25',
  author: 'A',
  cover: '/blog/p1/cover.webp',
  coverAlt: 'Portada',
  tags: ['novedades'],
  faq: [],
  readingMinutes: 1,
  translations: { es: 'p1', en: 'p1', fr: 'p1' },
}

function renderCard(post: BlogListItem) {
  return render(
    <MemoryRouter>
      <BlogCard post={post} lang="es" />
    </MemoryRouter>,
  )
}

describe('BlogCard: miniatura', () => {
  it('muestra la portada del artículo', () => {
    const { container } = renderCard(base)
    const img = container.querySelector('img')
    expect(img).not.toBeNull()
    expect(img!.getAttribute('src')).toContain('/blog/p1/cover.webp')
    expect(img!.getAttribute('loading')).toBe('lazy')
  })

  it('es decorativa: el título ya nombra el artículo', () => {
    const { container } = renderCard(base)
    const img = container.querySelector('img')!
    expect(img.getAttribute('alt')).toBe('')
    expect(img.getAttribute('aria-hidden')).toBe('true')
  })

  it('sin portada no deja una imagen rota', () => {
    const { container } = renderCard({ ...base, cover: '' })
    expect(container.querySelector('img')).toBeNull()
    expect(screen.getByText('Un post')).toBeInTheDocument()
  })
})
