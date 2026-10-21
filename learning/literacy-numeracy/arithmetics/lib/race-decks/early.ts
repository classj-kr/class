// 1·2학년 수 세기·읽기·뛰어 세기·세로셈·시계 학습지의 카드.
import { blank, equation, type RaceCard, type RaceDeck, type RacePart } from "../race-card-model.ts";
import { createCountingSet, NUMBER_WORDS as COUNT_WORDS, random, shuffle } from "../race-sets/counting-1.ts";
import { createProblemSet as giveAndTake, type Counts } from "../race-sets/give-and-take-1.ts";
import { createProblemSet as numberReading } from "../race-sets/number-reading-1.ts";
import { createProblemSet as skipCounting } from "../race-sets/skip-counting-1.ts";
import { createProblemSet as verticalSet } from "../race-sets/grade-2-add-subtract-1.ts";
import { createProblemSet as digitSet, digits, type DigitField } from "../race-sets/grade-2-add-subtract-2.ts";
import { createProblemSet as groupCounting } from "../race-sets/group-counting-1.ts";
import { createProblemSet as clockSet } from "../race-sets/clock-1.ts";

const BR: RacePart = { br: true };

// 기호를 격자로 늘어놓은 그림.
function symbolGrid(symbol: string, count: number, columns: number) {
  const size = 30;
  const rows = Math.ceil(count / columns);
  const width = Math.min(count, columns) * size;
  const glyphs = Array.from({ length: count }, (_, index) =>
    `<text x="${(index % columns) * size + size / 2}" y="${Math.floor(index / columns) * size + size / 2}">${symbol}</text>`).join("");
  return { svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${rows * size}" width="${width}" height="${rows * size}" fill="currentColor" font-size="24" text-anchor="middle" dominant-baseline="central" role="img" aria-label="${symbol} 그림">${glyphs}</svg>` };
}

// 시침·분침이 있는 시계 그림.
function clockFace(hour: number, minute: number) {
  const point = (angle: number, length: number) => {
    const radians = (angle * Math.PI) / 180;
    return `x2="${(100 + Math.sin(radians) * length).toFixed(1)}" y2="${(100 - Math.cos(radians) * length).toFixed(1)}"`;
  };
  const ticks = Array.from({ length: 60 }, (_, index) => {
    const radians = (index * 6 * Math.PI) / 180;
    const inner = index % 5 === 0 ? 84 : 89;
    return `<line x1="${(100 + Math.sin(radians) * inner).toFixed(1)}" y1="${(100 - Math.cos(radians) * inner).toFixed(1)}" x2="${(100 + Math.sin(radians) * 93).toFixed(1)}" y2="${(100 - Math.cos(radians) * 93).toFixed(1)}" stroke-width="${index % 5 === 0 ? 2.5 : 1}"/>`;
  }).join("");
  const numbers = Array.from({ length: 12 }, (_, index) => {
    const radians = ((index + 1) * 30 * Math.PI) / 180;
    return `<text x="${(100 + Math.sin(radians) * 72).toFixed(1)}" y="${(100 - Math.cos(radians) * 72).toFixed(1)}">${index + 1}</text>`;
  }).join("");
  return { svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200" role="img" aria-label="시계"><circle cx="100" cy="100" r="95" fill="none" stroke="currentColor" stroke-width="3"/><g stroke="currentColor">${ticks}</g><g fill="currentColor" font-size="17" font-weight="bold" text-anchor="middle" dominant-baseline="central">${numbers}</g><g stroke="currentColor" stroke-linecap="round"><line x1="100" y1="100" ${point((hour % 12) * 30 + minute * 0.5, 48)} stroke-width="7"/><line x1="100" y1="100" ${point(minute * 6, 78)} stroke-width="3.5"/></g><circle cx="100" cy="100" r="5" fill="currentColor"/></svg>` };
}

function countsText(counts: Counts) {
  return `토끼 ${counts.토끼}장, 거북이 ${counts.거북이}장, 호랑이 ${counts.호랑이}장을 가지고 있습니다.`;
}

function threeFriends(): RacePart[] {
  return ["토끼", blank("r"), "장 거북이", blank("t"), "장 호랑이", blank("g"), "장"];
}

function threeAnswers(counts: Counts) {
  return { r: [String(counts.토끼)], t: [String(counts.거북이)], g: [String(counts.호랑이)] };
}

export const decks: Record<string, RaceDeck> = {
  "/arithmetic/counting-1": (seed) => {
    const set = createCountingSet(seed);
    const numbers = set.counts.slice(0, 3).map((count, index): RaceCard => ({
      prompt: "몇 개인지 숫자로 쓰세요.",
      parts: [symbolGrid(set.countSymbols[index], count, 9), BR, blank(), "개"],
      answers: { a: [String(count)] },
    }));
    const words = set.counts.slice(3, 6).map((count, index): RaceCard => ({
      prompt: "몇 개인지 한글로 쓰세요.",
      parts: [symbolGrid(set.countSymbols[index], count, 9), BR, blank("a", "text"), "개"],
      answers: { a: [COUNT_WORDS[count]] },
    }));
    // 그리기 문제는 주어진 수만큼 있는 그림을 고르는 문제로 바꾼다.
    const drawings = set.counts.slice(6, 9).map((count, index): RaceCard => {
      const symbol = set.drawSymbols[index];
      const others = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9].filter((value) => value !== count), random(seed ^ (index + 1) * 0x2f6b)).slice(0, 3);
      const choices = shuffle([count, ...others], random(seed ^ (index + 11) * 0x51ed)).map((value) => symbol.repeat(value));
      return {
        prompt: "주어진 수만큼 있는 것을 고르세요.",
        parts: [symbol, index === 1 ? `${COUNT_WORDS[count]} 개` : `${count}개`],
        choices,
        answers: { choice: [symbol.repeat(count)] },
      };
    });
    return [...numbers, ...words, ...drawings];
  },
  "/arithmetic/give-and-take-1": (seed) => {
    const set = giveAndTake(seed);
    return [
      {
        prompt: "세 친구의 카드는 각각 몇 장일까요?",
        parts: [countsText(set.initial), BR, `토끼는 거북이에게 ${set.first.toTurtle}장, 호랑이에게 ${set.first.toTiger}장을 주었습니다.`, BR, ...threeFriends()],
        answers: threeAnswers(set.first.after),
      },
      {
        prompt: "세 친구의 카드는 각각 몇 장일까요?",
        parts: [countsText(set.first.after), BR, `거북이는 호랑이에게 ${set.second.toTiger}장을 주고, 토끼에게 ${set.second.fromRabbit}장을 받았습니다.`, BR, ...threeFriends()],
        answers: threeAnswers(set.second.after),
      },
      {
        prompt: `${set.third.asked}의 카드는 몇 장일까요?`,
        parts: [countsText(set.second.after), BR, `호랑이는 토끼에게 ${set.third.fromRabbit}장을 받고, 거북이에게 ${set.third.toTurtle}장을 주었습니다.`, BR, set.third.asked, blank(), "장"],
        answers: { a: [String(set.third.after[set.third.asked])] },
      },
    ];
  },
  "/arithmetic/number-reading-1": (seed) => {
    const set = numberReading(seed);
    const card = (prompt: string) => (problem: { number: number; answer: string }): RaceCard => ({
      prompt,
      parts: [String(problem.number), "→", blank("a", "text")],
      answers: { a: [problem.answer] },
    });
    return [
      ...set.sinoKorean.map(card("한자어(일, 이, 삼…)로 읽어 쓰세요.")),
      ...set.nativeKorean.map(card("우리말(하나, 둘, 셋…)로 읽어 쓰세요.")),
    ];
  },
  "/arithmetic/skip-counting-1": (seed) => skipCounting(seed).problems.map((problem): RaceCard => ({
    prompt: "규칙에 맞게 뛰어 세세요.",
    parts: problem.values.flatMap((value, index): RacePart[] => [
      ...(index > 0 ? ["→"] : []),
      problem.hidden.includes(index) ? blank(`b${index}`) : String(value),
    ]),
    answers: Object.fromEntries(problem.hidden.map((index) => [`b${index}`, [String(problem.values[index])]])),
  })),
  "/arithmetic/grade-2-add-subtract-1": (seed) => verticalSet(seed).problems.map((problem) =>
    equation(problem.left, problem.operator, problem.right, problem.result, "result")),
  "/arithmetic/grade-2-add-subtract-2": (seed) => digitSet(seed).problems.map((problem): RaceCard => {
    const values = digits(problem);
    // 보이는 숫자끼리는 한 조각으로 붙여 한 수처럼 보이게 한다.
    const show = (fields: DigitField[]) => fields
      .filter((field) => values[field] !== "")
      .reduce<RacePart[]>((parts, field) => {
        const last = parts[parts.length - 1];
        if (problem.hidden.includes(field)) parts.push(blank(field));
        else if (typeof last === "string") parts[parts.length - 1] = last + values[field];
        else parts.push(values[field]);
        return parts;
      }, []);
    return {
      prompt: "빈칸에 알맞은 숫자를 쓰세요.",
      parts: [...show(["topTens", "topOnes"]), problem.operator, ...show(["bottomTens", "bottomOnes"]), "=", ...show(["resultHundreds", "resultTens", "resultOnes"])],
      answers: Object.fromEntries(problem.hidden.map((field) => [field, [values[field]]])),
    };
  }),
  "/arithmetic/group-counting-1": (seed) => groupCounting(seed).problems.map((problem): RaceCard => ({
    prompt: "모두 몇 개인지 세어 보세요.",
    parts: [symbolGrid(problem.symbol, problem.answer, problem.columns), BR, `${problem.symbol}: (`, blank(), ")개"],
    answers: { a: [String(problem.answer)] },
  })),
  "/arithmetic/clock-1": (seed) => clockSet(seed).problems.map((problem): RaceCard => ({
    prompt: "시각을 숫자로 쓰고 읽어 보세요.",
    parts: [clockFace(problem.hour, problem.minute), BR, blank("hour"), "시", blank("minute"), "분", BR, "읽기", blank("reading", "text")],
    answers: { hour: [String(problem.hour)], minute: [String(problem.minute)], reading: [problem.reading] },
  })),
};
