import { Clock } from '@phosphor-icons/react'
import type { BlogPost, Lang } from '../../lib/blog/types'
import { formatPostDate } from '../../lib/blog/format'

interface Props {
  post: BlogPost
  lang: Lang
}

const MIN_LABEL: Record<Lang, string> = { es: 'min de lectura', en: 'min read', fr: 'min de lecture' }

export default function ArticleHeader({ post, lang }: Props) {
  const coverSrc = `${import.meta.env.BASE_URL}${post.cover.replace(/^\//, '')}`
  return (
    <header className="mx-auto mb-12 max-w-3xl text-center">
      <div className="mb-5 flex flex-wrap justify-center gap-x-2 gap-y-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand/70">
        {post.tags.map((tag, i) => (
          <span key={tag} className="inline-flex items-center gap-2">
            {i > 0 && <span aria-hidden="true" className="text-accent">/</span>}
            {tag}
          </span>
        ))}
      </div>

      <h1 className="font-display text-4xl font-bold leading-tight text-brand md:text-5xl">
        {post.title}
      </h1>

      <div className="mt-6 flex items-center justify-center gap-2.5 text-sm text-brand/60">
        <span>{post.author}</span>
        <span aria-hidden="true">·</span>
        <time dateTime={post.date}>{formatPostDate(post.date, lang)}</time>
        <span aria-hidden="true">·</span>
        <Clock size={15} aria-hidden="true" />
        <span>
          {post.readingMinutes} {MIN_LABEL[lang]}
        </span>
      </div>

      {post.cover && (
        <img
          src={coverSrc}
          alt={post.coverAlt}
          className="mt-10 aspect-[16/9] w-full rounded-2xl object-cover shadow-lg shadow-black/5 ring-1 ring-brand/10"
          loading="eager"
        />
      )}
    </header>
  )
}
