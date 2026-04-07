import { useTranslation } from 'react-i18next'
import { Star } from '@phosphor-icons/react'
import { SiGooglemaps } from 'react-icons/si'
import { useSede } from '../../context/SedeContext'

export default function HeroSection({ onViewMenu }: { onViewMenu: () => void }) {
  const { t, i18n } = useTranslation()
  const isEn = i18n.language?.startsWith('en')
  const { sedeConfig } = useSede()

  return (
    <section className="relative flex min-h-[100vh] items-center justify-center overflow-hidden">
      {/* Video background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src={`${import.meta.env.BASE_URL}video-hero.webm`} type="video/webm" />
        <source src={`${import.meta.env.BASE_URL}video-hero.mp4`} type="video/mp4" />
      </video>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/65" />

      {/* Blurred black circle - 3x bigger than content */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="h-[900px] w-[900px] rounded-full bg-black/60 blur-[120px] md:h-[1000px] md:w-[1000px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center px-4 text-center">
        {/* Brand name - logo replacement */}
        <div className="animate-neon-text mb-6 flex flex-col items-center leading-none">
          <span className="text-xl tracking-[0.4em] text-brand md:text-3xl" style={{ fontFamily: 'Arial, sans-serif' }}>
            Los
          </span>
          <h1 className="font-script -mt-3 text-8xl text-brand md:-mt-5 md:text-[10rem]">
            Grisales
          </h1>
          <span className="-mt-1 text-base tracking-[0.3em] uppercase text-brand md:text-xl">
            Café &amp; Bar
          </span>
        </div>

        {/* Tagline - subtle below */}
        <p className="font-display mb-8 text-sm tracking-[0.2em] uppercase text-white/40 md:text-base">
          {t('hero.tagline')}
        </p>

        {/* Action buttons - side by side on all screens */}
        <div className="flex flex-row gap-3">
          <button
            onClick={onViewMenu}
            className="animate-neon-btn rounded-xl bg-brand px-6 py-3 text-sm font-bold text-primary transition hover:bg-brand-light sm:px-8 sm:text-base"
          >
            {t('hero.viewMenu')}
          </button>
          <a
            href="#/reservas"
            className="rounded-xl border-2 border-brand px-6 py-3 text-sm font-bold text-brand transition hover:bg-brand/10 sm:px-8 sm:text-base"
          >
            {t('hero.reserveTable')}
          </a>
        </div>

        {/* Secondary buttons - Google Reviews + How to get there */}
        <div className="mt-5 flex flex-row items-center gap-3">
          {sedeConfig?.googleReviewsUrl && (
            <a
              href={sedeConfig.googleReviewsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5 text-xs text-white/50 transition hover:border-white/30 hover:text-white/70"
            >
              <Star size={14} weight="fill" className="text-yellow-400/60" />
              {t('hero.googleReviews')}
            </a>
          )}
          {sedeConfig?.googleMapsUrl && (
            <a
              href={sedeConfig.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5 text-xs text-white/50 transition hover:border-white/30 hover:text-white/70"
            >
              <SiGooglemaps size={14} className="text-[#4285F4]/60" />
              {isEn ? 'How to get there' : 'Cómo llegar'}
            </a>
          )}
        </div>
      </div>
    </section>
  )
}
