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
 * Tarjeta de novedad del hero. En móvil es una fila compacta (miniatura +
 * título + fecha) de poca altura para que las 4 se vean juntas; desde `sm`
 * es un tile con imagen de fondo, scrim y contenido superpuesto. Toda la
 * tarjeta enlaza al post.
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
  const formattedDate = formatPostDate(date, lang)

  return (
    <Link
      to={href}
      className="group relative block overflow-hidden rounded-xl shadow-lg shadow-black/30 ring-1 ring-inset ring-white/10 transition duration-300 hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-black/50 hover:ring-[#C4A962]/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C4A962] motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:rounded-2xl"
    >
      {/* MÓVIL: fila compacta de poca altura */}
      <div className="flex h-[60px] items-stretch bg-white/[0.06] backdrop-blur-sm sm:hidden">
        <div className="relative w-[76px] shrink-0 overflow-hidden">
          {image ? (
            <img
              src={image}
              alt=""
              aria-hidden="true"
              data-testid="hero-cover-image"
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-br from-[#053b39] via-[#0a5f5c] to-[#C4A962]/40"
            />
          )}
        </div>
        <div className="flex min-w-0 flex-1 flex-col justify-center gap-0.5 px-3 py-1.5">
          <div className="flex items-center gap-2">
            {eyebrow && (
              <span className="truncate text-[9px] font-bold uppercase tracking-wider text-[#C4A962]">
                {eyebrow}
              </span>
            )}
            <time dateTime={date} className="ml-auto shrink-0 text-[9px] font-medium uppercase tracking-wide text-white/55">
              {formattedDate}
            </time>
          </div>
          <h3 className="truncate font-display text-sm font-semibold leading-tight text-white">{title}</h3>
        </div>
      </div>

      {/* TABLET/ESCRITORIO: tile con imagen de fondo */}
      <div className="relative hidden aspect-[16/11] flex-col justify-end sm:flex">
        {image ? (
          <img
            src={image}
            alt=""
            aria-hidden="true"
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-[600ms] ease-out motion-safe:group-hover:scale-[1.08]"
          />
        ) : (
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-br from-[#053b39] via-[#0a5f5c] to-[#C4A962]/40 transition-transform duration-[600ms] ease-out motion-safe:group-hover:scale-[1.08]"
          />
        )}

        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/5"
        />

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
            {formattedDate}
          </time>
        </div>

        <div className="relative z-10 p-4">
          <h3 className="font-display text-lg font-semibold leading-tight text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.65)]">
            {title}
          </h3>
          <p className="mt-1 line-clamp-2 text-xs leading-snug text-white/80">{description}</p>
        </div>

        <span
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 z-10 h-[3px] origin-left scale-x-0 bg-[#C4A962] transition-transform duration-300 ease-out group-hover:scale-x-100"
        />
      </div>
    </Link>
  )
}
