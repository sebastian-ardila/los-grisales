// Generates dist/sitemap.xml and dist/robots.txt from the route list below.
// Runs after `vite build` (see package.json scripts).
//
// To add a new page: add an entry to ROUTES with `path` and optional
// `lastmod` / `priority` / `changefreq`. The script will expand each route
// to /es, /en, /fr automatically and emit hreflang alternates.

import { writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const distDir = resolve(__dirname, '..', 'dist')
const SITE_ORIGIN = 'https://cafelosgrisales.com'
const LANGS = ['es', 'en', 'fr']
const today = new Date().toISOString().slice(0, 10)

/**
 * Each entry is one logical page that exists in all three languages.
 * `path` is the suffix after the lang prefix; empty string = home.
 */
const ROUTES = [
  { path: '', priority: '1.0', changefreq: 'weekly' },
  { path: '/historia', priority: '0.8', changefreq: 'monthly' },
  { path: '/productos', priority: '0.8', changefreq: 'weekly' },
]

function urlEntry(lang, route) {
  const loc = `${SITE_ORIGIN}/${lang}${route.path}`
  const alternates = LANGS.map(
    (l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${SITE_ORIGIN}/${l}${route.path}"/>`,
  ).join('\n')
  const xDefault = `    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_ORIGIN}/es${route.path}"/>`
  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
${alternates}
${xDefault}
  </url>`
}

const urls = []
for (const route of ROUTES) {
  for (const lang of LANGS) {
    urls.push(urlEntry(lang, route))
  }
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('\n')}
</urlset>
`

const robots = `User-agent: *
Allow: /

Sitemap: ${SITE_ORIGIN}/sitemap.xml
`

if (!existsSync(distDir)) {
  mkdirSync(distDir, { recursive: true })
}
writeFileSync(resolve(distDir, 'sitemap.xml'), sitemap, 'utf8')
writeFileSync(resolve(distDir, 'robots.txt'), robots, 'utf8')

console.log(`✓ sitemap.xml (${urls.length} URLs) and robots.txt written to dist/`)
