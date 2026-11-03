// Deterministic game state & persistent kid preferences (owner: lucky-director).
import {
  HUB_LAYOUT,
  MOVEMENT_TUNING,
  ROULETTE_COSTS,
  STORAGE_KEY,
  TITAN_ORDER,
  WEAPONS,
} from '../data/catalog.js';

function readRawStorage() {
  try {
    if (typeof localStorage === 'undefined') return {};
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch (_err) {
    return {};
  }
}

export function loadPrefs() {
  const defaults = {
    musicOn: true,
    sfxOn: true,
    voiceOn: true,
    chaosMode: false,
    bestTrophies: 0,
  };
  const parsed = readRawStorage();
  if (!parsed || Object.keys(parsed).length === 0) return defaults;
  return {
    musicOn: parsed.musicOn !== false,
    sfxOn: parsed.sfxOn !== false,
    voiceOn: parsed.voiceOn !== false,
    chaosMode: Boolean(parsed.chaosMode),
    bestTrophies: Math.max(0, Number(parsed.bestTrophies) || 0),
  };
}

export function savePrefs(patch = {}) {
  const raw = readRawStorage();
  const nextPrefs = { ...loadPrefs(), ...patch };
  const merged = { ...raw, ...nextPrefs };
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    }
  } catch (_err) {
    // Ignore storage quota or sandbox restrictions.
  }
  return nextPrefs;
}

export function loadSavedRun() {
  const parsed = readRawStorage();
  const run = parsed?.savedRun;
  if (!run || typeof run !== 'object') return null;
  const seed = (Number(run.seed) >>> 0) || 2026;
  const weaponId = WEAPONS[run.weaponId] ? run.weaponId : 'wood_stick';
  const potTiers = Array.isArray(run.potTiers)
    ? HUB_LAYOUT.flowerpotPads.map((_, idx) => Math.max(0, Math.min(3, Number(run.potTiers[idx]) || 0)))
    : [0, 0, 0, 0];
  const trophies = Array.isArray(run.trophies)
    ? run.trophies.filter((id, idx, arr) => TITAN_ORDER.includes(id) && arr.indexOf(id) === idx)
    : [];
  return {
    seed,
    chaosMode: Boolean(run.chaosMode),
    starGems: Math.max(0, Math.round(Number(run.starGems) || 0)),
    potSeeds: Math.max(0, Math.round(Number(run.potSeeds) || 0)),
    freeSpins: Math.max(0, Math.round(Number(run.freeSpins) || 0)),
    weaponId,
    helmet: Boolean(run.helmet),
    speedBoots: Boolean(run.speedBoots),
    starCape: Boolean(run.starCape),
    shieldHearts: Math.max(3, Math.min(8, Math.round(Number(run.shieldHearts) || 3))),
    maxShieldHearts: Math.max(3, Math.min(8, Math.round(Number(run.maxShieldHearts) || 3))),
    blocksBroken: Math.max(0, Math.round(Number(run.blocksBroken) || 0)),
    spinsCount: Math.max(0, Math.round(Number(run.spinsCount) || 0)),
    potTiers,
    trophies,
    victoryCelebrated: Boolean(run.victoryCelebrated),
  };
}

export function hasSavedRun() {
  const run = loadSavedRun();
  if (!run) return false;
  return (
    run.blocksBroken > 0 ||
    run.starGems > 0 ||
    run.trophies.length > 0 ||
    run.weaponId !== 'wood_stick' ||
    run.helmet ||
    run.potTiers.some((t) => t > 0)
  );
}

export function saveRunSnapshot(state) {
  if (!state || !state.player) return;
  const raw = readRawStorage();
  const prefs = loadPrefs();
  const bestTrophies = Math.max(prefs.bestTrophies || 0, state.trophies?.length || 0);
  const savedRun = {
    seed: (Number(state.seed) >>> 0) || 2026,
    chaosMode: Boolean(state.chaosMode),
    starGems: Math.max(0, Math.round(Number(state.player.starGems) || 0)),
    potSeeds: Math.max(0, Math.round(Number(state.player.potSeeds) || 0)),
    freeSpins: Math.max(0, Math.round(Number(state.player.freeSpins) || 0)),
    weaponId: WEAPONS[state.player.weaponId] ? state.player.weaponId : 'wood_stick',
    helmet: Boolean(state.player.helmet),
    speedBoots: Boolean(state.player.speedBoots),
    starCape: Boolean(state.player.starCape),
    shieldHearts: Math.max(3, Math.round(Number(state.player.shieldHearts) || 3)),
    maxShieldHearts: Math.max(3, Math.round(Number(state.player.maxShieldHearts) || 3)),
    blocksBroken: Math.max(0, Math.round(Number(state.blocksBroken) || 0)),
    spinsCount: Math.max(0, Math.round(Number(state.roulette?.spinsCount) || 0)),
    potTiers: (state.flowerpots || []).map((p) => Math.max(0, Math.min(3, Number(p.tier) || 0))),
    trophies: Array.isArray(state.trophies) ? [...state.trophies] : [],
    victoryCelebrated: Boolean(state.victoryCelebrated),
  };
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          ...raw,
          ...prefs,
          bestTrophies,
          savedRun,
        })
      );
    }
  } catch (_err) {
    // Ignore storage quota or sandbox restrictions.
  }
}

export function applySavedRunToState(state, savedRun) {
  if (!state || !savedRun) return state;
  state.seed = savedRun.seed;
  state.chaosMode = Boolean(savedRun.chaosMode);
  state.blocksBroken = savedRun.blocksBroken;
  state.victoryCelebrated = Boolean(savedRun.victoryCelebrated);
  state.player.starGems = savedRun.starGems;
  state.player.potSeeds = savedRun.potSeeds;
  state.player.freeSpins = savedRun.freeSpins;
  state.player.weaponId = savedRun.weaponId;
  state.player.helmet = savedRun.helmet;
  state.player.speedBoots = savedRun.speedBoots;
  state.player.starCape = savedRun.starCape;
  state.player.shieldHearts = savedRun.shieldHearts;
  state.player.maxShieldHearts = savedRun.maxShieldHearts;
  state.roulette.spinsCount = savedRun.spinsCount;
  state.trophies = [...savedRun.trophies];
  for (let i = 0; i < state.flowerpots.length; i += 1) {
    state.flowerpots[i].tier = savedRun.potTiers[i] || 0;
    state.flowerpots[i].timer = 0;
  }
  recalcPlayerStats(state);
  return state;
}

export function createGameState({ seed = 2026, chaosMode = false, mode = 'title' } = {}) {
  const cleanSeed = (Number(seed) >>> 0) || 2026;
  return {
    mode, // 'title' | 'playing' | 'roulette' | 'paused' | 'victory'
    seed: cleanSeed,
    time: 0,
    chaosMode: Boolean(chaosMode),
    hitStopTimer: 0,
    victoryCelebrated: false,

    player: {
      x: HUB_LAYOUT.spawn.x,
      y: HUB_LAYOUT.spawn.y,
      z: HUB_LAYOUT.spawn.z,
      vx: 0,
      vz: 0,
      yaw: Math.PI, // Facing north (-Z) toward Starter Lucky Block & Golden Chest
      baseSpeed: MOVEMENT_TUNING.baseSpeed,
      speed: MOVEMENT_TUNING.baseSpeed,
      weaponId: 'wood_stick',
      weaponTier: 1,
      powerTier: 1,
      helmet: false,
      speedBoots: false,
      starCape: false,
      crown: false,
      shieldHearts: 3,
      maxShieldHearts: 3,
      starGems: 0,
      potSeeds: 0,
      freeSpins: 0,
      state: 'idle', // 'idle' | 'walking' | 'swinging' | 'boinging' | 'celebrating'
      swingCooldown: 0,
      path: [],
      target: null,
      boingArc: null,
    },

    blocksBroken: 0,
    luckyBlocksCount: 0,

    flowerpots: HUB_LAYOUT.flowerpotPads.map((p) => ({
      padIdx: p.padIdx,
      x: p.x,
      y: p.y,
      z: p.z,
      tier: 0,
      timer: 0,
      totalSpawned: 0,
    })),

    trophies: [],

    roulette: {
      open: false,
      spinning: false,
      spinTimer: 0,
      spinDuration: 2.4,
      spinCost: ROULETTE_COSTS[0],
      selectedWeaponId: null,
      spinsCount: 0,
    },

    feedback: {
      taps: 0,
      deadTaps: 0,
      boings: 0,
      bonks: 0,
      chestsOpened: 0,
      crittersPetted: 0,
      dropTypesSeen: [],
    },

    perf: {
      playStartMs: 0,
      drawCalls: 0,
      triangles: 0,
      maxMetalness: 0,
      cameraRoll: 0,
    },
  };
}

export function recalcPlayerStats(state) {
  const p = state.player;
  const wpn = WEAPONS[p.weaponId] || WEAPONS.wood_stick;
  p.weaponTier = wpn.tier;
  // Power tier follows weaponTier (1..5), with Gold Helmet guaranteeing at least Tier 2 + +25% bonk damage!
  p.powerTier = Math.max(1, Math.min(5, Math.max(wpn.tier, p.helmet ? 2 : 1)));

  if (p.helmet) {
    p.speed = MOVEMENT_TUNING.helmetSpeed;
    p.maxShieldHearts = Math.max(5, p.maxShieldHearts);
    p.shieldHearts = Math.max(p.shieldHearts, 5);
  } else if (p.speedBoots) {
    p.speed = MOVEMENT_TUNING.bootsSpeed;
  } else {
    p.speed = MOVEMENT_TUNING.baseSpeed;
  }

  p.crown = state.trophies.length >= 4;
  const costIdx = Math.min(state.roulette.spinsCount, ROULETTE_COSTS.length - 1);
  state.roulette.spinCost = p.freeSpins > 0 ? 0 : ROULETTE_COSTS[costIdx];
  return p;
}
