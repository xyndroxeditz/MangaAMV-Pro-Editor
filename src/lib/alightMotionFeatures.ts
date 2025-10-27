/**
 * ALIGHT MOTION COMPLETE FEATURE SET
 * Every feature from Alight Motion mobile app
 */

// Vector Graphics System (Alight Motion's Core Feature)
export interface VectorLayer {
  id: string;
  type: 'shape' | 'text' | 'image' | 'solid' | 'group' | 'adjustment';
  name: string;
  properties: VectorProperties;
  effects: VectorEffect[];
  keyframes: VectorKeyframe[];
  children?: VectorLayer[];
  blendMode: BlendMode;
  opacity: number;
  locked: boolean;
  visible: boolean;
  solo: boolean;
  matte: MatteMode | null;
}

export interface VectorProperties {
  position: { x: number; y: number };
  scale: { x: number; y: number };
  rotation: number;
  anchorPoint: { x: number; y: number };
  skew: number;
  skewAxis: number;
}

export interface VectorKeyframe {
  time: number;
  property: string;
  value: any;
  easing: {
    type: 'linear' | 'bezier' | 'spring' | 'bounce' | 'elastic';
    inInfluence?: number;
    outInfluence?: number;
    inVelocity?: number;
    outVelocity?: number;
  };
  spatial?: boolean;
  spatialTangentIn?: { x: number; y: number };
  spatialTangentOut?: { x: number; y: number };
}

export interface VectorEffect {
  id: string;
  type: string;
  enabled: boolean;
  parameters: Record<string, any>;
}

export type BlendMode = 
  | 'normal' | 'multiply' | 'screen' | 'overlay' | 'soft-light' | 'hard-light'
  | 'color-dodge' | 'color-burn' | 'linear-dodge' | 'linear-burn' | 'vivid-light'
  | 'linear-light' | 'pin-light' | 'hard-mix' | 'difference' | 'exclusion'
  | 'subtract' | 'divide' | 'hue' | 'saturation' | 'color' | 'luminosity'
  | 'add' | 'lighten' | 'darken' | 'darker-color' | 'lighter-color';

export type MatteMode = 'alpha' | 'inverted-alpha' | 'luma' | 'inverted-luma';

// Shape Layer Properties (Alight Motion Shapes)
export interface ShapeLayer extends VectorLayer {
  type: 'shape';
  shapes: ShapeElement[];
}

export interface ShapeElement {
  id: string;
  type: 'rectangle' | 'ellipse' | 'polygon' | 'star' | 'path' | 'group';
  name: string;
  fill?: FillStyle;
  stroke?: StrokeStyle;
  transform?: ShapeTransform;
  animatable: boolean;
}

export interface FillStyle {
  enabled: boolean;
  color: string;
  opacity: number;
  fillRule: 'nonzero' | 'evenodd';
  gradient?: {
    type: 'linear' | 'radial';
    startPoint: { x: number; y: number };
    endPoint: { x: number; y: number };
    colors: Array<{ offset: number; color: string }>;
  };
}

export interface StrokeStyle {
  enabled: boolean;
  color: string;
  opacity: number;
  width: number;
  lineCap: 'butt' | 'round' | 'square';
  lineJoin: 'miter' | 'round' | 'bevel';
  miterLimit: number;
  dashArray?: number[];
  dashOffset: number;
}

export interface ShapeTransform {
  position: { x: number; y: number };
  scale: { x: number; y: number };
  rotation: number;
  skew: number;
  opacity: number;
}

// Path Properties (Bezier Paths)
export interface PathData {
  closed: boolean;
  points: PathPoint[];
}

export interface PathPoint {
  position: { x: number; y: number };
  inTangent: { x: number; y: number };
  outTangent: { x: number; y: number };
}

// Trim Paths (Alight Motion Signature Feature)
export interface TrimPath {
  start: number; // 0-100%
  end: number; // 0-100%
  offset: number; // 0-360 degrees
  trimMultipleShapes: 'individually' | 'simultaneously';
}

// Shape Operators (Alight Motion Path Operations)
export type ShapeOperator = 
  | 'merge' | 'add' | 'subtract' | 'intersect' | 'exclude-intersections'
  | 'offset-path' | 'pucker-bloat' | 'round-corners' | 'trim-paths'
  | 'twist' | 'zigzag' | 'repeater';

// Repeater (Alight Motion Clone Effect)
export interface Repeater {
  copies: number;
  offset: { x: number; y: number };
  scale: { x: number; y: number };
  rotation: number;
  startOpacity: number;
  endOpacity: number;
  compositeMode: 'above' | 'below';
  transform: 'relative' | 'absolute';
}

// Effects Library (Alight Motion Effects)
export const ALIGHT_MOTION_EFFECTS = {
  // Blur & Sharpen
  blur: [
    'Gaussian Blur', 'Motion Blur', 'Radial Blur', 'Zoom Blur',
    'Box Blur', 'Bilateral Blur', 'Smart Blur', 'Lens Blur',
    'Tilt-Shift', 'Iris Blur', 'Field Blur', 'Path Blur'
  ],
  sharpen: [
    'Sharpen', 'Unsharp Mask', 'Smart Sharpen', 'High Pass'
  ],
  
  // Color Correction
  colorCorrection: [
    'Hue/Saturation', 'Brightness/Contrast', 'Levels', 'Curves',
    'Color Balance', 'Vibrance', 'Exposure', 'Gamma', 'Tint',
    'Temperature', 'Threshold', 'Posterize', 'Solarize',
    'Gradient Map', 'Selective Color', 'Color Replace', 'Auto Levels',
    'Auto Contrast', 'Auto Color', 'Channel Mixer', 'Color Lookup'
  ],
  
  // Distort
  distort: [
    'Bulge', 'Pinch', 'Twirl', 'Wave', 'Ripple', 'Spherize',
    'Lens Distortion', 'Perspective', 'Skew', 'Transform',
    'Warp', 'Liquify', 'Displacement Map', 'Mesh Warp',
    'Puppet Warp', 'Corner Pin', 'Bezier Warp', 'Optics Compensation'
  ],
  
  // Generate
  generate: [
    'Fill', 'Gradient', 'Checkerboard', 'Grid', 'Fractal Noise',
    'Cell Pattern', 'Radio Waves', 'Ramp', 'Stroke', 'Vegas',
    'Write On', 'Advanced Lightning', 'Audio Spectrum', 'Audio Waveform',
    'Beam', 'Lens Flare', 'CC Light Rays', 'CC Light Burst'
  ],
  
  // Keying
  keying: [
    'Color Key', 'Luma Key', 'Difference Key', 'Extract',
    'Linear Color Key', 'Color Range', 'Keylight', 'Primatte',
    'Spill Suppressor', 'Advanced Spill Suppressor', 'Matte Choker'
  ],
  
  // Matte
  matte: [
    'Simple Choker', 'Matte Choker', 'Refine Soft Matte',
    'Refine Hard Matte', 'Refine Edge', 'Extract'
  ],
  
  // Noise & Grain
  noiseGrain: [
    'Add Grain', 'Remove Grain', 'Match Grain', 'Turbulent Noise',
    'Fractal Noise', 'Noise Alpha', 'Noise HLS', 'Noise HLS Auto',
    'Median', 'Reduce Interlace Flicker', 'Remove Grain'
  ],
  
  // Simulation
  simulation: [
    'Particle World', 'Particle Playground', 'CC Particle Systems',
    'CC Particle World', 'Foam', 'Card Dance', 'Caustics',
    'Shatter', 'Wave World', 'Fractal', 'CC Ball Action',
    'CC Bubbles', 'CC Drizzle', 'CC Hair', 'CC Mr. Mercury',
    'CC Pixel Polly', 'CC Rainfall', 'CC Scatterize', 'CC Snowfall',
    'CC Star Burst'
  ],
  
  // Stylize
  stylize: [
    'Glow', 'Color Emboss', 'Emboss', 'Find Edges', 'Mosaic',
    'Motion Tile', 'Posterize', 'Roughen Edges', 'Scatter',
    'Strobe Light', 'Texturize', 'Threshold', 'Cartoon',
    'CC Block Load', 'CC Burn Film', 'CC Glass', 'CC HexTile',
    'CC Kaleida', 'CC Mr. Smoothie', 'CC Plastic', 'CC RepeTile',
    'CC Threshold', 'CC Threshold RGB', 'CC Vignette', 'Leave Color',
    'Roughen Edges', 'Scatter', 'Strobe Light'
  ],
  
  // Time
  time: [
    'Echo', 'Posterize Time', 'Time Difference', 'Time Displacement',
    'Time Remap', 'Timewarp', 'CC Force Motion Blur', 'CC Time Blend',
    'CC Time Blend FX', 'CC Wide Time', 'Pixel Motion Blur'
  ],
  
  // Transition
  transition: [
    'Block Dissolve', 'Card Wipe', 'Gradient Wipe', 'Iris Wipe',
    'Linear Wipe', 'Radial Wipe', 'Venetian Blinds', 'CC Glass Wipe',
    'CC Grid Wipe', 'CC Image Wipe', 'CC Jaws', 'CC Light Wipe',
    'CC Line Sweep', 'CC Radial ScaleWipe', 'CC Scale Wipe',
    'CC Twister', 'CC WarpoMatic'
  ],
  
  // 3D Channel
  threeD: [
    'Depth Matte', 'Depth of Field', 'Fog 3D', 'ID Matte',
    'EXtractoR', 'IDentifier'
  ],
  
  // Perspective
  perspective: [
    '3D Camera Tracker', 'Basic 3D', 'Bevel Alpha', 'Bevel Edges',
    'Drop Shadow', 'Radial Shadow', 'CC Cylinder', 'CC Environment',
    'CC Sphere', 'CC Spotlight'
  ]
};

// Animation Presets (Alight Motion Signature)
export const ANIMATION_PRESETS = {
  text: [
    'Fade In', 'Fade Out', 'Slide In', 'Slide Out', 'Zoom In', 'Zoom Out',
    'Rotate In', 'Rotate Out', 'Typewriter', 'Tracking In', 'Tracking Out',
    'Scale Up', 'Scale Down', 'Blur In', 'Blur Out', 'Bounce', 'Elastic',
    'Wave', 'Wiggle', 'Skew', 'Perspective', '3D Rotate', 'Flip',
    'Split', 'Shuffle', 'Random', 'Cascade', 'Rise', 'Fall'
  ],
  
  shape: [
    'Draw On', 'Draw Off', 'Trim Path', 'Stroke Reveal', 'Fill Reveal',
    'Morph', 'Transform', 'Scale', 'Rotate', 'Position', 'Opacity',
    'Repeater', 'Offset Path', 'Wiggle Transform', 'Wiggle Path',
    'Round Corners', 'Pucker & Bloat', 'Twist', 'Zigzag', 'Merge Paths'
  ],
  
  camera: [
    'Pan', 'Zoom', 'Dolly', 'Truck', 'Pedestal', 'Tilt', 'Roll',
    'Orbit', 'Arc', 'Crane', 'Push In', 'Pull Out', 'Rack Focus',
    'Shake', 'Handheld', 'Smooth', 'Motion Blur', 'Depth of Field'
  ],
  
  layer: [
    'Fade In', 'Fade Out', 'Wipe', 'Slide', 'Push', 'Cover', 'Uncover',
    'Reveal', 'Iris', 'Clock Wipe', 'Flip', 'Cube', 'Sphere', 'Page Peel',
    'Fold', 'Glitch', 'RGB Split', 'Pixelate', 'Mosaic', 'Shatter'
  ]
};

// Keyframe Interpolation Types
export const INTERPOLATION_TYPES = [
  'Linear',
  'Bezier',
  'Bezier (Continuous)',
  'Bezier (Auto)',
  'Hold',
  'Spring',
  'Bounce',
  'Elastic',
  'Back',
  'Anticipate',
  'Overshoot'
];

// Graph Editor Presets
export const GRAPH_EDITOR_PRESETS = [
  { name: 'Linear', bezier: [0, 0, 1, 1] },
  { name: 'Ease', bezier: [0.25, 0.1, 0.25, 1] },
  { name: 'Ease In', bezier: [0.42, 0, 1, 1] },
  { name: 'Ease Out', bezier: [0, 0, 0.58, 1] },
  { name: 'Ease In Out', bezier: [0.42, 0, 0.58, 1] },
  { name: 'Ease In Back', bezier: [0.6, -0.28, 0.735, 0.045] },
  { name: 'Ease Out Back', bezier: [0.175, 0.885, 0.32, 1.275] },
  { name: 'Ease In Out Back', bezier: [0.68, -0.55, 0.265, 1.55] },
  { name: 'Ease In Cubic', bezier: [0.55, 0.055, 0.675, 0.19] },
  { name: 'Ease Out Cubic', bezier: [0.215, 0.61, 0.355, 1] },
  { name: 'Ease In Out Cubic', bezier: [0.645, 0.045, 0.355, 1] },
  { name: 'Ease In Circ', bezier: [0.6, 0.04, 0.98, 0.335] },
  { name: 'Ease Out Circ', bezier: [0.075, 0.82, 0.165, 1] },
  { name: 'Ease In Out Circ', bezier: [0.785, 0.135, 0.15, 0.86] },
  { name: 'Ease In Expo', bezier: [0.95, 0.05, 0.795, 0.035] },
  { name: 'Ease Out Expo', bezier: [0.19, 1, 0.22, 1] },
  { name: 'Ease In Out Expo', bezier: [1, 0, 0, 1] },
  { name: 'Ease In Quad', bezier: [0.55, 0.085, 0.68, 0.53] },
  { name: 'Ease Out Quad', bezier: [0.25, 0.46, 0.45, 0.94] },
  { name: 'Ease In Out Quad', bezier: [0.455, 0.03, 0.515, 0.955] },
  { name: 'Ease In Quart', bezier: [0.895, 0.03, 0.685, 0.22] },
  { name: 'Ease Out Quart', bezier: [0.165, 0.84, 0.44, 1] },
  { name: 'Ease In Out Quart', bezier: [0.77, 0, 0.175, 1] },
  { name: 'Ease In Quint', bezier: [0.755, 0.05, 0.855, 0.06] },
  { name: 'Ease Out Quint', bezier: [0.23, 1, 0.32, 1] },
  { name: 'Ease In Out Quint', bezier: [0.86, 0, 0.07, 1] },
  { name: 'Ease In Sine', bezier: [0.47, 0, 0.745, 0.715] },
  { name: 'Ease Out Sine', bezier: [0.39, 0.575, 0.565, 1] },
  { name: 'Ease In Out Sine', bezier: [0.445, 0.05, 0.55, 0.95] }
];

// Audio Features (Alight Motion Audio Reactive)
export interface AudioReactive {
  enabled: boolean;
  source: 'audio-layer' | 'master-audio';
  property: string;
  frequencyBand: 'bass' | 'mid-bass' | 'mid' | 'mid-high' | 'high' | 'all';
  frequencyRange: { min: number; max: number };
  sensitivity: number;
  smoothing: number;
  threshold: number;
  minValue: number;
  maxValue: number;
  invert: boolean;
  expression?: string;
}

// Expressions (Alight Motion Scripting)
export interface Expression {
  id: string;
  property: string;
  code: string;
  enabled: boolean;
  variables: Record<string, any>;
}

// Asset Library
export interface Asset {
  id: string;
  type: 'image' | 'video' | 'audio' | 'shape' | 'text' | 'comp';
  name: string;
  url: string;
  thumbnail: string;
  duration?: number;
  dimensions?: { width: number; height: number };
  metadata: Record<string, any>;
}

// Project Structure
export interface AlightMotionProject {
  version: string;
  name: string;
  width: number;
  height: number;
  frameRate: number;
  duration: number;
  backgroundColor: string;
  compositions: Composition[];
  assets: Asset[];
  settings: ProjectSettings;
}

export interface Composition {
  id: string;
  name: string;
  width: number;
  height: number;
  duration: number;
  frameRate: number;
  backgroundColor: string;
  layers: VectorLayer[];
  camera?: Camera3D;
  lights?: Light3D[];
}

export interface Camera3D {
  position: { x: number; y: number; z: number };
  pointOfInterest: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  zoom: number;
  focalLength: number;
  depthOfField: boolean;
  focusDistance: number;
  aperture: number;
  blurLevel: number;
}

export interface Light3D {
  type: 'ambient' | 'directional' | 'point' | 'spot';
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  color: string;
  intensity: number;
  castsShadows: boolean;
  shadowDarkness: number;
  shadowDiffusion: number;
}

export interface ProjectSettings {
  pixelAspect: number;
  frameBlending: boolean;
  motionBlur: boolean;
  motionBlurSamples: number;
  motionBlurShutterAngle: number;
  preserveFrameRate: boolean;
  preserveResolution: boolean;
  quality: 'draft' | 'preview' | 'best';
}

// Export class for Alight Motion feature implementations
export class AlightMotionEngine {
  project: AlightMotionProject;
  
  constructor() {
    this.project = this.createEmptyProject();
  }

  private createEmptyProject(): AlightMotionProject {
    return {
      version: '4.2.0',
      name: 'Untitled Project',
      width: 1920,
      height: 1080,
      frameRate: 60,
      duration: 10,
      backgroundColor: '#000000',
      compositions: [],
      assets: [],
      settings: {
        pixelAspect: 1.0,
        frameBlending: false,
        motionBlur: true,
        motionBlurSamples: 16,
        motionBlurShutterAngle: 180,
        preserveFrameRate: true,
        preserveResolution: true,
        quality: 'best'
      }
    };
  }

  /**
   * Create vector layer
   */
  createVectorLayer(type: VectorLayer['type'], name: string): VectorLayer {
    return {
      id: `layer_${Date.now()}_${Math.random()}`,
      type,
      name,
      properties: {
        position: { x: 0, y: 0 },
        scale: { x: 100, y: 100 },
        rotation: 0,
        anchorPoint: { x: 50, y: 50 },
        skew: 0,
        skewAxis: 0
      },
      effects: [],
      keyframes: [],
      blendMode: 'normal',
      opacity: 100,
      locked: false,
      visible: true,
      solo: false,
      matte: null
    };
  }

  /**
   * Add keyframe to layer property
   */
  addKeyframe(
    layer: VectorLayer,
    property: string,
    time: number,
    value: any,
    easingType: VectorKeyframe['easing']['type'] = 'linear'
  ): void {
    const keyframe: VectorKeyframe = {
      time,
      property,
      value,
      easing: { type: easingType }
    };
    layer.keyframes.push(keyframe);
    layer.keyframes.sort((a, b) => a.time - b.time);
  }

  /**
   * Apply effect to layer
   */
  applyEffect(layer: VectorLayer, effectType: string, parameters: Record<string, any> = {}): void {
    const effect: VectorEffect = {
      id: `effect_${Date.now()}_${Math.random()}`,
      type: effectType,
      enabled: true,
      parameters
    };
    layer.effects.push(effect);
  }

  /**
   * Create shape layer
   */
  createShapeLayer(shapeName: string): ShapeLayer {
    const layer = this.createVectorLayer('shape', shapeName) as ShapeLayer;
    layer.shapes = [];
    return layer;
  }

  /**
   * Add shape to shape layer
   */
  addShape(
    layer: ShapeLayer,
    shapeType: ShapeElement['type'],
    fill?: FillStyle,
    stroke?: StrokeStyle
  ): ShapeElement {
    const shape: ShapeElement = {
      id: `shape_${Date.now()}_${Math.random()}`,
      type: shapeType,
      name: shapeType.charAt(0).toUpperCase() + shapeType.slice(1),
      fill,
      stroke,
      animatable: true
    };
    layer.shapes.push(shape);
    return shape;
  }

  /**
   * Apply trim path to shape
   */
  applyTrimPath(shape: ShapeElement, start: number, end: number, offset: number = 0): TrimPath {
    return {
      start,
      end,
      offset,
      trimMultipleShapes: 'individually'
    };
  }

  /**
   * Create repeater effect
   */
  createRepeater(copies: number, offset: { x: number; y: number }): Repeater {
    return {
      copies,
      offset,
      scale: { x: 100, y: 100 },
      rotation: 0,
      startOpacity: 100,
      endOpacity: 100,
      compositeMode: 'above',
      transform: 'relative'
    };
  }

  /**
   * Setup audio reactive
   */
  setupAudioReactive(
    layer: VectorLayer,
    property: string,
    frequencyBand: AudioReactive['frequencyBand']
  ): AudioReactive {
    return {
      enabled: true,
      source: 'master-audio',
      property,
      frequencyBand,
      frequencyRange: { min: 20, max: 20000 },
      sensitivity: 1.0,
      smoothing: 0.5,
      threshold: 0.1,
      minValue: 0,
      maxValue: 100,
      invert: false
    };
  }

  /**
   * Export project to Alight Motion format
   */
  exportToAlightMotion(): string {
    return JSON.stringify(this.project, null, 2);
  }

  /**
   * Import from Alight Motion format
   */
  importFromAlightMotion(jsonData: string): void {
    this.project = JSON.parse(jsonData);
  }
}

export default AlightMotionEngine;
