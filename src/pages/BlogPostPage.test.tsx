import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { HelmetProvider } from 'react-helmet-async'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { blog } from '../lib/blog'
import BlogPostPage from './BlogPostPage'

function renderAt(path: string) {
  return render(
    <HelmetProvider>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="/:lang/blog/:slug" element={<BlogPostPage />} />
          <Route path="/:lang/blog" element={<div>LISTA</div>} />
        </Routes>
      </MemoryRouter>
    </HelmetProvider>,
  )
}

describe('BlogPostPage', () => {
  it('renderiza el h1 del artículo existente', () => {
    const slug = blog.getAllPosts('es')[0].slug
    const title = blog.getPost('es', slug)!.title
    renderAt(`/es/blog/${slug}`)
    expect(screen.getByRole('heading', { level: 1, name: title })).toBeInTheDocument()
  })

  it('redirige a la lista si el slug no existe', () => {
    renderAt('/es/blog/no-existe-123')
    expect(screen.getByText('LISTA')).toBeInTheDocument()
  })

  it('cambio de idioma: un slug de otro idioma redirige a la traducción del mismo artículo (no a la lista)', () => {
    const esSlug = blog.getAllPosts('es')[0].slug
    const enSlug = blog.getPost('es', esSlug)!.translations.en
    const enTitle = blog.getPost('en', enSlug)!.title
    // slug en español bajo el prefijo /en (lo que produce el cambio de idioma)
    renderAt(`/en/blog/${esSlug}`)
    expect(screen.getByRole('heading', { level: 1, name: enTitle })).toBeInTheDocument()
  })
})
