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
}

export default function HeroNoticeCard({ lang, href, title, description, date, image }: HeroNoticeCardProps) {
  return (
    <Link
      to={href}
      className="group relative flex h-24 items-end overflow-hidden rounded-xl border border-white/10 shadow-lg transition hover:border-white/25 md:h-28"
    >
      {image ? (
        <img
          src={image}
          alt=""
          role="img"
          aria-hidden="true"
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-br from-[#053b39] via-[#0a5f5c] to-[#C4A962]/40 transition-transform duration-500 group-hover:scale-105"
        />
      )}

      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/10" />

      <time
        dateTime={date}
        className="absolute right-3 top-2.5 z-10 text-[10px] font-semibold uppercase tracking-wide text-white/75"
      >
        {formatPostDate(date, lang)}
      </time>

      <div className="relative z-10 w-full p-3">
        <h3 className="text-sm font-bold leading-tight text-white drop-shadow md:text-base">{title}</h3>
        <p className="mt-0.5 line-clamp-1 text-[11px] leading-snug text-white/80 md:text-xs">{description}</p>
      </div>
    </Link>
  )
}
