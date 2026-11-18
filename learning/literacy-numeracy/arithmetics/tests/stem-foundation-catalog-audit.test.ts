import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

import { stemWorksheetCatalog } from "../lib/arithmetic-worksheets.ts";
import {
  STEM_BRIDGE_KINDS,
  STEM_FOUNDATION_KINDS,
  STEM_FOUNDATION_TITLES,
} from "../lib/stem-foundation-workouts.ts";

const root = process.cwd();
const stemRoot = path.join(root, "app", "arithmetic", "stem");

test("공대 진학 전 이공계 기초는 대학 수학으로 넘어가기 전 필수 6장으로 압축한다", () => {
  assert.equal(stemWorksheetCatalog.length, 6);
  assert.equal(new Set(stemWorksheetCatalog.map(({ name }) => name)).size, 6);
  assert.equal(new Set(stemWorksheetCatalog.map(({ route }) => route)).size, 6);
  assert.ok(stemWorksheetCatalog.every(({ grade }) => grade === "이공계 기초"));

  const actualKinds = stemWorksheetCatalog.slice(0, 6).map(({ route }) => (
    new URL(`https://worksheet.local${route}`).searchParams.get("kind")
  ));
  assert.deepEqual(actualKinds, [...STEM_BRIDGE_KINDS]);


  for (const [index, kind] of STEM_BRIDGE_KINDS.entries()) {
    assert.equal(stemWorksheetCatalog[index].name, STEM_FOUNDATION_TITLES[kind]);
    assert.equal(stemWorksheetCatalog[index].title, STEM_FOUNDATION_TITLES[kind]);
  }

  for (const universityCourse of [
    "최소제곱",
    "대각화",
    "삼중적분",
    "라플라스",
    "푸리에",
    "수치해석",
  ]) {
    assert.ok(!stemWorksheetCatalog.some(({ title }) => title.includes(universityCourse)));
  }
});

test("공용 이공계 페이지는 주소의 kind가 바뀌면 해당 학습지로 갱신한다", () => {
  const source = fs.readFileSync(path.join(stemRoot, "foundation", "page.tsx"), "utf8");
  assert.match(source, /useSearchParams/);
  assert.match(source, /searchParams\.get\("kind"\)/);
  assert.match(source, /isStemBridgeKind\(requested\)/);
  assert.match(source, /key=\{kind\}/);
  assert.match(source, /pageClassName="stem-foundation-page"/);
  assert.doesNotMatch(source, /window\.location\.search/);

  const worksheetSource = fs.readFileSync(
    path.join(root, "app", "arithmetic", "high-school", "components", "geometry-choice-worksheet.tsx"),
    "utf8",
  );
  assert.match(worksheetSource, /problemFactory \? source : rotateChoices/);

  const stylesheet = fs.readFileSync(
    path.join(root, "app", "arithmetic", "high-school", "high-school.css"),
    "utf8",
  );
  assert.match(stylesheet, /\.stem-foundation-page[\s\S]*?minmax\(min-content,\s*1fr\)/);
});

test("겹치던 옛 이공계 주소는 새 통합 학습지로 이동한다", () => {
  const redirects = {
    "complex-polar-demoivre": "complex-polar",
    "euler-complex": "complex-polar",
    matrices: "matrix-systems",
    "determinants-inverses": "matrix-systems",
    "cayley-hamilton-rotation": "vector-spaces-rank",
    "partial-derivatives": "partial-derivatives",
    "conic-integral-areas": "multiple-integrals",
    "arc-length-surface-area": "multiple-integrals",
    "integral-applications": "multiple-integrals",
  } as const;

  for (const [directory, kind] of Object.entries(redirects)) {
    const source = fs.readFileSync(path.join(stemRoot, directory, "page.tsx"), "utf8");
    assert.match(
      source,
      new RegExp(`StemLegacyRedirect target="\\/arithmetic\\/stem\\/foundation\\?kind=${kind}"`),
      directory,
    );
    assert.doesNotMatch(source, /GeometryChoiceWorksheet/, directory);
  }

  const redirectSource = fs.readFileSync(path.join(stemRoot, "stem-legacy-redirect.tsx"), "utf8");
  assert.match(redirectSource, /window\.location\.replace\(target\)/);
  assert.match(redirectSource, /href=\{target\}/);
});
