# Lucky Block Titans 3D — Architecture & Kid-UX Design Specification

## 1. Vision & Kid-First Simplification
**Lucky Block Titans 3D** is a bright, zero-build Three.js (r170) 3rd-person voxel toy-island built specifically for a **5-year-old child** on an iPad or laptop, with **100% English UI** and **68 pre-recorded neural voiceover clips (`edge-tts`)**.

It distills every iconic thrill of the source video (`BV1A5sf6NEqs` — Random Drop Survival: Ultimate Magic Flowerpot, Mystery Artifact Roulette Chest, Blazing Gold Titan Helmet & Rainbow Shield Hearts, and Digging Up Giant Titans) while removing 100% of adult modpack clutter:

- **ZERO inventory grids, ZERO crafting menus, ZERO tiny item tooltips or trillion-number stats, ZERO scary horror, and ZERO red "You Died" screens!**
- **1-Tap Tactile Voxel Play**:
  - Tap ground -> crisp ripple ring + fast run (`7.2 blocks/s` base -> `8.2 blocks/s` with Speed Boots -> `9.2 blocks/s` with Blazing Gold Titan Helmet!).
  - Tap any breakable block, critter, Flowerpot Pad, Giant Roulette Chest, or Giant Voxel Titan -> target lock ring + hero runs over and swings/interacts automatically!
  - 1-finger horizontal drag smoothly rotates camera yaw (`camera.rotation.z === 0` at all times; zero dizzying roll shake); WASD / Arrow keys + Spacebar also work on laptop.
- **4 Core Video Thrills Preserved 100%**:
  1. **Wacky Random Drops + Bouncy Treasure Critters**: Every broken block (lucky `?` blocks, giant flowers, oak/spruce logs, hay bales, pumpkins, melons, beehives, ice crystals, royal castle furnaces/amethyst) pops giant spinning 3D surprises — Star Gems, Flowerpot Seeds, Free Spin Tokens, Speed Boots, Blazing Gold Helmet, Shield Hearts, or friendly bouncy critters (Pink Piggy, Honey Bee, Fluffy Chick) that giggle with hearts and pop bonus crystal gems when patted!
  2. **Cover Star — Ultimate Magic Flowerpots**: Planting & upgrading Magic Bonsai Flowerpots on the **4 Glowing Garden Pads** in the central Hub (**Tier 1 Glow Pot** -> **Tier 2 Crystal Pot** -> **Tier 3 Ultimate Rainbow Star Pot**, an iconic stepped pyramid of glowing star-lamps in a teal bonsai tray) makes them bloom and **fountain shiny 3D Star Gems automatically** every few seconds!
  3. **Mystery Artifact Roulette Chest**: Opening the Giant Golden Chest launches a joyful horizontal **Picture Roulette Spinner** rolling past chunky pixel-art weapons inside a spotlight circle with rising musical ticks (`~2.4 s`), landing with confetti fanfare and **instant 3D auto-equip** on the hero!
  4. **Comedy Twist — Digging Up GIANT VOXEL TITANS (`4.5x` Hero Height!)**:
     - Breaking a trembling **Mega Titan Block** in any of the 4 pocket biomes (or triggering a rare surprise Lucky Block tremor!) plays a comic drumroll + trumpet fanfare and pops a towering, goofy 3D **Voxel Titan** right out of the blocks!
     - **Kid-Safe Under-Geared Boing**: If `player.powerTier < titan.requiredTier`, the Titan lets out a silly booming belly laugh (`"HO HO HO! Too ticklish! Come back with a bigger hammer!"`) and gently **boings the hero on a fluffy Rainbow Spring Cloud** in a joyful arc back to the Garden Hub with +3 consolation Star Gems, zero damage/loss, and warm Kid Guide voice coaching!
     - **Powered-Up Pinata Smash**: Once geared (`player.powerTier >= titan.requiredTier`), each bonk triggers a `45 ms` hit-stop, comic `POW! / BONK! / WHAM!` bursts, and silly Titan wobble until the Titan **pops like a giant candy pinata** into Star Gems, confetti, and a **Golden Titan Trophy** on the 4-Pedestal Hub Stage! Collecting all 4 trophies triggers the **Grand Crown Fireworks Parade** + endless free-play with **Lucky Chaos Mode**!

---

## 2. Strict Global Technical & Localization Rules (ALL Builders MUST Obey)
1. **ZERO CJK Characters Anywhere**: Zero `[\u4e00-\u9fff]` characters in **any** file in this repo — including code comments, `src/data/strings.js`, HTML, CSS, 2D canvas draws (`fillText`/`strokeText`), tools, tests, and docs!
2. **Zero-Build ES2022 Modules**: Relative imports only (`./...`, `../...`, `../../vendor/three.module.min.js`). NO bundler, NO CDN, NO `importmap`/bare specifiers, NO `window.speechSynthesis`.
3. **Three.js r170 Material & Camera Guardrails**:
   - **NEVER set `metalness > 0.20`** on any material (`<= 0.22` hard gate; non-IBL scene renders high metalness black!). Use vibrant `color` + warm `emissive` (`0.12 - 0.45`) + `roughness: 0.55 - 0.85`.
   - **ALL `THREE.SpriteMaterial` / billboard / target-ring / comic-popup materials** MUST set `toneMapped: false` and `fog: false`.
   - **`camera.rotation.z === 0`** strictly on every frame (zero rotational roll shake).
   - Live 3D world renders behind `#title-screen` and calls `renderer.compile(scene, camera)` on boot so tapping `▶ PLAY` transitions in **`< 50 ms`** (`<= 80 ms` budget).
4. **5-Viewport Kid-UX Contract**:
   - Viewports: `1280x800`, `1024x768`, **`768x1024` (iPad portrait)**, `844x390`, `390x844`.
   - `0` scrollbars, `0` clipped text, `0` overlapping interactive boxes or subtitle overlaps (`>= 6 px` clearance).
   - **`<= 5` visible clickable controls during active gameplay**:
     1. `#btn-hud-spin` (`🎁` Spin Chest — opens Roulette Chest modal; pulses gold when affordable or `freeSpins > 0`)
     2. `#btn-hud-pot` (`🪴` Plant Pot — plants/upgrades next Garden Pad; pulses green when `potSeeds > 0` or affordable)
     3. `#btn-hud-voice` (`🔊` Replay Voice — 1-tap replays last spoken voice clip and auto-unmutes if muted)
     4. `#btn-hud-menu` (`⏸` Menu — opens Pause/Settings sheet with Music, Sound, Voice, **Lucky Chaos Mode**, and New Island)
     5. `#voice-subtitle` (when visible during speech, `role="button"`, `min-height: 72px`, `min-width: 180px`, tapping replays voice; hidden when idle -> total visible clickable controls is `4` idle, `5` while speaking!).
   - Every visible interactive button/pill across Title, HUD, Roulette Modal, Pause Modal, and Victory Podium MUST measure **`>= 72x72 px`** (`>= 68 px` hard floor on compact landscape `844x390`).
   - All HUD/modal buttons enforce **`280 ms` `pointerup -> pointerup` debounce** (`src/ui/debounce.js`).
5. **Disk Hygiene**: Store ALL temporary outputs, headless Chrome profiles, simulation logs, and screenshots under `/tmp/bv1a5s/` (compressed `.jpg`), NEVER in the home directory or repository root.

---

## 3. Strict File-Ownership Map (Zero Overlapping Edits)

| Owner | Exclusive Files Owned | Responsibility |
| :--- | :--- | :--- |
| **`lucky-director`** | `index.html`, `src/main.js`, `src/core/rng.js`, `src/core/state.js`, `src/core/scene.js`, `src/core/camera.js`, `src/core/input.js`, `src/core/seam.js`, `src/data/catalog.js`, `tests/cdp.py`, `docs/DESIGN.md`, `README.md` | Master game loop, deterministic state & `catalog.js` constants, camera/input/raycast glue, `window.__LUCKY_TITAN__` seam, integration, and deployment. |
| **`lucky-world`** | `src/world/blocks.js`, `src/world/textures.js`, `src/world/island.js`, `src/world/nav.js`, `src/world/sky.js`, `src/world/world.js` | Crisp `16x16` procedural pixel block textures, `72x72` 4-biome voxel island + Garden Hub + 4 Pad meshes + Roulette Chest prop + 4-Pedestal Trophy Stage + regrowing breakable blocks + Trembling Mega Titan Blocks + A* `findPath` (`<= 2ms`) + sunlit sky/clouds/ambient sparkles. |
| **`lucky-chars`** | `src/chars/hero.js`, `src/chars/critters.js`, `src/chars/titans.js`, `src/chars/props3d.js` | Chunky chibi voxel Hero with visible 3D weapon (`6` models), Blazing Gold Helmet, Speed Boots, Star Cape, King Crown + snappy walk/swing/boing animations; bouncy farm Critters (piggy, bee, chick); 4 towering `4.5x`-tall Voxel Titans with expressive faces, belly-laugh cloud boing, hit squash, and pinata pop; 3D Magic Flowerpot models (Tiers 1-3) & Trophy models. |
| **`lucky-loot`** | `src/game/loot_director.js`, `src/game/pickups.js`, `src/game/flowerpots.js`, `src/game/roulette.js`, `src/game/combat.js` | Seeded Lucky Drop director (12 drop types + pity + Chaos Mode), 3D spinning pickups with auto-magnet & bouncy arc, 3-tier Magic Flowerpot Star Gem fountains, Roulette Chest odds/upgrade guarantee, Power Tier (`★1..★5`) & Kid-Safe Titan combat/boing state machine. |
| **`lucky-ui`** | `src/data/strings.js`, `src/ui/debounce.js`, `src/ui/title.js`, `src/ui/hud.js`, `src/ui/roulette_modal.js`, `src/ui/boss_banner.js`, `src/ui/pause_modal.js`, `src/ui/victory_modal.js`, `src/ui/guide_arrow.js`, `styles/main.css` | All English copy (`strings.js`, 1-3 word kid labels), Title overlay, `<= 5`-control `>= 72px` Kid HUD (Star Gem counter, Power Tier stars, Rainbow Shield Hearts, 4 Trophy icons, 4 big action buttons), tactile Picture Roulette Chest modal (`~2.4s` horizontal strip spin), Titan Boss Banner + comic `POW!/BONK!/BOING!` popups, 3D Bouncing Guide Arrow, Victory Podium, 5-viewport CSS. |
| **`lucky-vo-audio`** | `tools/gen_voice.py`, `assets/voice/*.mp3`, `assets/voice/manifest.json`, `src/data/voice_manifest.js`, `src/fx/audio.js`, `src/fx/music.js`, `src/fx/sfx.js`, `src/fx/voice.js`, `src/fx/particles.js` | Deterministic `edge-tts` generator (`68` MP3s `<= 4.5 MB` + `manifest.json` + `voice_manifest.js`), WebAudio context + cheerful marimba/adventure BGM + `-6 dB` voice ducking + collision-safe `.voice-subtitle` (`>= 72px` tap-to-replay pill) + juicy procedural SFX (block pop, star chime, pot fountain, roulette ticks, fanfare, boing spring, pinata smash) + 3D voxel burst/confetti/rainbow-cloud particles. |
| **`lucky-qa`** | `tests/qa_helpers.py`, `tests/run_e2e.py`, `tests/sim_gates.py`, `tests/layout_audit.py`, `tests/l10n_audit.py` | `>= 42` E2E browser checks, 20-seed fast-forward child-bot simulation verifying `F1..F14`, 5-viewport zero-scroll/zero-overlap/`72px` audit, 0-CJK source+DOM+attr+2D-canvas hook audit, and `ffprobe`/WebAudio MP3 decode & replay audit. |

---

## 4. Shared Canonical Catalog (`src/data/catalog.js` — Single Source of Truth)
**Authority Rule**: `src/data/catalog.js` and `src/data/voice_catalog.js` are the single canonical source of truth and win on any conflict.

### 4.1 Island Layout & 4 Biomes (`72 x 72` grid, coordinates `x, z in [-34, +34]`, ground `y = 1` at Hub)
- **Central Cozy Star Garden Hub** (`r <= 11.5`, `x in [-11, 11], z in [-11, 11]`, `y = 1`):
  - Hero Spawn: `(0, 1, 4.5)` facing `(0, 1, 1.5)`.
  - **Starter Lucky Block**: `(0, 1, 2.0)` — glowing rainbow `?` block `2.5` blocks straight ahead of Hero Spawn! Guaranteed first break drops `+8 Star Gems`, `+1 Magic Flowerpot Seed`, and `+1 Free Spin Token`!
  - **Boing Cloud Landing**: `(0, 1, 3.4)`.
  - **4 Glowing Magic Flowerpot Pads**:
    - Pad 0: `(-4.5, 1, 1.6)`
    - Pad 1: `(4.5, 1, 1.6)`
    - Pad 2: `(-4.5, 1, -2.6)`
    - Pad 3: `(4.5, 1, -2.6)`
  - **Giant Golden Roulette Chest**: `(0, 1, -1.6)` (center of Hub, warm gold spotlight beam).
  - **4-Pedestal Golden Titan Trophy Stage**: North Hub arc at `(-4.8, 1, -7.5)`, `(-1.6, 1, -8.2)`, `(1.6, 1, -8.2)`, `(4.8, 1, -7.5)`.
- **4 Surrounding Pocket Biomes** (connected via wide `5-block` step-free ramps, max step height `<= 1` block):
  1. **`meadow` — Sunny Meadow** (SW, `x in [-31, -7], z in [6, 31]`): Giant red/yellow flowers, oak logs/leaves, hay bales, rainbow lucky blocks, Pink Piggies. **Mega Titan Block** at `(-18, 1, 18)` -> spawns **`moss_titan` (Mossy Titan, `★1`, `maxHp: 40`)**.
  2. **`snow` — Crystal Snow** (NW, `x in [-31, -7], z in [-31, -6]`): Glowing cyan ice crystals, spruce trees, snow blocks, snowmen. **Mega Titan Block** at `(-18, 2, -18)` -> spawns **`snow_titan` (Snow Wizard Titan, `★2`, `maxHp: 80`)**.
  3. **`farm` — Honey Farm** (SE, `x in [7, 31], z in [6, 31]`): Juicy pumpkins, striped melons, golden beehives, lightning totem logs, piggies, bees & chicks. **Mega Titan Block** at `(18, 1, 18)` -> spawns **`thunder_titan` (Thunder Chief Titan, `★3`, `maxHp: 140`)**.
  4. **`castle` — Gold Castle** (NE, `x in [7, 31], z in [-31, -6]`): Gilded stone courtyard, royal open archways, glowing furnaces, amethyst clusters, gold blocks. **Mega Titan Block** at `(20, 2, -20)` -> spawns **`bedrock_king` (Bedrock King Titan, `★4`, `maxHp: 220`)**.

### 4.2 The 6 Weapons (Strict Tier Climb on Spins, Never Downgrade!)
| `weaponId` | Display Name | Tier (`weaponTier`) | Bonk Damage | Mining Hits (Normal / Tough) | Visual Signature & VO ID |
| :--- | :--- | :---: | :---: | :---: | :--- |
| `wood_stick` | Toy Stick | `1` | `10` | `2 / 2` | Chunky oak stick with leaf sprout (`guide_welcome`) |
| `sparkle_sword` | Sparkle Sword | `2` | `22` | `1 / 2` | Cyan-gold pixel blade (`vo_wpn_sword`) |
| `gold_pickaxe` | Gold Pickaxe | `2` | `25` | `1 / 1` | Blazing yellow-gold mega pickaxe + `+2` bonus gems (`vo_wpn_pickaxe`) |
| `ocean_trident` | Ocean Trident | `3` | `40` | `1 / 1` | Aqua three-prong trident with water sparkles (`vo_wpn_trident`) |
| `thunder_hammer` | Thunder Hammer | `4` | `60` | `1 / 1` | Purple-cyan arcane vortex hammer with shockwave (`vo_wpn_hammer`) |
| `rainbow_blade` | Rainbow Blade | `5` | `90` | `1 / 1` | Prismatic star-core infinity sword (`vo_wpn_rainbow`) |

*Strict Roulette Tier Climb Rule*: Unless `forcedWeaponId` is explicitly supplied, every Roulette Chest spin while `player.weaponTier < 5` **strictly selects from `tier > player.weaponTier`** (climbing `★1 -> ★2 -> ★3 -> ★4 -> ★5` with zero same-tier dud spins!). `player.powerTier = Math.max(weaponTier, helmet ? 2 : 1)` (`1..5`), and Blazing Gold Helmet also boosts speed to `9.2 b/s`, upgrades to `5` Rainbow Shield Hearts, and adds `+25%` bonk damage! Guaranteed gear pity: `speed_boots` by block `#10`, `gold_helmet` from first Titan pinata (`moss_titan`) or by block `#16` (100% worn before `thunder_titan`), and `star_cape` from second Titan pinata (`snow_titan`) or by block `#24`.

### 4.3 The 3 Magic Flowerpot Tiers (`flowerpots`)
Planting/upgrading on any of the 4 Hub Pads (`0..3`):
- First pot on Pad 0 is **FREE** when `potSeeds >= 1` (guaranteed from Starter Lucky Block!). Subsequent plants/upgrades use `1 potSeed` OR Star Gems (`6` gems for Tier 1, `12` gems for Tier 2, `20` gems for Tier 3).
- **Tier 1 (`glow_pot` — Glow Pot)**: Sprouts a glowing golden lantern bush; fountains **`+2 Star Gems` every `3.4 s`** (`vo_pot_glow`).
- **Tier 2 (`crystal_pot` — Crystal Pot)**: Sprouts a twin cyan-amethyst crystal tree; fountains **`+4 Star Gems` every `2.9 s`** (`vo_pot_crystal`).
- **Tier 3 (`ultimate_pot` — Ultimate Star Pot)**: Iconic cover-art stepped pyramid of glowing golden-rainbow lamps in a teal bonsai tray; fountains **`+8 Star Gems` every `2.4 s`** with rainbow sparkles (`vo_pot_ultimate`)!

### 4.4 The 12 Wacky Lucky Drops (`LOOT_TABLE`)
Every broken block rolls deterministically via `ctx.rng` (in **Lucky Chaos Mode**, multi-drop burst count doubles and surprise critter/armor/tremor weights triple!):
1. `star_gem_small` (`+3` Star Gems — bouncy yellow star)
2. `star_gem_cluster` (`+8` Star Gems — giant rainbow star burst)
3. `pot_seed` (`+1` Magic Flowerpot Seed — glowing mini bonsai pot; auto-highlights `#btn-hud-pot`)
4. `free_spin_chest` (`+1` Free Roulette Chest Token — mini bouncing golden chest; auto-highlights `#btn-hud-spin`)
5. `giant_apple` (Golden Sparkle Apple — joyful munch + `+4` Star Gems + speed hop)
6. `bouncy_cake` (Party Berry Cake — confetti pop + `+1` Shield Heart + `+5` Star Gems)
7. `critter_piggy` (Spawns a happy **Pink Heart Piggy** that trots & pops `+6` Star Gems when patted!)
8. `critter_bee` (Spawns a zippy **Golden Honey Bee** that pops honey stars!)
9. `speed_boots` (Auto-equips **Zoomy Wing Boots** -> walk speed `8.2 b/s` + bouncy step trail; converts to `+10` Star Gems if already owned)
10. `gold_helmet` (Auto-equips **Blazing Gold Titan Helmet** -> walk speed `9.2 b/s`, `5` Rainbow Shield Hearts, `+1` Power Tier boost; converts to `+15` Star Gems if already owned)
11. `star_cape` (Auto-equips **Royal Rainbow Cape** -> magnet pickup radius `3.2 -> 5.5` blocks + sparkle trail)
12. `surprise_titan` (On Mega Titan Blocks 100%, and ~10% on special pulsing Lucky Blocks after `blocksBroken >= 6` if biome Titan not yet active: `0.6s` comic wobble + trumpet fanfare -> spawns that biome's Giant Voxel Titan!).

### 4.5 The 4 Giant Voxel Titans (`TITANS`)
| `titanId` | Name | Biome | Required Tier | `maxHp` | Visual Scale | Trophy Color |
| :--- | :--- | :--- | :---: | :---: | :---: | :--- |
| `moss_titan` | Mossy Stone Titan | `meadow` | `★1` | `40` | `4.2x` (`~7.0b`) | Emerald Gold |
| `snow_titan` | Snow Wizard Titan | `snow` | `★2` | `80` | `4.4x` (`~7.4b`) | Crystal Gold |
| `thunder_titan` | Thunder Chief Titan | `farm` | `★3` | `140` | `4.6x` (`~7.8b`) | Storm Gold |
| `bedrock_king` | Bedrock King Titan | `castle` | `★4` | `220` | `5.0x` (`~8.5b`) | Royal Crown Gold |

---

## 5. Exact Module Interfaces (Integration Contract)

### 5.1 `src/world/world.js` (`lucky-world`)
- `export function createWorld(ctx)` returning `world`:
  - `world.group`: `THREE.Group` added to `ctx.scene`
  - `world.update(dt, time)`: animates water ripples, floating crystals, trembling Mega Titan Blocks, regrowing broken blocks (`12 s` regrow timer with pop-up scale bounce so the island NEVER runs out of blocks to smash!), pad glow rings, trophy stage pedestals (`0..3`), and ambient biome particles.
  - `world.getGroundY(x, z) -> number`: walkable surface height (`null` or `-Infinity` if water/out-of-bounds).
  - `world.clampToWalkable(x, z) -> { x, y, z }`: nearest walkable island coordinate (guarantees `0` dead taps!).
  - `world.findPath(sx, sz, tx, tz) -> Array<{x, z}>`: fast 2D grid A* (`<= 2.0 ms`, smoothed waypoints).
  - `world.getBreakableAt(x, y, z, radius = 1.6) -> blockObj | null`: returns breakable block descriptor `{ id, key, x, y, z, blockType, biome, hp, maxHp, isLucky, isMegaTitan, titanId, broken }`.
  - `world.hitBlock(blockKey, damage) -> { broken, block }`: applies crack visual/wobble; if `hp <= 0`, marks broken (schedules `12 s` regrow unless defeated Mega Titan, though undefeated Mega Titan blocks regrow in `8 s` if hero boinged away!), returns `{ broken: true, block }`.
  - `world.raycastTap(ndcX, ndcY, camera) -> { kind: 'block'|'pad'|'chest'|'ground', target, point }`: crisp raycast against breakable blocks, 4 Hub Pads, Giant Roulette Chest, and island terrain.
  - `world.setPadVisual(padIdx, tier)` & `world.setTrophyVisual(trophyIdx, titanId, unlocked)`
  - `world.reset(seed)`: deterministic rebuild/reset of regrow states for new game.

### 5.2 `src/chars/{hero,critters,titans,props3d}.js` (`lucky-chars`)
- `createHero(ctx)` (`src/chars/hero.js`):
  - `hero.group`: `THREE.Group` (`~1.7` blocks tall, bright storybook tunic, big expressive pixel eyes & smile).
  - `hero.setEquipment({ weaponId, helmet, speedBoots, starCape, crown })`: swaps 3D right-hand weapon mesh (`wood_stick`, `sparkle_sword`, `gold_pickaxe`, `ocean_trident`, `thunder_hammer`, `rainbow_blade`), toggles glowing **Blazing Gold Titan Helmet**, winged **Speed Boots**, flowing **Rainbow Star Cape**, and finale **King Crown**.
  - `hero.triggerSwing()`, `hero.triggerBoing()`, `hero.triggerCheer()`
  - `hero.update(dt, time, moveState)`
- `createCritterManager(ctx)` (`src/chars/critters.js`):
  - Spawns initial ambient critters per biome + lucky-drop spawned critters (`piggy`, `bee`, `chick`).
  - `critters.spawn(kind, x, y, z)`, `critters.findNear(x, z, radius)`, `critters.pet(id) -> { x, y, z, kind }` (bouncy heart backflip!), `critters.update(dt, time)`, `critters.getSnapshot()`, `critters.reset(seed)`.
- `createTitanManager(ctx)` (`src/chars/titans.js`):
  - `titans.spawn(titanId, pos?) -> titanObj`: dramatic `0.7 s` ground-pop scale-up animation (`4.2x - 5.0x` hero height!), distinct 3D voxel boss geometry per Titan.
  - `titans.hit(titanId, damage, canBeat)`: if `!canBeat`, triggers Titan belly-laugh animation + spawns 3D Rainbow Spring Cloud under player; if `canBeat`, triggers squash-flash, dizzy stars, and when `hp <= 0`, `0.8 s` spinning pinata burst!
  - `titans.getActive()`, `titans.findNear(x, z, radius)`, `titans.update(dt, time, heroPos)`, `titans.getSnapshot()`, `titans.reset()`.
- `buildFlowerpotMesh(tier)` & `buildWeaponPreviewDataURL(weaponId)` (`src/chars/props3d.js`): reusable 3D pot meshes for Hub Pads / Pickups.

### 5.3 `src/game/{loot_director,pickups,flowerpots,roulette,combat}.js` (`lucky-loot`)
- `createLootDirector(ctx)` (`src/game/loot_director.js`): seeded drop table + starter block guarantee + anti-drought pity (guarantees `pot_seed` or `free_spin_chest` at least every 6 blocks early on!).
- `createPickupManager(ctx)` (`src/game/pickups.js`): 3D bobbing/spinning drops, parabolic pop-out bounce, auto-magnet vacuum into hero (`radius = 3.4` base, `5.5` with `star_cape`), instant auto-equip / gem add + VO trigger.
- `createFlowerpotSystem(ctx)` (`src/game/flowerpots.js`): manages 4 Hub Pads (`tier 0..3`), `plantOrUpgrade(padIdx)`, automatic Star Gem fountain (`spawnPickup('star_gem', ...)` on timer), cost/seed helpers.
- `createRouletteSystem(ctx)` (`src/game/roulette.js`): `canSpin()`, `getSpinCost()`, `startSpin(forcedWeaponId)` -> selects smart-weighted upgrade weapon (always upgrades hero's tier when possible!), runs `2.4 s` strip timeline (or instant settle via `completeSpin()`), equips weapon + awards bonus stars on duplicates.
- `createCombatSystem(ctx)` (`src/game/combat.js`): computes `powerTier` (`1..5`), handles `engageTitan(titanId)`:
  - Under-geared (`powerTier < titan.requiredTier`): triggers **Rainbow Cloud Boing** arc from Titan back to `(0, 1, 3.0)` over `1.1 s`, grants `+3` consolation Star Gems, increments `feedback.boings`, plays Titan laugh VO -> queued Guide coaching VO!
  - Geared (`powerTier >= titan.requiredTier`): deals weapon bonk damage, triggers `45 ms` hit-stop + comic `POW!/BONK!` popup, and on defeat awards `+25` Star Gems + Golden Trophy (`ctx.state.trophies`), checks 4-trophy Grand Finale!

### 5.4 `src/ui/*` & `styles/main.css` (`lucky-ui`)
- `src/data/strings.js`: single source of truth for all English UI text (`0` CJK). Short 1-3 word uppercase/chunky labels (`PLAY`, `SPIN!`, `PLANT!`, `VOICE`, `PAUSE`, `BONK!`, `POW!`, `BOING!`, `SURPRISE TITAN!`, `YOU WIN!`).
- `createUI(ctx)` orchestrating:
  - `title.js`: cheerful translucent sky banner over live 3D island + giant `>= 116x116 px` green `▶ PLAY` button.
  - `hud.js`: non-interactive status badges (`pointer-events: none`: Star Gems pill, `★1..★5` Power Badge + Equipped Weapon icon, Rainbow Shield Hearts, `0/4` Golden Trophy pips) + **4 big `>= 76x76 px` action buttons** (`#btn-hud-spin`, `#btn-hud-pot`, `#btn-hud-voice`, `#btn-hud-menu`).
  - `roulette_modal.js`: full-joy **Mystery Artifact Roulette** overlay with big illustrated weapon cards scrolling horizontally past a glowing center pointer (`2.4 s` cubic-out deceleration + tick callbacks), big `🎰 SPIN!` / `✨ EQUIPPED!` button (`>= 84px` tall), auto-closes cleanly or taps out after celebration.
  - `boss_banner.js`: top-center non-interactive Titan HP & `★` Required Tier bar when a Titan is nearby/active + floating comic `POW! / BONK! / BOING!` burst badges (`pointer-events: none`).
  - `guide_arrow.js`: 3D bouncing golden arrow / world-projected beacon pointing to the single best next action for a 5-year-old (Starter Block -> Plant Flowerpot -> Spin Chest -> Ready Biome Titan!).
  - `pause_modal.js` & `victory_modal.js`: big kid-friendly icon toggles (`Music`, `Sound`, `Voice`, `Lucky Chaos 🎲`, `Resume ▶`, `Keep Playing ▶`).

### 5.5 `tools/gen_voice.py`, `assets/voice/*`, `src/fx/*` (`lucky-vo-audio`)
- `tools/gen_voice.py`: generates **68** pre-recorded neural MP3s via `PYTHONPATH=/tmp/tts_pkgs /tmp/tts_pkgs/bin/edge-tts`, silence-trimmed & normalized (`44.1 kHz`, mono, `64 kbps` MP3, total `<= 4.5 MB`), outputting both `assets/voice/manifest.json` and `src/data/voice_manifest.js`.
- `createAudioFX(ctx)`:
  - `audio.js`, `music.js`, `sfx.js`: WebAudio unlock on first pointer/key gesture, cheerful marimba/chiptune adventure BGM (`duck(-6 dB)` when voice speaks), procedural SFX (`blockHit`, `blockBreak`, `gemPickup`, `potPlant`, `potFountain`, `rouletteTick`, `rouletteWin`, `titanSpawn`, `titanBonk`, `cloudBoing`, `titanPinata`, `victoryFanfare`).
  - `voice.js`: `speak(id, { priority: 'interrupt'|'queue'|'ifIdle' })`, `replayLast()` (auto-unmutes `voice` + `master` if muted, replays `lastId || 'guide_welcome'`), renders `.voice-subtitle` (`role="button"`, `min-height: 72px`, `.is-speaking` golden glow, dynamic obstacle-avoiding top/bottom placement so `0` overlap with HUD/modals!), persists `localStorage['lucky_titan_progress']` safely.
  - `particles.js`: 3D pooled voxel crumb bursts, star sparkles, rainbow spring cloud mesh, and victory fireworks!

---

## 6. Frozen Deterministic Seam (`window.__LUCKY_TITAN__`)
Exposed by `src/core/seam.js`:
- `startGame({ seed = 2026, chaosMode = false } = {})`
- `tapWorld(x, z)`
- `breakBlock(x, y, z)`
- `plantPot(padIdx = 0)`
- `spinChest(forcedWeaponId = null)`
- `spawnTitan(titanId)`
- `bonkTitan(titanId)`
- `replayVoice()`
- `stepFrames(n, dt = 1 / 60)`
- `getState()` -> deep-cloned plain JSON snapshot (`mode`, `seed`, `time`, `chaosMode`, `player`, `blocksBroken`, `activeDrops`, `flowerpots`, `critters`, `titans`, `trophies`, `roulette`, `voice`, `audio`, `feedback`, `perf`).

---

## 7. Numeric Fun, Kid-UX, Visual & Voiceover Gates (`F1..F14`)
Enforced automatically by `tests/run_e2e.py`, `tests/sim_gates.py`, `tests/layout_audit.py`, and `tests/l10n_audit.py`:
- **F1 (Zero Shader Hitch & Boot Speed)**: `▶ PLAY` click-to-playing frame time `<= 80 ms`; `0` console/page/WebGL/HTTP errors.
- **F2 (4-Second First Thrill)**: From `startGame`, tapping the Starter Lucky Block in front of spawn breaks it and spawns glowing loot + plays VO in `<= 3.5 s` (`<= 4.0 s` hard gate).
- **F3 (Snappy Kid Movement)**: Base walk speed `>= 6.8 blocks/s` (`7.2 b/s`); geared walk speed with Blazing Gold Helmet `>= 8.5 blocks/s` (`9.2 b/s`).
- **F4 (Zero Dead Taps)**: Across `>= 350` world/UI taps (blocks, ground, water, cliffs, pads, chest, critters, Titans), `feedback.deadTaps === 0`.
- **F5 (280ms Multi-Tap Debounce)**: Double-tapping `▶ PLAY`, `#btn-hud-spin`, `#btn-hud-pot`, or Roulette `SPIN!` within `120 ms` registers exactly `1` action (zero double-spend or accidental close).
- **F6 (Magic Flowerpot Star Economy)**: Planting Glow -> Crystal -> Ultimate Star Pots visibly fountains Star Gems every `2.5 - 3.5 s`, enabling a Roulette Chest spin within `<= 25 s` without tedious grinding.
- **F7 (Artifact Roulette Thrill & Upgrade Pity)**: Roulette spin animates for `2.0 - 3.0 s` (`2.4 s`), advances hero weapon tier deterministically with zero weapon downgrades, and visibly updates 3D held weapon.
- **F8 (Kid-Safe Titan Cloud Boing)**: Engaging a `★3` or `★4` Titan at `★1` triggers goofy Titan laugh VO + Rainbow Spring Cloud boing back to Hub with `+3` consolation gems, `0` death screens, and `0` item/gem loss.
- **F9 (Powered-Up Titan Pinata & 4-Trophy Finale)**: Engaging each Titan at `powerTier >= requiredTier` lands juicy bonks (`POW!/BONK!`) and pops into a Golden Trophy; `4/4` trophies trigger the Grand Crown Fireworks Victory Podium.
- **F10 (20-Seed Child-Bot Completion & Pacing)**: `20/20` (`100%`) simulated 5-year-old bot seeds complete all `4` Titans in `300 - 720 s` (`5 - 12 min` simulated playtime) with `0` softlocks, plus identical seed -> bit-exact deterministic `getState()` hash!
- **F11 (5-Viewport Responsive & Touch Gate)**: Across `1280x800`, `1024x768`, `768x1024`, `844x390`, `390x844`: `0` scrollbars, `0` overlapping interactive controls/subtitles, `0` clipped text, `<= 5` active-play clickable controls, all interactive targets `>= 72x72 px` (`>= 68 px` hard floor).
- **F12 (Three.js Visual Guardrails)**: Every scene material has `metalness <= 0.22`; every sprite has `toneMapped === false && fog === false`; `camera.rotation.z === 0` across entire run; draw calls `<= 65`.
- **F13 (100% English / Zero CJK)**: `0` matches for `[\u4e00-\u9fff]` across repo source files, runtime DOM `innerText`, `title`, `[aria-label]`, `[title]`, and hooked 2D canvas `fillText`/`strokeText`.
- **F14 (Neural Voiceover & 1-Tap Replay)**: `60 - 85` valid `edge-tts` MP3s (`ffprobe` verified non-empty, total `<= 4.5 MB`), `0` `speechSynthesis` references, `-6 dB` BGM ducking active during speech, and 1-tap `🔊` / subtitle replay works on every screen (including auto-unmuting when muted).
