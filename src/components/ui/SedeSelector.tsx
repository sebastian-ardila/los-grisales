import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { Storefront, Buildings, Mountains } from '@phosphor-icons/react'
import { useSede } from '../../context/SedeContext'
import { sedes } from '../../config/sedes'
import type { SedeId } from '../../data/types'

const sedeIcons: Record<string, typeof Storefront> = {
  'pereira-plaza': Storefront,
  'unicentro': Buildings,
  'coffee-tour': Mountains,
}

export default function SedeSelector() {
  const { t, i18n } = useTranslation()
  const { setSede } = useSede()
  const navigate = useNavigate()
  const { lang } = useParams()

  const sedeList = Object.values(sedes).sort((a, b) => {
    if (a.isCoffeeTour && !b.isCoffeeTour) return -1
    if (!a.isCoffeeTour && b.isCoffeeTour) return 1
    return 0
  })

  const handleSelect = (id: SedeId) => {
    setSede(id)
    const currentLang = lang || (i18n.language?.startsWith('en') ? 'en' : 'es')
    navigate(`/${currentLang}`)
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/85 p-4">
      <div className="w-full max-w-lg animate-fade-in">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-white">{t('sede.title')}</h2>
          <p className="mt-1 text-white/70">{t('sede.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {sedeList.map((sede) => (
            <button
              key={sede.id}
              onClick={() => handleSelect(sede.id as SedeId)}
              className="cursor-pointer rounded-2xl bg-card-bg p-6 text-left text-black transition hover:ring-2 ring-brand"
            >
              {(() => { const Icon = sedeIcons[sede.id]; return Icon ? <Icon size={36} weight="duotone" className="mb-3 text-primary" /> : null })()}
              <h3 className="text-lg font-bold">{sede.nameShort}</h3>
              <p className="mt-1 text-sm text-black/60">{sede.address}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
