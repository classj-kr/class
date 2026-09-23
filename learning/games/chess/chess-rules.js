(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.ClassChessRules = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const FILES = "abcdefgh";
  const PROMOTIONS = Object.freeze(["Q", "R", "B", "N"]);
  const START_BOARD = Object.freeze([
    "wR", "wN", "wB", "wQ", "wK", "wB", "wN", "wR",
    "wP", "wP", "wP", "wP", "wP", "wP", "wP", "wP",
    null, null, null, null, null, null, null, null,
    null, null, null, null, null, null, null, null,
    null, null, null, null, null, null, null, null,
    null, null, null, null, null, null, null, null,
    "bP", "bP", "bP", "bP", "bP", "bP", "bP", "bP",
    "bR", "bN", "bB", "bQ", "bK", "bB", "bN", "bR"
  ]);

  function opposite(color) { return color === "w" ? "b" : "w"; }
  function fileOf(index) { return index % 8; }
  function rankOf(index) { return Math.floor(index / 8); }
  function inside(file, rank) { return file >= 0 && file < 8 && rank >= 0 && rank < 8; }
  function indexOf(file, rank) { return rank * 8 + file; }
  function squareName(index) { return FILES[fileOf(index)] + String(rankOf(index) + 1); }
  function squareIndex(square) {
    const match = /^([a-h])([1-8])$/.exec(String(square || "").toLowerCase());
    return match ? indexOf(FILES.indexOf(match[1]), Number(match[2]) - 1) : -1;
  }
  function pieceColor(piece) { return piece ? piece[0] : null; }
  function pieceType(piece) { return piece ? piece[1] : null; }

  function createInitialState() {
    const state = {
      board: [...START_BOARD],
      turn: "w",
      castling: "KQkq",
      epSquare: null,
      halfmove: 0,
      fullmove: 1,
      lastMove: null,
      history: [],
      san: [],
      captures: []
    };
    state.history.push(positionKey(state));
    return state;
  }

  function cloneState(state) {
    return {
      board: [...state.board],
      turn: state.turn,
      castling: String(state.castling || ""),
      epSquare: Number.isInteger(state.epSquare) ? state.epSquare : null,
      halfmove: Number(state.halfmove) || 0,
      fullmove: Number(state.fullmove) || 1,
      lastMove: state.lastMove ? { ...state.lastMove } : null,
      history: Array.isArray(state.history) ? [...state.history] : [],
      san: Array.isArray(state.san) ? [...state.san] : [],
      captures: Array.isArray(state.captures) ? [...state.captures] : []
    };
  }

  function positionKey(state) {
    return `${state.board.map(piece => piece || "--").join("")}|${state.turn}|${state.castling || "-"}|${Number.isInteger(state.epSquare) ? squareName(state.epSquare) : "-"}`;
  }

  function addMove(moves, state, from, to, extra = {}) {
    const target = state.board[to];
    if (target && pieceColor(target) === state.turn) return;
    moves.push({ from, to, piece: state.board[from], capture: target || null, ...extra });
  }

  function slidingMoves(state, from, directions) {
    const moves = [];
    const own = pieceColor(state.board[from]);
    for (const [df, dr] of directions) {
      let file = fileOf(from) + df;
      let rank = rankOf(from) + dr;
      while (inside(file, rank)) {
        const to = indexOf(file, rank);
        const target = state.board[to];
        if (!target) moves.push({ from, to, piece: state.board[from], capture: null });
        else {
          if (pieceColor(target) !== own) moves.push({ from, to, piece: state.board[from], capture: target });
          break;
        }
        file += df;
        rank += dr;
      }
    }
    return moves;
  }

  function isSquareAttacked(state, square, byColor) {
    const board = state.board;
    const targetFile = fileOf(square);
    const targetRank = rankOf(square);
    const pawnRank = targetRank - (byColor === "w" ? 1 : -1);
    for (const df of [-1, 1]) {
      const file = targetFile - df;
      if (inside(file, pawnRank) && board[indexOf(file, pawnRank)] === `${byColor}P`) return true;
    }

    for (const [df, dr] of [[1, 2], [2, 1], [2, -1], [1, -2], [-1, -2], [-2, -1], [-2, 1], [-1, 2]]) {
      const file = targetFile + df;
      const rank = targetRank + dr;
      if (inside(file, rank) && board[indexOf(file, rank)] === `${byColor}N`) return true;
    }

    const rays = [
      [1, 0, "RQ"], [-1, 0, "RQ"], [0, 1, "RQ"], [0, -1, "RQ"],
      [1, 1, "BQ"], [1, -1, "BQ"], [-1, 1, "BQ"], [-1, -1, "BQ"]
    ];
    for (const [df, dr, attackers] of rays) {
      let file = targetFile + df;
      let rank = targetRank + dr;
      while (inside(file, rank)) {
        const piece = board[indexOf(file, rank)];
        if (piece) {
          if (pieceColor(piece) === byColor && attackers.includes(pieceType(piece))) return true;
          break;
        }
        file += df;
        rank += dr;
      }
    }

    for (let df = -1; df <= 1; df += 1) {
      for (let dr = -1; dr <= 1; dr += 1) {
        if (!df && !dr) continue;
        const file = targetFile + df;
        const rank = targetRank + dr;
        if (inside(file, rank) && board[indexOf(file, rank)] === `${byColor}K`) return true;
      }
    }
    return false;
  }

  function isInCheck(state, color = state.turn) {
    const king = state.board.indexOf(`${color}K`);
    return king < 0 || isSquareAttacked(state, king, opposite(color));
  }

  function pseudoMoves(state, from) {
    const piece = state.board[from];
    if (!piece || pieceColor(piece) !== state.turn) return [];
    const type = pieceType(piece);
    const color = pieceColor(piece);
    const file = fileOf(from);
    const rank = rankOf(from);
    const moves = [];

    if (type === "P") {
      const direction = color === "w" ? 1 : -1;
      const startRank = color === "w" ? 1 : 6;
      const promotionRank = color === "w" ? 7 : 0;
      const nextRank = rank + direction;
      if (inside(file, nextRank) && !state.board[indexOf(file, nextRank)]) {
        const to = indexOf(file, nextRank);
        if (nextRank === promotionRank) PROMOTIONS.forEach(promotion => addMove(moves, state, from, to, { promotion }));
        else addMove(moves, state, from, to);
        const doubleRank = rank + direction * 2;
        if (rank === startRank && !state.board[indexOf(file, doubleRank)]) addMove(moves, state, from, indexOf(file, doubleRank), { doublePawn: true });
      }
      for (const df of [-1, 1]) {
        const targetFile = file + df;
        if (!inside(targetFile, nextRank)) continue;
        const to = indexOf(targetFile, nextRank);
        const target = state.board[to];
        if (target && pieceColor(target) !== color) {
          if (nextRank === promotionRank) PROMOTIONS.forEach(promotion => addMove(moves, state, from, to, { promotion }));
          else addMove(moves, state, from, to);
        } else if (to === state.epSquare) {
          const capturedAt = indexOf(targetFile, rank);
          if (state.board[capturedAt] === `${opposite(color)}P`) addMove(moves, state, from, to, { enPassant: true, capture: state.board[capturedAt] });
        }
      }
      return moves;
    }

    if (type === "N") {
      for (const [df, dr] of [[1, 2], [2, 1], [2, -1], [1, -2], [-1, -2], [-2, -1], [-2, 1], [-1, 2]]) {
        const targetFile = file + df;
        const targetRank = rank + dr;
        if (inside(targetFile, targetRank)) addMove(moves, state, from, indexOf(targetFile, targetRank));
      }
      return moves;
    }

    if (type === "B") return slidingMoves(state, from, [[1, 1], [1, -1], [-1, 1], [-1, -1]]);
    if (type === "R") return slidingMoves(state, from, [[1, 0], [-1, 0], [0, 1], [0, -1]]);
    if (type === "Q") return slidingMoves(state, from, [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]]);

    if (type === "K") {
      for (let df = -1; df <= 1; df += 1) {
        for (let dr = -1; dr <= 1; dr += 1) {
          if (!df && !dr) continue;
          const targetFile = file + df;
          const targetRank = rank + dr;
          if (inside(targetFile, targetRank)) addMove(moves, state, from, indexOf(targetFile, targetRank));
        }
      }
      const homeRank = color === "w" ? 0 : 7;
      const kingStart = indexOf(4, homeRank);
      if (from === kingStart) {
        const kingRight = color === "w" ? "K" : "k";
        const queenRight = color === "w" ? "Q" : "q";
        if (state.castling.includes(kingRight)
          && state.board[indexOf(7, homeRank)] === `${color}R`
          && !state.board[indexOf(5, homeRank)] && !state.board[indexOf(6, homeRank)]) {
          moves.push({ from, to: indexOf(6, homeRank), piece, capture: null, castle: "K" });
        }
        if (state.castling.includes(queenRight)
          && state.board[indexOf(0, homeRank)] === `${color}R`
          && !state.board[indexOf(1, homeRank)] && !state.board[indexOf(2, homeRank)] && !state.board[indexOf(3, homeRank)]) {
          moves.push({ from, to: indexOf(2, homeRank), piece, capture: null, castle: "Q" });
        }
      }
    }
    return moves;
  }

  function removeCastlingRight(castling, right) { return castling.replace(right, ""); }

  function makeMoveUnchecked(state, move) {
    const next = cloneState(state);
    const color = pieceColor(move.piece);
    const type = pieceType(move.piece);
    const targetBeforeMove = next.board[move.to];
    next.board[move.from] = null;

    if (move.enPassant) {
      const capturedAt = indexOf(fileOf(move.to), rankOf(move.from));
      next.board[capturedAt] = null;
    }
    next.board[move.to] = move.promotion ? `${color}${move.promotion}` : move.piece;

    if (move.castle) {
      const rank = color === "w" ? 0 : 7;
      const rookFrom = indexOf(move.castle === "K" ? 7 : 0, rank);
      const rookTo = indexOf(move.castle === "K" ? 5 : 3, rank);
      next.board[rookTo] = next.board[rookFrom];
      next.board[rookFrom] = null;
    }

    let castling = next.castling;
    if (type === "K") {
      castling = removeCastlingRight(castling, color === "w" ? "K" : "k");
      castling = removeCastlingRight(castling, color === "w" ? "Q" : "q");
    }
    const rookRights = new Map([[0, "Q"], [7, "K"], [56, "q"], [63, "k"]]);
    if (type === "R" && rookRights.has(move.from)) castling = removeCastlingRight(castling, rookRights.get(move.from));
    if (targetBeforeMove && pieceType(targetBeforeMove) === "R" && rookRights.has(move.to)) castling = removeCastlingRight(castling, rookRights.get(move.to));
    next.castling = castling;

    next.epSquare = move.doublePawn ? indexOf(fileOf(move.from), (rankOf(move.from) + rankOf(move.to)) / 2) : null;
    next.halfmove = type === "P" || move.capture ? 0 : next.halfmove + 1;
    if (color === "b") next.fullmove += 1;
    next.turn = opposite(color);
    next.lastMove = {
      from: move.from,
      to: move.to,
      piece: move.piece,
      capture: move.capture || null,
      promotion: move.promotion || null,
      castle: move.castle || null,
      enPassant: !!move.enPassant
    };
    return next;
  }

  function legalMoves(state, from) {
    // Learning rules: threats warn players but never restrict piece movement.
    if (!state.board.includes("wK") || !state.board.includes("bK")) return [];
    return pseudoMoves(state, from);
  }

  function allLegalMoves(state) {
    const moves = [];
    for (let from = 0; from < 64; from += 1) {
      if (pieceColor(state.board[from]) === state.turn) moves.push(...legalMoves(state, from));
    }
    return moves;
  }

  function insufficientMaterial(state) {
    const pieces = state.board.map((piece, square) => ({ piece, square })).filter(entry => entry.piece && pieceType(entry.piece) !== "K");
    if (!pieces.length) return true;
    if (pieces.length === 1 && ["B", "N"].includes(pieceType(pieces[0].piece))) return true;
    if (pieces.every(entry => pieceType(entry.piece) === "B")) {
      const colors = new Set(pieces.map(entry => (fileOf(entry.square) + rankOf(entry.square)) % 2));
      return colors.size === 1;
    }
    return false;
  }

  function repetitionCount(state) {
    const key = positionKey(state);
    return (state.history || []).filter(entry => entry === key).length;
  }

  function status(state) {
    for (const color of ["w", "b"]) {
      if (!state.board.includes(`${color}K`)) return { ended: true, reason: "king-captured", winner: opposite(color), checked: false };
    }
    const moves = allLegalMoves(state);
    const checked = isInCheck(state, state.turn);
    if (!moves.length) return { ended: true, reason: "no-legal-move", winner: null, checked };
    if (state.halfmove >= 100) return { ended: true, reason: "fifty-move", winner: null, checked };
    if (repetitionCount(state) >= 3) return { ended: true, reason: "threefold", winner: null, checked };
    return { ended: false, reason: null, winner: null, checked };
  }

  function sanForMove(state, move, nextState) {
    if (move.castle) return `${move.castle === "K" ? "O-O" : "O-O-O"}${isInCheck(nextState) ? "+" : ""}`;
    const type = pieceType(move.piece);
    let notation = type === "P" ? "" : type;
    if (type !== "P") {
      const competitors = [];
      for (let from = 0; from < 64; from += 1) {
        if (from !== move.from && state.board[from] === move.piece && legalMoves(state, from).some(candidate => candidate.to === move.to)) competitors.push(from);
      }
      if (competitors.length) {
        const sameFile = competitors.some(from => fileOf(from) === fileOf(move.from));
        const sameRank = competitors.some(from => rankOf(from) === rankOf(move.from));
        notation += !sameFile ? FILES[fileOf(move.from)] : !sameRank ? String(rankOf(move.from) + 1) : squareName(move.from);
      }
    } else if (move.capture) notation += FILES[fileOf(move.from)];
    if (move.capture) notation += "x";
    notation += squareName(move.to);
    if (move.promotion) notation += `=${move.promotion}`;
    const nextStatus = status(nextState);
    if (nextStatus.checked) notation += "+";
    return notation;
  }

  function applyMove(state, fromValue, toValue, promotionValue) {
    const from = Number.isInteger(fromValue) ? fromValue : squareIndex(fromValue);
    const to = Number.isInteger(toValue) ? toValue : squareIndex(toValue);
    const promotion = String(promotionValue || "Q").toUpperCase();
    if (from < 0 || to < 0) return { ok: false, error: "좌표가 올바르지 않습니다." };
    const candidates = legalMoves(state, from).filter(move => move.to === to);
    if (!candidates.length) return { ok: false, error: "둘 수 없는 위치입니다." };
    const move = candidates.find(candidate => !candidate.promotion || candidate.promotion === promotion) || candidates[0];
    const next = makeMoveUnchecked(state, move);
    const san = sanForMove(state, move, next);
    next.san.push(san);
    if (move.capture) next.captures.push(move.capture);
    next.history.push(positionKey(next));
    next.lastMove.san = san;
    return { ok: true, state: next, move: { ...next.lastMove }, status: status(next) };
  }

  function boardFromFen(fen) {
    const [placement, turn = "w", castling = "-", ep = "-", halfmove = "0", fullmove = "1"] = String(fen || "").trim().split(/\s+/);
    const rows = String(placement || "").split("/");
    if (rows.length !== 8) throw new Error("Invalid FEN");
    const board = Array(64).fill(null);
    rows.forEach((row, fenRank) => {
      let file = 0;
      for (const symbol of row) {
        if (/\d/.test(symbol)) file += Number(symbol);
        else {
          if (file >= 8 || !/[prnbqk]/i.test(symbol)) throw new Error("Invalid FEN");
          const color = symbol === symbol.toUpperCase() ? "w" : "b";
          board[indexOf(file, 7 - fenRank)] = `${color}${symbol.toUpperCase()}`;
          file += 1;
        }
      }
      if (file !== 8) throw new Error("Invalid FEN");
    });
    const state = {
      board,
      turn: turn === "b" ? "b" : "w",
      castling: castling === "-" ? "" : castling,
      epSquare: ep === "-" ? null : squareIndex(ep),
      halfmove: Number(halfmove) || 0,
      fullmove: Number(fullmove) || 1,
      lastMove: null,
      history: [],
      san: [],
      captures: []
    };
    state.history.push(positionKey(state));
    return state;
  }

  return Object.freeze({
    FILES,
    PROMOTIONS,
    createInitialState,
    cloneState,
    boardFromFen,
    squareName,
    squareIndex,
    positionKey,
    pieceColor,
    pieceType,
    isSquareAttacked,
    isInCheck,
    legalMoves,
    allLegalMoves,
    insufficientMaterial,
    repetitionCount,
    status,
    applyMove
  });
});
