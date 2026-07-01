import {
  getGuestScans,
  saveGuestScan,
  clearGuestScans,
} from '@/utils/localStorage'

export function useGuestScans() {
  function addGuestScan(scan) {
    saveGuestScan({
      ...scan,
      scanned_at: new Date().toISOString(),
    })
  }

  function getAllGuestScans() {
    return getGuestScans()
  }

  function clearAll() {
    clearGuestScans()
  }

  return { addGuestScan, getAllGuestScans, clearAll }
}
