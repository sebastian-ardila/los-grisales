import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import BlogGrid from './BlogGrid'
import type { BlogListItem } from '../../lib/blog/types'

const base = {
  description: '', excerpt: 'x', keywords: [], date: '2026-06-25', updated: '2026-06-25',
  author: 'A', cover: '', coverAlt: 'a', faq: [], readingMinutes: 1,
  translations: { es: '', en: '', fr: '' },
}
const posts: BlogListItem[] = [
  { ...base, id: 'p1', slug: 'p1', title: 'Post Novedad', tags: ['novedades', 'eventos'] },
  { ...base, id: 'p2', slug: 'p2', title: 'Post Normal', tags: ['Pereira'] },
]

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <BlogGrid posts={posts} lang="es" />
    </MemoryRouter>,
  )
}

describe('BlogGrid filtro por ?cat=', () => {
  it('sin cat muestra todos los posts', () => {
    renderAt('/es/blog')
    expect(screen.getByText('Post Novedad')).toBeInTheDocument()
    expect(screen.getByText('Post Normal')).toBeInTheDocument()
  })

  it('cat=novedades muestra solo posts con ese tag', () => {
    renderAt('/es/blog?cat=novedades')
    expect(screen.getByText('Post Novedad')).toBeInTheDocument()
    expect(screen.queryByText('Post Normal')).not.toBeInTheDocument()
  })

  it('cat inexistente muestra todos', () => {
    renderAt('/es/blog?cat=zzz')
    expect(screen.getByText('Post Novedad')).toBeInTheDocument()
    expect(screen.getByText('Post Normal')).toBeInTheDocument()
  })
})
