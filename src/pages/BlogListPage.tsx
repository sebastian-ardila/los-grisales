import { useLang } from '../utils/lang'
import { blog } from '../lib/blog'
import SEO from '../components/seo/SEO'
import BlogGrid from '../components/blog/BlogGrid'

export default function BlogListPage() {
  const lang = useLang()
  const posts = blog.getAllPosts(lang)
  const heading = { es: 'Blog', en: 'Blog', fr: 'Blog' }[lang]
  const tagline = {
    es: 'Café de especialidad, Coffee Tour y la cultura cafetera de Pereira.',
    en: 'Specialty coffee, Coffee Tour and the coffee culture of Pereira.',
    fr: 'Café de spécialité, Coffee Tour et la culture du café de Pereira.',
  }[lang]

  return (
    <div className="mx-auto max-w-6xl px-4 py-20 md:py-28">
      <SEO
        title={{
          es: 'Blog de café de especialidad y Coffee Tour en Pereira | Café Los Grisales',
          en: 'Specialty coffee & Coffee Tour blog in Pereira | Café Los Grisales',
          fr: 'Blog café de spécialité & Coffee Tour à Pereira | Café Los Grisales',
        }}
        description={{
          es: 'Artículos sobre café de especialidad, Coffee Tour y dónde tomar café en Pereira (Unicentro y Pereira Plaza).',
          en: 'Articles about specialty coffee, Coffee Tour and where to have coffee in Pereira (Unicentro and Pereira Plaza).',
          fr: 'Articles sur le café de spécialité, le Coffee Tour et où prendre un café à Pereira (Unicentro et Pereira Plaza).',
        }}
        alternates={{ es: '/blog', en: '/blog', fr: '/blog' }}
      />
      <header className="mb-16 text-center">
        <h1 className="font-display text-5xl font-bold text-brand md:text-7xl">{heading}</h1>
        <p className="mx-auto mt-5 max-w-2xl opacity-70">{tagline}</p>
      </header>
      <BlogGrid posts={posts} lang={lang} />
    </div>
  )
}
