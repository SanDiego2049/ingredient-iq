import { Lock } from 'lucide-react'
import Button from '@/components/ui/Button'
import { useUiStore } from '@/store/uiStore'

function GuestHistoryOverlay() {
  const { openAuthModal } = useUiStore()

  return (
    <div className="relative">
      {/* Blurred teaser */}
      <div className="blur-sm pointer-events-none select-none flex flex-col gap-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="w-full h-16 rounded-2xl bg-gray-100 border border-gray-200"
          />
        ))}
      </div>

      {/* Overlay CTA */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white/60 rounded-2xl backdrop-blur-sm">
        <Lock size={28} className="text-gray-400" aria-hidden="true" />
        <p className="font-medium text-gray-700 text-sm text-center px-4">
          Create a free account to view your full history
        </p>
        <Button onClick={openAuthModal}>Create Account</Button>
      </div>
    </div>
  )
}

export default GuestHistoryOverlay
