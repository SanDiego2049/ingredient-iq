import { VERDICTS } from '@/constants/verdicts'

export function getVerdictColour(verdict) {
  switch (verdict) {
    case VERDICTS.SAFE:
      return {
        bg: 'bg-green-100',
        text: 'text-green-700',
        border: 'border-green-400',
        badge: 'bg-green-500',
      }
    case VERDICTS.UNSAFE:
      return {
        bg: 'bg-red-100',
        text: 'text-red-700',
        border: 'border-red-400',
        badge: 'bg-red-500',
      }
    case VERDICTS.CAUTION:
      return {
        bg: 'bg-amber-100',
        text: 'text-amber-700',
        border: 'border-amber-400',
        badge: 'bg-amber-500',
      }
    default:
      return {
        bg: 'bg-gray-100',
        text: 'text-gray-700',
        border: 'border-gray-400',
        badge: 'bg-gray-500',
      }
  }
}
