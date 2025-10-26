import React, { useState } from 'react'
import { useVideoStore, TextOverlay } from '../../stores/useVideoStore'
import './TextEditor.css'

export default function TextEditor() {
  const { addTextOverlay, updateTextOverlay, removeTextOverlay, currentProject, currentTime } = useVideoStore()
  
  const [editingText, setEditingText] = useState<TextOverlay | null>(null)
  const [newText, setNewText] = useState({
    text: 'Sample Text',
    font: 'Arial',
    size: 48,
    color: '#ffffff',
    bold: false,
    italic: false,
    stroke: true,
    strokeColor: '#000000',
    strokeWidth: 2
  })
  
  const fonts = ['Arial', 'Impact', 'Comic Sans MS', 'Times New Roman', 'Courier New', 'Georgia', 'Verdana']
  const animations = ['None', 'Fade In', 'Slide In', 'Bounce', 'Zoom', 'Typewriter']
  
  const handleAddText = () => {
    const textOverlay: TextOverlay = {
      id: Math.random().toString(36).substr(2, 9),
      text: newText.text,
      font: newText.font,
      size: newText.size,
      color: newText.color,
      position: { x: 960, y: 540 },
      animation: 'None',
      startTime: currentTime,
      duration: 3,
      style: {
        bold: newText.bold,
        italic: newText.italic,
        underline: false,
        stroke: newText.stroke,
        strokeColor: newText.strokeColor,
        strokeWidth: newText.strokeWidth,
        shadow: true,
        shadowBlur: 10
      }
    }
    addTextOverlay(textOverlay)
  }
  
  return (
    <div className="text-editor">
      <h3>Text Overlays</h3>
      
      <div className="text-add-section">
        <input
          type="text"
          placeholder="Enter text..."
          value={newText.text}
          onChange={(e) => setNewText({ ...newText, text: e.target.value })}
          className="text-input"
        />
        
        <div className="text-controls">
          <div className="control-row">
            <label>Font</label>
            <select 
              value={newText.font}
              onChange={(e) => setNewText({ ...newText, font: e.target.value })}
            >
              {fonts.map(font => (
                <option key={font} value={font}>{font}</option>
              ))}
            </select>
          </div>
          
          <div className="control-row">
            <label>Size</label>
            <input
              type="range"
              min={12}
              max={120}
              value={newText.size}
              onChange={(e) => setNewText({ ...newText, size: parseInt(e.target.value) })}
            />
            <span>{newText.size}px</span>
          </div>
          
          <div className="control-row">
            <label>Color</label>
            <input
              type="color"
              value={newText.color}
              onChange={(e) => setNewText({ ...newText, color: e.target.value })}
            />
          </div>
          
          <div className="control-row style-toggles">
            <button
              className={newText.bold ? 'active' : ''}
              onClick={() => setNewText({ ...newText, bold: !newText.bold })}
            >
              <strong>B</strong>
            </button>
            <button
              className={newText.italic ? 'active' : ''}
              onClick={() => setNewText({ ...newText, italic: !newText.italic })}
            >
              <em>I</em>
            </button>
            <button
              className={newText.stroke ? 'active' : ''}
              onClick={() => setNewText({ ...newText, stroke: !newText.stroke })}
            >
              Outline
            </button>
          </div>
          
          {newText.stroke && (
            <div className="control-row">
              <label>Outline Color</label>
              <input
                type="color"
                value={newText.strokeColor}
                onChange={(e) => setNewText({ ...newText, strokeColor: e.target.value })}
              />
              <input
                type="range"
                min={1}
                max={10}
                value={newText.strokeWidth}
                onChange={(e) => setNewText({ ...newText, strokeWidth: parseInt(e.target.value) })}
              />
              <span>{newText.strokeWidth}px</span>
            </div>
          )}
        </div>
        
        <button className="btn-add-text" onClick={handleAddText}>
          ➕ Add Text to Timeline
        </button>
      </div>
      
      {currentProject && currentProject.textOverlays.length > 0 && (
        <div className="text-list">
          <h4>Text Overlays ({currentProject.textOverlays.length})</h4>
          {currentProject.textOverlays.map(text => (
            <div key={text.id} className="text-item">
              <div className="text-preview" style={{ 
                fontFamily: text.font,
                fontSize: `${Math.min(text.size / 2, 24)}px`,
                color: text.color,
                fontWeight: text.style.bold ? 'bold' : 'normal',
                fontStyle: text.style.italic ? 'italic' : 'normal'
              }}>
                {text.text}
              </div>
              <div className="text-meta">
                <span>{text.startTime.toFixed(1)}s - {(text.startTime + text.duration).toFixed(1)}s</span>
              </div>
              <button 
                className="btn-remove"
                onClick={() => removeTextOverlay(text.id)}
              >
                🗑️
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
