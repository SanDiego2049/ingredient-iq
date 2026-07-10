import { useState, useEffect } from 'react'
import { getScanById } from '@/services/scanService'
import { useAuthStore } from '@/store/authStore'

export function useScanDetail(id) {
  const [scan, setScan] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { session } = useAuthStore()

  useEffect(() => {
    if (!id || !session?.access_token) return

    async function fetchScan() {
      setLoading(true)
      setError(null)
      try {
        const response = await getScanById(id, session.access_token)
        setScan(response.data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchScan()
  }, [id, session])

  return { scan, loading, error }
}
