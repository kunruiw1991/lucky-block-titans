// Kid-friendly 3rd-person follow camera with zero roll shake (owner: lucky-director).
// Strictly guarantees camera.rotation.z === 0 on every frame (Gate F12).
import * as THREE from '../../vendor/three.module.min.js';

export function createCameraController() {
  const aspect = Math.max(0.3, (window.innerWidth || 1280) / Math.max(1, window.innerHeight || 800));
  const camera = new THREE.PerspectiveCamera(48, aspect, 0.4, 150);
  camera.up.set(0, 1, 0);
  camera.rotation.order = 'YXZ'; // YXZ prevents roll coupling when pitching down!

  let yaw = 0; // Camera sits South (+Z) looking North (-Z) at start
  let targetYaw = 0;
  let dragCooldown = 0; // Seconds since last manual drag before gentle auto-ease
  let titleAngle = 0.28;
  let hopOffset = 0;
  let hopVel = 0;

  const focusPos = new THREE.Vector3(0, 2.2, 1.5);
  const desiredFocus = new THREE.Vector3();
  const desiredCam = new THREE.Vector3();

  function onResize(w, h) {
    camera.aspect = Math.max(0.3, w / Math.max(1, h));
    camera.updateProjectionMatrix();
  }

  function addYaw(deltaRad) {
    targetYaw += deltaRad;
    dragCooldown = 2.8;
  }

  function getYaw() {
    return yaw;
  }

  function setYaw(nextYaw, snap = false) {
    targetYaw = nextYaw;
    if (snap) yaw = nextYaw;
  }

  // Gentle vertical-only hop for bonk feel; NEVER rolls camera.rotation.z!
  function triggerHop(strength = 0.1) {
    hopVel = Math.min(1.6, Math.max(hopVel, strength * 12));
  }

  function update(dt, state, activeTitan = null) {
    const clampedDt = Math.min(0.05, Math.max(0, dt));

    // Spring-damper vertical micro-hop
    if (hopOffset !== 0 || hopVel !== 0) {
      hopOffset += hopVel * clampedDt;
      hopVel -= hopOffset * 110 * clampedDt;
      hopVel *= Math.exp(-14 * clampedDt);
      if (Math.abs(hopOffset) < 0.001 && Math.abs(hopVel) < 0.01) {
        hopOffset = 0;
        hopVel = 0;
      }
      hopOffset = Math.max(-0.12, Math.min(0.14, hopOffset));
    }

    const isPortrait = camera.aspect < 0.92;

    if (state.mode === 'title') {
      titleAngle += clampedDt * 0.22;
      const dist = isPortrait ? 16.5 : 13.8;
      const camX = Math.sin(titleAngle) * dist;
      const camZ = 2.0 + Math.cos(titleAngle) * dist;
      camera.position.set(camX, 8.6, camZ);
      camera.lookAt(0, 2.1, 0.2);
      camera.rotation.z = 0;
      return;
    }

    if (state.mode === 'victory') {
      titleAngle += clampedDt * 0.28;
      const dist = isPortrait ? 13.2 : 10.6;
      const camX = Math.sin(titleAngle * 0.6) * (dist * 0.35);
      const camZ = -4.2 + dist;
      camera.position.set(camX, 6.2 + hopOffset, camZ);
      camera.lookAt(0, 2.4 + hopOffset * 0.3, -6.2);
      camera.rotation.z = 0;
      return;
    }

    // Gentle idle yaw auto-ease behind hero movement after manual drag settles (P1-4)
    if (dragCooldown > 0) {
      dragCooldown = Math.max(0, dragCooldown - clampedDt);
    } else if (Math.hypot(state.player.vx || 0, state.player.vz || 0) > 1.5) {
      // Behind hero: hero moves along (vx, vz), so camera sits opposite (-vx, -vz)
      const desiredBehindYaw = Math.atan2(-state.player.vx, -state.player.vz);
      let diff = desiredBehindYaw - targetYaw;
      diff = Math.atan2(Math.sin(diff), Math.cos(diff));
      targetYaw += diff * Math.min(1, clampedDt * 1.15);
    }

    // Smooth yaw interpolation
    const yawDiff = targetYaw - yaw;
    yaw += yawDiff * Math.min(1, clampedDt * 12);

    const p = state.player;
    let baseDist = isPortrait ? 13.8 : 11.4;
    let baseHeight = isPortrait ? 8.6 : 7.3;
    let lookLift = 1.45;

    // Frame nearby Giant Titan cleanly so 5yo sees both Hero and Titan's funny face & crown below Boss Banner!
    if (activeTitan && !activeTitan.defeated) {
      const dx = activeTitan.x - p.x;
      const dz = activeTitan.z - p.z;
      const d = Math.hypot(dx, dz);
      if (d < 22) {
        const blend = Math.max(0, Math.min(1, (22 - d) / 13));
        const isShortLandscape = camera.aspect > 1.85;
        const isNarrowPortrait = camera.aspect < 0.6;
        baseDist += blend * (isNarrowPortrait ? 8.8 : isPortrait ? 7.4 : isShortLandscape ? 8.6 : 7.2);
        baseHeight += blend * (isShortLandscape ? 2.6 : 2.35);
        const titanMidY = (Number(activeTitan.y) || p.y) + (isShortLandscape ? 3.95 : 3.7);
        const heroLookY = p.y + lookLift;
        desiredFocus.set(
          p.x + dx * 0.52 * blend,
          heroLookY + (titanMidY - heroLookY) * 0.76 * blend,
          p.z + dz * 0.52 * blend
        );
      } else {
        desiredFocus.set(p.x, p.y + lookLift, p.z);
      }
    } else {
      desiredFocus.set(p.x, p.y + lookLift, p.z);
    }

    const followLerp = Math.min(1, clampedDt * 10.5);
    focusPos.lerp(desiredFocus, followLerp);

    desiredCam.set(
      focusPos.x + Math.sin(yaw) * baseDist,
      focusPos.y + baseHeight + hopOffset,
      focusPos.z + Math.cos(yaw) * baseDist
    );

    camera.position.lerp(desiredCam, Math.min(1, clampedDt * 10));
    camera.lookAt(focusPos.x, focusPos.y + hopOffset * 0.4, focusPos.z);

    // Hard invariant: zero rotational roll!
    camera.rotation.z = 0;
  }

  function snapToPlayer(state) {
    yaw = targetYaw;
    const p = state.player;
    const isPortrait = camera.aspect < 0.92;
    const baseDist = isPortrait ? 13.8 : 11.4;
    const baseHeight = isPortrait ? 8.6 : 7.3;
    focusPos.set(p.x, p.y + 1.45, p.z);
    camera.position.set(
      focusPos.x + Math.sin(yaw) * baseDist,
      focusPos.y + baseHeight,
      focusPos.z + Math.cos(yaw) * baseDist
    );
    camera.lookAt(focusPos);
    camera.rotation.z = 0;
  }

  return {
    camera,
    onResize,
    addYaw,
    getYaw,
    setYaw,
    triggerHop,
    update,
    snapToPlayer,
  };
}
