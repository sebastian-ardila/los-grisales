import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'
import CTA from '../components/ui/CTA'

interface StorySectionProps {
  image: string
  imageAlt: string
  kicker: string
  title: string
  paragraphs: string[]
  number: string
  align?: 'left' | 'right'
  isLast?: boolean
  ctaLabel?: string
  ctaHref?: string
}

function StorySection({ image, imageAlt, kicker, title, paragraphs, number, align = 'left', isLast, ctaLabel, ctaHref }: StorySectionProps) {
  const contentSide = align === 'right' ? 'md:ml-auto md:text-left' : ''
  const overlayDir = align === 'right' ? 'md:bg-gradient-to-l' : 'md:bg-gradient-to-r'
  const numberPos = align === 'right' ? 'md:-left-4 md:top-8' : 'md:-right-4 md:top-8'

  return (
    <section className="relative min-h-[90vh] w-full overflow-hidden">
      <img
        src={`${import.meta.env.BASE_URL}${image}`}
        alt={imageAlt}
        className="absolute inset-0 h-full w-full scale-105 object-cover transition-transform duration-[8s] ease-out hover:scale-100"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-primary/75 md:bg-primary/35" />
      <div className={`absolute inset-0 hidden md:block ${overlayDir} from-primary via-primary/85 to-transparent`} />
      {!isLast && (
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-primary via-primary/60 to-transparent" />
      )}
      <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-primary/70 to-transparent" />

      <div className="relative mx-auto flex min-h-[90vh] max-w-6xl items-center px-6 py-24 md:px-10">
        <div className={`relative w-full max-w-xl ${contentSide}`}>
          {/* Big number watermark */}
          <span
            className={`pointer-events-none absolute -top-14 left-0 select-none font-display text-[8rem] font-bold leading-none tracking-tighter text-brand/10 md:absolute md:text-[14rem] ${numberPos}`}
            aria-hidden="true"
          >
            {number}
          </span>

          <div className="relative">
            <div className="mb-5 flex items-center gap-3">
              <span className="h-px w-10 bg-brand" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.4em] text-brand">
                {kicker}
              </span>
            </div>
            <h2 className="font-display mb-7 text-3xl font-bold leading-[1.15] text-white md:text-4xl lg:text-[2.75rem]">
              {title}
            </h2>
            <div className="space-y-4">
              {paragraphs.map((p, i) => (
                <p key={i} className="text-[15px] leading-[1.75] text-white/85 md:text-[17px]">
                  {p}
                </p>
              ))}
            </div>
            {ctaLabel && ctaHref && (
              <Link
                to={ctaHref}
                className="mt-8 inline-block rounded-xl bg-brand px-8 py-3 font-bold text-primary transition hover:bg-brand-light"
              >
                {ctaLabel}
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default function HistoryPage() {
  const { t, i18n } = useTranslation()
  const { lang } = useParams()
  const isEn = i18n.language?.startsWith('en')

  return (
    <>
      {/* Lema */}
      <header className="mx-auto max-w-4xl px-6 pb-12 pt-12 text-center md:pb-20 md:pt-20">
        <div className="mx-auto mb-6 flex items-center justify-center gap-4">
          <div className="h-px w-10 bg-brand/60" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.5em] text-brand">
            {isEn ? 'Our Story' : 'Nuestra Historia'}
          </span>
          <div className="h-px w-10 bg-brand/60" />
        </div>
        <h1 className="font-display text-2xl font-light italic leading-[1.35] text-white/95 md:text-3xl lg:text-[2.5rem]">
          {t('history.lema')}
        </h1>
      </header>

      {/* Full-bleed story sections */}
      <StorySection
        image="historia-1.webp"
        imageAlt={isEn ? 'Coffee cherries at Finca Vista Hermosa' : 'Cerezas de café en Finca Vista Hermosa'}
        number="01"
        kicker={t('history.section1.kicker')}
        title={t('history.section1.title')}
        paragraphs={[t('history.section1.p1'), t('history.section1.p2')]}
        ctaLabel={isEn ? 'Visit our farm' : 'Visita nuestra finca'}
        ctaHref={`/${lang}/reservas`}
      />

      <StorySection
        image="historia-2.webp"
        imageAlt={isEn ? 'Colombian coffee landscape' : 'Paisaje cafetero colombiano'}
        number="02"
        kicker={t('history.section2.kicker')}
        title={t('history.section2.title')}
        paragraphs={[t('history.section2.p1'), t('history.section2.p2')]}
        align="right"
        ctaLabel={isEn ? 'Book Coffee Tour' : 'Reservar Coffee Tour'}
        ctaHref={`/${lang}/reservas`}
      />

      <StorySection
        image="historia-3.webp"
        imageAlt={isEn ? 'Coffee tasting in Colombia' : 'Degustación de café en Colombia'}
        number="03"
        kicker={t('history.section3.kicker')}
        title={t('history.section3.title')}
        paragraphs={[t('history.section3.p1')]}
        isLast
        ctaLabel={isEn ? 'Book your Coffee Tour' : 'Reservar Coffee Tour'}
        ctaHref={`/${lang}/reservas`}
      />

      {/* Tagline band */}
      <section className="relative overflow-hidden px-6 py-24 md:py-32">
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-[500px] w-[500px] rounded-full bg-brand/10 blur-[120px]" />
        </div>
        <div className="relative mx-auto flex max-w-3xl flex-col items-center text-center">
          <div className="mb-8 flex items-center gap-3">
            <div className="h-px w-12 bg-brand/60" />
            <div className="h-1.5 w-1.5 rotate-45 bg-brand" />
            <div className="h-px w-12 bg-brand/60" />
          </div>
          <p className="font-display text-4xl font-light leading-tight tracking-tight text-white/95 md:text-6xl">
            {t('history.tagline')}
          </p>
          <p className="font-display mt-3 text-4xl font-bold italic leading-tight text-brand md:text-6xl">
            {t('history.taglineAccent')}
          </p>
          <div className="mt-8 flex items-center gap-3">
            <div className="h-px w-12 bg-brand/60" />
            <div className="h-1.5 w-1.5 rotate-45 bg-brand" />
            <div className="h-px w-12 bg-brand/60" />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-6 pb-16">
        <CTA secondaryLabel={isEn ? 'Reserve' : 'Reservar'} secondaryHref="/reservas" />
      </div>
    </>
  )
}
