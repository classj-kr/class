import { stemWorksheetCatalog } from "../lib/arithmetic-worksheets.ts";
import {
  createStemFoundationProblems,
  STEM_BRIDGE_KINDS,
  STEM_FOUNDATION_TITLES,
  type StemFoundationKind,
} from "../lib/stem-foundation-workouts.ts";

const EXCLUDED_ELEMENTARY_LABELS = new Set([
  "행렬과 벡터의 곱",
  "행렬의 덧셈",
  "행렬의 곱셈",
  "연립방정식",
  "기본 행연산",
]);

const EXCLUDED_UNIVERSITY_COURSE_LABELS = [
  "최소제곱",
  "대각화",
  "삼중적분",
  "라플라스",
  "푸리에",
  "수치해석",
];

const bridgeCatalog = stemWorksheetCatalog.slice(0, STEM_BRIDGE_KINDS.length);
const kinds = bridgeCatalog.map(({ route, title }) => {
  if (!route) throw new Error(`주소가 없는 이공계 기초 학습지: ${title}`);
  const kind = new URL(route, "https://worksheet.local").searchParams.get("kind");
  if (!kind || !STEM_BRIDGE_KINDS.some(value => value === kind)) {
    throw new Error(`공개 이공계 기초 범위를 벗어난 학습지: ${route}`);
  }
  return kind as StemFoundationKind;
});

if (bridgeCatalog.length !== STEM_BRIDGE_KINDS.length || stemWorksheetCatalog.length !== STEM_BRIDGE_KINDS.length) {
  throw new Error(`공개 목차 ${stemWorksheetCatalog.length}개는 공대 진학 준비 필수 6장이어야 합니다.`);
}

if (new Set(kinds).size !== kinds.length) {
  throw new Error("같은 이공계 기초 학습지가 목차에 중복되어 있습니다.");
}

const rows = bridgeCatalog.map((worksheet, index) => {
  const kind = kinds[index];
  const problems = createStemFoundationProblems(kind, 20260910);
  const labels = problems.map(({ label }) => label);
  const expressions = problems.map(({ latex, correctLatex }) => `${latex}|${correctLatex}`);
  const prompts = problems.map(({ prompt }) => prompt ?? "");
  const difficultyCounts = problems.reduce<Record<string, number>>((counts, problem) => {
    const difficulty = problem.difficulty ?? "missing";
    counts[difficulty] = (counts[difficulty] ?? 0) + 1;
    return counts;
  }, {});

  if (worksheet.title !== STEM_FOUNDATION_TITLES[kind]) {
    throw new Error(`${worksheet.route}: 목차 제목과 문제지 제목이 다릅니다.`);
  }
  if (problems.length !== 8) {
    throw new Error(`${worksheet.title}: 8문항이 아닙니다.`);
  }
  if (new Set(labels).size !== labels.length) {
    throw new Error(`${worksheet.title}: 숫자만 바꾼 동일 유형이 반복됩니다.`);
  }
  if (new Set(expressions).size !== expressions.length) {
    throw new Error(`${worksheet.title}: 같은 식과 정답이 반복됩니다.`);
  }
  if (labels.some((label) => EXCLUDED_ELEMENTARY_LABELS.has(label))) {
    throw new Error(`${worksheet.title}: 별도 훈련이 필요 없는 기초 유형이 섞였습니다.`);
  }
  if (labels.some((label) => EXCLUDED_UNIVERSITY_COURSE_LABELS.some((word) => label.includes(word)))) {
    throw new Error(`${worksheet.title}: 공대 진학 준비 범위를 넘는 대학 전공 유형이 섞였습니다.`);
  }
  if (prompts.some((prompt) => prompt.length < 3 || !/[?？.]$/.test(prompt))) {
    throw new Error(`${worksheet.title}: 무엇을 묻는지 분명하지 않은 발문이 있습니다.`);
  }

  return {
    title: worksheet.title,
    questions: problems.length,
    structures: new Set(labels).size,
    basic: difficultyCounts.basic ?? 0,
    application: difficultyCounts.application ?? 0,
    advanced: difficultyCounts.advanced ?? 0,
  };
});

console.table(rows);
console.log(`\n검사 완료: 이공계 기초 ${rows.length}장, ${rows.length * 8}문항의 중복·쉬운 단독 유형·범위 초과 0개.`);
