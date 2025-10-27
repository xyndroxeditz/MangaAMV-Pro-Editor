/**
 * Beat Detection & Audio Analysis System
 * Real-time BPM detection, beat grid, and audio-reactive effects
 */

export interface AudioAnalysis {
  bpm: number;
  beats: Beat[];
  bassDrops: number[];
  buildups: number[];
  breakdowns: number[];
  tempo: 'slow' | 'medium' | 'fast' | 'ultra';
  energy: number[];
  spectrum: Float32Array;
  waveform: Float32Array;
}

export interface Beat {
  time: number;
  confidence: number;
  type: 'kick' | 'snare' | 'hihat' | 'beat';
  energy: number;
}

export interface AudioReactiveParams {
  property: string;
  reactiveTo: 'bass' | 'mid' | 'treble' | 'volume' | 'beat';
  sensitivity: number;
  smoothing: number;
  min: number;
  max: number;
}

export class BeatDetector {
  private audioContext: AudioContext;
  private analyser: AnalyserNode;
  private sourceNode?: AudioBufferSourceNode | MediaElementAudioSourceNode;
  private dataArray: Uint8Array;
  private frequencyData: Float32Array;
  private beatHistory: number[];
  private energyHistory: number[];
  private lastBeatTime: number;
  private bpm: number;

  constructor() {
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 8192; // High resolution FFT
    this.analyser.smoothingTimeConstant = 0.8;
    
    const bufferLength = this.analyser.frequencyBinCount;
    this.dataArray = new Uint8Array(bufferLength);
    this.frequencyData = new Float32Array(bufferLength);
    this.beatHistory = [];
    this.energyHistory = [];
    this.lastBeatTime = 0;
    this.bpm = 0;
  }

  /**
   * Load and analyze audio file
   */
  async loadAudio(audioElement: HTMLAudioElement): Promise<void> {
    try {
      // Create source from audio element
      this.sourceNode = this.audioContext.createMediaElementSource(audioElement);
      this.sourceNode.connect(this.analyser);
      this.analyser.connect(this.audioContext.destination);
      
      // Start analysis
      this.startAnalysis();
    } catch (error) {
      console.error('Error loading audio:', error);
    }
  }

  /**
   * Load audio from ArrayBuffer
   */
  async loadAudioBuffer(arrayBuffer: ArrayBuffer): Promise<AudioBuffer> {
    return await this.audioContext.decodeAudioData(arrayBuffer);
  }

  /**
   * Detect BPM from audio buffer
   */
  async detectBPM(audioBuffer: AudioBuffer): Promise<number> {
    const data = audioBuffer.getChannelData(0);
    const sampleRate = audioBuffer.sampleRate;
    
    // Calculate energy peaks
    const peaks = this.findPeaks(data, sampleRate);
    
    // Calculate intervals between peaks
    const intervals: number[] = [];
    for (let i = 1; i < peaks.length; i++) {
      intervals.push(peaks[i] - peaks[i - 1]);
    }
    
    // Find most common interval (average)
    const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    
    // Convert to BPM
    this.bpm = Math.round(60 / (avgInterval / sampleRate));
    return this.bpm;
  }

  /**
   * Detect all beats in audio
   */
  detectBeats(audioBuffer: AudioBuffer): Beat[] {
    const data = audioBuffer.getChannelData(0);
    const sampleRate = audioBuffer.sampleRate;
    const beats: Beat[] = [];
    
    // Energy threshold for beat detection
    const windowSize = Math.floor(sampleRate * 0.05); // 50ms window
    const energyThreshold = this.calculateEnergyThreshold(data);
    
    for (let i = 0; i < data.length - windowSize; i += windowSize) {
      const window = data.slice(i, i + windowSize);
      const energy = this.calculateEnergy(window);
      
      if (energy > energyThreshold) {
        const time = i / sampleRate;
        const confidence = Math.min(energy / energyThreshold, 1);
        
        beats.push({
          time,
          confidence,
          type: this.classifyBeat(window, sampleRate),
          energy
        });
      }
    }
    
    return beats;
  }

  /**
   * Detect bass drops
   */
  detectBassDrops(audioBuffer: AudioBuffer): number[] {
    const bassDrops: number[] = [];
    const data = audioBuffer.getChannelData(0);
    const sampleRate = audioBuffer.sampleRate;
    
    // Analyze low frequencies for sudden increases
    const windowSize = Math.floor(sampleRate * 0.1); // 100ms
    let previousBassEnergy = 0;
    
    for (let i = 0; i < data.length - windowSize; i += windowSize) {
      const window = data.slice(i, i + windowSize);
      const bassEnergy = this.calculateBassEnergy(window);
      
      // Check for sudden bass increase (drop)
      if (bassEnergy > previousBassEnergy * 2.5) {
        bassDrops.push(i / sampleRate);
      }
      
      previousBassEnergy = bassEnergy;
    }
    
    return bassDrops;
  }

  /**
   * Detect buildups and breakdowns
   */
  detectBuildups(audioBuffer: AudioBuffer): { buildups: number[]; breakdowns: number[] } {
    const buildups: number[] = [];
    const breakdowns: number[] = [];
    const data = audioBuffer.getChannelData(0);
    const sampleRate = audioBuffer.sampleRate;
    
    const windowSize = Math.floor(sampleRate * 1.0); // 1 second
    const energyHistory: number[] = [];
    
    for (let i = 0; i < data.length - windowSize; i += windowSize) {
      const window = data.slice(i, i + windowSize);
      const energy = this.calculateEnergy(window);
      energyHistory.push(energy);
      
      if (energyHistory.length >= 4) {
        const recent = energyHistory.slice(-4);
        const isIncreasing = recent[3] > recent[2] && recent[2] > recent[1] && recent[1] > recent[0];
        const isDecreasing = recent[3] < recent[2] && recent[2] < recent[1] && recent[1] < recent[0];
        
        if (isIncreasing && recent[3] > recent[0] * 1.5) {
          buildups.push(i / sampleRate);
        } else if (isDecreasing && recent[3] < recent[0] * 0.5) {
          breakdowns.push(i / sampleRate);
        }
      }
    }
    
    return { buildups, breakdowns };
  }

  /**
   * Get real-time frequency spectrum
   */
  getSpectrum(): Float32Array {
    this.analyser.getFloatFrequencyData(this.frequencyData);
    return this.frequencyData;
  }

  /**
   * Get frequency bands (7 bands: Sub-Bass to Brilliance)
   */
  getFrequencyBands(): {
    subBass: number;
    bass: number;
    lowMid: number;
    mid: number;
    highMid: number;
    treble: number;
    brilliance: number;
  } {
    this.analyser.getByteFrequencyData(this.dataArray);
    
    const binCount = this.dataArray.length;
    const nyquist = this.audioContext.sampleRate / 2;
    const binSize = nyquist / binCount;
    
    const getBand = (freqStart: number, freqEnd: number): number => {
      const binStart = Math.floor(freqStart / binSize);
      const binEnd = Math.floor(freqEnd / binSize);
      let sum = 0;
      let count = 0;
      
      for (let i = binStart; i < binEnd && i < binCount; i++) {
        sum += this.dataArray[i];
        count++;
      }
      
      return count > 0 ? sum / count / 255 : 0;
    };
    
    return {
      subBass: getBand(20, 60),      // Sub-bass
      bass: getBand(60, 250),        // Bass
      lowMid: getBand(250, 500),     // Low-mid
      mid: getBand(500, 2000),       // Mid
      highMid: getBand(2000, 4000),  // High-mid
      treble: getBand(4000, 6000),   // Treble
      brilliance: getBand(6000, 20000) // Brilliance
    };
  }

  /**
   * Get overall volume (RMS)
   */
  getVolume(): number {
    this.analyser.getByteTimeDomainData(this.dataArray);
    
    let sum = 0;
    for (let i = 0; i < this.dataArray.length; i++) {
      const normalized = (this.dataArray[i] - 128) / 128;
      sum += normalized * normalized;
    }
    
    return Math.sqrt(sum / this.dataArray.length);
  }

  /**
   * Create beat grid for timeline
   */
  createBeatGrid(duration: number): number[] {
    if (this.bpm === 0) return [];
    
    const beatInterval = 60 / this.bpm;
    const beats: number[] = [];
    
    for (let time = 0; time < duration; time += beatInterval) {
      beats.push(time);
    }
    
    return beats;
  }

  /**
   * Apply audio-reactive effect
   */
  applyAudioReactive(params: AudioReactiveParams, currentValue: number): number {
    const bands = this.getFrequencyBands();
    const volume = this.getVolume();
    
    let reactiveValue = 0;
    
    switch (params.reactiveTo) {
      case 'bass':
        reactiveValue = bands.bass;
        break;
      case 'mid':
        reactiveValue = bands.mid;
        break;
      case 'treble':
        reactiveValue = bands.treble;
        break;
      case 'volume':
        reactiveValue = volume;
        break;
      case 'beat':
        reactiveValue = this.detectRealTimeBeat() ? 1 : 0;
        break;
    }
    
    // Apply sensitivity and smoothing
    reactiveValue *= params.sensitivity;
    reactiveValue = currentValue * params.smoothing + reactiveValue * (1 - params.smoothing);
    
    // Clamp to min/max range
    return Math.max(params.min, Math.min(params.max, params.min + reactiveValue * (params.max - params.min)));
  }

  /**
   * Private: Find peaks in audio data
   */
  private findPeaks(data: Float32Array, sampleRate: number): number[] {
    const peaks: number[] = [];
    const windowSize = Math.floor(sampleRate * 0.05); // 50ms
    
    for (let i = 0; i < data.length - windowSize; i += windowSize) {
      const window = data.slice(i, i + windowSize);
      const energy = this.calculateEnergy(window);
      
      if (energy > 0.01) { // Threshold
        peaks.push(i);
      }
    }
    
    return peaks;
  }

  /**
   * Private: Calculate energy of audio window
   */
  private calculateEnergy(window: Float32Array): number {
    let sum = 0;
    for (let i = 0; i < window.length; i++) {
      sum += window[i] * window[i];
    }
    return Math.sqrt(sum / window.length);
  }

  /**
   * Private: Calculate energy threshold
   */
  private calculateEnergyThreshold(data: Float32Array): number {
    const windowSize = 1024;
    let totalEnergy = 0;
    let windows = 0;
    
    for (let i = 0; i < data.length - windowSize; i += windowSize) {
      const window = data.slice(i, i + windowSize);
      totalEnergy += this.calculateEnergy(window);
      windows++;
    }
    
    return (totalEnergy / windows) * 1.5; // 1.5x average as threshold
  }

  /**
   * Private: Calculate bass energy
   */
  private calculateBassEnergy(window: Float32Array): number {
    // Simple low-pass filter for bass
    let sum = 0;
    const cutoff = Math.floor(window.length * 0.1); // Low 10%
    
    for (let i = 0; i < cutoff; i++) {
      sum += Math.abs(window[i]);
    }
    
    return sum / cutoff;
  }

  /**
   * Private: Classify beat type
   */
  private classifyBeat(window: Float32Array, sampleRate: number): 'kick' | 'snare' | 'hihat' | 'beat' {
    const bass = this.calculateBassEnergy(window);
    const mid = this.calculateEnergy(window.slice(Math.floor(window.length * 0.2), Math.floor(window.length * 0.5)));
    const high = this.calculateEnergy(window.slice(Math.floor(window.length * 0.7)));
    
    if (bass > mid * 2 && bass > high * 2) return 'kick';
    if (mid > bass && mid > high) return 'snare';
    if (high > bass * 2 && high > mid * 2) return 'hihat';
    return 'beat';
  }

  /**
   * Private: Detect real-time beat
   */
  private detectRealTimeBeat(): boolean {
    const currentTime = this.audioContext.currentTime;
    const energy = this.getVolume();
    
    this.energyHistory.push(energy);
    if (this.energyHistory.length > 43) {
      this.energyHistory.shift();
    }
    
    const avgEnergy = this.energyHistory.reduce((a, b) => a + b, 0) / this.energyHistory.length;
    const threshold = avgEnergy * 1.5;
    
    if (energy > threshold && currentTime - this.lastBeatTime > 0.2) {
      this.lastBeatTime = currentTime;
      return true;
    }
    
    return false;
  }

  /**
   * Private: Start analysis loop
   */
  private startAnalysis(): void {
    const analyze = () => {
      requestAnimationFrame(analyze);
      // Analysis happens here via getSpectrum(), getFrequencyBands(), etc.
    };
    analyze();
  }

  /**
   * Get current BPM
   */
  getBPM(): number {
    return this.bpm;
  }

  /**
   * Dispose resources
   */
  dispose(): void {
    if (this.sourceNode) {
      this.sourceNode.disconnect();
    }
    this.analyser.disconnect();
    this.audioContext.close();
  }
}

export const beatDetector = new BeatDetector();
