import type { FaqItem, Lang } from '../../lib/blog/types'

interface Props {
  items: FaqItem[]
  lang: Lang
}

const HEADING: Record<Lang, string> = {
  es: 'Preguntas frecuentes',
  en: 'Frequently asked questions',
  fr: 'Questions fréquentes',
}

export default function FaqSection({ items, lang }: Props) {
  if (items.length === 0) return null

  return (
    <section
      aria-labelledby="faq-heading"
      className="mx-auto mt-16 max-w-3xl"
    >
      <h2
        id="faq-heading"
        className="mb-8 font-display text-2xl font-semibold text-brand md:text-3xl"
      >
        {HEADING[lang]}
      </h2>
      <div className="divide-y divide-brand/15">
        {items.map((item, i) => (
          <details
            key={i}
            className="group py-4 first:pt-0 last:pb-0"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-lg font-medium text-brand focus:outline-none focus-visible:rounded focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-primary">
              <span>{item.q}</span>
              <span
                aria-hidden="true"
                className="shrink-0 text-accent transition-transform duration-200 group-open:rotate-180"
              >
                ▾
              </span>
            </summary>
            <div className="mt-3 pr-8">
              <p className="leading-relaxed text-text-muted">{item.a}</p>
            </div>
          </details>
        ))}
      </div>
    </section>
  )
}
