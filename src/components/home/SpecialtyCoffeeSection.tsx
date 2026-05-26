import { useTranslation } from 'react-i18next'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import {
  Coffee,
  CoffeeBean,
  Mountains,
  Storefront,
  Package,
  ArrowRight,
  Leaf,
  GlobeHemisphereWest,
} from '@phosphor-icons/react'
import SectionHeader from '../ui/SectionHeader'
import LanguageSwitcher from '../ui/LanguageSwitcher'
import { useLang, type Lang } from '../../utils/lang'

const BASE = import.meta.env.BASE_URL
const backdrop = `${BASE}coffeetour/coffeetour3.webp`
const cafeImage = `${BASE}nuestrocafe/cafe-1.webp`

type T = Record<Lang, string>

interface Spec {
  icon: React.ReactNode
  label: T
  value: T
}

const specs: Spec[] = [
  {
    icon: <GlobeHemisphereWest size={18} weight="duotone" />,
    label: { es: 'Origen', en: 'Origin', fr: 'Origine' },
    value: {
      es: 'Finca Vista Hermosa · Vereda Alto del Toro, Dosquebradas, Risaralda',
      en: 'Vista Hermosa Farm · Alto del Toro, Dosquebradas, Risaralda',
      fr: 'Ferme Vista Hermosa · Alto del Toro, Dosquebradas, Risaralda',
    },
  },
  {
    icon: <Mountains size={18} weight="duotone" />,
    label: { es: 'Altitud', en: 'Altitude', fr: 'Altitude' },
    value: { es: '1.800 m.s.n.m.', en: '1,800 masl', fr: '1 800 m' },
  },
  {
    icon: <Leaf size={18} weight="duotone" />,
    label: { es: 'Variedad', en: 'Variety', fr: 'Variété' },
    value: { es: 'Castillo Rosario', en: 'Castillo Rosario', fr: 'Castillo Rosario' },
  },
]

interface ProcessVariant {
  name: T
  weight: T
  notes: T[]
  accent: string
}

const processes: ProcessVariant[] = [
  {
    name: { es: 'Natural', en: 'Natural', fr: 'Naturel' },
    weight: { es: '340 g', en: '340 g', fr: '340 g' },
    accent: '#a04949',
    notes: [
      { es: 'Mora', en: 'Blackberry', fr: 'Mûre' },
      { es: 'Caramelo', en: 'Caramel', fr: 'Caramel' },
      { es: 'Chocolate', en: 'Chocolate', fr: 'Chocolat' },
      { es: 'Panela', en: 'Panela', fr: 'Panela' },
    ],
  },
  {
    name: { es: 'Honey', en: 'Honey', fr: 'Honey' },
    weight: { es: '340 g', en: '340 g', fr: '340 g' },
    accent: '#b88539',
    notes: [
      { es: 'Panela', en: 'Panela', fr: 'Panela' },
      { es: 'Cocoa', en: 'Cocoa', fr: 'Cacao' },
      { es: 'Almendra', en: 'Almond', fr: 'Amande' },
      { es: 'Mora', en: 'Blackberry', fr: 'Mûre' },
    ],
  },
  {
    name: { es: 'Lavado', en: 'Washed', fr: 'Lavé' },
    weight: { es: '500 g · 250 g', en: '500 g · 250 g', fr: '500 g · 250 g' },
    accent: '#3a7e7a',
    notes: [
      { es: 'Avellana', en: 'Hazelnut', fr: 'Noisette' },
      { es: 'Chocolate', en: 'Chocolate', fr: 'Chocolat' },
      { es: 'Panela', en: 'Panela', fr: 'Panela' },
      { es: 'Almendra', en: 'Almond', fr: 'Amande' },
    ],
  },
]

const sheetLabels = {
  badge: { es: 'Ficha técnica', en: 'Tech sheet', fr: 'Fiche technique' } as T,
  specialty: { es: 'Especialidad', en: 'Specialty', fr: 'Spécialité' } as T,
  processesHeading: {
    es: 'Procesos y notas de sabor',
    en: 'Processes & tasting notes',
    fr: 'Procédés et notes de dégustation',
  } as T,
  sheetLanguage: {
    es: 'Idioma',
    en: 'Language',
    fr: 'Langue',
  } as T,
  coffeeTourCta: {
    es: 'Coffee Tour',
    en: 'Coffee Tour',
    fr: 'Coffee Tour',
  } as T,
  cafeBarCta: {
    es: 'Tiendas de Café',
    en: 'Coffee Shops',
    fr: 'Boutiques de Café',
  } as T,
  productsCta: {
    es: 'Ver nuestros productos',
    en: 'View our products',
    fr: 'Voir nos produits',
  } as T,
  productAlt: {
    es: 'Café de especialidad Los Grisales',
    en: 'Los Grisales specialty coffee',
    fr: 'Café de spécialité Los Grisales',
  } as T,
}

export default function SpecialtyCoffeeSection() {
  const { i18n } = useTranslation()
  const lang = useLang()
  const navigate = useNavigate()
  const location = useLocation()

  const goToAnchor = (anchor: string) => {
    const onHome = location.pathname === `/${lang}` || location.pathname === `/${lang}/`
    if (onHome) {
      document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth' })
    } else {
      navigate(`/${lang}`)
      setTimeout(() => {
        document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth' })
      }, 80)
    }
  }

  const title = i18n.language?.startsWith('en')
    ? 'Our Coffee'
    : i18n.language?.startsWith('fr')
    ? 'Notre Café'
    : 'Nuestro Café'
  const tagline = i18n.language?.startsWith('en')
    ? 'Beans grown, harvested and processed by us. From our farm in Risaralda to your cup.'
    : i18n.language?.startsWith('fr')
    ? 'Grains cultivés, récoltés et traités par nous. De notre ferme du Risaralda à votre tasse.'
    : 'Granos cultivados, cosechados y procesados por nosotros. Desde nuestra finca en Risaralda hasta tu taza.'

  return (
    <section id="especialidad" className="px-4 py-16 md:py-24">
      <div className="mx-auto max-w-7xl">
        <SectionHeader index="03" title={title} tagline={tagline} backdrop={backdrop} />

        {/* Two-column layout: spec sheet card + product image (stretched to match left) */}
        <div className="grid items-stretch gap-8 lg:grid-cols-[1.35fr_1fr] lg:gap-10">
          {/* Left column: language switcher + spec sheet */}
          <div className="flex flex-col gap-3">
            {/* Language switcher — sits directly above the card */}
            <div className="flex items-center justify-end gap-3">
              <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-brand/70">
                {sheetLabels.sheetLanguage[lang]}
              </span>
              <LanguageSwitcher variant="light" />
            </div>

          {/* Spec sheet — single article holds everything */}
          <article
            style={{ backgroundColor: 'rgba(255,255,255,0.6)' }}
            className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-black/10 shadow-[0_8px_30px_-14px_rgba(0,0,0,0.08)]"
          >
            <header className="flex items-center gap-3 border-b border-black/8 p-6 md:px-7">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand/12 text-brand">
                <Coffee size={22} weight="duotone" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-brand/70">
                  {sheetLabels.badge[lang]}
                </p>
                <h3 className="font-display text-lg font-bold leading-tight">
                  Café Los Grisales · {sheetLabels.specialty[lang]}
                </h3>
              </div>
            </header>

            {/* Specs */}
            <dl className="grid grid-cols-1 sm:grid-cols-3">
              {specs.map((s, i) => (
                <div
                  key={s.label.es}
                  className={`flex items-start gap-3 p-5 md:px-6 ${
                    i < specs.length - 1 ? 'border-b border-black/8 sm:border-b-0 sm:border-r' : ''
                  }`}
                >
                  <dt className="shrink-0">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand/10 text-brand">
                      {s.icon}
                    </span>
                  </dt>
                  <dd className="flex-1">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-brand/70">
                      {s.label[lang]}
                    </p>
                    <p className="mt-0.5 text-sm font-medium leading-snug">{s.value[lang]}</p>
                  </dd>
                </div>
              ))}
            </dl>

            {/* Processes & tasting notes */}
            <div className="border-t border-black/8 p-6 md:px-7">
              <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.25em] text-brand/70">
                {sheetLabels.processesHeading[lang]}
              </p>
              <div className="grid gap-3 sm:grid-cols-3">
                {processes.map((p) => (
                  <div
                    key={p.name.es}
                    style={{ backgroundColor: 'rgba(255,255,255,0.6)' }}
                    className="flex flex-col gap-3 rounded-xl border border-brand/20 p-4"
                  >
                    <div className="flex items-center justify-between gap-2 border-b border-brand/15 pb-2.5">
                      <span
                        style={{ backgroundColor: p.accent, color: '#ffffff' }}
                        className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.15em] shadow-[0_4px_12px_-4px_rgba(0,0,0,0.25)]"
                      >
                        <CoffeeBean size={11} weight="fill" />
                        {p.name[lang]}
                      </span>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-brand/80">
                        {p.weight[lang]}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {p.notes.map((note) => (
                        <span
                          key={note.es}
                          className="inline-flex items-center rounded-full border border-brand/25 bg-brand/8 px-2.5 py-0.5 text-[11px] font-semibold text-brand"
                        >
                          {note[lang]}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Spacer pushes the CTAs to the bottom of the card */}
            <div className="flex-1" />

            {/* Bottom CTAs — side by side on every breakpoint */}
            <div className="grid grid-cols-2 gap-2 border-t border-black/10 p-4 sm:gap-3 sm:p-5 md:px-7">
              <button
                type="button"
                onClick={() => goToAnchor('tour')}
                style={{ color: '#ffffff' }}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-brand px-3 py-2.5 text-xs font-bold transition hover:brightness-110 sm:gap-2 sm:px-4 sm:text-sm"
              >
                <Mountains size={15} weight="bold" className="shrink-0" />
                <span className="truncate">{sheetLabels.coffeeTourCta[lang]}</span>
              </button>
              <button
                type="button"
                onClick={() => goToAnchor('cafe-bar')}
                style={{ backgroundColor: '#ffffff', color: '#064947' }}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border-2 border-brand px-3 py-2.5 text-xs font-bold transition hover:bg-brand/5 sm:gap-2 sm:px-4 sm:text-sm"
              >
                <Storefront size={15} weight="bold" className="shrink-0" />
                <span className="truncate">{sheetLabels.cafeBarCta[lang]}</span>
              </button>
            </div>
          </article>
          </div>

          {/* Right column: product image stretched + Products CTA */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative min-h-[320px] w-full flex-1 overflow-hidden">
              <img
                src={cafeImage}
                alt={sheetLabels.productAlt[lang]}
                loading="lazy"
                className="absolute inset-0 block h-full w-full object-contain"
              />
            </div>
            <Link
              to={`/${lang}/productos`}
              style={{
                backgroundColor: '#064947',
                color: '#ffffff',
                boxShadow:
                  '0 18px 40px -10px rgba(6,73,71,0.55), 0 0 0 1px rgba(255,255,255,0.6) inset, 0 0 24px -8px rgba(255,255,255,0.4)',
              }}
              className="group relative inline-flex items-center justify-center gap-2.5 self-center overflow-hidden rounded-2xl px-7 py-4 text-base font-extrabold tracking-wide transition duration-300 hover:-translate-y-0.5 hover:brightness-110 active:translate-y-0"
            >
              {/* Glossy sheen */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-white/40 opacity-0 transition duration-700 group-hover:translate-x-[400%] group-hover:opacity-100"
              />
              <Package size={22} weight="duotone" />
              <span>{sheetLabels.productsCta[lang]}</span>
              <ArrowRight
                size={18}
                weight="bold"
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
