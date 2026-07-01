import Badge from '@/components/ui/Badge'

const severityColour = {
  low: 'green',
  medium: 'amber',
  high: 'red',
}

function ConcernItem({ ingredient, reason, severity }) {
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-gray-100 bg-gray-50 p-3">
      <div className="flex items-center justify-between gap-2">
        <span className="font-medium text-gray-800 text-sm">{ingredient}</span>
        <Badge colour={severityColour[severity] ?? 'gray'}>{severity}</Badge>
      </div>
      <p className="text-xs text-gray-500">{reason}</p>
    </div>
  )
}

export default ConcernItem
