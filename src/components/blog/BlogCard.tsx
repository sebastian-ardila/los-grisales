import { Link } from 'react-router-dom'
import { ArrowRight } from '@phosphor-icons/react'
import type { BlogListItem, Lang } from '../../lib/blog/types'
import { formatPostDate } from '../../lib/blog/format'

interface Props {
  post: BlogListItem
  lang: Lang
}

const MIN_LABEL: Record<Lang, string> = { es: 'min de lectura', en: 'min read', fr: 'min de lecture' }
const READ_LABEL: Record<Lang, string> = { es: 'Leer artículo', en: 'Read article', fr: "Lire l'article" }

/**
 * Tarjeta de artículo en formato editorial claro: sin caja ni borde, separada
 * de las demás por una línea fina superior. Toda la tarjeta es clicable vía
 * enlace estirado.
 */
export default function BlogCard({ post, lang }: Props) {
  return (
    <article className="group relative flex flex-col border-t border-brand/15 pt-7">
      <div className="mb-3 flex flex-wrap gap-x-2 gap-y-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand/70">
        {post.tags.slice(0, 3).map((tag, i) => (
          <span key={tag} className="inline-flex items-center gap-2">
            {i > 0 && <span aria-hidden="true" className="text-accent">/</span>}
            {tag}
          </span>
        ))}
      </div>

      <h3 className="font-display text-2xl font-semibold leading-snug text-brand">
        <Link
          to={`/${lang}/blog/${post.slug}`}
          className="after:absolute after:inset-0 after:content-[''] transition-colors duration-200 focus:outline-none focus-visible:underline focus-visible:decoration-accent group-hover:text-brand-light"
        >
          {post.title}
        </Link>
      </h3>

      <p className="mt-3 text-sm leading-relaxed text-brand/75">{post.excerpt}</p>

      <div className="mt-5 flex items-center gap-2.5 text-xs text-brand/60">
        <time dateTime={post.date}>{formatPostDate(post.date, lang)}</time>
        <span aria-hidden="true">·</span>
        <span>
          {post.readingMinutes} {MIN_LABEL[lang]}
        </span>
      </div>

      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        {READ_LABEL[lang]}
        <ArrowRight
          size={15}
          weight="bold"
          aria-hidden="true"
          className="transition-transform duration-300 group-hover:translate-x-1"
        />
      </span>
    </article>
  )
}
