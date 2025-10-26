import React, { useRef, useEffect, useState } from 'react'
import { useVideoStore } from '../../stores/useVideoStore'
import './VideoPreview.css'

export default function VideoPreview() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const videoRefs = useRef<Map<string, HTMLVideoElement>>(new Map())
  const audioRefs = useRef<Map<string, HTMLAudioElement>>(new Map())
  const animationFrameRef = useRef<number>()
  
  const { 
    currentProject, 
    currentTime, 
    isPlaying, 
    play, 
    pause, 
    seek,
    selectedClipId 
  } = useVideoStore()
  
  const [volume, setVolume] = useState(1)
  
  useEffect(() => {
    if (!currentProject) return
    
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = '#000'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      // Render video clips
      currentProject.clips.forEach(clip => {
        if (currentTime >= clip.startTime && currentTime <= clip.endTime) {
          let video = videoRefs.current.get(clip.id)
          
          if (!video) {
            video = document.createElement('video')
            video.src = clip.url
            video.muted = true
            videoRefs.current.set(clip.id, video)
          }
          
          const clipTime = currentTime - clip.startTime + clip.trimStart
          if (Math.abs(video.currentTime - clipTime) > 0.1) {
            video.currentTime = clipTime
          }
          
          if (isPlaying && video.paused) {
            video.play().catch(() => {})
          } else if (!isPlaying && !video.paused) {
            video.pause()
          }
          
          // Apply filters
          ctx.filter = `
            brightness(${clip.filters.brightness}%)
            contrast(${clip.filters.contrast}%)
            saturate(${clip.filters.saturation}%)
            blur(${clip.filters.blur}px)
            hue-rotate(${clip.filters.hue}deg)
            grayscale(${clip.filters.grayscale}%)
          `
          
          // Apply transformations
          ctx.save()
          ctx.translate(canvas.width / 2, canvas.height / 2)
          ctx.scale(clip.position.scale, clip.position.scale)
          ctx.rotate((clip.position.rotation * Math.PI) / 180)
          ctx.translate(clip.position.x, clip.position.y)
          
          ctx.drawImage(
            video,
            -canvas.width / 2,
            -canvas.height / 2,
            canvas.width,
            canvas.height
          )
          
          ctx.restore()
          ctx.filter = 'none'
        }
      })
      
      // Render text overlays
      currentProject.textOverlays.forEach(text => {
        if (currentTime >= text.startTime && currentTime <= text.startTime + text.duration) {
          ctx.font = `${text.style.bold ? 'bold' : ''} ${text.style.italic ? 'italic' : ''} ${text.size}px ${text.font}`
          ctx.fillStyle = text.color
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          
          if (text.style.stroke) {
            ctx.strokeStyle = text.style.strokeColor
            ctx.lineWidth = text.style.strokeWidth
            ctx.strokeText(text.text, text.position.x, text.position.y)
          }
          
          if (text.style.shadow) {
            ctx.shadowColor = 'rgba(0, 0, 0, 0.8)'
            ctx.shadowBlur = text.style.shadowBlur
          }
          
          ctx.fillText(text.text, text.position.x, text.position.y)
          ctx.shadowBlur = 0
        }
      })
      
      // Render stickers
      currentProject.stickers.forEach(sticker => {
        if (currentTime >= sticker.startTime && currentTime <= sticker.startTime + sticker.duration) {
          const img = new Image()
          img.src = sticker.url
          
          ctx.save()
          ctx.translate(sticker.position.x, sticker.position.y)
          ctx.scale(sticker.scale, sticker.scale)
          ctx.rotate((sticker.rotation * Math.PI) / 180)
          ctx.drawImage(img, -25, -25, 50, 50)
          ctx.restore()
        }
      })
      
      if (isPlaying) {
        animationFrameRef.current = requestAnimationFrame(render)
      }
    }
    
    render()
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [currentProject, currentTime, isPlaying])
  
  useEffect(() => {
    if (!currentProject) return
    
    let lastTime = Date.now()
    let intervalId: NodeJS.Timeout | undefined
    
    if (isPlaying) {
      intervalId = setInterval(() => {
        const now = Date.now()
        const delta = (now - lastTime) / 1000
        lastTime = now
        
        const newTime = currentTime + delta
        if (newTime >= (currentProject.duration || 0)) {
          pause()
          seek(0)
        } else {
          seek(newTime)
        }
      }, 16)
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId)
    }
  }, [isPlaying, currentTime, currentProject, pause, seek])
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }
  
  return (
    <div className="video-preview">
      <canvas 
        ref={canvasRef}
        width={1920}
        height={1080}
        className="preview-canvas"
      />
      
      <div className="playback-controls">
        <button onClick={isPlaying ? pause : play} className="play-btn">
          {isPlaying ? '⏸' : '▶️'}
        </button>
        
        <div className="timeline-slider">
          <input
            type="range"
            min={0}
            max={currentProject?.duration || 1}
            value={currentTime}
            onChange={(e) => seek(parseFloat(e.target.value))}
            step={0.01}
          />
        </div>
        
        <div className="time-display">
          {formatTime(currentTime)} / {formatTime(currentProject?.duration || 0)}
        </div>
        
        <div className="volume-control">
          <span>🔊</span>
          <input
            type="range"
            min={0}
            max={1}
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            step={0.01}
          />
        </div>
      </div>
    </div>
  )
}
