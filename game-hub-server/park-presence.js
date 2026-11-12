"use strict";
const { createMuseumPresence } = require("./museum-presence");
const PARK_ZONE_OBSTACLES = [
  {x:9,z:-17.75,r:2.94},{x:-7.5,z:-19.5,r:2.94},{x:19.375,z:-6.875,r:2.94},{x:-19.375,z:-6.875,r:2.94},
  {x:0,z:-21.25,r:2.94},{x:0,z:50,hx:12.52,hz:22.67},{x:52,z:0,r:13.68},{x:0,z:14,r:2.94},{x:0,z:-13.75,r:2.94}
];

function safeParkPosition(x, z) {
  let nextX = Number.isFinite(x) ? x : 0, nextZ = Number.isFinite(z) ? z : 0;
  const radius = Math.hypot(nextX, nextZ);
  if (radius > 85) { const scale = 85 / radius; nextX *= scale; nextZ *= scale; }
  for (const obstacle of PARK_ZONE_OBSTACLES) {
    const dx = nextX - obstacle.x, dz = nextZ - obstacle.z;
    if (obstacle.hx != null) {
      if (Math.abs(dx) < obstacle.hx && Math.abs(dz) < obstacle.hz) {
        const pushX = obstacle.hx - Math.abs(dx), pushZ = obstacle.hz - Math.abs(dz);
        if (pushX < pushZ) nextX = obstacle.x + (Math.sign(dx) || 1) * obstacle.hx;
        else nextZ = obstacle.z + (Math.sign(dz) || 1) * obstacle.hz;
      }
      continue;
    }
    const d = Math.hypot(dx, dz);
    if (d < obstacle.r) { nextX = obstacle.x + (d ? dx / d : 1) * obstacle.r; nextZ = obstacle.z + (d ? dz / d : 0) * obstacle.r; }
  }
  return { x: nextX, z: nextZ };
}

function createParkPresence(options) { return createMuseumPresence({...options,prefix:"PARK",initialRoom:"park",roomIds:["park"],constrainPosition:safeParkPosition,spawnZ:6.5}); }
module.exports = {createParkPresence,safeParkPosition};
