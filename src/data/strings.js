// Centralized 100%-English UI copy for Lucky Block Titans 3D (owner: lucky-ui).
// Ultra-short 1-3 word chunky labels designed for a 5-year-old player.

export const STRINGS = Object.freeze({
  META: Object.freeze({
    docTitle: 'Lucky Block Titans!',
  }),

  TITLE: Object.freeze({
    kicker: '\u2B50 VOXEL SURPRISE ISLAND \u2B50',
    heading: 'LUCKY BLOCK TITANS!',
    sub: 'SMASH \u2022 PLANT \u2022 SPIN \u2022 BONK!',
    continueBtn: 'CONTINUE',
    continueAria: 'Continue saved island',
    playBtn: 'PLAY!',
    playAria: 'Play Game',
    voiceBtn: 'VOICE',
    voiceAria: 'Play welcome voice greeting',
  }),

  HUD: Object.freeze({
    spinLabel: 'SPIN',
    spinFree: 'FREE!',
    spinBonus: 'BONUS',
    spinAria: 'Open Mystery Artifact Chest',
    potPlantLabel: 'PLANT',
    potGrowLabel: 'GROW',
    potMaxLabel: 'MAX!',
    potFree: 'FREE!',
    potAria: 'Plant or upgrade Magic Flowerpot',
    voiceLabel: 'VOICE',
    voiceLive: 'LIVE',
    voiceHear: 'HEAR',
    voiceAria: 'Replay last voice line',
    menuLabel: 'MENU',
    menuChaos: 'CHAOS',
    menuAria: 'Open pause menu',
    subtitleAria: 'Replay voice',
    starsAria: 'Star Gems',
    powerAria: 'Hero Power Tier',
    shieldsAria: 'Rainbow Shield Hearts',
    trophiesAria: 'Golden Titan Trophies',
  }),

  ROULETTE: Object.freeze({
    title: 'MYSTERY CHEST!',
    hintReady: 'TAP SPIN FOR A SUPER WEAPON!',
    hintFree: 'FREE LUCKY SPIN READY!',
    hintSpinning: 'ROUND AND ROUND...',
    hintWon: 'NEW WEAPON EQUIPPED!',
    hintBonus: 'STAR JACKPOT BONUS!',
    hintNeedStars: 'GROW POTS FOR STARS!',
    spinBtn: 'SPIN!',
    spinFreeBtn: 'FREE!',
    spinningBtn: 'SPIN...',
    awesomeBtn: 'AWESOME!',
    closeBtn: 'BACK',
    spinAria: 'Spin Mystery Artifact Chest',
    awesomeAria: 'Collect weapon and close chest',
    closeAria: 'Close Mystery Chest',
    equippedBadge: 'EQUIPPED!',
    powerLabel: 'POWER',
  }),

  BOSS: Object.freeze({
    readyTag: 'BONK!',
    needPrefix: 'NEED',
    boingTag: 'TICKLE!',
    defeatTag: 'POP!',
    surpriseBanner: 'SURPRISE TITAN!',
  }),

  COMIC: Object.freeze({
    hitWords: Object.freeze(['POW!', 'BONK!', 'WHAM!', 'BAM!', 'SMASH!']),
    boingWord: 'BOING!',
    jackpotWord: 'JACKPOT!',
    upgradeWord: 'POWER UP!',
    trophyWord: 'TROPHY!',
  }),

  PAUSE: Object.freeze({
    title: 'PAUSED',
    musicLabel: 'MUSIC',
    soundLabel: 'SOUND',
    voiceLabel: 'VOICE',
    chaosLabel: 'CHAOS',
    stateOn: 'ON',
    stateOff: 'OFF',
    resumeBtn: 'PLAY!',
    newIslandBtn: 'NEW MAP',
    musicAria: 'Toggle background music',
    soundAria: 'Toggle sound effects',
    voiceAria: 'Toggle voiceover narration',
    chaosAria: 'Toggle Lucky Chaos Mode',
    resumeAria: 'Resume playing',
    newIslandAria: 'Start a new island',
  }),

  VICTORY: Object.freeze({
    crownBadge: '4 / 4 GOLDEN TROPHIES!',
    title: 'YOU WIN!',
    subtitle: 'TITAN CHAMPION!',
    playMoreBtn: 'PLAY MORE',
    chaosOffBtn: 'CHAOS',
    chaosOnBtn: 'CHAOS ON',
    newIslandBtn: 'NEW MAP',
    playMoreAria: 'Keep playing in free play mode',
    chaosAria: 'Toggle Lucky Chaos Mode',
    newIslandAria: 'Start a brand new island',
  }),

  WEAPONS: Object.freeze({
    wood_stick: Object.freeze({ short: 'STICK', title: 'TOY STICK' }),
    sparkle_sword: Object.freeze({ short: 'SWORD', title: 'SPARKLE SWORD' }),
    gold_pickaxe: Object.freeze({ short: 'PICKAXE', title: 'GOLD PICKAXE' }),
    ocean_trident: Object.freeze({ short: 'TRIDENT', title: 'OCEAN TRIDENT' }),
    thunder_hammer: Object.freeze({ short: 'HAMMER', title: 'THUNDER HAMMER' }),
    rainbow_blade: Object.freeze({ short: 'RAINBOW', title: 'RAINBOW BLADE' }),
  }),

  TITANS: Object.freeze({
    moss_titan: Object.freeze({ short: 'MOSS TITAN', badge: 'MOSS', icon: '\uD83C\uDF3F' }),
    snow_titan: Object.freeze({ short: 'SNOW TITAN', badge: 'SNOW', icon: '\u2744\uFE0F' }),
    thunder_titan: Object.freeze({ short: 'STORM TITAN', badge: 'STORM', icon: '\u26A1' }),
    bedrock_king: Object.freeze({ short: 'KING TITAN', badge: 'KING', icon: '\uD83D\uDC51' }),
  }),

  POTS: Object.freeze({
    0: Object.freeze({ short: 'EMPTY', badge: 'PLANT!' }),
    1: Object.freeze({ short: 'GLOW', badge: 'GLOW POT' }),
    2: Object.freeze({ short: 'CRYSTAL', badge: 'CRYSTAL' }),
    3: Object.freeze({ short: 'ULTIMATE', badge: 'MAX POT!' }),
  }),
});

export function formatTierBadge(tier = 1) {
  const clamped = Math.max(1, Math.min(5, Math.round(Number(tier) || 1)));
  return `\u2605${clamped}`;
}

export function formatStarCost(cost = 0) {
  const n = Math.max(0, Math.round(Number(cost) || 0));
  return n <= 0 ? STRINGS.HUD.spinFree : `\u2B50${n}`;
}
