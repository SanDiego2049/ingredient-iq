import { describe, it, expect } from 'vitest'
import { formatDate, formatDateTime } from '@/utils/formatDate'

describe('formatDate', () => {
  it('formats a valid date string to day month year in en-GB style', () => {
    const result = formatDate('2026-06-30T08:30:33.293Z')
    expect(result).toBe('30 Jun 2026')
  })

  it('handles a date at the start of a month correctly', () => {
    const result = formatDate('2026-07-01T00:00:00.000Z')
    expect(result).toBe('1 Jul 2026')
  })
})

describe('formatDateTime', () => {
  it('formats a valid date string to day month year with time in en-GB style', () => {
    const result = formatDateTime('2026-06-30T08:30:00.000Z')
    expect(typeof result).toBe('string')
    expect(result).toContain('30 Jun 2026')
  })

  it('includes hour and minute in the output', () => {
    const result = formatDateTime('2026-06-30T08:30:00.000Z')
    expect(result).toMatch(/\d{2}:\d{2}/)
  })
})
