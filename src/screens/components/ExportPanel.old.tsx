import React, { useState } from 'react'
import { useVideoStore, ExportOptions } from '../../stores/useVideoStore'
import './ExportPanel.css'

export default function ExportPanel() {
  const { currentProject, exportVideo } = useVideoStore()
  const [isExporting, setIsExporting] = useState(false)
  const [exportProgress, setExportProgress] = useState(0)
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'mp4',
    quality: '1080p',
    fps: 30,
    bitrate: 8000
  })
  
  const handleExport = async () => {
    if (!currentProject || currentProject.clips.length === 0) {
      alert('No clips to export!')
      return
    }
    
    setIsExporting(true)
    setExportProgress(0)
    
    // Simulate export progress
    const interval = setInterval(() => {
      setExportProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsExporting(false)
          return 100
        }
        return prev + 5
      })
    }, 200)
    
    try {
      await exportVideo(exportOptions)
    } catch (error) {
      console.error('Export failed:', error)
      setIsExporting(false)
      clearInterval(interval)
    }
  }
  
  const qualityPresets = {
    '720p': { width: 1280, height: 720, bitrate: 5000 },
    '1080p': { width: 1920, height: 1080, bitrate: 8000 },
    '4k': { width: 3840, height: 2160, bitrate: 20000 }
  }
  
  return (
    <div className="export-panel">
      <h3>Export Video</h3>
      
      {currentProject && (
        <div className="project-stats">
          <div className="stat">
            <span className="stat-label">📹 Clips</span>
            <span className="stat-value">{currentProject.clips.length}</span>
          </div>
          <div className="stat">
            <span className="stat-label">⏱️ Duration</span>
            <span className="stat-value">{currentProject.duration.toFixed(2)}s</span>
          </div>
          <div className="stat">
            <span className="stat-label">📝 Text</span>
            <span className="stat-value">{currentProject.textOverlays.length}</span>
          </div>
          <div className="stat">
            <span className="stat-label">🎵 Audio</span>
            <span className="stat-value">{currentProject.audioTracks.length}</span>
          </div>
        </div>
      )}
      
      <div className="export-options">
        <div className="option-group">
          <label>📹 Video Quality</label>
          <div className="quality-buttons">
            {(['720p', '1080p', '4k'] as const).map(quality => (
              <button
                key={quality}
                className={exportOptions.quality === quality ? 'active' : ''}
                onClick={() => setExportOptions({
                  ...exportOptions,
                  quality,
                  bitrate: qualityPresets[quality].bitrate
                })}
              >
                <span className="quality-label">{quality}</span>
                <span className="quality-res">
                  {qualityPresets[quality].width}×{qualityPresets[quality].height}
                </span>
              </button>
            ))}
          </div>
        </div>
        
        <div className="option-group">
          <label>📦 Format</label>
          <div className="format-buttons">
            {(['mp4', 'webm', 'gif'] as const).map(format => (
              <button
                key={format}
                className={exportOptions.format === format ? 'active' : ''}
                onClick={() => setExportOptions({ ...exportOptions, format })}
              >
                {format.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
        
        <div className="option-group">
          <label>
            <span>🎬 Frame Rate</span>
            <span className="value">{exportOptions.fps} FPS</span>
          </label>
          <input
            type="range"
            min={24}
            max={60}
            value={exportOptions.fps}
            onChange={(e) => setExportOptions({ ...exportOptions, fps: parseInt(e.target.value) })}
          />
        </div>
        
        <div className="option-group">
          <label>
            <span>💾 Bitrate</span>
            <span className="value">{(exportOptions.bitrate / 1000).toFixed(1)} Mbps</span>
          </label>
          <input
            type="range"
            min={1000}
            max={50000}
            step={1000}
            value={exportOptions.bitrate}
            onChange={(e) => setExportOptions({ ...exportOptions, bitrate: parseInt(e.target.value) })}
          />
        </div>
      </div>
      
      {isExporting ? (
        <div className="export-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${exportProgress}%` }}
            ></div>
          </div>
          <p className="progress-text">Exporting... {exportProgress}%</p>
          <p className="progress-subtext">This may take a few moments</p>
        </div>
      ) : (
        <button 
          className="btn-export"
          onClick={handleExport}
          disabled={!currentProject || currentProject.clips.length === 0}
        >
          🚀 Export Video
        </button>
      )}
      
      <div className="export-tips">
        <h4>💡 Export Tips</h4>
        <ul>
          <li>720p is perfect for social media and mobile viewing</li>
          <li>1080p offers great quality for YouTube and most platforms</li>
          <li>4K is ideal for professional content and future-proofing</li>
          <li>Higher bitrate = better quality but larger file size</li>
          <li>MP4 has best compatibility, WebM for web, GIF for animations</li>
        </ul>
      </div>
    </div>
  )
}
