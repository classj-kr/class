(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory(require("./rules.js"));
  else root.BoardCoachAI = factory(root.BoardCoachRules);
})(typeof globalThis !== "undefined" ? globalThis : this, function (R) {
  "use strict";
  const LEVELS = Object.freeze({
    beginner: { name: "초급", reversi: 2, omok: 2, nodes: 2500, ms: 300, width: 8 },
    intermediate: { name: "중급", reversi: 4, omok: 3, nodes: 18000, ms: 800, width: 10 },
    advanced: { name: "상급", reversi: 6, omok: 4, nodes: 90000, ms: 1800, width: 12 }
  });
  const corners = [0, 7, 56, 63], WIN = 10000000;
  const book = new Map();
  // Randy Fang, Othello: From Beginner to Master, pp. 44–46:
  // after E6 F4 E3, D6 keeps White compact and central. Include symmetries.
  let example = R.initial("reversi");
  for (const i of [44, 29, 20]) example = R.play(example, i);
  for (let t = 0; t < 8; t++) {
    const transform = i => {
      let r = Math.floor(i / 8), c = i % 8;
      if (t >= 4) c = 7 - c;
      for (let k = 0; k < t % 4; k++) [r, c] = [c, 7 - r];
      return r * 8 + c;
    };
    const board = Array(64).fill(0);
    example.board.forEach((v, i) => { board[transform(i)] = v; });
    book.set(board.join("") + ":2", transform(43));
  }
  function nearby(board) {
    const spots = new Set();
    board.forEach((v, i) => {
      if (!v) return;
      const row = Math.floor(i / 15), col = i % 15;
      for (let dr = -2; dr <= 2; dr++) for (let dc = -2; dc <= 2; dc++) {
        const r = row + dr, c = col + dc;
        if (r >= 0 && r < 15 && c >= 0 && c < 15 && !board[r * 15 + c]) spots.add(r * 15 + c);
      }
    });
    return spots.size ? [...spots] : board.every(v => !v) ? [112] : [];
  }
  function threats(board, index, color) {
    if (board[index]) return { win: false, fours: 0, threes: 0, twos: 0, score: 0 };
    const b = board.slice(); b[index] = color;
    const win = !!R.winningLine(b, index, color).length;
    let fours = 0, threes = 0, twos = 0;
    const row = Math.floor(index / 15), col = index % 15;
    for (const [dr, dc] of R.axes) {
      let line = "";
      for (let d = -5; d <= 5; d++) {
        const r = row + dr * d, c = col + dc * d;
        line += r < 0 || r >= 15 || c < 0 || c >= 15 ? "2" : b[r * 15 + c] === color ? "1" : b[r * 15 + c] ? "2" : "0";
      }
      const wins = new Set();
      for (let start = 1; start <= 5; start++) {
        const part = line.slice(start, start + 5);
        if (!part.includes("2") && [...part].filter(c => c === "1").length === 4) wins.add(start + part.indexOf("0"));
      }
      fours += wins.size;
      const has = patterns => patterns.some(pattern => {
        for (let start = 0; start + pattern.length <= line.length; start++) {
          if (start <= 5 && start + pattern.length > 5 && line.slice(start, start + pattern.length) === pattern) return true;
        }
        return false;
      });
      if (!wins.size && has(["001110", "011100", "010110", "011010"])) threes++;
      if (!wins.size && has(["001100", "001010", "010100"])) twos++;
    }
    return { win, fours, threes, twos, score: win ? WIN : fours >= 2 ? 500000 : fours * 18000 + threes * 1800 + (threes >= 2 ? 6000 : 0) + twos * 90 };
  }
  function winningMoves(state, color = state.color) { return nearby(state.board).filter(i => threats(state.board, i, color).win); }
  function omokRanked(state) {
    const color = state.color;
    let moves = nearby(state.board).map(index => {
      const own = threats(state.board, index, color), other = threats(state.board, index, 3 - color);
      const center = 14 - Math.abs(Math.floor(index / 15) - 7) - Math.abs(index % 15 - 7);
      return { index, own, other, score: own.score + other.score * 0.95 + center };
    }).sort((a, b) => b.score - a.score || a.index - b.index);
    const winning = moves.filter(m => m.own.win);
    if (winning.length) return winning;
    const block = moves.filter(m => m.other.win);
    if (block.length) return block;
    const force = moves.filter(m => m.own.fours >= 2);
    if (force.length) return force;
    const openFours = moves.filter(m => m.other.fours >= 2).map(m => m.index);
    if (openFours.length) {
      const safe = moves.filter(m => {
        if (m.own.fours) return true; // A forcing four must be answered first.
        const board = state.board.slice(); board[m.index] = color;
        return openFours.every(i => board[i] || threats(board, i, 3 - color).fours < 2);
      });
      if (safe.length) moves = safe;
    }
    return moves;
  }
  function frontier(board, color) {
    let count = 0;
    board.forEach((v, i) => {
      if (v !== color) return;
      const row = Math.floor(i / 8), col = i % 8;
      if (R.directions.some(([dr, dc]) => row + dr >= 0 && row + dr < 8 && col + dc >= 0 && col + dc < 8 && !board[(row + dr) * 8 + col + dc])) count++;
    });
    return count;
  }
  function reversiValue(state, color) {
    const b = state.board, opp = 3 - color, empty = b.filter(v => !v).length;
    let score = (R.legal(state, color).length - R.legal(state, opp).length) * 18;
    score -= (frontier(b, color) - frontier(b, opp)) * (empty > 16 ? 7 : 2);
    for (const corner of corners) {
      if (b[corner]) score += b[corner] === color ? 250 : -250;
      else {
        const row = Math.floor(corner / 8), col = corner % 8;
        const dr = row ? -1 : 1, dc = col ? -1 : 1;
        for (const [i, cost] of [[corner + dr * 8 + dc, 85], [corner + dr * 8, 38], [corner + dc, 38]]) {
          if (b[i]) score += b[i] === color ? -cost : cost;
        }
      }
    }
    const difference = b.filter(v => v === color).length - b.filter(v => v === opp).length;
    score += difference * (empty < 14 ? 12 : 0.2);
    return score;
  }
  function reversiRanked(state) {
    let moves = R.legal(state).map(index => {
      const next = R.play(state, index);
      return { index, next, danger: R.legal(next, 3 - state.color).filter(i => corners.includes(i)).length, score: reversiValue(next, state.color) };
    });
    // Every level follows these opening/midgame safeguards. In the endgame,
    // search may trade a corner for a better final disc count.
    if (state.board.filter(v => !v).length > 12) {
      const takeCorner = moves.filter(m => corners.includes(m.index));
      if (takeCorner.length) moves = takeCorner;
      else if (moves.some(m => !m.danger)) moves = moves.filter(m => !m.danger);
    }
    return moves.sort((a, b) => b.score - a.score || a.index - b.index);
  }
  function omokValue(state, color) {
    let score = 0;
    const values = [0, 1, 12, 200, 22000, WIN];
    for (let row = 0; row < 15; row++) for (let col = 0; col < 15; col++) for (const [dr, dc] of R.axes) {
      if (row + dr * 4 >= 15 || col + dc * 4 >= 15 || col + dc * 4 < 0) continue;
      let own = 0, other = 0;
      for (let d = 0; d < 5; d++) {
        const v = state.board[(row + dr * d) * 15 + col + dc * d];
        if (v === color) own++; else if (v) other++;
      }
      if (!other) score += values[own];
      if (!own) score -= values[other];
    }
    return score;
  }
  function terminal(state, color) {
    if (!state.winner) return 0;
    const difference = state.game === "reversi" ? state.board.filter(v => v === color).length - state.board.filter(v => v === 3 - color).length : 0;
    return (state.winner === color ? WIN : -WIN) + difference;
  }
  function choose(state, level = "beginner", options = {}) {
    if (state.ended) return null;
    const settings = LEVELS[level] || LEVELS.beginner;
    const roots = state.game === "omok" ? omokRanked(state) : reversiRanked(state);
    if (!roots.length) return null;
    const learned = state.game === "reversi" ? book.get(state.board.join("") + ":" + state.color) : undefined;
    if (learned !== undefined && R.legal(state).includes(learned)) return { index: learned, depth: 0, nodes: 0, reason: explain(state, learned) };
    let nodes = 0, best = roots[0].index, completeDepth = 0;
    const deadline = Date.now() + (options.ms ?? settings.ms), maxNodes = options.nodes ?? settings.nodes;
    const aborted = {};
    const evaluate = state.game === "omok" ? omokValue : reversiValue;
    const ranked = state.game === "omok" ? omokRanked : reversiRanked;
    function search(position, depth, alpha, beta) {
      if (++nodes > maxNodes || (nodes % 16 === 0 && Date.now() > deadline)) throw aborted;
      if (position.ended) return terminal(position, position.color);
      if (!depth) return evaluate(position, position.color);
      let score = -Infinity;
      const moves = ranked(position).slice(0, state.game === "omok" ? settings.width : 64);
      for (const move of moves) {
        const next = move.next || R.play(position, move.index);
        const v = next.color === position.color ? search(next, depth - 1, alpha, beta) : -search(next, depth - 1, -beta, -alpha);
        score = Math.max(score, v); alpha = Math.max(alpha, v);
        if (alpha >= beta) break;
      }
      return score;
    }
    for (let depth = 1; depth <= settings[state.game]; depth++) {
      let candidate = best, top = -Infinity;
      try {
        const ordered = roots.slice(0, state.game === "omok" ? settings.width : 64).sort((a, b) => Number(b.index === best) - Number(a.index === best));
        for (const move of ordered) {
          const next = move.next || R.play(state, move.index);
          const v = next.color === state.color ? search(next, depth - 1, top, Infinity) : -search(next, depth - 1, -Infinity, -top);
          if (v > top) { top = v; candidate = move.index; }
        }
        best = candidate; completeDepth = depth;
      } catch (error) { if (error !== aborted) throw error; break; }
    }
    return { index: best, depth: completeDepth, nodes, reason: explain(state, best) };
  }
  function explain(state, index) {
    const at = R.coord(index, state.size), next = R.play(state, index);
    if (next.ended) return next.winner === state.color ? `${at}에 두어 ${state.game === "omok" ? "다섯 돌을 이어 승리해요." : "마지막 돌 수에서 앞서 승리해요."}` : `${at}에 두면 대국이 끝나요. 마지막 결과를 확인해 보세요.`;
    if (state.game === "omok") {
      if (!state.count) return index === 112 ? `${at}에서 시작해요. 중앙은 여러 방향으로 돌을 이어 갈 공간이 넓어요.` : `${at}에서 시작했어요. 첫 수는 중앙 H8에서 시작하면 여러 방향으로 돌을 이어 갈 공간을 확보하기 좋아요.`;
      const own = threats(state.board, index, state.color), opponent = threats(state.board, index, 3 - state.color);
      if (opponent.win) return `${at}을 막아요. 상대가 여기에 두면 바로 다섯 돌이 이어져요.`;
      if (own.fours >= 2) return `${at}에 두면 다음에 다섯 돌을 완성할 자리가 두 곳 이상 생겨요.`;
      if (own.fours) return `${at}에 두어 네 돌의 위협을 만들어요. 상대는 다음 승리 자리를 막아야 해요.`;
      const dangers = nearby(state.board).filter(i => threats(state.board, i, 3 - state.color).fours >= 2);
      if (dangers.length && dangers.every(i => next.board[i] || threats(next.board, i, 3 - state.color).fours < 2)) return `${at}에서 상대의 위협을 막아요. 상대가 다음 수에 다섯 돌을 완성할 자리를 두 곳 이상 만들지 못하게 해요.`;
      if (own.threes) return `${at}에 두어 열린 세 돌을 만들어요. 다음에 양끝이 열린 네 돌로 이어 갈 수 있어요.`;
      if (state.count === 1 && Math.abs(Math.floor(index / 15) - 7) <= 2 && Math.abs(index % 15 - 7) <= 2) return `${at}에서 중앙 쪽에 대응해요. 공격과 방어에 함께 쓸 공간을 살펴봐요.`;
      return `${at}에 두었어요. 이 돌을 어떻게 연결할지 생각하고, 상대의 세 돌·네 돌의 위협도 다시 확인하세요.`;
    }
    if (book.get(state.board.join("") + ":" + state.color) === index) return `${at}에 두어 중앙의 돌을 이어 놓아요. 적게 뒤집는 것만 생각하기보다 돌이 흩어지지 않게 하는 기본 전개예요.`;
    if (corners.includes(index)) return `${at} 모서리를 잡아요. 모서리의 돌은 다시 뒤집히지 않아요.`;
    if (next.passed) return `${at}에 두면 상대가 둘 자리가 없어 한 번 더 둘 수 있어요.`;
    const options = R.legal(next, 3 - state.color).length;
    const counts = R.legal(state).map(i => R.legal(R.play(state, i), 3 - state.color).length);
    if (options === Math.min(...counts)) return `${at}에 두면 상대가 둘 곳은 ${options}곳이에요. 지금 가능한 수 중 상대의 선택지를 가장 적게 남겨요.`;
    const dangerous = R.legal(state).some(i => R.legal(R.play(state, i), 3 - state.color).some(j => corners.includes(j)));
    if (dangerous && !R.legal(next, 3 - state.color).some(i => corners.includes(i))) return `${at}에 두어 다음 차례에 상대에게 모서리를 내주지 않아요.`;
    return `${at}을 골랐어요. 뒤집는 개수와 함께 모서리의 안전, 양쪽이 다음에 둘 자리도 살펴보세요.`;
  }
  function review(state, index) {
    const next = R.play(state, index);
    if (next.winner === state.color) return null;
    if (state.game === "omok") {
      const wins = winningMoves(state);
      if (wins.length) return { alternative: wins[0], text: `${R.coord(wins[0], 15)}에 두면 바로 승리할 수 있었어요. 공격할 때는 다섯 돌을 완성할 곳부터 찾아봐요.` };
      const danger = winningMoves(next, 3 - state.color);
      if (danger.length && winningMoves(state, 3 - state.color).length <= 1) {
        const safe = omokRanked(state).find(m => !winningMoves(R.play(state, m.index), 3 - state.color).length);
        if (safe) return { alternative: safe.index, text: `상대가 ${R.coord(danger[0], 15)}에 두면 승리해요. ${R.coord(safe.index, 15)}에서 먼저 막을 수 있었어요.` };
      }
    } else {
      const danger = R.legal(next, 3 - state.color).filter(i => corners.includes(i));
      if (danger.length) {
        const safe = R.legal(state).find(i => !R.legal(R.play(state, i), 3 - state.color).some(j => corners.includes(j)));
        if (safe !== undefined) return { alternative: safe, text: `이 수로 상대에게 ${R.coord(danger[0], 8)} 모서리가 열렸어요. ${R.coord(safe, 8)}은 다음 차례에 모서리를 내주지 않는 후보예요.` };
      }
    }
    return null;
  }
  return { LEVELS, choose, explain, review, threats, winningMoves, book, corners };
});
