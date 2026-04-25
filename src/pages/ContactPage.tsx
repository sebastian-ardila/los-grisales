import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Storefront, Truck, Handshake, Confetti, Cake, DotsThreeOutline, Check } from '@phosphor-icons/react'
import { useSede } from '../context/SedeContext'
import { buildContactWhatsAppUrl } from '../utils/whatsapp'
import CTA from '../components/ui/CTA'

export default function ContactPage() {
  const { t, i18n } = useTranslation()
  const isEn = i18n.language?.startsWith('en')
  const { sedeConfig } = useSede()

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
    { value: 'other', label: t('contact.reasons.other'), icon: DotsThreeOutline },
  ]

  const isValid = name.trim() !== '' && email.trim() !== '' && reason !== '' && message.trim() !== ''

  const handleSubmit = () => {
    setTried(true)
    if (!isValid || !sedeConfig) return

    const selectedReason = reasons.find(r => r.value === reason)
    const url = buildContactWhatsAppUrl({
      name,
      email,
      phone,
      reason: selectedReason?.label || reason,
      message,
      whatsappNumber: sedeConfig.whatsappNumber,
    })
    window.open(url, '_blank')
  }

  const fieldClass = (valid: boolean) =>
    `w-full rounded-xl bg-white/10 px-4 py-3 text-[16px] text-white placeholder-white/30 outline-none transition ${
      tried && !valid ? 'ring-2 ring-white/60' : 'focus:ring-2 focus:ring-brand'
    }`

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold text-brand">{t('contact.title')}</h1>

      <form noValidate onSubmit={(e) => { e.preventDefault(); handleSubmit() }} className="space-y-5">
        {/* Name */}
        <div>
          <label className={`mb-1 block text-sm font-medium ${tried && !name.trim() ? 'text-white/60' : 'text-white/70'}`}>
            {t('contact.name')}
          </label>
          <input
            type="text" value={name} onChange={(e) => setName(e.target.value)}
            placeholder={t('contact.namePlaceholder')} autoComplete="name"
            className={fieldClass(name.trim() !== '')}
          />
          {tried && !name.trim() && <p className="mt-1 text-xs text-white/60">{isEn ? 'Name is required' : 'El nombre es requerido'}</p>}
        </div>

        {/* Email */}
        <div>
          <label className={`mb-1 block text-sm font-medium ${tried && !email.trim() ? 'text-white/60' : 'text-white/70'}`}>
            {t('contact.email')}
          </label>
          <input
            type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder={t('contact.emailPlaceholder')} autoComplete="email"
            className={fieldClass(email.trim() !== '')}
          />
          {tried && !email.trim() && <p className="mt-1 text-xs text-white/60">{isEn ? 'Email is required' : 'El correo es requerido'}</p>}
        </div>

        {/* Phone (optional) */}
        <div>
          <label className="mb-1 block text-sm font-medium text-white/70">{t('contact.phone')}</label>
          <input
            type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
            placeholder={t('contact.phonePlaceholder')} autoComplete="tel"
            className="w-full rounded-xl bg-white/10 px-4 py-3 text-[16px] text-white placeholder-white/30 outline-none transition focus:ring-2 focus:ring-brand"
          />
        </div>

        {/* Reason — selectable buttons with icons */}
        <div>
          <label className={`mb-2 block text-sm font-medium ${tried && !reason ? 'text-white/60' : 'text-white/70'}`}>
            {t('contact.reason')}
          </label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
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
                      ? 'border-brand bg-brand/15 text-white shadow-[0_8px_24px_-12px_rgba(196,169,98,0.5)]'
                      : tried && !reason
                        ? 'border-white/40 bg-white/5 text-white/80 hover:border-brand/40 hover:bg-white/10'
                        : 'border-white/15 bg-white/5 text-white/80 hover:border-brand/40 hover:bg-white/10'
                  }`}
                >
                  <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${active ? 'bg-brand/25 text-brand' : 'bg-white/10 text-white/70'}`}>
                    <RIcon size={16} weight="duotone" />
                  </span>
                  <span className="flex-1 truncate font-medium">{r.label}</span>
                  {active && <Check size={14} weight="bold" className="shrink-0 text-brand" />}
                </button>
              )
            })}
          </div>
          {tried && !reason && <p className="mt-2 text-xs text-white/60">{isEn ? 'Reason is required' : 'El motivo es requerido'}</p>}
        </div>

        {/* Message */}
        <div>
          <label className={`mb-1 block text-sm font-medium ${tried && !message.trim() ? 'text-white/60' : 'text-white/70'}`}>
            {t('contact.message')}
          </label>
          <textarea
            value={message} onChange={(e) => setMessage(e.target.value)}
            placeholder={t('contact.messagePlaceholder')} rows={4}
            className={fieldClass(message.trim() !== '')}
          />
          {tried && !message.trim() && <p className="mt-1 text-xs text-white/60">{isEn ? 'Message is required' : 'El mensaje es requerido'}</p>}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className={`w-full rounded-xl py-3 font-bold transition ${
            isValid ? 'bg-brand text-primary hover:bg-brand-light' : 'cursor-not-allowed bg-accent/30 text-white/40'
          }`}
        >
          {t('contact.submit')}
        </button>
        {tried && !isValid && <p className="text-center text-sm text-white/60">{t('contact.completeFields')}</p>}
      </form>

      <CTA secondaryLabel={isEn ? 'Reserve' : 'Reservar'} secondaryHref="/reservas" />
    </div>
  )
}
