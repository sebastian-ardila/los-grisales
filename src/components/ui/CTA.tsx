import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

interface CTAProps {
  secondaryLabel: string
  secondaryHref: string
}

export default function CTA({ secondaryLabel, secondaryHref }: CTAProps) {
  const { t } = useTranslation()
  const { lang } = useParams()

  return (
    <section className="relative mt-16 overflow-hidden rounded-2xl">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={`${import.meta.env.BASE_URL}cta-coffee-farm.webp`}
          alt=""
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/70" />
      </div>

      {/* Content */}
      <div className="relative px-6 py-14 text-center md:py-20">
        <p className="mb-8 text-xl font-medium text-white/80 md:text-2xl">
          {t('cta.explore')}
        </p>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            to={`/${lang}/carta`}
            className="w-full rounded-xl bg-brand px-10 py-4 text-lg font-bold text-primary transition hover:bg-brand-light sm:w-auto"
          >
            {t('cta.viewMenu')}
          </Link>
          <Link
            to={`/${lang}${secondaryHref}`}
            className="w-full rounded-xl border-2 border-brand px-10 py-4 text-lg font-bold text-brand transition hover:bg-brand/10 sm:w-auto"
          >
            {secondaryLabel}
          </Link>
        </div>
      </div>
    </section>
  )
}
