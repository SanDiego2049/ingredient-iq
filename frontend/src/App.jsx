import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useAuthStore } from '@/store/authStore'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useScanStore } from '@/store/scanStore'
import AuthModal from '@/components/auth/AuthModal'
import ScannerPage from '@/pages/ScannerPage'
import ResultPage from '@/pages/ResultPage'
import HistoryPage from '@/pages/HistoryPage'
import ScanDetailPage from '@/pages/ScanDetailPage'
import AuthPage from '@/pages/AuthPage'
import ProfilePage from '@/pages/ProfilePage'
import PrivacyPolicyPage from '@/pages/PrivacyPolicyPage'
import TermsPage from '@/pages/TermsPage'

function AppLoader() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black gap-4">
      <div className="flex flex-col items-center gap-2">
        <div className="w-16 h-16 rounded-2xl bg-green-600 flex items-center justify-center shadow-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-9 h-9"
            aria-hidden="true"
          >
            <path d="M3 7V5a2 2 0 0 1 2-2h2" />
            <path d="M17 3h2a2 2 0 0 1 2 2v2" />
            <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
            <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
            <rect width="7" height="5" x="7" y="7" rx="1" />
            <rect width="7" height="5" x="7" y="12" rx="1" />
          </svg>
        </div>
        <h1 className="text-white font-bold text-xl tracking-tight">
          IngredientIQ
        </h1>
        <p className="text-white/50 text-xs">Smart Food Safety Scanner</p>
      </div>
      <div className="w-6 h-6 rounded-full border-2 border-white/20 border-t-green-500 animate-spin" />
    </div>
  )
}

function AppContent() {
  useAuth()
  const { loading, user } = useAuthStore()
  const { setLastResult, setCurrentIngredients } = useScanStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      const pending = sessionStorage.getItem('ingredientiq_pending_save')
      if (pending) {
        const { result, ingredients } = JSON.parse(pending)
        setLastResult(result)
        setCurrentIngredients(ingredients)
        sessionStorage.removeItem('ingredientiq_pending_save')
        navigate('/result')
      }
    }
  }, [user])

  if (loading) {
    return <AppLoader />
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<ScannerPage />} />
        <Route path="/result" element={<ResultPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/history/:id" element={<ScanDetailPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/privacy" element={<PrivacyPolicyPage />} />
        <Route path="/terms" element={<TermsPage />} />
      </Routes>
      <AuthModal />
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

export default App
