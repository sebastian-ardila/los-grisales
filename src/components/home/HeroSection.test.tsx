import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import HeroNoticeCard from './HeroNoticeCard'
import { MarkdownSource } from '../../lib/blog/MarkdownSource'

const files: Record<string, string> = {
  '/src/content/blog/uno/es.md':
    `---\nslug: uno-es\ntitle: "Título largo con cola de SEO"\ndescription: d\nexcerpt: Excerpt largo del post\nkeywords: [k]\ndate: 2026-07-01\nauthor: A\ncover: /blog/uno/cover.webp\ncoverAlt: alt\ntags: [novedades]\nhero: 1\nheroEyebrow: Evento\nheroTitle: Título corto\nheroExcerpt: Una línea\n---\nCuerpo.`,
  '/src/content/blog/dos/es.md':
    `---\nslug: dos-es\ntitle: Segundo\ndescription: d\nexcerpt: Excerpt del segundo\nkeywords: [k]\ndate: 2026-06-01\nauthor: A\ncover: /blog/dos/cover.webp\ncoverAlt: alt\ntags: [novedades]\n---\nCuerpo.`,
}

describe('tarjetas del hero desde el blog', () => {
  const src = new MarkdownSource(files)

  it('usa heroTitle y heroExcerpt cuando existen', () => {
    const post = src.getHeroPosts('es')[0]
    render(
      <MemoryRouter>
        <HeroNoticeCard
          lang="es"
          href={`/es/blog/${post.slug}`}
          eyebrow={post.heroEyebrow}
          title={post.heroTitle ?? post.title}
          description={post.heroExcerpt ?? post.excerpt}
          date={post.date}
        />
      </MemoryRouter>,
    )
    expect(screen.getByRole('link', { name: /título corto/i })).toHaveAttribute(
      'href',
      '/es/blog/uno-es',
    )
    expect(screen.getByText('Una línea')).toBeInTheDocument()
  })

  it('cae a title y excerpt del post cuando no hay override', () => {
    const post = src.getHeroPosts('es')[1]
    expect(post.heroTitle ?? post.title).toBe('Segundo')
    expect(post.heroExcerpt ?? post.excerpt).toBe('Excerpt del segundo')
    expect(post.heroEyebrow).toBeUndefined()
  })

  it('la portada del post se resuelve sin duplicar la barra inicial', () => {
    const post = src.getHeroPosts('es')[0]
    expect(`/${post.cover.replace(/^\//, '')}`).toBe('/blog/uno/cover.webp')
  })
})
