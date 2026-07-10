import { ScanLine } from 'lucide-react'
import Button from '@/components/ui/Button'
import { useNavigate } from 'react-router-dom'

function EmptyHistoryState() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col items-center gap-4 py-16 text-center">
      <ScanLine size={48} className="text-gray-300" aria-hidden="true" />
      <div className="flex flex-col gap-1">
        <p className="font-medium text-gray-700">No scans yet</p>
        <p className="text-sm text-gray-400">
          Scan a product label to get started
        </p>
      </div>
      <Button onClick={() => navigate('/')}>Scan Now</Button>
    </div>
  )
}

export default EmptyHistoryState
