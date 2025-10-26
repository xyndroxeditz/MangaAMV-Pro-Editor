import React, { useRef, useEffect } from 'react'
import { useVideoStore } from '../../stores/useVideoStore'
import './Timeline.css'

export default function Timeline() {
  const timelineRef = useRef<HTMLDivElement>(null)
  const { 
    currentProject, 
    currentTime, 
    zoom, 
    setZoom, 
    seek,
    selectedClipId,
    updateClip 
  } = useVideoStore()
  
  const pixelsPerSecond = 50 * zoom
  const timelineWidth = (currentProject?.duration || 60) * pixelsPerSecond
  
  const handleTimelineClick = (e: React.MouseEvent) => {
    if (!timelineRef.current) return
    const rect = timelineRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left + timelineRef.current.scrollLeft
    const time = x / pixelsPerSecond
    seek(time)
  }
  
  const handleClipDrag = (clipId: string, newStartTime: number) => {
    const clip = currentProject?.clips.find(c => c.id === clipId)
    if (!clip) return
    
    const duration = clip.endTime - clip.startTime
    updateClip(clipId, {
      startTime: newStartTime,
      endTime: newStartTime + duration
    })
  }
  
  return (
    <div className="timeline-container">
      <div className="timeline-toolbar">
        <div className="zoom-controls">
          <button onClick={() => setZoom(zoom * 0.8)}>➖</button>
          <span>{Math.round(zoom * 100)}%</span>
          <button onClick={() => setZoom(zoom * 1.2)}>➕</button>
        </div>
        
        <div className="timeline-info">
          <span>Duration: {(currentProject?.duration || 0).toFixed(2)}s</span>
          <span>Clips: {currentProject?.clips.length || 0}</span>
        </div>
      </div>
      
      <div 
        ref={timelineRef}
        className="timeline-scroll"
        onClick={handleTimelineClick}
      >
        <div 
          className="timeline-content"
          style={{ width: `${timelineWidth}px` }}
        >
          {/* Time markers */}
          <div className="time-markers">
            {Array.from({ length: Math.ceil((currentProject?.duration || 60) / 5) + 1 }).map((_, i) => {
              const time = i * 5
              return (
                <div 
                  key={i} 
                  className="time-marker"
                  style={{ left: `${time * pixelsPerSecond}px` }}
                >
                  {time}s
                </div>
              )
            })}
          </div>
          
          {/* Video track */}
          <div className="track video-track">
            <div className="track-label">📹 Video</div>
            <div className="track-clips">
              {currentProject?.clips.map(clip => (
                <div
                  key={clip.id}
                  className={`clip ${selectedClipId === clip.id ? 'selected' : ''}`}
                  style={{
                    left: `${clip.startTime * pixelsPerSecond}px`,
                    width: `${(clip.endTime - clip.startTime) * pixelsPerSecond}px`
                  }}
                  draggable
                  onDragEnd={(e) => {
                    const rect = timelineRef.current?.getBoundingClientRect()
                    if (!rect) return
                    const x = e.clientX - rect.left + (timelineRef.current?.scrollLeft || 0)
                    handleClipDrag(clip.id, x / pixelsPerSecond)
                  }}
                >
                  <img src={clip.thumbnail} alt="" className="clip-thumbnail" />
                  <div className="clip-label">{clip.file.name}</div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Audio track */}
          <div className="track audio-track">
            <div className="track-label">🎵 Audio</div>
            <div className="track-clips">
              {currentProject?.audioTracks.map(audio => (
                <div
                  key={audio.id}
                  className="clip audio-clip"
                  style={{
                    left: `${audio.startTime * pixelsPerSecond}px`,
                    width: `${audio.duration * pixelsPerSecond}px`
                  }}
                >
                  <div className="waveform"></div>
                  <div className="clip-label">{audio.file.name}</div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Text track */}
          <div className="track text-track">
            <div className="track-label">📝 Text</div>
            <div className="track-clips">
              {currentProject?.textOverlays.map(text => (
                <div
                  key={text.id}
                  className="clip text-clip"
                  style={{
                    left: `${text.startTime * pixelsPerSecond}px`,
                    width: `${text.duration * pixelsPerSecond}px`
                  }}
                >
                  <div className="clip-label">{text.text}</div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Playhead */}
          <div 
            className="playhead"
            style={{ left: `${currentTime * pixelsPerSecond}px` }}
          >
            <div className="playhead-line"></div>
            <div className="playhead-handle"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
