import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import assert from "node:assert/strict";

function tsxFiles(directory: string): string[] {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) return tsxFiles(target);
    return entry.isFile() && entry.name.endsWith(".tsx") ? [target] : [];
  });
}

test("공통 객관식 패널을 여는 모든 화면이 패널 채점 함수를 전달한다", () => {
  const root = path.join(process.cwd(), "app", "arithmetic", "high-school");
  const missing = tsxFiles(root).flatMap((file) => {
    const source = fs.readFileSync(file, "utf8");
    const calls = source.match(/<WorksheetChoicePanel\b[\s\S]*?\/>/g) ?? [];
    return calls.some((call) => !/\bonGrade=/.test(call))
      ? [path.relative(process.cwd(), file)]
      : [];
  });
  assert.deepEqual(missing, []);
});

test("공통 객관식 패널은 선택 상태와 패널 내부 채점 버튼을 제공한다", () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "app", "arithmetic", "high-school", "components", "worksheet-choice-panel.tsx"),
    "utf8",
  );
  assert.match(source, /aria-pressed=/);
  assert.match(source, /onClick=\{onGrade\}/);
  assert.match(source, /전체 채점/);
  assert.match(source, /is-correct-answer/);
  assert.match(source, /is-wrong-answer/);
  assert.match(source, /정답입니다/);
  assert.match(source, /오답입니다/);
  assert.match(source, /problem\.latex/);
});

test("shared choice panel is a centered multi-column modal with visible grading states", () => {
  const css = fs.readFileSync(
    path.join(process.cwd(), "app", "arithmetic", "high-school", "high-school.css"),
    "utf8",
  );
  assert.match(css, /\.trig-derivative-answer-panel-backdrop\s*\{[\s\S]*?align-items:\s*center;[\s\S]*?justify-content:\s*center/);
  assert.match(css, /\.worksheet-choice-modal \.trig-derivative-answer-list\s*\{[\s\S]*?repeat\(auto-fit,\s*minmax\(330px,\s*1fr\)\)/);
  assert.match(css, /\.trig-derivative-choice\.is-correct-answer[\s\S]*?\{/);
  assert.match(css, /\.trig-derivative-choice\.is-wrong-answer[\s\S]*?\{/);
});

test("legacy high-school answer panels use the same modal, question preview, and grading colors", () => {
  const routes = [
    "complex-numbers",
    "equation-transformations",
    "exponents-radicals",
    "factorization-rational",
    "polynomial-add-subtract",
    "trigonometric-derivatives",
  ];

  for (const route of routes) {
    const source = fs.readFileSync(
      path.join(process.cwd(), "app", "arithmetic", "high-school", route, "page.tsx"),
      "utf8",
    );
    assert.match(source, /trig-derivative-answer-panel worksheet-choice-modal/, route);
    assert.match(source, /trig-derivative-answer-question/, route);
    assert.match(source, /is-correct/, route);
    assert.match(source, /is-wrong/, route);
    assert.match(source, /is-correct-answer/, route);
    assert.match(source, /is-wrong-answer/, route);
  }
});

test("legacy high-school answer choices use the shared visible button style", () => {
  const routes = [
    "complex-numbers",
    "equation-transformations",
    "exponents-radicals",
    "factorization-rational",
    "polynomial-add-subtract",
    "trigonometric-derivatives",
  ];
  for (const route of routes) {
    const source = fs.readFileSync(
      path.join(process.cwd(), "app", "arithmetic", "high-school", route, "page.tsx"),
      "utf8",
    );
    assert.match(source, /<button\s+className=\{`trig-derivative-choice/, route);
  }
});

test("worksheet toolbars do not expose layout-breaking review additions", () => {
  const roots = [
    path.join(process.cwd(), "app", "arithmetic", "middle-school"),
    path.join(process.cwd(), "app", "arithmetic", "high-school"),
  ];
  const offenders = roots.flatMap(tsxFiles).filter((file) => {
    const source = fs.readFileSync(file, "utf8");
    return /오답 보충|틀린 유형/.test(source);
  });
  assert.deepEqual(offenders, []);
});

test("inline algebra prompts render expressions and every Latin variable in full-size math", () => {
  const component = fs.readFileSync(
    path.join(process.cwd(), "app", "components", "inline-math-text.tsx"),
    "utf8",
  );
  const css = fs.readFileSync(path.join(process.cwd(), "app", "globals.css"), "utf8");
  assert.match(component, /text:\s*"a\+b",\s*latex:\s*"a\+b"/);
  assert.match(component, /\\\(\[A-Za-z0-9\].*A-Za-z0-9/);
  assert.match(component, /fallbackToken/);
  assert.match(component, /normalizeMathRun/);
  assert.match(css, /\.inline-math-text-formula\s*\{[\s\S]*?font-size:\s*1em/);
});
