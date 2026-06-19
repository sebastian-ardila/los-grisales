import { describe, it, expect } from 'vitest'
import { MarkdownSource } from './MarkdownSource'

function doc(slug: string, title: string) {
  return `---\nslug: ${slug}\ntitle: ${title}\ndescription: d\nexcerpt: e\nkeywords: [k]\ndate: 2026-06-01\nupdated: 2026-06-02\nauthor: A\ncover: /c.jpg\ncoverAlt: alt\ntags: [t]\nrelatedSede: pereira-plaza\n---\nCuerpo ${title}.`
}

const files: Record<string, string> = {
  '/src/content/blog/post-uno/es.md': doc('post-uno-es', 'Uno ES'),
  '/src/content/blog/post-uno/en.md': doc('post-one-en', 'One EN'),
  '/src/content/blog/post-uno/fr.md': doc('post-un-fr', 'Un FR'),
  '/src/content/blog/post-dos/es.md': doc('post-dos-es', 'Dos ES'),
  '/src/content/blog/post-dos/en.md': doc('post-two-en', 'Two EN'),
  '/src/content/blog/post-dos/fr.md': doc('post-deux-fr', 'Deux FR'),
}

describe('MarkdownSource', () => {
  const src = new MarkdownSource(files)

  it('getAllPosts devuelve los posts del idioma', () => {
    const es = src.getAllPosts('es')
    expect(es).toHaveLength(2)
    expect(es.map((p) => p.slug).sort()).toEqual(['post-dos-es', 'post-uno-es'])
  })

  it('getPost resuelve por slug localizado', () => {
    const post = src.getPost('en', 'post-one-en')
    expect(post?.id).toBe('post-uno')
    expect(post?.body.trim()).toBe('Cuerpo One EN.')
    expect(post?.readingMinutes).toBeGreaterThanOrEqual(1)
  })

  it('getPost devuelve null si no existe', () => {
    expect(src.getPost('es', 'no-existe')).toBeNull()
  })

  it('translations cruza los slugs de los 3 idiomas', () => {
    const post = src.getPost('es', 'post-uno-es')
    expect(post?.translations).toEqual({
      es: 'post-uno-es',
      en: 'post-one-en',
      fr: 'post-un-fr',
    })
  })

  it('getAllSlugs lista id+lang+slug de todos', () => {
    expect(src.getAllSlugs()).toHaveLength(6)
  })

  it('getRelated excluye el propio post', () => {
    const post = src.getPost('es', 'post-uno-es')!
    const related = src.getRelated(post, 'es')
    expect(related.every((r) => r.id !== post.id)).toBe(true)
  })

  it('findByAnySlug resuelve el post desde el slug de cualquier idioma', () => {
    // slug en inglés debe encontrar el mismo post (id post-uno)
    expect(src.findByAnySlug('post-one-en')?.id).toBe('post-uno')
    // slug en francés también
    expect(src.findByAnySlug('post-un-fr')?.id).toBe('post-uno')
    // slug inexistente → null
    expect(src.findByAnySlug('no-existe')).toBeNull()
  })
})

describe('MarkdownSource – campo faq', () => {
  const faqDoc = `---
slug: faq-test
title: FAQ Test
description: d
excerpt: e
keywords: [k]
date: 2026-06-01
updated: 2026-06-01
author: A
cover: /c.jpg
coverAlt: alt
tags: [t]
faq:
  - q: "¿Qué es el café de especialidad?"
    a: "Es un café con puntaje SCA superior a 80."
  - q: "¿Dónde está Café Los Grisales?"
    a: "En Pereira Plaza y Unicentro Pereira."
  - q: "¿Tienen Coffee Tour?"
    a: "Sí, ofrecemos Coffee Tour del grano a la taza."
---
Cuerpo con FAQ.`

  const src2 = new MarkdownSource({
    '/src/content/blog/faq-post/es.md': faqDoc,
  })

  it('expone faq como array de {q,a}', () => {
    const post = src2.getPost('es', 'faq-test')
    expect(post).not.toBeNull()
    expect(Array.isArray(post!.faq)).toBe(true)
    expect(post!.faq).toHaveLength(3)
    expect(post!.faq![0].q).toBe('¿Qué es el café de especialidad?')
    expect(post!.faq![0].a).toBe('Es un café con puntaje SCA superior a 80.')
  })

  it('faq es [] cuando no está en el frontmatter', () => {
    const src3 = new MarkdownSource({
      '/src/content/blog/no-faq/es.md': doc('no-faq', 'Sin FAQ'),
    })
    const post = src3.getPost('es', 'no-faq')
    expect(post!.faq).toEqual([])
  })
})
