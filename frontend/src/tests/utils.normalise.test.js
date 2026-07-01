import { describe, it, expect } from 'vitest'
import { normaliseIngredients } from '@/utils/normalise'

describe('normaliseIngredients', () => {
  it('converts text to lowercase', () => {
    expect(normaliseIngredients('Sugar')).toBe('sugar')
  })

  it('strips punctuation', () => {
    expect(normaliseIngredients('Sugar, Salt.')).toBe('sugar salt')
  })

  it('collapses extra whitespace', () => {
    expect(normaliseIngredients('Sugar  Salt')).toBe('sugar salt')
  })

  it('trims leading and trailing whitespace', () => {
    expect(normaliseIngredients('  sugar  ')).toBe('sugar')
  })
})
