"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const chessDir = path.resolve(__dirname, "..", "learning", "games", "chess");
const html = fs.readFileSync(path.join(chessDir, "chess.html"), "utf8");
const css = fs.readFileSync(path.join(chessDir, "styles.css"), "utf8");
const ui = fs.readFileSync(path.join(chessDir, "chess-ui.js"), "utf8");
const server = fs.readFileSync(path.resolve(__dirname, "..", "game-hub-server", "server.js"), "utf8");
const index = fs.readFileSync(path.resolve(__dirname, "..", "index.html"), "utf8");

assert.match(html, /multiplayer-lobby\.css/);
assert.match(html, /multiplayer-lobby\.js/);
assert.match(html, /chess-rules\.js/);
assert.match(html, /id="board"[^>]+role="grid"/);
assert.match(html, /id="timeControl"/);
assert.match(html, /value="bullet"/);
assert.match(html, /value="quick" selected/);
assert.match(html, /value="relaxed"/);
assert.match(html, /value="untimed"/);
assert.match(html, /id="promotionModal"/);
assert.match(html, /id="drawResponse"/);
assert.match(html, /id="moveList"/);
assert.match(html, /id="lobbyChatLog"/);
assert.match(html, /id="gameChatLog"/);

assert.match(ui, /ClassroomMultiplayerLobby\.create\s*\(/);
assert.match(ui, /gameId:\s*GAME_ID/);
assert.match(ui, /CHESS_ACTION/);
assert.match(ui, /CHESS_STATE/);
assert.match(ui, /ClassChessRules\.legalMoves/);
assert.match(ui, /for \(let viewRank = 0; viewRank < 8/);
assert.match(ui, /for \(let viewFile = 0; viewFile < 8/);
assert.match(ui, /pieceSvg\(/, "체스 말은 코드 기반 SVG 세트로 그려야 합니다.");
assert.doesNotMatch(ui, /♔|♕|♖|♗|♘|♙/, "운영체제 글꼴에 따라 달라지는 유니코드 체스말을 사용하면 안 됩니다.");

assert.match(css, /grid-template-columns:repeat\(8,1fr\)/);
assert.match(css, /--light:#eeeccf/);
assert.match(css, /--dark:#769656/);
assert.match(css, /@media\(max-width:899px\)/);
assert.match(css, /\.square\.legal-empty/);
assert.match(css, /\.square\.legal-capture/);

assert.match(server, /chess:\s*2/);
assert.match(server, /CHESS_ACTION/);
assert.match(server, /CHESS_STATE/);
assert.match(index, /learning\/games\/chess\/chess/);

console.log("chess-ui-contract: lobby, responsive board, SVG pieces, controls and server hooks ok");
