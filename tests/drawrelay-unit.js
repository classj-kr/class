"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const DrawRelay = require(path.resolve(__dirname, "..", "game-hub-server", "drawrelay"));

function createPlayers(count) {
  const game = DrawRelay.createGame("p1", "하나");
  for (let index = 2; index <= count; index += 1) {
    assert.equal(DrawRelay.addPlayer(game, `p${index}`, `참가자${index}`).ok, true);
  }
  return game;
}

const threePlayer = createPlayers(3);
assert.equal(DrawRelay.startGame(threePlayer).ok, false, "3인전은 시작할 수 없어야 합니다.");
assert.match(DrawRelay.startGame(threePlayer).error, /4명부터 8명/);

assert.deepEqual(Object.keys(DrawRelay.PACKS), ["proverbs", "history"]);
for (const pack of Object.values(DrawRelay.PACKS)) {
  assert.ok(pack.words.length >= 8, "8인전에도 서로 다른 제시어가 있어야 합니다.");
  assert.equal(new Set(pack.words).size, pack.words.length, "꾸러미 안에 중복 제시어가 없어야 합니다.");
}
const proverbContext = { window: {} };
for (const filename of ["proverbs-data.js", "proverbs-essential-additions.js"]) {
  const source = fs.readFileSync(path.resolve(__dirname, "..", "learning", "literacy-numeracy", "proverbs", filename), "utf8");
  vm.runInNewContext(source, proverbContext, { filename });
}
const sourceProverbs = new Set(proverbContext.window.PROVERB_BANKS.ko.map(item => item.proverb));
for (const proverb of DrawRelay.PACKS.proverbs.words) {
  assert.ok(sourceProverbs.has(proverb), `속담 앱에 없는 제시어: ${proverb}`);
}

const eightPlayer = createPlayers(8);
assert.equal(DrawRelay.addPlayer(eightPlayer, "p9", "아홉").ok, false, "9번째 참가자는 입장할 수 없어야 합니다.");
assert.equal(DrawRelay.startGame(eightPlayer, "history", () => 0.3).ok, true, "역사 꾸러미로 8인전까지 시작할 수 있어야 합니다.");

const game = createPlayers(4);
assert.equal(DrawRelay.startGame(game, "science", () => 0.42, 1000).ok, true);
assert.equal(game.phase, "playing");
assert.equal(game.actionType, "draw");
assert.equal(game.deadline, 61000);

const firstState = DrawRelay.stateFor(game, "p1");
const secondState = DrawRelay.stateFor(game, "p2");
assert.equal(firstState.prompt.type, "word");
assert.equal(secondState.prompt.type, "word");
assert.notEqual(firstState.prompt.text, secondState.prompt.text, "첫 제시어는 플레이어마다 달라야 합니다.");
assert.deepEqual(firstState.chains, [], "진행 중에는 전체 릴레이를 공개하면 안 됩니다.");

const rawDrawing = [{ color: "#not-allowed", width: 99, points: [[-4, 30.2], [1004, 800]] }];
assert.equal(DrawRelay.submit(game, "p1", { strokes: rawDrawing }, 2000).ok, true);
assert.equal(DrawRelay.stateFor(game, "p1").mySubmitted, true);
assert.equal(DrawRelay.stateFor(game, "p2").mySubmitted, false);
assert.equal(DrawRelay.stateFor(game, "p2").prompt.type, "word", "다른 사람의 제출 내용은 단계 종료 전 보이지 않아야 합니다.");
assert.equal(DrawRelay.submit(game, "p1", { strokes: [] }).ok, false, "같은 단계에 두 번 제출할 수 없어야 합니다.");

for (let index = 2; index <= 4; index += 1) {
  assert.equal(DrawRelay.submit(game, `p${index}`, { strokes: [{ color: "#3a86ff", width: 5, points: [[index, index]] }] }, 2000).ok, true);
}
assert.equal(game.step, 1);
assert.equal(game.actionType, "guess");
assert.equal(DrawRelay.assignedChainIndex(game, "p1"), 3, "책자는 다음 사람 방향으로 순환해야 합니다.");
assert.equal(Object.hasOwn(DrawRelay.stateFor(game, "p1").prompt, "authorId"), false, "진행 중에는 앞사람의 신원을 공개하지 않아야 합니다.");

for (let index = 1; index <= 4; index += 1) {
  assert.equal(DrawRelay.submit(game, `p${index}`, { text: `추측 ${index}` }, 3000).ok, true);
}
assert.equal(game.step, 2);
assert.equal(game.actionType, "draw");

for (let index = 1; index <= 4; index += 1) {
  assert.equal(DrawRelay.submit(game, `p${index}`, { strokes: [{ color: "#ef476f", width: 7, points: [[10, 10], [20, 20]] }] }, 4000).ok, true);
}
assert.equal(game.step, 3);
assert.equal(game.actionType, "guess");

for (let index = 1; index <= 4; index += 1) {
  assert.equal(DrawRelay.submit(game, `p${index}`, { text: `마지막 추측 ${index}` }, 5000).ok, true);
}
assert.equal(game.phase, "reveal");

const revealState = DrawRelay.stateFor(game, "p2");
assert.equal(revealState.chains.length, 4);
for (const chain of revealState.chains) {
  assert.equal(chain.entries.length, 5, "제시어와 네 사람의 결과가 모두 있어야 합니다.");
  assert.equal(new Set(chain.entries.slice(1).map(entry => entry.authorId)).size, 4, "각 플레이어는 책자마다 한 번씩 참여해야 합니다.");
}
const sanitizedStroke = revealState.chains[0].entries[1].strokes[0];
assert.equal(sanitizedStroke.color, "#172033");
assert.equal(sanitizedStroke.width, 24);
assert.deepEqual(sanitizedStroke.points, [[0, 30], [1000, 700]]);

assert.equal(DrawRelay.resetToLobby(game).ok, true);
assert.equal(game.phase, "lobby");
assert.deepEqual(game.chains, []);

const custom = createPlayers(4);
assert.equal(DrawRelay.configure(custom, "custom", "").ok, true);
assert.equal(DrawRelay.startGame(custom, "custom").ok, false);
assert.equal(DrawRelay.submitWords(custom, "p1", ["고양이"], custom.topicRevision).ok, false);
assert.equal(DrawRelay.configure(custom, "custom", "  동물  ").ok, true);
const topicRevision = custom.topicRevision;
for (const invalid of [[], [""], ["  "], ["가", "나", "다"], ["가".repeat(41)], [null], ["고양이", "고 양 이"]]) {
  assert.equal(DrawRelay.submitWords(custom, "p1", invalid, topicRevision).ok, false);
}
assert.equal(DrawRelay.submitWords(custom, "outsider", ["고양이"], topicRevision).ok, false);
assert.equal(DrawRelay.submitWords(custom, "p1", ["고양이"], topicRevision).ok, true);
assert.equal(DrawRelay.submitWords(custom, "p2", ["고 양 이"], topicRevision).ok, false);
assert.deepEqual(DrawRelay.stateFor(custom, "p2").myWords, []);
assert.ok(!JSON.stringify(DrawRelay.stateFor(custom, "p2")).includes("고양이"), "다른 사람과 방장에게 제시어를 미리 공개하면 안 됩니다.");
assert.deepEqual(DrawRelay.stateFor(custom, "p1").myWords, ["고양이"]);
assert.equal(DrawRelay.stateFor(custom, "p2").players[0].wordCount, 1);
assert.equal(DrawRelay.configure(custom, "custom", "음식").ok, true);
assert.deepEqual(custom.customWords, {});
assert.equal(DrawRelay.submitWords(custom, "p1", ["고양이"], topicRevision).ok, false, "이전 주제의 늦은 제출은 거부해야 합니다.");
assert.equal(DrawRelay.configure(custom, "custom", "가".repeat(61)).ok, false);
assert.equal(custom.topic, "음식");
assert.equal(DrawRelay.submitWords(custom, "p1", ["김밥"], custom.topicRevision).ok, true);
assert.equal(DrawRelay.configure(custom, "history").ok, true);
assert.deepEqual(custom.customWords, {});

for (const count of [4, 8]) {
  for (const randomValue of [0, 0.3, 0.9999]) {
    const round = createPlayers(count);
    DrawRelay.configure(round, "custom", "자유롭게 그리기");
    for (let index = 2; index <= count; index += 1) {
      assert.equal(DrawRelay.submitWords(round, `p${index}`, [`말${index}`, `그림${index}`], round.topicRevision).ok, true);
    }
    assert.equal(DrawRelay.canStart(round), false, "방장도 제시어를 내야 합니다.");
    assert.equal(DrawRelay.startGame(round, "custom").ok, false);
    DrawRelay.submitWords(round, "p1", ["방장제시어"], round.topicRevision);
    assert.equal(DrawRelay.canStart(round), true);
    const savedWords = structuredClone(round.customWords);
    assert.equal(DrawRelay.startGame(round, "custom", () => randomValue).ok, true);
    assert.equal(new Set(round.chains.map(chain => chain.entries[0].text)).size, count);
    assert.equal(new Set(round.chains.map(chain => chain.entries[0].authorId)).size, count);
    for (const player of round.players) {
      const view = DrawRelay.stateFor(round, player.id);
      assert.ok(!savedWords[player.id].includes(view.prompt.text), "첫 그림에는 자기 제시어가 배정되면 안 됩니다.");
      assert.equal(Object.hasOwn(view.prompt, "authorId"), false);
      assert.deepEqual(view.myWords, []);
    }
    assert.equal(DrawRelay.configure(round, "history").ok, false);
    assert.equal(DrawRelay.submitWords(round, "p1", ["수정"], round.topicRevision).ok, false);
    DrawRelay.resetToLobby(round);
    assert.deepEqual(round.customWords, {});
    assert.equal(DrawRelay.canStart(round), false);
  }
}

DrawRelay.configure(custom, "custom", "동물");
DrawRelay.submitWords(custom, "p2", ["기린"], custom.topicRevision);
DrawRelay.removePlayer(custom, "p2");
assert.equal(custom.customWords.p2, undefined);
DrawRelay.addPlayer(custom, "p2", "다시 참가");
assert.deepEqual(DrawRelay.stateFor(custom, "p2").myWords, []);

const html = fs.readFileSync(path.resolve(__dirname, "..", "learning", "games", "drawrelay", "drawrelay.html"), "utf8");
assert.match(html, /gameId:\s*GAME_ID/);
assert.match(html, /autoCreate:\s*false/);
assert.match(html, /hostTab.+addEventListener.+click.+lobby\.createRoom\(\)/);
assert.match(html, /minPlayers:\s*4/);
assert.match(html, /maxPlayers:\s*8/);
assert.match(html, /<option value="proverbs">속담<\/option>/);
assert.match(html, /<option value="history">역사<\/option>/);
assert.match(html, /<option value="custom">자유주제<\/option>/);
assert.doesNotMatch(html, /<option value="(?:general|science|society)">/);
assert.match(html, /id=["']drawingCanvas["']/);
assert.match(html, /pointerdown/);
assert.match(html, /SUBMIT_DRAWING/);
assert.match(html, /SUBMIT_GUESS/);
assert.match(html, /다음 장 공개/);
assert.ok(fs.existsSync(path.resolve(__dirname, "..", "learning", "games", "drawrelay", "styles.css")));

const hub = fs.readFileSync(path.resolve(__dirname, "..", "index.html"), "utf8");
assert.match(hub, /learning\/games\/drawrelay\/drawrelay(?:\.html)?/);
assert.match(hub, />그림 릴레이</);

const server = fs.readFileSync(path.resolve(__dirname, "..", "game-hub-server", "server.js"), "utf8");
assert.match(server, /drawrelay:\s*8/);
assert.match(server, /DRAWRELAY_ACTION/);
assert.match(server, /DrawRelay\.stateFor/);
assert.match(server, /scheduleDrawRelayDeadline/);

console.log("drawrelay-unit: built-in packs, private custom words, topic resets, non-self assignments and relay flow ok");
