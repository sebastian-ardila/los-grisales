import { useEffect, useRef, useState, type PointerEvent } from 'react'
import { CaretLeft, CaretRight } from '@phosphor-icons/react'

interface Props {
  photos: string[]
  autoMs?: number
  className?: string
}

const SWIPE_THRESHOLD = 60

// Stack layout — back to front
const SLOTS = [
  // back-most card
  {
    offset: 2,
    transform: 'translate(26px, 30px) rotate(6deg) scale(0.88)',
    opacity: 0.78,
    z: 10,
    shadow: '0 22px 40px -18px rgba(0,0,0,0.45), 0 8px 16px -8px rgba(0,0,0,0.25)',
  },
  // middle card
  {
    offset: 1,
    transform: 'translate(-18px, 16px) rotate(-4deg) scale(0.93)',
    opacity: 0.92,
    z: 20,
    shadow: '0 24px 44px -18px rgba(0,0,0,0.5), 0 10px 18px -8px rgba(0,0,0,0.28)',
  },
  // front card
  {
    offset: 0,
    transform: 'translate(0, 0) rotate(0) scale(1)',
    opacity: 1,
    z: 30,
    shadow: '0 28px 56px -22px rgba(0,0,0,0.45)',
  },
]

export default function PhotoStack({ photos, autoMs, className = '' }: Props) {
  const [index, setIndex] = useState(0)
  const isPaused = useRef(false)
  const startX = useRef(0)
  const pointerId = useRef<number | null>(null)
  const dragging = useRef(false)

  const len = photos.length
  const wrap = (n: number) => ((n % len) + len) % len

  const advance = (dir: 1 | -1) => setIndex((i) => wrap(i + dir))

  useEffect(() => {
    if (!autoMs || autoMs <= 0) return
    const id = window.setInterval(() => {
      if (!isPaused.current) advance(1)
    }, autoMs)
    return () => window.clearInterval(id)
  }, [autoMs])

  // Preload next two
  useEffect(() => {
    ;[1, 2].forEach((d) => {
      const img = new Image()
      img.src = photos[wrap(index + d)]
    })
  }, [index, photos])

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    pointerId.current = e.pointerId
    startX.current = e.clientX
    dragging.current = true
    isPaused.current = true
    ;(e.currentTarget as Element).setPointerCapture?.(e.pointerId)
  }

  const onPointerUp = (e: PointerEvent<HTMLDivElement>) => {
    if (pointerId.current !== e.pointerId) return
    const dx = e.clientX - startX.current
    pointerId.current = null
    dragging.current = false
    isPaused.current = false
    if (dx > SWIPE_THRESHOLD) advance(-1)
    else if (dx < -SWIPE_THRESHOLD) advance(1)
  }

  return (
    <div
      className={`relative ${className}`}
      onMouseEnter={() => (isPaused.current = true)}
      onMouseLeave={() => {
        if (!dragging.current) isPaused.current = false
      }}
    >
      {/* Stack container — has padding to allow back cards to peek */}
      <div className="relative mx-auto aspect-square w-full max-w-[580px] md:aspect-[5/4] [&_img]:!object-center">
        {SLOTS.map((slot) => {
          const photoIdx = wrap(index + slot.offset)
          const isFront = slot.offset === 0
          return (
            <div
              key={slot.offset}
              className="absolute inset-0 overflow-hidden rounded-2xl bg-black/5 ring-1 ring-black/10"
              style={{
                transform: slot.transform,
                opacity: slot.opacity,
                zIndex: slot.z,
                boxShadow: slot.shadow,
                transition: 'transform 0.5s ease, opacity 0.5s ease, box-shadow 0.5s ease',
              }}
              onPointerDown={isFront ? onPointerDown : undefined}
              onPointerUp={isFront ? onPointerUp : undefined}
              onPointerCancel={isFront ? onPointerUp : undefined}
            >
              <div className={`relative h-full w-full select-none ${isFront ? 'cursor-grab touch-pan-y active:cursor-grabbing' : 'pointer-events-none'}`}>
                {photos.map((src, i) => (
                  <img
                    key={src}
                    src={src}
                    alt=""
                    draggable={false}
                    className="absolute inset-0 h-full w-full"
                    style={{
                      objectFit: 'cover',
                      objectPosition: 'center',
                      opacity: i === photoIdx ? 1 : 0,
                      transition: 'opacity 0.7s ease',
                    }}
                  />
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Controls */}
      <div className="mt-5 flex items-center justify-center gap-3">
        <button
          onClick={() => advance(-1)}
          aria-label="Anterior"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-black/10 transition hover:bg-black/20"
        >
          <CaretLeft size={18} weight="bold" />
        </button>
        <div className="flex items-center gap-1.5">
          {photos.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Foto ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? 'w-6 bg-brand' : 'w-1.5 bg-black/25 hover:bg-black/40'
              }`}
            />
          ))}
        </div>
        <button
          onClick={() => advance(1)}
          aria-label="Siguiente"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-black/10 transition hover:bg-black/20"
        >
          <CaretRight size={18} weight="bold" />
        </button>
      </div>
    </div>
  )
}
