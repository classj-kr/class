const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const fruitBellPath = path.join(root, "learning", "games", "fruitbell", "fruitbell.html");
const html = fs.readFileSync(fruitBellPath, "utf8");

assert.ok(html.includes('id="flipBtn" class="flip" data-sfx="none"'));
assert.ok(html.includes('playFruitSfx("bell");'));
assert.ok(html.includes('bell:["/learning/games/fruitbell/assets/sound/sfx/bell-hit-01.ogg"]'));
assert.ok(html.includes('window.ClassGameSfx?.play("error")'));
assert.ok(html.includes('window.ClassGameSfx?.play("timeout")'));
assert.ok(html.includes('state.sfxCue=makeSfxCue("flip"'));
assert.ok(html.includes('state.sfxCue=makeSfxCue("bell-result"'));
assert.ok(html.includes("consumeSfxCue(state.sfxCue);"));
assert.ok(!html.includes("data:audio/wav;base64"));
assert.ok(!html.includes("createOscillator"));

const expectedFiles = [
  "answer-correct.ogg",
  "bell-hit-01.ogg",
  "card-flip-01.ogg",
  "card-flip-02.ogg",
  "card-flip-03.ogg",
  "cards-collected.ogg",
  "match-finish.ogg",
  "round-start.ogg",
];
const sfxDir = path.join(root, "learning", "games", "fruitbell", "assets", "sound", "sfx");
for (const file of expectedFiles) {
  const filePath = path.join(sfxDir, file);
  assert.ok(fs.existsSync(filePath), `Missing ${file}`);
  assert.ok(fs.statSync(filePath).size > 1_000, `${file} is unexpectedly small`);
}

const scripts = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)]
  .map((match) => match[1])
  .filter(Boolean);
assert.ok(scripts.length > 0, "No inline script found");
new Function(scripts.at(-1));

console.log("Fruit Bell file SFX contract passed.");
