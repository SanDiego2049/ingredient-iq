import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react'
import { VERDICTS } from '@/constants/verdicts'

const config = {
  [VERDICTS.SAFE]: {
    icon: CheckCircle,
    label: 'Safe',
    colours: 'bg-green-100 text-green-700 border-green-300',
  },
  [VERDICTS.UNSAFE]: {
    icon: XCircle,
    label: 'Unsafe',
    colours: 'bg-red-100 text-red-700 border-red-300',
  },
  [VERDICTS.CAUTION]: {
    icon: AlertTriangle,
    label: 'Caution',
    colours: 'bg-amber-100 text-amber-700 border-amber-300',
  },
}

function VerdictBadge({ verdict, size = 'md' }) {
  const {
    icon: Icon,
    label,
    colours,
  } = config[verdict] ?? config[VERDICTS.CAUTION]

  const sizes = {
    sm: 'text-sm px-3 py-1 gap-1',
    md: 'text-base px-4 py-2 gap-2',
    lg: 'text-2xl px-6 py-3 gap-3',
  }

  const iconSizes = { sm: 14, md: 18, lg: 28 }

  return (
    <span
      className={`inline-flex items-center font-bold rounded-full border-2 ${colours} ${sizes[size]}`}
      role="status"
      aria-label={`Verdict: ${label}`}
    >
      <Icon size={iconSizes[size]} aria-hidden="true" />
      {label}
    </span>
  )
}

export default VerdictBadge
