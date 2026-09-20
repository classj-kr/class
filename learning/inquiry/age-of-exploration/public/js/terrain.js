(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.UW3Terrain = api;
}(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const WORLD_W = 2500;
  const WORLD_H = 1250;
  const TILE = 16;
  const WORLD_PIXEL_W = WORLD_W * TILE;
  const WORLD_PIXEL_H = WORLD_H * TILE;
  let naturalEarthLandMask = null;

  const SPEED = Object.freeze({
    sea: 1.00,
    plain: 0.88,
    coast: 0.76,
    river: 0.58,
    forest: 0.54,
    desert: 0.43,
    mountain: 0.30,
    highMountain: 0.18,
    // 얼음에 갇힌 배가 빠져나오는 속도. 0으로 두면 그 자리에서 영영 못 움직인다.
    ice: 0.26
  });

  const LABEL = Object.freeze({
    sea: '바다',
    plain: '평원',
    coast: '해안·구릉',
    river: '강',
    forest: '숲·밀림',
    desert: '사막',
    mountain: '산악',
    highMountain: '고산',
    ice: '얼음 바다'
  });

  const RIVER_FAMILIES = new Set([60, 61, 62, 68, 88, 92, 97]);
  const FOREST_FAMILIES = new Set([93, 94, 95]);
  // WORLD.CDS 타일 아틀라스에서 큰 산맥 그림이 들어 있는 행이다.
  // 지리 좌표 범위가 아니라 실제 지도에 찍힌 타일로만 고산을 판정한다.
  const HIGH_MOUNTAIN_FAMILIES = new Set([
    44,45,46,47,48,49,50,51,52,53,54,55,56,57,58
  ]);

  const MOUNTAIN_FAMILIES = new Set([
    44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,
    63,64,65,66,67,69,70,71,72,73,74,78,79,80,81,82,
    84,85,86,96,98,99,100,101,102,103,104
  ]);

  // Natural Earth의 0.144도 격자 마스크에서는 폭이 매우 좁은 해협이 육지로 닫힐 수 있다.
  // 실제로 선박이 통과해야 하는 자연 해협만 별도 항로로 열어 둔다.
  // path 좌표는 [위도, 경도], widthDeg는 항로 중심선에서 허용할 반폭이다.
  const NAVIGABLE_SEA_CORRIDORS = Object.freeze([
    Object.freeze({
      id: 'messina',
      widthDeg: 0.26,
      path: Object.freeze([
        Object.freeze([37.88, 15.62]),
        Object.freeze([38.00, 15.60]),
        Object.freeze([38.10, 15.58]),
        Object.freeze([38.20, 15.61]),
        Object.freeze([38.30, 15.65]),
        Object.freeze([38.40, 15.68])
      ])
    }),
    Object.freeze({
      id: 'dardanelles',
      widthDeg: 0.22,
      path: Object.freeze([
        Object.freeze([39.96, 26.05]),
        Object.freeze([40.12, 26.27]),
        Object.freeze([40.28, 26.47]),
        Object.freeze([40.43, 26.66]),
        Object.freeze([40.56, 26.83])
      ])
    }),
    Object.freeze({
      id: 'bosporus',
      widthDeg: 0.20,
      path: Object.freeze([
        Object.freeze([40.94, 28.78]),
        Object.freeze([41.02, 28.92]),
        Object.freeze([41.10, 29.03]),
        Object.freeze([41.18, 29.10]),
        Object.freeze([41.27, 29.16])
      ])
    })
  ]);

  function wrapCellX(cx) {
    cx %= WORLD_W;
    return cx < 0 ? cx + WORLD_W : cx;
  }

  function wrapPixelX(x) {
    x %= WORLD_PIXEL_W;
    return x < 0 ? x + WORLD_PIXEL_W : x;
  }

  function cellValue(world, cx, cy) {
    if (!world || cy < 0 || cy >= WORLD_H) return 0x4000;
    return world[cy * WORLD_W + wrapCellX(cx)];
  }

  function isLandValue(value) {
    return (value & 0x4000) !== 0;
  }

  function setNaturalEarthLandMask(mask) {
    if (!mask) { naturalEarthLandMask = null; return; }
    const view = mask instanceof Uint8Array ? mask : new Uint8Array(mask);
    if (view.length !== WORLD_W * WORLD_H) throw new Error('Natural Earth land mask size mismatch');
    naturalEarthLandMask = view;
  }

  function usesNaturalEarthMask() {
    // V60: Natural Earth 배경과 이동 판정을 전 세계에서 같은 해안선으로 통일한다.
    return true;
  }

  function pointToSegmentDistanceDeg(lat, lon, a, b) {
    const refLat = (lat + a[0] + b[0]) / 3 * Math.PI / 180;
    const lonScale = Math.max(0.2, Math.cos(refLat));
    const px = lon * lonScale;
    const py = lat;
    const ax = a[1] * lonScale;
    const ay = a[0];
    const bx = b[1] * lonScale;
    const by = b[0];
    const dx = bx - ax;
    const dy = by - ay;
    const denom = dx * dx + dy * dy;
    const t = denom > 0 ? Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / denom)) : 0;
    return Math.hypot(px - (ax + dx * t), py - (ay + dy * t));
  }

  function navigableSeaCorridorAtCell(cx, cy) {
    const { lon, lat } = lonLat(cx + 0.5, cy + 0.5);
    for (const corridor of NAVIGABLE_SEA_CORRIDORS) {
      for (let i = 1; i < corridor.path.length; i += 1) {
        if (pointToSegmentDistanceDeg(lat, lon, corridor.path[i - 1], corridor.path[i]) <= corridor.widthDeg) return corridor.id;
      }
    }
    return null;
  }

  function isLandAt(world, cx, cy) {
    cx = wrapCellX(Math.floor(cx));
    cy = Math.max(0, Math.min(WORLD_H - 1, Math.floor(cy)));
    if (navigableSeaCorridorAtCell(cx, cy)) return false;
    if (naturalEarthLandMask && usesNaturalEarthMask(cx, cy)) return naturalEarthLandMask[cy * WORLD_W + cx] === 1;
    return isLandValue(cellValue(world, cx, cy));
  }

  function lonLat(cx, cy) {
    return {
      lon: wrapCellX(cx) / WORLD_W * 360 - 180,
      lat: 90 - cy / WORLD_H * 180
    };
  }

  function inBox(lon, lat, west, east, south, north) {
    return lon >= west && lon <= east && lat >= south && lat <= north;
  }

  function isAridRegion(lon, lat) {
    return (
      inBox(lon, lat, -18, 38, 12, 34) ||       // 사하라
      inBox(lon, lat, 35, 63, 12, 32) ||        // 아라비아
      inBox(lon, lat, 60, 118, 32, 50) ||       // 중앙아시아·고비
      inBox(lon, lat, 112, 148, -37, -16) ||    // 호주 내륙
      inBox(lon, lat, -77, -67, -31, -15) ||    // 아타카마
      inBox(lon, lat, -121, -99, 20, 38) ||     // 북미 남서부
      inBox(lon, lat, 11, 31, -31, -16)         // 칼라하리
    );
  }

  function isForestRegion(lon, lat) {
    return (
      inBox(lon, lat, -81, -47, -17, 9) ||      // 아마존
      inBox(lon, lat, 9, 31, -11, 9) ||         // 콩고 분지
      inBox(lon, lat, 89, 142, -12, 25) ||      // 동남아시아
      inBox(lon, lat, -94, -76, 6, 20)          // 중앙아메리카
    );
  }

  function isCoastalLand(world, cx, cy) {
    const neighbors = [[1,0],[-1,0],[0,1],[0,-1]];
    return neighbors.some(([dx, dy]) => !isLandAt(world, cx + dx, cy + dy));
  }

  // 1520년의 나무배는 북극·남극의 얼음 바다를 지날 수 없었다(북동 항로는 1878년, 북서 항로는 1906년에야 뚫렸다).
  // 바다는 북위 70도부터 막고, 멕시코 만류로 덜 어는 노르웨이 앞바다만 74도까지 연다(사이는 부드럽게).
  // 시베리아 앞바다 항로가 70~77도를 지나므로 80도에서 막으면 꼼수 항로가 그대로 열린다.
  // 남쪽은 62도부터 막는다(혼곶 56도·드레이크 해협 58도는 지난다). 땅은 80도부터 얼음이다.
  // 노르웨이 앞바다(서경 35도~동경 50도)는 74도, 그 밖은 70도. 사이 15도는 부드럽게 이어 얼음 벽처럼 꺾이지 않게 한다.
  // 얼음은 계절에 따라 움직인다. 아래 값은 가장 많이 녹는 한여름 기준이고(지형이 늘 'ice'인 곳),
  // 그보다 남쪽은 겨울에만 어는 바다라 계절에 따라 막았다 열었다 한다.
  // 여름에도 북극을 가로지르는 길(타이미르반도 앞 77.7도, 캐나다 북쪽 섬 사이)은 막힌 채로 둔다.
  const ICE = Object.freeze({ north: 71.5, northAtlantic: 80, rampWest: -50, fullWest: -35, fullEast: 50, rampEast: 65, south: -65, landNorth: 80 });
  // 겨울에 가장 많이 어는 때의 경계와, 얼음이 가장 많은 날·가장 적은 날(북극은 3월 중순·9월 중순, 남극은 그 반대).
  const ICE_WINTER = Object.freeze({ north: 65, northAtlantic: 72, south: -60 });
  const ICE_DAYS = Object.freeze({ northMaxIce: 74, southMaxIce: 263 });

  // 얼음 가장자리는 자로 그은 줄이 아니라 들쭉날쭉하다. 경도에 따라 ±0.8도 안에서 부드럽게 흔든다.
  // 가장 많이 물러나도 북위 71도라, 72도가 넘는 벨로트 해협·타이미르반도 앞바다(북서·북동 항로)는 그대로 막힌다.
  function iceWobble(lon) {
    const r = lon * Math.PI / 180;
    return 0.5 * Math.sin(r * 7) + 0.3 * Math.sin(r * 23 + 1.1);
  }

  function atlanticWeight(lon) {
    if (lon >= ICE.fullWest && lon <= ICE.fullEast) return 1;
    if (lon > ICE.fullEast && lon < ICE.rampEast) return (ICE.rampEast - lon) / (ICE.rampEast - ICE.fullEast);
    if (lon < ICE.fullWest && lon > ICE.rampWest) return (lon - ICE.rampWest) / (ICE.fullWest - ICE.rampWest);
    return 0;
  }

  function iceLimitNorth(lon) {
    return ICE.north + (ICE.northAtlantic - ICE.north) * atlanticWeight(lon) + iceWobble(lon);
  }

  function iceLimitSouth(lon) {
    return ICE.south - iceWobble(lon + 40);
  }

  function isIceAt(lon, lat, sea) {
    if (lat <= iceLimitSouth(lon)) return true;
    return lat >= (sea ? iceLimitNorth(lon) : ICE.landNorth);
  }

  // 게임 날짜(1520년 1월 1일부터 흐른 분)를 그해의 며칠째인지로 바꾼다.
  function dayOfYear(gameMinutes) {
    const date = new Date(Date.UTC(1520, 0, 1) + Math.max(0, Number(gameMinutes) || 0) * 60000);
    return (Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) - Date.UTC(date.getUTCFullYear(), 0, 1)) / 86400000 + 1;
  }

  // 얼음이 가장 많은 날 0, 가장 적은 날 1. 봄가을에는 그 사이 값으로 천천히 움직인다.
  function seasonOpenness(day, maxIceDay) {
    const t = (((Number(day) || 0) - maxIceDay) % 365 + 365) % 365;
    return (1 - Math.cos(2 * Math.PI * t / 365)) / 2;
  }

  function iceLimitNorthAt(lon, day) {
    if (!Number.isFinite(day)) return iceLimitNorth(lon);
    const weight = atlanticWeight(lon);
    const winter = ICE_WINTER.north + (ICE_WINTER.northAtlantic - ICE_WINTER.north) * weight;
    const summer = ICE.north + (ICE.northAtlantic - ICE.north) * weight;
    return winter + (summer - winter) * seasonOpenness(day, ICE_DAYS.northMaxIce) + iceWobble(lon);
  }

  function iceLimitSouthAt(lon, day) {
    if (!Number.isFinite(day)) return iceLimitSouth(lon);
    const open = seasonOpenness(day, ICE_DAYS.southMaxIce);
    return ICE_WINTER.south + (ICE.south - ICE_WINTER.south) * open - iceWobble(lon + 40);
  }

  // 그날 그 자리가 얼어 있는가. 뭍은 계절과 상관없이 80도부터 얼음이다.
  function isIceAtDay(lon, lat, sea, day) {
    if (!sea) return lat >= ICE.landNorth || lat <= iceLimitSouthAt(lon, day);
    return lat >= iceLimitNorthAt(lon, day) || lat <= iceLimitSouthAt(lon, day);
  }

  // 얼음 가장자리 앞 5도는 떠다니는 얼음덩이 구역이다. 벽에 부딪히듯 갑자기 멈추지 않고
  // 여기서부터 배가 천천히 느려지다가 얼음 앞에서 더 못 가게 된다.
  const ICE_SLOW = Object.freeze({ degrees: 5, floor: 0.34 });

  // 1이면 제 속도, 0.34면 얼음을 헤치고 겨우 나아가는 속도. 얼음 안에서도 0이 되지는 않는다.
  function iceSlowdownAt(lon, lat, sea, day) {
    const north = sea ? iceLimitNorthAt(lon, day) : ICE.landNorth;
    const gap = Math.min(north - lat, lat - iceLimitSouthAt(lon, day));
    if (gap >= ICE_SLOW.degrees) return 1;
    if (gap <= 0) return ICE_SLOW.floor;
    return ICE_SLOW.floor + (1 - ICE_SLOW.floor) * (gap / ICE_SLOW.degrees);
  }

  const ICE_TERRAIN = Object.freeze({ type: 'ice', multiplier: SPEED.ice, passable: false });

  function terrainAtCell(world, cx, cy) {
    cx = wrapCellX(Math.floor(cx));
    cy = Math.floor(cy);
    const value = cellValue(world, cx, cy);
    const { lon, lat } = lonLat(cx, cy);
    const land = isLandAt(world, cx, cy);
    if (isIceAt(lon, lat, !land)) return ICE_TERRAIN;
    if (!land) return { type: 'sea', multiplier: SPEED.sea, passable: true };

    const tileId = value & 0x3fff;
    const family = tileId >> 7;
    const special = (value & 0x8000) !== 0;

    if (special) return { type: isCoastalLand(world, cx, cy) ? 'coast' : 'plain', multiplier: isCoastalLand(world, cx, cy) ? SPEED.coast : SPEED.plain, passable: true };
    if (RIVER_FAMILIES.has(family)) return { type: 'river', multiplier: SPEED.river, passable: true };
    if (HIGH_MOUNTAIN_FAMILIES.has(family)) return { type: 'highMountain', multiplier: SPEED.highMountain, passable: true };
    if (FOREST_FAMILIES.has(family) || isForestRegion(lon, lat)) return { type: 'forest', multiplier: SPEED.forest, passable: true };
    if (isAridRegion(lon, lat)) return { type: 'desert', multiplier: SPEED.desert, passable: true };
    if (MOUNTAIN_FAMILIES.has(family)) return { type: 'mountain', multiplier: SPEED.mountain, passable: true };
    if (isCoastalLand(world, cx, cy)) return { type: 'coast', multiplier: SPEED.coast, passable: true };
    return { type: 'plain', multiplier: SPEED.plain, passable: true };
  }

  function terrainAtPixel(world, x, y) {
    return terrainAtCell(world, Math.floor(wrapPixelX(x) / TILE), Math.floor(y / TILE));
  }

  return Object.freeze({
    WORLD_W, WORLD_H, TILE, WORLD_PIXEL_W, WORLD_PIXEL_H,
    SPEED, LABEL, ICE, ICE_WINTER, ICE_DAYS, ICE_SLOW, iceSlowdownAt, HIGH_MOUNTAIN_FAMILIES, NAVIGABLE_SEA_CORRIDORS, iceLimitNorth, iceLimitSouth, isIceAt, iceLimitNorthAt, iceLimitSouthAt, isIceAtDay, dayOfYear, seasonOpenness, wrapCellX, wrapPixelX, cellValue, setNaturalEarthLandMask, navigableSeaCorridorAtCell, terrainAtCell, terrainAtPixel, lonLat
  });
}));
