import { useState, useEffect } from 'react'
import { getHistory } from '@/services/scanService'
import { useAuthStore } from '@/store/authStore'

export function useHistory(params = {}) {
  const [scans, setScans] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { session } = useAuthStore()

  useEffect(() => {
    if (!session?.access_token) return

    async function fetchHistory() {
      setLoading(true)
      setError(null)
      try {
        const response = await getHistory(session.access_token, params)
        setScans(response.data.scans)
        setTotal(response.data.total)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchHistory()
  }, [session, params.verdict, params.search, params.page])

  return { scans, total, loading, error }
}
