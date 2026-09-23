'use strict';
const GeoMotion = require('../public/js/geo-motion.js');
const { createRegionAccess } = require('./discovery-regions.js');

// A bounded flood fill identifies the actual lake, not every blue pixel in a box.
// Built once per discovery; movement and snapshots only inspect its shore points.
function waterbodyArea(area, terrainAtCell, terrain) {
  const { WORLD_W: width, WORLD_H: height, TILE: tile } = terrain;
  const cell = ([lat, lon]) => ({ x: Math.floor((lon + 180) / 360 * width), y: Math.floor((90 - lat) / 180 * height) });
  const nw = cell([area.bounds.north, area.bounds.west]);
  const se = cell([area.bounds.south, area.bounds.east]);
  const seed = cell(area.seed);
  const inside = (x, y) => x >= nw.x && x <= se.x && y >= nw.y && y <= se.y;
  const water = new Set(), queue = [], shore = [];
  if (!inside(seed.x, seed.y) || terrainAtCell(seed.x, seed.y).type !== 'sea') {
    throw new Error('Waterbody discovery seed must be water inside its bounds');
  }
  const key = (x, y) => y * width + x;
  water.add(key(seed.x, seed.y)); queue.push(seed);
  for (let i = 0; i < queue.length; i++) {
    const point = queue[i];
    let coastal = false;
    for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
      const x = point.x + dx, y = point.y + dy;
      if (terrainAtCell(x, y).type !== 'sea') { coastal = true; continue; }
      if (!inside(x, y) || water.has(key(x, y))) continue;
      water.add(key(x, y)); queue.push({ x, y });
    }
    if (coastal) shore.push({ x: (point.x + 0.5) * tile, y: (point.y + 0.5) * tile });
  }
  return { water, shore, bounds: { left: nw.x * tile, right: (se.x + 1) * tile, top: nw.y * tile, bottom: (se.y + 1) * tile } };
}

function createDiscoveryAccess(items, terrainAtCell, terrain, radiusTiles) {
  const areas = new Map();
  const radius = radiusTiles * terrain.TILE;
  for (const item of items) {
    if (item.discoveryArea?.type === 'waterbody') areas.set(item.id, waterbodyArea(item.discoveryArea, terrainAtCell, terrain));
    if (item.discoveryArea?.type === 'region') areas.set(item.id, createRegionAccess(item.id, terrainAtCell, terrain, radius));
  }
  const distance = (a, b) => GeoMotion.greatCircleDistancePixels(a.x, a.y, b.x, b.y, terrain.WORLD_PIXEL_W, terrain.WORLD_PIXEL_H);
  return function proximity(player, item) {
    if (!player || player.transition || !['land', 'sea'].includes(player.mode)) return { distance: Infinity, canUse: false };
    const area = areas.get(item.id);
    const canUse = item.reach === 'any' || item.reach === player.mode;
    if (!area) return { distance: distance(player, item), canUse };
    if (typeof area === 'function') return area(player, canUse);
    // Allow an existing local boat to inspect the lake; land parties use its shores.
    const cellId = Math.floor(player.y / terrain.TILE) * terrain.WORLD_W + Math.floor(player.x / terrain.TILE);
    if (player.mode === 'sea' && area.water.has(cellId)) return { distance: 0, canUse, markerPoint: { x: player.x, y: player.y } };
    const padX = radius / GeoMotion.MIN_LONGITUDE_SCALE;
    if (player.x < area.bounds.left - padX || player.x > area.bounds.right + padX || player.y < area.bounds.top - radius || player.y > area.bounds.bottom + radius) {
      return { distance: Infinity, canUse };
    }
    let closest = null, nearest = Infinity;
    for (const point of area.shore) {
      const d = distance(player, point);
      if (d < nearest) { nearest = d; closest = point; }
    }
    return { distance: nearest, canUse, markerPoint: closest };
  };
}

module.exports = { createDiscoveryAccess };
