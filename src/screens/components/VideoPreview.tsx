import React, { useRef, useEffect, useState } from 'react'
import { useVideoStore } from '../../stores/useVideoStore'
import './VideoPreview.css'

export default function VideoPreview() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { currentProject, isPlaying, currentTime, seek, pause, selectedClipId } = useVideoStore()
  const [filters, setFilters] = useState<any>(null)
  const animationFrameRef = useRef<number>()
  
  const selectedClip = currentProject?.clips.find(c => c.id === selectedClipId)
  
  useEffect(() => {
    if (!videoRef.current || !currentProject?.clips.length) return
    
    const video = videoRef.current
    const activeClip = currentProject.clips.find(
      clip => currentTime >= clip.startTime && currentTime < clip.endTime
    )
    
    if (activeClip && video.src !== activeClip.url) {
      video.src = activeClip.url
      const relativeTime = currentTime - activeClip.startTime + activeClip.trimStart
      video.currentTime = relativeTime
    }
  }, [currentTime, currentProject?.clips])
  
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    
    if (isPlaying) {
      video.play().catch(() => {})
    } else {
      video.pause()
    }
  }, [isPlaying])
  
  // Apply filters in real-time
  useEffect(() => {
    if (!selectedClip || !videoRef.current || !canvasRef.current) return
    
    const video = videoRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (!ctx) return
    
    const applyFilters = () => {
      if (video.paused && !video.ended) {
        animationFrameRef.current = requestAnimationFrame(applyFilters)
        return
      }
      
      canvas.width = video.videoWidth || 1920
      canvas.height = video.videoHeight || 1080
      
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      
      const filters = selectedClip.filters
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imageData.data
      
      for (let i = 0; i < data.length; i += 4) {
        let r = data[i]
        let g = data[i + 1]
        let b = data[i + 2]
        
        // Brightness
        if (filters.brightness !== 100) {
          const factor = filters.brightness / 100
          r *= factor
          g *= factor
          b *= factor
        }
        
        // Contrast
        if (filters.contrast !== 100) {
          const factor = (259 * (filters.contrast + 255)) / (255 * (259 - filters.contrast))
          r = factor * (r - 128) + 128
          g = factor * (g - 128) + 128
          b = factor * (b - 128) + 128
        }
        
        // Saturation
        if (filters.saturation !== 100) {
          const gray = 0.2989 * r + 0.5870 * g + 0.1140 * b
          const factor = filters.saturation / 100
          r = gray + factor * (r - gray)
          g = gray + factor * (g - gray)
          b = gray + factor * (b - gray)
        }
        
        // Grayscale
        if (filters.grayscale > 0) {
          const gray = 0.2989 * r + 0.5870 * g + 0.1140 * b
          const factor = filters.grayscale / 100
          r = r + factor * (gray - r)
          g = g + factor * (gray - g)
          b = b + factor * (gray - b)
        }
        
        data[i] = Math.max(0, Math.min(255, r))
        data[i + 1] = Math.max(0, Math.min(255, g))
        data[i + 2] = Math.max(0, Math.min(255, b))
      }
      
      ctx.putImageData(imageData, 0, 0)
      
      if (isPlaying) {
        animationFrameRef.current = requestAnimationFrame(applyFilters)
      }
    }
    
    if (video.readyState >= 2) {
      applyFilters()
    }
    
    video.addEventListener('loadeddata', applyFilters)
    video.addEventListener('seeked', applyFilters)
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      video.removeEventListener('loadeddata', applyFilters)
      video.removeEventListener('seeked', applyFilters)
    }
  }, [selectedClip, isPlaying])
  
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    
    const handleTimeUpdate = () => {
      if (currentProject) {
        const activeClip = currentProject.clips.find(
          clip => currentTime >= clip.startTime && currentTime < clip.endTime
        )
        
        if (activeClip) {
          const relativeTime = activeClip.startTime + (video.currentTime - activeClip.trimStart)
          seek(relativeTime)
          
          // Auto-switch to next clip
          if (video.currentTime >= activeClip.trimEnd) {
            const nextClip = currentProject.clips.find(c => c.startTime === activeClip.endTime)
            if (nextClip) {
              video.src = nextClip.url
              video.currentTime = nextClip.trimStart
              video.play().catch(() => {})
            } else {
              pause()
            }
          }
        }
      }
    }
    
    video.addEventListener('timeupdate', handleTimeUpdate)
    return () => video.removeEventListener('timeupdate', handleTimeUpdate)
  }, [currentProject, currentTime, seek, pause])
  
  if (!currentProject || currentProject.clips.length === 0) {
    return (
      <div className="preview-empty">
        <div className="preview-placeholder">
          <div className="placeholder-icon">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <h3>No Video Loaded</h3>
          <p>Upload a video to start editing</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="video-preview-container">
      <video
        ref={videoRef}
        className="video-element"
        style={{ display: selectedClip ? 'none' : 'block' }}
        playsInline
        crossOrigin="anonymous"
      />
      <canvas
        ref={canvasRef}
        className="video-canvas"
        style={{ display: selectedClip ? 'block' : 'none' }}
      />
      
      {/* Overlay Text/Graphics would render here */}
      {currentProject.textOverlays
        .filter(text => currentTime >= text.startTime && currentTime < text.startTime + text.duration)
        .map(text => (
          <div
            key={text.id}
            className="text-overlay"
            style={{
              position: 'absolute',
              left: `${text.position.x}%`,
              top: `${text.position.y}%`,
              fontFamily: text.font,
              fontSize: `${text.size}px`,
              color: text.color,
              fontWeight: text.style.bold ? 'bold' : 'normal',
              fontStyle: text.style.italic ? 'italic' : 'normal',
              textDecoration: text.style.underline ? 'underline' : 'none',
              textShadow: text.style.shadow ? `0 0 ${text.style.shadowBlur}px rgba(0,0,0,0.8)` : 'none',
              WebkitTextStroke: text.style.stroke ? `${text.style.strokeWidth}px ${text.style.strokeColor}` : 'none',
            }}
          >
            {text.text}
          </div>
        ))
      }
    </div>
  )
}
