# Hero: novedades curadas desde el blog

**Fecha:** 2026-07-31
**Estado:** aprobado

## Problema

Las cuatro tarjetas de novedades del hero se definen en un array `NOTICES`
dentro de `src/components/home/HeroSection.tsx`. Cada entrada repite
`eyebrow`, `title` y `description` en los tres idiomas y se cruza con el post
del blog únicamente para obtener la fecha y el enlace. Consecuencias:

- Los textos del hero viven fuera del contenido: publicar una novedad exige
  editar Markdown *y* React.
- Se duplican traducciones que el post ya tiene en sus tres archivos.
- El orden del hero es un array literal, invisible desde el contenido.

Objetivo: que las tarjetas del hero sean resúmenes de publicaciones del blog,
por defecto las cuatro más recientes, con la posibilidad de elegir cuáles
salen y en qué orden, editando solo el post.

## Diseño

### Campos nuevos de frontmatter

Cuatro campos opcionales, todos escritos en el idioma de su archivo (`es.md`,
`en.md`, `fr.md`), de modo que ninguna traducción vuelve a React:

| Campo | Tipo | Uso |
|---|---|---|
| `hero` | número 1..4 | Posición fija en el hero. Sin el campo, el post no se fija. |
| `heroEyebrow` | texto | Etiqueta dorada de la tarjeta. Sin ella, no se muestra etiqueta. |
| `heroTitle` | texto | Título corto de la tarjeta. Fallback: `title`. |
| `heroExcerpt` | texto | Descripción de una línea. Fallback: `excerpt`. |

`hero` se lee del archivo del idioma que se esté renderizando; en la práctica
se escribe idéntico en los tres, igual que `date`.

### Selección: `getHeroPosts(lang, limit = 4)`

Método nuevo de `ContentSource`, implementado en `MarkdownSource`:

1. Toma los posts del idioma con `hero` definido y lo ordena ascendente por
   ese valor. Empates: el más reciente primero.
2. Completa hasta `limit` con las publicaciones más recientes que no estén ya
   en la lista.
3. Trunca a `limit`.

Sin ningún post marcado, el resultado es exactamente "las últimas cuatro
publicaciones". Valores de `hero` no numéricos o menores que 1 se ignoran
(el post pasa a tratarse como no marcado).

### Consumo en el hero

`HeroSection` elimina el array `NOTICES` y construye las tarjetas desde
`blog.getHeroPosts(lang)`:

- `href` → `/${lang}/blog/${post.slug}`
- `eyebrow` → `post.heroEyebrow`
- `title` → `post.heroTitle ?? post.title`
- `description` → `post.heroExcerpt ?? post.excerpt`
- `image` → `post.cover`
- `date` → `post.date`

`HeroNoticeCard` no cambia: su API ya coincide.

La portada pasa a salir de `cover` del post en lugar de una ruta escrita a
mano en el componente. `cover` ya viene con `/` inicial (`/blog/x/cover.webp`),
así que se compone con `import.meta.env.BASE_URL` sin duplicar la barra.

## Contenido nuevo

Dos publicaciones, cada una con `es.md`, `en.md` y `fr.md` — regla firme del
proyecto: un post sin sus tres idiomas desaparece de los idiomas faltantes.
El texto aportado por el usuario es la versión canónica de su idioma y las
otras dos son traducción de esa.

### `coffee-tour-experience` (`hero: 1`)

- Canónico: inglés. Tema: Coffee Tour cerca de Pereira, del grano a la taza,
  orientado a viajeros del Triángulo del Café.
- Slugs: `coffee-tour-experience` (en), `experiencia-coffee-tour` (es),
  `experience-coffee-tour` (fr).
- Portada: `public/blog/coffee-tour-experience/cover.webp`, derivada de
  `public/blog/coffee-tour/coffeetour1.webp`.
- Convive con el post existente `coffee-tour-eje-cafetero`: son dos artículos
  distintos por decisión explícita del usuario.

### `fiestas-cosecha` (`hero: 2`)

- Canónico: español. Tema: qué hacer en Pereira durante las Fiestas de la
  Cosecha 2026, con el café de especialidad como plan.
- Slugs: `que-hacer-en-pereira-fiestas-de-la-cosecha` (es),
  `what-to-do-in-pereira-harvest-festival` (en),
  `que-faire-a-pereira-fetes-de-la-recolte` (fr).
- Portada: `public/blog/fiestas-cosecha/cover.webp`, convertida desde el
  `.png` original.
- Menciona ambas sedes (Unicentro nivel B, plazoleta de comidas; Pereira
  Plaza local 209).

### Hero resultante

1. Coffee Tour Experience
2. Fiestas de la Cosecha
3. Negocios Verdes CARDER (`hero: 3`)
4. Coffee Hour (`hero: 4`)

"Hablemos de café" y "Zona Mundialista" salen del hero y siguen publicadas con
su fecha real, 2026-06-25. Se revierte la fecha de Zona Mundialista, que había
quedado en 2026-07-31.

## Imágenes

Las dos originales pesan 2 MB o más y cargarían dentro del hero, por encima
del LCP. Se reescalan a 1600 px de ancho máximo y se recomprimen a WebP
calidad 82, con objetivo por debajo de 200 KB — el rango de las portadas
existentes. Los originales se conservan en el repositorio.

## Pruebas

- `MarkdownSource.test.ts`: orden explícito respetado; relleno por fecha hasta
  cuatro; sin marcados devuelve las cuatro más recientes; `hero` inválido se
  ignora; `heroTitle`/`heroExcerpt` ausentes caen a `title`/`excerpt`.
- `HeroSection`: renderiza cuatro tarjetas y en el orden de `hero`.
- `content.test.ts`: los dos posts nuevos existen en los tres idiomas con
  frontmatter completo.

## Fuera de alcance

- Cambiar el diseño visual de `HeroNoticeCard`.
- Tocar el post `coffee-tour-eje-cafetero`.
- Cualquier reordenamiento del listado del blog más allá de revertir la fecha
  de Zona Mundialista.
