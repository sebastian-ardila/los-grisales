import { describe, it, expect } from 'vitest'
import { readBlogPosts, blogSitemapEntries } from './read-blog.mjs'

describe('read-blog', () => {
  it('lee 15 entradas (5 posts × 3 idiomas)', () => {
    expect(readBlogPosts()).toHaveLength(15)
  })

  it('cada entrada de sitemap del blog tiene alternates en 3 idiomas', () => {
    const entries = blogSitemapEntries()
    expect(entries).toHaveLength(15)
    for (const e of entries) {
      expect(e.alternates).toHaveLength(3)
      expect(e.path.startsWith('/blog/')).toBe(true)
    }
  })

  it('lastmod tiene formato YYYY-MM-DD (guard de Date aplicado)', () => {
    for (const e of blogSitemapEntries()) {
      expect(e.lastmod).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    }
  })
})
