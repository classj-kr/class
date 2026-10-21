// 3~6학년 분수 학습지 카드.
import { blank, fraction, type RaceCard, type RaceDeck, type RacePart } from "../race-card-model.ts";
import { createGradeThreeFractionOneSet } from "../grade-three-fraction-one.ts";
import { createQuestionSet as gradeThreeFractionTwo } from "../grade-three-fraction-two.ts";
import { createProblemSet as gradeThreeFractionThree } from "../race-sets/grade-3-fraction-3.ts";
import { createProblemSet as gradeFourFraction, type FractionValue } from "../race-sets/grade-4-fraction.ts";
import { createGradeFiveFractionOneSet, type FractionOneOperand, type MixedFractionAnswer } from "../grade-five-fraction-one.ts";
import { createGradeFiveFractionTwoSet, type GradeFiveFractionTwoOperand } from "../grade-five-fraction-two.ts";
import { createGradeFiveFractionThreeSet } from "../grade-five-fraction-three.ts";
import { createGradeSixFractionSet, type GradeSixFractionOperand } from "../grade-six-fraction.ts";

type Operand = FractionOneOperand | GradeFiveFractionTwoOperand | GradeSixFractionOperand;

// 문제의 수: 자연수, 진분수, 대분수.
function shown(value: Operand): RacePart {
  if (value.kind === "natural") return String(value.value);
  if (value.kind === "mixed") return fraction(String(value.numerator), String(value.denominator), String(value.whole));
  return fraction(String(value.numerator), String(value.denominator));
}

// 답 칸: 분수 부분이 0이면 자연수 칸만, 자연수가 0이면 분수 칸만 둔다.
function mixedAnswer(answer: MixedFractionAnswer): Pick<RaceCard, "answers"> & { part: RacePart } {
  const { whole, numerator, denominator } = answer;
  if (numerator === 0) return { part: blank("w"), answers: { w: [String(whole)] } };
  const fractionAnswers = { n: [String(numerator)], d: [String(denominator)] };
  if (whole === 0) return { part: fraction(blank("n"), blank("d")), answers: fractionAnswers };
  return { part: fraction(blank("n"), blank("d"), blank("w")), answers: { w: [String(whole)], ...fractionAnswers } };
}

function expression(operands: Operand[], operators: string[], answer: MixedFractionAnswer): RaceCard {
  const parts: RacePart[] = [];
  operands.forEach((operand, index) => {
    if (index > 0) parts.push(operators[Math.min(index - 1, operators.length - 1)]);
    parts.push(shown(operand));
  });
  const { part, answers } = mixedAnswer(answer);
  return { parts: [...parts, "=", part], answers };
}

function fourValue(value: FractionValue): Operand {
  return value.numerator > 0 ? { kind: "mixed", ...value } : { kind: "natural", value: value.whole };
}

function vowelEnding(number: number) {
  return [2, 4, 5, 9].includes(number % 10);
}

export const decks: Record<string, RaceDeck> = {
  "/arithmetic/grade-3-fraction-1": (seed) => {
    const set = createGradeThreeFractionOneSet(seed);
    return [
      ...set.valueProblems.map((item): RaceCard => ({
        parts: [`${item.whole}의`, fraction(String(item.numerator), String(item.denominator)), [1, 3, 6, 7, 8].includes(item.numerator) ? "은" : "는", blank()],
        answers: { a: [String(item.answer)] },
      })),
      ...set.relationProblems.map((item): RaceCard => ({
        parts: [
          `${item.whole}${vowelEnding(item.whole) ? "를" : "을"}`, `${item.part}씩 묶으면`, { br: true },
          `${item.selected}${vowelEnding(item.selected) ? "는" : "은"}`, `${item.whole}의`, fraction(blank("n"), blank("d")), "입니다.",
        ],
        answers: { n: [String(item.numerator)], d: [String(item.denominator)] },
      })),
    ];
  },
  "/arithmetic/grade-3-fraction-2": (seed) => gradeThreeFractionTwo(seed).questions.map((item): RaceCard => {
    if (item.type === "mixed-to-improper") {
      return {
        prompt: "가분수로",
        parts: [fraction(String(item.prompt.numerator), String(item.prompt.denominator), String(item.prompt.whole)), "=", fraction(blank("n"), blank("d"))],
        answers: { n: [String(item.expected.numerator)], d: [String(item.expected.denominator)] },
      };
    }
    return {
      prompt: "대분수로",
      parts: [fraction(String(item.prompt.numerator), String(item.prompt.denominator)), "=", fraction(blank("n"), blank("d"), blank("w"))],
      answers: { w: [String(item.expected.whole)], n: [String(item.expected.numerator)], d: [String(item.expected.denominator)] },
    };
  }),
  "/arithmetic/grade-3-fraction-3": (seed) => gradeThreeFractionThree(seed).problems.map((item): RaceCard => ({
    parts: [
      item.whole > 0 ? fraction(String(item.numerator), String(item.denominator), String(item.whole)) : fraction(String(item.numerator), String(item.denominator)),
      item.unit, "=", blank(), item.convertedUnit,
    ],
    answers: { a: [String(item.answer)] },
  })),
  "/arithmetic/grade-4-fraction": (seed) => gradeFourFraction(seed).problems.map((item) =>
    expression([fourValue(item.left), fourValue(item.right)], [item.operator], item.answer)),
  "/arithmetic/grade-5-fraction-1": (seed) => createGradeFiveFractionOneSet(seed).problems.map((item) =>
    expression(item.operands, [item.operator], item.answer)),
  "/arithmetic/grade-5-fraction-2": (seed) => createGradeFiveFractionTwoSet(seed).problems.map((item) =>
    expression(item.operands, item.operators, item.answer)),
  "/arithmetic/grade-5-fraction-3": (seed) => createGradeFiveFractionThreeSet(seed).problems.map((item): RaceCard => ({
    parts: [fraction(String(item.left.numerator), String(item.left.denominator)), "○", fraction(String(item.right.numerator), String(item.right.denominator))],
    choices: ["<", "=", ">"],
    answers: { choice: [item.answer] },
  })),
  "/arithmetic/grade-6-fraction": (seed) => createGradeSixFractionSet(seed).problems.map((item) =>
    expression(item.operands, item.operators, item.answer)),
};
