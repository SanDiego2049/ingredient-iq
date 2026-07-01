import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { ScanLine } from 'lucide-react'
import SummaryCard from '@/components/result/SummaryCard'
import BreakdownPanel from '@/components/result/BreakdownPanel'
import Disclaimer from '@/components/result/Disclaimer'
import Button from '@/components/ui/Button'
import { useScanStore } from '@/store/scanStore'
import { useAuthStore } from '@/store/authStore'
import { useUiStore } from '@/store/uiStore'
import { saveScan } from '@/services/scanService'
import { hashIngredients } from '@shared/hash'

function ResultPage() {
  const navigate = useNavigate()
  const { lastResult, currentIngredients, clearScan } = useScanStore()
  const { session } = useAuthStore()
  const { openAuthModal } = useUiStore()
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [productName, setProductName] = useState('')
  const [showNameInput, setShowNameInput] = useState(false)

  if (!lastResult) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4 px-4">
        <div className="flex flex-col items-center gap-3 text-center">
          <ScanLine size={48} className="text-gray-300" aria-hidden="true" />
          <h2 className="font-semibold text-gray-700">No result to display</h2>
          <p className="text-sm text-gray-400">
            Your scan result is no longer available. Please scan again.
          </p>
        </div>
        <Button onClick={() => navigate('/')}>Scan Again</Button>
      </div>
    )
  }

  async function handleSave() {
    if (!session) {
      // Save result and ingredients to sessionStorage before OAuth redirect
      sessionStorage.setItem(
        'ingredientiq_pending_save',
        JSON.stringify({
          result: lastResult,
          ingredients: currentIngredients,
        })
      )
      openAuthModal()
      return
    }
    setShowNameInput(true)
  }

  async function confirmSave() {
    setSaving(true)
    try {
      const hash = await hashIngredients(currentIngredients)
      await saveScan(
        {
          product_name: productName || 'Unnamed Product',
          raw_ingredients: currentIngredients,
          ingredient_hash: hash,
          verdict: lastResult.verdict,
          summary: lastResult.summary,
          analysis_json: lastResult,
        },
        session.access_token
      )
      setSaved(true)
      setShowNameInput(false)
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 bg-white border-b border-gray-100">
        <h1 className="font-bold text-gray-800 text-lg">Result</h1>
        <button
          onClick={() => navigate('/history')}
          aria-label="View history"
          className="text-gray-500 hover:text-gray-700"
        >
          <ScanLine size={22} />
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-4 px-4 py-6 max-w-lg mx-auto w-full">
        <SummaryCard
          verdict={lastResult.verdict}
          summary={lastResult.summary}
        />

        <BreakdownPanel
          concerns={lastResult.concerns}
          positives={lastResult.positives}
        />

        {/* Product name input */}
        {showNameInput && (
          <div className="flex flex-col gap-2 rounded-2xl bg-white border border-gray-100 p-4 shadow-sm">
            <label
              htmlFor="product-name"
              className="text-sm font-medium text-gray-700"
            >
              Name this product (optional)
            </label>
            <input
              id="product-name"
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="e.g. Pringles Original"
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <Button onClick={confirmSave} disabled={saving} fullWidth>
              {saving ? 'Saving...' : 'Save to History'}
            </Button>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-3">
          {!saved && !showNameInput && (
            <Button onClick={handleSave} fullWidth>
              Save to History
            </Button>
          )}
          {saved && (
            <p className="text-center text-sm text-green-600 font-medium">
              ✓ Saved to history
            </p>
          )}
          <Button
            variant="secondary"
            onClick={() => {
              clearScan()
              navigate('/')
            }}
            fullWidth
          >
            Scan Another
          </Button>
        </div>

        <Disclaimer text={lastResult.disclaimer} />
      </div>
    </div>
  )
}

export default ResultPage
