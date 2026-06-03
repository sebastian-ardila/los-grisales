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
}

/**
 * Per-page SEO. Sets language-aware <title>, meta description, canonical,
 * hreflang alternates and Open Graph / Twitter tags. The current pathname
 * (minus the lang prefix) is used to build the alternate URLs for the other
 * two languages, keeping translations linked in Google's index.
 */
export default function SEO({ title, description, image }: Props) {
  const lang = useLang()
  const location = useLocation()

  // Strip the leading /:lang from the current path so we can rebuild it per
  // locale. e.g. "/es/historia" → "/historia"; "/en" → "".
  const subpath = location.pathname.replace(/^\/(es|en|fr)/, '')
  const canonical = `${SITE_ORIGIN}/${lang}${subpath}`
  const ogImage = image ?? OG_IMAGE

  const alternates: { hreflang: string; href: string }[] = [
    { hreflang: 'es', href: `${SITE_ORIGIN}/es${subpath}` },
    { hreflang: 'en', href: `${SITE_ORIGIN}/en${subpath}` },
    { hreflang: 'fr', href: `${SITE_ORIGIN}/fr${subpath}` },
    { hreflang: 'x-default', href: `${SITE_ORIGIN}/es${subpath}` },
  ]

  return (
    <Helmet>
      <html lang={lang} />
      <title>{title[lang]}</title>
      <meta name="description" content={description[lang]} />
      <link rel="canonical" href={canonical} />

      {alternates.map((a) => (
        <link key={a.hreflang} rel="alternate" hrefLang={a.hreflang} href={a.href} />
      ))}

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Café Los Grisales" />
      <meta property="og:title" content={title[lang]} />
      <meta property="og:description" content={description[lang]} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:locale" content={LOCALES[lang]} />
      {(['es', 'en', 'fr'] as Lang[])
        .filter((l) => l !== lang)
        .map((l) => (
          <meta key={l} property="og:locale:alternate" content={LOCALES[l]} />
        ))}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title[lang]} />
      <meta name="twitter:description" content={description[lang]} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  )
}
