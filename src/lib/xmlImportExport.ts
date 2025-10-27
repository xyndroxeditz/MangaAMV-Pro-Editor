/**
 * XML Import/Export System for MangaAMV Pro Editor
 * Supports: Alight Motion, After Effects, CapCut
 */

export interface XMLProject {
  version: string;
  name: string;
  width: number;
  height: number;
  fps: number;
  duration: number;
  layers: XMLLayer[];
  effects: XMLEffect[];
  audioTracks: XMLAudioTrack[];
}

export interface XMLLayer {
  id: string;
  name: string;
  type: 'video' | 'image' | 'text' | '3d' | 'shape';
  startTime: number;
  duration: number;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  opacity: number;
  blendMode: string;
  effects: XMLEffect[];
  keyframes: XMLKeyframe[];
  source?: string;
  text?: string;
  model?: string;
}

export interface XMLEffect {
  id: string;
  name: string;
  type: string;
  enabled: boolean;
  parameters: Record<string, any>;
  keyframes?: XMLKeyframe[];
}

export interface XMLKeyframe {
  time: number;
  property: string;
  value: any;
  easing: string;
}

export interface XMLAudioTrack {
  id: string;
  name: string;
  source: string;
  startTime: number;
  duration: number;
  volume: number;
  effects: XMLEffect[];
}

export class XMLImportExport {
  /**
   * Import Alight Motion XML project
   */
  async importAlightMotion(xmlString: string): Promise<XMLProject> {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
    
    const project: XMLProject = {
      version: xmlDoc.querySelector('project')?.getAttribute('version') || '1.0',
      name: xmlDoc.querySelector('project name')?.textContent || 'Imported Project',
      width: parseInt(xmlDoc.querySelector('project width')?.textContent || '1920'),
      height: parseInt(xmlDoc.querySelector('project height')?.textContent || '1080'),
      fps: parseInt(xmlDoc.querySelector('project fps')?.textContent || '30'),
      duration: parseFloat(xmlDoc.querySelector('project duration')?.textContent || '0'),
      layers: [],
      effects: [],
      audioTracks: []
    };

    // Parse layers
    const layerElements = xmlDoc.querySelectorAll('layer');
    layerElements.forEach((layerEl, index) => {
      const layer: XMLLayer = {
        id: layerEl.getAttribute('id') || `layer_${index}`,
        name: layerEl.querySelector('name')?.textContent || `Layer ${index + 1}`,
        type: (layerEl.getAttribute('type') as any) || 'video',
        startTime: parseFloat(layerEl.querySelector('startTime')?.textContent || '0'),
        duration: parseFloat(layerEl.querySelector('duration')?.textContent || '0'),
        x: parseFloat(layerEl.querySelector('transform x')?.textContent || '0'),
        y: parseFloat(layerEl.querySelector('transform y')?.textContent || '0'),
        scale: parseFloat(layerEl.querySelector('transform scale')?.textContent || '1'),
        rotation: parseFloat(layerEl.querySelector('transform rotation')?.textContent || '0'),
        opacity: parseFloat(layerEl.querySelector('opacity')?.textContent || '1'),
        blendMode: layerEl.querySelector('blendMode')?.textContent || 'normal',
        effects: [],
        keyframes: [],
        source: layerEl.querySelector('source')?.textContent || undefined
      };

      // Parse layer effects
      const effectElements = layerEl.querySelectorAll('effect');
      effectElements.forEach((effectEl, effIndex) => {
        const effect: XMLEffect = {
          id: effectEl.getAttribute('id') || `effect_${effIndex}`,
          name: effectEl.querySelector('name')?.textContent || 'Unknown Effect',
          type: effectEl.getAttribute('type') || 'unknown',
          enabled: effectEl.getAttribute('enabled') !== 'false',
          parameters: this.parseEffectParameters(effectEl)
        };
        layer.effects.push(effect);
      });

      // Parse keyframes
      const keyframeElements = layerEl.querySelectorAll('keyframe');
      keyframeElements.forEach(kfEl => {
        const keyframe: XMLKeyframe = {
          time: parseFloat(kfEl.getAttribute('time') || '0'),
          property: kfEl.getAttribute('property') || 'unknown',
          value: kfEl.getAttribute('value') || '',
          easing: kfEl.getAttribute('easing') || 'linear'
        };
        layer.keyframes.push(keyframe);
      });

      project.layers.push(layer);
    });

    // Parse audio tracks
    const audioElements = xmlDoc.querySelectorAll('audio');
    audioElements.forEach((audioEl, index) => {
      const audioTrack: XMLAudioTrack = {
        id: audioEl.getAttribute('id') || `audio_${index}`,
        name: audioEl.querySelector('name')?.textContent || `Audio ${index + 1}`,
        source: audioEl.querySelector('source')?.textContent || '',
        startTime: parseFloat(audioEl.querySelector('startTime')?.textContent || '0'),
        duration: parseFloat(audioEl.querySelector('duration')?.textContent || '0'),
        volume: parseFloat(audioEl.querySelector('volume')?.textContent || '1'),
        effects: []
      };
      project.audioTracks.push(audioTrack);
    });

    return project;
  }

  /**
   * Export to Alight Motion XML format
   */
  exportToAlightMotion(project: XMLProject): string {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += `<project version="${project.version}">\n`;
    xml += `  <name>${project.name}</name>\n`;
    xml += `  <width>${project.width}</width>\n`;
    xml += `  <height>${project.height}</height>\n`;
    xml += `  <fps>${project.fps}</fps>\n`;
    xml += `  <duration>${project.duration}</duration>\n`;
    xml += `  <layers>\n`;

    project.layers.forEach(layer => {
      xml += `    <layer id="${layer.id}" type="${layer.type}">\n`;
      xml += `      <name>${layer.name}</name>\n`;
      xml += `      <startTime>${layer.startTime}</startTime>\n`;
      xml += `      <duration>${layer.duration}</duration>\n`;
      xml += `      <transform>\n`;
      xml += `        <x>${layer.x}</x>\n`;
      xml += `        <y>${layer.y}</y>\n`;
      xml += `        <scale>${layer.scale}</scale>\n`;
      xml += `        <rotation>${layer.rotation}</rotation>\n`;
      xml += `      </transform>\n`;
      xml += `      <opacity>${layer.opacity}</opacity>\n`;
      xml += `      <blendMode>${layer.blendMode}</blendMode>\n`;
      
      if (layer.source) {
        xml += `      <source>${layer.source}</source>\n`;
      }

      if (layer.effects.length > 0) {
        xml += `      <effects>\n`;
        layer.effects.forEach(effect => {
          xml += `        <effect id="${effect.id}" type="${effect.type}" enabled="${effect.enabled}">\n`;
          xml += `          <name>${effect.name}</name>\n`;
          xml += `          <parameters>\n`;
          Object.entries(effect.parameters).forEach(([key, value]) => {
            xml += `            <${key}>${value}</${key}>\n`;
          });
          xml += `          </parameters>\n`;
          xml += `        </effect>\n`;
        });
        xml += `      </effects>\n`;
      }

      if (layer.keyframes.length > 0) {
        xml += `      <keyframes>\n`;
        layer.keyframes.forEach(kf => {
          xml += `        <keyframe time="${kf.time}" property="${kf.property}" value="${kf.value}" easing="${kf.easing}"/>\n`;
        });
        xml += `      </keyframes>\n`;
      }

      xml += `    </layer>\n`;
    });

    xml += `  </layers>\n`;

    if (project.audioTracks.length > 0) {
      xml += `  <audioTracks>\n`;
      project.audioTracks.forEach(audio => {
        xml += `    <audio id="${audio.id}">\n`;
        xml += `      <name>${audio.name}</name>\n`;
        xml += `      <source>${audio.source}</source>\n`;
        xml += `      <startTime>${audio.startTime}</startTime>\n`;
        xml += `      <duration>${audio.duration}</duration>\n`;
        xml += `      <volume>${audio.volume}</volume>\n`;
        xml += `    </audio>\n`;
      });
      xml += `  </audioTracks>\n`;
    }

    xml += `</project>\n`;
    return xml;
  }

  /**
   * Import After Effects JSON
   */
  async importAfterEffects(jsonString: string): Promise<XMLProject> {
    const aeProject = JSON.parse(jsonString);
    
    const project: XMLProject = {
      version: '1.0',
      name: aeProject.name || 'AE Import',
      width: aeProject.width || 1920,
      height: aeProject.height || 1080,
      fps: aeProject.frameRate || 30,
      duration: aeProject.duration || 0,
      layers: [],
      effects: [],
      audioTracks: []
    };

    // Convert AE layers to our format
    if (aeProject.layers) {
      aeProject.layers.forEach((aeLayer: any, index: number) => {
        const layer: XMLLayer = {
          id: `ae_layer_${index}`,
          name: aeLayer.name || `Layer ${index + 1}`,
          type: this.mapAELayerType(aeLayer.type),
          startTime: aeLayer.inPoint || 0,
          duration: (aeLayer.outPoint || 0) - (aeLayer.inPoint || 0),
          x: aeLayer.transform?.position?.[0] || 0,
          y: aeLayer.transform?.position?.[1] || 0,
          scale: aeLayer.transform?.scale?.[0] / 100 || 1,
          rotation: aeLayer.transform?.rotation || 0,
          opacity: aeLayer.transform?.opacity / 100 || 1,
          blendMode: aeLayer.blendMode || 'normal',
          effects: [],
          keyframes: []
        };

        // Convert AE effects
        if (aeLayer.effects) {
          aeLayer.effects.forEach((aeEffect: any, effIndex: number) => {
            const effect: XMLEffect = {
              id: `ae_effect_${effIndex}`,
              name: aeEffect.name || 'Unknown Effect',
              type: aeEffect.matchName || 'unknown',
              enabled: aeEffect.enabled !== false,
              parameters: aeEffect.parameters || {}
            };
            layer.effects.push(effect);
          });
        }

        project.layers.push(layer);
      });
    }

    return project;
  }

  /**
   * Import CapCut template
   */
  async importCapCut(jsonString: string): Promise<XMLProject> {
    const capcut = JSON.parse(jsonString);
    
    const project: XMLProject = {
      version: '1.0',
      name: capcut.title || 'CapCut Import',
      width: capcut.resolution?.width || 1920,
      height: capcut.resolution?.height || 1080,
      fps: capcut.fps || 30,
      duration: capcut.duration || 0,
      layers: [],
      effects: [],
      audioTracks: []
    };

    // Convert CapCut tracks to layers
    if (capcut.tracks) {
      capcut.tracks.forEach((track: any, trackIndex: number) => {
        if (track.segments) {
          track.segments.forEach((segment: any, segIndex: number) => {
            const layer: XMLLayer = {
              id: `cc_layer_${trackIndex}_${segIndex}`,
              name: segment.name || `Layer ${trackIndex}-${segIndex}`,
              type: track.type === 'video' ? 'video' : 'image',
              startTime: segment.startTime || 0,
              duration: segment.duration || 0,
              x: segment.x || 0,
              y: segment.y || 0,
              scale: segment.scale || 1,
              rotation: segment.rotation || 0,
              opacity: segment.opacity || 1,
              blendMode: segment.blendMode || 'normal',
              effects: [],
              keyframes: [],
              source: segment.source
            };

            // Convert CapCut effects
            if (segment.effects) {
              segment.effects.forEach((ccEffect: any, effIndex: number) => {
                const effect: XMLEffect = {
                  id: `cc_effect_${effIndex}`,
                  name: ccEffect.name || 'Unknown Effect',
                  type: ccEffect.type || 'unknown',
                  enabled: ccEffect.enabled !== false,
                  parameters: ccEffect.params || {}
                };
                layer.effects.push(effect);
              });
            }

            project.layers.push(layer);
          });
        }
      });
    }

    return project;
  }

  /**
   * Export project as downloadable XML file
   */
  downloadXML(project: XMLProject, filename: string = 'project.xml'): void {
    const xmlString = this.exportToAlightMotion(project);
    const blob = new Blob([xmlString], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * Parse effect parameters from XML element
   */
  private parseEffectParameters(effectEl: Element): Record<string, any> {
    const parameters: Record<string, any> = {};
    const paramElements = effectEl.querySelector('parameters')?.children;
    
    if (paramElements) {
      Array.from(paramElements).forEach(paramEl => {
        const key = paramEl.tagName;
        const value = paramEl.textContent || '';
        
        // Try to parse as number
        const numValue = parseFloat(value);
        parameters[key] = isNaN(numValue) ? value : numValue;
      });
    }

    return parameters;
  }

  /**
   * Map After Effects layer types to our types
   */
  private mapAELayerType(aeType: string): 'video' | 'image' | 'text' | '3d' | 'shape' {
    const typeMap: Record<string, any> = {
      'AVLayer': 'video',
      'TextLayer': 'text',
      'ShapeLayer': 'shape',
      'CameraLayer': '3d',
      'LightLayer': '3d'
    };
    return typeMap[aeType] || 'video';
  }

  /**
   * Validate XML project structure
   */
  validateProject(project: XMLProject): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!project.name) errors.push('Project name is required');
    if (project.width <= 0) errors.push('Invalid project width');
    if (project.height <= 0) errors.push('Invalid project height');
    if (project.fps <= 0) errors.push('Invalid frame rate');
    if (!project.layers || project.layers.length === 0) {
      errors.push('Project must have at least one layer');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}

export const xmlImportExport = new XMLImportExport();
