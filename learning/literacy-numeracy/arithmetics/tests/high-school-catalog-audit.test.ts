import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

import "./arithmetic-concept-boundary.test.ts";

const root = process.cwd();
const catalogSource = fs.readFileSync(path.join(root, "lib", "arithmetic-worksheets.ts"), "utf8");
const catalogSection = catalogSource.match(
  /export const highSchoolWorksheetCatalog[\s\S]*?\n\];/,
)?.[0];

assert.ok(catalogSection, "고등 학습지 목록을 찾을 수 없습니다.");

const catalogRoutes = [...catalogSection.matchAll(/route:\s*"\/arithmetic\/high-school\/([^"]+)"/g)]
  .map((match) => match[1]);
const pageRoot = path.join(root, "app", "arithmetic", "high-school");
const pageRoutes = fs.readdirSync(pageRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && fs.existsSync(path.join(pageRoot, entry.name, "page.tsx")))
  .map((entry) => entry.name);

test("고등 목차는 중복 없이 실제 페이지와 일치한다", () => {
  assert.equal(catalogRoutes.length, 66);
  assert.equal(new Set(catalogRoutes).size, catalogRoutes.length);
  assert.deepEqual(catalogRoutes.filter((route) => !pageRoutes.includes(route)), []);
  assert.deepEqual(
    pageRoutes.filter((route) => !catalogRoutes.includes(route)).sort(),
    ["arc-sector", "geometric-transformations"],
  );
});

test("추가 학습지도 임시 보충 분류 대신 실제 과목과 해당 순서에 둔다", () => {
  assert.doesNotMatch(catalogSection, /grade:\s*"보충"/);
  assert.match(catalogSection, /grade:\s*"공수1"[^}\n]*name:\s*"분수식의 계산"/);
  assert.match(catalogSection, /grade:\s*"공수1"[^}\n]*name:\s*"유리·무리·절댓값 방정식"/);
  assert.match(catalogSection, /grade:\s*"미적2"[^}\n]*name:\s*"sec·csc·cot 미분"/);
  assert.match(catalogSection, /grade:\s*"미적2"[^}\n]*name:\s*"곡선의 길이"/);
  assert.match(catalogSection, /grade:\s*"미적2"[^}\n]*name:\s*"회전체의 부피"/);

  assert.ok(catalogRoutes.indexOf("advanced-factorization") < catalogRoutes.indexOf("factorization-rational"));
  assert.ok(catalogRoutes.indexOf("factorization-rational") < catalogRoutes.indexOf("complex-numbers"));
  assert.ok(catalogRoutes.indexOf("cubic-quartic-equations") < catalogRoutes.indexOf("equation-transformations"));
  assert.ok(catalogRoutes.indexOf("equation-transformations") < catalogRoutes.indexOf("inequality-intervals"));
  assert.ok(catalogRoutes.includes("trigonometric-derivatives"));
  assert.ok(catalogRoutes.includes("advanced-differentiation"));
});

test("통합된 옛 학습지 주소는 새 종합 학습지로 이동한다", () => {
  const redirects = new Map([
    ["arc-sector", "/arithmetic/high-school/radian-measure"],
    ["geometric-transformations", "/arithmetic/high-school/coordinate-lines"],
  ]);

  for (const [route, target] of redirects) {
    const source = fs.readFileSync(path.join(pageRoot, route, "page.tsx"), "utf8");
    assert.match(source, new RegExp(`redirect\\("${target.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"\\)`));
    assert.doesNotMatch(source, /ChoiceWorksheet|create[A-Z]\w+Problems/);
  }
});

test("고등 문제지 과목명은 같은 정식 표기를 사용한다", () => {
  const source = pageRoutes
    .map((route) => fs.readFileSync(path.join(pageRoot, route, "page.tsx"), "utf8"))
    .join("\n");
  const sharedSource = fs.readFileSync(path.join(pageRoot, "combinatorics-worksheet.tsx"), "utf8");

  assert.doesNotMatch(`${source}\n${sharedSource}`, /공통수학1|subject="확통"/);
  assert.doesNotMatch(source, /<span>보충<\/span>/);
  assert.match(`${source}\n${sharedSource}`, /공통수학 1/);
  assert.match(source, /확률과 통계/);
});

test("생성기는 정답 뒤에 수를 붙인 가짜 선택지를 만들지 않는다", () => {
  for (const filename of [
    "foundation-generated-workouts.ts",
    "geometry-generated-workouts.ts",
    "exponential-log-function-workouts.ts",
    "stem-generated-workouts.ts",
  ]) {
    const source = fs.readFileSync(path.join(root, "lib", filename), "utf8");
    assert.doesNotMatch(source, /unique\.push\(`\$\{answer\}\+\$\{/);
    assert.doesNotMatch(source, /values\.push\(`\$\{answer\}\+\$\{/);
    assert.doesNotMatch(source, /\\text\{해 없음 \$\{/);
    assert.match(source, /실제 오답 후보가 3개보다 적습니다/);
  }
});
