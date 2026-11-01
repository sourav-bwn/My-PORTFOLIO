import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';

export type RoomName = 'hub' | 'portfolio' | 'gallery' | 'studio' | 'contact';

export interface EngineCallbacks {
  onDoorClick?: (room: RoomName) => void;
  onPosterClick?: (id: string) => void;
  onLockChange?: (locked: boolean) => void;
}

const PLAYER_HEIGHT = 1.6;
const RADIUS = 0.3;
const SPEED = 5;
const SPRINT = 1.8;

const BOUNDS: Record<RoomName, { minX: number; maxX: number; minZ: number; maxZ: number }> = {
  hub: { minX: -9.7, maxX: 9.7, minZ: -9.7, maxZ: 9.7 },
  portfolio: { minX: -7.7, maxX: 7.7, minZ: -5.7, maxZ: 5.7 },
  gallery: { minX: -7.7, maxX: 7.7, minZ: -5.7, maxZ: 5.7 },
  studio: { minX: -7.7, maxX: 7.7, minZ: -5.7, maxZ: 5.7 },
  contact: { minX: -7.7, maxX: 7.7, minZ: -5.7, maxZ: 5.7 },
};

const SPAWNS: Record<RoomName, [number, number]> = {
  hub: [0, 0],
  portfolio: [0, 2],
  gallery: [0, 2],
  studio: [0, 2],
  contact: [0, 2],
};

export interface RoomData {
  name: string;
  id: string;
}

function makeBox(w: number, h: number, d: number, color: string, x: number, y: number, z: number, outline = true): THREE.Group {
  const g = new THREE.Group();
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), new THREE.MeshStandardMaterial({ color }));
  mesh.position.set(x, y, z);
  g.add(mesh);
  if (outline) {
    const edges = new THREE.EdgesGeometry(new THREE.BoxGeometry(w, h, d));
    const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: '#000', transparent: true, opacity: 0.15 }));
    line.position.copy(mesh.position);
    g.add(line);
  }
  return g;
}

function makePlane(w: number, h: number, color: string, x: number, y: number, z: number, rotX = 0, rotY = 0): THREE.Group {
  const g = new THREE.Group();
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshStandardMaterial({ color, side: THREE.DoubleSide }));
  mesh.position.set(x, y, z);
  mesh.rotation.x = rotX;
  mesh.rotation.y = rotY;
  g.add(mesh);
  const edges = new THREE.EdgesGeometry(new THREE.PlaneGeometry(w, h));
  const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: '#000' }));
  line.position.copy(mesh.position);
  line.rotation.copy(mesh.rotation);
  g.add(line);
  return g;
}

function makeLabel(text: string, x: number, y: number, z: number, size = 0.4): THREE.Sprite {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, 512, 128);
  ctx.font = `bold ${Math.round(size * 120)}px Caveat, Comic Sans MS, cursive`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#222';
  ctx.fillText(text, 256, 64);
  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  const mat = new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false });
  const sprite = new THREE.Sprite(mat);
  sprite.position.set(x, y, z);
  sprite.scale.set(size * 3, size * 0.75, 1);
  return sprite;
}

export class ThreeEngine {
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private controls: PointerLockControls;
  private raycaster = new THREE.Raycaster();
  private pointer = new THREE.Vector2();

  private roomGroup = new THREE.Group();
  private interactables: { obj: THREE.Object3D; type: string; data: string }[] = [];
  private callbacks: EngineCallbacks = {};
  private currentRoom: RoomName = 'hub';
  private keys = new Set<string>();
  private locked = false;
  private animId = 0;
  private clock = new THREE.Clock();

  constructor(canvas: HTMLCanvasElement) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor('#e8e0d0');

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#e8e0d0');

    this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 100);
    this.camera.position.set(0, PLAYER_HEIGHT, 0);

    this.controls = new PointerLockControls(this.camera, document.body);

    // Lights live for the whole session; adding them per room teleport made the
    // scene brighter with every door click.
    this.scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const dl = new THREE.DirectionalLight(0xffffff, 0.5);
    dl.position.set(5, 10, 5);
    this.scene.add(dl);
    const dl2 = new THREE.DirectionalLight(0xffffff, 0.3);
    dl2.position.set(-5, 5, -5);
    this.scene.add(dl2);

    this.buildRoom('hub');

    document.addEventListener('keydown', this.onKeyDown);
    document.addEventListener('keyup', this.onKeyUp);
    canvas.addEventListener('click', this.onClick);
    canvas.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('resize', this.onResize);
    document.addEventListener('pointerlockchange', this.onLockChange);

    this.animate();
  }

  private onLockChange = () => {
    this.locked = document.pointerLockElement !== null;
    this.callbacks.onLockChange?.(this.locked);
    if (!this.locked) document.body.style.cursor = 'default';
  };

  private onKeyDown = (e: KeyboardEvent) => {
    this.keys.add(e.code);
    if (e.code === 'Escape' && this.locked) document.exitPointerLock();
    if (e.code === 'KeyH' && this.currentRoom !== 'hub') this.callbacks.onDoorClick?.('hub');
  };

  private onKeyUp = (e: KeyboardEvent) => { this.keys.delete(e.code); };

  private onClick = () => {
    if (!this.locked) {
      this.controls.lock();
      return;
    }
    this.raycaster.setFromCamera(new THREE.Vector2(0, 0), this.camera);
    const hits = this.raycaster.intersectObjects(this.interactables.map(i => i.obj), true);
    if (hits.length > 0) {
      for (const hit of hits) {
        const item = this.interactables.find(i => {
          let obj: THREE.Object3D | null = hit.object;
          while (obj) {
            if (obj === i.obj) return true;
            obj = obj.parent;
          }
          return false;
        });
        if (item) {
          if (item.type === 'door') this.callbacks.onDoorClick?.(item.data as RoomName);
          else if (item.type === 'poster') this.callbacks.onPosterClick?.(item.data);
          return;
        }
      }
    }
  };

  private onMouseMove = () => {
    if (!this.locked) return;
    this.raycaster.setFromCamera(new THREE.Vector2(0, 0), this.camera);
    const hits = this.raycaster.intersectObjects(this.interactables.map(i => i.obj), true);
    const hitInteractable = hits.length > 0 && this.interactables.some(i => {
      let obj: THREE.Object3D | null = hits[0].object;
      while (obj) { if (obj === i.obj) return true; obj = obj.parent; }
      return false;
    });
    document.body.style.cursor = hitInteractable ? 'pointer' : 'crosshair';
  };

  private onResize = () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  };

  private animate = () => {
    this.animId = requestAnimationFrame(this.animate);
    const delta = Math.min(this.clock.getDelta(), 0.05);
    if (this.locked) this.updateMovement(delta);
    this.renderer.render(this.scene, this.camera);
  };

  private updateMovement(delta: number) {
    const forward = new THREE.Vector3();
    this.camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();
    const right = new THREE.Vector3();
    right.crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();
    const dir = new THREE.Vector3();
    if (this.keys.has('KeyW')) dir.add(forward);
    if (this.keys.has('KeyS')) dir.sub(forward);
    if (this.keys.has('KeyD')) dir.add(right);
    if (this.keys.has('KeyA')) dir.sub(right);
    if (dir.lengthSq() > 0) dir.normalize();
    const speed = SPEED * (this.keys.has('ShiftLeft') || this.keys.has('ShiftRight') ? SPRINT : 1);
    dir.multiplyScalar(speed * delta);
    const nx = this.camera.position.x + dir.x;
    const nz = this.camera.position.z + dir.z;
    const b = BOUNDS[this.currentRoom];
    this.camera.position.x = Math.max(b.minX, Math.min(b.maxX, nx));
    this.camera.position.z = Math.max(b.minZ, Math.min(b.maxZ, nz));
  }

  private buildRoom(name: RoomName) {
    while (this.roomGroup.children.length) {
      this.roomGroup.remove(this.roomGroup.children[0]);
    }
    this.interactables = [];
    this.currentRoom = name;

    const objs = name === 'hub' ? this.buildHub() :
      name === 'portfolio' ? this.buildPortfolio() :
      name === 'gallery' ? this.buildGallery() :
      name === 'studio' ? this.buildStudio() :
      this.buildContact();
    objs.forEach(o => this.roomGroup.add(o));
    this.scene.add(this.roomGroup);

    // Spawn
    const s = SPAWNS[name];
    this.camera.position.set(s[0], PLAYER_HEIGHT, s[1]);
  }

  private addDoor(x: number, y: number, z: number, rotY: number, label: string, room: RoomName) {
    const door = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1.2, 2.4, 0.1), new THREE.MeshStandardMaterial({ color: '#3d2b1f' }));
    mesh.position.set(0, 0, 0);
    door.add(mesh);
    const edges = new THREE.EdgesGeometry(new THREE.BoxGeometry(1.2, 2.4, 0.1));
    door.add(new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: '#000' })));
    const knob = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), new THREE.MeshStandardMaterial({ color: '#888' }));
    knob.position.set(0.55, -0.3, 0.06);
    door.add(knob);
    door.position.set(x, y, z);
    door.rotation.y = rotY;
    this.interactables.push({ obj: mesh, type: 'door', data: room });
    const labelSprite = makeLabel(label, x, y + 1.6, z, 0.35);
    return [door, labelSprite];
  }

  private buildHub(): THREE.Object3D[] {
    const r: THREE.Object3D[] = [];
    r.push(makeBox(20, 0.2, 20, '#d4c5a9', 0, -0.1, 0));
    r.push(makeBox(20, 0.2, 20, '#e8e0d0', 0, 4, 0));
    r.push(makeBox(20, 4, 0.2, '#e8e0d0', 0, 2, -10));
    r.push(makeBox(20, 4, 0.2, '#e8e0d0', 0, 2, 10));
    r.push(makeBox(0.2, 4, 20, '#e8e0d0', 10, 2, 0));
    r.push(makeBox(0.2, 4, 20, '#e8e0d0', -10, 2, 0));

    const rug = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), new THREE.MeshStandardMaterial({ color: '#c4b59a', side: THREE.DoubleSide }));
    rug.rotation.x = -Math.PI / 2;
    rug.position.set(0, 0.01, 0);
    r.push(rug);

    r.push(makeLabel('sketch portfolio', 0, 3.3, 0, 0.45));
    r.push(makeLabel('choose a door', 0, 2.7, 0, 0.2));

    r.push(...this.addDoor(0, 0, -9.5, 0, 'Portfolio', 'portfolio'));
    r.push(...this.addDoor(9.5, 0, 0, Math.PI / 2, 'The Gallery', 'gallery'));
    r.push(...this.addDoor(0, 0, 9.5, Math.PI, 'The Studio', 'studio'));
    r.push(...this.addDoor(-9.5, 0, 0, -Math.PI / 2, 'Contact', 'contact'));
    return r;
  }

  private buildPortfolio(): THREE.Object3D[] {
    const r: THREE.Object3D[] = [];
    const wallColor = '#b8a88a';
    r.push(makeBox(16, 0.2, 12, '#c4b59a', 0, -0.1, 0));
    r.push(makeBox(16, 4, 0.2, wallColor, 0, 2, -6));
    r.push(makeBox(16, 4, 0.2, '#c4b59a', 0, 2, 6));
    r.push(makeBox(0.2, 4, 12, '#c4b59a', 8, 2, 0));
    r.push(makeBox(0.2, 4, 12, '#c4b59a', -8, 2, 0));
    r.push(makeBox(16, 0.2, 12, '#d4c5a9', 0, 4, 0));

    // Clothesline posts
    r.push(makeBox(0.06, 2.5, 0.06, '#555', -6, 1.55, -5.5));
    r.push(makeBox(0.06, 2.5, 0.06, '#555', 6, 1.55, -5.5));
    // Clothesline
    const line = new THREE.Mesh(new THREE.BoxGeometry(12, 0.02, 0.02), new THREE.MeshStandardMaterial({ color: '#666' }));
    line.position.set(0, 2.8, -5.48);
    r.push(line);

    const posters = [
      { x: -3, title: 'Weather App', id: '1' },
      { x: 0, title: 'Task Manager', id: '2' },
      { x: 3, title: 'Synth Wave', id: '3' },
    ];
    for (const p of posters) {
      const poster = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 1.0), new THREE.MeshStandardMaterial({ color: '#f5f5f0', side: THREE.DoubleSide }));
      poster.position.set(p.x, 1.6, -5.35);
      poster.rotation.x = (Math.random() - 0.5) * 0.04;
      r.push(poster);
      const edge = new THREE.EdgesGeometry(new THREE.PlaneGeometry(0.8, 1.0));
      const lineM = new THREE.LineSegments(edge, new THREE.LineBasicMaterial({ color: '#000' }));
      lineM.position.copy(poster.position);
      lineM.rotation.copy(poster.rotation);
      r.push(lineM);
      this.interactables.push({ obj: poster, type: 'poster', data: p.id });
      r.push(makeLabel(p.title, p.x, 1.0, -5.3, 0.12));
    }
    r.push(makeLabel('projects', 0, 3.5, -5.5, 0.25));
    return r;
  }

  private buildGallery(): THREE.Object3D[] {
    const r: THREE.Object3D[] = [];
    r.push(makeBox(16, 0.2, 12, '#2c2c2c', 0, -0.1, 0));
    r.push(makeBox(16, 4, 0.2, '#f0ede6', 0, 2, -6));
    r.push(makeBox(16, 4, 0.2, '#f0ede6', 0, 2, 6));
    r.push(makeBox(0.2, 4, 12, '#f0ede6', 8, 2, 0));
    r.push(makeBox(0.2, 4, 12, '#f0ede6', -8, 2, 0));
    r.push(makeBox(16, 0.2, 12, '#fff', 0, 4, 0));
    const frames = [
      { x: -3, label: 'Abstract #1' },
      { x: 0, label: 'Abstract #2' },
      { x: 3, label: 'Abstract #3' },
    ];
    for (const f of frames) {
      r.push(makeBox(1.6, 2.0, 0.08, '#3d2b1f', f.x, 1.5, -5.8));
      r.push(makePlane(1.4, 1.8, '#f5f5f0', f.x, 1.5, -5.7));
      r.push(makeLabel(f.label, f.x, 0.3, -5.7, 0.15));
    }
    r.push(makeLabel('The Gallery', 0, 3.5, -5.5, 0.3));
    return r;
  }

  private buildStudio(): THREE.Object3D[] {
    const r: THREE.Object3D[] = [];
    r.push(makeBox(16, 0.2, 12, '#8b7355', 0, -0.1, 0));
    r.push(makeBox(16, 4, 0.2, '#f5f0e8', 0, 2, -6));
    r.push(makeBox(16, 4, 0.2, '#f5f0e8', 0, 2, 6));
    r.push(makeBox(0.2, 4, 12, '#f5f0e8', 8, 2, 0));
    r.push(makeBox(0.2, 4, 12, '#f5f0e8', -8, 2, 0));
    r.push(makeBox(16, 0.2, 12, '#f5f0e8', 0, 4, 0));
    // Desk
    r.push(makeBox(3, 0.1, 1.5, '#5c4033', 0, 0.7, 0));
    // Monitor
    r.push(makeBox(0.8, 0.6, 0.05, '#333', 0, 1.1, -0.2));
    // Keyboard
    r.push(makeBox(0.6, 0.02, 0.2, '#222', 0, 0.75, 0.3));
    // Coffee cup
    const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.06, 0.15, 8), new THREE.MeshStandardMaterial({ color: '#ddd' }));
    cup.position.set(1.2, 0.85, 0.5);
    r.push(cup);
    // Bookshelf
    r.push(makeBox(3, 2.5, 0.3, '#5c4033', 0, 1.5, -5.8));
    const colors = ['#444', '#666', '#888', '#555', '#777'];
    for (let row = 0; row < 2; row++) {
      for (let i = 0; i < 4; i++) {
        r.push(makeBox(0.3, 0.5, 0.2, colors[(row * 4 + i) % 5], -1 + i * 0.6, 0.6 + row * 0.6, -5.6));
      }
    }
    r.push(makeLabel('The Studio', 0, 3.5, -5.5, 0.3));
    return r;
  }

  private buildContact(): THREE.Object3D[] {
    const r: THREE.Object3D[] = [];
    r.push(makeBox(16, 0.2, 12, '#f5f5f0', 0, -0.1, 0));
    r.push(makeBox(16, 4, 0.2, '#e8e0d0', 0, 2, -6));
    r.push(makeBox(16, 4, 0.2, '#e8e0d0', 0, 2, 6));
    r.push(makeBox(0.2, 4, 12, '#e8e0d0', 8, 2, 0));
    r.push(makeBox(0.2, 4, 12, '#e8e0d0', -8, 2, 0));
    r.push(makeBox(16, 0.2, 12, '#e8e0d0', 0, 4, 0));
    r.push(makeLabel('Contact', 0, 2.8, -5.5, 0.4));
    const cards = [
      { y: 1.8, text: 'email@example.com' },
      { y: 1.2, text: '@username' },
      { y: 0.6, text: 'github.com/user' },
    ];
    for (const c of cards) {
      r.push(makePlane(1.5, 0.4, '#fff', 0, c.y, -5.5));
      r.push(makeLabel(c.text, 0, c.y, -5.4, 0.13));
    }
    // Bench
    r.push(makeBox(1.5, 0.3, 0.6, '#5c4033', 0, 0.15, 2));
    r.push(makeBox(0.1, 0.4, 0.1, '#5c4033', -0.6, -0.05, 1.7));
    r.push(makeBox(0.1, 0.4, 0.1, '#5c4033', 0.6, -0.05, 1.7));
    return r;
  }

  setCallbacks(cbs: EngineCallbacks) { this.callbacks = cbs; }

  teleportTo(room: RoomName) {
    this.buildRoom(room);
  }

  dispose() {
    cancelAnimationFrame(this.animId);
    document.removeEventListener('keydown', this.onKeyDown);
    document.removeEventListener('keyup', this.onKeyUp);
    this.renderer.domElement.removeEventListener('click', this.onClick);
    this.renderer.domElement.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('resize', this.onResize);
    document.removeEventListener('pointerlockchange', this.onLockChange);
    this.controls.unlock();
    this.renderer.dispose();
  }

  get isLocked() { return this.locked; }
}
