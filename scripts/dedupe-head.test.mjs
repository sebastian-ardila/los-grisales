import { describe, it, expect, beforeEach } from 'vitest'
import { dedupeHead } from './dedupe-head.mjs'

/**
 * Reproduce el head que deja el prerender: las etiquetas de respaldo de
 * index.html (marcadas con data-seo-fallback) más las de Helmet. Helmet
 * inserta su <title> ANTES que el del template y sus <meta> DESPUÉS, de ahí
 * el orden mezclado.
 */
function montarHead({ ogImageFinal = '/blog/x/cover.webp', conPagina = true } = {}) {
  const dePagina = !conPagina
    ? ''
    : `
    <title>Título del artículo</title>
    <meta name="description" content="Descripción del artículo">
    <meta property="og:title" content="OG del artículo">
    <meta property="og:image" content="https://cafelosgrisales.com${ogImageFinal}">
    <meta property="og:locale:alternate" content="en_US">
    <meta property="og:locale:alternate" content="fr_FR">
    <link rel="canonical" href="https://cafelosgrisales.com/es/blog/x">
    <link rel="alternate" hreflang="en" href="https://cafelosgrisales.com/en/blog/x">
  `
  document.head.innerHTML = `
    <meta charset="UTF-8">
    ${dePagina}
    <title data-seo-fallback>Título genérico del sitio</title>
    <meta data-seo-fallback name="description" content="Descripción genérica">
    <meta data-seo-fallback property="og:title" content="OG genérico">
    <meta data-seo-fallback property="og:image" content="https://cafelosgrisales.com/og-image.jpg">
    <meta data-seo-fallback property="og:image:secure_url" content="https://cafelosgrisales.com/og-image.jpg">
    <meta data-seo-fallback property="og:image:type" content="image/jpeg">
    <meta data-seo-fallback property="og:image:width" content="1200">
    <meta data-seo-fallback property="og:image:height" content="630">
    <meta data-seo-fallback property="og:image:alt" content="Logo genérico">
    <meta data-seo-fallback name="twitter:image:alt" content="Logo genérico">
    <meta name="robots" content="index, follow">
    <link rel="icon" href="/favicon.ico">
  `
}

const contenido = (sel) =>
  Array.from(document.head.querySelectorAll(sel)).map(
    (el) => el.getAttribute('content') ?? el.textContent,
  )

describe('dedupeHead', () => {
  beforeEach(() => montarHead())

  it('deja un solo title y conserva el del artículo', () => {
    dedupeHead()
    expect(document.head.querySelectorAll('title')).toHaveLength(1)
    expect(document.head.querySelector('title').textContent).toBe('Título del artículo')
  })

  it('deja una sola description, og:title y og:image, las del artículo', () => {
    dedupeHead()
    expect(contenido('meta[name="description"]')).toEqual(['Descripción del artículo'])
    expect(contenido('meta[property="og:title"]')).toEqual(['OG del artículo'])
    expect(contenido('meta[property="og:image"]')).toEqual([
      'https://cafelosgrisales.com/blog/x/cover.webp',
    ])
  })

  it('elimina las variantes og:image:* que describen la imagen genérica', () => {
    dedupeHead()
    expect(document.head.querySelector('meta[property="og:image:width"]')).toBeNull()
    expect(document.head.querySelector('meta[property="og:image:alt"]')).toBeNull()
    expect(document.head.querySelector('meta[name="twitter:image:alt"]')).toBeNull()
  })

  it('conserva las variantes og:image:* cuando la página usa la imagen genérica', () => {
    montarHead({ ogImageFinal: '/og-image.jpg' })
    dedupeHead()
    expect(contenido('meta[property="og:image:width"]')).toEqual(['1200'])
  })

  it('conserva el respaldo intacto si la página no aporta etiquetas', () => {
    montarHead({ conPagina: false })
    expect(dedupeHead()).toBe(0)
    expect(document.head.querySelector('title').textContent).toBe('Título genérico del sitio')
    expect(contenido('meta[name="description"]')).toEqual(['Descripción genérica'])
  })

  it('no toca multivaluadas, canonical, hreflang ni etiquetas sin respaldo', () => {
    dedupeHead()
    expect(contenido('meta[property="og:locale:alternate"]')).toEqual(['en_US', 'fr_FR'])
    expect(document.head.querySelectorAll('link[rel="canonical"]')).toHaveLength(1)
    expect(document.head.querySelectorAll('link[rel="alternate"]')).toHaveLength(1)
    expect(document.head.querySelectorAll('link[rel="icon"]')).toHaveLength(1)
    expect(contenido('meta[name="robots"]')).toEqual(['index, follow'])
  })

  it('es idempotente y devuelve cuántas etiquetas eliminó', () => {
    expect(dedupeHead()).toBeGreaterThan(0)
    expect(dedupeHead()).toBe(0)
  })
})
