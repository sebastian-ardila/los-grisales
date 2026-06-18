import { useMemo, useState } from 'react'
import type { BlogListItem, Lang } from '../../lib/blog/types'
import { cn } from '../../utils/cn'
import BlogCard from './BlogCard'

interface Props {
  posts: BlogListItem[]
  lang: Lang
}

export default function BlogGrid({ posts, lang }: Props) {
  const [active, setActive] = useState<string | null>(null)
  const allLabels: Record<Lang, string> = { es: 'Todos', en: 'All', fr: 'Tous' }
  const filterLabels: Record<Lang, string> = { es: 'Filtrar por tema', en: 'Filter by topic', fr: 'Filtrer par thème' }
  const allLabel = allLabels[lang]
  const filterLabel = filterLabels[lang]

  const tags = useMemo(
    () => Array.from(new Set(posts.flatMap((p) => p.tags))).sort(),
    [posts],
  )
  const visible = active ? posts.filter((p) => p.tags.includes(active)) : posts

  return (
    <div>
      <div role="group" aria-label={filterLabel} className="mb-10 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          aria-pressed={active === null}
          onClick={() => setActive(null)}
          className={cn(
            'rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent',
            active === null ? 'border-brand bg-brand text-white' : 'border-brand/30 text-brand hover:bg-brand/10',
          )}
        >
          {allLabel}
        </button>
        {tags.map((tag) => (
          <button
            key={tag}
            type="button"
            aria-pressed={active === tag}
            onClick={() => setActive(tag)}
            className={cn(
              'rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent',
              active === tag ? 'border-brand bg-brand text-white' : 'border-brand/30 text-brand hover:bg-brand/10',
            )}
          >
            {tag}
          </button>
        ))}
      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((post) => (
          <BlogCard key={post.id} post={post} lang={lang} />
        ))}
      </div>
    </div>
  )
}
