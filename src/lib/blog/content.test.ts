import { describe, it, expect } from 'vitest'
import { blog } from './index'
import type { Lang } from './types'

const EXPECTED = {
  es: ['cafe-de-especialidad-pereira', 'coffee-tour-en-pereira', 'cafe-en-unicentro-pereira', 'cafe-en-pereira-plaza', 'que-es-cafe-de-especialidad', 'sostenibilidad-negocios-verdes-carder', 'hablemos-de-cafe-unicentro-pereira', 'zona-mundialista-futbol-cafe', 'coffee-hour-martes-jueves', 'experiencia-coffee-tour', 'que-hacer-en-pereira-fiestas-de-la-cosecha'],
  en: ['specialty-coffee-pereira', 'coffee-tour-in-pereira', 'coffee-at-unicentro-pereira', 'coffee-at-pereira-plaza', 'what-is-specialty-coffee', 'sustainable-coffee-carder', 'lets-talk-coffee-unicentro-pereira', 'world-cup-zone-football-coffee', 'coffee-hour-tuesday-thursday', 'coffee-tour-experience', 'what-to-do-in-pereira-harvest-festival'],
  fr: ['cafe-de-specialite-pereira', 'coffee-tour-a-pereira', 'cafe-a-unicentro-pereira', 'cafe-a-pereira-plaza', 'quest-ce-que-le-cafe-de-specialite', 'cafe-durable-carder', 'parlons-cafe-unicentro-pereira', 'zone-mondial-football-cafe', 'coffee-hour-mardi-jeudi', 'experience-coffee-tour', 'que-faire-a-pereira-fetes-de-la-recolte'],
} as const

describe('contenido real del blog', () => {
  for (const lang of ['es', 'en', 'fr'] as Lang[]) {
    it(`${lang}: hay 11 posts con los slugs esperados`, () => {
      const slugs = blog.getAllPosts(lang).map((p) => p.slug).sort()
      expect(slugs).toEqual([...EXPECTED[lang]].sort())
    })

    it(`${lang}: cada post resuelve y tiene description <=160`, () => {
      for (const slug of EXPECTED[lang]) {
        const post = blog.getPost(lang, slug)
        expect(post, slug).not.toBeNull()
        expect(post!.description.length).toBeLessThanOrEqual(160)
        expect(post!.coverAlt.length).toBeGreaterThan(0)
        expect(post!.body.length).toBeGreaterThan(500)
      }
    })
  }

  it('los 4 posts de novedades llevan el tag "novedades" en es', () => {
    const ids = ['sostenibilidad-negocios-verdes-carder', 'hablemos-de-cafe-unicentro-pereira', 'zona-mundialista-futbol-cafe', 'coffee-hour-martes-jueves']
    for (const slug of ids) {
      const post = blog.getPost('es', slug)
      expect(post, slug).not.toBeNull()
      expect(post!.tags).toContain('novedades')
    }
  })
})

describe('FAQ en el contenido real', () => {
  it('el post cafe-de-especialidad-pereira/es tiene al menos 3 preguntas FAQ', () => {
    const post = blog.getPost('es', 'cafe-de-especialidad-pereira')
    expect(post).not.toBeNull()
    expect(Array.isArray(post!.faq)).toBe(true)
    expect(post!.faq!.length).toBeGreaterThanOrEqual(3)
    // cada ítem tiene q y a no vacíos
    for (const item of post!.faq!) {
      expect(item.q.length).toBeGreaterThan(0)
      expect(item.a.length).toBeGreaterThan(0)
    }
  })
})

describe('hero curado desde el contenido', () => {
  const ESPERADO = ['coffee-tour-experience', 'fiestas-cosecha', 'negocios-verdes-carder', 'coffee-hour']

  for (const lang of ['es', 'en', 'fr'] as Lang[]) {
    it(`${lang}: el hero muestra los 4 posts marcados en orden`, () => {
      expect(blog.getHeroPosts(lang).map((p) => p.id)).toEqual(ESPERADO)
    })

    it(`${lang}: cada post del hero tiene etiqueta, título, resumen y portada`, () => {
      for (const post of blog.getHeroPosts(lang)) {
        expect(post.heroEyebrow, `${post.id} heroEyebrow`).toBeTruthy()
        expect(post.heroTitle ?? post.title, `${post.id} título`).toBeTruthy()
        expect(post.heroExcerpt, `${post.id} heroExcerpt`).toBeTruthy()
        expect(post.cover, `${post.id} cover`).toMatch(/^\/blog\/.+\.(webp|svg)$/)
        expect(post.tags, `${post.id} tags`).toContain('novedades')
      }
    })
  }

  it('hablemos-de-cafe y zona-mundialista salen del hero y conservan su fecha', () => {
    const ids = blog.getHeroPosts('es').map((p) => p.id)
    expect(ids).not.toContain('hablemos-de-cafe')
    expect(ids).not.toContain('zona-mundialista')
    expect(blog.getPost('es', 'zona-mundialista-futbol-cafe')!.date).toBe('2026-06-25')
  })
})

describe('textos exactos de las tarjetas nuevas del hero', () => {
  it('Coffee Tour Experience usa la descripción corta aportada', () => {
    const [card] = blog.getHeroPosts('en')
    expect(card.id).toBe('coffee-tour-experience')
    expect(card.heroTitle).toBe('Coffee Tour Experience')
    expect(card.heroExcerpt).toBe(
      'Discover Colombian specialty coffee at its origin with an authentic coffee farm experience in Pereira, Colombia.',
    )
  })

  it('Fiestas de la Cosecha usa el título completo y la descripción corta aportada', () => {
    const card = blog.getHeroPosts('es')[1]
    expect(card.id).toBe('fiestas-cosecha')
    expect(card.heroTitle ?? card.title).toBe(
      '¿Qué hacer en Pereira durante las Fiestas de la Cosecha?',
    )
    expect(card.heroExcerpt).toBe(
      'Descubre un plan diferente entre café de especialidad, gastronomía y experiencias cafeteras en el corazón del Eje Cafetero.',
    )
  })
})
