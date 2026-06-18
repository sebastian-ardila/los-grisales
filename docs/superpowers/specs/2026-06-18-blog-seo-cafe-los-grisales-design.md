# Diseño: Sección Blog SEO — Café Los Grisales

**Fecha:** 2026-06-18
**Estado:** Aprobado para planificación
**Autor:** Sebastian Ardila (con Claude)

## 1. Objetivo

Posicionar a Café Los Grisales en Google para búsquedas locales de Pereira y de turismo cafetero, superando a competidores ya posicionados. Keywords objetivo:

- `café` / `café Pereira`
- `café de especialidad` / `café de especialidad Pereira`
- `café Unicentro` (Unicentro Pereira)
- `café Pereira Plaza`
- `coffee tour` / `coffee tour Pereira` / `coffee tour Eje Cafetero`

El vehículo es una **sección Blog** con contenido indexable optimizado en **accesibilidad, rendimiento y SEO**, integrada al diseño y arquitectura existentes.

## 2. Contexto del proyecto

SPA existente: **React 19 + Vite 8 + TypeScript + Tailwind 4 + React Router 7** (`BrowserRouter`), i18n con `i18next` (es/en/fr, fallback es), SEO por página con `react-helmet-async` (`src/components/seo/SEO.tsx`), sitemap auto-generado en build (`scripts/generate-sitemap.mjs`), JSON-LD `LocalBusiness` en `index.html`. Deploy a S3 + CloudFront + Route 53 vía GitHub Actions (`deploy.yml`), con `sitemap.xml`/`robots.txt` en bucket de short-cache.

Patrón de rutas actual: `/:lang/[page]` (`/es`, `/en/historia`, `/fr/productos`). Redirección de `/` a idioma vía `LangRedirect`.

Sistema de diseño: fuentes Fraunces (display) y Great Vibes (script); paleta crema `#f5efdf` / verde brand `#064947` / oro `#C4A962`; mecanismo "dark islands" para secciones sobre fondo oscuro.

## 3. Decisiones tomadas (brainstorming)

1. **Fuente de contenido actual:** archivos Markdown en el repo.
2. **Futuro:** CMS multitenant en proyecto y dominio aparte, con ISR. Este repo debe quedar preparado para ese cambio mediante una **capa de abstracción de contenido**.
3. **Idiomas:** todos los artículos en **es/en/fr** (siempre los 3), con slugs localizados y `hreflang`.
4. **Entrega inicial:** sistema completo del blog **+ 5 artículos reales** optimizados, uno por keyword principal.
5. **Pre-render:** **crawler headless post-build** (Puppeteer). Decidido por estabilidad: no modifica el código de runtime existente; el riesgo sobre producción es nulo. (`vite-react-ssg` se descartó: exigiría refactor SSR-safe de `SedeContext`/i18n/`useIsMobile` y **no aporta ISR**.)

### Nota importante sobre ISR

ISR (Incremental Static Regeneration) es una característica de **runtime de servidor** (p. ej. Next.js); **ningún pre-render de Vite la provee**. El SSG/crawler de este repo produce HTML estático de build-time, equivalente en SEO. La **alineación con el futuro ISR la garantiza la capa de abstracción de contenido** (`ContentSource`): el frontend futuro del CMS consumirá el mismo contrato de datos. ISR llegará con ese proyecto separado, no con este.

## 4. Arquitectura

### 4.1 Capa de abstracción de contenido (clave para el futuro CMS)

```
src/lib/blog/
├── types.ts          # BlogPost, BlogMeta, BlogListItem (contrato estable)
├── ContentSource.ts  # interfaz: getAllPosts(lang), getPost(lang, slug),
│                      #           getAllSlugs(), getRelated(post, lang)
├── MarkdownSource.ts  # implementación actual (lee .md vía import.meta.glob)
├── markdown.ts        # parseo de frontmatter + utilidades de render
└── index.ts          # `export const blog = new MarkdownSource()`  ← 1 línea para swap
```

Las páginas y componentes del blog **solo dependen de `ContentSource`**, nunca de los `.md`. Migrar al CMS = crear `CmsSource.ts` y cambiar la línea de `index.ts`. Sin tocar páginas, componentes ni SEO.

**Contrato (`types.ts`):**

```ts
export type Lang = 'es' | 'en' | 'fr'

export interface BlogMeta {
  id: string              // identificador estable del post (carpeta), igual en los 3 idiomas
  slug: string            // slug localizado para la URL en este idioma
  title: string
  description: string     // meta description (<=160 chars)
  excerpt: string         // resumen para tarjetas
  keywords: string[]
  date: string            // ISO, publicación
  updated: string         // ISO, última actualización (lastmod del sitemap)
  author: string
  cover: string           // ruta a imagen (public/blog/...)
  coverAlt: string        // obligatorio (accesibilidad)
  tags: string[]
  relatedSede?: 'pereira-plaza' | 'unicentro' | 'coffee-tour'
  translations: Record<Lang, string>  // id -> slug por idioma, para hreflang
}

export interface BlogPost extends BlogMeta {
  body: string            // markdown crudo
  readingMinutes: number
}

export interface BlogListItem extends BlogMeta {
  readingMinutes: number
}
```

### 4.2 Estructura de contenido

```
src/content/blog/<post-id>/
├── es.md
├── en.md
└── fr.md
public/blog/<post-id>/cover.jpg   # imágenes (servidas estáticas, optimizadas)
```

Frontmatter por archivo:

```yaml
---
slug: cafe-de-especialidad-pereira
title: "..."
description: "..."
excerpt: "..."
keywords: ["café de especialidad pereira", "café pereira"]
date: 2026-06-18
updated: 2026-06-18
author: "Café Los Grisales"
cover: /blog/cafe-de-especialidad-pereira/cover.jpg
coverAlt: "Taza de café de especialidad servida en Café Los Grisales, Pereira"
tags: ["café de especialidad", "Pereira"]
relatedSede: pereira-plaza
---
Cuerpo del artículo en Markdown...
```

Carga en build con `import.meta.glob('../content/blog/**/*.md', { query: '?raw', import: 'default', eager: true })`. Frontmatter parseado con un parser **browser-safe** (`front-matter`, sin dependencia de `Buffer`). El `id` del post se deriva de la carpeta; los slugs por idioma se cruzan para construir `translations` (hreflang).

### 4.3 Rutas

En `src/App.tsx`, dentro de `<Route path="/:lang" element={<Layout />}>`:

```tsx
<Route path="blog" element={<BlogListPage />} />
<Route path="blog/:slug" element={<BlogPostPage />} />
```

- `src/pages/BlogListPage.tsx` — índice: hero corto + grid de tarjetas + filtro por tag. Lista los posts del `lang` activo (ordenados por `date` desc).
- `src/pages/BlogPostPage.tsx` — artículo: resuelve `slug` → post vía `ContentSource`; si no existe en ese idioma, 404 controlado (redirige a `/:lang/blog`).
- Registrar en `src/config/routes.ts` (entra al navbar, con icono `@phosphor-icons` p. ej. `BookOpen`/`Notebook`) y traducciones de nav en `i18n/{es,en,fr}.json`.

### 4.4 Componentes nuevos

```
src/components/blog/
├── BlogCard.tsx       # tarjeta (cover, título, excerpt, fecha, reading time, tags)
├── BlogGrid.tsx       # grid responsive + filtro por tag (accesible)
├── ArticleHeader.tsx  # h1, meta (autor, <time>, reading time), breadcrumb visual
├── ArticleBody.tsx    # render Markdown (react-markdown + plugins) con estilos prose
├── ArticleFooter.tsx  # CTAs a sedes/coffee tour/productos + compartir
├── RelatedPosts.tsx   # interlinking entre artículos
└── ShareButtons.tsx   # compartir (links, sin scripts de terceros pesados)
```

Reutilizan `SectionHeader`, paleta y tipografías existentes. Markdown renderizado con `react-markdown` + `remark-gfm` + `rehype-slug` + `rehype-autolink-headings`. Sin carga de contenido en runtime: todo viene del bundle (estático).

## 5. SEO

- **`SEO.tsx`:** extender para artículos — title/description/keywords por post, canonical del slug localizado, hreflang a `translations`, Open Graph + Twitter con `cover` del artículo y `og:type=article`.
- **JSON-LD por artículo:** `BlogPosting` (headline, image, datePublished, dateModified, author, publisher = Café Los Grisales). Componente `ArticleJsonLd`.
- **JSON-LD `BreadcrumbList`:** Inicio › Blog › Artículo.
- **Interlinking:** cada artículo enlaza a su `relatedSede` (sección/sede correspondiente), a Coffee Tour y a artículos relacionados (`RelatedPosts`). El índice del blog enlaza desde el navbar y footer.
- **Sitemap (`scripts/generate-sitemap.mjs`):** añadir `/blog` (index, priority 0.7) y expandir cada post × 3 idiomas con su slug localizado, `lastmod` = `updated`, y `hreflang` alternates. El script debe leer los mismos `.md`/frontmatter (fuente única de verdad de slugs).
- **robots.txt:** sin cambios (ya permite todo + referencia sitemap).

## 6. Accesibilidad

- HTML semántico: `<article>`, `<header>`, `<time datetime>`, `<nav aria-label="Migas de pan">`, `<figure>/<figcaption>`, `<main>`.
- Jerarquía de encabezados estricta: un único `<h1>` por artículo (el título); headings del Markdown empiezan en `<h2>`.
- `alt` **obligatorio** en cada imagen (validado vía frontmatter `coverAlt`; imágenes del cuerpo deben llevar alt en Markdown).
- Skip-to-content link; foco visible en tarjetas, enlaces y filtros; navegación completa por teclado.
- Contraste validado contra la paleta (verde/oro/crema); estados de foco con outline visible.
- Respeto a `prefers-reduced-motion` en animaciones de entrada de tarjetas.
- Filtro por tag operable por teclado con `aria-pressed`.

## 7. Rendimiento (Core Web Vitals)

- **Pre-render headless post-build** (ver §8): HTML estático para todas las rutas del blog (y, si se desea, del resto del sitio).
- Imágenes: `loading="lazy"`, `width`/`height` explícitos (evita CLS), `srcset`/`sizes` responsive; formatos optimizados (WebP/AVIF cuando se disponga del asset).
- Code-splitting: `BlogListPage`/`BlogPostPage` cargadas con `React.lazy` para no inflar el bundle del home.
- JS mínimo en artículo (sin librerías pesadas de terceros).
- Reutilizar `preconnect`/`preload` de fuentes existentes.

## 8. Pre-renderizado (crawler headless)

Nuevo script `scripts/prerender.mjs`, ejecutado en build **después** de `vite build` y **antes** de `generate-sitemap.mjs` (o en paralelo, ambos independientes):

1. Levanta `vite preview` (o sirve `dist/`) en un puerto local.
2. Con Puppeteer, visita cada ruta concreta (sin la redirección `/`): `/{es,en,fr}`, `/{es,en,fr}/historia`, `/{es,en,fr}/productos`, `/{es,en,fr}/blog`, y `/{lang}/blog/{slug}` por cada post/idioma.
3. Espera a que la app hidrate (selector de contenido / `networkidle`), captura el HTML resultante (incluye meta de Helmet y JSON-LD ya en el DOM) y lo escribe como `dist/<ruta>/index.html`.
4. Cierra el navegador y el server.

Las rutas a renderizar provienen de la **misma fuente** que el sitemap (frontmatter de los `.md`), para no duplicar listas.

`package.json` build:
```
"build": "tsc -b && vite build && node scripts/prerender.mjs && node scripts/generate-sitemap.mjs"
```

**Deploy (`deploy.yml`):** los `index.html` pre-renderizados son HTML → deben ir al bucket de **short-cache** (igual que `sitemap.xml`), mientras los assets con hash siguen en long-cache. Verificar que el sync sube la nueva estructura de carpetas y que CloudFront sirve `/<ruta>/index.html`. Añadir Chromium al runner (acción de setup de Puppeteer/`browser-actions`); si el paso falla, falla el build sin afectar producción.

## 9. Contenido inicial (5 artículos × es/en/fr)

| # | post-id | Keyword principal | Enfoque |
|---|---------|-------------------|---------|
| 1 | `cafe-de-especialidad-pereira` | café de especialidad Pereira / café Pereira | Guía de la propuesta de Café Los Grisales; origen, finca, proceso |
| 2 | `coffee-tour-eje-cafetero` | coffee tour / coffee tour Pereira | Experiencia del Coffee Tour, del grano a la taza, cómo reservar |
| 3 | `cafe-unicentro-pereira` | café Unicentro | Tienda en Unicentro: ubicación, ambiente, qué pedir |
| 4 | `cafe-pereira-plaza` | café Pereira Plaza | Tienda en Pereira Plaza: experiencia, horarios, recomendaciones |
| 5 | `que-es-cafe-de-especialidad` | café de especialidad (informativo) | Educativo de captación; puntaje SCA, diferencias, cómo reconocerlo |

Cada artículo: ~800–1200 palabras, encabezados con keywords, interlinking a sedes/tour/productos, imagen con `alt`, frontmatter completo, slug localizado por idioma. Tono premium y cercano, consistente con el sitio.

## 10. Fuera de alcance (YAGNI)

- CMS, panel de edición, autenticación (proyecto futuro aparte).
- ISR / runtime de servidor (no aplica a este repo).
- Comentarios, búsqueda full-text, paginación (no hacen falta con 5 posts; se evaluará al crecer).
- Migración a Next.js.

## 11. Criterios de éxito

- `/es/blog`, `/en/blog`, `/fr/blog` y los 15 artículos (5×3) renderizan correctamente y existen como **HTML estático** en `dist/`.
- Cada artículo expone meta tags, canonical, hreflang y JSON-LD `BlogPosting` + `BreadcrumbList` válidos en el HTML pre-renderizado.
- Sitemap incluye blog + posts con slugs localizados, `lastmod` y hreflang.
- Navbar y footer enlazan al blog; interlinking interno presente.
- Sin regresiones en home/historia/productos.
- Build (`tsc + vite build + prerender + sitemap`) pasa de extremo a extremo.
- Auditoría de accesibilidad y rendimiento (Lighthouse) en verde en las páginas del blog.
