import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ArticleBody from './ArticleBody'

describe('ArticleBody', () => {
  it('renderiza markdown con encabezados h2 y enlaces', () => {
    render(<ArticleBody markdown={'## Sección uno\n\nTexto con [enlace](/es#tour).'} />)
    expect(screen.getByRole('heading', { level: 2, name: /Sección uno/ })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'enlace' })).toHaveAttribute('href', '/es#tour')
  })

  it('no aplica subrayado de enlace al ancla envolvente del encabezado', () => {
    render(<ArticleBody markdown={'## Sección uno'} />)
    const headingAnchor = screen.getByRole('link', { name: /Sección uno/ })
    expect(headingAnchor).toHaveClass('no-underline')
    expect(headingAnchor).not.toHaveClass('underline')
  })
})
