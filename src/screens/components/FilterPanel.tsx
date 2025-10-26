import React, { useState, useEffect } from 'react'
import { useVideoStore } from '../../stores/useVideoStore'
import './FilterPanel.css'

export default function FilterPanel() {
  const { currentProject, selectedClipId, applyFilter } = useVideoStore()
  const selectedClip = currentProject?.clips.find(c => c.id === selectedClipId)
  
  const [filters, setFilters] = useState({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    blur: 0,
    hue: 0,
    grayscale: 0
  })
  
  const [presets, setPresets] = useState([
    { name: 'Original', icon: '🎬', filters: { brightness: 100, contrast: 100, saturation: 100, blur: 0, hue: 0, grayscale: 0 } },
    { name: 'Vintage', icon: '📷', filters: { brightness: 95, contrast: 110, saturation: 80, blur: 0, hue: 30, grayscale: 20 } },
    { name: 'Cinematic', icon: '🎞️', filters: { brightness: 90, contrast: 120, saturation: 90, blur: 0, hue: 0, grayscale: 0 } },
    { name: 'B&W', icon: '⚫', filters: { brightness: 100, contrast: 110, saturation: 0, blur: 0, hue: 0, grayscale: 100 } },
    { name: 'Vivid', icon: '🌈', filters: { brightness: 105, contrast: 110, saturation: 140, blur: 0, hue: 0, grayscale: 0 } },
    { name: 'Soft', icon: '☁️', filters: { brightness: 105, contrast: 90, saturation: 95, blur: 2, hue: 0, grayscale: 0 } },
    { name: 'Cold', icon: '❄️', filters: { brightness: 100, contrast: 105, saturation: 90, blur: 0, hue: 200, grayscale: 0 } },
    { name: 'Warm', icon: '🔥', filters: { brightness: 105, contrast: 105, saturation: 110, blur: 0, hue: 30, grayscale: 0 } },
  ])
  
  useEffect(() => {
    if (selectedClip) {
      setFilters(selectedClip.filters)
    }
  }, [selectedClip])
  
  const handleFilterChange = (filterName: keyof typeof filters, value: number) => {
    const newFilters = { ...filters, [filterName]: value }
    setFilters(newFilters)
    
    if (selectedClipId) {
      applyFilter(selectedClipId, newFilters)
    }
  }
  
  const applyPreset = (preset: typeof presets[0]) => {
    setFilters(preset.filters)
    if (selectedClipId) {
      applyFilter(selectedClipId, preset.filters)
    }
  }
  
  const resetFilters = () => {
    const defaultFilters = { brightness: 100, contrast: 100, saturation: 100, blur: 0, hue: 0, grayscale: 0 }
    setFilters(defaultFilters)
    if (selectedClipId) {
      applyFilter(selectedClipId, defaultFilters)
    }
  }
  
  if (!selectedClip) {
    return (
      <div className="panel-empty" style={{ padding: '2rem', textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}>✨</div>
        <h3>No clip selected</h3>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
          Select a clip to apply effects and filters
        </p>
      </div>
    )
  }
  
  return (
    <div className="filter-panel">
      <div className="panel-section">
        <h3 className="section-title">Presets</h3>
        <div className="preset-grid">
          {presets.map((preset) => (
            <button
              key={preset.name}
              className="preset-button glass"
              onClick={() => applyPreset(preset)}
            >
              <span className="preset-icon">{preset.icon}</span>
              <span className="preset-name">{preset.name}</span>
            </button>
          ))}
        </div>
      </div>
      
      <div className="divider" />
      
      <div className="panel-section">
        <div className="section-header">
          <h3 className="section-title">Custom Adjustments</h3>
          <button className="btn-ghost btn-sm" onClick={resetFilters}>
            Reset
          </button>
        </div>
        
        {/* Brightness */}
        <div className="filter-control">
          <div className="control-header">
            <label>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z"/>
              </svg>
              Brightness
            </label>
            <span className="control-value">{filters.brightness}</span>
          </div>
          <input
            type="range"
            min="0"
            max="200"
            value={filters.brightness}
            onChange={(e) => handleFilterChange('brightness', parseInt(e.target.value))}
          />
        </div>
        
        {/* Contrast */}
        <div className="filter-control">
          <div className="control-header">
            <label>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 22c5.52 0 10-4.48 10-10S17.52 2 12 2 2 6.48 2 12s4.48 10 10 10zm0-18c4.42 0 8 3.58 8 8s-3.58 8-8 8V4z"/>
              </svg>
              Contrast
            </label>
            <span className="control-value">{filters.contrast}</span>
          </div>
          <input
            type="range"
            min="0"
            max="200"
            value={filters.contrast}
            onChange={(e) => handleFilterChange('contrast', parseInt(e.target.value))}
          />
        </div>
        
        {/* Saturation */}
        <div className="filter-control">
          <div className="control-header">
            <label>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9zm0 16c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7zm0-12c-2.76 0-5 2.24-5 5s2.24 5 5 5V7z"/>
              </svg>
              Saturation
            </label>
            <span className="control-value">{filters.saturation}</span>
          </div>
          <input
            type="range"
            min="0"
            max="200"
            value={filters.saturation}
            onChange={(e) => handleFilterChange('saturation', parseInt(e.target.value))}
          />
        </div>
        
        {/* Blur */}
        <div className="filter-control">
          <div className="control-header">
            <label>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 13c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1zm0 4c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1zm0-8c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1zm-3 .5c-.28 0-.5.22-.5.5s.22.5.5.5.5-.22.5-.5-.22-.5-.5-.5zM6 5c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1zm15 5.5c.28 0 .5-.22.5-.5s-.22-.5-.5-.5-.5.22-.5.5.22.5.5.5zM14 7c.55 0 1-.45 1-1s-.45-1-1-1-1 .45-1 1 .45 1 1 1zm0-3.5c.28 0 .5-.22.5-.5s-.22-.5-.5-.5-.5.22-.5.5.22.5.5.5zm-11 10c-.28 0-.5.22-.5.5s.22.5.5.5.5-.22.5-.5-.22-.5-.5-.5zm7 7c-.28 0-.5.22-.5.5s.22.5.5.5.5-.22.5-.5-.22-.5-.5-.5zm0-17c.28 0 .5-.22.5-.5s-.22-.5-.5-.5-.5.22-.5.5.22.5.5.5zM10 7c.55 0 1-.45 1-1s-.45-1-1-1-1 .45-1 1 .45 1 1 1zm0 5.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm8 .5c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1zm0 4c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1zm0-8c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1zm0-4c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1zm3 8.5c-.28 0-.5.22-.5.5s.22.5.5.5.5-.22.5-.5-.22-.5-.5-.5zM14 17c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1zm0 3.5c-.28 0-.5.22-.5.5s.22.5.5.5.5-.22.5-.5-.22-.5-.5-.5zm-4-12c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0 8.5c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1zm4-4.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-4c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z"/>
              </svg>
              Blur
            </label>
            <span className="control-value">{filters.blur}</span>
          </div>
          <input
            type="range"
            min="0"
            max="20"
            value={filters.blur}
            onChange={(e) => handleFilterChange('blur', parseInt(e.target.value))}
          />
        </div>
        
        {/* Hue */}
        <div className="filter-control">
          <div className="control-header">
            <label>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.49 2 2 6.49 2 12s4.49 10 10 10 10-4.49 10-10S17.51 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
              </svg>
              Hue
            </label>
            <span className="control-value">{filters.hue}°</span>
          </div>
          <input
            type="range"
            min="0"
            max="360"
            value={filters.hue}
            onChange={(e) => handleFilterChange('hue', parseInt(e.target.value))}
            style={{
              background: `linear-gradient(90deg, 
                hsl(0, 100%, 50%), 
                hsl(60, 100%, 50%), 
                hsl(120, 100%, 50%), 
                hsl(180, 100%, 50%), 
                hsl(240, 100%, 50%), 
                hsl(300, 100%, 50%), 
                hsl(360, 100%, 50%)
              )`
            }}
          />
        </div>
        
        {/* Grayscale */}
        <div className="filter-control">
          <div className="control-header">
            <label>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 8.69V4h-4.69L12 .69 8.69 4H4v4.69L.69 12 4 15.31V20h4.69L12 23.31 15.31 20H20v-4.69L23.31 12 20 8.69zM12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zm0-10c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z"/>
              </svg>
              Grayscale
            </label>
            <span className="control-value">{filters.grayscale}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={filters.grayscale}
            onChange={(e) => handleFilterChange('grayscale', parseInt(e.target.value))}
          />
        </div>
      </div>
      
      <div className="divider" />
      
      <div className="panel-section">
        <h3 className="section-title">Advanced</h3>
        <div className="advanced-grid">
          <button className="btn-ghost">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
            Color Grading
          </button>
          <button className="btn-ghost">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Curves
          </button>
          <button className="btn-ghost">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Sharpen
          </button>
          <button className="btn-ghost">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Vignette
          </button>
        </div>
      </div>
    </div>
  )
}
