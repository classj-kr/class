export type MiddleQuadraticEquationMethodKind =
  | "square-root-basic"
  | "zero-product"
  | "monic-factorization"
  | "nonmonic-factorization"
  | "common-factor"
  | "perfect-square"
  | "completing-square"
  | "quadratic-formula-monic"
  | "quadratic-formula-general"
  | "negative-leading"
  | "expand-and-solve"
  | "fraction-decimal"
  | "consecutive-integers"
  | "rectangle-area"
  | "number-product"
  | "right-triangle-area";

export type MiddleQuadraticEquationKind =
  | "roots-and-squares"
  | "factorization"
  | "quadratic-formula"
  | "normalize-and-solve"
  | "applications"
  | "comprehensive";

export type MiddleQuadraticEquationDifficulty = "basic" | "application" | "advanced";
type Fraction = readonly [numerator: number, denominator: number];

export type MiddleQuadraticEquationProblem = {
  id: string;
  kind: MiddleQuadraticEquationMethodKind;
  difficulty: MiddleQuadraticEquationDifficulty;
  structure: string;
  label: string;
  latex: string;
  answerLatex: string;
  solutionHint: string;
  coefficients: readonly [number, number, number];
  distractors: string[];
};

export const MIDDLE_QUADRATIC_EQUATION_KINDS: MiddleQuadraticEquationKind[] = [
  "roots-and-squares",
  "factorization",
  "quadratic-formula",
  "normalize-and-solve",
  "applications",
  "comprehensive",
];

export const MIDDLE_QUADRATIC_EQUATION_METHOD_KINDS: MiddleQuadraticEquationMethodKind[] = [
  "square-root-basic",
  "zero-product",
  "monic-factorization",
  "nonmonic-factorization",
  "common-factor",
  "perfect-square",
  "completing-square",
  "quadratic-formula-monic",
  "quadratic-formula-general",
  "negative-leading",
  "expand-and-solve",
  "fraction-decimal",
  "consecutive-integers",
  "rectangle-area",
  "number-product",
  "right-triangle-area",
];

export const MIDDLE_QUADRATIC_EQUATION_TITLES: Record<MiddleQuadraticEquationKind, string> = {
  "roots-and-squares": "이차방정식: 제곱근·완전제곱",
  factorization: "이차방정식: 기본·인수분해",
  "quadratic-formula": "이차방정식: 근의 공식",
  "normalize-and-solve": "이차방정식: 식 정리 후 풀기",
  applications: "이차방정식 활용 계산",
  comprehensive: "이차방정식 종합",
};

const MIDDLE_QUADRATIC_EQUATION_METHOD_TITLES: Record<MiddleQuadraticEquationMethodKind, string> = {
  "square-root-basic": "제곱근으로 풀기",
  "zero-product": "인수의 곱이 0",
  "monic-factorization": "계수가 1인 식의 인수분해",
  "nonmonic-factorization": "일반 이차삼항식의 인수분해",
  "common-factor": "공통인수로 묶기",
  "perfect-square": "완전제곱식",
  "completing-square": "완전제곱꼴로 변형",
  "quadratic-formula-monic": "근의 공식 기초",
  "quadratic-formula-general": "근의 공식 일반형",
  "negative-leading": "음의 최고차항 정리",
  "expand-and-solve": "전개·이항 후 풀이",
  "fraction-decimal": "분수·소수 계수",
  "consecutive-integers": "연속한 두 자연수",
  "rectangle-area": "직사각형의 넓이",
  "number-product": "두 자연수의 곱",
  "right-triangle-area": "직각삼각형의 넓이",
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

function normalizedFraction(numerator: number, denominator = 1): Fraction {
  const sign = denominator < 0 ? -1 : 1;
  const divisor = gcd(numerator, denominator);
  return [sign * numerator / divisor, sign * denominator / divisor];
}

function fractionLatex([numerator, denominator]: Fraction) {
  if (denominator === 1) return String(numerator);
  if (numerator < 0) return `-\\dfrac{${Math.abs(numerator)}}{${denominator}}`;
  return `\\dfrac{${numerator}}{${denominator}}`;
}

function compareFractions(left: Fraction, right: Fraction) {
  return left[0] * right[1] - right[0] * left[1];
}

function rootAnswer(roots: Fraction[]) {
  const unique = [...new Map(roots.map((root) => {
    const normalized = normalizedFraction(root[0], root[1]);
    return [`${normalized[0]}/${normalized[1]}`, normalized] as const;
  })).values()].sort(compareFractions);
  return unique.length === 1
    ? `x=${fractionLatex(unique[0])}`
    : `x=${unique.map(fractionLatex).join(",\\ ")}`;
}

function wrongRootAnswers(roots: Fraction[]) {
  const negated = roots.map(([numerator, denominator]) => normalizedFraction(-numerator, denominator));
  const shifted = roots.map(([numerator, denominator]) => normalizedFraction(numerator + denominator, denominator));
  const shiftedBack = roots.map(([numerator, denominator]) => normalizedFraction(numerator - denominator, denominator));
  const sum = roots.reduce((total, [numerator, denominator]) => total + numerator / denominator, 0);
  const product = roots.reduce((total, [numerator, denominator]) => total * numerator / denominator, 1);
  return [
    rootAnswer(negated),
    rootAnswer(shifted),
    rootAnswer(shiftedBack),
    ...roots.map((root) => rootAnswer([root])),
    rootAnswer([normalizedFraction(Math.round(sum)), normalizedFraction(Math.round(product))]),
  ];
}

function signedTerm(value: number, variable: string, first = false) {
  if (value === 0) return "";
  const sign = value < 0 ? "-" : first ? "" : "+";
  const magnitude = Math.abs(value);
  return `${sign}${magnitude === 1 && variable ? "" : magnitude}${variable}`;
}

function quadraticExpression(a: number, b: number, c: number) {
  return `${signedTerm(a, "x^2", true)}${signedTerm(b, "x")}${signedTerm(c, "")}`;
}

function quadraticLatex(a: number, b: number, c: number) {
  return `${quadraticExpression(a, b, c)}=0`;
}

function signed(value: number) {
  return value < 0 ? String(value) : `+${value}`;
}

function linearExpression(coefficient: number, constant: number) {
  const xTerm = coefficient === 1 ? "x" : coefficient === -1 ? "-x" : `${coefficient}x`;
  return constant === 0 ? xTerm : `${xTerm}${signed(constant)}`;
}

function perfectSquareFactor(value: number) {
  for (let factor = Math.floor(Math.sqrt(value)); factor >= 2; factor -= 1) {
    if (value % (factor * factor) === 0) return factor;
  }
  return 1;
}

function radicalRootAnswer(a: number, b: number, discriminant: number) {
  const square = perfectSquareFactor(discriminant);
  const inside = discriminant / (square * square);
  const divisor = gcd(gcd(Math.abs(b), square), Math.abs(2 * a));
  const numeratorConstant = -b / divisor;
  const radicalCoefficient = square / divisor;
  const denominator = (2 * a) / divisor;
  const radical = `${radicalCoefficient === 1 ? "" : radicalCoefficient}\\sqrt{${inside}}`;
  const numerator = `${numeratorConstant}${radicalCoefficient < 0 ? "" : "\\pm"}${radical}`;
  return denominator === 1 ? `x=${numerator}` : `x=\\dfrac{${numerator}}{${denominator}}`;
}

function uniqueDistractors(answer: string, candidates: string[]) {
  const unique = [...new Set(candidates.filter((candidate) => candidate !== answer))];
  if (unique.length < 3) {
    throw new Error(`이차방정식 문제의 실제 오답이 세 개보다 적습니다: ${answer}`);
  }
  return unique.slice(0, 3);
}

function make(
  id: string,
  kind: MiddleQuadraticEquationMethodKind,
  latex: string,
  answerLatex: string,
  solutionHint: string,
  coefficients: readonly [number, number, number],
  distractors: string[],
  structure: string = kind,
): MiddleQuadraticEquationProblem {
  return {
    id,
    kind,
    difficulty: "basic",
    structure,
    label: MIDDLE_QUADRATIC_EQUATION_METHOD_TITLES[kind],
    latex,
    answerLatex,
    solutionHint,
    coefficients,
    distractors: uniqueDistractors(answerLatex, distractors),
  };
}

function distinctIntegerRoots(next: () => number, limit: number) {
  const first = nonzero(next, -limit, limit);
  let second = nonzero(next, -limit, limit);
  while (second === first) second = nonzero(next, -limit, limit);
  return [first, second] as const;
}

function build(
  kind: MiddleQuadraticEquationMethodKind,
  next: () => number,
  id: string,
  variantHint = 0,
): MiddleQuadraticEquationProblem {
  const [firstRoot, secondRoot] = distinctIntegerRoots(next, variantHint < 5 ? 6 : 9);
  const integerRoots: Fraction[] = [[firstRoot, 1], [secondRoot, 1]];

  if (kind === "square-root-basic") {
    const shift = variantHint < 2 ? 0 : integer(next, -5, 5);
    const distance = integer(next, 2, variantHint < 5 ? 7 : 10);
    const roots: Fraction[] = [[shift - distance, 1], [shift + distance, 1]];
    const latex = shift === 0
      ? `x^2=${distance ** 2}`
      : `(${linearExpression(1, -shift)})^2=${distance ** 2}`;
    return make(id, kind, latex, rootAnswer(roots),
      `제곱근을 취해 ${linearExpression(1, -shift)}=\\pm${distance}로 나눈다.`,
      [1, -2 * shift, shift ** 2 - distance ** 2],
      wrongRootAnswers(roots),
      shift === 0 ? "x-square-equals-number" : "shifted-square");
  }

  if (kind === "zero-product") {
    const latex = `(${linearExpression(1, -firstRoot)})(${linearExpression(1, -secondRoot)})=0`;
    return make(id, kind, latex, rootAnswer(integerRoots),
      "곱이 0이므로 두 일차인수를 각각 0으로 놓는다.",
      [1, -(firstRoot + secondRoot), firstRoot * secondRoot],
      wrongRootAnswers(integerRoots),
      variantHint % 2 === 0 ? "factored-two-roots" : "signed-factors");
  }

  if (kind === "monic-factorization") {
    const coefficients = [1, -(firstRoot + secondRoot), firstRoot * secondRoot] as const;
    return make(id, kind, quadraticLatex(...coefficients), rootAnswer(integerRoots),
      `합이 ${-(coefficients[1])}, 곱이 ${coefficients[2]}인 두 수를 찾아 인수분해한다.`,
      coefficients, wrongRootAnswers(integerRoots),
      firstRoot * secondRoot < 0 ? "opposite-sign-roots" : "same-sign-roots");
  }

  if (kind === "nonmonic-factorization") {
    const leftCoefficient = integer(next, 2, 5);
    const rightCoefficient = integer(next, 1, 4);
    const leftConstant = nonzero(next, -7, 7);
    let rightConstant = nonzero(next, -7, 7);
    while (leftConstant * rightCoefficient === rightConstant * leftCoefficient) {
      rightConstant = nonzero(next, -7, 7);
    }
    const roots: Fraction[] = [
      normalizedFraction(-leftConstant, leftCoefficient),
      normalizedFraction(-rightConstant, rightCoefficient),
    ];
    const coefficients = [
      leftCoefficient * rightCoefficient,
      leftCoefficient * rightConstant + rightCoefficient * leftConstant,
      leftConstant * rightConstant,
    ] as const;
    return make(id, kind, quadraticLatex(...coefficients), rootAnswer(roots),
      `(${linearExpression(leftCoefficient, leftConstant)})(${linearExpression(rightCoefficient, rightConstant)})=0으로 인수분해한다.`,
      coefficients, wrongRootAnswers(roots),
      roots.some((root) => root[1] !== 1) ? "fractional-roots" : "integer-roots");
  }

  if (kind === "common-factor") {
    const common = integer(next, 2, 6);
    const root = nonzero(next, -9, 9);
    const roots: Fraction[] = [[0, 1], [root, 1]];
    const coefficients = [common, -common * root, 0] as const;
    return make(id, kind, quadraticLatex(...coefficients), rootAnswer(roots),
      `${common}x를 공통인수로 묶고 두 인수를 각각 0으로 놓는다.`,
      coefficients, wrongRootAnswers(roots),
      variantHint < 4 ? "x-common-factor" : "signed-x-common-factor");
  }

  if (kind === "perfect-square") {
    const coefficient = variantHint < 2 ? 1 : integer(next, 2, 5);
    let constant = nonzero(next, -8, 8);
    while (gcd(coefficient, constant) !== 1) constant = nonzero(next, -8, 8);
    const root = normalizedFraction(-constant, coefficient);
    const coefficients = [
      coefficient ** 2,
      2 * coefficient * constant,
      constant ** 2,
    ] as const;
    return make(id, kind, quadraticLatex(...coefficients), rootAnswer([root]),
      `(${linearExpression(coefficient, constant)})^2=0으로 바꾸어 중근을 구한다.`,
      coefficients,
      wrongRootAnswers([root, normalizedFraction(constant, coefficient)]),
      coefficient === 1 ? "monic-perfect-square" : "nonmonic-perfect-square");
  }

  if (kind === "completing-square") {
    const center = nonzero(next, -6, 6);
    const distance = integer(next, 2, 7);
    const roots: Fraction[] = [[center - distance, 1], [center + distance, 1]];
    const coefficients = [1, -2 * center, center ** 2 - distance ** 2] as const;
    return make(id, kind, quadraticLatex(...coefficients), rootAnswer(roots),
      `상수항을 이항하고 같은 수 ${center ** 2}를 더해 (${linearExpression(1, -center)})^2=${distance ** 2}로 만든다.`,
      coefficients, wrongRootAnswers(roots),
      coefficients[2] < 0 ? "move-negative-constant" : "move-positive-constant");
  }

  if (kind === "quadratic-formula-monic") {
    const b = 2 * nonzero(next, -4, 4);
    const discriminants = [8, 12, 20, 24, 28, 32, 40, 48] as const;
    const discriminant = discriminants[variantHint % discriminants.length];
    const c = (b * b - discriminant) / 4;
    const answer = radicalRootAnswer(1, b, discriminant);
    return make(id, kind, quadraticLatex(1, b, c), answer,
      `a=1, b=${b}, c=${c}를 근의 공식에 대입하고 √${discriminant}을 간단히 한다.`,
      [1, b, c],
      [
        radicalRootAnswer(1, -b, discriminant),
        `x=\\dfrac{${-b}\\pm\\sqrt{${Math.abs(b * b + 4 * c)}}}{2}`,
        `x=${-b}\\pm\\sqrt{${discriminant}}`,
      ],
      "irrational-formula-roots");
  }

  if (kind === "quadratic-formula-general") {
    const leading = integer(next, 2, 5);
    const otherLeading = integer(next, 1, 3);
    let leftConstant = nonzero(next, -8, 8);
    let rightConstant = nonzero(next, -8, 8);
    let candidateCoefficients = [
      leading * otherLeading,
      leading * rightConstant + otherLeading * leftConstant,
      leftConstant * rightConstant,
    ] as const;
    while (
      leftConstant * otherLeading === rightConstant * leading
      || gcd(gcd(candidateCoefficients[0], candidateCoefficients[1]), candidateCoefficients[2]) !== 1
    ) {
      leftConstant = nonzero(next, -8, 8);
      rightConstant = nonzero(next, -8, 8);
      candidateCoefficients = [
        leading * otherLeading,
        leading * rightConstant + otherLeading * leftConstant,
        leftConstant * rightConstant,
      ];
    }
    const roots: Fraction[] = [
      normalizedFraction(-leftConstant, leading),
      normalizedFraction(-rightConstant, otherLeading),
    ];
    const coefficients = candidateCoefficients;
    return make(id, kind, quadraticLatex(...coefficients), rootAnswer(roots),
      `a=${coefficients[0]}, b=${coefficients[1]}, c=${coefficients[2]}를 근의 공식에 그대로 대입한다.`,
      coefficients, wrongRootAnswers(roots),
      roots.some((root) => root[1] !== 1) ? "general-fractional-roots" : "general-integer-roots");
  }

  if (kind === "negative-leading") {
    const coefficients = [-1, firstRoot + secondRoot, -firstRoot * secondRoot] as const;
    return make(id, kind, quadraticLatex(...coefficients), rootAnswer(integerRoots),
      "양변에 -1을 곱해 x²의 계수를 양수로 만든 뒤 인수분해한다.",
      coefficients, wrongRootAnswers(integerRoots),
      firstRoot * secondRoot < 0 ? "negative-leading-mixed-roots" : "negative-leading-same-sign");
  }

  if (kind === "expand-and-solve") {
    const leftFirst = nonzero(next, -5, 5);
    const leftSecond = nonzero(next, -5, 5);
    const rightLinear = leftFirst + leftSecond + firstRoot + secondRoot;
    const rightConstant = leftFirst * leftSecond - firstRoot * secondRoot;
    const latex = `(${linearExpression(1, leftFirst)})(${linearExpression(1, leftSecond)})=${linearExpression(rightLinear, rightConstant)}`;
    const coefficients = [1, -(firstRoot + secondRoot), firstRoot * secondRoot] as const;
    return make(id, kind, latex, rootAnswer(integerRoots),
      "양변을 전개하고 모든 항을 왼쪽으로 이항한 뒤 인수분해한다.",
      coefficients, wrongRootAnswers(integerRoots),
      variantHint < 4 ? "product-equals-linear" : "signed-product-equals-linear");
  }

  if (kind === "fraction-decimal") {
    const coefficients = [1, -(firstRoot + secondRoot), firstRoot * secondRoot] as const;
    const halfLinear = coefficients[1] / 2;
    const halfConstant = coefficients[2] / 2;
    const latex = variantHint % 2 === 0
      ? `\\dfrac{${quadraticExpression(...coefficients)}}{2}=0`
      : `${signedTerm(0.5, "x^2", true)}${signedTerm(halfLinear, "x")}${signedTerm(halfConstant, "")}=0`;
    return make(id, kind, latex, rootAnswer(integerRoots),
      variantHint % 2 === 0
        ? "양변에 2를 곱해 분모를 없앤 뒤 정수 계수식으로 푼다."
        : "양변에 2를 곱해 소수 계수를 정수로 바꾼 뒤 푼다.",
      coefficients, wrongRootAnswers(integerRoots),
      variantHint % 2 === 0 ? "fraction-coefficients" : "decimal-coefficients");
  }

  if (kind === "consecutive-integers") {
    const smaller = integer(next, 3, 12);
    const product = smaller * (smaller + 1);
    const coefficients = [1, 1, -product] as const;
    return make(id, kind,
      `\\text{연속한 두 자연수의 곱이 }${product}\\text{일 때 작은 수 }x`,
      `x=${smaller}`,
      `x(x+1)=${product}를 세워 인수분해하고 자연수인 해를 고른다.`,
      coefficients,
      [`x=${smaller + 1}`, `x=${-smaller - 1}`, `x=${smaller - 1}`],
      "consecutive-natural-numbers");
  }

  if (kind === "rectangle-area") {
    const width = integer(next, 3, 10);
    const gap = integer(next, 2, 6);
    const area = width * (width + gap);
    const coefficients = [1, gap, -area] as const;
    return make(id, kind,
      `\\text{가로 }x,\\quad \\text{세로 }x+${gap},\\quad \\text{넓이 }${area}`,
      `x=${width}`,
      `x(x+${gap})=${area}를 풀고 길이에 맞는 양의 해를 선택한다.`,
      coefficients,
      [`x=${width + gap}`, `x=${-width - gap}`, `x=${width - 1}`],
      "rectangle-dimensions");
  }

  if (kind === "number-product") {
    const smaller = integer(next, 4, 11);
    const gap = integer(next, 2, 7);
    const product = smaller * (smaller + gap);
    const coefficients = [1, gap, -product] as const;
    return make(id, kind,
      `\\text{차가 }${gap}\\text{인 두 자연수의 곱이 }${product},\\quad \\text{작은 수 }x`,
      `x=${smaller}`,
      `x(x+${gap})=${product}를 세워 두 해 중 자연수인 값을 고른다.`,
      coefficients,
      [`x=${smaller + gap}`, `x=${-smaller - gap}`, `x=${smaller - gap}`],
      "natural-number-product");
  }

  if (kind === "right-triangle-area") {
    const shortLeg = integer(next, 3, 9);
    const gap = integer(next, 2, 6);
    const doubledArea = shortLeg * (shortLeg + gap);
    const area = doubledArea / 2;
    const coefficients = [1, gap, -doubledArea] as const;
    return make(id, kind,
      `\\text{두 직각변 }x,\\ x+${gap},\\quad \\text{넓이 }${fractionLatex(normalizedFraction(doubledArea, 2))}`,
      `x=${shortLeg}`,
      `\\dfrac{x(x+${gap})}{2}=${fractionLatex(normalizedFraction(doubledArea, 2))}를 풀고 양의 해를 고른다.`,
      coefficients,
      [`x=${shortLeg + gap}`, `x=${-shortLeg - gap}`, `x=${shortLeg - 1}`],
      "right-triangle-area");
  }

  throw new Error(`지원하지 않는 이차방정식 풀이 유형: ${kind}`);
}

function difficultyForIndex(index: number): MiddleQuadraticEquationDifficulty {
  if (index < 2) return "basic";
  if (index < 5) return "application";
  return "advanced";
}

const GROUP_METHOD_PLANS: Record<Exclude<MiddleQuadraticEquationKind, "comprehensive">, MiddleQuadraticEquationMethodKind[]> = {
  "roots-and-squares": [
    "square-root-basic",
    "perfect-square",
    "square-root-basic",
    "perfect-square",
    "completing-square",
    "completing-square",
    "perfect-square",
    "completing-square",
  ],
  factorization: [
    "square-root-basic",
    "perfect-square",
    "zero-product",
    "common-factor",
    "monic-factorization",
    "nonmonic-factorization",
    "negative-leading",
    "nonmonic-factorization",
  ],
  "quadratic-formula": [
    "quadratic-formula-monic",
    "quadratic-formula-monic",
    "quadratic-formula-general",
    "quadratic-formula-monic",
    "quadratic-formula-general",
    "quadratic-formula-general",
    "quadratic-formula-monic",
    "quadratic-formula-general",
  ],
  "normalize-and-solve": [
    "expand-and-solve",
    "fraction-decimal",
    "expand-and-solve",
    "expand-and-solve",
    "fraction-decimal",
    "fraction-decimal",
    "expand-and-solve",
    "fraction-decimal",
  ],
  applications: [
    "consecutive-integers",
    "rectangle-area",
    "number-product",
    "right-triangle-area",
    "consecutive-integers",
    "rectangle-area",
    "number-product",
    "right-triangle-area",
  ],
};

const LEGACY_KIND_GROUPS: Record<MiddleQuadraticEquationMethodKind, MiddleQuadraticEquationKind> = {
  "square-root-basic": "roots-and-squares",
  "perfect-square": "roots-and-squares",
  "completing-square": "roots-and-squares",
  "zero-product": "factorization",
  "common-factor": "factorization",
  "monic-factorization": "factorization",
  "nonmonic-factorization": "factorization",
  "negative-leading": "factorization",
  "quadratic-formula-monic": "quadratic-formula",
  "quadratic-formula-general": "quadratic-formula",
  "expand-and-solve": "normalize-and-solve",
  "fraction-decimal": "normalize-and-solve",
  "consecutive-integers": "applications",
  "rectangle-area": "applications",
  "number-product": "applications",
  "right-triangle-area": "applications",
};

function comprehensiveKind(seed: number, index: number) {
  const offset = (((seed - 1) * 8) % MIDDLE_QUADRATIC_EQUATION_METHOD_KINDS.length
    + MIDDLE_QUADRATIC_EQUATION_METHOD_KINDS.length)
    % MIDDLE_QUADRATIC_EQUATION_METHOD_KINDS.length;
  return MIDDLE_QUADRATIC_EQUATION_METHOD_KINDS[
    (offset + index) % MIDDLE_QUADRATIC_EQUATION_METHOD_KINDS.length
  ];
}

export function isMiddleQuadraticEquationKind(value: string | null): value is MiddleQuadraticEquationKind {
  return MIDDLE_QUADRATIC_EQUATION_KINDS.includes(value as MiddleQuadraticEquationKind);
}

export function resolveMiddleQuadraticEquationKind(value: string | null): MiddleQuadraticEquationKind | null {
  if (isMiddleQuadraticEquationKind(value)) return value;
  if (MIDDLE_QUADRATIC_EQUATION_METHOD_KINDS.includes(value as MiddleQuadraticEquationMethodKind)) {
    return LEGACY_KIND_GROUPS[value as MiddleQuadraticEquationMethodKind];
  }
  return null;
}

export function createMiddleQuadraticEquationProblemSet(
  kind: MiddleQuadraticEquationKind,
  seed: number,
) {
  const next = random(seed);
  return {
    seed,
    kind,
    problems: Array.from({ length: 8 }, (_, index) => {
      const method = kind === "comprehensive"
        ? comprehensiveKind(seed, index)
        : GROUP_METHOD_PLANS[kind][index];
      return {
        ...build(method, next, `middle-quadratic-${kind}-${index}`, index),
        difficulty: difficultyForIndex(index),
      };
    }),
  };
}

export function createMiddleQuadraticEquationReviewProblems(
  kinds: MiddleQuadraticEquationMethodKind[],
  seed: number,
) {
  const next = random(seed);
  return [...new Set(kinds)].slice(0, 2).map((kind, index) => ({
    ...build(kind, next, `middle-quadratic-review-${kind}-${index}-${seed}`, index),
    difficulty: difficultyForIndex(index),
  }));
}
