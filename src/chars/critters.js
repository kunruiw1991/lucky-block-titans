// Friendly Bouncy Voxel Treasure Critters (Piggy, Honey Bee, Sunny Chick)
// Exclusive owner: lucky-chars. Zero CJK text, metalness <= 0.20, 3-draw-call InstancedMesh, 100% deterministic.

import * as THREE from '../../vendor/three.module.min.js';
import { CRITTER_TYPES } from '../data/catalog.js';
import {
  createSafeSpriteMaterial,
  getMatteVoxelMaterial,
  mergeVoxelBoxes,
} from './props3d.js';

const AMBIENT_CRITTER_SPAWNS = Object.freeze([
  Object.freeze({ kind: 'piggy', x: -12.5, z: 11.5 }),
  Object.freeze({ kind: 'piggy', x: -22.5, z: 13.5 }),
  Object.freeze({ kind: 'piggy', x: -14.5, z: 23.5 }),
  Object.freeze({ kind: 'bee', x: -10.5, z: 16.5 }),
  Object.freeze({ kind: 'bee', x: 12.5, z: 11.5 }),
  Object.freeze({ kind: 'bee', x: 22.5, z: 14.5 }),
  Object.freeze({ kind: 'chick', x: 11.5, z: 17.5 }),
  Object.freeze({ kind: 'chick', x: 15.5, z: 23.5 }),
  Object.freeze({ kind: 'chick', x: 23.5, z: 21.5 }),
]);

const CRITTER_KINDS = Object.freeze(['piggy', 'bee', 'chick']);
const MAX_PER_KIND = 12;
const MAX_CRITTERS = 24;
const PET_DURATION = 0.85;
const HEART_POOL_SIZE = 4;

const sharedCritterGeos = new Map();
let sharedHeartTex = null;

function round3(n) {
  return Math.round(n * 1000) / 1000;
}

function hashSeed(seed, idx) {
  let h = ((Number(seed) >>> 0) ^ Math.imul(idx + 1, 0x9e3779b1)) >>> 0;
  h = Math.imul(h ^ (h >>> 16), 0x85ebca6b) >>> 0;
  h = Math.imul(h ^ (h >>> 13), 0xc2b2ae35) >>> 0;
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

function getHeartTexture() {
  if (sharedHeartTex) return sharedHeartTex;
  if (typeof document === 'undefined' || typeof document.createElement !== 'function') {
    return null;
  }
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const c2d = canvas.getContext('2d');
  if (!c2d) return null;
  c2d.imageSmoothingEnabled = false;

  const grid = [
    '................',
    '..OOOO....OOOO..',
    '.ORRRRO..ORRRRO.',
    'ORRWWROOORRRRRRO',
    'ORRWWRRRRRRRRRRO',
    'ORRRRRRRRRRRRRRO',
    'ORRRRRRRRRRRRRRO',
    '.ORRRRRRRRRRRRO.',
    '..ORRRRRRRRRRO..',
    '...ORRRRRRRRO...',
    '....ORRRRRRO....',
    '.....ORRRRO.....',
    '......ORRO......',
    '.......OO.......',
    '................',
    '................',
  ];
  const pal = { O: '#590d22', R: '#ff4d6d', W: '#fff0f3' };
  for (let r = 0; r < 16; r++) {
    for (let c = 0; c < 16; c++) {
      const ch = grid[r][c];
      if (ch === '.') continue;
      c2d.fillStyle = pal[ch];
      c2d.fillRect(c * 4, r * 4, 4, 4);
    }
  }
  sharedHeartTex = new THREE.CanvasTexture(canvas);
  sharedHeartTex.magFilter = THREE.NearestFilter;
  sharedHeartTex.minFilter = THREE.NearestFilter;
  sharedHeartTex.colorSpace = THREE.SRGBColorSpace;
  return sharedHeartTex;
}

function getCritterGeometry(kind) {
  let geo = sharedCritterGeos.get(kind);
  if (geo) return geo;

  let boxes;
  if (kind === 'piggy') {
    boxes = [
      { s: [0.15, 0.16, 0.15], p: [-0.18, 0.08, 0.20], c: 0xf783ac },
      { s: [0.15, 0.16, 0.15], p: [0.18, 0.08, 0.20], c: 0xf783ac },
      { s: [0.15, 0.16, 0.15], p: [-0.18, 0.08, -0.22], c: 0xf783ac },
      { s: [0.15, 0.16, 0.15], p: [0.18, 0.08, -0.22], c: 0xf783ac },
      { s: [0.60, 0.44, 0.68], p: [0, 0.36, -0.02], c: 0xffa8c5 },
      { s: [0.22, 0.10, 0.18], p: [0, 0.60, -0.04], c: 0xff4d6d, glow: true },
      { s: [0.10, 0.14, 0.10], p: [0, 0.42, -0.40], r: [0.4, 0, 0], c: 0xf783ac },
      { s: [0.50, 0.42, 0.40], p: [0, 0.44, 0.36], c: 0xffb8d0 },
      { s: [0.26, 0.16, 0.12], p: [0, 0.37, 0.59], c: 0xff7597 },
      { s: [0.05, 0.06, 0.04], p: [-0.06, 0.38, 0.65], c: 0x590d22 },
      { s: [0.05, 0.06, 0.04], p: [0.06, 0.38, 0.65], c: 0x590d22 },
      { s: [0.12, 0.16, 0.10], p: [-0.26, 0.58, 0.34], r: [0, 0, 0.32], c: 0xf783ac },
      { s: [0.12, 0.16, 0.10], p: [0.26, 0.58, 0.34], r: [0, 0, -0.32], c: 0xf783ac },
      { s: [0.09, 0.11, 0.05], p: [-0.15, 0.49, 0.56], c: 0x182232 },
      { s: [0.09, 0.11, 0.05], p: [0.15, 0.49, 0.56], c: 0x182232 },
      { s: [0.04, 0.04, 0.05], p: [-0.14, 0.52, 0.57], c: 0xffffff, glow: true },
      { s: [0.04, 0.04, 0.05], p: [0.16, 0.52, 0.57], c: 0xffffff, glow: true },
    ];
  } else if (kind === 'bee') {
    boxes = [
      { s: [0.54, 0.46, 0.20], p: [0, 0.32, 0.22], c: 0xffd93d, glow: true },
      { s: [0.56, 0.48, 0.16], p: [0, 0.32, 0.04], c: 0x3b2314 },
      { s: [0.56, 0.48, 0.16], p: [0, 0.32, -0.12], c: 0xffd93d, glow: true },
      { s: [0.52, 0.44, 0.16], p: [0, 0.32, -0.28], c: 0x3b2314 },
      { s: [0.24, 0.22, 0.12], p: [0, 0.30, -0.40], c: 0xffb830 },
      { s: [0.05, 0.16, 0.10], p: [-0.12, 0.60, 0.28], r: [0.35, 0, 0.15], c: 0x3b2314 },
      { s: [0.05, 0.16, 0.10], p: [0.12, 0.60, 0.28], r: [0.35, 0, -0.15], c: 0x3b2314 },
      { s: [0.09, 0.11, 0.05], p: [-0.14, 0.36, 0.33], c: 0x182232 },
      { s: [0.09, 0.11, 0.05], p: [0.14, 0.36, 0.33], c: 0x182232 },
      { s: [0.04, 0.04, 0.05], p: [-0.13, 0.39, 0.34], c: 0xffffff, glow: true },
      { s: [0.04, 0.04, 0.05], p: [0.15, 0.39, 0.34], c: 0xffffff, glow: true },
      { s: [0.09, 0.06, 0.04], p: [-0.20, 0.26, 0.33], c: 0xff8fab },
      { s: [0.09, 0.06, 0.04], p: [0.20, 0.26, 0.33], c: 0xff8fab },
      { s: [0.38, 0.05, 0.26], p: [-0.28, 0.58, -0.02], r: [0.12, 0.18, 0.36], c: 0xe3fafc, glow: true },
      { s: [0.38, 0.05, 0.26], p: [0.28, 0.58, -0.02], r: [0.12, -0.18, -0.36], c: 0xe3fafc, glow: true },
    ];
  } else {
    boxes = [
      { s: [0.14, 0.10, 0.20], p: [-0.13, 0.05, 0.04], c: 0xff922b },
      { s: [0.14, 0.10, 0.20], p: [0.13, 0.05, 0.04], c: 0xff922b },
      { s: [0.50, 0.48, 0.50], p: [0, 0.34, 0], c: 0xfff07c, glow: true },
      { s: [0.10, 0.24, 0.28], p: [-0.29, 0.34, -0.02], r: [0, 0, 0.22], c: 0xffd43b },
      { s: [0.10, 0.24, 0.28], p: [0.29, 0.34, -0.02], r: [0, 0, -0.22], c: 0xffd43b },
      { s: [0.14, 0.14, 0.14], p: [0, 0.63, 0.04], r: [0.2, 0, 0], c: 0xffd43b },
      { s: [0.18, 0.14, 0.12], p: [0, 0.38, -0.28], r: [-0.3, 0, 0], c: 0xffe066 },
      { s: [0.18, 0.11, 0.15], p: [0, 0.34, 0.31], c: 0xff7b00 },
      { s: [0.08, 0.10, 0.05], p: [-0.14, 0.43, 0.26], c: 0x182232 },
      { s: [0.08, 0.10, 0.05], p: [0.14, 0.43, 0.26], c: 0x182232 },
      { s: [0.04, 0.04, 0.05], p: [-0.13, 0.46, 0.27], c: 0xffffff, glow: true },
      { s: [0.04, 0.04, 0.05], p: [0.15, 0.46, 0.27], c: 0xffffff, glow: true },
    ];
  }

  geo = mergeVoxelBoxes(boxes);
  geo.scale(1.42, 1.42, 1.42);
  geo.computeBoundingBox();
  geo.computeBoundingSphere();
  sharedCritterGeos.set(kind, geo);
  return geo;
}

export function createCritterManager(ctx = {}) {
  const group = new THREE.Group();
  group.name = 'critters_group';
  if (ctx && ctx.scene) {
    ctx.scene.add(group);
  }

  // 3 InstancedMeshes (1 per critter kind -> ALL critters across island take <= 3 draw calls!)
  const instancedByKind = new Map();
  for (let i = 0; i < CRITTER_KINDS.length; i++) {
    const k = CRITTER_KINDS[i];
    const im = new THREE.InstancedMesh(getCritterGeometry(k), getMatteVoxelMaterial(), MAX_PER_KIND);
    im.name = `critters_instanced_${k}`;
    im.castShadow = false;
    im.receiveShadow = false;
    im.frustumCulled = false;
    im.count = 0;
    im.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    im.userData = { interactKind: 'critter', kind: 'critter', critterKind: k };
    group.add(im);
    instancedByKind.set(k, im);
  }

  // Small pool of unlit Heart Sprites (visible ONLY during 0.85s pet bounce -> 0 idle draw calls!)
  const heartTex = getHeartTexture();
  const heartPool = [];
  for (let i = 0; i < HEART_POOL_SIZE; i++) {
    const sp = new THREE.Sprite(
      createSafeSpriteMaterial({
        map: heartTex || null,
        color: heartTex ? 0xffffff : 0xff4d6d,
        opacity: 1,
      })
    );
    sp.visible = false;
    group.add(sp);
    heartPool.push(sp);
  }

  const critters = [];
  const byId = new Map();
  let nextSeq = 1;
  let currentSeed = 2026;

  const _raySphere = new THREE.Sphere();
  const _hitPoint = new THREE.Vector3();
  const _parentMat = new THREE.Matrix4();
  const _localMat = new THREE.Matrix4();
  const _pos = new THREE.Vector3();
  const _quat = new THREE.Quaternion();
  const _euler = new THREE.Euler();
  const _scale = new THREE.Vector3();

  function resolveSurfacePosition(rawX, rawY, rawZ) {
    let x = Number(rawX) || 0;
    let z = Number(rawZ) || 0;
    let y = Number.isFinite(rawY) ? Number(rawY) : 1;

    const world = ctx?.world;
    if (world && typeof world.getGroundY === 'function') {
      const gy = world.getGroundY(x, z);
      if (Number.isFinite(gy) && gy > -50) {
        y = gy;
      } else if (typeof world.clampToWalkable === 'function') {
        const clamped = world.clampToWalkable(x, z);
        if (clamped) {
          x = clamped.x;
          y = Number.isFinite(clamped.y) ? clamped.y : 1;
          z = clamped.z;
        }
      }
    }
    return { x, y, z };
  }

  function removeCritterInternal(c) {
    byId.delete(c.id);
    const idx = critters.indexOf(c);
    if (idx !== -1) critters.splice(idx, 1);
  }

  function syncInstances(time = 0) {
    const counts = { piggy: 0, bee: 0, chick: 0 };
    let heartSlot = 0;

    for (let i = 0; i < critters.length; i++) {
      const c = critters[i];
      const slot = counts[c.kind];
      if (slot >= MAX_PER_KIND) continue;
      counts[c.kind] = slot + 1;

      _pos.set(c.x, c.y, c.z);
      _euler.set(0, c.yaw, 0);
      _quat.setFromEuler(_euler);
      _scale.set(1, 1, 1);
      _parentMat.compose(_pos, _quat, _scale);

      let popScale = 1.0;
      if (c.spawnPopTimer > 0) {
        const u = 1 - c.spawnPopTimer / 0.45;
        popScale = u < 0.7 ? (u / 0.7) * 1.18 : 1.18 - ((u - 0.7) / 0.3) * 0.18;
      }

      const baseHover = c.kind === 'bee' ? 0.38 + Math.sin(time * 6.5 + c.phase) * 0.12 : 0;

      if (c.petTimer > 0) {
        const p = 1 - c.petTimer / PET_DURATION;
        const arcY = Math.sin(p * Math.PI) * 1.42;
        const flipPitch = -p * Math.PI * 2;
        const stretch = 1 + Math.sin(p * Math.PI * 2) * 0.14;

        _pos.set(0, baseHover + arcY, 0);
        _euler.set(flipPitch, 0, 0);
        _quat.setFromEuler(_euler);
        _scale.set(
          popScale / Math.sqrt(stretch),
          popScale * stretch,
          popScale / Math.sqrt(stretch)
        );
        _localMat.compose(_pos, _quat, _scale);

        if (heartSlot < HEART_POOL_SIZE && c.petTimer > 0.02) {
          const sp = heartPool[heartSlot++];
          sp.visible = true;
          sp.position.set(c.x, c.y + 1.15 + p * 1.10, c.z);
          const hs = 0.55 + Math.sin(p * Math.PI) * 0.38;
          sp.scale.set(hs, hs, 1);
        }
      } else {
        const hopWave = Math.abs(Math.sin(time * 5.2 + c.phase));
        const hopY = c.kind === 'bee' ? 0 : hopWave * 0.16;
        const waddleRoll = Math.sin(time * (c.kind === 'bee' ? 14 : 5.2) + c.phase) * 0.09;

        _pos.set(0, baseHover + hopY, 0);
        _euler.set(0, 0, waddleRoll);
        _quat.setFromEuler(_euler);
        _scale.set(popScale, popScale, popScale);
        _localMat.compose(_pos, _quat, _scale);
      }

      _parentMat.multiply(_localMat);
      instancedByKind.get(c.kind).setMatrixAt(slot, _parentMat);
    }

    for (let i = heartSlot; i < HEART_POOL_SIZE; i++) {
      heartPool[i].visible = false;
    }

    for (let i = 0; i < CRITTER_KINDS.length; i++) {
      const k = CRITTER_KINDS[i];
      const im = instancedByKind.get(k);
      im.count = counts[k];
      im.visible = counts[k] > 0;
      im.instanceMatrix.needsUpdate = true;
    }
  }

  function spawnInternal(kind, rawX, rawY, rawZ, isAmbient = false) {
    const validKind = CRITTER_TYPES[kind] ? kind : 'piggy';
    const spec = CRITTER_TYPES[validKind];

    const sameKindCount = critters.filter((item) => item.kind === validKind).length;
    if (critters.length >= MAX_CRITTERS || sameKindCount >= MAX_PER_KIND) {
      const removable =
        critters.find((item) => item.kind === validKind && !item.ambient) ||
        critters.find((item) => !item.ambient) ||
        critters.find((item) => item.kind === validKind);
      if (removable) removeCritterInternal(removable);
    }

    const seq = nextSeq++;
    const id = `critter_${seq}`;
    const pos = resolveSurfacePosition(rawX, rawY, rawZ);
    const phase = hashSeed(currentSeed, seq) * Math.PI * 2;

    const c = {
      id,
      seq,
      kind: validKind,
      ambient: isAmbient,
      homeX: pos.x,
      homeZ: pos.z,
      x: pos.x,
      y: pos.y,
      z: pos.z,
      yaw: phase,
      phase,
      age: isAmbient ? 1.0 : 0.0,
      spawnPopTimer: isAmbient ? 0.0 : 0.45,
      petTimer: 0.0,
      petCount: 0,
      bonusGems: spec.bonusGems,
      voId: spec.voId,
    };

    critters.push(c);
    byId.set(id, c);
    syncInstances(0);

    return {
      id: c.id,
      kind: c.kind,
      x: round3(c.x),
      y: round3(c.y),
      z: round3(c.z),
      petCount: c.petCount,
      bonusGems: c.bonusGems,
      voId: c.voId,
    };
  }

  function spawn(kind, x = 0, y = 1, z = 0) {
    return spawnInternal(kind, x, y, z, false);
  }

  function pet(idOrObj) {
    const id = typeof idOrObj === 'string' ? idOrObj : idOrObj?.id;
    if (!id) return null;
    const c = byId.get(id);
    if (!c) return null;

    c.petTimer = PET_DURATION;
    c.petCount += 1;
    return {
      id: c.id,
      kind: c.kind,
      x: round3(c.x),
      y: round3(c.y),
      z: round3(c.z),
      petCount: c.petCount,
      bonusGems: c.bonusGems,
      voId: c.voId,
    };
  }

  function findNear(x, z, radius = 2.2) {
    const rSq = radius * radius;
    let best = null;
    let bestDistSq = rSq;

    for (let i = 0; i < critters.length; i++) {
      const c = critters[i];
      const dx = c.x - x;
      const dz = c.z - z;
      const dSq = dx * dx + dz * dz;
      if (dSq <= bestDistSq) {
        bestDistSq = dSq;
        best = c;
      }
    }

    if (!best) return null;
    return {
      id: best.id,
      kind: best.kind,
      x: round3(best.x),
      y: round3(best.y),
      z: round3(best.z),
      bonusGems: best.bonusGems,
      voId: best.voId,
      dist: Math.sqrt(bestDistSq),
    };
  }

  function raycast(raycaster) {
    if (!raycaster || critters.length === 0) return null;
    let closest = null;
    let bestDistance = Infinity;

    for (let i = 0; i < critters.length; i++) {
      const c = critters[i];
      const centerY = c.y + (c.kind === 'bee' ? 0.72 : 0.42);
      _raySphere.center.set(c.x, centerY, c.z);
      _raySphere.radius = 0.92;
      const hit = raycaster.ray.intersectSphere(_raySphere, _hitPoint);
      if (hit) {
        const dist = raycaster.ray.origin.distanceTo(_hitPoint);
        if (dist < bestDistance) {
          bestDistance = dist;
          closest = {
            kind: 'critter',
            id: c.id,
            critter: {
              id: c.id,
              kind: c.kind,
              x: round3(c.x),
              y: round3(c.y),
              z: round3(c.z),
              bonusGems: c.bonusGems,
              voId: c.voId,
            },
            point: _hitPoint.clone(),
            distance: dist,
          };
        }
      }
    }
    return closest;
  }

  function update(dt = 1 / 60, time = 0) {
    const stepDt = Math.max(0, Math.min(0.1, Number(dt) || 0));
    const t = Number(time) || 0;
    const world = ctx?.world;

    for (let i = 0; i < critters.length; i++) {
      const c = critters[i];
      c.age += stepDt;
      if (c.spawnPopTimer > 0) c.spawnPopTimer = Math.max(0, c.spawnPopTimer - stepDt);
      if (c.petTimer > 0) c.petTimer = Math.max(0, c.petTimer - stepDt);

      const wanderSpeed = c.kind === 'bee' ? 1.15 : 0.72;
      const wanderRadius = c.kind === 'bee' ? 1.65 : 1.35;
      const angle = c.phase + c.age * wanderSpeed;
      const targetX = c.homeX + Math.cos(angle) * wanderRadius;
      const targetZ = c.homeZ + Math.sin(angle * 0.85) * wanderRadius;

      let canStep = true;
      let groundY = c.y;
      if (world && typeof world.getGroundY === 'function') {
        const gy = world.getGroundY(targetX, targetZ);
        if (Number.isFinite(gy) && gy > -50 && Math.abs(gy - c.y) <= 1.2) {
          groundY = gy;
        } else {
          canStep = false;
          const curGy = world.getGroundY(c.x, c.z);
          if (Number.isFinite(curGy) && curGy > -50) groundY = curGy;
        }
      }

      if (canStep && c.petTimer <= 0) {
        const dx = targetX - c.x;
        const dz = targetZ - c.z;
        const moveAlpha = Math.min(1, stepDt * 3.5);
        c.x += dx * moveAlpha;
        c.z += dz * moveAlpha;
        if (dx * dx + dz * dz > 0.0001) {
          c.yaw = Math.atan2(dx, dz);
        }
      }
      c.y = groundY;
    }

    syncInstances(t);
  }

  function getSnapshot() {
    return critters.map((c) => ({
      id: c.id,
      kind: c.kind,
      x: round3(c.x),
      y: round3(c.y),
      z: round3(c.z),
      petCount: c.petCount,
      bouncing: c.petTimer > 0,
    }));
  }

  function reset(seed = 2026) {
    currentSeed = Number(seed) || 2026;
    critters.length = 0;
    byId.clear();
    nextSeq = 1;

    for (let i = 0; i < AMBIENT_CRITTER_SPAWNS.length; i++) {
      const s = AMBIENT_CRITTER_SPAWNS[i];
      const jitterX = (hashSeed(currentSeed, i * 2 + 11) - 0.5) * 1.2;
      const jitterZ = (hashSeed(currentSeed, i * 2 + 12) - 0.5) * 1.2;
      spawnInternal(s.kind, s.x + jitterX, 1, s.z + jitterZ, true);
    }
    syncInstances(0);
  }

  reset(ctx?.state?.seed ?? 2026);

  return {
    group,
    spawn,
    pet,
    findNear,
    raycast,
    update,
    getSnapshot,
    reset,
  };
}
