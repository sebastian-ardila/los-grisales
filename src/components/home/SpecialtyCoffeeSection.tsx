import { useTranslation } from 'react-i18next'
import {
  Coffee,
  ArrowSquareOut,
  Mountains,
  Drop,
  Thermometer,
  Leaf,
  GlobeHemisphereWest,
  Star,
} from '@phosphor-icons/react'
import SectionHeader from '../ui/SectionHeader'

const backdrop = `${import.meta.env.BASE_URL}coffeetour/coffeetour3.webp`

interface Spec {
  icon: React.ReactNode
  label: string
  value: string
}

export default function SpecialtyCoffeeSection() {
  const { i18n } = useTranslation()
  const isEn = i18n.language?.startsWith('en')

  const specs: Spec[] = [
    {
      icon: <GlobeHemisphereWest size={18} weight="duotone" />,
      label: isEn ? 'Origin' : 'Origen',
      value: 'Finca Vista Hermosa · Alto del Toro, Risaralda',
    },
    {
      icon: <Leaf size={18} weight="duotone" />,
      label: isEn ? 'Variety' : 'Variedad',
      value: 'Castillo · Caturra · Colombia',
    },
    {
      icon: <Mountains size={18} weight="duotone" />,
      label: isEn ? 'Altitude' : 'Altitud',
      value: '1.600 – 1.800 m.s.n.m.',
    },
    {
      icon: <Drop size={18} weight="duotone" />,
      label: isEn ? 'Process' : 'Proceso',
      value: isEn ? 'Washed · Honey · Natural' : 'Lavado · Honey · Natural',
    },
    {
      icon: <Thermometer size={18} weight="duotone" />,
      label: isEn ? 'Roast' : 'Tueste',
      value: isEn ? 'Medium' : 'Medio',
    },
    {
      icon: <Star size={18} weight="duotone" />,
      label: isEn ? 'SCA Score' : 'Puntaje SCA',
      value: '84+',
    },
  ]

  const tastingNotes = isEn
    ? ['Caramel', 'Milk chocolate', 'Tropical fruits', 'Citric acidity', 'Long finish']
    : ['Caramelo', 'Chocolate de leche', 'Frutos tropicales', 'Acidez cítrica', 'Final largo']

  return (
    <section id="especialidad" className="px-4 py-16 md:py-24">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          index="03"
          title={isEn ? 'Our Coffee' : 'Nuestro Café'}
          tagline={
            isEn
              ? 'Beans grown, harvested and processed by us. From our farm in Risaralda to your cup.'
              : 'Granos cultivados, cosechados y procesados por nosotros. Desde nuestra finca en Risaralda hasta tu taza.'
          }
          backdrop={backdrop}
        />

        {/* Two-column layout: spec sheet card + tasting notes */}
        <div className="grid gap-8 lg:grid-cols-[1.35fr_1fr] lg:gap-10">
          {/* Spec sheet */}
          <article
            style={{ backgroundColor: 'rgba(255,255,255,0.6)' }}
            className="overflow-hidden rounded-2xl border border-black/10 shadow-[0_8px_30px_-14px_rgba(0,0,0,0.08)]"
          >
            <header className="flex items-center gap-3 border-b border-black/8 p-6 md:px-7">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand/12 text-brand">
                <Coffee size={22} weight="duotone" />
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-brand/70">
                  {isEn ? 'Tech sheet' : 'Ficha técnica'}
                </p>
                <h3 className="font-display text-lg font-bold leading-tight">
                  Café Los Grisales · {isEn ? 'Specialty' : 'Especialidad'}
                </h3>
              </div>
            </header>

            <dl className="grid grid-cols-1 sm:grid-cols-2">
              {specs.map((s, i) => (
                <div
                  key={s.label}
                  className={`flex items-start gap-3 p-5 md:px-7 ${
                    i < specs.length - 1 ? 'border-b border-black/8' : ''
                  } ${i % 2 === 0 ? 'sm:border-r' : ''} ${
                    i >= specs.length - 2 ? 'sm:border-b-0' : ''
                  }`}
                >
                  <dt className="shrink-0">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand/10 text-brand">
                      {s.icon}
                    </span>
                  </dt>
                  <dd className="flex-1">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-brand/70">
                      {s.label}
                    </p>
                    <p className="mt-0.5 text-sm font-medium leading-snug">{s.value}</p>
                  </dd>
                </div>
              ))}
            </dl>

            {/* PDF buttons */}
            <div className="flex flex-wrap gap-2 border-t border-black/10 p-5">
              <PdfPlaceholder flag="🇪🇸" label="Ficha técnica" />
              <PdfPlaceholder flag="🇬🇧" label="Tech sheet" />
            </div>
          </article>

          {/* Tasting notes */}
          <aside className="flex flex-col gap-6 self-start lg:pt-2">
            <div>
              <h3 className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-brand">
                <span className="h-px w-4 bg-brand" />
                {isEn ? 'Tasting notes' : 'Notas de cata'}
              </h3>
              <div className="flex flex-wrap gap-2">
                {tastingNotes.map((note) => (
                  <span
                    key={note}
                    className="inline-flex items-center rounded-full border border-brand/30 bg-brand/8 px-3 py-1 text-xs font-semibold text-brand"
                  >
                    {note}
                  </span>
                ))}
              </div>
            </div>

            <p className="text-sm leading-relaxed opacity-80">
              {isEn
                ? 'Each batch comes with full traceability — you know exactly who grew it, where, and how it was processed. We sell what we grow.'
                : 'Cada lote viene con trazabilidad completa: sabes quién lo cultivó, dónde y cómo fue procesado. Vendemos lo que cosechamos.'}
            </p>
          </aside>
        </div>
      </div>
    </section>
  )
}

/** PDF chip placeholder — does nothing yet (file not available). */
function PdfPlaceholder({ flag, label }: { flag: string; label: string }) {
  return (
    <a
      href="#"
      onClick={(e) => e.preventDefault()}
      aria-disabled="true"
      style={{ backgroundColor: '#ffffff' }}
      className="group inline-flex cursor-not-allowed items-center gap-2 rounded-xl border border-black/12 px-3.5 py-2 text-sm font-semibold opacity-70 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.06)]"
    >
      <span aria-hidden="true" className="text-base leading-none">{flag}</span>
      <span>{label}</span>
      <ArrowSquareOut size={13} className="ml-0.5 shrink-0 opacity-40" />
    </a>
  )
}
