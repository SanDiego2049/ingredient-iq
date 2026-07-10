import { useNavigate } from 'react-router-dom'
import VerdictBadge from '@/components/result/VerdictBadge'
import { formatDate } from '@/utils/formatDate'

function ScanCard({ scan }) {
  const navigate = useNavigate()

  return (
    <button
      onClick={() => navigate(`/history/${scan.id}`)}
      className="w-full flex items-center justify-between rounded-2xl bg-white border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow text-left"
      aria-label={`View scan for ${scan.product_name}`}
    >
      <div className="flex flex-col gap-1">
        <span className="font-medium text-gray-800 text-sm">
          {scan.product_name}
        </span>
        <span className="text-xs text-gray-400">
          {formatDate(scan.scanned_at)}
        </span>
      </div>
      <VerdictBadge verdict={scan.verdict} size="sm" />
    </button>
  )
}

export default ScanCard
