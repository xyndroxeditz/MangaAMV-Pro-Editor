import React, { useRef } from 'react'
import { useVideoStore } from '../../stores/useVideoStore'
import './AudioPanel.css'

export default function AudioPanel() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { addAudioTrack, updateAudioTrack, removeAudioTrack, currentProject } = useVideoStore()
  
  const handleFileSelect = async (files: FileList | null) => {
    if (!files) return
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      if (file.type.startsWith('audio/')) {
        await addAudioTrack(file)
      }
    }
  }
  
  const audioEffects = ['None', 'Echo', 'Reverb', 'Bass Boost', 'Fade In/Out']
  
  return (
    <div className="audio-panel">
      <h3>Audio Tracks</h3>
      
      <div className="audio-upload">
        <button 
          className="btn-upload-audio"
          onClick={() => fileInputRef.current?.click()}
        >
          🎵 Add Audio Track
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          multiple
          onChange={(e) => handleFileSelect(e.target.files)}
          style={{ display: 'none' }}
        />
      </div>
      
      {currentProject && currentProject.audioTracks.length > 0 ? (
        <div className="audio-tracks">
          {currentProject.audioTracks.map(track => (
            <div key={track.id} className="audio-track">
              <div className="track-header">
                <span className="track-name">🎵 {track.file.name}</span>
                <button 
                  className="btn-remove"
                  onClick={() => removeAudioTrack(track.id)}
                >
                  🗑️
                </button>
              </div>
              
              <div className="track-info">
                <span>Duration: {track.duration.toFixed(2)}s</span>
                <span>Start: {track.startTime.toFixed(2)}s</span>
              </div>
              
              <div className="track-controls">
                <div className="control-group">
                  <label>
                    <span>🔊 Volume</span>
                    <span className="value">{Math.round(track.volume * 100)}%</span>
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={track.volume}
                    onChange={(e) => updateAudioTrack(track.id, { volume: parseFloat(e.target.value) })}
                  />
                </div>
                
                <div className="control-group">
                  <label>
                    <span>⏱️ Start Time</span>
                    <span className="value">{track.startTime.toFixed(2)}s</span>
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={currentProject.duration || 60}
                    step={0.1}
                    value={track.startTime}
                    onChange={(e) => updateAudioTrack(track.id, { startTime: parseFloat(e.target.value) })}
                  />
                </div>
                
                <div className="control-group">
                  <label>
                    <span>📈 Fade In</span>
                    <span className="value">{track.fadeIn.toFixed(1)}s</span>
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={5}
                    step={0.1}
                    value={track.fadeIn}
                    onChange={(e) => updateAudioTrack(track.id, { fadeIn: parseFloat(e.target.value) })}
                  />
                </div>
                
                <div className="control-group">
                  <label>
                    <span>📉 Fade Out</span>
                    <span className="value">{track.fadeOut.toFixed(1)}s</span>
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={5}
                    step={0.1}
                    value={track.fadeOut}
                    onChange={(e) => updateAudioTrack(track.id, { fadeOut: parseFloat(e.target.value) })}
                  />
                </div>
              </div>
              
              <div className="effects-section">
                <label>Effects</label>
                <div className="effect-buttons">
                  {audioEffects.map(effect => (
                    <button
                      key={effect}
                      className={track.effects.includes(effect) ? 'active' : ''}
                      onClick={() => {
                        const newEffects = track.effects.includes(effect)
                          ? track.effects.filter(e => e !== effect)
                          : [...track.effects, effect]
                        updateAudioTrack(track.id, { effects: newEffects })
                      }}
                    >
                      {effect}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="audio-empty">
          <p>No audio tracks yet. Click the button above to add music or sound effects.</p>
        </div>
      )}
    </div>
  )
}
