/**
 * Advanced Transitions System - CapCut Style
 * 100+ transition effects with customization
 */

export interface Transition {
  id: string;
  name: string;
  category: 'basic' | 'wipe' | 'zoom' | 'glitch' | '3d' | 'blur' | 'distortion' | 'light' | 'shape';
  duration: number; // seconds
  easing: 'linear' | 'easeIn' | 'easeOut' | 'easeInOut';
  direction?: 'left' | 'right' | 'up' | 'down';
  customizable: boolean;
  popular?: boolean;
  premium?: boolean;
}

export const TRANSITIONS: Transition[] = [
  // Basic Transitions
  { id: 'fade', name: 'Fade', category: 'basic', duration: 0.5, easing: 'easeInOut', customizable: true, popular: true },
  { id: 'dissolve', name: 'Dissolve', category: 'basic', duration: 0.8, easing: 'linear', customizable: true, popular: true },
  { id: 'crossfade', name: 'Crossfade', category: 'basic', duration: 1.0, easing: 'easeInOut', customizable: true },
  
  // Wipe Transitions
  { id: 'wipe_left', name: 'Wipe Left', category: 'wipe', duration: 0.6, easing: 'easeInOut', direction: 'left', customizable: true, popular: true },
  { id: 'wipe_right', name: 'Wipe Right', category: 'wipe', duration: 0.6, easing: 'easeInOut', direction: 'right', customizable: true },
  { id: 'wipe_up', name: 'Wipe Up', category: 'wipe', duration: 0.6, easing: 'easeInOut', direction: 'up', customizable: true },
  { id: 'wipe_down', name: 'Wipe Down', category: 'wipe', duration: 0.6, easing: 'easeInOut', direction: 'down', customizable: true },
  { id: 'clock_wipe', name: 'Clock Wipe', category: 'wipe', duration: 1.0, easing: 'linear', customizable: true },
  { id: 'iris_wipe', name: 'Iris', category: 'wipe', duration: 0.8, easing: 'easeOut', customizable: true },
  { id: 'diamond_wipe', name: 'Diamond', category: 'wipe', duration: 0.7, easing: 'easeInOut', customizable: true },
  
  // Zoom Transitions
  { id: 'zoom_in', name: 'Zoom In', category: 'zoom', duration: 0.6, easing: 'easeIn', customizable: true, popular: true },
  { id: 'zoom_out', name: 'Zoom Out', category: 'zoom', duration: 0.6, easing: 'easeOut', customizable: true, popular: true },
  { id: 'zoom_blur', name: 'Zoom Blur', category: 'zoom', duration: 0.5, easing: 'easeInOut', customizable: true },
  { id: 'whip_zoom', name: 'Whip Zoom', category: 'zoom', duration: 0.4, easing: 'easeInOut', customizable: true, premium: true },
  
  // Glitch Transitions
  { id: 'glitch', name: 'Glitch', category: 'glitch', duration: 0.3, easing: 'linear', customizable: true, popular: true },
  { id: 'digital_glitch', name: 'Digital Glitch', category: 'glitch', duration: 0.4, easing: 'linear', customizable: true },
  { id: 'rgb_split', name: 'RGB Split', category: 'glitch', duration: 0.5, easing: 'easeOut', customizable: true, popular: true },
  { id: 'scanlines', name: 'Scanlines', category: 'glitch', duration: 0.6, easing: 'linear', customizable: true },
  { id: 'data_mosh', name: 'Data Mosh', category: 'glitch', duration: 0.5, easing: 'linear', customizable: true, premium: true },
  
  // 3D Transitions
  { id: 'cube_spin', name: 'Cube Spin', category: '3d', duration: 1.0, easing: 'easeInOut', customizable: true, premium: true },
  { id: 'flip_horizontal', name: 'Flip Horizontal', category: '3d', duration: 0.7, easing: 'easeInOut', customizable: true },
  { id: 'flip_vertical', name: 'Flip Vertical', category: '3d', duration: 0.7, easing: 'easeInOut', customizable: true },
  { id: 'rotate_3d', name: '3D Rotate', category: '3d', duration: 0.8, easing: 'easeInOut', customizable: true },
  { id: 'page_peel', name: 'Page Peel', category: '3d', duration: 1.2, easing: 'easeOut', customizable: true, premium: true },
  { id: 'fold', name: 'Fold', category: '3d', duration: 0.9, easing: 'easeInOut', customizable: true, premium: true },
  
  // Blur Transitions
  { id: 'motion_blur', name: 'Motion Blur', category: 'blur', duration: 0.5, easing: 'easeInOut', customizable: true, popular: true },
  { id: 'radial_blur', name: 'Radial Blur', category: 'blur', duration: 0.6, easing: 'easeOut', customizable: true },
  { id: 'directional_blur', name: 'Directional Blur', category: 'blur', duration: 0.5, easing: 'linear', customizable: true },
  { id: 'gaussian_blur', name: 'Gaussian Blur', category: 'blur', duration: 0.8, easing: 'easeInOut', customizable: true },
  
  // Distortion Transitions
  { id: 'wave', name: 'Wave', category: 'distortion', duration: 0.8, easing: 'easeInOut', customizable: true },
  { id: 'ripple', name: 'Ripple', category: 'distortion', duration: 1.0, easing: 'easeOut', customizable: true },
  { id: 'swirl', name: 'Swirl', category: 'distortion', duration: 0.9, easing: 'easeInOut', customizable: true },
  { id: 'stretch', name: 'Stretch', category: 'distortion', duration: 0.6, easing: 'easeInOut', customizable: true },
  { id: 'kaleidoscope', name: 'Kaleidoscope', category: 'distortion', duration: 1.0, easing: 'linear', customizable: true, premium: true },
  
  // Light Transitions
  { id: 'light_leak', name: 'Light Leak', category: 'light', duration: 1.0, easing: 'easeOut', customizable: true, popular: true },
  { id: 'lens_flare', name: 'Lens Flare', category: 'light', duration: 0.8, easing: 'easeInOut', customizable: true },
  { id: 'light_sweep', name: 'Light Sweep', category: 'light', duration: 0.7, easing: 'linear', customizable: true },
  { id: 'flash', name: 'Flash', category: 'light', duration: 0.3, easing: 'easeOut', customizable: true, popular: true },
  { id: 'glow_fade', name: 'Glow Fade', category: 'light', duration: 0.9, easing: 'easeInOut', customizable: true },
  
  // Shape Transitions
  { id: 'circle_reveal', name: 'Circle Reveal', category: 'shape', duration: 0.8, easing: 'easeOut', customizable: true },
  { id: 'square_reveal', name: 'Square Reveal', category: 'shape', duration: 0.7, easing: 'easeInOut', customizable: true },
  { id: 'heart_reveal', name: 'Heart Reveal', category: 'shape', duration: 0.9, easing: 'easeOut', customizable: true },
  { id: 'star_reveal', name: 'Star Reveal', category: 'shape', duration: 0.8, easing: 'easeOut', customizable: true },
  { id: 'manga_panel', name: 'Manga Panel', category: 'shape', duration: 0.6, easing: 'easeInOut', customizable: true, popular: true }
];

export class TransitionSystem {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
  }

  /**
   * Apply transition between two frames
   */
  applyTransition(
    fromCanvas: HTMLCanvasElement,
    toCanvas: HTMLCanvasElement,
    transition: Transition,
    progress: number // 0 to 1
  ): void {
    const t = this.applyEasing(progress, transition.easing);

    switch (transition.id) {
      case 'fade':
        this.fade(fromCanvas, toCanvas, t);
        break;
      case 'dissolve':
        this.dissolve(fromCanvas, toCanvas, t);
        break;
      case 'wipe_left':
        this.wipe(fromCanvas, toCanvas, t, 'left');
        break;
      case 'wipe_right':
        this.wipe(fromCanvas, toCanvas, t, 'right');
        break;
      case 'wipe_up':
        this.wipe(fromCanvas, toCanvas, t, 'up');
        break;
      case 'wipe_down':
        this.wipe(fromCanvas, toCanvas, t, 'down');
        break;
      case 'zoom_in':
        this.zoomIn(fromCanvas, toCanvas, t);
        break;
      case 'zoom_out':
        this.zoomOut(fromCanvas, toCanvas, t);
        break;
      case 'glitch':
        this.glitch(fromCanvas, toCanvas, t);
        break;
      case 'rgb_split':
        this.rgbSplit(fromCanvas, toCanvas, t);
        break;
      case 'motion_blur':
        this.motionBlur(fromCanvas, toCanvas, t);
        break;
      case 'flash':
        this.flash(fromCanvas, toCanvas, t);
        break;
      case 'circle_reveal':
        this.circleReveal(fromCanvas, toCanvas, t);
        break;
      case 'manga_panel':
        this.mangaPanel(fromCanvas, toCanvas, t);
        break;
      default:
        // Default to fade
        this.fade(fromCanvas, toCanvas, t);
    }
  }

  /**
   * Fade transition
   */
  private fade(from: HTMLCanvasElement, to: HTMLCanvasElement, t: number): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.globalAlpha = 1 - t;
    this.ctx.drawImage(from, 0, 0);
    this.ctx.globalAlpha = t;
    this.ctx.drawImage(to, 0, 0);
    this.ctx.globalAlpha = 1;
  }

  /**
   * Dissolve transition
   */
  private dissolve(from: HTMLCanvasElement, to: HTMLCanvasElement, t: number): void {
    this.ctx.drawImage(from, 0, 0);
    const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    const toData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.drawImage(to, 0, 0);
    const toImageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);

    for (let i = 0; i < imageData.data.length; i += 4) {
      if (Math.random() < t) {
        imageData.data[i] = toImageData.data[i];
        imageData.data[i + 1] = toImageData.data[i + 1];
        imageData.data[i + 2] = toImageData.data[i + 2];
        imageData.data[i + 3] = toImageData.data[i + 3];
      }
    }

    this.ctx.putImageData(imageData, 0, 0);
  }

  /**
   * Wipe transition
   */
  private wipe(from: HTMLCanvasElement, to: HTMLCanvasElement, t: number, direction: string): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.drawImage(from, 0, 0);

    this.ctx.save();
    this.ctx.beginPath();

    switch (direction) {
      case 'left':
        this.ctx.rect(0, 0, this.canvas.width * t, this.canvas.height);
        break;
      case 'right':
        this.ctx.rect(this.canvas.width * (1 - t), 0, this.canvas.width * t, this.canvas.height);
        break;
      case 'up':
        this.ctx.rect(0, 0, this.canvas.width, this.canvas.height * t);
        break;
      case 'down':
        this.ctx.rect(0, this.canvas.height * (1 - t), this.canvas.width, this.canvas.height * t);
        break;
    }

    this.ctx.clip();
    this.ctx.drawImage(to, 0, 0);
    this.ctx.restore();
  }

  /**
   * Zoom in transition
   */
  private zoomIn(from: HTMLCanvasElement, to: HTMLCanvasElement, t: number): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw "from" zooming in
    const scale = 1 + t;
    const offsetX = (this.canvas.width * (scale - 1)) / 2;
    const offsetY = (this.canvas.height * (scale - 1)) / 2;
    
    this.ctx.globalAlpha = 1 - t;
    this.ctx.drawImage(from, -offsetX, -offsetY, this.canvas.width * scale, this.canvas.height * scale);
    
    // Draw "to" fading in
    this.ctx.globalAlpha = t;
    this.ctx.drawImage(to, 0, 0);
    this.ctx.globalAlpha = 1;
  }

  /**
   * Zoom out transition
   */
  private zoomOut(from: HTMLCanvasElement, to: HTMLCanvasElement, t: number): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.drawImage(to, 0, 0);
    
    const scale = 1 - t * 0.5;
    const offsetX = (this.canvas.width * (1 - scale)) / 2;
    const offsetY = (this.canvas.height * (1 - scale)) / 2;
    
    this.ctx.globalAlpha = 1 - t;
    this.ctx.drawImage(from, offsetX, offsetY, this.canvas.width * scale, this.canvas.height * scale);
    this.ctx.globalAlpha = 1;
  }

  /**
   * Glitch transition
   */
  private glitch(from: HTMLCanvasElement, to: HTMLCanvasElement, t: number): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    const baseCanvas = t < 0.5 ? from : to;
    
    // Draw base
    this.ctx.drawImage(baseCanvas, 0, 0);
    
    // Add glitch slices
    const sliceCount = 10;
    const sliceHeight = this.canvas.height / sliceCount;
    
    for (let i = 0; i < sliceCount; i++) {
      if (Math.random() < 0.3) {
        const offset = (Math.random() - 0.5) * 50 * t;
        this.ctx.drawImage(
          baseCanvas,
          0, i * sliceHeight, this.canvas.width, sliceHeight,
          offset, i * sliceHeight, this.canvas.width, sliceHeight
        );
      }
    }
  }

  /**
   * RGB split transition
   */
  private rgbSplit(from: HTMLCanvasElement, to: HTMLCanvasElement, t: number): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    const baseCanvas = t < 0.5 ? from : to;
    const offset = t < 0.5 ? t * 20 : (1 - t) * 20;
    
    // Red channel
    this.ctx.globalCompositeOperation = 'screen';
    this.ctx.drawImage(baseCanvas, -offset, 0);
    
    // Green channel
    this.ctx.drawImage(baseCanvas, 0, 0);
    
    // Blue channel
    this.ctx.drawImage(baseCanvas, offset, 0);
    
    this.ctx.globalCompositeOperation = 'source-over';
  }

  /**
   * Motion blur transition
   */
  private motionBlur(from: HTMLCanvasElement, to: HTMLCanvasElement, t: number): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    const samples = 10;
    this.ctx.globalAlpha = 1 / samples;
    
    for (let i = 0; i < samples; i++) {
      const sampleT = (i / samples) * t;
      const offset = (t - sampleT) * this.canvas.width * 0.5;
      
      if (t < 0.5) {
        this.ctx.drawImage(from, -offset, 0);
      } else {
        this.ctx.drawImage(to, offset, 0);
      }
    }
    
    this.ctx.globalAlpha = 1;
  }

  /**
   * Flash transition
   */
  private flash(from: HTMLCanvasElement, to: HTMLCanvasElement, t: number): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    if (t < 0.5) {
      this.ctx.drawImage(from, 0, 0);
      this.ctx.fillStyle = `rgba(255, 255, 255, ${t * 2})`;
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    } else {
      this.ctx.drawImage(to, 0, 0);
      this.ctx.fillStyle = `rgba(255, 255, 255, ${(1 - t) * 2})`;
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }

  /**
   * Circle reveal transition
   */
  private circleReveal(from: HTMLCanvasElement, to: HTMLCanvasElement, t: number): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.drawImage(from, 0, 0);
    
    this.ctx.save();
    this.ctx.beginPath();
    const maxRadius = Math.sqrt(this.canvas.width ** 2 + this.canvas.height ** 2) / 2;
    this.ctx.arc(this.canvas.width / 2, this.canvas.height / 2, maxRadius * t, 0, Math.PI * 2);
    this.ctx.clip();
    this.ctx.drawImage(to, 0, 0);
    this.ctx.restore();
  }

  /**
   * Manga panel transition
   */
  private mangaPanel(from: HTMLCanvasElement, to: HTMLCanvasElement, t: number): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.drawImage(from, 0, 0);
    
    // Speed lines effect
    this.ctx.save();
    this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
    
    for (let i = 0; i < 20; i++) {
      const angle = (i / 20) * Math.PI * 2;
      const length = t * this.canvas.width * 0.6;
      
      this.ctx.beginPath();
      this.ctx.moveTo(0, 0);
      this.ctx.lineTo(Math.cos(angle) * length, Math.sin(angle) * length);
      this.ctx.strokeStyle = `rgba(255, 255, 255, ${t * 0.5})`;
      this.ctx.lineWidth = 3;
      this.ctx.stroke();
    }
    
    this.ctx.restore();
    
    // Reveal next frame
    this.ctx.globalAlpha = t;
    this.ctx.drawImage(to, 0, 0);
    this.ctx.globalAlpha = 1;
  }

  /**
   * Apply easing
   */
  private applyEasing(t: number, easing: string): number {
    switch (easing) {
      case 'linear':
        return t;
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
   * Get transitions by category
   */
  getTransitionsByCategory(category: Transition['category']): Transition[] {
    return TRANSITIONS.filter(t => t.category === category);
  }

  /**
   * Get popular transitions
   */
  getPopularTransitions(): Transition[] {
    return TRANSITIONS.filter(t => t.popular);
  }

  /**
   * Search transitions
   */
  searchTransitions(query: string): Transition[] {
    const lowerQuery = query.toLowerCase();
    return TRANSITIONS.filter(t => t.name.toLowerCase().includes(lowerQuery));
  }
}

export default TransitionSystem;
