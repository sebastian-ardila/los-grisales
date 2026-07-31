/**
 * Deja una sola etiqueta SEO de cada tipo en el `<head>` prerenderizado.
 *
 * `index.html` trae un juego estático de title, description, Open Graph y
 * Twitter Card marcado con `data-seo-fallback`: sirve mientras la SPA no ha
 * montado y para rutas sin prerender. Cuando la página define la suya vía
 * react-helmet-async, ambas conviven en el HTML final y qué etiqueta usa cada
 * crawler deja de ser predecible. Aquí se borra el respaldo de toda clave que
 * la página ya cubre.
 *
 * No se puede distinguir por posición: Helmet inserta su `<title>` antes que
 * el del template pero sus `<meta>` después.
 *
 * Se ejecuta dentro del navegador vía `page.evaluate`, así que no puede
 * depender de closures, imports ni variables externas.
 *
 * @returns {number} etiquetas eliminadas
 */
export function dedupeHead() {
  const IMAGEN_GENERICA = 'og-image.jpg'
  // Describen la imagen del template; si la página aporta la suya, mienten.
  const VARIANTES_IMAGEN = [
    'og:image:secure_url',
    'og:image:type',
    'og:image:width',
    'og:image:height',
    'og:image:alt',
    'twitter:image:alt',
  ]

  const claveDe = (el) => {
    const etiqueta = el.tagName.toLowerCase()
    if (etiqueta === 'title') return 'title'
    if (etiqueta === 'meta') {
      const nombre = el.getAttribute('name') || el.getAttribute('property')
      return nombre ? `meta:${nombre}` : null
    }
    return null
  }

  const head = document.head
  const todas = Array.from(head.querySelectorAll('title, meta'))

  // Claves que la página aporta por su cuenta (todo lo que no es respaldo).
  const propias = new Set()
  for (const el of todas) {
    if (el.hasAttribute('data-seo-fallback')) continue
    const clave = claveDe(el)
    if (clave) propias.add(clave)
  }

  let eliminadas = 0
  for (const el of todas) {
    if (!el.hasAttribute('data-seo-fallback')) continue
    const clave = claveDe(el)
    if (clave && propias.has(clave)) {
      el.remove()
      eliminadas++
    }
  }

  // Las variantes de og:image solo son coherentes con la imagen del template.
  const ogImage = head.querySelector('meta[property="og:image"]')
  const propia = ogImage && !(ogImage.getAttribute('content') || '').includes(IMAGEN_GENERICA)
  if (propia) {
    for (const nombre of VARIANTES_IMAGEN) {
      const el = head.querySelector(`meta[property="${nombre}"], meta[name="${nombre}"]`)
      if (el) {
        el.remove()
        eliminadas++
      }
    }
  }

  return eliminadas
}
