import { CoffeeBean, Storefront, Mountains, GraduationCap, type Icon } from '@phosphor-icons/react'
import type { BlogListItem } from '../../lib/blog/types'

/**
 * Ícono de marca por artículo. Mientras no haya fotos reales de portada,
 * cada tarjeta se representa con un ícono según su sede/tema.
 */
export function iconForPost(post: Pick<BlogListItem, 'relatedSede' | 'tags'>): Icon {
  if (post.relatedSede === 'coffee-tour') return Mountains
  if (post.relatedSede === 'unicentro' || post.relatedSede === 'pereira-plaza') return Storefront
  const tags = post.tags.map((t) => t.toLowerCase())
  if (tags.some((t) => t.includes('educaci') || t.includes('sca') || t.includes('education'))) {
    return GraduationCap
  }
  return CoffeeBean
}
