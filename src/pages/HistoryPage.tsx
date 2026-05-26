import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useLang } from '../utils/lang'

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
  onCtaClick?: () => void
  /** When true the image sits beside the text instead of behind it. */
  splitImage?: boolean
}

function StorySection({ image, imageAlt, kicker, title, paragraphs, number, align = 'left', isLast, ctaLabel, onCtaClick, splitImage }: StorySectionProps) {
  if (splitImage) {
    return (
      <SplitStorySection
        image={image}
        imageAlt={imageAlt}
        kicker={kicker}
        title={title}
        paragraphs={paragraphs}
        number={number}
        align={align}
        isLast={isLast}
        ctaLabel={ctaLabel}
        onCtaClick={onCtaClick}
      />
    )
  }

  const contentSide = align === 'right' ? 'md:ml-auto md:text-left' : ''
  const overlayDir = align === 'right' ? 'md:bg-gradient-to-l' : 'md:bg-gradient-to-r'
  const numberPos = align === 'right' ? 'md:-left-4 md:top-8' : 'md:-right-4 md:top-8'

  return (
    <section data-dark-island className="relative min-h-[90vh] w-full overflow-hidden">
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
            {ctaLabel && onCtaClick && (
              <button
                onClick={onCtaClick}
                style={{ color: '#064947' }}
                className="mt-8 inline-block rounded-xl bg-brand px-8 py-3 font-bold transition hover:brightness-110"
              >
                {ctaLabel}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

function SplitStorySection({ image, imageAlt, kicker, title, paragraphs, number, align = 'left', isLast, ctaLabel, onCtaClick }: Omit<StorySectionProps, 'splitImage'>) {
  // align refers to TEXT position. align='left' → image on right; align='right' → image on left.
  const textCol = align === 'right' ? 'md:col-start-2' : 'md:col-start-1'
  const imageCol = align === 'right' ? 'md:col-start-1' : 'md:col-start-2'
  const numberPos = align === 'right' ? '-right-2 md:-right-4' : '-left-2 md:-left-4'

  return (
    <section data-dark-island className="relative w-full overflow-hidden bg-primary">
      {!isLast && (
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-primary via-primary/60 to-transparent" />
      )}
      <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-primary/70 to-transparent" />

      <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-6 py-20 md:grid-cols-2 md:gap-x-14 md:gap-y-8 md:px-10 md:py-28">
        {/* Header (kicker + title) — mobile: first; desktop: text column, row 1 */}
        <div className={`relative ${textCol} md:row-start-1 md:self-end`}>
          <span
            className={`pointer-events-none absolute -top-14 select-none font-display text-[8rem] font-bold leading-none tracking-tighter text-brand/10 md:-top-16 md:text-[14rem] ${numberPos}`}
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
            <h2 className="font-display text-3xl font-bold leading-[1.15] text-white md:text-4xl lg:text-[2.75rem]">
              {title}
            </h2>
          </div>
        </div>

        {/* Image — mobile: second (between title and body); desktop: image column, centered, contained */}
        <div className={`${imageCol} md:row-span-2 md:row-start-1 md:self-center`}>
          <div className="relative overflow-hidden rounded-2xl bg-black/20 shadow-[0_25px_60px_-25px_rgba(0,0,0,0.6)] ring-1 ring-white/10">
            <img
              src={`${import.meta.env.BASE_URL}${image}`}
              alt={imageAlt}
              className="block max-h-[60vh] w-full object-contain md:max-h-[640px]"
              loading="lazy"
            />
          </div>
        </div>

        {/* Body (paragraphs + CTA) — mobile: third; desktop: text column, row 2 */}
        <div className={`${textCol} md:row-start-2 md:self-start`}>
          <div className="space-y-4">
            {paragraphs.map((p, i) => (
              <p key={i} className="text-[15px] leading-[1.75] text-white/85 md:text-[17px]">
                {p}
              </p>
            ))}
          </div>
          {ctaLabel && onCtaClick && (
            <button
              onClick={onCtaClick}
              style={{ color: '#064947' }}
              className="mt-8 inline-block rounded-xl bg-brand px-8 py-3 font-bold transition hover:brightness-110"
            >
              {ctaLabel}
            </button>
          )}
        </div>
      </div>
    </section>
  )
}

export default function HistoryPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const lang = useLang()

  const goHomeToAnchor = (anchor: string) => {
    navigate(`/${lang}`)
    setTimeout(() => {
      document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  return (
    <>
      {/* Lema */}
      <header data-dark-island className="relative overflow-hidden">
        <div className="absolute inset-0 bg-primary" />
        <div className="relative mx-auto max-w-4xl px-6 pb-12 pt-12 text-center md:pb-20 md:pt-20">
          <div className="mx-auto mb-6 flex items-center justify-center gap-4">
            <div className="h-px w-10 bg-brand/60" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.5em] text-brand">
              {{ es: 'Nuestra Historia', en: 'Our Story', fr: 'Notre Histoire' }[lang]}
            </span>
            <div className="h-px w-10 bg-brand/60" />
          </div>
          <h1 className="font-display text-2xl font-light italic leading-[1.35] text-white/95 md:text-3xl lg:text-[2.5rem]">
            {t('history.lema')}
          </h1>
        </div>
      </header>

      {/* Section 1: Origen — Finca */}
      <StorySection
        image="coffeetour/cafelosgrisalesfamily.webp"
        imageAlt={{ es: 'La familia Grisales en su finca', en: 'The Grisales family on their farm', fr: 'La famille Grisales dans leur ferme' }[lang]}
        number="01"
        kicker={t('history.section1.kicker')}
        title={t('history.section1.title')}
        paragraphs={[t('history.section1.p1'), t('history.section1.p2')]}
        ctaLabel={{ es: 'Reservar Coffee Tour', en: 'Book Coffee Tour', fr: 'Réserver le Coffee Tour' }[lang]}
        onCtaClick={() => goHomeToAnchor('tour')}
        splitImage
      />

      {/* Section 2: Trazabilidad — Pereira */}
      <StorySection
        image="collage.webp"
        imageAlt={{ es: 'Collage del Café Bar Los Grisales en Pereira', en: 'Collage of the Los Grisales café bar in Pereira', fr: 'Collage du café bar Los Grisales à Pereira' }[lang]}
        number="02"
        kicker={t('history.section2.kicker')}
        title={t('history.section2.title')}
        paragraphs={[t('history.section2.p1'), t('history.section2.p2')]}
        align="right"
        ctaLabel={{ es: 'Visita nuestras tiendas de café', en: 'Visit our coffee shops', fr: 'Visiter nos boutiques de café' }[lang]}
        onCtaClick={() => goHomeToAnchor('cafe-bar')}
        splitImage
      />

      {/* Section 3: Coffee Tour — Experiencia */}
      <StorySection
        image="coffeetour/coffeetour5.webp"
        imageAlt={{ es: 'Experiencia Coffee Tour', en: 'Coffee tour experience', fr: 'Expérience Coffee Tour' }[lang]}
        number="03"
        kicker={t('history.section3.kicker')}
        title={t('history.section3.title')}
        paragraphs={[t('history.section3.p1')]}
        ctaLabel={{ es: 'Reservar Coffee Tour', en: 'Book your Coffee Tour', fr: 'Réserver votre Coffee Tour' }[lang]}
        onCtaClick={() => goHomeToAnchor('tour')}
        splitImage
      />

      {/* Section 4: Sedes que venden el café de especialidad */}
      <StorySection
        image="cafebar/terraza.webp"
        imageAlt={{ es: 'Terraza de nuestra tienda de café', en: 'Our coffee shop terrace', fr: 'Terrasse de notre boutique de café' }[lang]}
        number="04"
        kicker={t('history.section4.kicker')}
        title={t('history.section4.title')}
        paragraphs={[t('history.section4.p1'), t('history.section4.p2')]}
        align="right"
        isLast
        ctaLabel={{ es: 'Encuentra una tienda de café', en: 'Find a coffee shop', fr: 'Trouver une boutique de café' }[lang]}
        onCtaClick={() => goHomeToAnchor('cafe-bar')}
        splitImage
      />

      {/* Tagline band */}
      <section data-dark-island className="relative overflow-hidden bg-primary px-6 py-24 md:py-32">
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
    </>
  )
}
