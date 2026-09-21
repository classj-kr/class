// 방에 다시 들어왔을 때 판을 제대로 되돌려 주는지 지키는 검사.
//
// 두 가지가 실제로 어긋나 있었다.
//  1) room.dobbleTimer 가 저장 제외 목록에서 빠져 있었다. setTimeout 핸들은 JSON 으로
//     바꿀 수 없어서, 도블 방은 저장 자체가 통째로 실패했다. 서버가 다시 뜨면 방이
//     사라지고 화면에는 "RECONNECTING… n/20" 만 돌았다.
//  2) 손님으로 다시 들어오는 길에서 도블·코드네임 판을 다시 보내 주지 않았다.
//     연결은 됐는데 화면이 멈춘 채로 있었다.
const fs = require("fs");
const path = require("path");
const assert = require("assert/strict");

const ROOT = path.join(__dirname, "..");
const SERVER = fs.readFileSync(path.join(ROOT, "game-hub-server/server.js"), "utf8");
const { snapshotRoom, isTransientRoomValue } = require(path.join(ROOT, "game-hub-server/room-snapshots.js"));

// ── 1. 시계는 절대 저장에 섞이면 안 된다 ────────────────────────────────
{
  const timer = setTimeout(() => {}, 60000);
  timer.unref?.();
  const room = {
    gameId: "dobble",
    roomCode: "1234",
    hostId: "p1",
    clients: new Map([["p1", { meta: { playerId: "p1", role: "host", clientToken: "t" } }]]),
    dobbleTimer: timer,
    somethingElseTimer: timer,
    dobble: { round: 3 }
  };

  assert.ok(isTransientRoomValue("dobbleTimer", timer), "dobbleTimer 를 저장에서 걸러 내지 않는다");
  assert.ok(isTransientRoomValue("somethingElseTimer", timer), "이름이 Timer 로 끝나는 것을 걸러 내지 않는다");
  assert.ok(isTransientRoomValue("whatever", timer), "생김새가 시계인 것을 걸러 내지 않는다");
  assert.ok(!isTransientRoomValue("dobble", { round: 3 }), "게임 판까지 걸러 내면 안 된다");

  const snapshot = snapshotRoom(room);
  assert.ok(snapshot, "방을 저장 꼴로 바꾸지 못한다");
  assert.equal(snapshot.state.dobbleTimer, undefined, "저장에 dobbleTimer 가 섞였다");
  assert.equal(snapshot.state.somethingElseTimer, undefined, "저장에 시계가 섞였다");
  assert.deepEqual(snapshot.state.dobble, { round: 3 }, "게임 판이 저장되지 않았다");

  // 실제로 JSON 으로 바뀌어야 한다. 하나라도 시계가 섞이면 여기서 터진다.
  assert.doesNotThrow(() => JSON.stringify(snapshot), "저장한 것을 JSON 으로 바꿀 수 없다");
  clearTimeout(timer);
}

// ── 2. 다시 들어온 사람에게 보내는 판 목록이 네 군데 모두 같아야 한다 ───
{
  const lines = SERVER.split("\n");
  const blocks = [];
  let current = null;
  for (let i = 0; i < lines.length; i += 1) {
    const matched = lines[i].match(/^\s*if \((?:room|existingRoom|currentRoom)\.([a-z0-9]+)\)\s*(?:\{)?\s*([a-zA-Z0-9]+)Broadcast\(/);
    // 퀴즈레이스처럼 중괄호를 열고 다음 줄에서 보내는 꼴도 있다.
    const opened = lines[i].match(/^\s*if \((?:room|existingRoom|currentRoom)\.([a-z0-9]+)\)\s*\{\s*$/);
    if (matched || opened) {
      if (!current) current = { line: i + 1, games: new Set() };
      current.games.add((matched || opened)[1]);
      current.gap = 0;
      continue;
    }
    // 퀴즈레이스처럼 여러 줄짜리가 중간에 끼어든다. 몇 줄쯤은 눈감아 주되,
    // 한참 이어지면 목록이 끝난 것으로 본다.
    if (current) {
      current.gap = (current.gap || 0) + 1;
      if (current.gap <= 4) continue;
      if (current.games.size >= 10) blocks.push(current);
      current = null;
    }
  }
  if (current && current.games.size >= 10) blocks.push(current);

  assert.ok(blocks.length >= 3, "다시 들어올 때 판을 보내는 자리를 찾지 못했다: " + blocks.length);

  const first = [...blocks[0].games].sort();
  for (const block of blocks.slice(1)) {
    const games = [...block.games].sort();
    const missing = first.filter(game => !block.games.has(game));
    const extra = games.filter(game => !blocks[0].games.has(game));
    assert.deepEqual({ missing, extra }, { missing: [], extra: [] },
      `${blocks[0].line}번째 줄과 ${block.line}번째 줄의 판 목록이 다르다. ` +
      `빠진 것: ${missing.join(", ") || "없음"} / 더 있는 것: ${extra.join(", ") || "없음"}`);
  }

  for (const game of ["dobble", "codenames", "clue"]) {
    assert.ok(blocks[0].games.has(game), `${game} 판을 다시 보내 주지 않는다`);
  }
  console.log(`room-resume-contract.js: 판 목록 ${blocks.length}군데가 ${first.length}개 게임으로 모두 같음`);
}

console.log("room-resume-contract.js: all assertions passed");
