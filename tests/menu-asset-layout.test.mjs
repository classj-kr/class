import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

test("learning menus use the four top-level domains", () => {
  assert.deepEqual(
    fs.readdirSync(path.join(root, "learning"), { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .sort(),
    // class-race 는 과목 영역이 아니라 여러 앱이 함께 쓰는 학급 순위전 방이다(2026-09).
    ["arts", "class-race", "games", "inquiry", "literacy-numeracy"],
  );

  const menu = read("index.html");
  for (const href of [
    "learning/literacy-numeracy/reading/",
    "learning/literacy-numeracy/classical-chinese-idioms/",
    "learning/literacy-numeracy/story-books/korea-tales/",
    "learning/inquiry/human-body/",
    "learning/arts/music-listening/",
    "learning/arts/art-appreciation/museum/",
    "learning/arts/instrument-room/",
    "learning/arts/art-studio/",
  ]) {
    assert.match(menu, new RegExp(`href="${href.replaceAll(".", "\\.")}"`));
    assert.equal(fs.existsSync(path.join(root, href)), true, href);
  }
  assert.doesNotMatch(menu, /href="learning\/literacy-numeracy\/graph-studio\/"/);

  const teacherMenu = read("classtools/index.html");
  assert.match(teacherMenu, /href="\/learning\/literacy-numeracy\/graph-studio\/"/);
  assert.match(teacherMenu, /<h3 class="tool-name">그래프 그리기<\/h3>/);
  // 학급 대시보드는 따로 둔 카드가 아니라 「내 학급 · 그룹」 카드에서 그룹별로 연다.
  assert.match(teacherMenu, /id="main-groups-grid"/);
  assert.match(teacherMenu, /class="tool-card group-card" onclick="openGroupDashboard\(/);
  assert.match(teacherMenu, /window\.openGroupDashboard = function[\s\S]{0,200}\/classtools\/dashboard\.html\?groupId=/);
  assert.equal(fs.existsSync(path.join(root, "classtools/dashboard.html")), true);
  assert.doesNotMatch(teacherMenu, /<h3 class="tool-name">학급 대시보드<\/h3>/);
  assert.doesNotMatch(teacherMenu, /스마트 학급 대시보드|href="seating"|교실 자리 배치/);
  // 카드에는 이름만 둔다. 설명 줄과 화살표는 없고, 그림 글자는 읽어 주지 않게 가린다.
  assert.doesNotMatch(teacherMenu, /class="tool-(?:desc|arrow)"/);
  for (const [icon] of teacherMenu.matchAll(/<span class="tool-icon"[^>]*>/g)) {
    assert.match(icon, /aria-hidden="true"/, icon);
  }
});

test("menu-specific asset groups live with their menu", () => {
  const expected = [
    "learning/literacy-numeracy/vocabulary/assets/data/english-vocabulary-3000-v2.json",
    "learning/literacy-numeracy/vocabulary/assets/images/apple-v2.webp",
    "learning/inquiry/human-body/assets/images/anatomy-gallery-room-v2.webp",
    "learning/arts/art-appreciation/assets/sound/museum/gallery-01-portrait.ogg",
    "learning/arts/art-appreciation/assets/sound/museum/gallery-02-nature.ogg",
    "learning/arts/art-appreciation/assets/sound/museum/gallery-03-story.ogg",
    "learning/arts/art-appreciation/assets/sound/museum/gallery-04-line-color-imagination.ogg",
    "learning/arts/art-appreciation/assets/sound/museum/gallery-05-form-space.ogg",
    "learning/arts/classical-music/assets/images/background.webp",
    "learning/arts/korean-music/assets/images/background.webp",
    "learning/games/omok/assets/images/background.webp",
    "learning/games/omok/assets/sound/bgm.ogg",
    "learning/games/connect6/assets/images/background.webp",
    "learning/games/connect6/assets/sound/bgm.ogg",
  ];

  for (const relativePath of expected) {
    assert.equal(fs.existsSync(path.join(root, relativePath)), true, relativePath);
  }
});

test("music appreciation pages use owned backgrounds without promotional copy", () => {
  const classicalIndex = read("learning/arts/classical-music/index.html");
  const classicalBackground = read("learning/arts/classical-music/background.css");
  const koreanIndex = read("learning/arts/korean-music/index.html");
  const koreanBackground = read("learning/arts/korean-music/background.css");

  assert.match(classicalIndex, /href="background\.css"/);
  assert.match(koreanIndex, /href="background\.css"/);
  assert.match(classicalBackground, /assets\/images\/background\.webp/);
  assert.match(koreanBackground, /assets\/images\/background\.webp/);
  assert.doesNotMatch(classicalIndex, /문제은행|300문|3<\/b>\s*난이도|QUESTION BANK/);
});

test("museum galleries switch to their matching background music", () => {
  const index = read("learning/arts/art-appreciation/museum/index.html");
  const script = read("learning/arts/art-appreciation/museum/museum.js");

  assert.match(index, /museum\/gallery-01-portrait\.ogg/);
  for (const name of [
    "gallery-01-portrait.ogg",
    "gallery-02-nature.ogg",
    "gallery-03-story.ogg",
    "gallery-04-line-color-imagination.ogg",
    "gallery-05-form-space.ogg",
  ]) {
    assert.match(script, new RegExp(name.replaceAll(".", "\\.")));
  }
  assert.match(script, /setRoomMusic\(index\)/);
});

test("moved menu assets have no references to their former root locations", () => {
  const sources = [
    read("learning/literacy-numeracy/vocabulary/app.js"),
    read("learning/arts/art-appreciation/museum/index.html"),
    read("learning/games/omok/omok.html"),
    read("learning/games/connect6/connect6.html"),
    ...["circulation", "digestion", "excretion", "homeostasis", "nervous", "respiration"]
      .map((name) => read(`learning/inquiry/human-body/${name}/app.js`)),
  ].join("\n");

  assert.doesNotMatch(sources, /(?:\.\.\/){3}assets\/data\//);
  assert.doesNotMatch(sources, /(?:\.\.\/){3}assets\/images\/vocabulary\//);
  assert.doesNotMatch(sources, /(?:\.\.\/){3}assets\/images\/body-explorer\//);
  assert.doesNotMatch(sources, /body-explorer\/assets\/images\//);
  assert.doesNotMatch(sources, /(?:\.\.\/){2}assets\/images\/art\//);
  assert.doesNotMatch(sources, /(?:\.\.\/){2,3}assets\/sound\/art-(?:appreciation|museum)\.ogg/);
  assert.doesNotMatch(sources, /\/assets\/(?:images|sound)\/stone-board/);
});

// 아발론 역할 카드 주소는 글자 그대로의 파일 이름이 아니라 템플릿으로 만든다.
// 주소를 만드는 함수를 그대로 돌려, 나올 수 있는 주소를 모두 펼친다.
function avalonRoleCardUrls() {
  const lines = read("learning/games/avalon/avalon.html").split(/\r?\n/);
  const pick = (start) => {
    const line = lines.find((candidate) => candidate.startsWith(start));
    assert.ok(line, start);
    return line;
  };
  const context = {};
  vm.runInNewContext(
    `${pick("const ROLE_CARD_FILES=")}
${pick("function roleCardImagePath(")}
this.urls = Object.keys(ROLE_CARD_FILES).flatMap((role) => ["male", "female"].flatMap((characterStyle) =>
  [undefined, 1, 2, 3, 4].map((cardVariant) => roleCardImagePath({ role, characterStyle, cardVariant }))));`,
    context,
  );
  return [...new Set(context.urls)];
}

test("relocated static asset URLs resolve to files in the repository", () => {
  const sourceRoots = [
    path.join(root, "index.html"),
    path.join(root, "learning/games"),
    path.join(root, "learning/literacy-numeracy/spelling"),
  ];
  const sourceFiles = [];

  function collect(currentPath) {
    const stat = fs.statSync(currentPath);
    if (stat.isFile()) {
      if (/\.(?:css|html|js)$/.test(currentPath)) sourceFiles.push(currentPath);
      return;
    }
    for (const name of fs.readdirSync(currentPath)) collect(path.join(currentPath, name));
  }

  for (const sourcePath of sourceRoots) collect(sourcePath);

  const staticUrlPattern =
    /\/learning\/(?:games|literacy-numeracy|inquiry|arts)\/[^"'()\s]+?\.(?:mp3|webp)/g;
  const templated = new Set();
  for (const sourceFile of sourceFiles) {
    const source = fs.readFileSync(sourceFile, "utf8");
    const relativeFile = path.relative(root, sourceFile).split(path.sep).join("/");
    for (const url of source.match(staticUrlPattern) || []) {
      if (url.includes("${")) {
        templated.add(relativeFile);
        continue;
      }
      assert.equal(
        fs.existsSync(path.join(root, url.slice(1))),
        true,
        `${relativeFile} -> ${url}`,
      );
    }
  }

  // 템플릿 주소는 펼치는 방법을 아는 곳에서만 쓴다. 다른 파일에 생기면 여기에 펼치는 법을 더한다.
  assert.deepEqual([...templated], ["learning/games/avalon/avalon.html"]);
  const roleCardUrls = avalonRoleCardUrls();
  assert.ok(roleCardUrls.length >= 16, String(roleCardUrls.length));
  for (const url of roleCardUrls) {
    assert.match(url, /^\/learning\/games\/avalon\/assets\/images\/cards\/[a-z0-9-]+\.webp$/);
    assert.equal(fs.existsSync(path.join(root, url.slice(1))), true, `avalon.html -> ${url}`);
  }
});
