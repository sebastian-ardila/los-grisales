// Pre-renderiza cada ruta concreta a HTML estático tras `vite build`.
// Usa el preview server de Vite + Puppeteer (navegador real → no requiere SSR-safe).
import { preview } from 'vite'
import puppeteer from 'puppeteer'
import { mkdirSync, writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { readBlogPosts } from './read-blog.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const distDir = resolve(__dirname, '..', 'dist')
const LANGS = ['es', 'en', 'fr']

function routesToRender() {
  const base = ['', '/historia', '/productos', '/blog']
  const paths = []
  for (const lang of LANGS) {
    for (const b of base) paths.push(`/${lang}${b}`)
  }
  for (const post of readBlogPosts()) {
    paths.push(`/${post.lang}/blog/${post.slug}`)
  }
  return paths
}

function outFile(routePath) {
  const clean = routePath.replace(/^\//, '')
  return resolve(distDir, clean, 'index.html')
}

const server = await preview({ preview: { port: 4173 } })
const origin = server.resolvedUrls.local[0].replace(/\/$/, '')
const browser = await puppeteer.launch({ args: ['--no-sandbox'] })

try {
  const routes = routesToRender()
  for (const routePath of routes) {
    const page = await browser.newPage()
    await page.goto(`${origin}${routePath}`, { waitUntil: 'networkidle0' })
    await page.waitForSelector('main, article', { timeout: 15000 })
    const html = await page.content()
    const file = outFile(routePath)
    mkdirSync(dirname(file), { recursive: true })
    writeFileSync(file, html, 'utf8')
    await page.close()
    console.log(`✓ prerender ${routePath}`)
  }
  console.log(`✓ prerendered ${routes.length} rutas`)
} finally {
  await browser.close()
  await new Promise((res) => server.httpServer.close(res))
}
