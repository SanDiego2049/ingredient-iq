import { useEffect, useImperativeHandle, forwardRef } from 'react'
import { useCamera } from '@/hooks/useCamera'
import ManualEntryFallback from './ManualEntryFallback'

const CameraViewfinder = forwardRef(function CameraViewfinder(
  { onCapture, onManualSubmit, onError },
  ref
) {
  const {
    videoRef,
    isReady,
    error,
    startCamera,
    stopCamera,
    captureImage,
    toggleCamera,
  } = useCamera()

  useImperativeHandle(ref, () => ({
    capture() {
      const imageData = captureImage()
      if (imageData) onCapture(imageData)
    },
    toggle() {
      toggleCamera()
    },
    isReady,
  }))

  useEffect(() => {
    startCamera()
    return () => stopCamera()
  }, [])

  useEffect(() => {
    if (error && onError) {
      onError(error)
    }
  }, [error])

  if (error) {
    return (
      <div className="flex flex-col gap-6 items-center justify-center w-full h-full px-4 py-8 bg-gray-50">
        <p className="text-sm text-red-600 text-center">{error}</p>
        <ManualEntryFallback onSubmit={onManualSubmit} />
      </div>
    )
  }

  return (
    <div className="relative w-full h-full">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        aria-label="Camera viewfinder"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-72 h-40 border-2 border-white rounded-xl opacity-70" />
      </div>
    </div>
  )
})

export default CameraViewfinder
