import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const read = (path) => fs.readFileSync(path, "utf8");

test("student entry screens do not repeat the menu name in decorative headers", () => {
  const cases = [
    ["learning/literacy-numeracy/reading/index.html", /<h1>독해 자습<\/h1>/],
    ["learning/literacy-numeracy/spelling/index.html", /class="compact-title"/],
    ["learning/literacy-numeracy/math-ox/index.html", /class="page-title"/],
    ["learning/literacy-numeracy/metacognition/index.html", /class="page-(?:title|sub)"/],
    ["learning/inquiry/information-computing/typing/index.html", /<h1>타자연습<\/h1>/],
    ["learning/inquiry/science-lab/index.html", /<h1>과학 실험실<\/h1>/],
    ["learning/inquiry/korea-map/index.html", /<h1>국내 지도<\/h1>|class="brand-title"/],
    ["learning/inquiry/periodic-table/index.html", /class="app-title"/],
    ["learning/inquiry/human-body/index.html", /class="(?:sim-title-group|hub-hero)"/],
  ];

  for (const [path, repeatedHeading] of cases) {
    assert.doesNotMatch(read(path), repeatedHeading, `${path} repeats the menu name`);
  }

  for (const shelf of ["korea-tales", "world-tales", "world-novels"]) {
    assert.doesNotMatch(
      read(`learning/literacy-numeracy/story-books/${shelf}/index.html`),
      /<h1>/,
      `${shelf} repeats the shelf name above the books`,
    );
  }
});

test("phonics prioritizes the next lesson at Chromebook and iPad widths", () => {
  const html = read("learning/literacy-numeracy/phonics/index.html");
  const app = read("learning/literacy-numeracy/phonics/app.js");
  const styles = read("learning/literacy-numeracy/phonics/styles.css");

  assert.doesNotMatch(html, /PHONICS · SPELLING · WORD STUDY|class="course-heading"/);
  assert.match(html, /class="progress-strip"/);
  assert.match(html, /id="continueLesson"/);
  assert.match(app, /data\.lessons\.find\(\(lesson\) => !saved\.done\.includes\(lesson\.id\)\)/);
  assert.doesNotMatch(app, /<div class="stage-summary">[^\n]*courseAreaFor/);
  assert.match(styles, /@media\(max-width:1100px\).*lesson-list\{grid-template-columns:repeat\(2/s);
  assert.match(styles, /@media\(max-width:820px\).*lesson-list\{grid-template-columns:repeat\(2/s);
  assert.match(styles, /@media\(max-width:540px\).*lesson-list\{grid-template-columns:1fr/s);
  assert.match(styles, /continue-lesson.*min-height:48px/s);
});

test("shared student entry controls retain tablet-sized touch targets", () => {
  assert.match(read("learning/literacy-numeracy/story-books/lobby.css"), /\.back-link\s*\{[^}]*min-height:\s*44px/s);
  assert.match(read("learning/literacy-numeracy/reading/style.css"), /\.student-header a\s*\{[^}]*min-height:\s*44px/s);
  assert.match(read("learning/inquiry/korea-map/styles.css"), /\.back-link,[\s\S]*?min-height:\s*44px/s);
  assert.match(read("learning/inquiry/periodic-table/styles.css"), /\.home-btn\s*\{[^}]*min-height:\s*44px/s);
});
