/**
 * Advanced Text System with CapCut-style features
 * Animations, fonts, strokes, shadows, tracking, kerning
 */

export interface TextStyle {
  fontFamily: string;
  fontSize: number;
  fontWeight: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
  fontStyle: 'normal' | 'italic' | 'oblique';
  color: string;
  backgroundColor?: string;
  opacity: number;
  
  // Stroke
  strokeColor: string;
  strokeWidth: number;
  
  // Shadow
  shadowColor: string;
  shadowBlur: number;
  shadowOffsetX: number;
  shadowOffsetY: number;
  
  // Advanced
  letterSpacing: number;
  lineHeight: number;
  textAlign: 'left' | 'center' | 'right' | 'justify';
  textTransform: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  textDecoration: 'none' | 'underline' | 'line-through';
  
  // Effects
  blur: number;
  glow: boolean;
  glowColor: string;
  glowIntensity: number;
}

export interface TextAnimation {
  type: 'typewriter' | 'fade' | 'slide' | 'bounce' | 'glitch' | 'wave' | 'zoom' | 'rotate' | 'neon';
  duration: number;
  delay: number;
  easing: 'linear' | 'easeIn' | 'easeOut' | 'easeInOut' | 'bounce' | 'elastic';
  loop: boolean;
  direction?: 'up' | 'down' | 'left' | 'right';
}

export interface TextTemplate {
  id: string;
  name: string;
  category: 'title' | 'subtitle' | 'caption' | 'lower-third' | 'quote' | 'social';
  style: TextStyle;
  animation: TextAnimation;
  thumbnail: string;
  popular?: boolean;
}

// CapCut-style Text Templates
export const TEXT_TEMPLATES: TextTemplate[] = [
  {
    id: 'text_001',
    name: 'Neon Glow Title',
    category: 'title',
    style: {
      fontFamily: 'Impact',
      fontSize: 72,
      fontWeight: 'bold',
      fontStyle: 'normal',
      color: '#FFFFFF',
      opacity: 1,
      strokeColor: '#FF2D95',
      strokeWidth: 4,
      shadowColor: '#FF2D95',
      shadowBlur: 30,
      shadowOffsetX: 0,
      shadowOffsetY: 0,
      letterSpacing: 2,
      lineHeight: 1.2,
      textAlign: 'center',
      textTransform: 'uppercase',
      textDecoration: 'none',
      blur: 0,
      glow: true,
      glowColor: '#FF2D95',
      glowIntensity: 1.5
    },
    animation: {
      type: 'neon',
      duration: 1.0,
      delay: 0,
      easing: 'easeOut',
      loop: false
    },
    thumbnail: '/templates/neon-title.jpg',
    popular: true
  },
  {
    id: 'text_002',
    name: 'Typewriter',
    category: 'caption',
    style: {
      fontFamily: 'Courier New',
      fontSize: 36,
      fontWeight: 'normal',
      fontStyle: 'normal',
      color: '#FFFFFF',
      opacity: 1,
      strokeColor: 'transparent',
      strokeWidth: 0,
      shadowColor: 'rgba(0, 0, 0, 0.5)',
      shadowBlur: 4,
      shadowOffsetX: 2,
      shadowOffsetY: 2,
      letterSpacing: 0,
      lineHeight: 1.5,
      textAlign: 'left',
      textTransform: 'none',
      textDecoration: 'none',
      blur: 0,
      glow: false,
      glowColor: '#FFFFFF',
      glowIntensity: 0
    },
    animation: {
      type: 'typewriter',
      duration: 2.0,
      delay: 0,
      easing: 'linear',
      loop: false
    },
    thumbnail: '/templates/typewriter.jpg',
    popular: true
  },
  {
    id: 'text_003',
    name: 'Glitch Pop',
    category: 'title',
    style: {
      fontFamily: 'Arial Black',
      fontSize: 64,
      fontWeight: 'bold',
      fontStyle: 'normal',
      color: '#00FFFF',
      opacity: 1,
      strokeColor: '#FF00FF',
      strokeWidth: 2,
      shadowColor: 'transparent',
      shadowBlur: 0,
      shadowOffsetX: 0,
      shadowOffsetY: 0,
      letterSpacing: 4,
      lineHeight: 1.2,
      textAlign: 'center',
      textTransform: 'uppercase',
      textDecoration: 'none',
      blur: 0,
      glow: false,
      glowColor: '#FFFFFF',
      glowIntensity: 0
    },
    animation: {
      type: 'glitch',
      duration: 0.5,
      delay: 0,
      easing: 'linear',
      loop: false
    },
    thumbnail: '/templates/glitch-pop.jpg',
    popular: true
  }
];

export class AdvancedTextSystem {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private texts: Map<string, TextLayer>;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.texts = new Map();
  }

  /**
   * Create text layer
   */
  createText(
    id: string,
    text: string,
    style: TextStyle,
    position: { x: number; y: number }
  ): void {
    const layer: TextLayer = {
      id,
      text,
      style,
      position,
      rotation: 0,
      scale: 1,
      animation: null
    };
    this.texts.set(id, layer);
  }

  /**
   * Apply text template
   */
  applyTemplate(id: string, template: TextTemplate, text: string): void {
    this.createText(id, text, template.style, { x: this.canvas.width / 2, y: this.canvas.height / 2 });
    const layer = this.texts.get(id);
    if (layer) {
      layer.animation = template.animation;
    }
  }

  /**
   * Render text with all styles
   */
  renderText(id: string, progress: number = 1): void {
    const layer = this.texts.get(id);
    if (!layer) return;

    const { text, style, position, rotation, scale, animation } = layer;

    this.ctx.save();
    this.ctx.translate(position.x, position.y);
    this.ctx.rotate((rotation * Math.PI) / 180);
    this.ctx.scale(scale, scale);

    // Apply animation
    if (animation) {
      this.applyAnimation(animation, progress);
    }

    // Set font
    this.ctx.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize}px ${style.fontFamily}`;
    this.ctx.textAlign = style.textAlign as CanvasTextAlign;

    // Apply shadow
    if (style.shadowBlur > 0) {
      this.ctx.shadowColor = style.shadowColor;
      this.ctx.shadowBlur = style.shadowBlur;
      this.ctx.shadowOffsetX = style.shadowOffsetX;
      this.ctx.shadowOffsetY = style.shadowOffsetY;
    }

    // Apply glow effect
    if (style.glow) {
      this.ctx.shadowColor = style.glowColor;
      this.ctx.shadowBlur = style.fontSize * style.glowIntensity;
      for (let i = 0; i < 3; i++) {
        this.ctx.strokeStyle = style.glowColor;
        this.ctx.lineWidth = style.strokeWidth + i * 2;
        this.ctx.strokeText(text, 0, 0);
      }
    }

    // Draw stroke
    if (style.strokeWidth > 0) {
      this.ctx.strokeStyle = style.strokeColor;
      this.ctx.lineWidth = style.strokeWidth;
      this.ctx.strokeText(text, 0, 0);
    }

    // Draw fill
    this.ctx.fillStyle = style.color;
    this.ctx.globalAlpha = style.opacity;
    this.ctx.fillText(text, 0, 0);

    this.ctx.restore();
  }

  /**
   * Apply text animation
   */
  private applyAnimation(animation: TextAnimation, progress: number): void {
    const t = this.easeProgress(progress, animation.easing);

    switch (animation.type) {
      case 'fade':
        this.ctx.globalAlpha = t;
        break;
      case 'slide':
        const slideOffset = (1 - t) * 100;
        if (animation.direction === 'left') this.ctx.translate(-slideOffset, 0);
        if (animation.direction === 'right') this.ctx.translate(slideOffset, 0);
        if (animation.direction === 'up') this.ctx.translate(0, -slideOffset);
        if (animation.direction === 'down') this.ctx.translate(0, slideOffset);
        break;
      case 'zoom':
        this.ctx.scale(t, t);
        break;
      case 'rotate':
        this.ctx.rotate(t * Math.PI * 2);
        break;
      case 'bounce':
        const bounce = Math.abs(Math.sin(t * Math.PI * 4)) * (1 - t);
        this.ctx.translate(0, -bounce * 50);
        break;
    }
  }

  /**
   * Easing functions
   */
  private easeProgress(t: number, easing: string): number {
    switch (easing) {
      case 'easeIn':
        return t * t;
      case 'easeOut':
        return 1 - (1 - t) * (1 - t);
      case 'easeInOut':
        return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      case 'bounce':
        return 1 - Math.pow(1 - t, 3) * Math.abs(Math.cos(t * Math.PI * 3));
      case 'elastic':
        return t === 0 || t === 1 ? t : -Math.pow(2, 10 * t - 10) * Math.sin((t * 10 - 10.75) * ((2 * Math.PI) / 3));
      default:
        return t;
    }
  }

  /**
   * Typewriter effect
   */
  renderTypewriter(id: string, progress: number): void {
    const layer = this.texts.get(id);
    if (!layer) return;

    const charCount = Math.floor(layer.text.length * progress);
    const visibleText = layer.text.substring(0, charCount);

    const tempText = layer.text;
    layer.text = visibleText;
    this.renderText(id);
    layer.text = tempText;
  }

  /**
   * Get all text layers
   */
  getTexts(): Map<string, TextLayer> {
    return this.texts;
  }

  /**
   * Update text content
   */
  updateText(id: string, text: string): void {
    const layer = this.texts.get(id);
    if (layer) {
      layer.text = text;
    }
  }

  /**
   * Update text style
   */
  updateStyle(id: string, style: Partial<TextStyle>): void {
    const layer = this.texts.get(id);
    if (layer) {
      layer.style = { ...layer.style, ...style };
    }
  }

  /**
   * Delete text layer
   */
  deleteText(id: string): void {
    this.texts.delete(id);
  }
}

interface TextLayer {
  id: string;
  text: string;
  style: TextStyle;
  position: { x: number; y: number };
  rotation: number;
  scale: number;
  animation: TextAnimation | null;
}

export default AdvancedTextSystem;
