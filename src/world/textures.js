// Procedural 16x16 pixel-art CanvasTextures and 8x8 voxel atlas (owner: lucky-world).
// Uses crisp NearestFilter + SRGBColorSpace with zero external image dependencies.

import * as THREE from '../../vendor/three.module.min.js';
import { createRng } from '../core/rng.js';

const TILE_SIZE = 16;
const ATLAS_COLS = 8;
const ATLAS_ROWS = 8;
const ATLAS_SIZE = TILE_SIZE * ATLAS_COLS; // 128x128

export const TILE_INDEX = Object.freeze({
  grass_top: 0,
  grass_side: 1,
  dirt: 2,
  path_gold: 3,
  hub_plaza: 4,
  lucky_block: 5,
  flower_red_top: 6,
  flower_red_side: 7,
  flower_sun_top: 8,
  flower_sun_side: 9,
  oak_bark: 10,
  oak_top: 11,
  spruce_bark: 12,
  spruce_top: 13,
  leaves_lush: 14,
  leaves_frost: 15,
  hay_side: 16,
  hay_top: 17,
  pumpkin_front: 18,
  pumpkin_side: 19,
  pumpkin_top: 20,
  melon_side: 21,
  melon_top: 22,
  beehive_front: 23,
  beehive_side: 24,
  beehive_top: 25,
  ice_crystal: 26,
  snow_top: 27,
  snow_side: 28,
  castle_brick: 29,
  furnace_front: 30,
  furnace_side: 31,
  amethyst: 32,
  bedrock_gold: 33,
  mega_titan_side: 34,
  mega_titan_top: 35,
  chest_front: 36,
  chest_side: 37,
  chest_top: 38,
  water: 39,
  farm_soil: 40,
  lantern_glow: 41,
  mushroom_red: 42,
  snowman_face: 43,
});

function makeCanvas(w, h) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return c;
}

function finalizePixelTexture(canvas, repeat = false) {
  const tex = new THREE.CanvasTexture(canvas);
  tex.magFilter = THREE.NearestFilter;
  tex.minFilter = THREE.NearestFilter;
  tex.generateMipmaps = false;
  tex.colorSpace = THREE.SRGBColorSpace;
  if (repeat) {
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
  }
  tex.needsUpdate = true;
  return tex;
}

function fillNoise(ctx, rng, palette, x0 = 0, y0 = 0, w = 16, h = 16) {
  for (let y = y0; y < y0 + h; y++) {
    for (let x = x0; x < x0 + w; x++) {
      ctx.fillStyle = rng.pick(palette);
      ctx.fillRect(x, y, 1, 1);
    }
  }
}

function px(ctx, x, y, color, w = 1, h = 1) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

function drawBitmap(ctx, rows, colorMap, ox = 0, oy = 0) {
  for (let y = 0; y < rows.length; y++) {
    const row = rows[y];
    for (let x = 0; x < row.length; x++) {
      const ch = row[x];
      if (ch !== '.' && colorMap[ch]) {
        ctx.fillStyle = colorMap[ch];
        ctx.fillRect(ox + x, oy + y, 1, 1);
      }
    }
  }
}

function paintTile(name, ctx, emCtx, rng) {
  switch (name) {
    case 'grass_top': {
      fillNoise(ctx, rng, ['#4fd448', '#5ede54', '#44c23e', '#6de861', '#58d84e']);
      // Tiny sunlit clover and buttercup pixel accents
      px(ctx, 3, 4, '#8cf27d');
      px(ctx, 11, 2, '#98f788');
      px(ctx, 6, 12, '#ffe866');
      px(ctx, 13, 10, '#8cf27d');
      break;
    }

    case 'grass_side': {
      fillNoise(ctx, rng, ['#8d5b34', '#7b4d29', '#9d693f', '#6d4222']);
      fillNoise(ctx, rng, ['#4fd448', '#5ede54', '#43c03d', '#6ee862'], 0, 0, 16, 4);
      const fringe = [5, 4, 6, 5, 4, 5, 6, 4, 5, 5, 4, 6, 5, 4, 5, 4];
      for (let x = 0; x < 16; x++) {
        const h = fringe[x];
        px(ctx, x, 3, '#44c23e', 1, h - 3);
        px(ctx, x, h, '#5a381d', 1, 1);
      }
      px(ctx, 4, 10, '#b58456');
      px(ctx, 11, 12, '#b58456');
      break;
    }

    case 'dirt': {
      fillNoise(ctx, rng, ['#8d5b34', '#7c4e29', '#9e6a40', '#6d4222', '#85542f']);
      px(ctx, 2, 5, '#b88758');
      px(ctx, 9, 3, '#5c361a');
      px(ctx, 12, 11, '#b88758');
      px(ctx, 5, 13, '#5c361a');
      break;
    }

    case 'farm_soil': {
      fillNoise(ctx, rng, ['#99c947', '#8bbd3b', '#a8d654', '#7eb032']);
      for (let y = 2; y < 16; y += 4) {
        px(ctx, 0, y, '#7da332', 16, 1);
      }
      px(ctx, 4, 5, '#ffd84d');
      px(ctx, 11, 13, '#ffd84d');
      break;
    }

    case 'path_gold': {
      fillNoise(ctx, rng, ['#ebd59e', '#dfc484', '#f4e2b3', '#cfb16d']);
      // Cobble mortar lines inlaid with warm gold flecks
      px(ctx, 0, 0, '#c29f59', 16, 1);
      px(ctx, 0, 8, '#c29f59', 16, 1);
      px(ctx, 7, 0, '#c29f59', 1, 8);
      px(ctx, 3, 8, '#c29f59', 1, 8);
      px(ctx, 12, 8, '#c29f59', 1, 8);
      px(ctx, 2, 2, '#ffe066', 2, 1);
      px(ctx, 10, 4, '#ffe066', 2, 1);
      px(ctx, 6, 11, '#ffe066', 2, 1);
      break;
    }

    case 'hub_plaza': {
      fillNoise(ctx, rng, ['#f6e9c3', '#edd9a6', '#fbf1d4']);
      // Golden border + cute center star tile
      px(ctx, 0, 0, '#e3be68', 16, 1);
      px(ctx, 0, 15, '#e3be68', 16, 1);
      px(ctx, 0, 0, '#e3be68', 1, 16);
      px(ctx, 15, 0, '#e3be68', 1, 16);
      drawBitmap(
        ctx,
        [
          '..GG..',
          '.GYYG.',
          'GYYYYG',
          'GYYYYG',
          '.GYYG.',
          '..GG..',
        ],
        { G: '#f2b728', Y: '#ffe97d' },
        5,
        5
      );
      break;
    }

    case 'lucky_block': {
      // Diagonal rainbow bands + golden bevel + crisp pixel '?'
      const rainbow = ['#ff4d6d', '#ff922b', '#ffd43b', '#51cf66', '#22b8cf', '#845ef7'];
      for (let y = 0; y < 16; y++) {
        for (let x = 0; x < 16; x++) {
          const band = Math.floor((x + y) / 3) % rainbow.length;
          px(ctx, x, y, rainbow[band]);
        }
      }
      // Golden frame
      px(ctx, 0, 0, '#ffe066', 16, 2);
      px(ctx, 0, 14, '#e69d00', 16, 2);
      px(ctx, 0, 0, '#ffd43b', 2, 16);
      px(ctx, 14, 0, '#e69d00', 2, 16);
      px(ctx, 1, 1, '#fff9db', 1, 1);
      px(ctx, 14, 1, '#fff9db', 1, 1);

      const qRows = [
        '..WWWW..',
        '.WWWWWWS',
        '.WW..WWS',
        '....WWWS',
        '...WWWS.',
        '...WWS..',
        '...SSS..',
        '...WW...',
        '...WWS..',
        '....SS..',
      ];
      drawBitmap(ctx, qRows, { W: '#ffffff', S: '#7c4300' }, 4, 3);
      drawBitmap(emCtx, qRows, { W: '#fff4b8', S: '#332000' }, 4, 3);
      px(emCtx, 0, 0, '#664d14', 16, 2);
      px(emCtx, 0, 14, '#664d14', 16, 2);
      break;
    }

    case 'flower_red_top': {
      fillNoise(ctx, rng, ['#e0243c', '#f73b52', '#c81930']);
      drawBitmap(
        ctx,
        [
          '..RRRRRRRRRR..',
          '.RPPPPPPPPPRR.',
          'RPPPRRRRRRPPPR',
          'RPPRYYYYYYRPPR',
          'RPRYYYYYYYYRPR',
          'RPRYYGGGGYYRPR',
          'RPRYYGGGGYYRPR',
          'RPRYYYYYYYYRPR',
          'RPPRYYYYYYRPPR',
          'RPPPRRRRRRPPPR',
          '.RPPPPPPPPPRR.',
          '..RRRRRRRRRR..',
        ],
        { R: '#c9182b', P: '#ff6b7d', Y: '#ffe066', G: '#ff922b' },
        1,
        2
      );
      break;
    }

    case 'flower_red_side': {
      fillNoise(ctx, rng, ['#37b24d', '#2f9e44', '#40c057'], 0, 8, 16, 8);
      fillNoise(ctx, rng, ['#f03e52', '#ff6b7d', '#d62238'], 0, 0, 16, 9);
      for (let x = 0; x < 16; x += 4) {
        px(ctx, x + 1, 8, '#ff6b7d', 2, 3);
        px(ctx, x, 11, '#51cf66', 2, 5);
      }
      break;
    }

    case 'flower_sun_top': {
      fillNoise(ctx, rng, ['#fab005', '#ffd43b', '#ffec78']);
      drawBitmap(
        ctx,
        [
          '..YYYYYYYYYY..',
          '.YLLLLLLLLLLY.',
          'YLLBBBBBBBBLLY',
          'YLBBBBBBBBBBBY',
          'YLBBDDDDDDBBLY',
          'YLBBDDDDDDBBLY',
          'YLBBBBBBBBBBBY',
          'YLLBBBBBBBBLLY',
          '.YLLLLLLLLLLY.',
          '..YYYYYYYYYY..',
        ],
        { Y: '#f59f00', L: '#fff08a', B: '#8a5021', D: '#5c3210' },
        1,
        3
      );
      break;
    }

    case 'flower_sun_side': {
      fillNoise(ctx, rng, ['#40c057', '#2f9e44', '#51cf66'], 0, 8, 16, 8);
      fillNoise(ctx, rng, ['#ffd43b', '#fcc419', '#ffe875'], 0, 0, 16, 9);
      for (let x = 0; x < 16; x += 4) {
        px(ctx, x + 1, 8, '#ffe066', 2, 3);
      }
      break;
    }

    case 'oak_bark': {
      for (let x = 0; x < 16; x++) {
        const col = x % 4 === 0 ? '#5e3c1e' : x % 2 === 0 ? '#7c522b' : '#8f6136';
        px(ctx, x, 0, col, 1, 16);
      }
      for (let i = 0; i < 18; i++) {
        px(ctx, rng.int(0, 15), rng.int(0, 15), rng.pick(['#4d3016', '#a47345']), 1, 2);
      }
      break;
    }

    case 'oak_top': {
      px(ctx, 0, 0, '#6b4423', 16, 16);
      px(ctx, 2, 2, '#cca468', 12, 12);
      px(ctx, 4, 4, '#b08648', 8, 8);
      px(ctx, 5, 5, '#dfc08a', 6, 6);
      px(ctx, 7, 7, '#8f6531', 2, 2);
      break;
    }

    case 'spruce_bark': {
      for (let x = 0; x < 16; x++) {
        const col = x % 4 === 0 ? '#362216' : x % 2 === 0 ? '#4d3221' : '#5e3e2a';
        px(ctx, x, 0, col, 1, 16);
      }
      for (let i = 0; i < 14; i++) {
        px(ctx, rng.int(0, 15), rng.int(0, 15), rng.pick(['#29190f', '#75513a', '#a5e8f7']), 1, 1);
      }
      break;
    }

    case 'spruce_top': {
      px(ctx, 0, 0, '#3d2719', 16, 16);
      px(ctx, 2, 2, '#ab8454', 12, 12);
      px(ctx, 4, 4, '#8c663b', 8, 8);
      px(ctx, 6, 6, '#c7a272', 4, 4);
      break;
    }

    case 'leaves_lush': {
      fillNoise(ctx, rng, ['#2f9e44', '#37b24d', '#40c057', '#2b8a3e', '#5ccf68']);
      px(ctx, 3, 3, '#96f29c');
      px(ctx, 11, 6, '#ff8787');
      px(ctx, 6, 12, '#ffe066');
      px(ctx, 13, 13, '#96f29c');
      break;
    }

    case 'leaves_frost': {
      fillNoise(ctx, rng, ['#2c8fa3', '#3ca8bd', '#5bc4d6', '#e3f8ff', '#ffffff']);
      px(ctx, 0, 0, '#f0fbff', 16, 3);
      px(ctx, 2, 3, '#ffffff', 3, 2);
      px(ctx, 10, 3, '#ffffff', 4, 2);
      break;
    }

    case 'hay_side': {
      for (let y = 0; y < 16; y++) {
        for (let x = 0; x < 16; x++) {
          px(ctx, x, y, (x + y * 2) % 3 === 0 ? '#eab82e' : '#ffd859');
        }
      }
      px(ctx, 0, 4, '#e03131', 16, 2);
      px(ctx, 0, 10, '#e03131', 16, 2);
      px(ctx, 0, 5, '#b02020', 16, 1);
      px(ctx, 0, 11, '#b02020', 16, 1);
      break;
    }

    case 'hay_top': {
      fillNoise(ctx, rng, ['#f2c238', '#ffd95e', '#dfb028', '#ffe688']);
      px(ctx, 2, 7, '#e03131', 12, 2);
      px(ctx, 7, 2, '#e03131', 2, 12);
      break;
    }

    case 'pumpkin_side': {
      for (let x = 0; x < 16; x++) {
        const rib = x % 4 === 0 ? '#d95c0e' : x % 4 === 2 ? '#ff9938' : '#f27818';
        px(ctx, x, 0, rib, 1, 16);
      }
      px(ctx, 0, 0, '#e06612', 16, 1);
      px(ctx, 0, 15, '#c7500a', 16, 1);
      break;
    }

    case 'pumpkin_front': {
      for (let x = 0; x < 16; x++) {
        const rib = x % 4 === 0 ? '#d95c0e' : x % 4 === 2 ? '#ff9938' : '#f27818';
        px(ctx, x, 0, rib, 1, 16);
      }
      // Happy friendly smiling pumpkin face
      const face = [
        '..GGG.....GGG..',
        '.GYYYG...GYYYG.',
        '.GYYYG...GYYYG.',
        '...............',
        '..GG.......GG..',
        '..GYYGGGGGGYYG.',
        '...GYYYYYYYYG..',
        '....GGGGGGGG...',
      ];
      drawBitmap(ctx, face, { G: '#7a2e00', Y: '#fff3a1' }, 0, 4);
      drawBitmap(emCtx, face, { G: '#220b00', Y: '#ffd43b' }, 0, 4);
      break;
    }

    case 'pumpkin_top': {
      fillNoise(ctx, rng, ['#f27818', '#ff9433', '#dc5f10']);
      px(ctx, 6, 6, '#37b24d', 4, 4);
      px(ctx, 7, 7, '#69db7c', 2, 2);
      break;
    }

    case 'melon_side': {
      for (let x = 0; x < 16; x++) {
        const stripe = x % 4 === 0 ? '#2b8a3e' : x % 4 === 1 ? '#37b24d' : '#74e382';
        px(ctx, x, 0, stripe, 1, 16);
      }
      for (let i = 0; i < 16; i++) {
        px(ctx, rng.int(0, 15), rng.int(0, 15), '#51cf66', 1, 1);
      }
      break;
    }

    case 'melon_top': {
      fillNoise(ctx, rng, ['#37b24d', '#51cf66', '#2b8a3e', '#8ce99a']);
      px(ctx, 6, 6, '#2b8a3e', 4, 4);
      break;
    }

    case 'beehive_side': {
      for (let y = 0; y < 16; y++) {
        const plank = y % 4 === 0 ? '#c98816' : y % 2 === 0 ? '#f0b429' : '#f7c948';
        px(ctx, 0, y, plank, 16, 1);
      }
      px(ctx, 3, 5, '#ffaa00', 3, 2);
      px(ctx, 10, 9, '#ffaa00', 3, 2);
      break;
    }

    case 'beehive_front': {
      for (let y = 0; y < 16; y++) {
        const plank = y % 4 === 0 ? '#c98816' : y % 2 === 0 ? '#f0b429' : '#f7c948';
        px(ctx, 0, y, plank, 16, 1);
      }
      // Honey slot + golden dripping honey
      px(ctx, 4, 6, '#5c3608', 8, 3);
      px(ctx, 5, 9, '#ffb703', 6, 2);
      px(ctx, 6, 11, '#ffd166', 2, 3);
      px(ctx, 10, 10, '#ffd166', 1, 2);
      px(emCtx, 5, 9, '#aa7400', 6, 3);
      break;
    }

    case 'beehive_top': {
      fillNoise(ctx, rng, ['#f0b429', '#f7c948', '#d9981e']);
      px(ctx, 1, 1, '#c98816', 14, 1);
      px(ctx, 1, 14, '#c98816', 14, 1);
      break;
    }

    case 'ice_crystal': {
      for (let y = 0; y < 16; y++) {
        for (let x = 0; x < 16; x++) {
          const d = Math.abs(x - 7.5) + Math.abs(y - 7.5);
          const col = d < 4 ? '#ffffff' : d < 7 ? '#99f6ff' : d < 10 ? '#3de0ff' : '#15aabf';
          px(ctx, x, y, col);
        }
      }
      px(ctx, 3, 3, '#ffffff', 2, 2);
      px(ctx, 11, 10, '#cbfbff', 2, 2);
      px(emCtx, 3, 3, '#52d9f7', 10, 10);
      break;
    }

    case 'snow_top': {
      fillNoise(ctx, rng, ['#f2fbff', '#e4f6ff', '#ffffff', '#d8effc']);
      px(ctx, 4, 4, '#ffffff', 2, 1);
      px(ctx, 11, 9, '#ffffff', 2, 1);
      break;
    }

    case 'snow_side': {
      fillNoise(ctx, rng, ['#7b8fa6', '#697d94', '#8ea3ba']);
      fillNoise(ctx, rng, ['#f2fbff', '#ffffff', '#dff3ff'], 0, 0, 16, 6);
      const drips = [6, 8, 7, 5, 6, 9, 7, 6, 5, 7, 8, 6, 5, 7, 6, 6];
      for (let x = 0; x < 16; x++) {
        px(ctx, x, 5, '#f2fbff', 1, drips[x] - 5);
        px(ctx, x, drips[x], '#bae6fd', 1, 1);
      }
      break;
    }

    case 'castle_brick': {
      fillNoise(ctx, rng, ['#ddd6e8', '#cec5dc', '#eae4f2']);
      // Masonry lines with royal gold trim
      px(ctx, 0, 0, '#d9a926', 16, 1);
      px(ctx, 0, 8, '#a79db8', 16, 1);
      px(ctx, 7, 1, '#a79db8', 1, 7);
      px(ctx, 15, 9, '#a79db8', 1, 7);
      px(ctx, 2, 2, '#ffd43b', 3, 1);
      px(ctx, 10, 10, '#ffd43b', 3, 1);
      break;
    }

    case 'furnace_side': {
      fillNoise(ctx, rng, ['#49445c', '#3d384f', '#57516d']);
      px(ctx, 0, 0, '#ffd43b', 16, 2);
      px(ctx, 0, 14, '#e0a81e', 16, 2);
      px(ctx, 7, 2, '#322e42', 2, 12);
      break;
    }

    case 'furnace_front': {
      fillNoise(ctx, rng, ['#49445c', '#3d384f', '#57516d']);
      px(ctx, 0, 0, '#ffd43b', 16, 2);
      px(ctx, 0, 14, '#e0a81e', 16, 2);
      // Blazing royal hearth
      px(ctx, 3, 4, '#241e30', 10, 9);
      px(ctx, 4, 5, '#ff6b1a', 8, 7);
      px(ctx, 5, 6, '#ffb703', 6, 5);
      px(ctx, 6, 8, '#fff7bd', 4, 3);
      // Gold grate bars
      px(ctx, 6, 4, '#ffd43b', 1, 9);
      px(ctx, 9, 4, '#ffd43b', 1, 9);
      px(emCtx, 4, 5, '#ff8822', 8, 7);
      px(emCtx, 6, 7, '#fff099', 4, 4);
      break;
    }

    case 'amethyst': {
      for (let y = 0; y < 16; y++) {
        for (let x = 0; x < 16; x++) {
          const v = ((x * 3 + y * 5) % 7);
          const col = v === 0 ? '#f3d9fa' : v < 3 ? '#cc5de8' : v < 5 ? '#9c36b5' : '#702499';
          px(ctx, x, y, col);
        }
      }
      px(ctx, 3, 4, '#ffffff', 2, 2);
      px(ctx, 10, 3, '#f3d9fa', 2, 2);
      px(ctx, 11, 11, '#ffffff', 2, 2);
      px(emCtx, 2, 2, '#8b35b8', 12, 12);
      break;
    }

    case 'bedrock_gold': {
      fillNoise(ctx, rng, ['#343046', '#46415c', '#292538', '#524c6b']);
      px(ctx, 0, 0, '#ffd43b', 16, 2);
      px(ctx, 0, 14, '#e6a817', 16, 2);
      px(ctx, 2, 5, '#ffd43b', 3, 2);
      px(ctx, 9, 8, '#ffe066', 4, 2);
      px(ctx, 5, 11, '#ffd43b', 3, 1);
      px(emCtx, 2, 5, '#7a5c00', 3, 2);
      px(emCtx, 9, 8, '#7a5c00', 4, 2);
      break;
    }

    case 'mega_titan_side': {
      fillNoise(ctx, rng, ['#3b2e58', '#4c3b70', '#2d2245']);
      // Bold golden-rainbow border
      px(ctx, 0, 0, '#ffd43b', 16, 2);
      px(ctx, 0, 14, '#ff922b', 16, 2);
      px(ctx, 0, 0, '#ffd43b', 2, 16);
      px(ctx, 14, 0, '#ff922b', 2, 16);
      // Pixel Crown + Exclamation emblem
      const emblem = [
        '.Y...Y...Y.',
        '.YY.YYY.YY.',
        '.YYYYYYYYY.',
        '..WWWWWWW..',
        '....WWW....',
        '....WWW....',
        '....WWW....',
        '...........',
        '....WWW....',
        '....WWW....',
      ];
      drawBitmap(ctx, emblem, { Y: '#ffe066', W: '#ffffff' }, 3, 3);
      drawBitmap(emCtx, emblem, { Y: '#ffb703', W: '#fff4bd' }, 3, 3);
      break;
    }

    case 'mega_titan_top': {
      fillNoise(ctx, rng, ['#4c3b70', '#3b2e58']);
      px(ctx, 0, 0, '#ffd43b', 16, 2);
      px(ctx, 0, 14, '#ffd43b', 16, 2);
      px(ctx, 0, 0, '#ffd43b', 2, 16);
      px(ctx, 14, 0, '#ffd43b', 2, 16);
      px(ctx, 4, 4, '#ff6b6b', 8, 8);
      px(ctx, 6, 6, '#ffe066', 4, 4);
      px(emCtx, 5, 5, '#ffaa33', 6, 6);
      break;
    }

    case 'chest_front': {
      fillNoise(ctx, rng, ['#e09124', '#cf7f17', '#eda338']);
      px(ctx, 0, 0, '#ffe066', 16, 2);
      px(ctx, 0, 14, '#ffd43b', 16, 2);
      px(ctx, 0, 0, '#ffd43b', 2, 16);
      px(ctx, 14, 0, '#ffd43b', 2, 16);
      px(ctx, 0, 5, '#66390a', 16, 2);
      // Chunky golden latch with bright ruby heart-gem clasp
      px(ctx, 5, 3, '#fff3a1', 6, 7);
      px(ctx, 6, 4, '#ff2a55', 4, 5);
      px(ctx, 7, 5, '#ff8fa3', 2, 2);
      px(emCtx, 5, 3, '#aa7700', 6, 7);
      px(emCtx, 6, 4, '#ff3366', 4, 5);
      break;
    }

    case 'chest_side': {
      fillNoise(ctx, rng, ['#e09124', '#cf7f17', '#eda338']);
      px(ctx, 0, 0, '#ffe066', 16, 2);
      px(ctx, 0, 14, '#ffd43b', 16, 2);
      px(ctx, 0, 0, '#ffd43b', 2, 16);
      px(ctx, 14, 0, '#ffd43b', 2, 16);
      px(ctx, 0, 5, '#66390a', 16, 2);
      break;
    }

    case 'chest_top': {
      fillNoise(ctx, rng, ['#f0a63a', '#e09124', '#f7b952']);
      px(ctx, 0, 0, '#ffe066', 16, 2);
      px(ctx, 0, 14, '#ffd43b', 16, 2);
      px(ctx, 0, 0, '#ffd43b', 2, 16);
      px(ctx, 14, 0, '#ffd43b', 2, 16);
      px(ctx, 6, 2, '#fff3a1', 4, 12);
      px(ctx, 7, 6, '#39d5ff', 2, 4);
      px(emCtx, 6, 2, '#664d00', 4, 12);
      break;
    }

    case 'water': {
      fillNoise(ctx, rng, ['#22b8e6', '#2fc4f0', '#1aa8d6', '#4dd2f7']);
      px(ctx, 2, 3, '#a5f3fc', 4, 1);
      px(ctx, 9, 8, '#ccfbf1', 5, 1);
      px(ctx, 4, 13, '#a5f3fc', 4, 1);
      break;
    }

    case 'lantern_glow': {
      px(ctx, 0, 0, '#e09f1f', 16, 16);
      px(ctx, 2, 2, '#ffe066', 12, 12);
      px(ctx, 4, 4, '#fff9db', 8, 8);
      px(emCtx, 1, 1, '#ffd43b', 14, 14);
      px(emCtx, 4, 4, '#ffffff', 8, 8);
      break;
    }

    case 'mushroom_red': {
      fillNoise(ctx, rng, ['#e03131', '#f03e3e', '#c92a2a']);
      px(ctx, 2, 3, '#fff9db', 3, 3);
      px(ctx, 10, 2, '#fff9db', 3, 3);
      px(ctx, 6, 9, '#fff9db', 4, 3);
      px(ctx, 11, 11, '#fff9db', 2, 2);
      break;
    }

    case 'snowman_face': {
      fillNoise(ctx, rng, ['#f2fbff', '#ffffff', '#e6f6ff']);
      px(ctx, 4, 5, '#212529', 2, 2);
      px(ctx, 10, 5, '#212529', 2, 2);
      px(ctx, 7, 7, '#ff7b1c', 3, 2);
      px(ctx, 4, 11, '#212529', 2, 1);
      px(ctx, 6, 12, '#212529', 4, 1);
      px(ctx, 10, 11, '#212529', 2, 1);
      break;
    }

    default: {
      fillNoise(ctx, rng, ['#66d9e8', '#3bc9db']);
      break;
    }
  }
}

export function getAtlasUVRect(tileIdx) {
  const col = tileIdx % ATLAS_COLS;
  const row = Math.floor(tileIdx / ATLAS_COLS);
  const pad = 0.12 / ATLAS_SIZE;
  const u0 = (col * TILE_SIZE) / ATLAS_SIZE + pad;
  const u1 = ((col + 1) * TILE_SIZE) / ATLAS_SIZE - pad;
  // Canvas y=0 is top; Three.js flipY=true maps v=1 to top of canvas
  const v1 = 1 - (row * TILE_SIZE) / ATLAS_SIZE - pad;
  const v0 = 1 - ((row + 1) * TILE_SIZE) / ATLAS_SIZE + pad;
  return { u0, v0, u1, v1 };
}

// Creates a unit BoxGeometry(w, h, d) with per-face atlas UV mapping (+x, -x, +y, -y, +z, -z).
export function createAtlasBoxGeometry(faceTiles, w = 1, h = 1, d = 1) {
  const geo = new THREE.BoxGeometry(w, h, d);
  const uv = geo.attributes.uv;
  const tiles = [
    faceTiles.px ?? faceTiles.side,
    faceTiles.nx ?? faceTiles.side,
    faceTiles.py ?? faceTiles.top ?? faceTiles.side,
    faceTiles.ny ?? faceTiles.bottom ?? faceTiles.top ?? faceTiles.side,
    faceTiles.pz ?? faceTiles.front ?? faceTiles.side,
    faceTiles.nz ?? faceTiles.back ?? faceTiles.front ?? faceTiles.side,
  ];
  for (let f = 0; f < 6; f++) {
    const { u0, v0, u1, v1 } = getAtlasUVRect(tiles[f]);
    const base = f * 4;
    // BoxGeometry face vertex UV order: (0,1), (1,1), (0,0), (1,0)
    uv.setXY(base + 0, u0, v1);
    uv.setXY(base + 1, u1, v1);
    uv.setXY(base + 2, u0, v0);
    uv.setXY(base + 3, u1, v0);
  }
  uv.needsUpdate = true;
  return geo;
}

function createRingGlowTexture() {
  const size = 64;
  const canvas = makeCanvas(size, size);
  const ctx = canvas.getContext('2d');
  const cx = size / 2;
  const cy = size / 2;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const r = Math.hypot(x + 0.5 - cx, y + 0.5 - cy) / (size * 0.5);
      if (r > 1) continue;
      // Bright crisp outer ring + soft inner floor aura
      const ringBand = Math.exp(-Math.pow((r - 0.78) / 0.11, 2));
      const innerFill = r < 0.78 ? 0.24 * (1 - r * 0.5) : 0;
      const alpha = Math.min(1, ringBand * 0.92 + innerFill);
      if (alpha > 0.02) {
        ctx.fillStyle = `rgba(255,255,255,${alpha.toFixed(3)})`;
        ctx.fillRect(x, y, 1, 1);
      }
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.magFilter = THREE.LinearFilter;
  tex.minFilter = THREE.LinearFilter;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

function createSunTexture() {
  const size = 64;
  const canvas = makeCanvas(size, size);
  const ctx = canvas.getContext('2d');
  const cx = size / 2;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const r = Math.hypot(x + 0.5 - cx, y + 0.5 - cx) / cx;
      if (r < 1) {
        const glow = Math.pow(Math.max(0, 1 - r), 2.1) * 0.72;
        ctx.fillStyle = `rgba(255,244,184,${glow.toFixed(3)})`;
        ctx.fillRect(x, y, 1, 1);
      }
    }
  }
  // Crisp voxel sun square core
  px(ctx, 20, 20, '#ffd43b', 24, 24);
  px(ctx, 23, 23, '#fff9db', 18, 18);
  const tex = new THREE.CanvasTexture(canvas);
  tex.magFilter = THREE.NearestFilter;
  tex.minFilter = THREE.LinearFilter;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

function createSparkleTexture() {
  const size = 16;
  const canvas = makeCanvas(size, size);
  const ctx = canvas.getContext('2d');
  px(ctx, 7, 1, 'rgba(255,255,255,0.95)', 2, 14);
  px(ctx, 1, 7, 'rgba(255,255,255,0.95)', 14, 2);
  px(ctx, 5, 5, '#ffffff', 6, 6);
  return finalizePixelTexture(canvas, false);
}

export function createWorldTextures() {
  const rng = createRng(1337);
  const atlasCanvas = makeCanvas(ATLAS_SIZE, ATLAS_SIZE);
  const atlasCtx = atlasCanvas.getContext('2d');
  const emCanvas = makeCanvas(ATLAS_SIZE, ATLAS_SIZE);
  const emCtx = emCanvas.getContext('2d');
  emCtx.fillStyle = '#000000';
  emCtx.fillRect(0, 0, ATLAS_SIZE, ATLAS_SIZE);

  const tiles = {};

  for (const [name, idx] of Object.entries(TILE_INDEX)) {
    const tileCanvas = makeCanvas(TILE_SIZE, TILE_SIZE);
    const tCtx = tileCanvas.getContext('2d');
    const tileEmCanvas = makeCanvas(TILE_SIZE, TILE_SIZE);
    const tEmCtx = tileEmCanvas.getContext('2d');
    tEmCtx.fillStyle = '#000000';
    tEmCtx.fillRect(0, 0, TILE_SIZE, TILE_SIZE);

    paintTile(name, tCtx, tEmCtx, rng);

    const col = idx % ATLAS_COLS;
    const row = Math.floor(idx / ATLAS_COLS);
    atlasCtx.drawImage(tileCanvas, col * TILE_SIZE, row * TILE_SIZE);
    emCtx.drawImage(tileEmCanvas, col * TILE_SIZE, row * TILE_SIZE);

    tiles[name] = finalizePixelTexture(tileCanvas, name === 'water');
  }

  const atlasTexture = finalizePixelTexture(atlasCanvas, false);
  const emissiveAtlasTexture = finalizePixelTexture(emCanvas, false);

  return {
    tiles,
    atlasTexture,
    emissiveAtlasTexture,
    ringGlowTex: createRingGlowTexture(),
    sunTex: createSunTexture(),
    sparkleTex: createSparkleTexture(),
  };
}
