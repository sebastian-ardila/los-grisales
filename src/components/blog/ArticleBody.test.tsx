import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ArticleBody from './ArticleBody'

describe('ArticleBody', () => {
  it('renderiza markdown con encabezados h2 y enlaces', () => {
    render(<ArticleBody markdown={'## Sección uno\n\nTexto con [enlace](/es#tour).'} />)
    expect(screen.getByRole('heading', { level: 2, name: /Sección uno/ })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'enlace' })).toHaveAttribute('href', '/es#tour')
  })
})
