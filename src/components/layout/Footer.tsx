import { useTranslation } from 'react-i18next'
import { useNavigate, useLocation } from 'react-router-dom'
import { InstagramLogo, FacebookLogo, TiktokLogo, WhatsappLogo, PawPrint, EnvelopeSimple } from '@phosphor-icons/react'
import { sedes } from '../../config/sedes'
import { useLang } from '../../utils/lang'

export default function Footer() {
  const { t } = useTranslation()
  const lang = useLang()
  const navigate = useNavigate()
  const location = useLocation()

  const sedeList = Object.values(sedes)

  const goToContact = () => {
    const onHome = location.pathname === `/${lang}` || location.pathname === `/${lang}/`
    if (onHome) {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
    } else {
      navigate(`/${lang}`)
      setTimeout(() => {
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    }
  }

  return (
    <footer className="bg-primary-light text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-12 md:grid-cols-3">
        {/* Column 1: Brand info */}
        <div>
          <img
            src={`${import.meta.env.BASE_URL}logo-oficial-verde.webp`}
            alt="Los Grisales"
            className="mb-3 h-32 w-auto md:h-36"
          />
          <h3 className="text-lg font-bold">Los Grisales</h3>
          <p className="text-sm text-white/60">cafe &amp; bar</p>
          <p className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-brand">
            <PawPrint size={13} weight="duotone" />
            {t('footer.petFriendly')}
          </p>
          <div className="mt-4 space-y-2 text-sm text-white/70">
            {sedeList.map((sede) => (
              <div key={sede.id}>
                <p className="text-xs font-semibold uppercase tracking-wide text-brand/80">{sede.nameShort}</p>
                <p>{sede.address}</p>
              </div>
            ))}
          </div>
          <button
            onClick={goToContact}
            className="mt-4 inline-flex items-center gap-2 rounded-lg border border-brand/40 bg-brand/10 px-3 py-2 text-sm font-semibold text-brand transition hover:bg-brand/20"
          >
            <EnvelopeSimple size={16} weight="duotone" />
            {t('footer.contactLink')}
          </button>
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
                {sede.schedule.map((s, i) => {
                  const hasHours = s.open !== '' && s.close !== ''
                  return (
                    <p key={i} className="text-sm text-white/70">
                      {lang === 'en' ? s.days.en : s.days.es}
                      {hasHours ? `: ${s.open} - ${s.close}` : ''}
                    </p>
                  )
                })}
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
              href="https://www.facebook.com/people/Caf%C3%A9-Los-Grisales-Coffee-Tour/61551417734035/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-sm text-white/70 transition hover:text-white"
            >
              <FacebookLogo size={22} />
              <span>Café Los Grisales Coffee Tour</span>
            </a>
            <a
              href="https://www.tiktok.com/@cafelosgrisales00"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-sm text-white/70 transition hover:text-white"
            >
              <TiktokLogo size={22} />
              <span>@cafelosgrisales00</span>
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
