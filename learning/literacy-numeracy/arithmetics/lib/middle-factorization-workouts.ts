export type MiddleFactorizationKind =
  | "common-factor"
  | "multiple-variables"
  | "grouping"
  | "perfect-square"
  | "difference-squares"
  | "monic-trinomial"
  | "nonmonic-trinomial"
  | "three-variables"
  | "cubic-common"
  | "cubic-grouping"
  | "cubic-sum-difference"
  | "normalize-first"
  | "comprehensive";

export type MiddleFactorizationDifficulty = "basic" | "application" | "advanced";

export type MiddleFactorizationProblem = {
  id: string;
  kind: MiddleFactorizationKind;
  difficulty: MiddleFactorizationDifficulty;
  structure: string;
  label: string;
  latex: string;
  answerLatex: string;
  solutionHint: string;
  distractors: string[];
};

export const MIDDLE_FACTORIZATION_KINDS: MiddleFactorizationKind[] = [
  "common-factor",
  "multiple-variables",
  "grouping",
  "perfect-square",
  "difference-squares",
  "monic-trinomial",
  "nonmonic-trinomial",
  "three-variables",
  "cubic-common",
  "cubic-grouping",
  "cubic-sum-difference",
  "normalize-first",
  "comprehensive",
];

export const MIDDLE_FACTORIZATION_TITLES: Record<MiddleFactorizationKind, string> = {
  "common-factor": "인수분해: 공통인수",
  "multiple-variables": "인수분해: 여러 문자",
  grouping: "인수분해: 두 항씩 묶기",
  "perfect-square": "인수분해: 완전제곱식",
  "difference-squares": "인수분해: 제곱의 차",
  "monic-trinomial": "인수분해: 계수가 1인 이차삼항식",
  "nonmonic-trinomial": "인수분해: 일반 이차삼항식",
  "three-variables": "인수분해: 세 문자식",
  "cubic-common": "인수분해: 3차식 공통인수",
  "cubic-grouping": "인수분해: 3차식 묶어내기",
  "cubic-sum-difference": "인수분해: 세제곱의 합과 차",
  "normalize-first": "인수분해: 식 정리 후 인수분해",
  comprehensive: "인수분해",
};

const MIDDLE_FACTORIZATION_LABELS: Record<MiddleFactorizationKind, string> = {
  "common-factor": "공통인수 묶기",
  "multiple-variables": "여러 문자 공통인수",
  grouping: "두 항씩 묶기",
  "perfect-square": "완전제곱식",
  "difference-squares": "제곱의 차",
  "monic-trinomial": "계수가 1인 이차삼항식",
  "nonmonic-trinomial": "일반 이차삼항식",
  "three-variables": "세 문자식",
  "cubic-common": "3차식 공통인수",
  "cubic-grouping": "3차식 묶어내기",
  "cubic-sum-difference": "세제곱의 합과 차",
  "normalize-first": "식 정리 후 인수분해",
  comprehensive: "인수분해",
};

const MIDDLE_FACTORIZATION_SOLUTION_HINTS: Record<MiddleFactorizationKind, string> = {
  "common-factor": "계수의 최대공약수와 공통 문자의 낮은 차수를 먼저 묶는다.",
  "multiple-variables": "계수의 최대공약수와 모든 항에 겹치는 문자를 함께 묶는다.",
  grouping: "두 항씩 묶어 같은 괄호를 만든 뒤 그 괄호를 다시 묶는다.",
  "perfect-square": "첫째 항과 끝항의 제곱근을 찾고 가운데항의 부호를 확인한다.",
  "difference-squares": "두 제곱의 차를 합과 차의 곱으로 바꾼다.",
  "monic-trinomial": "합이 일차항의 계수이고 곱이 상수항인 두 수를 찾는다.",
  "nonmonic-trinomial": "첫 계수와 상수항의 곱을 이용해 가운데항을 나누어 묶는다.",
  "three-variables": "공통 부분끼리 묶고 남은 식에서 같은 인수를 다시 찾는다.",
  "cubic-common": "공통인수를 먼저 묶은 뒤 남은 이차식을 끝까지 인수분해한다.",
  "cubic-grouping": "두 항씩 묶어 공통인 이차식이나 일차식을 만든다.",
  "cubic-sum-difference": "세제곱의 합·차 공식을 적용하고 공통인수까지 확인한다.",
  "normalize-first": "동류항이나 반복되는 괄호를 정리한 뒤 공통인수를 묶는다.",
  comprehensive: "공통인수와 인수분해 공식을 차례로 확인한다.",
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

function coprimeNonzero(
  next: () => number,
  relativeTo: number,
  minimum: number,
  maximum: number,
) {
  let value = nonzero(next, minimum, maximum);
  while (gcd(relativeTo, value) !== 1) value = nonzero(next, minimum, maximum);
  return value;
}

function coprimePositivePair(next: () => number, minimum: number, maximum: number) {
  const left = integer(next, minimum, maximum);
  let right = integer(next, minimum, maximum);
  while (gcd(left, right) !== 1) right = integer(next, minimum, maximum);
  return [left, right] as const;
}

function coefficient(value: number, variable: string, first = false) {
  if (value === 0) return "";
  const sign = value < 0 ? "-" : first ? "" : "+";
  const magnitude = Math.abs(value);
  return `${sign}${magnitude === 1 && variable ? "" : magnitude}${variable}`;
}

function polynomial(terms: Array<[number, string]>) {
  const visible = terms.filter(([value]) => value !== 0);
  return visible.map(([value, variable], index) => coefficient(value, variable, index === 0)).join("");
}

function signed(value: number) {
  return value < 0 ? String(value) : `+${value}`;
}

function signedFactorCoefficient(value: number) {
  if (value === 1) return "+";
  if (value === -1) return "-";
  return signed(value);
}

function linear(variable: string, constant: number, leading = 1) {
  const variableTerm = `${leading === 1 ? "" : leading === -1 ? "-" : leading}${variable}`;
  return constant === 0 ? variableTerm : `${variableTerm}${signed(constant)}`;
}

export function formatNormalizedLinearCombination(
  leading: number,
  constant: number,
  sharedConstant: number,
) {
  const common = gcd(leading, constant);
  const primitiveLeading = leading / common;
  const primitiveConstant = constant / common;
  const sharedFactor = linear("x", sharedConstant);
  const remainingFactor = linear("x", primitiveConstant, primitiveLeading);
  const outside = common === 1 ? "" : String(common);
  return sharedFactor === remainingFactor
    ? `${outside}(${sharedFactor})^2`
    : `${outside}(${sharedFactor})(${remainingFactor})`;
}

function flipFirstOperation(expression: string) {
  const index = expression.slice(1).search(/[+-]/);
  if (index < 0) return expression;
  const actualIndex = index + 1;
  const flipped = expression[actualIndex] === "+" ? "-" : "+";
  return `${expression.slice(0, actualIndex)}${flipped}${expression.slice(actualIndex + 1)}`;
}

function omitFirstFactor(expression: string) {
  const firstParenthesis = expression.indexOf("(");
  if (firstParenthesis > 0) return expression.slice(firstParenthesis);
  const firstFactor = /^\([^)]*\)/.exec(expression)?.[0];
  if (
    firstFactor
    && expression.length > firstFactor.length
    && expression[firstFactor.length] !== "^"
  ) {
    return expression.slice(firstFactor.length);
  }
  return expression;
}

function uniqueDistractors(answer: string, candidates: string[]) {
  const isPlaceholder = (candidate: string) => {
    if (!candidate.startsWith(answer)) return false;
    return /^[+-](?:1|a|b)$/.test(candidate.slice(answer.length));
  };
  const realisticFallbacks = [
    omitFirstFactor(answer),
    flipFirstOperation(answer),
    answer.replace("^2", ""),
    answer.replace(/^(\d+)(?=[a-z(])/, ""),
    `-(${answer})`,
    `2(${answer})`,
  ];
  const unique = [
    ...new Set(
      [...candidates, ...realisticFallbacks]
        .filter((candidate) => candidate !== answer && !isPlaceholder(candidate)),
    ),
  ];
  if (unique.length < 3) {
    throw new Error(`인수분해 문제의 실제 오답이 세 개보다 적습니다: ${answer}`);
  }
  return unique.slice(0, 3);
}

function make(
  id: string,
  kind: MiddleFactorizationKind,
  latex: string,
  answerLatex: string,
  distractors: string[],
  structure: string = kind,
  difficulty: MiddleFactorizationDifficulty = "basic",
): MiddleFactorizationProblem {
  return {
    id,
    kind,
    difficulty,
    structure,
    label: MIDDLE_FACTORIZATION_LABELS[kind],
    latex,
    answerLatex,
    solutionHint: MIDDLE_FACTORIZATION_SOLUTION_HINTS[kind],
    distractors: uniqueDistractors(answerLatex, distractors),
  };
}

function build(
  kind: MiddleFactorizationKind,
  next: () => number,
  id: string,
  variantHint = 0,
): MiddleFactorizationProblem {
  const progressionVariant = (
    variantHint < 2 ? 0
      : variantHint < 4 ? 1
        : variantHint < 6 ? 2
          : 3
  );
  const p = nonzero(next, -9, 9);
  let q = nonzero(next, -9, 9);
  while (q === p) q = nonzero(next, -9, 9);
  const [m, n] = coprimePositivePair(next, 2, 9);

  if (kind === "common-factor") {
    const common = integer(next, 2, 6);
    const left = integer(next, 2, 6);
    const right = coprimeNonzero(next, left, -6, 6);
    const variant = progressionVariant % 4;
    const forms = [
      {
        expression: polynomial([[common * left, "x^2"], [common * right, "x"]]),
        answer: `${common}x(${linear("x", right, left)})`,
        structure: "linear-common",
      },
      {
        expression: polynomial([[common * left, "x^3"], [common * right, "x^2"]]),
        answer: `${common}x^2(${linear("x", right, left)})`,
        structure: "power-common",
      },
      {
        expression: polynomial([[common * left, "x^2"], [common * right, "xy"]]),
        answer: `${common}x(${left}x${signed(right)}y)`,
        structure: "two-variable-common",
      },
      {
        expression: polynomial([[common * left, "a^2"], [common * right, "ab"]]),
        answer: `${common}a(${left}a${signed(right)}b)`,
        structure: "letter-common",
      },
    ];
    const { expression, answer, structure } = forms[variant];
    return make(id, kind, expression, answer, [
      `${common}(${linear("x", right, left)})`,
      `${answer}+1`,
      `${answer}-1`,
    ], structure);
  }

  if (kind === "multiple-variables") {
    const common = integer(next, 2, 5);
    const left = integer(next, 2, 5);
    const right = coprimeNonzero(next, left, -5, 5);
    const third = coprimeNonzero(next, left, -5, 5);
    const variant = progressionVariant % 4;
    const forms = [
      {
        expression: polynomial([[common * left, "a^2b"], [common * right, "ab^2"]]),
        answer: `${common}ab(${left}a${signed(right)}b)`,
        structure: "ab-binomial",
      },
      {
        expression: polynomial([[common * left, "a^3b^2"], [common * right, "a^2b^3"]]),
        answer: `${common}a^2b^2(${left}a${signed(right)}b)`,
        structure: "higher-power-ab",
      },
      {
        expression: polynomial([[common * left, "a^2bc"], [common * right, "ab^2c"], [common * third, "abc^2"]]),
        answer: `${common}abc(${left}a${signed(right)}b${signed(third)}c)`,
        structure: "abc-trinomial",
      },
      {
        expression: polynomial([[common * left, "x^3y^2"], [common * right, "x^2y^4"]]),
        answer: `${common}x^2y^2(${left}x${signed(right)}y^2)`,
        structure: "unequal-powers",
      },
    ];
    const { expression, answer, structure } = forms[variant];
    return make(id, kind, expression, answer, [
      `${answer}+a`,
      `${answer}+b`,
      `${answer}-1`,
    ], structure);
  }

  if (kind === "grouping") {
    const variant = progressionVariant % 4;
    const forms = [
      {
        expression: polynomial([[m, "ax"], [m, "ay"], [n, "bx"], [n, "by"]]),
        answer: `(${m}a+${n}b)(x+y)`,
        structure: "sum-sum",
      },
      {
        expression: polynomial([[m, "ax"], [m, "ay"], [-n, "bx"], [-n, "by"]]),
        answer: `(${m}a-${n}b)(x+y)`,
        structure: "difference-sum",
      },
      {
        expression: polynomial([[m, "ax"], [-m, "ay"], [n, "bx"], [-n, "by"]]),
        answer: `(${m}a+${n}b)(x-y)`,
        structure: "sum-difference",
      },
      {
        expression: polynomial([[m, "ax"], [n, "by"], [n, "bx"], [m, "ay"]]),
        answer: `(${m}a+${n}b)(x+y)`,
        structure: "reordered",
      },
    ];
    const { expression, answer, structure } = forms[variant];
    return make(id, kind, expression, answer, [
      `(${m}a-${n}b)(x+y)`,
      `(${m}a+${n}b)(x-y)`,
      `(a+b)(${m}x+${n}y)`,
    ], structure);
  }

  if (kind === "perfect-square") {
    const sign = p < 0 ? -1 : 1;
    const variant = progressionVariant % 4;
    const forms = [
      {
        expression: polynomial([[1, "x^2"], [2 * p, "x"], [p * p, ""]]),
        answer: `(${linear("x", p)})^2`,
        structure: "monic-x",
      },
      {
        expression: polynomial([[m * m, "x^2"], [sign * 2 * m * n, "x"], [n * n, ""]]),
        answer: `(${linear("x", sign * n, m)})^2`,
        structure: "coefficient-x",
      },
      {
        expression: polynomial([[m * m, "a^2"], [sign * 2 * m * n, "ab"], [n * n, "b^2"]]),
        answer: `(${m}a${sign < 0 ? "-" : "+"}${n}b)^2`,
        structure: "two-variable-square",
      },
      {
        expression: polynomial([[1, "y^2"], [2 * p, "y"], [p * p, ""]]),
        answer: `(${linear("y", p)})^2`,
        structure: "monic-y",
      },
    ];
    const { expression, answer, structure } = forms[variant];
    return make(id, kind, expression, answer, [
      `${answer}+1`,
      `${answer}-1`,
      `-${answer}`,
    ], structure);
  }

  if (kind === "difference-squares") {
    const distance = integer(next, 2, 6);
    const variant = progressionVariant % 4;
    const forms = [
      {
        expression: polynomial([[m * m, "x^2"], [-n * n, ""]]),
        answer: `(${m}x-${n})(${m}x+${n})`,
        structure: "number-and-x",
      },
      {
        expression: polynomial([[m * m, "a^2"], [-n * n, "b^2"]]),
        answer: `(${m}a-${n}b)(${m}a+${n}b)`,
        structure: "two-variable-difference",
      },
      {
        expression: `(${linear("x", p)})^2-${distance ** 2}`,
        answer: `(${linear("x", p - distance)})(${linear("x", p + distance)})`,
        structure: "shifted-square",
      },
      {
        expression: polynomial([[m * m, "x^4"], [-n * n, "y^2"]]),
        answer: `(${m}x^2-${n}y)(${m}x^2+${n}y)`,
        structure: "higher-power-difference",
      },
    ];
    const { expression, answer, structure } = forms[variant];
    return make(id, kind, expression, answer, [
      `${answer}+1`,
      `${answer}-1`,
      `-${answer}`,
    ], structure);
  }

  if (kind === "monic-trinomial") {
    const magnitudeMaximum = variantHint < 2 ? 6 : variantHint < 5 ? 9 : 12;
    const firstMagnitude = integer(next, 1, magnitudeMaximum);
    let secondMagnitude = integer(next, 1, magnitudeMaximum);
    while (secondMagnitude === firstMagnitude) {
      secondMagnitude = integer(next, 1, magnitudeMaximum);
    }
    const variant = progressionVariant % 4;
    const firstRoot = variant === 1 ? -firstMagnitude : firstMagnitude;
    const secondRoot = variant === 1
      ? -secondMagnitude
      : variant === 2
        ? -secondMagnitude
        : secondMagnitude;
    const variable = variant === 3 ? "y" : "x";
    const expression = polynomial([[1, `${variable}^2`], [firstRoot + secondRoot, variable], [firstRoot * secondRoot, ""]]);
    const answer = `(${linear(variable, firstRoot)})(${linear(variable, secondRoot)})`;
    return make(id, kind, expression, answer, [
      `(${linear(variable, -firstRoot)})(${linear(variable, -secondRoot)})`,
      `(${linear(variable, firstRoot)})(${linear(variable, -secondRoot)})`,
      `(${linear(variable, firstRoot + secondRoot)})(${linear(variable, firstRoot * secondRoot)})`,
    ], ["positive-pair", "negative-pair", "opposite-signs", "other-variable"][variant]);
  }

  if (kind === "nonmonic-trinomial") {
    const a = integer(next, 2, 6);
    const variant = progressionVariant % 4;
    const b = variant === 2 ? 1 : integer(next, 2, 6);
    const firstSign = variant === 1 ? -1 : 1;
    const secondSign = variant === 2 ? -1 : variant === 1 ? -1 : 1;
    const firstConstant = firstSign * Math.abs(coprimeNonzero(next, a, 1, 9));
    const secondConstant = secondSign * Math.abs(coprimeNonzero(next, b, 1, 9));
    const variable = variant === 3 ? "y" : "x";
    const expression = polynomial([[a * b, `${variable}^2`], [a * secondConstant + b * firstConstant, variable], [firstConstant * secondConstant, ""]]);
    const answer = `(${linear(variable, firstConstant, a)})(${linear(variable, secondConstant, b)})`;
    return make(id, kind, expression, answer, [
      `(${linear(variable, -firstConstant, a)})(${linear(variable, -secondConstant, b)})`,
      `(${linear(variable, -firstConstant, a)})(${linear(variable, secondConstant, b)})`,
      `(${linear(variable, firstConstant, a * b)})(${linear(variable, secondConstant)})`,
    ], ["both-positive", "both-negative", "mixed-monic", "other-variable"][variant]);
  }

  if (kind === "three-variables") {
    const patterns = [
      ["a^2+ab+ac+bc", "(a+b)(a+c)", "shared-a"],
      ["ab+ac+bd+cd", "(a+d)(b+c)", "four-letter-grouping"],
      ["ab+ac+bc+c^2", "(a+c)(b+c)", "ab-bc-ca-pattern"],
      ["a^2b+ab^2+abc", "ab(a+b+c)", "three-variable-common-factor"],
      ["a^2b+ab^2+a+b", "(a+b)(ab+1)", "mixed-degree"],
      ["ab-ac+bd-cd", "(a+d)(b-c)", "difference-grouping"],
      [
        "a^2b+a^2c+ab^2+ac^2+b^2c+bc^2+2abc",
        "(a+b)(b+c)(c+a)",
        "cyclic-three-factors",
      ],
    ] as const;
    const progressiveVariant = [0, 0, 1, 2, 3, 4, 5, 6][variantHint] ?? variantHint % patterns.length;
    const [baseExpression, baseAnswer, structure] = patterns[progressiveVariant];
    const letterSets = [
      ["a", "b", "c", "d"],
      ["x", "y", "z", "w"],
      ["p", "q", "r", "s"],
    ] as const;
    const letters = letterSets[integer(next, 0, letterSets.length - 1)];
    const rename = (formula: string) => formula.replace(/[abcd]/g, (letter) => (
      letters[["a", "b", "c", "d"].indexOf(letter)]
    ));
    const scale = integer(next, 1, 9);
    const expression = rename(baseExpression).replace(
      /(^|[+-])(\d*)(?=[a-z])/g,
      (_, sign: string, digits: string) => (
        `${sign}${digits ? Number(digits) * scale : scale === 1 ? "" : scale}`
      ),
    );
    const renamedAnswer = rename(baseAnswer);
    const answer = scale === 1 ? renamedAnswer : `${scale}${renamedAnswer}`;
    const scaledWrongAnswer = (formula: string) => (
      scale === 1 ? rename(formula) : `${scale}${rename(formula)}`
    );
    return make(id, kind, expression, answer, [
      scaledWrongAnswer("(a+b+c)^2"),
      scaledWrongAnswer("(a-b)(a-c)"),
      scaledWrongAnswer("(a+b)(a-c)"),
    ], structure);
  }

  if (kind === "cubic-common") {
    const common = integer(next, 2, 5);
    const primitive = coprimeNonzero(next, m, -6, 6);
    const distance = integer(next, 2, 6);
    const firstRoot = nonzero(next, -5, 5);
    let secondRoot = nonzero(next, -5, 5);
    while (secondRoot === firstRoot) secondRoot = nonzero(next, -5, 5);
    const variant = progressionVariant % 4;
    const forms = [
      {
        expression: polynomial([[common, "x^3"], [common * (firstRoot + secondRoot), "x^2"], [common * firstRoot * secondRoot, "x"]]),
        answer: `${common}x(${linear("x", firstRoot)})(${linear("x", secondRoot)})`,
        structure: "common-then-trinomial",
      },
      {
        expression: polynomial([[common * m, "x^3"], [common * primitive, "x^2"]]),
        answer: `${common}x^2(${linear("x", primitive, m)})`,
        structure: "x-squared-common",
      },
      {
        expression: polynomial([[common, "x^3"], [-common * distance ** 2, "x"]]),
        answer: `${common}x(x-${distance})(x+${distance})`,
        structure: "common-then-difference",
      },
      {
        expression: polynomial([[common * m, "a^3b"], [common * primitive, "a^2b^2"]]),
        answer: `${common}a^2b(${m}a${signed(primitive)}b)`,
        structure: "multivariable-cubic",
      },
    ];
    const { expression, answer, structure } = forms[variant];
    return make(id, kind, expression, answer, [
      `${answer}+1`,
      `${answer}-1`,
      `-${answer}`,
    ], structure);
  }

  if (kind === "cubic-grouping") {
    const nonsquares = [2, 3, 5, 6, 7] as const;
    const positive = nonsquares[integer(next, 0, nonsquares.length - 1)];
    const variant = progressionVariant % 4;
    const sign = variant === 1 ? -1 : 1;
    const forms = [
      {
        expression: polynomial([[1, "x^3"], [p, "x^2"], [positive, "x"], [p * positive, ""]]),
        answer: `(${linear("x", p)})(x^2+${positive})`,
        structure: "monic-plus",
      },
      {
        expression: polynomial([[1, "x^3"], [p, "x^2"], [-positive, "x"], [-p * positive, ""]]),
        answer: `(${linear("x", p)})(x^2-${positive})`,
        structure: "monic-minus",
      },
      {
        expression: polynomial([[m, "x^3"], [n, "x^2"], [m * positive, "x"], [n * positive, ""]]),
        answer: `(${linear("x", n, m)})(x^2+${positive})`,
        structure: "nonmonic-grouping",
      },
      {
        expression: polynomial([[m, "x^3"], [m * sign * positive, "x"], [n, "x^2"], [n * sign * positive, ""]]),
        answer: `(${linear("x", n, m)})(x^2${sign < 0 ? "-" : "+"}${positive})`,
        structure: "reordered-cubic",
      },
    ];
    const { expression, answer, structure } = forms[variant];
    return make(id, kind, expression, answer, [
      `${answer}+1`,
      `${answer}-1`,
      `-${answer}`,
    ], structure);
  }

  if (kind === "cubic-sum-difference") {
    const r = integer(next, 2, 4);
    const common = integer(next, 2, 4);
    const [cubeM, cubeN] = coprimePositivePair(next, 2, 5);
    const [cubeVariable, cubeOtherVariable] = [
      ["x", "y"],
      ["a", "b"],
      ["p", "q"],
    ][integer(next, 0, 2)];
    const variant = variantHint % 8;
    const forms = [
      {
        expression: `${cubeVariable}^3+${r ** 3}`,
        answer: `(${cubeVariable}+${r})(${cubeVariable}^2-${r}${cubeVariable}+${r ** 2})`,
        structure: "monic-cube-formula",
      },
      {
        expression: `${cubeVariable}^3-${r ** 3}`,
        answer: `(${cubeVariable}-${r})(${cubeVariable}^2+${r}${cubeVariable}+${r ** 2})`,
        structure: "monic-cube-formula",
      },
      {
        expression: `${cubeM ** 3}${cubeVariable}^3+${cubeN ** 3}`,
        answer: `(${cubeM}${cubeVariable}+${cubeN})(${cubeM ** 2}${cubeVariable}^2-${cubeM * cubeN}${cubeVariable}+${cubeN ** 2})`,
        structure: "coefficient-cube-sum",
      },
      {
        expression: `${cubeM ** 3}${cubeVariable}^3-${cubeN ** 3}`,
        answer: `(${cubeM}${cubeVariable}-${cubeN})(${cubeM ** 2}${cubeVariable}^2+${cubeM * cubeN}${cubeVariable}+${cubeN ** 2})`,
        structure: "coefficient-cube-difference",
      },
      {
        expression: `${cubeVariable}^3+${r ** 3}${cubeOtherVariable}^3`,
        answer: `(${cubeVariable}+${r}${cubeOtherVariable})(${cubeVariable}^2-${r}${cubeVariable}${cubeOtherVariable}+${r ** 2}${cubeOtherVariable}^2)`,
        structure: "two-variable-cube-sum",
      },
      {
        expression: `${common}${cubeVariable}^4-${common * r ** 3}${cubeVariable}`,
        answer: `${common}${cubeVariable}(${cubeVariable}-${r})(${cubeVariable}^2+${r}${cubeVariable}+${r ** 2})`,
        structure: "common-then-cube-difference",
      },
      {
        expression: `(${linear(cubeVariable, p)})^3+${r ** 3}`,
        answer: `(${linear(cubeVariable, p + r)})((${linear(cubeVariable, p)})^2-${r}(${linear(cubeVariable, p)})+${r ** 2})`,
        structure: "shifted-cube-sum",
      },
      {
        expression: `8${cubeVariable}^6-27${cubeOtherVariable}^3`,
        answer: `(2${cubeVariable}^2-3${cubeOtherVariable})(4${cubeVariable}^4+6${cubeVariable}^2${cubeOtherVariable}+9${cubeOtherVariable}^2)`,
        structure: "higher-power-cube-difference",
      },
    ];
    const { expression, answer, structure } = forms[variant];
    return make(id, kind, expression, answer, [
      `${answer}+1`,
      `${answer}-1`,
      `-${answer}`,
    ], structure);
  }

  if (kind === "normalize-first") {
    const a = integer(next, 2, 5);
    const variant = ([0, 0, 1, 2, 3, 3, 4, 4][variantHint] ?? variantHint) % 5;

    if (variant === 0) {
      const expression = `${a}x(${linear("x", p)})${signedFactorCoefficient(q)}(${linear("x", p)})`;
      const answer = formatNormalizedLinearCombination(a, q, p);
      return make(id, kind, expression, answer, [
        `(${linear("x", p)})(${linear("x", q, a - 1)})`,
        `(${linear("x", -p)})(${linear("x", q, a)})`,
        `(${linear("x", p)})(${linear("x", -q, a)})`,
      ], "shared-binomial");
    }

    if (variant === 1) {
      const expression = `(${linear("x", p)})^2${signedFactorCoefficient(q)}(${linear("x", p)})`;
      const answer = `(${linear("x", p)})(${linear("x", p + q)})`;
      return make(id, kind, expression, answer, [
        `(${linear("x", p)})(${linear("x", p - q)})`,
        `(${linear("x", -p)})(${linear("x", p + q)})`,
        `(${linear("x", p + q)})^2`,
      ], "square-and-shared-factor");
    }

    if (variant === 2) {
      const distance = integer(next, 2, 6);
      const expression = `(${linear("x", p)})^2-${distance ** 2}`;
      const answer = `(${linear("x", p - distance)})(${linear("x", p + distance)})`;
      return make(id, kind, expression, answer, [
        `(${linear("x", p - distance)})^2`,
        `(${linear("x", p + distance)})^2`,
        `(${linear("x", p - distance ** 2)})(${linear("x", p + distance ** 2)})`,
      ], "shifted-difference-squares");
    }

    if (variant === 3) {
      const expression = polynomial([
        [a, "x^2"],
        [a * p, "x"],
        [q, "x"],
        [p * q, ""],
      ]);
      const answer = formatNormalizedLinearCombination(a, q, p);
      return make(id, kind, expression, answer, [
        `(${linear("x", -p)})(${linear("x", q, a)})`,
        `(${linear("x", p)})(${linear("x", -q, a)})`,
        `(${linear("x", p + q, a)})`,
      ], "expanded-four-terms");
    }

    const b = integer(next, 2, 5);
    const r = nonzero(next, -6, 6);
    const shared = linear("x", p);
    const expression = `(${shared})(${linear("x", q, a)})+(${shared})(${linear("x", r, b)})`;
    const answer = formatNormalizedLinearCombination(a + b, q + r, p);
    return make(id, kind, expression, answer, [
      `(${shared})(${linear("x", q + r, a + b - 1)})`,
      `(${shared})(${linear("x", q - r, a + b)})`,
      `(${linear("x", -p)})(${linear("x", q + r, a + b)})`,
    ], "sum-of-two-products");
  }

  const comprehensiveKinds = [
    "common-factor",
    "common-factor",
    "perfect-square",
    "difference-squares",
    "nonmonic-trinomial",
    "cubic-common",
    "cubic-sum-difference",
    "normalize-first",
  ] as const;
  return build(
    comprehensiveKinds[variantHint] ?? comprehensiveKinds[integer(next, 0, comprehensiveKinds.length - 1)],
    next,
    id,
    variantHint,
  );
}

function difficultyForIndex(index: number): MiddleFactorizationDifficulty {
  if (index < 2) return "basic";
  if (index < 5) return "application";
  return "advanced";
}

export const MIDDLE_FACTORIZATION_CORE_KINDS = MIDDLE_FACTORIZATION_KINDS.filter(
  (kind) => (
    kind !== "comprehensive"
    && kind !== "cubic-grouping"
    && kind !== "cubic-sum-difference"
  ),
);

const COMPREHENSIVE_ROTATION = MIDDLE_FACTORIZATION_CORE_KINDS;

function comprehensiveKind(seed: number, index: number) {
  const offset = (((seed - 1) * 8) % COMPREHENSIVE_ROTATION.length + COMPREHENSIVE_ROTATION.length)
    % COMPREHENSIVE_ROTATION.length;
  return COMPREHENSIVE_ROTATION[(offset + index) % COMPREHENSIVE_ROTATION.length];
}

export function isMiddleFactorizationKind(value: string | null): value is MiddleFactorizationKind {
  return MIDDLE_FACTORIZATION_KINDS.includes(value as MiddleFactorizationKind);
}

export function createMiddleFactorizationProblemSet(kind: MiddleFactorizationKind, seed: number) {
  const next = random(seed);
  return {
    seed,
    kind,
    problems: Array.from({ length: 8 }, (_, index) => (
      {
        ...build(
          kind === "comprehensive"
            ? comprehensiveKind(seed, index)
            : kind === "nonmonic-trinomial" && index < 2
              ? "monic-trinomial"
              : kind,
          next,
          `middle-factorization-${kind}-${index}`,
          index,
        ),
        difficulty: difficultyForIndex(index),
      }
    )),
  };
}

export function createMiddleFactorizationReviewProblems(
  kinds: MiddleFactorizationKind[],
  seed: number,
) {
  const next = random(seed);
  return [...new Set(kinds)].slice(0, 2).map((kind, index) => (
    {
      ...build(kind, next, `middle-factorization-review-${kind}-${index}-${seed}`, index),
      difficulty: difficultyForIndex(index),
    }
  ));
}
