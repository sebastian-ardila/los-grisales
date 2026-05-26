import type { ComponentType, SVGProps } from 'react'
import { useTranslation } from 'react-i18next'
import { MapPin, Clock, ArrowSquareOut, WhatsappLogo, ListChecks, Sparkle } from '@phosphor-icons/react'
import ES from 'country-flag-icons/react/3x2/ES'
import GB from 'country-flag-icons/react/3x2/GB'
import { sedes } from '../../config/sedes'
import { reviewsBySede } from '../../data/reviews'
import PhotoStack from '../ui/PhotoStack'
import BookingAppIcon from '../ui/BookingAppIcon'
import ReviewsBlock from '../reviews/ReviewsBlock'
import SectionHeader from '../ui/SectionHeader'
import { useLang } from '../../utils/lang'

type FlagIcon = ComponentType<SVGProps<SVGSVGElement>>

const photos = [
  'cafelosgrisalesfamily.webp',
  'cafelosgrisalesjeep.webp',
  'coffeetour1.webp',
  'coffeetour2.webp',
  'coffeetour3.webp',
  'coffeetour4.webp',
  'coffeetour5.webp',
  'coffeetour6.webp',
  'coffeetour7.webp',
  'coffeetour8.webp',
  'coffeetour9.webp',
].map((f) => `${import.meta.env.BASE_URL}coffeetour/${f}`)

export default function TourSection() {
  const { t } = useTranslation()
  const lang = useLang()
  const isEn = lang === 'en'
  const sede = sedes['coffee-tour']

  const whatsappMessage = {
    es: 'Hola, quisiera reservar un Coffee Tour',
    en: "Hello, I'd like to reserve a Coffee Tour",
    fr: 'Bonjour, je souhaite réserver un Coffee Tour',
  }[lang]
  const whatsappHref = `https://wa.me/${sede.whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`

  return (
    <section id="tour" className="px-4 py-16 md:py-24">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          index="01"
          title="Coffee Tour"
          tagline={
            {
              es: 'Recorre nuestros cafetales y prueba lo que sembramos — desde el origen hasta tu taza.',
              en: 'Walk our coffee fields and taste what we grow — from seed to cup.',
              fr: 'Parcourez nos plantations et dégustez ce que nous cultivons — de la graine à la tasse.',
            }[lang]
          }
          backdrop={photos[0]}
        />

        {/* Two-column hero */}
        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:gap-10">
          {/* Photos column */}
          <div className="flex justify-center self-start lg:sticky lg:top-24">
            <PhotoStack photos={photos} autoMs={5000} className="w-full" />
          </div>

          {/* Info column */}
          <div className="flex flex-col gap-8">
            <InfoBlock
              icon={<ListChecks size={18} weight="fill" />}
              title={t('tour.itineraryTitle', 'Itinerario')}
            >
              <div className="flex flex-wrap gap-2">
                <PdfChip
                  href={`${import.meta.env.BASE_URL}coffeetour/itinerario-spanish.pdf`}
                  Flag={ES as FlagIcon}
                  label="Itinerario"
                />
                <PdfChip
                  href={`${import.meta.env.BASE_URL}coffeetour/itinerario-english.pdf`}
                  Flag={GB as FlagIcon}
                  label="Itinerary"
                />
              </div>
            </InfoBlock>

            <InfoBlock
              icon={<MapPin size={18} weight="fill" />}
              title={{ es: 'Ubicación', en: 'Location', fr: 'Adresse' }[lang]}
            >
              <p className="text-base font-bold">Finca Vista Hermosa</p>
              <p className="text-sm opacity-80">{sede.address}</p>
              {sede.googleMapsUrl && (
                <a
                  href={sede.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.2em] text-brand hover:opacity-80"
                >
                  {{ es: 'Cómo llegar', en: 'How to get there', fr: 'Comment s\'y rendre' }[lang]}
                  <ArrowSquareOut size={12} weight="bold" />
                </a>
              )}
            </InfoBlock>

            <InfoBlock
              icon={<Clock size={18} weight="fill" />}
              title={{ es: 'Horario', en: 'Hours', fr: 'Horaires' }[lang]}
            >
              {sede.schedule.map((s, i) => (
                <p key={i} className="text-base font-medium">
                  {isEn ? s.days.en : s.days.es}
                </p>
              ))}
            </InfoBlock>

            {/* Booking apps - bigger, prettier */}
            <InfoBlock
              icon={<Sparkle size={18} weight="fill" />}
              title={{ es: 'Reservar en', en: 'Book on', fr: 'Réserver sur' }[lang]}
            >
              <div className="mt-1 flex flex-wrap gap-2.5">
                {sede.bookingApps?.map((app) => (
                  <BookingChip
                    key={app.name}
                    href={app.url}
                    name={app.name}
                    color={app.brandColor ?? '#C4A962'}
                    icon={<BookingAppIcon iconKey={app.iconKey} size={20} />}
                  />
                ))}
                <BookingChip
                  href={whatsappHref}
                  name="WhatsApp"
                  color="#064947"
                  icon={<WhatsappLogo size={20} weight="fill" />}
                  outlined
                />
              </div>
            </InfoBlock>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <ReviewsBlock
        reviews={reviewsBySede['coffee-tour']}
        googleUrl={sede.googleReviewsUrl}
        isEn={!!isEn}
        title={{ es: 'Lo que dicen del Coffee Tour', en: 'What people say about the Coffee Tour', fr: 'Ce qu\'on dit du Coffee Tour' }[lang]}
        displayCount={{ es: '+40 reseñas', en: '+40 reviews', fr: '+40 avis' }[lang]}
      />
    </section>
  )
}

function InfoBlock({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
        {icon}
      </div>
      <div className="flex-1">
        <h3 className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.3em] text-brand">
          {title}
        </h3>
        {children}
      </div>
    </div>
  )
}

function PdfChip({ href, Flag, label }: { href: string; Flag: FlagIcon; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{ backgroundColor: '#ffffff' }}
      className="group inline-flex items-center gap-2 rounded-xl border border-black/12 px-3.5 py-2 text-sm font-semibold shadow-[0_2px_8px_-4px_rgba(0,0,0,0.06)] transition hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-[0_10px_20px_-12px_rgba(6,73,71,0.25)]"
    >
      <Flag
        aria-hidden="true"
        className="h-3.5 w-[21px] shrink-0 overflow-hidden rounded-[2px] shadow-[0_0_0_1px_rgba(0,0,0,0.1)]"
      />
      <span>{label}</span>
      <ArrowSquareOut size={13} className="ml-0.5 shrink-0 opacity-40 transition group-hover:opacity-80" />
    </a>
  )
}

function BookingChip({
  href,
  name,
  color,
  icon,
  solid = false,
  outlined = false,
}: {
  href: string
  name: string
  color: string
  icon: React.ReactNode
  /** Render with solid colored background and white text/icon. */
  solid?: boolean
  /** Render with white background, colored border + text/icon. */
  outlined?: boolean
}) {
  const containerStyle = solid
    ? { backgroundColor: color, color: '#ffffff', borderColor: color }
    : outlined
      ? { backgroundColor: '#ffffff', color, borderColor: color }
      : { backgroundColor: '#ffffff', borderColor: undefined }
  const iconStyle = solid
    ? { backgroundColor: 'rgba(255,255,255,0.18)', color: '#ffffff' }
    : { backgroundColor: `${color}1f`, color }
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={containerStyle}
      className={`group inline-flex items-center gap-2.5 rounded-xl border px-3 py-2.5 text-sm font-semibold shadow-[0_2px_8px_-4px_rgba(0,0,0,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_10px_20px_-12px_rgba(6,73,71,0.25)] ${
        solid || outlined ? '' : 'border-black/12'
      }`}
    >
      <span
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
        style={iconStyle}
      >
        {icon}
      </span>
      <span className="whitespace-nowrap text-left">{name}</span>
      <ArrowSquareOut
        size={11}
        className={`shrink-0 transition ${solid ? 'opacity-70 group-hover:opacity-100' : 'opacity-30 group-hover:opacity-70'}`}
      />
    </a>
  )
}
