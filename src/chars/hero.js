// Chunky Chibi Voxel Explorer Hero with 6 Swappable 3D Weapons & Visible Legendary Gear
// Exclusive owner: lucky-chars. Zero CJK text, metalness <= 0.20, 100% deterministic.

import * as THREE from '../../vendor/three.module.min.js';
import { HUB_LAYOUT, WEAPON_ORDER, WEAPONS } from '../data/catalog.js';
import {
  buildBlazingHelmetMesh,
  buildKingCrownMesh,
  buildStarCapeMesh,
  buildVoxelGroup,
  buildWeaponMesh,
  buildWingedBootOverlay,
  createSafeSpriteMaterial,
} from './props3d.js';

function createGroundShadowTexture() {
  if (typeof document === 'undefined' || typeof document.createElement !== 'function') {
    return null;
  }
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const c2d = canvas.getContext('2d');
  if (!c2d) return null;
  const grad = c2d.createRadialGradient(32, 32, 4, 32, 32, 30);
  grad.addColorStop(0, 'rgba(15, 23, 42, 0.42)');
  grad.addColorStop(0.65, 'rgba(15, 23, 42, 0.18)');
  grad.addColorStop(1, 'rgba(15, 23, 42, 0.0)');
  c2d.fillStyle = grad;
  c2d.fillRect(0, 0, 64, 64);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createHero(ctx = {}) {
  const group = new THREE.Group();
  group.name = 'hero_root';

  const spawn = HUB_LAYOUT.spawn;
  const initYaw = Math.atan2(spawn.facingX - spawn.x, spawn.facingZ - spawn.z);
  group.position.set(spawn.x, spawn.y, spawn.z);
  group.rotation.y = initYaw;

  // Soft blob shadow ring on ground (unlit BasicMaterial, metalness undefined <= 0.20)
  const shadowTex = createGroundShadowTexture();
  let shadowDisc = null;
  if (shadowTex) {
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false,
      toneMapped: false,
      fog: false,
    });
    shadowDisc = new THREE.Mesh(new THREE.PlaneGeometry(1.25, 1.25), shadowMat);
    shadowDisc.rotation.x = -Math.PI * 0.5;
    shadowDisc.position.y = 0.03;
    shadowDisc.renderOrder = 1;
    group.add(shadowDisc);
  }

  // Articulated rig (height ~1.76 blocks)
  const bodyRig = new THREE.Group();
  bodyRig.name = 'hero_rig';
  group.add(bodyRig);

  // Left Leg (+X) & Right Leg (-X), hip pivot at y = 0.48
  const legBoxes = [
    { s: [0.23, 0.32, 0.25], p: [0, -0.16, 0], c: 0x2b4c7e },
    { s: [0.25, 0.17, 0.30], p: [0, -0.395, 0.03], c: 0x6e421b },
    { s: [0.26, 0.05, 0.31], p: [0, -0.46, 0.03], c: 0x3b230a },
  ];

  const legL = new THREE.Group();
  legL.name = 'hero_leg_l';
  legL.position.set(0.15, 0.48, 0);
  bodyRig.add(legL);
  const baseLegL = buildVoxelGroup(legBoxes, { name: 'hero_base_leg_l' });
  legL.add(baseLegL);

  const legR = new THREE.Group();
  legR.name = 'hero_leg_r';
  legR.position.set(-0.15, 0.48, 0);
  bodyRig.add(legR);
  const baseLegR = buildVoxelGroup(legBoxes, { name: 'hero_base_leg_r' });
  legR.add(baseLegR);

  // Zoomy Winged Speed Boots (replaces base leg mesh when equipped -> 0 extra draw calls!)
  const speedBootL = buildWingedBootOverlay(1);
  speedBootL.visible = false;
  legL.add(speedBootL);

  const speedBootR = buildWingedBootOverlay(-1);
  speedBootR.visible = false;
  legR.add(speedBootR);

  // Torso group (sky-blue adventurer hoodie, golden chest star, cozy belt)
  const torsoPivot = new THREE.Group();
  torsoPivot.name = 'hero_torso_pivot';
  torsoPivot.position.set(0, 0.48, 0);
  bodyRig.add(torsoPivot);

  const torsoMesh = buildVoxelGroup(
    [
      // Sky-blue hoodie torso
      { s: [0.56, 0.62, 0.34], p: [0, 0.33, 0], c: 0x29b6f6 },
      { s: [0.58, 0.12, 0.36], p: [0, 0.07, 0], c: 0x7c4d25 },
      { s: [0.16, 0.13, 0.38], p: [0, 0.07, 0.01], c: 0xffd43b, glow: true },
      // Cozy folded hood on upper back (-Z) & white hoodie strings (+Z)
      { s: [0.46, 0.18, 0.16], p: [0, 0.56, -0.20], c: 0x039be5 },
      { s: [0.06, 0.20, 0.05], p: [-0.10, 0.48, 0.18], c: 0xffffff },
      { s: [0.06, 0.20, 0.05], p: [0.10, 0.48, 0.18], c: 0xffffff },
      // Glowing golden chest star badge
      { s: [0.16, 0.16, 0.06], p: [0, 0.36, 0.17], r: [0, 0, 0.785], c: 0xffd43b, glow: true },
    ],
    {
      name: 'hero_torso',
      glowEmissive: 0xffc940,
      glowIntensity: 0.34,
    }
  );
  torsoPivot.add(torsoMesh);

  // Royal Rainbow Star Cape (hinged at shoulders on -Z)
  const capePivot = new THREE.Group();
  capePivot.name = 'hero_cape_pivot';
  capePivot.position.set(0, 0.62, -0.18);
  capePivot.rotation.x = 0.24;
  torsoPivot.add(capePivot);

  const starCapeMesh = buildStarCapeMesh();
  starCapeMesh.visible = false;
  capePivot.add(starCapeMesh);

  // Chibi Head (big expressive eyes & happy grin on +Z, readable from 3rd-person camera!)
  const headPivot = new THREE.Group();
  headPivot.name = 'hero_head_pivot';
  headPivot.position.set(0, 0.66, 0);
  torsoPivot.add(headPivot);

  const headMesh = buildVoxelGroup(
    [
      // Warm skin head block
      { s: [0.64, 0.58, 0.60], p: [0, 0.29, 0], c: 0xffd8b8 },
      // Chestnut-amber voxel hair cap, sideburns, back & bouncy top tuft
      { s: [0.68, 0.18, 0.64], p: [0, 0.54, -0.01], c: 0x8d5524 },
      { s: [0.68, 0.44, 0.16], p: [0, 0.34, -0.26], c: 0x7f4a1d },
      { s: [0.10, 0.28, 0.54], p: [-0.32, 0.38, -0.02], c: 0x8d5524 },
      { s: [0.10, 0.28, 0.54], p: [0.32, 0.38, -0.02], c: 0x8d5524 },
      { s: [0.54, 0.10, 0.12], p: [0, 0.48, 0.28], c: 0xa66a35 },
      { s: [0.22, 0.12, 0.20], p: [0.06, 0.66, 0.04], r: [0, 0, -0.18], c: 0xa66a35 },
      // Big expressive pixel eyes (+Z) + white sparkle catchlights
      { s: [0.13, 0.16, 0.05], p: [-0.15, 0.30, 0.30], c: 0x182232 },
      { s: [0.13, 0.16, 0.05], p: [0.15, 0.30, 0.30], c: 0x182232 },
      { s: [0.06, 0.06, 0.06], p: [-0.13, 0.34, 0.31], c: 0xffffff, glow: true },
      { s: [0.06, 0.06, 0.06], p: [0.17, 0.34, 0.31], c: 0xffffff, glow: true },
      // Cheerful eyebrows
      { s: [0.15, 0.05, 0.05], p: [-0.15, 0.42, 0.30], r: [0, 0, 0.08], c: 0x5c3412 },
      { s: [0.15, 0.05, 0.05], p: [0.15, 0.42, 0.30], r: [0, 0, -0.08], c: 0x5c3412 },
      // Rosy cheeks + sunny smile
      { s: [0.10, 0.07, 0.05], p: [-0.23, 0.21, 0.30], c: 0xff8fab },
      { s: [0.10, 0.07, 0.05], p: [0.23, 0.21, 0.30], c: 0xff8fab },
      { s: [0.20, 0.07, 0.05], p: [0, 0.15, 0.30], c: 0xd9480f },
      { s: [0.14, 0.04, 0.06], p: [0, 0.17, 0.305], c: 0xffffff },
    ],
    {
      name: 'hero_head',
      glowEmissive: 0xffffff,
      glowIntensity: 0.26,
    }
  );
  headPivot.add(headMesh);

  // Blazing Gold Titan Helmet & Finale King Crown
  const helmetMesh = buildBlazingHelmetMesh();
  helmetMesh.position.set(0, 0.28, 0);
  helmetMesh.visible = false;
  headPivot.add(helmetMesh);

  const crownMesh = buildKingCrownMesh();
  crownMesh.position.set(0, 0.60, 0);
  crownMesh.visible = false;
  headPivot.add(crownMesh);

  // Left Arm (+X) & Right Weapon Arm (-X)
  const armBoxes = [
    { s: [0.20, 0.34, 0.22], p: [0, -0.14, 0], c: 0x29b6f6 },
    { s: [0.22, 0.07, 0.24], p: [0, -0.30, 0], c: 0xffffff },
    { s: [0.18, 0.14, 0.19], p: [0, -0.39, 0], c: 0xffd8b8 },
  ];

  const armL = buildVoxelGroup(armBoxes, { name: 'hero_arm_l' });
  armL.position.set(0.38, 0.58, 0);
  armL.rotation.z = 0.10;
  torsoPivot.add(armL);

  const armR = buildVoxelGroup(armBoxes, { name: 'hero_arm_r' });
  armR.position.set(-0.38, 0.58, 0);
  armR.rotation.z = -0.10;
  torsoPivot.add(armR);

  // Right-hand Weapon Socket (angled slightly outward & forward so every weapon silhouette pops!)
  const weaponSocket = new THREE.Group();
  weaponSocket.name = 'hero_weapon_socket';
  weaponSocket.position.set(-0.06, -0.38, 0.12);
  weaponSocket.rotation.set(0.68, -0.22, -0.24);
  weaponSocket.scale.setScalar(1.18);
  armR.add(weaponSocket);

  // Pre-build & cache all 6 weapon models so swapping during Roulette is zero-alloc & instant
  const weaponMeshes = new Map();
  for (let i = 0; i < WEAPON_ORDER.length; i++) {
    const wid = WEAPON_ORDER[i];
    const wMesh = buildWeaponMesh(wid);
    wMesh.visible = wid === 'wood_stick';
    weaponSocket.add(wMesh);
    weaponMeshes.set(wid, wMesh);
  }

  // Cheer sparkle star sprite above head during cheers (toneMapped: false, fog: false)
  const cheerStarSprite = new THREE.Sprite(
    createSafeSpriteMaterial({ color: 0xffe066, opacity: 0.0 })
  );
  cheerStarSprite.scale.set(0.65, 0.65, 1);
  cheerStarSprite.position.set(0, 2.25, 0);
  cheerStarSprite.visible = false;
  group.add(cheerStarSprite);

  if (ctx && ctx.scene) {
    ctx.scene.add(group);
  }

  // Equipment & animation state (100% deterministic)
  const equipment = {
    weaponId: 'wood_stick',
    helmet: false,
    speedBoots: false,
    starCape: false,
    crown: false,
  };

  let walkPhase = 0;
  let swingTimer = 0;
  const SWING_DURATION = 0.30;
  let boingTimer = 0;
  const BOING_DURATION = 1.05;
  let cheerTimer = 0;
  const CHEER_DURATION = 1.10;
  let shieldFlashTimer = 0;

  function applyEquipmentVisuals() {
    for (const [wid, mesh] of weaponMeshes.entries()) {
      mesh.visible = wid === equipment.weaponId;
    }
    helmetMesh.visible = Boolean(equipment.helmet);
    const hasBoots = Boolean(equipment.speedBoots);
    baseLegL.visible = !hasBoots;
    baseLegR.visible = !hasBoots;
    speedBootL.visible = hasBoots;
    speedBootR.visible = hasBoots;
    if (!hasBoots) {
      speedBootL.rotation.y = 0;
      speedBootR.rotation.y = 0;
    }
    starCapeMesh.visible = Boolean(equipment.starCape);
    crownMesh.visible = Boolean(equipment.crown);
    crownMesh.position.y = equipment.helmet ? 0.72 : 0.60;
  }

  function setEquipment(patch = {}) {
    if (!patch || typeof patch !== 'object') return { ...equipment };
    if (patch.weaponId !== undefined && WEAPONS[patch.weaponId]) {
      equipment.weaponId = patch.weaponId;
    }
    if (patch.helmet !== undefined) equipment.helmet = Boolean(patch.helmet);
    if (patch.speedBoots !== undefined) equipment.speedBoots = Boolean(patch.speedBoots);
    if (patch.starCape !== undefined) equipment.starCape = Boolean(patch.starCape);
    if (patch.crown !== undefined) equipment.crown = Boolean(patch.crown);
    applyEquipmentVisuals();
    return { ...equipment };
  }

  function getEquipment() {
    return { ...equipment };
  }

  function triggerSwing() {
    swingTimer = SWING_DURATION;
  }

  function triggerBoing() {
    boingTimer = BOING_DURATION;
  }

  function triggerCheer() {
    cheerTimer = CHEER_DURATION;
  }

  function flashShield() {
    shieldFlashTimer = 0.24;
  }

  function update(dt = 1 / 60, time = 0, moveState = {}) {
    const stepDt = Math.max(0, Math.min(0.1, Number(dt) || 0));
    const t = Number(time) || 0;

    const fallbackPlayer = ctx?.state?.player;
    const x = moveState.x ?? fallbackPlayer?.x ?? group.position.x;
    const y = moveState.y ?? fallbackPlayer?.y ?? group.position.y;
    const z = moveState.z ?? fallbackPlayer?.z ?? group.position.z;
    const yaw = moveState.yaw ?? fallbackPlayer?.yaw ?? group.rotation.y;
    const speedRatio = Math.max(0, Math.min(2.0, Number(moveState.speedRatio ?? 0)));
    const isSwinging = Boolean(moveState.swinging) || swingTimer > 0;
    const isBoinging = Boolean(moveState.boinging) || boingTimer > 0;

    group.position.set(x, y, z);
    group.rotation.set(0, yaw, 0);

    if (swingTimer > 0) swingTimer = Math.max(0, swingTimer - stepDt);
    if (boingTimer > 0) boingTimer = Math.max(0, boingTimer - stepDt);
    if (cheerTimer > 0) cheerTimer = Math.max(0, cheerTimer - stepDt);
    if (shieldFlashTimer > 0) {
      shieldFlashTimer = Math.max(0, shieldFlashTimer - stepDt);
      const pulse = 1 + Math.sin((shieldFlashTimer / 0.24) * Math.PI) * 0.14;
      helmetMesh.scale.setScalar(pulse);
    } else {
      helmetMesh.scale.setScalar(1);
    }

    // Advance walk phase proportionally to movement speed
    if (speedRatio > 0.02) {
      const freq = 10.5 + speedRatio * 4.5;
      walkPhase += stepDt * freq;
    } else {
      walkPhase *= Math.max(0, 1 - stepDt * 10);
    }

    const stride = Math.min(1.25, speedRatio);
    const legSwing = Math.sin(walkPhase) * 0.78 * stride;
    const stepHop = speedRatio > 0.03 ? Math.abs(Math.sin(walkPhase)) * 0.11 * stride : 0;
    const idleBob = Math.sin(t * 3.4) * 0.025 * (1 - Math.min(1, stride));

    // Reset baseline rig transforms
    bodyRig.position.set(0, stepHop + idleBob, 0);
    bodyRig.rotation.set(stride * 0.09, 0, Math.cos(walkPhase) * 0.04 * stride);
    bodyRig.scale.set(1, 1, 1);

    legL.rotation.set(-legSwing, 0, 0);
    legR.rotation.set(legSwing, 0, 0);

    armL.rotation.set(legSwing * 0.85, 0, 0.12);
    armR.rotation.set(-0.30 - legSwing * 0.65, 0, -0.14);
    weaponSocket.rotation.set(0.68, -0.22, -0.24);

    torsoPivot.rotation.set(0, 0, 0);
    headPivot.rotation.set(
      Math.sin(t * 2.2) * 0.03,
      Math.sin(t * 1.5) * 0.05 * (1 - Math.min(1, stride)),
      0
    );

    // Cape & Speed Boot wing flutter
    if (equipment.starCape) {
      capePivot.rotation.x =
        0.24 +
        stride * 0.64 +
        (isBoinging ? 0.55 : 0) +
        Math.sin(t * (7 + stride * 9)) * (0.06 + stride * 0.14);
    }
    if (equipment.speedBoots) {
      const wingFlap = Math.sin(t * 16 + walkPhase * 1.5) * (0.06 + stride * 0.16);
      speedBootL.rotation.y = wingFlap;
      speedBootR.rotation.y = -wingFlap;
    }

    // Snappy weapon chop animation
    if (isSwinging) {
      const prog =
        swingTimer > 0
          ? 1 - swingTimer / SWING_DURATION
          : ((t * 3.2) % 1);
      if (prog < 0.28) {
        // Quick energetic windup overhead
        const u = prog / 0.28;
        armR.rotation.x = -0.30 - u * 1.85;
        armR.rotation.z = -0.12 - u * 0.22;
        weaponSocket.rotation.x = 0.96 - u * 0.25;
        torsoPivot.rotation.y = -u * 0.26;
      } else if (prog < 0.68) {
        // Juicy forward smash arc!
        const u = (prog - 0.28) / 0.40;
        const ease = 1 - Math.pow(1 - u, 3);
        armR.rotation.x = -2.15 + ease * 1.92;
        armR.rotation.z = -0.34 + ease * 0.26;
        weaponSocket.rotation.x = 0.71 + ease * 0.92;
        torsoPivot.rotation.y = -0.26 + ease * 0.52;
        bodyRig.scale.set(1 + Math.sin(u * Math.PI) * 0.07, 1 - Math.sin(u * Math.PI) * 0.06, 1 + Math.sin(u * Math.PI) * 0.07);
      } else {
        // Smooth follow-through settle
        const u = (prog - 0.68) / 0.32;
        armR.rotation.x = -0.23 * (1 - u) + -0.30 * u;
        weaponSocket.rotation.x = 1.63 * (1 - u) + 0.96 * u;
        torsoPivot.rotation.y = 0.26 * (1 - u);
      }
    }

    // Joyful Rainbow Cloud Boing mid-air pose (happy wave + tucked pedaling feet, zero hurt!)
    if (isBoinging) {
      const bp = boingTimer > 0 ? 1 - boingTimer / BOING_DURATION : (t * 2) % 1;
      bodyRig.rotation.y = Math.sin(bp * Math.PI * 2) * 0.45;
      bodyRig.rotation.z = Math.sin(t * 14) * 0.14;
      armL.rotation.set(-2.35 + Math.sin(t * 18) * 0.25, 0, 0.35);
      armR.rotation.set(-2.20 - Math.sin(t * 18) * 0.25, 0, -0.35);
      legL.rotation.x = -0.55 + Math.sin(t * 20) * 0.45;
      legR.rotation.x = -0.55 - Math.sin(t * 20) * 0.45;
      headPivot.rotation.x = -0.18;
    } else if (cheerTimer > 0) {
      // Celebratory double-hop + hands high cheer!
      const cp = 1 - cheerTimer / CHEER_DURATION;
      const hop = Math.abs(Math.sin(cp * Math.PI * 2)) * 0.42;
      bodyRig.position.y += hop;
      bodyRig.rotation.y = Math.sin(cp * Math.PI * 4) * 0.25;
      armL.rotation.set(-2.55, 0, 0.32 + Math.sin(t * 18) * 0.20);
      armR.rotation.set(-2.45, 0, -0.32 - Math.sin(t * 18) * 0.20);
      weaponSocket.rotation.x = 0.55;
      headPivot.rotation.x = -0.16;
    }

    // Keep shadow disc scaled subtly with hop height
    if (shadowDisc) {
      const hScale = Math.max(0.65, 1 - bodyRig.position.y * 0.35);
      shadowDisc.scale.set(hScale, hScale, 1);
    }
    cheerStarSprite.visible = false;
  }

  function reset() {
    walkPhase = 0;
    swingTimer = 0;
    boingTimer = 0;
    cheerTimer = 0;
    shieldFlashTimer = 0;
    equipment.weaponId = 'wood_stick';
    equipment.helmet = false;
    equipment.speedBoots = false;
    equipment.starCape = false;
    equipment.crown = false;
    applyEquipmentVisuals();
    group.position.set(spawn.x, spawn.y, spawn.z);
    group.rotation.set(0, initYaw, 0);
    bodyRig.position.set(0, 0, 0);
    bodyRig.rotation.set(0, 0, 0);
    bodyRig.scale.set(1, 1, 1);
  }

  applyEquipmentVisuals();

  return {
    group,
    weaponSocket,
    setEquipment,
    getEquipment,
    get equipment() {
      return { ...equipment };
    },
    triggerSwing,
    triggerBoing,
    triggerCheer,
    flashShield,
    update,
    reset,
  };
}
