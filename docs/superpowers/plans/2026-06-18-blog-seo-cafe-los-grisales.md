# Blog SEO — Café Los Grisales — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Añadir una sección Blog en es/en/fr, pre-renderizada a HTML estático, optimizada en SEO/accesibilidad/rendimiento, con 5 artículos reales que posicionen las keywords de Café Los Grisales en Pereira.

**Architecture:** Capa de abstracción de contenido (`ContentSource`) con implementación Markdown actual y swap futuro a CMS. Páginas `/:lang/blog` y `/:lang/blog/:slug` con slugs localizados + hreflang. Pre-render headless post-build (Puppeteer) sin tocar el código de runtime. SEO vía `react-helmet-async` + JSON-LD.

**Tech Stack:** React 19, Vite 8, TypeScript ~6, React Router 7, Tailwind 4, react-helmet-async, react-markdown + remark/rehype, front-matter, Puppeteer, Vitest + @testing-library/react.

## Global Constraints

- Idiomas soportados: `es` (fallback) | `en` | `fr`. Todo artículo existe en los 3.
- Origen del sitio: `https://cafelosgrisales.com` (constante `SITE_ORIGIN`, ya usada en `SEO.tsx` y `generate-sitemap.mjs`).
- Patrón de rutas: `/:lang/<page>`. El blog usa `/:lang/blog` y `/:lang/blog/:slug`.
- TypeScript strict: `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch` activos. Sin variables/imports sin usar.
- Convenciones: componentes `PascalCase.tsx` con `export default`; utils/config `camelCase.ts`; Tailwind inline; sin CSS modules. Paleta: brand `#064947`, accent `#C4A962`, primary `#f5efdf`. Fuentes: `font-display` (Fraunces), `font-script` (Great Vibes).
- El frontmatter de los `.md` es la **única fuente de verdad** de slugs/fechas. App lo lee con `import.meta.glob`; los scripts Node lo leen con `front-matter` desde el filesystem. Nunca duplicar la lista de posts a mano.
- Pre-render: el paso no debe alterar código de runtime ni romper producción si falla en CI.
- Commits frecuentes, en español, terminando con `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`.

---

## File Structure

**Crear:**
- `src/lib/blog/types.ts` — contrato `Lang`, `BlogMeta`, `BlogPost`, `BlogListItem`, `ContentSource`.
- `src/lib/blog/markdown.ts` — parseo de frontmatter + reading time (puro, testeable).
- `src/lib/blog/MarkdownSource.ts` — implementación de `ContentSource` desde un record de archivos crudos.
- `src/lib/blog/index.ts` — instancia activa (`blog`) cableando `import.meta.glob`.
- `src/content/blog/<id>/{es,en,fr}.md` — 5 posts × 3 idiomas (15 archivos).
- `src/pages/BlogListPage.tsx`, `src/pages/BlogPostPage.tsx`.
- `src/components/blog/BlogCard.tsx`, `BlogGrid.tsx`, `ArticleHeader.tsx`, `ArticleBody.tsx`, `ArticleFooter.tsx`, `RelatedPosts.tsx`, `ShareButtons.tsx`.
- `src/components/seo/ArticleJsonLd.tsx`, `src/components/seo/BreadcrumbJsonLd.tsx`.
- `scripts/read-blog.mjs` — lector Node de los `.md` (compartido por prerender y sitemap).
- `scripts/prerender.mjs` — crawler headless post-build.
- `vitest.config.ts`, `src/test/setup.ts`.
- Tests `*.test.ts(x)` junto a cada unidad lógica.

**Modificar:**
- `package.json` — deps + scripts (`test`, `build`).
- `src/App.tsx:22-26` — rutas blog (lazy).
- `src/config/routes.ts` — entrada de navbar para `/blog`.
- `src/components/seo/SEO.tsx` — props `type`, `keywords`, `alternates`, `publishedTime`, `modifiedTime`.
- `src/i18n/es.json`, `en.json`, `fr.json` — strings `nav.blog` y textos del blog.
- `scripts/generate-sitemap.mjs` — incluir blog index + posts (vía `read-blog.mjs`).
- `.github/workflows/deploy.yml` — setup de Chromium + cache de los `index.html` del blog (short-cache).

---

## Article Briefs (Task 6 usa esta tabla)

Cada artículo: 800–1200 palabras, original, tono premium y cercano del sitio. La keyword principal debe aparecer en el `<h1>` (título), en el primer párrafo y en al menos un `<h2>`. Cada artículo enlaza internamente a (a) su sección/sede relacionada del home, (b) el Coffee Tour y (c) al menos 1 artículo relacionado. Imagen de portada con `alt` descriptivo.

| id | Lang | slug | keyword principal | título (h1) | meta description (≤160) | outline (h2) | relatedSede |
|----|------|------|-------------------|-------------|--------------------------|--------------|-------------|
| `cafe-de-especialidad-pereira` | es | `cafe-de-especialidad-pereira` | café de especialidad Pereira | Café de especialidad en Pereira: la propuesta de Café Los Grisales | Descubre el café de especialidad en Pereira de Café Los Grisales: origen propio, procesos y dónde probarlo. | Qué nos hace especialidad · De la finca a la taza · Dónde probarlo en Pereira · Reserva tu Coffee Tour | pereira-plaza |
| `cafe-de-especialidad-pereira` | en | `specialty-coffee-pereira` | specialty coffee Pereira | Specialty coffee in Pereira: the Café Los Grisales experience | Discover specialty coffee in Pereira by Café Los Grisales: single origin, processing and where to taste it. | What makes us specialty · From farm to cup · Where to taste it in Pereira · Book your Coffee Tour | pereira-plaza |
| `cafe-de-especialidad-pereira` | fr | `cafe-de-specialite-pereira` | café de spécialité Pereira | Café de spécialité à Pereira : l'expérience Café Los Grisales | Découvrez le café de spécialité à Pereira par Café Los Grisales : origine, procédés et où le déguster. | Ce qui nous rend spécialité · De la ferme à la tasse · Où le déguster à Pereira · Réservez votre Coffee Tour | pereira-plaza |
| `coffee-tour-eje-cafetero` | es | `coffee-tour-en-pereira` | coffee tour Pereira | Coffee Tour en Pereira: del grano a la taza con Café Los Grisales | Vive nuestro Coffee Tour en Pereira: recorre la finca, conoce el proceso del café y cata del grano a la taza. | Qué incluye el tour · El recorrido paso a paso · Cómo reservar · Café que probarás | coffee-tour |
| `coffee-tour-eje-cafetero` | en | `coffee-tour-in-pereira` | coffee tour Pereira | Coffee Tour in Pereira: from bean to cup with Café Los Grisales | Live our Coffee Tour in Pereira: walk the farm, learn the coffee process and cup from bean to cup. | What the tour includes · The step-by-step route · How to book · The coffee you'll taste | coffee-tour |
| `coffee-tour-eje-cafetero` | fr | `coffee-tour-a-pereira` | coffee tour Pereira | Coffee Tour à Pereira : du grain à la tasse avec Café Los Grisales | Vivez notre Coffee Tour à Pereira : visitez la ferme, découvrez le procédé du café et dégustez du grain à la tasse. | Ce qu'inclut le tour · Le parcours étape par étape · Comment réserver · Le café à déguster | coffee-tour |
| `cafe-unicentro-pereira` | es | `cafe-en-unicentro-pereira` | café Unicentro | Café en Unicentro Pereira: nuestra tienda Café Los Grisales | Café de especialidad en Unicentro Pereira: ubicación, ambiente y qué pedir en nuestra tienda Café Los Grisales. | Dónde estamos en Unicentro · Ambiente de la tienda · Qué pedir · Horarios y cómo llegar | unicentro |
| `cafe-unicentro-pereira` | en | `coffee-at-unicentro-pereira` | coffee Unicentro Pereira | Coffee at Unicentro Pereira: our Café Los Grisales shop | Specialty coffee at Unicentro Pereira: location, atmosphere and what to order at Café Los Grisales. | Where we are in Unicentro · The shop atmosphere · What to order · Hours and how to get there | unicentro |
| `cafe-unicentro-pereira` | fr | `cafe-a-unicentro-pereira` | café Unicentro Pereira | Café à Unicentro Pereira : notre boutique Café Los Grisales | Café de spécialité à Unicentro Pereira : emplacement, ambiance et que commander chez Café Los Grisales. | Où nous trouver à Unicentro · L'ambiance de la boutique · Que commander · Horaires et accès | unicentro |
| `cafe-pereira-plaza` | es | `cafe-en-pereira-plaza` | café Pereira Plaza | Café en Pereira Plaza: tienda y experiencia Café Los Grisales | Café de especialidad en Pereira Plaza: vive la experiencia Café Los Grisales, horarios y recomendaciones. | Nuestra tienda en Pereira Plaza · La experiencia · Recomendaciones de la carta · Horarios y ubicación | pereira-plaza |
| `cafe-pereira-plaza` | en | `coffee-at-pereira-plaza` | coffee Pereira Plaza | Coffee at Pereira Plaza: the Café Los Grisales shop | Specialty coffee at Pereira Plaza: live the Café Los Grisales experience, hours and recommendations. | Our shop at Pereira Plaza · The experience · Menu recommendations · Hours and location | pereira-plaza |
| `cafe-pereira-plaza` | fr | `cafe-a-pereira-plaza` | café Pereira Plaza | Café à Pereira Plaza : la boutique Café Los Grisales | Café de spécialité à Pereira Plaza : vivez l'expérience Café Los Grisales, horaires et recommandations. | Notre boutique à Pereira Plaza · L'expérience · Recommandations de la carte · Horaires et emplacement | pereira-plaza |
| `que-es-cafe-de-especialidad` | es | `que-es-cafe-de-especialidad` | qué es café de especialidad | Qué es el café de especialidad y cómo reconocerlo | Aprende qué es el café de especialidad, cómo se puntúa (SCA) y cómo reconocer una taza de calidad. | Definición y puntaje SCA · Diferencias con el café comercial · Cómo reconocerlo · Pruébalo en Pereira | (ninguno) |
| `que-es-cafe-de-especialidad` | en | `what-is-specialty-coffee` | what is specialty coffee | What is specialty coffee and how to recognize it | Learn what specialty coffee is, how it's scored (SCA) and how to recognize a quality cup. | Definition and SCA score · Differences from commercial coffee · How to recognize it · Taste it in Pereira | (ninguno) |
| `que-es-cafe-de-especialidad` | fr | `quest-ce-que-le-cafe-de-specialite` | qu'est-ce que le café de spécialité | Qu'est-ce que le café de spécialité et comment le reconnaître | Apprenez ce qu'est le café de spécialité, sa notation (SCA) et comment reconnaître une tasse de qualité. | Définition et note SCA · Différences avec le café commercial · Comment le reconnaître · Dégustez-le à Pereira | (ninguno) |

Enlaces internos por idioma (rutas destino): sede/sección → `/:lang` con anchor (`#cafe-bar`, `#tour`, `#especialidad`); Coffee Tour → `/:lang#tour`; artículos relacionados → `/:lang/blog/<slug>`.

---

### Task 1: Tooling — dependencias, Vitest y scripts

**Files:**
- Modify: `package.json`
- Create: `vitest.config.ts`
- Create: `src/test/setup.ts`

**Interfaces:**
- Produces: script `npm test` (Vitest), entorno jsdom con `@testing-library/jest-dom`. Deps disponibles para tareas siguientes: `react-markdown`, `remark-gfm`, `rehype-slug`, `rehype-autolink-headings`, `front-matter`, `puppeteer`.

- [ ] **Step 1: Instalar dependencias de runtime**

Run:
```bash
npm install react-markdown@^9 remark-gfm@^4 rehype-slug@^6 rehype-autolink-headings@^7 front-matter@^4
```

- [ ] **Step 2: Instalar dependencias de desarrollo**

Run:
```bash
npm install -D vitest@^3 jsdom@^25 @testing-library/react@^16 @testing-library/jest-dom@^6 @testing-library/user-event@^14 puppeteer@^24
```

- [ ] **Step 3: Crear `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}', 'scripts/**/*.test.mjs'],
  },
})
```

- [ ] **Step 4: Crear `src/test/setup.ts`**

```ts
import '@testing-library/jest-dom/vitest'
```

- [ ] **Step 5: Añadir script `test` a `package.json`**

En `"scripts"`, añadir tras `"lint"`:
```json
    "test": "vitest run",
```

- [ ] **Step 6: Crear test trivial para verificar el runner**

Create `src/test/smoke.test.ts`:
```ts
import { describe, it, expect } from 'vitest'

describe('vitest', () => {
  it('runs', () => {
    expect(1 + 1).toBe(2)
  })
})
```

- [ ] **Step 7: Ejecutar tests**

Run: `npm test`
Expected: PASS (1 test). 

- [ ] **Step 8: Eliminar el smoke test y commit**

Run:
```bash
rm src/test/smoke.test.ts
git add package.json package-lock.json vitest.config.ts src/test/setup.ts
git commit -m "$(printf 'chore: añade Vitest y dependencias del blog\n\nCo-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>')"
```

---

### Task 2: Tipos y utilidades de Markdown

**Files:**
- Create: `src/lib/blog/types.ts`
- Create: `src/lib/blog/markdown.ts`
- Test: `src/lib/blog/markdown.test.ts`

**Interfaces:**
- Produces:
  - `type Lang = 'es' | 'en' | 'fr'`
  - `interface BlogMeta { id; slug; title; description; excerpt; keywords: string[]; date; updated; author; cover; coverAlt; tags: string[]; relatedSede?: 'pereira-plaza'|'unicentro'|'coffee-tour'; translations: Record<Lang,string> }`
  - `interface BlogPost extends BlogMeta { body: string; readingMinutes: number }`
  - `interface BlogListItem extends BlogMeta { readingMinutes: number }`
  - `interface ContentSource { getAllPosts(lang: Lang): BlogListItem[]; getPost(lang: Lang, slug: string): BlogPost | null; getAllSlugs(): { id: string; lang: Lang; slug: string }[]; getRelated(post: BlogMeta, lang: Lang, limit?: number): BlogListItem[] }`
  - `parseDoc(raw: string): { attributes: Record<string, unknown>; body: string }`
  - `estimateReadingMinutes(text: string): number`

- [ ] **Step 1: Crear `src/lib/blog/types.ts`**

```ts
export type Lang = 'es' | 'en' | 'fr'

export type SedeRef = 'pereira-plaza' | 'unicentro' | 'coffee-tour'

export interface BlogMeta {
  /** Identificador estable del post (carpeta); igual en los 3 idiomas. */
  id: string
  /** Slug localizado para la URL en este idioma. */
  slug: string
  title: string
  description: string
  excerpt: string
  keywords: string[]
  /** ISO date de publicación, p. ej. "2026-06-18". */
  date: string
  /** ISO date de última actualización (lastmod del sitemap). */
  updated: string
  author: string
  cover: string
  coverAlt: string
  tags: string[]
  relatedSede?: SedeRef
  /** id-de-este-post → slug por idioma, para construir hreflang. */
  translations: Record<Lang, string>
}

export interface BlogPost extends BlogMeta {
  /** Markdown crudo del cuerpo (sin frontmatter). */
  body: string
  readingMinutes: number
}

export interface BlogListItem extends BlogMeta {
  readingMinutes: number
}

export interface ContentSource {
  getAllPosts(lang: Lang): BlogListItem[]
  getPost(lang: Lang, slug: string): BlogPost | null
  getAllSlugs(): { id: string; lang: Lang; slug: string }[]
  getRelated(post: BlogMeta, lang: Lang, limit?: number): BlogListItem[]
}
```

- [ ] **Step 2: Escribir el test de `markdown.ts` (falla)**

Create `src/lib/blog/markdown.test.ts`:
```ts
import { describe, it, expect } from 'vitest'
import { parseDoc, estimateReadingMinutes } from './markdown'

describe('parseDoc', () => {
  it('separa frontmatter y cuerpo', () => {
    const raw = `---\ntitle: Hola\nkeywords:\n  - a\n  - b\n---\nCuerpo del texto.`
    const { attributes, body } = parseDoc(raw)
    expect(attributes.title).toBe('Hola')
    expect(attributes.keywords).toEqual(['a', 'b'])
    expect(body.trim()).toBe('Cuerpo del texto.')
  })
})

describe('estimateReadingMinutes', () => {
  it('estima ~200 palabras por minuto, mínimo 1', () => {
    expect(estimateReadingMinutes('una palabra')).toBe(1)
    const words = Array.from({ length: 400 }, () => 'palabra').join(' ')
    expect(estimateReadingMinutes(words)).toBe(2)
  })
})
```

- [ ] **Step 3: Ejecutar test para verificar que falla**

Run: `npm test -- markdown`
Expected: FAIL ("does not provide an export named 'parseDoc'").

- [ ] **Step 4: Implementar `src/lib/blog/markdown.ts`**

```ts
import fm from 'front-matter'

export function parseDoc(raw: string): {
  attributes: Record<string, unknown>
  body: string
} {
  const parsed = fm<Record<string, unknown>>(raw)
  return { attributes: parsed.attributes, body: parsed.body }
}

export function estimateReadingMinutes(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
}
```

- [ ] **Step 5: Ejecutar test para verificar que pasa**

Run: `npm test -- markdown`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/lib/blog/types.ts src/lib/blog/markdown.ts src/lib/blog/markdown.test.ts
git commit -m "$(printf 'feat: tipos del blog y utilidades de markdown\n\nCo-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>')"
```

---

### Task 3: MarkdownSource (implementación de ContentSource)

**Files:**
- Create: `src/lib/blog/MarkdownSource.ts`
- Create: `src/lib/blog/index.ts`
- Test: `src/lib/blog/MarkdownSource.test.ts`

**Interfaces:**
- Consumes: `Lang`, `BlogMeta`, `BlogPost`, `BlogListItem`, `ContentSource`, `SedeRef` (Task 2); `parseDoc`, `estimateReadingMinutes` (Task 2).
- Produces:
  - `class MarkdownSource implements ContentSource` con `constructor(files: Record<string, string>)` donde la clave es la ruta `.../content/blog/<id>/<lang>.md` y el valor el contenido crudo.
  - `export const blog: ContentSource` en `index.ts`.

- [ ] **Step 1: Escribir el test (falla)**

Create `src/lib/blog/MarkdownSource.test.ts`:
```ts
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
})
```

- [ ] **Step 2: Ejecutar test para verificar que falla**

Run: `npm test -- MarkdownSource`
Expected: FAIL ("does not provide an export named 'MarkdownSource'").

- [ ] **Step 3: Implementar `src/lib/blog/MarkdownSource.ts`**

```ts
import type {
  BlogListItem,
  BlogMeta,
  BlogPost,
  ContentSource,
  Lang,
  SedeRef,
} from './types'
import { estimateReadingMinutes, parseDoc } from './markdown'

const LANGS: Lang[] = ['es', 'en', 'fr']
const PATH_RE = /\/content\/blog\/([^/]+)\/(es|en|fr)\.md$/

interface ParsedFile {
  id: string
  lang: Lang
  slug: string
  meta: Omit<BlogMeta, 'translations'>
  body: string
}

function toStringArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.map((v) => String(v))
  if (value == null) return []
  return [String(value)]
}

export class MarkdownSource implements ContentSource {
  private posts: BlogPost[] = []

  constructor(files: Record<string, string>) {
    const parsed: ParsedFile[] = []
    for (const [path, raw] of Object.entries(files)) {
      const match = path.match(PATH_RE)
      if (!match) continue
      const [, id, lang] = match
      const { attributes: a, body } = parseDoc(raw)
      parsed.push({
        id,
        lang: lang as Lang,
        slug: String(a.slug),
        body,
        meta: {
          id,
          slug: String(a.slug),
          title: String(a.title ?? ''),
          description: String(a.description ?? ''),
          excerpt: String(a.excerpt ?? ''),
          keywords: toStringArray(a.keywords),
          date: String(a.date ?? ''),
          updated: String(a.updated ?? a.date ?? ''),
          author: String(a.author ?? 'Café Los Grisales'),
          cover: String(a.cover ?? ''),
          coverAlt: String(a.coverAlt ?? ''),
          tags: toStringArray(a.tags),
          relatedSede: a.relatedSede
            ? (String(a.relatedSede) as SedeRef)
            : undefined,
        },
      })
    }

    // translations: id -> { lang: slug }
    const translations = new Map<string, Record<Lang, string>>()
    for (const id of new Set(parsed.map((p) => p.id))) {
      const entry = {} as Record<Lang, string>
      for (const lang of LANGS) {
        const f = parsed.find((p) => p.id === id && p.lang === lang)
        if (f) entry[lang] = f.slug
      }
      translations.set(id, entry)
    }

    this.posts = parsed.map((p) => ({
      ...p.meta,
      translations: translations.get(p.id) ?? ({} as Record<Lang, string>),
      body: p.body,
      readingMinutes: estimateReadingMinutes(p.body),
    }))
  }

  private listItem(post: BlogPost): BlogListItem {
    const { body: _body, ...rest } = post
    return rest
  }

  getAllPosts(lang: Lang): BlogListItem[] {
    return this.posts
      .filter((p) => p.translations[lang] === p.slug)
      .sort((a, b) => b.date.localeCompare(a.date))
      .map((p) => this.listItem(p))
  }

  getPost(lang: Lang, slug: string): BlogPost | null {
    return (
      this.posts.find((p) => p.translations[lang] === slug && p.slug === slug) ??
      null
    )
  }

  getAllSlugs(): { id: string; lang: Lang; slug: string }[] {
    return this.posts.map((p) => ({ id: p.id, lang: this.langOf(p), slug: p.slug }))
  }

  private langOf(post: BlogPost): Lang {
    const found = (Object.keys(post.translations) as Lang[]).find(
      (l) => post.translations[l] === post.slug,
    )
    return found ?? 'es'
  }

  getRelated(post: BlogMeta, lang: Lang, limit = 3): BlogListItem[] {
    return this.getAllPosts(lang)
      .filter((p) => p.id !== post.id)
      .slice(0, limit)
  }
}
```

- [ ] **Step 4: Ejecutar test para verificar que pasa**

Run: `npm test -- MarkdownSource`
Expected: PASS (6 tests).

- [ ] **Step 5: Crear `src/lib/blog/index.ts`**

```ts
import type { ContentSource } from './types'
import { MarkdownSource } from './MarkdownSource'

// Fuente activa. Para migrar al CMS futuro: reemplazar por `new CmsSource(...)`.
// Las páginas y componentes sólo dependen de la interfaz `ContentSource`.
const files = import.meta.glob('../../content/blog/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

export const blog: ContentSource = new MarkdownSource(files)
```

- [ ] **Step 6: Commit**

```bash
git add src/lib/blog/MarkdownSource.ts src/lib/blog/index.ts src/lib/blog/MarkdownSource.test.ts
git commit -m "$(printf 'feat: MarkdownSource y capa de contenido del blog\n\nCo-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>')"
```

---

### Task 4: Contenido — 5 artículos × 3 idiomas

**Files:**
- Create: `src/content/blog/cafe-de-especialidad-pereira/{es,en,fr}.md`
- Create: `src/content/blog/coffee-tour-eje-cafetero/{es,en,fr}.md`
- Create: `src/content/blog/cafe-unicentro-pereira/{es,en,fr}.md`
- Create: `src/content/blog/cafe-pereira-plaza/{es,en,fr}.md`
- Create: `src/content/blog/que-es-cafe-de-especialidad/{es,en,fr}.md`
- Create: `public/blog/<id>/cover.svg` (placeholder por post; reemplazable por foto real)
- Test: `src/lib/blog/content.test.ts`

**Interfaces:**
- Consumes: `MarkdownSource`, `blog` (Task 3); briefs de la tabla "Article Briefs".
- Produces: 15 archivos `.md` cargables por `blog`; cada post resuelto por su slug localizado.

- [ ] **Step 1: Escribir cada `.md` siguiendo la tabla de briefs**

Para cada fila de la tabla "Article Briefs", crear el archivo con frontmatter completo y cuerpo Markdown original (800–1200 palabras). Ejemplo del formato exacto (`src/content/blog/cafe-de-especialidad-pereira/es.md`):

```markdown
---
slug: cafe-de-especialidad-pereira
title: "Café de especialidad en Pereira: la propuesta de Café Los Grisales"
description: "Descubre el café de especialidad en Pereira de Café Los Grisales: origen propio, procesos y dónde probarlo."
excerpt: "Qué hace especial a nuestro café, cómo lo cultivamos y dónde probarlo en Pereira."
keywords: ["café de especialidad pereira", "café pereira", "café los grisales"]
date: 2026-06-18
updated: 2026-06-18
author: "Café Los Grisales"
cover: /blog/cafe-de-especialidad-pereira/cover.svg
coverAlt: "Taza de café de especialidad servida en Café Los Grisales, Pereira"
tags: ["café de especialidad", "Pereira"]
relatedSede: pereira-plaza
---

El **café de especialidad en Pereira** vive un momento... (cuerpo original, 800–1200 palabras)

## Qué nos hace especialidad
...

## De la finca a la taza
...

## Dónde probarlo en Pereira
Visítanos en [nuestras tiendas](/es#cafe-bar)...

## Reserva tu Coffee Tour
Vive la experiencia completa en nuestro [Coffee Tour](/es#tour). ¿Quieres saber más? Lee también [Qué es el café de especialidad](/es/blog/que-es-cafe-de-especialidad).
```

Requisitos por archivo (verificar manualmente): keyword principal en `<h1>`/título, en el primer párrafo y en ≥1 `<h2>`; los 3 enlaces internos (sede/sección, Coffee Tour, artículo relacionado) con la ruta del **idioma correspondiente** (`/en...`, `/fr...`); `description` ≤160 caracteres; `slug`/`title`/outline exactamente los de la tabla.

- [ ] **Step 2: Crear portadas placeholder**

Para cada `id`, crear `public/blog/<id>/cover.svg` con un SVG simple de marca (fondo `#064947`, texto en `#C4A962`). Ejemplo `public/blog/cafe-de-especialidad-pereira/cover.svg`:
```svg
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><rect width="1200" height="630" fill="#064947"/><text x="600" y="320" font-family="Georgia, serif" font-size="48" fill="#C4A962" text-anchor="middle">Café Los Grisales</text></svg>
```

- [ ] **Step 3: Escribir test de contenido (smoke real)**

Create `src/lib/blog/content.test.ts`:
```ts
import { describe, it, expect } from 'vitest'
import { blog } from './index'
import type { Lang } from './types'

const EXPECTED = {
  es: ['cafe-de-especialidad-pereira', 'coffee-tour-en-pereira', 'cafe-en-unicentro-pereira', 'cafe-en-pereira-plaza', 'que-es-cafe-de-especialidad'],
  en: ['specialty-coffee-pereira', 'coffee-tour-in-pereira', 'coffee-at-unicentro-pereira', 'coffee-at-pereira-plaza', 'what-is-specialty-coffee'],
  fr: ['cafe-de-specialite-pereira', 'coffee-tour-a-pereira', 'cafe-a-unicentro-pereira', 'cafe-a-pereira-plaza', 'quest-ce-que-le-cafe-de-specialite'],
} as const

describe('contenido real del blog', () => {
  for (const lang of ['es', 'en', 'fr'] as Lang[]) {
    it(`${lang}: hay 5 posts con los slugs esperados`, () => {
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
})
```

- [ ] **Step 4: Ejecutar test**

Run: `npm test -- content`
Expected: PASS. Si falla por slug/idioma, corregir el frontmatter del `.md` correspondiente.

- [ ] **Step 5: Commit**

```bash
git add src/content/blog public/blog src/lib/blog/content.test.ts
git commit -m "$(printf 'content: 5 artículos del blog en es/en/fr\n\nCo-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>')"
```

---

### Task 5: SEO extendido + JSON-LD

**Files:**
- Modify: `src/components/seo/SEO.tsx`
- Create: `src/components/seo/ArticleJsonLd.tsx`
- Create: `src/components/seo/BreadcrumbJsonLd.tsx`
- Test: `src/components/seo/ArticleJsonLd.test.tsx`

**Interfaces:**
- Consumes: `Lang` (de `utils/lang`); `BlogPost` (Task 2); `SITE_ORIGIN` (constante local en SEO.tsx).
- Produces:
  - `SEO` con props nuevas: `type?: 'website' | 'article'`, `keywords?: string`, `alternates?: Record<Lang, string>` (subpaths por idioma, p. ej. `/blog/<slug>`), `publishedTime?: string`, `modifiedTime?: string`.
  - `ArticleJsonLd` con props `{ post: BlogPost; lang: Lang; url: string }`.
  - `BreadcrumbJsonLd` con props `{ items: { name: string; url: string }[] }`.

- [ ] **Step 1: Extender `src/components/seo/SEO.tsx`**

Reemplazar la interfaz `Props` y el cálculo de `subpath`/`alternates`/OG. Cambios:

En `Props` añadir:
```tsx
interface Props {
  title: LangMap
  description: LangMap
  /** Optional override for canonical / OG image — falls back to defaults. */
  image?: string
  /** 'website' (default) o 'article' para posts del blog. */
  type?: 'website' | 'article'
  /** Meta keywords (artículos). */
  keywords?: string
  /**
   * Subpaths por idioma para slugs localizados (p. ej. { es:'/blog/x', en:'/blog/y', fr:'/blog/z' }).
   * Si se omite, se reusa el pathname actual sin prefijo de idioma.
   */
  alternates?: Record<Lang, string>
  publishedTime?: string
  modifiedTime?: string
}
```

Reemplazar el cuerpo del componente desde `const subpath ...` por:
```tsx
export default function SEO({
  title,
  description,
  image,
  type = 'website',
  keywords,
  alternates,
  publishedTime,
  modifiedTime,
}: Props) {
  const lang = useLang()
  const location = useLocation()

  const subpath = location.pathname.replace(/^\/(es|en|fr)/, '')
  const pathFor = (l: Lang) => alternates?.[l] ?? subpath
  const canonical = `${SITE_ORIGIN}/${lang}${pathFor(lang)}`
  const ogImage = image ?? OG_IMAGE

  const langs: Lang[] = ['es', 'en', 'fr']
  const altLinks = [
    ...langs.map((l) => ({ hreflang: l, href: `${SITE_ORIGIN}/${l}${pathFor(l)}` })),
    { hreflang: 'x-default', href: `${SITE_ORIGIN}/es${pathFor('es')}` },
  ]

  return (
    <Helmet>
      <html lang={lang} />
      <title>{title[lang]}</title>
      <meta name="description" content={description[lang]} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={canonical} />

      {altLinks.map((a) => (
        <link key={a.hreflang} rel="alternate" hrefLang={a.hreflang} href={a.href} />
      ))}

      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="Café Los Grisales" />
      <meta property="og:title" content={title[lang]} />
      <meta property="og:description" content={description[lang]} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:locale" content={LOCALES[lang]} />
      {langs
        .filter((l) => l !== lang)
        .map((l) => (
          <meta key={l} property="og:locale:alternate" content={LOCALES[l]} />
        ))}
      {type === 'article' && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === 'article' && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title[lang]} />
      <meta name="twitter:description" content={description[lang]} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  )
}
```
(Conservar imports y constantes existentes `SITE_ORIGIN`, `OG_IMAGE`, `LOCALES`, `LangMap`.)

- [ ] **Step 2: Crear `src/components/seo/ArticleJsonLd.tsx`**

```tsx
import { Helmet } from 'react-helmet-async'
import type { BlogPost, Lang } from '../../lib/blog/types'

const SITE_ORIGIN = 'https://cafelosgrisales.com'

interface Props {
  post: BlogPost
  lang: Lang
  /** URL canónica absoluta del artículo. */
  url: string
}

/** JSON-LD BlogPosting para que Google entienda el artículo. */
export default function ArticleJsonLd({ post, lang, url }: Props) {
  const image = post.cover.startsWith('http') ? post.cover : `${SITE_ORIGIN}${post.cover}`
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    image,
    inLanguage: lang,
    datePublished: post.date,
    dateModified: post.updated,
    keywords: post.keywords.join(', '),
    author: { '@type': 'Organization', name: post.author },
    publisher: {
      '@type': 'Organization',
      name: 'Café Los Grisales',
      logo: { '@type': 'ImageObject', url: `${SITE_ORIGIN}/og-image.jpg` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
  }
  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(data)}</script>
    </Helmet>
  )
}
```

- [ ] **Step 3: Crear `src/components/seo/BreadcrumbJsonLd.tsx`**

```tsx
import { Helmet } from 'react-helmet-async'

interface Props {
  items: { name: string; url: string }[]
}

/** JSON-LD BreadcrumbList (Inicio › Blog › Artículo). */
export default function BreadcrumbJsonLd({ items }: Props) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  }
  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(data)}</script>
    </Helmet>
  )
}
```

- [ ] **Step 4: Escribir test de ArticleJsonLd**

Create `src/components/seo/ArticleJsonLd.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { HelmetProvider } from 'react-helmet-async'
import ArticleJsonLd from './ArticleJsonLd'
import type { BlogPost } from '../../lib/blog/types'

const post: BlogPost = {
  id: 'x', slug: 'x', title: 'T', description: 'D', excerpt: 'E',
  keywords: ['k1', 'k2'], date: '2026-06-01', updated: '2026-06-02',
  author: 'Café Los Grisales', cover: '/c.jpg', coverAlt: 'alt', tags: ['t'],
  translations: { es: 'x', en: 'x', fr: 'x' }, body: 'b', readingMinutes: 1,
}

describe('ArticleJsonLd', () => {
  it('inyecta JSON-LD BlogPosting con datos del post', () => {
    render(
      <HelmetProvider>
        <ArticleJsonLd post={post} lang="es" url="https://cafelosgrisales.com/es/blog/x" />
      </HelmetProvider>,
    )
    const script = document.head.querySelector('script[type="application/ld+json"]')
    expect(script).not.toBeNull()
    const json = JSON.parse(script!.textContent!)
    expect(json['@type']).toBe('BlogPosting')
    expect(json.headline).toBe('T')
    expect(json.image).toBe('https://cafelosgrisales.com/c.jpg')
    expect(json.keywords).toBe('k1, k2')
  })
})
```

- [ ] **Step 5: Ejecutar test**

Run: `npm test -- ArticleJsonLd`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/components/seo/SEO.tsx src/components/seo/ArticleJsonLd.tsx src/components/seo/BreadcrumbJsonLd.tsx src/components/seo/ArticleJsonLd.test.tsx
git commit -m "$(printf 'feat: SEO de artículos (slugs localizados) + JSON-LD\n\nCo-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>')"
```

---

### Task 6: Componentes de listado (BlogCard, BlogGrid)

**Files:**
- Create: `src/components/blog/BlogCard.tsx`
- Create: `src/components/blog/BlogGrid.tsx`
- Test: `src/components/blog/BlogGrid.test.tsx`

**Interfaces:**
- Consumes: `BlogListItem`, `Lang` (Task 2); `useLang` (`utils/lang`); `cn` (`utils/cn`).
- Produces:
  - `BlogCard` props `{ post: BlogListItem; lang: Lang }` → `<article>` con enlace a `/:lang/blog/:slug`.
  - `BlogGrid` props `{ posts: BlogListItem[]; lang: Lang }` con filtro por tag accesible.

- [ ] **Step 1: Crear `src/components/blog/BlogCard.tsx`**

```tsx
import { Link } from 'react-router-dom'
import { Clock } from '@phosphor-icons/react'
import type { BlogListItem, Lang } from '../../lib/blog/types'

interface Props {
  post: BlogListItem
  lang: Lang
}

export default function BlogCard({ post, lang }: Props) {
  const minLabel = { es: 'min de lectura', en: 'min read', fr: 'min de lecture' }[lang]
  return (
    <article className="group overflow-hidden rounded-3xl border border-brand/15 bg-white shadow-sm transition-shadow hover:shadow-md focus-within:ring-2 focus-within:ring-accent">
      <Link to={`/${lang}/blog/${post.slug}`} className="block focus:outline-none">
        <img
          src={post.cover}
          alt={post.coverAlt}
          width={1200}
          height={630}
          loading="lazy"
          className="aspect-[1200/630] w-full object-cover"
        />
        <div className="p-6">
          <div className="mb-3 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-brand/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-brand">
                {tag}
              </span>
            ))}
          </div>
          <h3 className="font-display text-2xl font-bold leading-tight text-brand group-hover:underline">
            {post.title}
          </h3>
          <p className="mt-2 text-sm opacity-70">{post.excerpt}</p>
          <div className="mt-4 flex items-center gap-2 text-xs opacity-60">
            <time dateTime={post.date}>{post.date}</time>
            <span aria-hidden="true">·</span>
            <Clock size={14} aria-hidden="true" />
            <span>{post.readingMinutes} {minLabel}</span>
          </div>
        </div>
      </Link>
    </article>
  )
}
```

- [ ] **Step 2: Escribir test de BlogGrid (falla)**

Create `src/components/blog/BlogGrid.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import BlogGrid from './BlogGrid'
import type { BlogListItem } from '../../lib/blog/types'

function item(id: string, tag: string): BlogListItem {
  return {
    id, slug: id, title: `Título ${id}`, description: 'd', excerpt: 'e',
    keywords: [], date: '2026-06-01', updated: '2026-06-01', author: 'A',
    cover: '/c.svg', coverAlt: 'alt', tags: [tag],
    translations: { es: id, en: id, fr: id }, readingMinutes: 1,
  }
}

const posts = [item('uno', 'tour'), item('dos', 'especialidad')]

describe('BlogGrid', () => {
  it('filtra por tag al pulsar el botón', async () => {
    render(
      <MemoryRouter>
        <BlogGrid posts={posts} lang="es" />
      </MemoryRouter>,
    )
    expect(screen.getByText('Título uno')).toBeInTheDocument()
    expect(screen.getByText('Título dos')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'tour' }))
    expect(screen.getByText('Título uno')).toBeInTheDocument()
    expect(screen.queryByText('Título dos')).not.toBeInTheDocument()
  })
})
```

- [ ] **Step 3: Ejecutar test para verificar que falla**

Run: `npm test -- BlogGrid`
Expected: FAIL ("Failed to resolve import './BlogGrid'").

- [ ] **Step 4: Implementar `src/components/blog/BlogGrid.tsx`**

```tsx
import { useMemo, useState } from 'react'
import type { BlogListItem, Lang } from '../../lib/blog/types'
import { cn } from '../../utils/cn'
import BlogCard from './BlogCard'

interface Props {
  posts: BlogListItem[]
  lang: Lang
}

export default function BlogGrid({ posts, lang }: Props) {
  const [active, setActive] = useState<string | null>(null)
  const allLabel = { es: 'Todos', en: 'All', fr: 'Tous' }[lang]
  const filterLabel = { es: 'Filtrar por tema', en: 'Filter by topic', fr: 'Filtrer par thème' }[lang]

  const tags = useMemo(
    () => Array.from(new Set(posts.flatMap((p) => p.tags))).sort(),
    [posts],
  )
  const visible = active ? posts.filter((p) => p.tags.includes(active)) : posts

  return (
    <div>
      <div role="group" aria-label={filterLabel} className="mb-10 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          aria-pressed={active === null}
          onClick={() => setActive(null)}
          className={cn(
            'rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent',
            active === null ? 'border-brand bg-brand text-white' : 'border-brand/30 text-brand hover:bg-brand/10',
          )}
        >
          {allLabel}
        </button>
        {tags.map((tag) => (
          <button
            key={tag}
            type="button"
            aria-pressed={active === tag}
            onClick={() => setActive(tag)}
            className={cn(
              'rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent',
              active === tag ? 'border-brand bg-brand text-white' : 'border-brand/30 text-brand hover:bg-brand/10',
            )}
          >
            {tag}
          </button>
        ))}
      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((post) => (
          <BlogCard key={post.id} post={post} lang={lang} />
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 5: Ejecutar test para verificar que pasa**

Run: `npm test -- BlogGrid`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/components/blog/BlogCard.tsx src/components/blog/BlogGrid.tsx src/components/blog/BlogGrid.test.tsx
git commit -m "$(printf 'feat: BlogCard y BlogGrid con filtro accesible\n\nCo-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>')"
```

---

### Task 7: Componentes de artículo (ArticleBody, Header, Footer, Related, Share)

**Files:**
- Create: `src/components/blog/ArticleBody.tsx`
- Create: `src/components/blog/ArticleHeader.tsx`
- Create: `src/components/blog/ArticleFooter.tsx`
- Create: `src/components/blog/RelatedPosts.tsx`
- Create: `src/components/blog/ShareButtons.tsx`
- Test: `src/components/blog/ArticleBody.test.tsx`

**Interfaces:**
- Consumes: `BlogPost`, `BlogListItem`, `Lang` (Task 2); `BlogCard` (Task 6); `react-markdown`, `remark-gfm`, `rehype-slug`, `rehype-autolink-headings`.
- Produces:
  - `ArticleBody` props `{ markdown: string }`.
  - `ArticleHeader` props `{ post: BlogPost; lang: Lang }`.
  - `ArticleFooter` props `{ post: BlogPost; lang: Lang }`.
  - `RelatedPosts` props `{ posts: BlogListItem[]; lang: Lang }`.
  - `ShareButtons` props `{ url: string; title: string; lang: Lang }`.

- [ ] **Step 1: Escribir test de ArticleBody (falla)**

Create `src/components/blog/ArticleBody.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ArticleBody from './ArticleBody'

describe('ArticleBody', () => {
  it('renderiza markdown con encabezados h2 y enlaces', () => {
    render(<ArticleBody markdown={'## Sección uno\n\nTexto con [enlace](/es#tour).'} />)
    expect(screen.getByRole('heading', { level: 2, name: /Sección uno/ })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'enlace' })).toHaveAttribute('href', '/es#tour')
  })
})
```

- [ ] **Step 2: Ejecutar test para verificar que falla**

Run: `npm test -- ArticleBody`
Expected: FAIL ("Failed to resolve import './ArticleBody'").

- [ ] **Step 3: Implementar `src/components/blog/ArticleBody.tsx`**

```tsx
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'

interface Props {
  markdown: string
}

/** Renderiza el cuerpo del artículo. Estilos tipográficos con Tailwind. */
export default function ArticleBody({ markdown }: Props) {
  return (
    <div className="prose-article mx-auto max-w-2xl">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug, [rehypeAutolinkHeadings, { behavior: 'wrap' }]]}
        components={{
          h2: (props) => <h2 className="mt-12 font-display text-3xl font-bold text-brand" {...props} />,
          h3: (props) => <h3 className="mt-8 font-display text-2xl font-semibold text-brand" {...props} />,
          p: (props) => <p className="mt-5 leading-relaxed opacity-90" {...props} />,
          a: (props) => <a className="text-brand underline decoration-accent underline-offset-4 hover:text-accent" {...props} />,
          ul: (props) => <ul className="mt-5 list-disc space-y-2 pl-6" {...props} />,
          ol: (props) => <ol className="mt-5 list-decimal space-y-2 pl-6" {...props} />,
          img: (props) => <img loading="lazy" className="mt-8 rounded-2xl" {...props} />,
          blockquote: (props) => <blockquote className="mt-6 border-l-4 border-accent pl-4 italic opacity-80" {...props} />,
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  )
}
```

- [ ] **Step 4: Ejecutar test para verificar que pasa**

Run: `npm test -- ArticleBody`
Expected: PASS.

- [ ] **Step 5: Implementar `src/components/blog/ArticleHeader.tsx`**

```tsx
import { Clock } from '@phosphor-icons/react'
import type { BlogPost, Lang } from '../../lib/blog/types'

interface Props {
  post: BlogPost
  lang: Lang
}

export default function ArticleHeader({ post, lang }: Props) {
  const minLabel = { es: 'min de lectura', en: 'min read', fr: 'min de lecture' }[lang]
  return (
    <header className="mx-auto mb-10 max-w-2xl text-center">
      <div className="mb-4 flex flex-wrap justify-center gap-2">
        {post.tags.map((tag) => (
          <span key={tag} className="rounded-full bg-brand/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-brand">
            {tag}
          </span>
        ))}
      </div>
      <h1 className="font-display text-4xl font-bold leading-tight text-brand md:text-5xl">
        {post.title}
      </h1>
      <div className="mt-5 flex items-center justify-center gap-2 text-sm opacity-60">
        <span>{post.author}</span>
        <span aria-hidden="true">·</span>
        <time dateTime={post.date}>{post.date}</time>
        <span aria-hidden="true">·</span>
        <Clock size={15} aria-hidden="true" />
        <span>{post.readingMinutes} {minLabel}</span>
      </div>
      <figure className="mt-8">
        <img
          src={post.cover}
          alt={post.coverAlt}
          width={1200}
          height={630}
          className="aspect-[1200/630] w-full rounded-3xl object-cover"
        />
      </figure>
    </header>
  )
}
```

- [ ] **Step 6: Implementar `src/components/blog/ShareButtons.tsx`**

```tsx
import type { Lang } from '../../lib/blog/types'

interface Props {
  url: string
  title: string
  lang: Lang
}

export default function ShareButtons({ url, title, lang }: Props) {
  const label = { es: 'Compartir', en: 'Share', fr: 'Partager' }[lang]
  const enc = encodeURIComponent
  const links = [
    { name: 'WhatsApp', href: `https://wa.me/?text=${enc(`${title} ${url}`)}` },
    { name: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}` },
    { name: 'X', href: `https://twitter.com/intent/tweet?url=${enc(url)}&text=${enc(title)}` },
  ]
  return (
    <nav aria-label={label} className="mt-10 flex items-center justify-center gap-3">
      <span className="text-sm font-semibold opacity-70">{label}:</span>
      {links.map((l) => (
        <a
          key={l.name}
          href={l.href}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-brand/30 px-4 py-1.5 text-sm text-brand transition-colors hover:bg-brand/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          {l.name}
        </a>
      ))}
    </nav>
  )
}
```

- [ ] **Step 7: Implementar `src/components/blog/RelatedPosts.tsx`**

```tsx
import type { BlogListItem, Lang } from '../../lib/blog/types'
import BlogCard from './BlogCard'

interface Props {
  posts: BlogListItem[]
  lang: Lang
}

export default function RelatedPosts({ posts, lang }: Props) {
  if (posts.length === 0) return null
  const heading = { es: 'Sigue leyendo', en: 'Keep reading', fr: 'À lire aussi' }[lang]
  return (
    <section aria-labelledby="related-heading" className="mt-20 border-t border-brand/15 pt-12">
      <h2 id="related-heading" className="mb-8 text-center font-display text-3xl font-bold text-brand">
        {heading}
      </h2>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <BlogCard key={post.id} post={post} lang={lang} />
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 8: Implementar `src/components/blog/ArticleFooter.tsx`**

```tsx
import { Link } from 'react-router-dom'
import type { BlogPost, Lang } from '../../lib/blog/types'

interface Props {
  post: BlogPost
  lang: Lang
}

const SEDE_ANCHOR: Record<string, string> = {
  'pereira-plaza': 'cafe-bar',
  unicentro: 'cafe-bar',
  'coffee-tour': 'tour',
}

export default function ArticleFooter({ post, lang }: Props) {
  const tourLabel = { es: 'Reserva tu Coffee Tour', en: 'Book your Coffee Tour', fr: 'Réservez votre Coffee Tour' }[lang]
  const sedeLabel = { es: 'Visita nuestras tiendas', en: 'Visit our coffee shops', fr: 'Visitez nos boutiques' }[lang]
  const anchor = post.relatedSede ? SEDE_ANCHOR[post.relatedSede] : 'cafe-bar'
  return (
    <aside className="mx-auto mt-16 max-w-2xl rounded-3xl border border-brand/15 bg-brand/5 p-8 text-center">
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link
          to={`/${lang}#tour`}
          className="rounded-full bg-brand px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-light focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          {tourLabel}
        </Link>
        <Link
          to={`/${lang}#${anchor}`}
          className="rounded-full border border-brand px-6 py-3 font-semibold text-brand transition-colors hover:bg-brand/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          {sedeLabel}
        </Link>
      </div>
    </aside>
  )
}
```

- [ ] **Step 9: Ejecutar todos los tests + commit**

Run: `npm test`
Expected: PASS (todos).
```bash
git add src/components/blog
git commit -m "$(printf 'feat: componentes de artículo del blog (body, header, footer, related, share)\n\nCo-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>')"
```

---

### Task 8: Páginas, rutas, navbar e i18n

**Files:**
- Create: `src/pages/BlogListPage.tsx`
- Create: `src/pages/BlogPostPage.tsx`
- Modify: `src/App.tsx:1-36`
- Modify: `src/config/routes.ts`
- Modify: `src/i18n/es.json`, `src/i18n/en.json`, `src/i18n/fr.json`
- Test: `src/pages/BlogPostPage.test.tsx`

**Interfaces:**
- Consumes: `blog` (Task 3); `SEO`, `ArticleJsonLd`, `BreadcrumbJsonLd` (Task 5); `BlogGrid` (Task 6); `ArticleHeader`, `ArticleBody`, `ArticleFooter`, `RelatedPosts`, `ShareButtons` (Task 7); `useLang` (`utils/lang`).
- Produces: rutas `/:lang/blog` y `/:lang/blog/:slug` (lazy); entrada navbar `/blog`.

- [ ] **Step 1: Crear `src/pages/BlogListPage.tsx`**

```tsx
import { useLang } from '../utils/lang'
import { blog } from '../lib/blog'
import SEO from '../components/seo/SEO'
import BlogGrid from '../components/blog/BlogGrid'

export default function BlogListPage() {
  const lang = useLang()
  const posts = blog.getAllPosts(lang)
  const heading = { es: 'Blog', en: 'Blog', fr: 'Blog' }[lang]
  const tagline = {
    es: 'Café de especialidad, Coffee Tour y la cultura cafetera de Pereira.',
    en: 'Specialty coffee, Coffee Tour and the coffee culture of Pereira.',
    fr: 'Café de spécialité, Coffee Tour et la culture du café de Pereira.',
  }[lang]

  return (
    <main className="mx-auto max-w-6xl px-4 py-20 md:py-28">
      <SEO
        title={{
          es: 'Blog de café de especialidad y Coffee Tour en Pereira | Café Los Grisales',
          en: 'Specialty coffee & Coffee Tour blog in Pereira | Café Los Grisales',
          fr: 'Blog café de spécialité & Coffee Tour à Pereira | Café Los Grisales',
        }}
        description={{
          es: 'Artículos sobre café de especialidad, Coffee Tour y dónde tomar café en Pereira (Unicentro y Pereira Plaza).',
          en: 'Articles about specialty coffee, Coffee Tour and where to have coffee in Pereira (Unicentro and Pereira Plaza).',
          fr: 'Articles sur le café de spécialité, le Coffee Tour et où prendre un café à Pereira (Unicentro et Pereira Plaza).',
        }}
        alternates={{ es: '/blog', en: '/blog', fr: '/blog' }}
      />
      <header className="mb-16 text-center">
        <h1 className="font-display text-5xl font-bold text-brand md:text-7xl">{heading}</h1>
        <p className="mx-auto mt-5 max-w-2xl opacity-70">{tagline}</p>
      </header>
      <BlogGrid posts={posts} lang={lang} />
    </main>
  )
}
```

- [ ] **Step 2: Escribir test de BlogPostPage (falla)**

Create `src/pages/BlogPostPage.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { HelmetProvider } from 'react-helmet-async'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { blog } from '../lib/blog'
import BlogPostPage from './BlogPostPage'

function renderAt(path: string) {
  return render(
    <HelmetProvider>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="/:lang/blog/:slug" element={<BlogPostPage />} />
          <Route path="/:lang/blog" element={<div>LISTA</div>} />
        </Routes>
      </MemoryRouter>
    </HelmetProvider>,
  )
}

describe('BlogPostPage', () => {
  it('renderiza el h1 del artículo existente', () => {
    const slug = blog.getAllPosts('es')[0].slug
    const title = blog.getPost('es', slug)!.title
    renderAt(`/es/blog/${slug}`)
    expect(screen.getByRole('heading', { level: 1, name: title })).toBeInTheDocument()
  })

  it('redirige a la lista si el slug no existe', () => {
    renderAt('/es/blog/no-existe-123')
    expect(screen.getByText('LISTA')).toBeInTheDocument()
  })
})
```

- [ ] **Step 3: Ejecutar test para verificar que falla**

Run: `npm test -- BlogPostPage`
Expected: FAIL ("Failed to resolve import './BlogPostPage'").

- [ ] **Step 4: Crear `src/pages/BlogPostPage.tsx`**

```tsx
import { Navigate, useParams } from 'react-router-dom'
import { useLang } from '../utils/lang'
import { blog } from '../lib/blog'
import SEO from '../components/seo/SEO'
import ArticleJsonLd from '../components/seo/ArticleJsonLd'
import BreadcrumbJsonLd from '../components/seo/BreadcrumbJsonLd'
import ArticleHeader from '../components/blog/ArticleHeader'
import ArticleBody from '../components/blog/ArticleBody'
import ArticleFooter from '../components/blog/ArticleFooter'
import RelatedPosts from '../components/blog/RelatedPosts'
import ShareButtons from '../components/blog/ShareButtons'

const SITE_ORIGIN = 'https://cafelosgrisales.com'

export default function BlogPostPage() {
  const lang = useLang()
  const { slug } = useParams<{ slug: string }>()
  const post = slug ? blog.getPost(lang, slug) : null

  if (!post) {
    return <Navigate to={`/${lang}/blog`} replace />
  }

  const url = `${SITE_ORIGIN}/${lang}/blog/${post.slug}`
  const alternates = {
    es: `/blog/${post.translations.es}`,
    en: `/blog/${post.translations.en}`,
    fr: `/blog/${post.translations.fr}`,
  }
  const blogLabel = { es: 'Blog', en: 'Blog', fr: 'Blog' }[lang]
  const homeLabel = { es: 'Inicio', en: 'Home', fr: 'Accueil' }[lang]
  const related = blog.getRelated(post, lang)

  return (
    <main className="mx-auto max-w-4xl px-4 py-20 md:py-28">
      <SEO
        title={{ es: post.title, en: post.title, fr: post.title }}
        description={{ es: post.description, en: post.description, fr: post.description }}
        image={post.cover.startsWith('http') ? post.cover : `${SITE_ORIGIN}${post.cover}`}
        type="article"
        keywords={post.keywords.join(', ')}
        alternates={alternates}
        publishedTime={post.date}
        modifiedTime={post.updated}
      />
      <ArticleJsonLd post={post} lang={lang} url={url} />
      <BreadcrumbJsonLd
        items={[
          { name: homeLabel, url: `${SITE_ORIGIN}/${lang}` },
          { name: blogLabel, url: `${SITE_ORIGIN}/${lang}/blog` },
          { name: post.title, url },
        ]}
      />
      <article>
        <ArticleHeader post={post} lang={lang} />
        <ArticleBody markdown={post.body} />
        <ShareButtons url={url} title={post.title} lang={lang} />
        <ArticleFooter post={post} lang={lang} />
      </article>
      <RelatedPosts posts={related} lang={lang} />
    </main>
  )
}
```

- [ ] **Step 5: Ejecutar test para verificar que pasa**

Run: `npm test -- BlogPostPage`
Expected: PASS (2 tests).

- [ ] **Step 6: Registrar rutas lazy en `src/App.tsx`**

Tras los imports existentes, añadir:
```tsx
import { lazy, Suspense } from 'react'
const BlogListPage = lazy(() => import('./pages/BlogListPage'))
const BlogPostPage = lazy(() => import('./pages/BlogPostPage'))
```
Dentro de `<Route path="/:lang" element={<Layout />}>`, tras la ruta de `productos`, añadir:
```tsx
<Route path="blog" element={<Suspense fallback={null}><BlogListPage /></Suspense>} />
<Route path="blog/:slug" element={<Suspense fallback={null}><BlogPostPage /></Suspense>} />
```

- [ ] **Step 7: Añadir entrada de navbar en `src/config/routes.ts`**

Tras la entrada de `/historia` (línea 8), añadir:
```ts
  { path: '/blog', nameEs: 'Blog', nameEn: 'Blog', nameFr: 'Blog', icon: Notebook, showInMenu: true, anchor: null },
```
Y en el import de la línea 1, añadir `Notebook`:
```ts
import { Mountains, Storefront, BookOpen, House, CoffeeBean, Package, Notebook } from '@phosphor-icons/react'
```

- [ ] **Step 8: Añadir strings i18n de navegación**

En `src/i18n/es.json`, `en.json`, `fr.json`, dentro del objeto `nav`, añadir `"blog": "Blog"` (igual en los 3). Si la navbar usa `routes.ts` para los labels (no `nav.*`), omitir este paso; verificar leyendo `src/components/layout/Navbar.tsx` antes.

- [ ] **Step 9: Verificar build de tipos y tests**

Run: `npx tsc -b && npm test`
Expected: sin errores de tipos; todos los tests PASS.

- [ ] **Step 10: Commit**

```bash
git add src/pages/BlogListPage.tsx src/pages/BlogPostPage.tsx src/pages/BlogPostPage.test.tsx src/App.tsx src/config/routes.ts src/i18n
git commit -m "$(printf 'feat: páginas y rutas del blog (es/en/fr) con SEO y JSON-LD\n\nCo-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>')"
```

---

### Task 9: Lector Node compartido + sitemap del blog

**Files:**
- Create: `scripts/read-blog.mjs`
- Modify: `scripts/generate-sitemap.mjs`
- Test: `scripts/read-blog.test.mjs`

**Interfaces:**
- Consumes: archivos `src/content/blog/**/*.md` (Task 4); `front-matter` (Task 1).
- Produces:
  - `readBlogPosts(): { id, lang, slug, updated, translations }[]` — exportado de `read-blog.mjs`.
  - `blogSitemapEntries(): { path, lastmod, priority, changefreq, alternates }[]` — para `generate-sitemap.mjs`.

- [ ] **Step 1: Crear `scripts/read-blog.mjs`**

```js
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
      out.push({
        id,
        lang,
        slug: String(attributes.slug),
        updated: String(attributes.updated ?? attributes.date ?? ''),
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
```

- [ ] **Step 2: Escribir test del lector**

Create `scripts/read-blog.test.mjs`:
```js
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
})
```

- [ ] **Step 3: Ejecutar test**

Run: `npm test -- read-blog`
Expected: PASS.

- [ ] **Step 4: Integrar blog en `scripts/generate-sitemap.mjs`**

Añadir import al inicio (tras los imports existentes):
```js
import { blogSitemapEntries } from './read-blog.mjs'
```
Tras la entrada de `/productos` en `ROUTES`, añadir el índice del blog:
```js
  { path: '/blog', priority: '0.7', changefreq: 'weekly' },
```
Reemplazar el bucle de construcción de `urls` (el bloque `const urls = []` … `}`) por una versión que añade además los artículos con su `lastmod` y alternates localizados:
```js
const urls = []
for (const route of ROUTES) {
  for (const lang of LANGS) {
    urls.push(urlEntry(lang, route))
  }
}

// Artículos del blog (slugs localizados, alternates por idioma)
for (const entry of blogSitemapEntries()) {
  const loc = `${SITE_ORIGIN}/${entry.lang}${entry.path}`
  const alternates = entry.alternates
    .map((a) => `    <xhtml:link rel="alternate" hreflang="${a.lang}" href="${SITE_ORIGIN}/${a.lang}${a.path}"/>`)
    .join('\n')
  const esAlt = entry.alternates.find((a) => a.lang === 'es') ?? entry.alternates[0]
  const xDefault = `    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_ORIGIN}/es${esAlt.path}"/>`
  urls.push(`  <url>
    <loc>${loc}</loc>
    <lastmod>${entry.lastmod || today}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
${alternates}
${xDefault}
  </url>`)
}
```

- [ ] **Step 5: Verificar generación de sitemap**

Run: `npm run build`
Expected: build OK; al final `✓ sitemap.xml (N URLs)` con N = 12 (4 rutas × 3) + 15 (blog) = 27.
Run: `grep -c "/blog/" dist/sitemap.xml`
Expected: ≥ 15.

- [ ] **Step 6: Commit**

```bash
git add scripts/read-blog.mjs scripts/read-blog.test.mjs scripts/generate-sitemap.mjs
git commit -m "$(printf 'feat: sitemap incluye blog index y artículos con hreflang\n\nCo-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>')"
```

---

### Task 10: Pre-render headless post-build

**Files:**
- Create: `scripts/prerender.mjs`
- Modify: `package.json` (script `build`)
- Modify: `.github/workflows/deploy.yml`

**Interfaces:**
- Consumes: `readBlogPosts` (Task 9); `dist/` generado por `vite build`; Puppeteer (Task 1).
- Produces: `dist/<ruta>/index.html` estático por cada ruta concreta.

- [ ] **Step 1: Crear `scripts/prerender.mjs`**

```js
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
```

- [ ] **Step 2: Actualizar script `build` en `package.json`**

Reemplazar la línea `"build"` por:
```json
    "build": "tsc -b && vite build && node scripts/prerender.mjs && node scripts/generate-sitemap.mjs",
```

- [ ] **Step 3: Ejecutar build completo y verificar HTML estático**

Run: `npm run build`
Expected: logs `✓ prerender /es/blog/...` para cada ruta; build sin errores.
Run: `grep -l "BlogPosting" dist/es/blog/*/index.html | head -1`
Expected: al menos un `index.html` de artículo contiene el JSON-LD `BlogPosting` en el HTML estático.
Run: `test -f dist/es/blog/index.html && echo OK`
Expected: `OK`.

- [ ] **Step 4: Actualizar `.github/workflows/deploy.yml`**

Leer el archivo primero. Aplicar dos cambios:
1. Asegurar que Chromium está disponible para Puppeteer en el paso de build. Antes del paso que ejecuta `npm run build`, añadir (si el runner es `ubuntu-latest`):
```yaml
      - name: Install Chromium deps for Puppeteer
        run: npx puppeteer browsers install chrome
```
2. En el paso de `aws s3 sync`, garantizar que los `*.html` (incluidos los nuevos `*/index.html` del blog) usan **short-cache** igual que `sitemap.xml`. Si el workflow ya separa HTML (short-cache) de assets con hash (long-cache) por extensión/patrón, los nuevos `index.html` quedan cubiertos automáticamente; verificar el patrón y, si excluye subcarpetas, ampliarlo a `*/index.html`.

- [ ] **Step 5: Commit**

```bash
git add scripts/prerender.mjs package.json .github/workflows/deploy.yml
git commit -m "$(printf 'feat: pre-render headless post-build a HTML estático\n\nCo-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>')"
```

---

### Task 11: QA final de accesibilidad y rendimiento

**Files:**
- Modify: cualquier componente del blog según hallazgos (ajustes puntuales).

**Interfaces:**
- Consumes: build estático (Task 10).

- [ ] **Step 1: Lint y tests completos**

Run: `npm run lint && npm test`
Expected: sin errores de lint; todos los tests PASS.

- [ ] **Step 2: Servir el build y auditar con Lighthouse**

Run: `npm run build && npm run preview`
En otra terminal (o navegador), auditar `http://localhost:4173/es/blog` y un artículo (`/es/blog/cafe-de-especialidad-pereira`) con Lighthouse (Chrome DevTools o `npx lighthouse <url> --only-categories=accessibility,performance,seo`).
Expected: Accesibilidad ≥ 95, SEO ≥ 95, Rendimiento ≥ 90. Anotar incidencias.

- [ ] **Step 3: Verificación manual de accesibilidad**

Verificar en el artículo y la lista:
- Un único `<h1>` por página; jerarquía de headings sin saltos.
- Navegación completa por teclado (Tab) por tarjetas, filtros y enlaces; foco visible.
- Todas las imágenes con `alt` no vacío.
- Filtro de tags con `aria-pressed` correcto.
- Contraste de texto sobre fondos (brand/accent/crema) suficiente.
Corregir cualquier hallazgo en el componente correspondiente.

- [ ] **Step 4: Verificar metadatos en HTML estático**

Run:
```bash
grep -o '<link rel="alternate"[^>]*>' dist/es/blog/cafe-de-especialidad-pereira/index.html | head
grep -o '<link rel="canonical"[^>]*>' dist/es/blog/cafe-de-especialidad-pereira/index.html
grep -c "BreadcrumbList" dist/es/blog/cafe-de-especialidad-pereira/index.html
```
Expected: hreflang es/en/fr/x-default con slugs localizados; canonical correcto; `BreadcrumbList` presente (≥1).

- [ ] **Step 5: Commit de ajustes (si los hubo)**

```bash
git add -A
git commit -m "$(printf 'fix: ajustes de accesibilidad y rendimiento del blog\n\nCo-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>')"
```

---

## Self-Review (cobertura del spec)

- §4.1 Capa de abstracción → Tasks 2, 3 (interfaz `ContentSource`, `MarkdownSource`, `index.ts` con swap de 1 línea). ✓
- §4.2 Estructura de contenido (frontmatter, glob) → Tasks 3, 4. ✓
- §4.3 Rutas localizadas → Task 8. ✓
- §4.4 Componentes → Tasks 6, 7. ✓
- §5 SEO (BlogPosting, Breadcrumb, hreflang, sitemap, interlinking) → Tasks 4 (enlaces internos), 5, 8, 9. ✓
- §6 Accesibilidad → Tasks 6, 7 (semántica, aria, foco) + Task 11 (auditoría). ✓
- §7 Rendimiento (lazy, code-split, prerender) → Tasks 7 (lazy img), 8 (React.lazy), 10 (prerender) + Task 11. ✓
- §8 Pre-render headless → Task 10. ✓
- §9 Contenido inicial (5×3) → Task 4. ✓
- §11 Criterios de éxito → verificados en Tasks 9, 10, 11. ✓

Sin placeholders en pasos de código. Tipos consistentes entre tareas (`ContentSource`, `BlogPost`, `BlogListItem`, `translations`, props de `SEO`/`ArticleJsonLd`).
