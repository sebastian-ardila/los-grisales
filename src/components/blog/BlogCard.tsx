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
