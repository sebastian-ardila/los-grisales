import { useEffect } from 'react'
import {
  X,
  InstagramLogo,
  FacebookLogo,
  TiktokLogo,
  YoutubeLogo,
  WhatsappLogo,
} from '@phosphor-icons/react'
import { social } from '../../data/social'
import { useLang } from '../../utils/lang'

interface Props {
  open: boolean
  onClose: () => void
}

interface SocialLink {
  href: string
  label: string
  handle: string
  brandColor: string
  icon: React.ReactNode
}

const links: SocialLink[] = [
  {
    href: social.instagram,
    label: 'Instagram',
    handle: social.instagramHandle,
    brandColor: '#E1306C',
    icon: <InstagramLogo size={22} weight="fill" />,
  },
  {
    href: social.facebook,
    label: 'Facebook',
    handle: social.facebookHandle,
    brandColor: '#1877F2',
    icon: <FacebookLogo size={22} weight="fill" />,
  },
  {
    href: social.tiktok,
    label: 'TikTok',
    handle: social.tiktokHandle,
    brandColor: '#000000',
    icon: <TiktokLogo size={22} weight="fill" />,
  },
  {
    href: social.youtube,
    label: 'YouTube',
    handle: social.youtubeHandle,
    brandColor: '#FF0000',
    icon: <YoutubeLogo size={22} weight="fill" />,
  },
  {
    href: social.whatsapp,
    label: 'WhatsApp',
    handle: social.whatsappNumber,
    brandColor: '#25D366',
    icon: <WhatsappLogo size={22} weight="fill" />,
  },
]

export default function SocialModal({ open, onClose }: Props) {
  const lang = useLang()

  // Close on Escape
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  const title = { es: 'Síguenos', en: 'Follow us', fr: 'Suivez-nous' }[lang]
  const subtitle = {
    es: 'Encuéntranos en nuestras redes sociales',
    en: 'Find us on our social channels',
    fr: 'Retrouvez-nous sur nos réseaux sociaux',
  }[lang]

  return (
    <div
      className="fixed inset-0 z-[90] flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ backgroundColor: '#f5efdf' }}
        className="animate-slide-up w-full max-w-md overflow-hidden rounded-t-2xl shadow-[0_-20px_60px_-20px_rgba(0,0,0,0.4)] sm:rounded-2xl"
      >
        <header className="flex items-center justify-between gap-3 border-b border-black/10 px-5 py-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-brand/70">
              Café Los Grisales
            </p>
            <h2 className="font-display text-lg font-bold leading-tight">{title}</h2>
            <p className="mt-0.5 text-xs opacity-70">{subtitle}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 transition hover:bg-black/5"
            aria-label="close"
          >
            <X size={20} />
          </button>
        </header>

        <div className="grid grid-cols-1 gap-2 p-4 sm:grid-cols-2 sm:p-5">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{ backgroundColor: '#ffffff' }}
              className="group flex items-center gap-3 rounded-xl border border-black/10 px-3.5 py-3 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_10px_22px_-10px_rgba(6,73,71,0.3)]"
            >
              <span
                style={{ backgroundColor: `${l.brandColor}15`, color: l.brandColor }}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition group-hover:scale-105"
              >
                {l.icon}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-display text-sm font-bold leading-tight">
                  {l.label}
                </span>
                <span className="block truncate text-[11px] opacity-70">{l.handle}</span>
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
