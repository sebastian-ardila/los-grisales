import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { WhatsappLogo, Storefront, Buildings, MapPin, Clock, ArrowRight, Coffee } from '@phosphor-icons/react'
import { sedes } from '../../config/sedes'
import type { SedeConfig } from '../../data/types'
import { reviewsBySede } from '../../data/reviews'
import PhotoStack from '../ui/PhotoStack'
import WhatsappReservationModal from '../reservations/WhatsappReservationModal'
import ReviewsBlock from '../reviews/ReviewsBlock'
import SectionHeader from '../ui/SectionHeader'

const photos = [
  'cafebar1.webp',
  'cafebar2.webp',
  'cafebar3.webp',
  'cafebar4.webp',
  'cafebar5.webp',
].map((f) => `${import.meta.env.BASE_URL}cafebar/${f}`)

const sedeIcons: Record<string, typeof Storefront> = {
  'pereira-plaza': Storefront,
  'unicentro': Buildings,
}

export default function CafeBarSection() {
  const { i18n, t } = useTranslation()
  const isEn = i18n.language?.startsWith('en')
  const [whatsappOpen, setWhatsappOpen] = useState(false)

  const sedeList = [sedes['pereira-plaza'], sedes['unicentro']]
  const sharedSede: SedeConfig = sedes['pereira-plaza'] // mismo whatsappNumber para ambas

  return (
    <section
      id="cafe-bar"
      style={{ backgroundColor: 'rgba(0,0,0,0.025)' }}
      className="border-y border-black/8 px-4 py-16 md:py-24"
    >
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          index="02"
          kickerIcon={<Storefront size={14} weight="fill" />}
          kickerLabel={t('cafeBar.kicker', isEn ? 'Visit us' : 'Visítanos')}
          title="Café Bar"
          tagline={
            isEn
              ? 'Two places in Pereira where our specialty coffee meets you in person.'
              : 'Dos lugares en Pereira donde nuestro café de especialidad te recibe en persona.'
          }
          backdrop={photos[0]}
        />

        <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:gap-10">
          {/* Unified sedes card */}
          <article
            style={{ backgroundColor: 'rgba(255,255,255,0.55)' }}
            className="flex flex-col self-start overflow-hidden rounded-2xl border border-black/10 shadow-[0_8px_30px_-14px_rgba(0,0,0,0.08)]"
          >
            <div className="grid sm:grid-cols-2">
              {sedeList.map((sede, idx) => {
                const Icon = sedeIcons[sede.id] ?? Storefront
                return (
                  <div
                    key={sede.id}
                    className={`flex flex-col p-6 md:p-7 ${
                      idx === 0 ? 'border-b border-black/10 sm:border-b-0 sm:border-r' : ''
                    }`}
                  >
                    {/* Header */}
                    <header className="mb-5 flex items-center gap-3 border-b border-black/8 pb-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand/12 text-brand">
                        <Icon size={24} weight="duotone" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-brand/70">
                          {t('schedule.cafeBar', 'Café Bar')}
                        </p>
                        <h3 className="font-display text-lg font-bold leading-tight">{sede.nameShort}</h3>
                      </div>
                    </header>

                    {/* Data list */}
                    <dl className="space-y-4">
                      {/* Address */}
                      <div className="flex gap-3">
                        <dt className="shrink-0">
                          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand/10 text-brand">
                            <MapPin size={14} weight="fill" />
                          </span>
                        </dt>
                        <dd className="flex-1">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-brand/70">
                            {isEn ? 'Location' : 'Ubicación'}
                          </p>
                          <p className="mt-0.5 text-sm leading-snug">{sede.address}</p>
                          {sede.googleMapsUrl && (
                            <a
                              href={sede.googleMapsUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-1 inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-brand transition hover:opacity-80"
                            >
                              {isEn ? 'How to get there' : 'Cómo llegar'}
                              <ArrowRight size={11} weight="bold" />
                            </a>
                          )}
                        </dd>
                      </div>

                      {/* Hours */}
                      <div className="flex gap-3">
                        <dt className="shrink-0">
                          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand/10 text-brand">
                            <Clock size={14} weight="fill" />
                          </span>
                        </dt>
                        <dd className="flex-1">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-brand/70">
                            {isEn ? 'Hours' : 'Horario'}
                          </p>
                          <div className="mt-1 space-y-1.5">
                            {sede.schedule.map((s, i) => {
                              const hasHours = s.open !== '' && s.close !== ''
                              return (
                                <div key={i} className="grid grid-cols-[1fr_auto] items-baseline gap-3 text-sm">
                                  <span className="opacity-85">{isEn ? s.days.en : s.days.es}</span>
                                  {hasHours && (
                                    <span className="whitespace-nowrap text-xs font-semibold text-brand">
                                      {s.open} – {s.close}
                                    </span>
                                  )}
                                </div>
                              )
                            })}
                          </div>
                        </dd>
                      </div>
                    </dl>
                  </div>
                )
              })}
            </div>

            {/* Shared CTAs — always side by side, even on mobile */}
            <div className="flex flex-row items-stretch justify-center gap-3 border-t border-black/10 p-5">
              <button
                onClick={() => setWhatsappOpen(true)}
                style={{ color: '#ffffff' }}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-bold transition hover:brightness-110 sm:flex-initial sm:px-6"
              >
                <WhatsappLogo size={16} weight="fill" />
                <span className="hidden sm:inline">
                  {isEn ? 'Reserve via WhatsApp' : 'Reservar por WhatsApp'}
                </span>
                <span className="sm:hidden">
                  {isEn ? 'Reserve' : 'Reservar'}
                </span>
              </button>
              <a
                href="#"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-brand/40 px-4 py-2.5 text-sm font-bold text-brand transition hover:bg-brand/5 sm:flex-initial sm:px-6"
              >
                <Coffee size={16} weight="bold" />
                {isEn ? 'View menu' : 'Ver carta'}
              </a>
            </div>
          </article>

          {/* Photo carousel column */}
          <div className="flex flex-col items-center self-start">
            <PhotoStack photos={photos} autoMs={4000} className="w-full" />
          </div>
        </div>
      </div>

      {/* Reviews — combined from both sedes, interleaved so they don't appear grouped */}
      <ReviewsBlock
        reviews={interleave(
          reviewsBySede['pereira-plaza'].map((r) => ({ ...r, sedeName: 'Pereira Plaza' })),
          reviewsBySede['unicentro'].map((r) => ({ ...r, sedeName: 'Unicentro' }))
        )}
        sedeLinks={[
          { label: 'Pereira Plaza', url: sedes['pereira-plaza'].googleReviewsUrl },
          { label: 'Unicentro', url: sedes['unicentro'].googleReviewsUrl },
        ]}
        isEn={!!isEn}
        title={isEn ? 'What people say about our Café Bar' : 'Lo que dicen de nuestros Café Bar'}
        displayCount={isEn ? '+20 reviews' : '+20 reseñas'}
      />

      {whatsappOpen && (
        <WhatsappReservationModal
          open={true}
          onClose={() => setWhatsappOpen(false)}
          mode="cafe"
          sede={sharedSede}
          isEn={!!isEn}
        />
      )}
    </section>
  )
}

/** Interleave two arrays alternating items (a[0], b[0], a[1], b[1], …). */
function interleave<T>(a: T[], b: T[]): T[] {
  const out: T[] = []
  const max = Math.max(a.length, b.length)
  for (let i = 0; i < max; i++) {
    if (i < a.length) out.push(a[i])
    if (i < b.length) out.push(b[i])
  }
  return out
}
