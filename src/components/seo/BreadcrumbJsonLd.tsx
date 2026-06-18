import JsonLd from './JsonLd'

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
  return <JsonLd data={data} />
}
