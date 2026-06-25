# Hero "Novedades" — split en 2 columnas + 4 posts nuevos + filtro de blog

**Fecha:** 2026-06-25
**Estado:** Aprobado (diseño)

## Objetivo

Separar el Hero de la home en dos columnas. La izquierda conserva el contenido
actual (logo, tagline, botones, chip de redes). La derecha muestra 4 cards
alargadas y bajas (título, descripción corta, imagen de fondo y fecha de
publicación), cada una enlazando a una publicación específica del blog, más un
quinto elemento de texto que lleva al blog filtrado por novedades. La franja
"En alianza con" (partners) se reubica a todo el ancho **debajo** del split.

Las 4 cards apuntan a 4 publicaciones de blog **nuevas** (no existen hoy), que
se crean en los 3 idiomas (es/en/fr) con el contenido expandido proporcionado.

## Decisiones tomadas

- **Idiomas:** los 4 posts se crean en es/en/fr (traduciendo el contenido).
- **Filtro:** tag `novedades` en los 4 posts + chips de categoría en `/blog`,
  leídos desde `?cat=` (query param). El enlace del hero usa `?cat=novedades`.
- **Coffee Hour:** sin imagen propia → fondo con degradado CSS de marca (tanto
  en la card del hero como en el `cover` del post).
- **Fechas:** los 4 posts usan `date: 2026-06-25` y `updated: 2026-06-25`.

## Arquitectura y componentes

### 1. `HeroSection.tsx` (modificado)

Estructura nueva dentro de la `<section>` existente (video + overlay sin
cambios):

- Contenedor `grid` responsive:
  - `lg:grid-cols-[1.1fr_0.9fr]` con `gap` en pantallas grandes.
  - Una sola columna apilada en mobile/tablet.
- **Columna izquierda:** el bloque actual (logo, tagline, botones Coffee
  Tour / Tiendas, chip "Síguenos"). Se conserva tal cual; en desktop se alinea
  dentro de su columna, en mobile sigue centrado.
- **Columna derecha:** lista vertical de 4 `HeroNoticeCard` + un quinto
  elemento link "Ver todas las novedades →".
- **Partners ("En alianza con"):** se mueve fuera del grid, a una fila
  full-width **debajo** del split, centrada, dentro de la misma `<section>`.

Orden de apilado en mobile: contenido izquierda → 4 cards + link → partners.

### 2. `HeroNoticeCard.tsx` (nuevo)

Card alargada y baja (~96–112px de alto), todo el área clicable vía `<Link>`.

Props: `{ post: BlogListItem | null, lang, title, description, image? }`.

- Fondo: imagen (`image`) con overlay oscuro; si no hay imagen, degradado CSS
  de marca (Coffee Hour).
- Contenido: **título corto**, **descripción corta** (1 línea, truncada),
  **fecha de publicación** (esquina, vía `formatPostDate(post.date, lang)`).
- Enlace: `/{lang}/blog/{post.slug}`.
- Hover: leve zoom de la imagen + aumento de brillo/overlay.
- Si `post` es `null` (post no encontrado), la card no se renderiza (defensivo).

### 3. Configuración de las cards (en `HeroSection`)

Array local `NOTICES` con, por card:
`{ id, image?, title: {es,en,fr}, description: {es,en,fr} }`.

En render: `const posts = blog.getAllPosts(lang)`; para cada notice se busca el
post por `id` (`posts.find(p => p.id === notice.id)`) para obtener el `slug`
localizado y la `date`. Esto evita duplicar slug/fecha entre el hero y el
contenido. La card se enlaza al slug encontrado.

`id` → título card:

| id (carpeta) | Título card | Descripción corta (es) |
|---|---|---|
| `negocios-verdes-carder` | Sostenibilidad real | Somos Negocios Verdes certificados por la CARDER |
| `hablemos-de-cafe` | Hablemos de café | Primeros viernes del mes en nuestra burbuja en Unicentro |
| `zona-mundialista` | Zona Mundialista | Vive el Mundial en nuestras tiendas: pantalla y promos |
| `coffee-hour` | Coffee Hour | Martes y jueves de 4:00 a 7:00 p.m. |

### 4. Cuarto/quinto elemento — link a novedades

Fila tipo link al final de la columna derecha:
"Ver todas las novedades →" (localizado en es/en/fr) →
`/{lang}/blog?cat=novedades`.

## Contenido nuevo del blog (4 posts × 3 idiomas)

Carpetas en `src/content/blog/`:

- `negocios-verdes-carder/` (es.md, en.md, fr.md)
- `hablemos-de-cafe/`
- `zona-mundialista/`
- `coffee-hour/`

Cada `*.md` con frontmatter completo siguiendo el patrón de los posts
existentes: `slug` localizado por idioma, `title`, `description`, `excerpt`,
`keywords`, `date: 2026-06-25`, `updated: 2026-06-25`, `author`, `cover`,
`coverAlt`, `tags` (incluye `novedades`), `relatedSede` cuando aplique
(Hablemos de café / Zona Mundialista → Unicentro), `faq` (opcional, `[]` si no
hay), y `translations` (ids/slug por idioma). El cuerpo = el contenido
expandido proporcionado, traducido a en/fr.

Tags por post:

- `negocios-verdes-carder`: `["novedades", "sostenibilidad", "CARDER", "Pereira"]`
- `hablemos-de-cafe`: `["novedades", "eventos", "Unicentro Pereira"]`
- `zona-mundialista`: `["novedades", "eventos", "fútbol"]`
- `coffee-hour`: `["novedades", "promociones"]`

### Imágenes (covers + fondo de card)

Convertir a `.webp` y guardar en `public/blog/<id>/cover.webp`:

- `negocios-verdes-carder/cover.webp` ← imagen Negocios Verdes CARDER.
- `hablemos-de-cafe/cover.webp` ← imagen "Hablemos de café" (charla en Unicentro).
- `zona-mundialista/cover.webp` ← imagen pantalla del Mundial.
- `coffee-hour/` → **sin imagen**: la card usa degradado CSS de marca; el
  `cover` del post puede ser un SVG/degradado generado o reutilizar el patrón
  de cover SVG existente.

La misma imagen sirve de `cover` del post y de fondo de la card del hero.

## Filtro de novedades en `/blog`

`BlogListPage.tsx` (modificado):

- Lee `?cat=` con `useSearchParams`.
- Calcula el conjunto de categorías disponibles a partir de los tags presentes
  (al menos: Todos + Novedades). Se renderiza una fila de **chips** sobre el
  grid; el chip activo refleja `?cat`.
- Filtra `posts` por tag = `cat` (case-insensitive). Si `cat` no coincide con
  ningún tag, muestra Todos.
- Al hacer click en un chip, actualiza el query param (`setSearchParams`).
- El enlace del hero apunta a `?cat=novedades`.

## i18n

Siguiendo el patrón actual del hero (objetos `{es,en,fr}` inline):

- "Ver todas las novedades" / "See all updates" / "Voir toutes les nouveautés".
- "Novedades" / "Updates" / "Nouveautés" (chip y, si aplica, etiqueta).
- "Todos" / "All" / "Tous" (chip).
- "En alianza con" ya existe inline en el hero; se conserva.

## Tests

- Capa de contenido: los 4 posts nuevos cargan en es/en/fr, tienen el tag
  `novedades`, `date` válida y `translations` coherentes (extender
  `content.test.ts` o añadir uno análogo).
- Filtro de blog: `?cat=novedades` muestra solo posts con ese tag; `cat`
  inválido muestra todos (test de `BlogListPage`).
- Hero: las 4 cards renderizan con su título y resuelven el enlace al slug del
  post; el quinto elemento enlaza a `?cat=novedades`.

## Fuera de alcance

- Reescritura del sistema de tags a un modelo de categorías formal (se usa el
  tag `novedades` existente en el array `tags`).
- Animaciones complejas más allá del hover de las cards.
- Optimización/responsive de imágenes más allá de convertir a `.webp`.
