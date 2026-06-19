# FAQ Feature for Blog Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add accessible FAQ sections with JSON-LD FAQPage schema to all 5 blog articles in es/en/fr for Café Los Grisales.

**Architecture:** Extend `BlogMeta`/`BlogPost` types with an optional `faq` array, parse it from frontmatter in `MarkdownSource`, render a `<FaqSection>` component (native `<details>/<summary>`) in `BlogPostPage`, and inject `FaqJsonLd` into `<head>` via the existing `JsonLd` infrastructure.

**Tech Stack:** React 19, Vite, TypeScript (strict), Tailwind v4 (inline), Vitest + @testing-library/react, front-matter npm package.

## Global Constraints

- TypeScript strict: no unused vars/imports, no `any`.
- Do NOT use `bg-white` or `text-white` — use brand/accent/primary tokens (`bg-brand`, `text-accent`, `text-primary`, `border-brand`, etc.).
- Brand colors: brand `#064947`, accent `#C4A962`, primary cream `#f5efdf`.
- Reading column width is `max-w-3xl mx-auto`.
- Components: PascalCase filenames, `export default function`.
- Tailwind inline (no `@apply`).
- All commits in Spanish, ending with: `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`
- Verify: `npx tsc -b` clean, `npm test` green, `npm run build` passes before each commit.

---

### Task 1: Types — add `FaqItem` and optional `faq` to `BlogMeta`/`BlogPost`

**Files:**
- Modify: `src/lib/blog/types.ts`

**Interfaces:**
- Produces: `FaqItem` exported type `{ q: string; a: string }`, optional `faq?: FaqItem[]` on `BlogMeta` and `BlogPost`.

- [ ] **Step 1: Open and read the file**

Read `/Users/dila/Docs/Code/los-grisales/src/lib/blog/types.ts` to confirm current content before editing.

- [ ] **Step 2: Add `FaqItem` type and `faq` field**

In `src/lib/blog/types.ts`, add after line 1 (`export type Lang = ...`):

```typescript
export interface FaqItem {
  q: string
  a: string
}
```

Then add `faq?: FaqItem[]` to `BlogMeta` (after `relatedSede?: SedeRef`):

```typescript
export interface BlogMeta {
  id: string
  slug: string
  title: string
  description: string
  excerpt: string
  keywords: string[]
  date: string
  updated: string
  author: string
  cover: string
  coverAlt: string
  tags: string[]
  relatedSede?: SedeRef
  faq?: FaqItem[]
  translations: Record<Lang, string>
}
```

`BlogPost extends BlogMeta` so it inherits `faq` automatically — no change needed there.

- [ ] **Step 3: Verify TypeScript compiles**

```bash
cd /Users/dila/Docs/Code/los-grisales && npx tsc -b --noEmit
```

Expected: no errors.

- [ ] **Step 4: Run tests to confirm no regressions**

```bash
cd /Users/dila/Docs/Code/los-grisales && npm test -- --run
```

Expected: all tests pass.

- [ ] **Step 5: Commit**

```bash
cd /Users/dila/Docs/Code/los-grisales && git add src/lib/blog/types.ts && git commit -m "$(cat <<'EOF'
tipos: agrega FaqItem y campo opcional faq a BlogMeta

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 2: MarkdownSource — parse `faq` from frontmatter

**Files:**
- Modify: `src/lib/blog/MarkdownSource.ts`

**Interfaces:**
- Consumes: `FaqItem` from `src/lib/blog/types.ts` (Task 1).
- Produces: `post.faq` populated as `FaqItem[]` (default `[]`) from YAML frontmatter `faq:` array of `{q, a}` objects.

- [ ] **Step 1: Write the failing test**

Add to `src/lib/blog/MarkdownSource.test.ts` — append a new `describe` block at the bottom of the file:

```typescript
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
```

- [ ] **Step 2: Run test to confirm it fails**

```bash
cd /Users/dila/Docs/Code/los-grisales && npm test -- --run src/lib/blog/MarkdownSource.test.ts
```

Expected: FAIL — `post!.faq` is `undefined`, not an array.

- [ ] **Step 3: Parse `faq` in `MarkdownSource.ts`**

In `src/lib/blog/MarkdownSource.ts`:

1. Add `FaqItem` to the import from `./types`:
```typescript
import type {
  BlogListItem,
  BlogMeta,
  BlogPost,
  ContentSource,
  FaqItem,
  Lang,
  SedeRef,
} from './types'
```

2. Add a helper function after `toStringArray`:
```typescript
function toFaqArray(value: unknown): FaqItem[] {
  if (!Array.isArray(value)) return []
  return value
    .filter((item): item is Record<string, unknown> =>
      item !== null && typeof item === 'object',
    )
    .map((item) => ({
      q: String(item.q ?? ''),
      a: String(item.a ?? ''),
    }))
    .filter((item) => item.q.length > 0)
}
```

3. In the `meta` object inside the constructor loop, add `faq` after `relatedSede`:
```typescript
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
  faq: toFaqArray(a.faq),
},
```

- [ ] **Step 4: Run test to confirm it passes**

```bash
cd /Users/dila/Docs/Code/los-grisales && npm test -- --run src/lib/blog/MarkdownSource.test.ts
```

Expected: all tests PASS.

- [ ] **Step 5: Verify TypeScript**

```bash
cd /Users/dila/Docs/Code/los-grisales && npx tsc -b --noEmit
```

Expected: no errors.

- [ ] **Step 6: Commit**

```bash
cd /Users/dila/Docs/Code/los-grisales && git add src/lib/blog/MarkdownSource.ts src/lib/blog/MarkdownSource.test.ts && git commit -m "$(cat <<'EOF'
MarkdownSource: parsea campo faq del frontmatter YAML

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 3: FaqSection component

**Files:**
- Create: `src/components/blog/FaqSection.tsx`

**Interfaces:**
- Consumes: `FaqItem` from `src/lib/blog/types.ts`, `Lang` from `src/lib/blog/types.ts`.
- Produces: `export default function FaqSection({ items, lang }: { items: FaqItem[]; lang: Lang })` — returns `null` if `items` is empty.

- [ ] **Step 1: Create the component**

Create `/Users/dila/Docs/Code/los-grisales/src/components/blog/FaqSection.tsx`:

```typescript
import type { FaqItem, Lang } from '../../lib/blog/types'

interface Props {
  items: FaqItem[]
  lang: Lang
}

const HEADING: Record<Lang, string> = {
  es: 'Preguntas frecuentes',
  en: 'Frequently asked questions',
  fr: 'Questions fréquentes',
}

export default function FaqSection({ items, lang }: Props) {
  if (items.length === 0) return null

  return (
    <section
      aria-labelledby="faq-heading"
      className="mx-auto mt-16 max-w-3xl"
    >
      <h2
        id="faq-heading"
        className="mb-8 font-display text-2xl font-semibold text-brand md:text-3xl"
      >
        {HEADING[lang]}
      </h2>
      <dl className="divide-y divide-brand/15">
        {items.map((item, i) => (
          <details
            key={i}
            className="group py-4 first:pt-0 last:pb-0"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-lg font-medium text-brand focus:outline-none focus-visible:rounded focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-primary">
              <span>{item.q}</span>
              <span
                aria-hidden="true"
                className="shrink-0 text-accent transition-transform duration-200 group-open:rotate-180"
              >
                ▾
              </span>
            </summary>
            <div className="mt-3 pr-8">
              <p className="leading-relaxed text-text-muted">{item.a}</p>
            </div>
          </details>
        ))}
      </dl>
    </section>
  )
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
cd /Users/dila/Docs/Code/los-grisales && npx tsc -b --noEmit
```

Expected: no errors.

- [ ] **Step 3: Run full test suite**

```bash
cd /Users/dila/Docs/Code/los-grisales && npm test -- --run
```

Expected: all tests pass (no new tests yet for this component — it will be covered in Task 7).

- [ ] **Step 4: Commit**

```bash
cd /Users/dila/Docs/Code/los-grisales && git add src/components/blog/FaqSection.tsx && git commit -m "$(cat <<'EOF'
FaqSection: componente accesible de preguntas frecuentes con details/summary

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 4: FaqJsonLd component

**Files:**
- Create: `src/components/seo/FaqJsonLd.tsx`

**Interfaces:**
- Consumes: `JsonLd` from `./JsonLd`, `FaqItem` from `../../lib/blog/types`.
- Produces: `export default function FaqJsonLd({ items }: { items: FaqItem[] })` — renders nothing if empty, otherwise injects FAQPage JSON-LD via `JsonLd`.

- [ ] **Step 1: Create the component**

Create `/Users/dila/Docs/Code/los-grisales/src/components/seo/FaqJsonLd.tsx`:

```typescript
import JsonLd from './JsonLd'
import type { FaqItem } from '../../lib/blog/types'

interface Props {
  items: FaqItem[]
}

/** JSON-LD FAQPage para que Google muestre respuestas enriquecidas en la SERP. */
export default function FaqJsonLd({ items }: Props) {
  if (items.length === 0) return null

  const data = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  }

  return <JsonLd data={data} />
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
cd /Users/dila/Docs/Code/los-grisales && npx tsc -b --noEmit
```

Expected: no errors.

- [ ] **Step 3: Run full test suite**

```bash
cd /Users/dila/Docs/Code/los-grisales && npm test -- --run
```

Expected: all tests pass.

- [ ] **Step 4: Commit**

```bash
cd /Users/dila/Docs/Code/los-grisales && git add src/components/seo/FaqJsonLd.tsx && git commit -m "$(cat <<'EOF'
FaqJsonLd: inyecta JSON-LD FAQPage en head para rich results

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 5: Wire FaqSection + FaqJsonLd into BlogPostPage

**Files:**
- Modify: `src/pages/BlogPostPage.tsx`

**Interfaces:**
- Consumes: `FaqSection` from `../components/blog/FaqSection`, `FaqJsonLd` from `../components/seo/FaqJsonLd`, `post.faq` from the content layer (Task 2).

- [ ] **Step 1: Read current BlogPostPage**

Read `/Users/dila/Docs/Code/los-grisales/src/pages/BlogPostPage.tsx` to confirm current imports and JSX before editing.

- [ ] **Step 2: Add imports**

Add to the import block in `src/pages/BlogPostPage.tsx`:

```typescript
import FaqJsonLd from '../components/seo/FaqJsonLd'
import FaqSection from '../components/blog/FaqSection'
```

- [ ] **Step 3: Render conditionally**

After `<BreadcrumbJsonLd .../>` and before `<article>`, add:

```typescript
{(post.faq?.length ?? 0) > 0 && <FaqJsonLd items={post.faq!} />}
```

Inside `<article>`, after `<ShareButtons ... />` and before `<ArticleFooter ... />`, add:

```typescript
{(post.faq?.length ?? 0) > 0 && (
  <FaqSection items={post.faq!} lang={lang} />
)}
```

The resulting JSX structure (relevant excerpt):

```tsx
{(post.faq?.length ?? 0) > 0 && <FaqJsonLd items={post.faq!} />}
<article>
  <ArticleHeader post={post} lang={lang} />
  <ArticleBody markdown={post.body} />
  <ShareButtons url={url} title={post.title} lang={lang} />
  {(post.faq?.length ?? 0) > 0 && (
    <FaqSection items={post.faq!} lang={lang} />
  )}
  <ArticleFooter post={post} lang={lang} />
</article>
```

- [ ] **Step 4: Verify TypeScript**

```bash
cd /Users/dila/Docs/Code/los-grisales && npx tsc -b --noEmit
```

Expected: no errors.

- [ ] **Step 5: Run full test suite**

```bash
cd /Users/dila/Docs/Code/los-grisales && npm test -- --run
```

Expected: all tests pass.

- [ ] **Step 6: Commit**

```bash
cd /Users/dila/Docs/Code/los-grisales && git add src/pages/BlogPostPage.tsx && git commit -m "$(cat <<'EOF'
BlogPostPage: conecta FaqSection y FaqJsonLd cuando el post tiene FAQ

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 6: FAQ content — add `faq:` frontmatter to all 15 markdown files

**Files:**
- Modify: `src/content/blog/cafe-de-especialidad-pereira/es.md`
- Modify: `src/content/blog/cafe-de-especialidad-pereira/en.md`
- Modify: `src/content/blog/cafe-de-especialidad-pereira/fr.md`
- Modify: `src/content/blog/coffee-tour-eje-cafetero/es.md`
- Modify: `src/content/blog/coffee-tour-eje-cafetero/en.md`
- Modify: `src/content/blog/coffee-tour-eje-cafetero/fr.md`
- Modify: `src/content/blog/cafe-unicentro-pereira/es.md`
- Modify: `src/content/blog/cafe-unicentro-pereira/en.md`
- Modify: `src/content/blog/cafe-unicentro-pereira/fr.md`
- Modify: `src/content/blog/cafe-pereira-plaza/es.md`
- Modify: `src/content/blog/cafe-pereira-plaza/en.md`
- Modify: `src/content/blog/cafe-pereira-plaza/fr.md`
- Modify: `src/content/blog/que-es-cafe-de-especialidad/es.md`
- Modify: `src/content/blog/que-es-cafe-de-especialidad/en.md`
- Modify: `src/content/blog/que-es-cafe-de-especialidad/fr.md`

**Note:** Insert the `faq:` block in the frontmatter **before** the closing `---`. Do NOT fabricate specific prices, exact addresses, phone numbers, or precise altitudes/scores. Keep answers factual and brand-consistent. Read each file before editing.

- [ ] **Step 1: Add FAQ to `cafe-de-especialidad-pereira/es.md`**

Insert before the closing `---` of the frontmatter:

```yaml
faq:
  - q: "¿Dónde puedo tomar café de especialidad en Pereira?"
    a: "En Café Los Grisales tienes dos tiendas en Pereira: una en Pereira Plaza y otra en Unicentro Pereira. Ambas sirven café de especialidad proveniente de nuestra propia finca en el Eje Cafetero."
  - q: "¿Qué diferencia al café de especialidad del café corriente?"
    a: "El café de especialidad alcanza puntajes superiores a 80 puntos en la escala de la Specialty Coffee Association (SCA). Eso implica trazabilidad completa desde la finca, cosecha selectiva del fruto maduro y procesos controlados de beneficio que preservan los sabores únicos del origen."
  - q: "¿Café Los Grisales tiene finca propia en el Eje Cafetero?"
    a: "Sí. Nuestro café de especialidad nace en una finca familiar ubicada en el Eje Cafetero. Controlamos el cultivo, la cosecha y el beneficio, lo que nos permite garantizar la calidad y trazabilidad de cada taza que servimos en Pereira."
  - q: "¿Puedo aprender sobre el proceso del café en Pereira?"
    a: "Sí. Ofrecemos un Coffee Tour donde recorres la finca, conoces el proceso de beneficio y terminas con una sesión de cata guiada. Es la mejor forma de entender de dónde viene el café de especialidad que servimos en nuestras tiendas."
```

- [ ] **Step 2: Add FAQ to `cafe-de-especialidad-pereira/en.md`**

Read the file first, then insert before the closing `---`:

```yaml
faq:
  - q: "Where can I drink specialty coffee in Pereira?"
    a: "Café Los Grisales has two locations in Pereira: one at Pereira Plaza and one at Unicentro Pereira. Both serve specialty coffee sourced from our own family farm in the Eje Cafetero coffee region."
  - q: "What makes specialty coffee different from regular coffee?"
    a: "Specialty coffee achieves scores above 80 points on the Specialty Coffee Association (SCA) scale. This means full traceability from the farm, selective harvesting of ripe cherries, and controlled processing methods that preserve the unique flavors of the origin."
  - q: "Does Café Los Grisales have its own farm in the Eje Cafetero?"
    a: "Yes. Our specialty coffee comes from a family-owned farm in the Eje Cafetero region. We control every step from cultivation to harvest to processing, which allows us to guarantee the quality and traceability of every cup we serve in Pereira."
  - q: "Can I learn about the coffee process in Pereira?"
    a: "Absolutely. We offer a Coffee Tour where you walk through the farm, learn about the processing stages, and finish with a guided cupping session. It's the best way to understand where the specialty coffee we serve in our shops comes from."
```

- [ ] **Step 3: Add FAQ to `cafe-de-especialidad-pereira/fr.md`**

Read the file first, then insert before the closing `---`:

```yaml
faq:
  - q: "Où peut-on boire du café de spécialité à Pereira ?"
    a: "Café Los Grisales dispose de deux boutiques à Pereira : l'une à Pereira Plaza et l'autre à Unicentro Pereira. Toutes deux servent du café de spécialité issu de notre propre ferme familiale dans la région du Eje Cafetero."
  - q: "Quelle est la différence entre le café de spécialité et le café ordinaire ?"
    a: "Le café de spécialité atteint des scores supérieurs à 80 points sur l'échelle de la Specialty Coffee Association (SCA). Cela implique une traçabilité complète depuis la ferme, une récolte sélective des cerises mûres et des procédés de transformation contrôlés qui préservent les saveurs uniques de l'origine."
  - q: "Café Los Grisales possède-t-il sa propre ferme dans le Eje Cafetero ?"
    a: "Oui. Notre café de spécialité provient d'une ferme familiale située dans la région du Eje Cafetero. Nous maîtrisons chaque étape, de la culture à la récolte jusqu'à la transformation, ce qui nous permet de garantir la qualité de chaque tasse servie à Pereira."
  - q: "Puis-je en apprendre davantage sur le processus du café à Pereira ?"
    a: "Oui. Nous proposons un Coffee Tour où vous parcourez la ferme, découvrez les étapes de transformation et terminez par une séance de dégustation guidée. C'est la meilleure façon de comprendre l'origine du café de spécialité que nous servons dans nos boutiques."
```

- [ ] **Step 4: Add FAQ to `coffee-tour-eje-cafetero/es.md`**

Read the file first, then insert before the closing `---`:

```yaml
faq:
  - q: "¿Qué incluye el Coffee Tour de Café Los Grisales en el Eje Cafetero?"
    a: "El Coffee Tour incluye un recorrido guiado por los cafetales de nuestra finca familiar, una demostración de los procesos de beneficio (lavado, natural y honey) y una sesión de cata guiada donde probarás cafés con perfiles distintos. También compartimos la historia de nuestra familia y su relación con el Eje Cafetero."
  - q: "¿Cómo reservar el Coffee Tour en Pereira?"
    a: "Puedes reservar el Coffee Tour directamente desde nuestra web o visitando cualquiera de nuestras tiendas en Pereira (Pereira Plaza o Unicentro). El equipo te indicará los días y horarios disponibles y si hay cupos para grupos o visitas corporativas."
  - q: "¿Necesito experiencia previa en café para el Coffee Tour?"
    a: "No es necesaria ninguna experiencia previa. El tour está diseñado tanto para curiosos sin conocimientos técnicos como para aficionados que quieren profundizar. Nuestros guías adaptan la explicación al nivel del grupo."
  - q: "¿El Coffee Tour en el Eje Cafetero incluye cata de café?"
    a: "Sí. La sesión de cata es una de las partes más valoradas del recorrido. Siguiendo el protocolo estándar de cupping, probarás cafés de nuestra propia finca procesados de maneras distintas y aprenderás a identificar aromas, acidez, cuerpo y retrogusto."
```

- [ ] **Step 5: Add FAQ to `coffee-tour-eje-cafetero/en.md`**

Read the file first, then insert before the closing `---`:

```yaml
faq:
  - q: "What does the Café Los Grisales Coffee Tour in the Eje Cafetero include?"
    a: "The Coffee Tour includes a guided walk through our family farm's coffee fields, a demonstration of processing methods (washed, natural, and honey), and a guided cupping session where you'll taste coffees with different flavor profiles. We also share the story of our family and its connection to the Eje Cafetero region."
  - q: "How do I book the Coffee Tour in Pereira?"
    a: "You can book the Coffee Tour directly on our website or by visiting either of our Pereira locations (Pereira Plaza or Unicentro). Our team will tell you about available dates, times, and options for group or corporate visits."
  - q: "Do I need any coffee experience to join the Coffee Tour?"
    a: "No prior experience is needed. The tour is designed for curious newcomers and coffee enthusiasts alike. Our guides adapt the level of detail to the group's background and interest."
  - q: "Does the Coffee Tour include a coffee cupping session?"
    a: "Yes. The cupping session is one of the most popular parts of the tour. Following the standard cupping protocol, you'll taste coffees from our own farm processed in different ways, and learn to identify aromas, acidity, body, and aftertaste."
```

- [ ] **Step 6: Add FAQ to `coffee-tour-eje-cafetero/fr.md`**

Read the file first, then insert before the closing `---`:

```yaml
faq:
  - q: "Que comprend le Coffee Tour de Café Los Grisales dans le Eje Cafetero ?"
    a: "Le Coffee Tour comprend une visite guidée des caféiers de notre ferme familiale, une démonstration des méthodes de transformation (lavé, naturel et honey) et une séance de dégustation guidée où vous goûterez des cafés aux profils différents. Nous partageons également l'histoire de notre famille et son lien avec la région du Eje Cafetero."
  - q: "Comment réserver le Coffee Tour à Pereira ?"
    a: "Vous pouvez réserver le Coffee Tour directement sur notre site web ou en visitant l'une de nos boutiques à Pereira (Pereira Plaza ou Unicentro). Notre équipe vous indiquera les dates et horaires disponibles, ainsi que les options pour les groupes ou les visites d'entreprise."
  - q: "Faut-il une expérience préalable en café pour participer au Coffee Tour ?"
    a: "Aucune expérience préalable n'est nécessaire. Le tour est conçu aussi bien pour les curieux sans connaissances techniques que pour les amateurs qui souhaitent approfondir leurs connaissances. Nos guides adaptent le niveau d'explication au groupe."
  - q: "Le Coffee Tour comprend-il une séance de dégustation de café ?"
    a: "Oui. La séance de dégustation est l'une des parties les plus appréciées du parcours. En suivant le protocole standard de cupping, vous dégusterez des cafés de notre propre ferme transformés de différentes manières et apprendrez à identifier les arômes, l'acidité, le corps et l'arrière-goût."
```

- [ ] **Step 7: Add FAQ to `cafe-unicentro-pereira/es.md`**

Read the file first, then insert before the closing `---`:

```yaml
faq:
  - q: "¿Dónde está el café Café Los Grisales en Unicentro Pereira?"
    a: "Nuestra tienda en Café Unicentro Pereira se encuentra dentro del centro comercial Unicentro, uno de los más visitados del norte de Pereira. Es un espacio diseñado para disfrutar café de especialidad en un ambiente cálido y accesible."
  - q: "¿Qué tipo de café sirven en la tienda de Unicentro?"
    a: "En nuestra tienda de Unicentro Pereira servimos café de especialidad proveniente de nuestra finca propia en el Eje Cafetero. Encontrarás espresso, métodos de filtrado y bebidas con leche, todos elaborados con granos cultivados y procesados por nosotros."
  - q: "¿Hay diferencia entre las tiendas de Unicentro y Pereira Plaza?"
    a: "Ambas tiendas ofrecen la misma calidad de café y el mismo estándar de servicio Café Los Grisales. El menú principal es idéntico; puede haber pequeñas variaciones en las preparaciones de temporada según cada ubicación."
  - q: "¿Se puede hacer una reserva de grupos en Café Los Grisales Unicentro?"
    a: "Sí. Si planeas visitar con un grupo, te recomendamos contactarnos con anticipación para coordinar la atención. Nuestro equipo en la tienda de Unicentro Pereira puede ayudarte con los detalles."
```

- [ ] **Step 8: Add FAQ to `cafe-unicentro-pereira/en.md`**

Read the file first, then insert before the closing `---`:

```yaml
faq:
  - q: "Where is the Café Los Grisales coffee shop at Unicentro Pereira?"
    a: "Our Café Los Grisales at Unicentro Pereira is located inside Unicentro shopping center, one of the most visited malls in northern Pereira. It's a warm, accessible space designed for enjoying specialty coffee in the heart of the city."
  - q: "What kind of coffee do you serve at the Unicentro location?"
    a: "At our Unicentro Pereira shop we serve specialty coffee from our own farm in the Eje Cafetero region. You'll find espresso, filter methods, and milk-based drinks, all made with beans we cultivate and process ourselves."
  - q: "Is there a difference between the Unicentro and Pereira Plaza shops?"
    a: "Both shops offer the same coffee quality and Café Los Grisales service standard. The core menu is identical; there may be small differences in seasonal offerings depending on the location."
  - q: "Can I make a group reservation at Café Los Grisales Unicentro?"
    a: "Yes. If you're planning to visit with a group, we recommend reaching out to us in advance so we can coordinate your experience. Our team at the Unicentro Pereira shop will be happy to help with the details."
```

- [ ] **Step 9: Add FAQ to `cafe-unicentro-pereira/fr.md`**

Read the file first, then insert before the closing `---`:

```yaml
faq:
  - q: "Où se trouve le café Café Los Grisales à Unicentro Pereira ?"
    a: "Notre boutique Café Los Grisales à Unicentro Pereira est située à l'intérieur du centre commercial Unicentro, l'un des plus fréquentés du nord de Pereira. C'est un espace chaleureux et accessible conçu pour savourer un café de spécialité au cœur de la ville."
  - q: "Quel type de café servez-vous à l'emplacement Unicentro ?"
    a: "Dans notre boutique d'Unicentro Pereira, nous servons du café de spécialité issu de notre propre ferme dans la région du Eje Cafetero. Vous trouverez des expressos, des méthodes de filtration et des boissons au lait, tous préparés avec des grains que nous cultivons et transformons nous-mêmes."
  - q: "Y a-t-il une différence entre les boutiques d'Unicentro et de Pereira Plaza ?"
    a: "Les deux boutiques offrent la même qualité de café et le même standard de service Café Los Grisales. Le menu principal est identique ; il peut y avoir de légères différences dans les préparations saisonnières selon l'emplacement."
  - q: "Puis-je faire une réservation de groupe chez Café Los Grisales Unicentro ?"
    a: "Oui. Si vous prévoyez une visite en groupe, nous vous recommandons de nous contacter à l'avance pour coordonner votre expérience. Notre équipe à Unicentro Pereira sera ravie de vous aider."
```

- [ ] **Step 10: Add FAQ to `cafe-pereira-plaza/es.md`**

Read the file first, then insert before the closing `---`:

```yaml
faq:
  - q: "¿Dónde está el café Los Grisales en Pereira Plaza?"
    a: "Nuestra tienda en Pereira Plaza se encuentra dentro de este centro comercial, en un espacio diseñado para vivir la experiencia completa del café de especialidad. Es uno de los puntos de encuentro más concurridos de los amantes del café en Pereira."
  - q: "¿Qué se puede pedir en Café Los Grisales Pereira Plaza?"
    a: "En Pereira Plaza encontrarás todo el menú de Café Los Grisales: espresso de origen único, métodos de filtrado como V60 o Chemex, bebidas con leche de origen vegetal y preparaciones de temporada. El café proviene de nuestra finca propia en el Eje Cafetero."
  - q: "¿Café Los Grisales en Pereira Plaza tiene experiencias de cata o talleres?"
    a: "Nuestros baristas en Pereira Plaza siempre están disponibles para orientarte sobre el café del día, las notas de taza y las diferencias entre procesos. Para experiencias más completas, ofrecemos el Coffee Tour en nuestra finca del Eje Cafetero."
  - q: "¿En qué se diferencia Café Los Grisales de otras cafeterías en Pereira Plaza?"
    a: "Café Los Grisales es la única cafetería en Pereira Plaza con trazabilidad directa desde finca propia en el Eje Cafetero. Eso significa que cuando pides un espresso, el grano fue cultivado, cosechado y procesado por nosotros, sin intermediarios."
```

- [ ] **Step 11: Add FAQ to `cafe-pereira-plaza/en.md`**

Read the file first, then insert before the closing `---`:

```yaml
faq:
  - q: "Where is Café Los Grisales at Pereira Plaza?"
    a: "Our Pereira Plaza shop is located inside this shopping mall, in a space designed for a full specialty coffee experience. It's one of the most popular coffee destinations for enthusiasts in Pereira."
  - q: "What can I order at Café Los Grisales Pereira Plaza?"
    a: "At Pereira Plaza you'll find our full Café Los Grisales menu: single-origin espresso, filter methods like V60 or Chemex, plant-based milk drinks, and seasonal specials. All coffee comes from our own farm in the Eje Cafetero region."
  - q: "Does Café Los Grisales at Pereira Plaza offer tastings or workshops?"
    a: "Our baristas at Pereira Plaza are always available to guide you through the coffee of the day, tasting notes, and the differences between processing methods. For deeper experiences, we offer the Coffee Tour at our Eje Cafetero farm."
  - q: "What sets Café Los Grisales apart from other cafés at Pereira Plaza?"
    a: "Café Los Grisales is the only coffee shop at Pereira Plaza with direct traceability from our own farm in the Eje Cafetero. When you order an espresso, the bean was grown, harvested, and processed by us — no middlemen."
```

- [ ] **Step 12: Add FAQ to `cafe-pereira-plaza/fr.md`**

Read the file first, then insert before the closing `---`:

```yaml
faq:
  - q: "Où se trouve Café Los Grisales à Pereira Plaza ?"
    a: "Notre boutique de Pereira Plaza est située à l'intérieur de ce centre commercial, dans un espace conçu pour vivre l'expérience complète du café de spécialité. C'est l'une des destinations café les plus appréciées des amateurs à Pereira."
  - q: "Que peut-on commander chez Café Los Grisales à Pereira Plaza ?"
    a: "À Pereira Plaza, vous trouverez tout le menu Café Los Grisales : espresso d'origine unique, méthodes de filtration comme le V60 ou la Chemex, boissons au lait végétal et préparations saisonnières. Tout le café provient de notre propre ferme dans la région du Eje Cafetero."
  - q: "Café Los Grisales à Pereira Plaza propose-t-il des dégustations ou des ateliers ?"
    a: "Nos baristas à Pereira Plaza sont toujours disponibles pour vous guider sur le café du jour, les notes de tasse et les différences entre les méthodes de transformation. Pour des expériences plus approfondies, nous proposons le Coffee Tour dans notre ferme du Eje Cafetero."
  - q: "Qu'est-ce qui distingue Café Los Grisales des autres cafés à Pereira Plaza ?"
    a: "Café Los Grisales est la seule boutique de café à Pereira Plaza avec une traçabilité directe depuis notre propre ferme dans le Eje Cafetero. Quand vous commandez un expresso, le grain a été cultivé, récolté et transformé par nous — sans intermédiaires."
```

- [ ] **Step 13: Add FAQ to `que-es-cafe-de-especialidad/es.md`**

Read the file first, then insert before the closing `---`:

```yaml
faq:
  - q: "¿Qué es el café de especialidad exactamente?"
    a: "El café de especialidad es aquel que obtiene un puntaje de 80 puntos o más en la escala de la Specialty Coffee Association (SCA), evaluado por catadores certificados. Implica trazabilidad desde la finca, cosecha selectiva, procesos de beneficio controlados y una preparación cuidadosa en taza."
  - q: "¿Cómo se diferencia el café de especialidad del café comercial?"
    a: "El café comercial suele mezclar granos de distintos orígenes y calidades para estandarizar un sabor uniforme. El café de especialidad, en cambio, tiene identidad: sabes de qué finca viene, quién lo cultivó, qué variedad es y cómo fue procesado. Esa trazabilidad es lo que permite sabores únicos y complejos en la taza."
  - q: "¿Cuál es la escala SCA y cómo se puntúa el café de especialidad?"
    a: "La Specialty Coffee Association (SCA) desarrolló un protocolo de cata que evalúa el café en atributos como aroma, sabor, retrogusto, acidez, cuerpo, balance, dulzura y uniformidad, entre otros. Los catadores certificados (Q Graders) realizan la evaluación y un café que alcanza 80 puntos o más sobre 100 recibe la categoría de especialidad."
  - q: "¿Dónde puedo probar café de especialidad en el Eje Cafetero?"
    a: "En Café Los Grisales puedes probarlo en nuestras tiendas en Pereira (Pereira Plaza y Unicentro Pereira) o en nuestro Coffee Tour en la finca, donde el café de especialidad del Eje Cafetero cobra todo su sentido con el proceso completo del grano a la taza."
```

- [ ] **Step 14: Add FAQ to `que-es-cafe-de-especialidad/en.md`**

Read the file first, then insert before the closing `---`:

```yaml
faq:
  - q: "What is specialty coffee exactly?"
    a: "Specialty coffee is coffee that scores 80 points or higher on the Specialty Coffee Association (SCA) scale, as evaluated by certified tasters. It requires traceability from the farm, selective harvesting, controlled processing, and careful preparation in the cup."
  - q: "How does specialty coffee differ from commercial coffee?"
    a: "Commercial coffee typically blends beans from different origins and quality levels to standardize a uniform flavor. Specialty coffee, on the other hand, has its own identity: you know which farm it comes from, who grew it, which variety it is, and how it was processed. That traceability is what makes unique and complex flavors possible."
  - q: "What is the SCA scale and how is specialty coffee scored?"
    a: "The Specialty Coffee Association (SCA) developed a cupping protocol that evaluates coffee on attributes such as aroma, flavor, aftertaste, acidity, body, balance, sweetness, and uniformity, among others. Certified tasters (Q Graders) perform the evaluation, and any coffee that reaches 80 points or more out of 100 earns the specialty category."
  - q: "Where can I taste specialty coffee in the Eje Cafetero?"
    a: "At Café Los Grisales you can taste it at our shops in Pereira (Pereira Plaza and Unicentro Pereira) or on our Coffee Tour at the farm, where Eje Cafetero specialty coffee comes to life through the complete journey from bean to cup."
```

- [ ] **Step 15: Add FAQ to `que-es-cafe-de-especialidad/fr.md`**

Read the file first, then insert before the closing `---`:

```yaml
faq:
  - q: "Qu'est-ce que le café de spécialité exactement ?"
    a: "Le café de spécialité est un café qui obtient un score de 80 points ou plus sur l'échelle de la Specialty Coffee Association (SCA), évalué par des dégustateurs certifiés. Il implique une traçabilité depuis la ferme, une récolte sélective, des procédés de transformation contrôlés et une préparation soignée en tasse."
  - q: "En quoi le café de spécialité diffère-t-il du café commercial ?"
    a: "Le café commercial mélange généralement des grains de différentes origines et qualités pour standardiser un goût uniforme. Le café de spécialité, en revanche, a sa propre identité : vous savez de quelle ferme il provient, qui l'a cultivé, quelle est la variété et comment il a été transformé. C'est cette traçabilité qui permet des saveurs uniques et complexes dans la tasse."
  - q: "Qu'est-ce que l'échelle SCA et comment le café de spécialité est-il noté ?"
    a: "La Specialty Coffee Association (SCA) a développé un protocole de dégustation qui évalue le café sur des attributs tels que l'arôme, la saveur, l'arrière-goût, l'acidité, le corps, l'équilibre, la douceur et l'uniformité. Des dégustateurs certifiés (Q Graders) réalisent l'évaluation, et tout café atteignant 80 points ou plus sur 100 reçoit la catégorie spécialité."
  - q: "Où puis-je goûter du café de spécialité dans le Eje Cafetero ?"
    a: "Chez Café Los Grisales, vous pouvez le déguster dans nos boutiques à Pereira (Pereira Plaza et Unicentro Pereira) ou lors de notre Coffee Tour à la ferme, où le café de spécialité du Eje Cafetero prend tout son sens à travers le voyage complet du grain à la tasse."
```

- [ ] **Step 16: Verify TypeScript and tests**

```bash
cd /Users/dila/Docs/Code/los-grisales && npx tsc -b --noEmit && npm test -- --run
```

Expected: no TS errors, all tests pass.

- [ ] **Step 17: Commit**

```bash
cd /Users/dila/Docs/Code/los-grisales && git add src/content/blog/ && git commit -m "$(cat <<'EOF'
contenido: agrega FAQ (3-4 preguntas) a los 5 artículos en es/en/fr

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 7: Tests — content layer FAQ test + FaqJsonLd render test

**Files:**
- Modify: `src/lib/blog/content.test.ts` (add FAQ assertion)
- Create: `src/components/seo/FaqJsonLd.test.tsx`

**Interfaces:**
- Consumes: `blog` singleton from `src/lib/blog/index.ts` (which loads real markdown files), `FaqJsonLd` from `src/components/seo/FaqJsonLd.tsx`.

- [ ] **Step 1: Write the content layer FAQ test**

Add to `src/lib/blog/content.test.ts` — new `describe` block appended at the bottom:

```typescript
describe('FAQ en el contenido real', () => {
  it('el post cafe-de-especialidad-pereira/es tiene al menos 3 preguntas FAQ', () => {
    const post = blog.getPost('es', 'cafe-de-especialidad-pereira')
    expect(post).not.toBeNull()
    expect(Array.isArray(post!.faq)).toBe(true)
    expect(post!.faq!.length).toBeGreaterThanOrEqual(3)
    // cada ítem tiene q y a no vacíos
    for (const item of post!.faq!) {
      expect(item.q.length).toBeGreaterThan(0)
      expect(item.a.length).toBeGreaterThan(0)
    }
  })
})
```

- [ ] **Step 2: Write the FaqJsonLd render test**

Create `/Users/dila/Docs/Code/los-grisales/src/components/seo/FaqJsonLd.test.tsx`:

```typescript
import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import FaqJsonLd from './FaqJsonLd'
import type { FaqItem } from '../../lib/blog/types'

const items: FaqItem[] = [
  { q: '¿Qué es el café de especialidad?', a: 'Es un café con más de 80 puntos SCA.' },
  { q: '¿Dónde está Café Los Grisales?', a: 'En Pereira Plaza y Unicentro Pereira.' },
  { q: '¿Tienen Coffee Tour?', a: 'Sí, del grano a la taza.' },
]

describe('FaqJsonLd', () => {
  it('no renderiza nada con items vacíos', () => {
    render(<FaqJsonLd items={[]} />)
    const scripts = document.head.querySelectorAll('script[type="application/ld+json"]')
    // no debe haber script de FAQPage cuando items está vacío
    const faqScript = Array.from(scripts).find((s) => {
      try {
        return JSON.parse(s.textContent!)['@type'] === 'FAQPage'
      } catch {
        return false
      }
    })
    expect(faqScript).toBeUndefined()
  })

  it('inyecta JSON-LD FAQPage con mainEntity correcto', () => {
    render(<FaqJsonLd items={items} />)
    const scripts = document.head.querySelectorAll('script[type="application/ld+json"]')
    const faqScript = Array.from(scripts).find((s) => {
      try {
        return JSON.parse(s.textContent!)['@type'] === 'FAQPage'
      } catch {
        return false
      }
    })
    expect(faqScript).not.toBeUndefined()
    const json = JSON.parse(faqScript!.textContent!)
    expect(json['@context']).toBe('https://schema.org')
    expect(json['@type']).toBe('FAQPage')
    expect(Array.isArray(json.mainEntity)).toBe(true)
    expect(json.mainEntity).toHaveLength(3)
    expect(json.mainEntity[0]['@type']).toBe('Question')
    expect(json.mainEntity[0].name).toBe('¿Qué es el café de especialidad?')
    expect(json.mainEntity[0].acceptedAnswer['@type']).toBe('Answer')
    expect(json.mainEntity[0].acceptedAnswer.text).toBe('Es un café con más de 80 puntos SCA.')
  })
})
```

- [ ] **Step 3: Run the new tests to confirm they pass**

```bash
cd /Users/dila/Docs/Code/los-grisales && npm test -- --run src/lib/blog/content.test.ts src/components/seo/FaqJsonLd.test.tsx
```

Expected: all 3 new tests PASS.

- [ ] **Step 4: Run full test suite**

```bash
cd /Users/dila/Docs/Code/los-grisales && npm test -- --run
```

Expected: all tests PASS.

- [ ] **Step 5: Verify TypeScript**

```bash
cd /Users/dila/Docs/Code/los-grisales && npx tsc -b --noEmit
```

Expected: no errors.

- [ ] **Step 6: Commit**

```bash
cd /Users/dila/Docs/Code/los-grisales && git add src/lib/blog/content.test.ts src/components/seo/FaqJsonLd.test.tsx && git commit -m "$(cat <<'EOF'
tests: agrega pruebas de FAQ para capa de contenido y FaqJsonLd

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 8: Build verification + report

**Files:**
- Create: `.git/sdd/faq-report.md` (report only — not source code)

- [ ] **Step 1: Final tsc + test check**

```bash
cd /Users/dila/Docs/Code/los-grisales && npx tsc -b --noEmit && npm test -- --run
```

Expected: all clean.

- [ ] **Step 2: Run the build**

```bash
cd /Users/dila/Docs/Code/los-grisales && npm run build
```

Expected: succeeds (Puppeteer prerender runs; if Puppeteer can't launch in the sandbox, report as DONE_WITH_CONCERNS).

- [ ] **Step 3: Grep for FAQPage in prerendered HTML (if build succeeded)**

```bash
grep -r "FAQPage" /Users/dila/Docs/Code/los-grisales/dist/es/blog/ | head -5
```

If output shows matches in `index.html` files: FAQPage is in static HTML (yes).
If no output or dist doesn't exist: report n/a or build limitation.

- [ ] **Step 4: Write report**

Create `/Users/dila/Docs/Code/los-grisales/.git/sdd/faq-report.md` with:

```markdown
# FAQ Feature — Implementation Report

## Files Changed

### New files
- `src/components/blog/FaqSection.tsx` — accessible FAQ disclosure component
- `src/components/seo/FaqJsonLd.tsx` — FAQPage JSON-LD injector
- `src/components/seo/FaqJsonLd.test.tsx` — render tests for FaqJsonLd

### Modified files
- `src/lib/blog/types.ts` — added FaqItem type + faq?: FaqItem[] to BlogMeta
- `src/lib/blog/MarkdownSource.ts` — parses faq frontmatter array via toFaqArray()
- `src/lib/blog/MarkdownSource.test.ts` — added faq parse tests
- `src/lib/blog/content.test.ts` — added real-content FAQ assertion
- `src/pages/BlogPostPage.tsx` — wires FaqSection + FaqJsonLd conditionally
- `src/content/blog/cafe-de-especialidad-pereira/es.md` — 4 FAQ items
- `src/content/blog/cafe-de-especialidad-pereira/en.md` — 4 FAQ items
- `src/content/blog/cafe-de-especialidad-pereira/fr.md` — 4 FAQ items
- `src/content/blog/coffee-tour-eje-cafetero/es.md` — 4 FAQ items
- `src/content/blog/coffee-tour-eje-cafetero/en.md` — 4 FAQ items
- `src/content/blog/coffee-tour-eje-cafetero/fr.md` — 4 FAQ items
- `src/content/blog/cafe-unicentro-pereira/es.md` — 4 FAQ items
- `src/content/blog/cafe-unicentro-pereira/en.md` — 4 FAQ items
- `src/content/blog/cafe-unicentro-pereira/fr.md` — 4 FAQ items
- `src/content/blog/cafe-pereira-plaza/es.md` — 4 FAQ items
- `src/content/blog/cafe-pereira-plaza/en.md` — 4 FAQ items
- `src/content/blog/cafe-pereira-plaza/fr.md` — 4 FAQ items
- `src/content/blog/que-es-cafe-de-especialidad/es.md` — 4 FAQ items
- `src/content/blog/que-es-cafe-de-especialidad/en.md` — 4 FAQ items
- `src/content/blog/que-es-cafe-de-especialidad/fr.md` — 4 FAQ items

## FAQ counts per article (4 Q&A each, all 3 langs)

| Article | ES | EN | FR |
|---|---|---|---|
| cafe-de-especialidad-pereira | 4 | 4 | 4 |
| coffee-tour-eje-cafetero | 4 | 4 | 4 |
| cafe-unicentro-pereira | 4 | 4 | 4 |
| cafe-pereira-plaza | 4 | 4 | 4 |
| que-es-cafe-de-especialidad | 4 | 4 | 4 |

## Test Results
[Fill in: e.g. "All 25 tests pass (npm test --run)"]

## TypeScript
[Fill in: e.g. "npx tsc -b --noEmit: 0 errors"]

## Build
[Fill in: e.g. "npm run build: succeeded" or "Puppeteer could not launch in sandbox"]

## FAQPage in static HTML
[Fill in: yes / no / n-a]

## Concerns
[Fill in any limitations encountered]
```

- [ ] **Step 5: Final commit if any files remain unstaged**

Check `git status` and commit anything remaining (report file, etc. — note `.git/sdd/` is inside `.git` so it won't be tracked by git; no commit needed for the report file itself).

```bash
cd /Users/dila/Docs/Code/los-grisales && git status
```
