/**
 * Stickers & Overlays System - CapCut Style
 * Animated stickers, emojis, shapes, arrows, trending effects
 */

export interface Sticker {
  id: string;
  name: string;
  category: 'emoji' | 'shape' | 'arrow' | 'frame' | 'badge' | 'effect' | 'trending' | 'anime';
  type: 'static' | 'animated' | 'interactive';
  url: string;
  thumbnail: string;
  duration?: number; // for animated stickers
  frameCount?: number;
  tags: string[];
  popular?: boolean;
  trending?: boolean;
  premium?: boolean;
}

export interface StickerInstance {
  id: string;
  stickerId: string;
  sticker: Sticker;
  position: { x: number; y: number };
  scale: number;
  rotation: number;
  opacity: number;
  startTime: number;
  endTime: number;
  flipX: boolean;
  flipY: boolean;
  tint?: string;
  blendMode: 'normal' | 'multiply' | 'screen' | 'overlay' | 'darken' | 'lighten' | 'add';
}

// Trending sticker categories
export const STICKER_LIBRARY: Sticker[] = [
  // Emoji stickers
  {
    id: 'emoji_001',
    name: 'Fire',
    category: 'emoji',
    type: 'animated',
    url: '/stickers/fire.gif',
    thumbnail: '/stickers/fire-thumb.png',
    duration: 1.0,
    frameCount: 30,
    tags: ['fire', 'hot', 'trending', 'reaction'],
    popular: true,
    trending: true
  },
  {
    id: 'emoji_002',
    name: 'Heart Eyes',
    category: 'emoji',
    type: 'animated',
    url: '/stickers/heart-eyes.gif',
    thumbnail: '/stickers/heart-eyes-thumb.png',
    duration: 0.8,
    frameCount: 24,
    tags: ['love', 'heart', 'cute', 'reaction'],
    popular: true
  },
  {
    id: 'emoji_003',
    name: 'Mind Blown',
    category: 'emoji',
    type: 'animated',
    url: '/stickers/mind-blown.gif',
    thumbnail: '/stickers/mind-blown-thumb.png',
    duration: 1.2,
    frameCount: 36,
    tags: ['shocked', 'wow', 'reaction'],
    trending: true
  },
  
  // Anime stickers
  {
    id: 'anime_001',
    name: 'Speed Lines',
    category: 'anime',
    type: 'animated',
    url: '/stickers/speed-lines.gif',
    thumbnail: '/stickers/speed-lines-thumb.png',
    duration: 0.5,
    frameCount: 15,
    tags: ['speed', 'action', 'manga', 'movement'],
    popular: true
  },
  {
    id: 'anime_002',
    name: 'Sweat Drop',
    category: 'anime',
    type: 'animated',
    url: '/stickers/sweat-drop.gif',
    thumbnail: '/stickers/sweat-drop-thumb.png',
    duration: 0.6,
    frameCount: 18,
    tags: ['anime', 'manga', 'reaction', 'nervous'],
    popular: true
  },
  {
    id: 'anime_003',
    name: 'Sparkle Eyes',
    category: 'anime',
    type: 'animated',
    url: '/stickers/sparkle-eyes.gif',
    thumbnail: '/stickers/sparkle-eyes-thumb.png',
    duration: 1.0,
    frameCount: 30,
    tags: ['anime', 'cute', 'excited', 'kawaii'],
    trending: true
  },
  
  // Shapes
  {
    id: 'shape_001',
    name: 'Neon Circle',
    category: 'shape',
    type: 'animated',
    url: '/stickers/neon-circle.gif',
    thumbnail: '/stickers/neon-circle-thumb.png',
    duration: 2.0,
    frameCount: 60,
    tags: ['shape', 'neon', 'glow', 'modern'],
    popular: true
  },
  {
    id: 'shape_002',
    name: 'Manga Panel',
    category: 'shape',
    type: 'static',
    url: '/stickers/manga-panel.png',
    thumbnail: '/stickers/manga-panel-thumb.png',
    tags: ['manga', 'frame', 'panel', 'border'],
    popular: true
  },
  
  // Arrows
  {
    id: 'arrow_001',
    name: 'Animated Arrow',
    category: 'arrow',
    type: 'animated',
    url: '/stickers/animated-arrow.gif',
    thumbnail: '/stickers/arrow-thumb.png',
    duration: 1.0,
    frameCount: 30,
    tags: ['arrow', 'pointer', 'direction'],
    popular: true
  },
  
  // Effects
  {
    id: 'effect_001',
    name: 'Sparkles',
    category: 'effect',
    type: 'animated',
    url: '/stickers/sparkles.gif',
    thumbnail: '/stickers/sparkles-thumb.png',
    duration: 1.5,
    frameCount: 45,
    tags: ['sparkle', 'glitter', 'magic', 'shine'],
    trending: true
  },
  {
    id: 'effect_002',
    name: 'Glitch Overlay',
    category: 'effect',
    type: 'animated',
    url: '/stickers/glitch.gif',
    thumbnail: '/stickers/glitch-thumb.png',
    duration: 0.3,
    frameCount: 9,
    tags: ['glitch', 'distortion', 'digital', 'error'],
    trending: true,
    premium: true
  },
  {
    id: 'effect_003',
    name: 'Light Leaks',
    category: 'effect',
    type: 'animated',
    url: '/stickers/light-leaks.gif',
    thumbnail: '/stickers/light-leaks-thumb.png',
    duration: 2.0,
    frameCount: 60,
    tags: ['light', 'leak', 'vintage', 'film'],
    premium: true
  },
  
  // Badges & Frames
  {
    id: 'badge_001',
    name: 'Subscribe Badge',
    category: 'badge',
    type: 'animated',
    url: '/stickers/subscribe.gif',
    thumbnail: '/stickers/subscribe-thumb.png',
    duration: 1.0,
    frameCount: 30,
    tags: ['subscribe', 'youtube', 'social'],
    popular: true
  },
  {
    id: 'frame_001',
    name: 'TikTok Frame',
    category: 'frame',
    type: 'static',
    url: '/stickers/tiktok-frame.png',
    thumbnail: '/stickers/tiktok-frame-thumb.png',
    tags: ['frame', 'border', 'tiktok', 'social'],
    popular: true
  }
];

export class StickerSystem {
  private instances: Map<string, StickerInstance>;
  private library: Sticker[];
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private loadedImages: Map<string, HTMLImageElement>;

  constructor(canvas: HTMLCanvasElement) {
    this.instances = new Map();
    this.library = [...STICKER_LIBRARY];
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.loadedImages = new Map();
  }

  /**
   * Get stickers by category
   */
  getStickersByCategory(category: Sticker['category']): Sticker[] {
    return this.library.filter(s => s.category === category);
  }

  /**
   * Search stickers
   */
  searchStickers(query: string): Sticker[] {
    const lowerQuery = query.toLowerCase();
    return this.library.filter(s => 
      s.name.toLowerCase().includes(lowerQuery) ||
      s.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }

  /**
   * Get trending stickers
   */
  getTrendingStickers(): Sticker[] {
    return this.library.filter(s => s.trending);
  }

  /**
   * Get popular stickers
   */
  getPopularStickers(): Sticker[] {
    return this.library.filter(s => s.popular);
  }

  /**
   * Add sticker to timeline
   */
  async addSticker(
    sticker: Sticker,
    position: { x: number; y: number },
    startTime: number,
    duration: number = 3.0
  ): Promise<StickerInstance> {
    const instance: StickerInstance = {
      id: `sticker_${Date.now()}_${Math.random()}`,
      stickerId: sticker.id,
      sticker,
      position,
      scale: 1,
      rotation: 0,
      opacity: 1,
      startTime,
      endTime: startTime + duration,
      flipX: false,
      flipY: false,
      blendMode: 'normal'
    };

    this.instances.set(instance.id, instance);
    
    // Preload image
    await this.loadImage(sticker.url);
    
    return instance;
  }

  /**
   * Load image
   */
  private loadImage(url: string): Promise<HTMLImageElement> {
    if (this.loadedImages.has(url)) {
      return Promise.resolve(this.loadedImages.get(url)!);
    }

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        this.loadedImages.set(url, img);
        resolve(img);
      };
      img.onerror = reject;
      img.src = url;
    });
  }

  /**
   * Render sticker at current time
   */
  async renderSticker(instanceId: string, currentTime: number): Promise<void> {
    const instance = this.instances.get(instanceId);
    if (!instance) return;

    // Check if sticker should be visible
    if (currentTime < instance.startTime || currentTime > instance.endTime) {
      return;
    }

    const img = await this.loadImage(instance.sticker.url);
    
    this.ctx.save();
    
    // Apply transformations
    this.ctx.globalAlpha = instance.opacity;
    this.ctx.translate(instance.position.x, instance.position.y);
    this.ctx.rotate((instance.rotation * Math.PI) / 180);
    this.ctx.scale(
      instance.scale * (instance.flipX ? -1 : 1),
      instance.scale * (instance.flipY ? -1 : 1)
    );
    
    // Apply blend mode
    this.ctx.globalCompositeOperation = instance.blendMode;
    
    // Apply tint if specified
    if (instance.tint) {
      this.ctx.fillStyle = instance.tint;
      this.ctx.fillRect(-img.width / 2, -img.height / 2, img.width, img.height);
      this.ctx.globalCompositeOperation = 'multiply';
    }
    
    // Draw sticker
    this.ctx.drawImage(img, -img.width / 2, -img.height / 2);
    
    this.ctx.restore();
  }

  /**
   * Update sticker position
   */
  updatePosition(instanceId: string, position: { x: number; y: number }): void {
    const instance = this.instances.get(instanceId);
    if (instance) {
      instance.position = position;
    }
  }

  /**
   * Update sticker scale
   */
  updateScale(instanceId: string, scale: number): void {
    const instance = this.instances.get(instanceId);
    if (instance) {
      instance.scale = scale;
    }
  }

  /**
   * Update sticker rotation
   */
  updateRotation(instanceId: string, rotation: number): void {
    const instance = this.instances.get(instanceId);
    if (instance) {
      instance.rotation = rotation;
    }
  }

  /**
   * Update sticker opacity
   */
  updateOpacity(instanceId: string, opacity: number): void {
    const instance = this.instances.get(instanceId);
    if (instance) {
      instance.opacity = opacity;
    }
  }

  /**
   * Flip sticker
   */
  flipSticker(instanceId: string, axis: 'x' | 'y'): void {
    const instance = this.instances.get(instanceId);
    if (instance) {
      if (axis === 'x') {
        instance.flipX = !instance.flipX;
      } else {
        instance.flipY = !instance.flipY;
      }
    }
  }

  /**
   * Apply tint to sticker
   */
  applyTint(instanceId: string, color: string): void {
    const instance = this.instances.get(instanceId);
    if (instance) {
      instance.tint = color;
    }
  }

  /**
   * Set blend mode
   */
  setBlendMode(instanceId: string, blendMode: StickerInstance['blendMode']): void {
    const instance = this.instances.get(instanceId);
    if (instance) {
      instance.blendMode = blendMode;
    }
  }

  /**
   * Delete sticker
   */
  deleteSticker(instanceId: string): void {
    this.instances.delete(instanceId);
  }

  /**
   * Get all sticker instances
   */
  getInstances(): Map<string, StickerInstance> {
    return this.instances;
  }

  /**
   * Get stickers active at current time
   */
  getActiveStickers(currentTime: number): StickerInstance[] {
    const active: StickerInstance[] = [];
    this.instances.forEach(instance => {
      if (currentTime >= instance.startTime && currentTime <= instance.endTime) {
        active.push(instance);
      }
    });
    return active;
  }

  /**
   * Duplicate sticker
   */
  duplicateSticker(instanceId: string): StickerInstance | null {
    const original = this.instances.get(instanceId);
    if (!original) return null;

    const duplicate: StickerInstance = {
      ...original,
      id: `sticker_${Date.now()}_${Math.random()}`,
      position: { x: original.position.x + 20, y: original.position.y + 20 }
    };

    this.instances.set(duplicate.id, duplicate);
    return duplicate;
  }

  /**
   * Add custom sticker
   */
  addCustomSticker(
    name: string,
    url: string,
    category: Sticker['category'],
    tags: string[]
  ): Sticker {
    const sticker: Sticker = {
      id: `custom_${Date.now()}`,
      name,
      category,
      type: 'static',
      url,
      thumbnail: url,
      tags,
      popular: false,
      trending: false
    };

    this.library.push(sticker);
    return sticker;
  }

  /**
   * Clear all stickers
   */
  clearAll(): void {
    this.instances.clear();
  }

  /**
   * Export sticker data
   */
  exportData(): StickerInstance[] {
    return Array.from(this.instances.values());
  }

  /**
   * Import sticker data
   */
  async importData(data: StickerInstance[]): Promise<void> {
    this.instances.clear();
    for (const instance of data) {
      this.instances.set(instance.id, instance);
      await this.loadImage(instance.sticker.url);
    }
  }
}

export default StickerSystem;
