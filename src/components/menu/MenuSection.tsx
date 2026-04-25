import { useState, useRef, useEffect, useCallback } from 'react'
import { allCategories } from '../../data/menu'
import CategoryBar from './CategoryBar'
import CategorySection from './CategorySection'
import { useTranslation } from 'react-i18next'

const NAVBAR_HEIGHT = 64
const BREADCRUMB_HEIGHT = 36

export default function MenuSection() {
  const { t } = useTranslation()
  const [activeCategory, setActiveCategory] = useState('')
  const isScrolling = useRef(false)
  const sectionRefs = useRef<Map<string, HTMLDivElement>>(new Map())
  const containerRef = useRef<HTMLDivElement>(null)
  const categoryBarRef = useRef<HTMLDivElement>(null)

  const getOffset = useCallback(() => {
    const barHeight = categoryBarRef.current?.offsetHeight || 80
    return NAVBAR_HEIGHT + BREADCRUMB_HEIGHT + barHeight + 16
  }, [])

  const setSectionRef = useCallback((id: string, el: HTMLDivElement | null) => {
    if (el) {
      sectionRefs.current.set(id, el)
    } else {
      sectionRefs.current.delete(id)
    }
  }, [])

  const handleCategoryClick = useCallback((categoryId: string) => {
    const el = sectionRefs.current.get(categoryId)
    if (!el) return

    isScrolling.current = true
    setActiveCategory(categoryId)

    const offset = getOffset()
    const top = el.getBoundingClientRect().top + window.scrollY - offset

    window.scrollTo({ top, behavior: 'smooth' })

    setTimeout(() => {
      isScrolling.current = false
    }, 1000)
  }, [getOffset])

  useEffect(() => {
    let raf = 0

    const update = () => {
      if (isScrolling.current) return
      const offset = getOffset()
      const ordered = allCategories
        .map((cat) => ({ id: cat.id, el: sectionRefs.current.get(cat.id) }))
        .filter((s): s is { id: string; el: HTMLDivElement } => Boolean(s.el))
      if (ordered.length === 0) return

      // Pick the last section whose top has scrolled past the offset point.
      // If we haven't reached the first one yet, fall back to the first (or none if still way above).
      let activeId = ''
      const firstTop = ordered[0].el.getBoundingClientRect().top
      if (firstTop - offset > 8) {
        // still above the menu — no active category yet
        activeId = ''
      } else {
        activeId = ordered[0].id
        for (const s of ordered) {
          const top = s.el.getBoundingClientRect().top
          if (top - offset <= 8) activeId = s.id
          else break
        }
      }

      setActiveCategory((prev) => (prev === activeId ? prev : activeId))
    }

    const onScroll = () => {
      if (raf) cancelAnimationFrame(raf)
      raf = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [getOffset])

  return (
    <section ref={containerRef} className="py-8">
      <header className="mb-6 px-4 text-center">
        <span className="text-[11px] font-semibold uppercase tracking-[0.4em] text-brand">
          {t('menu.title')}
        </span>
        <h2 className="font-display mt-2 text-3xl font-bold leading-tight text-white md:text-4xl">
          {t('menu.title')}
        </h2>
      </header>

      <div ref={categoryBarRef} className="sticky top-[100px] z-30">
        <CategoryBar
          categories={allCategories}
          activeCategory={activeCategory}
          onCategoryClick={handleCategoryClick}
        />
      </div>

      <div className="space-y-10 mt-6 max-w-5xl mx-auto px-4">
        {allCategories.map((cat) => (
          <div
            key={cat.id}
            id={cat.id}
            ref={(el) => setSectionRef(cat.id, el)}
          >
            <CategorySection category={cat} id={cat.id} />
          </div>
        ))}
      </div>
    </section>
  )
}
