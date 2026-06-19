// Notifica a IndexNow (Bing, Yandex, etc.) las URLs del sitio tras el deploy,
// para indexación casi instantánea. La clave se verifica con el archivo
// public/<KEY>.txt (servido en la raíz del sitio).
//
// Es best-effort: si IndexNow falla, NO debe romper el deploy.
import { readBlogPosts } from './read-blog.mjs'

const SITE_ORIGIN = 'https://cafelosgrisales.com'
const HOST = 'cafelosgrisales.com'
// Debe coincidir con el nombre del archivo en public/<KEY>.txt
const KEY = '1f4a276d01849237315bc3a1f337ce00'
const LANGS = ['es', 'en', 'fr']

function buildUrls() {
  const base = ['', '/historia', '/productos', '/blog']
  const urls = []
  for (const lang of LANGS) {
    for (const b of base) urls.push(`${SITE_ORIGIN}/${lang}${b}`)
  }
  for (const post of readBlogPosts()) {
    urls.push(`${SITE_ORIGIN}/${post.lang}/blog/${post.slug}`)
  }
  return urls
}

async function main() {
  const urlList = buildUrls()
  const body = {
    host: HOST,
    key: KEY,
    keyLocation: `${SITE_ORIGIN}/${KEY}.txt`,
    urlList,
  }
  try {
    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(body),
    })
    // 200 OK / 202 Accepted = éxito. Otros códigos se registran sin romper deploy.
    if (res.ok) {
      console.log(`✓ IndexNow notificado: ${urlList.length} URLs (HTTP ${res.status})`)
    } else {
      const text = await res.text().catch(() => '')
      console.warn(`⚠ IndexNow respondió HTTP ${res.status}: ${text.slice(0, 200)}`)
    }
  } catch (err) {
    console.warn(`⚠ IndexNow no pudo notificar (ignorado): ${err.message}`)
  }
}

main()
