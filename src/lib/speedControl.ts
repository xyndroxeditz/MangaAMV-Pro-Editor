/**
 * Advanced Speed Control & Time Remapping - CapCut Style
 * Speed curves, freeze frames, reverse, slow-mo, time warp
 */

export interface SpeedKeyframe {
  time: number; // seconds
  speed: number; // 0.1x to 100x (0.1 = 10% speed, 10 = 1000% speed)
  easing: 'linear' | 'ease' | 'easeIn' | 'easeOut' | 'easeInOut';
}

export interface TimeRemapCurve {
  keyframes: SpeedKeyframe[];
  enabled: boolean;
}

export interface SpeedPreset {
  name: string;
  description: string;
  curve: SpeedKeyframe[];
  popular?: boolean;
}

// Popular speed presets
export const SPEED_PRESETS: SpeedPreset[] = [
  {
    name: 'Slow Motion',
    description: '0.5x speed throughout',
    curve: [
      { time: 0, speed: 0.5, easing: 'linear' }
    ],
    popular: true
  },
  {
    name: 'Fast Forward',
    description: '2x speed throughout',
    curve: [
      { time: 0, speed: 2, easing: 'linear' }
    ],
    popular: true
  },
  {
    name: 'Hyper Speed',
    description: '5x speed for quick transitions',
    curve: [
      { time: 0, speed: 5, easing: 'linear' }
    ]
  },
  {
    name: 'Freeze Frame',
    description: 'Freeze at midpoint',
    curve: [
      { time: 0, speed: 1, easing: 'linear' },
      { time: 0.5, speed: 0, easing: 'ease' },
      { time: 0.5, speed: 1, easing: 'ease' }
    ],
    popular: true
  },
  {
    name: 'Speed Ramp',
    description: 'Gradual slow-mo to normal',
    curve: [
      { time: 0, speed: 0.25, easing: 'linear' },
      { time: 0.5, speed: 1, easing: 'easeOut' }
    ],
    popular: true
  },
  {
    name: 'Bullet Time',
    description: 'Normal → Super Slow → Normal',
    curve: [
      { time: 0, speed: 1, easing: 'easeOut' },
      { time: 0.3, speed: 0.1, easing: 'easeInOut' },
      { time: 0.7, speed: 0.1, easing: 'easeIn' },
      { time: 1, speed: 1, easing: 'linear' }
    ],
    popular: true
  },
  {
    name: 'Action Burst',
    description: 'Slow → Fast → Slow',
    curve: [
      { time: 0, speed: 0.5, easing: 'easeOut' },
      { time: 0.5, speed: 3, easing: 'easeInOut' },
      { time: 1, speed: 0.5, easing: 'easeIn' }
    ]
  },
  {
    name: 'Jump Cut',
    description: 'Fast cuts with freezes',
    curve: [
      { time: 0, speed: 2, easing: 'linear' },
      { time: 0.25, speed: 0, easing: 'linear' },
      { time: 0.25, speed: 2, easing: 'linear' },
      { time: 0.5, speed: 0, easing: 'linear' },
      { time: 0.5, speed: 2, easing: 'linear' },
      { time: 0.75, speed: 0, easing: 'linear' },
      { time: 0.75, speed: 2, easing: 'linear' }
    ]
  },
  {
    name: 'Epic Buildup',
    description: 'Gradual speed increase for impact',
    curve: [
      { time: 0, speed: 0.3, easing: 'linear' },
      { time: 0.8, speed: 0.5, easing: 'easeIn' },
      { time: 1, speed: 2, easing: 'easeInOut' }
    ]
  },
  {
    name: 'Rewind Effect',
    description: 'Play backwards',
    curve: [
      { time: 0, speed: -1, easing: 'linear' }
    ]
  }
];

export class SpeedControlSystem {
  private curves: Map<string, TimeRemapCurve>;

  constructor() {
    this.curves = new Map();
  }

  /**
   * Create time remap curve for clip
   */
  createCurve(clipId: string): TimeRemapCurve {
    const curve: TimeRemapCurve = {
      keyframes: [{ time: 0, speed: 1, easing: 'linear' }],
      enabled: true
    };
    this.curves.set(clipId, curve);
    return curve;
  }

  /**
   * Add speed keyframe
   */
  addKeyframe(clipId: string, time: number, speed: number, easing: SpeedKeyframe['easing'] = 'linear'): void {
    let curve = this.curves.get(clipId);
    if (!curve) {
      curve = this.createCurve(clipId);
    }

    const keyframe: SpeedKeyframe = { time, speed, easing };

    // Insert in sorted order
    const index = curve.keyframes.findIndex(kf => kf.time > time);
    if (index === -1) {
      curve.keyframes.push(keyframe);
    } else {
      curve.keyframes.splice(index, 0, keyframe);
    }
  }

  /**
   * Remove keyframe
   */
  removeKeyframe(clipId: string, time: number): void {
    const curve = this.curves.get(clipId);
    if (!curve) return;

    const index = curve.keyframes.findIndex(kf => Math.abs(kf.time - time) < 0.01);
    if (index !== -1 && curve.keyframes.length > 1) {
      curve.keyframes.splice(index, 1);
    }
  }

  /**
   * Update keyframe speed
   */
  updateKeyframe(clipId: string, time: number, newSpeed: number): void {
    const curve = this.curves.get(clipId);
    if (!curve) return;

    const keyframe = curve.keyframes.find(kf => Math.abs(kf.time - time) < 0.01);
    if (keyframe) {
      keyframe.speed = newSpeed;
    }
  }

  /**
   * Get speed at specific time (normalized 0-1)
   */
  getSpeedAtTime(clipId: string, normalizedTime: number): number {
    const curve = this.curves.get(clipId);
    if (!curve || !curve.enabled || curve.keyframes.length === 0) {
      return 1;
    }

    // Find surrounding keyframes
    let prevKeyframe: SpeedKeyframe | null = null;
    let nextKeyframe: SpeedKeyframe | null = null;

    for (let i = 0; i < curve.keyframes.length; i++) {
      const kf = curve.keyframes[i];
      if (kf.time <= normalizedTime) {
        prevKeyframe = kf;
      }
      if (kf.time >= normalizedTime) {
        nextKeyframe = kf;
        break;
      }
    }

    // No interpolation needed
    if (!prevKeyframe) return nextKeyframe?.speed ?? 1;
    if (!nextKeyframe) return prevKeyframe.speed;
    if (prevKeyframe === nextKeyframe) return prevKeyframe.speed;

    // Interpolate speed
    const duration = nextKeyframe.time - prevKeyframe.time;
    const progress = (normalizedTime - prevKeyframe.time) / duration;
    const easedProgress = this.applyEasing(progress, prevKeyframe.easing);

    return this.lerp(prevKeyframe.speed, nextKeyframe.speed, easedProgress);
  }

  /**
   * Apply easing function
   */
  private applyEasing(t: number, easing: SpeedKeyframe['easing']): number {
    switch (easing) {
      case 'linear':
        return t;
      case 'ease':
        return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      case 'easeIn':
        return t * t;
      case 'easeOut':
        return 1 - (1 - t) * (1 - t);
      case 'easeInOut':
        return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      default:
        return t;
    }
  }

  /**
   * Linear interpolation
   */
  private lerp(a: number, b: number, t: number): number {
    return a + (b - a) * t;
  }

  /**
   * Apply speed preset
   */
  applyPreset(clipId: string, presetName: string): void {
    const preset = SPEED_PRESETS.find(p => p.name === presetName);
    if (!preset) return;

    const curve: TimeRemapCurve = {
      keyframes: preset.curve.map(kf => ({ ...kf })),
      enabled: true
    };
    this.curves.set(clipId, curve);
  }

  /**
   * Set constant speed
   */
  setConstantSpeed(clipId: string, speed: number): void {
    const curve: TimeRemapCurve = {
      keyframes: [{ time: 0, speed, easing: 'linear' }],
      enabled: true
    };
    this.curves.set(clipId, curve);
  }

  /**
   * Reverse clip
   */
  reverse(clipId: string): void {
    this.setConstantSpeed(clipId, -1);
  }

  /**
   * Create freeze frame at time
   */
  addFreezeFrame(clipId: string, startTime: number, duration: number): void {
    let curve = this.curves.get(clipId);
    if (!curve) {
      curve = this.createCurve(clipId);
    }

    // Add freeze keyframes
    this.addKeyframe(clipId, startTime, 1, 'linear');
    this.addKeyframe(clipId, startTime, 0, 'linear');
    this.addKeyframe(clipId, startTime + duration, 0, 'linear');
    this.addKeyframe(clipId, startTime + duration, 1, 'linear');
  }

  /**
   * Calculate new duration after speed changes
   */
  calculateNewDuration(clipId: string, originalDuration: number, samples: number = 100): number {
    const curve = this.curves.get(clipId);
    if (!curve || !curve.enabled) {
      return originalDuration;
    }

    let totalTime = 0;
    const step = 1 / samples;

    for (let i = 0; i < samples; i++) {
      const normalizedTime = i * step;
      const speed = this.getSpeedAtTime(clipId, normalizedTime);
      
      // Avoid division by zero for freeze frames
      if (speed !== 0) {
        totalTime += (originalDuration * step) / Math.abs(speed);
      } else {
        // Freeze frames don't consume source time
        totalTime += originalDuration * step;
      }
    }

    return totalTime;
  }

  /**
   * Map playback time to source time
   */
  mapPlaybackToSource(clipId: string, playbackTime: number, originalDuration: number): number {
    const curve = this.curves.get(clipId);
    if (!curve || !curve.enabled) {
      return playbackTime;
    }

    let sourceTime = 0;
    const samples = 1000;
    const targetTime = playbackTime;
    let currentTime = 0;

    for (let i = 0; i < samples && currentTime < targetTime; i++) {
      const normalizedTime = sourceTime / originalDuration;
      const speed = this.getSpeedAtTime(clipId, normalizedTime);
      
      const step = originalDuration / samples;
      if (speed !== 0) {
        currentTime += step / Math.abs(speed);
        sourceTime += step * Math.sign(speed);
      } else {
        currentTime += step;
      }
    }

    return Math.max(0, Math.min(originalDuration, sourceTime));
  }

  /**
   * Create smooth speed transition
   */
  createSpeedRamp(
    clipId: string,
    startTime: number,
    startSpeed: number,
    endTime: number,
    endSpeed: number,
    easing: SpeedKeyframe['easing'] = 'easeInOut'
  ): void {
    this.addKeyframe(clipId, startTime, startSpeed, 'linear');
    this.addKeyframe(clipId, endTime, endSpeed, easing);
  }

  /**
   * Enable/disable speed curve
   */
  setCurveEnabled(clipId: string, enabled: boolean): void {
    const curve = this.curves.get(clipId);
    if (curve) {
      curve.enabled = enabled;
    }
  }

  /**
   * Get curve for clip
   */
  getCurve(clipId: string): TimeRemapCurve | undefined {
    return this.curves.get(clipId);
  }

  /**
   * Clear all keyframes
   */
  clearCurve(clipId: string): void {
    const curve = this.curves.get(clipId);
    if (curve) {
      curve.keyframes = [{ time: 0, speed: 1, easing: 'linear' }];
    }
  }

  /**
   * Delete curve
   */
  deleteCurve(clipId: string): void {
    this.curves.delete(clipId);
  }

  /**
   * Export curve data
   */
  exportCurve(clipId: string): TimeRemapCurve | null {
    const curve = this.curves.get(clipId);
    return curve ? { ...curve, keyframes: [...curve.keyframes] } : null;
  }

  /**
   * Import curve data
   */
  importCurve(clipId: string, data: TimeRemapCurve): void {
    this.curves.set(clipId, {
      keyframes: data.keyframes.map(kf => ({ ...kf })),
      enabled: data.enabled
    });
  }

  /**
   * Get all presets
   */
  getPresets(): SpeedPreset[] {
    return [...SPEED_PRESETS];
  }

  /**
   * Get popular presets
   */
  getPopularPresets(): SpeedPreset[] {
    return SPEED_PRESETS.filter(p => p.popular);
  }
}

export default SpeedControlSystem;
