import { Lock } from 'lucide-react'
import Button from '@/components/ui/Button'
import { useUiStore } from '@/store/uiStore'
import { formatDateTime } from '@/utils/formatDate'
import { getVerdictColour } from '@/utils/verdictColour'

function GuestHistoryOverlay({ scans = [] }) {
  const { openAuthModal } = useUiStore()

  return (
    <div className="relative">
      <div className="blur-[1px] pointer-events-none select-none flex flex-col gap-3">
        {scans.map((scan, i) => {
          const colours = getVerdictColour(scan.verdict)
          return (
            <div
              key={i}
              className="w-full rounded-2xl bg-gray-100 border border-gray-200 px-4 py-3 flex items-center justify-between"
            >
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium text-gray-800">
                  {scan.product_name || 'Unnamed Product'}
                </p>
                <p className="text-xs text-gray-400">
                  {scan.scanned_at ? formatDateTime(scan.scanned_at) : ''}
                </p>
              </div>
              <span
                className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${colours.bg} ${colours.text}`}
              >
                {scan.verdict}
              </span>
            </div>
          )
        })}
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white/40 rounded-2xl backdrop-blur-[2px]">
        <Lock size={28} className="text-gray-600" aria-hidden="true" />
        <p className="font-medium text-gray-900 text-sm text-center px-4">
          Create a free account to save your full history
        </p>
        <Button onClick={openAuthModal}>Create Account</Button>
      </div>
    </div>
  )
}

export default GuestHistoryOverlay
