import assert from "node:assert/strict";
import fs from "node:fs";

const home = fs.readFileSync(new URL("../index.html", import.meta.url), "utf8");
const voyage = fs.readFileSync(
  new URL("../learning/inquiry/age-of-exploration/public/index.html", import.meta.url),
  "utf8",
);

assert.match(
  home,
  /<a id="cds95GameLink"[\s\S]*?data-requires-player="true"[\s\S]*?data-player-handoff="query"/,
  "The home page must pass its authoritative player name to World Voyage.",
);
assert.doesNotMatch(
  voyage,
  /<input[^>]+id="studentName"/,
  "World Voyage must not ask for a separate player name.",
);
assert.match(
  voyage,
  /const mainEntryParams=new URLSearchParams\(location\.search\);\s*const mainPlayerName=String\(mainEntryParams\.get\('name'\)\|\|''\)\.trim\(\);/,
  "World Voyage must read the player name handed off in the ?name= query.",
);
// The entry screen no longer shows the name (it appears on the ship once inside),
// but a missing or malformed handoff must still block joining.
assert.match(
  voyage,
  /if\(!\/\^\[가-힣\]\{2,6\}\$\/\.test\(mainPlayerName\)\)\{[^}]*joinStartBtn\.disabled=true;\s*\}/,
  "World Voyage must refuse to start without a valid handed-off name.",
);
assert.match(
  voyage,
  /const name=mainPlayerName;/,
  "Joining World Voyage must use only the identity handed off by the home page.",
);
assert.doesNotMatch(
  voyage,
  /localStorage\.setItem\(['"]uw3-name['"]/,
  "World Voyage must not keep an independent player-name setting.",
);

console.log("World Voyage player identity handoff contract passed.");
