import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { CalendarDots, Clock, Plus, Minus, MapPin, Sun, SunHorizon as SunHorizonIcon, Moon } from '@phosphor-icons/react'
import { SiWaze, SiGooglemaps, SiApple } from 'react-icons/si'
import { useSede } from '../context/SedeContext'
import { getSedeScheduleForDay } from '../config/sedes'
import { buildReservationWhatsAppUrl } from '../utils/whatsapp'
import CTA from '../components/ui/CTA'

export default function ReservationsPage() {
  const { t, i18n } = useTranslation()
  const isEn = i18n.language?.startsWith('en')
  const { sedeConfig } = useSede()
  const dateInputRef = useRef<HTMLInputElement>(null)

  const [name, setName] = useState('')
  const [people, setPeople] = useState(2)
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [comments, setComments] = useState('')
  const [tried, setTried] = useState(false)

  const today = new Date().toISOString().split('T')[0]

  const dayOfWeek = date ? new Date(date + 'T12:00:00').getDay() : -1
  const scheduleForDay = date && sedeConfig ? getSedeScheduleForDay(sedeConfig.id, dayOfWeek) : null
  const isClosed = date !== '' && scheduleForDay === null

  const timeSlots: { label: string; icon: typeof Sun; slots: string[] }[] = []
  if (scheduleForDay) {
    const { open, close } = scheduleForDay
    const morning: string[] = []
    const afternoon: string[] = []
    const evening: string[] = []

    for (let h = open; h < close; h++) {
      for (const m of [0, 30]) {
        if (h === open && m === 0) continue
        const hour = h > 12 ? h - 12 : h
        const ampm = h >= 12 ? 'PM' : 'AM'
        const display = `${hour}:${m === 0 ? '00' : '30'} ${ampm}`
        if (h < 12) morning.push(display)
        else if (h < 18) afternoon.push(display)
        else evening.push(display)
      }
    }

    if (morning.length > 0) timeSlots.push({ label: isEn ? 'Morning' : 'Mañana', icon: Sun, slots: morning })
    if (afternoon.length > 0) timeSlots.push({ label: isEn ? 'Afternoon' : 'Tarde', icon: SunHorizonIcon, slots: afternoon })
    if (evening.length > 0) timeSlots.push({ label: isEn ? 'Evening' : 'Noche', icon: Moon, slots: evening })
  }

  const dateValid = date !== '' && !isClosed
  const isValid = name.trim() !== '' && dateValid && time !== ''

  const formatDate = (dateStr: string) => {
    if (!dateStr) return ''
    const d = new Date(dateStr + 'T12:00:00')
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long' }
    return d.toLocaleDateString(isEn ? 'en-US' : 'es-CO', options)
  }

  const handleDateChange = (val: string) => {
    setDate(val)
    const dow = new Date(val + 'T12:00:00').getDay()
    const sched = sedeConfig ? getSedeScheduleForDay(sedeConfig.id, dow) : null
    if (sched === null) setTime('')
    else if (time) {
      // Check if current time is still valid
      const allSlots = timeSlots.flatMap(ts => ts.slots)
      if (!allSlots.includes(time)) setTime('')
    }
  }

  const handleSubmit = () => {
    setTried(true)
    if (!isValid || !sedeConfig) return

    const url = buildReservationWhatsAppUrl({
      name,
      people,
      date: formatDate(date),
      time,
      comments,
      phone: sedeConfig.whatsappNumber,
      sedeName: sedeConfig.nameShort,
    })
    window.open(url, '_blank')
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold text-brand">{t('reservations.title')}</h1>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* Sidebar - info cards (col 1 on desktop) */}
        <div className="order-2 space-y-4 md:order-1">
          {/* Schedule card */}
          <div className="rounded-2xl bg-white/5 p-5">
            <h3 className="mb-3 flex items-center gap-2 font-bold text-brand">
              <Clock size={20} />
              {t('reservations.schedule')}
            </h3>
            {sedeConfig?.schedule.map((s, i) => (
              <div key={i} className="mb-2 text-sm text-white/70">
                <p className="font-medium text-white/90">{isEn ? s.days.en : s.days.es}</p>
                <p>{s.open} - {s.close}</p>
              </div>
            ))}
          </div>

          {/* Location card */}
          <div className="rounded-2xl bg-white/5 p-5">
            <h3 className="mb-3 flex items-center gap-2 font-bold text-brand">
              <MapPin size={20} />
              {t('reservations.location')}
            </h3>
            <p className="mb-4 text-sm text-white/70">{sedeConfig?.address}</p>
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-white/40">
              {t('reservations.howToGet')}
            </p>
            <div className="flex flex-col gap-2">
              {sedeConfig?.googleMapsUrl && (
                <a href={sedeConfig.googleMapsUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2 text-sm text-white/60 transition hover:bg-white/10 hover:text-white/80">
                  <SiGooglemaps size={16} className="text-[#4285F4]/70" /> Google Maps
                </a>
              )}
              <a href={`https://waze.com/ul?navigate=yes&q=${encodeURIComponent(sedeConfig?.address || '')}`} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2 text-sm text-white/60 transition hover:bg-white/10 hover:text-white/80">
                <SiWaze size={16} className="text-[#33CCFF]/70" /> Waze
              </a>
              <a href={`https://maps.apple.com/?daddr=${encodeURIComponent(sedeConfig?.address || '')}`} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2 text-sm text-white/60 transition hover:bg-white/10 hover:text-white/80">
                <SiApple size={16} className="text-white/50" /> Apple Maps
              </a>
            </div>
          </div>
        </div>

        {/* Form (col 2-3 on desktop) */}
        <div className="order-1 md:order-2 md:col-span-2">
          <form noValidate onSubmit={(e) => { e.preventDefault(); handleSubmit() }} className="space-y-5">
            {/* Name */}
            <div>
              <label className={`mb-1 block text-sm font-medium ${tried && !name.trim() ? 'text-white/60' : 'text-white/70'}`}>
                {t('reservations.name')}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('reservations.namePlaceholder')}
                autoComplete="name"
                className={`w-full rounded-xl bg-white/10 px-4 py-3 text-[16px] text-white placeholder-white/30 outline-none transition ${
                  tried && !name.trim() ? 'ring-2 ring-white/60' : 'focus:ring-2 focus:ring-brand'
                }`}
              />
              {tried && !name.trim() && (
                <p className="mt-1 text-xs text-white/60">{isEn ? 'Name is required' : 'El nombre es requerido'}</p>
              )}
            </div>

            {/* People counter */}
            <div>
              <label className="mb-1 block text-sm font-medium text-white/70">{t('reservations.people')}</label>
              <div className="flex items-center gap-4">
                <button type="button" onClick={() => setPeople(Math.max(1, people - 1))}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20">
                  <Minus size={18} />
                </button>
                <span className="min-w-[40px] text-center text-2xl font-bold">{people}</span>
                <button type="button" onClick={() => setPeople(people + 1)}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20">
                  <Plus size={18} />
                </button>
              </div>
            </div>

            {/* Date */}
            <div>
              <label className={`mb-1 block text-sm font-medium ${tried && !dateValid ? 'text-white/60' : 'text-white/70'}`}>
                {t('reservations.date')}
              </label>
              <input
                ref={dateInputRef}
                type="date"
                value={date}
                min={today}
                onChange={(e) => handleDateChange(e.target.value)}
                className="sr-only"
              />
              <button
                type="button"
                onClick={() => dateInputRef.current?.showPicker()}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition ${
                  isClosed
                    ? 'border-2 border-white/60 bg-white/10'
                    : tried && !dateValid
                      ? 'bg-white/10 ring-2 ring-white/60'
                      : 'bg-white/10 hover:bg-white/15'
                }`}
              >
                <CalendarDots size={20} className="text-brand" />
                <span className={date ? 'text-white' : 'text-white/30'}>
                  {date ? formatDate(date) : t('reservations.selectDate')}
                </span>
              </button>
              {isClosed && (
                <p className="mt-1 text-xs text-white/60">{t('reservations.closedDay')}</p>
              )}
              {tried && !date && !isClosed && (
                <p className="mt-1 text-xs text-white/60">{isEn ? 'Date is required' : 'La fecha es requerida'}</p>
              )}
            </div>

            {/* Time */}
            <div>
              <label className={`mb-1 block text-sm font-medium ${tried && !time ? 'text-white/60' : 'text-white/70'}`}>
                {t('reservations.time')}
              </label>
              {!date ? (
                <button
                  type="button"
                  onClick={() => dateInputRef.current?.showPicker()}
                  className="w-full rounded-xl bg-white/5 px-4 py-3 text-sm text-white/30"
                >
                  {t('reservations.selectDateFirst')}
                </button>
              ) : isClosed ? (
                <p className="rounded-xl bg-white/60/10 px-4 py-3 text-sm text-white/60">
                  {t('reservations.noSchedule')}
                </p>
              ) : (
                <div className="space-y-3">
                  {timeSlots.map((group) => (
                    <div key={group.label}>
                      <div className="mb-2 flex items-center gap-1.5 text-xs uppercase tracking-wide text-white/40">
                        <group.icon size={14} />
                        {group.label}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {group.slots.map((slot) => (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => setTime(slot)}
                            className={`rounded-lg px-3 py-1.5 text-sm transition ${
                              time === slot
                                ? 'border border-brand bg-brand/15 font-bold text-brand'
                                : 'bg-white/10 text-white/70 hover:bg-white/20'
                            }`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {tried && !time && date && !isClosed && (
                <p className="mt-1 text-xs text-white/60">{isEn ? 'Time is required' : 'La hora es requerida'}</p>
              )}
            </div>

            {/* Comments */}
            <div>
              <label className="mb-1 block text-sm font-medium text-white/70">{t('reservations.comments')}</label>
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder={t('reservations.commentsPlaceholder')}
                rows={3}
                className="w-full rounded-xl bg-white/10 px-4 py-3 text-[16px] text-white placeholder-white/30 outline-none transition focus:ring-2 focus:ring-brand"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className={`w-full rounded-xl py-3 font-bold transition ${
                isValid
                  ? 'bg-brand text-primary hover:bg-brand-light'
                  : 'cursor-not-allowed bg-accent/30 text-white/40'
              }`}
            >
              {t('reservations.submit')}
            </button>
            {tried && !isValid && (
              <p className="text-center text-sm text-white/60">{t('reservations.completeFields')}</p>
            )}
          </form>
        </div>
      </div>

      <CTA secondaryLabel={isEn ? 'Contact' : 'Contactar'} secondaryHref="/contacto" />
    </div>
  )
}
