import { useState, useRef, useMemo } from 'react'
import {
  CalendarDots,
  Plus,
  Minus,
  Sun,
  SunHorizon as SunHorizonIcon,
  Moon,
  WhatsappLogo,
  X,
} from '@phosphor-icons/react'
import { getSedeScheduleForDay } from '../../config/sedes'
import { buildReservationWhatsAppUrl, buildCoffeeTourWhatsAppUrl } from '../../utils/whatsapp'
import type { SedeConfig } from '../../data/types'

type Mode = 'tour' | 'cafe'

interface WhatsappReservationModalProps {
  open: boolean
  onClose: () => void
  mode: Mode
  sede: SedeConfig
  isEn: boolean
}

export default function WhatsappReservationModal({ open, onClose, mode, sede, isEn }: WhatsappReservationModalProps) {
  const dateInputRef = useRef<HTMLInputElement>(null)

  const [name, setName] = useState('')
  const [people, setPeople] = useState(2)
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [preferredTime, setPreferredTime] = useState('')
  const [comments, setComments] = useState('')
  const [tried, setTried] = useState(false)

  const today = new Date().toISOString().split('T')[0]
  const dayOfWeek = date ? new Date(date + 'T12:00:00').getDay() : -1
  const scheduleForDay = date ? getSedeScheduleForDay(sede.id, dayOfWeek) : null
  const isClosed = date !== '' && scheduleForDay === null && mode === 'cafe'

  const timeSlots = useMemo(() => {
    const groups: { label: string; icon: typeof Sun; slots: string[] }[] = []
    if (!scheduleForDay || mode !== 'cafe') return groups
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
    if (morning.length > 0) groups.push({ label: isEn ? 'Morning' : 'Mañana', icon: Sun, slots: morning })
    if (afternoon.length > 0) groups.push({ label: isEn ? 'Afternoon' : 'Tarde', icon: SunHorizonIcon, slots: afternoon })
    if (evening.length > 0) groups.push({ label: isEn ? 'Evening' : 'Noche', icon: Moon, slots: evening })
    return groups
  }, [scheduleForDay, isEn, mode])

  const dateValid = date !== ''
  const isValid = mode === 'tour'
    ? name.trim() !== '' && dateValid
    : name.trim() !== '' && dateValid && !isClosed && time !== ''

  const formatDate = (dateStr: string) => {
    if (!dateStr) return ''
    const d = new Date(dateStr + 'T12:00:00')
    return d.toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
  }

  const handleDateChange = (val: string) => {
    setDate(val)
    if (mode !== 'cafe') return
    const dow = new Date(val + 'T12:00:00').getDay()
    const sched = getSedeScheduleForDay(sede.id, dow)
    if (sched === null) setTime('')
    else if (time) {
      const allSlots = timeSlots.flatMap(ts => ts.slots)
      if (!allSlots.includes(time)) setTime('')
    }
  }

  const handleSubmit = () => {
    setTried(true)
    if (!isValid) return

    const url = mode === 'tour'
      ? buildCoffeeTourWhatsAppUrl({
          name,
          people,
          date: formatDate(date),
          preferredTime,
          comments,
          phone: sede.whatsappNumber,
        })
      : buildReservationWhatsAppUrl({
          name,
          people,
          date: formatDate(date),
          time,
          comments,
          phone: sede.whatsappNumber,
          sedeName: sede.nameShort,
        })
    window.open(url, '_blank')
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center bg-black/80 p-0 animate-fade-in sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-h-[92vh] overflow-y-auto rounded-t-2xl border border-white/10 bg-primary-light p-5 sm:max-w-lg sm:rounded-2xl md:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white/70 transition hover:border-white/40 hover:bg-white/10 hover:text-white"
          aria-label={isEn ? 'Close' : 'Cerrar'}
        >
          <X size={18} />
        </button>

        <div className="mb-5 pr-10">
          <div className="mb-2 flex items-center gap-2">
            <WhatsappLogo size={22} weight="fill" className="text-[#25D366]" />
            <h2 className="text-lg font-bold text-white">
              {mode === 'tour'
                ? isEn ? 'Reserve via WhatsApp' : 'Reservar por WhatsApp'
                : isEn ? `Reserve a table at ${sede.nameShort}` : `Reservar mesa en ${sede.nameShort}`}
            </h2>
          </div>
          <p className="text-sm text-white/60">
            {mode === 'tour'
              ? isEn
                ? 'Send us your details and we confirm availability for your Coffee Tour.'
                : 'Envíanos tus datos y te confirmamos la disponibilidad del Coffee Tour.'
              : isEn
                ? 'Send us your details and we confirm your table reservation.'
                : 'Envíanos tus datos y te confirmamos tu reserva.'}
          </p>
        </div>

        <form noValidate onSubmit={(e) => { e.preventDefault(); handleSubmit() }} className="space-y-5">
          <div>
            <label className={`mb-1 block text-sm font-medium ${tried && !name.trim() ? 'text-white/60' : 'text-white/70'}`}>
              {isEn ? 'Name' : 'Nombre'}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={isEn ? 'Your name' : 'Tu nombre'}
              autoComplete="name"
              className={`w-full rounded-xl bg-white/10 px-4 py-3 text-[16px] text-white placeholder-white/30 outline-none transition ${
                tried && !name.trim() ? 'ring-2 ring-white/60' : 'focus:ring-2 focus:ring-brand'
              }`}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-white/70">
              {isEn ? 'Number of people' : 'Número de personas'}
            </label>
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

          <div>
            <label className={`mb-1 block text-sm font-medium ${tried && !dateValid ? 'text-white/60' : 'text-white/70'}`}>
              {isEn ? 'Date' : 'Fecha'}
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
                {date ? formatDate(date) : (isEn ? 'Select date' : 'Seleccionar fecha')}
              </span>
            </button>
            {isClosed && (
              <p className="mt-1 text-xs text-white/60">{isEn ? 'No service on this day. Pick another date.' : 'No hay servicio este día. Selecciona otra fecha.'}</p>
            )}
          </div>

          {mode === 'tour' ? (
            <div>
              <label className="mb-1 block text-sm font-medium text-white/70">
                {isEn ? 'Preferred time (optional)' : 'Hora preferida (opcional)'}
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { es: 'Mañana', en: 'Morning' },
                  { es: 'Mediodía', en: 'Noon' },
                  { es: 'Tarde', en: 'Afternoon' },
                ].map((opt) => {
                  const label = isEn ? opt.en : opt.es
                  const value = opt.es
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setPreferredTime(preferredTime === value ? '' : value)}
                      className={`rounded-lg px-3 py-1.5 text-sm transition ${
                        preferredTime === value
                          ? 'border border-brand bg-brand/15 font-bold text-brand'
                          : 'bg-white/10 text-white/70 hover:bg-white/20'
                      }`}
                    >
                      {label}
                    </button>
                  )
                })}
              </div>
            </div>
          ) : (
            <div>
              <label className={`mb-1 block text-sm font-medium ${tried && !time ? 'text-white/60' : 'text-white/70'}`}>
                {isEn ? 'Time' : 'Hora'}
              </label>
              {!date ? (
                <button
                  type="button"
                  onClick={() => dateInputRef.current?.showPicker()}
                  className="w-full rounded-xl bg-white/5 px-4 py-3 text-sm text-white/30"
                >
                  {isEn ? 'Select a date first' : 'Selecciona una fecha primero'}
                </button>
              ) : isClosed ? (
                <p className="rounded-xl bg-white/5 px-4 py-3 text-sm text-white/60">
                  {isEn ? 'No hours available for this day' : 'No hay horarios disponibles para este día'}
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
          )}

          <div>
            <label className="mb-1 block text-sm font-medium text-white/70">
              {isEn ? 'Additional comments' : 'Comentarios adicionales'}
            </label>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder={mode === 'tour'
                ? (isEn ? 'Transportation, special requests, languages...' : 'Transporte, solicitudes especiales, idiomas...')
                : (isEn ? 'Allergies, birthdays, preferences...' : 'Alergias, cumpleaños, preferencias...')}
              rows={3}
              className="w-full rounded-xl bg-white/10 px-4 py-3 text-[16px] text-white placeholder-white/30 outline-none transition focus:ring-2 focus:ring-brand"
            />
          </div>

          <button
            type="submit"
            className={`flex w-full items-center justify-center gap-2 rounded-xl py-3 font-bold transition ${
              isValid
                ? 'bg-[#25D366] text-white hover:bg-[#20b858]'
                : 'cursor-not-allowed bg-white/10 text-white/40'
            }`}
          >
            <WhatsappLogo size={20} weight="fill" />
            {isEn ? 'Send via WhatsApp' : 'Enviar por WhatsApp'}
          </button>
          {tried && !isValid && (
            <p className="text-center text-sm text-white/60">{isEn ? 'Complete the required fields' : 'Completa los campos requeridos'}</p>
          )}
        </form>
      </div>
    </div>
  )
}
