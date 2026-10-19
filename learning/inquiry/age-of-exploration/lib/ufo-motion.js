'use strict';

const Terrain = require('../public/js/terrain.js');
const GeoMotion = require('../public/js/geo-motion.js');
const { WORLD_PIXEL_W: WIDTH, WORLD_PIXEL_H: HEIGHT, TILE } = Terrain;

// Keep north-up at both poles: stop at the existing map edge rather than
// reflecting latitude and jumping longitude by 180 degrees.
function advance(position, deltaX, deltaY) {
  const x = Terrain.wrapPixelX(position.x + deltaX);
  const y = Math.max(TILE, Math.min(HEIGHT - TILE, position.y + deltaY));
  return { x, y, moved: Math.abs(x - position.x) > 1e-9 || Math.abs(y - position.y) > 1e-9 };
}

// A great-circle route between opposite polar longitudes can cross the pole.
// Follow a bounded map direction instead, so a click never gets stuck at that edge.
function direction(position, target) {
  let dx = Terrain.wrapPixelX(target.x) - Terrain.wrapPixelX(position.x);
  if (dx > WIDTH / 2) dx -= WIDTH;
  if (dx < -WIDTH / 2) dx += WIDTH;
  const east = dx * GeoMotion.longitudeScaleAtY(position.y, HEIGHT);
  const south = Math.max(TILE, Math.min(HEIGHT - TILE, target.y)) - position.y;
  const distancePixels = Math.hypot(east, south);
  return {
    x: distancePixels ? east / distancePixels : 0,
    y: distancePixels ? south / distancePixels : 0,
    distancePixels
  };
}

module.exports = { advance, direction };
