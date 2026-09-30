"use strict";

const assert = require("assert");
const fs = require("fs");
const path = require("path");

const gameDirectory = path.join(__dirname, "..", "learning", "games", "kingdom-trails");
const html = fs.readFileSync(path.join(gameDirectory, "kingdom-trails.html"), "utf8");
const css = fs.readFileSync(path.join(gameDirectory, "kingdom-trails.css"), "utf8");
const client = fs.readFileSync(path.join(gameDirectory, "kingdom-trails.js"), "utf8");

assert.match(html, /id="gameScreen"/);
assert.match(html, /id="currentTilePreview"/);
assert.match(html, /id="boardViewport"/);
assert.match(html, /id="bgm"/);
assert.match(html, /assets\/sound\/music-control\.js/);
assert.ok(html.indexOf("game-topbar") < html.indexOf("boardViewport"), "현재 차례 정보가 게임판보다 먼저 와야 합니다.");
assert.doesNotMatch(html, /class="[^"]*hero/);

assert.match(css, /\.button,.icon-button,.claim-button\{min-height:44px/);
assert.match(css, /@media\(max-width:1180px\)/);
assert.match(css, /@media\(max-width:900px\)/);
assert.match(css, /@media\(max-width:768px\) and \(orientation:portrait\)/);
assert.match(css, /height:calc\(100dvh - 152px\)/);
assert.match(css, /body:has\(\.game-screen:not\(\.hidden\)\)\{overflow:hidden\}/);
assert.match(css, /#12221894/);
assert.match(css, /#18271d66/);
assert.doesNotMatch(css, /#122218d9|#18271db8/);
assert.match(css, /\.board-panel\{height:690px;min-height:690px\}/);

assert.match(client, /allowedPlayerCounts:\s*\[2, 3, 4\]/);
assert.match(client, /KINGDOMTRAILS_ACTION/);
assert.match(client, /suggestedPlacement/);
assert.match(client, /window\.ClassGameSfx/);
assert.match(client, /MUSIC_TRACKS/);
assert.doesNotMatch(client, /soundBtn|SOUND_KEY|audioContext/);

const musicFiles = [
  "kingdom-trails-01-table.ogg",
  "kingdom-trails-02-stone-road.ogg",
  "kingdom-trails-03-quiet-rampart.ogg"
];
for (const fileName of musicFiles) {
  const musicPath = path.join(gameDirectory, "assets", "sound", fileName);
  assert.ok(fs.existsSync(musicPath), `${fileName}: 카르카손 배경음악 파일이 있어야 합니다.`);
  assert.ok(fs.statSync(musicPath).size > 1000000, `${fileName}: 정상적인 OGG 음악 파일이어야 합니다.`);
}
const imagePath = path.join(gameDirectory, "assets", "images", "kingdom-countryside.webp");
assert.ok(fs.existsSync(imagePath), "AI 배경 이미지가 프로젝트 폴더에 있어야 합니다.");
assert.ok(fs.statSync(imagePath).size > 100000, "임시 도형이 아닌 실제 이미지 자산이어야 합니다.");

console.log("kingdomtrails-layout-contract: ok");
