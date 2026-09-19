import assert from "node:assert/strict";
import fs from "node:fs";

const html = fs.readFileSync(new URL("../index.html", import.meta.url), "utf8");

assert.match(
  html,
  /<strong>정보·컴퓨터<\/strong><small>\(Computing\)<\/small>/,
  "The information-computing menu must keep the Korean title while using a compact English subtitle.",
);
assert.doesNotMatch(
  html,
  /<small>\(Information &amp; Computing\)<\/small>/,
  "The information-computing subtitle must not wrap because of the older long wording.",
);

assert.match(
  html,
  /href="learning\/inquiry\/periodic-table\/"[\s\S]*?<strong>주기율표<\/strong><small>\(Periodic Table\)<\/small>/,
  "The periodic-table menu must use the concise Korean title and English translation.",
);
assert.doesNotMatch(
  html,
  /<strong>단주기 주기율표<\/strong>|<small>\(시험 필수 원소 1~20\)<\/small>/,
  "The portal menu must not show implementation details in place of an English subtitle.",
);
assert.match(
  html,
  /href="learning\/inquiry\/human-body\/"[\s\S]*?<strong>인체 모형<\/strong><small>\(Human Body Model\)<\/small>/,
  "The body-learning menu must describe the interactive model focus.",
);
assert.doesNotMatch(
  html,
  /<strong>인체 탐험<\/strong><small>\(Human Body Explorer\)<\/small>|<strong>인체<\/strong><small>\(Human Body\)<\/small>/,
  "The portal menu must not use an exploration metaphor or an overly broad label.",
);

assert.match(
  html,
  /href="learning\/inquiry\/korea-map\/"[\s\S]*?<strong>국내 지도<\/strong><small>\(Korea Maps\)<\/small>/,
  "Artifacts, trips, geography and the relief map are tabs of one concise Korea Maps menu item.",
);
assert.doesNotMatch(
  html,
  /<strong>\uD55C\uAD6D\uC0AC \uBCF4\uBB3C\uC9C0\uB3C4<\/strong><small>\(Korean History Treasure Map\)<\/small>/,
  "The Korean-history museum menu must not use a treasure-map metaphor.",
);

console.log("Index menu copy contract passed.");
