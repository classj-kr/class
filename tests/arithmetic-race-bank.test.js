const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

// 문항은 학습지 생성기에서 만들어 적어 둔다(scripts/build-arithmetic-race-bank.mjs).
// 학급 순위전(learning/class-race)이 이 파일을 그대로 읽어 문제를 낸다.
const DATA_PATH = path.join(__dirname, "..", "learning", "literacy-numeracy", "arithmetic-race", "data.js");
const APPS_PATH = path.join(__dirname, "..", "learning", "class-race", "apps.js");

function loadQuestions() {
  const source = fs.readFileSync(DATA_PATH, "utf8");
  const marker = "window.ARITHMETIC_RACE_DATA = ";
  const start = source.indexOf(marker);
  const end = source.indexOf("\n];", start);

  assert.notEqual(start, -1, "ARITHMETIC_RACE_DATA 시작 위치를 찾을 수 없습니다.");
  assert.notEqual(end, -1, "ARITHMETIC_RACE_DATA 끝 위치를 찾을 수 없습니다.");

  return vm.runInNewContext(`(${source.slice(start + marker.length, end + 2)})`, Object.create(null));
}

// ── 분수 셈(정확한 값) ───────────────────────────────────

function gcd(left, right) {
  let a = left < 0n ? -left : left;
  let b = right < 0n ? -right : right;
  while (b) [a, b] = [b, a % b];
  return a || 1n;
}

function rational(numerator, denominator) {
  assert.notEqual(denominator, 0n, "0으로 나눌 수 없습니다.");
  const sign = denominator < 0n ? -1n : 1n;
  const divisor = gcd(numerator, denominator);
  return { n: (sign * numerator) / divisor, d: (sign * denominator) / divisor };
}

const add = (a, b) => rational(a.n * b.d + b.n * a.d, a.d * b.d);
const sub = (a, b) => rational(a.n * b.d - b.n * a.d, a.d * b.d);
const mul = (a, b) => rational(a.n * b.n, a.d * b.d);
const div = (a, b) => rational(a.n * b.d, a.d * b.n);
const equal = (a, b) => a.n === b.n && a.d === b.d;

// "3과 1/2", "7/8", "0.25", "12" 를 모두 정확한 분수로 읽는다.
function parseNumber(text) {
  const value = String(text).trim();
  const mixed = value.match(/^(-?\d+)[과와]\s*(\d+)\/(\d+)$/);
  if (mixed) {
    const whole = BigInt(mixed[1]);
    const sign = whole < 0n ? -1n : 1n;
    return rational(sign * ((whole < 0n ? -whole : whole) * BigInt(mixed[3]) + BigInt(mixed[2])), BigInt(mixed[3]));
  }
  const fraction = value.match(/^(-?\d+)\/(\d+)$/);
  if (fraction) return rational(BigInt(fraction[1]), BigInt(fraction[2]));
  const decimal = value.match(/^(-?)(\d+)(?:\.(\d+))?$/);
  if (decimal) {
    const places = (decimal[3] ?? "").length;
    const digits = BigInt(`${decimal[2]}${decimal[3] ?? ""}`);
    return rational((decimal[1] === "-" ? -1n : 1n) * digits, 10n ** BigInt(places));
  }
  return null;
}

// 문제 글을 그대로 계산한다. 학습지 생성기와 따로 셈해야 잘못 옮긴 글이 걸린다.
function evaluate(sentence) {
  const tokens = String(sentence)
    .replace(/[{}]/g, (bracket) => (bracket === "{" ? "(" : ")"))
    .match(/\d+[과와]\s*\d+\/\d+|\d+\/\d+|\d+(?:\.\d+)?|[+\-−×÷()]/g) ?? [];
  let position = 0;
  const peek = () => tokens[position];

  function factor() {
    if (peek() === "(") {
      position += 1;
      const value = expression();
      assert.equal(tokens[position], ")", `괄호가 맞지 않습니다: ${sentence}`);
      position += 1;
      return value;
    }
    const value = parseNumber(tokens[position]);
    assert.ok(value, `읽을 수 없는 수입니다: ${tokens[position]} (${sentence})`);
    position += 1;
    return value;
  }

  function term() {
    let value = factor();
    while (peek() === "×" || peek() === "÷") {
      const operator = tokens[position];
      position += 1;
      value = operator === "×" ? mul(value, factor()) : div(value, factor());
    }
    return value;
  }

  function expression() {
    let value = term();
    while (peek() === "+" || peek() === "-" || peek() === "−") {
      const operator = tokens[position];
      position += 1;
      value = operator === "+" ? add(value, term()) : sub(value, term());
    }
    return value;
  }

  const result = expression();
  assert.equal(position, tokens.length, `다 읽지 못한 식입니다: ${sentence}`);
  return result;
}

function roundTo(value, places) {
  const scale = 10n ** BigInt(places);
  const scaled = mul(value, rational(scale, 1n));
  const doubled = scaled.n * 2n;
  const rounded = (doubled + scaled.d) / (scaled.d * 2n);
  return rational(rounded, scale);
}

function lcm(left, right) {
  return (left * right) / Number(gcd(BigInt(left), BigInt(right)));
}

// ── 검사 ────────────────────────────────────────────────

test("모든 연산 문항은 필수 정보와 고를 만한 보기를 가진다", () => {
  const questions = loadQuestions();
  const ids = new Set();

  assert.ok(questions.length >= 200, `문항이 너무 적습니다: ${questions.length}`);
  for (const question of questions) {
    const where = `${question.id} · ${question.sentence}`;
    for (const key of ["id", "grade", "unit", "prompt", "sentence", "answer", "explanation"]) {
      assert.ok(String(question[key] ?? "").trim(), `${where}: ${key}가 비었습니다.`);
    }
    assert.equal(ids.has(question.id), false, `${where}: id가 겹칩니다.`);
    ids.add(question.id);

    // 학급 순위전 서버는 보기를 2~4개만 받는다(game-hub-server/quizrace.js).
    assert.ok(question.choices.length >= 3 && question.choices.length <= 4, `${where}: 보기가 ${question.choices.length}개입니다.`);
    assert.equal(new Set(question.choices).size, question.choices.length, `${where}: 보기가 겹칩니다.`);
    assert.ok(question.choices.includes(question.answer), `${where}: 보기에 정답이 없습니다.`);
    // 서버가 받는 길이는 120자다(quizrace.js). 숫자 답은 그보다 훨씬 짧아야 한다.
    const longest = question.answer.includes("$") ? 120 : 20;
    for (const choice of question.choices) {
      assert.ok(String(choice).trim(), `${where}: 빈 보기가 있습니다.`);
      assert.ok(String(choice).length <= longest, `${where}: 보기가 너무 깁니다(${choice}).`);
    }
    assert.ok(question.category === undefined, `${where}: category는 apps.js에서 만듭니다.`);
  }
});

test("문제 글을 그대로 계산하면 적어 둔 정답이 나온다", () => {
  const questions = loadQuestions();
  let checked = 0;

  for (const question of questions) {
    const where = `${question.id} · ${question.sentence} → ${question.answer}`;

    // 중·고등 문제는 식이라 여기서 되풀어 볼 수 없다. 대신 답과 보기가 학습지
    // 생성기가 준 식 그대로 온전히 실려 있는지 본다(학습지 쪽 검사가 값을 맡는다).
    if (question.sentence.includes("$")) {
      assert.match(question.sentence, /^\$.+\$$/, `${where}: 식이 $…$ 로 감싸이지 않았습니다.`);
      assert.match(question.answer, /^\$.+\$$/, `${where}: 정답이 $…$ 로 감싸이지 않았습니다.`);
      for (const choice of question.choices) {
        assert.match(choice, /^\$.+\$$/, `${where}: 보기 ${choice}가 $…$ 로 감싸이지 않았습니다.`);
        assert.equal((choice.match(/{/g) ?? []).length, (choice.match(/}/g) ?? []).length, `${where}: 보기 ${choice}의 중괄호가 맞지 않습니다.`);
        assert.doesNotMatch(choice, /undefined|NaN|Infinity/, `${where}: 보기 ${choice}가 깨졌습니다.`);
      }
      assert.doesNotMatch(question.prompt, /[$\\]/, `${where}: 묻는 말에 그려지지 않는 수식이 남았습니다.`);
      checked += 1;
      continue;
    }

    const answer = parseNumber(question.answer);
    assert.ok(answer, `${where}: 정답을 읽을 수 없습니다.`);

    if (question.unit === "최대공약수" || question.unit === "최소공배수") {
      const [left, right] = question.sentence.split("와").map((part) => Number(part.trim()));
      const expected = question.unit === "최대공약수" ? Number(gcd(BigInt(left), BigInt(right))) : lcm(left, right);
      assert.equal(Number(question.answer), expected, `${where}: ${question.unit}가 다릅니다.`);
    } else if (question.unit === "분수만큼") {
      // "35의 6/7" 은 35 × 6/7 이다.
      assert.ok(equal(evaluate(question.sentence.replace("의", "×")), answer), `${where}: 분수만큼의 값이 다릅니다.`);
    } else if (question.unit === "10 만들기") {
      // "7 + □ = 10"
      const [left, right] = question.sentence.split("=").map((side) => side.trim());
      assert.ok(equal(evaluate(left.replace("□", question.answer)), parseNumber(right)), `${where}: 10이 되지 않습니다.`);
    } else if (question.unit === "뛰어세기") {
      // "3, 6, 9, □"
      const shown = question.sentence.split(",").map((part) => part.trim()).filter((part) => part !== "□").map(Number);
      const step = shown[1] - shown[0];
      shown.forEach((value, index) => {
        if (index) assert.equal(value - shown[index - 1], step, `${where}: 뛰는 폭이 고르지 않습니다.`);
      });
      assert.equal(Number(question.answer), shown[shown.length - 1] + step, `${where}: 다음 수가 다릅니다.`);
    } else if (/의 (몫|나머지)$/.test(question.sentence)) {
      // "38 ÷ 5의 몫" / "38 ÷ 5의 나머지"
      const [, dividend, divisor, wanted] = question.sentence.match(/^(\d+) ÷ (\d+)의 (몫|나머지)$/) ?? [];
      assert.ok(dividend, `${where}: 문제 글을 읽을 수 없습니다.`);
      const expected = wanted === "몫" ? Math.floor(Number(dividend) / Number(divisor)) : Number(dividend) % Number(divisor);
      assert.equal(Number(question.answer), expected, `${where}: ${wanted}이 다릅니다.`);
    } else if (question.unit === "비례식") {
      const [left, right] = question.sentence.split("=").map((side) => side.split(":").map((part) => part.trim()));
      const filled = [...left, ...right].map((part) => (part === "□" ? question.answer : part));
      assert.ok(equal(div(parseNumber(filled[0]), parseNumber(filled[1])), div(parseNumber(filled[2]), parseNumber(filled[3]))),
        `${where}: 비가 같지 않습니다.`);
    } else {
      const rounding = question.prompt.includes("소수 첫째 자리") ? 1 : question.prompt.includes("소수 둘째 자리") ? 2 : null;
      const value = evaluate(question.sentence);
      const expected = rounding === null ? value : roundTo(value, rounding);
      assert.ok(equal(expected, answer), `${where}: 계산한 값과 다릅니다.`);
    }

    // 기약분수로 답하라고 적었으면 정답도 기약분수여야 한다.
    if (question.answer.includes("/")) {
      assert.ok(question.prompt.includes("기약분수"), `${where}: 분수 답인데 기약분수라고 적지 않았습니다.`);
      assert.equal(gcd(answer.n < 0n ? -answer.n : answer.n, answer.d), 1n, `${where}: 약분이 덜 되었습니다.`);
    }
    checked += 1;
  }

  assert.equal(checked, questions.length);
});

test("오답 보기는 정답과 값까지 달라야 한다", () => {
  for (const question of loadQuestions()) {
    const answer = parseNumber(question.answer);
    for (const choice of question.choices) {
      if (choice === question.answer) continue;
      const value = parseNumber(choice);
      if (!value) continue;
      assert.equal(equal(value, answer), false,
        `${question.id} · ${question.sentence}: 보기 ${choice}가 정답과 같은 값입니다.`);
    }
  }
});

test("학급 순위전이 연산 문제를 출처로 읽는다", () => {
  const apps = fs.readFileSync(APPS_PATH, "utf8");

  assert.match(apps, /id: "arithmetic"/);
  assert.match(apps, /\/learning\/literacy-numeracy\/arithmetic-race\/data\.js/);
  assert.match(apps, /window\.ARITHMETIC_RACE_DATA/);
});
