import { useState, useEffect } from 'react'
import Drawer from '@/components/ui/Drawer'
import Button from '@/components/ui/Button'

function TextReviewDrawer({ isOpen, onClose, extractedText, onConfirm }) {
  const [text, setText] = useState(extractedText)

  // Sync extractedText into local state whenever it changes
  useEffect(() => {
    setText(extractedText)
  }, [extractedText])

  function handleConfirm() {
    onConfirm(text)
    onClose()
  }

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="Review Ingredients">
      <div className="flex flex-col gap-4">
        <p className="text-sm text-gray-500">
          Review the extracted text below. You can edit it before analysis.
        </p>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={8}
          aria-label="Extracted ingredient text"
          className="w-full rounded-xl border border-gray-200 p-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
        />
        <div className="flex gap-3">
          <Button variant="secondary" onClick={onClose} fullWidth>
            Retake
          </Button>
          <Button onClick={handleConfirm} disabled={!text.trim()} fullWidth>
            Analyse
          </Button>
        </div>
      </div>
    </Drawer>
  )
}

export default TextReviewDrawer
