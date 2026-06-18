import type { ContentSource } from './types'
import { MarkdownSource } from './MarkdownSource'

// Fuente activa. Para migrar al CMS futuro: reemplazar por `new CmsSource(...)`.
// Las páginas y componentes sólo dependen de la interfaz `ContentSource`.
const files = import.meta.glob('../../content/blog/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

export const blog: ContentSource = new MarkdownSource(files)
