import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { History, User, FlipHorizontal, ImagePlus, LogIn } from 'lucide-react'
import { useUiStore } from '@/store/uiStore'
import CameraViewfinder from '@/components/scanner/CameraViewfinder'
import CaptureButton from '@/components/scanner/CaptureButton'
import TextReviewDrawer from '@/components/scanner/TextReviewDrawer'
import OcrProgressBar from '@/components/scanner/OcrProgressBar'
import ManualEntryFallback from '@/components/scanner/ManualEntryFallback'
import Spinner from '@/components/ui/Spinner'
import { useOCR } from '@/hooks/useOCR'
import { useAnalysis } from '@/hooks/useAnalysis'
import { useRepeatDetection } from '@/hooks/useRepeatDetection'
import { useGuestScans } from '@/hooks/useGuestScans'
import { useAuthStore } from '@/store/authStore'
import { useScanStore } from '@/store/scanStore'
import { hashIngredients } from '@shared/hash'

function ScannerPage() {
  const navigate = useNavigate()
  const cameraRef = useRef(null)
  const fileInputRef = useRef(null)
  const [showManual, setShowManual] = useState(false)
  const [reviewDrawerOpen, setReviewDrawerOpen] = useState(false)
  const [extractedText, setExtractedText] = useState('')
  const [duplicatePrompt, setDuplicatePrompt] = useState(null)
  const [cameraError, setCameraError] = useState(null)

  const { extractText, progress, isProcessing } = useOCR()
  const { analyse, isAnalysing, error, slowMessage } = useAnalysis()
  const { checkForRepeat } = useRepeatDetection()
  const { addGuestScan } = useGuestScans()
  const { session, user } = useAuthStore()
  const { setCurrentIngredients } = useScanStore()
  const { openAuthModal } = useUiStore()

  async function handleCapturedImage(imageData) {
    const text = await extractText(imageData)
    if (text) {
      setExtractedText(text)
      setReviewDrawerOpen(true)
    } else {
      setExtractedText('')
      setReviewDrawerOpen(true)
    }
  }

  async function handleCapture() {
    if (cameraRef.current) {
      cameraRef.current.capture()
    }
  }

  // User picks a photo from their camera roll
  async function handleFileUpload(e) {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = async (event) => {
      await handleCapturedImage(event.target.result)
    }
    reader.readAsDataURL(file)

    // Reset input so the same file can be selected again if needed
    e.target.value = ''
  }

  async function handleAnalyse(ingredients) {
    setCurrentIngredients(ingredients)
    const { isDuplicate, hash, cachedScan } = await checkForRepeat(ingredients)
    if (isDuplicate) {
      setDuplicatePrompt({ hash, cachedScan, ingredients })
      return
    }
    await runAnalysis(ingredients)
  }

  async function runAnalysis(ingredients) {
    const result = await analyse(ingredients)
    if (!result) return
    if (result.verdict !== 'UNRECOGNISED') {
      const hash = await hashIngredients(ingredients)
      if (!session) {
        addGuestScan({
          product_name: 'Unnamed Product',
          raw_ingredients: ingredients,
          ingredient_hash: hash,
          verdict: result.verdict,
          summary: result.summary,
          analysis_json: result,
        })
      }
    }
    navigate('/result')
  }

  if (duplicatePrompt) {
    return (
      <div
        className="flex flex-col items-center justify-center bg-gray-50 px-4 gap-6"
        style={{ height: '100dvh' }}
      >
        <p className="text-gray-700 font-medium text-center">
          You have scanned this product before. Use the cached result?
        </p>
        <div className="flex gap-3 w-full max-w-xs">
          <button
            onClick={() => {
              useScanStore
                .getState()
                .setLastResult(duplicatePrompt.cachedScan.analysis_json)
              navigate('/result')
            }}
            className="flex-1 rounded-xl bg-green-600 text-white py-2 font-medium hover:bg-green-700"
          >
            Use Cached
          </button>
          <button
            onClick={() => {
              setDuplicatePrompt(null)
              runAnalysis(duplicatePrompt.ingredients)
            }}
            className="flex-1 rounded-xl bg-gray-100 text-gray-700 py-2 font-medium hover:bg-gray-200"
          >
            Re-analyse
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      className="relative w-full bg-black overflow-hidden flex flex-col"
      style={{ height: '100dvh' }}
    >
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-4 py-4">
        <main className="sr-only" aria-label="Scanner">
          <h1>IngredientIQ Smart Food Safety Scanner</h1>
        </main>
        <h1 className="text-green-400 font-bold text-lg">IngredientIQ</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/history')}
            aria-label="View history"
            className="text-green-400 hover:text-green-700 transition-colors"
          >
            <History size={24} />
          </button>
          {user ? (
            <button
              onClick={() => navigate('/profile')}
              aria-label="View profile"
              className="text-green-400 hover:text-green-700 transition-colors"
            >
              <User size={24} />
            </button>
          ) : (
            <button
              onClick={openAuthModal}
              aria-label="Sign in"
              className="text-green-400 hover:text-green-700 transition-colors"
            >
              <LogIn size={24} />
            </button>
          )}
        </div>
      </div>

      {/* Camera or Manual */}
      <div className="flex-1 overflow-hidden">
        {showManual ? (
          <div className="flex flex-col items-center justify-center h-full px-6 bg-gray-50">
            <div className="w-full max-w-md">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Enter Ingredients Manually
              </h2>
              <ManualEntryFallback onSubmit={handleAnalyse} />
              <button
                onClick={() => setShowManual(false)}
                className="mt-4 text-sm text-green-600 hover:underline w-full text-center"
              >
                Use camera instead
              </button>
            </div>
          </div>
        ) : (
          <CameraViewfinder
            ref={cameraRef}
            onCapture={handleCapturedImage}
            onManualSubmit={handleAnalyse}
            onError={setCameraError}
          />
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileUpload}
      />

      {/* Bottom bar */}
      {!showManual && !cameraError && (
        <div
          className="flex flex-col items-center gap-3 py-4"
          style={{
            background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
          }}
        >
          <div className="flex items-center justify-center gap-8">
            {/* Upload from camera roll */}
            <button
              onClick={() => fileInputRef.current?.click()}
              aria-label="Upload photo from camera roll"
              className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
            >
              <ImagePlus size={20} aria-hidden="true" />
            </button>

            {/* Capture live */}
            <CaptureButton onCapture={handleCapture} disabled={false} />

            {/* Flip camera */}
            <button
              onClick={() => cameraRef.current?.toggle()}
              aria-label="Toggle camera"
              className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
            >
              <FlipHorizontal size={20} aria-hidden="true" />
            </button>
          </div>

          <button
            onClick={() => setShowManual(true)}
            className="text-white/70 text-xs hover:text-white"
          >
            Type ingredients manually instead
          </button>
          <div className="flex items-center gap-3 text-white/40 text-xs">
            <a
              href="/privacy"
              className="hover:text-white/70 transition-colors"
            >
              Privacy Policy
            </a>
            <span>·</span>
            <a href="/terms" className="hover:text-white/70 transition-colors">
              Terms and Conditions
            </a>
          </div>
        </div>
      )}

      {/* OCR Progress */}
      {isProcessing && (
        <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center gap-4 px-8">
          <OcrProgressBar progress={progress} />
        </div>
      )}

      {/* Analysing overlay */}
      {isAnalysing && (
        <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center gap-4 px-6">
          <Spinner size="lg" />
          <p className="text-white text-sm text-center">
            Analysing ingredients...
          </p>
          {slowMessage && (
            <p className="text-white/70 text-xs text-center max-w-xs">
              {slowMessage}
            </p>
          )}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="absolute bottom-24 left-4 right-4 bg-red-600 text-white text-sm rounded-xl px-4 py-3 text-center">
          {error}
        </div>
      )}

      {/* Text Review Drawer */}
      <TextReviewDrawer
        isOpen={reviewDrawerOpen}
        onClose={() => setReviewDrawerOpen(false)}
        extractedText={extractedText}
        onConfirm={handleAnalyse}
      />
    </div>
  )
}

export default ScannerPage
