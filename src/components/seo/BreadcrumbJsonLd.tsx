import { Helmet } from 'react-helmet-async'

interface Props {
  items: { name: string; url: string }[]
}

/** JSON-LD BreadcrumbList (Inicio › Blog › Artículo). */
export default function BreadcrumbJsonLd({ items }: Props) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  }
  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(data)}</script>
    </Helmet>
  )
}
