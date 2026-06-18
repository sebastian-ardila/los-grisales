import JsonLd from './JsonLd'
import type { BlogPost, Lang } from '../../lib/blog/types'

const SITE_ORIGIN = 'https://cafelosgrisales.com'

interface Props {
  post: BlogPost
  lang: Lang
  /** URL canónica absoluta del artículo. */
  url: string
}

/** JSON-LD BlogPosting para que Google entienda el artículo. */
export default function ArticleJsonLd({ post, lang, url }: Props) {
  const image = post.cover.startsWith('http') ? post.cover : `${SITE_ORIGIN}${post.cover}`
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    image,
    inLanguage: lang,
    datePublished: post.date,
    dateModified: post.updated,
    keywords: post.keywords.join(', '),
    author: { '@type': 'Organization', name: post.author },
    publisher: {
      '@type': 'Organization',
      name: 'Café Los Grisales',
      logo: { '@type': 'ImageObject', url: `${SITE_ORIGIN}/og-image.jpg` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
  }

  return <JsonLd data={data} />
}
