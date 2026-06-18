import { Link } from 'react-router-dom'
import type { BlogPost, Lang, SedeRef } from '../../lib/blog/types'

interface Props {
  post: BlogPost
  lang: Lang
}

const SEDE_ANCHOR: Record<SedeRef, string> = {
  'pereira-plaza': 'cafe-bar',
  unicentro: 'cafe-bar',
  'coffee-tour': 'tour',
}

const HEADING: Record<Lang, string> = {
  es: 'Vive la experiencia en Pereira',
  en: 'Live the experience in Pereira',
  fr: "Vivez l'expérience à Pereira",
}
const TOUR_LABEL: Record<Lang, string> = {
  es: 'Reserva tu Coffee Tour',
  en: 'Book your Coffee Tour',
  fr: 'Réservez votre Coffee Tour',
}
const SEDE_LABEL: Record<Lang, string> = {
  es: 'Visita nuestras tiendas',
  en: 'Visit our coffee shops',
  fr: 'Visitez nos boutiques',
}

/** CTA de cierre del artículo: panel verde de alto contraste con acento dorado. */
export default function ArticleFooter({ post, lang }: Props) {
  const anchor = post.relatedSede ? SEDE_ANCHOR[post.relatedSede] : 'cafe-bar'
  return (
    <aside className="mx-auto mt-16 max-w-2xl overflow-hidden rounded-[2rem] bg-brand px-8 py-12 text-center">
      <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-accent">
        Café Los Grisales
      </p>
      <h2 className="mx-auto mt-3 max-w-md font-display text-2xl font-semibold leading-snug text-primary md:text-3xl">
        {HEADING[lang]}
      </h2>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link
          to={`/${lang}#tour`}
          className="rounded-full bg-accent px-7 py-3 font-semibold text-brand shadow-sm transition-transform duration-200 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-brand"
        >
          {TOUR_LABEL[lang]}
        </Link>
        <Link
          to={`/${lang}#${anchor}`}
          className="rounded-full border border-primary/30 px-7 py-3 font-semibold text-primary transition-colors duration-200 hover:bg-primary/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          {SEDE_LABEL[lang]}
        </Link>
      </div>
    </aside>
  )
}
