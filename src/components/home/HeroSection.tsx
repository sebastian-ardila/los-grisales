import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Mountains, Storefront, UsersThree } from '@phosphor-icons/react'
import { useLang } from '../../utils/lang'
import SocialModal from '../ui/SocialModal'

const partners = [
  { name: 'CARDER', image: 'partners/partner-carder.webp' },
  { name: 'Alcaldía de Pereira', image: 'partners/partner-pereira.webp' },
  { name: 'Gobernación de Risaralda', image: 'partners/partner-risaralda.webp', wider: true },
]

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

export default function HeroSection() {
  const { t } = useTranslation()
  const lang = useLang()
  const [socialOpen, setSocialOpen] = useState(false)
  const heroLogo = `${import.meta.env.BASE_URL}logos/logo-dorado.webp`

  const followLabel = { es: 'Síguenos', en: 'Follow us', fr: 'Suivez-nous' }[lang]

  return (
    <section data-dark-island className="relative -mt-16 flex min-h-screen flex-col overflow-hidden">
      {/* Video background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src={`${import.meta.env.BASE_URL}hero/video-hero-3.webm`} type="video/webm" />
      </video>

      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black"
        style={{ opacity: 'var(--hero-overlay-opacity)' }}
      />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div
          className="h-[900px] w-[900px] rounded-full bg-black blur-[140px] md:h-[1100px] md:w-[1100px]"
          style={{ opacity: 'var(--hero-glow-opacity)' }}
        />
      </div>

      {/* Main centered content (logo + tagline + buttons) — vertically centered */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-8 px-4 py-8 pb-32 text-center md:gap-10 md:pb-40">
        {/* Brand */}
        <h1 className="animate-neon-text flex justify-center">
          <img
            src={heroLogo}
            alt="Los Grisales — Café & Bar"
            className="h-48 w-auto object-contain drop-shadow-[0_4px_30px_rgba(196,169,98,0.35)] md:h-64 lg:h-72"
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

        {/* Action buttons — main attention */}
        <div className="flex flex-col items-center gap-3">
          <div className="flex flex-row gap-3 md:gap-4">
            <button
              onClick={() => scrollToSection('tour')}
              style={{
                backgroundColor: 'var(--hero-accent)',
                color: 'var(--hero-accent-contrast)',
                boxShadow: '0 10px 30px -8px var(--hero-accent-glow)',
              }}
              className="inline-flex items-center gap-2 rounded-xl px-7 py-3.5 text-base font-bold transition hover:brightness-105 sm:px-9 sm:text-lg"
            >
              <Mountains size={20} weight="bold" />
              Coffee Tour
            </button>
            <button
              onClick={() => scrollToSection('cafe-bar')}
              style={{
                borderColor: 'var(--hero-secondary)',
                color: 'var(--hero-secondary-text)',
              }}
              className="inline-flex items-center gap-2 rounded-xl border-2 bg-black/20 px-7 py-3.5 text-base font-bold backdrop-blur-sm transition hover:bg-black/30 sm:px-9 sm:text-lg"
            >
              <Storefront size={20} weight="bold" />
              Café Bar
            </button>
          </div>

          {/* Subtle "follow us" trigger */}
          <button
            type="button"
            onClick={() => setSocialOpen(true)}
            className="group mt-1 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-white/55 transition hover:text-white"
          >
            <UsersThree size={15} weight="duotone" />
            <span className="underline-offset-[6px] group-hover:underline">{followLabel}</span>
          </button>
        </div>
      </div>

      <SocialModal open={socialOpen} onClose={() => setSocialOpen(false)} />

      {/* Partners — anchored to the bottom of the hero, not affecting main centering */}
      <div className="animate-fade-in absolute inset-x-0 bottom-16 z-10 mx-auto flex w-full max-w-3xl flex-col items-center gap-4 px-4 md:bottom-20" style={{ animationDelay: '160ms', animationFillMode: 'backwards' }}>
        <div className="flex items-center gap-2">
          <span className="h-px w-6 bg-white/25" />
          <span className="text-[9px] font-semibold uppercase tracking-[0.4em] text-white/70 md:text-xs">
            {{ es: 'En alianza con', en: 'In partnership with', fr: 'En partenariat avec' }[lang]}
          </span>
          <span className="h-px w-6 bg-white/25" />
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3 md:gap-x-14">
          {partners.map((p) => (
            <img
              key={p.name}
              src={`${import.meta.env.BASE_URL}${p.image}`}
              alt={p.name}
              className={`h-14 w-auto object-contain opacity-90 drop-shadow-[0_0_12px_rgba(0,0,0,0.5)] transition hover:opacity-100 md:h-20 ${
                p.wider ? 'max-w-[180px] md:max-w-[260px]' : 'max-w-[140px] md:max-w-[200px]'
              }`}
              loading="lazy"
            />
          ))}
        </div>
      </div>
    </section>
  )
}
