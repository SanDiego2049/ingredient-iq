import { Camera } from 'lucide-react'

function CaptureButton({ onCapture, disabled = false }) {
  return (
    <button
      onClick={onCapture}
      disabled={disabled}
      aria-label="Capture photo"
      className="flex items-center justify-center w-16 h-16 rounded-full bg-white border-4 border-green-500 shadow-lg hover:bg-green-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <Camera size={28} className="text-green-600" aria-hidden="true" />
    </button>
  )
}

export default CaptureButton
