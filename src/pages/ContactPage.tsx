import { useState } from 'react'
import { useTranslation } from 'react-i18next'
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
    { value: 'franchise', label: t('contact.reasons.franchise') },
    { value: 'supplier', label: t('contact.reasons.supplier') },
    { value: 'collaboration', label: t('contact.reasons.collaboration') },
    { value: 'events', label: t('contact.reasons.events') },
    { value: 'birthday', label: t('contact.reasons.birthday') },
    { value: 'other', label: t('contact.reasons.other') },
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

        {/* Reason */}
        <div>
          <label className={`mb-1 block text-sm font-medium ${tried && !reason ? 'text-white/60' : 'text-white/70'}`}>
            {t('contact.reason')}
          </label>
          <select
            value={reason} onChange={(e) => setReason(e.target.value)}
            className={`w-full rounded-xl bg-white/10 px-4 py-3 text-[16px] text-white outline-none transition ${
              tried && !reason ? 'ring-2 ring-white/60' : 'focus:ring-2 focus:ring-brand'
            } ${!reason ? 'text-white/30' : ''}`}
          >
            <option value="" className="bg-primary">{t('contact.reasonPlaceholder')}</option>
            {reasons.map(r => (
              <option key={r.value} value={r.value} className="bg-primary">{r.label}</option>
            ))}
          </select>
          {tried && !reason && <p className="mt-1 text-xs text-white/60">{isEn ? 'Reason is required' : 'El motivo es requerido'}</p>}
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
