// Canonical 68-clip Neural Voiceover Catalog (owner: lucky-director).
// Used by tools/gen_voice.py, src/fx/voice.js, src/game/*, src/ui/*, and tests/run_e2e.py.

export const VOICE_SPEAKERS = Object.freeze({
  guide: Object.freeze({ voice: 'en-US-AnaNeural', rate: '+4%', pitch: '+4Hz', role: 'Hero Kid Guide' }),
  fairy: Object.freeze({ voice: 'en-US-JennyNeural', rate: '+8%', pitch: '+12Hz', role: 'Flowerpot & Chest Fairy' }),
  boss_moss: Object.freeze({ voice: 'en-US-ChristopherNeural', rate: '-8%', pitch: '-14Hz', role: 'Mossy Stone Titan' }),
  boss_snow: Object.freeze({ voice: 'en-US-GuyNeural', rate: '-4%', pitch: '-12Hz', role: 'Snow Wizard Titan' }),
  boss_thunder: Object.freeze({ voice: 'en-US-ChristopherNeural', rate: '-6%', pitch: '-16Hz', role: 'Thunder Chief Titan' }),
  boss_king: Object.freeze({ voice: 'en-US-GuyNeural', rate: '-10%', pitch: '-18Hz', role: 'Bedrock King Titan' }),
});

// [id, speaker, text] — 68 short, punchy, expressive English lines for a 5-year-old!
export const VOICE_LINES_SPEC = Object.freeze([
  // --- Hero / Kid Guide: Onboarding & Coaching (10) ---
  ['guide_title', 'guide', 'Welcome to Lucky Block Titans! Tap Play!'],
  ['guide_welcome', 'guide', 'Tap that shiny rainbow block right in front of us!'],
  ['guide_starter_pop', 'guide', "Whoa! Lucky treasures! Let's plant our Magic Flowerpot!"],
  ['guide_tap_pad', 'guide', 'Tap a glowing garden pad to plant your Magic Flowerpot!'],
  ['guide_try_chest', 'guide', 'Ooh! Tap the Giant Golden Chest for a surprise weapon!'],
  ['guide_ready_moss', 'guide', "We're strong! Let's find the Mossy Titan in the meadow!"],
  ['guide_ready_snow', 'guide', "Awesome power! Let's visit Crystal Snow Peak!"],
  ['guide_ready_thunder', 'guide', "Super strong! Let's bonk the Storm Titan by the farm!"],
  ['guide_ready_king', 'guide', "Ultimate power! Let's march into the Golden Castle!"],
  ['guide_boing_hint', 'guide', "Boing! Too big! Let's spin the chest or plant pots first!"],

  // --- Hero / Kid Guide: Lucky Drops & Critters (12) ---
  ['vo_drop_stars', 'guide', 'Yay! Shiny star gems!'],
  ['vo_drop_jackpot', 'guide', 'Whoa! Giant star jackpot!'],
  ['vo_drop_pot_seed', 'guide', 'A Magic Flowerpot seed! Plant it in the garden!'],
  ['vo_drop_chest', 'guide', 'Lucky! A free Golden Chest spin!'],
  ['vo_drop_apple', 'guide', 'Crunch, crunch! Sparkle apple!'],
  ['vo_drop_cake', 'guide', 'Yummy party cake! Bonus shield heart!'],
  ['vo_drop_piggy', 'guide', 'Oink oink! A bouncy treasure piggy popped out!'],
  ['vo_drop_bee', 'guide', 'Buzz buzz! A happy honey bee!'],
  ['vo_pet_piggy', 'guide', 'Hee hee! Piggy loves tummy pats! More stars!'],
  ['vo_pet_bee', 'guide', 'Sweet honey stars! Thank you, little bee!'],
  ['vo_pet_chick', 'guide', 'Peep peep! Good job, sunny chick!'],
  ['vo_titan_alert', 'guide', 'Uh oh! That block is shaking! Surprise Titan!'],

  // --- Hero / Kid Guide: Mythic Weapons & Blazing Gold Armor (9) ---
  ['vo_wpn_sword', 'guide', 'Cool! The Sparkle Sword! Chop, chop!'],
  ['vo_wpn_pickaxe', 'guide', 'Whoa! The Golden Mega Pickaxe! Blocks pop super fast!'],
  ['vo_wpn_trident', 'guide', 'Amazing! The Ocean Trident! Splash power!'],
  ['vo_wpn_hammer', 'guide', 'Boom! The Vortex Thunder Hammer! Watch out, Titans!'],
  ['vo_wpn_rainbow', 'guide', 'No way! The Rainbow Infinity Blade! Maximum star power!'],
  ['vo_gear_boots', 'guide', 'Zoom, zoom! Winged Speed Boots! Look how fast we run!'],
  ['vo_gear_helmet', 'guide', 'Whoa! The Blazing Gold Titan Helmet! Rainbow shield hearts!'],
  ['vo_gear_cape', 'guide', 'Swish! The Royal Star Cape pulls in treasures!'],
  ['vo_chaos_on', 'guide', 'Lucky Chaos Mode! Every block goes super wacky!'],

  // --- Hero / Kid Guide: Flowerpot Upgrades & Combat Cheers (11) ---
  ['vo_pot_glow', 'guide', 'Yay! Our Glow Flowerpot is sprouting shiny stars!'],
  ['vo_pot_crystal', 'guide', 'Sparkly! The Crystal Flowerpot makes double stars!'],
  ['vo_pot_ultimate', 'guide', "Look! The Ultimate Star Flowerpot is raining treasure! We're rich!"],
  ['vo_bonk_cheer1', 'guide', 'Bonk! Right on the tummy!'],
  ['vo_bonk_cheer2', 'guide', 'Pow! Super hit! Keep tapping!'],
  ['vo_win_moss', 'guide', 'Hooray! We popped the Mossy Titan and won a Golden Trophy!'],
  ['vo_win_snow', 'guide', 'Woohoo! Bye bye, Snow Wizard! Trophy number two!'],
  ['vo_win_thunder', 'guide', 'Zap! Down goes the Thunder Chief! Shiny trophy!'],
  ['vo_win_king', 'guide', 'We beat the Bedrock King! You are the Ultimate Titan Champion!'],
  ['vo_finale_parade', 'guide', 'Four Golden Trophies! Fireworks party! Wear your royal crown!'],
  ['vo_keep_playing', 'guide', 'Free play time! Smash blocks and spin for more surprises!'],

  // --- Magic Flowerpot & Roulette Chest Fairy (10) ---
  ['fairy_chest_open', 'fairy', 'Step right up! Spin the Mystery Artifact Chest!'],
  ['fairy_spinning', 'fairy', 'Round and round it goes! Which treasure will glow?'],
  ['fairy_jackpot', 'fairy', 'Ta-da! A legendary artifact, just for you!'],
  ['fairy_bonus_stars', 'fairy', 'Sparkle bonus! Extra star gems and shield power!'],
  ['fairy_need_stars', 'fairy', 'Collect a few more star gems from your flowerpots first!'],
  ['fairy_pot_ready', 'fairy', 'Twinkle, twinkle! A garden pad is ready to bloom!'],
  ['fairy_pot_fountain', 'fairy', 'Starlight shower! Catch the shiny gems!'],
  ['fairy_pot_max', 'fairy', 'Wow! All four Ultimate Flowerpots are blooming bright!'],
  ['fairy_shield_up', 'fairy', 'Bing-bong! Rainbow shield hearts charged up!'],
  ['fairy_welcome_back', 'fairy', 'Welcome back to Star Garden! Ready for more surprises?'],

  // --- 4 Goofy Cartoon Titans: Spawn, Tickle-Boing, Ouch, Pinata Defeat (16) ---
  ['titan_moss_spawn', 'boss_moss', 'YAWN! Who dug up my cozy mossy nap block?!'],
  ['titan_moss_boing', 'boss_moss', 'Ho ho! That tiny stick tickles! Bounce on my cloud!'],
  ['titan_moss_ouch', 'boss_moss', 'Oof! Hey, watch my daisy hair!'],
  ['titan_moss_defeat', 'boss_moss', 'Whoa-oa-oa! My mossy pebbles! Take my trophy!'],

  ['titan_snow_spawn', 'boss_snow', 'BRRR! Nobody melts the Frosty Snow Wizard Titan!'],
  ['titan_snow_boing', 'boss_snow', 'Hee hee! Too chilly for a tiny stick! Boing-oing-oing!'],
  ['titan_snow_ouch', 'boss_snow', 'Yikes! My pointy wizard hat is wobbling!'],
  ['titan_snow_defeat', 'boss_snow', "Achoo! I'm melting into candy stars! Take my trophy!"],

  ['titan_thunder_spawn', 'boss_thunder', 'BOOM BOOM! Who woke the Thunder Chief Titan?!'],
  ['titan_thunder_boing', 'boss_thunder', 'Bwahaha! That tickles my belly! Come back with a bigger weapon!'],
  ['titan_thunder_ouch', 'boss_thunder', 'Zappy-ow! That weapon packs a wallop!'],
  ['titan_thunder_defeat', 'boss_thunder', 'Whoa! My giant thunder underpants! Here is my trophy!'],

  ['titan_king_spawn', 'boss_king', 'STOMP STOMP! Behold the Bedrock Crusher King!'],
  ['titan_king_boing', 'boss_king', 'HO HO HO! You need a mighty hammer to bonk the King! Boing!'],
  ['titan_king_ouch', 'boss_king', 'Blazing blocks! My royal crown is spinning!'],
  ['titan_king_defeat', 'boss_king', 'Oooof! Pinata party! You win my Golden King Trophy!'],
]);
