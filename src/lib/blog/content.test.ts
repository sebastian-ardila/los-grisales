import { describe, it, expect } from 'vitest'
import { blog } from './index'
import type { Lang } from './types'

const EXPECTED = {
  es: ['cafe-de-especialidad-pereira', 'coffee-tour-en-pereira', 'cafe-en-unicentro-pereira', 'cafe-en-pereira-plaza', 'que-es-cafe-de-especialidad', 'sostenibilidad-negocios-verdes-carder', 'hablemos-de-cafe-unicentro-pereira', 'zona-mundialista-futbol-cafe', 'coffee-hour-martes-jueves', 'experiencia-coffee-tour', 'que-hacer-en-pereira-fiestas-de-la-cosecha', 'pausa-en-pereira-plaza', 'una-taza-que-ayuda', 'tu-visita-ayudara-a-nuestra-ciudad', 'plan-familiar-entre-cafetales-pereira'],
  en: ['specialty-coffee-pereira', 'coffee-tour-in-pereira', 'coffee-at-unicentro-pereira', 'coffee-at-pereira-plaza', 'what-is-specialty-coffee', 'sustainable-coffee-carder', 'lets-talk-coffee-unicentro-pereira', 'world-cup-zone-football-coffee', 'coffee-hour-tuesday-thursday', 'coffee-tour-experience', 'what-to-do-in-pereira-harvest-festival', 'pause-at-pereira-plaza', 'a-cup-that-helps', 'your-visit-will-help-our-city', 'family-day-among-coffee-fields-pereira'],
  fr: ['cafe-de-specialite-pereira', 'coffee-tour-a-pereira', 'cafe-a-unicentro-pereira', 'cafe-a-pereira-plaza', 'quest-ce-que-le-cafe-de-specialite', 'cafe-durable-carder', 'parlons-cafe-unicentro-pereira', 'zone-mondial-football-cafe', 'coffee-hour-mardi-jeudi', 'experience-coffee-tour', 'que-faire-a-pereira-fetes-de-la-recolte', 'pause-a-pereira-plaza', 'une-tasse-qui-aide', 'votre-visite-aidera-notre-ville', 'journee-entre-cafeiers-plan-famille-pereira'],
} as const

describe('contenido real del blog', () => {
  for (const lang of ['es', 'en', 'fr'] as Lang[]) {
    it(`${lang}: hay 15 posts con los slugs esperados`, () => {
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
  const ESPERADO = ['pausa-pereira-plaza', 'una-taza-que-ayuda', 'pereira-te-espera', 'coffee-hour']

  for (const lang of ['es', 'en', 'fr'] as Lang[]) {
    it(`${lang}: el hero muestra los 4 posts marcados en orden`, () => {
      expect(blog.getHeroPosts(lang).map((p) => p.id)).toEqual(ESPERADO)
    })

    it(`${lang}: cada post del hero tiene etiqueta, título, resumen y portada`, () => {
      for (const post of blog.getHeroPosts(lang)) {
        expect(post.heroEyebrow, `${post.id} heroEyebrow`).toBeTruthy()
        expect(post.heroTitle ?? post.title, `${post.id} título`).toBeTruthy()
        expect(post.heroExcerpt, `${post.id} heroExcerpt`).toBeTruthy()
        expect(post.cover, `${post.id} cover`).toMatch(/^\/blog\/.+\.webp$/)
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
  it('la primera tarjeta es el comunicado de Pereira Plaza', () => {
    const [card] = blog.getHeroPosts('es')
    expect(card.id).toBe('pausa-pereira-plaza')
    expect(card.heroTitle).toBe('Seguimos aquí, gracias por acompañarnos.')
    expect(card.heroExcerpt).toBe(
      'Nuestro punto de Pereira Plaza cerró temporalmente. Te esperamos en Unicentro Pereira y en nuestro Coffee Tour.',
    )
  })

  it('la segunda tarjeta es la campaña Una taza que ayuda', () => {
    const card = blog.getHeroPosts('es')[1]
    expect(card.id).toBe('una-taza-que-ayuda')
    expect(card.heroTitle).toBe('Una taza que ayuda')
    expect(card.heroExcerpt).toBe(
      'Compra una libra de nuestro café, recibe un americano y convierte tu visita en un aporte para nuestra ciudad.',
    )
  })

  it('la tercera tarjeta invita a seguir visitando la región', () => {
    const card = blog.getHeroPosts('es')[2]
    expect(card.id).toBe('pereira-te-espera')
    expect(card.heroTitle).toBe('Tu visita ayudará a nuestra ciudad')
    expect(card.heroExcerpt).toBe(
      'Sigue descubriendo Pereira, Dosquebradas y el Eje Cafetero. Tu visita también ayuda a que nuestra región vuelva a ponerse en marcha.',
    )
  })

  it('Coffee Hour cierra el hero y las novedades anteriores salen', () => {
    const ids = blog.getHeroPosts('es').map((p) => p.id)
    expect(ids[3]).toBe('coffee-hour')
    for (const salido of ['coffee-tour-experience', 'fiestas-cosecha', 'negocios-verdes-carder']) {
      expect(ids, salido).not.toContain(salido)
    }
  })
})

describe('artículo largo fuera de novedades', () => {
  const ID = 'plan-familiar-cafetales'

  it('no aparece en el hero y no lleva el tag novedades', () => {
    expect(blog.getHeroPosts('es').map((p) => p.id)).not.toContain(ID)
    const post = blog.getPost('es', 'plan-familiar-entre-cafetales-pereira')!
    expect(post.tags).not.toContain('novedades')
  })

  it('conserva el titular completo aunque el title SEO sea corto', () => {
    const post = blog.getPost('es', 'plan-familiar-entre-cafetales-pereira')!
    expect(post.headline).toBe(
      'Un día entre cafetales: un plan familiar para conocer el café en Pereira',
    )
    expect(post.title.length).toBeLessThanOrEqual(60)
  })
})

describe('portadas aptas para compartir', () => {
  it('ninguna portada es SVG: los crawlers sociales no lo renderizan', () => {
    for (const lang of ['es', 'en', 'fr'] as Lang[]) {
      for (const post of blog.getAllPosts(lang)) {
        expect(post.cover, `${post.id}/${lang}`).toMatch(/\.webp$/)
      }
    }
  })
})

describe('títulos que no trunca Google', () => {
  it('ningún title pasa de 60 caracteres', () => {
    for (const lang of ['es', 'en', 'fr'] as Lang[]) {
      for (const post of blog.getAllPosts(lang)) {
        expect(post.title.length, `${post.id}/${lang}: ${post.title}`).toBeLessThanOrEqual(60)
      }
    }
  })
})
