import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Trash2 } from 'lucide-react'
import SummaryCard from '@/components/result/SummaryCard'
import BreakdownPanel from '@/components/result/BreakdownPanel'
import Disclaimer from '@/components/result/Disclaimer'
import Spinner from '@/components/ui/Spinner'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import { useScanDetail } from '@/hooks/useScanDetail'
import { useAuthStore } from '@/store/authStore'
import { deleteScan } from '@/services/scanService'
import { formatDateTime } from '@/utils/formatDate'

function ScanDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { session } = useAuthStore()
  const { scan, loading, error } = useScanDetail(id)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    setDeleting(true)
    try {
      await deleteScan(id, session.access_token)
      navigate('/history')
    } catch (err) {
      console.error(err)
    } finally {
      setDeleting(false)
      setShowDeleteModal(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    )
  }

  if (error || !scan) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-gray-500">Scan not found.</p>
        <button
          onClick={() => navigate('/history')}
          className="text-green-600 text-sm hover:underline"
        >
          Back to history
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 bg-white border-b border-gray-100">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/history')}
            aria-label="Go back"
            className="text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft size={22} />
          </button>
          <div>
            <h1 className="font-bold text-gray-800 text-base leading-tight">
              {scan.product_name}
            </h1>
            <p className="text-xs text-gray-400">
              {formatDateTime(scan.scanned_at)}
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowDeleteModal(true)}
          aria-label="Delete scan"
          className="text-red-400 hover:text-red-600"
        >
          <Trash2 size={20} />
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-4 px-4 py-6 max-w-lg mx-auto w-full">
        <SummaryCard verdict={scan.verdict} summary={scan.summary} />
        <BreakdownPanel
          concerns={scan.analysis_json?.concerns}
          positives={scan.analysis_json?.positives}
        />
        <Disclaimer text={scan.analysis_json?.disclaimer} />
      </div>

      {/* Delete confirmation modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Scan"
      >
        <div className="flex flex-col gap-4">
          <p className="text-sm text-gray-600">
            Are you sure you want to delete <strong>{scan.product_name}</strong>
            ? This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={() => setShowDeleteModal(false)}
              fullWidth
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              disabled={deleting}
              fullWidth
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default ScanDetailPage
