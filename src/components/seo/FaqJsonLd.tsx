import JsonLd from './JsonLd'
import type { FaqItem } from '../../lib/blog/types'

interface Props {
  items: FaqItem[]
}

/** JSON-LD FAQPage para que Google muestre respuestas enriquecidas en la SERP. */
export default function FaqJsonLd({ items }: Props) {
  if (items.length === 0) return null

  const data = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  }

  return <JsonLd data={data} />
}
