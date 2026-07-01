import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Badge from '@/components/ui/Badge'

describe('Badge', () => {
  it('renders its children', () => {
    render(<Badge>Safe</Badge>)
    expect(screen.getByText('Safe')).toBeInTheDocument()
  })

  it('applies the green colour classes when colour is green', () => {
    render(<Badge colour="green">Safe</Badge>)
    const badge = screen.getByText('Safe')
    expect(badge).toHaveClass('bg-green-100')
    expect(badge).toHaveClass('text-green-700')
  })

  it('applies the red colour classes when colour is red', () => {
    render(<Badge colour="red">Unsafe</Badge>)
    const badge = screen.getByText('Unsafe')
    expect(badge).toHaveClass('bg-red-100')
    expect(badge).toHaveClass('text-red-700')
  })

  it('falls back to gray classes when no colour is provided', () => {
    render(<Badge>Unknown</Badge>)
    const badge = screen.getByText('Unknown')
    expect(badge).toHaveClass('bg-gray-100')
    expect(badge).toHaveClass('text-gray-700')
  })
})
