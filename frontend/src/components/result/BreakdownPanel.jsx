import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import ConcernItem from './ConcernItem'
import PositiveItem from './PositiveItem'

function BreakdownPanel({ concerns = [], positives = [] }) {
  const [isOpen, setIsOpen] = useState(false)

  const hasConcerns = concerns.length > 0
  const hasPositives = positives.length > 0

  if (!hasConcerns && !hasPositives) return null

  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between px-5 py-4 text-left font-medium text-gray-800 hover:bg-gray-50 transition-colors"
      >
        See Full Breakdown
        {isOpen ? (
          <ChevronUp size={18} aria-hidden="true" />
        ) : (
          <ChevronDown size={18} aria-hidden="true" />
        )}
      </button>

      {isOpen && (
        <div className="px-5 pb-5 flex flex-col gap-5">
          {hasConcerns && (
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-semibold text-gray-700">Concerns</h3>
              {concerns.map((concern, i) => (
                <ConcernItem key={i} {...concern} />
              ))}
            </div>
          )}

          {hasPositives && (
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-semibold text-gray-700">
                What&apos;s Good
              </h3>
              {positives.map((positive, i) => (
                <PositiveItem key={i} {...positive} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default BreakdownPanel
