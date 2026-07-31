# Hero con novedades curadas desde el blog — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Que las cuatro tarjetas de novedades del hero sean resúmenes de publicaciones del blog — por defecto las más recientes, curables desde el frontmatter — y publicar dos posts nuevos que ocupen las dos primeras posiciones.

**Architecture:** Se añaden cuatro campos opcionales al frontmatter (`hero`, `heroEyebrow`, `heroTitle`, `heroExcerpt`), escritos en el idioma de cada archivo. `MarkdownSource` expone `getHeroPosts(lang, limit)`, que antepone los posts marcados en orden y rellena con los más recientes. `HeroSection` elimina su array `NOTICES` y consume ese método.

**Tech Stack:** React 19 + TypeScript, Vite, react-i18next, react-router-dom, Vitest + Testing Library, contenido en Markdown con frontmatter cargado por `import.meta.glob`.

## Global Constraints

- Todo post existe en los tres idiomas: `es.md`, `en.md`, `fr.md` en la misma carpeta. Un post sin sus tres archivos desaparece de los idiomas faltantes.
- `description` de cada post: máximo 160 caracteres (lo verifica `content.test.ts`).
- `coverAlt` no vacío y cuerpo del post de más de 500 caracteres (lo verifica `content.test.ts`).
- Los slugs son localizados y distintos por idioma; `id` (nombre de carpeta) es el mismo en los tres.
- Comentarios de código en español, como el resto del repositorio.
- Las portadas viven en `public/blog/<id>/cover.webp` y se referencian como `/blog/<id>/cover.webp`.
- Los posts que aparecen en el hero llevan el tag `novedades`, porque el enlace "Ver todas las novedades" filtra por `?cat=novedades`.
- Ortografía completa con tildes y signos de apertura en español; acentos y cedillas en francés.

---

### Task 1: Campos `hero*` en el frontmatter

**Files:**
- Modify: `src/lib/blog/types.ts`
- Modify: `src/lib/blog/MarkdownSource.ts`
- Test: `src/lib/blog/MarkdownSource.test.ts`

**Interfaces:**
- Consumes: nada.
- Produces: `BlogMeta.hero?: number`, `BlogMeta.heroEyebrow?: string`, `BlogMeta.heroTitle?: string`, `BlogMeta.heroExcerpt?: string`. La Task 2 los lee para ordenar; la Task 3 los lee para pintar la tarjeta.

- [ ] **Step 1: Escribir el test que falla**

En `src/lib/blog/MarkdownSource.test.ts`, añadir al final del archivo:

```ts
describe('campos hero del frontmatter', () => {
  const heroFiles: Record<string, string> = {
    '/src/content/blog/marcado/es.md':
      `---\nslug: marcado-es\ntitle: Marcado\ndescription: d\nexcerpt: Excerpt largo\nkeywords: [k]\ndate: 2026-06-01\nauthor: A\ncover: /c.jpg\ncoverAlt: alt\ntags: [t]\nhero: 2\nheroEyebrow: Evento\nheroTitle: Corto\nheroExcerpt: Una línea\n---\nCuerpo.`,
    '/src/content/blog/simple/es.md':
      `---\nslug: simple-es\ntitle: Simple\ndescription: d\nexcerpt: e\nkeywords: [k]\ndate: 2026-06-02\nauthor: A\ncover: /c.jpg\ncoverAlt: alt\ntags: [t]\n---\nCuerpo.`,
    '/src/content/blog/invalido/es.md':
      `---\nslug: invalido-es\ntitle: Inválido\ndescription: d\nexcerpt: e\nkeywords: [k]\ndate: 2026-06-03\nauthor: A\ncover: /c.jpg\ncoverAlt: alt\ntags: [t]\nhero: cero\n---\nCuerpo.`,
  }
  const heroSrc = new MarkdownSource(heroFiles)

  it('lee hero, heroEyebrow, heroTitle y heroExcerpt', () => {
    const post = heroSrc.getPost('es', 'marcado-es')!
    expect(post.hero).toBe(2)
    expect(post.heroEyebrow).toBe('Evento')
    expect(post.heroTitle).toBe('Corto')
    expect(post.heroExcerpt).toBe('Una línea')
  })

  it('deja los campos hero indefinidos cuando no están en el frontmatter', () => {
    const post = heroSrc.getPost('es', 'simple-es')!
    expect(post.hero).toBeUndefined()
    expect(post.heroEyebrow).toBeUndefined()
    expect(post.heroTitle).toBeUndefined()
    expect(post.heroExcerpt).toBeUndefined()
  })

  it('ignora un hero que no sea entero >= 1', () => {
    expect(heroSrc.getPost('es', 'invalido-es')!.hero).toBeUndefined()
  })
})
```

- [ ] **Step 2: Ejecutar el test y verificar que falla**

Run: `npx vitest run src/lib/blog/MarkdownSource.test.ts`
Expected: FAIL — `post.hero` es `undefined` en el primer test (los campos aún no se parsean).

- [ ] **Step 3: Añadir los campos al tipo**

En `src/lib/blog/types.ts`, dentro de `interface BlogMeta`, justo antes de la línea `relatedSede?: SedeRef`:

```ts
  /** Posición fija en el hero (1..4). Ausente = el post no está fijado. */
  hero?: number
  /** Etiqueta corta de la tarjeta del hero, en el idioma del archivo. */
  heroEyebrow?: string
  /** Título corto para la tarjeta del hero. Fallback: `title`. */
  heroTitle?: string
  /** Descripción de una línea para la tarjeta del hero. Fallback: `excerpt`. */
  heroExcerpt?: string
```

- [ ] **Step 4: Parsear los campos**

En `src/lib/blog/MarkdownSource.ts`, añadir esta función junto a `toStringArray` (antes de `toIsoDate`):

```ts
/**
 * Normaliza `hero` del frontmatter a un entero >= 1. Cualquier otro valor
 * (ausente, texto, 0, negativo) deja el post sin fijar en el hero.
 */
function toHeroOrder(value: unknown): number | undefined {
  if (value == null || value === '') return undefined
  const n = Number(value)
  return Number.isInteger(n) && n >= 1 ? n : undefined
}
```

Y dentro del objeto `meta`, justo antes de `relatedSede:`:

```ts
          hero: toHeroOrder(a.hero),
          heroEyebrow: a.heroEyebrow ? String(a.heroEyebrow) : undefined,
          heroTitle: a.heroTitle ? String(a.heroTitle) : undefined,
          heroExcerpt: a.heroExcerpt ? String(a.heroExcerpt) : undefined,
```

- [ ] **Step 5: Ejecutar los tests y verificar que pasan**

Run: `npx vitest run src/lib/blog/MarkdownSource.test.ts`
Expected: PASS — los 12 tests del archivo.

- [ ] **Step 6: Commit**

```bash
git add src/lib/blog/types.ts src/lib/blog/MarkdownSource.ts src/lib/blog/MarkdownSource.test.ts
git commit -m "feat(blog): campos hero, heroEyebrow, heroTitle y heroExcerpt en el frontmatter"
```

---

### Task 2: `getHeroPosts` en la fuente de contenido

**Files:**
- Modify: `src/lib/blog/types.ts`
- Modify: `src/lib/blog/MarkdownSource.ts`
- Test: `src/lib/blog/MarkdownSource.test.ts`

**Interfaces:**
- Consumes: `BlogMeta.hero` de la Task 1.
- Produces: `ContentSource.getHeroPosts(lang: Lang, limit?: number): BlogListItem[]`, con `limit` por defecto 4. La Task 3 lo llama como `blog.getHeroPosts(lang)`.

- [ ] **Step 1: Escribir el test que falla**

En `src/lib/blog/MarkdownSource.test.ts`, añadir al final:

```ts
describe('getHeroPosts', () => {
  /** Crea un post de un solo idioma (es) con fecha y hero opcionales. */
  function heroDoc(slug: string, date: string, hero?: number) {
    const heroLine = hero === undefined ? '' : `hero: ${hero}\n`
    return `---\nslug: ${slug}\ntitle: T ${slug}\ndescription: d\nexcerpt: e\nkeywords: [k]\ndate: ${date}\nauthor: A\ncover: /c.jpg\ncoverAlt: alt\ntags: [t]\n${heroLine}---\nCuerpo.`
  }

  it('antepone los marcados en orden y rellena con los más recientes', () => {
    const src = new MarkdownSource({
      '/src/content/blog/a/es.md': heroDoc('a', '2026-01-01', 2),
      '/src/content/blog/b/es.md': heroDoc('b', '2026-01-02', 1),
      '/src/content/blog/c/es.md': heroDoc('c', '2026-05-01'),
      '/src/content/blog/d/es.md': heroDoc('d', '2026-04-01'),
      '/src/content/blog/e/es.md': heroDoc('e', '2026-03-01'),
    })
    expect(src.getHeroPosts('es').map((p) => p.slug)).toEqual(['b', 'a', 'c', 'd'])
  })

  it('sin marcados devuelve las publicaciones más recientes', () => {
    const src = new MarkdownSource({
      '/src/content/blog/a/es.md': heroDoc('a', '2026-01-01'),
      '/src/content/blog/b/es.md': heroDoc('b', '2026-02-01'),
      '/src/content/blog/c/es.md': heroDoc('c', '2026-03-01'),
      '/src/content/blog/d/es.md': heroDoc('d', '2026-04-01'),
      '/src/content/blog/e/es.md': heroDoc('e', '2026-05-01'),
    })
    expect(src.getHeroPosts('es').map((p) => p.slug)).toEqual(['e', 'd', 'c', 'b'])
  })

  it('respeta el límite y no repite un post marcado', () => {
    const src = new MarkdownSource({
      '/src/content/blog/a/es.md': heroDoc('a', '2026-05-01', 1),
      '/src/content/blog/b/es.md': heroDoc('b', '2026-04-01'),
    })
    expect(src.getHeroPosts('es', 2).map((p) => p.slug)).toEqual(['a', 'b'])
    expect(src.getHeroPosts('es', 1).map((p) => p.slug)).toEqual(['a'])
  })

  it('desempata dos posts con el mismo hero por fecha descendente', () => {
    const src = new MarkdownSource({
      '/src/content/blog/a/es.md': heroDoc('a', '2026-01-01', 1),
      '/src/content/blog/b/es.md': heroDoc('b', '2026-02-01', 1),
    })
    expect(src.getHeroPosts('es').map((p) => p.slug)).toEqual(['b', 'a'])
  })
})
```

- [ ] **Step 2: Ejecutar el test y verificar que falla**

Run: `npx vitest run src/lib/blog/MarkdownSource.test.ts`
Expected: FAIL — `src.getHeroPosts is not a function`.

- [ ] **Step 3: Declarar el método en la interfaz**

En `src/lib/blog/types.ts`, dentro de `interface ContentSource`, después de `getAllPosts`:

```ts
  /** Posts para el hero: los marcados con `hero` en orden, completados con
   *  los más recientes hasta `limit`. */
  getHeroPosts(lang: Lang, limit?: number): BlogListItem[]
```

- [ ] **Step 4: Implementar el método**

En `src/lib/blog/MarkdownSource.ts`, justo después de `getAllPosts`:

```ts
  getHeroPosts(lang: Lang, limit = 4): BlogListItem[] {
    // getAllPosts ya viene ordenado por fecha descendente; `sort` es estable,
    // así que dos posts con el mismo `hero` conservan ese orden.
    const all = this.getAllPosts(lang)
    const pinned = all
      .filter((p) => p.hero !== undefined)
      .sort((a, b) => (a.hero as number) - (b.hero as number))
    const rest = all.filter((p) => p.hero === undefined)
    return [...pinned, ...rest].slice(0, limit)
  }
```

- [ ] **Step 5: Ejecutar los tests y verificar que pasan**

Run: `npx vitest run src/lib/blog/MarkdownSource.test.ts`
Expected: PASS — 16 tests.

- [ ] **Step 6: Commit**

```bash
git add src/lib/blog/types.ts src/lib/blog/MarkdownSource.ts src/lib/blog/MarkdownSource.test.ts
git commit -m "feat(blog): getHeroPosts con curación por frontmatter y relleno por fecha"
```

---

### Task 3: `HeroSection` consume el blog

**Files:**
- Modify: `src/components/home/HeroSection.tsx:1-98` (elimina `NOTICES` y el mapeo actual)
- Test: `src/components/home/HeroSection.test.tsx` (crear)

**Interfaces:**
- Consumes: `blog.getHeroPosts(lang)` de la Task 2.
- Produces: nada para tareas posteriores.

- [ ] **Step 1: Escribir el test que falla**

Crear `src/components/home/HeroSection.test.tsx`. El test no renderiza `HeroSection` completo (arrastra vídeo, i18n y partners): verifica el contrato que el hero consume, que es donde vive la lógica.

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import HeroNoticeCard from './HeroNoticeCard'
import { MarkdownSource } from '../../lib/blog/MarkdownSource'

const files: Record<string, string> = {
  '/src/content/blog/uno/es.md':
    `---\nslug: uno-es\ntitle: "Título largo con cola de SEO"\ndescription: d\nexcerpt: Excerpt largo del post\nkeywords: [k]\ndate: 2026-07-01\nauthor: A\ncover: /blog/uno/cover.webp\ncoverAlt: alt\ntags: [novedades]\nhero: 1\nheroEyebrow: Evento\nheroTitle: Título corto\nheroExcerpt: Una línea\n---\nCuerpo.`,
  '/src/content/blog/dos/es.md':
    `---\nslug: dos-es\ntitle: Segundo\ndescription: d\nexcerpt: Excerpt del segundo\nkeywords: [k]\ndate: 2026-06-01\nauthor: A\ncover: /blog/dos/cover.webp\ncoverAlt: alt\ntags: [novedades]\n---\nCuerpo.`,
}

describe('tarjetas del hero desde el blog', () => {
  const src = new MarkdownSource(files)

  it('usa heroTitle y heroExcerpt cuando existen', () => {
    const post = src.getHeroPosts('es')[0]
    render(
      <MemoryRouter>
        <HeroNoticeCard
          lang="es"
          href={`/es/blog/${post.slug}`}
          eyebrow={post.heroEyebrow}
          title={post.heroTitle ?? post.title}
          description={post.heroExcerpt ?? post.excerpt}
          date={post.date}
        />
      </MemoryRouter>,
    )
    expect(screen.getByRole('link', { name: /título corto/i })).toHaveAttribute(
      'href',
      '/es/blog/uno-es',
    )
    expect(screen.getByText('Una línea')).toBeInTheDocument()
  })

  it('cae a title y excerpt del post cuando no hay override', () => {
    const post = src.getHeroPosts('es')[1]
    expect(post.heroTitle ?? post.title).toBe('Segundo')
    expect(post.heroExcerpt ?? post.excerpt).toBe('Excerpt del segundo')
    expect(post.heroEyebrow).toBeUndefined()
  })

  it('la portada del post se resuelve sin duplicar la barra inicial', () => {
    const post = src.getHeroPosts('es')[0]
    expect(`/${post.cover.replace(/^\//, '')}`).toBe('/blog/uno/cover.webp')
  })
})
```

- [ ] **Step 2: Ejecutar el test y verificar que falla**

Run: `npx vitest run src/components/home/HeroSection.test.tsx`
Expected: FAIL — el primer test falla porque `HeroNoticeCard` aún no recibe estos datos... si pasara ya en verde, es porque solo ejercita código existente; en ese caso continuar igualmente al Step 3, que es donde cambia `HeroSection`.

- [ ] **Step 3: Reemplazar `NOTICES` por el blog**

En `src/components/home/HeroSection.tsx`, borrar por completo el bloque de las líneas 14 a 69 (`type Localized`, `interface Notice` y la constante `NOTICES`).

Después, sustituir el bloque `const cards = NOTICES.map(...)` (líneas 86-98) por:

```tsx
  // Las tarjetas salen del blog: los posts marcados con `hero` en su
  // frontmatter y, si faltan, las publicaciones más recientes.
  const cards = blog.getHeroPosts(lang).map((post) => ({
    key: post.id,
    href: `/${lang}/blog/${post.slug}`,
    eyebrow: post.heroEyebrow,
    title: post.heroTitle ?? post.title,
    description: post.heroExcerpt ?? post.excerpt,
    date: post.date,
    image: post.cover
      ? `${import.meta.env.BASE_URL}${post.cover.replace(/^\//, '')}`
      : undefined,
  }))
```

Borrar también la línea `const posts = blog.getAllPosts(lang)` (línea 79), que queda sin uso.

- [ ] **Step 4: Ejecutar tests y typecheck**

Run: `npx vitest run src/components/home && npx tsc -p tsconfig.app.json --noEmit`
Expected: PASS en ambos, sin errores de tipos ni variables sin usar.

- [ ] **Step 5: Commit**

```bash
git add src/components/home/HeroSection.tsx src/components/home/HeroSection.test.tsx
git commit -m "refactor(hero): las novedades salen del blog en vez de un array local"
```

---

### Task 4: Portadas optimizadas de los dos posts nuevos

**Files:**
- Create: `public/blog/coffee-tour-experience/cover.webp` (desde `public/blog/coffee-tour/coffeetour1.webp`, 2,6 MB)
- Create: `public/blog/fiestas-cosecha/cover.webp` (desde `public/blog/fiestas-cosecha/fiestas-cosecha.png`, 2,0 MB)

**Interfaces:**
- Consumes: nada.
- Produces: las rutas `/blog/coffee-tour-experience/cover.webp` y `/blog/fiestas-cosecha/cover.webp` que usan las Tasks 5 y 6 en su frontmatter `cover`.

- [ ] **Step 1: Convertir la portada del Coffee Tour**

`cwebp` no lee WebP de entrada, así que primero se pasa por PNG con `sips`:

```bash
mkdir -p public/blog/coffee-tour-experience
sips -s format png public/blog/coffee-tour/coffeetour1.webp \
  --out /tmp/coffeetour1.png
cwebp -q 82 -resize 1600 0 /tmp/coffeetour1.png \
  -o public/blog/coffee-tour-experience/cover.webp
```

- [ ] **Step 2: Convertir la portada de las Fiestas de la Cosecha**

```bash
cwebp -q 82 -resize 1600 0 public/blog/fiestas-cosecha/fiestas-cosecha.png \
  -o public/blog/fiestas-cosecha/cover.webp
```

- [ ] **Step 3: Verificar tamaño y dimensiones**

```bash
ls -lh public/blog/coffee-tour-experience/cover.webp public/blog/fiestas-cosecha/cover.webp
sips -g pixelWidth -g pixelHeight public/blog/coffee-tour-experience/cover.webp public/blog/fiestas-cosecha/cover.webp
```

Expected: cada archivo por debajo de 300 KB y 1600 px de ancho. Si alguno supera 300 KB, repetir con `-q 75`.

- [ ] **Step 4: Commit**

```bash
git add public/blog/coffee-tour-experience/cover.webp public/blog/fiestas-cosecha/cover.webp
git commit -m "chore(blog): portadas optimizadas para Coffee Tour Experience y Fiestas de la Cosecha"
```

---

### Task 5: Post `coffee-tour-experience` en tres idiomas

**Files:**
- Create: `src/content/blog/coffee-tour-experience/en.md`
- Create: `src/content/blog/coffee-tour-experience/es.md`
- Create: `src/content/blog/coffee-tour-experience/fr.md`
- Test: `src/lib/blog/content.test.ts`

**Interfaces:**
- Consumes: la portada de la Task 4.
- Produces: el post con `hero: 1`, que la Task 7 verifica en la primera posición del hero. Slugs: `coffee-tour-experience` (en), `experiencia-coffee-tour` (es), `experience-coffee-tour` (fr).

- [ ] **Step 1: Actualizar el test de contenido para que falle**

En `src/lib/blog/content.test.ts`, añadir el slug nuevo al final de cada array de `EXPECTED`:

- `es`: `'experiencia-coffee-tour'`
- `en`: `'coffee-tour-experience'`
- `fr`: `'experience-coffee-tour'`

Y cambiar el nombre de los tres tests `hay 9 posts con los slugs esperados` por `hay 10 posts con los slugs esperados`.

- [ ] **Step 2: Ejecutar el test y verificar que falla**

Run: `npx vitest run src/lib/blog/content.test.ts`
Expected: FAIL — los arrays de slugs no coinciden, faltan los tres nuevos.

- [ ] **Step 3: Crear el archivo en inglés (versión canónica)**

Crear `src/content/blog/coffee-tour-experience/en.md`:

```markdown
---
slug: coffee-tour-experience
title: "Coffee Tour Experience: Colombian Specialty Coffee at Its Origin"
description: "Discover Colombian specialty coffee at its origin with an authentic coffee farm experience in Pereira, Colombia."
excerpt: "Walk the plantations, follow the process from seed to cup and taste specialty coffee where it all begins."
keywords: ["coffee tour colombia", "specialty coffee experience", "coffee farm tour", "coffee tasting", "things to do in pereira", "coffee region colombia"]
date: 2026-07-31
updated: 2026-07-31
author: "Café Los Grisales"
cover: /blog/coffee-tour-experience/cover.webp
coverAlt: "Coffee plantation at the Café Los Grisales farm near Pereira during the Coffee Tour Experience"
tags: ["novedades", "Coffee Tour", "Pereira"]
hero: 1
heroEyebrow: "Experience"
heroTitle: "Coffee Tour Experience"
heroExcerpt: "Colombian specialty coffee, from seed to cup"
relatedSede: coffee-tour
faq: []
---

## Discover the origin of Colombian Specialty Coffee

If you're looking for an authentic Coffee Tour in Colombia, Café Los Grisales invites you to experience the journey of specialty coffee from seed to cup in the heart of the Coffee Region of Colombia.

Located near Pereira, our coffee farm offers a unique opportunity to walk through the coffee plantations, learn about sustainable coffee production, harvest coffee cherries, discover every stage of the process and enjoy a guided specialty coffee tasting.

Whether you're a coffee lover, a traveler exploring the Coffee Triangle or simply looking for one of the best things to do in Pereira, our Coffee Tour combines nature, local culture and exceptional coffee in a single experience.

**Perfect for travelers looking for:**

- Coffee Tour Colombia
- Specialty Coffee Experience
- Coffee Farm Tour
- Coffee Tasting
- Coffee Plantation Visit
- Things to do in Pereira
- Coffee Region Colombia

Reserve your Coffee Tour and experience Colombian coffee where it all begins.
```

- [ ] **Step 4: Crear el archivo en español**

Crear `src/content/blog/coffee-tour-experience/es.md` con este frontmatter y el cuerpo traducido fielmente del inglés, conservando el encabezado `##`, los cuatro párrafos, la lista de siete elementos y la frase de cierre:

```markdown
---
slug: experiencia-coffee-tour
title: "Coffee Tour Experience: el café de especialidad colombiano en su origen"
description: "Descubre el café de especialidad colombiano en su origen con una experiencia auténtica de finca cafetera en Pereira, Colombia."
excerpt: "Recorre los cafetales, sigue el proceso de la semilla a la taza y cata café de especialidad donde todo empieza."
keywords: ["coffee tour colombia", "experiencia café de especialidad", "tour finca cafetera", "cata de café", "qué hacer en pereira", "eje cafetero"]
date: 2026-07-31
updated: 2026-07-31
author: "Café Los Grisales"
cover: /blog/coffee-tour-experience/cover.webp
coverAlt: "Cafetales de la finca de Café Los Grisales cerca de Pereira durante el Coffee Tour Experience"
tags: ["novedades", "Coffee Tour", "Pereira"]
hero: 1
heroEyebrow: "Experiencia"
heroTitle: "Coffee Tour Experience"
heroExcerpt: "Café de especialidad colombiano, de la semilla a la taza"
relatedSede: coffee-tour
faq: []
---
```

La lista traducida mantiene las siete entradas como términos de búsqueda naturales en español: Coffee Tour Colombia, experiencia de café de especialidad, tour por finca cafetera, cata de café, visita a los cafetales, qué hacer en Pereira, Eje Cafetero colombiano.

- [ ] **Step 5: Crear el archivo en francés**

Crear `src/content/blog/coffee-tour-experience/fr.md` con este frontmatter y el mismo cuerpo traducido al francés, con idéntica estructura:

```markdown
---
slug: experience-coffee-tour
title: "Coffee Tour Experience : le café de spécialité colombien à son origine"
description: "Découvrez le café de spécialité colombien à son origine avec une expérience authentique à la ferme, à Pereira, en Colombie."
excerpt: "Parcourez les plantations, suivez le processus de la graine à la tasse et dégustez un café de spécialité là où tout commence."
keywords: ["coffee tour colombie", "expérience café de spécialité", "visite ferme de café", "dégustation de café", "que faire à pereira", "région du café colombie"]
date: 2026-07-31
updated: 2026-07-31
author: "Café Los Grisales"
cover: /blog/coffee-tour-experience/cover.webp
coverAlt: "Plantations de café de la ferme Café Los Grisales près de Pereira pendant le Coffee Tour Experience"
tags: ["novedades", "Coffee Tour", "Pereira"]
hero: 1
heroEyebrow: "Expérience"
heroTitle: "Coffee Tour Experience"
heroExcerpt: "Le café de spécialité colombien, de la graine à la tasse"
relatedSede: coffee-tour
faq: []
---
```

- [ ] **Step 6: Ejecutar los tests y verificar que pasan**

Run: `npx vitest run src/lib/blog/content.test.ts`
Expected: PASS — 10 posts por idioma, cada `description` de 160 caracteres o menos y cada cuerpo de más de 500 caracteres.

- [ ] **Step 7: Commit**

```bash
git add src/content/blog/coffee-tour-experience src/lib/blog/content.test.ts
git commit -m "contenido(blog): Coffee Tour Experience en es, en y fr"
```

---

### Task 6: Post `fiestas-cosecha` en tres idiomas

**Files:**
- Create: `src/content/blog/fiestas-cosecha/es.md`
- Create: `src/content/blog/fiestas-cosecha/en.md`
- Create: `src/content/blog/fiestas-cosecha/fr.md`
- Test: `src/lib/blog/content.test.ts`

**Interfaces:**
- Consumes: la portada de la Task 4.
- Produces: el post con `hero: 2`, que la Task 7 verifica en la segunda posición del hero. Slugs: `que-hacer-en-pereira-fiestas-de-la-cosecha` (es), `what-to-do-in-pereira-harvest-festival` (en), `que-faire-a-pereira-fetes-de-la-recolte` (fr).

- [ ] **Step 1: Actualizar el test de contenido para que falle**

En `src/lib/blog/content.test.ts`, añadir al final de cada array de `EXPECTED`:

- `es`: `'que-hacer-en-pereira-fiestas-de-la-cosecha'`
- `en`: `'what-to-do-in-pereira-harvest-festival'`
- `fr`: `'que-faire-a-pereira-fetes-de-la-recolte'`

Y cambiar el nombre de los tres tests a `hay 11 posts con los slugs esperados`.

- [ ] **Step 2: Ejecutar el test y verificar que falla**

Run: `npx vitest run src/lib/blog/content.test.ts`
Expected: FAIL — faltan los tres slugs nuevos.

- [ ] **Step 3: Crear el archivo en español (versión canónica)**

Crear `src/content/blog/fiestas-cosecha/es.md`:

```markdown
---
slug: que-hacer-en-pereira-fiestas-de-la-cosecha
title: "¿Qué hacer en Pereira durante las Fiestas de la Cosecha?"
description: "Descubre un plan diferente entre café de especialidad, gastronomía y experiencias cafeteras en el corazón del Eje Cafetero."
excerpt: "Un plan diferente para las Fiestas de la Cosecha 2026: café de especialidad, gastronomía y Coffee Tour."
keywords: ["fiestas de la cosecha 2026", "qué hacer en pereira", "fiestas de la cosecha pereira", "café de especialidad pereira", "eje cafetero"]
date: 2026-07-31
updated: 2026-07-31
author: "Café Los Grisales"
cover: /blog/fiestas-cosecha/cover.webp
coverAlt: "Celebración de las Fiestas de la Cosecha en Pereira con café de especialidad de Café Los Grisales"
tags: ["novedades", "eventos", "Pereira"]
hero: 2
heroEyebrow: "Eventos"
heroTitle: "Fiestas de la Cosecha"
heroExcerpt: "Qué hacer en Pereira entre café, gastronomía y cafetales"
relatedSede: unicentro
faq: []
---

## Vive las Fiestas de la Cosecha 2026 con aroma a café

Las Fiestas de la Cosecha 2026 son uno de los momentos más especiales para visitar Pereira. Durante esta temporada, la ciudad se llena de actividades culturales, música, gastronomía y experiencias que celebran la identidad de nuestra región.

Si estás buscando qué hacer en Pereira durante esta época, incluye en tu recorrido una experiencia alrededor del café de especialidad, uno de los mayores orgullos del Eje Cafetero.

En Café Los Grisales podrás disfrutar bebidas preparadas con café cultivado en nuestra propia finca, conocer nuevas formas de preparar y degustar el café, compartir una propuesta gastronómica diseñada para acompañar cada taza y descubrir por qué el café colombiano es reconocido en todo el mundo.

Y si deseas vivir una experiencia aún más completa, te invitamos a nuestro Coffee Tour, donde recorrerás los cafetales, conocerás el proceso del café desde la semilla hasta la taza y disfrutarás de un recorrido auténtico por la cultura cafetera.

**📍 Visítanos en:**

- **CC Unicentro Pereira** — Nivel B, plazoleta de comidas.
- **CC Pereira Plaza** — Local 209.
```

- [ ] **Step 4: Crear el archivo en inglés**

Crear `src/content/blog/fiestas-cosecha/en.md` con este frontmatter y el cuerpo traducido fielmente del español, conservando el encabezado `##`, los cuatro párrafos, el bloque `**📍 Visit us at:**` y las dos sedes:

```markdown
---
slug: what-to-do-in-pereira-harvest-festival
title: "What to Do in Pereira During the Harvest Festival?"
description: "Discover a different plan among specialty coffee, food and coffee experiences in the heart of Colombia's Coffee Region."
excerpt: "A different plan for the 2026 Harvest Festival: specialty coffee, food and our Coffee Tour."
keywords: ["harvest festival 2026", "what to do in pereira", "fiestas de la cosecha pereira", "specialty coffee pereira", "coffee region colombia"]
date: 2026-07-31
updated: 2026-07-31
author: "Café Los Grisales"
cover: /blog/fiestas-cosecha/cover.webp
coverAlt: "Harvest Festival celebration in Pereira with specialty coffee from Café Los Grisales"
tags: ["novedades", "eventos", "Pereira"]
hero: 2
heroEyebrow: "Events"
heroTitle: "Harvest Festival"
heroExcerpt: "What to do in Pereira between coffee, food and plantations"
relatedSede: unicentro
faq: []
---
```

Al traducir, mantener el nombre propio del evento como "Fiestas de la Cosecha (Harvest Festival)" en la primera mención.

- [ ] **Step 5: Crear el archivo en francés**

Crear `src/content/blog/fiestas-cosecha/fr.md` con este frontmatter y el mismo cuerpo traducido al francés, con idéntica estructura y el bloque `**📍 Retrouvez-nous à :**`:

```markdown
---
slug: que-faire-a-pereira-fetes-de-la-recolte
title: "Que faire à Pereira pendant les Fêtes de la Récolte ?"
description: "Découvrez un plan différent entre café de spécialité, gastronomie et expériences caféières au cœur de la région du café."
excerpt: "Un plan différent pour les Fêtes de la Récolte 2026 : café de spécialité, gastronomie et Coffee Tour."
keywords: ["fêtes de la récolte 2026", "que faire à pereira", "fiestas de la cosecha pereira", "café de spécialité pereira", "région du café colombie"]
date: 2026-07-31
updated: 2026-07-31
author: "Café Los Grisales"
cover: /blog/fiestas-cosecha/cover.webp
coverAlt: "Célébration des Fêtes de la Récolte à Pereira avec le café de spécialité de Café Los Grisales"
tags: ["novedades", "eventos", "Pereira"]
hero: 2
heroEyebrow: "Événements"
heroTitle: "Fêtes de la Récolte"
heroExcerpt: "Que faire à Pereira entre café, gastronomie et plantations"
relatedSede: unicentro
faq: []
---
```

- [ ] **Step 6: Ejecutar los tests y verificar que pasan**

Run: `npx vitest run src/lib/blog/content.test.ts`
Expected: PASS — 11 posts por idioma.

- [ ] **Step 7: Commit**

```bash
git add src/content/blog/fiestas-cosecha src/lib/blog/content.test.ts
git commit -m "contenido(blog): Fiestas de la Cosecha en es, en y fr"
```

---

### Task 7: Curar el hero y verificar el conjunto

**Files:**
- Modify: `src/content/blog/negocios-verdes-carder/{es,en,fr}.md` (añadir campos hero)
- Modify: `src/content/blog/coffee-hour/{es,en,fr}.md` (añadir campos hero)
- Modify: `src/content/blog/zona-mundialista/{es,en,fr}.md` (revertir fecha a 2026-06-25)
- Test: `src/lib/blog/content.test.ts`

**Interfaces:**
- Consumes: `getHeroPosts` (Task 2) y los posts nuevos (Tasks 5 y 6).
- Produces: el hero definitivo.

- [ ] **Step 1: Escribir el test que falla**

En `src/lib/blog/content.test.ts`, añadir al final del archivo:

```ts
describe('hero curado desde el contenido', () => {
  const ESPERADO = ['coffee-tour-experience', 'fiestas-cosecha', 'negocios-verdes-carder', 'coffee-hour']

  for (const lang of ['es', 'en', 'fr'] as Lang[]) {
    it(`${lang}: el hero muestra los 4 posts marcados en orden`, () => {
      expect(blog.getHeroPosts(lang).map((p) => p.id)).toEqual(ESPERADO)
    })

    it(`${lang}: cada post del hero tiene etiqueta, título corto, resumen y portada`, () => {
      for (const post of blog.getHeroPosts(lang)) {
        expect(post.heroEyebrow, `${post.id} heroEyebrow`).toBeTruthy()
        expect(post.heroTitle, `${post.id} heroTitle`).toBeTruthy()
        expect(post.heroExcerpt!.length, `${post.id} heroExcerpt`).toBeLessThanOrEqual(70)
        expect(post.cover, `${post.id} cover`).toMatch(/^\/blog\/.+\.(webp|svg)$/)
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
```

- [ ] **Step 2: Ejecutar el test y verificar que falla**

Run: `npx vitest run src/lib/blog/content.test.ts`
Expected: FAIL — el hero devuelve `zona-mundialista` en tercera posición (por fecha) en vez de `negocios-verdes-carder`, y la fecha de zona-mundialista es `2026-07-31`.

- [ ] **Step 3: Marcar `negocios-verdes-carder` como tercero**

Añadir al frontmatter de cada archivo, después de la línea `tags:`:

`es.md`:
```yaml
hero: 3
heroEyebrow: "Sostenibilidad"
heroTitle: "Sostenibilidad real"
heroExcerpt: "Somos Negocios Verdes certificados por la CARDER"
```

`en.md`:
```yaml
hero: 3
heroEyebrow: "Sustainability"
heroTitle: "Real sustainability"
heroExcerpt: "We're a CARDER-certified Green Business"
```

`fr.md`:
```yaml
hero: 3
heroEyebrow: "Durabilité"
heroTitle: "Durabilité réelle"
heroExcerpt: "Entreprise Verte certifiée par la CARDER"
```

- [ ] **Step 4: Marcar `coffee-hour` como cuarto**

`es.md`:
```yaml
hero: 4
heroEyebrow: "Promoción"
heroTitle: "Coffee Hour"
heroExcerpt: "Martes y jueves de 4:00 a 7:00 p.m."
```

`en.md`:
```yaml
hero: 4
heroEyebrow: "Deal"
heroTitle: "Coffee Hour"
heroExcerpt: "Tuesday & Thursday, 4:00–7:00 p.m."
```

`fr.md`:
```yaml
hero: 4
heroEyebrow: "Promo"
heroTitle: "Coffee Hour"
heroExcerpt: "Mardi et jeudi, 16h–19h"
```

- [ ] **Step 5: Revertir la fecha de `zona-mundialista`**

En los tres archivos de `src/content/blog/zona-mundialista/`, volver `date` y `updated` a `2026-06-25`:

```bash
for f in src/content/blog/zona-mundialista/{es,en,fr}.md; do
  perl -0pi -e 's/^date: 2026-07-31$/date: 2026-06-25/m; s/^updated: 2026-07-31$/updated: 2026-06-25/m' "$f"
done
grep -n "^date:\|^updated:" src/content/blog/zona-mundialista/*.md
```

Expected: los seis valores en `2026-06-25`.

- [ ] **Step 6: Ejecutar toda la suite y el build**

Run: `npx vitest run && npx tsc -p tsconfig.app.json --noEmit && npm run build`
Expected: todos los tests en verde, sin errores de tipos y build correcto.

- [ ] **Step 7: Commit**

```bash
git add src/content/blog src/lib/blog/content.test.ts
git commit -m "contenido(hero): Coffee Tour Experience y Fiestas de la Cosecha encabezan las novedades"
```

---

## Verificación final

Después de la Task 7, comprobar en el navegador (`npm run dev`):

- El hero muestra, en orden: Coffee Tour Experience, Fiestas de la Cosecha, Sostenibilidad real, Coffee Hour.
- Cada tarjeta enlaza al post correcto en `/es/`, `/en/` y `/fr/`.
- Las portadas nuevas cargan y no se ven pixeladas en la versión de escritorio de la tarjeta.
- El listado del blog muestra 11 publicaciones en cada idioma.
