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
        video: { facingMode: { ideal: facing } },
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
