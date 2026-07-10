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
        video: { facingMode: facing },
      })

      if (videoRef.current) {
        videoRef.current.srcObject = newStream
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

  function captureImage() {
    if (!videoRef.current) return null
    const canvas = document.createElement('canvas')
    canvas.width = videoRef.current.videoWidth
    canvas.height = videoRef.current.videoHeight
    const ctx = canvas.getContext('2d')
    ctx.drawImage(videoRef.current, 0, 0)
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
