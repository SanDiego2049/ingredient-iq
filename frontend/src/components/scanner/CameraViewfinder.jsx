import { useEffect, useImperativeHandle, forwardRef, useRef } from 'react'
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

  const boxRef = useRef(null)

  useImperativeHandle(ref, () => ({
    capture() {
      let cropSpec = null

      if (boxRef.current && videoRef.current) {
        const video = videoRef.current
        const videoWidth = video.videoWidth
        const videoHeight = video.videoHeight
        const videoRect = video.getBoundingClientRect()
        const boxRect = boxRef.current.getBoundingClientRect()

        // object-cover scale: video is scaled up to fill the element
        // whichever dimension fills first determines the scale
        const scale = Math.max(
          videoRect.width / videoWidth,
          videoRect.height / videoHeight
        )

        // how far the rendered video extends beyond the element edges
        const offsetX = (videoWidth * scale - videoRect.width) / 2
        const offsetY = (videoHeight * scale - videoRect.height) / 2

        // guide box position relative to the video element in screen pixels
        const boxX = boxRect.left - videoRect.left
        const boxY = boxRect.top - videoRect.top

        // convert to actual video pixel coordinates
        const x = Math.round((boxX + offsetX) / scale)
        const y = Math.round((boxY + offsetY) / scale)
        const width = Math.round(boxRect.width / scale)
        const height = Math.round(boxRect.height / scale)

        cropSpec = {
          x: Math.max(0, x),
          y: Math.max(0, y),
          width: Math.min(width, videoWidth - Math.max(0, x)),
          height: Math.min(height, videoHeight - Math.max(0, y)),
        }
      }

      const imageData = captureImage(cropSpec)
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
      >
        <track kind="captions" srcLang="en" label="English" default />
      </video>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          ref={boxRef}
          className="w-72 h-40 border-2 border-white rounded-xl opacity-70"
        />
      </div>
    </div>
  )
})

export default CameraViewfinder
