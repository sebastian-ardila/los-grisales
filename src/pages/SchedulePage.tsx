import { useTranslation } from 'react-i18next'
import { Clock, MapPin, WhatsappLogo } from '@phosphor-icons/react'
import { SiGooglemaps, SiWaze, SiApple } from 'react-icons/si'
import { sedes } from '../config/sedes'
import { useSede } from '../context/SedeContext'
import CTA from '../components/ui/CTA'

export default function SchedulePage() {
  const { t, i18n } = useTranslation()
  const isEn = i18n.language?.startsWith('en')
  const { sedeConfig } = useSede()
  const sedeList = Object.values(sedes)

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold text-brand">{t('schedule.title')}</h1>

      {/* Schedule cards */}
      <div className="mb-10 space-y-4">
        {sedeList.map((sede) => (
          <div key={sede.id} className="rounded-2xl bg-white/5 p-6">
            <div className="mb-3 flex items-center gap-2">
              <Clock size={22} className="text-brand" />
              <h2 className="text-xl font-bold">{sede.nameShort}</h2>
            </div>
            <p className="mb-2 text-sm text-white/60">{sede.address}</p>
            {sede.schedule.map((s, i) => (
              <div key={i} className="mb-1">
                <span className="font-medium">{isEn ? s.days.en : s.days.es}:</span>{' '}
                <span className="text-white/70">{s.open} - {s.close}</span>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Location */}
      <div className="mb-10 rounded-2xl bg-white/5 p-6">
        <div className="mb-4 flex items-center gap-2">
          <MapPin size={22} className="text-brand" />
          <h2 className="text-xl font-bold">{isEn ? 'Location' : 'Ubicación'}</h2>
        </div>
        <p className="mb-2 text-white/70">{sedeConfig?.address}</p>
        <p className="mb-6 text-sm text-brand">{t('schedule.deliveries')}</p>

        <h3 className="mb-3 text-sm font-medium uppercase tracking-wide text-white/40">
          {t('schedule.howToGet')}
        </h3>
        <div className="flex flex-col gap-2 sm:flex-row">
          {sedeConfig?.googleMapsUrl && (
            <a href={sedeConfig.googleMapsUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 text-sm text-white/60 transition hover:bg-white/10 hover:text-white/80">
              <SiGooglemaps size={16} className="text-[#4285F4]/70" /> Google Maps
            </a>
          )}
          <a href={`https://waze.com/ul?navigate=yes&q=${encodeURIComponent(sedeConfig?.address || '')}`}
            target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 text-sm text-white/60 transition hover:bg-white/10 hover:text-white/80">
            <SiWaze size={16} className="text-[#33CCFF]/70" /> Waze
          </a>
          <a href={`https://maps.apple.com/?daddr=${encodeURIComponent(sedeConfig?.address || '')}`}
            target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 text-sm text-white/60 transition hover:bg-white/10 hover:text-white/80">
            <SiApple size={16} className="text-white/50" /> Apple Maps
          </a>
        </div>
      </div>

      {/* Action buttons */}
      <div className="mb-10 flex flex-col gap-3 sm:flex-row">
        <a href="#/reservas" className="flex-1 rounded-xl bg-brand py-3 text-center font-bold text-primary transition hover:bg-brand-light">
          {t('schedule.reserveTable')}
        </a>
        {sedeConfig?.whatsappOrderingEnabled && (
          <a href={`https://wa.me/${sedeConfig.whatsappNumber}`} target="_blank" rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-brand py-3 font-bold text-brand transition hover:bg-brand/10">
            <WhatsappLogo size={20} />
            {t('schedule.orderWhatsApp')}
          </a>
        )}
      </div>

      <CTA secondaryLabel={isEn ? 'Reserve' : 'Reservar'} secondaryHref="#/reservas" />
    </div>
  )
}
