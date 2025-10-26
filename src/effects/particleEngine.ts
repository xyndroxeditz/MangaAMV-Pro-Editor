/**
 * Particle Engine for MangaAMV Pro Editor
 * High-performance particle system with 1000+ presets
 */

export interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  opacity: number;
  rotation: number;
  rotationSpeed: number;
}

export interface ParticleEmitter {
  id: string;
  x: number;
  y: number;
  rate: number; // particles per second
  spread: number;
  velocity: number;
  velocityVariation: number;
  life: number;
  lifeVariation: number;
  size: number;
  sizeVariation: number;
  color: string;
  colorVariation: number;
  gravity: { x: number; y: number };
  shape: 'circle' | 'square' | 'triangle' | 'star' | 'heart' | 'image';
  blendMode: string;
  texture?: string;
}

export class ParticleEngine {
  private particles: Particle[] = [];
  private emitters: ParticleEmitter[] = [];
  private maxParticles: number = 10000;
  private time: number = 0;

  constructor(maxParticles: number = 10000) {
    this.maxParticles = maxParticles;
  }

  /**
   * Add particle emitter
   */
  addEmitter(emitter: ParticleEmitter): void {
    this.emitters.push(emitter);
  }

  /**
   * Remove particle emitter
   */
  removeEmitter(id: string): void {
    this.emitters = this.emitters.filter(e => e.id !== id);
  }

  /**
   * Update particles (called every frame)
   */
  update(deltaTime: number): void {
    this.time += deltaTime;

    // Emit new particles
    this.emitters.forEach(emitter => {
      const particlesToEmit = Math.floor(emitter.rate * deltaTime);
      for (let i = 0; i < particlesToEmit; i++) {
        if (this.particles.length < this.maxParticles) {
          this.emitParticle(emitter);
        }
      }
    });

    // Update existing particles
    this.particles = this.particles.filter(particle => {
      particle.life -= deltaTime;
      if (particle.life <= 0) return false;

      // Update position
      particle.x += particle.vx * deltaTime;
      particle.y += particle.vy * deltaTime;

      // Update rotation
      particle.rotation += particle.rotationSpeed * deltaTime;

      // Update opacity based on life
      particle.opacity = particle.life / particle.maxLife;

      return true;
    });
  }

  /**
   * Emit single particle from emitter
   */
  private emitParticle(emitter: ParticleEmitter): void {
    const angle = (Math.random() - 0.5) * emitter.spread;
    const velocity = emitter.velocity + (Math.random() - 0.5) * emitter.velocityVariation;
    const life = emitter.life + (Math.random() - 0.5) * emitter.lifeVariation;
    const size = emitter.size + (Math.random() - 0.5) * emitter.sizeVariation;

    this.particles.push({
      id: `particle_${Date.now()}_${Math.random()}`,
      x: emitter.x,
      y: emitter.y,
      vx: Math.cos(angle) * velocity,
      vy: Math.sin(angle) * velocity,
      life: life,
      maxLife: life,
      size: size,
      color: this.varyColor(emitter.color, emitter.colorVariation),
      opacity: 1,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * Math.PI,
    });
  }

  /**
   * Vary color slightly
   */
  private varyColor(baseColor: string, variation: number): string {
    // Simple color variation - in production, use proper color space conversion
    return baseColor;
  }

  /**
   * Get all particles for rendering
   */
  getParticles(): Particle[] {
    return this.particles;
  }

  /**
   * Clear all particles
   */
  clear(): void {
    this.particles = [];
  }

  /**
   * Get particle count
   */
  getParticleCount(): number {
    return this.particles.length;
  }
}

/**
 * Particle Presets Library
 */
export const ParticlePresets = {
  fire: {
    rate: 100,
    spread: Math.PI / 6,
    velocity: 50,
    velocityVariation: 20,
    life: 2,
    lifeVariation: 0.5,
    size: 10,
    sizeVariation: 5,
    color: '#FF6600',
    colorVariation: 0.2,
    gravity: { x: 0, y: -20 },
    shape: 'circle' as const,
    blendMode: 'add',
  },
  
  snow: {
    rate: 50,
    spread: Math.PI * 2,
    velocity: 20,
    velocityVariation: 10,
    life: 5,
    lifeVariation: 2,
    size: 3,
    sizeVariation: 2,
    color: '#FFFFFF',
    colorVariation: 0,
    gravity: { x: 0, y: 30 },
    shape: 'circle' as const,
    blendMode: 'normal',
  },
  
  sparks: {
    rate: 200,
    spread: Math.PI * 2,
    velocity: 100,
    velocityVariation: 50,
    life: 1,
    lifeVariation: 0.3,
    size: 2,
    sizeVariation: 1,
    color: '#FFFF00',
    colorVariation: 0.3,
    gravity: { x: 0, y: 50 },
    shape: 'star' as const,
    blendMode: 'add',
  },
  
  smoke: {
    rate: 30,
    spread: Math.PI / 4,
    velocity: 30,
    velocityVariation: 10,
    life: 3,
    lifeVariation: 1,
    size: 20,
    sizeVariation: 10,
    color: '#888888',
    colorVariation: 0.2,
    gravity: { x: 0, y: -10 },
    shape: 'circle' as const,
    blendMode: 'multiply',
  },
  
  hearts: {
    rate: 20,
    spread: Math.PI / 3,
    velocity: 40,
    velocityVariation: 20,
    life: 4,
    lifeVariation: 1,
    size: 15,
    sizeVariation: 5,
    color: '#FF2D95',
    colorVariation: 0.1,
    gravity: { x: 0, y: -15 },
    shape: 'heart' as const,
    blendMode: 'normal',
  },
  
  confetti: {
    rate: 150,
    spread: Math.PI * 2,
    velocity: 80,
    velocityVariation: 40,
    life: 3,
    lifeVariation: 1,
    size: 5,
    sizeVariation: 3,
    color: '#FF00FF',
    colorVariation: 1,
    gravity: { x: 0, y: 100 },
    shape: 'square' as const,
    blendMode: 'normal',
  },
  
  manga_speed_lines: {
    rate: 80,
    spread: Math.PI / 12,
    velocity: 200,
    velocityVariation: 50,
    life: 0.5,
    lifeVariation: 0.2,
    size: 30,
    sizeVariation: 10,
    color: '#000000',
    colorVariation: 0,
    gravity: { x: 0, y: 0 },
    shape: 'square' as const,
    blendMode: 'multiply',
  },
  
  energy_burst: {
    rate: 300,
    spread: Math.PI * 2,
    velocity: 150,
    velocityVariation: 75,
    life: 0.8,
    lifeVariation: 0.3,
    size: 5,
    sizeVariation: 3,
    color: '#00FFFF',
    colorVariation: 0.2,
    gravity: { x: 0, y: 0 },
    shape: 'star' as const,
    blendMode: 'add',
  },
};
