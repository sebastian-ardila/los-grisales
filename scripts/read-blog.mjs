// Lee los .md del blog desde el filesystem (Node) para prerender y sitemap.
// Misma fuente de verdad que la app (que usa import.meta.glob).
import { readdirSync, readFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import fm from 'front-matter'

const __dirname = dirname(fileURLToPath(import.meta.url))
const BLOG_DIR = resolve(__dirname, '..', 'src', 'content', 'blog')
const LANGS = ['es', 'en', 'fr']

/** Devuelve un registro por archivo: { id, lang, slug, updated }. */
function readRaw() {
  if (!existsSync(BLOG_DIR)) return []
  const out = []
  for (const id of readdirSync(BLOG_DIR)) {
    for (const lang of LANGS) {
      const file = resolve(BLOG_DIR, id, `${lang}.md`)
      if (!existsSync(file)) continue
      const { attributes } = fm(readFileSync(file, 'utf8'))
      const rawDate = attributes.updated ?? attributes.date ?? ''
      const updated =
        rawDate instanceof Date
          ? rawDate.toISOString().slice(0, 10)
          : String(rawDate)
      out.push({
        id,
        lang,
        slug: String(attributes.slug),
        updated,
      })
    }
  }
  return out
}

export function readBlogPosts() {
  return readRaw()
}

/** Entradas de sitemap para el índice + cada artículo por idioma. */
export function blogSitemapEntries() {
  const raw = readRaw()
  // translations por id para hreflang
  const byId = new Map()
  for (const r of raw) {
    if (!byId.has(r.id)) byId.set(r.id, {})
    byId.get(r.id)[r.lang] = r.slug
  }
  return raw.map((r) => {
    const tr = byId.get(r.id)
    return {
      lang: r.lang,
      path: `/blog/${r.slug}`,
      lastmod: r.updated,
      priority: '0.7',
      changefreq: 'monthly',
      alternates: LANGS.filter((l) => tr[l]).map((l) => ({ lang: l, path: `/blog/${tr[l]}` })),
    }
  })
}
