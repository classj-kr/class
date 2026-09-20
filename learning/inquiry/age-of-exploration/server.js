'use strict';

const path = require('node:path');
const fs = require('node:fs');
const http = require('node:http');
const crypto = require('node:crypto');
const express = require('express');
const { Server } = require('socket.io');
const Terrain = require('./public/js/terrain.js');
const OceanCurrent = require('./public/js/ocean-current.js');
const MajorWind = require('./public/js/wind.js');
const GeoMotion = require('./public/js/geo-motion.js');
const ClassroomStore = require('./lib/classroom-store.js');
const MissionCatalog = require('./lib/mission-catalog.js');
const Fatigue = require('./lib/fatigue.js');
const NavGrid = require('./lib/nav-grid.js');
const ShipMotion = require('./lib/ship-motion.js');
const ArrivalZones = require('./lib/arrival-zones.js');
const { createDiscoveryAccess } = require('./lib/discovery-access.js');
const CompletionRewards = require('./lib/completion-rewards.js');
const FinalQuiz = require('./lib/final-quiz.js');
const VoyageShips = require('./public/js/ship-designs.js');
const SHIP_ORIGINS = require('./data/catalog/ship-origins.json').ports;
const ARRIVAL_ZONES = require('./data/catalog/arrival-zones.json');

const PORT = Number(process.env.PORT || 3000);
const { WORLD_W, WORLD_H, TILE, WORLD_PIXEL_W, WORLD_PIXEL_H, SPEED: TERRAIN_SPEED } = Terrain;
const START = { x: 1181.5 * TILE, y: 356.5 * TILE };
const LISBON = Object.freeze({
  harbor: { x: 1185.5 * TILE, y: 357.5 * TILE },
  city: { x: 1186.5 * TILE, y: 356.5 * TILE },
  landGate: { x: 1188.5 * TILE, y: 356.5 * TILE }
});
const SEA_BASE_SPEED = 132;
const LAND_BASE_SPEED = 96;

const CURRENT_TAIL_FACTOR = 0.40;
const CURRENT_STRONG_CORE_TAIL_FACTOR = 0.80;
const CURRENT_HEAD_FACTOR = 0.23;
const CURRENT_CROSS_FACTOR = 0.14;
const WIND_TAIL_FACTOR = 1.00;
const WIND_HEAD_FACTOR = 0.65;
// Keep the on-screen travel pace brisk while expressing movement in believable
// historical speeds: 30 game-hours pass during one real second.
const GAME_HOURS_PER_REAL_SECOND = 30;
// V47: V45의 '시간 2배'를 날짜만이 아니라 전체 시뮬레이션에 동일 적용한다.
const SIMULATION_RATE = 2;
const PORT_ENTRY_GAME_MINUTES = 360;
const PORT_TRANSFER_GAME_MINUTES = 240;
const RETURN_CITY_GAME_MINUTES = 120;
const STARTING_MONEY = 5000;
const TICK_HZ = 20;
const SNAPSHOT_HZ = 10;
const NEARBY_RADIUS = 34 * TILE;
const MAX_ROOM_PLAYERS = 45;
const PORT_RADIUS = 2.15 * TILE;
const LAND_GATE_RADIUS = 2.25 * TILE;
// 항구 행동은 도시 근처가 아니라 원작의 실제 해상/육상 출입 셀에 닿았을 때만 허용한다.
// 파나마처럼 좁은 지협 반대편 바다에서 항구 명령이 뜨는 것을 막는다.
const SEA_PORT_TOUCH_RADIUS_TILES = 2.60;
const LAND_PORT_TOUCH_RADIUS_TILES = 2.00;
const SHORE_TRANSFER_RADIUS_TILES = 2.15;
const SHORE_RETURN_RADIUS_TILES = 1.65;
const MAX_MISSION_TITLE = 50;
const MAX_MISSION_TEXT = 500;
const store = new ClassroomStore();
// v23부터는 복합 단계형 미션을 사용하지 않는다. 이전 버전의 진행 상태는 자동 정리한다.
for (const room of Object.values(store.state?.rooms || {})) {
  if (room.activeMission && room.activeMission.kind !== 'arrivalRace') {
    room.activeMission = null;
    room.progress = {};
  }
}
store.scheduleSave();

const worldBuffer = fs.readFileSync(path.join(__dirname, 'data', 'world', 'WORLD.CDS'));
if (worldBuffer.length !== WORLD_W * WORLD_H * 2) {
  throw new Error(`WORLD.CDS 크기 불일치: ${worldBuffer.length}`);
}
const world = new Uint16Array(worldBuffer.buffer, worldBuffer.byteOffset, worldBuffer.length / 2);
const naturalEarthMaskBuffer = fs.readFileSync(path.join(__dirname, 'data', 'world', 'NATURAL_EARTH_LAND_MASK.bin'));
Terrain.setNaturalEarthLandMask(new Uint8Array(naturalEarthMaskBuffer.buffer, naturalEarthMaskBuffer.byteOffset, naturalEarthMaskBuffer.length));

function nearestTerrainPoint(baseX, baseY, predicate, maxRadiusTiles = 36) {
  const cx = Math.round(baseX / TILE);
  const cy = Math.round(baseY / TILE);
  let best = null;
  let bestDistance = Infinity;
  for (let radius = 0; radius <= maxRadiusTiles; radius += 1) {
    for (let oy = -radius; oy <= radius; oy += 1) {
      for (let ox = -radius; ox <= radius; ox += 1) {
        if (radius > 0 && Math.abs(ox) !== radius && Math.abs(oy) !== radius) continue;
        const tx = ((cx + ox) % WORLD_W + WORLD_W) % WORLD_W;
        const ty = Math.max(1, Math.min(WORLD_H - 2, cy + oy));
        const px = (tx + 0.5) * TILE;
        const py = (ty + 0.5) * TILE;
        const terrain = terrainAtPixelRaw(px, py);
        if (!predicate(terrain)) continue;
        const d = Math.hypot(ox, oy);
        if (d < bestDistance) {
          bestDistance = d;
          best = { x: px, y: py, terrain: terrain.type };
        }
      }
    }
    if (best) return best;
  }
  return { x: wrapX(baseX), y: Math.max(TILE, Math.min(WORLD_PIXEL_H - TILE, baseY)), terrain: terrainAtPixelRaw(baseX, baseY).type };
}

function terrainAtPixelRaw(x, y) {
  return Terrain.terrainAtPixel(world, x, y);
}

function defaultArrivalRadiusTiles(source) {
  const explicit = Number(source?.arrivalRadiusTiles);
  if (Number.isFinite(explicit) && explicit > 0) return Math.max(2, Math.min(80, explicit));
  const byCategory = { '반도':18, '제도':26, '열도':30, '사막':24, '산맥':24, '강 하구':8, '삼각주':8, '지협':8, '폭포':6, '해협':6, '곶':6, '지구대':14, '항구 도시':3.2, '도시':3.5 };
  return byCategory[source?.category] || (source?.access === 'port' ? 3.1 : 6);
}

const DISCOVERY_RADIUS_TILES = 3.2;
const RESOLVED_DISCOVERIES = MissionCatalog.DISCOVERIES.map((item) => {
  const cell = MissionCatalog.latLonToCell(item.lat, item.lon);
  return { ...item, x: wrapX(cell.x * TILE), y: Math.max(TILE, Math.min(WORLD_PIXEL_H - TILE, cell.y * TILE)) };
});
const discoveryProximity = createDiscoveryAccess(RESOLVED_DISCOVERIES,
  (x, y) => Terrain.terrainAtCell(world, x, y), Terrain, DISCOVERY_RADIUS_TILES);

// 도시 안의 명소. 도시마다 대표 건물 하나(또는 둘)를 두고, 1520년에 아직 없던 건물은 '아직 없는 곳'으로 적는다.
const CITY_LANDMARKS_BY_CITY = new Map();
for (const item of MissionCatalog.CITY_LANDMARKS) {
  const list = CITY_LANDMARKS_BY_CITY.get(item.cityId) || [];
  list.push(item);
  CITY_LANDMARKS_BY_CITY.set(item.cityId, list);
}
const LANDMARK_BY_ID = new Map(MissionCatalog.CITY_LANDMARKS.map((item) => [item.id, item]));
const FOUND_TOTAL = RESOLVED_DISCOVERIES.length + MissionCatalog.CITY_LANDMARKS.length;
const LANDMARK_ART_DIR = path.join(__dirname, 'public', 'assets', 'landmarks');
// 사진은 위키미디어 공용에서 자유 이용이 되는 것만 가져왔다. 대부분 이름을 밝히는 조건이 붙어 있어 함께 내려보낸다.
const PHOTO_CREDITS = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'catalog', 'photo-credits.json'), 'utf8'));

function photoCreditFor(id) {
  const credit = PHOTO_CREDITS[id];
  if (!credit) return '';
  return `사진 ${credit.author} · ${credit.license} · 위키미디어 공용`;
}

function landmarkArtUrl(id) {
  try {
    const file = path.join(LANDMARK_ART_DIR, `${id}.webp`);
    const stat = fs.statSync(file);
    return `/learn/world-voyage/assets/landmarks/${id}.webp?v=${Math.floor(stat.mtimeMs)}`;
  } catch {
    return null;
  }
}

function cityLandmarksFor(p) {
  if (!p || p.mode !== 'city' || !p.currentCityId || p.transition) return [];
  const list = CITY_LANDMARKS_BY_CITY.get(p.currentCityId) || [];
  if (!list.length) return [];
  const found = discoveryListFor(p.roomCode, p.name);
  return list.map((item) => ({ id: item.id, name: item.name, kind: item.kind, status: item.status, found: found.includes(item.id) }));
}

function publicLandmark(item) {
  return {
    id: item.id, name: item.name, kind: item.kind, status: item.status,
    todayCountry: item.todayCountry, built: item.built || '',
    in1520: item.in1520, text: item.text,
    image: landmarkArtUrl(item.id), imageCredit: photoCreditFor(item.id)
  };
}

function discoveryListFor(roomCode, studentName) {
  const room = store.room(roomCode);
  room.discoveries[studentName] = Array.isArray(room.discoveries[studentName]) ? room.discoveries[studentName] : [];
  return room.discoveries[studentName];
}

// 가까이 있는 유적·지형. 지나간다고 저절로 열리지 않고, 그 자리에서 눌러야 살펴본다.
function nearbyDiscovery(p) {
  if (!p || (p.mode !== 'sea' && p.mode !== 'land') || p.transition) return null;
  let best = null;
  let bestDistance = Infinity;
  for (const item of RESOLVED_DISCOVERIES) {
    const access = discoveryProximity(p, item);
    const d = access.distance;
    if (d > DISCOVERY_RADIUS_TILES * TILE || d >= bestDistance) continue;
    best = { ...item, discoveryAccess: access };
    bestDistance = d;
  }
  if (!best) return null;
  return { id: best.id, name: best.name, kind: best.kind, canUse:best.discoveryAccess.canUse,
    markerPoint:best.discoveryAccess.markerPoint || null,
    message:best.discoveryArea ? '해안에서 살펴보기' : best.reach === 'sea' ? '배에서 살펴보기' : '상륙해서 살펴보기',
    found: discoveryListFor(p.roomCode, p.name).includes(best.id) };
}

// 동물 만나기 경주. 참가자마다 자기 동물이 따로 있고, 정해진 바다 안을 어슬렁거린다.
// 잡는 것이 아니라 만나서 살펴보는 것이다 — 한 반이 고래를 서른 마리 잡을 수는 없다.
// 아이콘끼리 겹쳐도 그냥 두는데, 애초에 학생은 자기 동물만 본다.
const MEET_RADIUS_TILES = 3.0;
const ANIMAL_SPEED_RATIO = 0.22;
const ANIMAL_TURN_PER_SECOND = 1.1;
const ANIMAL_CALM_TILES = 9;
const RESOLVED_SEA_ANIMALS = new Map(MissionCatalog.SEA_ANIMALS.map((item) => {
  const place = MissionCatalog.DISCOVERIES.find((d) => d.id === item.placeId);
  const cell = MissionCatalog.latLonToCell(place.lat, place.lon);
  return [item.id, {
    ...item,
    placeName: place.name,
    homeX: wrapX(cell.x * TILE),
    homeY: Math.max(TILE, Math.min(WORLD_PIXEL_H - TILE, cell.y * TILE))
  }];
}));

function seaAnimalById(id) {
  return RESOLVED_SEA_ANIMALS.get(String(id || '')) || null;
}

// 동물이 뭍에 오르지 않도록 바다 타일에서만 자리를 잡는다.
function randomSeaNear(x, y, radiusPixels) {
  for (let tries = 0; tries < 40; tries += 1) {
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.sqrt(Math.random()) * radiusPixels;
    const nx = wrapX(x + Math.cos(angle) * distance);
    const ny = Math.max(TILE, Math.min(WORLD_PIXEL_H - TILE, y + Math.sin(angle) * distance));
    if (terrainAtPixel(nx, ny).type === 'sea') return { x: nx, y: ny };
  }
  return { x: wrapX(x), y };
}

function huntStateFor(roomCode, studentName, animal) {
  const room = store.room(roomCode);
  room.hunts = room.hunts && typeof room.hunts === 'object' ? room.hunts : {};
  let state = room.hunts[studentName];
  if (!state || state.animalId !== animal.id) {
    const radius = animal.roamRadiusTiles * TILE;
    const spot = randomSeaNear(animal.homeX, animal.homeY, radius * 0.8);
    state = { animalId: animal.id, x: spot.x, y: spot.y, heading: Math.random() * Math.PI * 2, met: false };
    room.hunts[studentName] = state;
  }
  return state;
}

function moveSeaAnimal(state, animal, dt, player = null) {
  if (state.met) return;
  state.heading += (Math.random() - 0.5) * ANIMAL_TURN_PER_SECOND * dt;
  // 배가 가까이 오면 눈치채지 못한 듯 느릿느릿 움직인다.
  // 안 그러면 끝까지 꼬리잡기만 되어서 아이들이 영영 못 만난다.
  let ratio = ANIMAL_SPEED_RATIO;
  if (player) {
    const gap = distanceXY(player.x, player.y, state.x, state.y) / TILE;
    if (gap <= ANIMAL_CALM_TILES) ratio *= 0.22;
    else if (gap <= ANIMAL_CALM_TILES * 2) ratio *= 0.55;
  }
  const speed = SEA_BASE_SPEED * ratio;
  const radius = animal.roamRadiusTiles * TILE;
  for (let attempt = 0; attempt < 6; attempt += 1) {
    const delta = GeoMotion.localDeltaToMap(Math.cos(state.heading) * speed * dt, Math.sin(state.heading) * speed * dt, state.y, WORLD_PIXEL_H);
    const nx = wrapX(state.x + delta.x);
    const ny = Math.max(TILE, Math.min(WORLD_PIXEL_H - TILE, state.y + delta.y));
    const insideHome = distanceXY(nx, ny, animal.homeX, animal.homeY) <= radius;
    if (insideHome && terrainAtPixel(nx, ny).type === 'sea') { state.x = nx; state.y = ny; return; }
    // 뭍이나 사는 곳 바깥이면 방향을 틀어 본다.
    state.heading += Math.PI / 3 + Math.random() * 0.6;
  }
}

function huntInteractionFor(p) {
  const mission = store.room(p.roomCode).activeMission;
  if (!isArrivalRace(mission) || !mission.hunt || p.mode !== 'sea' || p.transition) return null;
  const animal = seaAnimalById(mission.hunt.animalId);
  if (!animal) return null;
  const progress = progressFor(p.roomCode, p.name, mission.id, false);
  if (!progress || progress.status === 'completed' || progress.finalQuizStatus === 'answering') return null;
  const state = huntStateFor(p.roomCode, p.name, animal);
  const distance = distanceXY(p.x, p.y, state.x, state.y);
  return {
    animalId: animal.id,
    animal: animal.animal,
    region: animal.placeName,
    x: Math.round(state.x),
    y: Math.round(state.y),
    met: state.met === true,
    withinReach: distance <= MEET_RADIUS_TILES * TILE,
    distanceTiles: Math.round(distance / TILE)
  };
}

const CITY_ART_DIR = path.join(__dirname, 'public', 'assets', 'cities', '1520');

function cityArtUrl(source) {
  if (!source?.isOriginalCity || !source.artKey) return null;
  const file = path.join(CITY_ART_DIR, `${source.artKey}.webp`);
  if (!fs.existsSync(file)) return null;
  return `/learn/world-voyage/assets/cities/1520/${source.artKey}.webp?v=${Math.round(fs.statSync(file).mtimeMs)}`;
}

function resolveCatalog() {
  const byId = new Map();
  for (const rawSource of MissionCatalog.PLACES) {
    const source = MissionCatalog.normalizePlaceAccess(rawSource);
    const useNaturalEarthPosition = source?.naturalEarthPositionOverride === true;
    const cell = useNaturalEarthPosition
      ? MissionCatalog.latLonToCell(source.lat, source.lon)
      : MissionCatalog.placeCell(source);
    const baseX = cell.x * TILE;
    const baseY = cell.y * TILE;
    const seaPoint = nearestTerrainPoint(baseX, baseY, (terrain) => terrain.type === 'sea');
    const preferredTypes = source.category === '산맥' ? ['mountain']
      : source.category === '사막' ? ['desert']
      : ['강 하구', '삼각주', '폭포'].includes(source.category) ? ['river', 'coast']
      : source.category === '지협' ? ['coast', 'plain']
      : source.category === '지구대' ? ['plain', 'mountain']
      : [];
    const preferredSearchRadius = source.category === '산맥' ? 70 : 24;
    const preferredLandPoint = preferredTypes.length
      ? nearestTerrainPoint(baseX, baseY, (terrain) => preferredTypes.includes(terrain.type) && terrain.passable, preferredSearchRadius)
      : null;
    const landPoint = preferredLandPoint && preferredTypes.includes(preferredLandPoint.terrain)
      ? preferredLandPoint
      : nearestTerrainPoint(baseX, baseY, (terrain) => terrain.type !== 'sea' && terrain.passable);
    const displayOffsetX = Number(source?.displayOffsetCellsX) || 0;
    const displayOffsetY = Number(source?.displayOffsetCellsY) || 0;
    const displayedLandPoint = (displayOffsetX || displayOffsetY)
      ? nearestTerrainPoint(
          landPoint.x + displayOffsetX * TILE,
          landPoint.y + displayOffsetY * TILE,
          (terrain) => terrain.type !== 'sea' && terrain.passable,
          5
        )
      : landPoint;
    const exactCellPoint = (cell, fallback) => Array.isArray(cell) && cell.length >= 2
      ? { x: (Number(cell[0]) + 0.5) * TILE, y: (Number(cell[1]) + 0.5) * TILE, terrain: terrainAtPixelRaw((Number(cell[0]) + 0.5) * TILE, (Number(cell[1]) + 0.5) * TILE).type }
      : fallback;
    const originalMarkerPoints = source.isOriginalCity && !useNaturalEarthPosition && Array.isArray(source.originalMarkerCells)
      ? source.originalMarkerCells.map((cell) => exactCellPoint(cell, null)).filter(Boolean)
      : [];
    const originalSeaEntryPoints = source.isOriginalCity && !useNaturalEarthPosition && Array.isArray(source.originalSeaEntryCells)
      ? source.originalSeaEntryCells.map((cell) => exactCellPoint(cell, null)).filter(Boolean)
      : [];
    const originalLandEntryPoints = source.isOriginalCity && !useNaturalEarthPosition && Array.isArray(source.originalLandEntryCells)
      ? source.originalLandEntryCells.map((cell) => exactCellPoint(cell, null)).filter(Boolean)
      : [];
    const markerCenter = originalMarkerPoints.length
      ? {
          x: originalMarkerPoints.reduce((sum, item) => sum + item.x, 0) / originalMarkerPoints.length,
          y: originalMarkerPoints.reduce((sum, item) => sum + item.y, 0) / originalMarkerPoints.length,
          terrain: 'city'
        }
      : { x: baseX, y: baseY, terrain: terrainAtPixelRaw(baseX, baseY).type };
    const exactSeaPoint = exactCellPoint(source.originalSeaSpawnCell, originalSeaEntryPoints[0] || seaPoint);
    const exactLandPoint = exactCellPoint(source.originalLandSpawnCell, originalLandEntryPoints[0] || landPoint);
    const naturalEarthSeaPoint = exactCellPoint(source.naturalEarthSeaSpawnCell, seaPoint);
    const naturalEarthLandPoint = exactCellPoint(source.naturalEarthLandSpawnCell, displayedLandPoint);
    const naturalEarthMarkerPoint = exactCellPoint(source.naturalEarthMarkerCell, naturalEarthLandPoint || displayedLandPoint);
    const naturalEarthBasePoint = { x: wrapX(baseX), y: Math.max(TILE, Math.min(WORLD_PIXEL_H - TILE, baseY)), terrain: terrainAtPixelRaw(baseX, baseY).type };
    const cityPoint = useNaturalEarthPosition ? (naturalEarthMarkerPoint || displayedLandPoint) : (source.isOriginalCity ? markerCenter : landPoint);
    const resolvedSeaPoint = useNaturalEarthPosition ? (naturalEarthSeaPoint || seaPoint) : (source.isOriginalCity ? exactSeaPoint : seaPoint);
    const resolvedLandPoint = useNaturalEarthPosition ? (naturalEarthLandPoint || displayedLandPoint) : (source.isOriginalCity ? exactLandPoint : landPoint);
    const resolvedMarkerPoints = useNaturalEarthPosition && cityPoint ? [cityPoint] : originalMarkerPoints;
    const resolvedSeaEntryPoints = source.canEnterFromSea
      ? (useNaturalEarthPosition && resolvedSeaPoint ? [resolvedSeaPoint] : originalSeaEntryPoints)
      : [];
    const resolvedLandEntryPoints = useNaturalEarthPosition && resolvedLandPoint ? [resolvedLandPoint] : originalLandEntryPoints;
    const point = source.isOriginalCity
      ? (source.canEnterFromSea ? resolvedSeaPoint : resolvedLandPoint)
      : source.access === 'sea' ? seaPoint : source.access === 'land' ? landPoint : seaPoint;
    byId.set(source.id, {
      ...source,
      interiorImage: cityArtUrl(source),
      x: point.x,
      y: point.y,
      point,
      cityPoint,
      seaPoint: resolvedSeaPoint,
      landPoint: resolvedLandPoint,
      originalMarkerPoints: resolvedMarkerPoints,
      originalSeaEntryPoints: resolvedSeaEntryPoints,
      originalLandEntryPoints: resolvedLandEntryPoints,
      arrivalRadiusTiles: defaultArrivalRadiusTiles(source),
      interactionRadiusTiles: source.isOriginalCity ? 3.2 : Math.max(2.2, Math.min(8, Number(source.interactionRadiusTiles) || 3.2))
    });
  }
  return byId;
}

const RESOLVED_PLACES = resolveCatalog();

// V70 이전에 저장된 도착 미션은 최종 문제가 없으므로 현재 목적지 기준으로 보완한다.
for (const room of Object.values(store.state?.rooms || {})) {
  const mission = room?.activeMission;
  if (!isArrivalRace(mission) || mission.finalQuiz) continue;
  const target = RESOLVED_PLACES.get(String(mission.targetPlace?.id || '')) || mission.targetPlace;
  mission.finalQuiz = FinalQuiz.createFinalQuiz(target);
  mission.instructions = `${mission.targetPlace?.name || '목적지'}에 도착한 뒤 최종 문제 3개를 모두 제출하면 완주합니다. 출발 도시 네 곳 중 하나를 선택하세요.`;
}
store.scheduleSave();
const ITEM_BY_ID = new Map(MissionCatalog.ITEMS.map((item) => [item.id, item]));
const TEMPLATE_BY_ID = new Map(MissionCatalog.TEMPLATES.map((template) => [template.id, template]));
const READY_BY_ID = new Map(MissionCatalog.READY_MISSIONS.map((mission) => [mission.id, mission]));

// 도시 설명은 각 도시의 핵심 주제를 담은 가변 길이의 문단으로 제공한다.
const CITY_STORIES = new Map([
  ...JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'catalog', 'city-stories.json'), 'utf8')).map((item) => [item.cityId, item]),
  ...MissionCatalog.ADDITIONAL_SETTLEMENTS.map((site) => [site.id, site.story])
]);
const CITY_TODAY_DIR = path.join(__dirname, 'public', 'assets', 'city-today');
const CITY_PHOTO_CREDITS = (() => {
  try { return JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'catalog', 'city-photo-credits.json'), 'utf8')); } catch { return {}; }
})();

function cityTodayPhoto(artKey) {
  if (!artKey) return null;
  try {
    const stat = fs.statSync(path.join(CITY_TODAY_DIR, `${artKey}.webp`));
    const credit = CITY_PHOTO_CREDITS[artKey];
    return {
      url: `/learn/world-voyage/assets/city-today/${artKey}.webp?v=${Math.floor(stat.mtimeMs)}`,
      caption: credit?.caption || '',
      credit: credit ? `오늘날 모습 · 사진 ${credit.author} · ${credit.license} · 위키미디어 공용` : '오늘날 모습'
    };
  } catch {
    return null;
  }
}

function publicMissionCatalog() {
  const base = MissionCatalog.publicCatalog();
  return {
    ...base,
    places: base.places.map((place) => {
      const resolved = RESOLVED_PLACES.get(place.id);
      const story = place.isOriginalCity ? CITY_STORIES.get(place.id) : null;
      const todayPhoto = place.isOriginalCity ? cityTodayPhoto(place.artKey) : null;
      const educationalLibrary = place.isOriginalCity
        ? {
            story: story ? { sections: story.sections, sources: story.sources || [] } : null,
            todayPhoto,
            hasLibrary: true,
            libraryRegion: FinalQuiz.libraryShelfForCity(place),
            facilities: [...new Set([...(Array.isArray(place.facilities) ? place.facilities : []), '도서관'])]
          }
        : {};
      return {
        ...place,
        ...educationalLibrary,
        point: resolved ? { x: resolved.point.x, y: resolved.point.y } : null,
        cityPoint: resolved ? { x: resolved.cityPoint.x, y: resolved.cityPoint.y } : null,
        seaPoint: resolved ? { x: resolved.seaPoint.x, y: resolved.seaPoint.y } : null,
        landPoint: resolved ? { x: resolved.landPoint.x, y: resolved.landPoint.y } : null,
        canEnterFromSea: resolved?.canEnterFromSea === true,
        interiorImage: resolved?.interiorImage || null,
        arrivalRadiusTiles: resolved?.arrivalRadiusTiles || null
      };
    })
  };
}

const app = express();
app.disable('x-powered-by');
app.use(express.static(path.join(__dirname, 'public'), {
  etag: true,
  maxAge: '1h',
  setHeaders(res, filePath) {
    if (filePath.endsWith('.gz')) res.setHeader('Content-Type', 'application/gzip');
    if (filePath.endsWith('.html')) res.setHeader('Cache-Control', 'no-store, max-age=0');
  }
}));
app.get('/api/mission-catalog', (_req, res) => { res.setHeader('Cache-Control', 'no-store'); res.json(publicMissionCatalog()); });
app.get('/health', (_req, res) => res.json({
  ok: true,
  version: 76,
  rooms: rooms.size,
  players: playerCount(),
  seaBaseSpeed: SEA_BASE_SPEED,
  landBaseSpeed: LAND_BASE_SPEED,
  completionSpeedMultipliers: {
    first: CompletionRewards.speedMultiplier(1),
    second: CompletionRewards.speedMultiplier(2),
    third: CompletionRewards.speedMultiplier(3),
    fourthAndAfter: CompletionRewards.speedMultiplier(4)
  },
  currentTailAssistPercent: Math.round(CURRENT_TAIL_FACTOR * 100),
  currentStrongCoreTailAssistPercent: Math.round(CURRENT_STRONG_CORE_TAIL_FACTOR * 100),
  currentHeadPenaltyPercent: Math.round(CURRENT_HEAD_FACTOR * 100),
  windTailAssistPercent: Math.round(WIND_TAIL_FACTOR * 100),
  windHeadPenaltyPercent: Math.round(WIND_HEAD_FACTOR * 100),
  gameHoursPerRealSecond: GAME_HOURS_PER_REAL_SECOND,
  landMode: true,
  cityInteriorMode: true,
  cityInteriorImageCount: MissionCatalog.ORIGINAL_CITIES.length,
  cityEntryExitGameMinutes: 0,
  libraryReading: true,
  missionSystem: 'host-created-rooms-free-voyage-or-arrival-race',
  roomCodeDigits: 4,
  originalCityCount: MissionCatalog.ORIGINAL_CITIES.length,
  originalPortCityCount: MissionCatalog.ORIGINAL_CITIES.filter((place) => place.canEnterFromSea === true).length,
  originalCityAccessRule: '원작 도시표 기준 + 확정 오류 교정',
  allOriginalPortTransitions: true,
  mapCityLabels: true,
  destinationArrivalZones: Object.keys(ARRIVAL_ZONES).length,
  expeditionJournal: false,
  minimalStudentState: true,
  oceanCurrentAnimation: 'major-current-flow-tracers',
  oceanCurrentAffectsMovement: true,
  majorWindSystem: ['trade-winds','westerlies','polar-easterlies','seasonal-monsoon'],
  windCloudAnimation: 'original-CLOUD.CDS-12-frame-sprite',
  windAffectsMovement: true,
  visualWeather: [],
  sharedClassClock: true,
  teacherClockAuthority: true,
  timedPortOperations: true,
  directSeaLandTransfer: true,
  coastalLanding: true,
  coastalLandingRule: 'near-coast-only-return-to-anchored-ship',
  exactCoastalReboarding: true,
  fatigueAffectsSeaAndLandSpeed: true,
  fatigueSlowdownStart: Fatigue.FATIGUE_SLOWDOWN_START,
  fatigueMinSpeedPercent: Math.round(Fatigue.MIN_SPEED_MULTIPLIER * 100),
  topStatusBar: ['date','latitudeLongitude','speed','fatigue'],
  bottomGuideWindow: true,
  persistedStudentState: ['selectedStartCity', 'shipPort', 'missionStatus', 'finishRank', 'completionTime'],
  teacherControls: true,
  persistenceFile: store.filePath
}));

const server = http.createServer(app);
const io = new Server(server, {
  serveClient: true,
  transports: ['websocket', 'polling'],
  maxHttpBufferSize: 64 * 1024,
  pingInterval: 10000,
  pingTimeout: 12000
});

const rooms = new Map();
const teachers = new Map();
// A reconnect must restore the server's position, city and moored ship, never a client position.
const disconnectedVoyagers = new Map();
const VOYAGER_RESUME_MS = 24 * 60 * 60 * 1000;
setInterval(() => {
  for (const [token, session] of disconnectedVoyagers) {
    if (session.expiresAt <= Date.now()) disconnectedVoyagers.delete(token);
  }
}, 60000).unref();
const missionRuntime = new Map();
const roomClocks = new Map();

function isFreeRoom(roomCode) {
  return store.room(roomCode).settings.roomType === 'free';
}

function clockForRoom(roomCode) {
  if (!roomClocks.has(roomCode)) {
    roomClocks.set(roomCode, {
      baseGameMinutes: Number(store.room(roomCode).clock?.gameMinutes || 0),
      baseServerMs: Date.now(),
      ownerSocketId: null,
      lastTeacherSyncAt: 0
    });
  }
  return roomClocks.get(roomCode);
}

function roomClockShouldRun(roomCode) {
  const roomState = store.room(roomCode);
  if (roomState.settings.roomType === 'free') {
    return roomState.settings.paused !== true && roomState.settings.started === true && (rooms.get(roomCode)?.size || 0) > 0;
  }
  return roomState.settings.paused !== true && roomState.activeMission?.phase === 'running';
}

function classGameMinutes(roomCode, now = Date.now()) {
  const clock = clockForRoom(roomCode);
  // 교사 탭의 heartbeat가 브라우저 절전·백그라운드 제한으로 늦어져도
  // 이미 시작된 수업 시간은 서버가 권위 있게 계속 진행한다.
  if (!roomClockShouldRun(roomCode)) return clock.baseGameMinutes;
  return clock.baseGameMinutes + ((now - clock.baseServerMs) / 1000) * GAME_HOURS_PER_REAL_SECOND * 60;
}

function freezeClassClock(roomCode, now = Date.now()) {
  const clock = clockForRoom(roomCode);
  clock.baseGameMinutes = classGameMinutes(roomCode, now);
  clock.baseServerMs = now;
  store.setRoomClock(roomCode, clock.baseGameMinutes);
  return clock.baseGameMinutes;
}

function claimTeacherClock(roomCode, socketId) {
  const now = Date.now();
  const clock = clockForRoom(roomCode);
  clock.baseGameMinutes = classGameMinutes(roomCode, now);
  clock.baseServerMs = now;
  clock.ownerSocketId = socketId;
  clock.lastTeacherSyncAt = now;
  return clock.baseGameMinutes;
}

function syncTeacherClock(roomCode, socketId, reportedGameMinutes) {
  const clock = clockForRoom(roomCode);
  if (clock.ownerSocketId !== socketId) return null;
  const value = Number(reportedGameMinutes);
  if (!Number.isFinite(value) || value < 0) return null;
  const now = Date.now();
  if (!roomClockShouldRun(roomCode)) {
    clock.baseServerMs = now;
    clock.lastTeacherSyncAt = now;
    store.room(roomCode).clock.gameMinutes = clock.baseGameMinutes;
    return clock.baseGameMinutes;
  }
  const expected = classGameMinutes(roomCode, now);
  const maxCorrection = GAME_HOURS_PER_REAL_SECOND * 60 * 4;
  clock.baseGameMinutes = Math.max(0, Math.min(expected + maxCorrection, Math.max(expected - maxCorrection, value)));
  clock.baseServerMs = now;
  clock.lastTeacherSyncAt = now;
  store.room(roomCode).clock.gameMinutes = clock.baseGameMinutes;
  return clock.baseGameMinutes;
}

function releaseTeacherClock(socketId) {
  const now = Date.now();
  for (const [roomCode, clock] of roomClocks) {
    if (clock.ownerSocketId !== socketId) continue;
    freezeClassClock(roomCode, now);
    clock.ownerSocketId = null;
    clock.lastTeacherSyncAt = 0;
  }
}

function runtimeKey(roomCode, studentName, missionId) {
  return `${roomCode}\u0000${studentName}\u0000${missionId}`;
}

function runtimeProgressFor(roomCode, studentName, missionId, create = true) {
  if (!missionId) return null;
  const key = runtimeKey(roomCode, studentName, missionId);
  if (!missionRuntime.has(key) && create) {
    missionRuntime.set(key, {
      started: false,
      distanceTiles: 0,
      terrainDistanceTiles: {},
      visitedTerrains: new Set(),
      returnCompleted: false
    });
  }
  return missionRuntime.get(key) || null;
}

function clearMissionRuntime(roomCode) {
  const prefix = `${roomCode}\u0000`;
  for (const key of missionRuntime.keys()) if (key.startsWith(prefix)) missionRuntime.delete(key);
}

function playerCount() {
  let total = 0;
  for (const room of rooms.values()) total += room.size;
  return total;
}

function cleanName(value) {
  return String(value || '')
    .normalize('NFKC')
    .replace(/[^0-9A-Za-z가-힣ㄱ-ㅎㅏ-ㅣ _-]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 12);
}

function cleanRoom(value) {
  return String(value || '')
    .normalize('NFKC')
    .toUpperCase()
    .replace(/[^0-9A-Z가-힣_-]/g, '')
    .slice(0, 10);
}



const ROOM_IDLE_MS = 12 * 60 * 60 * 1000;

function pruneIdleRooms(now = Date.now()) {
  const hosted = new Set(teachers.values());
  for (const [code, state] of Object.entries(store.state?.rooms || {})) {
    if (rooms.get(code)?.size || hosted.has(code)) continue;
    if (now - (Number(state?.host?.lastActiveAt) || 0) < ROOM_IDLE_MS) continue;
    delete store.state.rooms[code];
    roomClocks.delete(code);
    clearMissionRuntime(code);
  }
}

function generateClassCode() {
  pruneIdleRooms();
  const used = new Set([
    ...rooms.keys(),
    ...teachers.values(),
    ...Object.keys(store.state?.rooms || {})
  ]);
  for (let i = 0; i < 2000; i += 1) {
    const code = String(Math.floor(1000 + Math.random() * 9000));
    if (!used.has(code)) return code;
  }
  throw new Error('지금은 새 방을 만들 수 없습니다. 잠시 후 다시 시도하세요.');
}

function isValidClassCode(value) {
  return /^\d{4}$/.test(String(value || ''));
}

function hashHostToken(token) {
  return crypto.createHash('sha256').update(String(token || '')).digest('hex');
}

function roomExists(roomCode) {
  return Boolean(store.state?.rooms?.[roomCode]?.host?.tokenHash);
}

function isRoomHost(roomCode, token) {
  const expected = store.state?.rooms?.[roomCode]?.host?.tokenHash;
  return Boolean(expected && token && hashHostToken(token) === expected);
}

function touchRoom(roomCode) {
  const host = store.state?.rooms?.[roomCode]?.host;
  if (host) host.lastActiveAt = Date.now();
}

function becomeHost(socket, roomCode) {
  const previousRoom = teachers.get(socket.id);
  if (previousRoom && previousRoom !== roomCode) socket.leave(`teacher:${previousRoom}`);
  teachers.set(socket.id, roomCode);
  socket.join(`teacher:${roomCode}`);
  touchRoom(roomCode);
}

function cleanText(value, maxLength = MAX_MISSION_TEXT) {
  return String(value || '').normalize('NFKC').replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, maxLength);
}

function cleanMissionKind(value) {
  return ['location', 'terrain', 'exploration', 'staged'].includes(value) ? value : 'location';
}


function cleanMissionMode(value) {
  return ['any', 'sea', 'land', 'city'].includes(value) ? value : 'any';
}

function cleanMarkerMode(value) {
  return ['hidden', 'area', 'exact'].includes(value) ? value : 'hidden';
}

function finiteNumber(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function isArrivalRace(mission) {
  return mission?.kind === 'arrivalRace' && Array.isArray(mission.startOptions) && mission.targetPlace;
}

function isStartChoiceSet(mission) {
  return mission?.kind === 'startChoiceSet' && Array.isArray(mission.startOptions);
}

function arrivalRaceTravelGate(player) {
  if (!player) return { ok: false, error: '학생 접속 상태가 아닙니다.' };
  if (isFreeRoom(player.roomCode)) {
    return store.room(player.roomCode).settings.started
      ? { ok: true, mission: null, progress: null, completed: false, free: true }
      : { ok: false, error: '방장이 출발 버튼을 누를 때까지 기다리세요.' };
  }
  const mission = store.room(player.roomCode).activeMission;
  if (!isArrivalRace(mission)) return { ok: false, error: '방장이 미션을 준비할 때까지 기다리세요.' };
  const progress = progressFor(player.roomCode, player.name, mission.id, false);
  if (!progress?.selectedStartPlaceId) return { ok: false, error: '먼저 출발 도시를 선택하세요.' };
  if (mission.phase !== 'running') return { ok: false, error: '출발 준비 완료. 방장이 출발 버튼을 누를 때까지 기다리세요.' };
  if (progress.finalQuizStatus === 'answering') return { ok: false, error: '도착지 최종 문제 3개를 먼저 풀어야 합니다.' };
  return { ok: true, mission, progress, completed: progress.status === 'completed' };
}

function selectedMission(activeMission, progress) {
  if (!activeMission) return null;
  if (isArrivalRace(activeMission)) return progress?.selectedStartPlaceId ? activeMission : null;
  if (!isStartChoiceSet(activeMission)) return activeMission;
  if (!progress?.selectedMissionId) return null;
  return activeMission.startOptions.find((option) => option.id === progress.selectedMissionId) || null;
}

function startOptionSummary(option) {
  const source = option.startPlace || option;
  return {
    id: option.id || source.id,
    startPlace: source ? {
      id: source.id,
      name: source.name,
      region: source.region || '',
      continent: source.continent || '',
      atlasHint: source.atlasHint || ''
    } : null
  };
}

function missionForStudentWithProgress(activeMission, progress) {
  if (!activeMission) return null;
  if (isArrivalRace(activeMission)) return missionForStudent(activeMission);
  if (!isStartChoiceSet(activeMission)) return missionForStudent(activeMission);
  const chosen = selectedMission(activeMission, progress);
  if (chosen) return missionForStudent(chosen);
  return {
    id: activeMission.id,
    title: activeMission.title,
    instructions: activeMission.instructions,
    atlasInstruction: activeMission.atlasInstruction || '',
    goalLabel: activeMission.goalLabel || '',
    kind: 'startChoiceSet',
    mode: 'any',
    startOptions: activeMission.startOptions.map(startOptionSummary),
    createdAt: activeMission.createdAt
  };
}

function missionContext(roomCode, studentName, create = true) {
  const activeMission = store.room(roomCode).activeMission;
  const progress = activeMission ? progressFor(roomCode, studentName, activeMission.id, create) : null;
  return { activeMission, mission: selectedMission(activeMission, progress), progress };
}

function missionForStudent(mission) {
  if (!mission) return null;
  return {
    id: mission.id,
    title: mission.title,
    instructions: mission.instructions,
    kind: mission.kind,
    mode: mission.mode,
    target: mission.target,
    criteria: mission.criteria,
    templateId: mission.templateId || null,
    atlasInstruction: mission.atlasInstruction || '',
    markerMode: mission.markerMode || 'hidden',
    phase: mission.phase || null,
    startedAtGameMinutes: Number.isFinite(mission.startedAtGameMinutes) ? mission.startedAtGameMinutes : null,
    item: mission.item || null,
    targetPlace: mission.targetPlace ? {
      id: mission.targetPlace.id,
      name: mission.targetPlace.name,
      category: mission.targetPlace.category || '',
      region: mission.targetPlace.region || '',
      continent: mission.targetPlace.continent || '',
      atlasHint: mission.targetPlace.atlasHint || '',
      mode: mission.targetPlace.mode,
      radiusTiles: mission.targetPlace.radiusTiles
    } : null,
    hasFinalQuiz: isArrivalRace(mission) && !!mission.finalQuiz,
    finalQuizQuestionCount: isArrivalRace(mission) ? Number(mission.finalQuiz?.questionCount || 3) : null,
    startOptions: Array.isArray(mission.startOptions) ? mission.startOptions.map(startOptionSummary) : null,
    stages: Array.isArray(mission.stages) ? mission.stages.map((stage) => ({
      id: stage.id,
      type: stage.type,
      label: stage.label,
      instruction: stage.instruction,
      mode: stage.mode,
      point: stage.point,
      radiusTiles: stage.radiusTiles,
      actionRequired: stage.actionRequired === true,
      actionLabel: stage.actionLabel || '',
      placeName: stage.placeName || '',
      facility: stage.facility || '',
      item: stage.item || null
    })) : null,
    createdAt: mission.createdAt
  };
}

function missionForTeacher(mission) {
  return mission ? JSON.parse(JSON.stringify(mission)) : null;
}

function progressFor(roomCode, studentName, missionId, create = true) {
  if (!missionId) return null;
  return store.studentProgress(roomCode, studentName, missionId, create);
}

function missionStatusLabel(status) {
  return ({ assigned: '수행 전', inProgress: '수행 중', completed: '완료' })[status] || status;
}

function publicProgress(progress, mission = null) {
  if (!progress) return null;
  const stageCount = Array.isArray(mission?.stages) ? mission.stages.length : 0;
  const stageIndex = Math.max(0, Math.min(stageCount || 20, Number(progress.stageIndex || 0)));
  let selectedStartPlace = null;
  if (isArrivalRace(mission) && progress.selectedStartPlaceId) {
    selectedStartPlace = mission.startOptions.find((option) => option.startPlace?.id === progress.selectedStartPlaceId)?.startPlace || null;
  } else if (mission?.startPlace) {
    selectedStartPlace = mission.startPlace;
  }
  return {
    status: progress.status || 'assigned',
    statusLabel: missionStatusLabel(progress.status || 'assigned'),
    stageIndex,
    stageCount,
    cargoItemId: progress.cargoItemId || null,
    selectedMissionId: progress.selectedMissionId || null,
    selectedStartPlaceId: progress.selectedStartPlaceId || selectedStartPlace?.id || null,
    selectedStartPlaceName: selectedStartPlace?.name || null,
    selectedMissionTitle: mission?.title || null,
    finalQuizStatus: progress.finalQuizStatus || 'none',
    finalQuizArrivedAt: Number.isFinite(progress.finalQuizArrivedAt) ? progress.finalQuizArrivedAt : null,
    finalQuizAnswers: Array.isArray(progress.finalQuizAnswers) ? progress.finalQuizAnswers.slice(0, 3) : [null, null, null],
    finalCorrectCount: Number.isFinite(progress.finalCorrectCount) ? progress.finalCorrectCount : null,
    finalSubmittedAt: Number.isFinite(progress.finalSubmittedAt) ? progress.finalSubmittedAt : null,
    finalQuiz: isArrivalRace(mission) && ['answering', 'submitted'].includes(progress.finalQuizStatus)
      ? FinalQuiz.publicQuiz(mission.finalQuiz, progress.finalQuizStatus === 'submitted')
      : null,
    completedAt: Number.isFinite(progress.completedAt) ? progress.completedAt : null,
    completedGameMinutes: Number.isFinite(progress.completedGameMinutes) ? progress.completedGameMinutes : null,
    finishRank: Number.isFinite(progress.finishRank) ? progress.finishRank : null
  };
}

function missionProgressList(roomCode, missionId) {
  if (!missionId) return [];
  const state = store.room(roomCode);
  const activeMission = state.activeMission?.id === missionId ? state.activeMission : null;
  return Object.entries(state.progress).map(([name, missions]) => {
    const progress = missions[missionId] || { status: 'assigned' };
    const mission = isArrivalRace(activeMission) ? activeMission : selectedMission(activeMission, progress);
    return { name, ...publicProgress(progress, mission) };
  });
}

function sanitizeMission(payload, roomCode) {
  const kind = cleanMissionKind(payload?.kind);
  const mode = cleanMissionMode(payload?.mode);
  const title = cleanText(payload?.title, MAX_MISSION_TITLE);
  const instructions = cleanText(payload?.instructions, MAX_MISSION_TEXT);
  if (title.length < 2) throw new Error('미션 제목을 두 글자 이상 입력하세요.');
  if (instructions.length < 2) throw new Error('미션 설명을 입력하세요.');

  let target = null;
  let criteria = null;
  if (kind === 'location') {
    const x = wrapX(finiteNumber(payload?.target?.x, LISBON.harbor.x));
    const y = Math.max(TILE, Math.min(WORLD_PIXEL_H - TILE, finiteNumber(payload?.target?.y, LISBON.harbor.y)));
    const radiusTiles = Math.max(0.75, Math.min(16, finiteNumber(payload?.target?.radiusTiles, 2.2)));
    target = { x, y, radiusTiles, label: cleanText(payload?.target?.label, 40) || '학습 지점' };
  } else if (kind === 'terrain') {
    const allowedTerrains = ['plain', 'coast', 'river', 'forest', 'desert', 'mountain'];
    const terrainType = allowedTerrains.includes(payload?.criteria?.terrainType) ? payload.criteria.terrainType : 'plain';
    const minDistanceTiles = Math.max(1, Math.min(200, finiteNumber(payload?.criteria?.minDistanceTiles, 8)));
    criteria = { terrainType, minDistanceTiles };
  } else {
    const minDistanceTiles = Math.max(1, Math.min(500, finiteNumber(payload?.criteria?.minDistanceTiles, 20)));
    const minTerrainTypes = Math.max(1, Math.min(6, Math.round(finiteNumber(payload?.criteria?.minTerrainTypes, 2))));
    criteria = { minDistanceTiles, minTerrainTypes, requireReturnToCity: payload?.criteria?.requireReturnToCity === true };
  }

  return {
    id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    roomCode, title, instructions, kind, mode, target, criteria, createdAt: Date.now()
  };
}



// 받침이 있는지 보고 조사를 골라 붙인다. "도시을(를)"처럼 적히지 않게 한다.
function hasFinalConsonant(word) {
  const text = String(word || '');
  if (!text) return false;
  const code = text.charCodeAt(text.length - 1) - 0xac00;
  if (code < 0 || code > 11171) return false;
  return code % 28 !== 0;
}
function josaEul(word) { return `${word}${hasFinalConsonant(word) ? '을' : '를'}`; }
function josaEun(word) { return `${word}${hasFinalConsonant(word) ? '은' : '는'}`; }

function catalogPlace(id, label = '지점') {
  const place = RESOLVED_PLACES.get(String(id || ''));
  if (!place) throw new Error(`${josaEul(label)} 지명 목록에서 선택하세요.`);
  return place;
}

function catalogItem(id) {
  const item = ITEM_BY_ID.get(String(id || ''));
  if (!item) throw new Error('운송할 물품을 선택하세요.');
  return item;
}

function withObjectParticle(text) {
  const value = String(text || '');
  const last = value.charCodeAt(value.length - 1);
  const hasBatchim = last >= 0xac00 && last <= 0xd7a3 ? ((last - 0xac00) % 28) !== 0 : false;
  return `${value}${hasBatchim ? '을' : '를'}`;
}

function facilityFor(place, requested, fallback) {
  const value = cleanText(requested, 30);
  if (value) return value;
  return place.facilities?.[0] || fallback;
}

function pointForMode(place, mode) {
  if (mode === 'land') return { x: place.landPoint.x, y: place.landPoint.y };
  return { x: place.seaPoint.x, y: place.seaPoint.y };
}

function makeStage({ id, type, place, mode, label, instruction, radiusTiles = null, arrivalRadiusTiles = null, actionRequired = true, actionLabel = '', facility = '', item = null, transitionTo = null, transitionPoint = null }) {
  const exactRadius = Math.max(1.5, Math.min(12, Number(radiusTiles) || place.interactionRadiusTiles || 3.2));
  const arrivalRadius = Math.max(exactRadius, Math.min(80, Number(arrivalRadiusTiles) || place.arrivalRadiusTiles || exactRadius));
  return {
    id,
    type,
    placeId: place.id,
    placeName: place.name,
    mode,
    point: pointForMode(place, mode),
    radiusTiles: exactRadius,
    arrivalRadiusTiles: arrivalRadius,
    label,
    instruction,
    actionRequired,
    actionLabel,
    facility,
    item: item ? { id: item.id, name: item.name } : null,
    transitionTo,
    transitionPoint
  };
}

function buildGeneratedMission(payload, roomCode) {
  const ready = payload?.readyMissionId ? READY_BY_ID.get(String(payload.readyMissionId)) : null;
  const config = { ...(ready || {}), ...(payload || {}) };
  const templateId = String(config.templateId || 'landmark');
  if (!TEMPLATE_BY_ID.has(templateId)) throw new Error('미션 유형을 선택하세요.');
  const markerMode = cleanMarkerMode(config.markerMode);
  const stages = [];
  let title = '';
  let instructions = '';
  let atlasInstruction = '';
  let item = null;

  if (templateId === 'transport') {
    const source = catalogPlace(config.sourcePlaceId, '출발 도시');
    const target = catalogPlace(config.targetPlaceId, '목적 도시');
    if (source.canEnterFromSea !== true || target.canEnterFromSea !== true) throw new Error('도시 간 운송은 항구 도시를 선택하세요.');
    item = catalogItem(config.itemId);
    const sourceFacility = facilityFor(source, config.sourceFacility, '항구 창고');
    const targetFacility = facilityFor(target, config.targetFacility, '항구 창고');
    title = `${source.name} → ${target.name} ${item.name} 운송`;
    atlasInstruction = '';
    instructions = `${source.name} ${sourceFacility}에서 ${withObjectParticle(item.name)} 구입한 뒤 ${target.name} ${targetFacility}에 전달하세요.`;
    stages.push(makeStage({ id:'collect', type:'collect', place:source, mode:'sea', label:`${source.name}에서 물품 구입`, instruction:`${source.name} ${sourceFacility}에 접근해 ${withObjectParticle(item.name)} 구입하세요.`, actionLabel:`${item.name} 구입`, facility:sourceFacility, item }));
    stages.push(makeStage({ id:'deliver', type:'deliver', place:target, mode:'sea', label:`${target.name}에 물품 전달`, instruction:`${target.name} ${targetFacility}에 ${withObjectParticle(item.name)} 전달하세요.`, actionLabel:`${item.name} 전달`, facility:targetFacility, item }));
  } else if (templateId === 'landmark') {
    const target = catalogPlace(config.targetPlaceId, '탐험할 지형');
    if (target.canEnterFromSea === true) throw new Error('주요 지형을 선택하세요.');
    title = `${target.name} 탐험`;
    atlasInstruction = '';
    instructions = `${target.name} 영역을 찾아 조사하세요.`;
    if (target.access === 'land') {
      const landing = catalogPlace(target.landingPortId, '상륙 항구');
      stages.push(makeStage({ id:'land', type:'disembark', place:landing, mode:'sea', label:`${landing.name}에서 상륙`, instruction:`${landing.name} 부근에 도착해 탐험대를 상륙시키세요.`, actionLabel:'탐험대 상륙', transitionTo:'land', transitionPoint:{ x:landing.landPoint.x, y:landing.landPoint.y }, radiusTiles:3 }));
      stages.push(makeStage({ id:'arrive', type:'arriveLandmark', place:target, mode:'land', label:`${target.name} 도착`, instruction:`육상 탐험대로 ${target.name} 영역에 들어가세요.`, actionRequired:false, actionLabel:'', radiusTiles:target.arrivalRadiusTiles, arrivalRadiusTiles:target.arrivalRadiusTiles }));
    } else {
      stages.push(makeStage({ id:'arrive', type:'arriveLandmark', place:target, mode:'sea', label:`${target.name} 도착`, instruction:`배로 ${target.name} 영역에 들어가세요.`, actionRequired:false, actionLabel:'', radiusTiles:target.arrivalRadiusTiles, arrivalRadiusTiles:target.arrivalRadiusTiles }));
    }
  } else if (templateId === 'supply_landmark') {
    const source = catalogPlace(config.sourcePlaceId, '출발 도시');
    const target = catalogPlace(config.targetPlaceId, '목적 지형');
    if (source.canEnterFromSea !== true || target.canEnterFromSea === true) throw new Error('출발 항구 도시와 목적 지형을 선택하세요.');
    item = catalogItem(config.itemId);
    const sourceFacility = facilityFor(source, config.sourceFacility, '항구 창고');
    const targetFacility = cleanText(config.targetFacility, 30) || `${target.category} 조사대`;
    title = `${target.name} 조사대에 ${item.name} 전달`;
    atlasInstruction = '';
    instructions = `${source.name} ${sourceFacility}에서 ${withObjectParticle(item.name)} 구입해 ${target.name}의 ${targetFacility}에 전달하세요.`;
    stages.push(makeStage({ id:'collect', type:'collect', place:source, mode:'sea', label:`${source.name}에서 물품 구입`, instruction:`${source.name} ${sourceFacility}에 접근해 ${withObjectParticle(item.name)} 구입하세요.`, actionLabel:`${item.name} 구입`, facility:sourceFacility, item }));
    if (target.access === 'land') {
      const landing = catalogPlace(target.landingPortId, '상륙 항구');
      stages.push(makeStage({ id:'land', type:'disembark', place:landing, mode:'sea', label:`${landing.name}에서 상륙`, instruction:`${landing.name} 부근에 도착해 탐험대를 상륙시키세요.`, actionLabel:'탐험대 상륙', transitionTo:'land', transitionPoint:{ x:landing.landPoint.x, y:landing.landPoint.y }, radiusTiles:3 }));
      stages.push(makeStage({ id:'arrive', type:'arriveLandmark', place:target, mode:'land', label:`${target.name} 도착`, instruction:`육상 탐험대로 ${target.name} 영역에 들어가세요.`, actionRequired:false, actionLabel:'', radiusTiles:target.arrivalRadiusTiles, arrivalRadiusTiles:target.arrivalRadiusTiles }));
      stages.push(makeStage({ id:'deliver', type:'deliver', place:target, mode:'land', label:`${target.name} 조사대에 전달`, instruction:`${target.name} 조사 지점에 가까이 이동해 ${withObjectParticle(item.name)} ${targetFacility}에 전달하세요.`, actionLabel:`${item.name} 전달`, facility:targetFacility, item, radiusTiles:target.interactionRadiusTiles, arrivalRadiusTiles:target.arrivalRadiusTiles }));
    } else {
      stages.push(makeStage({ id:'arrive', type:'arriveLandmark', place:target, mode:'sea', label:`${target.name} 도착`, instruction:`배로 ${target.name} 영역에 들어가세요.`, actionRequired:false, actionLabel:'', radiusTiles:target.arrivalRadiusTiles, arrivalRadiusTiles:target.arrivalRadiusTiles }));
      stages.push(makeStage({ id:'deliver', type:'deliver', place:target, mode:'sea', label:`${target.name} 조사대에 전달`, instruction:`${target.name} 조사 지점에 가까이 이동해 ${withObjectParticle(item.name)} ${targetFacility}에 전달하세요.`, actionLabel:`${item.name} 전달`, facility:targetFacility, item, radiusTiles:target.interactionRadiusTiles, arrivalRadiusTiles:target.arrivalRadiusTiles }));
    }
  } else if (templateId === 'sea_route') {
    const source = catalogPlace(config.sourcePlaceId, '출발 도시');
    const via = catalogPlace(config.viaPlaceId, '통과할 지형');
    const target = catalogPlace(config.targetPlaceId, '목적 도시');
    if (source.canEnterFromSea !== true || target.canEnterFromSea !== true || via.access !== 'sea') throw new Error('출발·목적 항구와 해상 지형을 올바르게 선택하세요.');
    title = `${via.name} 통과 항로`;
    atlasInstruction = '';
    instructions = `${source.name}에서 항로를 시작해 ${via.name}을 통과한 뒤 ${target.name}에 도착하세요.`;
    stages.push(makeStage({ id:'start', type:'start', place:source, mode:'sea', label:`${source.name}에서 항로 시작`, instruction:`${source.name} 항구에서 항로 조사를 시작하세요.`, actionLabel:'항로 시작' }));
    stages.push(makeStage({ id:'via', type:'waypoint', place:via, mode:'sea', label:`${via.name} 통과`, instruction:`${via.name}을 통과하세요.`, actionRequired:false, actionLabel:'' , radiusTiles:3.2 }));
    stages.push(makeStage({ id:'arrive', type:'arrive', place:target, mode:'sea', label:`${target.name} 도착`, instruction:`${target.name} 항구에 도착해 항로 조사를 마치세요.`, actionLabel:'도착 확인' }));
  }

  const customTitle = cleanText(config.title, MAX_MISSION_TITLE);
  const customInstructions = cleanText(config.instructions, MAX_MISSION_TEXT);
  if (customTitle) title = customTitle;
  if (customInstructions) instructions = customInstructions;
  if (!stages.length) throw new Error('미션 단계를 만들지 못했습니다.');
  const finalStage = stages[stages.length - 1];
  return {
    id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    roomCode,
    kind:'staged',
    mode:'any',
    templateId,
    title,
    instructions,
    atlasInstruction,
    markerMode,
    item: item ? { id:item.id, name:item.name, category:item.category } : null,
    stages,
    target:{ x:finalStage.point.x, y:finalStage.point.y, radiusTiles:finalStage.arrivalRadiusTiles || finalStage.radiusTiles, label:finalStage.placeName },
    criteria:null,
    createdAt:Date.now()
  };
}

function commonMissionGoal(config) {
  const templateId = String(config.templateId || 'landmark');
  if (templateId === 'transport') {
    const target = catalogPlace(config.targetPlaceId, '목적 도시');
    const item = catalogItem(config.itemId);
    return { title:`${target.name}에 ${item.name} 운송`, label:target.name };
  }
  if (templateId === 'supply_landmark') {
    const target = catalogPlace(config.targetPlaceId, '목적 지형');
    const item = catalogItem(config.itemId);
    return { title:`${target.name} 조사대에 ${item.name} 전달`, label:target.name };
  }
  if (templateId === 'sea_route') {
    const via = catalogPlace(config.viaPlaceId, '통과할 지형');
    const target = catalogPlace(config.targetPlaceId, '목적 도시');
    return { title:`${via.name}을 통과해 ${target.name} 도착`, label:`${via.name} · ${target.name}` };
  }
  const target = catalogPlace(config.targetPlaceId, '탐험할 지형');
  return { title:`${target.name} 탐험`, label:target.name };
}

function buildStartChoiceSet(payload, roomCode) {
  const readyMissionId = String(payload?.readyMissionId || '');
  const preset = READY_BY_ID.get(readyMissionId);
  if (!preset) throw new Error('공통 미션을 기본 미션 목록에서 선택하세요.');
  const ids = Array.isArray(payload?.startPlaceIds) ? payload.startPlaceIds.map(String) : [];
  const unique = [...new Set(ids.filter(Boolean))];
  if (unique.length !== 4) throw new Error('서로 다른 출발 도시 4곳을 선택하세요.');
  const starts = unique.map((id) => {
    const place = catalogPlace(id, '출발 도시');
    if (place.canEnterFromSea !== true) throw new Error('출발지는 항구 도시만 선택할 수 있습니다.');
    return place;
  });
  const configBase = { ...preset };
  const goal = commonMissionGoal(configBase);
  const commonTitle = cleanText(payload?.title, MAX_MISSION_TITLE) || goal.title;
  const startOptions = starts.map((start) => {
    const config = { ...configBase };
    if (['transport', 'supply_landmark', 'sea_route'].includes(config.templateId)) config.sourcePlaceId = start.id;
    if (config.targetPlaceId === start.id) throw new Error(`${josaEun(start.name)} 목적지와 같아 출발 도시로 사용할 수 없습니다.`);
    const mission = buildGeneratedMission({ ...config, title: commonTitle }, roomCode);
    mission.startPlace = {
      id:start.id,
      name:start.name,
      region:start.region || '',
      continent:start.continent || '',
      atlasHint:start.atlasHint || '',
      point:{ x:start.seaPoint.x, y:start.seaPoint.y }
    };
    return mission;
  });
  return {
    id: `start-choice-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    roomCode,
    kind: 'startChoiceSet',
    mode: 'any',
    templateId: configBase.templateId,
    readyMissionId,
    title: commonTitle,
    goalLabel: goal.label,
    atlasInstruction: '',
    instructions: cleanText(payload?.instructions, MAX_MISSION_TEXT) || `출발 도시 네 곳 중 한 곳을 선택한 뒤 ${goal.label}까지 이동하세요. 선택 후에는 출발 도시를 바꿀 수 없습니다.`,
    startOptions,
    createdAt: Date.now()
  };
}

// 동물 만나기 경주의 목적지는 도시 목록이 아니라 지도 위 지형(발견 지점)이다.
// 도착 판정을 동물을 만났는지로 하므로 도착 반경은 쓰지 않는다.
function huntTargetPlace(animal) {
  const place = RESOLVED_DISCOVERIES.find((item) => item.id === animal.placeId);
  if (!place) throw new Error(`${animal.placeName}을 지도에서 찾지 못했습니다.`);
  return {
    id: place.id,
    name: place.name,
    category: place.kind || '자연',
    region: place.todayCountry || '',
    continent: '',
    atlasHint: '',
    access: 'sea',
    arrivalRadiusTiles: animal.roamRadiusTiles,
    seaPoint: { x: place.x, y: place.y },
    landPoint: { x: place.x, y: place.y }
  };
}

// 교사는 "동물 만나기"만 고르면 되고, 어떤 동물인지는 게임이 정한다.
// 아무거나 고르면 대서양에서 출발했는데 북태평양 동물이 걸려 한 차시에 못 끝낸다.
// 그래서 출발 도시에서 가까운 바다부터 추리고, 그 가운데서 고른다.
// 바로 앞 미션과 같은 동물은 피해서 수업마다 다른 곳으로 가게 한다.
function pickSeaAnimal(roomCode, starts = []) {
  const all = [...RESOLVED_SEA_ANIMALS.values()];
  const previous = store.room(roomCode).lastHuntAnimalId || '';
  const points = starts.map((place) => place.seaPoint).filter(Boolean);
  let pool = all;
  if (points.length) {
    const withDistance = all.map((animal) => ({
      animal,
      distance: Math.min(...points.map((point) => distanceXY(point.x, point.y, animal.homeX, animal.homeY)))
    })).sort((a, b) => a.distance - b.distance);
    pool = withDistance.slice(0, 3).map((item) => item.animal);
  }
  const fresh = pool.filter((item) => item.id !== previous);
  const source = fresh.length ? fresh : pool;
  const chosen = source[Math.floor(Math.random() * source.length)];
  store.room(roomCode).lastHuntAnimalId = chosen.id;
  return chosen;
}

function buildArrivalRace(payload, roomCode) {
  const ids = Array.isArray(payload?.startPlaceIds) ? payload.startPlaceIds.map(String) : [];
  const unique = [...new Set(ids.filter(Boolean))];
  if (unique.length !== 4) throw new Error('서로 다른 출발 도시 4곳을 선택하세요.');
  const starts = unique.map((id) => {
    const place = catalogPlace(id, '출발 도시');
    if (place.canEnterFromSea !== true) throw new Error('출발지는 항구 도시만 선택할 수 있습니다.');
    return place;
  });
  let requestedAnimal = payload?.huntAnimalId ? seaAnimalById(payload.huntAnimalId) : null;
  if (payload?.huntAnimalId && !requestedAnimal) throw new Error('그런 동물을 찾지 못했습니다.');
  if (!requestedAnimal && payload?.hunt === true) requestedAnimal = pickSeaAnimal(roomCode, starts);
  const target = requestedAnimal ? huntTargetPlace(requestedAnimal) : catalogPlace(payload?.targetPlaceId, '도착 도시 또는 지형');
  for (const place of starts) {
    if (place.id === target.id) throw new Error(`${josaEun(place.name)} 도착지와 같아 출발 도시로 사용할 수 없습니다.`);
  }
  const huntAnimal = requestedAnimal;
  const targetMode = target.access === 'land' ? 'land' : 'sea';
  const targetPoint = huntAnimal ? target.seaPoint : pointForMode(target, targetMode);
  const title = cleanText(payload?.title, MAX_MISSION_TITLE) || (huntAnimal ? `${target.name}의 ${huntAnimal.animal} 만나기` : `${target.name} 도착 미션`);
  return {
    hunt: huntAnimal ? { animalId: huntAnimal.id, animal: huntAnimal.animal, region: huntAnimal.placeName } : null,
    id: `arrival-race-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    roomCode,
    kind: 'arrivalRace',
    mode: 'any',
    title,
    instructions: huntAnimal
      ? `${target.name}에서 ${josaEul(huntAnimal.animal)} 찾아 만난 뒤 최종 문제 3개를 모두 제출하면 완주합니다. 출발 도시 네 곳 중 하나를 선택하세요.`
      : `${target.name}에 도착한 뒤 최종 문제 3개를 모두 제출하면 완주합니다. 출발 도시 네 곳 중 하나를 선택하세요.`,
    atlasInstruction: '',
    markerMode: 'hidden',
    targetPlace: {
      id: target.id,
      name: target.name,
      category: target.category || '',
      region: target.region || '',
      continent: target.continent || '',
      atlasHint: target.atlasHint || '',
      mode: targetMode,
      point: { x: targetPoint.x, y: targetPoint.y },
      radiusTiles: target.arrivalRadiusTiles
    },
    finalQuiz: FinalQuiz.createFinalQuiz(target),
    startOptions: starts.map((start) => ({
      id: start.id,
      startPlace: {
        id: start.id,
        name: start.name,
        region: start.region || '',
        continent: start.continent || '',
        atlasHint: start.atlasHint || '',
        point: { x: start.seaPoint.x, y: start.seaPoint.y }
      }
    })),
    createdAt: Date.now(),
    phase: 'selecting',
    startedAtGameMinutes: null
  };
}

function currentMissionStage(mission, progress) {
  if (!mission || mission.kind !== 'staged' || !Array.isArray(mission.stages)) return null;
  return mission.stages[Math.max(0, Number(progress?.stageIndex || 0))] || null;
}

function missionInteractionForPlayer(player, mission, progress) {
  const stage = currentMissionStage(mission, progress);
  if (!stage || !stage.actionRequired || progress?.status === 'completed') return null;
  const inMode = stage.mode === 'any' || stage.mode === player.mode;
  const near = inMode && distanceXY(player.x, player.y, stage.point.x, stage.point.y) <= (stage.radiusTiles || 2.5) * TILE;
  return {
    stageId:stage.id,
    canInteract:near,
    actionLabel:stage.actionLabel || '확인',
    placeName:stage.placeName,
    message:near ? `${stage.placeName}에서 ${stage.actionLabel || '확인'}할 수 있습니다.` : ''
  };
}

function advanceStagedMission(roomCode, player, mission, progress, stage, label) {
  if (progress.status === 'completed') return publicProgress(progress, mission);
  if (stage.type === 'collect' && stage.item) progress.cargoItemId = stage.item.id;
  if (stage.type === 'deliver') {
    if (stage.item && progress.cargoItemId !== stage.item.id) throw new Error(`${stage.item.name}을 먼저 구입해야 합니다.`);
    progress.cargoItemId = null;
  }
  if (stage.transitionTo === 'land' && stage.transitionPoint) setModeAt(player, 'land', stage.transitionPoint);
  progress.status = 'inProgress';
  progress.stageIndex = Math.max(0, Number(progress.stageIndex || 0)) + 1;
  player.stageArrivalKey = null;
  player.missionStatus = progress.status;
  setNotice(player, label || `${stage.label} 완료`);
  if (progress.stageIndex >= mission.stages.length) {
    completeMission(roomCode, player, mission, progress, label || stage.label);
  } else {
    player.mission = `${mission.title} · ${mission.stages[progress.stageIndex].label}`;
    store.scheduleSave();
    const result = publicProgress(progress, mission);
    io.to(player.id).emit('missionProgress', { mission: missionForStudent(mission), progress: result });
    io.to(`teacher:${roomCode}`).emit('teacherMissionProgress', { name:player.name, progress:result, missionId:store.room(roomCode).activeMission?.id || mission.id });
  }
  return publicProgress(progress, mission);
}



function nearbyCatalogPort(player) {
  const anchoredShore = player.mode === 'land' ? coastalTransferForPlayer(player) : null;
  if (anchoredShore) {
    return {
      kind: 'shore',
      placeId: null,
      placeName: '해안 상륙 지점',
      actionLabel: '배로 돌아가 승선',
      nextMode: 'sea',
      canUse: true
    };
  }
  const place = nearestOriginalCityAccess(player);
  if (!place) {
    const shore = player.mode === 'sea' ? coastalTransferForPlayer(player) : null;
    return shore ? {
      kind: 'shore',
      placeId: null,
      placeName: '가까운 해안',
      actionLabel: '해안 상륙',
      nextMode: 'land',
      canUse: true
    } : null;
  }
  // 내륙 도시는 육상 통과·도착만 가능하다. 실제 바다 출입구가 있는 도시만 승선 후보가 된다.
  if (player.mode === 'land' && (!Array.isArray(place.originalSeaEntryPoints) || !place.originalSeaEntryPoints.length)) return null;
  if (player.mode === 'land') {
    const shipPort = RESOLVED_PLACES.get(String(player.shipPortId || ''));
    const hasOwnShip = !!shipPort && shipPort.id === place.id;
    if (!hasOwnShip) {
      const shipPortName = shipPort?.name || (Number.isFinite(player.shipAnchorX) ? '해안 상륙 지점' : '출발 항구');
      return {
        placeId: place.id,
        placeName: place.name,
        actionLabel: '승선 불가',
        nextMode: 'sea',
        canUse: false,
        message: `${place.name}에는 내 배가 없습니다. 배는 ${shipPortName}에 정박해 있습니다.`,
        shipPortId: shipPort?.id || null,
        shipPortName
      };
    }
  }
  return {
    kind: 'port',
    placeId: place.id,
    placeName: place.name,
    actionLabel: player.mode === 'sea' ? `${place.name} 입항` : `${place.name} 승선`,
    nextMode: player.mode === 'sea' ? 'city' : 'sea',
    canUse: true,
    shipPortId: player.shipPortId || null,
    shipPortName: RESOLVED_PLACES.get(String(player.shipPortId || ''))?.name || ''
  };
}

function nearCityLandPoint(player, place, radiusTiles = 2.00) {
  if (!player || player.mode !== 'land' || !place?.isOriginalCity) return false;
  const points = [
    ...(Array.isArray(place.originalLandEntryPoints) ? place.originalLandEntryPoints : []),
    ...(Array.isArray(place.originalMarkerPoints) ? place.originalMarkerPoints : []),
    ...(place.landPoint ? [place.landPoint] : [])
  ];
  return points.some((point) => distanceXY(player.x, player.y, point.x, point.y) <= radiusTiles * TILE);
}

function nearestCityEntrance(player, radiusTiles = 2.00) {
  if (!player || player.mode !== 'land') return null;
  let best = null;
  let bestDistance = Infinity;
  for (const place of RESOLVED_PLACES.values()) {
    if (!place.isOriginalCity) continue;
    const points = [
      ...(Array.isArray(place.originalLandEntryPoints) ? place.originalLandEntryPoints : []),
      ...(Array.isArray(place.originalMarkerPoints) ? place.originalMarkerPoints : []),
      ...(place.landPoint ? [place.landPoint] : [])
    ];
    for (const point of points) {
      const d = distanceXY(player.x, player.y, point.x, point.y);
      if (d <= radiusTiles * TILE && d < bestDistance) {
        best = place;
        bestDistance = d;
      }
    }
  }
  return best;
}

function cityInteractionForPlayer(player) {
  const place = nearestCityEntrance(player);
  if (!place) return null;
  return {
    placeId: place.id,
    placeName: place.name,
    actionLabel: '도시 들어가기',
    canUse: true,
    interiorImage: place.interiorImage
  };
}

function arrivedAtOriginalCity(player, place) {
  if (!player || !place?.isOriginalCity) return false;
  const nearAny = (points, radiusTiles) => Array.isArray(points) && points.some((point) => distanceXY(player.x, player.y, point.x, point.y) <= radiusTiles * TILE);
  if (player.mode === 'sea') {
    return !!place.canEnterFromSea && nearAny(place.originalSeaEntryPoints, SEA_PORT_TOUCH_RADIUS_TILES);
  }
  if (player.mode === 'land') {
    // 도시 마커 자체는 통행 불가 타일일 수 있으므로 원작 육상 출입 경계에 닿으면 도착으로 인정한다.
    return nearAny(place.originalLandEntryPoints, LAND_PORT_TOUCH_RADIUS_TILES) || nearAny(place.originalMarkerPoints, 2.00);
  }
  return false;
}

function activeMissionState(roomCode, studentName, player = null) {
  const { activeMission, mission, progress } = missionContext(roomCode, studentName, true);
  return {
    mission: missionForStudentWithProgress(activeMission, progress),
    progress: publicProgress(progress, mission),
    interaction: player && mission ? missionInteractionForPlayer(player, mission, progress) : null,
    cityInteraction: player ? cityInteractionForPlayer(player) : null,
    discoveryInteraction: player ? nearbyDiscovery(player) : null,
    cityLandmarks: player ? cityLandmarksFor(player) : [],
    huntInteraction: player ? huntInteractionFor(player) : null,
    portInteraction: player ? nearbyCatalogPort(player) : null
  };
}

function wrapX(x) {
  return Terrain.wrapPixelX(x);
}

function wrapDx(toX, fromX) {
  let d = toX - fromX;
  if (d > WORLD_PIXEL_W / 2) d -= WORLD_PIXEL_W;
  if (d < -WORLD_PIXEL_W / 2) d += WORLD_PIXEL_W;
  return d;
}

function terrainAtPixel(x, y) {
  return Terrain.terrainAtPixel(world, x, y);
}

let navGrid = null;
function navGridReady() {
  if (!navGrid) navGrid = NavGrid.buildNavGrid((cx, cy) => Terrain.terrainAtCell(world, cx, cy).type, WORLD_W, WORLD_H);
  return navGrid;
}

function navIndexAtPixel(grid, mode, x, y, lenient = false) {
  const bx = Math.floor(wrapX(x) / TILE / grid.block);
  const by = Math.floor(Math.max(0, Math.min(WORLD_PIXEL_H - 1, y)) / TILE / grid.block);
  return NavGrid.nearestPassable(grid, mode, bx, by, 24, lenient);
}

// 길찾기 칸의 한가운데가 육지일 수 있으므로, 칸 안에서 배가 실제로 떠 있을 수 있는 타일에 붙인다.
function navIndexToPoint(grid, index, mode) {
  const bx = index % grid.width;
  const by = Math.floor(index / grid.width);
  const centerX = (bx * grid.block + grid.block / 2) * TILE;
  const centerY = (by * grid.block + grid.block / 2) * TILE;
  let best = null;
  let bestDistance = Infinity;
  for (let ty = 0; ty < grid.block; ty += 1) {
    for (let tx = 0; tx < grid.block; tx += 1) {
      const px = ((bx * grid.block + tx) + 0.5) * TILE;
      const py = ((by * grid.block + ty) + 0.5) * TILE;
      if (py < TILE || py > WORLD_PIXEL_H - TILE) continue;
      const terrain = terrainAtPixel(wrapX(px), py);
      const fits = mode === 'sea' ? terrain.type === 'sea' : terrain.type !== 'sea';
      if (!fits) continue;
      const d = Math.hypot(px - centerX, py - centerY);
      if (d < bestDistance) { bestDistance = d; best = { x: wrapX(px), y: py }; }
    }
  }
  return best || {
    x: wrapX(centerX),
    y: Math.max(TILE, Math.min(WORLD_PIXEL_H - TILE, centerY))
  };
}

// 곶이나 강 하구에 막히지 않도록 목적지까지 돌아가는 길을 미리 찾아 둔다.
function planRoute(p, destination) {
  p.route = null;
  p.slideSign = 0;
  p.skippedWaypoints = 0;
  p.bestDistance = Infinity;
  p.lastProgressAt = 0;
  const grid = navGridReady();
  // 먼저 온전히 열린 물길로 찾고, 좁은 해협처럼 그런 길이 없으면 해안을 스치는 길도 허용한다.
  let path = null;
  const strictStart = navIndexAtPixel(grid, p.mode, p.x, p.y);
  const strictGoal = navIndexAtPixel(grid, p.mode, destination.x, destination.y);
  if (strictStart >= 0 && strictGoal >= 0 && strictStart !== strictGoal) {
    path = NavGrid.findPath(grid, p.mode, strictStart, strictGoal, false);
  }
  if (!path) {
    const looseStart = navIndexAtPixel(grid, p.mode, p.x, p.y, true);
    const looseGoal = navIndexAtPixel(grid, p.mode, destination.x, destination.y, true);
    if (looseStart >= 0 && looseGoal >= 0 && looseStart !== looseGoal) {
      path = NavGrid.findPath(grid, p.mode, looseStart, looseGoal, true);
    }
  }
  if (!path || path.length <= 2) {
    p.target = destination;
    return;
  }
  const waypoints = path.slice(1).map((index) => navIndexToPoint(grid, index, p.mode));
  waypoints[waypoints.length - 1] = destination;
  p.target = waypoints.shift();
  p.route = waypoints;
}

function isSeaPixel(x, y) {
  return terrainAtPixel(x, y).type === 'sea';
}

function vectorToDir(vx, vy) {
  let angle = Math.atan2(vx, -vy);
  if (angle < 0) angle += Math.PI * 2;
  return Math.round(angle / (Math.PI / 4)) & 7;
}

function distanceXY(ax, ay, bx, by) {
  return GeoMotion.greatCircleDistancePixels(ax, ay, bx, by, WORLD_PIXEL_W, WORLD_PIXEL_H);
}

function distance(a, b) {
  return distanceXY(a.x, a.y, b.x, b.y);
}

function coastalTransferForPlayer(player) {
  if (!player || (player.mode !== 'sea' && player.mode !== 'land')) return null;
  if (player.mode === 'land') {
    const values = [player.shipAnchorX, player.shipAnchorY, player.shipLandingX, player.shipLandingY];
    if (!values.every(Number.isFinite)) return null;
    const landingDistance = distanceXY(player.x, player.y, player.shipLandingX, player.shipLandingY);
    const anchorDistance = distanceXY(player.x, player.y, player.shipAnchorX, player.shipAnchorY);
    if (Math.min(landingDistance, anchorDistance) > SHORE_RETURN_RADIUS_TILES * TILE) return null;
    return {
      anchorPoint: { x: player.shipAnchorX, y: player.shipAnchorY },
      landingPoint: { x: player.shipLandingX, y: player.shipLandingY }
    };
  }

  const baseCellX = Math.floor(wrapX(player.x) / TILE);
  const baseCellY = Math.floor(player.y / TILE);
  let best = null;
  let bestDistance = Infinity;
  for (let dy = -2; dy <= 2; dy += 1) {
    for (let dx = -2; dx <= 2; dx += 1) {
      const x = (baseCellX + dx + 0.5) * TILE;
      const y = (baseCellY + dy + 0.5) * TILE;
      const terrain = terrainAtPixel(x, y);
      if (terrain.type === 'sea' || !terrain.passable) continue;
      const d = distanceXY(player.x, player.y, x, y);
      if (d <= SHORE_TRANSFER_RADIUS_TILES * TILE && d < bestDistance) {
        best = { x: wrapX(x), y };
        bestDistance = d;
      }
    }
  }
  return best ? {
    anchorPoint: { x: player.x, y: player.y },
    landingPoint: best
  } : null;
}

function safeSpawn(room, origin, requiredMode) {
  const offsets = [
    [0,0],[-28,0],[28,0],[0,-28],[0,28],[-42,-24],[42,-24],[-42,24],[42,24],
    [-64,0],[64,0],[0,-52],[0,52],[-78,-36],[78,-36],[-78,36],[78,36]
  ];
  const players = room ? [...room.values()] : [];
  for (let ring = 0; ring < 8; ring++) {
    for (const [ox, oy] of offsets) {
      const x = wrapX(origin.x + ox + ring * 17);
      const y = Math.max(TILE, Math.min(WORLD_PIXEL_H - TILE, origin.y + oy + ring * 11));
      const terrain = terrainAtPixel(x, y);
      const allowed = requiredMode === 'sea' ? terrain.type === 'sea' : terrain.type !== 'sea' && terrain.passable;
      if (!allowed) continue;
      if (players.every((p) => p.mode !== requiredMode || distanceXY(p.x, p.y, x, y) > 18)) return { x, y };
    }
  }
  return { ...origin };
}

function safeSeaSpawn(room) {
  return safeSpawn(room, START, 'sea');
}

function safeHarborSpawn(room, place = RESOLVED_PLACES.get('lisbon')) {
  return safeSpawn(room, place?.seaPoint || LISBON.harbor, 'sea');
}

function safeLandSpawn(room, place = RESOLVED_PLACES.get('lisbon')) {
  return safeSpawn(room, place?.landPoint || LISBON.landGate, 'land');
}

function currentCityForPlayer(player) {
  const place = RESOLVED_PLACES.get(String(player?.currentCityId || player?.lastCityId || ''));
  return place?.isOriginalCity ? place : null;
}

function nearestOriginalCityAccess(player, radiusTiles = null) {
  if (!player || (player.mode !== 'sea' && player.mode !== 'land')) return null;
  const touchRadiusTiles = Number.isFinite(radiusTiles)
    ? Math.max(0.25, Number(radiusTiles))
    : (player.mode === 'sea' ? SEA_PORT_TOUCH_RADIUS_TILES : LAND_PORT_TOUCH_RADIUS_TILES);
  let best = null;
  let bestDistance = Infinity;
  for (const place of RESOLVED_PLACES.values()) {
    if (!place.isOriginalCity) continue;
    const points = player.mode === 'sea' ? place.originalSeaEntryPoints : place.originalLandEntryPoints;
    if (!Array.isArray(points) || !points.length) continue;
    for (const point of points) {
      const d = distanceXY(player.x, player.y, point.x, point.y);
      if (d <= touchRadiusTiles * TILE && d < bestDistance) {
        best = place;
        bestDistance = d;
      }
    }
  }
  return best;
}

function setNotice(p, text) {
  const now = Date.now();
  if (p.noticeText === text && now - p.noticeAt < 900) return;
  p.noticeText = text;
  p.noticeAt = now;
  p.noticeSeq = (p.noticeSeq || 0) + 1;
}

function updateFatigue(p, dt) {
  const terrainMultiplier = p.mode === 'land' ? terrainAtPixel(p.x, p.y).multiplier : 1;
  p.fatigue = Fatigue.nextFatigue({
    fatigue: p.fatigue,
    dt,
    mode: p.mode,
    moving: p.moving,
    transition: p.transition,
    terrainMultiplier,
    paused: store.room(p.roomCode).settings.paused || !arrivalRaceTravelGate(p).ok
  });
}

function publicPlayer(p, nowGameMinutes = classGameMinutes(p.roomCode)) {
  const activeMission = store.room(p.roomCode).activeMission;
  const currentCity = currentCityForPlayer(p);
  const raceProgress = isArrivalRace(activeMission) ? progressFor(p.roomCode, p.name, activeMission.id, false) : null;
  // Derive appearance from the persisted choice, never from the current port.
  // This also restores the same ship after reconnect without extra saved state.
  const shipProgress = raceProgress || (isStartChoiceSet(activeMission) ? progressFor(p.roomCode, p.name, activeMission.id, false) : null);
  const ship = VoyageShips.selection(isFreeRoom(p.roomCode) ? 'free' : 'race', activeMission, shipProgress,
    id => { const city = RESOLVED_PLACES.get(id); return city ? { ...city, ...SHIP_ORIGINS[id] } : null; });
  const raceCompleted = raceProgress?.status === 'completed';
  const finishRank = Number.isFinite(raceProgress?.finishRank) ? raceProgress.finishRank : null;
  const transition = p.transition ? (() => {
    const remainingRealMs = Math.max(0, Number(p.transition.endsAtRealMs || 0) - Date.now());
    const remainingGameMinutes = remainingRealMs / 1000 * GAME_HOURS_PER_REAL_SECOND * 60;
    return {
      kind: p.transition.kind,
      label: p.transition.label,
      startedAtGameMinutes: p.transition.startedAtGameMinutes,
      endsAtGameMinutes: p.transition.endsAtGameMinutes,
      remainingGameMinutes,
      durationGameMinutes: p.transition.durationGameMinutes || Math.max(1, p.transition.endsAtGameMinutes - p.transition.startedAtGameMinutes)
    };
  })() : null;
  return {
    id: p.id,
    name: p.name,
    sessionMode: p.sessionMode || 'competition',
    x: Math.round(p.x * 10) / 10,
    y: Math.round(p.y * 10) / 10,
    dir: p.dir,
    moving: p.moving,
    mode: p.mode,
    mission: p.mission,
    lastSeen: p.lastSeen,
    terrain: p.terrain || 'sea',
    noticeSeq: p.noticeSeq || 0,
    noticeText: p.noticeText || '',
    missionStatus: p.missionStatus || 'assigned',
    finishRank,
    missionCompleted: raceCompleted,
    speedBoostMultiplier: raceCompleted ? CompletionRewards.speedMultiplier(finishRank) : 1,
    speedKmh: Math.round((Number(p.speedKmh) || 0) * 10) / 10,
    currentName: p.currentName || '',
    currentStrength: Math.round((Number(p.currentStrength) || 0) * 1000) / 1000,
    currentAssistPercent: Number.isFinite(p.currentAssistPercent) ? p.currentAssistPercent : 0,
    windName: p.windName || '',
    windStrength: Math.round((Number(p.windStrength) || 0) * 1000) / 1000,
    windAssistPercent: Number.isFinite(p.windAssistPercent) ? p.windAssistPercent : 0,
    currentCityId: p.currentCityId || null,
    currentCityName: currentCity?.name || '',
    currentCityRegion: currentCity?.region || '',
    currentCityImage: currentCity?.interiorImage || '',
    lastCityId: p.lastCityId || null,
    shipType: ship?.type || null,
    shipName: ship?.name || '',
    shipOriginId: ship?.originId || null,
    shipOriginName: ship?.originName || '',
    shipScale: ship?.scale || 1,
    shipPortId: p.shipPortId || null,
    shipPortName: RESOLVED_PLACES.get(String(p.shipPortId || ''))?.name
      || (Number.isFinite(p.shipAnchorX) ? '해안 상륙 지점' : ''),
    shipAnchoredAtShore: Number.isFinite(p.shipAnchorX),
    shipAnchorX: Number.isFinite(p.shipAnchorX) ? p.shipAnchorX : null,
    shipAnchorY: Number.isFinite(p.shipAnchorY) ? p.shipAnchorY : null,
    shipAnchorDir: Number.isInteger(p.shipAnchorDir) ? p.shipAnchorDir : 0,
    discoveryIds: [...discoveryListFor(p.roomCode, p.name)],
    discoveryTotal: FOUND_TOTAL,
    fatigue: Math.round(Fatigue.clamp(p.fatigue) * 10) / 10,
    fatigueSpeedMultiplier: Math.round(Fatigue.speedMultiplier(p.fatigue) * 1000) / 1000,
    transition
  };
}

function roomForSocket(socket) {
  const code = socket.data.roomCode;
  return code ? rooms.get(code) : null;
}

function playerForSocket(socket) {
  return roomForSocket(socket)?.get(socket.id);
}

function stopPlayer(p) {
  p.input = { up: false, down: false, left: false, right: false };
  p.target = null;
  p.route = null;
  p.moving = false;
  p.speedKmh = 0;
}

function setModeAt(p, mode, point) {
  stopPlayer(p);
  p.transition = null;
  p.mode = mode;
  if (mode !== 'city') p.currentCityId = null;
  p.x = wrapX(point.x);
  p.y = Math.max(TILE, Math.min(WORLD_PIXEL_H - TILE, point.y));
  p.terrain = mode === 'sea' ? 'sea' : mode === 'land' ? terrainAtPixel(p.x, p.y).type : 'plain';
  p.lastSeen = Date.now();
}

function beginTimedTransition(p, options) {
  if (p.transition) return false;
  const nowGameMinutes = classGameMinutes(p.roomCode);
  const nowRealMs = Date.now();
  const durationGameMinutes = Math.max(1, options.durationGameMinutes);
  // 항구 전환은 항구 데이터나 교사 heartbeat에 따라 달라지지 않도록
  // 서버 실시간 타이머로 처리하며, 짧은 전환도 최소 0.25초는 보여 준다.
  const durationRealMs = Math.max(250, durationGameMinutes / (GAME_HOURS_PER_REAL_SECOND * 60) * 1000);
  stopPlayer(p);
  p.transition = {
    kind: options.kind,
    label: options.label,
    startedAtGameMinutes: nowGameMinutes,
    endsAtGameMinutes: nowGameMinutes + durationGameMinutes,
    durationGameMinutes,
    startedAtRealMs: nowRealMs,
    endsAtRealMs: nowRealMs + durationRealMs,
    destinationMode: options.destinationMode,
    destinationPoint: { x: options.destinationPoint.x, y: options.destinationPoint.y },
    missionAfter: options.missionAfter || p.mission,
    noticeAfter: options.noticeAfter || '',
    cityIdAfter: options.cityIdAfter || null,
    lastCityIdAfter: options.lastCityIdAfter || options.cityIdAfter || null,
    shipPortIdAfter: options.shipPortIdAfter || null,
    shipMooringAfter: Object.prototype.hasOwnProperty.call(options, 'shipMooringAfter')
      ? options.shipMooringAfter
      : undefined
  };
  p.lastSeen = nowRealMs;
  return true;
}

function updateTimedTransition(p, _nowGameMinutes, nowRealMs = Date.now()) {
  const action = p.transition;
  if (!action || nowRealMs < action.endsAtRealMs) return false;
  if (!roomClockShouldRun(p.roomCode)) return false;
  p.transition = null;
  setModeAt(p, action.destinationMode, action.destinationPoint);
  if (action.destinationMode === 'city') p.currentCityId = action.cityIdAfter || action.lastCityIdAfter || null;
  if (action.lastCityIdAfter) p.lastCityId = action.lastCityIdAfter;
  if (action.shipPortIdAfter) {
    p.shipPortId = action.shipPortIdAfter;
    p.shipAnchorX = null;
    p.shipAnchorY = null;
    p.shipAnchorDir = null;
    p.shipLandingX = null;
    p.shipLandingY = null;
    const activeMission = store.room(p.roomCode).activeMission;
    const progress = activeMission ? progressFor(p.roomCode, p.name, activeMission.id, false) : null;
    if (progress) progress.shipPortId = action.shipPortIdAfter;
    store.scheduleSave();
  }
  if (action.shipMooringAfter !== undefined) {
    const mooring = action.shipMooringAfter;
    p.shipPortId = null;
    p.shipAnchorX = Number.isFinite(mooring?.anchorPoint?.x) ? mooring.anchorPoint.x : null;
    p.shipAnchorY = Number.isFinite(mooring?.anchorPoint?.y) ? mooring.anchorPoint.y : null;
    p.shipAnchorDir = Number.isInteger(mooring?.anchorDir) ? mooring.anchorDir : null;
    p.shipLandingX = Number.isFinite(mooring?.landingPoint?.x) ? mooring.landingPoint.x : null;
    p.shipLandingY = Number.isFinite(mooring?.landingPoint?.y) ? mooring.landingPoint.y : null;
  }
  p.mission = action.missionAfter;
  if (action.noticeAfter) setNotice(p, action.noticeAfter);
  return true;
}


function recomputeArrivalRaceRanks(roomCode, mission) {
  if (!isArrivalRace(mission)) return [];
  const entries = Object.entries(store.room(roomCode).progress)
    .map(([name, missions]) => ({ name, progress: missions?.[mission.id] }))
    .filter((item) => item.progress?.status === 'completed')
    .sort((a, b) => {
      const scoreGap = (Number(b.progress.finalCorrectCount) || 0) - (Number(a.progress.finalCorrectCount) || 0);
      if (scoreGap) return scoreGap;
      const timeGap = (Number(a.progress.completedAt) || Infinity) - (Number(b.progress.completedAt) || Infinity);
      if (timeGap) return timeGap;
      return a.name.localeCompare(b.name, 'ko');
    });
  entries.forEach((item, index) => { item.progress.finishRank = index + 1; });
  return entries;
}

function livePlayerByName(roomCode, name) {
  const room = rooms.get(roomCode);
  if (!room) return null;
  return [...room.values()].find((player) => player.name === name) || null;
}

function emitArrivalProgressUpdates(roomCode, mission, entries = null) {
  const ranked = entries || recomputeArrivalRaceRanks(roomCode, mission);
  for (const { name, progress } of ranked) {
    const result = publicProgress(progress, mission);
    const player = livePlayerByName(roomCode, name);
    if (player) {
      player.missionStatus = progress.status;
      io.to(player.id).emit('missionProgress', { mission: missionForStudent(mission), progress: result });
    }
    io.to(`teacher:${roomCode}`).emit('teacherMissionProgress', { name, progress: result, missionId: mission.id });
  }
}

function beginFinalQuiz(roomCode, p, mission, progress) {
  if (!isArrivalRace(mission) || progress.status === 'completed' || progress.finalQuizStatus === 'answering') return;
  progress.status = 'inProgress';
  progress.finalQuizStatus = 'answering';
  progress.finalQuizArrivedAt = Date.now();
  progress.finalQuizAnswers = Array.isArray(progress.finalQuizAnswers) ? progress.finalQuizAnswers.slice(0, 3) : [null, null, null];
  while (progress.finalQuizAnswers.length < 3) progress.finalQuizAnswers.push(null);
  p.missionStatus = 'inProgress';
  p.mission = `${mission.targetPlace?.name || mission.title} · 최종 문제 풀이`;
  stopPlayer(p);
  setNotice(p, `${mission.targetPlace?.name || '목적지'}에 도착했습니다. 최종 문제 3개를 모두 제출하면 완주합니다.`);
  store.scheduleSave();
  const result = publicProgress(progress, mission);
  io.to(p.id).emit('missionProgress', { mission: missionForStudent(mission), progress: result });
  io.to(`teacher:${roomCode}`).emit('teacherMissionProgress', { name: p.name, progress: result, missionId: mission.id });
}

function completeMission(roomCode, p, mission, progress, label) {
  if (progress.status === 'completed') return;
  const activeMission = store.room(roomCode).activeMission;
  const arrivalRace = isArrivalRace(activeMission);
  progress.status = 'completed';
  progress.completedAt = Number.isFinite(progress.finalSubmittedAt) ? progress.finalSubmittedAt : Date.now();
  progress.completedGameMinutes = classGameMinutes(roomCode);
  const ranked = arrivalRace ? recomputeArrivalRaceRanks(roomCode, activeMission) : [];
  missionRuntime.delete(runtimeKey(roomCode, p.name, activeMission?.id || mission.id));
  p.missionStatus = 'completed';
  p.mission = `${mission.title} · 완료`;
  const rankText = progress.finishRank ? ` ${progress.finishRank}위로` : '';
  const speedBoost = CompletionRewards.speedMultiplier(progress.finishRank);
  const scoreText = arrivalRace ? ` 최종 문제 ${Number(progress.finalCorrectCount) || 0}/3 정답,` : '';
  setNotice(p, `미션 성공!${scoreText}${rankText} 완주했습니다. 메달을 달고 이동속도 ${speedBoost}배로 자유 탐험할 수 있습니다.`);
  store.scheduleSave();
  if (arrivalRace) {
    emitArrivalProgressUpdates(roomCode, activeMission, ranked);
  } else {
    const result = publicProgress(progress, mission);
    io.to(p.id).emit('missionProgress', { mission: missionForStudent(mission), progress: result });
    io.to(`teacher:${roomCode}`).emit('teacherMissionProgress', { name: p.name, progress: result, missionId: mission.id });
  }
}

function recordMovement(p, movedPixels) {
  if (!(movedPixels > 0)) return;
  const { activeMission, mission, progress } = missionContext(p.roomCode, p.name, true);
  if (!activeMission || !mission || !missionModeMatches(mission, p.mode)) return;
  if (progress.status === 'completed') return;
  const runtime = runtimeProgressFor(p.roomCode, p.name, activeMission.id, true);
  const tiles = movedPixels / TILE;
  runtime.started = true;
  runtime.distanceTiles += tiles;
  runtime.terrainDistanceTiles[p.terrain] = (runtime.terrainDistanceTiles[p.terrain] || 0) + tiles;
  runtime.visitedTerrains.add(p.terrain);
  if (progress.status === 'assigned') progress.status = 'inProgress';
  p.missionStatus = progress.status;
}

function removePlayer(socket) {
  const roomCode = socket.data.roomCode;
  if (!roomCode) return;
  const room = rooms.get(roomCode);
  if (!room) return;
  const p = room.get(socket.id);
  if (room.size === 1 && isFreeRoom(roomCode)) freezeClassClock(roomCode);
  room.delete(socket.id);
  socket.leave(`class:${roomCode}`);
  socket.data.roomCode = null;
  if (room.size === 0) rooms.delete(roomCode);
  touchRoom(roomCode);
  if (p) io.to(`teacher:${roomCode}`).emit('teacherEvent', { type: 'leave', name: p.name, at: Date.now() });
}

function joinedVoyagerState(player, host) {
  const roomCode = player.roomCode, settings = store.room(roomCode).settings;
  const minutes = classGameMinutes(roomCode);
  return { ok:true, resumeToken:player.resumeToken, sessionMode:'competition',
    roomType:settings.roomType || 'race', isHost:host, roomLabel:`방 ${roomCode}`,
    self:publicPlayer(player, minutes), classGameMinutes:minutes, roomCode,
    nearbyRadiusTiles:NEARBY_RADIUS / TILE, settings, ...activeMissionState(roomCode, player.name, player) };
}

io.on('connection', (socket) => {
  socket.on('resumeVoyager', (payload, ack = () => {}) => {
    const token = String(payload?.resumeToken || '');
    const current = playerForSocket(socket);
    if (current && current.resumeToken === token) return ack(joinedVoyagerState(current, teachers.get(socket.id) === current.roomCode));
    if (current) return ack({ok:false, error:'현재 접속과 일치하지 않는 복구 요청입니다.'});
    const session = disconnectedVoyagers.get(token);
    if (!session || session.expiresAt <= Date.now()) return ack({ok:false, error:'연결 복구 시간이 지났습니다. 방에 다시 입장하세요.'});
    const player = session.player, roomCode = player.roomCode;
    if (!roomExists(roomCode) || (store.room(roomCode).activeMission?.id || null) !== player.activeMissionId) {
      disconnectedVoyagers.delete(token);
      return ack({ok:false, error:'방이나 미션이 변경되었습니다. 다시 입장하세요.'});
    }
    let room = rooms.get(roomCode);
    if (room && (room.size >= MAX_ROOM_PLAYERS || [...room.values()].some(p => p.name === player.name))) return ack({ok:false, error:'같은 이름으로 이미 접속 중이거나 방이 가득 찼습니다.'});
    if (!room) { room = new Map(); rooms.set(roomCode, room); if (isFreeRoom(roomCode)) clockForRoom(roomCode).baseServerMs = Date.now(); }
    player.id = socket.id; player.lastSeen = Date.now(); player.lastInputAt = Date.now(); stopPlayer(player);
    room.set(socket.id, player); socket.data.roomCode = roomCode; socket.data.sessionMode = 'competition';
    socket.join(`class:${roomCode}`);
    if (session.host) becomeHost(socket, roomCode);
    disconnectedVoyagers.delete(token); touchRoom(roomCode);
    ack(joinedVoyagerState(player, session.host));
  });
  socket.on('joinClass', (payload, ack = () => {}) => {
    try {
      removePlayer(socket);
      const name = cleanName(payload?.name);
      const roomCode = cleanRoom(payload?.roomCode);
      if (name.length < 2) return ack({ ok: false, error: '이름을 두 글자 이상 입력하세요.' });
      if (!isValidClassCode(roomCode)) return ack({ ok: false, error: '방번호는 숫자 4자리입니다.' });
      if (!roomExists(roomCode)) return ack({ ok: false, error: '그런 방이 없습니다. 방번호를 다시 확인하세요.' });

      const roomSettings = store.room(roomCode).settings;
      const freeRoom = roomSettings.roomType === 'free';
      const existingRoom = rooms.get(roomCode);
      if (roomSettings.locked) return ack({ ok: false, error: '방장이 방 입장을 막았습니다.' });
      if ((existingRoom?.size || 0) >= MAX_ROOM_PLAYERS) return ack({ ok: false, error: '이 방은 정원이 찼습니다.' });
      if ([...(existingRoom?.values() || [])].some((p) => p.name === name)) return ack({ ok: false, error: '이 방에 같은 이름이 이미 있습니다.' });
      let room = existingRoom;
      if (!room) {
        room = new Map();
        rooms.set(roomCode, room);
        if (freeRoom) clockForRoom(roomCode).baseServerMs = Date.now();
      }
      const host = isRoomHost(roomCode, payload?.hostToken);
      if (host) becomeHost(socket, roomCode);
      touchRoom(roomCode);

      const classMinutes = classGameMinutes(roomCode);
      const activeMission = store.room(roomCode).activeMission;
      const savedProgress = activeMission ? progressFor(roomCode, name, activeMission.id, true) : null;
      const savedMission = selectedMission(activeMission, savedProgress);
      const savedRaceStart = isArrivalRace(activeMission) && savedProgress?.selectedStartPlaceId
        ? activeMission.startOptions.find((option) => option.startPlace?.id === savedProgress.selectedStartPlaceId)?.startPlace
        : null;
      const freeStart = freeRoom ? RESOLVED_PLACES.get('lisbon') : null;
      const spawn = freeStart
        ? safeHarborSpawn(room, freeStart)
        : safeSpawn(room, savedRaceStart?.point || savedMission?.startPlace?.point || START, 'sea');
      const player = {
        id: socket.id,
        resumeToken: crypto.randomUUID(),
        name,
        roomCode,
        sessionMode: 'competition',
        x: spawn.x,
        y: spawn.y,
        dir: 2,
        moving: false,
        speedKmh: 0,
        mode: 'sea',
        mission: freeRoom
          ? (roomSettings.started ? '자유 항해' : '방장의 출발 신호 대기')
          : savedMission ? (activeMission?.phase === 'running' ? savedMission.title : '방장 출발 신호 대기') : activeMission ? '출발 도시 4곳 중 선택 대기 중' : '방장의 미션 대기 중',
        activeMissionId: activeMission?.id || null,
        missionStatus: savedProgress?.status || 'assigned',
        transition: null,
        terrain: 'sea',
        input: { up: false, down: false, left: false, right: false },
        target: null,
        lastInputAt: Date.now(),
        lastSeen: Date.now(),
        noticeSeq: 0,
        noticeText: '',
        noticeAt: 0,
        stageArrivalKey: null,
        currentCityId: null,
        cityReturnPoint: null,
        lastCityId: freeStart?.id || savedRaceStart?.id || null,
        shipPortId: freeStart?.id || savedProgress?.shipPortId || savedRaceStart?.id || null,
        shipAnchorX: null,
        shipAnchorY: null,
        shipAnchorDir: null,
        shipLandingX: null,
        shipLandingY: null,
        fatigue: 0,
        money: STARTING_MONEY,
      };
      room.set(socket.id, player);
      socket.data.roomCode = roomCode;
      socket.data.sessionMode = 'competition';
      socket.join(`class:${roomCode}`);
      ack(joinedVoyagerState(player, host));
      io.to(`teacher:${roomCode}`).emit('teacherEvent', { type: 'join', name, at: Date.now() });
    } catch (error) {
      console.error(error);
      ack({ ok: false, error: '입장 처리 중 오류가 발생했습니다.' });
    }
  });

  socket.on('input', (payload) => {
    const p = playerForSocket(socket);
    if (!p || p.transition || (p.mode !== 'sea' && p.mode !== 'land')) return;
    if (!arrivalRaceTravelGate(p).ok) { stopPlayer(p); return; }
    p.input = {
      up: payload?.up === true,
      down: payload?.down === true,
      left: payload?.left === true,
      right: payload?.right === true
    };
    if (p.input.up || p.input.down || p.input.left || p.input.right) { p.target = null; p.route = null; }
    p.lastInputAt = Date.now();
    p.lastSeen = Date.now();
  });

  socket.on('setTarget', (payload) => {
    const p = playerForSocket(socket);
    if (!p || p.transition || (p.mode !== 'sea' && p.mode !== 'land')) return;
    if (!arrivalRaceTravelGate(p).ok) { stopPlayer(p); return; }
    const x = Number(payload?.x);
    const y = Number(payload?.y);
    if (!Number.isFinite(x) || !Number.isFinite(y)) return;
    planRoute(p, { x: wrapX(x), y: Math.max(TILE, Math.min(WORLD_PIXEL_H - TILE, y)) });
    p.input = { up: false, down: false, left: false, right: false };
    p.lastInputAt = Date.now();
    p.lastSeen = Date.now();
  });

  socket.on('inspectDiscovery', (payload, ack = () => {}) => {
    const p = playerForSocket(socket);
    if (!p) return ack({ ok:false, error:'접속 상태가 아닙니다.' });
    const item = RESOLVED_DISCOVERIES.find((entry) => entry.id === String(payload?.id || ''));
    if (!item) return ack({ ok:false, error:'그런 곳을 찾지 못했습니다.' });
    const access = discoveryProximity(p, item);
    if (!access.canUse) return ack({ ok:false, error: item.reach === 'sea' ? '배를 타고 가야 살펴볼 수 있습니다.' : '뭍에 내려서 가야 살펴볼 수 있습니다.' });
    if (access.distance > DISCOVERY_RADIUS_TILES * TILE) return ack({ ok:false, error:`${item.name}에 더 가까이 가세요.` });
    const found = discoveryListFor(p.roomCode, p.name);
    const first = !found.includes(item.id);
    if (first) {
      found.push(item.id);
      store.scheduleSave();
      setNotice(p, `발견! ${item.name}`);
      io.to(`teacher:${p.roomCode}`).emit('teacherEvent', { type:'discovery', name:p.name, discovery:item.name, at:Date.now() });
    }
    ack({ ok:true, first, discovery:{ id:item.id, name:item.name, kind:item.kind, todayCountry:item.todayCountry, in1520:item.in1520, text:item.text, image:landmarkArtUrl(item.id), imageCredit:photoCreditFor(item.id) }, found:found.length, total:FOUND_TOTAL, self:publicPlayer(p) });
  });

  socket.on('meetAnimal', (payload, ack = () => {}) => {
    const p = playerForSocket(socket);
    if (!p) return ack({ ok:false, error:'접속 상태가 아닙니다.' });
    const mission = store.room(p.roomCode).activeMission;
    if (!isArrivalRace(mission) || !mission.hunt) return ack({ ok:false, error:'동물을 만나는 미션이 아닙니다.' });
    const animal = seaAnimalById(mission.hunt.animalId);
    if (!animal) return ack({ ok:false, error:'그런 동물을 찾지 못했습니다.' });
    if (p.mode !== 'sea') return ack({ ok:false, error:'배를 타고 있어야 만날 수 있습니다.' });
    const progress = progressFor(p.roomCode, p.name, mission.id, false);
    if (!progress) return ack({ ok:false, error:'미션 진행 기록을 찾지 못했습니다.' });
    const state = huntStateFor(p.roomCode, p.name, animal);
    if (state.met) return ack({ ok:true, already:true, animal:{ name:animal.animal, region:animal.placeName, text:animal.text, image:landmarkArtUrl(animal.id) || landmarkArtUrl(animal.placeId), imageCredit:photoCreditFor(animal.id) || photoCreditFor(animal.placeId) } });
    if (distanceXY(p.x, p.y, state.x, state.y) > MEET_RADIUS_TILES * TILE) return ack({ ok:false, error:`${animal.animal}에 더 가까이 가세요.` });
    state.met = true;
    store.scheduleSave();
    setNotice(p, `${josaEul(animal.animal)} 만났습니다!`);
    io.to(`teacher:${p.roomCode}`).emit('teacherEvent', { type:'meet', name:p.name, discovery:animal.animal, at:Date.now() });
    beginFinalQuiz(p.roomCode, p, mission, progress);
    ack({ ok:true, already:false, animal:{ name:animal.animal, region:animal.placeName, text:animal.text, image:landmarkArtUrl(animal.id) || landmarkArtUrl(animal.placeId), imageCredit:photoCreditFor(animal.id) || photoCreditFor(animal.placeId) }, self:publicPlayer(p) });
  });

  socket.on('inspectLandmark', (payload, ack = () => {}) => {
    const p = playerForSocket(socket);
    if (!p) return ack({ ok:false, error:'접속 상태가 아닙니다.' });
    const item = LANDMARK_BY_ID.get(String(payload?.id || ''));
    if (!item) return ack({ ok:false, error:'그런 명소를 찾지 못했습니다.' });
    if (p.mode !== 'city' || p.currentCityId !== item.cityId) return ack({ ok:false, error:`${josaEun(item.name)} 그 도시 안에서만 볼 수 있습니다.` });
    const found = discoveryListFor(p.roomCode, p.name);
    const first = !found.includes(item.id);
    if (first) {
      found.push(item.id);
      store.scheduleSave();
      setNotice(p, `명소 · ${item.name}`);
      io.to(`teacher:${p.roomCode}`).emit('teacherEvent', { type:'landmark', name:p.name, discovery:item.name, at:Date.now() });
    }
    ack({ ok:true, first, landmark:publicLandmark(item), found:found.length, total:FOUND_TOTAL, self:publicPlayer(p) });
  });

  socket.on('stop', () => {
    const p = playerForSocket(socket);
    if (!p) return;
    stopPlayer(p);
    p.lastSeen = Date.now();
  });

  socket.on('enterCity', (payload, ack = () => {}) => {
    const p = playerForSocket(socket);
    if (!p || p.mode !== 'land') return ack({ ok:false, error:'육상 탐험대 상태에서 도시 입구에 접근하세요.' });
    const travel = arrivalRaceTravelGate(p);
    if (!travel.ok) return ack({ ok:false, error:travel.error });
    if (p.transition) return ack({ ok:false, error:'이동 수단 전환이 진행 중입니다.' });
    const place = RESOLVED_PLACES.get(String(payload?.placeId || ''));
    if (!place?.isOriginalCity) return ack({ ok:false, error:'도시 정보를 찾지 못했습니다.' });
    if (!nearCityLandPoint(p, place)) return ack({ ok:false, error:`${place.name} 입구에 더 가까이 이동하세요.` });
    p.cityReturnPoint = { x:p.x, y:p.y };
    setModeAt(p, 'city', p.cityReturnPoint);
    p.currentCityId = place.id;
    p.lastCityId = place.id;
    setNotice(p, `${place.name}에 들어왔습니다.`);
    ack({ ok:true, city:{ id:place.id, name:place.name, region:place.region || '', interiorImage:place.interiorImage }, self:publicPlayer(p) });
  });

  socket.on('leaveCity', (_payload, ack = () => {}) => {
    const room = roomForSocket(socket);
    const p = playerForSocket(socket);
    if (!p || p.mode !== 'city') return ack({ ok:false, error:'현재 도시에 있지 않습니다.' });
    if (p.transition) return ack({ ok:false, error:'이동 수단 전환이 진행 중입니다.' });
    const place = currentCityForPlayer(p);
    if (!place) return ack({ ok:false, error:'현재 도시 정보를 찾지 못했습니다.' });
    const saved = p.cityReturnPoint;
    const validSaved = saved && terrainAtPixel(saved.x, saved.y).type !== 'sea';
    const destination = validSaved ? saved : safeLandSpawn(room, place);
    setModeAt(p, 'land', destination);
    p.cityReturnPoint = null;
    p.lastCityId = place.id;
    setNotice(p, `${place.name} 밖으로 나왔습니다.`);
    ack({ ok:true, city:place.name, self:publicPlayer(p) });
  });

  // 이전 클라이언트와의 호환용 별칭. 도시 입장·퇴장에는 게임 시간 비용이 없다.
  socket.on('enterPort', (payload, ack = () => {}) => {
    const p = playerForSocket(socket);
    if (!p || p.mode !== 'land') return ack({ ok:false, error:'도시 입구에 접근하세요.' });
    const place = nearestCityEntrance(p);
    if (!place) return ack({ ok:false, error:'도시 입구에 더 가까이 이동하세요.' });
    socket.emit('compatEnterCityIgnored');
    ack({ ok:false, error:'새 화면을 사용하려면 브라우저를 새로고침하세요.' });
  });

  socket.on('departCity', (_payload, ack = () => {}) => {
    const room = roomForSocket(socket);
    const p = playerForSocket(socket);
    if (!p || p.mode !== 'city') return ack({ ok:false, error:'현재 도시에 있지 않습니다.' });
    const travel = arrivalRaceTravelGate(p); if (!travel.ok) return ack({ ok:false, error:travel.error });
    if (p.transition) return ack({ ok:false, error:'이동 수단 전환이 이미 진행 중입니다.' });
    const place = currentCityForPlayer(p);
    if (!place) return ack({ ok:false, error:'현재 도시 정보를 찾지 못했습니다.' });
    if (p.shipPortId !== place.id || !place.originalSeaEntryPoints?.length) {
      return ack({ ok:false, error:`${place.name}에는 내 배가 정박해 있지 않습니다.` });
    }
    beginTimedTransition(p, {
      kind:'portDeparture',
      label:`${place.name} 출항 준비 중`,
      durationGameMinutes:PORT_TRANSFER_GAME_MINUTES,
      destinationMode:'sea', destinationPoint:safeHarborSpawn(room, place), lastCityIdAfter:place.id, shipPortIdAfter:place.id,
      missionAfter:`${place.name}에서 항해`,
      noticeAfter:`${place.name}에서 출항했습니다.`
    });
    p.cityReturnPoint = null;
    ack({ ok:true, started:true, self:publicPlayer(p), port:place.name });
  });
  socket.on('departPort', (_payload, ack = () => {}) => ack({ ok:false, error:'새 화면을 사용하려면 브라우저를 새로고침하세요.' }));
  socket.on('startLandExpedition', (_payload, ack = () => {}) => ack({ ok:false, error:'항구에서 상륙 명령을 사용하세요.' }));
  socket.on('returnToCity', (_payload, ack = () => {}) => ack({ ok:false, error:'도시 입구에서 도시 들어가기를 사용하세요.' }));

  socket.on('missionUpdate', (payload) => {
    const p = playerForSocket(socket);
    if (!p) return;
    p.mission = String(payload?.mission || '').slice(0, 60) || p.mission;
    p.lastSeen = Date.now();
  });


  socket.on('missionInteract', (_payload, ack = () => {}) => {
    const p = playerForSocket(socket);
    if (!p) return ack({ ok:false, error:'학생 접속 상태가 아닙니다.' });
    const { mission, progress } = missionContext(p.roomCode, p.name, true);
    const stage = currentMissionStage(mission, progress);
    if (!mission || !progress || !stage) return ack({ ok:false, error:'진행 중인 단계형 미션이 없습니다.' });
    if (!stage.actionRequired) return ack({ ok:false, error:'이 단계는 도착하면 자동으로 완료됩니다.' });
    if (stage.mode !== 'any' && stage.mode !== p.mode) return ack({ ok:false, error:`현재는 ${stage.mode === 'land' ? '육상 탐험대' : '배'} 상태가 필요합니다.` });
    if (distanceXY(p.x, p.y, stage.point.x, stage.point.y) > (stage.radiusTiles || 2.5) * TILE) return ack({ ok:false, error:`${stage.placeName}에 더 가까이 이동하세요.` });
    try {
      const result = advanceStagedMission(p.roomCode, p, mission, progress, stage, `${stage.label} 완료`);
      ack({ ok:true, self:publicPlayer(p), mission:missionForStudent(mission), progress:result });
    } catch (error) {
      ack({ ok:false, error:error.message || '미션 행동을 처리하지 못했습니다.' });
    }
  });

  socket.on('saveFinalQuizAnswers', (payload, ack = () => {}) => {
    const p = playerForSocket(socket);
    if (!p) return ack({ ok: false, error: '학생 접속 상태가 아닙니다.' });
    const mission = store.room(p.roomCode).activeMission;
    if (!isArrivalRace(mission)) return ack({ ok: false, error: '진행 중인 도착 미션이 없습니다.' });
    const progress = progressFor(p.roomCode, p.name, mission.id, false);
    if (!progress || progress.finalQuizStatus !== 'answering') return ack({ ok: false, error: '도착지 최종 문제가 시작되지 않았습니다.' });
    const source = Array.isArray(payload?.answers) ? payload.answers.slice(0, 3) : [];
    while (source.length < 3) source.push(null);
    const answers = source.map((value, index) => {
      if (value == null || value === '') return null;
      const choice = Number(value);
      const count = mission.finalQuiz?.questions?.[index]?.choices?.length || 0;
      return Number.isInteger(choice) && choice >= 0 && choice < count ? choice : null;
    });
    progress.finalQuizAnswers = answers;
    store.scheduleSave();
    ack({ ok: true, answers: [...answers] });
  });

  socket.on('submitFinalQuiz', (payload, ack = () => {}) => {
    const p = playerForSocket(socket);
    if (!p) return ack({ ok: false, error: '학생 접속 상태가 아닙니다.' });
    const mission = store.room(p.roomCode).activeMission;
    if (!isArrivalRace(mission)) return ack({ ok: false, error: '진행 중인 도착 미션이 없습니다.' });
    const progress = progressFor(p.roomCode, p.name, mission.id, false);
    if (!progress) return ack({ ok: false, error: '미션 진행 기록을 찾지 못했습니다.' });
    if (progress.status === 'completed') {
      return ack({ ok: true, self: publicPlayer(p), mission: missionForStudent(mission), progress: publicProgress(progress, mission) });
    }
    if (progress.finalQuizStatus !== 'answering') return ack({ ok: false, error: '목적지에 도착한 뒤 문제를 제출하세요.' });
    try {
      const graded = FinalQuiz.grade(mission.finalQuiz, payload?.answers);
      const incorrectIndexes = graded.correct
        .map((correct, index) => correct ? -1 : index)
        .filter(index => index >= 0);
      if (incorrectIndexes.length) {
        progress.finalQuizAnswers = graded.answers.map((answer, index) => incorrectIndexes.includes(index) ? null : answer);
        store.scheduleSave();
        return ack({
          ok: false,
          retry: true,
          incorrectIndexes,
          error: '다시 생각하고 표시된 문제의 다른 답을 골라보세요.'
        });
      }
      progress.finalQuizAnswers = graded.answers;
      progress.finalCorrectCount = graded.correctCount;
      progress.finalSubmittedAt = Date.now();
      progress.finalQuizStatus = 'submitted';
      completeMission(p.roomCode, p, mission, progress, mission.targetPlace?.name || mission.title);
      ack({ ok: true, self: publicPlayer(p), mission: missionForStudent(mission), progress: publicProgress(progress, mission) });
    } catch (error) {
      ack({ ok: false, error: error.message || '최종 문제를 제출하지 못했습니다.' });
    }
  });

  socket.on('chooseStartCity', (payload, ack = () => {}) => {
    const p = playerForSocket(socket);
    if (!p) return ack({ ok:false, error:'학생 접속 상태가 아닙니다.' });
    const activeMission = store.room(p.roomCode).activeMission;
    if (!isArrivalRace(activeMission) && !isStartChoiceSet(activeMission)) return ack({ ok:false, error:'현재 선택할 출발 도시가 없습니다.' });
    if (isArrivalRace(activeMission) && activeMission.phase !== 'selecting') return ack({ ok:false, error:'이미 출발한 미션입니다. 교사에게 다시 시작해 달라고 하세요.' });
    const progress = progressFor(p.roomCode, p.name, activeMission.id, true);
    if (progress.selectedStartPlaceId || progress.selectedMissionId) return ack({ ok:false, error:'출발 도시는 한 번 선택하면 변경할 수 없습니다.' });
    const optionId = String(payload?.optionId || '');
    let mission = activeMission;
    let startPlace = null;
    if (isArrivalRace(activeMission)) {
      const option = activeMission.startOptions.find((item) => item.id === optionId || item.startPlace?.id === optionId);
      startPlace = option?.startPlace || null;
      if (!startPlace?.point) return ack({ ok:false, error:'배포된 출발 도시 네 곳 중 하나를 선택하세요.' });
      progress.selectedStartPlaceId = startPlace.id;
      progress.selectedMissionId = null;
      progress.shipPortId = startPlace.id;
      progress.status = 'assigned';
      progress.completedAt = null;
      progress.completedGameMinutes = null;
      progress.finishRank = null;
      progress.finalQuizStatus = 'none';
      progress.finalQuizArrivedAt = null;
      progress.finalQuizAnswers = [null, null, null];
      progress.finalCorrectCount = null;
      progress.finalSubmittedAt = null;
    } else {
      mission = activeMission.startOptions.find((option) => option.id === optionId);
      startPlace = mission?.startPlace || null;
      if (!startPlace?.point) return ack({ ok:false, error:'배포된 출발 도시 중 하나를 선택하세요.' });
      progress.selectedMissionId = mission.id;
      progress.status = 'assigned';
      progress.stageIndex = 0;
      progress.cargoItemId = null;
      progress.completedAt = null;
    }
    p.stageArrivalKey = null;
    p.shipPortId = startPlace.id;
    const room = rooms.get(p.roomCode);
    const spawn = safeSpawn(room, startPlace.point, 'sea');
    setModeAt(p, 'sea', spawn);
    p.fatigue = 0;
    p.activeMissionId = activeMission.id;
    p.mission = isArrivalRace(activeMission) ? `${activeMission.targetPlace.name} 도착` : `${mission.title} · ${mission.stages?.[0]?.label || '출발 준비'}`;
    p.missionStatus = progress.status;
    setNotice(p, `${startPlace.name} 선택 완료. 교사의 출발 신호를 기다리세요.`);
    store.scheduleSave();
    const publicState = publicProgress(progress, isArrivalRace(activeMission) ? activeMission : mission);
    io.to(p.id).emit('missionProgress', { mission:missionForStudent(isArrivalRace(activeMission) ? activeMission : mission), progress:publicState });
    io.to(`teacher:${p.roomCode}`).emit('teacherMissionProgress', { name:p.name, progress:publicState, missionId:activeMission.id });
    ack({ ok:true, mission:missionForStudent(isArrivalRace(activeMission) ? activeMission : mission), progress:publicState, self:publicPlayer(p) });
  });

  socket.on('useCatalogPort', (payload, ack = () => {}) => {
    const room = roomForSocket(socket);
    const p = playerForSocket(socket);
    if (!p || (p.mode !== 'sea' && p.mode !== 'land')) return ack({ ok:false, error:'현재 항구를 이용할 수 없습니다.' });
    const travel = arrivalRaceTravelGate(p); if (!travel.ok) return ack({ ok:false, error:travel.error });
    if (p.transition) return ack({ ok:false, error:'이동 수단 전환이 이미 진행 중입니다.' });
    const place = RESOLVED_PLACES.get(String(payload?.placeId || ''));
    if (!place || !place.isOriginalCity) return ack({ ok:false, error:'원작 도시 정보를 찾지 못했습니다.' });
    const fromSea = p.mode === 'sea';
    const entryPoints = fromSea ? place.originalSeaEntryPoints : place.originalLandEntryPoints;
    if (!Array.isArray(entryPoints) || !entryPoints.length) return ack({ ok:false, error:fromSea?'원작에서 이 도시는 바다로 접근할 수 없습니다.':'원작에서 이 도시를 통해 승선할 수 없습니다.' });
    if (!fromSea && p.shipPortId !== place.id) {
      const shipPortName = RESOLVED_PLACES.get(String(p.shipPortId || ''))?.name
        || (Number.isFinite(p.shipAnchorX) ? '해안 상륙 지점' : '출발 항구');
      return ack({ ok:false, error:`${place.name}에는 내 배가 없습니다. 배는 ${shipPortName}에 정박해 있습니다.` });
    }
    const touchRadiusTiles = fromSea ? SEA_PORT_TOUCH_RADIUS_TILES : LAND_PORT_TOUCH_RADIUS_TILES;
    const near = entryPoints.some((point) => distanceXY(p.x, p.y, point.x, point.y) <= touchRadiusTiles * TILE);
    if (!near) return ack({ ok:false, error:`${place.name}에 더 가까이 이동하세요.` });
    const destinationMode = fromSea ? 'city' : 'sea';
    const destinationPoint = fromSea ? safeLandSpawn(room, place) : safeHarborSpawn(room, place);
    if (fromSea) p.cityReturnPoint = null;
    beginTimedTransition(p, {
      kind:fromSea?'portEntry':'directEmbark',
      label:fromSea?`${place.name} 입항 중`:`${place.name} 승선 준비 중`,
      durationGameMinutes:PORT_TRANSFER_GAME_MINUTES,
      destinationMode, destinationPoint, cityIdAfter:fromSea ? place.id : null, lastCityIdAfter:place.id, shipPortIdAfter:place.id,
      missionAfter:fromSea?`${place.name}에 정박`:`${place.name}에서 항해`,
      noticeAfter:fromSea?`${place.name}에 입항했습니다. 배는 이 항구에 정박해 있습니다.`:`${place.name}에 정박한 내 배에 승선했습니다.`
    });
    ack({ ok:true, started:true, self:publicPlayer(p), port:place.name });
  });

  socket.on('useShoreTransfer', (_payload, ack = () => {}) => {
    const room = roomForSocket(socket);
    const p = playerForSocket(socket);
    if (!p || (p.mode !== 'sea' && p.mode !== 'land')) return ack({ ok:false, error:'현재 해안 상륙을 이용할 수 없습니다.' });
    const travel = arrivalRaceTravelGate(p); if (!travel.ok) return ack({ ok:false, error:travel.error });
    if (p.transition) return ack({ ok:false, error:'이동 수단 전환이 이미 진행 중입니다.' });
    const shore = coastalTransferForPlayer(p);
    if (!shore) return ack({ ok:false, error:p.mode === 'sea' ? '배를 해안에 더 가까이 이동하세요.' : '배를 정박한 해안으로 돌아가세요.' });

    const fromSea = p.mode === 'sea';
    const destinationMode = fromSea ? 'land' : 'sea';
    const destinationPoint = fromSea
      ? safeSpawn(room, shore.landingPoint, destinationMode)
      : { x: shore.anchorPoint.x, y: shore.anchorPoint.y };
    const mooring = fromSea
      ? { anchorPoint: shore.anchorPoint, anchorDir: p.dir, landingPoint: destinationPoint }
      : null;
    beginTimedTransition(p, {
      kind: fromSea ? 'shoreDisembark' : 'shoreEmbark',
      label: fromSea ? '해안 상륙 준비 중' : '해안 승선 준비 중',
      durationGameMinutes: PORT_TRANSFER_GAME_MINUTES,
      destinationMode,
      destinationPoint,
      shipMooringAfter: mooring,
      missionAfter: fromSea ? '해안에서 육상 탐험' : '해안에서 항해 재개',
      noticeAfter: fromSea
        ? '배를 해안에 정박하고 육상 탐험을 시작합니다. 같은 상륙 지점으로 돌아와야 다시 승선할 수 있습니다.'
        : '해안에 정박한 배로 돌아와 항해를 다시 시작합니다.'
    });
    ack({ ok:true, started:true, self:publicPlayer(p), shore:fromSea?'해안 상륙':'해안 승선' });
  });

  socket.on('teacherPublishArrivalRace', (payload, ack = () => {}) => {
    const roomCode = teachers.get(socket.id);
    if (!roomCode) return ack({ ok:false, error:'교사 인증이 필요합니다.' });
    try {
      const mission = buildArrivalRace(payload, roomCode);
      const waitingAtMinutes = freezeClassClock(roomCode);
      clearMissionRuntime(roomCode);
      store.room(roomCode).hunts = {};
      store.setActiveMission(roomCode, mission);
      const room = rooms.get(roomCode);
      if (room) {
        for (const p of room.values()) {
          const progress = progressFor(roomCode, p.name, mission.id, true);
          progress.selectedMissionId = null;
          progress.selectedStartPlaceId = null;
          progress.shipPortId = null;
          progress.status = 'assigned';
          progress.stageIndex = 0;
          progress.cargoItemId = null;
          progress.completedAt = null;
          progress.completedGameMinutes = null;
          progress.finishRank = null;
          progress.finalQuizStatus = 'none';
          progress.finalQuizArrivedAt = null;
          progress.finalQuizAnswers = [null, null, null];
          progress.finalCorrectCount = null;
          progress.finalSubmittedAt = null;
          p.activeMissionId = mission.id;
          p.shipPortId = null;
          p.mission = '출발 도시 선택 후 교사 출발 대기';
          p.missionStatus = 'assigned';
          stopPlayer(p);
          setNotice(p, `새 미션: ${mission.targetPlace.name}에 도착하세요.`);
        }
      }
      io.to(`class:${roomCode}`).emit('missionPublished', { mission:missionForStudent(mission) });
      io.to(`teacher:${roomCode}`).emit('teacherMissionChanged', { mission:missionForTeacher(mission) });
      ack({ ok:true, mission:missionForTeacher(mission), progress:missionProgressList(roomCode, mission.id), classGameMinutes:waitingAtMinutes });
    } catch (error) {
      ack({ ok:false, error:error.message || '도착 미션을 만들지 못했습니다.' });
    }
  });

  socket.on('teacherStartArrivalRace', (_payload, ack = () => {}) => {
    const roomCode = teachers.get(socket.id);
    if (!roomCode) return ack({ ok:false, error:'교사 인증이 필요합니다.' });
    const mission = store.room(roomCode).activeMission;
    if (!isArrivalRace(mission)) return ack({ ok:false, error:'먼저 도착지와 출발 도시 4곳을 배포하세요.' });
    if (mission.phase === 'running') return ack({ ok:false, error:'이미 출발한 미션입니다.' });
    const room = rooms.get(roomCode);
    const connected = room ? [...room.values()] : [];
    if (!connected.length) return ack({ ok:false, error:'현재 접속한 학생이 없습니다.' });
    const notReady = connected.filter((p) => !progressFor(roomCode, p.name, mission.id, false)?.selectedStartPlaceId);
    if (notReady.length) {
      const names = notReady.slice(0, 6).map((p) => p.name).join(', ');
      const more = notReady.length > 6 ? ` 외 ${notReady.length - 6}명` : '';
      return ack({ ok:false, error:`출발 도시를 고르지 않은 학생이 있습니다: ${names}${more}` });
    }
    const startMinutes = classGameMinutes(roomCode);
    const startedAtReal = Date.now();
    mission.phase = 'running';
    mission.startedAtGameMinutes = startMinutes;
    mission.startedAt = startedAtReal;
    const clock = clockForRoom(roomCode);
    clock.baseGameMinutes = startMinutes;
    clock.baseServerMs = startedAtReal;
    clock.lastTeacherSyncAt = startedAtReal;
    store.setRoomClock(roomCode, startMinutes);
    for (const p of connected) {
      const progress = progressFor(roomCode, p.name, mission.id, true);
      if (progress.status !== 'completed') progress.status = 'inProgress';
      p.missionStatus = progress.status;
      p.mission = `${mission.targetPlace.name} 도착`;
      stopPlayer(p);
      setNotice(p, `출발! ${mission.targetPlace.name}을 향해 이동하세요.`);
      io.to(p.id).emit('missionProgress', { mission:missionForStudent(mission), progress:publicProgress(progress, mission) });
    }
    store.scheduleSave();
    io.to(`class:${roomCode}`).emit('missionStarted', { mission:missionForStudent(mission), classGameMinutes:startMinutes });
    io.to(`teacher:${roomCode}`).emit('teacherMissionChanged', { mission:missionForTeacher(mission) });
    ack({ ok:true, mission:missionForTeacher(mission), progress:missionProgressList(roomCode, mission.id), classGameMinutes:startMinutes });
  });

  socket.on('teacherPublishStartChoices', (payload, ack = () => {}) => {
    return ack({ ok:false, error:'v23에서는 도착지 1곳과 출발 도시 4곳을 선택하는 도착 미션만 사용합니다.' });
    const roomCode = teachers.get(socket.id);
    if (!roomCode) return ack({ ok:false, error:'교사 인증이 필요합니다.' });
    try {
      const mission = buildStartChoiceSet(payload, roomCode);
      clearMissionRuntime(roomCode);
      store.setActiveMission(roomCode, mission);
      const room = rooms.get(roomCode);
      if (room) {
        for (const p of room.values()) {
          const progress = progressFor(roomCode, p.name, mission.id, true);
          progress.selectedMissionId = null;
          progress.status = 'assigned';
          progress.stageIndex = 0;
          progress.cargoItemId = null;
          progress.completedAt = null;
          p.activeMissionId = mission.id;
          p.mission = '출발 도시 4곳 중 한 곳 선택';
          p.missionStatus = 'assigned';
          stopPlayer(p);
        }
      }
      io.to(`class:${roomCode}`).emit('missionPublished', { mission:missionForStudentWithProgress(mission, null) });
      io.to(`teacher:${roomCode}`).emit('teacherMissionChanged', { mission:missionForTeacher(mission) });
      ack({ ok:true, mission:missionForTeacher(mission), progress:missionProgressList(roomCode, mission.id) });
    } catch (error) {
      ack({ ok:false, error:error.message || '공통 미션과 출발 도시를 만들지 못했습니다.' });
    }
  });

  socket.on('teacherPublishGeneratedMission', (payload, ack = () => {}) => {
    return ack({ ok:false, error:'v23에서는 도착지 1곳과 출발 도시 4곳을 선택하는 도착 미션만 사용합니다.' });
    const roomCode = teachers.get(socket.id);
    if (!roomCode) return ack({ ok:false, error:'교사 인증이 필요합니다.' });
    try {
      const mission = buildGeneratedMission(payload, roomCode);
      clearMissionRuntime(roomCode);
      store.setActiveMission(roomCode, mission);
      const room = rooms.get(roomCode);
      if (room) {
        for (const p of room.values()) {
          const progress = progressFor(roomCode, p.name, mission.id, true);
          p.activeMissionId = mission.id;
          p.mission = `${mission.title} · ${mission.stages[0].label}`;
          p.missionStatus = progress.status;
        }
      }
      io.to(`class:${roomCode}`).emit('missionPublished', { mission:missionForStudent(mission) });
      io.to(`teacher:${roomCode}`).emit('teacherMissionChanged', { mission:missionForTeacher(mission) });
      ack({ ok:true, mission:missionForTeacher(mission), progress:missionProgressList(roomCode, mission.id) });
    } catch (error) {
      ack({ ok:false, error:error.message || '자동 미션을 만들지 못했습니다.' });
    }
  });

  socket.on('teacherPublishMission', (payload, ack = () => {}) => {
    return ack({ ok:false, error:'v23에서는 도착지 1곳과 출발 도시 4곳을 선택하는 도착 미션만 사용합니다.' });
    const roomCode = teachers.get(socket.id);
    if (!roomCode) return ack({ ok: false, error: '교사 인증이 필요합니다.' });
    try {
      const mission = sanitizeMission(payload, roomCode);
      clearMissionRuntime(roomCode);
      store.setActiveMission(roomCode, mission);
      const room = rooms.get(roomCode);
      if (room) {
        for (const p of room.values()) {
          const progress = progressFor(roomCode, p.name, mission.id, true);
          p.activeMissionId = mission.id;
          p.mission = mission.title;
          p.missionStatus = progress.status;
        }
      }
      io.to(`class:${roomCode}`).emit('missionPublished', { mission: missionForStudent(mission) });
      io.to(`teacher:${roomCode}`).emit('teacherMissionChanged', { mission: missionForTeacher(mission) });
      ack({ ok: true, mission: missionForTeacher(mission), progress: missionProgressList(roomCode, mission.id) });
    } catch (error) {
      ack({ ok: false, error: error.message || '미션을 만들지 못했습니다.' });
    }
  });

  socket.on('teacherClearMission', (_payload, ack = () => {}) => {
    const roomCode = teachers.get(socket.id);
    if (!roomCode) return ack({ ok: false, error: '교사 인증이 필요합니다.' });
    const stoppedAtMinutes = freezeClassClock(roomCode);
    clearMissionRuntime(roomCode);
    store.clearActiveMission(roomCode);
    const room = rooms.get(roomCode);
    if (room) for (const p of room.values()) {
      p.activeMissionId = null;
      p.mission = '교사의 다음 미션을 기다리는 중';
      p.missionStatus = 'assigned';
    }
    io.to(`class:${roomCode}`).emit('missionCleared');
    io.to(`teacher:${roomCode}`).emit('teacherMissionChanged', { mission: null });
    ack({ ok: true, classGameMinutes: stoppedAtMinutes });
  });

  socket.on('teacherSetPaused', (payload, ack = () => {}) => {
    const roomCode = teachers.get(socket.id);
    if (!roomCode) return ack({ ok: false, error: '교사 인증이 필요합니다.' });
    const clock = clockForRoom(roomCode);
    if (clock.ownerSocketId !== socket.id) return ack({ ok:false, error:'이 교사 화면은 현재 반 시간의 기준 화면이 아닙니다.' });
    const reported = Number(payload?.gameMinutes);
    if (Number.isFinite(reported)) syncTeacherClock(roomCode, socket.id, reported);
    const paused = payload?.paused === true;
    const currentMinutes = freezeClassClock(roomCode);
    const settings = store.setRoomSettings(roomCode, { paused });
    clock.baseGameMinutes = currentMinutes;
    clock.baseServerMs = Date.now();
    clock.lastTeacherSyncAt = Date.now();
    if (paused) {
      const room = rooms.get(roomCode);
      if (room) for (const p of room.values()) stopPlayer(p);
    }
    io.to(`class:${roomCode}`).emit('classControl', settings);
    ack({ ok: true, settings, classGameMinutes: currentMinutes });
  });

  socket.on('teacherSetLocked', (payload, ack = () => {}) => {
    const roomCode = teachers.get(socket.id);
    if (!roomCode) return ack({ ok: false, error: '교사 인증이 필요합니다.' });
    const settings = store.setRoomSettings(roomCode, { locked: payload?.locked === true });
    io.to(`class:${roomCode}`).emit('classControl', settings);
    ack({ ok: true, settings });
  });

  socket.on('createRoom', (payload, ack = () => {}) => {
    try {
      const roomType = payload?.roomType === 'free' ? 'free' : 'race';
      const roomCode = generateClassCode();
      const hostToken = crypto.randomBytes(18).toString('base64url');
      const roomState = store.room(roomCode);
      roomState.host = { tokenHash: hashHostToken(hostToken), createdAt: Date.now(), lastActiveAt: Date.now() };
      const cleanSettings = store.setRoomSettings(roomCode, { paused:false, locked:false, roomType, started:false });
      becomeHost(socket, roomCode);
      const classMinutes = roomType === 'race' ? claimTeacherClock(roomCode, socket.id) : classGameMinutes(roomCode);
      ack({ ok:true, roomCode, hostToken, roomType, classGameMinutes:classMinutes, clockRateHoursPerSecond:GAME_HOURS_PER_REAL_SECOND, mission:null, progress:[], settings:cleanSettings });
    } catch (error) {
      ack({ ok:false, error:error.message || '방을 만들지 못했습니다.' });
    }
  });

  socket.on('hostStartFree', (_payload, ack = () => {}) => {
    const roomCode = teachers.get(socket.id);
    if (!roomCode) return ack({ ok:false, error:'방장만 출발시킬 수 있습니다.' });
    const roomState = store.room(roomCode);
    if (roomState.settings.roomType !== 'free') return ack({ ok:false, error:'자유 항해 방이 아닙니다.' });
    if (roomState.settings.started) return ack({ ok:true, settings:roomState.settings });
    clockForRoom(roomCode).baseServerMs = Date.now();
    const settings = store.setRoomSettings(roomCode, { started:true });
    const room = rooms.get(roomCode);
    if (room) for (const p of room.values()) {
      p.mission = '자유 항해';
      setNotice(p, '출발! 자유롭게 항해하세요.');
    }
    touchRoom(roomCode);
    io.to(`class:${roomCode}`).emit('classControl', settings);
    ack({ ok:true, settings });
  });

  socket.on('teacherJoin', (payload, ack = () => {}) => {
    const roomCode = cleanRoom(payload?.roomCode);
    if (!isValidClassCode(roomCode) || !isRoomHost(roomCode, payload?.hostToken)) return ack({ ok:false, error:'방을 만든 사람만 현황판을 열 수 있습니다.' });
    becomeHost(socket, roomCode);
    const cleanSettings = store.setRoomSettings(roomCode, { paused: false, locked: false });
    io.to(`class:${roomCode}`).emit('classControl', cleanSettings);
    const classMinutes = claimTeacherClock(roomCode, socket.id);
    const activeMission = store.room(roomCode).activeMission;
    ack({ ok: true, roomCode, classGameMinutes: classMinutes, clockRateHoursPerSecond: GAME_HOURS_PER_REAL_SECOND, mission: missionForTeacher(activeMission), progress: missionProgressList(roomCode, activeMission?.id), settings: cleanSettings });
  });

  socket.on('teacherClockSync', (payload, ack = () => {}) => {
    const roomCode = teachers.get(socket.id);
    if (!roomCode) return ack({ ok:false, error:'교사 인증이 필요합니다.' });
    const synced = syncTeacherClock(roomCode, socket.id, payload?.gameMinutes);
    if (synced == null) return ack({ ok:false, error:'반 시간 동기화 권한이 없습니다.' });
    ack({ ok:true, classGameMinutes:synced });
  });

  socket.on('disconnect', () => {
    const player = playerForSocket(socket);
    if (player?.resumeToken) {
      stopPlayer(player);
      disconnectedVoyagers.set(player.resumeToken, {player, host:teachers.get(socket.id) === player.roomCode, expiresAt:Date.now() + VOYAGER_RESUME_MS});
    }
    removePlayer(socket);
    releaseTeacherClock(socket.id);
    teachers.delete(socket.id);
  });
});

function missionModeMatches(mission, playerMode) {
  return mission.mode === 'any' || mission.mode === playerMode;
}

function updateMissionProgress(roomCode, p) {
  const { activeMission, mission, progress } = missionContext(roomCode, p.name, true);
  if (!activeMission || !mission || !progress) return;
  if (p.activeMissionId !== activeMission.id) {
    p.activeMissionId = activeMission.id;
    p.mission = mission.title;
  }
  p.missionStatus = progress.status;
  if (progress.status === 'completed') return;

  if (isArrivalRace(activeMission)) {
    if (!progress.selectedStartPlaceId) {
      p.mission = '출발 도시 4곳 중 한 곳 선택';
      return;
    }
    if (activeMission.phase !== 'running') {
      p.mission = '교사 출발 신호 대기';
      return;
    }
    const target = activeMission.targetPlace;
    p.mission = `${target.name} 도착`;
    const resolvedTarget = RESOLVED_PLACES.get(target.id);
    const arrived = resolvedTarget?.isOriginalCity
      ? arrivedAtOriginalCity(p, resolvedTarget)
      : ArrivalZones.containsPlayer(
          p,
          resolvedTarget,
          ARRIVAL_ZONES[target.id] || null,
          { worldPixelWidth: WORLD_PIXEL_W, worldPixelHeight: WORLD_PIXEL_H, tile: TILE }
        );
    if (activeMission.hunt) {
      // 동물 경주는 지점에 닿는 것만으로는 안 되고, 동물을 찾아 만나야 한다.
      const state = huntStateFor(roomCode, p.name, seaAnimalById(activeMission.hunt.animalId));
      if (state?.met) beginFinalQuiz(roomCode, p, activeMission, progress);
      return;
    }
    if (arrived) beginFinalQuiz(roomCode, p, activeMission, progress);
    return;
  }

  if (mission.kind === 'staged') {
    const stage = currentMissionStage(mission, progress);
    if (!stage) return completeMission(roomCode, p, mission, progress, '모든 단계 완료');
    p.mission = `${mission.title} · ${stage.label}`;
    const inMode = stage.mode === 'any' || stage.mode === p.mode;
    const distanceTiles = inMode ? distanceXY(p.x, p.y, stage.point.x, stage.point.y) / TILE : Infinity;
    const arrivalRadius = Math.max(stage.radiusTiles || 2.5, stage.arrivalRadiusTiles || stage.radiusTiles || 2.5);
    const arrivalKey = `${mission.id}:${progress.stageIndex}`;
    if (distanceTiles <= arrivalRadius && p.stageArrivalKey !== arrivalKey) {
      p.stageArrivalKey = arrivalKey;
      setNotice(p, `${stage.placeName}에 도착했습니다.`);
    }
    if (!stage.actionRequired && distanceTiles <= (stage.radiusTiles || arrivalRadius)) {
      advanceStagedMission(roomCode, p, mission, progress, stage, `${stage.placeName} 도착`);
    }
    return;
  }

  if (mission.kind === 'location') {
    if (!mission.target || !missionModeMatches(mission, p.mode)) return;
    if (distanceXY(p.x, p.y, mission.target.x, mission.target.y) <= mission.target.radiusTiles * TILE) {
      completeMission(roomCode, p, mission, progress, `${mission.target.label} 도착`);
    }
    return;
  }

  const runtime = runtimeProgressFor(roomCode, p.name, activeMission.id, false);
  if (!runtime) return;

  if (mission.kind === 'terrain') {
    const terrainType = mission.criteria?.terrainType;
    const required = mission.criteria?.minDistanceTiles || 1;
    const current = runtime.terrainDistanceTiles[terrainType] || 0;
    if (current >= required) completeMission(roomCode, p, mission, progress, `${Terrain.LABEL[terrainType] || terrainType} 조사`);
    return;
  }

  if (mission.kind === 'exploration') {
    if (mission.criteria?.requireReturnToCity && runtime.started && p.mode === 'city') runtime.returnCompleted = true;
    const distanceOk = runtime.distanceTiles >= (mission.criteria?.minDistanceTiles || 1);
    const terrainTypes = [...runtime.visitedTerrains].filter((t) => t !== 'sea' || mission.mode !== 'land');
    const terrainOk = terrainTypes.length >= (mission.criteria?.minTerrainTypes || 1);
    const returnOk = !mission.criteria?.requireReturnToCity || runtime.returnCompleted;
    if (distanceOk && terrainOk && returnOk) completeMission(roomCode, p, mission, progress, '자유 탐험 완료');
  }
}

function moveWithTerrainCollision(p, deltaX, deltaY) {
  const seasonDay = p.mode === 'sea' ? seasonDayFor(p) : null;
  const here = terrainAtPixel(p.x, p.y);
  // 얼음이 자라 배를 덮었거나, 얼음 위에 올라선 때. 이때는 적도 쪽으로 빠져나가는 길을 늘 열어 둔다.
  // 그러지 않으면 계절이 바뀌는 순간 그 자리에 영영 갇힌다.
  const trapped = p.mode === 'sea'
    ? here.type !== 'sea' || (seasonDay !== null && seasonalIceAt(p.x, p.y, seasonDay) !== null)
    : here.type === 'sea' || here.passable === false;
  const hereLat = 90 - (p.y / WORLD_PIXEL_H) * 180;
  const maxSubstep = TILE * 0.45;
  const substeps = Math.max(1, Math.ceil(Math.max(Math.abs(deltaX), Math.abs(deltaY)) / maxSubstep));
  const stepX = deltaX / substeps;
  const stepY = deltaY / substeps;
  let moved = false;
  let blockedTerrain = null;

  for (let i = 0; i < substeps; i += 1) {
    const ox = p.x;
    const oy = p.y;
    const candidates = [[ox + stepX, oy + stepY]];
    if (Math.abs(stepX) > 0.001 && Math.abs(stepY) > 0.001) {
      candidates.push([ox + stepX, oy], [ox, oy + stepY]);
    }
    let advanced = false;
    for (const [rawX, rawY] of candidates) {
      const nx = wrapX(rawX);
      const ny = Math.max(TILE, Math.min(WORLD_PIXEL_H - TILE, rawY));
      const nextTerrain = terrainAtPixel(nx, ny);
      const frozenAhead = seasonDay !== null && seasonalIceAt(nx, ny, seasonDay) !== null;
      const allowed = ShipMotion.canEnter({
        mode: p.mode,
        nextType: nextTerrain.type,
        nextPassable: nextTerrain.passable,
        frozenAhead,
        trapped,
        hereLat,
        nextLat: 90 - (ny / WORLD_PIXEL_H) * 180
      });
      if (!allowed) {
        if (frozenAhead && nextTerrain.type === 'sea') blockedTerrain = { type: 'seasonIce', season: true };
        blockedTerrain = blockedTerrain || nextTerrain;
        continue;
      }
      p.x = nx;
      p.y = ny;
      p.terrain = p.mode === 'sea' ? (nextTerrain.type === 'ice' || frozenAhead ? 'ice' : 'sea') : nextTerrain.type;
      moved = true;
      advanced = true;
      break;
    }
    if (!advanced) break;
  }

  return { moved, blockedTerrain };
}

function movePlayer(p, dt) {
  if (store.room(p.roomCode).settings.paused || p.transition) { p.moving = false; p.speedKmh = 0; return; }
  const travel = arrivalRaceTravelGate(p);
  if (!travel.ok) { p.moving = false; stopPlayer(p); return; }
  if (p.mode !== 'sea' && p.mode !== 'land') {
    p.moving = false;
    p.speedKmh = 0;
    return;
  }

  let vx = (p.input.right ? 1 : 0) - (p.input.left ? 1 : 0);
  let vy = (p.input.down ? 1 : 0) - (p.input.up ? 1 : 0);
  let targetDistance = Infinity;

  if (p.target) {
    const targetMotion = GeoMotion.initialDirection(
      p.x, p.y, p.target.x, p.target.y, WORLD_PIXEL_W, WORLD_PIXEL_H
    );
    targetDistance = targetMotion.distancePixels;
    if (targetDistance < (p.route && p.route.length ? TILE * 1.2 : 4)) {
      p.target = p.route && p.route.length ? p.route.shift() : null;
      if (!p.target) {
        p.route = null;
        p.moving = false;
        p.speedKmh = 0;
        return;
      }
      const nextMotion = GeoMotion.initialDirection(p.x, p.y, p.target.x, p.target.y, WORLD_PIXEL_W, WORLD_PIXEL_H);
      targetDistance = nextMotion.distancePixels;
      vx = nextMotion.x;
      vy = nextMotion.y;
    } else {
      vx = targetMotion.x;
      vy = targetMotion.y;
    }
  }

  const len = Math.hypot(vx, vy);
  if (!len) {
    p.moving = false;
    p.speedKmh = 0;
    p.terrain = p.mode === 'sea' ? 'sea' : terrainAtPixel(p.x, p.y).type;
    return;
  }

  vx /= len;
  vy /= len;
  const currentTerrain = terrainAtPixel(p.x, p.y);
  p.terrain = p.mode === 'sea' ? (currentTerrain.type === 'ice' ? 'ice' : 'sea') : currentTerrain.type;
  // 얼음 가장자리에서는 벽처럼 딱 멈추지 않고 5도 앞에서부터 천천히 느려진다.
  const multiplier = (p.mode === 'sea' ? TERRAIN_SPEED.sea : currentTerrain.multiplier) * iceSlowdownFor(p);
  const baseSpeed = p.mode === 'sea' ? SEA_BASE_SPEED : LAND_BASE_SPEED;
  const fatigueMultiplier = Fatigue.speedMultiplier(p.fatigue);
  const completionMultiplier = travel.completed ? CompletionRewards.speedMultiplier(travel.progress?.finishRank) : 1;
  const ox = p.x;
  const oy = p.y;
  let windMultiplier = 1;
  if (p.mode === 'sea') {
    const wind = MajorWind.windAtPixel(ox, oy, classGameMinutes(p.roomCode));
    const windAlignment = vx * wind.x + vy * wind.y;
    windMultiplier = MajorWind.speedMultiplier(windAlignment, wind.strength, WIND_TAIL_FACTOR, WIND_HEAD_FACTOR);
    p.windName = wind.name;
    p.windStrength = wind.strength;
    p.windAssistPercent = MajorWind.assistPercent(windAlignment, wind.strength, WIND_TAIL_FACTOR, WIND_HEAD_FACTOR);
  }
  const step = Math.min(baseSpeed * multiplier * fatigueMultiplier * completionMultiplier * windMultiplier * dt, targetDistance);
  let driftEast = 0;
  let driftSouth = 0;
  if (p.mode === 'sea') {
    const current = OceanCurrent.currentAtPixel(ox, oy);
    const alignment = vx * current.x + vy * current.y;
    const localTailFactor = Number.isFinite(current.tailFactor) ? current.tailFactor : CURRENT_TAIL_FACTOR;
    const factor = OceanCurrent.movementFactor(alignment, localTailFactor, CURRENT_HEAD_FACTOR, CURRENT_CROSS_FACTOR);
    const driftSpeed = SEA_BASE_SPEED * factor * current.strength * completionMultiplier;
    driftEast = current.x * driftSpeed * dt;
    driftSouth = current.y * driftSpeed * dt;
    p.currentName = current.name;
    p.currentStrength = current.strength;
    p.currentAssistPercent = Math.round(factor * current.strength * alignment * 100);
    p.currentCore = current.coreBlend >= 0.5;
  }
  const mapDelta = GeoMotion.localDeltaToMap(
    vx * step + driftEast,
    vy * step + driftSouth,
    oy,
    WORLD_PIXEL_H
  );
  let { moved, blockedTerrain } = moveWithTerrainCollision(p, mapDelta.x, mapDelta.y);

  // 해안에 막히면 해안선을 따라 돈다. 예전에는 "목적지에 가까워질 때만" 비껴 갔는데,
  // 만 안쪽이나 섬 사이처럼 한동안 멀어져야 빠져나오는 곳에서 배가 얼어붙었다.
  // 이제는 한쪽 방향을 정해 벽을 따라 계속 돌고, 너무 오래 돌면 길을 다시 찾는다.
  // 손으로 몰 때도 똑같이 비껴 간다. 그러지 않으면 좁은 만이나 얼음 앞에서 뱃머리가 박힌 채
  // 아무 데로도 못 가고, 아이들은 배가 고장 난 줄 안다.
  if (!moved) {
    const distanceToTarget = () => (p.target ? GeoMotion.initialDirection(p.x, p.y, p.target.x, p.target.y, WORLD_PIXEL_W, WORLD_PIXEL_H).distancePixels : 0);
    const before = distanceToTarget();
    const angles = ShipMotion.slideAngles(p.slideSign);
    for (const angle of angles) {
      const startX = p.x;
      const startY = p.y;
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      const slideDelta = GeoMotion.localDeltaToMap(
        (vx * cos - vy * sin) * step,
        (vx * sin + vy * cos) * step,
        oy,
        WORLD_PIXEL_H
      );
      const slide = moveWithTerrainCollision(p, slideDelta.x, slideDelta.y);
      blockedTerrain = slide.blockedTerrain || blockedTerrain;
      if (slide.moved) {
        moved = true;
        p.slideSign = angle >= 0 ? 1 : -1;
        if (p.target && distanceToTarget() >= before - 0.05) p.slideAwayMs = (p.slideAwayMs || 0) + dt * 1000;
        else p.slideAwayMs = 0;
        break;
      }
      p.x = startX;
      p.y = startY;
    }
  } else if (moved) {
    p.slideAwayMs = 0;
  }
  if (moved && !blockedTerrain) p.slideSign = 0;

  // 뭍에 옆으로 막힌 배는 제자리에서 떨면서도 "움직였다"가 된다.
  // 그래서 얼마나 움직였나가 아니라 목적지에 가까워졌나로 막힘을 잰다.
  if (p.target) {
    const now = GeoMotion.initialDirection(p.x, p.y, p.target.x, p.target.y, WORLD_PIXEL_W, WORLD_PIXEL_H).distancePixels;
    if (!Number.isFinite(p.bestDistance) || now < p.bestDistance - 2) {
      p.bestDistance = now;
      p.lastProgressAt = Date.now();
    } else if (!p.lastProgressAt) {
      p.lastProgressAt = Date.now();
    }
  } else {
    p.bestDistance = Infinity;
    p.lastProgressAt = 0;
  }

  // 길을 따라가다 막혔을 때. 바닷길 격자는 두 칸을 한 덩이로 보기 때문에,
  // 좁은 곳에서는 격자로는 지날 수 있어도 실제로는 닿을 수 없는 지점이 나온다.
  // 그 자리에서 배를 얼려 두면 안 되므로 다음 지점으로 건너뛰고,
  // 그래도 계속 막히면 길을 버려 학생이 손으로 몰 수 있게 놓아 준다.
  // 벽을 20초 넘게 따라 돌면 그 지점은 포기하고 다음 지점을 본다.
  if (moved && (p.slideAwayMs || 0) > 20000) {
    p.slideAwayMs = 0;
    if (p.route && p.route.length) p.target = p.route.shift();
    else if (Date.now() - (p.lastRoutePlanAt || 0) > 3000) { p.lastRoutePlanAt = Date.now(); planRoute(p, p.target); }
  }

  if (p.target && p.lastProgressAt && Date.now() - p.lastProgressAt > 1500) {
    p.lastProgressAt = Date.now();
    p.bestDistance = Infinity;
    if (p.route && p.route.length) {
      // 이 지점은 실제로는 닿을 수 없는 자리다. 다음 지점을 본다.
      p.skippedWaypoints = (p.skippedWaypoints || 0) + 1;
      p.target = p.route.shift();
      if (p.skippedWaypoints > 8) {
        // 계속 못 나아가면 지금 자리에서 길을 새로 찾는다.
        p.skippedWaypoints = 0;
        const destination = p.route.length ? p.route[p.route.length - 1] : p.target;
        if (Date.now() - (p.lastRoutePlanAt || 0) > 2000) {
          p.lastRoutePlanAt = Date.now();
          planRoute(p, destination);
        }
      }
    } else if (Date.now() - (p.lastRoutePlanAt || 0) > 2000) {
      // 길 없이 곧장 가다 막힌 것이니 한 번 길을 찾아 본다.
      p.lastRoutePlanAt = Date.now();
      planRoute(p, p.target);
    } else {
      stopPlayer(p);
    }
    return;
  }

  if (!moved) {
    p.speedKmh = 0;
    if (p.target) { p.target = null; p.route = null; }
    if (blockedTerrain?.type === 'seasonIce') setNotice(p, '얼음 바다 - 항해가 어려움');
    else if (blockedTerrain?.type === 'ice') setNotice(p, p.mode === 'sea' ? '얼음 바다 - 항해가 어려움' : '얼음 지대 - 이동이 어려움');
    else if (p.mode === 'land' && blockedTerrain?.type === 'sea') setNotice(p, '탐험대는 바다를 건널 수 없습니다. 항구로 돌아가 배를 이용하세요.');
    else if (p.mode === 'sea' && blockedTerrain?.type !== 'sea') setNotice(p, '육지입니다. 가까운 항구를 통해 입항하세요.');
  }

  p.moving = moved;
  if (moved) {
    p.dir = vectorToDir(vx, vy);
    const movedPixels = distanceXY(ox, oy, p.x, p.y);
    const movedKm = GeoMotion.greatCircleDistanceKm(ox, oy, p.x, p.y, WORLD_PIXEL_W, WORLD_PIXEL_H);
    const elapsedGameHours = (dt / SIMULATION_RATE) * GAME_HOURS_PER_REAL_SECOND;
    const instantSpeedKmh = movedKm / Math.max(1e-9, elapsedGameHours);
    const previousSpeedKmh = Number(p.speedKmh) || 0;
    p.speedKmh = previousSpeedKmh > 0
      ? previousSpeedKmh * 0.55 + instantSpeedKmh * 0.45
      : instantSpeedKmh;
    recordMovement(p, movedPixels);
    if (p.mode === 'sea') warnNearIce(p);
  }
}

// 계절에 따라 얼었다 녹는 바다. 여름에는 스발바르 앞바다(북위 80도)까지 열리고, 겨울에는 베링 해협까지 언다.
// 지형(terrain)에 박아 둔 얼음은 한여름에도 얼어 있는 곳이라, 그 사이 바다를 여기서 날짜로 가른다.
function seasonDayFor(p) {
  return Terrain.dayOfYear(classGameMinutes(p.roomCode));
}

function seasonalIceAt(x, y, day) {
  const lat = 90 - (y / WORLD_PIXEL_H) * 180;
  const lon = (wrapX(x) / WORLD_PIXEL_W) * 360 - 180;
  return Terrain.isIceAtDay(lon, lat, true, day) ? lat : null;
}

// 얼음 가장자리 앞 5도에서는 떠다니는 얼음 때문에 배가 느려진다.
function iceSlowdownFor(p) {
  const lat = 90 - (p.y / WORLD_PIXEL_H) * 180;
  const lon = (wrapX(p.x) / WORLD_PIXEL_W) * 360 - 180;
  return Terrain.iceSlowdownAt(lon, lat, p.mode === 'sea', seasonDayFor(p));
}

// 얼음 바다 앞에서 미리 알린다. 막힌 뒤에야 알면 아이들은 왜 멈췄는지 모른다.
function warnNearIce(p) {
  const lat = 90 - (p.y / WORLD_PIXEL_H) * 180;
  const lon = (wrapX(p.x) / WORLD_PIXEL_W) * 360 - 180;
  const day = seasonDayFor(p);
  const north = Terrain.iceLimitNorthAt(lon, day);
  const south = Terrain.iceLimitSouthAt(lon, day);
  if (lat >= north) setNotice(p, '얼음 바다 - 항해가 어려움');
  else if (lat <= south) setNotice(p, '얼음 바다 - 항해가 어려움');
  else if (lat >= north - Terrain.ICE_SLOW.degrees) setNotice(p, '얼음 바다 - 항해가 어려움');
  else if (lat <= south + Terrain.ICE_SLOW.degrees) setNotice(p, '얼음 바다 - 항해가 어려움');
}

setInterval(() => {
  const dt = SIMULATION_RATE / TICK_HZ;
  for (const [roomCode, room] of rooms) {
    const classMinutes = classGameMinutes(roomCode);
    const mission = store.room(roomCode).activeMission;
    const huntAnimal = isArrivalRace(mission) && mission.hunt ? seaAnimalById(mission.hunt.animalId) : null;
    for (const p of room.values()) {
      updateTimedTransition(p, classMinutes);
      movePlayer(p, dt);
      updateFatigue(p, dt);
      // 동물은 참가자마다 따로 있고, 시계가 멈춰 있으면 함께 쉰다.
      if (huntAnimal && roomClockShouldRun(roomCode)) moveSeaAnimal(huntStateFor(roomCode, p.name, huntAnimal), huntAnimal, dt, p);
      updateMissionProgress(roomCode, p);
    }
  }
}, 1000 / TICK_HZ).unref();

setInterval(() => {
  const now = Date.now();
  for (const [roomCode, room] of rooms) {
    const classMinutes = classGameMinutes(roomCode, now);
    const freeRoom = isFreeRoom(roomCode);
    for (const p of room.values()) {
      const nearby = [];
      for (const other of room.values()) {
        if (other.id === p.id) continue;
        if (freeRoom || distance(p, other) <= NEARBY_RADIUS) nearby.push(publicPlayer(other, classMinutes));
      }
      const missionState = activeMissionState(roomCode, p.name, p);
      io.to(p.id).emit('snapshot', { serverTime: now, classGameMinutes: classMinutes, sessionMode:'competition', roomType: freeRoom ? 'free' : 'race', roomLabel:`방 ${roomCode}`, you: publicPlayer(p, classMinutes), nearby, online: room.size, settings: store.room(roomCode).settings, ...missionState });
    }
    {
      const activeMission = store.room(roomCode).activeMission;
      io.to(`teacher:${roomCode}`).emit('teacherSnapshot', { serverTime: now, classGameMinutes: classMinutes, roomCode, players: [...room.values()].map((p) => publicPlayer(p, classMinutes)), mission: missionForTeacher(activeMission), progress: missionProgressList(roomCode, activeMission?.id), settings: store.room(roomCode).settings });
    }
  }
}, 1000 / SNAPSHOT_HZ).unref();

setInterval(() => store.saveNow(), 5000).unref();

setTimeout(() => {
  const startedAt = Date.now();
  navGridReady();
  console.log(`항로 격자 준비 완료 (${Date.now() - startedAt}ms)`);
}, 50).unref();

server.listen(PORT, '127.0.0.1', () => {
  console.log(`CDS95 실시간 학습 서버 v76 · 지역사·특별 도시사 도서관: http://localhost:${PORT}`);
  console.log(`교사 관찰 화면: http://localhost:${PORT}/teacher.html`);
});
