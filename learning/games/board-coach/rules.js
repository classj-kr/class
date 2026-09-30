(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.BoardCoachRules = factory();
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";
  const directions = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
  const axes = [[0,1],[1,0],[1,1],[1,-1]];
  function initial(game) {
    if (!["omok", "reversi"].includes(game)) throw new Error("지원하지 않는 게임입니다.");
    const size = game === "omok" ? 15 : 8, board = Array(size * size).fill(0);
    if (game === "reversi") { board[27] = board[36] = 2; board[28] = board[35] = 1; }
    return { game, size, board, color: 1, last: null, count: 0, ended: false, winner: 0, passed: 0, line: [] };
  }
  function flips(board, index, color) {
    if (board[index] !== 0) return [];
    const row = Math.floor(index / 8), col = index % 8, result = [];
    for (const [dr, dc] of directions) {
      let r = row + dr, c = col + dc; const line = [];
      while (r >= 0 && r < 8 && c >= 0 && c < 8 && board[r * 8 + c] === 3 - color) {
        line.push(r * 8 + c); r += dr; c += dc;
      }
      if (line.length && r >= 0 && r < 8 && c >= 0 && c < 8 && board[r * 8 + c] === color) result.push(...line);
    }
    return result;
  }
  function legal(state, color = state.color) {
    if (state.ended) return [];
    const result = [];
    state.board.forEach((v, i) => { if (!v && (state.game === "omok" || flips(state.board, i, color).length)) result.push(i); });
    return result;
  }
  function winningLine(board, index, color, size = 15) {
    for (const [dr, dc] of axes) {
      const line = [index];
      for (const sign of [-1, 1]) {
        let r = Math.floor(index / size) + dr * sign, c = index % size + dc * sign;
        while (r >= 0 && r < size && c >= 0 && c < size && board[r * size + c] === color) {
          line.push(r * size + c); r += dr * sign; c += dc * sign;
        }
      }
      if (line.length >= 5) return line;
    }
    return [];
  }
  function play(state, index) {
    if (state.ended || !Number.isInteger(index) || index < 0 || index >= state.board.length || state.board[index]) throw new Error("둘 수 없는 자리입니다.");
    const board = state.board.slice(), color = state.color;
    const turned = state.game === "reversi" ? flips(board, index, color) : [];
    if (state.game === "reversi" && !turned.length) throw new Error("상대 돌을 끼우는 자리에 두세요.");
    board[index] = color;
    for (const i of turned) board[i] = color;
    const next = { ...state, board, color: 3 - color, count: state.count + 1, last: index, passed: 0, line: [], flipped: turned };
    if (state.game === "omok") {
      next.line = winningLine(board, index, color);
      next.ended = !!next.line.length || board.every(Boolean);
      next.winner = next.line.length ? color : 0;
    } else if (!legal(next).length) {
      if (legal(next, color).length) { next.passed = 3 - color; next.color = color; }
      else {
        next.ended = true;
        const delta = board.filter(v => v === 1).length - board.filter(v => v === 2).length;
        next.winner = delta > 0 ? 1 : delta < 0 ? 2 : 0;
      }
    }
    return next;
  }
  function coord(index, size) { return `${String.fromCharCode(65 + index % size)}${Math.floor(index / size) + 1}`; }
  return { initial, legal, flips, winningLine, play, coord, axes, directions };
});
