export type MiddleCurriculumKind =
  | "coordinate-proportion"
  | "linear-function-basics"
  | "construction-congruence"
  | "frequency-graphs"
  | "plane-geometry"
  | "solid-geometry"
  | "triangle-quadrilateral"
  | "pythagorean"
  | "counting-probability"
  | "quartiles-boxplot";

export type MiddleCurriculumDifficulty = "basic" | "application" | "advanced";

export type MiddleCurriculumProblem = {
  id: string;
  kind: string;
  difficulty: MiddleCurriculumDifficulty;
  structure: string;
  label: string;
  latex: string;
  answerLatex: string;
  solutionHint: string;
  distractors: string[];
  question?: string;
  visual?: MiddleCurriculumVisual;
};

export type MiddleCurriculumVisual =
  | { type: "geometry"; variant: string; labels?: string[] }
  | { type: "histogram" | "frequency-polygon"; values: number[]; labels: string[]; highlight?: number };

export const MIDDLE_CURRICULUM_KINDS: MiddleCurriculumKind[] = [
  "coordinate-proportion",
  "linear-function-basics",
  "frequency-graphs",
  "plane-geometry",
  "solid-geometry",
  "triangle-quadrilateral",
  "pythagorean",
  "counting-probability",
  "quartiles-boxplot",
];

export const MIDDLE_CURRICULUM_TITLES: Record<MiddleCurriculumKind, string> = {
  "coordinate-proportion": "좌표·정비례·반비례 계산",
  "linear-function-basics": "일차함수",
  "construction-congruence": "기본도형·작도·합동",
  "frequency-graphs": "도수분포·상대도수 그래프",
  "plane-geometry": "기본각·다각형·부채꼴 계산",
  "solid-geometry": "입체도형의 겉넓이와 부피",
  "triangle-quadrilateral": "삼각형과 사각형의 계산",
  pythagorean: "피타고라스 정리 계산",
  "counting-probability": "경우의 수와 확률 계산",
  "quartiles-boxplot": "사분위수와 상자그림 계산",
};

export const MIDDLE_CURRICULUM_GRADES: Record<MiddleCurriculumKind, string> = {
  "coordinate-proportion": "중1",
  "linear-function-basics": "중2",
  "construction-congruence": "중1",
  "frequency-graphs": "중1",
  "plane-geometry": "중1",
  "solid-geometry": "중1",
  "triangle-quadrilateral": "중2",
  pythagorean: "중2",
  "counting-probability": "중2",
  "quartiles-boxplot": "중3",
};

const METHOD_PLANS: Record<MiddleCurriculumKind, string[]> = {
  "coordinate-proportion": [
    "direct-input",
    "inverse-input",
    "direct-coefficient",
    "direct-value",
    "inverse-coefficient",
    "inverse-value",
    "direct-table",
    "inverse-table",
  ],
  "linear-function-basics": [
    "function-value",
    "table-equation",
    "slope-two-points",
    "both-intercepts",
    "equation-two-points",
    "parallel-through-point",
    "intersection",
    "two-lines-parameter",
  ],
  "construction-congruence": [
    "line-relation",
    "line-plane-relation",
    "perpendicular-bisector",
    "angle-bisector",
    "triangle-construction",
    "sss-congruence",
    "sas-congruence",
    "asa-congruence",
  ],
  "frequency-graphs": [
    "frequency-table",
    "histogram-frequency",
    "histogram-total",
    "frequency-polygon-maximum",
    "relative-frequency",
    "relative-frequency-compare",
    "missing-class-frequency",
    "class-width",
  ],
  "plane-geometry": [
    "vertical-angles",
    "parallel-angles",
    "triangle-angle",
    "polygon-interior-sum",
    "regular-polygon-angle",
    "regular-polygon-exterior",
    "polygon-diagonals",
    "sector-arc-area",
  ],
  "solid-geometry": [
    "joined-prism-pyramid-volume",
    "open-pyramid-surface",
    "drilled-prism-volume",
    "hollow-cylinder-volume",
    "hollow-cylinder-surface",
    "open-cylinder-surface",
    "joined-cylinder-cone-volume",
    "capsule-volume-surface",
  ],
  "triangle-quadrilateral": [
    "isosceles-angle",
    "triangle-exterior",
    "parallelogram-angle",
    "parallelogram-side",
    "trapezoid-midline",
    "circumcenter-distance",
    "incenter-bisector",
    "centroid-ratio",
  ],
  pythagorean: [
    "hypotenuse",
    "missing-leg",
    "rectangle-diagonal",
    "square-diagonal",
    "solid-diagonal",
    "right-triangle-check",
    "isosceles-height",
    "composite-distance",
  ],
  "counting-probability": [
    "addition-rule",
    "multiplication-rule",
    "two-digit-numbers",
    "outfit-count",
    "die-probability",
    "two-dice-sum",
    "complement-probability",
    "two-step-probability",
  ],
  "quartiles-boxplot": [
    "median",
    "first-quartile",
    "third-quartile",
    "interquartile-range",
    "range",
    "five-number-summary",
    "missing-maximum",
    "compare-boxplots",
  ],
};

const METHOD_TITLES: Record<string, string> = {
  "direct-input": "정비례의 역산",
  "inverse-input": "반비례의 역산",
  "direct-coefficient": "정비례 상수",
  "direct-value": "정비례의 값",
  "inverse-coefficient": "반비례 상수",
  "inverse-value": "반비례의 값",
  "direct-table": "정비례 표의 빈칸",
  "inverse-table": "반비례 표의 빈칸",
  "function-value": "일차함수의 함숫값",
  "table-equation": "표에서 일차함수의 식 구하기",
  "input-from-value": "함숫값에서 x 구하기",
  "slope-two-points": "두 점을 지나는 기울기",
  "both-intercepts": "x절편과 y절편",
  "y-intercept": "y절편",
  "x-intercept": "x절편",
  "equation-slope-intercept": "기울기와 절편으로 식 구하기",
  "coefficient-from-point": "한 점으로 계수 구하기",
  "parallel-slope": "평행한 직선의 기울기",
  "point-parameter": "그래프 위의 점",
  "equation-two-points": "두 점으로 일차함수 구하기",
  "parallel-through-point": "한 점을 지나는 평행선",
  intersection: "두 일차함수의 교점",
  "system-graph-solution": "그래프와 연립방정식",
  "x-axis-intersection": "x축과의 교점",
  "y-axis-intersection": "y축과의 교점",
  "two-lines-parameter": "두 직선의 교점 조건",
  "line-relation": "두 직선의 위치 관계",
  "line-plane-relation": "직선과 평면의 위치 관계",
  "perpendicular-bisector": "선분의 수직이등분선 작도",
  "angle-bisector": "각의 이등분선 작도",
  "triangle-construction": "삼각형의 작도",
  "sss-congruence": "SSS 합동",
  "sas-congruence": "SAS 합동",
  "asa-congruence": "ASA 합동",
  "frequency-table": "도수분포표",
  "histogram-frequency": "히스토그램의 도수",
  "histogram-total": "히스토그램의 전체 도수",
  "frequency-polygon-maximum": "도수분포다각형",
  "relative-frequency": "상대도수",
  "relative-frequency-compare": "두 집단의 상대도수",
  "missing-class-frequency": "빠진 계급의 도수",
  "class-width": "계급의 크기",
  "vertical-angles": "맞꼭지각",
  "parallel-angles": "평행선의 동위각·엇각",
  "triangle-angle": "삼각형의 내각",
  "polygon-interior-sum": "다각형의 내각의 합",
  "regular-polygon-angle": "정다각형의 한 내각",
  "regular-polygon-exterior": "정다각형의 한 외각",
  "polygon-diagonals": "다각형의 대각선",
  "sector-arc-area": "부채꼴의 호와 넓이",
  "joined-prism-pyramid-volume": "각기둥과 각뿔을 붙인 입체",
  "open-pyramid-surface": "밑면이 없는 각뿔",
  "drilled-prism-volume": "원기둥 모양 구멍을 뚫은 각기둥",
  "hollow-cylinder-volume": "속이 빈 원기둥의 부피",
  "hollow-cylinder-surface": "속이 빈 원기둥의 겉넓이",
  "open-cylinder-surface": "윗면이 없는 원기둥",
  "joined-cylinder-cone-volume": "원기둥과 원뿔을 붙인 입체",
  "capsule-volume-surface": "캡슐 모양 입체",
  "isosceles-angle": "이등변삼각형의 각",
  "triangle-exterior": "삼각형의 외각",
  "parallelogram-angle": "평행사변형의 각",
  "parallelogram-side": "평행사변형의 변",
  "trapezoid-midline": "사다리꼴의 중점연결선",
  "circumcenter-distance": "외심과 꼭짓점의 거리",
  "incenter-bisector": "내심과 각의 이등분",
  "centroid-ratio": "삼각형의 무게중심",
  "scale-factor": "닮음비",
  "missing-side": "닮은 도형의 대응변",
  "perimeter-ratio": "둘레의 길이의 비",
  "area-ratio": "넓이의 비",
  "parallel-segment": "평행선과 선분의 비",
  "midpoint-segment": "삼각형의 중점연결정리",
  "two-triangles": "두 삼각형의 닮음",
  "combined-similarity": "닮음의 종합 계산",
  hypotenuse: "빗변의 길이",
  "missing-leg": "직각변의 길이",
  "rectangle-diagonal": "직사각형의 대각선",
  "square-diagonal": "정사각형의 대각선",
  "solid-diagonal": "직육면체의 대각선",
  "right-triangle-check": "직각삼각형 판별",
  "isosceles-height": "이등변삼각형의 높이",
  "composite-distance": "피타고라스 정리의 활용",
  "addition-rule": "합의 법칙",
  "multiplication-rule": "곱의 법칙",
  "two-digit-numbers": "두 자리 수의 경우의 수",
  "outfit-count": "두 단계 선택",
  "die-probability": "주사위의 확률",
  "two-dice-sum": "두 주사위의 확률",
  "complement-probability": "여사건의 확률",
  "two-step-probability": "두 단계 사건의 확률",
  median: "중앙값",
  "first-quartile": "제1사분위수",
  "third-quartile": "제3사분위수",
  "interquartile-range": "사분위범위",
  range: "범위",
  "five-number-summary": "다섯 수 요약",
  "missing-maximum": "상자그림에서 최댓값",
  "compare-boxplots": "두 상자그림의 산포도 비교",
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

function fraction(numerator: number, denominator: number) {
  const sign = denominator < 0 ? -1 : 1;
  const divisor = gcd(numerator, denominator);
  const top = sign * numerator / divisor;
  const bottom = sign * denominator / divisor;
  if (bottom === 1) return `${top}`;
  return top < 0
    ? `-\\dfrac{${Math.abs(top)}}{${bottom}}`
    : `\\dfrac{${top}}{${bottom}}`;
}

function coefficient(value: number, variable: string, first = false) {
  if (value === 0) return "";
  const sign = value < 0 ? "-" : first ? "" : "+";
  const magnitude = Math.abs(value);
  return `${sign}${magnitude === 1 && variable ? "" : magnitude}${variable}`;
}

function linear(a: number, b: number, variable = "x") {
  return `${coefficient(a, variable, true)}${coefficient(b, "", false)}`;
}

function equation(m: number, b: number) {
  return `y=${linear(m, b)}`;
}

function degree(value: number) {
  return `${value}^{\\circ}`;
}

function piTerm(coefficientValue: number) {
  if (coefficientValue === 0) return "0";
  if (coefficientValue === 1) return "\\pi";
  if (Number.isInteger(coefficientValue)) return `${coefficientValue}\\pi`;
  for (let denominator = 2; denominator <= 360; denominator += 1) {
    const numerator = Math.round(coefficientValue * denominator);
    if (Math.abs(numerator / denominator - coefficientValue) > 1e-10) continue;
    const divisor = gcd(numerator, denominator);
    const top = numerator / divisor;
    const bottom = denominator / divisor;
    return `\\dfrac{${top === 1 ? "" : top}\\pi}{${bottom}}`;
  }
  throw new Error(`π의 계수를 정확한 분수로 나타낼 수 없습니다: ${coefficientValue}`);
}

function uniqueDistractors(answer: string, candidates: string[], context: string) {
  const unique = [...new Set(candidates.filter((candidate) => candidate !== answer))];
  if (unique.length < 3) {
    throw new Error(`${context}: 실제 오답이 부족합니다: ${answer} / ${candidates.join(",")}`);
  }
  return unique.slice(0, 3);
}

function make(
  id: string,
  kind: string,
  latex: string,
  answerLatex: string,
  solutionHint: string,
  distractors: string[],
  structure: string = kind,
): MiddleCurriculumProblem {
  return {
    id,
    kind,
    difficulty: "basic",
    structure,
    label: METHOD_TITLES[kind],
    latex,
    answerLatex,
    solutionHint,
    distractors: uniqueDistractors(answerLatex, distractors, kind),
  };
}

function withGeometry(
  problem: MiddleCurriculumProblem,
  variant: string,
  labels: string[],
): MiddleCurriculumProblem {
  return { ...problem, visual: { type: "geometry", variant, labels } };
}

function buildCoordinate(
  method: string,
  next: () => number,
  id: string,
  index: number,
) {
  const a = nonzero(next, -6, 6);
  const x = nonzero(next, -6, 6);
  if (method === "direct-input") {
    const y = a * x;
    return make(id, method, `y=${coefficient(a, "x", true)},\\quad y=${y},\\quad x=?`, `${x}`,
      `${coefficient(a, "x", true)}=${y}인 일차방정식을 풀어 x를 구한다.`,
      [`${-x}`, `${y - a}`, `${x + 1}`, `${x - 1}`, `${y}`, `${a}`]);
  }
  if (method === "inverse-input") {
    const y = nonzero(next, -7, 7);
    const constant = x * y;
    return make(id, method, `y=\\dfrac{${constant}}{x},\\quad y=${y},\\quad x=?`, `${x}`,
      `xy=${constant}에 y=${y}를 대입해 x=${constant}\\div${y}로 구한다.`,
      [`${-x}`, `${constant - y}`, `${x + 1}`, `${x - 1}`, `${constant}`, `${y}`]);
  }
  if (method === "direct-coefficient") {
    const y = a * x;
    return make(id, method, `y=ax,\\quad (x,y)=(${x},${y}),\\quad a=?`, `${a}`,
      `정비례식 y=ax에 좌표를 대입해 a=${y}\\div${x}로 구한다.`,
      [`${-a}`, `${a + 1}`, `${a * x}`, `${a - 1}`, `${x}`, `${y}`]);
  }
  if (method === "direct-value") {
    const y = a * x;
    return make(id, method, `y=${coefficient(a, "x", true)},\\quad x=${x},\\quad y=?`, `${y}`,
      `정비례식에 x=${x}를 대입해 ${a}\\times${x}를 계산한다.`,
      [`${a + x}`, `${-y}`, `${y + a}`, `${y - a}`, `${a}`, `${x}`]);
  }
  if (method === "inverse-coefficient") {
    const y = nonzero(next, -6, 6);
    const constant = x * y;
    return make(id, method, `y=\\dfrac{a}{x},\\quad (x,y)=(${x},${y}),\\quad a=?`, `${constant}`,
      `반비례식 xy=a를 이용해 ${x}\\times${y}를 계산한다.`,
      [`${x + y}`, `${-constant}`, `${x - y}`, `${y - x}`, `${x}`, `${y}`]);
  }
  if (method === "inverse-value") {
    const targetX = nonzero(next, 2, 7);
    const targetY = nonzero(next, -7, 7);
    const constant = targetX * targetY;
    return make(id, method, `y=\\dfrac{${constant}}{x},\\quad x=${targetX},\\quad y=?`, `${targetY}`,
      `y=${constant}\\div${targetX}로 반비례식의 값을 구한다.`,
      [`${-targetY}`, `${constant - targetX}`, `${targetX}`, `${constant}`, `${targetY + targetX}`, `${targetY - targetX}`]);
  }
  if (method === "direct-table") {
    const firstX = nonzero(next, 2, 5);
    const secondX = firstX + integer(next, 1, 4);
    return make(id, method,
      `\\begin{array}{c|cc}x&${firstX}&${secondX}\\\\\\hline y&${a * firstX}&\\square\\end{array}`,
      `${a * secondX}`,
      `첫째 열에서 정비례 상수 ${a}를 찾고 둘째 x에 곱한다.`,
      [`${a * firstX}`, `${a + secondX}`, `${a * (secondX - 1)}`, `${a - secondX}`, `${secondX}`, `${a}`]);
  }
  const firstX = nonzero(next, 2, 5);
  const secondX = firstX + integer(next, 1, 4);
  const constant = firstX * secondX * (index % 2 === 0 ? 1 : 2);
  const firstY = constant / firstX;
  const secondY = constant / secondX;
  return make(id, method,
    `\\begin{array}{c|cc}x&${firstX}&${secondX}\\\\\\hline y&${firstY}&\\square\\end{array}`,
    `${secondY}`,
    `첫째 열에서 xy=${constant}를 찾고 ${constant}\\div${secondX}를 계산한다.`,
    [`${firstY}`, `${secondX}`, `${firstY + secondY}`, `${constant}`, `${firstX}`, `${Math.abs(firstY - secondY)}`]);
}

function buildLinearFunction(
  method: string,
  next: () => number,
  id: string,
) {
  if (["equation-two-points", "parallel-through-point", "intersection", "two-lines-parameter"].includes(method)) {
    return buildLinearRelation(method, next, id);
  }
  const m = nonzero(next, -5, 5);
  const b = nonzero(next, -8, 8);
  const x = nonzero(next, -6, 6);
  const y = m * x + b;
  if (method === "function-value") {
    return make(id, method, `f(x)=${linear(m, b)},\\quad f(${x})=?`, `${y}`,
      `함수식의 x에 ${x}를 대입해 계산한다.`,
      [
        `${m + x + b}`,
        `${m * x - b}`,
        `${y + m}`,
        `${m * x}`,
        `${b}`,
        `${x + b}`,
        `${-m * x + b}`,
        `${m * (x + b)}`,
        `${x * (m + b)}`,
        `${m + x - b}`,
      ]);
  }
  if (method === "table-equation") {
    const x2 = x + 2;
    const x3 = x + 4;
    const y2 = m * x2 + b;
    const y3 = m * x3 + b;
    return make(id, method,
      `\\begin{array}{c|ccc}x&${x}&${x2}&${x3}\\\\ \\hline y&${y}&${y2}&${y3}\\end{array}`,
      equation(m, b),
      "x가 일정하게 증가할 때 y의 증가량으로 기울기를 구한 뒤 한 좌표를 대입한다.",
      [equation(-m, b), equation(m, -b), equation(b, m), equation(-m, -b)]);
  }
  if (method === "input-from-value") {
    return make(id, method, `f(x)=${linear(m, b)},\\quad f(x)=${y},\\quad x=?`, `${x}`,
      `${linear(m, b)}=${y}인 일차방정식을 풀어 x를 구한다.`,
      [`${-x}`, `${x + 1}`, `${y - b}`, `${x - 1}`, `${y}`, `${b}`, `${x + m}`]);
  }
  if (method === "slope-two-points") {
    const x2 = x + integer(next, 2, 5);
    const y2 = m * x2 + b;
    return make(id, method, `A(${x},${y}),\\quad B(${x2},${y2})`, `${m}`,
      `기울기=\\dfrac{${y2}-${y}}{${x2}-${x}}로 계산한다.`,
      [
        `${-m}`,
        `${y2 - y}`,
        `${x2 - x}`,
        fraction(x2 - x, y2 - y),
        `${y2 + y}`,
        `${x2 + x}`,
        `${(y2 - y) + (x2 - x)}`,
        `${(y2 - y) - (x2 - x)}`,
      ]);
  }
  if (method === "both-intercepts") {
    const root = nonzero(next, -7, 7);
    const constant = -m * root;
    return make(id, method, equation(m, constant), `(${root},${constant})`,
      "y=0을 대입해 x절편을 구하고, x=0을 대입해 y절편을 구한다.",
      [`(${constant},${root})`, `(${-root},${constant})`, `(${root},${-constant})`, `(${root + 1},${constant})`, `(${root},${constant + 1})`, `(0,${constant})`, `(${root},0)`]);
  }
  if (method === "y-intercept") {
    return make(id, method, equation(m, b), `${b}`,
      "y절편은 일차함수 y=mx+b의 상수항 b이다.",
      [`${m}`, `${-b}`, `${m + b}`, `${b - m}`, `${m - b}`, "0"]);
  }
  if (method === "x-intercept") {
    const root = nonzero(next, -7, 7);
    const constant = -m * root;
    return make(id, method, equation(m, constant), `${root}`,
      `y=0을 대입해 ${linear(m, constant)}=0을 푼다.`,
      [`${-root}`, `${constant}`, `${m}`, `${root + m}`, `${root - m}`, `${-constant}`]);
  }
  if (method === "equation-slope-intercept") {
    return make(id, method, `\\text{기울기 }${m},\\quad \\text{y절편 }${b}`, equation(m, b),
      "기울기 m과 y절편 b를 y=mx+b에 바로 대입한다.",
      [equation(-m, b), equation(m, -b), equation(b, m), equation(-m, -b), equation(b, -m), equation(-b, m)]);
  }
  if (method === "coefficient-from-point") {
    return make(id, method, `y=ax${b > 0 ? "+" : ""}${b},\\quad P(${x},${y}),\\quad a=?`, `${m}`,
      `점의 좌표를 식에 대입해 ${y}=a\\cdot${x}${b > 0 ? "+" : ""}${b}를 푼다.`,
      [`${-m}`, `${m + 1}`, `${y - b}`, `${m - 1}`, `${x}`, `${y}`, `${b}`]);
  }
  return make(id, method, `${equation(m, b)}\\text{와 평행한 직선의 기울기}`, `${m}`,
    "서로 평행한 두 일차함수의 그래프는 기울기가 같다.",
    [`${-m}`, `${b}`, `${m + 1}`, `${m - 1}`, `${m + b}`, `${m - b}`]);
}

function buildLinearRelation(
  method: string,
  next: () => number,
  id: string,
) {
  const m = nonzero(next, -4, 4);
  const x = nonzero(next, -5, 5);
  const b = nonzero(next, -7, 7);
  const y = m * x + b;
  if (method === "point-parameter") {
    return make(id, method, `${equation(m, b)},\\quad P(k,${y}),\\quad k=?`, `${x}`,
      `점 P의 좌표를 직선의 식에 대입해 ${y}=${linear(m, b, "k")}를 푼다.`,
      [`${-x}`, `${x + 1}`, `${y - b}`, `${x - 1}`, `${y}`, `${b}`, `${m}`]);
  }
  if (method === "equation-two-points") {
    const x2 = x + integer(next, 2, 5);
    const y2 = m * x2 + b;
    return make(id, method, `P(${x},${y}),\\quad Q(${x2},${y2})`, equation(m, b),
      "두 점으로 기울기를 구한 뒤 한 점을 y=mx+b에 대입한다.",
      [equation(-m, b), equation(m, -b), equation(b, m), equation(-m, -b), equation(b, -m), equation(-b, m)]);
  }
  if (method === "parallel-through-point") {
    let givenIntercept = nonzero(next, -6, 6);
    while (givenIntercept === b) givenIntercept = nonzero(next, -6, 6);
    return make(id, method,
      `${equation(m, givenIntercept)}\\text{와 평행하고 }P(${x},${y})\\text{를 지나는 직선}`,
      equation(m, b),
      "평행하므로 기울기는 같고, 점의 좌표를 대입해 y절편을 구한다.",
      [equation(-m, b), equation(m, -b), equation(m, b + 1)]);
  }
  if (method === "x-axis-intersection") {
    const root = nonzero(next, -6, 6);
    const constant = -m * root;
    return make(id, method, `${equation(m, constant)}\\text{와 x축의 교점}`, `(${root},0)`,
      "x축 위에서는 y=0이므로 일차방정식을 풀어 x좌표를 구한다.",
      [`(0,${root})`, `(${-root},0)`, `(${constant},0)`, `(0,${-root})`, `(${m},0)`, `(0,${constant})`]);
  }
  if (method === "y-axis-intersection") {
    return make(id, method, `${equation(m, b)}\\text{와 y축의 교점}`, `(0,${b})`,
      "y축 위에서는 x=0이므로 y좌표는 상수항이다.",
      [`(${b},0)`, `(0,${-b})`, `(${m},0)`, `(0,${m})`, `(${b},${m})`, `(${-b},0)`]);
  }
  const otherSlope = m + (m > 0 ? 2 : -2);
  const otherIntercept = y - otherSlope * x;
  if (method === "two-lines-parameter") {
    return make(id, method,
      `${equation(m, b)},\\quad y=${coefficient(otherSlope, "x", true)}+k\\text{의 교점이 }(${x},${y}),\\quad k=?`,
      `${otherIntercept}`,
      `교점의 좌표를 둘째 직선에 대입해 k=${y}-${otherSlope}\\cdot${x}로 구한다.`,
      [`${-otherIntercept}`, `${b}`, `${otherSlope}`, `${m}`, `${x}`, `${y}`, `${otherIntercept + otherSlope}`, `${otherIntercept - otherSlope}`]);
  }
  const answer = `(${x},${y})`;
  return make(id, method,
    `\\begin{cases}${equation(m, b)}\\\\${equation(otherSlope, otherIntercept)}\\end{cases}`,
    answer,
    "두 식을 같게 놓아 x를 구하고 어느 한 식에 대입해 y를 구한다.",
    [
      `(${y},${x})`,
      `(${-x},${y})`,
      `(${x},${-y})`,
      `(${-x},${-y})`,
      `(${-y},${x})`,
      `(${y},${-x})`,
    ],
    method === "intersection" ? "line-intersection" : "system-as-graphs");
}

function buildPlaneGeometry(method: string, next: () => number, id: string) {
  const angle = integer(next, 25, 75);
  if (method === "vertical-angles") {
    return make(id, method, `\\angle 1=${degree(angle)},\\quad \\angle 1\\text{과 }\\angle x\\text{는 맞꼭지각}`, degree(angle),
      "맞꼭지각의 크기는 서로 같다.",
      [degree(180 - angle), degree(90 - angle), degree(angle + 10), degree(180), degree(90), degree(Math.abs(angle - 10))]);
  }
  if (method === "parallel-angles") {
    return make(id, method, `l\\parallel m,\\quad \\angle 1=${degree(angle)},\\quad \\angle x\\text{는 }\\angle 1\\text{의 엇각}`, degree(angle),
      "평행선에서 엇각의 크기는 서로 같다.",
      [degree(180 - angle), degree(90 - angle), degree(angle + 15), degree(180), degree(90), degree(Math.abs(angle - 15))]);
  }
  if (method === "triangle-angle") {
    const second = integer(next, 35, 80);
    const answer = 180 - angle - second;
    return make(id, method, `\\triangle ABC:\\quad \\angle A=${degree(angle)},\\quad \\angle B=${degree(second)},\\quad \\angle C=?`, degree(answer),
      "삼각형의 세 내각의 합 180°에서 두 각을 뺀다.",
      [
        degree(180 - angle),
        degree(angle + second),
        degree(90 - second),
        degree(angle),
        degree(second),
        degree(Math.abs(angle - second)),
      ]);
  }
  const sides = integer(next, 5, 12);
  if (method === "polygon-interior-sum") {
    const answer = (sides - 2) * 180;
    return make(id, method, `${sides}\\text{각형의 내각의 크기의 합}`, degree(answer),
      `n각형의 내각의 합 (n-2)\\times180^{\\circ}에 n=${sides}를 대입한다.`,
      [degree(sides * 180), degree((sides - 1) * 180), degree(360)]);
  }
  if (method === "regular-polygon-angle") {
    const candidates = [5, 6, 8, 9, 10, 12];
    const n = candidates[integer(next, 0, candidates.length - 1)];
    const answer = ((n - 2) * 180) / n;
    return make(id, method, `\\text{정}${n}\\text{각형의 한 내각}`, degree(answer),
      `내각의 합을 꼭짓점 수 ${n}으로 나눈다.`,
      [degree(360 / n), degree(180 - 360 / n + 10), degree(180 / n)]);
  }
  if (method === "regular-polygon-exterior") {
    const candidates = [5, 6, 8, 9, 10, 12];
    const n = candidates[integer(next, 0, candidates.length - 1)];
    const answer = 360 / n;
    return make(id, method, `\\text{정}${n}\\text{각형의 한 외각}`, degree(answer),
      `정다각형의 외각의 합 360°를 ${n}으로 나눈다.`,
      [degree(180 / n), degree(180 - answer), degree(answer + 10)]);
  }
  if (method === "polygon-diagonals") {
    const answer = (sides * (sides - 3)) / 2;
    return make(id, method, `${sides}\\text{각형의 대각선의 개수}`, `${answer}`,
      `대각선의 개수 \\dfrac{n(n-3)}2에 n=${sides}를 대입한다.`,
      [`${sides * (sides - 3)}`, `${(sides * (sides - 2)) / 2}`, `${sides - 3}`]);
  }
  const radii = [3, 4, 6, 8, 10, 12];
  const radius = radii[integer(next, 0, radii.length - 1)];
  const centralAngles = [60, 90, 120, 180];
  const central = centralAngles[integer(next, 0, centralAngles.length - 1)];
  const arcCoefficient = (2 * radius * central) / 360;
  const areaCoefficient = (radius * radius * central) / 360;
  const answer = `(${piTerm(arcCoefficient)},\\ ${piTerm(areaCoefficient)})`;
  return make(id, method, `r=${radius},\\quad \\theta=${degree(central)},\\quad (\\text{호의 길이},\\ \\text{넓이})`, answer,
    "원의 둘레와 넓이에 중심각/360을 각각 곱한다.",
    [
      `(${piTerm(areaCoefficient)},\\ ${piTerm(arcCoefficient)})`,
      `(${piTerm(2 * arcCoefficient)},\\ ${piTerm(areaCoefficient)})`,
      `(${piTerm(arcCoefficient)},\\ ${piTerm(2 * areaCoefficient)})`,
    ]);
}

function buildSolidGeometry(method: string, next: () => number, id: string) {
  const geometry = (variant: string, labels: string[]): MiddleCurriculumVisual => ({ type: "geometry", variant, labels });
  const cm2 = (value: number) => `${value}\\text{ cm}^2`;
  const cm3 = (value: number) => `${value}\\text{ cm}^3`;
  const piCm2 = (value: number) => `${piTerm(value)}\\text{ cm}^2`;
  const piCm3 = (value: number) => `${piTerm(value)}\\text{ cm}^3`;
  const side = integer(next, 3, 7);
  const prismHeight = integer(next, 4, 9);

  if (method === "joined-prism-pyramid-volume") {
    const pyramidHeight = 3 * integer(next, 2, 4);
    const prism = side ** 2 * prismHeight;
    const pyramid = side ** 2 * pyramidHeight / 3;
    return makeVisual(id, method, `\\text{공통 밑면은 한 변이 }${side}\\text{ cm인 정사각형}`, cm3(prism + pyramid),
      "각기둥과 각뿔의 부피를 각각 구해 더하며, 맞붙인 면은 부피에 영향을 주지 않는다.",
      [
        cm3(side ** 2 * (prismHeight + pyramidHeight)),
        cm3(prism),
        cm3(pyramid),
        cm3(prism + pyramid + side ** 2),
        cm3(Math.abs(prism - pyramid)),
        cm3(2 * (prism + pyramid)),
      ],
      "각기둥과 각뿔을 붙인 입체의 부피는?",
      geometry("solid-prism-pyramid", [`${side} cm`, `${prismHeight} cm`, `${pyramidHeight} cm`]));
  }
  if (method === "open-pyramid-surface") {
    const slantHeight = integer(next, Math.max(4, Math.ceil(side / 2) + 1), 10);
    const lateralArea = 2 * side * slantHeight;
    return makeVisual(id, method, `\\text{밑면의 한 변 }${side}\\text{ cm},\\quad \\text{옆면의 높이 }${slantHeight}\\text{ cm}`, cm2(lateralArea),
      "밑면은 세지 않고 합동인 삼각형 네 개의 넓이만 더한다.",
      [cm2(lateralArea + side ** 2), cm2(side * slantHeight / 2), cm2(4 * side * slantHeight)],
      "바닥이 없는 정사각뿔 모양 천막에 필요한 천의 넓이는?",
      geometry("solid-open-pyramid", [`${side} cm`, `${slantHeight} cm`]));
  }
  if (method === "drilled-prism-volume") {
    const radius = integer(next, 2, 3);
    const drilledSide = integer(next, 2 * radius + 2, 2 * radius + 5);
    const prism = drilledSide ** 2 * prismHeight;
    const hole = radius ** 2 * prismHeight;
    const answer = `(${prism}-${hole}\\pi)\\text{ cm}^3`;
    return makeVisual(id, method, `\\text{밑면 한 변 }${drilledSide}\\text{ cm},\\ r=${radius}\\text{ cm},\\ h=${prismHeight}\\text{ cm}`, answer,
      "정사각기둥의 부피에서 관통한 원기둥의 부피를 뺀다.",
      [`(${prism}+${hole}\\pi)\\text{ cm}^3`, `(${prism}-${radius ** 2}\\pi)\\text{ cm}^3`, cm3(prism), `(${prism}-${2 * hole}\\pi)\\text{ cm}^3`],
      "원기둥 모양 구멍을 끝까지 뚫고 남은 입체의 부피는?",
      geometry("solid-drilled-prism", [`${drilledSide} cm`, `${prismHeight} cm`, `${radius} cm`]));
  }

  const outer = integer(next, 5, 8);
  const inner = integer(next, 2, outer - 2);
  const height = integer(next, 5, 10);
  if (method === "hollow-cylinder-volume") {
    const answer = (outer ** 2 - inner ** 2) * height;
    return makeVisual(id, method, `R=${outer}\\text{ cm},\\quad r=${inner}\\text{ cm},\\quad h=${height}\\text{ cm}`, piCm3(answer),
      "바깥 원기둥의 부피에서 속의 원기둥 부피를 뺀다.",
      [piCm3(outer ** 2 * height), piCm3((outer - inner) ** 2 * height), piCm3((outer ** 2 + inner ** 2) * height)],
      "휴지심 모양 물체를 이루는 재료의 부피는?",
      geometry("solid-hollow-cylinder", [`${outer} cm`, `${inner} cm`, `${height} cm`]));
  }
  if (method === "hollow-cylinder-surface") {
    const answer = 2 * (outer + inner) * height + 2 * (outer ** 2 - inner ** 2);
    return makeVisual(id, method, `R=${outer}\\text{ cm},\\quad r=${inner}\\text{ cm},\\quad h=${height}\\text{ cm}`, piCm2(answer),
      "바깥 옆면, 안쪽 옆면, 위아래 고리 모양 면 두 개를 모두 더한다.",
      [
        piCm2(2 * outer ** 2 + 2 * outer * height),
        piCm2(2 * (outer + inner) * height),
        piCm2((outer ** 2 - inner ** 2) * height),
        piCm2(2 * (outer + inner) * height + outer ** 2 - inner ** 2),
        piCm2(2 * outer * height + 2 * (outer ** 2 - inner ** 2)),
        piCm2(2 * inner * height + 2 * (outer ** 2 - inner ** 2)),
        piCm2(answer + 2 * inner ** 2),
      ],
      "안쪽 면과 위아래 고리 모양 면까지 포함한 겉넓이는?",
      geometry("solid-hollow-cylinder", [`${outer} cm`, `${inner} cm`, `${height} cm`]));
  }

  const radius = integer(next, 2, 6);
  if (method === "open-cylinder-surface") {
    const answer = radius ** 2 + 2 * radius * height;
    return makeVisual(id, method, `r=${radius}\\text{ cm},\\quad h=${height}\\text{ cm}`, piCm2(answer),
      "윗면은 제외하고 밑면 한 개와 옆면만 더한다.",
      [
        piCm2(2 * radius ** 2 + 2 * radius * height),
        piCm2(2 * radius * height),
        piCm2(radius ** 2 * height),
        piCm2(radius ** 2),
        piCm2(answer + 2 * radius),
        piCm2(answer - radius),
        piCm2(2 * answer),
      ],
      "윗면이 없는 원기둥 모양 통의 겉넓이는?",
      geometry("solid-open-cylinder", [`${radius} cm`, `${height} cm`]));
  }
  if (method === "joined-cylinder-cone-volume") {
    const coneHeight = 3 * integer(next, 2, 5);
    const cylinder = radius ** 2 * height;
    const cone = radius ** 2 * coneHeight / 3;
    return makeVisual(id, method, `r=${radius}\\text{ cm},\\quad h_1=${height}\\text{ cm},\\quad h_2=${coneHeight}\\text{ cm}`, piCm3(cylinder + cone),
      "원기둥의 부피와 원뿔의 부피를 각각 구해 더한다.",
      [
        piCm3(radius ** 2 * (height + coneHeight)),
        piCm3(cylinder),
        piCm3(cone),
        piCm3(cylinder + cone + radius ** 2),
        piCm3(Math.abs(cylinder - cone)),
        piCm3(2 * (cylinder + cone)),
      ],
      "밑면이 같은 원기둥과 원뿔을 붙인 입체의 부피는?",
      geometry("solid-cylinder-cone", [`${radius} cm`, `${height} cm`, `${coneHeight} cm`]));
  }

  const capsuleRadius = integer(next, 0, 1) === 0 ? 3 : 6;
  const capsuleLength = integer(next, 4, 10);
  const volume = capsuleRadius ** 2 * capsuleLength + 4 * capsuleRadius ** 3 / 3;
  const surface = 2 * capsuleRadius * capsuleLength + 4 * capsuleRadius ** 2;
  const answer = `(${piCm3(volume)},\\ ${piCm2(surface)})`;
  return makeVisual(id, method, `r=${capsuleRadius}\\text{ cm},\\quad h=${capsuleLength}\\text{ cm},\\quad (\\text{부피},\\ \\text{겉넓이})`, answer,
    "두 반구는 하나의 구가 되며, 겉넓이에서는 원기둥의 두 밑면을 세지 않는다.",
    [`(${piCm3(surface)},\\ ${piCm2(volume)})`, `(${piCm3(capsuleRadius ** 2 * capsuleLength)},\\ ${piCm2(surface)})`, `(${piCm3(volume)},\\ ${piCm2(2 * capsuleRadius * capsuleLength + 2 * capsuleRadius ** 2)})`],
    "원기둥의 양쪽에 반구를 붙인 캡슐 모양 입체의 (부피, 겉넓이)는?",
    geometry("solid-capsule", [`${capsuleRadius} cm`, `${capsuleLength} cm`]));
}

function buildTriangleQuadrilateral(method: string, next: () => number, id: string) {
  const angle = integer(next, 30, 75);
  if (method === "isosceles-angle") {
    const apex = 180 - 2 * angle;
    return make(id, method, `AB=AC,\\quad \\angle A=${degree(apex)},\\quad \\angle B=?`, degree(angle),
      "이등변삼각형의 두 밑각은 같으므로 (180°-꼭지각)÷2를 계산한다.",
      [degree(apex), degree(180 - apex), degree(angle + 10), degree(angle - 10), degree(180 - angle)]);
  }
  if (method === "triangle-exterior") {
    const second = integer(next, 25, 70);
    const answer = angle + second;
    return make(id, method, `\\text{서로 이웃하지 않은 두 내각 }${degree(angle)},\\ ${degree(second)}`, degree(answer),
      "삼각형의 한 외각은 이웃하지 않은 두 내각의 합이다.",
      [
        degree(180 - answer),
        degree(Math.abs(angle - second)),
        degree(180 - angle),
        degree(angle),
        degree(second),
        degree(180 - second),
        degree(90),
        degree(180),
      ]);
  }
  if (method === "parallelogram-angle") {
    return make(id, method, `ABCD\\text{는 평행사변형},\\quad \\angle A=${degree(angle)},\\quad \\angle B=?`, degree(180 - angle),
      "평행사변형에서 이웃한 두 각의 합은 180°이다.",
      [degree(angle), degree(90 - angle), degree(180 + angle), degree(90), degree(180), degree(angle + 90)]);
  }
  if (method === "parallelogram-side") {
    const side = integer(next, 4, 14);
    return make(id, method, `ABCD\\text{는 평행사변형},\\quad AB=${side},\\quad CD=?`, `${side}`,
      "평행사변형의 마주 보는 두 변의 길이는 같다.",
      [`${side + 2}`, `${side * 2}`, `${side - 1}`]);
  }
  if (method === "trapezoid-midline") {
    const first = integer(next, 5, 12);
    const second = first + 2 * integer(next, 1, 5);
    const answer = (first + second) / 2;
    return make(id, method, `\\text{사다리꼴의 두 밑변 }${first},\\ ${second}`, `${answer}`,
      "두 빗변의 중점을 이은 선분의 길이는 두 밑변의 평균이다.",
      [`${first + second}`, `${second - first}`, `${answer + 1}`, `${first}`, `${second}`, `${answer - 1}`]);
  }
  if (method === "circumcenter-distance") {
    const radius = integer(next, 4, 12);
    return make(id, method, `O\\text{는 }\\triangle ABC\\text{의 외심},\\quad OA=${radius},\\quad OC=?`, `${radius}`,
      "외심에서 삼각형의 세 꼭짓점까지의 거리는 모두 같다.",
      [`${radius * 2}`, `${radius + 1}`, `${radius - 1}`]);
  }
  if (method === "incenter-bisector") {
    const whole = 2 * angle;
    return make(id, method, `I\\text{는 내심},\\quad \\angle A=${degree(whole)},\\quad \\angle BAI=?`, degree(angle),
      "내심을 지나는 선은 꼭짓각을 이등분한다.",
      [degree(whole), degree(180 - whole), degree(angle + 5), degree(angle - 5), degree(180 - angle)]);
  }
  const median = 3 * integer(next, 3, 8);
  const answer = (2 * median) / 3;
  return make(id, method, `G\\text{는 무게중심},\\quad AM=${median},\\quad AG=?`, `${answer}`,
    "무게중심은 중선을 꼭짓점 쪽에서 2:1로 나눈다.",
    [`${median / 3}`, `${median}`, `${median / 2}`]);
}

function buildSimilarity(method: string, next: () => number, id: string) {
  const ratio = integer(next, 2, 5);
  const small = integer(next, 3, 9);
  if (method === "scale-factor") {
    return make(id, method, `\\text{대응변 }${small}: ${small * ratio}`, `1:${ratio}`,
      "닮음비는 대응하는 두 변의 길이를 같은 순서로 나눈 비이다.",
      [`${ratio}:1`, `1:${ratio ** 2}`, `${small}:${ratio}`]);
  }
  if (method === "missing-side") {
    const other = integer(next, 3, 8);
    return make(id, method, `${small}:${small * ratio}=${other}:x`, `${other * ratio}`,
      "대응변의 비가 같으므로 비례식을 세워 x를 구한다.",
      [`${other + ratio}`, `${other * ratio ** 2}`, `${other}`]);
  }
  if (method === "perimeter-ratio") {
    return make(id, method, `\\text{닮음비 }1:${ratio}`, `1:${ratio}`,
      "닮은 도형의 둘레의 길이의 비는 닮음비와 같다.",
      [`1:${ratio ** 2}`, `${ratio}:1`, `1:${ratio ** 3}`]);
  }
  if (method === "area-ratio") {
    return make(id, method, `\\text{닮음비 }1:${ratio}`, `1:${ratio ** 2}`,
      "닮은 도형의 넓이의 비는 닮음비의 제곱이다.",
      [`1:${ratio}`, `${ratio}:1`, `1:${ratio ** 3}`]);
  }
  if (method === "parallel-segment") {
    const upper = integer(next, 2, 7);
    const lower = integer(next, 2, 7);
    const corresponding = upper * ratio;
    const answer = lower * ratio;
    return make(id, method, `DE\\parallel BC,\\quad AD:DB=${upper}:${lower},\\quad AE=${corresponding},\\quad EC=?`, `${answer}`,
      "평행선이 두 변을 같은 비로 나누므로 AD:DB=AE:EC를 이용한다.",
      [
        `${lower + ratio}`,
        `${corresponding}`,
        `${upper * lower}`,
        `${lower}`,
        `${upper}`,
        `${ratio}`,
        `${corresponding + lower}`,
        `${corresponding * ratio}`,
        `${Math.abs(corresponding - lower * ratio)}`,
      ]);
  }
  if (method === "midpoint-segment") {
    const base = 2 * integer(next, 4, 10);
    return make(id, method, `D,E\\text{는 두 변의 중점},\\quad BC=${base},\\quad DE=?`, `${base / 2}`,
      "삼각형의 두 변의 중점을 이은 선분은 나머지 한 변의 절반이다.",
      [`${base}`, `${base * 2}`, `${base / 2 + 1}`]);
  }
  if (method === "two-triangles") {
    const answer = small * ratio;
    return make(id, method, `\\triangle ABC\\sim\\triangle DEF,\\quad AB:DE=1:${ratio},\\quad BC=${small},\\quad EF=?`, `${answer}`,
      "닮음 순서에 맞는 대응변의 비로 BC:EF=1:비례상수를 세운다.",
      [`${small + ratio}`, `${small * ratio ** 2}`, `${small}`]);
  }
  const area = integer(next, 3, 10);
  const answer = area * ratio ** 2;
  return make(id, method, `\\text{닮음비 }1:${ratio},\\quad \\text{작은 도형의 넓이 }${area}`, `${answer}`,
    "넓이는 닮음비의 제곱만큼 커지므로 주어진 넓이에 비례상수의 제곱을 곱한다.",
    [`${area * ratio}`, `${area + ratio ** 2}`, `${area * ratio ** 3}`, `${area}`, `${answer + area}`, `${answer - area}`]);
}

const RIGHT_TRIPLES = [
  [3, 4, 5],
  [5, 12, 13],
  [8, 15, 17],
  [7, 24, 25],
] as const;

const BOX_QUADRUPLES = [
  [1, 2, 2, 3],
  [2, 3, 6, 7],
  [3, 4, 12, 13],
  [4, 4, 7, 9],
] as const;

function buildPythagorean(method: string, next: () => number, id: string, index: number) {
  const triple = RIGHT_TRIPLES[(index + integer(next, 0, RIGHT_TRIPLES.length - 1)) % RIGHT_TRIPLES.length];
  const scale = integer(next, 1, 3);
  const [a, b, c] = triple.map((value) => value * scale);
  if (method === "hypotenuse") {
    return make(id, method, `a=${a},\\quad b=${b},\\quad c=?`, `${c}`,
      "직각삼각형에서 c²=a²+b²을 이용해 양의 제곱근을 구한다.",
      [`${a + b}`, `${c ** 2}`, `${Math.abs(b - a)}`]);
  }
  if (method === "missing-leg") {
    return make(id, method, `c=${c},\\quad a=${a},\\quad b=?`, `${b}`,
      "b²=c²-a²을 계산한 뒤 양의 제곱근을 취한다.",
      [`${c - a}`, `${b ** 2}`, `${a}`]);
  }
  if (method === "rectangle-diagonal") {
    return make(id, method, `\\text{가로 }${a},\\quad \\text{세로 }${b},\\quad \\text{대각선}=?`, `${c}`,
      "직사각형의 대각선은 두 변을 직각변으로 하는 직각삼각형의 빗변이다.",
      [`${a + b}`, `${c ** 2}`, `${b - a}`]);
  }
  if (method === "square-diagonal") {
    const side = integer(next, 2, 9);
    return make(id, method, `\\text{정사각형의 한 변 }${side}`, `${side}\\sqrt{2}`,
      "대각선²=한 변²+한 변²이므로 대각선은 한 변×√2이다.",
      [`${side * 2}`, `${side}\\sqrt{3}`, `${side ** 2}`, "\\sqrt{2}", `${side ** 2}\\sqrt{2}`]);
  }
  if (method === "solid-diagonal") {
    const [x, y, z, d] = BOX_QUADRUPLES[(index + integer(next, 0, BOX_QUADRUPLES.length - 1)) % BOX_QUADRUPLES.length];
    return make(id, method, `\\text{직육면체의 가로 }${x},\\ \\text{세로 }${y},\\ \\text{높이 }${z}`, `${d}`,
      "직육면체의 대각선은 밑면의 대각선과 높이를 직각변으로 하는 직각삼각형의 빗변이다.",
      [`${x + y + z}`, `${d ** 2}`, `${d + 1}`]);
  }
  if (method === "right-triangle-check") {
    return make(id, method, `\\text{세 변의 길이 }${a},\\ ${b},\\ ${c}`, "\\text{직각삼각형}",
      `${a}^2+${b}^2=${c}^2이므로 피타고라스 정리의 역이 성립한다.`,
      ["\\text{예각삼각형}", "\\text{둔각삼각형}", "\\text{삼각형이 아님}"]);
  }
  if (method === "isosceles-height") {
    const halfBase = a;
    return make(id, method, `\\text{이등변삼각형의 밑변 }${2 * halfBase},\\quad \\text{같은 두 변 }${c}`, `${b}`,
      "꼭짓점에서 내린 높이는 밑변을 이등분하므로 절반과 높이로 피타고라스 정리를 쓴다.",
      [`${a}`, `${c}`, `${a + b}`]);
  }
  return make(id, method, `\\text{직각으로 }${a}\\text{만큼, 다시 }${b}\\text{만큼 이동한 두 점 사이 거리}`, `${c}`,
    "서로 수직인 두 이동 거리를 직각변으로 보아 빗변을 구한다.",
    [`${a + b}`, `${c ** 2}`, `${b - a}`]);
}

function buildProbability(method: string, next: () => number, id: string) {
  if (method === "addition-rule") {
    const a = integer(next, 3, 8);
    const b = integer(next, 3, 8);
    return make(id, method, `\\text{서로 겹치지 않는 A 방법 }${a}\\text{가지, B 방법 }${b}\\text{가지}`, `${a + b}`,
      "둘 중 하나를 택하고 두 경우가 겹치지 않으므로 경우의 수를 더한다.",
      [`${a * b}`, `${Math.abs(a - b)}`, `${a + b + 1}`]);
  }
  if (method === "multiplication-rule") {
    const a = integer(next, 2, 6);
    const b = integer(next, 3, 7);
    return make(id, method, `\\text{첫 선택 }${a}\\text{가지, 다음 선택 }${b}\\text{가지}`, `${a * b}`,
      "두 선택을 차례로 모두 하므로 각 단계의 경우의 수를 곱한다.",
      [`${a + b}`, `${a * b - 1}`, `${a * b + a}`, `${a * b + b}`, `${Math.abs(a - b)}`, `${a ** 2 + b}`]);
  }
  if (method === "two-digit-numbers") {
    const digits = integer(next, 4, 6);
    const answer = digits * (digits - 1);
    return make(id, method, `\\{1,2,\\ldots,${digits}\\}\\text{에서 서로 다른 두 숫자로 만든 두 자리 수}`, `${answer}`,
      `십의 자리 ${digits}가지에 일의 자리 ${digits - 1}가지를 곱한다.`,
      [`${digits ** 2}`, `${digits + (digits - 1)}`, `${answer / 2}`]);
  }
  if (method === "outfit-count") {
    const tops = integer(next, 3, 6);
    const bottoms = integer(next, 2, 5);
    return make(id, method, `\\text{윗옷 }${tops}\\text{벌, 아래옷 }${bottoms}\\text{벌}`, `${tops * bottoms}`,
      "윗옷 하나마다 모든 아래옷을 고를 수 있으므로 곱의 법칙을 쓴다.",
      [
        `${tops + bottoms}`,
        `${tops * bottoms - 1}`,
        `${tops * bottoms + tops}`,
        `${tops * bottoms + bottoms}`,
        `${Math.abs(tops - bottoms)}`,
        `${tops ** 2 + bottoms}`,
      ]);
  }
  if (method === "die-probability") {
    const threshold = integer(next, 2, 5);
    const favorable = 6 - threshold + 1;
    const answer = fraction(favorable, 6);
    return make(id, method, `\\text{주사위 한 개에서 }${threshold}\\text{ 이상이 나올 확률}`, answer,
      `유리한 눈 ${favorable}개를 전체 눈 6개로 나눈다.`,
      [
        fraction(threshold, 6),
        fraction(6 - favorable, 6),
        fraction(favorable, 5),
        fraction(favorable - 1, 6),
        fraction(favorable + 1, 6),
        fraction(1, 6),
      ]);
  }
  if (method === "two-dice-sum") {
    const target = integer(next, 5, 9);
    const favorable = target <= 7 ? target - 1 : 13 - target;
    const answer = fraction(favorable, 36);
    return make(id, method, `\\text{두 주사위의 눈의 합이 }${target}\\text{일 확률}`, answer,
      `순서 있는 전체 36가지 중 합이 ${target}인 경우 ${favorable}가지를 센다.`,
      [
        fraction(favorable, 12),
        fraction(target, 36),
        fraction(favorable + 1, 36),
        fraction(favorable - 1, 36),
        fraction(target, 6),
        fraction(1, 36),
      ]);
  }
  if (method === "complement-probability") {
    const numerator = integer(next, 1, 8);
    const denominator = 10;
    const answer = fraction(denominator - numerator, denominator);
    return make(id, method, `P(A)=${fraction(numerator, denominator)},\\quad P(A^c)=?`, answer,
      "어떤 사건과 그 여사건의 확률의 합은 1이다.",
      [
        fraction(numerator, denominator),
        fraction(denominator - numerator - 1, denominator),
        fraction(denominator + numerator, denominator),
        fraction(denominator - numerator + 1, denominator),
        fraction(numerator + 1, denominator),
        fraction(numerator - 1, denominator),
      ]);
  }
  const red = integer(next, 2, 5);
  const blue = integer(next, 2, 5);
  const total = red + blue;
  const answer = fraction(red * blue, total * (total - 1));
  return make(id, method, `\\text{빨강 }${red}\\text{개, 파랑 }${blue}\\text{개에서 되돌려 넣지 않고 빨강, 파랑 순으로 뽑을 확률}`, answer,
    "첫 확률과 한 개가 줄어든 둘째 확률을 곱한다.",
    [
      fraction(red * blue, total ** 2),
      fraction(red + blue, total * (total - 1)),
      fraction(red ** 2, total * (total - 1)),
      fraction(blue ** 2, total * (total - 1)),
      fraction(red, total),
      fraction(blue, total),
      fraction(red * blue, total * (total + 1)),
    ]);
}

const QUARTILE_DATA = [
  [1, 3, 5, 7, 9, 11, 13, 15],
  [2, 4, 6, 8, 12, 14, 16, 18],
  [3, 5, 7, 9, 11, 13, 17, 19],
] as const;

function quartiles(values: readonly number[]) {
  return {
    minimum: values[0],
    q1: (values[1] + values[2]) / 2,
    median: (values[3] + values[4]) / 2,
    q3: (values[5] + values[6]) / 2,
    maximum: values[7],
  };
}

function dataLatex(values: readonly number[]) {
  return `\\{${values.join(",\\ ")}\\}`;
}

function buildQuartiles(method: string, next: () => number, id: string, index: number) {
  const shift = integer(next, 0, 5) + index * 2;
  const values = QUARTILE_DATA[index % QUARTILE_DATA.length].map((value) => value + shift);
  const stats = quartiles(values);
  if (method === "median") {
    return make(id, method, dataLatex(values), `${stats.median}`,
      "자료를 크기순으로 놓고 가운데 두 값의 평균을 구한다.",
      [`${values[3]}`, `${values[4]}`, `${stats.q1}`]);
  }
  if (method === "first-quartile") {
    return make(id, method, dataLatex(values), `${stats.q1}`,
      "아래쪽 절반 자료의 중앙값을 구한다.",
      [`${stats.median}`, `${values[1]}`, `${values[2]}`]);
  }
  if (method === "third-quartile") {
    return make(id, method, dataLatex(values), `${stats.q3}`,
      "위쪽 절반 자료의 중앙값을 구한다.",
      [`${stats.median}`, `${values[5]}`, `${values[6]}`]);
  }
  if (method === "interquartile-range") {
    const answer = stats.q3 - stats.q1;
    return make(id, method, dataLatex(values), `${answer}`,
      "사분위범위는 제3사분위수에서 제1사분위수를 뺀 값이다.",
      [`${stats.q3 + stats.q1}`, `${stats.maximum - stats.minimum}`, `${answer + 1}`]);
  }
  if (method === "range") {
    const answer = stats.maximum - stats.minimum;
    return make(id, method, dataLatex(values), `${answer}`,
      "범위는 최댓값에서 최솟값을 뺀 값이다.",
      [`${stats.maximum + stats.minimum}`, `${stats.q3 - stats.q1}`, `${answer - 1}`]);
  }
  if (method === "five-number-summary") {
    const answer = `(${stats.minimum},${stats.q1},${stats.median},${stats.q3},${stats.maximum})`;
    return make(id, method, dataLatex(values), answer,
      "최솟값, 제1사분위수, 중앙값, 제3사분위수, 최댓값 순으로 적는다.",
      [
        `(${stats.minimum},${stats.median},${stats.q1},${stats.q3},${stats.maximum})`,
        `(${stats.minimum},${stats.q1},${stats.q3},${stats.median},${stats.maximum})`,
        `(${stats.maximum},${stats.q3},${stats.median},${stats.q1},${stats.minimum})`,
      ]);
  }
  if (method === "missing-maximum") {
    const range = stats.maximum - stats.minimum;
    return make(id, method, `\\text{최솟값 }${stats.minimum},\\quad \\text{범위 }${range},\\quad \\text{최댓값}=?`, `${stats.maximum}`,
      "최댓값=최솟값+범위로 계산한다.",
      [
        `${range}`,
        `${stats.maximum - 1}`,
        `${stats.minimum + stats.q3}`,
        `${stats.minimum}`,
        `${stats.q3}`,
        `${range + stats.q1}`,
      ]);
  }
  const firstIqr = stats.q3 - stats.q1;
  const secondIqr = firstIqr + integer(next, 2, 5);
  return make(id, method, `A:\\ IQR=${firstIqr},\\quad B:\\ IQR=${secondIqr}`, "A",
    "사분위범위가 작을수록 자료의 가운데 50%가 덜 퍼져 있다.",
    ["B", "A=B", "\\text{판단 불가}"]);
}

function makeVisual(
  id: string,
  method: string,
  latex: string,
  answerLatex: string,
  solutionHint: string,
  distractors: string[],
  question: string,
  visual: MiddleCurriculumVisual,
) {
  return {
    ...make(id, method, latex, answerLatex, solutionHint, distractors),
    question,
    visual,
  };
}

function buildConstructionCongruence(method: string, id: string) {
  if (method === "line-relation") {
    return makeVisual(id, method, `\\text{정육면체에서 }\\overline{AB}\\text{와 }\\overline{CG}`, `\\text{꼬인 위치}`,
      "한 평면 위에 있지 않고 만나지도 평행하지도 않으므로 꼬인 위치이다.",
      ["\\text{평행}", "\\text{수직}", "\\text{한 점에서 만남}"],
      "두 직선의 위치 관계는?",
      { type: "geometry", variant: "cube-skew", labels: ["A", "B", "C", "G"] });
  }
  if (method === "line-plane-relation") {
    return makeVisual(id, method, `\\text{직선 }l\\text{과 평면 }\\alpha`, `\\text{수직}`,
      "직선 l이 평면 위의 서로 만나는 두 직선에 모두 수직이므로 평면과 수직이다.",
      ["\\text{평행}", "\\text{포함}", "\\text{꼬인 위치}"],
      "직선과 평면의 위치 관계는?",
      { type: "geometry", variant: "line-plane-perpendicular", labels: ["l", "α"] });
  }
  if (method === "perpendicular-bisector") {
    return makeVisual(id, method, `P\\text{는 }\\overline{AB}\\text{의 수직이등분선 위의 점}`, "PA=PB",
      "수직이등분선 위의 점은 선분의 두 끝점에서 같은 거리에 있다.",
      ["PA>PB", "PA<PB", "AB=PB"],
      "항상 성립하는 관계는?",
      { type: "geometry", variant: "perpendicular-bisector", labels: ["A", "B", "P"] });
  }
  if (method === "angle-bisector") {
    return makeVisual(id, method, `\\overrightarrow{OX}\\text{는 }\\angle AOB\\text{의 이등분선}`,
      "\\angle AOX=\\angle XOB",
      "각의 이등분선은 원래 각을 크기가 같은 두 각으로 나눈다.",
      ["\\angle AOX=\\angle AOB", "\\angle XOB=2\\angle AOX", "OA=OB"],
      "항상 성립하는 관계는?",
      { type: "geometry", variant: "angle-bisector", labels: ["A", "O", "X", "B"] });
  }
  if (method === "triangle-construction") {
    return makeVisual(id, method, "3,\\ 4,\\ 6", "\\text{작도 가능}",
      "가장 긴 변 6이 나머지 두 변의 합 7보다 작으므로 삼각형을 작도할 수 있다.",
      ["\\text{작도 불가능}", "\\text{직각삼각형만 가능}", "\\text{정삼각형만 가능}"],
      "이 세 길이로 삼각형을 작도할 수 있는가?",
      { type: "geometry", variant: "triangle-construction", labels: ["3", "4", "6"] });
  }
  if (method === "sss-congruence") {
    return makeVisual(id, method, `AB=DE,\\ BC=EF,\\ CA=FD`, "\\mathrm{SSS}",
      "세 대응변의 길이가 각각 같으므로 SSS 합동이다.",
      ["\\mathrm{SAS}", "\\mathrm{ASA}", "\\mathrm{RHS}"],
      "두 삼각형의 합동 조건은?",
      { type: "geometry", variant: "triangle-pair-sss", labels: ["A", "B", "C", "D", "E", "F"] });
  }
  if (method === "sas-congruence") {
    return makeVisual(id, method, `AB=DE,\\ AC=DF,\\ \\angle A=\\angle D`, "\\mathrm{SAS}",
      "두 대응변과 그 끼인각이 각각 같으므로 SAS 합동이다.",
      ["\\mathrm{SSS}", "\\mathrm{ASA}", "\\mathrm{RHS}"],
      "두 삼각형의 합동 조건은?",
      { type: "geometry", variant: "triangle-pair-sas", labels: ["A", "B", "C", "D", "E", "F"] });
  }
  return makeVisual(id, method, `\\angle A=\\angle D,\\ AB=DE,\\ \\angle B=\\angle E`, "\\mathrm{ASA}",
    "한 대응변과 그 양 끝각이 각각 같으므로 ASA 합동이다.",
    ["\\mathrm{SSS}", "\\mathrm{SAS}", "\\mathrm{RHS}"],
    "두 삼각형의 합동 조건은?",
    { type: "geometry", variant: "triangle-pair-asa", labels: ["A", "B", "C", "D", "E", "F"] });
}

function buildFrequencyGraphs(method: string, next: () => number, id: string) {
  const values = [
    integer(next, 3, 6),
    integer(next, 6, 10),
    integer(next, 5, 9),
    integer(next, 2, 6),
  ];
  const labels = ["0~10", "10~20", "20~30", "30~40"];
  const total = values.reduce((sum, value) => sum + value, 0);
  const chart = {
    type: method === "frequency-polygon-maximum" ? "frequency-polygon" : "histogram",
    values,
    labels,
  } satisfies MiddleCurriculumVisual;
  if (method === "frequency-table") {
    return make(id, method,
      `\\begin{array}{c|cccc}\\text{계급}&0\\sim10&10\\sim20&20\\sim30&30\\sim40\\\\\\hline\\text{도수}&${values[0]}&${values[1]}&${values[2]}&${values[3]}\\end{array}`,
      `${values[2]}`,
      "20 이상 30 미만인 계급의 도수는 표의 해당 칸을 읽는다.",
      [
        `${values[0]}`, `${values[1]}`, `${total}`,
        `${values[2] + 1}`, `${Math.max(1, values[2] - 1)}`, `${total - values[2]}`,
      ],
      "frequency-table");
  }
  if (method === "histogram-frequency") {
    return makeVisual(id, method, "\\text{색칠한 계급}", `${values[1]}`,
      "색칠한 막대의 높이가 그 계급의 도수이다.",
      [
        `${values[0]}`, `${values[2]}`, `${total}`,
        `${values[1] + 1}`, `${Math.max(1, values[1] - 1)}`, `${total - values[1]}`,
      ],
      "색칠한 계급의 도수는?",
      { ...chart, highlight: 1 });
  }
  if (method === "histogram-total") {
    return makeVisual(id, method, "\\text{전체 자료}", `${total}`,
      "각 막대의 높이를 모두 더하면 전체 자료의 수이다.",
      [`${total - values[0]}`, `${total + values[3]}`, `${Math.max(...values)}`],
      "전체 도수는?",
      chart);
  }
  if (method === "frequency-polygon-maximum") {
    const maximum = Math.max(...values);
    const maximumIndex = values.indexOf(maximum);
    return makeVisual(id, method, "\\text{도수가 가장 큰 계급}", `\\text{${labels[maximumIndex]}}`,
      "도수분포다각형에서 가장 높은 점에 대응하는 계급을 찾는다.",
      labels.filter((_, index) => index !== maximumIndex).map((label) => `\\text{${label}}`),
      "도수가 가장 큰 계급은?",
      chart);
  }
  if (method === "relative-frequency") {
    return makeVisual(id, method, "\\text{색칠한 계급의 상대도수}", fraction(values[2], total),
      "해당 계급의 도수를 전체 도수로 나누어 상대도수를 구한다.",
      [
        fraction(values[2], total + values[0]),
        fraction(values[1], total),
        fraction(total, values[2]),
        fraction(values[2] + 1, total),
        fraction(values[2], total + 1),
      ],
      "색칠한 계급의 상대도수는?",
      { ...chart, highlight: 2 });
  }
  if (method === "relative-frequency-compare") {
    const second = [...values];
    second[1] = values[1] + 3;
    const firstRatio = values[1] / total;
    const secondTotal = second.reduce((sum, value) => sum + value, 0);
    const answer = firstRatio > second[1] / secondTotal ? "A" : "B";
    return makeVisual(id, method, `A:\\frac{${values[1]}}{${total}},\\quad B:\\frac{${second[1]}}{${secondTotal}}`, answer,
      "자료의 수가 다르므로 도수가 아니라 각 집단의 상대도수를 비교한다.",
      [answer === "A" ? "B" : "A", "A=B", "\\text{판단 불가}"],
      "해당 계급의 상대도수가 더 큰 집단은?",
      { ...chart, highlight: 1 });
  }
  if (method === "missing-class-frequency") {
    const known = values[0] + values[1] + values[3];
    return makeVisual(id, method, `\\text{전체 }${total},\\quad \\text{알려진 도수의 합 }${known}`, `${values[2]}`,
      "전체 도수에서 알려진 세 계급의 도수 합을 뺀다.",
      [
        `${known}`, `${total - values[0]}`, `${values[1] + values[2]}`,
        `${values[2] + 1}`, `${Math.max(1, values[2] - 1)}`, `${total - values[2]}`,
      ],
      "빠진 계급의 도수는?",
      { ...chart, highlight: 2 });
  }
  return makeVisual(id, method, "\\text{가로축의 계급 경계}", "10",
    "이웃한 두 계급의 경계값 차가 계급의 크기이다.",
    ["5", "20", "40"],
    "계급의 크기는?",
    chart);
}

function build(
  group: MiddleCurriculumKind,
  method: string,
  next: () => number,
  id: string,
  index: number,
) {
  if (group === "coordinate-proportion") return buildCoordinate(method, next, id, index);
  if (group === "linear-function-basics") return buildLinearFunction(method, next, id);
  if (group === "construction-congruence") return buildConstructionCongruence(method, id);
  if (group === "frequency-graphs") return buildFrequencyGraphs(method, next, id);
  if (group === "plane-geometry") return buildPlaneGeometry(method, next, id);
  if (group === "solid-geometry") return buildSolidGeometry(method, next, id);
  if (group === "triangle-quadrilateral") return withGeometry(buildTriangleQuadrilateral(method, next, id), method, []);
  if (group === "pythagorean") return withGeometry(buildPythagorean(method, next, id, index), method, []);
  if (group === "counting-probability") return buildProbability(method, next, id);
  return buildQuartiles(method, next, id, index);
}

function difficultyForIndex(index: number): MiddleCurriculumDifficulty {
  if (index < 2) return "basic";
  if (index < 5) return "application";
  return "advanced";
}

export function isMiddleCurriculumKind(value: string | null): value is MiddleCurriculumKind {
  return MIDDLE_CURRICULUM_KINDS.includes(value as MiddleCurriculumKind);
}

export function createMiddleCurriculumProblemSet(kind: MiddleCurriculumKind, seed: number) {
  const next = random(seed);
  const signatures = new Set<string>();
  const plannedMethods = METHOD_PLANS[kind];
  const methods = kind === "frequency-graphs"
    ? Array.from({ length: 4 }, (_, index) => plannedMethods[(((Math.abs(seed) - 1) * 4) + index) % plannedMethods.length])
    : plannedMethods;
  return {
    seed,
    kind,
    problems: methods.map((method, index) => {
      let problem = build(kind, method, next, `middle-curriculum-${kind}-${index}`, index);
      let signature = `${problem.latex}|${problem.answerLatex}`;
      for (let attempt = 0; signatures.has(signature) && attempt < 20; attempt += 1) {
        problem = build(kind, method, next, `middle-curriculum-${kind}-${index}`, index);
        signature = `${problem.latex}|${problem.answerLatex}`;
      }
      if (signatures.has(signature)) {
        throw new Error(`${kind}: 한 학습지 안에 같은 문제와 정답이 반복됩니다.`);
      }
      signatures.add(signature);
      return {
        ...problem,
        difficulty: difficultyForIndex(index),
      };
    }),
  };
}

export function createMiddleCurriculumReviewProblems(
  group: MiddleCurriculumKind,
  methods: string[],
  seed: number,
) {
  const next = random(seed);
  return [...new Set(methods)].slice(0, 2).map((method, index) => ({
    ...build(group, method, next, `middle-curriculum-review-${group}-${index}-${seed}`, 6 + index),
    difficulty: "advanced" as const,
  }));
}
