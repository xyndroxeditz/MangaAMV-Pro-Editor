import { create } from 'zustand';
import { Layer, TimelineState, Project, AudioTrack } from '../types/index';
import { v4 as uuidv4 } from 'uuid';

interface EditorStore {
  // Project
  project: Project | null;
  setProject: (project: Project) => void;
  
  // Layers
  layers: Layer[];
  addLayer: (layer: Omit<Layer, 'id'>) => void;
  updateLayer: (id: string, updates: Partial<Layer>) => void;
  deleteLayer: (id: string) => void;
  duplicateLayer: (id: string) => void;
  
  // Timeline
  timeline: TimelineState;
  setCurrentTime: (time: number) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setZoom: (zoom: number) => void;
  setBPM: (bpm: number) => void;
  
  // Selection
  selectedLayerIds: string[];
  selectLayer: (id: string, addToSelection?: boolean) => void;
  deselectAll: () => void;
  
  // Undo/Redo
  history: Project[];
  historyIndex: number;
  undo: () => void;
  redo: () => void;
  pushHistory: () => void;
  
  // Audio
  audioTracks: AudioTrack[];
  addAudioTrack: (track: Omit<AudioTrack, 'id'>) => void;
  updateAudioTrack: (id: string, updates: Partial<AudioTrack>) => void;
  deleteAudioTrack: (id: string) => void;
}

export const useEditorStore = create<EditorStore>((set, get) => ({
  // Initial State
  project: null,
  layers: [],
  timeline: {
    currentTime: 0,
    duration: 60,
    zoom: 1,
    bpm: 128,
    isPlaying: false,
    loop: false,
    selectedLayerIds: [],
  },
  selectedLayerIds: [],
  history: [],
  historyIndex: -1,
  audioTracks: [],

  // Project
  setProject: (project) => set({ project }),

  // Layers
  addLayer: (layer) =>
    set((state) => ({
      layers: [
        ...state.layers,
        {
          ...layer,
          id: uuidv4(),
        } as Layer,
      ],
    })),

  updateLayer: (id, updates) =>
    set((state) => ({
      layers: state.layers.map((layer) =>
        layer.id === id ? { ...layer, ...updates } : layer
      ),
    })),

  deleteLayer: (id) =>
    set((state) => ({
      layers: state.layers.filter((layer) => layer.id !== id),
      selectedLayerIds: state.selectedLayerIds.filter((selectedId) => selectedId !== id),
    })),

  duplicateLayer: (id) =>
    set((state) => {
      const layer = state.layers.find((l) => l.id === id);
      if (!layer) return state;

      const newLayer: Layer = {
        ...layer,
        id: uuidv4(),
        name: `${layer.name} Copy`,
        startTime: layer.startTime + 1,
      };

      return {
        layers: [...state.layers, newLayer],
      };
    }),

  // Timeline
  setCurrentTime: (time) =>
    set((state) => ({
      timeline: { ...state.timeline, currentTime: time },
    })),

  setIsPlaying: (isPlaying) =>
    set((state) => ({
      timeline: { ...state.timeline, isPlaying },
    })),

  setZoom: (zoom) =>
    set((state) => ({
      timeline: { ...state.timeline, zoom },
    })),

  setBPM: (bpm) =>
    set((state) => ({
      timeline: { ...state.timeline, bpm },
    })),

  // Selection
  selectLayer: (id, addToSelection = false) =>
    set((state) => {
      if (addToSelection) {
        const isSelected = state.selectedLayerIds.includes(id);
        return {
          selectedLayerIds: isSelected
            ? state.selectedLayerIds.filter((selectedId) => selectedId !== id)
            : [...state.selectedLayerIds, id],
        };
      }
      return { selectedLayerIds: [id] };
    }),

  deselectAll: () => set({ selectedLayerIds: [] }),

  // Undo/Redo
  pushHistory: () =>
    set((state) => {
      if (!state.project) return state;
      
      const newHistory = state.history.slice(0, state.historyIndex + 1);
      newHistory.push(JSON.parse(JSON.stringify(state.project)));
      
      return {
        history: newHistory.slice(-50), // Keep last 50 states
        historyIndex: Math.min(newHistory.length - 1, 49),
      };
    }),

  undo: () =>
    set((state) => {
      if (state.historyIndex <= 0) return state;
      
      const previousProject = state.history[state.historyIndex - 1];
      return {
        project: previousProject,
        layers: previousProject.layers,
        timeline: previousProject.timeline,
        historyIndex: state.historyIndex - 1,
      };
    }),

  redo: () =>
    set((state) => {
      if (state.historyIndex >= state.history.length - 1) return state;
      
      const nextProject = state.history[state.historyIndex + 1];
      return {
        project: nextProject,
        layers: nextProject.layers,
        timeline: nextProject.timeline,
        historyIndex: state.historyIndex + 1,
      };
    }),

  // Audio
  addAudioTrack: (track) =>
    set((state) => ({
      audioTracks: [
        ...state.audioTracks,
        {
          ...track,
          id: uuidv4(),
        } as AudioTrack,
      ],
    })),

  updateAudioTrack: (id, updates) =>
    set((state) => ({
      audioTracks: state.audioTracks.map((track) =>
        track.id === id ? { ...track, ...updates } : track
      ),
    })),

  deleteAudioTrack: (id) =>
    set((state) => ({
      audioTracks: state.audioTracks.filter((track) => track.id !== id),
    })),
}));
