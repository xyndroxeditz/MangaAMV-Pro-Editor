import React, { useRef, useState } from 'react'
import { useVideoStore } from '../../stores/useVideoStore'
import { extractThumbnail } from '../../lib/ffmpeg'
import './VideoUploader.css'

interface UploadProgress {
  fileName: string
  progress: number
  status: 'uploading' | 'processing' | 'complete' | 'error'
}

export default function VideoUploader() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { addVideoClip, currentProject } = useVideoStore()
  const [uploads, setUploads] = useState<UploadProgress[]>([])
  const [isDragging, setIsDragging] = useState(false)
  
  const handleFileSelect = async (files: FileList | null) => {
    if (!files) return
    
    const videoFiles = Array.from(files).filter(f => f.type.startsWith('video/'))
    
    for (const file of videoFiles) {
      // Add to upload queue
      setUploads(prev => [...prev, {
        fileName: file.name,
        progress: 0,
        status: 'uploading'
      }])
      
      try {
        // Simulate upload progress
        for (let i = 0; i <= 100; i += 10) {
          await new Promise(resolve => setTimeout(resolve, 50))
          setUploads(prev => prev.map(u => 
            u.fileName === file.name ? { ...u, progress: i } : u
          ))
        }
        
        // Process video
        setUploads(prev => prev.map(u => 
          u.fileName === file.name ? { ...u, status: 'processing' } : u
        ))
        
        await addVideoClip(file)
        
        // Complete
        setUploads(prev => prev.map(u => 
          u.fileName === file.name ? { ...u, status: 'complete', progress: 100 } : u
        ))
        
        // Remove from list after 2 seconds
        setTimeout(() => {
          setUploads(prev => prev.filter(u => u.fileName !== file.name))
        }, 2000)
        
      } catch (error) {
        console.error('Upload error:', error)
        setUploads(prev => prev.map(u => 
          u.fileName === file.name ? { ...u, status: 'error' } : u
        ))
      }
    }
  }
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFileSelect(e.dataTransfer.files)
  }
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }
  
  const handleDragLeave = () => {
    setIsDragging(false)
  }
  
  return (
    <div className="video-uploader">
      <div className="uploader-header">
        <h2 className="gradient-text">Upload Videos</h2>
        <p className="text-secondary">Drag & drop or click to browse</p>
      </div>
      
      <div 
        className={`drop-zone glass ${isDragging ? 'dragging' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="drop-content">
          <div className="drop-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <p className="drop-text">Drop your videos here</p>
          <p className="drop-subtext">or click to browse files</p>
          <div className="supported-formats">
            <span className="badge">MP4</span>
            <span className="badge">MOV</span>
            <span className="badge">AVI</span>
            <span className="badge">WEBM</span>
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          multiple
          onChange={(e) => handleFileSelect(e.target.files)}
          style={{ display: 'none' }}
        />
      </div>
      
      {/* Upload Progress */}
      {uploads.length > 0 && (
        <div className="upload-progress-list">
          {uploads.map(upload => (
            <div key={upload.fileName} className="upload-item glass fade-in">
              <div className="upload-info">
                <span className="upload-name">{upload.fileName}</span>
                <span className={`upload-status badge-${upload.status === 'complete' ? 'success' : upload.status === 'error' ? 'error' : 'primary'}`}>
                  {upload.status === 'uploading' && '📤 Uploading'}
                  {upload.status === 'processing' && '⚙️ Processing'}
                  {upload.status === 'complete' && '✓ Complete'}
                  {upload.status === 'error' && '✗ Error'}
                </span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-bar-fill" 
                  style={{ width: `${upload.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Uploaded Clips Gallery */}
      {currentProject && currentProject.clips.length > 0 && (
        <div className="uploaded-clips">
          <div className="clips-header">
            <h3>Your Clips</h3>
            <span className="badge-primary">{currentProject.clips.length} clips</span>
          </div>
          
          <div className="clip-grid">
            {currentProject.clips.map(clip => (
              <div key={clip.id} className="clip-card glass scale-in">
                <div className="clip-thumbnail">
                  <img src={clip.thumbnail} alt={clip.file.name} />
                  <div className="clip-overlay">
                    <button className="btn-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </button>
                  </div>
                  <div className="clip-duration">
                    {clip.duration.toFixed(1)}s
                  </div>
                </div>
                <div className="clip-info">
                  <p className="clip-name" title={clip.file.name}>
                    {clip.file.name.length > 20 
                      ? clip.file.name.substring(0, 20) + '...' 
                      : clip.file.name
                    }
                  </p>
                  <div className="clip-meta">
                    <span className="clip-size">
                      {(clip.file.size / (1024 * 1024)).toFixed(1)} MB
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Empty State */}
      {currentProject && currentProject.clips.length === 0 && uploads.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">🎬</div>
          <h3>No videos uploaded yet</h3>
          <p>Start by uploading your first video clip</p>
        </div>
      )}
    </div>
  )
}
