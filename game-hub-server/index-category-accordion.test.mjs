import assert from "node:assert/strict";
import fs from "node:fs";

// 메인 메뉴는 한 단계다(2026-11-18): 묶음은 늘 펼쳐 두고 과목 드롭다운만 접었다 편다.
const html = fs.readFileSync(new URL("../index.html", import.meta.url), "utf8");

assert.ok(
  !html.includes('class="learning-hub-title"'),
  "The 기초학력 title line was removed to save space.",
);
assert.match(
  html,
  /<h1 class="hub-visually-hidden">기초학력<\/h1>/,
  "A heading stays for screen readers only.",
);

const expectedCategories = [
  ["worksheet-title", "문해·수리·교과", "category-literacy-panel"],
  ["boardgame-title", "게임", "category-boardgame-panel"],
];
const categorySections = html.match(/<section class="[^"]*category-section[^"]*" data-category-section/g) || [];
assert.equal(categorySections.length, expectedCategories.length, "The hub has two always-open category groups.");
assert.ok(!html.includes('class="category-toggle"'), "Categories are not collapsible any more.");
assert.ok(!html.includes("category-arts-panel"), "The hidden duplicate arts group was removed.");

for (const [headingId, label, panelId] of expectedCategories) {
  assert.ok(
    html.includes(`<h2 id="${headingId}" class="category-legend">${label}</h2>`),
    `The ${label} name sits on the group border instead of a separate bar.`,
  );
  assert.match(
    html,
    new RegExp(`<div id="${panelId}" class="worksheet-container category-panel">`),
    `The ${label} subjects are always visible.`,
  );
}

assert.ok(html.includes('src="assets/hub-accordion.js?'), "Subject menus keep the shared accordion motion controller.");
assert.ok(html.includes("ClassroomHubAccordion.create(hubContent)"), "Subject menus use the shared accordion controller.");

assert.match(
  html,
  /<div class="hub-top-row">\s*<div class="auth-panel"/,
  "The profile card shares a row with the room-number box.",
);
assert.ok(
  html.includes('class="hub-title-link hub-room-dock"') && html.includes('id="hubRoomForm"'),
  "The room-number box sits at the right end of the profile row.",
);
assert.ok(
  html.includes("body:has(#hubContent:not([hidden]):not(.hub-preview)) .hub-room-dock")
    && /\.hub-title-link\.hub-room-dock \{\s*display: none;/.test(html),
  "The room-number box appears only when the signed-in menu is usable.",
);

// 로그인 전에는 메뉴 이름만 보이고 과목은 펼쳐지지 않는다(2026-11-18).
assert.ok(
  html.includes("hubContent.classList.toggle('hub-preview', on);") && html.includes("hubContent.inert = on;"),
  "Before sign-in the menu names are visible but inert.",
);
assert.match(
  html,
  /showHubPreview\(true\);\s*toggleGuestMode\.hidden = siteAccess\.mode !== 'open';/,
  "Only the signed-out landing shows the menu preview.",
);

const studentButtonCss = html.slice(
  html.indexOf(".worksheet-container a,"),
  html.indexOf(".worksheet-group {"),
);
const buttonHeight = Number((studentButtonCss.match(/min-height:\s*(\d+)px/) || [])[1]);
assert.ok(buttonHeight >= 44, `Student activity buttons stay above the 44px touch-target minimum (now ${buttonHeight}px).`);

console.log("Index category menu contract passed.");
