import assert from "node:assert/strict";
import test from "node:test";

import { arithmeticWorksheetCatalog } from "../lib/arithmetic-worksheets.ts";
import { readFileSync } from "node:fs";

test("초1 학습지는 실제 유형명을 쓰고 암산 표시를 붙이지 않는다", () => {
  const gradeOne = arithmeticWorksheetCatalog.filter(({ grade }) => grade === "초1");
  assert.deepEqual(gradeOne.map(({ title }) => title), [
    "1부터 9까지 수 세기",
    "한 자리 수 덧셈·뺄셈",
    "두 자리 수 덧셈·뺄셈",
    "주고받은 뒤의 수 구하기",
    "10 모으기·가르기",
    "10을 넘는 덧셈·뺄셈",
    "덧셈·뺄셈 빈칸 채우기",
    "두 자리 수 읽기",
    "뛰어 세기",
  ]);
  assert.equal(gradeOne.some(({ badge }) => badge === "암산"), false);
});

test("초2 학습지는 구형 순번 제목 대신 실제 훈련 유형명을 쓴다", () => {
  const gradeTwo = arithmeticWorksheetCatalog.filter(({ grade }) => grade === "초2");
  assert.deepEqual(gradeTwo.slice(0, 3).map(({ title }) => title), [
    "두 자리 수 세로셈",
    "세로셈 빈칸",
    "덧셈·뺄셈 빈칸",
  ]);
  for (const worksheet of gradeTwo) {
    assert.doesNotMatch(worksheet.name, /덧셈뺄셈[①②③]/u);
    assert.doesNotMatch(worksheet.title, /덧셈뺄셈[①②③]/u);
  }
});

test("암산과 암기 표시는 사용자가 지정한 학습지에만 붙인다", () => {
  assert.deepEqual(
    arithmeticWorksheetCatalog.filter(({ badge }) => badge === "암산").map(({ name }) => name),
    ["2덧셈·뺄셈 빈칸", "3보수뺄셈100", "3보수뺄셈1000", "3덧셈뺄셈②", "3곱셈②", "19단", "3나눗셈③", "4큰수곱셈", "5약수,배수", "5분수③", "6소수①"],
  );
  assert.deepEqual(arithmeticWorksheetCatalog.filter(({ badge }) => badge === "암기").map(({ name }) => name), ["제곱수"]);
});

test("초등 문제지 제목은 중·고등 문제지와 같은 23px 제목 규격을 쓴다", () => {
  const css = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");
  assert.match(css, /\.counting-sheet-title strong\s*\{[\s\S]*?font-size:\s*23px;/);
  assert.match(css, /\.counting-sheet-title strong\s*\{[\s\S]*?line-height:\s*1\.2;/);
  assert.match(css, /\.counting-sheet-title strong\s*\{[\s\S]*?font-family:\s*var\(--elementary-korean-font\);/);
});

test("목록의 모든 암산 학습지는 실제 문제지 제목에도 암산 딱지를 표시한다", () => {
  const mentalWorksheets = arithmeticWorksheetCatalog.filter(({ badge }) => badge === "암산");
  for (const worksheet of mentalWorksheets) {
    assert.ok(worksheet.route);
    const pagePath = worksheet.route!.startsWith("/arithmetic/")
      ? `../app/arithmetic/${worksheet.route!.replace("/arithmetic/", "")}/page.tsx`
      : `../app${worksheet.route}/page.tsx`;
    const source = readFileSync(new URL(pagePath, import.meta.url), "utf8");
    if (worksheet.name === "2덧셈·뺄셈 빈칸") assert.match(source, /mentalMath/, worksheet.route!);
    else assert.match(source, /className="a4-sheet counting-sheet mental-math-sheet /, worksheet.route!);
  }
  const css = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");
  assert.match(css, /\.mental-math-sheet \.counting-sheet-title::after\s*\{[\s\S]*?content:\s*"암산";/);
  assert.match(css, /\.mental-math-sheet :where\([\s\S]*?\.multiplication-question,[\s\S]*?\.digit-equation,[\s\S]*?\.complement-row,[\s\S]*?input,[\s\S]*?button[\s\S]*?\)\s*\{[\s\S]*?font-family:\s*"Suneung Math", "STIX Two Math"[\s\S]*?font-synthesis:\s*none;[\s\S]*?font-weight:\s*400;/);
});

test("제곱수 학습지는 암기 딱지와 2·5제곱수 입력칸을 쓴다", () => {
  const worksheet = arithmeticWorksheetCatalog.find(({ name }) => name === "제곱수");
  assert.equal(worksheet?.badge, "암기");
  const source = readFileSync(new URL("../app/arithmetic/square-numbers/page.tsx", import.meta.url), "utf8");
  const css = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");
  assert.equal(source.includes('className="a4-sheet counting-sheet memory-math-sheet '), true);
  assert.equal(source.includes('data-testid="square-memory-input"'), true);
  assert.equal(source.includes("<small>/41 정답</small>"), true);
  assert.equal(css.includes('content: "암기";'), true);
});
test("초등 목록 버튼과 실제 학습지 제목은 같은 유형명을 쓴다", () => {
  // 목록 버튼은 폭이 좁아 영어 병기까지 넣으면 카드가 커지므로, 이 학습지만 목록엔 짧은 제목을 쓴다.
  const catalogShortTitleExceptions = new Set<string>();
  for (const worksheet of arithmeticWorksheetCatalog) {
    if (!worksheet.route?.startsWith("/arithmetic/") || worksheet.route.includes("?")) continue;
    if (catalogShortTitleExceptions.has(worksheet.name)) continue;
    const directory = worksheet.route.replace("/arithmetic/", "");
    const source = readFileSync(new URL(`../app/arithmetic/${directory}/page.tsx`, import.meta.url), "utf8");
    const literalTitle = source.match(/<strong>([^<{]+)\{answerSheet \?/u)?.[1];
    if (literalTitle) assert.equal(literalTitle, worksheet.title, worksheet.route);
  }
});

test("가로 계산식은 작은 글씨로 왼쪽 정렬하고 불필요한 안내띠를 표시하지 않는다", () => {
  const css = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");
  assert.match(css, /\.mixed-calculation-expression\s*\{[\s\S]*?font-size:\s*20px;/);
  assert.match(css, /\.mixed-calculation-expression strong\s*\{[\s\S]*?text-align:\s*left;/);

  const pages = [
    "grade-4-angle-estimation", "grade-4-fraction", "grade-5-decimals",
    "grade-5-divisors-multiples", "grade-5-fraction-1", "grade-5-fraction-2",
    "grade-5-fraction-3", "grade-5-mixed-calculation",
    "grade-6-decimals-1", "grade-6-fraction", "grade-6-mixed-calculation",
    "grade-6-proportion",
  ];
  for (const page of pages) {
    const source = readFileSync(new URL(`../app/arithmetic/${page}/page.tsx`, import.meta.url), "utf8");
    assert.doesNotMatch(source, /<p className="[^"]*guide/);
  }

  const primeNumbers = readFileSync(new URL("../app/arithmetic/grade-5-prime-numbers/page.tsx", import.meta.url), "utf8");
  assert.match(primeNumbers, /소수\(素數\) 찾기/);
  assert.match(primeNumbers, /<p className="prime-number-guide">약수가 2개\(1과 자기 자신\)인 수<\/p>/);

  const decomposition = readFileSync(new URL("../app/arithmetic/grade-5-natural-number-decomposition/page.tsx", import.meta.url), "utf8");
  assert.match(decomposition, /곱셈은 \*로 입력하세요\./);
  assert.match(decomposition, /answerSheet \|\| isExample/);
  assert.match(decomposition, /problems\.slice\(1\)\.map/);
  assert.match(decomposition, /<small>\/14 정답<\/small>/);
});

test("주고받기 문제는 동물 친구 이름과 어린이 눈높이 표현을 쓴다", () => {
  const source = readFileSync(new URL("../app/arithmetic/give-and-take-1/page.tsx", import.meta.url), "utf8");
  assert.match(source, /const FRIENDS: Friend\[\] = \["토끼", "거북이", "호랑이"\]/);
  assert.match(source, /세 친구가 가지고 있는 카드는 각각 몇 장입니까\?/);
  assert.doesNotMatch(source, /지혜|슬기|용기|세 사람이/);
});
test("초4~6 제목은 번호표나 포괄어 대신 실제 훈련 유형을 설명한다", () => {
  const upperElementary = arithmeticWorksheetCatalog.filter(({ grade }) => ["초4", "초5", "초6"].includes(grade));
  const vagueTitles = new Set(["곱셈", "나눗셈", "분수", "소수", "원기둥", "쌓기나무"]);
  for (const worksheet of upperElementary) {
    assert.equal(/[①②③④⑤]/u.test(worksheet.title), false, worksheet.title);
    assert.equal(vagueTitles.has(worksheet.title), false, worksheet.title);
  }

  const expectedTitles = new Map([
    ["4분수", "분모가 같은 대분수의 덧셈·뺄셈"],
    ["단위변환", "단위 변환"],
    ["5혼합계산", "자연수의 혼합 계산"],
    ["자연수분해", "자연수를 소수의 곱으로 나타내기"],
    ["프라임넘버", "소수(素數) 찾기"],
    ["5약수,배수", "최대공약수·최소공배수"],
    ["5분수③", "분수의 크기 비교"],
    ["6소수②", "소수의 곱셈·나눗셈과 반올림"],
    ["6소수③", "소수의 나눗셈과 몫·나머지"],
    ["6비례식", "비례식·비례배분"],
    ["6직육면체", "직육면체의 겉넓이·부피"],
    ["6쌓기나무", "쌓기나무의 개수와 세 방향 모양"],
  ]);
  for (const [name, title] of expectedTitles) {
    assert.equal(upperElementary.find((worksheet) => worksheet.name === name)?.title, title, name);
  }
});

test("혼합수의 자연수와 분수 숫자는 같은 글자 크기 기준을 쓴다", () => {
  const css = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");
  assert.match(css, /\.grade-four-fraction-number\s*\{[^}]*font-size:\s*1em;/);
  assert.match(css, /\.fraction-number\s*\{[^}]*font-size:\s*1em;/);
  assert.match(css, /\.grade-five-fraction-one-number\s*\{[^}]*font-size:\s*1em;/);
  assert.match(css, /\.grade-five-fraction-two-expression \.grade-five-fraction-one-number\s*\{[^}]*font-size:\s*1em;/);
  assert.match(css, /\.grade-six-fraction-expression \.grade-five-fraction-one-number\s*\{[^}]*font-size:\s*1em;/);
});
