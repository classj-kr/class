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
    // 마젤란 해협: 1520년 항로가 Natural Earth 격자에서 육지로 닫히는 구간을 잇는다.
    // 동쪽의 좁은 해협에서 푼타아레나스를 지나 남쪽으로 굽고, 서쪽 섬들 사이로 빠져나간다.
    Object.freeze({
      id: 'magellan',
      widthDeg: 0.12,
      path: Object.freeze([
        Object.freeze([-52.400, -68.289]),
        Object.freeze([-52.511, -69.111]),
        Object.freeze([-52.511, -69.311]),
        Object.freeze([-52.422, -69.400]),
        Object.freeze([-52.422, -69.489]),
        Object.freeze([-52.578, -69.711]),
        Object.freeze([-52.689, -70.133]),
        Object.freeze([-52.689, -70.356]),
        Object.freeze([-52.822, -70.400]),
        Object.freeze([-53.244, -70.844]),
        Object.freeze([-53.756, -71.000]),
        Object.freeze([-53.867, -71.244]),
        Object.freeze([-53.867, -71.422]),
        Object.freeze([-53.711, -72.022]),
        Object.freeze([-53.644, -72.222]),
        Object.freeze([-53.511, -72.400]),
        Object.freeze([-53.533, -72.533]),
        Object.freeze([-53.267, -73.222]),
        Object.freeze([-53.089, -73.467]),
        Object.freeze([-52.911, -74.200]),
        Object.freeze([-52.689, -74.689]),
        Object.freeze([-52.644, -75.111])
      ])
    }),
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
    }),
    // 말라카 해협: Natural Earth의 좁은 수로가 육지 마스크에 닫히지 않도록 연다.
    Object.freeze({
      id: 'malacca',
      widthDeg: 0.48,
      path: Object.freeze([
        Object.freeze([5.55, 99.25]),
        Object.freeze([4.65, 99.65]),
        Object.freeze([3.80, 100.30]),
        Object.freeze([2.90, 100.85]),
        Object.freeze([2.25, 101.45]),
        Object.freeze([1.65, 102.35]),
        Object.freeze([1.10, 103.25])
      ])
    }),
    // Bangka Strait: preserve the narrow waterway lost in the coarse land mask.
    // Geographic reference: https://marineregions.org/gazetteer.php?id=32531&p=details
    Object.freeze({
      id: 'bangka',
      widthDeg: 0.12,
      path: Object.freeze([
        Object.freeze([-2.08, 105.12]),
        Object.freeze([-2.23, 105.48]),
        Object.freeze([-2.38, 105.75]),
        Object.freeze([-2.55, 105.77]),
        Object.freeze([-2.70, 105.82]),
        Object.freeze([-2.82, 105.96]),
        Object.freeze([-3.08, 106.30])
      ])
    }),
    // Kanmon Strait: retain a navigable cell along the channel between the islands.
    // Channel chart: https://www6.kaiho.mlit.go.jp/kanmon/info/others/sankouzu/koukouzu-english.pdf
    Object.freeze({
      id: 'kanmon',
      widthDeg: 0.10,
      path: Object.freeze([
        Object.freeze([34.15, 130.77]),
        Object.freeze([33.96, 130.85]),
        Object.freeze([33.93, 130.90]),
        Object.freeze([33.96, 130.96]),
        Object.freeze([33.94, 131.04]),
        Object.freeze([33.86, 131.20])
      ])
    })
  ]);

  // Avoid segment calculations for distant cells during navigation-grid creation.
  // 0.2 is the minimum longitude scale used by pointToSegmentDistanceDeg.
  const CORRIDOR_BOUNDS = NAVIGABLE_SEA_CORRIDORS.map(corridor => ({
    south: Math.min(...corridor.path.map(point => point[0])) - corridor.widthDeg,
    north: Math.max(...corridor.path.map(point => point[0])) + corridor.widthDeg,
    west: Math.min(...corridor.path.map(point => point[1])) - corridor.widthDeg / 0.2,
    east: Math.max(...corridor.path.map(point => point[1])) + corridor.widthDeg / 0.2
  }));

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
    for (let index = 0; index < NAVIGABLE_SEA_CORRIDORS.length; index += 1) {
      const bounds = CORRIDOR_BOUNDS[index];
      if (lat < bounds.south || lat > bounds.north || lon < bounds.west || lon > bounds.east) continue;
      const corridor = NAVIGABLE_SEA_CORRIDORS[index];
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

  // 해빙의 분포와 통항 제한은 구분한다. 해안의 계절성 유빙은 느리게 지나갈 수 있고,
  // 항해를 막는 곳은 극지 중심의 밀집 해빙뿐이다. 특정 연도의 실측 재현이 아닌 학습용 근사다.
  // 근거와 허용적인 통항 정책: ../../docs/sea-ice-model.md
  const ICE = Object.freeze({ south: -78, landNorth: 80 });
  const ICE_WINTER = Object.freeze({ south: -75 });
  const ICE_DAYS = Object.freeze({ northMaxIce: 74, northMinIce: 256, southMaxIce: 263, southMinIce: 51 });

  // 북극해 본체의 해빙 가장자리 [경도, 3월, 9월]. 동그린란드·래브라도의 남하 유빙은
  // 아래의 해안 띠로 따로 그려 남서그린란드와 북대서양 전체를 얼리지 않는다.
  const ICE_EDGE = Object.freeze([
    [-180, 60, 73], [-160, 61, 74], [-140, 70, 75], [-120, 71, 75], [-100, 70, 75],
    [-80, 68, 77], [-60, 69, 80], [-45, 77, 84], [-30, 78, 84], [-15, 80, 83],
    [0, 81, 83], [15, 81, 83], [30, 76, 81], [45, 73, 80], [60, 71, 79],
    [90, 71, 78], [120, 71, 77], [150, 68, 75], [170, 61, 74], [180, 60, 73]
  ]);
  // 통항 제한은 해안과 주요 섬을 충분히 지난 극지 안쪽으로 물린다.
  const ICE_CORE_EDGE = Object.freeze([
    [-180, 81, 84], [-120, 80, 83], [-60, 81, 84], [-30, 83, 85],
    [15, 83, 85], [60, 81, 84], [120, 80, 83], [180, 81, 84]
  ]);
  const ICE_SOUTH_EDGE = Object.freeze([
    [-180, -65, -74], [-140, -65, -73], [-100, -64, -71], [-60, -61, -69],
    [-30, -59.5, -70], [0, -62, -70], [60, -64, -69], [120, -64, -70], [180, -65, -74]
  ]);
  const ICE_EDGE_MIN = Object.freeze({ winter: 44, summer: 44 });

  // 해안에 따른 중심선 [경도, 위도, 겨울 반폭km, 여름 반폭km].
  // 같은 위도라도 먼바다는 열리고 해안 가까이에만 유빙이 남는다. 그림에는 육지 마스크도 적용한다.
  const ICE_COASTS = [
    [[-18,81,180,100],[-18.5,78,180,70],[-20,75,160,50],[-23,72,140,35],[-26.5,69,120,20],[-31,66.5,100,8],[-35.5,64.5,85,0],[-40,62.5,70,0],[-43,60,55,0],[-46,60.5,35,0],[-48,62,20,0]],
    [[-69,77,140,35],[-59,74,120,15],[-55,71,100,0],[-54,69,80,0],[-53.5,67.5,35,0]],
    [[-63,66,160,0],[-62,63,150,0],[-61.5,60,140,0],[-59,57,120,0],[-56,54,95,0],[-54,51,50,0]],
    [[-91,59,260,0],[-88,62,280,0],[-82,64,220,0],[-77,61,130,0],[-80,56,100,0]],
    [[20,65.5,110,0],[22,63.5,75,0],[25,60,55,0],[29,60,55,0]],
    [[40,66,100,0],[37.5,65,90,0]],
    [[142,49,130,0],[144,54,280,0],[150,58,270,0],[157,60,140,0]]
  ].map(path => ({ path, minLat: Math.min(...path.map(p => p[1])) - 3,
    maxLat: Math.max(...path.map(p => p[1])) + 3,
    minLon: Math.min(...path.map(p => p[0])) - 12, maxLon: Math.max(...path.map(p => p[0])) + 12 }));

  function iceEdgeAt(lon, column, edges = ICE_EDGE) {
    let l = ((Number(lon) || 0) + 180) % 360;
    if (l < 0) l += 360;
    l -= 180;
    for (let i = 1; i < edges.length; i += 1) {
      const a = edges[i - 1];
      const b = edges[i];
      if (l <= b[0]) {
        const t = (l - a[0]) / (b[0] - a[0]);
        return a[column] + (b[column] - a[column]) * t;
      }
    }
    return edges[edges.length - 1][column];
  }

  // 얼음 가장자리는 자로 그은 줄이 아니라 들쭉날쭉하다. 경도에 따라 ±0.8도 안에서 부드럽게 흔든다.
  function iceWobble(lon) {
    const r = lon * Math.PI / 180;
    return 0.5 * Math.sin(r * 7) + 0.3 * Math.sin(r * 23 + 1.1);
  }

  function iceLimitNorth(lon) {
    return iceEdgeAt(lon, 2, ICE_CORE_EDGE) + iceWobble(lon) * 0.25;
  }

  function iceLimitSouth(lon) {
    return ICE.south - iceWobble(lon + 40) * 0.25;
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
  function seasonOpenness(day, maxIceDay, minIceDay = maxIceDay + 365 / 2) {
    const t = (((Number(day) || 0) - maxIceDay) % 365 + 365) % 365;
    const meltDays = ((minIceDay - maxIceDay) % 365 + 365) % 365;
    return t <= meltDays ? (1 - Math.cos(Math.PI * t / meltDays)) / 2
      : (1 + Math.cos(Math.PI * (t - meltDays) / (365 - meltDays))) / 2;
  }

  function iceLimitNorthAt(lon, day) {
    if (!Number.isFinite(day)) return iceLimitNorth(lon);
    const winter = iceEdgeAt(lon, 1, ICE_CORE_EDGE);
    const summer = iceEdgeAt(lon, 2, ICE_CORE_EDGE);
    return winter + (summer - winter) * seasonOpenness(day, ICE_DAYS.northMaxIce, ICE_DAYS.northMinIce) + iceWobble(lon) * 0.25;
  }

  function iceLimitSouthAt(lon, day) {
    if (!Number.isFinite(day)) return iceLimitSouth(lon);
    const open = seasonOpenness(day, ICE_DAYS.southMaxIce, ICE_DAYS.southMinIce);
    return ICE_WINTER.south + (ICE.south - ICE_WINTER.south) * open - iceWobble(lon + 40) * 0.25;
  }

  // 그날 통항을 제한하는 극지 중심 해빙인가. 해안의 계절성 유빙은 이 판정에 넣지 않는다.
  function isIceAtDay(lon, lat, sea, day) {
    if (!sea) return lat >= ICE.landNorth || lat <= iceLimitSouthAt(lon, day);
    return lat >= iceLimitNorthAt(lon, day) || lat <= iceLimitSouthAt(lon, day);
  }

  function smoothstep(low, high, value) {
    const t = Math.max(0, Math.min(1, (value - low) / (high - low)));
    return t * t * (3 - 2 * t);
  }

  function coastalIceAt(lon, lat, open) {
    let concentration = 0;
    const scaleX = 111.2 * Math.max(0.08, Math.cos(lat * Math.PI / 180));
    for (const coast of ICE_COASTS) {
      if (lat < coast.minLat || lat > coast.maxLat || lon < coast.minLon || lon > coast.maxLon) continue;
      for (let i = 1; i < coast.path.length; i += 1) {
        const a = coast.path[i - 1], b = coast.path[i];
        const ax = (a[0] - lon) * scaleX, ay = (a[1] - lat) * 111.2;
        const dx = (b[0] - a[0]) * scaleX, dy = (b[1] - a[1]) * 111.2;
        const t = Math.max(0, Math.min(1, -(ax * dx + ay * dy) / (dx * dx + dy * dy)));
        const winter = a[2] + (b[2] - a[2]) * t, summer = a[3] + (b[3] - a[3]) * t;
        const radius = winter + (summer - winter) * open;
        if (radius < 2) continue;
        const distance = Math.hypot(ax + dx * t, ay + dy * t);
        // 여름에 폭이 거의 0이 되는 남부는 농도도 낮춰 가늘고 빽빽한 얼음 선이 남지 않게 한다.
        const strength = 0.86 * Math.min(1, radius / Math.max(15, winter * 0.4));
        concentration = Math.max(concentration, strength * (1 - smoothstep(radius * 0.15, radius, distance)));
      }
    }
    return concentration;
  }

  // 그림·감속·안내가 공유하는 농도. 바다 여부는 호출하는 쪽의 지형 마스크로 판정한다.
  function seaIceConcentrationAt(lon, lat, day) {
    if (!Number.isFinite(lon) || !Number.isFinite(lat) || lat < -90 || lat > 90) return 0;
    lon = ((lon + 180) % 360 + 360) % 360 - 180;
    if (lat > -58 && lat < ICE_EDGE_MIN.winter) return 0;
    const open = Number.isFinite(day) ? seasonOpenness(day, ICE_DAYS.northMaxIce, ICE_DAYS.northMinIce) : 1;
    if (lat >= 0) {
      const edge = iceEdgeAt(lon, 1) + (iceEdgeAt(lon, 2) - iceEdgeAt(lon, 1)) * open + iceWobble(lon) * 0.35;
      return Math.max(smoothstep(edge - 0.25, edge + 2, lat), coastalIceAt(lon, lat, open));
    }
    const southOpen = Number.isFinite(day) ? seasonOpenness(day, ICE_DAYS.southMaxIce, ICE_DAYS.southMinIce) : 1;
    const edge = iceEdgeAt(lon, 1, ICE_SOUTH_EDGE) + (iceEdgeAt(lon, 2, ICE_SOUTH_EDGE) - iceEdgeAt(lon, 1, ICE_SOUTH_EDGE)) * southOpen;
    return smoothstep(-edge - 0.25, -edge + 1.75, -lat);
  }

  const ICE_SLOW = Object.freeze({ degrees: 0.75, floor: 0.72 });

  // 해안의 유빙은 통과할 수 있다. 얼음이 많은 곳에서도 평소의 72% 이상 속도로 나아간다.
  function iceSlowdownAt(lon, lat, sea, day) {
    const concentration = sea ? seaIceConcentrationAt(lon, lat, day)
      : smoothstep(ICE.landNorth - ICE_SLOW.degrees, ICE.landNorth, lat);
    return 1 - (1 - ICE_SLOW.floor) * smoothstep(0.12, 1, concentration);
  }

  // 지구본 지도의 배율. 지도 라이브러리는 화면 가운데 배율을 평면지도(메르카토르)와 같게 맞추는데,
  // 그러면 위도가 높을수록 땅이 크게 그려져(북위 64.5도 아이슬란드가 북위 37.5도 한국보다 1.84배)
  // 평면지도의 문제가 그대로 남는다. 위도만큼 배율을 깎아 화면 1픽셀이 어디서나 같은 거리가 되게 한다.
  function globeMapZoom(gameZoom, lat, tileSize) {
    const worldPixels = WORLD_W * TILE;
    // The bundled MapLibre 6.10 globe scales by cos(center latitude), including
    // beyond 85 degrees when our camera constraint allows polar flight.
    const polarLimit = 90 - TILE / WORLD_PIXEL_H * 180;
    const scaleLatitude = Math.max(-polarLimit, Math.min(polarLimit, lat));
    return Math.log2((worldPixels / (tileSize || 512)) * gameZoom) + Math.log2(Math.cos(scaleLatitude * Math.PI / 180));
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
    SPEED, LABEL, ICE, ICE_WINTER, ICE_DAYS, ICE_EDGE, ICE_EDGE_MIN, ICE_SLOW, seaIceConcentrationAt, iceSlowdownAt, globeMapZoom, HIGH_MOUNTAIN_FAMILIES, NAVIGABLE_SEA_CORRIDORS, iceLimitNorth, iceLimitSouth, isIceAt, iceLimitNorthAt, iceLimitSouthAt, isIceAtDay, dayOfYear, seasonOpenness, wrapCellX, wrapPixelX, cellValue, setNaturalEarthLandMask, navigableSeaCorridorAtCell, terrainAtCell, terrainAtPixel, lonLat
  });
}));
