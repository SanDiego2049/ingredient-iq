function OcrProgressBar({ progress }) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <p className="text-sm text-gray-600 text-center">
        Reading ingredients... {progress}%
      </p>
      <div
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="OCR progress"
        className="w-full h-2 rounded-full bg-gray-200 overflow-hidden"
      >
        <div
          className="h-full bg-green-500 transition-all duration-300 rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}

export default OcrProgressBar
