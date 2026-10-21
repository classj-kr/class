// 3학년 학습지(세로셈·단위 계산·나눗셈의 뜻)의 카드.
import { blank, equation, type RaceCard, type RaceDeck, type RacePart } from "../race-card-model.ts";
import { createProblemSet as addSubtract } from "../race-sets/grade-3-add-subtract.ts";
import { createProblemSet as addSubtractBlanks, digits, type DigitField } from "../race-sets/grade-3-add-subtract-blanks.ts";
import { createProblemSet as divisionOne, story, type GroupOption } from "../race-sets/grade-3-division-1.ts";
import { createProblemSet as multiplicationOne } from "../race-sets/grade-3-multiplication-1.ts";
import { createProblemSet as multiplicationThree } from "../race-sets/grade-3-multiplication-3.ts";
import { createProblemSet as divisionTwo } from "../race-sets/grade-3-division-2.ts";
import { createProblemSet as length } from "../race-sets/grade-3-length.ts";
import { createProblemSet as timeOne } from "../race-sets/grade-3-time-1.ts";
import { createProblemSet as timeTwo, UNIT_LABELS } from "../race-sets/grade-3-time-2.ts";
import { createProblemSet as measurement } from "../race-sets/grade-3-measurement.ts";
import type { TimeValue } from "../time-calculation.ts";

const TOP: DigitField[] = ["topHundreds", "topTens", "topOnes"];
const BOTTOM: DigitField[] = ["bottomHundreds", "bottomTens", "bottomOnes"];
const RESULT: DigitField[] = ["resultThousands", "resultHundreds", "resultTens", "resultOnes"];

// 세로셈 빈칸을 가로로: 숨긴 자리만 한 글자 칸으로 둔다.
function digitParts(values: Record<DigitField, string>, hidden: DigitField[], fields: DigitField[]): RacePart {
  const parts: RacePart[] = [];
  for (const field of fields) {
    const last = parts[parts.length - 1];
    if (hidden.includes(field)) parts.push(blank(field, "number", 1.2));
    else if (!values[field]) continue;
    else if (typeof last === "string") parts[parts.length - 1] = last + values[field]; // 이어진 숫자는 한 조각으로
    else parts.push(values[field]);
  }
  return { group: parts };
}

// 나눗셈 카드 그림: 식과 점 묶음.
const MARKS = ["①", "②", "③", "④"];
function optionSvg(mark: string, equationText: string, option: GroupOption) {
  const dot = 16, pad = 4, gap = 6;
  const groupWidth = option.groupSize * dot + pad * 2;
  const total = option.groupCount * groupWidth + (option.groupCount - 1) * gap;
  const start = (140 - total) / 2;
  const groups = Array.from({ length: option.groupCount }, (_, group) => {
    const x = start + group * (groupWidth + gap);
    const dots = Array.from({ length: option.groupSize }, (_, index) =>
      `<circle cx="${x + pad + dot / 2 + index * dot}" cy="62" r="6" fill="#f06b5b"/>`).join("");
    return `<rect x="${x}" y="50" width="${groupWidth}" height="24" rx="10" fill="none" stroke="#18233b" stroke-width="2"/>${dots}`;
  }).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 86" width="140" height="86" role="img" aria-label="${mark} ${equationText} ${option.groupSize}개씩 ${option.groupCount}묶음"><text x="70" y="28" text-anchor="middle" font-size="20" font-weight="800" fill="#18233b">${mark} ${equationText}</text>${groups}</svg>`;
}

function timeText(time: TimeValue, parts: (keyof TimeValue)[]) {
  return parts.map((part) => `${time[part]}${UNIT_LABELS[part]}`).join(" ");
}

export const decks: Record<string, RaceDeck> = {
  "/arithmetic/grade-3-add-subtract": (seed) => addSubtract(seed).problems.map((item) => equation(item.left, item.operator, item.right, item.result, "result")),
  "/arithmetic/grade-3-add-subtract-blanks": (seed) => addSubtractBlanks(seed).problems.map((item): RaceCard => {
    const values = digits(item);
    return {
      prompt: "빈칸에 알맞은 숫자",
      parts: [digitParts(values, item.hidden, TOP), item.operator, digitParts(values, item.hidden, BOTTOM), "=", digitParts(values, item.hidden, RESULT)],
      answers: Object.fromEntries(item.hidden.map((field) => [field, [values[field]]])),
    };
  }),
  "/arithmetic/grade-3-division-1": (seed) => divisionOne(seed).problems.map((item): RaceCard => ({
    prompt: story(item),
    parts: item.cards.map((card, index) => ({ svg: optionSvg(MARKS[index], card.equation, card.option) })),
    choices: MARKS,
    answers: { choice: [MARKS[item.correctCard]] },
  })),
  "/arithmetic/grade-3-multiplication-1": (seed) => multiplicationOne(seed).problems.map((item) => equation(item.top, "×", item.bottom, item.result, "result")),
  "/arithmetic/grade-3-multiplication-3": (seed) => multiplicationThree(seed).problems.map((item) => equation(item.left, "×", item.right, item.product, "result")),
  "/arithmetic/grade-3-division-2": (seed) => divisionTwo(seed).columns.flat().map((item): RaceCard => ({
    prompt: "몫과 나머지",
    parts: [String(item.dividend), "÷", String(item.divisor), "=", blank("q"), "…", blank("r")],
    answers: { q: [String(item.quotient)], r: [String(item.remainder)] },
  })),
  "/arithmetic/grade-3-length": (seed) => length(seed).problems.map((item): RaceCard => {
    const { major, minor } = item.units;
    return {
      parts: [`${item.left.major}${major} ${item.left.minor}${minor}`, item.operator, `${item.right.major}${major} ${item.right.minor}${minor}`, "=", blank("major"), major, blank("minor"), minor],
      answers: { major: [String(item.result.major)], minor: [String(item.result.minor)] },
    };
  }),
  "/arithmetic/grade-3-time-1": (seed) => timeOne(seed).problems.map((item): RaceCard => ({
    parts: [`${item.major}${item.majorUnit} ${item.minor}${item.minorUnit}`, "=", blank(), item.answerUnit],
    answers: { a: [String(item.result)] },
  })),
  "/arithmetic/grade-3-time-2": (seed) => timeTwo(seed).problems.map((item): RaceCard => ({
    parts: [
      timeText(item.left, item.parts), item.operator, timeText(item.right, item.parts), "=",
      ...item.answerParts.flatMap((part): RacePart[] => [blank(part), UNIT_LABELS[part]]),
    ],
    answers: Object.fromEntries(item.answerParts.map((part) => [part, [String(item.result[part])]])),
  })),
  "/arithmetic/grade-3-measurement": (seed) => measurement(seed).problems.map((item): RaceCard => ({
    parts: [
      `${item.left.major}${item.majorUnit} ${item.left.minor}${item.minorUnit}`, item.operator,
      `${item.right.major}${item.majorUnit} ${item.right.minor}${item.minorUnit}`, "=",
      blank("major"), item.majorUnit, blank("minor"), item.minorUnit,
    ],
    // 학습지는 0을 빈칸으로도 받지만, 카드는 칸을 모두 채워야 하므로 0을 쓴다.
    answers: { major: [String(item.answer.major)], minor: [String(item.answer.minor)] },
  })),
};
