import assert from "node:assert/strict";
import fs from "node:fs";

const html = fs.readFileSync(new URL("../index.html", import.meta.url), "utf8");

assert.match(
  html,
  /<h1 class="learning-hub-title">기초학력<\/h1>/,
  "The student activity hub must use 기초학력 as its umbrella title.",
);

const expectedCategories = [
  ["01", "문해·수리", "category-literacy-panel"],
  ["02", "교과 탐구", "category-exploration-panel"],
  ["03", "보드게임", "category-boardgame-panel"],
  ["04", "개인 퍼즐", "category-puzzle-panel"],
  ["05", "예술", "category-arts-panel"],
];

const categorySections = html.match(/<section class="[^"]*category-section[^"]*" data-category-section/g) || [];
assert.equal(categorySections.length, expectedCategories.length, "The hub must expose exactly five category sections.");

for (const [number, label, panelId] of expectedCategories) {
  assert.match(
    html,
    new RegExp(
      `aria-expanded="false" aria-controls="${panelId}"[^>]*>[\\s\\S]*?<span class="category-number" aria-hidden="true">${number}<\\/span>[\\s\\S]*?<span class="category-label">${label}<\\/span>`,
    ),
    `The ${label} category must start collapsed and control its own panel.`,
  );
  assert.match(
    html,
    new RegExp(`id="${panelId}" class="(?:worksheet-container|game-card-grid) category-panel"[^>]* hidden>`),
    `The ${label} panel must be hidden until its category is selected.`,
  );
}

assert.ok(
  html.includes(
    "categorySections.forEach((section) => setCategoryExpanded(section, section === selectedSection && shouldExpand));",
  ),
  "Selecting one category must collapse the other categories.",
);
assert.ok(
  html.includes("const shouldExpand = toggle.getAttribute('aria-expanded') !== 'true';"),
  "Selecting the open category again must collapse it.",
);
assert.ok(
  html.includes(".category-panel[hidden] {") && html.includes("display: none !important;"),
  "Collapsed category panels must stay visually hidden despite their grid or flex layout.",
);

const categorySectionCss = html.slice(
  html.indexOf(".category-section {"),
  html.indexOf(".category-heading {"),
);
assert.ok(
  categorySectionCss.includes("overflow: visible;") && categorySectionCss.includes("z-index: 30;"),
  "Expanded category sections must allow nested worksheet menus to render outside the panel without being clipped or covered.",
);

const studentButtonCss = html.slice(
  html.indexOf(".worksheet-container a,"),
  html.indexOf(".worksheet-group {"),
);
assert.ok(
  studentButtonCss.includes("min-height: 72px;") && studentButtonCss.includes("padding: 11px 15px;"),
  "Student activity buttons must use the compact 72px height while remaining comfortably above the touch-target minimum.",
);

console.log("Index category accordion contract passed.");
