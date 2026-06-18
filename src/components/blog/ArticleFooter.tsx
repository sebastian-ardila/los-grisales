import { Link } from 'react-router-dom'
import type { BlogPost, Lang } from '../../lib/blog/types'

interface Props {
  post: BlogPost
  lang: Lang
}

const SEDE_ANCHOR: Record<string, string> = {
  'pereira-plaza': 'cafe-bar',
  unicentro: 'cafe-bar',
  'coffee-tour': 'tour',
}

export default function ArticleFooter({ post, lang }: Props) {
  const tourLabel = { es: 'Reserva tu Coffee Tour', en: 'Book your Coffee Tour', fr: 'Réservez votre Coffee Tour' }[lang]
  const sedeLabel = { es: 'Visita nuestras tiendas', en: 'Visit our coffee shops', fr: 'Visitez nos boutiques' }[lang]
  const anchor = post.relatedSede ? SEDE_ANCHOR[post.relatedSede] : 'cafe-bar'
  return (
    <aside className="mx-auto mt-16 max-w-2xl rounded-3xl border border-brand/15 bg-brand/5 p-8 text-center">
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link
          to={`/${lang}#tour`}
          className="rounded-full bg-brand px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-light focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          {tourLabel}
        </Link>
        <Link
          to={`/${lang}#${anchor}`}
          className="rounded-full border border-brand px-6 py-3 font-semibold text-brand transition-colors hover:bg-brand/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          {sedeLabel}
        </Link>
      </div>
    </aside>
  )
}
