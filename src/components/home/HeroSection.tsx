import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'
import { Mountains, Storefront, CalendarDots, Coffee } from '@phosphor-icons/react'

const partners = [
  { name: 'CARDER', image: 'partner-carder.webp' },
  { name: 'Alcaldía de Pereira', image: 'partner-pereira.webp' },
  { name: 'Gobernación de Risaralda', image: 'partner-risaralda.webp', wider: true },
]

export default function HeroSection() {
  const { t, i18n } = useTranslation()
  const isEn = i18n.language?.startsWith('en')
  const { lang: langParam } = useParams()
  const lang = langParam || (isEn ? 'en' : 'es')

  return (
    <section className="relative -mt-16 flex min-h-screen flex-col overflow-hidden">
      {/* Video background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src={`${import.meta.env.BASE_URL}video-hero-3.webm`} type="video/webm" />
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/65" />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="h-[900px] w-[900px] rounded-full bg-black/70 blur-[140px] md:h-[1100px] md:w-[1100px]" />
      </div>

      {/* Top spacer compensates the -mt-16 navbar offset */}
      <div className="h-12 shrink-0 md:h-14" />

      {/* Centered content */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-8 px-4 py-8 text-center md:gap-10 md:py-12">
        {/* Brand */}
        <h1 className="animate-neon-text flex justify-center">
          <img
            src={`${import.meta.env.BASE_URL}logo-grisales-hero.webp`}
            alt="Los Grisales — Café & Bar"
            className="h-32 w-auto object-contain drop-shadow-[0_4px_30px_rgba(196,169,98,0.35)] md:h-44"
          />
        </h1>

        {/* Tagline */}
        <div className="flex items-center gap-2">
          <span className="h-px w-6 bg-white/15" />
          <span className="text-[9px] font-semibold uppercase tracking-[0.4em] text-white/45 md:text-xs">
            {t('hero.tagline')}
          </span>
          <span className="h-px w-6 bg-white/15" />
        </div>

        {/* Experiences chips — subtle, clickable shortcuts */}
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-white/55">
          <Link
            to={`/${lang}/reservas`}
            className="inline-flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.25em] transition hover:text-brand md:text-xs"
          >
            <Mountains size={12} weight="regular" />
            Coffee Tour
          </Link>
          <span className="h-3 w-px bg-white/15" aria-hidden="true" />
          <Link
            to={`/${lang}/carta`}
            className="inline-flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.25em] transition hover:text-brand md:text-xs"
          >
            <Storefront size={12} weight="regular" />
            Café Bar
          </Link>
        </div>

        {/* Action buttons — main attention */}
        <div className="flex flex-row gap-3 md:gap-4">
          <Link
            to={`/${lang}/reservas`}
            className="animate-neon-btn inline-flex items-center gap-2 rounded-xl bg-brand px-7 py-3.5 text-base font-bold text-primary shadow-[0_10px_30px_-8px_rgba(196,169,98,0.5)] transition hover:bg-brand-light hover:shadow-[0_14px_36px_-8px_rgba(196,169,98,0.6)] sm:px-9 sm:text-lg"
          >
            <CalendarDots size={20} weight="bold" />
            {isEn ? 'Reserve' : 'Reservar'}
          </Link>
          <Link
            to={`/${lang}/carta`}
            className="inline-flex items-center gap-2 rounded-xl border-2 border-brand bg-black/20 px-7 py-3.5 text-base font-bold text-brand backdrop-blur-sm transition hover:bg-brand/15 sm:px-9 sm:text-lg"
          >
            <Coffee size={20} weight="bold" />
            {isEn ? 'Menu' : 'Carta'}
          </Link>
        </div>

        {/* Partners */}
        <div className="animate-fade-in flex w-full max-w-3xl flex-col items-center gap-4" style={{ animationDelay: '160ms', animationFillMode: 'backwards' }}>
          <div className="flex items-center gap-2">
            <span className="h-px w-6 bg-white/15" />
            <span className="text-[9px] font-semibold uppercase tracking-[0.4em] text-white/45 md:text-xs">
              {isEn ? 'In partnership with' : 'En alianza con'}
            </span>
            <span className="h-px w-6 bg-white/15" />
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3 md:gap-x-14">
            {partners.map((p) => (
              <img
                key={p.name}
                src={`${import.meta.env.BASE_URL}${p.image}`}
                alt={p.name}
                className={`h-14 w-auto object-contain opacity-60 drop-shadow-[0_0_10px_rgba(0,0,0,0.4)] transition hover:opacity-90 md:h-20 ${
                  p.wider ? 'max-w-[180px] md:max-w-[260px]' : 'max-w-[140px] md:max-w-[200px]'
                }`}
                loading="lazy"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
