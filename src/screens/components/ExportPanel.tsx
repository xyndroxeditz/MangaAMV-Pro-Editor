import React, { useState } from 'react'
import { useVideoStore, ExportOptions } from '../../stores/useVideoStore'
import { exportVideo, processVideo } from '../../lib/ffmpeg'
import './ExportPanel.css'

export default function ExportPanel() {
  const { currentProject } = useVideoStore()
  const [exporting, setExporting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'mp4',
    quality: '1080p',
    fps: 30,
    bitrate: 5000
  })
  
  const handleExport = async () => {
    if (!currentProject || currentProject.clips.length === 0) {
      alert('No clips to export!')
      return
    }
    
    setExporting(true)
    setProgress(0)
    
    try {
      // Listen for FFmpeg progress events
      const progressHandler = (e: CustomEvent) => {
        setProgress(Math.round(e.detail.progress * 100))
      }
      window.addEventListener('ffmpeg-progress', progressHandler as EventListener)
      
      // Process each clip with its filters
      const processedClips = []
      for (let i = 0; i < currentProject.clips.length; i++) {
        const clip = currentProject.clips[i]
        setProgress(Math.round((i / currentProject.clips.length) * 50))
        
        const processed = await processVideo(clip.file, {
          brightness: clip.filters.brightness,
          contrast: clip.filters.contrast,
          saturation: clip.filters.saturation,
          blur: clip.filters.blur,
          hue: clip.filters.hue,
          grayscale: clip.filters.grayscale,
          startTime: clip.trimStart,
          endTime: clip.trimEnd,
          volume: clip.volume * 100,
          speed: clip.speed,
        })
        
        processedClips.push({
          file: new File([processed], clip.file.name),
          options: {}
        })
      }
      
      // Export final video
      setProgress(50)
      const finalVideo = await exportVideo(
        processedClips,
        exportOptions.format,
        exportOptions.quality
      )
      
      // Download
      setProgress(100)
      const url = URL.createObjectURL(finalVideo)
      const a = document.createElement('a')
      a.href = url
      a.download = `${currentProject.name}.${exportOptions.format}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      window.removeEventListener('ffmpeg-progress', progressHandler as EventListener)
      
      setTimeout(() => {
        setExporting(false)
        setProgress(0)
      }, 2000)
      
    } catch (error) {
      console.error('Export error:', error)
      alert('Export failed: ' + (error as Error).message)
      setExporting(false)
      setProgress(0)
    }
  }
  
  const estimatedSize = currentProject ? 
    Math.round(currentProject.duration * exportOptions.bitrate / 8 / 1024) : 0
  
  return (
    <div className="export-panel">
      <div className="export-header">
        <h2 className="gradient-text">Export Video</h2>
        <p className="text-secondary">Choose your export settings</p>
      </div>
      
      <div className="panel-section">
        <h3 className="section-title">Format</h3>
        <div className="format-grid">
          <button
            className={`format-button glass ${exportOptions.format === 'mp4' ? 'active' : ''}`}
            onClick={() => setExportOptions({ ...exportOptions, format: 'mp4' })}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z"/>
            </svg>
            <span>MP4</span>
            <small>Best compatibility</small>
          </button>
          <button
            className={`format-button glass ${exportOptions.format === 'webm' ? 'active' : ''}`}
            onClick={() => setExportOptions({ ...exportOptions, format: 'webm' })}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            <span>WebM</span>
            <small>Modern web</small>
          </button>
          <button
            className={`format-button glass ${exportOptions.format === 'gif' ? 'active' : ''}`}
            onClick={() => setExportOptions({ ...exportOptions, format: 'gif' })}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
            </svg>
            <span>GIF</span>
            <small>Animated image</small>
          </button>
        </div>
      </div>
      
      <div className="divider" />
      
      <div className="panel-section">
        <h3 className="section-title">Quality</h3>
        <div className="quality-options">
          <label className={`quality-option glass ${exportOptions.quality === '720p' ? 'active' : ''}`}>
            <input
              type="radio"
              name="quality"
              checked={exportOptions.quality === '720p'}
              onChange={() => setExportOptions({ ...exportOptions, quality: '720p', bitrate: 3000 })}
            />
            <div className="option-content">
              <span className="option-title">720p HD</span>
              <span className="option-desc">1280 × 720 • Fast</span>
            </div>
          </label>
          <label className={`quality-option glass ${exportOptions.quality === '1080p' ? 'active' : ''}`}>
            <input
              type="radio"
              name="quality"
              checked={exportOptions.quality === '1080p'}
              onChange={() => setExportOptions({ ...exportOptions, quality: '1080p', bitrate: 5000 })}
            />
            <div className="option-content">
              <span className="option-title">1080p Full HD</span>
              <span className="option-desc">1920 × 1080 • Recommended</span>
            </div>
          </label>
          <label className={`quality-option glass ${exportOptions.quality === '4k' ? 'active' : ''}`}>
            <input
              type="radio"
              name="quality"
              checked={exportOptions.quality === '4k'}
              onChange={() => setExportOptions({ ...exportOptions, quality: '4k', bitrate: 15000 })}
            />
            <div className="option-content">
              <span className="option-title">4K Ultra HD</span>
              <span className="option-desc">3840 × 2160 • Highest quality</span>
            </div>
          </label>
        </div>
      </div>
      
      <div className="divider" />
      
      <div className="panel-section">
        <h3 className="section-title">Advanced Settings</h3>
        
        <div className="setting-row">
          <label>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
            </svg>
            Frame Rate
          </label>
          <select 
            value={exportOptions.fps}
            onChange={(e) => setExportOptions({ ...exportOptions, fps: parseInt(e.target.value) })}
          >
            <option value={24}>24 fps (Cinematic)</option>
            <option value={30}>30 fps (Standard)</option>
            <option value={60}>60 fps (Smooth)</option>
          </select>
        </div>
        
        <div className="setting-row">
          <label>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11 17h2v-6h-2v6zm1-15C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zM11 9h2V7h-2v2z"/>
            </svg>
            Bitrate
          </label>
          <div className="bitrate-input">
            <input
              type="number"
              value={exportOptions.bitrate}
              onChange={(e) => setExportOptions({ ...exportOptions, bitrate: parseInt(e.target.value) })}
              min={1000}
              max={50000}
              step={1000}
            />
            <span>kbps</span>
          </div>
        </div>
      </div>
      
      <div className="divider" />
      
      <div className="export-summary glass">
        <div className="summary-row">
          <span>Duration</span>
          <span className="summary-value">{currentProject?.duration.toFixed(2) || 0}s</span>
        </div>
        <div className="summary-row">
          <span>Clips</span>
          <span className="summary-value">{currentProject?.clips.length || 0}</span>
        </div>
        <div className="summary-row">
          <span>Resolution</span>
          <span className="summary-value">{exportOptions.quality}</span>
        </div>
        <div className="summary-row">
          <span>Est. Size</span>
          <span className="summary-value">{estimatedSize} MB</span>
        </div>
      </div>
      
      {exporting ? (
        <div className="export-progress">
          <div className="progress-info">
            <span className="progress-label">
              {progress < 50 ? 'Processing clips...' : progress < 100 ? 'Rendering...' : 'Complete!'}
            </span>
            <span className="progress-percent">{progress}%</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-bar-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
          {progress === 100 && (
            <div className="success-message">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
              </svg>
              Export successful!
            </div>
          )}
        </div>
      ) : (
        <button 
          className="btn-primary export-button"
          onClick={handleExport}
          disabled={!currentProject || currentProject.clips.length === 0}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
          </svg>
          Export Video
        </button>
      )}
    </div>
  )
}
