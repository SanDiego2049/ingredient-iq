import { useState, useRef, useEffect } from 'react'
import { analyseIngredients } from '@/services/scanService'
import { useScanStore } from '@/store/scanStore'

export function useAnalysis() {
  const [error, setError] = useState(null)
  const [slowMessage, setSlowMessage] = useState(null)
  const errorTimer = useRef(null)
  const { isAnalysing, setIsAnalysing, setLastResult } = useScanStore()

  async function analyse(ingredients) {
    setIsAnalysing(true)
    // clear any previous error timer and reset error state
    if (errorTimer.current) {
      clearTimeout(errorTimer.current)
      errorTimer.current = null
    }
    setError(null)
    setSlowMessage(null)

    const slowTimer = setTimeout(() => {
      setSlowMessage(
        'The server is waking up after a period of inactivity. This may take up to 30 seconds. Please wait.'
      )
    }, 5000)

    try {
      const response = await analyseIngredients(ingredients)
      setLastResult(response.data)
      return response.data
    } catch (err) {
      if (err.message.includes('429')) {
        setError('Daily scan limit reached — please try again tomorrow')
      } else {
        setError(err.message || 'Analysis failed. Please try again.')
      }
      // clear previous timer and auto-hide the error after 4s
      if (errorTimer.current) clearTimeout(errorTimer.current)
      errorTimer.current = setTimeout(() => setError(null), 4000)
      return null
    } finally {
      clearTimeout(slowTimer)
      setSlowMessage(null)
      setIsAnalysing(false)
    }
  }

  useEffect(() => {
    return () => {
      if (errorTimer.current) clearTimeout(errorTimer.current)
    }
  }, [])

  return { analyse, isAnalysing, error, slowMessage }
}
