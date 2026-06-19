import { describe, it, expect } from 'vitest'
import { blog } from './index'
import type { Lang } from './types'

const EXPECTED = {
  es: ['cafe-de-especialidad-pereira', 'coffee-tour-en-pereira', 'cafe-en-unicentro-pereira', 'cafe-en-pereira-plaza', 'que-es-cafe-de-especialidad'],
  en: ['specialty-coffee-pereira', 'coffee-tour-in-pereira', 'coffee-at-unicentro-pereira', 'coffee-at-pereira-plaza', 'what-is-specialty-coffee'],
  fr: ['cafe-de-specialite-pereira', 'coffee-tour-a-pereira', 'cafe-a-unicentro-pereira', 'cafe-a-pereira-plaza', 'quest-ce-que-le-cafe-de-specialite'],
} as const

describe('contenido real del blog', () => {
  for (const lang of ['es', 'en', 'fr'] as Lang[]) {
    it(`${lang}: hay 5 posts con los slugs esperados`, () => {
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
