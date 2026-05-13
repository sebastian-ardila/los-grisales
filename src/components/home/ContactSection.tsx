import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Storefront,
  Truck,
  Handshake,
  Confetti,
  Cake,
  DotsThreeOutline,
  Check,
  UsersThree,
  ForkKnife,
  Briefcase,
  Newspaper,
  HandHeart,
  ChatCircleDots,
  WhatsappLogo,
} from '@phosphor-icons/react'
import { buildContactWhatsAppUrl } from '../../utils/whatsapp'
import { sedes } from '../../config/sedes'

export default function ContactSection() {
  const { t, i18n } = useTranslation()
  const isEn = i18n.language?.startsWith('en')

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [reason, setReason] = useState('')
  const [message, setMessage] = useState('')
  const [tried, setTried] = useState(false)

  const reasons = [
    { value: 'franchise', label: t('contact.reasons.franchise'), icon: Storefront },
    { value: 'supplier', label: t('contact.reasons.supplier'), icon: Truck },
    { value: 'collaboration', label: t('contact.reasons.collaboration'), icon: Handshake },
    { value: 'events', label: t('contact.reasons.events'), icon: Confetti },
    { value: 'birthday', label: t('contact.reasons.birthday'), icon: Cake },
    { value: 'groupReservation', label: t('contact.reasons.groupReservation'), icon: UsersThree },
    { value: 'catering', label: t('contact.reasons.catering'), icon: ForkKnife },
    { value: 'work', label: t('contact.reasons.work'), icon: Briefcase },
    { value: 'press', label: t('contact.reasons.press'), icon: Newspaper },
    { value: 'cause', label: t('contact.reasons.cause'), icon: HandHeart },
    { value: 'suggestion', label: t('contact.reasons.suggestion'), icon: ChatCircleDots },
    { value: 'other', label: t('contact.reasons.other'), icon: DotsThreeOutline },
  ]

  const isValid = name.trim() !== '' && email.trim() !== '' && reason !== ''

  const handleSubmit = () => {
    setTried(true)
    if (!isValid) return

    const selectedReason = reasons.find((r) => r.value === reason)
    const url = buildContactWhatsAppUrl({
      name,
      email,
      phone,
      reason: selectedReason?.label || reason,
      message,
      whatsappNumber: sedes['pereira-plaza'].whatsappNumber,
    })
    window.open(url, '_blank')
  }

  const inputBase =
    'w-full rounded-xl bg-black/5 px-4 py-3 text-[16px] outline-none transition placeholder-black/30'
  const fieldClass = (valid: boolean) =>
    `${inputBase} ${tried && !valid ? 'ring-2 ring-black/30' : 'focus:ring-2 focus:ring-brand'}`

  return (
    <section id="contact" className="px-4 py-16 md:py-20">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.4em] text-brand">
            {t('contact.sectionKicker', isEn ? 'Get in touch' : 'Contáctanos')}
          </p>
          <h2 className="font-display mt-2 text-3xl font-bold md:text-4xl">
            {t('contact.title')}
          </h2>
        </header>

        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault()
            handleSubmit()
          }}
          className="space-y-5"
        >
          {/* Reason - on top, full width */}
          <div>
            <label className={`mb-2 block text-sm font-medium ${tried && !reason ? 'opacity-60' : 'opacity-80'}`}>
              {t('contact.reason')}
            </label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
              {reasons.map((r) => {
                const RIcon = r.icon
                const active = reason === r.value
                return (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setReason(r.value)}
                    className={`group/r relative flex items-center gap-2 rounded-xl border px-3 py-2.5 text-left text-sm transition ${
                      active
                        ? 'border-brand bg-brand/15 shadow-[0_8px_24px_-12px_rgba(6,73,71,0.4)]'
                        : tried && !reason
                          ? 'border-black/30 bg-black/5 hover:border-brand/40 hover:bg-black/10'
                          : 'border-black/10 bg-black/5 hover:border-brand/40 hover:bg-black/10'
                    }`}
                  >
                    <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${active ? 'bg-brand/25 text-brand' : 'bg-black/10 opacity-80'}`}>
                      <RIcon size={16} weight="duotone" />
                    </span>
                    <span className="flex-1 truncate font-medium">{r.label}</span>
                    {active && <Check size={14} weight="bold" className="shrink-0 text-brand" />}
                  </button>
                )
              })}
            </div>
            {tried && !reason && (
              <p className="mt-2 text-xs opacity-60">
                {isEn ? 'Reason is required' : 'El motivo es requerido'}
              </p>
            )}
          </div>

          {/* Two columns: left stack (name/email/phone/submit) / right message */}
          <div className="grid gap-5 md:grid-cols-2">
            {/* Left: name, email, phone, submit */}
            <div className="flex flex-col gap-4">
              <div>
                <label className={`mb-1 block text-sm font-medium ${tried && !name.trim() ? 'opacity-60' : 'opacity-80'}`}>
                  {t('contact.name')}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t('contact.namePlaceholder')}
                  autoComplete="name"
                  className={fieldClass(name.trim() !== '')}
                />
                {tried && !name.trim() && (
                  <p className="mt-1 text-xs opacity-60">
                    {isEn ? 'Name is required' : 'El nombre es requerido'}
                  </p>
                )}
              </div>

              <div>
                <label className={`mb-1 block text-sm font-medium ${tried && !email.trim() ? 'opacity-60' : 'opacity-80'}`}>
                  {t('contact.email')}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('contact.emailPlaceholder')}
                  autoComplete="email"
                  className={fieldClass(email.trim() !== '')}
                />
                {tried && !email.trim() && (
                  <p className="mt-1 text-xs opacity-60">
                    {isEn ? 'Email is required' : 'El correo es requerido'}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium opacity-80">
                  {t('contact.phone')}
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={t('contact.phonePlaceholder')}
                  autoComplete="tel"
                  className={`${inputBase} focus:ring-2 focus:ring-brand`}
                />
              </div>

              <button
                type="submit"
                style={isValid ? { color: '#ffffff' } : undefined}
                className={`mt-auto inline-flex w-full items-center justify-center gap-2 rounded-xl py-3 font-bold transition ${
                  isValid ? 'bg-brand hover:brightness-110' : 'cursor-not-allowed bg-black/15 opacity-50'
                }`}
              >
                <WhatsappLogo size={18} weight="fill" />
                {t('contact.submit')}
              </button>
            </div>

            {/* Right: message (optional) */}
            <div className="flex flex-col">
              <label className="mb-1 block text-sm font-medium opacity-80">
                {t('contact.message')}{' '}
                <span className="opacity-50">({isEn ? 'optional' : 'opcional'})</span>
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={t('contact.messagePlaceholder')}
                className={`${inputBase} flex-1 min-h-[300px] resize-none focus:ring-2 focus:ring-brand`}
              />
            </div>
          </div>

          {tried && !isValid && (
            <p className="text-center text-sm opacity-60">
              {t('contact.completeFields')}
            </p>
          )}
        </form>
      </div>
    </section>
  )
}
