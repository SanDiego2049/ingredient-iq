import { GUEST_SCANS_KEY, MAX_GUEST_SCANS } from '@/constants/localStorageKeys'

export function getGuestScans() {
  try {
    const scans = localStorage.getItem(GUEST_SCANS_KEY)
    return scans ? JSON.parse(scans) : []
  } catch {
    return []
  }
}

export function saveGuestScan(scan) {
  try {
    const scans = getGuestScans()
    const updated = [scan, ...scans].slice(0, MAX_GUEST_SCANS)
    localStorage.setItem(GUEST_SCANS_KEY, JSON.stringify(updated))
  } catch {
    // localStorage unavailable, fail silently
  }
}

export function clearGuestScans() {
  localStorage.removeItem(GUEST_SCANS_KEY)
}
