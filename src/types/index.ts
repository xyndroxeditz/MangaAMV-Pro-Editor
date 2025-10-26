// Layer Types
export enum LayerType {
  VIDEO = 'video',
  IMAGE = 'image',
  MANGA_PANEL = 'manga_panel',
  AUDIO = 'audio',
  TEXT = 'text',
  SHAPE = 'shape',
  MODEL_3D = '3d_model',
  EFFECT = 'effect',
}

// Blend Modes
export enum BlendMode {
  NORMAL = 'normal',
  MULTIPLY = 'multiply',
  SCREEN = 'screen',
  OVERLAY = 'overlay',
  DARKEN = 'darken',
  LIGHTEN = 'lighten',
  COLOR_DODGE = 'color_dodge',
  COLOR_BURN = 'color_burn',
  HARD_LIGHT = 'hard_light',
  SOFT_LIGHT = 'soft_light',
  DIFFERENCE = 'difference',
  EXCLUSION = 'exclusion',
  ADD = 'add',
  SUBTRACT = 'subtract',
}

// Layer Interface
export interface Layer {
  id: string;
  name: string;
  type: LayerType;
  trackIndex: number;
  startTime: number;
  duration: number;
  visible: boolean;
  locked: boolean;
  transform: Transform;
  effects: Effect[];
  blendMode: BlendMode;
  opacity: number;
  source?: string;
  children?: string[];
  parentId?: string;
}

// Transform Interface
export interface Transform {
  x: number;
  y: number;
  z: number;
  scaleX: number;
  scaleY: number;
  scaleZ: number;
  rotationX: number;
  rotationY: number;
  rotationZ: number;
  anchorX: number;
  anchorY: number;
  skewX: number;
  skewY: number;
}

// Effect Interface
export interface Effect {
  id: string;
  name: string;
  category: EffectCategory;
  enabled: boolean;
  parameters: Record<string, any>;
  keyframes?: Keyframe[];
}

// Effect Categories
export enum EffectCategory {
  MANGA_PANEL = 'manga_panel',
  TRANSITION = 'transition',
  COLOR = 'color',
  BLUR = 'blur',
  DISTORTION = 'distortion',
  GLITCH = 'glitch',
  TEXT_EFFECT = 'text_effect',
  SPEED = 'speed',
  PARTICLE = 'particle',
  THREE_D = '3d',
  AUDIO = 'audio',
}

// Keyframe Interface
export interface Keyframe {
  time: number;
  value: any;
  easing: EasingType;
}

// Easing Types
export enum EasingType {
  LINEAR = 'linear',
  EASE_IN = 'ease_in',
  EASE_OUT = 'ease_out',
  EASE_IN_OUT = 'ease_in_out',
  CUBIC_BEZIER = 'cubic_bezier',
}

// Timeline State
export interface TimelineState {
  currentTime: number;
  duration: number;
  zoom: number;
  bpm: number;
  isPlaying: boolean;
  loop: boolean;
  selectedLayerIds: string[];
}

// Project Interface
export interface Project {
  id: string;
  name: string;
  createdAt: Date;
  modifiedAt: Date;
  duration: number;
  fps: number;
  width: number;
  height: number;
  layers: Layer[];
  timeline: TimelineState;
  audioTracks: AudioTrack[];
}

// Audio Track
export interface AudioTrack {
  id: string;
  name: string;
  source: string;
  volume: number;
  startTime: number;
  duration: number;
  waveform?: number[];
  bpm?: number;
}

// 3D Model
export interface Model3D {
  id: string;
  name: string;
  source: string;
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  scale: { x: number; y: number; z: number };
  material?: Material3D;
}

// 3D Material
export interface Material3D {
  color: string;
  metalness: number;
  roughness: number;
  emissive: string;
  emissiveIntensity: number;
}

// Camera
export interface Camera {
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  fov: number;
  near: number;
  far: number;
}

// Export Settings
export interface ExportSettings {
  preset: 'draft' | 'hd' | '4k' | 'vertical' | 'custom';
  width: number;
  height: number;
  fps: number;
  bitrate: string;
  codec: 'h264' | 'h265' | 'vp9';
  format: 'mp4' | 'mov' | 'webm';
  aiUpscale: boolean;
}

// XML Project (Alight Motion Compatible)
export interface XMLProject {
  version: string;
  width: number;
  height: number;
  fps: number;
  duration: number;
  layers: XMLLayer[];
}

export interface XMLLayer {
  type: string;
  name: string;
  startTime: number;
  duration: number;
  properties: Record<string, any>;
  effects: XMLEffect[];
}

export interface XMLEffect {
  name: string;
  parameters: Record<string, any>;
}
