import { Leaf } from 'lucide-react'

function PositiveItem({ ingredient, benefit }) {
  return (
    <div className="flex gap-3 rounded-xl border border-green-100 bg-green-50 p-3">
      <Leaf
        size={16}
        className="shrink-0 mt-0.5 text-green-500"
        aria-hidden="true"
      />
      <div className="flex flex-col gap-0.5">
        <span className="font-medium text-green-800 text-sm">{ingredient}</span>
        <p className="text-xs text-green-600">{benefit}</p>
      </div>
    </div>
  )
}

export default PositiveItem
