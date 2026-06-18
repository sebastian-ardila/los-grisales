import type { BlogListItem, Lang } from '../../lib/blog/types'
import BlogCard from './BlogCard'

interface Props {
  posts: BlogListItem[]
  lang: Lang
}

export default function RelatedPosts({ posts, lang }: Props) {
  if (posts.length === 0) return null
  const heading = { es: 'Sigue leyendo', en: 'Keep reading', fr: 'À lire aussi' }[lang]
  return (
    <section aria-labelledby="related-heading" className="mt-20 border-t border-brand/15 pt-12">
      <h2 id="related-heading" className="mb-8 text-center font-display text-3xl font-bold text-brand">
        {heading}
      </h2>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <BlogCard key={post.id} post={post} lang={lang} />
        ))}
      </div>
    </section>
  )
}
