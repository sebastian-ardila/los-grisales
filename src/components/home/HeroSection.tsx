import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Mountains, Storefront, ShareNetwork } from '@phosphor-icons/react'
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

  const followLabel = { es: 'Síguenos en redes', en: 'Follow us on social', fr: 'Suivez-nous sur les réseaux' }[lang]
  const cafeBarLabel = { es: 'Tiendas de Café', en: 'Coffee Shops', fr: 'Boutiques de Café' }[lang]

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

      {/* Main centered content — everything in flow so it stacks cleanly on small screens */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-8 px-4 pb-10 pt-24 text-center md:gap-10 md:pb-14 md:pt-28">
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
        <div className="flex flex-col items-center gap-4">
          <div className="flex w-full max-w-sm flex-col gap-3 sm:w-auto sm:max-w-none sm:flex-row sm:gap-4">
            <button
              onClick={() => scrollToSection('tour')}
              style={{
                backgroundColor: 'var(--hero-accent)',
                color: 'var(--hero-accent-contrast)',
                boxShadow: '0 10px 30px -8px var(--hero-accent-glow)',
              }}
              className="inline-flex items-center justify-center gap-2 rounded-xl px-7 py-3.5 text-base font-bold transition hover:brightness-105 sm:px-9 sm:text-lg"
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
              className="inline-flex items-center justify-center gap-2 rounded-xl border-2 bg-black/20 px-7 py-3.5 text-base font-bold backdrop-blur-sm transition hover:bg-black/30 sm:px-9 sm:text-lg"
            >
              <Storefront size={20} weight="bold" />
              {cafeBarLabel}
            </button>
          </div>

          {/* "Follow us" — subtle chip, more visible than plain text but visually subordinate to the CTAs */}
          <button
            type="button"
            onClick={() => setSocialOpen(true)}
            className="group inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/[0.06] px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-white/80 backdrop-blur-sm transition hover:border-white/50 hover:bg-white/10 hover:text-white"
          >
            <ShareNetwork size={14} weight="duotone" />
            <span>{followLabel}</span>
          </button>
        </div>

        {/* Partners — now part of the flow so they never collide with the follow-us button */}
        <div className="animate-fade-in mt-4 flex w-full max-w-3xl flex-col items-center gap-4 md:mt-8" style={{ animationDelay: '160ms', animationFillMode: 'backwards' }}>
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
                className={`h-12 w-auto object-contain opacity-90 drop-shadow-[0_0_12px_rgba(0,0,0,0.5)] transition hover:opacity-100 md:h-20 ${
                  p.wider ? 'max-w-[180px] md:max-w-[260px]' : 'max-w-[140px] md:max-w-[200px]'
                }`}
                loading="lazy"
              />
            ))}
          </div>
        </div>
      </div>

      <SocialModal open={socialOpen} onClose={() => setSocialOpen(false)} />
    </section>
  )
}
