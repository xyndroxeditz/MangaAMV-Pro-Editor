import React, { useState } from 'react'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('home')

  return (
    <div className="app">
      <div className="content">
        {activeTab === 'home' && <HomeScreen />}
        {activeTab === 'editor' && <EditorScreen />}
        {activeTab === 'library' && <LibraryScreen />}
        {activeTab === 'export' && <ExportScreen />}
        {activeTab === 'profile' && <ProfileScreen />}
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

function HomeScreen() {
  return (
    <div className="screen">
      <h1 className="title">✨ MangaAMV Pro ✨</h1>
      <p className="subtitle">Create Amazing AMV & Manga Edits</p>
      <div className="card">
        <h2>🎬 Get Started</h2>
        <p>Tap Editor to start creating your masterpiece!</p>
      </div>
    </div>
  )
}

function EditorScreen() {
  return (
    <div className="screen">
      <h1 className="title">✂️ Video Editor</h1>
      <p className="subtitle">Professional editing tools</p>
      <div className="card">
        <h2>🎥 Upload Video</h2>
        <p>Import your footage to start editing</p>
      </div>
    </div>
  )
}

function LibraryScreen() {
  return (
    <div className="screen">
      <h1 className="title">📚 Media Library</h1>
      <p className="subtitle">Your assets and projects</p>
      <div className="card">
        <h2>📁 Your Files</h2>
        <p>All your videos, images, and audio files</p>
      </div>
    </div>
  )
}

function ExportScreen() {
  return (
    <div className="screen">
      <h1 className="title">📤 Export & Share</h1>
      <p className="subtitle">Share your creations</p>
      <div className="card">
        <h2>🚀 Export Video</h2>
        <p>Export in HD, 4K, or optimized for social media</p>
      </div>
    </div>
  )
}

function ProfileScreen() {
  return (
    <div className="screen">
      <h1 className="title">👤 Profile</h1>
      <p className="subtitle">Your account & settings</p>
      <div className="card">
        <h2>⚙️ Settings</h2>
        <p>Customize your editing experience</p>
      </div>
    </div>
  )
}

export default App
