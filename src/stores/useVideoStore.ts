import { create } from 'zustand'

export interface VideoClip {
  id: string
  file: File
  url: string
  duration: number
  thumbnail: string
  startTime: number
  endTime: number
  trimStart: number
  trimEnd: number
  volume: number
  speed: number
  filters: VideoFilters
  effects: VideoEffect[]
  position: { x: number; y: number; scale: number; rotation: number }
}

export interface VideoFilters {
  brightness: number
  contrast: number
  saturation: number
  blur: number
  hue: number
  grayscale: number
}

export interface VideoEffect {
  id: string
  type: 'transition' | 'filter' | 'animation'
  name: string
  startTime: number
  duration: number
  params: Record<string, any>
}

export interface TextOverlay {
  id: string
  text: string
  font: string
  size: number
  color: string
  position: { x: number; y: number }
  animation: string
  startTime: number
  duration: number
  style: {
    bold: boolean
    italic: boolean
    underline: boolean
    stroke: boolean
    strokeColor: string
    strokeWidth: number
    shadow: boolean
    shadowBlur: number
  }
}

export interface Sticker {
  id: string
  url: string
  position: { x: number; y: number }
  scale: number
  rotation: number
  startTime: number
  duration: number
}

export interface AudioTrack {
  id: string
  file: File
  url: string
  duration: number
  volume: number
  startTime: number
  fadeIn: number
  fadeOut: number
  effects: string[]
}

export interface Project {
  id: string
  name: string
  createdAt: number
  updatedAt: number
  clips: VideoClip[]
  textOverlays: TextOverlay[]
  stickers: Sticker[]
  audioTracks: AudioTrack[]
  duration: number
  resolution: { width: number; height: number }
  fps: number
}

interface VideoStore {
  // Project state
  currentProject: Project | null
  projects: Project[]
  
  // Editor state
  selectedClipId: string | null
  currentTime: number
  isPlaying: boolean
  zoom: number
  
  // Actions
  createProject: (name: string) => void
  loadProject: (id: string) => void
  saveProject: () => void
  deleteProject: (id: string) => void
  
  // Video actions
  addVideoClip: (file: File) => Promise<void>
  removeClip: (id: string) => void
  updateClip: (id: string, updates: Partial<VideoClip>) => void
  trimClip: (id: string, start: number, end: number) => void
  splitClip: (id: string, time: number) => void
  
  // Filter actions
  applyFilter: (clipId: string, filters: Partial<VideoFilters>) => void
  addEffect: (clipId: string, effect: VideoEffect) => void
  removeEffect: (clipId: string, effectId: string) => void
  
  // Text actions
  addTextOverlay: (text: TextOverlay) => void
  updateTextOverlay: (id: string, updates: Partial<TextOverlay>) => void
  removeTextOverlay: (id: string) => void
  
  // Sticker actions
  addSticker: (sticker: Sticker) => void
  updateSticker: (id: string, updates: Partial<Sticker>) => void
  removeSticker: (id: string) => void
  
  // Audio actions
  addAudioTrack: (file: File) => Promise<void>
  updateAudioTrack: (id: string, updates: Partial<AudioTrack>) => void
  removeAudioTrack: (id: string) => void
  
  // Playback actions
  play: () => void
  pause: () => void
  seek: (time: number) => void
  setZoom: (zoom: number) => void
  
  // Export actions
  exportVideo: (options: ExportOptions) => Promise<void>
}

export interface ExportOptions {
  format: 'mp4' | 'webm' | 'gif'
  quality: '720p' | '1080p' | '4k'
  fps: number
  bitrate: number
}

const generateId = () => Math.random().toString(36).substr(2, 9)

export const useVideoStore = create<VideoStore>((set, get) => ({
  // Initial state
  currentProject: null,
  projects: [],
  selectedClipId: null,
  currentTime: 0,
  isPlaying: false,
  zoom: 1,
  
  // Project management
  createProject: (name: string) => {
    const project: Project = {
      id: generateId(),
      name,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      clips: [],
      textOverlays: [],
      stickers: [],
      audioTracks: [],
      duration: 0,
      resolution: { width: 1920, height: 1080 },
      fps: 30
    }
    set(state => ({
      currentProject: project,
      projects: [...state.projects, project]
    }))
  },
  
  loadProject: (id: string) => {
    const project = get().projects.find(p => p.id === id)
    if (project) {
      set({ currentProject: project })
    }
  },
  
  saveProject: () => {
    const { currentProject, projects } = get()
    if (!currentProject) return
    
    const updatedProjects = projects.map(p =>
      p.id === currentProject.id ? { ...currentProject, updatedAt: Date.now() } : p
    )
    set({ projects: updatedProjects })
    
    // Save to localStorage
    localStorage.setItem('manga-amv-projects', JSON.stringify(updatedProjects))
  },
  
  deleteProject: (id: string) => {
    set(state => ({
      projects: state.projects.filter(p => p.id !== id),
      currentProject: state.currentProject?.id === id ? null : state.currentProject
    }))
  },
  
  // Video clip management
  addVideoClip: async (file: File) => {
    const url = URL.createObjectURL(file)
    const video = document.createElement('video')
    video.src = url
    
    await new Promise((resolve) => {
      video.onloadedmetadata = resolve
    })
    
    // Generate thumbnail
    const canvas = document.createElement('canvas')
    canvas.width = 160
    canvas.height = 90
    const ctx = canvas.getContext('2d')
    video.currentTime = 0
    await new Promise((resolve) => {
      video.onseeked = resolve
    })
    ctx?.drawImage(video, 0, 0, 160, 90)
    const thumbnail = canvas.toDataURL()
    
    const clip: VideoClip = {
      id: generateId(),
      file,
      url,
      duration: video.duration,
      thumbnail,
      startTime: get().currentProject?.clips.reduce((max, c) => Math.max(max, c.endTime), 0) || 0,
      endTime: (get().currentProject?.clips.reduce((max, c) => Math.max(max, c.endTime), 0) || 0) + video.duration,
      trimStart: 0,
      trimEnd: video.duration,
      volume: 1,
      speed: 1,
      filters: {
        brightness: 100,
        contrast: 100,
        saturation: 100,
        blur: 0,
        hue: 0,
        grayscale: 0
      },
      effects: [],
      position: { x: 0, y: 0, scale: 1, rotation: 0 }
    }
    
    set(state => ({
      currentProject: state.currentProject ? {
        ...state.currentProject,
        clips: [...state.currentProject.clips, clip],
        duration: Math.max(state.currentProject.duration, clip.endTime)
      } : null
    }))
  },
  
  removeClip: (id: string) => {
    set(state => ({
      currentProject: state.currentProject ? {
        ...state.currentProject,
        clips: state.currentProject.clips.filter(c => c.id !== id)
      } : null
    }))
  },
  
  updateClip: (id: string, updates: Partial<VideoClip>) => {
    set(state => ({
      currentProject: state.currentProject ? {
        ...state.currentProject,
        clips: state.currentProject.clips.map(c =>
          c.id === id ? { ...c, ...updates } : c
        )
      } : null
    }))
  },
  
  trimClip: (id: string, start: number, end: number) => {
    const clip = get().currentProject?.clips.find(c => c.id === id)
    if (!clip) return
    
    get().updateClip(id, {
      trimStart: start,
      trimEnd: end,
      endTime: clip.startTime + (end - start)
    })
  },
  
  splitClip: (id: string, time: number) => {
    const clip = get().currentProject?.clips.find(c => c.id === id)
    if (!clip) return
    
    const splitPoint = time - clip.startTime + clip.trimStart
    
    const newClip: VideoClip = {
      ...clip,
      id: generateId(),
      trimStart: splitPoint,
      startTime: time,
      endTime: clip.endTime
    }
    
    get().updateClip(id, {
      trimEnd: splitPoint,
      endTime: time
    })
    
    set(state => ({
      currentProject: state.currentProject ? {
        ...state.currentProject,
        clips: [...state.currentProject.clips, newClip]
      } : null
    }))
  },
  
  // Filters and effects
  applyFilter: (clipId: string, filters: Partial<VideoFilters>) => {
    const clip = get().currentProject?.clips.find(c => c.id === clipId)
    if (!clip) return
    
    get().updateClip(clipId, {
      filters: { ...clip.filters, ...filters }
    })
  },
  
  addEffect: (clipId: string, effect: VideoEffect) => {
    const clip = get().currentProject?.clips.find(c => c.id === clipId)
    if (!clip) return
    
    get().updateClip(clipId, {
      effects: [...clip.effects, effect]
    })
  },
  
  removeEffect: (clipId: string, effectId: string) => {
    const clip = get().currentProject?.clips.find(c => c.id === clipId)
    if (!clip) return
    
    get().updateClip(clipId, {
      effects: clip.effects.filter(e => e.id !== effectId)
    })
  },
  
  // Text overlays
  addTextOverlay: (text: TextOverlay) => {
    set(state => ({
      currentProject: state.currentProject ? {
        ...state.currentProject,
        textOverlays: [...state.currentProject.textOverlays, text]
      } : null
    }))
  },
  
  updateTextOverlay: (id: string, updates: Partial<TextOverlay>) => {
    set(state => ({
      currentProject: state.currentProject ? {
        ...state.currentProject,
        textOverlays: state.currentProject.textOverlays.map(t =>
          t.id === id ? { ...t, ...updates } : t
        )
      } : null
    }))
  },
  
  removeTextOverlay: (id: string) => {
    set(state => ({
      currentProject: state.currentProject ? {
        ...state.currentProject,
        textOverlays: state.currentProject.textOverlays.filter(t => t.id !== id)
      } : null
    }))
  },
  
  // Stickers
  addSticker: (sticker: Sticker) => {
    set(state => ({
      currentProject: state.currentProject ? {
        ...state.currentProject,
        stickers: [...state.currentProject.stickers, sticker]
      } : null
    }))
  },
  
  updateSticker: (id: string, updates: Partial<Sticker>) => {
    set(state => ({
      currentProject: state.currentProject ? {
        ...state.currentProject,
        stickers: state.currentProject.stickers.map(s =>
          s.id === id ? { ...s, ...updates } : s
        )
      } : null
    }))
  },
  
  removeSticker: (id: string) => {
    set(state => ({
      currentProject: state.currentProject ? {
        ...state.currentProject,
        stickers: state.currentProject.stickers.filter(s => s.id !== id)
      } : null
    }))
  },
  
  // Audio tracks
  addAudioTrack: async (file: File) => {
    const url = URL.createObjectURL(file)
    const audio = document.createElement('audio')
    audio.src = url
    
    await new Promise((resolve) => {
      audio.onloadedmetadata = resolve
    })
    
    const track: AudioTrack = {
      id: generateId(),
      file,
      url,
      duration: audio.duration,
      volume: 1,
      startTime: 0,
      fadeIn: 0,
      fadeOut: 0,
      effects: []
    }
    
    set(state => ({
      currentProject: state.currentProject ? {
        ...state.currentProject,
        audioTracks: [...state.currentProject.audioTracks, track]
      } : null
    }))
  },
  
  updateAudioTrack: (id: string, updates: Partial<AudioTrack>) => {
    set(state => ({
      currentProject: state.currentProject ? {
        ...state.currentProject,
        audioTracks: state.currentProject.audioTracks.map(a =>
          a.id === id ? { ...a, ...updates } : a
        )
      } : null
    }))
  },
  
  removeAudioTrack: (id: string) => {
    set(state => ({
      currentProject: state.currentProject ? {
        ...state.currentProject,
        audioTracks: state.currentProject.audioTracks.filter(a => a.id !== id)
      } : null
    }))
  },
  
  // Playback
  play: () => set({ isPlaying: true }),
  pause: () => set({ isPlaying: false }),
  seek: (time: number) => set({ currentTime: time }),
  setZoom: (zoom: number) => set({ zoom: Math.max(0.1, Math.min(10, zoom)) }),
  
  // Export
  exportVideo: async (options: ExportOptions) => {
    // This will be implemented with actual video rendering
    console.log('Exporting video with options:', options)
  }
}))
