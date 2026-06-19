export type Lang = 'es' | 'en' | 'fr'

export interface FaqItem {
  q: string
  a: string
}

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
  /** Siempre presente (el parser usa [] cuando no hay FAQ en el frontmatter). */
  faq: FaqItem[]
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
  /** Encuentra un artículo por su slug en CUALQUIER idioma (para resolver
   *  cambios de idioma sobre slugs localizados). */
  findByAnySlug(slug: string): BlogPost | null
  getAllSlugs(): { id: string; lang: Lang; slug: string }[]
  getRelated(post: BlogMeta, lang: Lang, limit?: number): BlogListItem[]
}
