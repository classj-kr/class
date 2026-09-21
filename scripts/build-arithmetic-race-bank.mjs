/*
 * 학급 순위전(learning/class-race)에 낼 연산 문제를 만든다.
 *
 * 문제와 정답은 연산 학습지 생성기(learning/literacy-numeracy/arithmetics/lib)에서
 * 그대로 가져온다. 여기서 더하는 것은 두 가지뿐이다.
 *   1. 한 줄짜리 문제 글 — 순위전 화면은 학습지처럼 세로셈을 그리지 못한다.
 *   2. 오답 보기 — 아이들이 실제로 하는 실수(분자끼리 더하기, 소수점 밀림,
 *      계산 순서 무시 …)로 만든다. 아무 수나 넣으면 찍어서 맞힌다.
 *
 * 실행:  node --experimental-strip-types scripts/build-arithmetic-race-bank.mjs
 * 결과:  learning/literacy-numeracy/arithmetic-race/data.js
 */
import { writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const SITE_ROOT = path.resolve(SCRIPT_DIR, "..");
const LIB = path.join(SITE_ROOT, "learning", "literacy-numeracy", "arithmetics", "lib");
const OUTPUT = path.join(SITE_ROOT, "learning", "literacy-numeracy", "arithmetic-race", "data.js");

const lib = (name) => import(path.join(LIB, `${name}.ts`));

const [
  multiplicationFive,
  mixedCalculation,
  divisorsMultiples,
  gradeThreeFractionOne,
  gradeFiveFractionOne,
  gradeFiveDecimals,
  gradeSixFraction,
  gradeSixDecimalOne,
  gradeSixDecimalTwo,
  gradeSixMixed,
  gradeSixProportion,
] = await Promise.all([
  lib("multiplication-five"),
  lib("mixed-calculation"),
  lib("divisors-multiples"),
  lib("grade-three-fraction-one"),
  lib("grade-five-fraction-one"),
  lib("grade-five-decimals"),
  lib("grade-six-fraction"),
  lib("grade-six-decimal-one"),
  lib("grade-six-decimal-two"),
  lib("grade-six-mixed-calculation"),
  lib("grade-six-proportion"),
]);

// ── 공용 도구 ────────────────────────────────────────────

// 같은 명령을 다시 돌리면 같은 파일이 나와야 한다. 문제 id 로 섞는다.
function hash(text) {
  let value = 0;
  for (const character of String(text)) value = (value * 31 + character.charCodeAt(0)) >>> 0;
  return value;
}

function rotate(items, key) {
  if (items.length < 2) return [...items];
  const offset = hash(key) % items.length;
  return [...items.slice(offset), ...items.slice(0, offset)];
}

function flatten(value) {
  return Array.isArray(value) ? value.flat(Infinity) : [];
}

function gcd(left, right) {
  let a = Math.abs(left);
  let b = Math.abs(right);
  while (b) [a, b] = [b, a % b];
  return a || 1;
}

// 소수는 문자열로 다룬다. 0.1 + 0.2 같은 실수 오차를 만들지 않으려는 것이다.
function decimalPlaces(text) {
  const dot = String(text).indexOf(".");
  return dot < 0 ? 0 : String(text).length - dot - 1;
}

function digitsOf(text) {
  return Number(String(text).replace("-", "").replace(".", ""));
}

function fromDigits(digits, places, negative = false) {
  const body = String(Math.abs(digits)).padStart(places + 1, "0");
  const cut = body.length - places;
  const text = places ? `${body.slice(0, cut)}.${body.slice(cut)}`.replace(/(\.\d*?)0+$/, "$1").replace(/\.$/, "") : body;
  return `${negative ? "-" : ""}${text}`;
}

// 소수점을 옮긴다. 자릿수를 밀어 쓰는 실수를 보기로 만들 때 쓴다.
function shiftDecimal(text, step) {
  const places = decimalPlaces(text) - step;
  if (places < 0) return fromDigits(digitsOf(text) * 10 ** -places, 0, String(text).startsWith("-"));
  return fromDigits(digitsOf(text), places, String(text).startsWith("-"));
}

// ── 분수 ────────────────────────────────────────────────

function fraction(numerator, denominator) {
  const sign = denominator < 0 ? -1 : 1;
  const divisor = gcd(numerator, denominator);
  return { n: (sign * numerator) / divisor, d: Math.abs(denominator) / divisor };
}

const addFraction = (a, b) => fraction(a.n * b.d + b.n * a.d, a.d * b.d);
const subFraction = (a, b) => fraction(a.n * b.d - b.n * a.d, a.d * b.d);
const mulFraction = (a, b) => fraction(a.n * b.n, a.d * b.d);
const divFraction = (a, b) => fraction(a.n * b.d, a.d * b.n);

function operandFraction(operand) {
  if (operand.kind === "fraction") return fraction(operand.numerator, operand.denominator);
  if (operand.kind === "mixed") return fraction(operand.whole * operand.denominator + operand.numerator, operand.denominator);
  if (operand.kind === "natural") return fraction(Number(operand.value), 1);
  throw new Error(`모르는 피연산자입니다: ${JSON.stringify(operand)}`);
}

// 수를 한국어로 읽었을 때 받침이 있는지 본다. 열넷(14)은 "사"로 끝나 받침이 없다.
const DIGIT_HAS_FINAL = [true, true, false, true, false, false, true, true, true, false];

function particle(number, withFinal, withoutFinal) {
  const last = Math.abs(Math.trunc(Number(number))) % 10;
  return DIGIT_HAS_FINAL[last] ? withFinal : withoutFinal;
}

// 대분수는 "1과 3/4"로 적는다. 한 줄 문제에서 "1 3/4"는 13/4 처럼 읽힌다.
function fractionText({ n, d }) {
  if (d === 1) return String(n);
  const sign = n < 0 ? "-" : "";
  const value = Math.abs(n);
  const whole = Math.floor(value / d);
  const rest = value % d;
  if (!whole) return `${sign}${rest}/${d}`;
  if (!rest) return `${sign}${whole}`;
  return `${sign}${whole}${particle(whole, "과", "와")} ${rest}/${d}`;
}

function mixedAnswerText(answer) {
  if (typeof answer === "string" || typeof answer === "number") return String(answer);
  const whole = Number(answer.whole) || 0;
  const numerator = Number(answer.numerator) || 0;
  const denominator = Number(answer.denominator) || 1;
  return fractionText(fraction(whole * denominator + numerator, denominator));
}

// "3/32", "2와 1/3", "7" 처럼 적힌 답을 분수로 되읽는다.
function parseFractionText(text) {
  const mixed = String(text).match(/^(-?\d+)[과와]\s*(\d+)\/(\d+)$/);
  if (mixed) {
    const [, whole, numerator, denominator] = mixed.map(Number);
    return fraction(Math.sign(whole || 1) * (Math.abs(whole) * denominator + numerator), denominator);
  }
  const simple = String(text).match(/^(-?\d+)\/(\d+)$/);
  if (simple) return fraction(Number(simple[1]), Number(simple[2]));
  const whole = Number(text);
  return Number.isInteger(whole) ? fraction(whole, 1) : null;
}

// 분자와 분모를 뒤집어 쓴 답, 분자만 하나 어긋난 답.
function flippedFractionTexts(text) {
  const value = parseFractionText(text);
  if (!value || !value.n) return [];
  return [fractionText(fraction(value.d, value.n)), fractionText(fraction(value.n + 1, value.d))];
}

function operandText(operand) {
  if (operand.kind === "decimal") return String(operand.value);
  if (operand.kind === "natural") return String(operand.value);
  return fractionText(operandFraction(operand));
}

function expressionText(operands, operators) {
  return operands
    .map((operand, index) => (index ? ` ${operators[index - 1]} ${operandText(operand)}` : operandText(operand)))
    .join("");
}

// ── 문제 한 개 ───────────────────────────────────────────

const questions = [];
const seen = new Set();

function add({ id, grade, unit, prompt, sentence, answer, wrongs, explanation }) {
  const correct = String(answer);
  const choices = [];
  for (const candidate of wrongs) {
    if (candidate === null || candidate === undefined) continue;
    const text = String(candidate);
    if (!text || text === correct || choices.includes(text)) continue;
    if (!/^-?[\d./가-힣 ]+$/.test(text)) continue;
    choices.push(text);
    if (choices.length === 3) break;
  }
  // 보기가 하나뿐이면 O/X 나 다름없다. 그런 문제는 내지 않는다.
  if (choices.length < 2) return;
  if (seen.has(`${unit}\u0000${sentence}`)) return;
  seen.add(`${unit}\u0000${sentence}`);
  questions.push({
    // 순위전 서버는 id 에 영문·숫자·-_: 만 받는다(quizrace.js). 소수점이 들어오지 않게 다듬는다.
    id: id.replace(/[^a-z0-9_:-]+/gi, "-"),
    grade,
    unit,
    prompt,
    sentence,
    choices: rotate([correct, ...choices], id),
    answer: correct,
    explanation,
  });
}

// ── 초1~초3 기본 계산 ────────────────────────────────────
//
// 이 학년의 학습지는 문제를 화면 코드 안에서 세로셈·빈칸 모양으로 만든다.
// 한 줄 퀴즈로는 옮겨지지 않아 여기서 따로 낸다. 수의 크기와 받아올림 조건은
// 학습지와 같은 범위로 맞춘다.

function randomFor(seed) {
  let value = seed >>> 0;
  return () => {
    value += 0x6d2b79f5;
    let next = value;
    next = Math.imul(next ^ (next >>> 15), next | 1);
    next ^= next + Math.imul(next ^ (next >>> 7), next | 61);
    return ((next ^ (next >>> 14)) >>> 0) / 4294967296;
  };
}

const pick = (random, low, high) => low + Math.floor(random() * (high - low + 1));

// 각 자리를 따로 더하고 올림을 흘려 버린 답. 받아올림을 잊은 아이의 답이다.
function sumWithoutCarry(left, right) {
  let result = 0;
  let unit = 1;
  while (left > 0 || right > 0) {
    result += ((left % 10) + (right % 10)) % 10 * unit;
    left = Math.floor(left / 10);
    right = Math.floor(right / 10);
    unit *= 10;
  }
  return result;
}

// 자리마다 큰 수에서 작은 수를 뺀 답. 받아내림을 잊으면 이렇게 나온다.
function differenceWithoutBorrow(left, right) {
  let result = 0;
  let unit = 1;
  while (left > 0 || right > 0) {
    result += Math.abs((left % 10) - (right % 10)) * unit;
    left = Math.floor(left / 10);
    right = Math.floor(right / 10);
    unit *= 10;
  }
  return result;
}

// 곱셈에서 올림을 더하지 않고 자리마다 따로 적은 답.
function productWithoutCarry(left, right) {
  let result = 0;
  let unit = 1;
  while (left > 0) {
    result += ((left % 10) * right) % 10 * unit;
    left = Math.floor(left / 10);
    unit *= 10;
  }
  return result;
}

function addSumProblem({ id, grade, unit, left, right, operator }) {
  const answer = operator === "+" ? left + right : left - right;
  const slipped = operator === "+" ? sumWithoutCarry(left, right) : differenceWithoutBorrow(left, right);
  const step = left >= 100 ? 100 : left >= 20 ? 10 : 1;
  add({
    id,
    grade,
    unit,
    prompt: operator === "+" ? "덧셈의 답을 고르세요." : "뺄셈의 답을 고르세요.",
    sentence: `${left} ${operator} ${right}`,
    answer,
    // 받아올림·받아내림을 잊은 답, 한 자리 어긋난 답.
    wrongs: [slipped, answer + step, answer - step, answer + 1],
    explanation: `${left} ${operator} ${right} = ${answer}`,
  });
}

// 초1 한 자리 수 덧셈·뺄셈
for (const seed of [20260101, 20260102, 20260103]) {
  const random = randomFor(seed);
  for (let index = 0; index < 30; index += 1) {
    // 2 + 2 같은 문제는 찍어도 맞고 배울 것도 없다. 받아올림·받아내림이 있는 것만 낸다.
    const left = pick(random, 3, 9);
    const right = pick(random, 3, 9);
    if (left + right >= 11) {
      addSumProblem({ id: `g1add-${left}-${right}`, grade: "초1", unit: "한 자리 수 덧셈·뺄셈", left, right, operator: "+" });
    }
    const big = pick(random, 11, 18);
    const small = pick(random, 3, 9);
    if (big - small < 10 && big % 10 < small) {
      addSumProblem({ id: `g1sub-${big}-${small}`, grade: "초1", unit: "한 자리 수 덧셈·뺄셈", left: big, right: small, operator: "−" });
    }
  }
}

// 초1 보수: 10이 되려면 얼마가 더 있어야 하는지
for (let left = 1; left <= 9; left += 1) {
  const answer = 10 - left;
  add({
    id: `g1comp-${left}`,
    grade: "초1",
    unit: "10 만들기",
    prompt: "□에 알맞은 수를 고르세요.",
    sentence: `${left} + □ = 10`,
    answer,
    // 하나씩 어긋난 답, 더한 수를 그대로 쓴 답.
    wrongs: [answer + 1, answer - 1, left, 10],
    explanation: `${left}${particle(left, "과", "와")} ${answer}${particle(answer, "을", "를")} 더하면 10입니다.`,
  });
}

// 초2 두 자리 수 덧셈·뺄셈 (받아올림·받아내림이 있는 것만)
for (const seed of [20260201, 20260202, 20260203]) {
  const random = randomFor(seed);
  for (let index = 0; index < 20; index += 1) {
    const left = pick(random, 23, 89);
    const right = pick(random, 14, 79);
    if ((left % 10) + (right % 10) >= 10) {
      addSumProblem({ id: `g2add-${left}-${right}`, grade: "초2", unit: "두 자리 수 덧셈·뺄셈", left, right, operator: "+" });
    }
    if (left > right && (left % 10) < (right % 10)) {
      addSumProblem({ id: `g2sub-${left}-${right}`, grade: "초2", unit: "두 자리 수 덧셈·뺄셈", left, right, operator: "−" });
    }
  }
}

// 초2 뛰어세기
for (const step of [2, 3, 4, 5, 6, 7, 8, 9]) {
  for (const start of [step, step * 3, step * 5]) {
    const shown = [start, start + step, start + step * 2];
    const answer = start + step * 3;
    add({
      id: `g2skip-${step}-${start}`,
      grade: "초2",
      unit: "뛰어세기",
      prompt: "□에 알맞은 수를 고르세요.",
      sentence: `${shown.join(", ")}, □`,
      answer,
      // 한 칸 덜 뛴 답, 한 칸 더 뛴 답, 마지막 수의 두 배.
      wrongs: [answer - step, answer + step, shown[2] * 2, answer + 1],
      explanation: `${step}씩 뛰어 세고 있으므로 ${shown[2]} 다음은 ${answer}입니다.`,
    });
  }
}

// 초3 세 자리 수 덧셈·뺄셈
for (const seed of [20260211, 20260212, 20260213]) {
  const random = randomFor(seed);
  for (let index = 0; index < 20; index += 1) {
    const left = pick(random, 145, 899);
    const right = pick(random, 118, 699);
    if ((left % 10) + (right % 10) >= 10) {
      addSumProblem({ id: `g3add-${left}-${right}`, grade: "초3", unit: "세 자리 수 덧셈·뺄셈", left, right, operator: "+" });
    }
    if (left > right && (left % 10) < (right % 10)) {
      addSumProblem({ id: `g3sub-${left}-${right}`, grade: "초3", unit: "세 자리 수 덧셈·뺄셈", left, right, operator: "−" });
    }
  }
}

// 초3 나눗셈: 몫과 나머지
for (const seed of [20260221, 20260222]) {
  const random = randomFor(seed);
  for (let index = 0; index < 22; index += 1) {
    const divisor = pick(random, 3, 9);
    const quotient = pick(random, 2, 9);
    const remainder = pick(random, 1, divisor - 1);
    const dividend = divisor * quotient + remainder;
    add({
      id: `g3divq-${dividend}-${divisor}`,
      grade: "초3",
      unit: "나눗셈의 몫과 나머지",
      prompt: "몫을 고르세요.",
      sentence: `${dividend} ÷ ${divisor}의 몫`,
      answer: quotient,
      // 몫과 나머지를 맞바꾼 답, 한 칸 어긋난 답.
      wrongs: [remainder, quotient + 1, quotient - 1, divisor],
      explanation: `${dividend} ÷ ${divisor} = ${quotient} … ${remainder}`,
    });
    add({
      id: `g3divr-${dividend}-${divisor}`,
      grade: "초3",
      unit: "나눗셈의 몫과 나머지",
      prompt: "나머지를 고르세요.",
      sentence: `${dividend} ÷ ${divisor}의 나머지`,
      answer: remainder,
      wrongs: [quotient, remainder + 1, remainder - 1, divisor],
      explanation: `${dividend} ÷ ${divisor} = ${quotient} … ${remainder}`,
    });
  }
}

// 초3 두 자리 수 × 한 자리 수
for (const seed of [20260231, 20260232]) {
  const random = randomFor(seed);
  for (let index = 0; index < 22; index += 1) {
    const left = pick(random, 13, 89);
    const right = pick(random, 3, 9);
    const answer = left * right;
    add({
      id: `g3mul-${left}-${right}`,
      grade: "초3",
      unit: "두 자리 수 곱셈",
      prompt: "곱셈의 답을 고르세요.",
      sentence: `${left} × ${right}`,
      answer,
      // 올림을 더하지 않고 자리마다 따로 적은 답, 십의 자리만 곱한 답.
      wrongs: [productWithoutCarry(left, right), Math.floor(left / 10) * 10 * right + (left % 10), answer + 10, answer - right],
      explanation: `${left} × ${right} = ${answer}`,
    });
  }
}

// 초4 여러 자리 수의 곱셈 (세 자리 × 두 자리)
for (const seed of [20260241, 20260242]) {
  const random = randomFor(seed);
  for (let index = 0; index < 20; index += 1) {
    const left = pick(random, 124, 899);
    const right = pick(random, 13, 79);
    const answer = left * right;
    add({
      id: `g4mul-${left}-${right}`,
      grade: "초4",
      unit: "여러 자리 수의 곱셈",
      prompt: "곱셈의 답을 고르세요.",
      sentence: `${left} × ${right}`,
      answer,
      // 십의 자리를 한 칸 밀어 쓰지 않고 더한 답, 일의 자리만 곱한 답.
      wrongs: [
        left * (right % 10) + left * Math.floor(right / 10),
        left * (right % 10) + left * Math.floor(right / 10) * 100,
        answer - left,
        answer + left,
      ],
      explanation: `${left} × ${right} = ${answer}`,
    });
  }
}

// 초4 세 자리 수 ÷ 두 자리 수
for (const seed of [20260251, 20260252]) {
  const random = randomFor(seed);
  for (let index = 0; index < 22; index += 1) {
    const divisor = pick(random, 12, 47);
    const quotient = pick(random, 4, 29);
    const remainder = pick(random, 1, divisor - 1);
    const dividend = divisor * quotient + remainder;
    if (dividend < 100 || dividend > 999) continue;
    add({
      id: `g4divq-${dividend}-${divisor}`,
      grade: "초4",
      unit: "세 자리 수 ÷ 두 자리 수",
      prompt: "몫을 고르세요.",
      sentence: `${dividend} ÷ ${divisor}의 몫`,
      answer: quotient,
      // 몫과 나머지를 맞바꾼 답, 한 칸 어긋난 답.
      wrongs: [remainder, quotient + 1, quotient - 1, quotient + 10],
      explanation: `${dividend} ÷ ${divisor} = ${quotient} … ${remainder}`,
    });
  }
}

// ── 초2 구구단 ───────────────────────────────────────────

for (const seed of [20260301, 20260302, 20260303]) {
  for (const problem of flatten(multiplicationFive.createMultiplicationFiveProblemSet(seed).columns)) {
    const { multiplicand: left, factor: right, product } = problem;
    if (left === 1 || right === 1) continue;
    add({
      id: `mul-${left}-${right}`,
      grade: "초2",
      unit: "구구단",
      prompt: "곱셈의 답을 고르세요.",
      sentence: `${left} × ${right}`,
      answer: product,
      // 한 단 위아래로 밀린 답, 곱셈을 덧셈으로 바꾼 답.
      wrongs: [left * (right - 1), left * (right + 1), left + right, product + left],
      explanation: `${left} × ${right} = ${product}`,
    });
  }
}

// ── 초5 약수와 배수 ──────────────────────────────────────

for (const seed of [20260401, 20260402]) {
  for (const problem of flatten(divisorsMultiples.createDivisorMultipleSet(seed).columns)) {
    const { kind, left, right, answer } = problem;
    const other = kind === "gcd"
      ? divisorsMultiples.leastCommonMultiple(left, right)
      : divisorsMultiples.greatestCommonDivisor(left, right);
    add({
      id: `${kind}-${left}-${right}`,
      grade: "초5",
      unit: kind === "gcd" ? "최대공약수" : "최소공배수",
      prompt: kind === "gcd" ? "두 수의 최대공약수를 고르세요." : "두 수의 최소공배수를 고르세요.",
      sentence: `${left}와 ${right}`,
      answer,
      // 최대공약수와 최소공배수를 맞바꾼 답, 두 수를 그냥 곱한 답, 두 수의 차.
      wrongs: [other, left * right, Math.abs(left - right), Math.min(left, right)],
      explanation: kind === "gcd"
        ? `${left}와 ${right}의 최대공약수는 ${answer}, 최소공배수는 ${other}입니다.`
        : `${left}와 ${right}의 최소공배수는 ${answer}, 최대공약수는 ${other}입니다.`,
    });
  }
}

// ── 초5 혼합계산 ─────────────────────────────────────────

// 괄호를 지우고 앞에서부터 차례대로 계산한다. 계산 순서를 잊은 아이의 답이다.
function leftToRight(expression) {
  const tokens = expression.replace(/[(){}]/g, "").match(/\d+|[+\-−×÷]/g) ?? [];
  let value = Number(tokens[0]);
  for (let index = 1; index < tokens.length; index += 2) {
    const next = Number(tokens[index + 1]);
    if (!Number.isFinite(next)) return null;
    const operator = tokens[index];
    if (operator === "+") value += next;
    else if (operator === "-" || operator === "−") value -= next;
    else if (operator === "×") value *= next;
    else if (operator === "÷") value /= next;
    else return null;
  }
  return Number.isInteger(value) ? value : null;
}

for (const seed of [20260501, 20260502, 20260503]) {
  for (const problem of flatten(mixedCalculation.createMixedCalculationSet(seed))) {
    const { expression, answer } = problem;
    add({
      id: `mixed-${hash(expression)}`,
      grade: "초5",
      unit: "혼합계산",
      prompt: "계산한 값을 고르세요.",
      sentence: expression.replace(/([+\-×÷])/g, " $1 ").replace(/\s+/g, " ").trim(),
      answer,
      wrongs: [leftToRight(expression), answer + 1, answer - 1, answer + 10],
      explanation: "괄호 안 → 곱셈·나눗셈 → 덧셈·뺄셈 차례로 계산합니다.",
    });
  }
}

// ── 초3 분수의 값 ────────────────────────────────────────

for (const seed of [20260601, 20260602, 20260603, 20260604]) {
  for (const problem of gradeThreeFractionOne.createGradeThreeFractionOneSet(seed).valueProblems) {
    const { whole, numerator, denominator, answer } = problem;
    add({
      id: `g3frac-${whole}-${numerator}-${denominator}`,
      grade: "초3",
      unit: "분수만큼",
      prompt: "얼마인지 고르세요.",
      sentence: `${whole}의 ${numerator}/${denominator}`,
      answer,
      // 분모로만 나눈 답(한 묶음), 분자를 그대로 쓴 답, 남은 만큼.
      wrongs: [whole / denominator, numerator, whole - answer, answer + whole / denominator],
      explanation: `${whole}${particle(whole, "을", "를")} ${denominator}묶음으로 나눈 ${whole / denominator}씩, 그 가운데 ${numerator}묶음이므로 ${answer}입니다.`,
    });
  }
}

// ── 초5 분수의 덧셈과 뺄셈, 곱셈 ─────────────────────────

const FRACTION_OPERATION = { "+": addFraction, "−": subFraction, "×": mulFraction, "÷": divFraction };

// 통분하지 않고 분자는 분자끼리, 분모는 분모끼리 더한 답.
function straightAcross(operands, operators) {
  if (operands.length !== 2) return null;
  const [left, right] = operands.map(operandFraction);
  const operator = operators[0];
  if (operator === "+") return fraction(left.n + right.n, left.d + right.d);
  if (operator === "−") return fraction(left.n - right.n, left.d - right.d);
  return null;
}

// 분모는 그대로 두고 분자끼리만 곱한 답.
function numeratorOnlyProduct(operands, operators) {
  if (!operators.every((operator) => operator === "×")) return null;
  const values = operands.map(operandFraction);
  return fraction(values.reduce((product, value) => product * value.n, 1), values[0].d);
}

// 마지막 수를 빠뜨리고 앞까지만 계산한 답.
function withoutLast(operands, operators) {
  if (operands.length < 3) return null;
  return operands
    .slice(0, -1)
    .map(operandFraction)
    .reduce((left, right, index) => (index ? FRACTION_OPERATION[operators[index - 1]](left, right) : left));
}

function addFractionProblem({ problem, grade, unit, operators, idPrefix }) {
  const { operands, answer } = problem;
  const sentence = expressionText(operands, operators);
  const across = straightAcross(operands, operators);
  const numeratorOnly = numeratorOnlyProduct(operands, operators);
  const skippedLast = withoutLast(operands, operators);
  const correct = mixedAnswerText(answer);
  const exact = operands
    .map(operandFraction)
    .reduce((left, right, index) => (index ? FRACTION_OPERATION[operators[index - 1]](left, right) : left));
  add({
    id: `${idPrefix}-${hash(sentence)}`,
    grade,
    unit,
    prompt: correct.includes("/") ? "계산한 값을 기약분수로 나타낸 것을 고르세요." : "계산한 값을 고르세요.",
    sentence,
    answer: correct,
    wrongs: [
      across ? fractionText(across) : null,
      numeratorOnly ? fractionText(numeratorOnly) : null,
      skippedLast ? fractionText(skippedLast) : null,
      fractionText(fraction(exact.d, exact.n)),
      fractionText(fraction(exact.n + 1, exact.d)),
    ],
    explanation: `${sentence} = ${correct}`,
  });
}

for (const seed of [20260701, 20260702, 20260703, 20260704]) {
  for (const problem of gradeFiveFractionOne.createGradeFiveFractionOneSet(seed).problems) {
    const operators = problem.operands.slice(1).map(() => problem.operator);
    addFractionProblem({ problem, grade: "초5", unit: "분수 계산", operators, idPrefix: "g5frac" });
  }
}

for (const seed of [20260801, 20260802, 20260803, 20260804]) {
  for (const problem of gradeSixFraction.createGradeSixFractionSet(seed).problems) {
    addFractionProblem({ problem, grade: "초6", unit: "분수 계산", operators: problem.operators, idPrefix: "g6frac" });
  }
}

// ── 초5 소수의 곱셈 ──────────────────────────────────────

for (const seed of [20260901, 20260902, 20260903]) {
  for (const problem of gradeFiveDecimals.createGradeFiveDecimalSet(seed).problems) {
    const { left, right, answer } = problem;
    add({
      id: `g5dec-${left.text}-${right.text}`,
      grade: "초5",
      unit: "소수의 곱셈",
      prompt: "계산한 값을 고르세요.",
      sentence: `${left.text} × ${right.text}`,
      answer,
      // 소수점을 한 칸씩 잘못 찍은 답, 소수점을 아예 잊고 정수로만 곱한 답.
      wrongs: [shiftDecimal(answer, 1), shiftDecimal(answer, -1), String(digitsOf(left.text) * digitsOf(right.text))],
      explanation: `${left.text} × ${right.text} = ${answer} · 두 수의 소수점 아래 자리 수를 더한 만큼 답에도 찍습니다.`,
    });
  }
}

// ── 초6 소수의 곱셈과 나눗셈 ─────────────────────────────

const ROUNDING = { hundredths: "소수 둘째 자리", tenths: "소수 첫째 자리" };

for (const seed of [20261001, 20261002, 20261003, 20261004, 20261005]) {
  for (const problem of gradeSixDecimalTwo.createGradeSixDecimalTwoSet(seed).problems) {
    const { section, left, right, operator, answer } = problem;
    const rounding = ROUNDING[section];
    add({
      id: `g6dec2-${section}-${left}-${right}`,
      grade: "초6",
      unit: operator === "×" ? "소수의 곱셈" : "소수의 나눗셈",
      prompt: rounding ? `몫을 반올림하여 ${rounding}까지 나타낸 값을 고르세요.` : "계산한 값을 고르세요.",
      sentence: `${left} ${operator} ${right}`,
      answer,
      wrongs: [
        shiftDecimal(answer, 1),
        shiftDecimal(answer, -1),
        operator === "×" ? String(digitsOf(left) * digitsOf(right)) : null,
        // 반올림할 자리를 한 자리 위로 잘못 잡은 답.
        rounding ? String(Math.round(Number(answer))) : null,
      ],
      explanation: rounding
        ? `${left} ÷ ${right}의 몫을 반올림하여 ${rounding}까지 나타내면 ${answer}입니다.`
        : `${left} ${operator} ${right} = ${answer}`,
    });
  }
}

// ── 초6 자연수의 나눗셈을 소수로 ─────────────────────────

for (const seed of [20261101, 20261102, 20261103]) {
  for (const problem of gradeSixDecimalOne.createGradeSixDecimalOneSet(seed).problems) {
    const { dividend, divisor, answer } = problem;
    add({
      id: `g6dec1-${dividend}-${divisor}`,
      grade: "초6",
      unit: "자연수의 나눗셈",
      prompt: "몫을 소수로 나타낸 값을 고르세요.",
      sentence: `${dividend} ÷ ${divisor}`,
      answer,
      // 소수점 자리를 밀어 쓴 답, 소수 대신 자연수 몫만 쓴 답.
      wrongs: [shiftDecimal(answer, 1), shiftDecimal(answer, -1), String(Math.floor(dividend / divisor))],
      explanation: `${dividend} ÷ ${divisor} = ${answer}`,
    });
  }
}

// ── 초6 분수와 소수의 혼합계산 ───────────────────────────

for (const seed of [20261201, 20261202, 20261203, 20261204, 20261205]) {
  for (const problem of gradeSixMixed.createGradeSixMixedCalculationSet(seed)) {
    const { operands, operators, answer, kind } = problem;
    const sentence = expressionText(operands, operators);
    const correct = String(answer);
    add({
      id: `g6mix-${hash(sentence)}`,
      grade: "초6",
      unit: "분수와 소수의 혼합계산",
      prompt: kind === "decimal" ? "계산한 값을 고르세요." : "계산한 값을 기약분수로 나타낸 것을 고르세요.",
      sentence,
      answer: correct,
      wrongs: kind === "decimal"
        ? [shiftDecimal(correct, 1), shiftDecimal(correct, -1)]
        : flippedFractionTexts(correct),
      explanation: "앞에서부터가 아니라 곱셈·나눗셈을 먼저 계산합니다.",
    });
  }
}

// ── 초6 비례식 ───────────────────────────────────────────

for (const seed of [20261301, 20261302, 20261303, 20261304, 20261305, 20261306]) {
  for (const problem of gradeSixProportion.createGradeSixProportionSet(seed)) {
    const { prompt, answer, guide } = problem;
    if (guide !== "빈칸에 들어갈 수") continue;
    const numbers = prompt.match(/\d+/g)?.map(Number) ?? [];
    const value = Number(answer);
    add({
      id: `g6prop-${hash(prompt)}`,
      grade: "초6",
      unit: "비례식",
      prompt: "□에 알맞은 수를 고르세요.",
      sentence: prompt,
      answer,
      // 내항과 외항을 뒤바꿔 계산한 답, 비의 값을 그대로 더한 답.
      wrongs: [
        numbers.length >= 3 ? Math.round((numbers[0] * numbers[1]) / numbers[2]) : null,
        numbers.length >= 3 ? Math.round((numbers[1] * numbers[2]) / numbers[0]) : null,
        value + 1,
        value - 1,
      ],
      explanation: "비례식에서 외항의 곱과 내항의 곱은 같습니다.",
    });
  }
}

// ── 파일로 내보내기 ──────────────────────────────────────

questions.sort((left, right) => left.grade.localeCompare(right.grade, "ko")
  || left.unit.localeCompare(right.unit, "ko")
  || left.id.localeCompare(right.id, "en"));

const byUnit = new Map();
for (const question of questions) {
  const key = `${question.grade} · ${question.unit}`;
  byUnit.set(key, (byUnit.get(key) ?? 0) + 1);
}

const body = questions
  .map((question) => `    ${JSON.stringify(question)}`)
  .join(",\n");

writeFileSync(OUTPUT, `/*
 * 학급 순위전(learning/class-race)에 내는 연산 문제.
 * 손으로 고치지 마세요. 아래 명령으로 다시 만듭니다.
 *   node --experimental-strip-types scripts/build-arithmetic-race-bank.mjs
 *
 * 문제와 정답은 연산 학습지 생성기에서 가져오고, 오답 보기는 아이들이 자주 하는
 * 실수로 만듭니다. 문항 모양:
 *   { id, grade, unit, prompt, sentence, choices[3~4], answer, explanation }
 */
window.ARITHMETIC_RACE_DATA = [
${body}
];
`, "utf8");

console.log(`${questions.length}문제를 ${path.relative(SITE_ROOT, OUTPUT)} 에 적었습니다.`);
for (const [unit, count] of [...byUnit].sort((left, right) => left[0].localeCompare(right[0], "ko"))) {
  console.log(`  ${unit} · ${count}문제`);
}
