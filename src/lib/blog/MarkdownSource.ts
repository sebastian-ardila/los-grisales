import type {
  BlogListItem,
  BlogMeta,
  BlogPost,
  ContentSource,
  FaqItem,
  Lang,
  SedeRef,
} from './types'
import { estimateReadingMinutes, parseDoc } from './markdown'

const LANGS: Lang[] = ['es', 'en', 'fr']
const PATH_RE = /\/content\/blog\/([^/]+)\/(es|en|fr)\.md$/

interface ParsedFile {
  id: string
  lang: Lang
  slug: string
  meta: Omit<BlogMeta, 'translations'>
  body: string
}

function toStringArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.map((v) => String(v))
  if (value == null) return []
  return [String(value)]
}

function toFaqArray(value: unknown): FaqItem[] {
  if (!Array.isArray(value)) return []
  return value
    .filter((item): item is Record<string, unknown> =>
      item !== null && typeof item === 'object',
    )
    .map((item) => ({
      q: String(item.q ?? ''),
      a: String(item.a ?? ''),
    }))
    .filter((item) => item.q.length > 0)
}

export class MarkdownSource implements ContentSource {
  private posts: BlogPost[] = []

  constructor(files: Record<string, string>) {
    const parsed: ParsedFile[] = []
    for (const [path, raw] of Object.entries(files)) {
      const match = path.match(PATH_RE)
      if (!match) continue
      const [, id, lang] = match
      const { attributes: a, body } = parseDoc(raw)
      parsed.push({
        id,
        lang: lang as Lang,
        slug: String(a.slug),
        body,
        meta: {
          id,
          slug: String(a.slug),
          title: String(a.title ?? ''),
          description: String(a.description ?? ''),
          excerpt: String(a.excerpt ?? ''),
          keywords: toStringArray(a.keywords),
          date: String(a.date ?? ''),
          updated: String(a.updated ?? a.date ?? ''),
          author: String(a.author ?? 'Café Los Grisales'),
          cover: String(a.cover ?? ''),
          coverAlt: String(a.coverAlt ?? ''),
          tags: toStringArray(a.tags),
          relatedSede: a.relatedSede
            ? (String(a.relatedSede) as SedeRef)
            : undefined,
          faq: toFaqArray(a.faq),
        },
      })
    }

    // translations: id -> { lang: slug }
    const translations = new Map<string, Record<Lang, string>>()
    for (const id of new Set(parsed.map((p) => p.id))) {
      const entry = {} as Record<Lang, string>
      for (const lang of LANGS) {
        const f = parsed.find((p) => p.id === id && p.lang === lang)
        if (f) entry[lang] = f.slug
      }
      translations.set(id, entry)
    }

    this.posts = parsed.map((p) => ({
      ...p.meta,
      translations: translations.get(p.id) ?? ({} as Record<Lang, string>),
      body: p.body,
      readingMinutes: estimateReadingMinutes(p.body),
    }))
  }

  private listItem(post: BlogPost): BlogListItem {
    const { body: _body, ...rest } = post
    return rest
  }

  getAllPosts(lang: Lang): BlogListItem[] {
    return this.posts
      .filter((p) => p.translations[lang] === p.slug)
      .sort((a, b) => b.date.localeCompare(a.date))
      .map((p) => this.listItem(p))
  }

  getPost(lang: Lang, slug: string): BlogPost | null {
    return (
      this.posts.find((p) => p.translations[lang] === slug && p.slug === slug) ??
      null
    )
  }

  findByAnySlug(slug: string): BlogPost | null {
    return this.posts.find((p) => Object.values(p.translations).includes(slug)) ?? null
  }

  getAllSlugs(): { id: string; lang: Lang; slug: string }[] {
    return this.posts.map((p) => ({ id: p.id, lang: this.langOf(p), slug: p.slug }))
  }

  private langOf(post: BlogPost): Lang {
    const found = (Object.keys(post.translations) as Lang[]).find(
      (l) => post.translations[l] === post.slug,
    )
    return found ?? 'es'
  }

  getRelated(post: BlogMeta, lang: Lang, limit = 3): BlogListItem[] {
    return this.getAllPosts(lang)
      .filter((p) => p.id !== post.id)
      .slice(0, limit)
  }
}
