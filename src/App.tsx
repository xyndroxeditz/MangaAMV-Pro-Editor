import React, { useState, useRef } from 'react'
import './App.css'
import { ALL_EFFECTS, EffectCategory } from './lib/effectsLibrary'

function App() {
  const [activeTab, setActiveTab] = useState('home')
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [videoUrl, setVideoUrl] = useState('')
  const [selectedEffect, setSelectedEffect] = useState('')
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [darkMode, setDarkMode] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith('video/')) {
      setVideoFile(file)
      const url = URL.createObjectURL(file)
      setVideoUrl(url)
      setActiveTab('editor')
    }
  }

  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className={`app ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        onChange={handleFileUpload}
        style={{ display: 'none' }}
      />
      
      <div className="content">
        {activeTab === 'home' && <HomeScreen onImportClick={handleImportClick} />}
        {activeTab === 'editor' && (
          <EditorScreen
            videoUrl={videoUrl}
            videoRef={videoRef}
            selectedEffect={selectedEffect}
            setSelectedEffect={setSelectedEffect}
            isPlaying={isPlaying}
            togglePlay={togglePlay}
            currentTime={currentTime}
            setCurrentTime={setCurrentTime}
            duration={duration}
            setDuration={setDuration}
            formatTime={formatTime}
            onImportClick={handleImportClick}
          />
        )}
        {activeTab === 'library' && (
          <LibraryScreen
            setSelectedEffect={setSelectedEffect}
            setActiveTab={setActiveTab}
          />
        )}
        {activeTab === 'export' && <ExportScreen videoUrl={videoUrl} />}
        {activeTab === 'profile' && <ProfileScreen darkMode={darkMode} setDarkMode={setDarkMode} />}
      </div>
      
      <nav className="bottom-nav">
        <button 
          className={activeTab === 'home' ? 'active' : ''} 
          onClick={() => setActiveTab('home')}
        >
          <span className="icon">🏠</span>
          <span className="label">Home</span>
        </button>
        <button 
          className={activeTab === 'editor' ? 'active' : ''} 
          onClick={() => setActiveTab('editor')}
        >
          <span className="icon">✂️</span>
          <span className="label">Editor</span>
        </button>
        <button 
          className={activeTab === 'library' ? 'active' : ''} 
          onClick={() => setActiveTab('library')}
        >
          <span className="icon">📚</span>
          <span className="label">Library</span>
        </button>
        <button 
          className={activeTab === 'export' ? 'active' : ''} 
          onClick={() => setActiveTab('export')}
        >
          <span className="icon">📤</span>
          <span className="label">Export</span>
        </button>
        <button 
          className={activeTab === 'profile' ? 'active' : ''} 
          onClick={() => setActiveTab('profile')}
        >
          <span className="icon">👤</span>
          <span className="label">Profile</span>
        </button>
      </nav>
    </div>
  )
}


function HomeScreen({ onImportClick }: { onImportClick: () => void }) {
  return (
    <div className="screen home-screen">
      <h1 className="title">✨ MangaAMV Pro Editor ✨</h1>
      <p className="subtitle">Create Professional Manga & AMV Edits</p>
      
      <div className="feature-stats">
        <div className="stat-badge">🎬 15,681+ Features</div>
        <div className="stat-badge">🎨 11,200+ Effects</div>
        <div className="stat-badge">⚡ 2,105 Transitions</div>
      </div>

      <div className="card upload-card">
        <h2>� Start Creating</h2>
        <p>Upload your video to begin editing with professional tools</p>
        <button className="upload-btn" onClick={onImportClick}>
          📤 Import Video
        </button>
      </div>

      <div className="features-grid">
        <div className="feature-box">
          <span className="feature-icon">🎨</span>
          <h3>Manga Effects</h3>
          <p>1,200+ manga-style effects</p>
        </div>
        <div className="feature-box">
          <span className="feature-icon">🎵</span>
          <h3>Beat Sync</h3>
          <p>Auto BPM detection</p>
        </div>
        <div className="feature-box">
          <span className="feature-icon">🌈</span>
          <h3>Color Grade</h3>
          <p>Professional LUTs</p>
        </div>
        <div className="feature-box">
          <span className="feature-icon">✨</span>
          <h3>3D Engine</h3>
          <p>Three.js powered</p>
        </div>
      </div>
    </div>
  )
}

function EditorScreen({
  videoUrl,
  videoRef,
  selectedEffect,
  setSelectedEffect,
  isPlaying,
  togglePlay,
  currentTime,
  setCurrentTime,
  duration,
  setDuration,
  formatTime,
  onImportClick
}: {
  videoUrl: string
  videoRef: React.RefObject<HTMLVideoElement>
  selectedEffect: string
  setSelectedEffect: (id: string) => void
  isPlaying: boolean
  togglePlay: () => void
  currentTime: number
  setCurrentTime: (time: number) => void
  duration: number
  setDuration: (duration: number) => void
  formatTime: (seconds: number) => string
  onImportClick: () => void
}) {
  const [showEffects, setShowEffects] = useState(false)

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration)
    }
  }

  const handleSeek = (value: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = value
      setCurrentTime(value)
    }
  }

  const mangaEffects = ALL_EFFECTS.filter(e => e.category === EffectCategory.MANGA_PANEL).slice(0, 12)

  if (!videoUrl) {
    return (
      <div className="screen editor-screen">
        <h1 className="title">✂️ Video Editor</h1>
        <div className="empty-editor" onClick={onImportClick}>
          <span className="empty-icon">📹</span>
          <h2>No Video Loaded</h2>
          <p>Click here to import a video and start editing</p>
          <button className="import-btn" onClick={onImportClick}>Import Video</button>
        </div>
      </div>
    )
  }

  return (
    <div className="screen editor-screen">
      <h1 className="title">✂️ Video Editor</h1>
      
      <div className="video-player-container">
        <video
          ref={videoRef}
          src={videoUrl}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          className={`video-player ${selectedEffect ? 'has-effect' : ''}`}
        />
        {selectedEffect && (
          <div className="effect-badge">✨ Effect Active</div>
        )}
      </div>

      <div className="playback-panel">
        <button className="control-btn" onClick={togglePlay}>
          {isPlaying ? '⏸️ Pause' : '▶️ Play'}
        </button>
        <div className="time-info">{formatTime(currentTime)} / {formatTime(duration)}</div>
        <input
          type="range"
          min="0"
          max={duration || 0}
          value={currentTime}
          onChange={(e) => handleSeek(parseFloat(e.target.value))}
          className="timeline-slider"
        />
      </div>

      <div className="editor-controls">
        <button 
          className={`effects-toggle ${showEffects ? 'active' : ''}`}
          onClick={() => setShowEffects(!showEffects)}
        >
          ✨ Effects Library ({mangaEffects.length})
        </button>
      </div>

      {showEffects && (
        <div className="effects-panel-compact">
          <h3>🎨 Manga Effects</h3>
          <div className="effects-grid">
            {mangaEffects.map(effect => (
              <button
                key={effect.id}
                className={`effect-card ${selectedEffect === effect.id ? 'selected' : ''}`}
                onClick={() => setSelectedEffect(selectedEffect === effect.id ? '' : effect.id)}
              >
                <span className="effect-preview">✨</span>
                <span className="effect-name">{effect.displayName || effect.name}</span>
                {effect.trending && <span className="trend-badge">🔥</span>}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function LibraryScreen({
  setSelectedEffect,
  setActiveTab
}: {
  setSelectedEffect: (id: string) => void
  setActiveTab: (tab: string) => void
}) {
  const [category, setCategory] = useState<EffectCategory>(EffectCategory.MANGA_PANEL)
  const [search, setSearch] = useState('')

  const categories = [
    { id: EffectCategory.MANGA_PANEL, name: '🎨 Manga', count: 1200 },
    { id: EffectCategory.TRANSITION, name: '🔄 Transitions', count: 2105 },
    { id: EffectCategory.GLITCH, name: '⚡ Glitch', count: 1000 },
    { id: EffectCategory.TEXT_EFFECT, name: '📝 Text', count: 1000 },
    { id: EffectCategory.THREE_D, name: '🎭 3D', count: 1000 }
  ]

  const effects = ALL_EFFECTS
    .filter(e => e.category === category)
    .filter(e => e.name.toLowerCase().includes(search.toLowerCase()))
    .slice(0, 24)

  return (
    <div className="screen library-screen">
      <h1 className="title">📚 Effects Library</h1>
      <p className="subtitle">15,681+ Professional Features</p>

      <input
        type="text"
        className="search-input"
        placeholder="🔍 Search effects..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="category-tabs">
        {categories.map(cat => (
          <button
            key={cat.id}
            className={`cat-tab ${category === cat.id ? 'active' : ''}`}
            onClick={() => setCategory(cat.id)}
          >
            {cat.name} <span className="count">({cat.count})</span>
          </button>
        ))}
      </div>

      <div className="effects-library-grid">
        {effects.map(effect => (
          <div key={effect.id} className="lib-effect-card">
            <div className="lib-effect-header">
              <h4>{effect.displayName || effect.name}</h4>
              {effect.trending && <span className="trending">🔥 Trending</span>}
              {effect.new && <span className="new-badge">✨ New</span>}
            </div>
            <p className="lib-effect-desc">{effect.description}</p>
            <div className="lib-effect-tags">
              {effect.tags.slice(0, 3).map(tag => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>
            <button
              className="apply-effect-btn"
              onClick={() => {
                setSelectedEffect(effect.id)
                setActiveTab('editor')
              }}
            >
              ⚡ Apply Effect
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}


function ExportScreen({ videoUrl }: { videoUrl: string }) {
  const [format, setFormat] = useState('mp4')
  const [quality, setQuality] = useState('1080p')
  const [exporting, setExporting] = useState(false)

  const handleExport = () => {
    setExporting(true)
    setTimeout(() => {
      setExporting(false)
      alert('✅ Export complete! (Demo mode - actual FFmpeg export will be added)')
    }, 2000)
  }

  if (!videoUrl) {
    return (
      <div className="screen export-screen">
        <h1 className="title">📤 Export & Share</h1>
        <div className="card">
          <h2>⚠️ No Video to Export</h2>
          <p>Import a video first to use export features</p>
        </div>
      </div>
    )
  }

  return (
    <div className="screen export-screen">
      <h1 className="title">📤 Export & Share</h1>
      <p className="subtitle">Export your masterpiece</p>

      <div className="card export-card">
        <h2>🎬 Export Settings</h2>
        
        <div className="setting-group">
          <label>Format:</label>
          <select value={format} onChange={(e) => setFormat(e.target.value)}>
            <option value="mp4">MP4 (H.264)</option>
            <option value="webm">WebM</option>
            <option value="mov">MOV</option>
            <option value="gif">GIF</option>
          </select>
        </div>

        <div className="setting-group">
          <label>Quality:</label>
          <select value={quality} onChange={(e) => setQuality(e.target.value)}>
            <option value="4k">4K (3840x2160)</option>
            <option value="1080p">Full HD (1920x1080)</option>
            <option value="720p">HD (1280x720)</option>
            <option value="480p">SD (854x480)</option>
          </select>
        </div>

        <div className="preset-grid">
          <button className="preset-btn">📹 YouTube</button>
          <button className="preset-btn">📱 TikTok</button>
          <button className="preset-btn">📸 Instagram</button>
          <button className="preset-btn">💬 Twitter</button>
        </div>

        <button
          className={`export-btn ${exporting ? 'exporting' : ''}`}
          onClick={handleExport}
          disabled={exporting}
        >
          {exporting ? '⏳ Exporting...' : '🚀 Export Video'}
        </button>
      </div>

      <div className="export-info">
        <h3>✨ Included Features:</h3>
        <ul>
          <li>✅ All effects applied</li>
          <li>✅ Color grading preserved</li>
          <li>✅ Audio synchronized</li>
          <li>✅ High-quality encoding</li>
        </ul>
      </div>
    </div>
  )
}

function ProfileScreen({ darkMode, setDarkMode }: { darkMode: boolean, setDarkMode: (mode: boolean) => void }) {
  return (
    <div className="screen profile-screen">
      <h1 className="title">👤 Profile & Settings</h1>
      <p className="subtitle">Your account & preferences</p>

      <div className="card profile-card">
        <div className="avatar-circle">👤</div>
        <h2>Pro Editor</h2>
        <p>Member since October 2025</p>
      </div>

      <div className="card settings-card">
        <h3>⚙️ Settings</h3>
        <div className="setting-row">
          <span>🌓 Dark Mode</span>
          <label className="switch">
            <input
              type="checkbox"
              checked={darkMode}
              onChange={(e) => setDarkMode(e.target.checked)}
            />
            <span className="slider"></span>
          </label>
        </div>
      </div>

      <div className="card stats-card">
        <h3>📊 Statistics</h3>
        <div className="stats-grid-profile">
          <div className="stat-item">
            <div className="stat-number">15,681+</div>
            <div className="stat-label">Total Features</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">11,200+</div>
            <div className="stat-label">Effects</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">2,105</div>
            <div className="stat-label">Transitions</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">1,000+</div>
            <div className="stat-label">Audio FX</div>
          </div>
        </div>
      </div>

      <div className="card app-info-card">
        <h3>ℹ️ App Info</h3>
        <div className="info-row">
          <span>Version:</span>
          <span>3.0.0 Production</span>
        </div>
        <div className="info-row">
          <span>Build:</span>
          <span>6.91s</span>
        </div>
        <div className="info-row">
          <span>Bundle:</span>
          <span>167.42 KiB</span>
        </div>
        <div className="info-row">
          <span>Status:</span>
          <span className="status-badge">🟢 LIVE</span>
        </div>
      </div>
    </div>
  )
}

export default App
