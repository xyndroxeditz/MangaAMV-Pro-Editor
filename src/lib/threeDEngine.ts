/**
 * Three.js 3D Engine for MangaAMV Pro Editor
 * Handles 3D models, camera controls, lighting, and rendering
 */

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export interface Model3D {
  id: string;
  name: string;
  mesh: THREE.Group | THREE.Mesh;
  position: THREE.Vector3;
  rotation: THREE.Euler;
  scale: THREE.Vector3;
  animations?: THREE.AnimationClip[];
  mixer?: THREE.AnimationMixer;
}

export interface CameraSettings {
  type: 'perspective' | 'orthographic';
  fov: number;
  position: THREE.Vector3;
  lookAt: THREE.Vector3;
  zoom: number;
}

export interface LightingConfig {
  ambient: { color: number; intensity: number };
  directional: { color: number; intensity: number; position: THREE.Vector3 };
  rim: { color: number; intensity: number; angle: number };
}

export class ThreeDEngine {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera | THREE.OrthographicCamera;
  private renderer: THREE.WebGLRenderer;
  private controls?: OrbitControls;
  private models: Map<string, Model3D>;
  private gltfLoader: GLTFLoader;
  private clock: THREE.Clock;
  private lights: {
    ambient?: THREE.AmbientLight;
    directional?: THREE.DirectionalLight;
    rim?: THREE.DirectionalLight;
  };

  constructor(canvas: HTMLCanvasElement, width: number, height: number) {
    // Initialize scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000);

    // Initialize camera
    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    this.camera.position.set(0, 0, 5);

    // Initialize renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Initialize controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;

    // Initialize loaders
    this.gltfLoader = new GLTFLoader();
    this.models = new Map();
    this.clock = new THREE.Clock();
    this.lights = {};

    // Setup default lighting
    this.setupAnimeStyleLighting();
  }

  /**
   * Setup anime-style rim lighting
   */
  setupAnimeStyleLighting(): void {
    // Ambient light
    this.lights.ambient = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(this.lights.ambient);

    // Main directional light
    this.lights.directional = new THREE.DirectionalLight(0xffffff, 1.0);
    this.lights.directional.position.set(5, 5, 5);
    this.lights.directional.castShadow = true;
    this.scene.add(this.lights.directional);

    // Rim light (anime style)
    this.lights.rim = new THREE.DirectionalLight(0xaaffff, 0.8);
    this.lights.rim.position.set(-5, 3, -5);
    this.scene.add(this.lights.rim);
  }

  /**
   * Load 3D model from GLTF/GLB file
   */
  async loadModel(url: string, id: string, name: string): Promise<Model3D> {
    return new Promise((resolve, reject) => {
      this.gltfLoader.load(
        url,
        (gltf) => {
          const model: Model3D = {
            id,
            name,
            mesh: gltf.scene,
            position: new THREE.Vector3(0, 0, 0),
            rotation: new THREE.Euler(0, 0, 0),
            scale: new THREE.Vector3(1, 1, 1),
            animations: gltf.animations
          };

          // Setup animation mixer if animations exist
          if (gltf.animations.length > 0) {
            model.mixer = new THREE.AnimationMixer(gltf.scene);
            const action = model.mixer.clipAction(gltf.animations[0]);
            action.play();
          }

          // Enable shadows
          gltf.scene.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              child.castShadow = true;
              child.receiveShadow = true;
            }
          });

          this.scene.add(model.mesh);
          this.models.set(id, model);
          resolve(model);
        },
        undefined,
        (error) => {
          console.error('Error loading 3D model:', error);
          reject(error);
        }
      );
    });
  }

  /**
   * Create 3D extruded text (Kanji support)
   */
  createExtrudedText(
    text: string,
    options: {
      size?: number;
      depth?: number;
      bevel?: number;
      material?: THREE.MeshStandardMaterial;
    } = {}
  ): THREE.Mesh {
    const {
      size = 1,
      depth = 0.5,
      bevel = 0.1,
      material = new THREE.MeshStandardMaterial({ color: 0xffffff })
    } = options;

    // Create text geometry
    const loader = new THREE.FontLoader();
    const shapes = loader.parse(JSON.stringify({
      /* Font data would go here */
    }));

    const geometry = new THREE.ExtrudeGeometry(shapes as any, {
      depth,
      bevelEnabled: true,
      bevelThickness: bevel,
      bevelSize: bevel,
      bevelSegments: 5
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    this.scene.add(mesh);

    return mesh;
  }

  /**
   * Create parallax effect from 2D layers
   */
  createParallaxLayers(
    layers: Array<{ image: string; depth: number }>,
    speed: number = 1.0
  ): void {
    const textureLoader = new THREE.TextureLoader();

    layers.forEach((layer, index) => {
      textureLoader.load(layer.image, (texture) => {
        const geometry = new THREE.PlaneGeometry(10, 10);
        const material = new THREE.MeshBasicMaterial({
          map: texture,
          transparent: true
        });
        const mesh = new THREE.Mesh(geometry, material);
        
        // Position based on depth
        mesh.position.z = -layer.depth;
        this.scene.add(mesh);
      });
    });
  }

  /**
   * Update model transform
   */
  updateModel(
    id: string,
    transform: {
      position?: THREE.Vector3;
      rotation?: THREE.Euler;
      scale?: THREE.Vector3;
    }
  ): void {
    const model = this.models.get(id);
    if (!model) return;

    if (transform.position) {
      model.mesh.position.copy(transform.position);
      model.position = transform.position;
    }
    if (transform.rotation) {
      model.mesh.rotation.copy(transform.rotation);
      model.rotation = transform.rotation;
    }
    if (transform.scale) {
      model.mesh.scale.copy(transform.scale);
      model.scale = transform.scale;
    }
  }

  /**
   * Camera controls: Orbit mode
   */
  setCameraOrbit(radius: number, speed: number, axis: 'x' | 'y' | 'z' = 'y'): void {
    if (!this.controls) return;
    
    this.controls.enableRotate = true;
    this.controls.autoRotate = true;
    this.controls.autoRotateSpeed = speed;
    this.controls.minDistance = radius * 0.5;
    this.controls.maxDistance = radius * 2;
  }

  /**
   * Camera controls: Fly mode
   */
  setCameraFly(path: THREE.Vector3[], duration: number): void {
    // Implement camera path animation
    const curve = new THREE.CatmullRomCurve3(path);
    const points = curve.getPoints(50);
    
    let currentPoint = 0;
    const animate = () => {
      if (currentPoint < points.length) {
        this.camera.position.copy(points[currentPoint]);
        this.camera.lookAt(points[Math.min(currentPoint + 1, points.length - 1)]);
        currentPoint++;
        requestAnimationFrame(animate);
      }
    };
    animate();
  }

  /**
   * Camera controls: Dolly zoom (Vertigo effect)
   */
  setDollyZoom(amount: number, duration: number): void {
    const startFOV = (this.camera as THREE.PerspectiveCamera).fov;
    const targetFOV = startFOV * amount;
    const startPosition = this.camera.position.clone();
    
    let progress = 0;
    const animate = () => {
      progress += 0.016 / duration; // Assuming 60fps
      if (progress < 1) {
        (this.camera as THREE.PerspectiveCamera).fov = THREE.MathUtils.lerp(
          startFOV,
          targetFOV,
          progress
        );
        this.camera.position.z = THREE.MathUtils.lerp(
          startPosition.z,
          startPosition.z * (1 / amount),
          progress
        );
        this.camera.updateProjectionMatrix();
        requestAnimationFrame(animate);
      }
    };
    animate();
  }

  /**
   * Apply anime-style post-processing
   */
  applyAnimeStyle(): void {
    // Add outline effect (cel-shading)
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;
  }

  /**
   * Render frame
   */
  render(): void {
    const delta = this.clock.getDelta();

    // Update animation mixers
    this.models.forEach(model => {
      if (model.mixer) {
        model.mixer.update(delta);
      }
    });

    // Update controls
    if (this.controls) {
      this.controls.update();
    }

    this.renderer.render(this.scene, this.camera);
  }

  /**
   * Start render loop
   */
  startRenderLoop(): void {
    const animate = () => {
      requestAnimationFrame(animate);
      this.render();
    };
    animate();
  }

  /**
   * Resize renderer
   */
  resize(width: number, height: number): void {
    if (this.camera instanceof THREE.PerspectiveCamera) {
      this.camera.aspect = width / height;
    }
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  /**
   * Get renderer canvas
   */
  getCanvas(): HTMLCanvasElement {
    return this.renderer.domElement;
  }

  /**
   * Export scene as image
   */
  exportImage(): string {
    return this.renderer.domElement.toDataURL('image/png');
  }

  /**
   * Dispose resources
   */
  dispose(): void {
    this.models.forEach(model => {
      if (model.mesh) {
        this.scene.remove(model.mesh);
      }
    });
    this.models.clear();
    this.renderer.dispose();
    if (this.controls) {
      this.controls.dispose();
    }
  }
}

export default ThreeDEngine;
