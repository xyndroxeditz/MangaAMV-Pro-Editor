/**
 * Advanced Keyframe Animation System - CapCut Style
 * Position, scale, rotation, opacity with bezier curves
 */

export type EasingFunction = 
  | 'linear'
  | 'easeIn' | 'easeOut' | 'easeInOut'
  | 'easeInQuad' | 'easeOutQuad' | 'easeInOutQuad'
  | 'easeInCubic' | 'easeOutCubic' | 'easeInOutCubic'
  | 'easeInQuart' | 'easeOutQuart' | 'easeInOutQuart'
  | 'easeInQuint' | 'easeOutQuint' | 'easeInOutQuint'
  | 'easeInExpo' | 'easeOutExpo' | 'easeInOutExpo'
  | 'easeInCirc' | 'easeOutCirc' | 'easeInOutCirc'
  | 'easeInBack' | 'easeOutBack' | 'easeInOutBack'
  | 'easeInElastic' | 'easeOutElastic' | 'easeInOutElastic'
  | 'easeInBounce' | 'easeOutBounce' | 'easeInOutBounce';

export interface KeyframeProperty {
  time: number; // in seconds
  value: number | number[]; // single value or array for complex properties
  easing: EasingFunction;
  bezier?: {
    cp1x: number;
    cp1y: number;
    cp2x: number;
    cp2y: number;
  };
}

export interface AnimationTrack {
  property: 'x' | 'y' | 'scale' | 'scaleX' | 'scaleY' | 'rotation' | 'opacity' | 'blur' | 'saturation' | 'brightness';
  keyframes: KeyframeProperty[];
  enabled: boolean;
}

export interface AnimatableObject {
  id: string;
  name: string;
  tracks: AnimationTrack[];
  startTime: number;
  endTime: number;
}

export class KeyframeAnimationSystem {
  private objects: Map<string, AnimatableObject>;
  private currentTime: number = 0;

  constructor() {
    this.objects = new Map();
  }

  /**
   * Create animatable object
   */
  createObject(id: string, name: string, startTime: number, endTime: number): AnimatableObject {
    const obj: AnimatableObject = {
      id,
      name,
      tracks: [],
      startTime,
      endTime
    };
    this.objects.set(id, obj);
    return obj;
  }

  /**
   * Add animation track
   */
  addTrack(
    objectId: string,
    property: AnimationTrack['property']
  ): AnimationTrack {
    const obj = this.objects.get(objectId);
    if (!obj) throw new Error('Object not found');

    const track: AnimationTrack = {
      property,
      keyframes: [],
      enabled: true
    };
    obj.tracks.push(track);
    return track;
  }

  /**
   * Add keyframe to track
   */
  addKeyframe(
    objectId: string,
    property: AnimationTrack['property'],
    time: number,
    value: number | number[],
    easing: EasingFunction = 'linear'
  ): void {
    const obj = this.objects.get(objectId);
    if (!obj) throw new Error('Object not found');

    let track = obj.tracks.find(t => t.property === property);
    if (!track) {
      track = this.addTrack(objectId, property);
    }

    const keyframe: KeyframeProperty = {
      time,
      value,
      easing
    };

    // Insert keyframe in sorted order
    const index = track.keyframes.findIndex(k => k.time > time);
    if (index === -1) {
      track.keyframes.push(keyframe);
    } else {
      track.keyframes.splice(index, 0, keyframe);
    }
  }

  /**
   * Remove keyframe
   */
  removeKeyframe(objectId: string, property: AnimationTrack['property'], time: number): void {
    const obj = this.objects.get(objectId);
    if (!obj) return;

    const track = obj.tracks.find(t => t.property === property);
    if (!track) return;

    const index = track.keyframes.findIndex(k => Math.abs(k.time - time) < 0.01);
    if (index !== -1) {
      track.keyframes.splice(index, 1);
    }
  }

  /**
   * Update keyframe value
   */
  updateKeyframe(
    objectId: string,
    property: AnimationTrack['property'],
    time: number,
    newValue: number | number[]
  ): void {
    const obj = this.objects.get(objectId);
    if (!obj) return;

    const track = obj.tracks.find(t => t.property === property);
    if (!track) return;

    const keyframe = track.keyframes.find(k => Math.abs(k.time - time) < 0.01);
    if (keyframe) {
      keyframe.value = newValue;
    }
  }

  /**
   * Interpolate value at specific time
   */
  getValueAtTime(
    objectId: string,
    property: AnimationTrack['property'],
    time: number
  ): number | number[] | null {
    const obj = this.objects.get(objectId);
    if (!obj) return null;

    const track = obj.tracks.find(t => t.property === property && t.enabled);
    if (!track || track.keyframes.length === 0) return null;

    // Find surrounding keyframes
    let prevKeyframe: KeyframeProperty | null = null;
    let nextKeyframe: KeyframeProperty | null = null;

    for (let i = 0; i < track.keyframes.length; i++) {
      const kf = track.keyframes[i];
      if (kf.time <= time) {
        prevKeyframe = kf;
      }
      if (kf.time >= time) {
        nextKeyframe = kf;
        break;
      }
    }

    // No interpolation needed
    if (!prevKeyframe) return nextKeyframe?.value ?? null;
    if (!nextKeyframe) return prevKeyframe.value;
    if (prevKeyframe === nextKeyframe) return prevKeyframe.value;

    // Calculate interpolation progress
    const duration = nextKeyframe.time - prevKeyframe.time;
    const progress = (time - prevKeyframe.time) / duration;
    const easedProgress = this.applyEasing(progress, prevKeyframe.easing, prevKeyframe.bezier);

    // Interpolate value
    if (typeof prevKeyframe.value === 'number' && typeof nextKeyframe.value === 'number') {
      return this.lerp(prevKeyframe.value, nextKeyframe.value, easedProgress);
    } else if (Array.isArray(prevKeyframe.value) && Array.isArray(nextKeyframe.value)) {
      return prevKeyframe.value.map((v, i) => 
        this.lerp(v, nextKeyframe.value[i], easedProgress)
      );
    }

    return prevKeyframe.value;
  }

  /**
   * Get all animated values at specific time
   */
  getAnimatedValues(objectId: string, time: number): Record<string, number | number[]> {
    const obj = this.objects.get(objectId);
    if (!obj) return {};

    const values: Record<string, number | number[]> = {};
    
    for (const track of obj.tracks) {
      if (track.enabled) {
        const value = this.getValueAtTime(objectId, track.property, time);
        if (value !== null) {
          values[track.property] = value;
        }
      }
    }

    return values;
  }

  /**
   * Apply easing function
   */
  private applyEasing(
    t: number,
    easing: EasingFunction,
    bezier?: { cp1x: number; cp1y: number; cp2x: number; cp2y: number }
  ): number {
    if (bezier) {
      return this.cubicBezier(t, bezier.cp1x, bezier.cp1y, bezier.cp2x, bezier.cp2y);
    }

    switch (easing) {
      case 'linear':
        return t;
      
      // Quad
      case 'easeInQuad':
        return t * t;
      case 'easeOutQuad':
        return t * (2 - t);
      case 'easeInOutQuad':
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      
      // Cubic
      case 'easeInCubic':
        return t * t * t;
      case 'easeOutCubic':
        return (--t) * t * t + 1;
      case 'easeInOutCubic':
        return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
      
      // Quart
      case 'easeInQuart':
        return t * t * t * t;
      case 'easeOutQuart':
        return 1 - (--t) * t * t * t;
      case 'easeInOutQuart':
        return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t;
      
      // Quint
      case 'easeInQuint':
        return t * t * t * t * t;
      case 'easeOutQuint':
        return 1 + (--t) * t * t * t * t;
      case 'easeInOutQuint':
        return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t;
      
      // Expo
      case 'easeInExpo':
        return t === 0 ? 0 : Math.pow(2, 10 * (t - 1));
      case 'easeOutExpo':
        return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      case 'easeInOutExpo':
        if (t === 0 || t === 1) return t;
        return t < 0.5
          ? Math.pow(2, 20 * t - 10) / 2
          : (2 - Math.pow(2, -20 * t + 10)) / 2;
      
      // Circ
      case 'easeInCirc':
        return 1 - Math.sqrt(1 - t * t);
      case 'easeOutCirc':
        return Math.sqrt(1 - (--t) * t);
      case 'easeInOutCirc':
        return t < 0.5
          ? (1 - Math.sqrt(1 - 4 * t * t)) / 2
          : (Math.sqrt(1 - (-2 * t + 2) * (-2 * t + 2)) + 1) / 2;
      
      // Back
      case 'easeInBack':
        const c1 = 1.70158;
        return (c1 + 1) * t * t * t - c1 * t * t;
      case 'easeOutBack':
        const c2 = 1.70158;
        return 1 + (c2 + 1) * Math.pow(t - 1, 3) + c2 * Math.pow(t - 1, 2);
      case 'easeInOutBack':
        const c3 = 1.70158 * 1.525;
        return t < 0.5
          ? (Math.pow(2 * t, 2) * ((c3 + 1) * 2 * t - c3)) / 2
          : (Math.pow(2 * t - 2, 2) * ((c3 + 1) * (t * 2 - 2) + c3) + 2) / 2;
      
      // Elastic
      case 'easeInElastic':
        const c4 = (2 * Math.PI) / 3;
        return t === 0 ? 0 : t === 1 ? 1 : -Math.pow(2, 10 * t - 10) * Math.sin((t * 10 - 10.75) * c4);
      case 'easeOutElastic':
        const c5 = (2 * Math.PI) / 3;
        return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c5) + 1;
      case 'easeInOutElastic':
        const c6 = (2 * Math.PI) / 4.5;
        return t === 0 ? 0 : t === 1 ? 1 : t < 0.5
          ? -(Math.pow(2, 20 * t - 10) * Math.sin((20 * t - 11.125) * c6)) / 2
          : (Math.pow(2, -20 * t + 10) * Math.sin((20 * t - 11.125) * c6)) / 2 + 1;
      
      // Bounce
      case 'easeInBounce':
        return 1 - this.applyEasing(1 - t, 'easeOutBounce');
      case 'easeOutBounce':
        const n1 = 7.5625;
        const d1 = 2.75;
        if (t < 1 / d1) {
          return n1 * t * t;
        } else if (t < 2 / d1) {
          return n1 * (t -= 1.5 / d1) * t + 0.75;
        } else if (t < 2.5 / d1) {
          return n1 * (t -= 2.25 / d1) * t + 0.9375;
        } else {
          return n1 * (t -= 2.625 / d1) * t + 0.984375;
        }
      case 'easeInOutBounce':
        return t < 0.5
          ? (1 - this.applyEasing(1 - 2 * t, 'easeOutBounce')) / 2
          : (1 + this.applyEasing(2 * t - 1, 'easeOutBounce')) / 2;
      
      default:
        return t;
    }
  }

  /**
   * Cubic bezier interpolation
   */
  private cubicBezier(t: number, cp1x: number, cp1y: number, cp2x: number, cp2y: number): number {
    const cx = 3 * cp1x;
    const bx = 3 * (cp2x - cp1x) - cx;
    const ax = 1 - cx - bx;
    
    const cy = 3 * cp1y;
    const by = 3 * (cp2y - cp1y) - cy;
    const ay = 1 - cy - by;
    
    return ((ax * t + bx) * t + cx) * t;
  }

  /**
   * Linear interpolation
   */
  private lerp(a: number, b: number, t: number): number {
    return a + (b - a) * t;
  }

  /**
   * Copy keyframes from one property to another
   */
  copyKeyframes(
    sourceObjectId: string,
    sourceProperty: AnimationTrack['property'],
    targetObjectId: string,
    targetProperty: AnimationTrack['property']
  ): void {
    const sourceObj = this.objects.get(sourceObjectId);
    if (!sourceObj) return;

    const sourceTrack = sourceObj.tracks.find(t => t.property === sourceProperty);
    if (!sourceTrack) return;

    const targetObj = this.objects.get(targetObjectId);
    if (!targetObj) return;

    let targetTrack = targetObj.tracks.find(t => t.property === targetProperty);
    if (!targetTrack) {
      targetTrack = this.addTrack(targetObjectId, targetProperty);
    }

    targetTrack.keyframes = sourceTrack.keyframes.map(kf => ({ ...kf }));
  }

  /**
   * Apply animation preset
   */
  applyPreset(objectId: string, presetName: string): void {
    const presets: Record<string, Array<{ property: AnimationTrack['property']; keyframes: KeyframeProperty[] }>> = {
      fadeIn: [
        {
          property: 'opacity',
          keyframes: [
            { time: 0, value: 0, easing: 'linear' },
            { time: 1, value: 1, easing: 'easeOut' }
          ]
        }
      ],
      fadeOut: [
        {
          property: 'opacity',
          keyframes: [
            { time: 0, value: 1, easing: 'linear' },
            { time: 1, value: 0, easing: 'easeIn' }
          ]
        }
      ],
      slideInLeft: [
        {
          property: 'x',
          keyframes: [
            { time: 0, value: -100, easing: 'linear' },
            { time: 0.5, value: 0, easing: 'easeOutBack' }
          ]
        }
      ],
      zoomIn: [
        {
          property: 'scale',
          keyframes: [
            { time: 0, value: 0, easing: 'linear' },
            { time: 0.5, value: 1, easing: 'easeOutElastic' }
          ]
        },
        {
          property: 'opacity',
          keyframes: [
            { time: 0, value: 0, easing: 'linear' },
            { time: 0.5, value: 1, easing: 'easeOut' }
          ]
        }
      ],
      bounce: [
        {
          property: 'y',
          keyframes: [
            { time: 0, value: 0, easing: 'linear' },
            { time: 0.5, value: -50, easing: 'easeOutBounce' },
            { time: 1, value: 0, easing: 'easeOutBounce' }
          ]
        }
      ]
    };

    const preset = presets[presetName];
    if (!preset) return;

    for (const trackData of preset) {
      for (const kf of trackData.keyframes) {
        this.addKeyframe(objectId, trackData.property, kf.time, kf.value, kf.easing);
      }
    }
  }

  /**
   * Get all objects
   */
  getObjects(): Map<string, AnimatableObject> {
    return this.objects;
  }

  /**
   * Delete object
   */
  deleteObject(objectId: string): void {
    this.objects.delete(objectId);
  }

  /**
   * Set current time
   */
  setCurrentTime(time: number): void {
    this.currentTime = time;
  }

  /**
   * Get current time
   */
  getCurrentTime(): number {
    return this.currentTime;
  }
}

export default KeyframeAnimationSystem;
