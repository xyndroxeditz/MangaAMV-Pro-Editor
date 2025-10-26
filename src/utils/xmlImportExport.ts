import { XMLParser, XMLBuilder } from 'fast-xml-parser';
import { Project, Layer, XMLProject, XMLLayer, XMLEffect, BlendMode } from '../types/index';

export class XMLImportExport {
  private parser: XMLParser;
  private builder: XMLBuilder;

  constructor() {
    this.parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_',
    });
    
    this.builder = new XMLBuilder({
      ignoreAttributes: false,
      attributeNamePrefix: '@_',
      format: true,
    });
  }

  /**
   * Import Alight Motion XML project
   */
  async importAlightMotionXML(xmlString: string): Promise<Project> {
    const parsed = this.parser.parse(xmlString);
    const amProject = parsed.AlightMotionProject;

    const project: Project = {
      id: Date.now().toString(),
      name: amProject['@_name'] || 'Imported Project',
      createdAt: new Date(),
      modifiedAt: new Date(),
      duration: parseFloat(amProject['@_duration'] || '60'),
      fps: parseInt(amProject['@_fps'] || '60'),
      width: parseInt(amProject['@_width'] || '1920'),
      height: parseInt(amProject['@_height'] || '1080'),
      layers: this.convertAMLayersToLayers(amProject.layers?.layer || []),
      timeline: {
        currentTime: 0,
        duration: parseFloat(amProject['@_duration'] || '60'),
        zoom: 1,
        bpm: 128,
        isPlaying: false,
        loop: false,
        selectedLayerIds: [],
      },
      audioTracks: [],
    };

    return project;
  }

  /**
   * Import After Effects JSON project
   */
  async importAfterEffectsJSON(jsonString: string): Promise<Project> {
    const aeProject = JSON.parse(jsonString);

    const project: Project = {
      id: Date.now().toString(),
      name: aeProject.name || 'AE Import',
      createdAt: new Date(),
      modifiedAt: new Date(),
      duration: aeProject.duration || 60,
      fps: aeProject.frameRate || 60,
      width: aeProject.width || 1920,
      height: aeProject.height || 1080,
      layers: this.convertAELayersToLayers(aeProject.layers || []),
      timeline: {
        currentTime: 0,
        duration: aeProject.duration || 60,
        zoom: 1,
        bpm: 128,
        isPlaying: false,
        loop: false,
        selectedLayerIds: [],
      },
      audioTracks: [],
    };

    return project;
  }

  /**
   * Import CapCut template
   */
  async importCapCutTemplate(jsonString: string): Promise<Project> {
    const capCutProject = JSON.parse(jsonString);

    const project: Project = {
      id: Date.now().toString(),
      name: capCutProject.name || 'CapCut Import',
      createdAt: new Date(),
      modifiedAt: new Date(),
      duration: capCutProject.duration || 60,
      fps: 60,
      width: 1920,
      height: 1080,
      layers: this.convertCapCutTracks(capCutProject.tracks || []),
      timeline: {
        currentTime: 0,
        duration: capCutProject.duration || 60,
        zoom: 1,
        bpm: 128,
        isPlaying: false,
        loop: false,
        selectedLayerIds: [],
      },
      audioTracks: [],
    };

    return project;
  }

  /**
   * Export project to Alight Motion XML
   */
  exportToAlightMotionXML(project: Project): string {
    const amProject = {
      AlightMotionProject: {
        '@_version': '2.0',
        '@_name': project.name,
        '@_width': project.width,
        '@_height': project.height,
        '@_fps': project.fps,
        '@_duration': project.duration,
        layers: {
          layer: project.layers.map(layer => this.convertLayerToAM(layer)),
        },
      },
    };

    return this.builder.build(amProject);
  }

  /**
   * Export project to After Effects JSON
   */
  exportToAfterEffectsJSON(project: Project): string {
    const aeProject = {
      version: '1.0',
      name: project.name,
      width: project.width,
      height: project.height,
      frameRate: project.fps,
      duration: project.duration,
      layers: project.layers.map(layer => this.convertLayerToAE(layer)),
    };

    return JSON.stringify(aeProject, null, 2);
  }

  /**
   * Convert Alight Motion layers to internal format
   */
  private convertAMLayersToLayers(amLayers: any[]): Layer[] {
    return amLayers.map((amLayer, index) => ({
      id: amLayer['@_id'] || `layer_${index}`,
      name: amLayer['@_name'] || `Layer ${index + 1}`,
      type: this.detectLayerType(amLayer['@_type']),
      trackIndex: index % 5,
      startTime: parseFloat(amLayer['@_startTime'] || '0'),
      duration: parseFloat(amLayer['@_duration'] || '5'),
      visible: amLayer['@_visible'] !== 'false',
      locked: amLayer['@_locked'] === 'true',
      transform: this.parseTransform(amLayer.transform || {}),
      effects: this.parseEffects(amLayer.effects?.effect || []),
      blendMode: amLayer['@_blendMode'] || 'normal',
      opacity: parseFloat(amLayer['@_opacity'] || '1'),
      source: amLayer['@_source'],
    }));
  }

  /**
   * Convert After Effects layers to internal format
   */
  private convertAELayersToLayers(aeLayers: any[]): Layer[] {
    return aeLayers.map((aeLayer, index) => ({
      id: aeLayer.id || `layer_${index}`,
      name: aeLayer.name || `Layer ${index + 1}`,
      type: this.detectLayerType(aeLayer.type),
      trackIndex: index % 5,
      startTime: aeLayer.inPoint || 0,
      duration: (aeLayer.outPoint || 5) - (aeLayer.inPoint || 0),
      visible: aeLayer.enabled !== false,
      locked: aeLayer.locked === true,
      transform: this.parseAETransform(aeLayer.transform || {}),
      effects: this.parseAEEffects(aeLayer.effects || []),
      blendMode: aeLayer.blendMode || 'normal',
      opacity: aeLayer.opacity || 1,
      source: aeLayer.source,
    }));
  }

  /**
   * Convert CapCut tracks to internal layers
   */
  private convertCapCutTracks(tracks: any[]): Layer[] {
    const layers: Layer[] = [];
    tracks.forEach((track, trackIndex) => {
      track.segments?.forEach((segment: any, segmentIndex: number) => {
        layers.push({
          id: `${trackIndex}_${segmentIndex}`,
          name: segment.name || `Segment ${segmentIndex + 1}`,
          type: this.detectLayerType(segment.type),
          trackIndex: trackIndex,
          startTime: segment.start || 0,
          duration: segment.duration || 5,
          visible: true,
          locked: false,
          transform: this.parseCapCutTransform(segment.transform || {}),
          effects: [],
          blendMode: BlendMode.NORMAL,
          opacity: segment.opacity || 1,
          source: segment.source,
        });
      });
    });
    return layers;
  }

  /**
   * Convert internal layer to Alight Motion format
   */
  private convertLayerToAM(layer: Layer): any {
    return {
      '@_id': layer.id,
      '@_name': layer.name,
      '@_type': layer.type,
      '@_startTime': layer.startTime,
      '@_duration': layer.duration,
      '@_visible': layer.visible,
      '@_locked': layer.locked,
      '@_blendMode': layer.blendMode,
      '@_opacity': layer.opacity,
      '@_source': layer.source || '',
      transform: {
        '@_x': layer.transform.x,
        '@_y': layer.transform.y,
        '@_z': layer.transform.z,
        '@_scaleX': layer.transform.scaleX,
        '@_scaleY': layer.transform.scaleY,
        '@_rotationZ': layer.transform.rotationZ,
      },
      effects: {
        effect: layer.effects.map(effect => ({
          '@_name': effect.name,
          '@_enabled': effect.enabled,
          parameters: effect.parameters,
        })),
      },
    };
  }

  /**
   * Convert internal layer to After Effects format
   */
  private convertLayerToAE(layer: Layer): any {
    return {
      id: layer.id,
      name: layer.name,
      type: layer.type,
      inPoint: layer.startTime,
      outPoint: layer.startTime + layer.duration,
      enabled: layer.visible,
      locked: layer.locked,
      blendMode: layer.blendMode,
      opacity: layer.opacity,
      source: layer.source || '',
      transform: {
        position: [layer.transform.x, layer.transform.y, layer.transform.z],
        scale: [layer.transform.scaleX * 100, layer.transform.scaleY * 100],
        rotation: layer.transform.rotationZ,
      },
      effects: layer.effects.map(effect => ({
        name: effect.name,
        enabled: effect.enabled,
        parameters: effect.parameters,
      })),
    };
  }

  /**
   * Helper methods
   */
  private detectLayerType(type: string): any {
    const typeMap: Record<string, string> = {
      video: 'video',
      image: 'image',
      text: 'text',
      shape: 'shape',
      audio: 'audio',
      '3d': '3d_model',
      model: '3d_model',
    };
    return typeMap[type?.toLowerCase()] || 'image';
  }

  private parseTransform(transform: any): any {
    return {
      x: parseFloat(transform['@_x'] || '0'),
      y: parseFloat(transform['@_y'] || '0'),
      z: parseFloat(transform['@_z'] || '0'),
      scaleX: parseFloat(transform['@_scaleX'] || '1'),
      scaleY: parseFloat(transform['@_scaleY'] || '1'),
      scaleZ: parseFloat(transform['@_scaleZ'] || '1'),
      rotationX: parseFloat(transform['@_rotationX'] || '0'),
      rotationY: parseFloat(transform['@_rotationY'] || '0'),
      rotationZ: parseFloat(transform['@_rotationZ'] || '0'),
      anchorX: parseFloat(transform['@_anchorX'] || '0'),
      anchorY: parseFloat(transform['@_anchorY'] || '0'),
      skewX: parseFloat(transform['@_skewX'] || '0'),
      skewY: parseFloat(transform['@_skewY'] || '0'),
    };
  }

  private parseAETransform(transform: any): any {
    const pos = transform.position || [0, 0, 0];
    const scale = transform.scale || [100, 100];
    return {
      x: pos[0] || 0,
      y: pos[1] || 0,
      z: pos[2] || 0,
      scaleX: (scale[0] || 100) / 100,
      scaleY: (scale[1] || 100) / 100,
      scaleZ: 1,
      rotationX: 0,
      rotationY: 0,
      rotationZ: transform.rotation || 0,
      anchorX: 0,
      anchorY: 0,
      skewX: 0,
      skewY: 0,
    };
  }

  private parseCapCutTransform(transform: any): any {
    return {
      x: transform.x || 0,
      y: transform.y || 0,
      z: 0,
      scaleX: transform.scale || 1,
      scaleY: transform.scale || 1,
      scaleZ: 1,
      rotationX: 0,
      rotationY: 0,
      rotationZ: transform.rotation || 0,
      anchorX: 0,
      anchorY: 0,
      skewX: 0,
      skewY: 0,
    };
  }

  private parseEffects(effects: any[]): any[] {
    return effects.map((effect, index) => ({
      id: `effect_${index}`,
      name: effect['@_name'] || 'Effect',
      category: 'transition',
      enabled: effect['@_enabled'] !== 'false',
      parameters: effect.parameters || {},
    }));
  }

  private parseAEEffects(effects: any[]): any[] {
    return effects.map((effect, index) => ({
      id: `effect_${index}`,
      name: effect.name || 'Effect',
      category: 'transition',
      enabled: effect.enabled !== false,
      parameters: effect.parameters || {},
    }));
  }
}

export default new XMLImportExport();
