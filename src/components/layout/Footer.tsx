import { useTranslation } from 'react-i18next'
import { InstagramLogo, WhatsappLogo } from '@phosphor-icons/react'
import { sedes } from '../../config/sedes'

export default function Footer() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language?.startsWith('en') ? 'en' : 'es'

  const sedeList = Object.values(sedes)

  return (
    <footer className="bg-primary-light text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-12 md:grid-cols-3">
        {/* Column 1: Brand info */}
        <div>
          <img
            src={`${import.meta.env.BASE_URL}los-grisales-logo-mini.webp`}
            alt="Los Grisales"
            className="mb-3 h-12"
          />
          <h3 className="text-lg font-bold">Los Grisales</h3>
          <p className="text-sm text-white/60">cafe &amp; bar</p>
          <div className="mt-4 space-y-1 text-sm text-white/70">
            {sedeList.map((sede) => (
              <p key={sede.id}>{sede.address}</p>
            ))}
          </div>
          <p className="mt-3 text-sm font-medium text-brand">
            {t('footer.deliveries')}
          </p>
        </div>

        {/* Column 2: Schedule */}
        <div>
          <h4 className="mb-4 text-lg font-bold">{t('footer.schedule')}</h4>
          <div className="space-y-4">
            {sedeList.map((sede) => (
              <div
                key={sede.id}
                className="rounded-xl bg-white/5 p-4"
              >
                <p className="mb-2 text-sm font-semibold text-brand">
                  {sede.nameShort}
                </p>
                {sede.schedule.map((s, i) => (
                  <p key={i} className="text-sm text-white/70">
                    {lang === 'en' ? s.days.en : s.days.es}: {s.open} - {s.close}
                  </p>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Column 3: Social */}
        <div>
          <h4 className="mb-4 text-lg font-bold">{t('footer.followUs')}</h4>
          <div className="space-y-3">
            <a
              href="https://www.instagram.com/losgrisalescafe_bar"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-sm text-white/70 transition hover:text-white"
            >
              <InstagramLogo size={22} />
              <span>@losgrisalescafe_bar</span>
            </a>
            <a
              href={`https://wa.me/${sedeList[0]?.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-sm text-white/70 transition hover:text-white"
            >
              <WhatsappLogo size={22} />
              <span>{sedeList[0]?.whatsappNumber.replace('57', '+57 ')}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-6 py-4 text-xs text-white/50 sm:flex-row">
          <span>Los Grisales &copy; {t('footer.rights')}.</span>
          <span>
            {t('footer.madeBy')}{' '}
            <a
              href="https://sebastianardila.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand hover:underline"
            >
              sebastianardila.com
            </a>
          </span>
        </div>
      </div>
    </footer>
  )
}
