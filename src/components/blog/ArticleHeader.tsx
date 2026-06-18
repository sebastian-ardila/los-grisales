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
          loading="eager"
          fetchPriority="high"
          className="aspect-[1200/630] w-full rounded-3xl object-cover"
        />
      </figure>
    </header>
  )
}
