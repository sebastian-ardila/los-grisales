import type { Lang } from '../../lib/blog/types'

interface Props {
  url: string
  title: string
  lang: Lang
}

export default function ShareButtons({ url, title, lang }: Props) {
  const label = { es: 'Compartir', en: 'Share', fr: 'Partager' }[lang]
  const enc = encodeURIComponent
  const links = [
    { name: 'WhatsApp', href: `https://wa.me/?text=${enc(`${title} ${url}`)}` },
    { name: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}` },
    { name: 'X', href: `https://twitter.com/intent/tweet?url=${enc(url)}&text=${enc(title)}` },
  ]
  return (
    <nav aria-label={label} className="mt-10 flex items-center justify-center gap-3">
      <span className="text-sm font-semibold opacity-70">{label}:</span>
      {links.map((l) => (
        <a
          key={l.name}
          href={l.href}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-brand/30 px-4 py-1.5 text-sm text-brand transition-colors hover:bg-brand/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          {l.name}
        </a>
      ))}
    </nav>
  )
}
