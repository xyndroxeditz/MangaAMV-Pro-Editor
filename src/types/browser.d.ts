/**
 * Type declarations for React Native compatible APIs
 * These provide TypeScript support for features that will be implemented
 * using React Native and Expo APIs
 */

declare global {
  // React Native compatible ImageData
  class ImageData {
    readonly data: Uint8ClampedArray;
    readonly width: number;
    readonly height: number;
    constructor(width: number, height: number);
    constructor(data: Uint8ClampedArray, width: number, height?: number);
  }

  // Audio APIs using expo-av
  class AudioContext {
    readonly sampleRate: number;
    readonly currentTime: number;
    createAnalyser(): AnalyserNode;
    createMediaElementSource(mediaElement: any): MediaElementAudioSourceNode;
    readonly destination: AudioDestinationNode;
    close(): Promise<void>;
  }

  class AnalyserNode {
    fftSize: number;
    readonly frequencyBinCount: number;
    smoothingTimeConstant: number;
    getByteFrequencyData(array: Uint8Array): void;
    getFloatFrequencyData(array: Float32Array): void;
    getByteTimeDomainData(array: Uint8Array): void;
    connect(destination: any): void;
    disconnect(): void;
  }

  class MediaElementAudioSourceNode {
    connect(destination: any): void;
    disconnect(): void;
  }

  class AudioDestinationNode {
    // Destination node
  }

  // Web Worker alternative for React Native
  class Worker {
    constructor(scriptURL: string);
    postMessage(message: any): void;
    onmessage: ((event: MessageEvent) => void) | null;
    onerror: ((event: ErrorEvent) => void) | null;
    terminate(): void;
  }

  interface MessageEvent {
    data: any;
  }

  interface ErrorEvent {
    message: string;
    filename?: string;
    lineno?: number;
    colno?: number;
  }
}

export {};