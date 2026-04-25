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
  // Sequential split so the visual reading order (left→right, top→bottom)
  // matches the natural order of the categories in the page below.
  const perRow = Math.ceil(items.length / rowCount)
  const rows: MenuCategory[][] = []
  for (let i = 0; i < rowCount; i++) {
    rows.push(items.slice(i * perRow, (i + 1) * perRow))
  }
  return rows
}

export default function CategoryBar({ categories, activeCategory, onCategoryClick }: Props) {
  const { i18n } = useTranslation()
  const lang = i18n.language === 'en' ? 'en' : 'es'
  // Separate refs per layout so the visible chip is always picked correctly.
  const desktopScrollRef = useRef<HTMLDivElement>(null)
  const mobileScrollRef = useRef<HTMLDivElement>(null)
  const desktopChips = useRef<Map<string, HTMLButtonElement>>(new Map())
  const mobileChips = useRef<Map<string, HTMLButtonElement>>(new Map())

  const rows2 = useMemo(() => splitIntoRows(categories, 2), [categories])
  const rows3 = useMemo(() => splitIntoRows(categories, 3), [categories])

  // Auto-scroll both layouts so whichever is visible keeps the active chip in view.
  useEffect(() => {
    if (!activeCategory) return

    const scrollPair = (
      container: HTMLDivElement | null,
      chip: HTMLButtonElement | undefined,
    ) => {
      if (!container || !chip) return
      // Skip layouts that are not currently rendered (display:none has offsetParent === null)
      if (chip.offsetParent === null) return

      const containerRect = container.getBoundingClientRect()
      const chipRect = chip.getBoundingClientRect()

      // For vertical multi-row layouts the container scrolls vertically as well,
      // but here only horizontal scroll is used. Center the chip horizontally if out of view.
      const padding = 16
      const isOutLeft = chipRect.left < containerRect.left + padding
      const isOutRight = chipRect.right > containerRect.right - padding

      if (isOutLeft || isOutRight) {
        const scrollOffset =
          chipRect.left - containerRect.left - containerRect.width / 2 + chipRect.width / 2
        container.scrollBy({ left: scrollOffset, behavior: 'smooth' })
      }
    }

    scrollPair(desktopScrollRef.current, desktopChips.current.get(activeCategory))
    scrollPair(mobileScrollRef.current, mobileChips.current.get(activeCategory))
  }, [activeCategory])

  const renderChip = (
    cat: MenuCategory,
    refMap: React.MutableRefObject<Map<string, HTMLButtonElement>>,
  ) => {
    const isActive = activeCategory === cat.id
    const IconComponent = categoryIconMap[cat.icon]
    return (
      <button
        key={cat.id}
        ref={(el) => { if (el) refMap.current.set(cat.id, el) }}
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
      {/* Desktop: 2 rows */}
      <div ref={desktopScrollRef} className="hidden overflow-x-auto scrollbar-hide md:block">
        <div className="flex flex-col gap-2">
          {rows2.map((row, i) => (
            <div key={i} className="flex gap-2">
              {row.map((cat) => renderChip(cat, desktopChips))}
            </div>
          ))}
        </div>
      </div>
      {/* Mobile: 3 rows */}
      <div ref={mobileScrollRef} className="overflow-x-auto scrollbar-hide md:hidden">
        <div className="flex flex-col gap-2">
          {rows3.map((row, i) => (
            <div key={i} className="flex gap-2">
              {row.map((cat) => renderChip(cat, mobileChips))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
