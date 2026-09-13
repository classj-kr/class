export type RationalRadicalKind =
  | "rational-asymptotes-from-general" | "rational-coefficient" | "rational-value" | "rational-equation"
  | "radical-value" | "radical-coefficient" | "radical-equation";
export type RationalRadicalProblem = { id: string; kind: RationalRadicalKind; label: string; prompt: string; latex: string; answer: number[]; answerLabels: string[] };
const KINDS: RationalRadicalKind[] = [
  "rational-asymptotes-from-general", "rational-coefficient", "rational-value", "rational-equation",
  "radical-value", "radical-coefficient", "radical-equation",
];
function random(seed: number) { let value = seed >>> 0; return () => { value += 0x6d2b79f5; let n = value; n = Math.imul(n ^ (n >>> 15), n | 1); n ^= n + Math.imul(n ^ (n >>> 7), n | 61); return ((n ^ (n >>> 14)) >>> 0) / 4294967296; }; }
function integer(next: () => number, min: number, max: number) { return min + Math.floor(next() * (max - min + 1)); }
function nonzero(next: () => number, min = -5, max = 5) { let value = 0; while (!value) value = integer(next, min, max); return value; }
function signed(value: number) { return value === 0 ? "" : `${value < 0 ? "-" : "+"}${Math.abs(value)}`; }
function rational(a: number, h: number, k: number) { return `y=\\dfrac{${a}}{x${signed(-h)}}${signed(k)}`; }
function radical(a: number, h: number, k: number) { const coefficient = a === 1 ? "" : a === -1 ? "-" : a; return `y=${coefficient}\\sqrt{x${signed(-h)}}${signed(k)}`; }
function point(x: number, y: number) { return `(${x},\\ ${y})`; }
function build(kind: RationalRadicalKind, next: () => number, id: string): RationalRadicalProblem {
  const h = integer(next, -5, 5); const k = integer(next, -5, 5); const a = nonzero(next);
  if (kind === "rational-asymptotes-from-general") {
    const quotient = nonzero(next, -4, 4);
    const numeratorConstant = a - quotient * h;
    return {
      id, kind, label: "일반형 유리함수의 점근선 계산",
      prompt: "분자를 분모로 나누어 수직점근선과 수평점근선을 구하세요.",
      latex: `y=\\dfrac{${quotient}x${signed(numeratorConstant)}}{x${signed(-h)}}`,
      answer: [h, quotient], answerLabels: ["x", "y"],
    };
  }
  if (kind === "rational-coefficient") {
    const offset = nonzero(next, -4, 4); const x = h + offset;
    return { id, kind, label: "상수 결정", prompt: "그래프가 점 P를 지날 때, 𝑐는?", latex: `y=\\dfrac{c}{x${signed(-h)}}${signed(k)},\\qquad P${point(x, k + a * offset / offset)}`, answer: [a * offset], answerLabels: ["c"] };
  }
  if (kind === "rational-value") {
    const offset = nonzero(next, -4, 4);
    return {
      id, kind, label: "유리함수의 함숫값",
      prompt: `f(${h + offset})의 값은?`,
      latex: `f(x)=\\dfrac{${a * offset}}{x${signed(-h)}}${signed(k)}`,
      answer: [a + k], answerLabels: ["값"],
    };
  }
  if (kind === "rational-equation") {
    const offset = nonzero(next, -4, 4); const target = k + a;
    return { id, kind, label: "유리방정식의 해", prompt: "주어진 함수값을 만족하는 𝑥는?", latex: `${rational(a * offset, h, k)},\\qquad y=${target}`, answer: [h + offset], answerLabels: ["x"] };
  }
  if (kind === "radical-value") {
    const step = integer(next, 2, 5);
    const x = h + step * step;
    return { id, kind, label: "무리함수의 함숫값", prompt: `f(${x})의 값을 구하세요.`, latex: `f(x)=${radical(a, h, k).slice(2)}`, answer: [a * step + k], answerLabels: ["값"] };
  }
  if (kind === "radical-coefficient") {
    const step = integer(next, 1, 4);
    const x = h + step * step;
    const y = a * step + k;
    return {
      id, kind, label: "무리함수의 계수 결정",
      prompt: "그래프가 점 P를 지날 때, a는?",
      latex: `y=a\\sqrt{x${signed(-h)}}${signed(k)},\\qquad P${point(x, y)}`,
      answer: [a], answerLabels: ["a"],
    };
  }
  const step = integer(next, 1, 4); const x = h + step * step; const target = a * step + k;
  return { id, kind, label: "무리방정식의 해", prompt: "주어진 함수값을 만족하는 𝑥는?", latex: `${radical(a, h, k)},\\qquad y=${target}`, answer: [x], answerLabels: ["x"] };
}
export function createRationalRadicalProblemSet(seed: number) { const next = random(seed); return { seed, problems: KINDS.map((kind, index) => build(kind, next, `rational-radical-${index}`)) }; }
export function createRationalRadicalReviewProblems(kinds: RationalRadicalKind[], seed: number) { const next = random(seed); return [...new Set(kinds)].slice(0, 2).map((kind, index) => build(kind, next, `rational-radical-review-${index}-${seed}`)); }
export function sameRationalRadicalAnswer(values: string[], answer: number[]) { return values.length === answer.length && values.every((value, index) => /^-?\d+$/.test(value) && Number(value) === answer[index]); }
