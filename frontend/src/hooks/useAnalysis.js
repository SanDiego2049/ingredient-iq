import { useState } from 'react'
import { analyseIngredients } from '@/services/scanService'
import { useScanStore } from '@/store/scanStore'

export function useAnalysis() {
  const [error, setError] = useState(null)
  const { isAnalysing, setIsAnalysing, setLastResult } = useScanStore()

  async function analyse(ingredients) {
    setIsAnalysing(true)
    setError(null)

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
      return null
    } finally {
      setIsAnalysing(false)
    }
  }

  return { analyse, isAnalysing, error }
}
