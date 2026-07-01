import { AlertCircle } from 'lucide-react'

function Disclaimer({ text }) {
  return (
    <div className="flex gap-2 rounded-xl bg-gray-50 border border-gray-200 p-3 text-xs text-gray-500">
      <AlertCircle size={14} className="shrink-0 mt-0.5" aria-hidden="true" />
      <p>{text}</p>
    </div>
  )
}

export default Disclaimer
