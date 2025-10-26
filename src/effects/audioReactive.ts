/**
 * Advanced Audio Reactive System
 * Real-time audio analysis, frequency isolation, audio-reactive parameters
 */

export interface FrequencyBands {
  subBass: number; // 20-60 Hz
  bass: number; // 60-250 Hz
  lowMid: number; // 250-500 Hz
  mid: number; // 500-2000 Hz
  highMid: number; // 2000-4000 Hz
  presence: number; // 4000-6000 Hz
  brilliance: number; // 6000-20000 Hz
}

export interface AudioFeatures {
  rms: number; // Root mean square (volume)
  zcr: number; // Zero crossing rate
  spectralCentroid: number;
  spectralRolloff: number;
  onset: boolean; // Beat/onset detected
  tempo: number; // BPM
  energy: number;
  loudness: number;
}

export interface AudioReactiveParameter {
  targetProperty: string; // e.g., 'opacity', 'scale', 'rotation'
  audioSource: 'bass' | 'treble' | 'mid' | 'volume' | 'frequency';
  frequencyRange?: [number, number]; // For custom frequency ranges
  sensitivity: number;
  smoothing: number;
  min: number;
  max: number;
  invert: boolean;
}

export class AdvancedAudioAnalyzer {
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private source: MediaElementAudioSourceNode | null = null;
  private dataArray: Uint8Array | null = null;
  private frequencyData: Float32Array | null = null;
  private sampleRate: number = 44100;
  
  // Advanced analysis
  private previousRMS: number = 0;
  private onsetThreshold: number = 1.3;
  private tempoDetector: TempoDetector;
  private voiceDetector: VoiceActivityDetector;

  constructor() {
    this.tempoDetector = new TempoDetector();
    this.voiceDetector = new VoiceActivityDetector();
  }

  /**
   * Initialize audio analysis
   */
  async initialize(audioElement: HTMLAudioElement): Promise<void> {
    this.audioContext = new AudioContext();
    this.sampleRate = this.audioContext.sampleRate;
    
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 8192; // High resolution for better frequency analysis
    this.analyser.smoothingTimeConstant = 0.8;

    this.source = this.audioContext.createMediaElementSource(audioElement);
    this.source.connect(this.analyser);
    this.analyser.connect(this.audioContext.destination);

    const bufferLength = this.analyser.frequencyBinCount;
    this.dataArray = new Uint8Array(bufferLength);
    this.frequencyData = new Float32Array(bufferLength);
  }

  /**
   * Get frequency bands analysis
   */
  getFrequencyBands(): FrequencyBands {
    if (!this.analyser || !this.dataArray) {
      return this.getEmptyBands();
    }

    this.analyser.getByteFrequencyData(this.dataArray);

    return {
      subBass: this.getFrequencyRangeAverage(20, 60),
      bass: this.getFrequencyRangeAverage(60, 250),
      lowMid: this.getFrequencyRangeAverage(250, 500),
      mid: this.getFrequencyRangeAverage(500, 2000),
      highMid: this.getFrequencyRangeAverage(2000, 4000),
      presence: this.getFrequencyRangeAverage(4000, 6000),
      brilliance: this.getFrequencyRangeAverage(6000, 20000),
    };
  }

  /**
   * Get audio features
   */
  getAudioFeatures(): AudioFeatures {
    if (!this.analyser || !this.dataArray || !this.frequencyData) {
      return this.getEmptyFeatures();
    }

    this.analyser.getByteFrequencyData(this.dataArray);
    this.analyser.getFloatFrequencyData(this.frequencyData);

    const rms = this.calculateRMS();
    const onset = this.detectOnset(rms);
    
    return {
      rms,
      zcr: this.calculateZeroCrossingRate(),
      spectralCentroid: this.calculateSpectralCentroid(),
      spectralRolloff: this.calculateSpectralRolloff(),
      onset,
      tempo: this.tempoDetector.getCurrentTempo(),
      energy: this.calculateEnergy(),
      loudness: rms * 100,
    };
  }

  /**
   * Get frequency range average
   */
  private getFrequencyRangeAverage(minFreq: number, maxFreq: number): number {
    if (!this.analyser || !this.dataArray) return 0;

    const nyquist = this.sampleRate / 2;
    const binCount = this.analyser.frequencyBinCount;
    
    const minBin = Math.floor((minFreq / nyquist) * binCount);
    const maxBin = Math.floor((maxFreq / nyquist) * binCount);

    let sum = 0;
    let count = 0;

    for (let i = minBin; i <= maxBin && i < this.dataArray.length; i++) {
      sum += this.dataArray[i];
      count++;
    }

    return count > 0 ? (sum / count) / 255 : 0;
  }

  /**
   * Calculate RMS (Root Mean Square) for volume
   */
  private calculateRMS(): number {
    if (!this.dataArray) return 0;

    let sum = 0;
    for (let i = 0; i < this.dataArray.length; i++) {
      const normalized = this.dataArray[i] / 255;
      sum += normalized * normalized;
    }

    return Math.sqrt(sum / this.dataArray.length);
  }

  /**
   * Detect onset (beat)
   */
  private detectOnset(currentRMS: number): boolean {
    const onset = currentRMS > this.previousRMS * this.onsetThreshold;
    this.previousRMS = currentRMS;
    
    if (onset) {
      this.tempoDetector.recordBeat(Date.now());
    }

    return onset;
  }

  /**
   * Calculate zero crossing rate
   */
  private calculateZeroCrossingRate(): number {
    if (!this.dataArray) return 0;

    let crossings = 0;
    for (let i = 1; i < this.dataArray.length; i++) {
      if (
        (this.dataArray[i] > 128 && this.dataArray[i - 1] <= 128) ||
        (this.dataArray[i] <= 128 && this.dataArray[i - 1] > 128)
      ) {
        crossings++;
      }
    }

    return crossings / this.dataArray.length;
  }

  /**
   * Calculate spectral centroid (brightness)
   */
  private calculateSpectralCentroid(): number {
    if (!this.dataArray) return 0;

    let weightedSum = 0;
    let sum = 0;

    for (let i = 0; i < this.dataArray.length; i++) {
      const magnitude = this.dataArray[i];
      weightedSum += i * magnitude;
      sum += magnitude;
    }

    return sum > 0 ? weightedSum / sum : 0;
  }

  /**
   * Calculate spectral rolloff
   */
  private calculateSpectralRolloff(): number {
    if (!this.dataArray) return 0;

    const total = this.dataArray.reduce((sum, val) => sum + val, 0);
    const threshold = total * 0.85;

    let sum = 0;
    for (let i = 0; i < this.dataArray.length; i++) {
      sum += this.dataArray[i];
      if (sum >= threshold) {
        return i / this.dataArray.length;
      }
    }

    return 1;
  }

  /**
   * Calculate energy
   */
  private calculateEnergy(): number {
    if (!this.dataArray) return 0;

    let sum = 0;
    for (let i = 0; i < this.dataArray.length; i++) {
      sum += this.dataArray[i] * this.dataArray[i];
    }

    return Math.sqrt(sum) / this.dataArray.length / 255;
  }

  /**
   * Check if voice is present
   */
  isVoicePresent(): boolean {
    const bands = this.getFrequencyBands();
    return this.voiceDetector.detectVoice(bands);
  }

  /**
   * Get spectrum data for visualization
   */
  getSpectrumData(): Uint8Array {
    if (!this.analyser || !this.dataArray) {
      return new Uint8Array(0);
    }

    this.analyser.getByteFrequencyData(this.dataArray);
    return this.dataArray;
  }

  /**
   * Get waveform data
   */
  getWaveformData(): Uint8Array {
    if (!this.analyser) {
      return new Uint8Array(0);
    }

    const bufferLength = this.analyser.frequencyBinCount;
    const waveformData = new Uint8Array(bufferLength);
    this.analyser.getByteTimeDomainData(waveformData);
    return waveformData;
  }

  private getEmptyBands(): FrequencyBands {
    return {
      subBass: 0,
      bass: 0,
      lowMid: 0,
      mid: 0,
      highMid: 0,
      presence: 0,
      brilliance: 0,
    };
  }

  private getEmptyFeatures(): AudioFeatures {
    return {
      rms: 0,
      zcr: 0,
      spectralCentroid: 0,
      spectralRolloff: 0,
      onset: false,
      tempo: 0,
      energy: 0,
      loudness: 0,
    };
  }

  /**
   * Clean up resources
   */
  destroy(): void {
    if (this.source) {
      this.source.disconnect();
    }
    if (this.analyser) {
      this.analyser.disconnect();
    }
    if (this.audioContext) {
      this.audioContext.close();
    }
  }
}

/**
 * Tempo Detector
 */
class TempoDetector {
  private beatTimes: number[] = [];
  private maxBeats: number = 20;
  private currentTempo: number = 0;

  recordBeat(time: number): void {
    this.beatTimes.push(time);
    
    if (this.beatTimes.length > this.maxBeats) {
      this.beatTimes.shift();
    }

    this.calculateTempo();
  }

  private calculateTempo(): void {
    if (this.beatTimes.length < 2) return;

    const intervals: number[] = [];
    for (let i = 1; i < this.beatTimes.length; i++) {
      intervals.push(this.beatTimes[i] - this.beatTimes[i - 1]);
    }

    // Average interval in milliseconds
    const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    
    // Convert to BPM
    this.currentTempo = 60000 / avgInterval;
  }

  getCurrentTempo(): number {
    return this.currentTempo;
  }
}

/**
 * Voice Activity Detector
 */
class VoiceActivityDetector {
  detectVoice(bands: FrequencyBands): boolean {
    // Voice typically has energy in mid frequencies (250-4000 Hz)
    const voiceEnergy = bands.lowMid + bands.mid + bands.highMid;
    const totalEnergy = Object.values(bands).reduce((a, b) => a + b, 0);

    if (totalEnergy === 0) return false;

    const voiceRatio = voiceEnergy / totalEnergy;
    return voiceRatio > 0.4 && voiceEnergy > 0.1;
  }
}

/**
 * Audio Reactive Engine
 */
export class AudioReactiveEngine {
  private analyzer: AdvancedAudioAnalyzer;
  private parameters: Map<string, AudioReactiveParameter> = new Map();

  constructor() {
    this.analyzer = new AdvancedAudioAnalyzer();
  }

  async initialize(audioElement: HTMLAudioElement): Promise<void> {
    await this.analyzer.initialize(audioElement);
  }

  /**
   * Add audio-reactive parameter
   */
  addParameter(id: string, parameter: AudioReactiveParameter): void {
    this.parameters.set(id, parameter);
  }

  /**
   * Remove audio-reactive parameter
   */
  removeParameter(id: string): void {
    this.parameters.delete(id);
  }

  /**
   * Update and get parameter values
   */
  getParameterValues(): Map<string, number> {
    const bands = this.analyzer.getFrequencyBands();
    const features = this.analyzer.getAudioFeatures();
    const values = new Map<string, number>();

    this.parameters.forEach((param, id) => {
      let value = 0;

      switch (param.audioSource) {
        case 'bass':
          value = (bands.subBass + bands.bass) / 2;
          break;
        case 'treble':
          value = (bands.presence + bands.brilliance) / 2;
          break;
        case 'mid':
          value = (bands.lowMid + bands.mid + bands.highMid) / 3;
          break;
        case 'volume':
          value = features.rms;
          break;
        case 'frequency':
          if (param.frequencyRange) {
            value = this.analyzer.getFrequencyBands().bass; // Simplified
          }
          break;
      }

      // Apply sensitivity
      value *= param.sensitivity;

      // Map to range
      value = param.min + value * (param.max - param.min);

      // Invert if needed
      if (param.invert) {
        value = param.max - (value - param.min);
      }

      values.set(id, value);
    });

    return values;
  }

  /**
   * Get analyzer instance
   */
  getAnalyzer(): AdvancedAudioAnalyzer {
    return this.analyzer;
  }

  /**
   * Destroy engine
   */
  destroy(): void {
    this.analyzer.destroy();
  }
}

/**
 * Audio Reactive Presets
 */
export const AudioReactivePresets = {
  bassScale: {
    targetProperty: 'scale',
    audioSource: 'bass' as const,
    sensitivity: 2,
    smoothing: 0.3,
    min: 1,
    max: 1.5,
    invert: false,
  },
  
  volumeOpacity: {
    targetProperty: 'opacity',
    audioSource: 'volume' as const,
    sensitivity: 1.5,
    smoothing: 0.2,
    min: 0.3,
    max: 1,
    invert: false,
  },
  
  trebleRotation: {
    targetProperty: 'rotation',
    audioSource: 'treble' as const,
    sensitivity: 360,
    smoothing: 0.1,
    min: 0,
    max: 360,
    invert: false,
  },
  
  midColorHue: {
    targetProperty: 'hue',
    audioSource: 'mid' as const,
    sensitivity: 180,
    smoothing: 0.5,
    min: 0,
    max: 360,
    invert: false,
  },
};
