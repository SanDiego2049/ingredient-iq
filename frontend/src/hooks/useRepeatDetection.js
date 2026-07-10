import { hashIngredients } from '@shared/hash'
import { getGuestScans } from '@/utils/localStorage'
import { useAuthStore } from '@/store/authStore'
import { checkHash } from '@/services/scanService'

export function useRepeatDetection() {
  const { session } = useAuthStore()

  async function checkForRepeat(rawIngredients) {
    const hash = await hashIngredients(rawIngredients)

    if (session?.access_token) {
      const response = await checkHash(hash, session.access_token)
      if (response.data.exists) {
        return { isDuplicate: true, hash, cachedScan: response.data.scan }
      }
    } else {
      const guestScans = getGuestScans()
      const match = guestScans.find((s) => s.ingredient_hash === hash)
      if (match) {
        return { isDuplicate: true, hash, cachedScan: match }
      }
    }

    return { isDuplicate: false, hash, cachedScan: null }
  }

  return { checkForRepeat }
}
