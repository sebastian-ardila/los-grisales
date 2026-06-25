import { Link } from 'react-router-dom'
import type { Lang } from '../../lib/blog/types'
import { formatPostDate } from '../../lib/blog/format'

export interface HeroNoticeCardProps {
  lang: Lang
  href: string
  title: string
  description: string
  date: string
  image?: string
  /** Etiqueta de categoría localizada (p. ej. "Evento"). Opcional. */
  eyebrow?: string
}

/**
 * Tile compacto de novedad para el mosaico del hero: imagen de fondo (o
 * degradado de marca), scrim oscuro y, encima, una etiqueta de categoría +
 * fecha arriba y el título + descripción abajo. Toda la tarjeta enlaza al post.
 */
export default function HeroNoticeCard({
  lang,
  href,
  title,
  description,
  date,
  image,
  eyebrow,
}: HeroNoticeCardProps) {
  return (
    <Link
      to={href}
      className="group relative flex aspect-[5/4] flex-col justify-end overflow-hidden rounded-2xl ring-1 ring-inset ring-white/10 transition duration-300 hover:ring-[#C4A962]/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C4A962] sm:aspect-[16/11]"
    >
      {image ? (
        <img
          src={image}
          alt=""
          aria-hidden="true"
          data-testid="hero-cover-image"
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-[600ms] ease-out group-hover:scale-[1.08]"
        />
      ) : (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-br from-[#053b39] via-[#0a5f5c] to-[#C4A962]/40 transition-transform duration-[600ms] ease-out group-hover:scale-[1.08]"
        />
      )}

      {/* Scrim para legibilidad del texto */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/5"
      />

      {/* Fila superior: categoría + fecha */}
      <div className="absolute inset-x-0 top-0 z-10 flex items-start justify-between gap-2 p-3">
        {eyebrow ? (
          <span className="whitespace-nowrap rounded-full bg-[#C4A962] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#053b39] shadow-sm">
            {eyebrow}
          </span>
        ) : (
          <span />
        )}
        <time
          dateTime={date}
          className="whitespace-nowrap rounded-full bg-black/40 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-white/85 backdrop-blur-sm"
        >
          {formatPostDate(date, lang)}
        </time>
      </div>

      {/* Contenido */}
      <div className="relative z-10 p-4">
        <h3 className="font-display text-lg font-semibold leading-tight text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.65)]">
          {title}
        </h3>
        <p className="mt-1 line-clamp-2 text-xs leading-snug text-white/75">{description}</p>
      </div>

      {/* Barra de acento en hover */}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 z-10 h-[3px] origin-left scale-x-0 bg-[#C4A962] transition-transform duration-300 ease-out group-hover:scale-x-100"
      />
    </Link>
  )
}
