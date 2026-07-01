import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import HistoryTabs from '@/components/history/HistoryTabs'
import ScanCard from '@/components/history/ScanCard'
import EmptyHistoryState from '@/components/history/EmptyHistoryState'
import GuestHistoryOverlay from '@/components/history/GuestHistoryOverlay'
import SearchBar from '@/components/ui/SearchBar'
import Spinner from '@/components/ui/Spinner'
import AuthModal from '@/components/auth/AuthModal'
import { useAuthStore } from '@/store/authStore'
import { useHistory } from '@/hooks/useHistory'
import { useGuestScans } from '@/hooks/useGuestScans'

function HistoryPage() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [activeTab, setActiveTab] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const { scans, total, loading } = useHistory({
    verdict: activeTab,
    search,
    page,
  })

  const { getAllGuestScans } = useGuestScans()
  const guestScans = getAllGuestScans()

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-4 bg-white border-b border-gray-100">
        <button
          onClick={() => navigate('/')}
          aria-label="Go back"
          className="text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft size={22} />
        </button>
        <h1 className="font-bold text-gray-800 text-lg">History</h1>
      </div>

      <div className="flex flex-col gap-4 px-4 py-6 max-w-lg mx-auto w-full">
        {user ? (
          <>
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search by product or ingredient..."
            />
            <HistoryTabs activeTab={activeTab} onChange={setActiveTab} />

            {loading ? (
              <div className="flex justify-center py-12">
                <Spinner />
              </div>
            ) : scans.length === 0 ? (
              <EmptyHistoryState />
            ) : (
              <div className="flex flex-col gap-3">
                {scans.map((scan) => (
                  <ScanCard key={scan.id} scan={scan} />
                ))}

                {/* Pagination */}
                {total > 20 && (
                  <div className="flex justify-center gap-3 pt-2">
                    <button
                      disabled={page === 1}
                      onClick={() => setPage((p) => p - 1)}
                      className="text-sm text-green-600 disabled:opacity-40"
                    >
                      Previous
                    </button>
                    <button
                      disabled={page * 20 >= total}
                      onClick={() => setPage((p) => p + 1)}
                      className="text-sm text-green-600 disabled:opacity-40"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          <>
            {guestScans.length > 0 ? (
              <GuestHistoryOverlay />
            ) : (
              <EmptyHistoryState />
            )}
          </>
        )}
      </div>

      <AuthModal />
    </div>
  )
}

export default HistoryPage
