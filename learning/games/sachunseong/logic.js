/* 사천성 판의 규칙. 화면과 떨어져 있어 node로도 돌려 볼 수 있다.
 * 판은 rows×cols 칸이고, 둘레에 한 줄 빈 길(0행·0열·rows+1행·cols+1열)이 있다고 친다.
 * 칸 값: -1 빈칸, 0 이상이면 패 번호. 패 t의 짝은 t^1(짝수=영어 낱말, 홀수=뜻)이다.
 */
(function attach(root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.ShisenLogic = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function factory() {
  'use strict';

  const DIRS = [[-1, 0], [0, 1], [1, 0], [0, -1]];

  function rng(seed) {
    let s = (seed >>> 0) || 1;
    return () => {
      s ^= s << 13; s >>>= 0;
      s ^= s >>> 17;
      s ^= s << 5; s >>>= 0;
      return s / 4294967296;
    };
  }

  function shuffleInPlace(list, random) {
    for (let i = list.length - 1; i > 0; i -= 1) {
      const j = Math.floor(random() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }
    return list;
  }

  // 길 찾기: a에서 b까지 빈칸만 지나 두 번 이하로 꺾는 길. 꺾는 자리를 포함한 점 목록을 돌려준다(없으면 null).
  function findPath(board, rows, cols, a, b) {
    if (a === b) return null;
    const R = rows + 2, C = cols + 2;
    const at = (r, c) => (r < 1 || c < 1 || r > rows || c > cols) ? -1 : board[(r - 1) * cols + (c - 1)];
    const ar = Math.floor(a / cols) + 1, ac = a % cols + 1;
    const br = Math.floor(b / cols) + 1, bc = b % cols + 1;
    // 꺾은 횟수별로 넓혀 가는 탐색. best[r][c][d] = 그 칸에 d 방향으로 들어올 때의 가장 적은 꺾음.
    const best = new Int8Array(R * C * 4).fill(9);
    const prev = new Int32Array(R * C * 4).fill(-1);
    let frontier = [];
    for (let d = 0; d < 4; d += 1) {
      let r = ar + DIRS[d][0], c = ac + DIRS[d][1];
      let from = -1;
      while (r >= 0 && c >= 0 && r < R && c < C) {
        const key = (r * C + c) * 4 + d;
        if (r === br && c === bc) { best[key] = 0; prev[key] = from; return trace(key); }
        if (at(r, c) !== -1) break;
        best[key] = 0; prev[key] = from; frontier.push(key); from = key;
        r += DIRS[d][0]; c += DIRS[d][1];
      }
    }
    for (let turns = 1; turns <= 2; turns += 1) {
      const next = [];
      for (const key of frontier) {
        const cell = key >> 2, d0 = key & 3;
        const r0 = Math.floor(cell / C), c0 = cell % C;
        for (let d = 0; d < 4; d += 1) {
          if (d === d0 || d === ((d0 + 2) & 3)) continue;
          let r = r0 + DIRS[d][0], c = c0 + DIRS[d][1];
          let from = key;
          while (r >= 0 && c >= 0 && r < R && c < C) {
            const k = (r * C + c) * 4 + d;
            if (r === br && c === bc) { prev[k] = from; return trace(k); }
            if (at(r, c) !== -1) break;
            if (best[k] <= turns) break;
            best[k] = turns; prev[k] = from; next.push(k); from = k;
            r += DIRS[d][0]; c += DIRS[d][1];
          }
        }
      }
      frontier = next;
    }
    return null;

    function trace(endKey) {
      const cells = [];
      for (let k = endKey; k !== -1; k = prev[k]) cells.push(k >> 2);
      cells.push(ar * C + ac);
      cells.reverse();
      // 곧은 줄 가운데 점은 빼고 꺾는 자리만 남긴다.
      const points = cells.map(cell => [Math.floor(cell / C), cell % C]);
      const corners = [points[0]];
      for (let i = 1; i < points.length - 1; i += 1) {
        const [pr, pc] = points[i - 1], [r, c] = points[i], [nr, nc] = points[i + 1];
        if ((r - pr) !== (nr - r) || (c - pc) !== (nc - c)) corners.push(points[i]);
      }
      corners.push(points[points.length - 1]);
      return corners; // [행, 열] — 둘레 길을 포함한 좌표(1부터가 판 안)
    }
  }

  function partnerIndex(board, i) {
    const t = board[i];
    if (t < 0) return -1;
    return board.indexOf(t ^ 1);
  }

  // 지금 지울 수 있는 짝 목록 [[i, j, 길], ...]
  function availableMoves(board, rows, cols, limit = Infinity) {
    const moves = [];
    for (let i = 0; i < board.length && moves.length < limit; i += 1) {
      const t = board[i];
      if (t < 0 || t & 1) continue;
      const j = board.indexOf(t ^ 1);
      if (j < 0) continue;
      const path = findPath(board, rows, cols, i, j);
      if (path) moves.push([i, j, path]);
    }
    return moves;
  }

  // 아무렇게나 지워 나가도 끝까지 가는 길이 하나라도 있는지(무작위 탐욕으로 몇 번 시도).
  function solvable(board, rows, cols, random, tries = 6) {
    for (let attempt = 0; attempt < tries; attempt += 1) {
      const work = board.slice();
      let left = work.filter(t => t >= 0).length;
      while (left > 0) {
        const moves = availableMoves(work, rows, cols);
        if (!moves.length) break;
        const [i, j] = moves[Math.floor(random() * moves.length)];
        work[i] = -1; work[j] = -1; left -= 2;
      }
      if (left === 0) return true;
    }
    return false;
  }

  // 짝 pairs개로 판을 만든다. 처음부터 끝까지 풀리는 배치만 돌려준다.
  function generate(rows, cols, pairs, seed) {
    const random = rng(seed);
    const tiles = [];
    for (let p = 0; p < pairs; p += 1) tiles.push(p * 2, p * 2 + 1);
    while (tiles.length < rows * cols) tiles.push(-1);
    for (let attempt = 0; attempt < 400; attempt += 1) {
      const board = shuffleInPlace(tiles.slice(), random);
      if (solvable(board, rows, cols, random)) return board;
    }
    return shuffleInPlace(tiles.slice(), random);
  }

  // 남은 패를 지금 자리끼리 섞는다. 풀리는 배치가 나올 때까지.
  function reshuffle(board, rows, cols, random) {
    const spots = [];
    const values = [];
    board.forEach((t, i) => { if (t >= 0) { spots.push(i); values.push(t); } });
    let best = board.slice();
    for (let attempt = 0; attempt < 300; attempt += 1) {
      shuffleInPlace(values, random);
      const next = board.slice();
      spots.forEach((spot, k) => { next[spot] = values[k]; });
      if (solvable(next, rows, cols, random, 3)) return next;
      if (availableMoves(next, rows, cols, 1).length) best = next;
    }
    return best;
  }

  return { rng, shuffleInPlace, findPath, partnerIndex, availableMoves, solvable, generate, reshuffle };
});
