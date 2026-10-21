// 5·6학년 혼합 계산·소인수분해·소수·약수와 배수·소수 나눗셈·비례식 학습지 카드.
import { blank, fraction, type RaceCard, type RaceDeck, type RacePart } from "../race-card-model.ts";
import { createMixedCalculationSet, mixedCalculationBank } from "../mixed-calculation.ts";
import { createNaturalNumberDecompositionSet, naturalNumberDecompositionBank } from "../natural-number-decomposition.ts";
import { isPrimeNumberTo100 } from "../prime-number-hundred-chart.ts";
import { createDivisorMultipleSet } from "../divisors-multiples.ts";
import { createGradeSixDecimalOneSet } from "../grade-six-decimal-one.ts";
import { createGradeSixDecimalTwoSet } from "../grade-six-decimal-two.ts";
import { createGradeSixDecimalThreeSet } from "../grade-six-decimal-three.ts";
import { createGradeSixMixedCalculationSet, normalizeGradeSixMixedAnswer, type GradeSixMixedCalculationOperand } from "../grade-six-mixed-calculation.ts";
import { createGradeSixProportionSet, normalizeProportionAnswer } from "../grade-six-proportion.ts";

function random(seed: number) {
  let value = seed >>> 0;
  return () => {
    value += 0x6d2b79f5;
    let next = value;
    next = Math.imul(next ^ (next >>> 15), next | 1);
    next ^= next + Math.imul(next ^ (next >>> 7), next | 61);
    return ((next ^ (next >>> 14)) >>> 0) / 4294967296;
  };
}

const PRIME_CHOICES = ["소수", "소수 아님"];

// 1~100에서 소수와 소수 아닌 수를 반씩 뽑고, 10칸 범위의 소수 개수 문제를 더한다.
function primeDeck(seed: number): RaceCard[] {
  const next = random(seed);
  const pick = (pool: number[]) => pool.splice(Math.floor(next() * pool.length), 1)[0];
  const numbers = Array.from({ length: 100 }, (_, index) => index + 1);
  const primes = numbers.filter(isPrimeNumberTo100);
  const others = numbers.filter((number) => !isPrimeNumberTo100(number));
  const picked = [...Array.from({ length: 12 }, () => pick(primes)), ...Array.from({ length: 12 }, () => pick(others))];
  const cards: RaceCard[] = picked.map((number) => ({
    prompt: "약수가 2개(1과 자기 자신)인 수",
    parts: [`${number}은(는) 소수일까요?`],
    choices: PRIME_CHOICES,
    answers: { choice: [isPrimeNumberTo100(number) ? "소수" : "소수 아님"] },
  }));
  const decades = Array.from({ length: 10 }, (_, index) => index);
  for (let count = 0; count < 3; count += 1) {
    const start = pick(decades) * 10 + 1;
    const total = numbers.filter((number) => number >= start && number < start + 10 && isPrimeNumberTo100(number)).length;
    cards.push({ parts: [`${start}~${start + 9} 중 소수는`, blank(), "개"], answers: { a: [String(total)] } });
  }
  return cards;
}

function mixedOperand(operand: GradeSixMixedCalculationOperand): RacePart {
  if (operand.kind === "fraction") return fraction(String(operand.numerator), String(operand.denominator));
  if (operand.kind === "mixed") return fraction(String(operand.numerator), String(operand.denominator), String(operand.whole));
  return String(operand.value);
}

// 정답 모양(자연수·진분수·대분수)대로 칸을 만든다. 기약분수·대분수로 써야 맞다.
function fractionAnswer(answer: string): { parts: RacePart[]; answers: Record<string, string[]> } {
  const canonical = normalizeGradeSixMixedAnswer(answer);
  const mixed = canonical.match(/^(-?\d+) (\d+)\/(\d+)$/);
  if (mixed) return { parts: [fraction(blank("n"), blank("d"), blank("w"))], answers: { w: [mixed[1]], n: [mixed[2]], d: [mixed[3]] } };
  const proper = canonical.match(/^(-?\d+)\/(\d+)$/);
  if (proper) return { parts: [fraction(blank("n"), blank("d"))], answers: { n: [proper[1]], d: [proper[2]] } };
  return { parts: [blank("w")], answers: { w: [canonical] } };
}

// "□"를 칸으로 바꾸고, "a, b" 꼴의 답은 칸 여러 개로 나눈다.
function proportionCard(prompt: string, answer: string, guide: string): RaceCard {
  const values = normalizeProportionAnswer(answer).split(",");
  if (prompt.includes("□")) {
    const [before, after] = prompt.split("□");
    return { prompt: guide, parts: [before.trim(), blank(), after.trim()].filter(Boolean), answers: { a: [values[0]] } };
  }
  const ids = values.map((_, index) => String.fromCharCode(97 + index));
  const parts: RacePart[] = [prompt, { br: true }];
  ids.forEach((id, index) => { if (index) parts.push(","); parts.push(blank(id)); });
  return { prompt: guide, parts, answers: Object.fromEntries(ids.map((id, index) => [id, [values[index]]])) };
}

const DECIMAL_GUIDES: Record<string, string> = {
  hundredths: "몫을 소수 둘째 자리까지 나타내세요.",
  tenths: "몫을 소수 둘째 자리에서 반올림하세요.",
  remainder: "몫은 자연수로 구하고 나머지를 쓰세요.",
};

export const decks: Record<string, RaceDeck> = {
  "/arithmetic/grade-5-mixed-calculation": (seed) => createMixedCalculationSet(seed, mixedCalculationBank.length).map((problem) => ({
    parts: [problem.expression, "=", blank("a", "number", 4)],
    answers: { a: [String(problem.answer)] },
  })),
  // 예시(13)는 빼고, 소인수를 작은 수부터 한 칸에 하나씩 쓴다.
  "/arithmetic/grade-5-natural-number-decomposition": (seed) => createNaturalNumberDecompositionSet(seed, naturalNumberDecompositionBank.length).slice(1).map((problem) => {
    const parts: RacePart[] = [String(problem.number), "="];
    problem.factors.forEach((_, index) => { if (index) parts.push("×"); parts.push(blank(`f${index}`)); });
    return {
      prompt: "소수의 곱으로 나타내세요(작은 수부터).",
      parts,
      answers: Object.fromEntries(problem.factors.map((factor, index) => [`f${index}`, [String(factor)]])),
    };
  }),
  "/arithmetic/grade-5-prime-numbers": primeDeck,
  "/arithmetic/grade-5-divisors-multiples": (seed) => createDivisorMultipleSet(seed).columns.flat().map((problem) => ({
    prompt: problem.kind === "gcd" ? "최대공약수" : "최소공배수",
    parts: [String(problem.left), ",", String(problem.right), "→", blank()],
    answers: { a: [String(problem.answer)] },
  })),
  "/arithmetic/grade-6-decimals-1": (seed) => createGradeSixDecimalOneSet(seed).problems.map((problem) => ({
    prompt: "몫을 소수로 나타내세요.",
    parts: [String(problem.dividend), "÷", String(problem.divisor), "=", blank("a", "decimal")],
    answers: { a: [problem.answer] },
  })),
  "/arithmetic/grade-6-decimals-2": (seed) => createGradeSixDecimalTwoSet(seed).problems.map((problem) => ({
    prompt: DECIMAL_GUIDES[problem.section] ?? "계산하세요.",
    parts: [problem.left, problem.operator, problem.right, "=", blank("a", "decimal")],
    answers: { a: [problem.answer] },
  })),
  "/arithmetic/grade-6-decimals-3": (seed) => createGradeSixDecimalThreeSet(seed).problems.map((problem): RaceCard => problem.section === "remainder"
    ? {
      prompt: DECIMAL_GUIDES.remainder,
      parts: [problem.left, "÷", problem.right, "=", blank("q"), "···", blank("r", "decimal")],
      answers: { q: [problem.answer], r: [problem.remainder ?? "0"] },
    }
    : {
      prompt: DECIMAL_GUIDES[problem.section],
      parts: [problem.left, "÷", problem.right, "=", blank("a", "decimal")],
      answers: { a: [problem.answer] },
    }),
  "/arithmetic/grade-6-mixed-calculation": (seed) => createGradeSixMixedCalculationSet(seed).map((problem) => {
    const parts: RacePart[] = [];
    problem.operands.forEach((operand, index) => { if (index) parts.push(problem.operators[index - 1]); parts.push(mixedOperand(operand)); });
    parts.push("=");
    if (problem.kind === "decimal") return { prompt: "소수로 쓰세요.", parts: [...parts, blank("a", "decimal")], answers: { a: [problem.answer] } };
    const answer = fractionAnswer(problem.answer);
    return { prompt: "기약분수로 쓰세요.", parts: [...parts, ...answer.parts], answers: answer.answers };
  }),
  "/arithmetic/grade-6-proportion": (seed) => createGradeSixProportionSet(seed).map((problem) => proportionCard(problem.prompt, problem.answer, problem.guide)),
};
