import { useTranslation } from 'react-i18next'
import type { MenuCategory } from '../../data/types'
import { categoryIconMap } from '../../data/categoryIcons'
import ProductCard from './ProductCard'

interface Props {
  category: MenuCategory
  id: string
}

export default function CategorySection({ category, id }: Props) {
  const { i18n } = useTranslation()
  const lang = i18n.language === 'en' ? 'en' : 'es'
  const IconComponent = categoryIconMap[category.icon]

  return (
    <div id={id}>
      <h2 className="text-2xl font-bold text-brand mb-4 flex items-center gap-2">
        {IconComponent && <IconComponent size={28} weight="duotone" />}
        {category.name[lang]}
      </h2>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {category.items.map((item) => (
          <ProductCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  )
}
