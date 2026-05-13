import { useTranslation } from 'react-i18next'
import { Clock, MapPin, Storefront, Buildings, Mountains, ArrowRight, WhatsappLogo } from '@phosphor-icons/react'
import type { SedeConfig } from '../../data/types'

const sedeIcons: Record<string, typeof Storefront> = {
  'pereira-plaza': Storefront,
  'unicentro': Buildings,
  'coffee-tour': Mountains,
}

interface Props {
  sede: SedeConfig
  isEn: boolean
  onOpenWhatsapp: () => void
  compact?: boolean
}

export default function SedeCard({ sede, isEn, onOpenWhatsapp, compact = false }: Props) {
  const { t } = useTranslation()
  const Icon = sedeIcons[sede.id] ?? Storefront
  const typeLabel = sede.isCoffeeTour ? t('schedule.experience') : t('schedule.cafeBar')

  return (
    <article className="group/card flex w-full flex-col gap-5">
      {/* Hero image */}
      {sede.heroImage && !compact && (
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl">
          <img
            src={`${import.meta.env.BASE_URL}${sede.heroImage}`}
            alt={sede.nameShort}
            className="h-full w-full scale-105 object-cover transition duration-700 group-hover/card:scale-100"
          />
        </div>
      )}

      {/* Header */}
      <header className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand/12 text-brand">
          <Icon size={22} weight="duotone" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-brand/70">
            {typeLabel}
          </p>
          <h2 className="font-display text-xl font-bold leading-tight">{sede.nameShort}</h2>
        </div>
      </header>

      {!compact && (
        <div className="flex flex-col divide-y divide-black/8 rounded-2xl border border-black/8 bg-black/[0.02]">
          {/* Address */}
          <div className="flex items-start gap-3 p-4">
            <MapPin size={18} weight="fill" className="mt-0.5 shrink-0 text-brand/70" />
            <div className="flex-1">
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-brand/70">
                {isEn ? 'Location' : 'Ubicación'}
              </p>
              <p className="mt-0.5 text-sm leading-snug opacity-85">{sede.address}</p>
              {sede.googleMapsUrl && (
                <a
                  href={sede.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-brand transition hover:opacity-80"
                >
                  {isEn ? 'How to get there' : 'Cómo llegar'}
                  <ArrowRight size={12} weight="bold" />
                </a>
              )}
            </div>
          </div>

          {/* Hours */}
          <div className="flex items-start gap-3 p-4">
            <Clock size={18} weight="fill" className="mt-0.5 shrink-0 text-brand/70" />
            <div className="flex-1 space-y-0.5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-brand/70">
                {isEn ? 'Hours' : 'Horario'}
              </p>
              <div className="mt-0.5 space-y-0.5">
                {sede.schedule.map((s, i) => {
                  const hasHours = s.open !== '' && s.close !== ''
                  return (
                    <div key={i} className="flex items-baseline justify-between gap-3 text-sm">
                      <span className="opacity-85">{isEn ? s.days.en : s.days.es}</span>
                      {hasHours && (
                        <span className="font-semibold text-brand">{s.open} – {s.close}</span>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action */}
      <button
        onClick={onOpenWhatsapp}
        style={{ color: '#ffffff' }}
        className="mt-auto inline-flex items-center justify-center gap-2 rounded-xl bg-brand py-3 text-sm font-bold transition hover:brightness-110"
      >
        <WhatsappLogo size={18} weight="fill" />
        {isEn ? 'Reserve via WhatsApp' : 'Reservar por WhatsApp'}
      </button>
    </article>
  )
}
