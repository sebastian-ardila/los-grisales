import { Navigate, useParams } from 'react-router-dom'
import { useLang } from '../utils/lang'
import { blog } from '../lib/blog'
import SEO from '../components/seo/SEO'
import ArticleJsonLd from '../components/seo/ArticleJsonLd'
import BreadcrumbJsonLd from '../components/seo/BreadcrumbJsonLd'
import ArticleHeader from '../components/blog/ArticleHeader'
import ArticleBody from '../components/blog/ArticleBody'
import ArticleFooter from '../components/blog/ArticleFooter'
import RelatedPosts from '../components/blog/RelatedPosts'
import ShareButtons from '../components/blog/ShareButtons'

const SITE_ORIGIN = 'https://cafelosgrisales.com'

export default function BlogPostPage() {
  const lang = useLang()
  const { slug } = useParams<{ slug: string }>()
  const post = slug ? blog.getPost(lang, slug) : null

  if (!post) {
    // Al cambiar de idioma el slug es localizado: si el slug pertenece a este
    // artículo en otro idioma, redirige a su versión traducida (mismo artículo)
    // en vez de salir al índice del blog.
    const known = slug ? blog.findByAnySlug(slug) : null
    const localizedSlug = known?.translations[lang]
    if (localizedSlug) {
      return <Navigate to={`/${lang}/blog/${localizedSlug}`} replace />
    }
    return <Navigate to={`/${lang}/blog`} replace />
  }

  const url = `${SITE_ORIGIN}/${lang}/blog/${post.slug}`
  const alternates = {
    es: `/blog/${post.translations.es}`,
    en: `/blog/${post.translations.en}`,
    fr: `/blog/${post.translations.fr}`,
  }
  const blogLabel = { es: 'Blog', en: 'Blog', fr: 'Blog' }[lang]
  const homeLabel = { es: 'Inicio', en: 'Home', fr: 'Accueil' }[lang]
  const related = blog.getRelated(post, lang)

  return (
    <main className="mx-auto max-w-6xl px-4 py-20 md:py-28">
      <SEO
        title={{ es: post.title, en: post.title, fr: post.title }}
        description={{ es: post.description, en: post.description, fr: post.description }}
        image={post.cover.startsWith('http') ? post.cover : `${SITE_ORIGIN}${post.cover}`}
        type="article"
        keywords={post.keywords.join(', ')}
        alternates={alternates}
        publishedTime={post.date}
        modifiedTime={post.updated}
      />
      <ArticleJsonLd post={post} lang={lang} url={url} />
      <BreadcrumbJsonLd
        items={[
          { name: homeLabel, url: `${SITE_ORIGIN}/${lang}` },
          { name: blogLabel, url: `${SITE_ORIGIN}/${lang}/blog` },
          { name: post.title, url },
        ]}
      />
      <article>
        <ArticleHeader post={post} lang={lang} />
        <ArticleBody markdown={post.body} />
        <ShareButtons url={url} title={post.title} lang={lang} />
        <ArticleFooter post={post} lang={lang} />
      </article>
      <RelatedPosts posts={related} lang={lang} />
    </main>
  )
}
