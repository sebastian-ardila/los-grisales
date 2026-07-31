import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Mountains, Storefront, ArrowRight } from '@phosphor-icons/react'
import { useLang } from '../../utils/lang'
import { blog } from '../../lib/blog'
import HeroNoticeCard from './HeroNoticeCard'

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
  const heroLogo = `${import.meta.env.BASE_URL}logos/logo-dorado.webp`

  const cafeBarLabel = { es: 'Tiendas de Café', en: 'Coffee Shops', fr: 'Boutiques de Café' }[lang]
  const allNewsLabel = { es: 'Ver todas las novedades', en: 'See all updates', fr: 'Voir toutes les nouveautés' }[lang]
  const noveltiesLabel = { es: 'Novedades', en: 'Latest', fr: 'Nouveautés' }[lang]
  const partnersLabel = { es: 'En alianza con', en: 'In partnership with', fr: 'En partenariat avec' }[lang]

  // Las tarjetas salen del blog: los posts marcados con `hero` en su
  // frontmatter y, si faltan, las publicaciones más recientes.
  const cards = blog.getHeroPosts(lang).map((post) => ({
    key: post.id,
    href: `/${lang}/blog/${post.slug}`,
    eyebrow: post.heroEyebrow,
    title: post.heroTitle ?? post.title,
    description: post.heroExcerpt ?? post.excerpt,
    date: post.date,
    image: post.cover
      ? `${import.meta.env.BASE_URL}${post.cover.replace(/^\//, '')}`
      : undefined,
  }))

  return (
    <section data-dark-island className="relative -mt-16 flex min-h-screen flex-col overflow-hidden">
      {/* Video background */}
      <video autoPlay muted loop playsInline className="absolute inset-0 h-full w-full object-cover">
        <source src={`${import.meta.env.BASE_URL}hero/video-hero-3.webm`} type="video/webm" />
      </video>

      {/* Overlays — tinte verde de marca + gradiente direccional para legibilidad */}
      <div aria-hidden="true" className="absolute inset-0 bg-[#03211f]/55" />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-[#03211f] via-[#03211f]/75 to-[#03211f]/25 lg:via-[#03211f]/55 lg:to-transparent"
      />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-[#03211f] to-transparent" />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-1 flex-col px-4 pb-12 pt-24 sm:px-6 md:pb-16 md:pt-28">
        {/* Split: izquierda = marca/CTAs, derecha = mosaico de novedades */}
        <div className="grid flex-1 items-center gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
          {/* LEFT */}
          <div className="flex flex-col items-center gap-7 text-center md:gap-9 lg:items-start lg:text-left">
            <h1 className="animate-neon-text flex">
              <img
                src={heroLogo}
                alt="Los Grisales — Café & Bar"
                className="h-40 w-auto object-contain drop-shadow-[0_4px_30px_rgba(196,169,98,0.4)] md:h-52 lg:h-60"
              />
            </h1>

            <div className="flex items-center gap-2.5">
              <span className="h-px w-8 bg-[#C4A962]/50" />
              <span className="text-[9px] font-semibold uppercase tracking-[0.4em] text-[#C4A962]/90 md:text-[11px]">
                {t('hero.tagline')}
              </span>
              <span className="h-px w-8 bg-[#C4A962]/50" />
            </div>

            <div className="flex w-full flex-row gap-3 sm:w-auto sm:gap-4">
              <button
                onClick={() => scrollToSection('tour')}
                style={{
                  backgroundColor: 'var(--hero-accent)',
                  color: 'var(--hero-accent-contrast)',
                  boxShadow: '0 12px 34px -10px var(--hero-accent-glow)',
                }}
                className="inline-flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-xl px-4 py-3.5 text-sm font-bold transition hover:brightness-105 sm:flex-none sm:px-9 sm:text-lg"
              >
                <Mountains size={20} weight="bold" />
                Coffee Tour
              </button>
              <button
                onClick={() => scrollToSection('cafe-bar')}
                style={{ borderColor: 'var(--hero-secondary)', color: 'var(--hero-secondary-text)' }}
                className="inline-flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-xl border-2 bg-black/25 px-4 py-3.5 text-sm font-bold backdrop-blur-sm transition hover:bg-black/40 sm:flex-none sm:px-9 sm:text-lg"
              >
                <Storefront size={20} weight="bold" />
                {cafeBarLabel}
              </button>
            </div>
          </div>

          {/* RIGHT: mosaico de novedades */}
          <div className="flex w-full min-w-0 max-w-2xl flex-col gap-4 justify-self-center lg:max-w-none">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#C4A962]">{noveltiesLabel}</span>
              <span className="h-px flex-1 bg-gradient-to-r from-[#C4A962]/50 to-transparent" />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
              {cards.map((c, i) => (
                <div
                  key={c.key}
                  className="animate-fade-in min-w-0"
                  style={{ animationDelay: `${i * 80}ms`, animationFillMode: 'backwards' }}
                >
                  <HeroNoticeCard
                    lang={lang}
                    href={c.href}
                    eyebrow={c.eyebrow}
                    title={c.title}
                    description={c.description}
                    date={c.date}
                    image={c.image}
                  />
                </div>
              ))}
            </div>

            <Link
              to={`/${lang}/blog?cat=novedades`}
              className="group inline-flex items-center justify-center gap-1.5 self-center rounded-full border border-[#C4A962]/40 px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#C4A962] transition hover:border-[#C4A962] hover:bg-[#C4A962]/10 lg:self-end"
            >
              {allNewsLabel}
              <ArrowRight size={14} weight="bold" className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* Partners — todo el ancho, debajo del split */}
        <div
          className="animate-fade-in mt-12 flex w-full flex-col items-center gap-5 border-t border-white/10 pt-8 md:mt-16"
          style={{ animationDelay: '220ms', animationFillMode: 'backwards' }}
        >
          <span className="text-[9px] font-semibold uppercase tracking-[0.4em] text-white/60 md:text-[11px]">
            {partnersLabel}
          </span>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3 md:gap-x-16">
            {partners.map((p) => (
              <img
                key={p.name}
                src={`${import.meta.env.BASE_URL}${p.image}`}
                alt={p.name}
                className={`h-11 w-auto object-contain opacity-80 drop-shadow-[0_0_12px_rgba(0,0,0,0.5)] transition hover:opacity-100 md:h-16 ${
                  p.wider ? 'max-w-[170px] md:max-w-[230px]' : 'max-w-[130px] md:max-w-[180px]'
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
