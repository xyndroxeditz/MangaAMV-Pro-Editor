import React, { useRef } from 'react'
import { useVideoStore } from '../../stores/useVideoStore'
import './VideoUploader.css'

export default function VideoUploader() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { addVideoClip, currentProject } = useVideoStore()
  
  const handleFileSelect = async (files: FileList | null) => {
    if (!files) return
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      if (file.type.startsWith('video/')) {
        await addVideoClip(file)
      }
    }
  }
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    handleFileSelect(e.dataTransfer.files)
  }
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }
  
  return (
    <div className="video-uploader">
      <h3>Upload Videos</h3>
      
      <div 
        className="drop-zone"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="drop-icon">🎬</div>
        <p className="drop-text">Drag & drop videos here</p>
        <p className="drop-subtext">or click to browse</p>
        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          multiple
          onChange={(e) => handleFileSelect(e.target.files)}
          style={{ display: 'none' }}
        />
      </div>
      
      {currentProject && currentProject.clips.length > 0 && (
        <div className="uploaded-clips">
          <h4>Uploaded Clips ({currentProject.clips.length})</h4>
          <div className="clip-grid">
            {currentProject.clips.map(clip => (
              <div key={clip.id} className="clip-card">
                <img src={clip.thumbnail} alt={clip.file.name} />
                <div className="clip-info">
                  <p className="clip-name">{clip.file.name}</p>
                  <p className="clip-duration">{clip.duration.toFixed(2)}s</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
