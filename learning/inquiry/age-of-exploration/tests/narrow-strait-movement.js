'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const vm = require('node:vm');

// Load the real server functions with isolated storage and inert timers/listener.
// Route planning, wind, currents and collision code are not reimplemented here.
const project = path.resolve(__dirname, '..');
const filename = path.join(project, 'server.js');
const previousDataDir = process.env.DATA_DIR;
process.env.DATA_DIR = fs.mkdtempSync(path.join(require('node:os').tmpdir(), 'voyage-straits-'));
const source = fs.readFileSync(filename, 'utf8');
const context = {
  require: Module.createRequire(filename), __dirname: project, __filename: filename,
  process, console, Buffer, URL,
  setInterval: () => ({ unref() {} }), setTimeout: () => ({ unref() {} }),
  clearInterval() {}, clearTimeout() {},
};
vm.createContext(context);
vm.runInContext(source.slice(0, source.lastIndexOf('server.listen(')) + `
  globalThis.testApi = { movePlayer, planRoute, moveWithTerrainCollision, distanceXY,
    terrainAtPixel, store, TILE, WORLD_PIXEL_W, WORLD_PIXEL_H };
`, context, { filename });
if (previousDataDir === undefined) delete process.env.DATA_DIR;
else process.env.DATA_DIR = previousDataDir;
const api = context.testApi;
Object.assign(api.store.room('9999').settings, { roomType: 'free', started: true, paused: false });
const pixel = ([lat, lon]) => ({ x: (lon + 180) / 360 * api.WORLD_PIXEL_W, y: (90 - lat) / 180 * api.WORLD_PIXEL_H });
const player = point => ({ ...pixel(point), roomCode: '9999', name: 'strait test',
  mode: 'sea', input: {}, fatigue: 0, speedKmh: 0, noticeSeq: 0, transition: null });

const passages = [
  { name: 'bangka', ends: [[-2.232, 105.480], [-3.096, 106.344]],
    bottleneck: [[-2.520, 105.768], [-2.808, 105.912]],
    bounds: [105.1, 106.6, -3.3, -2.0] },
  { name: 'kanmon', ends: [[34.152, 130.680], [33.864, 131.256]],
    bottleneck: [[33.99, 130.89], [33.94, 131.04]],
    bounds: [130.5, 131.5, 33.7, 34.3] },
];
const results = [];
for (const passage of passages) {
  for (const reverse of [false, true]) {
    const [start, end] = reverse ? [...passage.ends].reverse() : passage.ends;
    const p = player(start), goal = pixel(end);
    assert.equal(api.terrainAtPixel(p.x, p.y).type, 'sea', passage.name + ' entrance');
    assert.equal(api.terrainAtPixel(goal.x, goal.y).type, 'sea', passage.name + ' exit');
    api.planRoute(p, goal);
    let ticks = 0;
    for (; ticks < 600 && api.distanceXY(p.x, p.y, goal.x, goal.y) >= 4; ticks++) {
      api.movePlayer(p, 0.1);
      assert.equal(api.terrainAtPixel(p.x, p.y).type, 'sea', passage.name + ' must not cross land');
      const lon = p.x / api.WORLD_PIXEL_W * 360 - 180, lat = 90 - p.y / api.WORLD_PIXEL_H * 180;
      const [west, east, south, north] = passage.bounds;
      assert.ok(lon >= west && lon <= east && lat >= south && lat <= north,
        passage.name + ' must use the strait, not sail around the island');
    }
    assert.ok(ticks < 600, passage.name + ' movement stuck, reverse=' + reverse + JSON.stringify({x:p.x,y:p.y,target:p.target,route:p.route}));
    // Directional steering must also cross the narrowest section without route planning.
    const points = reverse ? [...passage.bottleneck].reverse() : passage.bottleneck;
    const manual = player(points[0]), finish = pixel(points[1]);
    assert.equal(api.terrainAtPixel(manual.x, manual.y).type, 'sea', passage.name + ' steering start');
    assert.equal(api.terrainAtPixel(finish.x, finish.y).type, 'sea', passage.name + ' steering end');
    for (let tick = 0; tick < 100 && Math.hypot(manual.x - finish.x, manual.y - finish.y) > 0.01; tick++) {
      const dx = finish.x - manual.x, dy = finish.y - manual.y;
      const distance = Math.hypot(dx, dy), step = Math.min(3, distance);
      api.moveWithTerrainCollision(manual, dx / distance * step, dy / distance * step);
    }
    assert.ok(Math.hypot(manual.x - finish.x, manual.y - finish.y) < 0.01,
      passage.name + ' directional collision blocked, reverse=' + reverse);
    results.push({ strait: passage.name, reverse, ticks });
  }
}
for (const [name, point] of [
  ['Palembang', [-2.99, 104.76]], ['Sumatra', [-2.7, 105.4]],
  ['Bangka', [-2.25, 106.0]], ['southern Bangka', [-2.75, 106.25]],
  ['Kyushu', [33.7, 130.8]], ['Honshu', [34.15, 131.1]], ['Shikoku', [33.8, 133.2]],
]) {
  const p = pixel(point);
  assert.notEqual(api.terrainAtPixel(p.x, p.y).type, 'sea', name + ' must remain land');
}
console.log(JSON.stringify({ ok: true, actualServerMovement: results, landPreserved: true }));
