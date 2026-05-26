import { useEffect, useRef, useState } from 'react'
import { Star } from '@phosphor-icons/react'
import type { Review } from '../../data/reviews'

interface SedeLink {
  label: string
  url: string
}

interface Props {
  reviews: Review[]
  /** Single URL or multiple per sede */
  googleUrl?: string
  /** Multiple sede URLs — preferred for café bar */
  sedeLinks?: SedeLink[]
  isEn?: boolean
  /** Optional title override */
  title?: string
  /** Optional override for the review count text (e.g. "+40 reseñas"). */
  displayCount?: string
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} de 5 estrellas`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={14}
          weight="fill"
          className={i <= rating ? 'text-[#FBBC04]' : 'text-black/15'}
        />
      ))}
    </div>
  )
}

function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .map((s) => s[0]?.toUpperCase())
    .slice(0, 2)
    .join('')
}

function ReviewsCarousel({ reviews }: { reviews: Review[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const [activeIdx, setActiveIdx] = useState(0)

  useEffect(() => {
    const scroller = scrollerRef.current
    if (!scroller) return
    const cards = Array.from(scroller.children) as HTMLElement[]
    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the most-visible card and use it as the active index.
        let bestIdx = -1
        let bestRatio = 0
        entries.forEach((entry) => {
          const idx = cards.indexOf(entry.target as HTMLElement)
          if (idx < 0) return
          if (entry.intersectionRatio > bestRatio) {
            bestRatio = entry.intersectionRatio
            bestIdx = idx
          }
        })
        if (bestIdx >= 0 && bestRatio > 0.5) setActiveIdx(bestIdx)
      },
      { root: scroller, threshold: [0.5, 0.75, 1] },
    )
    cards.forEach((c) => observer.observe(c))
    return () => observer.disconnect()
  }, [reviews.length])

  const scrollTo = (idx: number) => {
    const scroller = scrollerRef.current
    if (!scroller) return
    const target = scroller.children[idx] as HTMLElement | undefined
    target?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
  }

  return (
    <div className="sm:hidden">
      <div
        ref={scrollerRef}
        className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {reviews.map((r, i) => (
          <div
            key={r.author + r.relativeDate + i}
            className="w-[82vw] max-w-[340px] shrink-0 snap-center"
          >
            <ReviewCard review={r} />
          </div>
        ))}
      </div>
      {reviews.length > 1 && (
        <div className="mt-3 flex items-center justify-center gap-1.5" role="tablist" aria-label="Reseñas">
          {reviews.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === activeIdx}
              aria-label={`Reseña ${i + 1}`}
              onClick={() => scrollTo(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === activeIdx ? 'w-5 bg-brand' : 'w-1.5 bg-black/20'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function ReviewCard({ review, tall = false }: { review: Review; tall?: boolean }) {
  return (
    <article
      style={{ backgroundColor: 'rgba(255,255,255,0.55)' }}
      className={`flex h-full flex-col gap-2 rounded-xl border border-black/10 p-3.5 shadow-[0_2px_12px_-8px_rgba(0,0,0,0.08)] ${
        tall ? 'min-h-[180px]' : ''
      }`}
    >
      <header className="flex items-start gap-2">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand/15 text-[11px] font-bold text-brand">
          {initials(review.author)}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-semibold">{review.author}</p>
          <div className="mt-0.5 flex items-center gap-1.5">
            <StarRating rating={review.rating} />
            <span className="text-[10px] opacity-60">{review.relativeDate}</span>
          </div>
        </div>
      </header>
      {review.sedeName && (
        <span className="inline-flex w-fit items-center gap-1 rounded-full bg-brand/10 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.15em] text-brand">
          {review.sedeName}
        </span>
      )}
      <p className="text-xs leading-relaxed opacity-85">{review.text}</p>
    </article>
  )
}

export default function ReviewsBlock({ reviews, googleUrl, sedeLinks, isEn, title, displayCount }: Props) {
  if (reviews.length === 0) return null

  const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
  // Primary URL for "Write a review" button
  const writeUrl = googleUrl ?? sedeLinks?.[0]?.url

  return (
    <section className="px-4 py-12 md:py-16">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-col items-center gap-3 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-black/10 px-4 py-1.5">
            <GoogleGlyph />
            <span className="text-[11px] font-semibold uppercase tracking-[0.3em] opacity-70">
              {isEn ? 'Google Reviews' : 'Reseñas en Google'}
            </span>
          </div>
          <h3 className="font-display text-2xl font-bold md:text-3xl">
            {title ?? (isEn ? 'What people say' : 'Lo que dicen los visitantes')}
          </h3>
          <div className="flex items-center gap-2">
            <StarRating rating={Math.round(avg)} />
            <span className="text-sm font-semibold">{avg.toFixed(1)}</span>
            <span className="text-sm opacity-60">·</span>
            <span className="text-sm opacity-60">
              {displayCount ?? `${reviews.length} ${isEn ? 'reviews' : 'reseñas'}`}
            </span>
          </div>
        </header>

        {/* Mobile: horizontal swipe carousel with snap. Desktop: 2/3 col grid. */}
        <ReviewsCarousel reviews={reviews.slice(0, 6)} />
        <div className="hidden gap-4 sm:grid sm:grid-cols-2 lg:grid-cols-3">
          {reviews.slice(0, 6).map((r, i) => (
            <ReviewCard key={r.author + r.relativeDate + i} review={r} />
          ))}
        </div>

        {/* CTAs — "Rate" only, Google-styled. Per sede if multiple links. */}
        <div className="mt-8 flex flex-row flex-wrap items-center justify-center gap-3">
          {sedeLinks && sedeLinks.length > 0
            ? sedeLinks.map((link) => (
                <GoogleRateButton
                  key={link.url}
                  href={link.url}
                  label={isEn ? `Rate — ${link.label}` : `Calificar — ${link.label}`}
                />
              ))
            : writeUrl && (
                <GoogleRateButton
                  href={writeUrl}
                  label={isEn ? 'Rate on Google' : 'Calificar en Google'}
                />
              )}
        </div>
      </div>
    </section>
  )
}

function GoogleRateButton({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{ backgroundColor: '#ffffff', color: '#3c4043' }}
      className="inline-flex items-center gap-1.5 rounded-full border border-[#dadce0] px-2.5 py-1.5 text-[0.68rem] font-medium shadow-[0_1px_3px_rgba(60,64,67,0.15)] transition hover:shadow-[0_2px_6px_rgba(60,64,67,0.2)] sm:gap-3 sm:px-5 sm:py-2.5 sm:text-sm"
    >
      <GoogleGlyph size={14} />
      <span style={{ fontFamily: '"Google Sans", Roboto, Arial, sans-serif' }}>{label}</span>
    </a>
  )
}

function GoogleGlyph({ size = 14 }: { size?: number } = {}) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.28 1.4-1.04 2.6-2.21 3.41v2.77h3.57c2.08-1.92 3.66-4.74 3.66-8.42z"
      />
      <path
        fill="#34A853"
        d="M12 24c2.97 0 5.46-.99 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 21.53 7.7 24 12 24z"
      />
      <path
        fill="#FBBC04"
        d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.62 0 3.06.56 4.2 1.65l3.15-3.15C17.45 1.5 14.97 0 12 0 7.7 0 3.99 2.47 2.18 6.06l3.66 2.84C6.71 6.68 9.14 4.75 12 4.75z"
      />
    </svg>
  )
}
