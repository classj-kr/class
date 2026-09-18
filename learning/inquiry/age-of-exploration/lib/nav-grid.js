'use strict';

// 바닷길·육로를 찾기 위한 격자. 지도 타일과 한 칸씩 그대로 맞춘다.
// 예전에는 두 타일을 한 칸으로 묶었는데, 자연 지형 해안선을 씌운 뒤로는
// 폭 한두 타일짜리 물길이 많아져서 "칸으로는 지날 수 있지만 배는 못 가는" 자리가
// 생겼다. 그런 자리로 길을 내면 배가 막다른 주머니에 갇힌다(2026-09-18 수업에서 터짐).
const BLOCK = 1;

function buildNavGrid(terrainTypeAtCell, worldW, worldH) {
  const width = Math.ceil(worldW / BLOCK);
  const height = Math.ceil(worldH / BLOCK);
  const sea = new Uint8Array(width * height);
  const land = new Uint8Array(width * height);
  const seaAny = new Uint8Array(width * height);
  const landAny = new Uint8Array(width * height);
  for (let by = 0; by < height; by += 1) {
    for (let bx = 0; bx < width; bx += 1) {
      let seaCount = 0;
      let tiles = 0;
      for (let ty = 0; ty < BLOCK; ty += 1) {
        for (let tx = 0; tx < BLOCK; tx += 1) {
          const cx = bx * BLOCK + tx;
          const cy = by * BLOCK + ty;
          if (cx >= worldW || cy >= worldH) continue;
          tiles += 1;
          if (terrainTypeAtCell(cx, cy) === 'sea') seaCount += 1;
        }
      }
      const index = by * width + bx;
      sea[index] = tiles && seaCount === tiles ? 1 : 0;
      land[index] = tiles && seaCount === 0 ? 1 : 0;
      seaAny[index] = seaCount > 0 ? 1 : 0;
      landAny[index] = seaCount < tiles ? 1 : 0;
    }
  }
  return { width, height, sea, land, seaAny, landAny, block: BLOCK };
}

function passableArray(grid, mode, lenient = false) {
  if (mode === 'sea') return lenient ? grid.seaAny : grid.sea;
  return lenient ? grid.landAny : grid.land;
}

function wrapBx(grid, bx) {
  return ((bx % grid.width) + grid.width) % grid.width;
}

function indexOf(grid, bx, by) {
  return by * grid.width + wrapBx(grid, bx);
}

function nearestPassable(grid, mode, bx, by, maxRings = 24, lenient = false) {
  const passable = passableArray(grid, mode, lenient);
  if (by >= 0 && by < grid.height && passable[indexOf(grid, bx, by)]) return indexOf(grid, bx, by);
  for (let ring = 1; ring <= maxRings; ring += 1) {
    for (let dy = -ring; dy <= ring; dy += 1) {
      const ny = by + dy;
      if (ny < 0 || ny >= grid.height) continue;
      for (let dx = -ring; dx <= ring; dx += 1) {
        if (Math.max(Math.abs(dx), Math.abs(dy)) !== ring) continue;
        const index = indexOf(grid, bx + dx, ny);
        if (passable[index]) return index;
      }
    }
  }
  return -1;
}

// 가로로 이어진 지도에서 두 칸 사이의 x 거리
function deltaBx(grid, fromBx, toBx) {
  let d = toBx - fromBx;
  if (d > grid.width / 2) d -= grid.width;
  if (d < -grid.width / 2) d += grid.width;
  return d;
}

// 길찾기는 한 번에 하나씩만 돌아가므로(노드는 한 줄로 일한다) 작업용 배열을 한 벌만 두고 돌려 쓴다.
let scratchCache = null;
function scratchFor(total) {
  if (!scratchCache || scratchCache.total !== total) {
    scratchCache = {
      total,
      cameFrom: new Int32Array(total),
      gScore: new Float32Array(total),
      closed: new Uint8Array(total)
    };
  }
  return scratchCache;
}

function findPath(grid, mode, startIndex, goalIndex, lenient = false, maxVisited = 3200000) {
  if (startIndex < 0 || goalIndex < 0) return null;
  if (startIndex === goalIndex) return [goalIndex];
  const passable = passableArray(grid, mode, lenient);
  const total = grid.width * grid.height;
  const scratch = scratchFor(total);
  const cameFrom = scratch.cameFrom;
  const gScore = scratch.gScore;
  const closed = scratch.closed;
  cameFrom.fill(-1);
  gScore.fill(Infinity);
  closed.fill(0);
  const goalBx = goalIndex % grid.width;
  const goalBy = Math.floor(goalIndex / grid.width);
  const heuristic = (index) => {
    const bx = index % grid.width;
    const by = Math.floor(index / grid.width);
    const dx = Math.abs(deltaBx(grid, bx, goalBx));
    const dy = Math.abs(by - goalBy);
    return Math.max(dx, dy) + (Math.SQRT2 - 1) * Math.min(dx, dy);
  };
  const heapIndex = [];
  const heapScore = [];
  const push = (index, f) => {
    heapIndex.push(index);
    heapScore.push(f);
    let child = heapIndex.length - 1;
    while (child > 0) {
      const parent = (child - 1) >> 1;
      if (heapScore[parent] <= heapScore[child]) break;
      [heapIndex[parent], heapIndex[child]] = [heapIndex[child], heapIndex[parent]];
      [heapScore[parent], heapScore[child]] = [heapScore[child], heapScore[parent]];
      child = parent;
    }
  };
  const pop = () => {
    const top = heapIndex[0];
    const lastIndex = heapIndex.pop();
    const lastScore = heapScore.pop();
    if (heapIndex.length) {
      heapIndex[0] = lastIndex;
      heapScore[0] = lastScore;
      let parent = 0;
      for (;;) {
        const left = parent * 2 + 1;
        const right = left + 1;
        let smallest = parent;
        if (left < heapScore.length && heapScore[left] < heapScore[smallest]) smallest = left;
        if (right < heapScore.length && heapScore[right] < heapScore[smallest]) smallest = right;
        if (smallest === parent) break;
        [heapIndex[parent], heapIndex[smallest]] = [heapIndex[smallest], heapIndex[parent]];
        [heapScore[parent], heapScore[smallest]] = [heapScore[smallest], heapScore[parent]];
        parent = smallest;
      }
    }
    return top;
  };
  gScore[startIndex] = 0;
  push(startIndex, heuristic(startIndex));
  let visited = 0;
  while (heapIndex.length) {
    const current = { index: pop() };
    if (closed[current.index]) continue;
    closed[current.index] = 1;
    visited += 1;
    if (current.index === goalIndex) {
      const path = [goalIndex];
      let node = goalIndex;
      while (cameFrom[node] !== -1) { node = cameFrom[node]; path.push(node); }
      return path.reverse();
    }
    if (visited > maxVisited) return null;
    const bx = current.index % grid.width;
    const by = Math.floor(current.index / grid.width);
    for (let dy = -1; dy <= 1; dy += 1) {
      const ny = by + dy;
      if (ny < 0 || ny >= grid.height) continue;
      for (let dx = -1; dx <= 1; dx += 1) {
        if (!dx && !dy) continue;
        const index = indexOf(grid, bx + dx, ny);
        if (!passable[index] || closed[index]) continue;
        const cost = dx && dy ? Math.SQRT2 : 1;
        const tentative = gScore[current.index] + cost;
        if (tentative >= gScore[index]) continue;
        gScore[index] = tentative;
        cameFrom[index] = current.index;
        push(index, tentative + heuristic(index));
      }
    }
  }
  return null;
}

module.exports = { BLOCK, buildNavGrid, findPath, nearestPassable, indexOf, deltaBx };
