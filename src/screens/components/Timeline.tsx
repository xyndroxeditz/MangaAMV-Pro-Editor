import React, { useRef, useState, useEffect } from 'react'
import { useVideoStore } from '../../stores/useVideoStore'
import './Timeline.css'

export default function Timeline() {
  const timelineRef = useRef<HTMLDivElement>(null)
  const { currentProject, currentTime, seek, zoom, setZoom, setSelectedClip, selectedClipId, updateClip } = useVideoStore()
  const [isDragging, setIsDragging] = useState(false)
  const [draggedClip, setDraggedClip] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState(0)
  
  const pixelsPerSecond = 50 * zoom
  const duration = currentProject?.duration || 60
  const timelineWidth = duration * pixelsPerSecond
  
  const handleTimelineClick = (e: React.MouseEvent) => {
    if (!timelineRef.current) return
    const rect = timelineRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left + timelineRef.current.scrollLeft
    const time = x / pixelsPerSecond
    seek(Math.max(0, Math.min(duration, time)))
  }
  
  const handleClipDragStart = (clipId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const clip = currentProject?.clips.find(c => c.id === clipId)
    if (!clip) return
    
    const rect = (e.target as HTMLElement).getBoundingClientRect()
    const offsetX = e.clientX - rect.left
    setDragOffset(offsetX)
    setDraggedClip(clipId)
    setIsDragging(true)
    setSelectedClip(clipId)
  }
  
  const handleClipDrag = (e: React.MouseEvent) => {
    if (!isDragging || !draggedClip || !timelineRef.current) return
    
    const rect = timelineRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left + timelineRef.current.scrollLeft - dragOffset
    const newStartTime = Math.max(0, x / pixelsPerSecond)
    
    const clip = currentProject?.clips.find(c => c.id === draggedClip)
    if (!clip) return
    
    const clipDuration = clip.endTime - clip.startTime
    updateClip(draggedClip, {
      startTime: newStartTime,
      endTime: newStartTime + clipDuration
    })
  }
  
  const handleClipDragEnd = () => {
    setIsDragging(false)
    setDraggedClip(null)
  }
  
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleClipDrag as any)
      window.addEventListener('mouseup', handleClipDragEnd)
      return () => {
        window.removeEventListener('mousemove', handleClipDrag as any)
        window.removeEventListener('mouseup', handleClipDragEnd)
      }
    }
  }, [isDragging])
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    const ms = Math.floor((seconds % 1) * 10)
    return `${mins}:${secs.toString().padStart(2, '0')}.${ms}`
  }
  
  if (!currentProject) {
    return (
      <div className="timeline-empty">
        <p>No project loaded</p>
      </div>
    )
  }
  
  return (
    <div className="timeline-container">
      <div className="timeline-controls">
        <div className="timeline-zoom-controls">
          <button 
            className="btn-icon"
            onClick={() => setZoom(Math.max(0.1, zoom - 0.2))}
            disabled={zoom <= 0.1}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
            </svg>
          </button>
          <span className="zoom-level">{(zoom * 100).toFixed(0)}%</span>
          <button 
            className="btn-icon"
            onClick={() => setZoom(Math.min(5, zoom + 0.2))}
            disabled={zoom >= 5}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
            </svg>
          </button>
        </div>
        
        <div className="timeline-actions">
          <button className="btn-ghost btn-sm">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z" />
            </svg>
            Split
          </button>
          <button className="btn-ghost btn-sm">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </button>
        </div>
      </div>
      
      <div 
        ref={timelineRef}
        className="timeline-scroll"
        onClick={handleTimelineClick}
      >
        {/* Time Ruler */}
        <div className="time-ruler" style={{ width: timelineWidth }}>
          {Array.from({ length: Math.ceil(duration) + 1 }).map((_, i) => (
            <div 
              key={i} 
              className="time-marker"
              style={{ left: i * pixelsPerSecond }}
            >
              <span className="time-label">{formatTime(i)}</span>
            </div>
          ))}
        </div>
        
        {/* Video Track */}
        <div className="timeline-track" style={{ width: timelineWidth }}>
          <div className="track-header">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
            </svg>
            <span>Video</span>
          </div>
          <div className="track-content" style={{ width: timelineWidth }}>
            {currentProject.clips.map(clip => {
              const left = clip.startTime * pixelsPerSecond
              const width = (clip.endTime - clip.startTime) * pixelsPerSecond
              const isSelected = clip.id === selectedClipId
              
              return (
                <div
                  key={clip.id}
                  className={`timeline-clip ${isSelected ? 'selected' : ''} ${isDragging && draggedClip === clip.id ? 'dragging' : ''}`}
                  style={{
                    left: `${left}px`,
                    width: `${width}px`,
                  }}
                  onMouseDown={(e) => handleClipDragStart(clip.id, e)}
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedClip(clip.id)
                  }}
                >
                  <div className="clip-thumbnail-mini">
                    <img src={clip.thumbnail} alt="" />
                  </div>
                  <div className="clip-info-mini">
                    <span className="clip-name-mini">{clip.file.name}</span>
                    <span className="clip-duration-mini">{(clip.endTime - clip.startTime).toFixed(1)}s</span>
                  </div>
                  
                  {/* Resize handles */}
                  <div className="clip-handle clip-handle-left" />
                  <div className="clip-handle clip-handle-right" />
                </div>
              )
            })}
          </div>
        </div>
        
        {/* Audio Track */}
        <div className="timeline-track" style={{ width: timelineWidth }}>
          <div className="track-header">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
            </svg>
            <span>Audio</span>
          </div>
          <div className="track-content" style={{ width: timelineWidth }}>
            {currentProject.audioTracks.map(track => {
              const left = track.startTime * pixelsPerSecond
              const width = track.duration * pixelsPerSecond
              
              return (
                <div
                  key={track.id}
                  className="timeline-clip audio-clip"
                  style={{
                    left: `${left}px`,
                    width: `${width}px`,
                  }}
                >
                  <div className="clip-info-mini">
                    <span className="clip-name-mini">{track.file.name}</span>
                  </div>
                  <div className="audio-waveform" />
                </div>
              )
            })}
          </div>
        </div>
        
        {/* Text/Graphics Track */}
        <div className="timeline-track" style={{ width: timelineWidth }}>
          <div className="track-header">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M5 4v3h5.5v12h3V7H19V4z"/>
            </svg>
            <span>Text</span>
          </div>
          <div className="track-content" style={{ width: timelineWidth }}>
            {currentProject.textOverlays.map(text => {
              const left = text.startTime * pixelsPerSecond
              const width = text.duration * pixelsPerSecond
              
              return (
                <div
                  key={text.id}
                  className="timeline-clip text-clip"
                  style={{
                    left: `${left}px`,
                    width: `${width}px`,
                  }}
                >
                  <div className="clip-info-mini">
                    <span className="clip-name-mini">{text.text}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        
        {/* Playhead */}
        <div 
          className="timeline-playhead"
          style={{ left: currentTime * pixelsPerSecond }}
        >
          <div className="playhead-handle" />
          <div className="playhead-line" />
        </div>
      </div>
    </div>
  )
}
