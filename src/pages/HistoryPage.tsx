import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'
import { Coffee, Mountains, Tree } from '@phosphor-icons/react'
import CTA from '../components/ui/CTA'

export default function HistoryPage() {
  const { t, i18n } = useTranslation()
  const { lang } = useParams()
  const isEn = i18n.language?.startsWith('en')

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold text-brand">{t('history.title')}</h1>

      <div className="space-y-8">
        <div className="flex gap-4">
          <div className="flex-shrink-0 pt-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand/20">
              <Mountains size={22} className="text-brand" />
            </div>
          </div>
          <p className="text-lg leading-relaxed text-white/80">{t('history.p1')}</p>
        </div>

        <div className="flex gap-4">
          <div className="flex-shrink-0 pt-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand/20">
              <Coffee size={22} className="text-brand" />
            </div>
          </div>
          <p className="text-lg leading-relaxed text-white/80">{t('history.p2')}</p>
        </div>

        <div className="flex gap-4">
          <div className="flex-shrink-0 pt-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand/20">
              <Tree size={22} className="text-brand" />
            </div>
          </div>
          <p className="text-lg leading-relaxed text-white/80">{t('history.p3')}</p>
        </div>
      </div>

      {/* Coffee tour CTA */}
      <div className="mt-12 rounded-2xl bg-brand/10 p-6 text-center">
        <Coffee size={40} className="mx-auto mb-3 text-brand" />
        <p className="mb-4 text-white/80">{t('history.coffeeTour')}</p>
        <Link
          to={`/${lang}/carta`}
          className="inline-block rounded-xl bg-brand px-8 py-3 font-bold text-primary transition hover:bg-brand-light"
        >
          {t('history.viewMenu')}
        </Link>
      </div>

      <CTA secondaryLabel={isEn ? 'Reserve' : 'Reservar'} secondaryHref="/reservas" />
    </div>
  )
}
