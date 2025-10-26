/**
 * Advanced Effects System
 * Motion blur, chromatic aberration, color grading, 3D transforms
 */

export interface MotionBlurEffect {
  enabled: boolean;
  samples: number;
  intensity: number;
  direction: 'auto' | 'manual';
  angle?: number;
}

export interface ChromaticAberrationEffect {
  enabled: boolean;
  intensity: number;
  angle: number;
  redOffset: { x: number; y: number };
  greenOffset: { x: number; y: number };
  blueOffset: { x: number; y: number };
}

export interface ColorGradingEffect {
  enabled: boolean;
  temperature: number; // -100 to 100
  tint: number; // -100 to 100
  exposure: number; // -2 to 2
  contrast: number; // -100 to 100
  highlights: number; // -100 to 100
  shadows: number; // -100 to 100
  whites: number; // -100 to 100
  blacks: number; // -100 to 100
  saturation: number; // -100 to 100
  vibrance: number; // -100 to 100
  hue: number; // -180 to 180
  lutTexture?: string; // LUT (Look-Up Table) for advanced color grading
}

export interface Transform3D {
  enabled: boolean;
  rotateX: number;
  rotateY: number;
  rotateZ: number;
  translateX: number;
  translateY: number;
  translateZ: number;
  scaleX: number;
  scaleY: number;
  scaleZ: number;
  perspective: number;
  anchorX: number;
  anchorY: number;
  anchorZ: number;
}

export interface LensDistortion {
  enabled: boolean;
  type: 'barrel' | 'pincushion' | 'fisheye';
  intensity: number;
  scale: number;
}

export interface GlitchEffect {
  enabled: boolean;
  type: 'rgb_split' | 'scan_lines' | 'digital' | 'analog' | 'vhs';
  intensity: number;
  frequency: number;
  speed: number;
  seed: number;
}

export class AdvancedEffectsProcessor {
  /**
   * Apply motion blur effect
   */
  applyMotionBlur(
    imageData: ImageData,
    effect: MotionBlurEffect,
    previousFrames: ImageData[]
  ): ImageData {
    if (!effect.enabled) return imageData;

    const blended = new ImageData(imageData.width, imageData.height);
    const weight = 1 / (previousFrames.length + 1);

    // Blend current frame with previous frames
    for (let i = 0; i < imageData.data.length; i++) {
      let sum = imageData.data[i] * weight;
      
      previousFrames.forEach(frame => {
        sum += frame.data[i] * weight;
      });

      blended.data[i] = sum;
    }

    return blended;
  }

  /**
   * Apply chromatic aberration
   */
  applyChromaticAberration(
    imageData: ImageData,
    effect: ChromaticAberrationEffect
  ): ImageData {
    if (!effect.enabled) return imageData;

    const result = new ImageData(imageData.width, imageData.height);
    const { width, height } = imageData;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4;

        // Red channel offset
        const rX = Math.floor(x + effect.redOffset.x * effect.intensity);
        const rY = Math.floor(y + effect.redOffset.y * effect.intensity);
        const rIdx = (rY * width + rX) * 4;
        result.data[idx] = imageData.data[rIdx] || 0;

        // Green channel offset
        const gX = Math.floor(x + effect.greenOffset.x * effect.intensity);
        const gY = Math.floor(y + effect.greenOffset.y * effect.intensity);
        const gIdx = (gY * width + gX) * 4;
        result.data[idx + 1] = imageData.data[gIdx + 1] || 0;

        // Blue channel offset
        const bX = Math.floor(x + effect.blueOffset.x * effect.intensity);
        const bY = Math.floor(y + effect.blueOffset.y * effect.intensity);
        const bIdx = (bY * width + bX) * 4;
        result.data[idx + 2] = imageData.data[bIdx + 2] || 0;

        // Alpha channel
        result.data[idx + 3] = imageData.data[idx + 3];
      }
    }

    return result;
  }

  /**
   * Apply color grading
   */
  applyColorGrading(
    imageData: ImageData,
    effect: ColorGradingEffect
  ): ImageData {
    if (!effect.enabled) return imageData;

    const result = new ImageData(imageData.width, imageData.height);

    for (let i = 0; i < imageData.data.length; i += 4) {
      let r = imageData.data[i];
      let g = imageData.data[i + 1];
      let b = imageData.data[i + 2];
      const a = imageData.data[i + 3];

      // Apply exposure
      const exposureFactor = Math.pow(2, effect.exposure);
      r *= exposureFactor;
      g *= exposureFactor;
      b *= exposureFactor;

      // Apply contrast
      const contrastFactor = (100 + effect.contrast) / 100;
      r = ((r / 255 - 0.5) * contrastFactor + 0.5) * 255;
      g = ((g / 255 - 0.5) * contrastFactor + 0.5) * 255;
      b = ((b / 255 - 0.5) * contrastFactor + 0.5) * 255;

      // Apply saturation
      const gray = 0.299 * r + 0.587 * g + 0.114 * b;
      const satFactor = (100 + effect.saturation) / 100;
      r = gray + (r - gray) * satFactor;
      g = gray + (g - gray) * satFactor;
      b = gray + (b - gray) * satFactor;

      // Clamp values
      result.data[i] = Math.max(0, Math.min(255, r));
      result.data[i + 1] = Math.max(0, Math.min(255, g));
      result.data[i + 2] = Math.max(0, Math.min(255, b));
      result.data[i + 3] = a;
    }

    return result;
  }

  /**
   * Apply lens distortion
   */
  applyLensDistortion(
    imageData: ImageData,
    effect: LensDistortion
  ): ImageData {
    if (!effect.enabled) return imageData;

    const result = new ImageData(imageData.width, imageData.height);
    const { width, height } = imageData;
    const centerX = width / 2;
    const centerY = height / 2;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        // Normalize coordinates to -1 to 1
        const nx = (x - centerX) / centerX;
        const ny = (y - centerY) / centerY;
        const r = Math.sqrt(nx * nx + ny * ny);

        // Apply distortion
        let distortedR = r;
        switch (effect.type) {
          case 'barrel':
            distortedR = r * (1 - effect.intensity * r * r);
            break;
          case 'pincushion':
            distortedR = r * (1 + effect.intensity * r * r);
            break;
          case 'fisheye':
            distortedR = Math.sin(r * Math.PI / 2 * effect.intensity);
            break;
        }

        // Calculate source coordinates
        const scale = distortedR / (r || 1);
        const srcX = Math.floor(centerX + nx * scale * centerX);
        const srcY = Math.floor(centerY + ny * scale * centerY);

        if (srcX >= 0 && srcX < width && srcY >= 0 && srcY < height) {
          const dstIdx = (y * width + x) * 4;
          const srcIdx = (srcY * width + srcX) * 4;

          result.data[dstIdx] = imageData.data[srcIdx];
          result.data[dstIdx + 1] = imageData.data[srcIdx + 1];
          result.data[dstIdx + 2] = imageData.data[srcIdx + 2];
          result.data[dstIdx + 3] = imageData.data[srcIdx + 3];
        }
      }
    }

    return result;
  }

  /**
   * Apply glitch effect
   */
  applyGlitch(imageData: ImageData, effect: GlitchEffect, time: number): ImageData {
    if (!effect.enabled) return imageData;

    const result = new ImageData(imageData.width, imageData.height);
    result.data.set(imageData.data);

    const shouldGlitch = Math.random() < effect.intensity;
    if (!shouldGlitch) return result;

    switch (effect.type) {
      case 'rgb_split':
        return this.applyChromaticAberration(result, {
          enabled: true,
          intensity: effect.intensity * 10,
          angle: 0,
          redOffset: { x: effect.intensity * 5, y: 0 },
          greenOffset: { x: 0, y: 0 },
          blueOffset: { x: -effect.intensity * 5, y: 0 },
        });

      case 'scan_lines':
        for (let y = 0; y < imageData.height; y += Math.floor(2 / effect.intensity)) {
          for (let x = 0; x < imageData.width; x++) {
            const idx = (y * imageData.width + x) * 4;
            result.data[idx] *= 0.5;
            result.data[idx + 1] *= 0.5;
            result.data[idx + 2] *= 0.5;
          }
        }
        break;

      case 'digital':
        // Random block displacements
        const blockSize = 20;
        for (let i = 0; i < 5; i++) {
          const x = Math.floor(Math.random() * (imageData.width - blockSize));
          const y = Math.floor(Math.random() * (imageData.height - blockSize));
          const offsetX = Math.floor((Math.random() - 0.5) * 50 * effect.intensity);
          
          // Copy block with offset
          for (let by = 0; by < blockSize; by++) {
            for (let bx = 0; bx < blockSize; bx++) {
              const srcIdx = ((y + by) * imageData.width + (x + bx)) * 4;
              const dstIdx = ((y + by) * imageData.width + (x + bx + offsetX)) * 4;
              if (dstIdx >= 0 && dstIdx < result.data.length - 4) {
                result.data[dstIdx] = imageData.data[srcIdx];
                result.data[dstIdx + 1] = imageData.data[srcIdx + 1];
                result.data[dstIdx + 2] = imageData.data[srcIdx + 2];
                result.data[dstIdx + 3] = imageData.data[srcIdx + 3];
              }
            }
          }
        }
        break;
    }

    return result;
  }
}

/**
 * LUT (Look-Up Table) Manager for color grading
 */
export class LUTManager {
  private luts: Map<string, ImageData> = new Map();

  /**
   * Load LUT from image
   */
  async loadLUT(name: string, imageUrl: string): Promise<void> {
    // In production, load actual LUT image
    console.log(`Loading LUT: ${name} from ${imageUrl}`);
  }

  /**
   * Apply LUT to image
   */
  applyLUT(imageData: ImageData, lutName: string): ImageData {
    const lut = this.luts.get(lutName);
    if (!lut) return imageData;

    // Apply LUT color transformation
    const result = new ImageData(imageData.width, imageData.height);
    // LUT application logic here
    return result;
  }

  /**
   * Get available LUTs
   */
  getAvailableLUTs(): string[] {
    return Array.from(this.luts.keys());
  }
}

/**
 * Preset LUTs
 */
export const LUTPresets = [
  'Cinematic Warm',
  'Cinematic Cool',
  'Vintage Film',
  'High Contrast',
  'Low Contrast Fade',
  'Anime Style',
  'Manga B&W',
  'Cyberpunk',
  'Sunset Glow',
  'Moonlight',
  'Tokyo Night',
  'Retro 80s',
  'VHS Aesthetic',
  'Instagram Valencia',
  'Instagram X-Pro II',
];
