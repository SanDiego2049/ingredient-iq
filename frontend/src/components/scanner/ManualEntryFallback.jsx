import { useState } from 'react'
import Button from '@/components/ui/Button'

function ManualEntryFallback({ onSubmit }) {
  const [text, setText] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (text.trim()) onSubmit(text.trim())
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
      <div className="flex flex-col gap-1">
        <label
          htmlFor="manual-ingredients"
          className="text-sm font-medium text-gray-700"
        >
          Paste or type ingredients
        </label>
        <textarea
          id="manual-ingredients"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={8}
          placeholder="e.g. Water, Sugar, Salt, Citric Acid..."
          className="w-full rounded-xl border border-gray-200 p-3 text-sm text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
        />
      </div>
      <Button type="submit" disabled={!text.trim()} fullWidth>
        Analyse Ingredients
      </Button>
    </form>
  )
}

export default ManualEntryFallback
