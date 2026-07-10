import { describe, it, expect, beforeEach } from 'vitest'
import {
  getGuestScans,
  saveGuestScan,
  clearGuestScans,
} from '@/utils/localStorage'

beforeEach(() => {
  localStorage.clear()
})

describe('getGuestScans', () => {
  it('returns an empty array when localStorage has no guest scans', () => {
    expect(getGuestScans()).toEqual([])
  })

  it('returns the parsed scans array when data exists', () => {
    const scan = { product_name: 'Test', verdict: 'SAFE' }
    localStorage.setItem('ingredientiq_guest_scans', JSON.stringify([scan]))
    expect(getGuestScans()).toEqual([scan])
  })

  it('returns an empty array when localStorage contains invalid JSON', () => {
    localStorage.setItem('ingredientiq_guest_scans', 'not valid json')
    expect(getGuestScans()).toEqual([])
  })
})

describe('saveGuestScan', () => {
  it('saves a scan to localStorage', () => {
    saveGuestScan({ product_name: 'Test', verdict: 'SAFE' })
    const scans = getGuestScans()
    expect(scans).toHaveLength(1)
    expect(scans[0].product_name).toBe('Test')
  })

  it('prepends new scans so the most recent is first', () => {
    saveGuestScan({ product_name: 'First', verdict: 'SAFE' })
    saveGuestScan({ product_name: 'Second', verdict: 'UNSAFE' })
    const scans = getGuestScans()
    expect(scans[0].product_name).toBe('Second')
    expect(scans[1].product_name).toBe('First')
  })

  it('caps the list at three entries and evicts the oldest', () => {
    saveGuestScan({ product_name: 'One', verdict: 'SAFE' })
    saveGuestScan({ product_name: 'Two', verdict: 'SAFE' })
    saveGuestScan({ product_name: 'Three', verdict: 'SAFE' })
    saveGuestScan({ product_name: 'Four', verdict: 'SAFE' })
    const scans = getGuestScans()
    expect(scans).toHaveLength(3)
    expect(scans[0].product_name).toBe('Four')
    expect(scans[2].product_name).toBe('Two')
  })
})

describe('clearGuestScans', () => {
  it('removes the guest scans key from localStorage', () => {
    saveGuestScan({ product_name: 'Test', verdict: 'SAFE' })
    clearGuestScans()
    expect(getGuestScans()).toEqual([])
  })
})
