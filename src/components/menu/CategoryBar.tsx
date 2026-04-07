import { useEffect, useRef, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { categoryIconMap } from '../../data/categoryIcons'
import type { MenuCategory } from '../../data/types'

interface Props {
  categories: MenuCategory[]
  activeCategory: string
  onCategoryClick: (categoryId: string) => void
}

function splitIntoRows(items: MenuCategory[], rowCount: number): MenuCategory[][] {
  const rows: MenuCategory[][] = Array.from({ length: rowCount }, () => [])
  items.forEach((item, i) => {
    rows[i % rowCount].push(item)
  })
  return rows
}

export default function CategoryBar({ categories, activeCategory, onCategoryClick }: Props) {
  const { i18n } = useTranslation()
  const lang = i18n.language === 'en' ? 'en' : 'es'
  const scrollRef = useRef<HTMLDivElement>(null)
  const chipRefs = useRef<Map<string, HTMLButtonElement>>(new Map())

  // Split into rows: we render all row counts and show/hide with CSS
  const rows2 = useMemo(() => splitIntoRows(categories, 2), [categories])
  const rows3 = useMemo(() => splitIntoRows(categories, 3), [categories])

  useEffect(() => {
    if (!activeCategory || !scrollRef.current) return
    const chip = chipRefs.current.get(activeCategory)
    if (!chip) return

    const container = scrollRef.current
    const chipLeft = chip.offsetLeft
    const chipWidth = chip.offsetWidth
    const containerWidth = container.clientWidth
    const scrollLeft = container.scrollLeft

    if (chipLeft < scrollLeft || chipLeft + chipWidth > scrollLeft + containerWidth) {
      container.scrollTo({
        left: chipLeft - containerWidth / 2 + chipWidth / 2,
        behavior: 'smooth',
      })
    }
  }, [activeCategory])

  const renderChip = (cat: MenuCategory) => {
    const isActive = activeCategory === cat.id
    const IconComponent = categoryIconMap[cat.icon]
    return (
      <button
        key={cat.id}
        ref={(el) => { if (el) chipRefs.current.set(cat.id, el) }}
        onClick={() => onCategoryClick(cat.id)}
        className={`inline-flex shrink-0 items-center gap-1 px-3 py-1.5 rounded-full cursor-pointer transition-all whitespace-nowrap ${
          isActive
            ? 'bg-brand text-primary font-bold'
            : 'bg-white/10 text-white/70 hover:bg-white/20'
        } text-xs md:text-sm`}
      >
        {IconComponent && <IconComponent size={16} weight="bold" />}
        {cat.name[lang]}
      </button>
    )
  }

  return (
    <div className="bg-primary/95 backdrop-blur-sm py-3 px-4">
      <div ref={scrollRef} className="overflow-x-auto scrollbar-hide">
        {/* Desktop: 2 rows */}
        <div className="hidden md:flex md:flex-col md:gap-2">
          {rows2.map((row, i) => (
            <div key={i} className="flex gap-2">
              {row.map(renderChip)}
            </div>
          ))}
        </div>
        {/* Mobile: 3 rows */}
        <div className="flex flex-col gap-2 md:hidden">
          {rows3.map((row, i) => (
            <div key={i} className="flex gap-2">
              {row.map(renderChip)}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
