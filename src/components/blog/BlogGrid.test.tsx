import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import BlogGrid from './BlogGrid'
import type { BlogListItem } from '../../lib/blog/types'

function item(id: string, tag: string): BlogListItem {
  return {
    id, slug: id, title: `Título ${id}`, description: 'd', excerpt: 'e',
    keywords: [], date: '2026-06-01', updated: '2026-06-01', author: 'A',
    cover: '/c.svg', coverAlt: 'alt', tags: [tag],
    translations: { es: id, en: id, fr: id }, readingMinutes: 1,
  }
}

const posts = [item('uno', 'tour'), item('dos', 'especialidad')]

describe('BlogGrid', () => {
  it('filtra por tag al pulsar el botón', async () => {
    render(
      <MemoryRouter>
        <BlogGrid posts={posts} lang="es" />
      </MemoryRouter>,
    )
    expect(screen.getByText('Título uno')).toBeInTheDocument()
    expect(screen.getByText('Título dos')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'tour' }))
    expect(screen.getByText('Título uno')).toBeInTheDocument()
    expect(screen.queryByText('Título dos')).not.toBeInTheDocument()
  })
})
