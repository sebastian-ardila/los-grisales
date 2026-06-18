import { Helmet } from 'react-helmet-async'
import { useLocation } from 'react-router-dom'
import { useLang, type Lang } from '../../utils/lang'

const SITE_ORIGIN = 'https://cafelosgrisales.com'
const OG_IMAGE = `${SITE_ORIGIN}/og-image.jpg`
const LOCALES: Record<Lang, string> = { es: 'es_CO', en: 'en_US', fr: 'fr_FR' }

type LangMap = Record<Lang, string>

interface Props {
  title: LangMap
  description: LangMap
  /** Optional override for canonical / OG image — falls back to defaults. */
  image?: string
  /** 'website' (default) o 'article' para posts del blog. */
  type?: 'website' | 'article'
  /** Meta keywords (artículos). */
  keywords?: string
  /**
   * Subpaths por idioma para slugs localizados (p. ej. { es:'/blog/x', en:'/blog/y', fr:'/blog/z' }).
   * Si se omite, se reusa el pathname actual sin prefijo de idioma.
   */
  alternates?: Record<Lang, string>
  publishedTime?: string
  modifiedTime?: string
}

/**
 * Per-page SEO. Sets language-aware <title>, meta description, canonical,
 * hreflang alternates and Open Graph / Twitter tags. The current pathname
 * (minus the lang prefix) is used to build the alternate URLs for the other
 * two languages, keeping translations linked in Google's index.
 */
export default function SEO({
  title,
  description,
  image,
  type = 'website',
  keywords,
  alternates,
  publishedTime,
  modifiedTime,
}: Props) {
  const lang = useLang()
  const location = useLocation()

  const subpath = location.pathname.replace(/^\/(es|en|fr)/, '')
  const pathFor = (l: Lang) => alternates?.[l] ?? subpath
  const canonical = `${SITE_ORIGIN}/${lang}${pathFor(lang)}`
  const ogImage = image ?? OG_IMAGE

  const langs: Lang[] = ['es', 'en', 'fr']
  const altLinks = [
    ...langs.map((l) => ({ hreflang: l, href: `${SITE_ORIGIN}/${l}${pathFor(l)}` })),
    { hreflang: 'x-default', href: `${SITE_ORIGIN}/es${pathFor('es')}` },
  ]

  return (
    <Helmet>
      <html lang={lang} />
      <title>{title[lang]}</title>
      <meta name="description" content={description[lang]} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={canonical} />

      {altLinks.map((a) => (
        <link key={a.hreflang} rel="alternate" hrefLang={a.hreflang} href={a.href} />
      ))}

      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="Café Los Grisales" />
      <meta property="og:title" content={title[lang]} />
      <meta property="og:description" content={description[lang]} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:locale" content={LOCALES[lang]} />
      {langs
        .filter((l) => l !== lang)
        .map((l) => (
          <meta key={l} property="og:locale:alternate" content={LOCALES[l]} />
        ))}
      {type === 'article' && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === 'article' && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title[lang]} />
      <meta name="twitter:description" content={description[lang]} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  )
}
