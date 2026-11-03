// Frozen deterministic automation & audit seam window.__LUCKY_TITAN__ (owner: lucky-director).

export function installSeam(api) {
  const seam = Object.freeze({
    startGame(opts = {}) {
      return api.startGame(opts);
    },
    tapWorld(x, z) {
      return api.tapWorld(Number(x), Number(z));
    },
    breakBlock(x, y, z) {
      return api.breakBlock(x, y, z);
    },
    plantPot(padIdx = 0) {
      return api.plantPot(padIdx);
    },
    spinChest(forcedWeaponId = null) {
      return api.spinChest(forcedWeaponId);
    },
    spawnTitan(titanId) {
      return api.spawnTitan(titanId);
    },
    bonkTitan(titanId) {
      return api.bonkTitan(titanId);
    },
    replayVoice() {
      return api.replayVoice();
    },
    stepFrames(n = 1, dt = 1 / 60) {
      return api.stepFrames(Math.max(0, Math.floor(Number(n) || 0)), Number(dt) || 1 / 60);
    },
    getState() {
      return api.buildStateSnapshot();
    },
  });

  if (typeof window !== 'undefined') {
    window.__LUCKY_TITAN__ = seam;
  }
  return seam;
}
