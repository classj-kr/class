"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const CityChase = require(path.resolve(__dirname, "..", "game-hub-server", "citychase"));

assert.ok(Object.keys(CityChase.BOARD.NODES).length >= 120, "원작 사진 수준의 이동 칸을 유지해야 합니다.");
const boardNodes = Object.values(CityChase.BOARD.NODES);
for (let i = 0; i < boardNodes.length; i += 1) {
  for (let j = i + 1; j < boardNodes.length; j += 1) {
    const distance = Math.hypot(boardNodes[i].x - boardNodes[j].x, boardNodes[i].y - boardNodes[j].y);
    assert.ok(distance >= 24, `이동 칸 ${boardNodes[i].id}와 ${boardNodes[j].id}가 겹치면 안 됩니다.`);
  }
}
assert.equal(CityChase.BOARD.BUILDINGS.length, 7, "원본 사진의 건물은 7곳이어야 합니다.");
assert.equal(CityChase.BOARD.WIDTH, 1000);
assert.equal(CityChase.BOARD.HEIGHT, 1000, "게임판은 원본처럼 정사각형이어야 합니다.");
assert.ok(CityChase.BOARD.ROUND_ZONE, "왼쪽 아래 원형 이동 구역이 있어야 합니다.");
assert.equal(CityChase.BOARD.ROUND_ZONE.entrances.length, 6, "원형 이동 구역은 여러 외부 경로와 연결되어야 합니다.");
assert.equal(CityChase.TRICK_CARD_COUNT, 9);
assert.equal(CityChase.CHECK_CARD_COUNT, 6);

function assignSeats(game) {
  const limits = CityChase.requiredTeamCounts(game.players.length);
  game.players.forEach((player, index) => {
    const team = index < limits.police ? "police" : "thief";
    const slot = index < limits.police ? index + 1 : index - limits.police + 1;
    assert.equal(CityChase.chooseSeat(game, player.id, team, slot).ok, true);
  });
  assert.equal(CityChase.lobbyReady(game), true);
}

const expectedPoliceCounts = { 2: 1, 3: 1, 4: 2, 5: 2, 6: 3 };
for (let count = 2; count <= 6; count += 1) {
  const teamGame = CityChase.createGame("player-1", "1번");
  for (let index = 2; index <= count; index += 1) CityChase.addPlayer(teamGame, `player-${index}`, `${index}번`);
  assert.equal(CityChase.startGame(teamGame).ok, false, "참가순서만으로 팀을 자동 배정하면 안 됩니다.");
  assignSeats(teamGame);
  assert.equal(CityChase.startGame(teamGame).ok, true);
  assert.equal(teamGame.players.filter(player => player.team === "police").length, expectedPoliceCounts[count]);
  assert.equal(teamGame.players.filter(player => player.team === "thief").length, count - expectedPoliceCounts[count]);
  assert.ok(teamGame.pawns.every(pawn => pawn.controllerIds.length >= 1), `${count}인 게임에서 모든 말을 누군가 맡아야 합니다.`);
  assert.ok(teamGame.players.every(player => player.pawnIds.length >= 1), `${count}인 게임에서 모든 참가자가 말을 맡아야 합니다.`);
}

const leavingGame = CityChase.createGame("p1", "하나");
CityChase.addPlayer(leavingGame, "p2", "두리");
CityChase.addPlayer(leavingGame, "p3", "세나");
CityChase.addPlayer(leavingGame, "p4", "네모");
assignSeats(leavingGame);
CityChase.removePlayer(leavingGame, "p4");
assert.equal(leavingGame.players.find(player => player.id === "p2").team, null, "인원 감소로 닫힌 슬롯에 참가자가 남으면 안 됩니다.");
assert.equal(CityChase.lobbyReady(leavingGame), false, "인원 변동 뒤에는 필요한 슬롯을 다시 선택해야 합니다.");

const game = CityChase.createGame("police", "경찰 대표");
CityChase.addPlayer(game, "thief", "도둑 대표");
assert.equal(CityChase.chooseSeat(game, "police", "police", 1).ok, true);
assert.equal(CityChase.chooseSeat(game, "thief", "police", 1).ok, false, "다른 학생의 슬롯으로 이동할 수 없어야 합니다.");
assert.equal(CityChase.chooseSeat(game, "thief", "thief", 1).ok, true);
assert.equal(CityChase.stateFor(game, "police").lobbyReady, true);
assert.deepEqual(CityChase.stateFor(game, "police").teamLimits, { police: 1, thief: 1 });
assert.equal(CityChase.chooseSeat(game, "thief", "thief", 1).ok, true, "자기 슬롯을 다시 누르면 자리에서 나올 수 있어야 합니다.");
assert.equal(CityChase.lobbyReady(game), false);
assert.equal(CityChase.chooseSeat(game, "thief", "thief", 1).ok, true);
assert.equal(CityChase.startGame(game).ok, true);
assert.equal(game.phase, "setup");
assert.deepEqual(game.players.map(player => player.team), ["police", "thief"]);
assert.equal(game.pawns.length, 6, "참가 인원과 관계없이 경찰·도둑 말 6개를 모두 사용합니다.");
assert.ok(game.pawns.filter(pawn => pawn.team === "police").every(pawn => pawn.controllerIds.includes("police")));
assert.ok(game.pawns.filter(pawn => pawn.team === "thief").every(pawn => pawn.controllerIds.includes("thief")));

assert.equal(CityChase.placeSecrets(game, "thief", { gems: ["market", "air"], undercover: "burger" }).ok, false);
assert.equal(CityChase.placeSecrets(game, "police", { gems: ["market", "air"], undercover: "burger" }).ok, true);
assert.equal(game.phase, "playing");
const policeView = CityChase.stateFor(game, "police");
const thiefView = CityChase.stateFor(game, "thief");
assert.equal(policeView.buildings.find(item => item.id === "market").content, "gem");
assert.equal(thiefView.buildings.find(item => item.id === "market").content, "hidden", "도둑 화면에는 비밀 배치가 노출되면 안 됩니다.");
assert.deepEqual(thiefView.buildings.map(item => item.content), Array(7).fill("hidden"));

assert.equal(game.turnPawnId, undefined);
assert.equal(CityChase.currentPawn(game).id, "thief-1");
assert.equal(CityChase.roll(game, "police", 2).ok, false, "상대 팀의 말을 대신 움직일 수 없어야 합니다.");
assert.equal(CityChase.roll(game, "thief", 2).ok, true);
const finalDestinations = CityChase.stateFor(game, "thief").validMoves;
assert.equal(finalDestinations.includes("p0"), false, "중간 칸은 목적지로 선택할 수 없어야 합니다.");
const firstDenseRoad = CityChase.BOARD.neighbors("p0", "thief").find(item => item.id !== "hideout").id;
assert.equal(finalDestinations.includes(firstDenseRoad), true, "주사위 수만큼 이동한 최종 목적지만 보여야 합니다.");
const destinationMove = CityChase.moveToDestination(game, "thief", firstDenseRoad);
assert.equal(destinationMove.ok, true);
assert.deepEqual(destinationMove.path, ["hideout", "p0", firstDenseRoad], "서버가 애니메이션용 전체 이동 경로를 제공해야 합니다.");
assert.equal(game.pawns.find(pawn => pawn.id === "thief-1").position, firstDenseRoad);
assert.equal(CityChase.currentPawn(game).id, "thief-2", "목적지를 한 번 선택하면 정확한 칸 수를 이동하고 다음 말 차례가 됩니다.");

const hideGame = CityChase.createGame("p", "경찰");
CityChase.addPlayer(hideGame, "t", "도둑");
assignSeats(hideGame);
CityChase.startGame(hideGame);
CityChase.placeSecrets(hideGame, "p", { gems: ["market", "air"], undercover: "burger" });
assert.equal(CityChase.hide(hideGame, "t").ok, true, "비밀기지에서는 이동 대신 숨을 수 있어야 합니다.");
assert.equal(hideGame.pawns.find(pawn => pawn.id === "thief-1").hidingTurns, 1);

const rescueGame = CityChase.createGame("p", "경찰");
CityChase.addPlayer(rescueGame, "t", "도둑");
assignSeats(rescueGame);
CityChase.startGame(rescueGame);
CityChase.placeSecrets(rescueGame, "p", { gems: ["market", "air"], undercover: "burger" });
rescueGame.pawns.filter(pawn => pawn.team === "police").forEach((pawn, index) => { pawn.position = `p${10 + index}`; });
const rescuer = rescueGame.pawns.find(pawn => pawn.id === "thief-1");
const captive = rescueGame.pawns.find(pawn => pawn.id === "thief-2");
const jailApproach = CityChase.BOARD.neighbors("jail", "thief")[0].id;
rescuer.position = jailApproach;
captive.position = "jail";
captive.status = "jailed";
assert.equal(CityChase.roll(rescueGame, "t", 1).ok, true);
assert.equal(CityChase.moveStep(rescueGame, "t", "jail").ok, true);
assert.equal(rescueGame.pending.type, "rescue");
assert.equal(CityChase.choosePending(rescueGame, "t", "thief-2").ok, true);
assert.equal(rescuer.position, "hideout");
assert.equal(captive.position, "hideout");
assert.equal(captive.status, "active", "동료가 구금 구역으로 들어와 구출하면 두 도둑 모두 비밀기지로 돌아와야 합니다.");

const failedEscapeGame = CityChase.createGame("p", "경찰");
CityChase.addPlayer(failedEscapeGame, "t", "도둑");
assignSeats(failedEscapeGame);
CityChase.startGame(failedEscapeGame);
CityChase.placeSecrets(failedEscapeGame, "p", { gems: ["market", "air"], undercover: "burger" });
const failedEscapePawn = failedEscapeGame.pawns.find(pawn => pawn.id === "thief-1");
failedEscapePawn.position = "jail";
failedEscapePawn.status = "jailed";
assert.equal(CityChase.roll(failedEscapeGame, "t", 3).ok, true);
assert.equal(
  failedEscapeGame.lastAction,
  "도둑 1번이 3을 굴려 탈출에 실패했습니다. 구금 구역에 남습니다."
);

const cardGame = CityChase.createGame("p", "경찰");
CityChase.addPlayer(cardGame, "t", "도둑");
assignSeats(cardGame);
CityChase.startGame(cardGame);
CityChase.placeSecrets(cardGame, "p", { gems: ["market", "air"], undercover: "burger" });
const trickNext = CityChase.BOARD.neighbors("p1", "police")[0].id;
assert.equal(CityChase.placeTrick(cardGame, "t", "p1", trickNext).ok, true);
assert.equal(cardGame.resources.thief.trickCards, 8);
cardGame.turnIndex = 3;
cardGame.turnMode = "awaiting_roll";
assert.equal(CityChase.placeCheck(cardGame, "p", "p2").ok, true);
assert.equal(cardGame.resources.police.checkCards, 5);

const captureGame = CityChase.createGame("p", "경찰");
CityChase.addPlayer(captureGame, "t", "도둑");
assignSeats(captureGame);
CityChase.startGame(captureGame);
CityChase.placeSecrets(captureGame, "p", { gems: ["market", "air"], undercover: "burger" });
const captureTarget = CityChase.BOARD.neighbors("p0", "police").find(item => item.id !== "hideout").id;
captureGame.pawns.find(pawn => pawn.id === "thief-1").position = captureTarget;
captureGame.pawns.find(pawn => pawn.id === "thief-2").status = "jailed";
captureGame.pawns.find(pawn => pawn.id === "thief-2").position = "jail";
captureGame.pawns.find(pawn => pawn.id === "thief-3").status = "jailed";
captureGame.pawns.find(pawn => pawn.id === "thief-3").position = "jail";
captureGame.pawns.find(pawn => pawn.id === "police-1").position = "p0";
captureGame.turnIndex = 3;
captureGame.turnMode = "awaiting_roll";
assert.equal(CityChase.roll(captureGame, "p", 1).ok, true);
assert.equal(CityChase.moveStep(captureGame, "p", captureTarget).ok, true);
assert.equal(captureGame.phase, "ended");
assert.equal(captureGame.winnerTeam, "police", "도둑 세 명을 모두 체포하면 경찰팀이 이겨야 합니다.");

const gemGame = CityChase.createGame("p", "경찰");
CityChase.addPlayer(gemGame, "t", "도둑");
assignSeats(gemGame);
CityChase.startGame(gemGame);
CityChase.placeSecrets(gemGame, "p", { gems: ["market", "air"], undercover: "burger" });
gemGame.resources.thief.securedGems = 1;
const runner = gemGame.pawns.find(pawn => pawn.id === "thief-1");
runner.position = "p0";
runner.carryingGem = true;
assert.equal(CityChase.roll(gemGame, "t", 1).ok, true);
assert.equal(CityChase.moveStep(gemGame, "t", "hideout").ok, true);
assert.equal(gemGame.phase, "ended");
assert.equal(gemGame.winnerTeam, "thief", "보석 두 개를 비밀기지로 옮기면 도둑팀이 이겨야 합니다.");

const html = fs.readFileSync(path.resolve(__dirname, "..", "learning", "games", "citychase", "citychase.html"), "utf8");
const css = fs.readFileSync(path.resolve(__dirname, "..", "learning", "games", "citychase", "citychase.css"), "utf8");
const client = fs.readFileSync(path.resolve(__dirname, "..", "learning", "games", "citychase", "citychase.js"), "utf8");
const server = fs.readFileSync(path.resolve(__dirname, "..", "game-hub-server", "server.js"), "utf8");
assert.match(html, /id="boardCanvas"/);
assert.match(html, /id="roomCode"/);
assert.match(client, /allowedPlayerCounts:\s*\[2,\s*3,\s*4,\s*5,\s*6\]/);
assert.match(client, /CITYCHASE_ACTION/);
assert.match(css, /min-height:\s*44px/);
assert.match(css, /city-board-v12\.webp/, "이동선 아래에는 나무가 아닌 장애물 없는 잔디 배경을 사용해야 합니다.");
assert.doesNotMatch(css, /transform:\s*rotate\(180deg\)/, "배경 전체를 뒤집어 캐릭터 방향을 바꾸면 안 됩니다.");
assert.match(client, /도둑팀 비밀기지[\s\S]*경찰팀 구금 구역/, "두 시작 구역은 그림 추측이 아니라 실제 이름판으로 표시해야 합니다.");
assert.match(css, /\.node::after\s*\{[^}]*inset:\s*-11px/s, "작은 보드 칸에도 44px 이상의 터치 영역이 필요합니다.");
assert.match(client, /lineWidth = isRail \? 18/, "실제 이동 칸은 말보다 넓은 보드게임 경로로 연결되어야 합니다.");
assert.match(css, /width: 54px;\s*\n\s*height: 54px;/, "플레이어 말은 배경 시민보다 확실히 크게 보여야 합니다.");
assert.match(css, /width: clamp\(70px, 6vw, 90px\)/, "상가 말은 축소된 부지 안에 들어가야 합니다.");
assert.match(html, /id="sceneryLayer"[\s\S]*id="lotsLayer"/, "시민 장식과 건물 부지는 실제 이동선 아래의 별도 레이어여야 합니다.");
assert.ok(CityChase.BOARD.BUILDINGS.every(building => building.lot?.width && building.lot?.height && building.lot?.style), "7개 부지의 크기와 형태를 각각 정의해야 합니다.");
assert.match(client, /function renderLots[\s\S]*building\.lot[\s\S]*buildingLot/, "각 건물 부지는 데이터 좌표로 렌더링해야 합니다.");
assert.match(client, /city-kid-dog\.svg[\s\S]*city-bike-kid\.svg/, "배경 시민과 동물은 단순한 평면 2D SVG 장식을 사용해야 합니다.");
assert.match(client, /node\.kind === "building" \? "수색"/, "빨간 진입 레인의 끝은 실제 건물 수색 칸이어야 합니다.");
assert.equal(CityChase.BOARD.EDGES.filter(edge => edge.kind === "building-lane").length, 7, "7개 건물마다 빨간 진입 레인이 하나씩 있어야 합니다.");
assert.ok(CityChase.BOARD.EDGES.filter(edge => edge.kind === "building-lane").every(edge => edge.displayArrow && edge.teams?.includes("thief")), "건물 진입 레인은 굵은 빨간 화살표 도둑 경로여야 합니다.");
assert.match(client, /secret-gem\.png[\s\S]*secret-alarm\.png/, "보석과 경보 장치는 전용 그림 자산을 사용해야 합니다.");
assert.match(client, /function playSfx[\s\S]*ClassGameSfx[\s\S]*function showBoardEffect/, "중요 사건은 시각효과와 사이트 공용 효과음을 함께 사용해야 합니다.");
assert.match(css, /height: 100dvh; min-height: 0; overflow: hidden/, "가로 화면에서는 게임 전체가 뷰포트 안에 고정되어야 합니다.");
assert.match(css, /width: min\(100%, calc\(100dvh - 68px\)\)/, "압축된 헤더 아래에서 정사각형 보드를 최대한 크게 보여줘야 합니다.");
assert.match(css, /\.gameHeader \{[^}]*min-height: 48px/s, "작은 화면의 게임 헤더는 한 줄 48px로 압축해야 합니다.");
assert.match(css, /\.pawnName \{ display: block;/, "학생 이름표는 모든 말에서 항상 보여야 합니다.");
assert.doesNotMatch(css, /\.pawnName \{[^}]*display:\s*none/s, "학생 이름표를 숨기면 안 됩니다.");
assert.doesNotMatch(client, /showName/, "말이 겹쳐도 학생 이름표를 임의로 숨기면 안 됩니다.");
assert.match(client, /function pawnClusterOffset[\s\S]*node\.x < 130[\s\S]*node\.x > 870/, "겹친 말과 이름표는 보드 안쪽으로 펼쳐야 합니다.");
assert.match(css, /@keyframes currentPawnGlow/, "현재 차례 말에는 쉽게 찾을 수 있는 발광 외곽선이 있어야 합니다.");
assert.match(client, /function animateMovement[\s\S]*move\.path[\s\S]*window\.setTimeout\(advance, 300\)/, "말은 서버가 보낸 경로를 따라 한 칸씩 움직여야 합니다.");
assert.match(css, /\.pawn\.moving[\s\S]*transition: left[\s\S]*@keyframes pawnTravelHop/, "이동 중인 말에는 위치 전환과 움직임 효과가 있어야 합니다.");
assert.match(client, /최종 목적지를 한 번 누르세요/, "주사위 뒤에는 최종 목적지를 한 번 선택하도록 안내해야 합니다.");
assert.match(server, /CityChase\.moveToDestination/, "멀티플레이 서버도 한 번의 목적지 선택을 처리해야 합니다.");
assert.match(client, /`\$\{actorLabel\} 행동 중`/, "대기 중에는 누가 행동 중인지 바로 보여야 합니다.");
assert.doesNotMatch(css, /min-width:\s*(?:820|900)px/, "Chromebook과 iPad에서 보드가 강제로 잘리면 안 됩니다.");
assert.match(css, /\.boardViewport[^}]*place-items: center[^}]*overflow: hidden/s, "가로 화면 보드는 스크롤 없이 전체가 보여야 합니다.");
assert.match(css, /\.boardPanel \{ height: auto; aspect-ratio: 1 \/ 1; \}/, "iPad 세로 화면에서도 정사각형 보드 전체를 보여야 합니다.");
assert.match(css, /@media\s*\(orientation:\s*portrait\),\s*\(max-width:\s*820px\)/);
assert.match(html, /class="lobbyWorkspace"/, "대기 화면은 접속과 참가자 상태를 한눈에 보여줘야 합니다.");
assert.match(html, /id="lobbyScreen"[^>]*data-multiplayer-lobby/, "대기실은 사이트 공통 멀티플레이 UI 규칙을 사용해야 합니다.");
assert.doesNotMatch(html, /각자의 기기로 참가/, "대기실 제목줄에 접속 방식을 중복 설명하면 안 됩니다.");
assert.match(css, /\.lobbyTop \{ display: grid; grid-template-columns: minmax\(0, 1fr\) auto minmax\(230px, 320px\)/, "대기 화면의 주요 행동은 첫 화면에 보여야 합니다.");
assert.match(css, /\.lobbyWorkspace \{ display: grid; grid-template-columns: minmax\(240px, \.72fr\) minmax\(360px, 1\.28fr\)/, "Chromebook 가로 화면에서는 접속과 참가자 패널을 간결하게 나란히 보여야 합니다.");
assert.match(css, /\[data-multiplayer-lobby\] \.lobbyConnect \.mp-lobby-card[\s\S]*width: 100%; min-height: 0; margin: 0;[\s\S]*background: #fffdf5/s, "활성 접속 카드는 불투명한 밝은 패널로 읽기 쉽게 보여야 합니다.");
assert.match(css, /\.lobbyConnect \{ grid-column: 1; grid-row: 1; \}[\s\S]*\.playersPanel \{ grid-column: 2; grid-row: 1; \}[\s\S]*\.teamSeatPanel \{ grid-column: 1 \/ -1; grid-row: 2; \}/s, "접속 정보와 참가자는 같은 줄에, 팀 슬롯은 그 아래 전체 폭에 배치해야 합니다.");
assert.match(css, /\.teamSeat:disabled \{ cursor: not-allowed; opacity: 1; \}/, "잠긴 팀 슬롯도 안내 문구를 선명하게 읽을 수 있어야 합니다.");
assert.match(css, /@media \(max-width: 900px\)[\s\S]*\.lobbyWorkspace \{ grid-template-columns: 1fr; \}/, "iPad 세로 화면에서는 대기 패널을 한 열로 배치해야 합니다.");
assert.match(client, /function avatarOf\(playerId\)/, "학생 아바타는 멀티플레이 대기실 정보에서 가져와야 합니다.");
assert.match(css, /lobby-city\.(?:webp|jpg)/, "제공한 도심 그림을 대기실 전용 배경으로 사용해야 합니다.");
assert.match(html, /경찰과 도둑/, "공개 제목은 한국어 이름인 경찰과 도둑을 사용해야 합니다.");
assert.match(html, /COPS AND ROBBERS/i, "공개 제목은 영어 이름을 함께 병기해야 합니다.");
assert.doesNotMatch(html, /도둑잡기|잠복경찰|속임수 카드|검문 카드/, "공개 화면에 원작을 특정하는 명칭과 설명서식 용어가 남으면 안 됩니다.");
assert.doesNotMatch(server, /도둑잡기|잠복경찰|속임수 카드|검문 카드/, "서버 안내 문구도 독자적인 용어를 사용해야 합니다.");
assert.match(html, /가짜 단서 카드/, "도둑팀의 유도 카드는 학생이 기능을 바로 이해할 수 있는 이름을 사용해야 합니다.");
assert.doesNotMatch(html + client + server, /방향 표지/, "모호한 방향 표지 명칭이 공개 안내에 남으면 안 됩니다.");
assert.match(css, /\.lobbyShell::before[\s\S]*linear-gradient\(#ffffff18, #ffffff18\)[\s\S]*cover[\s\S]*filter: none/s, "대기실 배경은 과도하게 흐리거나 탈색하지 않고 원본 선명도를 유지해야 합니다.");
assert.match(client, /pawnName[\s\S]*pawnFaceMarkup\(controllers\)[\s\S]*pawnNumber/, "말에는 학생 이름·아바타·말 번호가 함께 보여야 합니다.");
assert.match(html, /id="policeSeatSlots"[\s\S]*id="thiefSeatSlots"/, "대기실에는 경찰팀·도둑팀 슬롯이 모두 있어야 합니다.");
assert.match(client, /sendAction\("CHOOSE_SEAT"/, "학생은 빈 슬롯을 눌러 자기 팀 자리를 선택해야 합니다.");
assert.match(client, /canStart:\s*\(\)\s*=>\s*!!state\?\.lobbyReady/, "공용 시작 버튼도 팀 슬롯 완료 상태를 확인해야 합니다.");
assert.match(client, /말 1 \+ 말 3 공동[\s\S]*말 2 \+ 말 3 공동/, "2인 팀은 세 번째 말을 공동으로 맡는다고 안내해야 합니다.");
assert.match(server, /action === "CHOOSE_SEAT"/, "팀 슬롯 선택은 서버 권한 상태로 동기화해야 합니다.");
assert.match(css, /--police: #2374cc/, "경찰 말은 명확한 파란색이어야 합니다.");
assert.match(css, /--thief: #e9475f/, "도둑 말은 명확한 빨간색이어야 합니다.");
assert.match(client, /class="secretIcon gemIcon"/, "보석은 문자 기호 대신 선명한 전용 이미지 배지를 사용해야 합니다.");
assert.match(client, /class="secretIcon undercoverIcon"/, "경보 장치는 문자 기호 대신 선명한 전용 이미지 배지를 사용해야 합니다.");
assert.match(css, /\.pawn:disabled \{ opacity: 1; \}/, "대기 중인 플레이어 말도 흐려지지 않아야 합니다.");
assert.match(css, /\.pawn\.carrying::after[\s\S]*secret-gem\.png/, "말이 든 보석도 선명한 전용 이미지 배지로 보여야 합니다.");
assert.match(server, /citychase:\s*6/);
assert.match(server, /CITYCHASE_ACTION/);
assert.match(server, /CityChase\.stateFor/);

console.log("citychase-unit: board, secrecy, movement, cards, capture, gem victory and responsive contract ok");
