import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Clock, MapPin, Storefront, Buildings, Mountains, ArrowSquareOut, WhatsappLogo } from '@phosphor-icons/react'
import { sedes } from '../config/sedes'
import type { SedeConfig } from '../data/types'
import CTA from '../components/ui/CTA'
import BookingAppIcon from '../components/ui/BookingAppIcon'
import WhatsappReservationModal from '../components/reservations/WhatsappReservationModal'

const sedeIcons: Record<string, typeof Storefront> = {
  'pereira-plaza': Storefront,
  'unicentro': Buildings,
  'coffee-tour': Mountains,
}

interface SedeCardProps {
  sede: SedeConfig
  isEn: boolean
  onOpenWhatsapp: () => void
}

function SedeCard({ sede, isEn, onOpenWhatsapp }: SedeCardProps) {
  const { t } = useTranslation()
  const Icon = sedeIcons[sede.id] ?? Storefront
  const typeLabel = sede.isCoffeeTour ? t('schedule.experience') : t('schedule.cafeBar')
  const isFeatured = sede.isCoffeeTour

  return (
    <article
      className={`group/card relative grid grid-rows-[auto_auto_auto_1fr] overflow-hidden rounded-2xl bg-primary transition sm:row-span-4 sm:grid-rows-subgrid ${
        isFeatured
          ? 'border border-brand/55 shadow-[0_18px_50px_-22px_rgba(196,169,98,0.35)] hover:border-brand/75'
          : 'border border-white/10 hover:border-white/25'
      }`}
    >
      {/* Background image with subtle gradient overlay */}
      {sede.heroImage && (
        <div className="pointer-events-none absolute inset-0">
          <img
            src={`${import.meta.env.BASE_URL}${sede.heroImage}`}
            alt=""
            className="h-full w-full scale-105 object-cover opacity-35 transition duration-700 group-hover/card:opacity-45"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/75 via-primary/82 to-primary/92" />
          {isFeatured && (
            <div className="absolute inset-0 bg-gradient-to-br from-brand/8 via-transparent to-brand/4" />
          )}
        </div>
      )}
      {/* HEADER */}
      <div className="relative flex items-center gap-3 px-5 pt-5 pb-4">
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${isFeatured ? 'bg-brand/25 ring-1 ring-brand/45' : 'bg-white/10 ring-1 ring-white/15'}`}>
          <Icon size={22} weight="duotone" className="text-brand" />
        </div>
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.3em] text-brand/80">
            {isFeatured && <span className="text-brand">★</span>}
            {typeLabel}
          </p>
          <h2 className="font-display text-lg font-bold leading-tight text-white md:text-xl">{sede.nameShort}</h2>
        </div>
      </div>

      {/* LOCATION */}
      <div className="relative flex flex-col border-t border-white/8 px-5 py-1.5">
        <p className="mb-1 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.25em] text-white/40">
          <MapPin size={11} weight="fill" /> {isEn ? 'Location' : 'Ubicación'}
        </p>
        {sede.googleMapsUrl ? (
          <a
            href={sede.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group/addr flex flex-1 flex-col justify-between gap-1 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1 transition hover:border-brand/40 hover:bg-brand/[0.08]"
            aria-label={isEn ? `Open ${sede.address} in Google Maps` : `Abrir ${sede.address} en Google Maps`}
          >
            <div className="flex items-start justify-between gap-2">
              <span className="text-[13px] leading-snug text-white/90 transition group-hover/addr:text-white">
                {sede.address}
              </span>
              <ArrowSquareOut size={14} className="mt-0.5 shrink-0 text-brand/70 transition group-hover/addr:text-brand" />
            </div>
            <span className="mt-auto flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-brand/80 transition group-hover/addr:text-brand">
              {isEn ? 'How to get there' : 'Cómo llegar'}
              <span className="inline-block transition group-hover/addr:translate-x-0.5">→</span>
            </span>
          </a>
        ) : (
          <p className="text-[13px] leading-snug text-white/85">{sede.address}</p>
        )}
      </div>

      {/* HOURS */}
      <div className="relative border-t border-white/8 px-5 py-1.5">
        <p className="mb-1 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.25em] text-white/40">
          <Clock size={11} weight="fill" /> {isEn ? 'Hours' : 'Horario'}
        </p>
        <div className="space-y-0">
          {sede.schedule.map((s, i) => (
            <div key={i} className="flex items-baseline justify-between gap-3 text-[13px] leading-tight">
              <span className="text-white/75">{isEn ? s.days.en : s.days.es}</span>
              <span className="font-semibold text-brand/95">{s.open} – {s.close}</span>
            </div>
          ))}
        </div>
      </div>

      {/* RESERVAR — uniform chip grid */}
      <div className="relative flex flex-col gap-2 border-t border-white/8 px-5 py-4">
        <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-white/55">
          <span className="h-px w-3 bg-brand" />
          {isEn ? 'Reserve' : 'Reservar'}
        </p>
        <div className={`grid gap-1.5 ${sede.isCoffeeTour ? 'grid-cols-2' : 'grid-cols-1'}`}>
          {sede.isCoffeeTour && sede.bookingApps?.map((app) => (
            <a
              key={app.name}
              href={app.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1.5 text-xs font-medium text-white/80 transition hover:border-white/25 hover:bg-white/8 hover:text-white"
            >
              <span
                className="flex h-4 w-4 shrink-0 items-center justify-center"
                style={{ color: app.brandColor ?? '#C4A962' }}
              >
                <BookingAppIcon iconKey={app.iconKey} size={14} />
              </span>
              <span className="flex-1 truncate text-left">{app.name}</span>
              <ArrowSquareOut size={10} className="shrink-0 text-white/30 transition group-hover:text-white/70" />
            </a>
          ))}
          <button
            onClick={onOpenWhatsapp}
            className="group flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1.5 text-xs font-medium text-white/80 transition hover:border-white/25 hover:bg-white/8 hover:text-white"
          >
            <span className="flex h-4 w-4 shrink-0 items-center justify-center text-[#25D366]">
              <WhatsappLogo size={14} weight="fill" />
            </span>
            <span className="flex-1 truncate text-left">WhatsApp</span>
            <ArrowSquareOut size={10} className="shrink-0 text-white/30 transition group-hover:text-white/70" />
          </button>
        </div>
      </div>

    </article>
  )
}

export default function SchedulePage() {
  const { t, i18n } = useTranslation()
  const isEn = i18n.language?.startsWith('en')
  const sedeList = Object.values(sedes).sort((a, b) => {
    if (a.isCoffeeTour && !b.isCoffeeTour) return -1
    if (!a.isCoffeeTour && b.isCoffeeTour) return 1
    return 0
  })

  const [whatsappSede, setWhatsappSede] = useState<SedeConfig | null>(null)

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
      <header className="mb-10 text-center md:mb-14">
        <span className="text-[11px] font-semibold uppercase tracking-[0.4em] text-brand">
          {isEn ? 'Visit Us' : 'Visítanos'}
        </span>
        <h1 className="font-display mt-3 text-3xl font-bold leading-tight text-white md:text-4xl lg:text-5xl">
          {t('schedule.title')}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm italic text-white/70 md:text-base">
          {t('schedule.subtitle')}
        </p>
      </header>

      <div className="grid grid-cols-1 gap-5 pt-4 sm:grid-cols-2 sm:grid-rows-[auto_auto_auto_1fr] lg:grid-cols-3">
        {sedeList.map((sede) => (
          <SedeCard
            key={sede.id}
            sede={sede}
            isEn={isEn}
            onOpenWhatsapp={() => setWhatsappSede(sede)}
          />
        ))}
      </div>

      {whatsappSede && (
        <WhatsappReservationModal
          open={true}
          onClose={() => setWhatsappSede(null)}
          mode={whatsappSede.isCoffeeTour ? 'tour' : 'cafe'}
          sede={whatsappSede}
          isEn={isEn}
        />
      )}

      <CTA secondaryLabel={isEn ? 'Contact' : 'Contactar'} secondaryHref="/contacto" />
    </div>
  )
}
