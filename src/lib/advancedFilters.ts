/**
 * Advanced Filters & Adjustments - CapCut Style
 * HSL, RGB curves, temperature, vignette, grain, chromatic aberration
 */

export interface FilterAdjustment {
  // Basic adjustments
  brightness: number; // -100 to 100
  contrast: number; // -100 to 100
  saturation: number; // -100 to 100
  exposure: number; // -100 to 100
  temperature: number; // -100 (cool) to 100 (warm)
  tint: number; // -100 (green) to 100 (magenta)
  
  // Advanced adjustments
  highlights: number; // -100 to 100
  shadows: number; // -100 to 100
  whites: number; // -100 to 100
  blacks: number; // -100 to 100
  clarity: number; // 0 to 100
  vibrance: number; // -100 to 100
  
  // HSL adjustments
  hue: number; // -180 to 180
  
  // Color grading
  colorGrading: {
    shadows: { r: number; g: number; b: number };
    midtones: { r: number; g: number; b: number };
    highlights: { r: number; g: number; b: number };
  };
  
  // Effects
  vignette: number; // 0 to 100
  vignetteFeather: number; // 0 to 100
  grain: number; // 0 to 100
  sharpen: number; // 0 to 100
  blur: number; // 0 to 100
  
  // Chromatic aberration
  chromaticAberration: number; // 0 to 100
  
  // Lens distortion
  distortion: number; // -100 to 100
}

export interface LUT {
  id: string;
  name: string;
  category: 'cinematic' | 'vintage' | 'anime' | 'dark' | 'bright' | 'cool' | 'warm';
  data: Uint8Array;
  intensity: number; // 0 to 1
  thumbnail: string;
  popular?: boolean;
}

// CapCut-style preset filters
export const PRESET_FILTERS: Record<string, Partial<FilterAdjustment>> = {
  vivid: {
    saturation: 30,
    vibrance: 20,
    contrast: 10,
    clarity: 15
  },
  dramatic: {
    contrast: 40,
    highlights: -20,
    shadows: -30,
    blacks: -20,
    clarity: 30
  },
  vintage: {
    temperature: 15,
    saturation: -20,
    grain: 25,
    vignette: 40
  },
  anime: {
    saturation: 40,
    vibrance: 30,
    contrast: 15,
    sharpen: 20,
    colorGrading: {
      shadows: { r: 0, g: -5, b: -10 },
      midtones: { r: 5, g: 0, b: 5 },
      highlights: { r: 10, g: 5, b: 0 }
    }
  },
  cool: {
    temperature: -40,
    tint: -10,
    saturation: 10
  },
  warm: {
    temperature: 40,
    tint: 10,
    saturation: 10
  },
  noir: {
    saturation: -100,
    contrast: 50,
    highlights: -10,
    shadows: -20,
    vignette: 50
  },
  neon: {
    saturation: 60,
    vibrance: 40,
    contrast: 30,
    clarity: 25,
    chromaticAberration: 15
  }
};

export class AdvancedFilterEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private imageData: ImageData | null = null;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { willReadFrequently: true })!;
  }

  /**
   * Apply all adjustments to image
   */
  applyAdjustments(sourceCanvas: HTMLCanvasElement, adjustments: Partial<FilterAdjustment>): void {
    this.ctx.drawImage(sourceCanvas, 0, 0);
    this.imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    
    const data = this.imageData.data;
    
    // Apply adjustments in order
    if (adjustments.temperature !== undefined && adjustments.temperature !== 0) {
      this.adjustTemperature(data, adjustments.temperature);
    }
    if (adjustments.tint !== undefined && adjustments.tint !== 0) {
      this.adjustTint(data, adjustments.tint);
    }
    if (adjustments.exposure !== undefined && adjustments.exposure !== 0) {
      this.adjustExposure(data, adjustments.exposure);
    }
    if (adjustments.brightness !== undefined && adjustments.brightness !== 0) {
      this.adjustBrightness(data, adjustments.brightness);
    }
    if (adjustments.contrast !== undefined && adjustments.contrast !== 0) {
      this.adjustContrast(data, adjustments.contrast);
    }
    if (adjustments.saturation !== undefined && adjustments.saturation !== 0) {
      this.adjustSaturation(data, adjustments.saturation);
    }
    if (adjustments.vibrance !== undefined && adjustments.vibrance !== 0) {
      this.adjustVibrance(data, adjustments.vibrance);
    }
    if (adjustments.highlights !== undefined && adjustments.highlights !== 0) {
      this.adjustHighlights(data, adjustments.highlights);
    }
    if (adjustments.shadows !== undefined && adjustments.shadows !== 0) {
      this.adjustShadows(data, adjustments.shadows);
    }
    if (adjustments.hue !== undefined && adjustments.hue !== 0) {
      this.adjustHue(data, adjustments.hue);
    }
    if (adjustments.colorGrading) {
      this.applyColorGrading(data, adjustments.colorGrading);
    }
    if (adjustments.sharpen !== undefined && adjustments.sharpen > 0) {
      this.applySharpen(adjustments.sharpen);
    }
    if (adjustments.grain !== undefined && adjustments.grain > 0) {
      this.applyGrain(data, adjustments.grain);
    }
    if (adjustments.chromaticAberration !== undefined && adjustments.chromaticAberration > 0) {
      this.applyChromaticAberration(adjustments.chromaticAberration);
    }
    if (adjustments.vignette !== undefined && adjustments.vignette > 0) {
      this.applyVignette(data, adjustments.vignette, adjustments.vignetteFeather || 50);
    }
    
    this.ctx.putImageData(this.imageData, 0, 0);
  }

  /**
   * Adjust temperature (cool/warm)
   */
  private adjustTemperature(data: Uint8ClampedArray, value: number): void {
    const factor = value / 100;
    for (let i = 0; i < data.length; i += 4) {
      if (factor > 0) {
        // Warm
        data[i] = Math.min(255, data[i] + factor * 30); // More red
        data[i + 2] = Math.max(0, data[i + 2] - factor * 30); // Less blue
      } else {
        // Cool
        data[i] = Math.max(0, data[i] + factor * 30); // Less red
        data[i + 2] = Math.min(255, data[i + 2] - factor * 30); // More blue
      }
    }
  }

  /**
   * Adjust tint (green/magenta)
   */
  private adjustTint(data: Uint8ClampedArray, value: number): void {
    const factor = value / 100;
    for (let i = 0; i < data.length; i += 4) {
      if (factor > 0) {
        // Magenta
        data[i] = Math.min(255, data[i] + factor * 20); // More red
        data[i + 2] = Math.min(255, data[i + 2] + factor * 20); // More blue
        data[i + 1] = Math.max(0, data[i + 1] - factor * 20); // Less green
      } else {
        // Green
        data[i + 1] = Math.min(255, data[i + 1] - factor * 40); // More green
      }
    }
  }

  /**
   * Adjust exposure
   */
  private adjustExposure(data: Uint8ClampedArray, value: number): void {
    const multiplier = Math.pow(2, value / 100);
    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.min(255, data[i] * multiplier);
      data[i + 1] = Math.min(255, data[i + 1] * multiplier);
      data[i + 2] = Math.min(255, data[i + 2] * multiplier);
    }
  }

  /**
   * Adjust brightness
   */
  private adjustBrightness(data: Uint8ClampedArray, value: number): void {
    const adjustment = (value / 100) * 255;
    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.max(0, Math.min(255, data[i] + adjustment));
      data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + adjustment));
      data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + adjustment));
    }
  }

  /**
   * Adjust contrast
   */
  private adjustContrast(data: Uint8ClampedArray, value: number): void {
    const factor = (259 * (value + 255)) / (255 * (259 - value));
    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.max(0, Math.min(255, factor * (data[i] - 128) + 128));
      data[i + 1] = Math.max(0, Math.min(255, factor * (data[i + 1] - 128) + 128));
      data[i + 2] = Math.max(0, Math.min(255, factor * (data[i + 2] - 128) + 128));
    }
  }

  /**
   * Adjust saturation
   */
  private adjustSaturation(data: Uint8ClampedArray, value: number): void {
    const factor = (value + 100) / 100;
    for (let i = 0; i < data.length; i += 4) {
      const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      data[i] = Math.max(0, Math.min(255, gray + factor * (data[i] - gray)));
      data[i + 1] = Math.max(0, Math.min(255, gray + factor * (data[i + 1] - gray)));
      data[i + 2] = Math.max(0, Math.min(255, gray + factor * (data[i + 2] - gray)));
    }
  }

  /**
   * Adjust vibrance (smart saturation)
   */
  private adjustVibrance(data: Uint8ClampedArray, value: number): void {
    const factor = value / 100;
    for (let i = 0; i < data.length; i += 4) {
      const max = Math.max(data[i], data[i + 1], data[i + 2]);
      const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
      const amt = ((Math.abs(max - avg) * 2 / 255) * factor) / 2;
      
      if (data[i] !== max) data[i] += (max - data[i]) * amt;
      if (data[i + 1] !== max) data[i + 1] += (max - data[i + 1]) * amt;
      if (data[i + 2] !== max) data[i + 2] += (max - data[i + 2]) * amt;
    }
  }

  /**
   * Adjust highlights
   */
  private adjustHighlights(data: Uint8ClampedArray, value: number): void {
    const factor = value / 100;
    for (let i = 0; i < data.length; i += 4) {
      const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
      if (brightness > 128) {
        const weight = (brightness - 128) / 127;
        data[i] += factor * weight * 30;
        data[i + 1] += factor * weight * 30;
        data[i + 2] += factor * weight * 30;
      }
    }
  }

  /**
   * Adjust shadows
   */
  private adjustShadows(data: Uint8ClampedArray, value: number): void {
    const factor = value / 100;
    for (let i = 0; i < data.length; i += 4) {
      const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
      if (brightness < 128) {
        const weight = (128 - brightness) / 128;
        data[i] += factor * weight * 30;
        data[i + 1] += factor * weight * 30;
        data[i + 2] += factor * weight * 30;
      }
    }
  }

  /**
   * Adjust hue
   */
  private adjustHue(data: Uint8ClampedArray, value: number): void {
    const angle = (value / 180) * Math.PI;
    const cosA = Math.cos(angle);
    const sinA = Math.sin(angle);
    
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      data[i] = Math.max(0, Math.min(255, 
        r * (0.299 + 0.701 * cosA + 0.168 * sinA) +
        g * (0.587 - 0.587 * cosA + 0.330 * sinA) +
        b * (0.114 - 0.114 * cosA - 0.497 * sinA)
      ));
      
      data[i + 1] = Math.max(0, Math.min(255,
        r * (0.299 - 0.299 * cosA - 0.328 * sinA) +
        g * (0.587 + 0.413 * cosA + 0.035 * sinA) +
        b * (0.114 - 0.114 * cosA + 0.292 * sinA)
      ));
      
      data[i + 2] = Math.max(0, Math.min(255,
        r * (0.299 - 0.300 * cosA + 1.250 * sinA) +
        g * (0.587 - 0.588 * cosA - 1.050 * sinA) +
        b * (0.114 + 0.886 * cosA - 0.203 * sinA)
      ));
    }
  }

  /**
   * Apply color grading
   */
  private applyColorGrading(
    data: Uint8ClampedArray,
    grading: { shadows: any; midtones: any; highlights: any }
  ): void {
    for (let i = 0; i < data.length; i += 4) {
      const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
      
      let weight = { shadows: 0, midtones: 0, highlights: 0 };
      
      if (brightness < 85) {
        weight.shadows = 1 - brightness / 85;
      } else if (brightness < 170) {
        weight.midtones = 1 - Math.abs(brightness - 127.5) / 85;
      } else {
        weight.highlights = (brightness - 170) / 85;
      }
      
      data[i] += grading.shadows.r * weight.shadows + 
                 grading.midtones.r * weight.midtones + 
                 grading.highlights.r * weight.highlights;
                 
      data[i + 1] += grading.shadows.g * weight.shadows + 
                     grading.midtones.g * weight.midtones + 
                     grading.highlights.g * weight.highlights;
                     
      data[i + 2] += grading.shadows.b * weight.shadows + 
                     grading.midtones.b * weight.midtones + 
                     grading.highlights.b * weight.highlights;
    }
  }

  /**
   * Apply sharpen effect
   */
  private applySharpen(amount: number): void {
    if (!this.imageData) return;
    
    const kernel = [
      0, -1, 0,
      -1, 5 + (amount / 25), -1,
      0, -1, 0
    ];
    
    this.applyConvolution(kernel);
  }

  /**
   * Apply grain effect
   */
  private applyGrain(data: Uint8ClampedArray, amount: number): void {
    const intensity = amount / 100;
    for (let i = 0; i < data.length; i += 4) {
      const noise = (Math.random() - 0.5) * intensity * 50;
      data[i] = Math.max(0, Math.min(255, data[i] + noise));
      data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise));
      data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise));
    }
  }

  /**
   * Apply vignette effect
   */
  private applyVignette(data: Uint8ClampedArray, amount: number, feather: number): void {
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    const maxDist = Math.sqrt(centerX * centerX + centerY * centerY);
    const intensity = amount / 100;
    const soft = feather / 100;
    
    for (let y = 0; y < this.canvas.height; y++) {
      for (let x = 0; x < this.canvas.width; x++) {
        const i = (y * this.canvas.width + x) * 4;
        const dx = x - centerX;
        const dy = y - centerY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const vignette = Math.pow(Math.cos((dist / maxDist) * Math.PI / 2 * (1 + soft)), intensity * 3);
        
        data[i] *= vignette;
        data[i + 1] *= vignette;
        data[i + 2] *= vignette;
      }
    }
  }

  /**
   * Apply chromatic aberration
   */
  private applyChromaticAberration(amount: number): void {
    if (!this.imageData) return;
    
    const offset = (amount / 100) * 10;
    const original = new Uint8ClampedArray(this.imageData.data);
    
    for (let y = 0; y < this.canvas.height; y++) {
      for (let x = 0; x < this.canvas.width; x++) {
        const i = (y * this.canvas.width + x) * 4;
        
        // Red channel shift
        const rX = Math.max(0, Math.min(this.canvas.width - 1, x - offset));
        const rI = (y * this.canvas.width + rX) * 4;
        this.imageData.data[i] = original[rI];
        
        // Blue channel shift
        const bX = Math.max(0, Math.min(this.canvas.width - 1, x + offset));
        const bI = (y * this.canvas.width + bX) * 4;
        this.imageData.data[i + 2] = original[bI + 2];
      }
    }
  }

  /**
   * Apply convolution kernel
   */
  private applyConvolution(kernel: number[]): void {
    if (!this.imageData) return;
    
    const original = new Uint8ClampedArray(this.imageData.data);
    const w = this.canvas.width;
    const h = this.canvas.height;
    
    for (let y = 1; y < h - 1; y++) {
      for (let x = 1; x < w - 1; x++) {
        let r = 0, g = 0, b = 0;
        
        for (let ky = -1; ky <= 1; ky++) {
          for (let kx = -1; kx <= 1; kx++) {
            const i = ((y + ky) * w + (x + kx)) * 4;
            const k = kernel[(ky + 1) * 3 + (kx + 1)];
            r += original[i] * k;
            g += original[i + 1] * k;
            b += original[i + 2] * k;
          }
        }
        
        const i = (y * w + x) * 4;
        this.imageData.data[i] = Math.max(0, Math.min(255, r));
        this.imageData.data[i + 1] = Math.max(0, Math.min(255, g));
        this.imageData.data[i + 2] = Math.max(0, Math.min(255, b));
      }
    }
  }

  /**
   * Apply preset filter
   */
  applyPreset(sourceCanvas: HTMLCanvasElement, presetName: keyof typeof PRESET_FILTERS): void {
    const preset = PRESET_FILTERS[presetName];
    if (preset) {
      this.applyAdjustments(sourceCanvas, preset);
    }
  }
}

export default AdvancedFilterEngine;
