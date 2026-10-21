// 4학년 큰 수·각도·곱셈·나눗셈·소수·단위 변환과 5학년 소수의 곱셈 학습지의 카드.
import { blank, equation, type RaceCard, type RaceDeck, type RacePart } from "../race-card-model.ts";
import { createAngleEstimationSet } from "../angle-estimation.ts";
import { createGradeFiveDecimalSet } from "../grade-five-decimals.ts";
import { createProblemSet as numberReading } from "../race-sets/grade-4-number-reading.ts";
import { createProblemSet as multiplication } from "../race-sets/grade-4-multiplication.ts";
import { createProblemSet as largeMultiplication } from "../race-sets/grade-4-large-number-multiplication.ts";
import { createProblemSet as division } from "../race-sets/grade-4-division.ts";
import { createProblemSet as decimals } from "../race-sets/grade-4-decimals.ts";
import { createProblemSet as unitConversion } from "../race-sets/unit-conversion.ts";

// 밑변은 오른쪽으로, 다른 변은 시계 반대 방향으로 angle°만큼 돌린 각.
function angleSvg(angle: number) {
  const cx = 120, cy = 128, ray = 104, arc = 26;
  const point = (length: number) => {
    const radian = (angle * Math.PI) / 180;
    return `${(cx + length * Math.cos(radian)).toFixed(1)} ${(cy - length * Math.sin(radian)).toFixed(1)}`;
  };
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 140" width="240" height="140" role="img" aria-label="각도 그림">`
    + `<g fill="none" stroke="currentColor" stroke-linecap="round">`
    + `<path d="M${cx} ${cy}H${cx + ray}M${cx} ${cy}L${point(ray)}" stroke-width="4"/>`
    + `<path d="M${cx + arc} ${cy}A${arc} ${arc} 0 0 0 ${point(arc)}" stroke-width="2"/>`
    + `</g><circle cx="${cx}" cy="${cy}" r="5" fill="currentColor"/></svg>`;
}

export const decks: Record<string, RaceDeck> = {
  "/arithmetic/grade-4-number-reading": (seed) => numberReading(seed).problems.map((problem): RaceCard => problem.direction === "to-korean"
    ? { prompt: "한자어로 쓰기", parts: [problem.number, "→", blank("a", "text", 12)], answers: { a: [problem.reading] } }
    : { prompt: "숫자로 쓰기", parts: [problem.reading, "→", blank("a", "number", 9)], answers: { a: [problem.number] } }),
  "/arithmetic/grade-4-angle-estimation": (seed) => createAngleEstimationSet(seed).map((problem): RaceCard => ({
    prompt: "각도 어림하기",
    parts: [{ svg: angleSvg(problem.angle) }, { br: true }, blank(), "°"],
    answers: { a: [String(problem.angle)] },
  })),
  "/arithmetic/grade-4-multiplication": (seed) => multiplication(seed).problems.map((item) => equation(item.top, "×", item.bottom, item.result, "result")),
  "/arithmetic/grade-4-large-number-multiplication": (seed) => largeMultiplication(seed).problems.map((item): RaceCard => ({
    parts: [`${item.left}${item.leftUnit}`, "×", `${item.right}${item.rightUnit}`, "=", blank(), item.resultUnit],
    answers: { a: [String(item.answer)] },
  })),
  "/arithmetic/grade-4-division": (seed) => division(seed).problems.map((item): RaceCard => ({
    prompt: "몫과 나머지",
    parts: [String(item.dividend), "÷", String(item.divisor), { br: true }, "몫", blank("q"), "나머지", blank("r")],
    answers: { q: [String(item.quotient)], r: [String(item.remainder)] },
  })),
  "/arithmetic/grade-4-decimals": (seed) => decimals(seed).problems.map((item): RaceCard => ({
    parts: [item.left, item.operator, item.right, "=", blank("a", "decimal")],
    answers: { a: [item.answer] },
  })),
  "/arithmetic/unit-conversion": (seed) => unitConversion(seed).problems.map((problem): RaceCard => {
    // 단위는 글자 조각으로 칸 뒤에 붙인다.
    const parts: RacePart[] = problem.left.flatMap((part) => [part.value, part.unit]);
    parts.push("=");
    for (const part of problem.answer) parts.push(blank(part.key, "decimal"), part.unit);
    return { parts, answers: Object.fromEntries(problem.answer.map((part) => [part.key, [part.value]])) };
  }),
  "/arithmetic/grade-5-decimals": (seed) => createGradeFiveDecimalSet(seed).problems.map((item): RaceCard => ({
    parts: [item.left.text, "×", item.right.text, "=", blank("a", "decimal")],
    answers: { a: [item.answer] },
  })),
};
