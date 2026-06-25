# Hero "Novedades" Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Partir el Hero de la home en dos columnas (izquierda = contenido actual, derecha = 4 cards de novedades + link al blog filtrado), crear 4 posts de blog nuevos trilingües y conectar el filtro `?cat=` de `/blog`.

**Architecture:** Las 4 cards del hero leen sus posts desde la capa de contenido existente (`blog.getAllPosts(lang)`) buscando por `id` de carpeta, así no se duplican slug/fecha. El filtro de novedades reutiliza los chips ya existentes de `BlogGrid`, conectándolos al query param `?cat=` con `useSearchParams`. La franja de partners se reubica full-width debajo del split.

**Tech Stack:** React 19 + TypeScript, react-router-dom 7, Tailwind v4, Vitest + Testing Library, contenido en Markdown (front-matter), Phosphor icons.

## Global Constraints

- Idiomas obligatorios por post: **es, en, fr** (carpeta con `es.md`, `en.md`, `fr.md`).
- `description` de cada post: **≤ 160 caracteres** (lo verifica `content.test.ts`).
- `body` de cada post: **> 500 caracteres** (lo verifica `content.test.ts`).
- Fechas de los 4 posts nuevos: `date: 2026-06-25` y `updated: 2026-06-25`.
- `id` de post = nombre de carpeta; igual en los 3 idiomas. El `slug` (frontmatter) es localizado y distinto por idioma. Las `translations` se derivan solas en `MarkdownSource` (no se escriben en el frontmatter).
- i18n: patrón actual = objetos inline `{ es, en, fr }[lang]` (no hay archivos JSON de traducción para estos textos).
- Rutas de la app llevan prefijo de idioma: `/{lang}/blog`, `/{lang}/blog/{slug}`.
- Comando de tests: `npm test` (vitest run). Lint: `npm run lint`.
- Cada post nuevo lleva el tag literal `novedades` (minúscula) en su array `tags`.

---

## File Structure

- `public/blog/negocios-verdes-carder/cover.webp` — nueva (imagen)
- `public/blog/hablemos-de-cafe/cover.webp` — nueva (imagen)
- `public/blog/zona-mundialista/cover.webp` — nueva (imagen)
- `public/blog/coffee-hour/cover.svg` — nueva (degradado CSS/SVG, no hay foto)
- `src/content/blog/negocios-verdes-carder/{es,en,fr}.md` — nuevas
- `src/content/blog/hablemos-de-cafe/{es,en,fr}.md` — nuevas
- `src/content/blog/zona-mundialista/{es,en,fr}.md` — nuevas
- `src/content/blog/coffee-hour/{es,en,fr}.md` — nuevas
- `src/lib/blog/content.test.ts` — modificar (EXPECTED 5→9 + assert tag novedades)
- `src/components/blog/BlogGrid.tsx` — modificar (filtro local → `?cat=` URL)
- `src/components/blog/BlogGrid.test.tsx` — modificar/añadir test de `?cat=`
- `src/components/home/HeroNoticeCard.tsx` — nueva (card alargada)
- `src/components/home/HeroNoticeCard.test.tsx` — nueva
- `src/components/home/HeroSection.tsx` — modificar (split 2 columnas + cards + partners abajo)

---

## Task 1: Covers (imágenes webp + degradado coffee-hour)

**Files:**
- Create: `public/blog/negocios-verdes-carder/cover.webp`
- Create: `public/blog/hablemos-de-cafe/cover.webp`
- Create: `public/blog/zona-mundialista/cover.webp`
- Create: `public/blog/coffee-hour/cover.svg`

**Interfaces:**
- Produces: 4 rutas de cover bajo `/blog/<id>/` que consumirán los posts (frontmatter `cover:`) y el hero (fondo de card, salvo coffee-hour que usa degradado CSS en el componente).

- [ ] **Step 1: Crear carpetas y convertir las 3 fotos a webp**

```bash
mkdir -p public/blog/negocios-verdes-carder public/blog/hablemos-de-cafe public/blog/zona-mundialista public/blog/coffee-hour
cwebp -q 82 "/Users/dila/Desktop/negocios verdes.png" -o public/blog/negocios-verdes-carder/cover.webp
cwebp -q 82 "/Users/dila/Downloads/Hablemos de café.jpeg" -o public/blog/hablemos-de-cafe/cover.webp
cwebp -q 82 "/Users/dila/Downloads/Zona mundialista.jpg" -o public/blog/zona-mundialista/cover.webp
```

- [ ] **Step 2: Verificar que las 3 webp existen y pesan > 0**

Run: `ls -l public/blog/*/cover.webp`
Expected: 3 archivos `cover.webp` listados con tamaño > 0.

- [ ] **Step 3: Crear el cover SVG de Coffee Hour (degradado de marca)**

Crear `public/blog/coffee-hour/cover.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#053b39"/><stop offset="0.55" stop-color="#0a5f5c"/><stop offset="1" stop-color="#C4A962"/></linearGradient></defs><rect width="1200" height="630" fill="url(#g)"/><text x="600" y="300" font-family="Georgia, serif" font-size="64" fill="#FDF8EC" text-anchor="middle">Coffee Hour</text><text x="600" y="370" font-family="Georgia, serif" font-size="30" fill="#FDF8EC" text-anchor="middle">Café Los Grisales</text></svg>
```

- [ ] **Step 4: Commit**

```bash
git add public/blog/negocios-verdes-carder public/blog/hablemos-de-cafe public/blog/zona-mundialista public/blog/coffee-hour
git commit -m "feat(blog): covers de los 4 posts de novedades (webp + svg coffee-hour)"
```

---

## Task 2: 4 posts de blog nuevos (trilingüe) + actualizar content.test

Este task crea los 12 archivos markdown y deja el suite verde. Empezamos por el test (TDD): actualizamos `content.test.ts` para esperar 9 posts; falla; luego creamos los posts hasta que pase.

**Files:**
- Modify: `src/lib/blog/content.test.ts`
- Create: `src/content/blog/negocios-verdes-carder/{es,en,fr}.md`
- Create: `src/content/blog/hablemos-de-cafe/{es,en,fr}.md`
- Create: `src/content/blog/zona-mundialista/{es,en,fr}.md`
- Create: `src/content/blog/coffee-hour/{es,en,fr}.md`

**Interfaces:**
- Produces: 4 posts resolubles vía `blog.getAllPosts(lang)` / `blog.getPost(lang, slug)`, cada uno con `id` de carpeta, `tags` que incluyen `novedades`, `date: '2026-06-25'`. Slugs por idioma:
  - `negocios-verdes-carder`: es `sostenibilidad-negocios-verdes-carder` · en `sustainable-coffee-carder` · fr `cafe-durable-carder`
  - `hablemos-de-cafe`: es `hablemos-de-cafe-unicentro-pereira` · en `lets-talk-coffee-unicentro-pereira` · fr `parlons-cafe-unicentro-pereira`
  - `zona-mundialista`: es `zona-mundialista-futbol-cafe` · en `world-cup-zone-football-coffee` · fr `zone-mondial-football-cafe`
  - `coffee-hour`: es `coffee-hour-martes-jueves` · en `coffee-hour-tuesday-thursday` · fr `coffee-hour-mardi-jeudi`

- [ ] **Step 1: Actualizar el test (failing test)**

Reemplazar el bloque `EXPECTED` y los textos "5 posts" en `src/lib/blog/content.test.ts`. El `const EXPECTED` queda:

```ts
const EXPECTED = {
  es: ['cafe-de-especialidad-pereira', 'coffee-tour-en-pereira', 'cafe-en-unicentro-pereira', 'cafe-en-pereira-plaza', 'que-es-cafe-de-especialidad', 'sostenibilidad-negocios-verdes-carder', 'hablemos-de-cafe-unicentro-pereira', 'zona-mundialista-futbol-cafe', 'coffee-hour-martes-jueves'],
  en: ['specialty-coffee-pereira', 'coffee-tour-in-pereira', 'coffee-at-unicentro-pereira', 'coffee-at-pereira-plaza', 'what-is-specialty-coffee', 'sustainable-coffee-carder', 'lets-talk-coffee-unicentro-pereira', 'world-cup-zone-football-coffee', 'coffee-hour-tuesday-thursday'],
  fr: ['cafe-de-specialite-pereira', 'coffee-tour-a-pereira', 'cafe-a-unicentro-pereira', 'cafe-a-pereira-plaza', 'quest-ce-que-le-cafe-de-specialite', 'cafe-durable-carder', 'parlons-cafe-unicentro-pereira', 'zone-mondial-football-cafe', 'coffee-hour-mardi-jeudi'],
} as const
```

Cambiar el título del `it` de `hay 5 posts con los slugs esperados` a `hay 9 posts con los slugs esperados`. Y añadir, dentro del bloque `describe('contenido real del blog', ...)`, este test nuevo (fuera del bucle de langs):

```ts
  it('los 4 posts de novedades llevan el tag "novedades" en es', () => {
    const ids = ['sostenibilidad-negocios-verdes-carder', 'hablemos-de-cafe-unicentro-pereira', 'zona-mundialista-futbol-cafe', 'coffee-hour-martes-jueves']
    for (const slug of ids) {
      const post = blog.getPost('es', slug)
      expect(post, slug).not.toBeNull()
      expect(post!.tags).toContain('novedades')
    }
  })
```

- [ ] **Step 2: Ejecutar el test y verque falla**

Run: `npm test -- src/lib/blog/content.test.ts`
Expected: FAIL (faltan slugs / posts null — los 4 posts aún no existen).

- [ ] **Step 3: Crear `negocios-verdes-carder/es.md`**

```markdown
---
slug: sostenibilidad-negocios-verdes-carder
title: "Sostenibilidad real: Negocios Verdes certificados por la CARDER"
description: "Café Los Grisales es Negocio Verde certificado por la CARDER: reutilizamos lixiviados, ahorramos agua y tenemos Sello Verde."
excerpt: "Procesos ecológicos, cero vertimientos y el Sello Verde de la CARDER: así vivimos la sostenibilidad."
keywords: ["negocios verdes", "carder", "café sostenible", "sello verde", "café los grisales"]
date: 2026-06-25
updated: 2026-06-25
author: "Café Los Grisales"
cover: /blog/negocios-verdes-carder/cover.webp
coverAlt: "Empaque de Café Los Grisales junto al sello Negocios Verdes de la CARDER"
tags: ["novedades", "sostenibilidad", "CARDER", "Pereira"]
faq: []
---

En Café Los Grisales creemos en un modelo responsable con el medio ambiente, por eso hemos desarrollado procesos ecológicos que reducen el impacto ambiental y promueven la sostenibilidad.

## Cero vertimientos y abono orgánico

Contamos con un sistema especializado para el manejo de lixiviados del café, donde estos son recolectados y reutilizados sobre la pulpa, transformándose en abono orgánico. Este proceso nos permite cerrar el ciclo natural del café y reducir significativamente los residuos, logrando además cero vertimientos de aguas.

Implementamos un sistema de lavado eficiente que permite ahorrar hasta un 90% de agua en comparación con métodos tradicionales, reafirmando nuestro compromiso con el uso responsable de los recursos.

## El Sello Verde de la CARDER

Gracias a estas prácticas, hemos sido reconocidos con el Sello Verde otorgado por la CARDER, certificación que respalda nuestro compromiso ambiental en la región.

Nuestra sostenibilidad también se vive en la finca: parte de los alimentos que ofrecemos en nuestras experiencias provienen directamente de nuestra huerta, promoviendo el consumo local, el aprovechamiento de los recursos y la reducción del desperdicio.
```

- [ ] **Step 4: Crear `negocios-verdes-carder/en.md`**

```markdown
---
slug: sustainable-coffee-carder
title: "Real sustainability: a CARDER-certified Green Business"
description: "Café Los Grisales is a CARDER-certified Green Business: we reuse coffee leachate, save water and hold the Green Seal."
excerpt: "Eco-friendly processes, zero water discharge and CARDER's Green Seal: this is how we live sustainability."
keywords: ["green business", "carder", "sustainable coffee", "green seal", "café los grisales"]
date: 2026-06-25
updated: 2026-06-25
author: "Café Los Grisales"
cover: /blog/negocios-verdes-carder/cover.webp
coverAlt: "Café Los Grisales coffee bag next to the CARDER Green Business seal"
tags: ["novedades", "sustainability", "CARDER", "Pereira"]
faq: []
---

At Café Los Grisales we believe in a model that is responsible with the environment, which is why we have developed eco-friendly processes that reduce environmental impact and promote sustainability.

## Zero discharge and organic compost

We run a specialized system to manage coffee leachate: it is collected and reused over the pulp, turning into organic compost. This process lets us close the natural cycle of coffee and significantly reduce waste, while also achieving zero water discharge.

We use an efficient washing system that saves up to 90% of water compared with traditional methods, reaffirming our commitment to the responsible use of resources.

## CARDER's Green Seal

Thanks to these practices, we have been awarded the Green Seal granted by CARDER, a certification that backs our environmental commitment in the region.

Our sustainability is also lived on the farm: part of the food we offer in our experiences comes directly from our own garden, promoting local consumption, resourcefulness and waste reduction.
```

- [ ] **Step 5: Crear `negocios-verdes-carder/fr.md`**

```markdown
---
slug: cafe-durable-carder
title: "Durabilité réelle : Entreprise Verte certifiée par la CARDER"
description: "Café Los Grisales est une Entreprise Verte certifiée par la CARDER : réutilisation des lixiviats, économie d'eau et Label Vert."
excerpt: "Procédés écologiques, zéro rejet d'eau et le Label Vert de la CARDER : voilà notre durabilité."
keywords: ["entreprise verte", "carder", "café durable", "label vert", "café los grisales"]
date: 2026-06-25
updated: 2026-06-25
author: "Café Los Grisales"
cover: /blog/negocios-verdes-carder/cover.webp
coverAlt: "Sachet de Café Los Grisales à côté du label Entreprise Verte de la CARDER"
tags: ["novedades", "durabilité", "CARDER", "Pereira"]
faq: []
---

Chez Café Los Grisales, nous croyons en un modèle responsable envers l'environnement. C'est pourquoi nous avons développé des procédés écologiques qui réduisent l'impact environnemental et favorisent la durabilité.

## Zéro rejet et compost organique

Nous disposons d'un système spécialisé de gestion des lixiviats du café : ils sont collectés et réutilisés sur la pulpe, se transformant en compost organique. Ce procédé nous permet de boucler le cycle naturel du café et de réduire considérablement les déchets, tout en atteignant zéro rejet d'eau.

Nous utilisons un système de lavage efficace qui permet d'économiser jusqu'à 90 % d'eau par rapport aux méthodes traditionnelles, réaffirmant notre engagement pour un usage responsable des ressources.

## Le Label Vert de la CARDER

Grâce à ces pratiques, nous avons reçu le Label Vert décerné par la CARDER, une certification qui atteste de notre engagement environnemental dans la région.

Notre durabilité se vit aussi à la ferme : une partie des aliments que nous proposons dans nos expériences provient directement de notre potager, favorisant la consommation locale, la valorisation des ressources et la réduction du gaspillage.
```

- [ ] **Step 6: Crear `hablemos-de-cafe/es.md`**

```markdown
---
slug: hablemos-de-cafe-unicentro-pereira
title: "Hablemos de café: charlas gratuitas en Unicentro Pereira"
description: "Cada primer viernes del mes, charlas gratuitas sobre café en nuestra burbuja de Café Bar en Unicentro Pereira. Cupos limitados."
excerpt: "Una experiencia gratuita el primer viernes de cada mes para acercarte al mundo del café."
keywords: ["hablemos de café", "café unicentro pereira", "charlas de café", "eventos café pereira", "café los grisales"]
date: 2026-06-25
updated: 2026-06-25
author: "Café Los Grisales"
cover: /blog/hablemos-de-cafe/cover.webp
coverAlt: "Charla 'Hablemos de café' en la burbuja de Café Los Grisales en Unicentro Pereira"
tags: ["novedades", "eventos", "Unicentro Pereira"]
relatedSede: unicentro
faq: []
---

En Café Los Grisales creemos que el café también se aprende, se vive y se comparte. Por eso, en nuestro punto ubicado en la plazoleta de comidas de Unicentro Pereira, hemos creado un espacio especial: **Hablemos de café**, una experiencia gratuita que se realizará el primer viernes de cada mes.

## Un tema distinto cada mes

Cada sesión estará enfocada en diferentes temas del mundo del café, como:

- Café y salud
- Métodos de preparación
- Variedades de café
- Cultura y origen del café

Estas charlas están diseñadas para acercar a las personas al mundo cafetero desde un enfoque educativo, práctico y experiencial.

## Cupos limitados

La participación es gratuita, pero los cupos son limitados. Por eso te invitamos a estar muy pendiente de nuestras redes sociales para conocer cada tema mensual y el proceso de inscripción.
```

- [ ] **Step 7: Crear `hablemos-de-cafe/en.md`**

```markdown
---
slug: lets-talk-coffee-unicentro-pereira
title: "Let's talk coffee: free talks at Unicentro Pereira"
description: "Every first Friday of the month, free coffee talks at our Café Bar bubble in Unicentro Pereira. Limited seats."
excerpt: "A free experience on the first Friday of every month to bring you closer to the world of coffee."
keywords: ["lets talk coffee", "coffee unicentro pereira", "coffee talks", "coffee events pereira", "café los grisales"]
date: 2026-06-25
updated: 2026-06-25
author: "Café Los Grisales"
cover: /blog/hablemos-de-cafe/cover.webp
coverAlt: "'Let's talk coffee' talk at the Café Los Grisales bubble in Unicentro Pereira"
tags: ["novedades", "events", "Unicentro Pereira"]
relatedSede: unicentro
faq: []
---

At Café Los Grisales we believe coffee is also something you learn, live and share. That is why, at our spot in the food court of Unicentro Pereira, we created a special space: **Let's talk coffee**, a free experience held on the first Friday of every month.

## A different topic each month

Each session focuses on a different topic from the world of coffee, such as:

- Coffee and health
- Brewing methods
- Coffee varieties
- Coffee culture and origin

These talks are designed to bring people closer to the coffee world from an educational, practical and hands-on perspective.

## Limited seats

Participation is free, but seats are limited. We invite you to keep a close eye on our social media to find out each month's topic and how to sign up.
```

- [ ] **Step 8: Crear `hablemos-de-cafe/fr.md`**

```markdown
---
slug: parlons-cafe-unicentro-pereira
title: "Parlons café : causeries gratuites à Unicentro Pereira"
description: "Chaque premier vendredi du mois, des causeries gratuites sur le café dans notre bulle Café Bar à Unicentro Pereira. Places limitées."
excerpt: "Une expérience gratuite le premier vendredi de chaque mois pour vous rapprocher du monde du café."
keywords: ["parlons café", "café unicentro pereira", "causeries café", "événements café pereira", "café los grisales"]
date: 2026-06-25
updated: 2026-06-25
author: "Café Los Grisales"
cover: /blog/hablemos-de-cafe/cover.webp
coverAlt: "Causerie « Parlons café » dans la bulle Café Los Grisales à Unicentro Pereira"
tags: ["novedades", "événements", "Unicentro Pereira"]
relatedSede: unicentro
faq: []
---

Chez Café Los Grisales, nous croyons que le café s'apprend, se vit et se partage. C'est pourquoi, à notre point situé dans l'aire de restauration d'Unicentro Pereira, nous avons créé un espace spécial : **Parlons café**, une expérience gratuite qui a lieu le premier vendredi de chaque mois.

## Un thème différent chaque mois

Chaque séance se concentre sur un thème du monde du café, comme :

- Café et santé
- Méthodes de préparation
- Variétés de café
- Culture et origine du café

Ces causeries sont conçues pour rapprocher les gens du monde du café avec une approche éducative, pratique et expérientielle.

## Places limitées

La participation est gratuite, mais les places sont limitées. Nous vous invitons à suivre de près nos réseaux sociaux pour connaître le thème de chaque mois et les modalités d'inscription.
```

- [ ] **Step 9: Crear `zona-mundialista/es.md`**

```markdown
---
slug: zona-mundialista-futbol-cafe
title: "Zona Mundialista: vive el Mundial en Café Los Grisales"
description: "Vive los partidos del Mundial en nuestras tiendas de Pereira: pantalla, ambiente y promociones especiales en cocteles y cerveza."
excerpt: "Nuestras tiendas se convierten en Zona Mundialista: pantalla, ambiente y promociones durante los partidos."
keywords: ["zona mundialista", "ver mundial pereira", "fútbol café pereira", "café los grisales", "promociones mundial"]
date: 2026-06-25
updated: 2026-06-25
author: "Café Los Grisales"
cover: /blog/zona-mundialista/cover.webp
coverAlt: "Pantalla con un partido de fútbol en una tienda de Café Los Grisales durante la Zona Mundialista"
tags: ["novedades", "eventos", "fútbol"]
faq: []
---

En Café Los Grisales nos convertimos en el punto ideal para vivir la emoción del fútbol. Durante la temporada del Mundial, nuestras tiendas de café serán **Zona Mundialista**, un espacio donde podrás disfrutar los partidos en pantalla, acompañado de un ambiente único entre café, cocteles y amigos.

## Dónde ver el Mundial en Pereira

Hemos creado este espacio para que sepas exactamente dónde ver el Mundial en Pereira:

- **CC Unicentro Pereira** – Nivel B, plazoleta de comidas
- **CC Pereira Plaza** – Local 209

## Promociones durante los partidos

Además, contamos con promociones especiales durante los partidos:

- **Cocteles:** paga 2 y lleva el 3ro gratis
- **Aguardiente Amarillo:** compra botella y recibe nachos de cortesía
- **Cubetazo de cerveza:** paga 5 y recibe 1 gratis
```

- [ ] **Step 10: Crear `zona-mundialista/en.md`**

```markdown
---
slug: world-cup-zone-football-coffee
title: "World Cup Zone: live the World Cup at Café Los Grisales"
description: "Watch the World Cup matches at our Pereira shops: big screen, great vibe and special deals on cocktails and beer."
excerpt: "Our shops become a World Cup Zone: big screen, atmosphere and deals during the matches."
keywords: ["world cup zone", "watch world cup pereira", "football coffee pereira", "café los grisales", "world cup deals"]
date: 2026-06-25
updated: 2026-06-25
author: "Café Los Grisales"
cover: /blog/zona-mundialista/cover.webp
coverAlt: "Screen showing a football match at a Café Los Grisales shop during the World Cup Zone"
tags: ["novedades", "events", "football"]
faq: []
---

At Café Los Grisales we become the ideal spot to live the thrill of football. During the World Cup season, our coffee shops turn into a **World Cup Zone**, a space where you can enjoy the matches on the big screen, surrounded by a unique atmosphere of coffee, cocktails and friends.

## Where to watch the World Cup in Pereira

We created this space so you know exactly where to watch the World Cup in Pereira:

- **CC Unicentro Pereira** – Level B, food court
- **CC Pereira Plaza** – Unit 209

## Deals during the matches

We also have special deals during the matches:

- **Cocktails:** buy 2, get the 3rd free
- **Aguardiente Amarillo:** buy a bottle and get complimentary nachos
- **Bucket of beer:** buy 5, get 1 free
```

- [ ] **Step 11: Crear `zona-mundialista/fr.md`**

```markdown
---
slug: zone-mondial-football-cafe
title: "Zone Mondial : vivez la Coupe du Monde chez Café Los Grisales"
description: "Vivez les matchs de la Coupe du Monde dans nos boutiques de Pereira : écran géant, ambiance et promos sur cocktails et bière."
excerpt: "Nos boutiques deviennent une Zone Mondial : écran géant, ambiance et promos pendant les matchs."
keywords: ["zone mondial", "voir coupe du monde pereira", "football café pereira", "café los grisales", "promos coupe du monde"]
date: 2026-06-25
updated: 2026-06-25
author: "Café Los Grisales"
cover: /blog/zona-mundialista/cover.webp
coverAlt: "Écran diffusant un match de football dans une boutique Café Los Grisales pendant la Zone Mondial"
tags: ["novedades", "événements", "football"]
faq: []
---

Chez Café Los Grisales, nous devenons l'endroit idéal pour vivre l'émotion du football. Pendant la saison de la Coupe du Monde, nos boutiques de café deviennent une **Zone Mondial**, un espace où vous pourrez profiter des matchs sur écran, dans une ambiance unique entre café, cocktails et amis.

## Où voir la Coupe du Monde à Pereira

Nous avons créé cet espace pour que vous sachiez exactement où voir la Coupe du Monde à Pereira :

- **CC Unicentro Pereira** – Niveau B, aire de restauration
- **CC Pereira Plaza** – Local 209

## Promos pendant les matchs

Nous proposons aussi des promos spéciales pendant les matchs :

- **Cocktails :** 2 achetés, le 3e offert
- **Aguardiente Amarillo :** une bouteille achetée et des nachos offerts
- **Seau de bières :** 5 achetées, 1 offerte
```

- [ ] **Step 12: Crear `coffee-hour/es.md`**

```markdown
---
slug: coffee-hour-martes-jueves
title: "Coffee Hour: martes y jueves de 4 a 7 p.m. en Café Los Grisales"
description: "Coffee Hour: martes y jueves de 4:00 a 7:00 p.m., combos a precio preferencial para compartir en nuestras tiendas de Pereira."
excerpt: "Martes y jueves de 4 a 7 p.m.: combos especiales para vivir el café como punto de encuentro."
keywords: ["coffee hour", "combos café pereira", "café los grisales", "promociones café", "plan tarde pereira"]
date: 2026-06-25
updated: 2026-06-25
author: "Café Los Grisales"
cover: /blog/coffee-hour/cover.svg
coverAlt: "Mesa con bebidas y combos de Coffee Hour en Café Los Grisales"
tags: ["novedades", "promociones"]
faq: []
---

Coffee Hour nace como un plan pensado para salir de la rutina de la semana. Hemos creado esta franja especial los **martes y jueves de 4:00 p.m. a 7:00 p.m.**, un horario perfecto para desconectarte de la rutina, reunirte con otros y vivir el café desde una experiencia más social, relajada y compartida.

Durante estas horas, encontrarás combos diseñados especialmente con precios preferenciales, pensados para compartir entre amigos, pareja o familia.

## Combos Coffee Hour

- **Combo 1:** Empanadas x6 + 2 bebidas a elegir (Cold Brew, Limonada de café, Espresso Tonic, Espresso Orange, Café frío, Latte frío o caliente)
- **Combo 2:** Mini Burgers x4 + 2 bebidas a elegir (Cold Brew, Limonada de café, Espresso Tonic, Espresso Orange, Café frío, Latte frío o caliente)
- **Combo 3:** Pizza x4 porciones + 2 cócteles de café a elegir (Espresso Martini, Mojito Café, Café Nevado, Café del Bosque)

Coffee Hour es una invitación a vivir el café como punto de encuentro, en el mejor momento del día.

## Ubicaciones

- **CC Unicentro Pereira** – Nivel B, plazoleta de comidas
- **CC Pereira Plaza** – Local 209
```

- [ ] **Step 13: Crear `coffee-hour/en.md`**

```markdown
---
slug: coffee-hour-tuesday-thursday
title: "Coffee Hour: Tuesdays & Thursdays, 4 to 7 p.m. at Café Los Grisales"
description: "Coffee Hour: Tuesdays and Thursdays from 4:00 to 7:00 p.m., combos at special prices to share at our Pereira shops."
excerpt: "Tuesdays and Thursdays, 4 to 7 p.m.: special combos to enjoy coffee as a meeting point."
keywords: ["coffee hour", "coffee combos pereira", "café los grisales", "coffee deals", "afternoon plan pereira"]
date: 2026-06-25
updated: 2026-06-25
author: "Café Los Grisales"
cover: /blog/coffee-hour/cover.svg
coverAlt: "Table with Coffee Hour drinks and combos at Café Los Grisales"
tags: ["novedades", "deals"]
faq: []
---

Coffee Hour was born as a plan to break the weekly routine. We created this special window on **Tuesdays and Thursdays from 4:00 to 7:00 p.m.**, the perfect time to disconnect, meet up with others and enjoy coffee from a more social, relaxed and shared experience.

During these hours you will find combos specially designed at preferential prices, meant to be shared with friends, your partner or family.

## Coffee Hour combos

- **Combo 1:** Empanadas x6 + 2 drinks of your choice (Cold Brew, Coffee Lemonade, Espresso Tonic, Espresso Orange, Iced Coffee, Iced or Hot Latte)
- **Combo 2:** Mini Burgers x4 + 2 drinks of your choice (Cold Brew, Coffee Lemonade, Espresso Tonic, Espresso Orange, Iced Coffee, Iced or Hot Latte)
- **Combo 3:** Pizza x4 slices + 2 coffee cocktails of your choice (Espresso Martini, Coffee Mojito, Café Nevado, Café del Bosque)

Coffee Hour is an invitation to enjoy coffee as a meeting point, at the best time of the day.

## Locations

- **CC Unicentro Pereira** – Level B, food court
- **CC Pereira Plaza** – Unit 209
```

- [ ] **Step 14: Crear `coffee-hour/fr.md`**

```markdown
---
slug: coffee-hour-mardi-jeudi
title: "Coffee Hour : mardi et jeudi de 16h à 19h chez Café Los Grisales"
description: "Coffee Hour : mardi et jeudi de 16h à 19h, des combos à prix préférentiel à partager dans nos boutiques de Pereira."
excerpt: "Mardi et jeudi de 16h à 19h : des combos spéciaux pour vivre le café comme point de rencontre."
keywords: ["coffee hour", "combos café pereira", "café los grisales", "promos café", "plan après-midi pereira"]
date: 2026-06-25
updated: 2026-06-25
author: "Café Los Grisales"
cover: /blog/coffee-hour/cover.svg
coverAlt: "Table avec boissons et combos Coffee Hour chez Café Los Grisales"
tags: ["novedades", "promotions"]
faq: []
---

Coffee Hour est né comme un plan pour sortir de la routine de la semaine. Nous avons créé cette plage spéciale les **mardi et jeudi de 16h à 19h**, le moment idéal pour décrocher, retrouver les autres et vivre le café à travers une expérience plus sociale, détendue et partagée.

Pendant ces heures, vous trouverez des combos spécialement conçus à prix préférentiels, pensés pour partager entre amis, en couple ou en famille.

## Combos Coffee Hour

- **Combo 1 :** Empanadas x6 + 2 boissons au choix (Cold Brew, Limonade au café, Espresso Tonic, Espresso Orange, Café froid, Latte froid ou chaud)
- **Combo 2 :** Mini Burgers x4 + 2 boissons au choix (Cold Brew, Limonade au café, Espresso Tonic, Espresso Orange, Café froid, Latte froid ou chaud)
- **Combo 3 :** Pizza x4 parts + 2 cocktails de café au choix (Espresso Martini, Mojito Café, Café Nevado, Café del Bosque)

Coffee Hour est une invitation à vivre le café comme point de rencontre, au meilleur moment de la journée.

## Adresses

- **CC Unicentro Pereira** – Niveau B, aire de restauration
- **CC Pereira Plaza** – Local 209
```

- [ ] **Step 15: Ejecutar el test y verque pasa**

Run: `npm test -- src/lib/blog/content.test.ts`
Expected: PASS (9 posts por idioma, descriptions ≤160, body >500, tag `novedades` presente).

- [ ] **Step 16: Commit**

```bash
git add src/content/blog/negocios-verdes-carder src/content/blog/hablemos-de-cafe src/content/blog/zona-mundialista src/content/blog/coffee-hour src/lib/blog/content.test.ts
git commit -m "contenido: 4 posts de novedades (es/en/fr) + test de contenido a 9 posts"
```

---

## Task 3: Filtro `?cat=` en BlogGrid

Reutilizamos los chips existentes de `BlogGrid`, pero el estado activo pasa a leerse/escribirse en el query param `?cat=` para que el enlace del hero (`?cat=novedades`) preseleccione.

**Files:**
- Modify: `src/components/blog/BlogGrid.tsx`
- Modify: `src/components/blog/BlogGrid.test.tsx`

**Interfaces:**
- Consumes: `useSearchParams` de `react-router-dom`.
- Produces: comportamiento `/{lang}/blog?cat=<tag>` filtra por ese tag; sin `cat` o tag inexistente muestra todos.

- [ ] **Step 1: Escribir el test que falla**

Reemplazar el contenido de `src/components/blog/BlogGrid.test.tsx` por (ajustar import del helper de posts si el archivo ya tenía fixtures; usar este fixture inline):

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import BlogGrid from './BlogGrid'
import type { BlogListItem } from '../../lib/blog/types'

const base = {
  description: '', excerpt: 'x', keywords: [], date: '2026-06-25', updated: '2026-06-25',
  author: 'A', cover: '', coverAlt: 'a', faq: [], readingMinutes: 1,
  translations: { es: '', en: '', fr: '' },
}
const posts: BlogListItem[] = [
  { ...base, id: 'p1', slug: 'p1', title: 'Post Novedad', tags: ['novedades', 'eventos'] },
  { ...base, id: 'p2', slug: 'p2', title: 'Post Normal', tags: ['Pereira'] },
]

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <BlogGrid posts={posts} lang="es" />
    </MemoryRouter>,
  )
}

describe('BlogGrid filtro por ?cat=', () => {
  it('sin cat muestra todos los posts', () => {
    renderAt('/es/blog')
    expect(screen.getByText('Post Novedad')).toBeInTheDocument()
    expect(screen.getByText('Post Normal')).toBeInTheDocument()
  })

  it('cat=novedades muestra solo posts con ese tag', () => {
    renderAt('/es/blog?cat=novedades')
    expect(screen.getByText('Post Novedad')).toBeInTheDocument()
    expect(screen.queryByText('Post Normal')).not.toBeInTheDocument()
  })

  it('cat inexistente muestra todos', () => {
    renderAt('/es/blog?cat=zzz')
    expect(screen.getByText('Post Novedad')).toBeInTheDocument()
    expect(screen.getByText('Post Normal')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Ejecutar el test y verque falla**

Run: `npm test -- src/components/blog/BlogGrid.test.tsx`
Expected: FAIL (BlogGrid usa `useState`, ignora `?cat`; el caso `cat=novedades` aún muestra "Post Normal").

- [ ] **Step 3: Modificar `BlogGrid.tsx` para usar `useSearchParams`**

Reemplazar el inicio del componente. Cambiar el import superior:

```tsx
import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { BlogListItem, Lang } from '../../lib/blog/types'
import { cn } from '../../utils/cn'
import BlogCard from './BlogCard'
```

Dentro de `BlogGrid`, reemplazar la línea `const [active, setActive] = useState<string | null>(null)` y la línea de `visible` por:

```tsx
  const [searchParams, setSearchParams] = useSearchParams()
  const tags = useMemo(
    () => Array.from(new Set(posts.flatMap((p) => p.tags))).sort(),
    [posts],
  )
  const cat = searchParams.get('cat')
  const active = cat && tags.includes(cat) ? cat : null
  const visible = active ? posts.filter((p) => p.tags.includes(active)) : posts

  function select(tag: string | null) {
    const next = new URLSearchParams(searchParams)
    if (tag) next.set('cat', tag)
    else next.delete('cat')
    setSearchParams(next)
  }
```

Borrar la declaración previa de `const tags = useMemo(...)` que estaba más abajo (queda movida arriba; no debe duplicarse). En el botón "Todos" cambiar `onClick={() => setActive(null)}` por `onClick={() => select(null)}`; en los chips de tag cambiar `onClick={() => setActive(tag)}` por `onClick={() => select(tag)}`.

- [ ] **Step 4: Ejecutar el test y verque pasa**

Run: `npm test -- src/components/blog/BlogGrid.test.tsx`
Expected: PASS (3 casos verdes).

- [ ] **Step 5: Lint y commit**

```bash
npm run lint
git add src/components/blog/BlogGrid.tsx src/components/blog/BlogGrid.test.tsx
git commit -m "feat(blog): filtro de categoría vía ?cat= en BlogGrid"
```

---

## Task 4: Componente HeroNoticeCard

Card alargada y baja, clicable, con título, descripción corta, fecha e imagen de fondo (o degradado si no hay imagen).

**Files:**
- Create: `src/components/home/HeroNoticeCard.tsx`
- Create: `src/components/home/HeroNoticeCard.test.tsx`

**Interfaces:**
- Produces: `export default function HeroNoticeCard(props: HeroNoticeCardProps)` con
  `interface HeroNoticeCardProps { lang: Lang; href: string; title: string; description: string; date: string; image?: string }`.
  Renderiza un `<Link to={href}>`, muestra `title`, `description`, la fecha formateada con `formatPostDate(date, lang)`; usa `image` como fondo si está, si no aplica un degradado de marca.

- [ ] **Step 1: Escribir el test que falla**

Crear `src/components/home/HeroNoticeCard.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import HeroNoticeCard from './HeroNoticeCard'

function renderCard(props: Partial<React.ComponentProps<typeof HeroNoticeCard>> = {}) {
  return render(
    <MemoryRouter>
      <HeroNoticeCard
        lang="es"
        href="/es/blog/mi-post"
        title="Sostenibilidad real"
        description="Somos Negocios Verdes certificados por la CARDER"
        date="2026-06-25"
        {...props}
      />
    </MemoryRouter>,
  )
}

describe('HeroNoticeCard', () => {
  it('muestra título, descripción y enlaza al post', () => {
    renderCard()
    const link = screen.getByRole('link', { name: /sostenibilidad real/i })
    expect(link).toHaveAttribute('href', '/es/blog/mi-post')
    expect(screen.getByText('Somos Negocios Verdes certificados por la CARDER')).toBeInTheDocument()
  })

  it('muestra la fecha formateada localizada', () => {
    renderCard()
    // formatPostDate('2026-06-25','es') => "25 de junio de 2026"
    expect(screen.getByText(/2026/)).toBeInTheDocument()
  })

  it('renderiza la imagen de fondo cuando se pasa image', () => {
    renderCard({ image: '/blog/x/cover.webp' })
    const img = screen.getByRole('img', { hidden: true })
    expect(img).toHaveAttribute('src', '/blog/x/cover.webp')
  })
})
```

- [ ] **Step 2: Ejecutar el test y verque falla**

Run: `npm test -- src/components/home/HeroNoticeCard.test.tsx`
Expected: FAIL (no existe el módulo `HeroNoticeCard`).

- [ ] **Step 3: Implementar `HeroNoticeCard.tsx`**

Crear `src/components/home/HeroNoticeCard.tsx`:

```tsx
import { Link } from 'react-router-dom'
import type { Lang } from '../../lib/blog/types'
import { formatPostDate } from '../../lib/blog/format'

export interface HeroNoticeCardProps {
  lang: Lang
  href: string
  title: string
  description: string
  date: string
  image?: string
}

export default function HeroNoticeCard({ lang, href, title, description, date, image }: HeroNoticeCardProps) {
  return (
    <Link
      to={href}
      className="group relative flex h-24 items-end overflow-hidden rounded-xl border border-white/10 shadow-lg transition hover:border-white/25 md:h-28"
    >
      {image ? (
        <img
          src={image}
          alt=""
          aria-hidden="true"
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-br from-[#053b39] via-[#0a5f5c] to-[#C4A962]/40 transition-transform duration-500 group-hover:scale-105"
        />
      )}

      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/10" />

      <time
        dateTime={date}
        className="absolute right-3 top-2.5 z-10 text-[10px] font-semibold uppercase tracking-wide text-white/75"
      >
        {formatPostDate(date, lang)}
      </time>

      <div className="relative z-10 w-full p-3">
        <h3 className="text-sm font-bold leading-tight text-white drop-shadow md:text-base">{title}</h3>
        <p className="mt-0.5 line-clamp-1 text-[11px] leading-snug text-white/80 md:text-xs">{description}</p>
      </div>
    </Link>
  )
}
```

- [ ] **Step 4: Ejecutar el test y verque pasa**

Run: `npm test -- src/components/home/HeroNoticeCard.test.tsx`
Expected: PASS (3 casos verdes).

- [ ] **Step 5: Lint y commit**

```bash
npm run lint
git add src/components/home/HeroNoticeCard.tsx src/components/home/HeroNoticeCard.test.tsx
git commit -m "feat(home): componente HeroNoticeCard (card alargada de novedad)"
```

---

## Task 5: Split del Hero en 2 columnas + integración + partners abajo

Refactor de `HeroSection.tsx`: contenido actual a la columna izquierda, 4 `HeroNoticeCard` + link "Ver todas las novedades" a la derecha, partners full-width debajo del split.

**Files:**
- Modify: `src/components/home/HeroSection.tsx`

**Interfaces:**
- Consumes: `HeroNoticeCard` (Task 4), `blog` (`src/lib/blog`), `Link`.
- Produces: hero con grid `lg:grid-cols-[1.1fr_0.9fr]`; cards que enlazan a `/{lang}/blog/{slug}` resolviendo slug/fecha por `id`; link a `/{lang}/blog?cat=novedades`.

- [ ] **Step 1: Reescribir `HeroSection.tsx`**

Reemplazar el archivo completo `src/components/home/HeroSection.tsx` por:

```tsx
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Mountains, Storefront, ShareNetwork, ArrowRight } from '@phosphor-icons/react'
import { useLang } from '../../utils/lang'
import { blog } from '../../lib/blog'
import SocialModal from '../ui/SocialModal'
import HeroNoticeCard from './HeroNoticeCard'

const partners = [
  { name: 'CARDER', image: 'partners/partner-carder.webp' },
  { name: 'Alcaldía de Pereira', image: 'partners/partner-pereira.webp' },
  { name: 'Gobernación de Risaralda', image: 'partners/partner-risaralda.webp', wider: true },
]

type Localized = { es: string; en: string; fr: string }

interface Notice {
  id: string
  image?: string
  title: Localized
  description: Localized
}

const NOTICES: Notice[] = [
  {
    id: 'negocios-verdes-carder',
    image: 'blog/negocios-verdes-carder/cover.webp',
    title: { es: 'Sostenibilidad real', en: 'Real sustainability', fr: 'Durabilité réelle' },
    description: {
      es: 'Somos Negocios Verdes certificados por la CARDER',
      en: "We're a CARDER-certified Green Business",
      fr: 'Entreprise Verte certifiée par la CARDER',
    },
  },
  {
    id: 'hablemos-de-cafe',
    image: 'blog/hablemos-de-cafe/cover.webp',
    title: { es: 'Hablemos de café', en: "Let's talk coffee", fr: 'Parlons café' },
    description: {
      es: 'Primeros viernes del mes en nuestra burbuja en Unicentro',
      en: 'First Friday each month at our Unicentro coffee bar',
      fr: 'Premiers vendredis du mois à notre bar à Unicentro',
    },
  },
  {
    id: 'zona-mundialista',
    image: 'blog/zona-mundialista/cover.webp',
    title: { es: 'Zona Mundialista', en: 'World Cup Zone', fr: 'Zone Mondial' },
    description: {
      es: 'Vive el Mundial en nuestras tiendas: pantalla y promos',
      en: 'Live the World Cup in our shops: big screen & deals',
      fr: 'Vivez le Mondial dans nos boutiques : écran et promos',
    },
  },
  {
    id: 'coffee-hour',
    title: { es: 'Coffee Hour', en: 'Coffee Hour', fr: 'Coffee Hour' },
    description: {
      es: 'Martes y jueves de 4:00 a 7:00 p.m.',
      en: 'Tuesday & Thursday, 4:00–7:00 p.m.',
      fr: 'Mardi et jeudi, 16h–19h',
    },
  },
]

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

export default function HeroSection() {
  const { t } = useTranslation()
  const lang = useLang()
  const [socialOpen, setSocialOpen] = useState(false)
  const heroLogo = `${import.meta.env.BASE_URL}logos/logo-dorado.webp`
  const posts = blog.getAllPosts(lang)

  const followLabel = { es: 'Síguenos en redes', en: 'Follow us on social', fr: 'Suivez-nous sur les réseaux' }[lang]
  const cafeBarLabel = { es: 'Tiendas de Café', en: 'Coffee Shops', fr: 'Boutiques de Café' }[lang]
  const allNewsLabel = { es: 'Ver todas las novedades', en: 'See all updates', fr: 'Voir toutes les nouveautés' }[lang]

  const cards = NOTICES.map((n) => {
    const post = posts.find((p) => p.id === n.id)
    if (!post) return null
    return {
      key: n.id,
      href: `/${lang}/blog/${post.slug}`,
      title: n.title[lang],
      description: n.description[lang],
      date: post.date,
      image: n.image ? `${import.meta.env.BASE_URL}${n.image}` : undefined,
    }
  }).filter((c): c is NonNullable<typeof c> => c !== null)

  return (
    <section data-dark-island className="relative -mt-16 flex min-h-screen flex-col overflow-hidden">
      {/* Video background */}
      <video autoPlay muted loop playsInline className="absolute inset-0 h-full w-full object-cover">
        <source src={`${import.meta.env.BASE_URL}hero/video-hero-3.webm`} type="video/webm" />
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black" style={{ opacity: 'var(--hero-overlay-opacity)' }} />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div
          className="h-[900px] w-[900px] rounded-full bg-black blur-[140px] md:h-[1100px] md:w-[1100px]"
          style={{ opacity: 'var(--hero-glow-opacity)' }}
        />
      </div>

      <div className="relative z-10 flex flex-1 flex-col px-4 pb-10 pt-24 md:pb-14 md:pt-28">
        {/* Split: left = brand/CTAs, right = novedades */}
        <div className="grid flex-1 items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
          {/* LEFT */}
          <div className="flex flex-col items-center gap-8 text-center md:gap-10 lg:items-start lg:text-left">
            <h1 className="animate-neon-text flex">
              <img
                src={heroLogo}
                alt="Los Grisales — Café & Bar"
                className="h-44 w-auto object-contain drop-shadow-[0_4px_30px_rgba(196,169,98,0.35)] md:h-56 lg:h-64"
              />
            </h1>

            <div className="flex items-center gap-2">
              <span className="h-px w-6 bg-white/15" />
              <span className="text-[9px] font-semibold uppercase tracking-[0.4em] text-white/45 md:text-xs">
                {t('hero.tagline')}
              </span>
              <span className="h-px w-6 bg-white/15" />
            </div>

            <div className="flex flex-col items-center gap-4 lg:items-start">
              <div className="flex w-full max-w-sm flex-col gap-3 sm:w-auto sm:max-w-none sm:flex-row sm:gap-4">
                <button
                  onClick={() => scrollToSection('tour')}
                  style={{
                    backgroundColor: 'var(--hero-accent)',
                    color: 'var(--hero-accent-contrast)',
                    boxShadow: '0 10px 30px -8px var(--hero-accent-glow)',
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-xl px-7 py-3.5 text-base font-bold transition hover:brightness-105 sm:px-9 sm:text-lg"
                >
                  <Mountains size={20} weight="bold" />
                  Coffee Tour
                </button>
                <button
                  onClick={() => scrollToSection('cafe-bar')}
                  style={{ borderColor: 'var(--hero-secondary)', color: 'var(--hero-secondary-text)' }}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border-2 bg-black/20 px-7 py-3.5 text-base font-bold backdrop-blur-sm transition hover:bg-black/30 sm:px-9 sm:text-lg"
                >
                  <Storefront size={20} weight="bold" />
                  {cafeBarLabel}
                </button>
              </div>

              <button
                type="button"
                onClick={() => setSocialOpen(true)}
                className="group inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/[0.06] px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-white/80 backdrop-blur-sm transition hover:border-white/50 hover:bg-white/10 hover:text-white"
              >
                <ShareNetwork size={14} weight="duotone" />
                <span>{followLabel}</span>
              </button>
            </div>
          </div>

          {/* RIGHT: novedades */}
          <div className="animate-fade-in flex w-full max-w-xl flex-col gap-3 justify-self-center lg:max-w-none">
            {cards.map((c) => (
              <HeroNoticeCard
                key={c.key}
                lang={lang}
                href={c.href}
                title={c.title}
                description={c.description}
                date={c.date}
                image={c.image}
              />
            ))}
            <Link
              to={`/${lang}/blog?cat=novedades`}
              className="group mt-1 inline-flex items-center justify-center gap-1.5 text-sm font-semibold uppercase tracking-[0.18em] text-white/80 transition hover:text-white"
            >
              {allNewsLabel}
              <ArrowRight size={15} weight="bold" className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* Partners — full width below the split */}
        <div
          className="animate-fade-in mt-10 flex w-full flex-col items-center gap-4 md:mt-14"
          style={{ animationDelay: '160ms', animationFillMode: 'backwards' }}
        >
          <div className="flex items-center gap-2">
            <span className="h-px w-6 bg-white/25" />
            <span className="text-[9px] font-semibold uppercase tracking-[0.4em] text-white/70 md:text-xs">
              {{ es: 'En alianza con', en: 'In partnership with', fr: 'En partenariat avec' }[lang]}
            </span>
            <span className="h-px w-6 bg-white/25" />
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3 md:gap-x-14">
            {partners.map((p) => (
              <img
                key={p.name}
                src={`${import.meta.env.BASE_URL}${p.image}`}
                alt={p.name}
                className={`h-12 w-auto object-contain opacity-90 drop-shadow-[0_0_12px_rgba(0,0,0,0.5)] transition hover:opacity-100 md:h-20 ${
                  p.wider ? 'max-w-[180px] md:max-w-[260px]' : 'max-w-[140px] md:max-w-[200px]'
                }`}
                loading="lazy"
              />
            ))}
          </div>
        </div>
      </div>

      <SocialModal open={socialOpen} onClose={() => setSocialOpen(false)} />
    </section>
  )
}
```

- [ ] **Step 2: Verificar typecheck/lint**

Run: `npm run lint`
Expected: sin errores (revisar especialmente imports usados y el narrowing de `cards`).

- [ ] **Step 3: Ejecutar toda la suite de tests**

Run: `npm test`
Expected: PASS (incluye content.test, BlogGrid, HeroNoticeCard; ningún test del hero se rompe).

- [ ] **Step 4: Verificación visual rápida (dev server)**

Run: `npm run dev` y abrir la home. Verificar: dos columnas en desktop (logo/CTAs a la izquierda, 4 cards + "Ver todas las novedades" a la derecha), partners a todo el ancho debajo, apilado correcto en mobile, cada card navega a su post y el link va a `/{lang}/blog?cat=novedades` con el chip "novedades" activo.

- [ ] **Step 5: Commit**

```bash
git add src/components/home/HeroSection.tsx
git commit -m "feat(home): hero en 2 columnas con cards de novedades y partners abajo"
```

---

## Self-Review (cobertura del spec)

- Hero split 2 columnas → Task 5. ✓
- 4 cards alargadas con título, descripción, imagen de fondo y fecha → Task 4 (componente) + Task 5 (datos). ✓
- Cada card enlaza a un post específico → Task 5 (resolución por `id` → slug). ✓
- Quinto elemento (link a blog con filtro novedades) → Task 5 (`?cat=novedades`). ✓
- Partners "En alianza con" debajo del split, full width → Task 5. ✓
- 4 posts nuevos trilingües con tag `novedades`, fecha 2026-06-25 → Task 2. ✓
- Coffee Hour con fondo CSS (sin foto) → Task 1 (cover.svg) + Task 4 (degradado en card). ✓
- Filtro `?cat=` en /blog → Task 3. ✓
- Tests de contenido, filtro y card → Tasks 2, 3, 4. ✓
- Imágenes a webp → Task 1. ✓
