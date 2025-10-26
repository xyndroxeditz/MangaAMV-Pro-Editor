import React from 'react'
import { useVideoStore } from '../../stores/useVideoStore'
import './FilterPanel.css'

export default function FilterPanel() {
  const { currentProject, selectedClipId, applyFilter, addEffect } = useVideoStore()
  const selectedClip = currentProject?.clips.find(c => c.id === selectedClipId)
  
  if (!selectedClip) {
    return (
      <div className="panel-empty">
        <p>Select a clip to apply effects</p>
      </div>
    )
  }
  
  const filters = selectedClip.filters
  
  const transitions = [
    { name: 'Fade', icon: '🌫️' },
    { name: 'Dissolve', icon: '✨' },
    { name: 'Wipe', icon: '↔️' },
    { name: 'Slide', icon: '➡️' },
    { name: 'Zoom', icon: '🔍' }
  ]
  
  return (
    <div className="filter-panel">
      <h3>Visual Effects</h3>
      
      <div className="filter-section">
        <h4>🎨 Color Adjustments</h4>
        
        <div className="filter-control">
          <label>
            <span>☀️ Brightness</span>
            <span className="value">{filters.brightness}%</span>
          </label>
          <input
            type="range"
            min={0}
            max={200}
            value={filters.brightness}
            onChange={(e) => applyFilter(selectedClip.id, { brightness: parseFloat(e.target.value) })}
          />
        </div>
        
        <div className="filter-control">
          <label>
            <span>🌗 Contrast</span>
            <span className="value">{filters.contrast}%</span>
          </label>
          <input
            type="range"
            min={0}
            max={200}
            value={filters.contrast}
            onChange={(e) => applyFilter(selectedClip.id, { contrast: parseFloat(e.target.value) })}
          />
        </div>
        
        <div className="filter-control">
          <label>
            <span>🎨 Saturation</span>
            <span className="value">{filters.saturation}%</span>
          </label>
          <input
            type="range"
            min={0}
            max={200}
            value={filters.saturation}
            onChange={(e) => applyFilter(selectedClip.id, { saturation: parseFloat(e.target.value) })}
          />
        </div>
        
        <div className="filter-control">
          <label>
            <span>🌈 Hue Rotate</span>
            <span className="value">{filters.hue}°</span>
          </label>
          <input
            type="range"
            min={0}
            max={360}
            value={filters.hue}
            onChange={(e) => applyFilter(selectedClip.id, { hue: parseFloat(e.target.value) })}
          />
        </div>
        
        <div className="filter-control">
          <label>
            <span>⚫ Grayscale</span>
            <span className="value">{filters.grayscale}%</span>
          </label>
          <input
            type="range"
            min={0}
            max={100}
            value={filters.grayscale}
            onChange={(e) => applyFilter(selectedClip.id, { grayscale: parseFloat(e.target.value) })}
          />
        </div>
        
        <div className="filter-control">
          <label>
            <span>🌫️ Blur</span>
            <span className="value">{filters.blur}px</span>
          </label>
          <input
            type="range"
            min={0}
            max={20}
            value={filters.blur}
            onChange={(e) => applyFilter(selectedClip.id, { blur: parseFloat(e.target.value) })}
          />
        </div>
      </div>
      
      <div className="filter-section">
        <h4>🎬 Transitions</h4>
        <div className="transition-grid">
          {transitions.map(transition => (
            <button
              key={transition.name}
              className="transition-btn"
              onClick={() => addEffect(selectedClip.id, {
                id: Math.random().toString(36).substr(2, 9),
                type: 'transition',
                name: transition.name,
                startTime: selectedClip.startTime,
                duration: 1,
                params: {}
              })}
            >
              <span className="transition-icon">{transition.icon}</span>
              <span className="transition-name">{transition.name}</span>
            </button>
          ))}
        </div>
      </div>
      
      <div className="filter-section">
        <h4>✨ Presets</h4>
        <div className="preset-grid">
          <button onClick={() => applyFilter(selectedClip.id, {
            brightness: 110,
            contrast: 120,
            saturation: 130,
            hue: 0
          })}>🌅 Warm</button>
          
          <button onClick={() => applyFilter(selectedClip.id, {
            brightness: 90,
            contrast: 110,
            saturation: 80,
            hue: 200
          })}>❄️ Cool</button>
          
          <button onClick={() => applyFilter(selectedClip.id, {
            brightness: 120,
            contrast: 130,
            saturation: 150,
            hue: 0
          })}>🌺 Vibrant</button>
          
          <button onClick={() => applyFilter(selectedClip.id, {
            brightness: 100,
            contrast: 100,
            saturation: 100,
            hue: 0,
            grayscale: 0,
            blur: 0
          })}>🔄 Reset</button>
        </div>
      </div>
    </div>
  )
}
