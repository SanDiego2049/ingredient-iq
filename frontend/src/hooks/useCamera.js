import { useState, useRef, useEffect } from 'react'

export function useCamera() {
  const videoRef = useRef(null)
  const [stream, setStream] = useState(null)
  const [facingMode, setFacingMode] = useState('environment')
  const [error, setError] = useState(null)
  const [isReady, setIsReady] = useState(false)

  async function startCamera(facing = facingMode) {
    try {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }

      const newStream = await navigator.mediaDevices.getUserMedia({
        // use a plain facingMode value for broader compatibility
        video: { facingMode: facing },
      })

      if (videoRef.current) {
        // ensure inline playback attributes for iOS and attach stream
        try {
          // set attributes that help iOS allow inline autoplay
          videoRef.current.playsInline = true
          videoRef.current.setAttribute('playsinline', '')
          // older WebKit may require the webkit-playsinline attribute
          videoRef.current.setAttribute('webkit-playsinline', '')

          videoRef.current.srcObject = newStream

          // Some browsers (notably iOS Safari / WKWebView) require an explicit play()
          // call after setting srcObject even when `autoPlay` is present on the element.
          // Call play() but ignore any promise rejection (autoplay policy fallback).
          const playResult = videoRef.current.play()
          if (playResult && typeof playResult.then === 'function') {
            playResult
              .then(() => console.log('CAMERA PLAY RESOLVED'))
              .catch((e) =>
                console.log('CAMERA PLAY REJECTED:', e.name, e.message)
              )
          }
        } catch (e) {
          console.log('CAMERA SETUP FALLBACK TRIGGERED:', e.name, e.message)
          videoRef.current.srcObject = newStream
        }
      }

      setStream(newStream)
      setError(null)
      setIsReady(true)
    } catch (err) {
      setError(
        err.name === 'NotAllowedError'
          ? 'Camera permission denied. Please use manual text entry instead.'
          : 'Camera not available on this device.'
      )
      setIsReady(false)
    }
  }

  function stopCamera() {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
      setIsReady(false)
    }
  }

  function toggleCamera() {
    const newFacing = facingMode === 'environment' ? 'user' : 'environment'
    setFacingMode(newFacing)
    startCamera(newFacing)
  }

  function captureImage(cropSpec = null) {
    if (!videoRef.current) return null
    const video = videoRef.current
    const videoWidth = video.videoWidth
    const videoHeight = video.videoHeight
    if (!videoWidth || !videoHeight) return null

    if (!cropSpec) {
      const canvas = document.createElement('canvas')
      canvas.width = videoWidth
      canvas.height = videoHeight
      const ctx = canvas.getContext('2d')
      ctx.drawImage(video, 0, 0)
      return canvas.toDataURL('image/jpeg')
    }

    const canvas = document.createElement('canvas')
    canvas.width = cropSpec.width
    canvas.height = cropSpec.height
    const ctx = canvas.getContext('2d')
    ctx.drawImage(
      video,
      cropSpec.x,
      cropSpec.y,
      cropSpec.width,
      cropSpec.height,
      0,
      0,
      cropSpec.width,
      cropSpec.height
    )
    return canvas.toDataURL('image/jpeg')
  }

  useEffect(() => {
    return () => stopCamera()
  }, [])

  return {
    videoRef,
    isReady,
    error,
    facingMode,
    startCamera,
    stopCamera,
    toggleCamera,
    captureImage,
  }
}
