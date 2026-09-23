export type MiddleQuadraticFunctionMethodKind =
  | "expand-vertex-form"
  | "complete-square"
  | "vertex-axis"
  | "extreme-value"
  | "equation-from-vertex-point"
  | "intercepts"
  | "line-intersections"
  | "normalize-first"

export type MiddleQuadraticFunctionKind =
  | "values-and-forms"
  | "vertex-and-axis"
  | "determine-equation"
  | "intercepts-and-intersections"
  | "comprehensive";

export type MiddleQuadraticFunctionDifficulty = "basic" | "application" | "advanced";

export type MiddleQuadraticFunctionProblem = {
  id: string;
  kind: MiddleQuadraticFunctionMethodKind;
  difficulty: MiddleQuadraticFunctionDifficulty;
  structure: string;
  label: string;
  latex: string;
  answerLatex: string;
  solutionHint: string;
  distractors: string[];
};

export const MIDDLE_QUADRATIC_FUNCTION_KINDS: MiddleQuadraticFunctionKind[] = [
  "comprehensive",
];

export const MIDDLE_QUADRATIC_FUNCTION_METHOD_KINDS: MiddleQuadraticFunctionMethodKind[] = [
  "expand-vertex-form",
  "complete-square",
  "vertex-axis",
  "extreme-value",
  "equation-from-vertex-point",
  "intercepts",
  "line-intersections",
  "normalize-first",
];

export const MIDDLE_QUADRATIC_FUNCTION_TITLES: Record<MiddleQuadraticFunctionKind, string> = {
  "values-and-forms": "이차함수",
  "vertex-and-axis": "이차함수",
  "determine-equation": "이차함수",
  "intercepts-and-intersections": "이차함수",
  comprehensive: "이차함수",
};

const MIDDLE_QUADRATIC_FUNCTION_METHOD_TITLES: Record<MiddleQuadraticFunctionMethodKind, string> = {
  "expand-vertex-form": "꼭짓점형 전개",
  "complete-square": "일반형을 꼭짓점형으로",
  "vertex-axis": "꼭짓점과 대칭축",
  "extreme-value": "최댓값·최솟값",
  "equation-from-vertex-point": "꼭짓점과 한 점으로 식 구하기",
  intercepts: "x절편과 y절편",
  "line-intersections": "직선과의 교점 계산",
  "normalize-first": "식 정리 후 꼭짓점",
};

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

const integer = (next: () => number, minimum: number, maximum: number) =>
  minimum + Math.floor(next() * (maximum - minimum + 1));

function nonzero(next: () => number, minimum: number, maximum: number) {
  let value = 0;
  while (value === 0) value = integer(next, minimum, maximum);
  return value;
}

function gcd(left: number, right: number): number {
  return right === 0 ? Math.abs(left) : gcd(right, left % right);
}

function numberLatex(value: number) {
  if (Number.isInteger(value)) return String(value);
  const numerator = Math.round(value * 2);
  const divisor = gcd(numerator, 2);
  const top = numerator / divisor;
  const bottom = 2 / divisor;
  if (bottom === 1) return String(top);
  return top < 0
    ? `-\\dfrac{${Math.abs(top)}}{${bottom}}`
    : `\\dfrac{${top}}{${bottom}}`;
}

function signedNumber(value: number) {
  return value < 0 ? numberLatex(value) : `+${numberLatex(value)}`;
}

function coefficient(value: number, variable: string, first = false) {
  if (value === 0) return "";
  const sign = value < 0 ? "-" : first ? "" : "+";
  const magnitude = Math.abs(value);
  return `${sign}${magnitude === 1 && variable ? "" : numberLatex(magnitude)}${variable}`;
}

function quadraticExpression(a: number, b: number, c: number) {
  return `${coefficient(a, "x^2", true)}${coefficient(b, "x")}${coefficient(c, "")}`;
}

function linearExpression(a: number, b: number) {
  return `${coefficient(a, "x", true)}${coefficient(b, "")}`;
}

function vertexForm(a: number, p: number, q: number) {
  const factor = a === 1 ? "" : a === -1 ? "-" : numberLatex(a);
  const inside = p === 0 ? "x" : `x${p > 0 ? "-" : "+"}${Math.abs(p)}`;
  return `y=${factor}(${inside})^2${q === 0 ? "" : signedNumber(q)}`;
}

function generalForm(a: number, b: number, c: number) {
  return `y=${quadraticExpression(a, b, c)}`;
}

function rootPairAnswer(first: number, second: number) {
  const roots = [...new Set([first, second])].sort((left, right) => left - right);
  return roots.length === 1
    ? `x=${numberLatex(roots[0])}`
    : `x=${roots.map(numberLatex).join(",\\ ")}`;
}

function uniqueDistractors(answer: string, candidates: string[], context: string) {
  const simpleValue = answer.match(/^([ya])=(-?\d+)$/);
  const derived = simpleValue
    ? [
      `${simpleValue[1]}=${Number(simpleValue[2]) + 1}`,
      `${simpleValue[1]}=${Number(simpleValue[2]) - 1}`,
      `${simpleValue[1]}=${Number(simpleValue[2]) + 2}`,
      `${simpleValue[1]}=${-Number(simpleValue[2])}`,
    ]
    : [];
  const unique = [
    ...new Set([...candidates, ...derived].filter((candidate) => candidate !== answer)),
  ];
  if (unique.length < 3) {
    throw new Error(`${context}: 실제 오답이 세 개보다 적습니다.`);
  }
  return unique.slice(0, 3);
}

function make(
  id: string,
  kind: MiddleQuadraticFunctionMethodKind,
  latex: string,
  answerLatex: string,
  solutionHint: string,
  distractors: string[],
  structure: string = kind,
): MiddleQuadraticFunctionProblem {
  return {
    id,
    kind,
    difficulty: "basic",
    structure,
    label: MIDDLE_QUADRATIC_FUNCTION_METHOD_TITLES[kind],
    latex,
    answerLatex,
    solutionHint,
    distractors: uniqueDistractors(answerLatex, distractors, `${kind}/${id}`),
  };
}

function distinctRoots(next: () => number, limit: number) {
  const first = nonzero(next, -limit, limit);
  let second = nonzero(next, -limit, limit);
  while (second === first) second = nonzero(next, -limit, limit);
  return [first, second] as const;
}

function build(
  kind: MiddleQuadraticFunctionMethodKind,
  next: () => number,
  id: string,
  variantHint = 0,
): MiddleQuadraticFunctionProblem {
  const coefficientLimit = variantHint < 5 ? 4 : 6;
  const a = nonzero(next, -coefficientLimit, coefficientLimit);
  const p = integer(next, -6, 6);
  const q = integer(next, -8, 8);
  let x = integer(next, -7, 7);
  while (x === p) x = integer(next, -7, 7);

  if (kind === "expand-vertex-form") {
    const b = -2 * a * p;
    const c = a * p * p + q;
    const answer = generalForm(a, b, c);
    return make(id, kind, vertexForm(a, p, q), answer,
      `괄호를 제곱한 뒤 ${a}를 분배하고 동류항을 정리한다.`,
      [
        generalForm(a, 2 * a * p, c),
        generalForm(a, -2 * p, p * p + q),
        generalForm(a, b, q),
        generalForm(a, b + a, c),
        generalForm(a, b - a, c),
        generalForm(a, b, c + 1),
        generalForm(a, b, c - 1),
      ],
      a === 1 ? "monic-expansion" : "scaled-expansion");
  }

  if (kind === "complete-square") {
    const b = -2 * a * p;
    const c = a * p * p + q;
    const answer = vertexForm(a, p, q);
    return make(id, kind, generalForm(a, b, c), answer,
      `${a}를 먼저 묶고 x의 계수 절반을 이용해 완전제곱식을 만든다.`,
      [
        vertexForm(a, -p, q),
        vertexForm(a, p, -q),
        vertexForm(a, p, c),
        vertexForm(a, p + 1, q),
        vertexForm(a, p - 1, q),
        vertexForm(a, p, q + 1),
        vertexForm(a, p, q - 1),
      ],
      a === 1 ? "monic-completing-square" : "scaled-completing-square");
  }

  if (kind === "vertex-axis") {
    const b = -2 * a * p;
    const c = a * p * p + q;
    const answer = `\\text{꼭짓점 }(${p},${q}),\\quad x=${p}`;
    return make(id, kind, generalForm(a, b, c), answer,
      `완전제곱하여 ${vertexForm(a, p, q)}로 바꾸고 p와 q를 읽는다.`,
      [
        `\\text{꼭짓점 }(${-p},${q}),\\quad x=${-p}`,
        `\\text{꼭짓점 }(${p},${-q}),\\quad x=${p}`,
        `\\text{꼭짓점 }(${q},${p}),\\quad x=${q}`,
        `\\text{꼭짓점 }(${p + 1},${q}),\\quad x=${p + 1}`,
        `\\text{꼭짓점 }(${p - 1},${q}),\\quad x=${p - 1}`,
        `\\text{꼭짓점 }(${p},${q + 1}),\\quad x=${p}`,
        `\\text{꼭짓점 }(${p},${q - 1}),\\quad x=${p}`,
      ],
      a === 1 ? "monic-vertex-axis" : "scaled-vertex-axis");
  }

  if (kind === "extreme-value") {
    const extremeLabel = a > 0 ? "최솟값" : "최댓값";
    const oppositeLabel = a > 0 ? "최댓값" : "최솟값";
    const step = Math.abs(a);
    const answer = `\\text{${extremeLabel} }${q}`;
    return make(id, kind, vertexForm(a, p, q), answer,
      `계수 a의 부호로 아래·위 방향을 판단하고 꼭짓점의 y좌표 ${q}를 ${extremeLabel}으로 읽는다.`,
      [
        `\\text{${oppositeLabel} }${q}`,
        `\\text{${extremeLabel} }${q + step}`,
        `\\text{${extremeLabel} }${q - step}`,
      ],
      a > 0 ? "minimum-from-vertex" : "maximum-from-vertex");
  }

  if (kind === "equation-from-vertex-point") {
    const value = a * (x - p) ** 2 + q;
    const answer = vertexForm(a, p, q);
    return make(id, kind,
      `\\text{꼭짓점 }(${p},${q}),\\quad \\text{지나는 점 }(${x},${value})`,
      answer,
      "꼭짓점형에 주어진 점을 대입해 a를 구한 뒤 식을 완성한다.",
      [
        vertexForm(-a, p, q),
        vertexForm(a, -p, q),
        vertexForm(a, p, -q),
        vertexForm(a, p + 1, q),
        vertexForm(a, p - 1, q),
        vertexForm(a, p, q + 1),
        vertexForm(a, p, q - 1),
      ],
      a > 0 ? "upward-equation" : "downward-equation");
  }

  if (kind === "intercepts") {
    const [first, second] = distinctRoots(next, variantHint < 5 ? 5 : 8);
    const [smaller, larger] = [first, second].sort((left, right) => left - right);
    const b = -a * (first + second);
    const c = a * first * second;
    const answer = `x:${smaller},\\ ${larger},\\quad y:${c}`;
    return make(id, kind, generalForm(a, b, c), answer,
      "y=0을 놓아 두 x절편을 구하고 x=0을 대입해 y절편을 구한다.",
      [
        `x:${-first},\\ ${-second},\\quad y:${c}`,
        `x:${first},\\ ${second},\\quad y:${-c}`,
        `x:${first + second},\\ ${first * second},\\quad y:${c}`,
        `x:${smaller + 1},\\ ${larger + 1},\\quad y:${c}`,
        `x:${smaller - 1},\\ ${larger - 1},\\quad y:${c}`,
        `x:${smaller},\\ ${larger},\\quad y:${c + 1}`,
      ],
      c < 0 ? "opposite-sign-intercepts" : "same-sign-intercepts");
  }

  if (kind === "line-intersections") {
    const [first, second] = distinctRoots(next, variantHint < 5 ? 5 : 8);
    const lineSlope = nonzero(next, -4, 4);
    const lineConstant = integer(next, -6, 6);
    const quadraticB = lineSlope - a * (first + second);
    const quadraticC = lineConstant + a * first * second;
    const answer = rootPairAnswer(first, second);
    return make(id, kind,
      `${generalForm(a, quadraticB, quadraticC)},\\quad y=${linearExpression(lineSlope, lineConstant)}`,
      answer,
      "두 식의 y를 같게 놓고 한쪽으로 이항하여 이차방정식을 푼다.",
      [
        rootPairAnswer(-first, -second),
        rootPairAnswer(first + 1, second + 1),
        rootPairAnswer(first + second, first * second),
        rootPairAnswer(first, first),
        rootPairAnswer(second, second),
        rootPairAnswer(first - 1, second - 1),
      ],
      first * second < 0 ? "mixed-intersections" : "same-side-intersections");
  }

  if (kind === "normalize-first") {
    const extraLinear = nonzero(next, -7, 7);
    const targetB = -2 * a * p;
    const firstLinear = targetB - extraLinear;
    const extraConstant = nonzero(next, -8, 8);
    const targetC = a * p * p + q;
    const firstConstant = targetC - extraConstant;
    const latex = `y=${quadraticExpression(a, firstLinear, firstConstant)}${coefficient(extraLinear, "x")}${coefficient(extraConstant, "")}`;
    const answer = `\\text{꼭짓점 }(${p},${q}),\\quad x=${p}`;
    return make(id, kind, latex, answer,
      "동류항을 먼저 합친 뒤 완전제곱하여 꼭짓점과 대칭축을 구한다.",
      [
        `\\text{꼭짓점 }(${-p},${q}),\\quad x=${-p}`,
        `\\text{꼭짓점 }(${p},${-q}),\\quad x=${p}`,
        `\\text{꼭짓점 }(${q},${p}),\\quad x=${q}`,
        `\\text{꼭짓점 }(${p + 1},${q}),\\quad x=${p + 1}`,
        `\\text{꼭짓점 }(${p - 1},${q}),\\quad x=${p - 1}`,
        `\\text{꼭짓점 }(${p},${q + 1}),\\quad x=${p}`,
        `\\text{꼭짓점 }(${p},${q - 1}),\\quad x=${p}`,
      ],
      variantHint < 4 ? "combine-linear-terms" : "combine-all-like-terms");
  }

  throw new Error(`지원하지 않는 이차함수 계산 유형: ${kind}`);
}

function difficultyForIndex(index: number): MiddleQuadraticFunctionDifficulty {
  if (index < 2) return "basic";
  if (index < 5) return "application";
  return "advanced";
}

export function isMiddleQuadraticFunctionKind(value: string | null): value is MiddleQuadraticFunctionKind {
  return MIDDLE_QUADRATIC_FUNCTION_KINDS.includes(value as MiddleQuadraticFunctionKind);
}

export function resolveMiddleQuadraticFunctionKind(value: string | null): MiddleQuadraticFunctionKind | null {
  if (
    value === "comprehensive"
    || value === "values-and-forms"
    || value === "vertex-and-axis"
    || value === "determine-equation"
    || value === "intercepts-and-intersections"
    || value === "basic-value"
    || value === "vertex-value"
    || value === "coefficient-from-point"
    || value === "fraction-decimal"
    || MIDDLE_QUADRATIC_FUNCTION_METHOD_KINDS.includes(value as MiddleQuadraticFunctionMethodKind)
  ) {
    return "comprehensive";
  }
  return null;
}

const CONSOLIDATED_METHOD_PLAN: MiddleQuadraticFunctionMethodKind[] = [
  "expand-vertex-form",
  "vertex-axis",
  "complete-square",
  "extreme-value",
  "normalize-first",
  "equation-from-vertex-point",
  "intercepts",
  "line-intersections",
];

export function createMiddleQuadraticFunctionProblemSet(
  _kind: MiddleQuadraticFunctionKind,
  seed: number,
) {
  const next = random(seed);
  return {
    seed,
    kind: "comprehensive" as const,
    problems: CONSOLIDATED_METHOD_PLAN.map((method, index) => ({
      ...build(
        method,
        next,
        "middle-quadratic-function-comprehensive-" + index,
        index,
      ),
      difficulty: difficultyForIndex(index),
    })),
  };
}
export function createMiddleQuadraticFunctionReviewProblems(
  kinds: MiddleQuadraticFunctionMethodKind[],
  seed: number,
) {
  const next = random(seed);
  return [...new Set(kinds)].slice(0, 2).map((kind, index) => ({
    ...build(kind, next, `middle-quadratic-function-review-${kind}-${index}-${seed}`, index),
    difficulty: difficultyForIndex(index),
  }));
}
