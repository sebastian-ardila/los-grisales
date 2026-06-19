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
      <div role="group" aria-label={filterLabel} className="mb-12 flex flex-wrap justify-center gap-2.5">
        <button
          type="button"
          aria-pressed={active === null}
          onClick={() => setActive(null)}
          className={cn(
            'rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-primary',
            active === null
              ? 'bg-brand text-primary'
              : 'text-brand ring-1 ring-inset ring-brand/20 hover:text-brand hover:ring-brand/40',
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
              'rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-primary',
              active === tag
                ? 'bg-brand text-primary'
                : 'text-brand ring-1 ring-inset ring-brand/20 hover:text-brand hover:ring-brand/40',
            )}
          >
            {tag}
          </button>
        ))}
      </div>

      <div className="grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((post) => (
          <BlogCard key={post.id} post={post} lang={lang} />
        ))}
      </div>
    </div>
  )
}
