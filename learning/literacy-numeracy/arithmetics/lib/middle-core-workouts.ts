export type MiddleCoreKind =
  | "prime-factorization"
  | "gcd-lcm"
  | "linear-equation"
  | "linear-equation-application"
  | "repeating-decimal"
  | "exponent-laws"
  | "monomial-multiply"
  | "monomial-divide"
  | "monomial-comprehensive"
  | "polynomial-add-subtract"
  | "linear-inequality"
  | "linear-inequality-application"
  | "simultaneous-substitution"
  | "simultaneous-elimination"
  | "simultaneous-application"
  | "simultaneous-special"
  | "linear-system-comprehensive"
  | "square-roots-real"
  | "radical-calculation"
  | "polynomial-multiply"
  | "polynomial-divide"
  | "formula-square"
  | "formula-sum-difference"
  | "formula-comprehensive";

export type MiddleCoreDifficulty = "basic" | "application" | "advanced";

export type MiddleCoreProblem = {
  id: string;
  kind: MiddleCoreKind;
  difficulty: MiddleCoreDifficulty;
  structure: string;
  label: string;
  question: string;
  latex: string;
  answerLatex: string;
  solutionHint: string;
  distractors: string[];
};

export const MIDDLE_CORE_KINDS: MiddleCoreKind[] = [
  "prime-factorization",
  "gcd-lcm",
  "linear-equation",
  "linear-equation-application",
  "repeating-decimal",
  "exponent-laws",
  "monomial-multiply",
  "monomial-divide",
  "monomial-comprehensive",
  "polynomial-add-subtract",
  "linear-inequality",
  "linear-inequality-application",
  "simultaneous-substitution",
  "simultaneous-elimination",
  "simultaneous-application",
  "simultaneous-special",
  "linear-system-comprehensive",
  "square-roots-real",
  "radical-calculation",
  "polynomial-multiply",
  "polynomial-divide",
  "formula-square",
  "formula-sum-difference",
  "formula-comprehensive",
];

export const MIDDLE_CORE_TITLES: Record<MiddleCoreKind, string> = {
  "prime-factorization": "소인수분해",
  "gcd-lcm": "최대공약수와 최소공배수",
  "linear-equation": "일차방정식",
  "linear-equation-application": "일차방정식 활용 계산",
  "repeating-decimal": "유리수와 순환소수",
  "exponent-laws": "지수법칙",
  "monomial-multiply": "단항식의 곱셈",
  "monomial-divide": "단항식의 나눗셈",
  "monomial-comprehensive": "단항식의 곱셈과 나눗셈",
  "polynomial-add-subtract": "문자식 기본연산 종합",
  "linear-inequality": "일차부등식과 활용",
  "linear-inequality-application": "일차부등식 활용",
  "simultaneous-substitution": "연립일차방정식 대입법",
  "simultaneous-elimination": "연립일차방정식 가감법",
  "simultaneous-application": "연립일차방정식 활용",
  "simultaneous-special": "연립일차방정식의 해의 개수",
  "linear-system-comprehensive": "연립방정식",
  "square-roots-real": "제곱근과 실수",
  "radical-calculation": "근호를 포함한 식의 계산",
  "polynomial-multiply": "다항식의 곱셈",
  "polynomial-divide": "다항식을 단항식으로 나누기",
  "formula-square": "곱셈공식: 완전제곱식",
  "formula-sum-difference": "곱셈공식: 합과 차",
  "formula-comprehensive": "다항식의 곱셈과 곱셈공식",
};

type AtomicMiddleCoreKind = Exclude<
  MiddleCoreKind,
  "monomial-comprehensive" | "linear-system-comprehensive" | "formula-comprehensive"
>;

MIDDLE_CORE_TITLES["linear-equation"] = "일차방정식과 활용 계산";
MIDDLE_CORE_TITLES["radical-calculation"] = "제곱근과 근호 계산";

const MONOMIAL_COMPREHENSIVE_PARTS: AtomicMiddleCoreKind[] = [
  "monomial-multiply",
  "monomial-divide",
];
const ALGEBRAIC_EXPRESSION_COMPREHENSIVE_PARTS: AtomicMiddleCoreKind[] = [
  "exponent-laws",
  "monomial-multiply",
  "monomial-divide",
  "polynomial-multiply",
  "polynomial-add-subtract",
  "polynomial-divide",
  "polynomial-add-subtract",
  "polynomial-add-subtract",
];
const LINEAR_SYSTEM_COMPREHENSIVE_PARTS: AtomicMiddleCoreKind[] = [
  "simultaneous-substitution",
  "simultaneous-elimination",
  "simultaneous-application",
  "simultaneous-special",
  "simultaneous-substitution",
  "simultaneous-elimination",
  "simultaneous-application",
  "simultaneous-special",
];
const FORMULA_COMPREHENSIVE_PARTS: AtomicMiddleCoreKind[] = [
  "polynomial-multiply",
  "polynomial-divide",
  "formula-square",
  "formula-sum-difference",
];
const SQUARE_FREE = [2, 3, 5, 6, 7] as const;

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

function nonUnit(next: () => number, minimum: number, maximum: number) {
  let value = 0;
  while (Math.abs(value) < 2) value = integer(next, minimum, maximum);
  return value;
}

function gcd(left: number, right: number): number {
  return right === 0 ? Math.abs(left) : gcd(right, left % right);
}

function fraction(numerator: number, denominator: number) {
  const divisor = gcd(numerator, denominator);
  const top = numerator / divisor;
  const bottom = denominator / divisor;
  if (bottom === 1) return `${top}`;
  return `\\dfrac{${top}}{${bottom}}`;
}

function signed(value: number) {
  if (value === 0) return "";
  return value > 0 ? `+${value}` : `${value}`;
}

function coefficient(value: number, symbol: string) {
  if (value === 0) return "";
  if (value === 1) return symbol;
  if (value === -1) return `-${symbol}`;
  return `${value}${symbol}`;
}

function linear(a: number, b = 0, variable = "x") {
  const first = coefficient(a, variable);
  if (!first) return `${b}`;
  return `${first}${signed(b)}`;
}

function polynomial2(a: number, b: number, c: number) {
  const parts: string[] = [];
  if (a !== 0) parts.push(coefficient(a, "x^2"));
  if (b !== 0) {
    const term = coefficient(Math.abs(b), "x");
    parts.push(parts.length === 0 ? coefficient(b, "x") : b > 0 ? `+${term}` : `-${term}`);
  }
  if (c !== 0) parts.push(parts.length === 0 ? `${c}` : signed(c));
  return parts.join("") || "0";
}

function monomial(coef: number, xPower: number, yPower = 0) {
  const symbols = `${xPower === 0 ? "" : xPower === 1 ? "x" : `x^{${xPower}}`}${yPower === 0 ? "" : yPower === 1 ? "y" : `y^{${yPower}}`}`;
  return symbols ? coefficient(coef, symbols) : `${coef}`;
}

function uniqueDistractors(answer: string, candidates: string[]) {
  const assignment = /^([a-z])=(-?\d+)$/.exec(answer);
  const realisticFallbacks = assignment
    ? [1, 2, 3, 4].map(offset => `${assignment[1]}=${Number(assignment[2]) + offset}`)
    : /^-?\d+$/.test(answer) ? [1, 2, 3, 4].map(offset => String(Number(answer) + offset)) : [
    `-(${answer})`,
    `2(${answer})`,
    `\\dfrac{1}{2}(${answer})`,
  ];
  const unique = [
    ...new Set([...candidates, ...realisticFallbacks].filter((candidate) => candidate !== answer)),
  ];
  if (unique.length < 3) {
    throw new Error(`중등 핵심 연산의 실제 오답이 세 개보다 적습니다: ${answer}`);
  }
  return unique.slice(0, 3);
}

function difficultyForIndex(index: number): MiddleCoreDifficulty {
  if (index < 2) return "basic";
  if (index < 5) return "application";
  return "advanced";
}

function questionFor(kind: MiddleCoreKind, structure: string) {
  if (kind === "prime-factorization") {
    if (structure === "make-perfect-square-product" || structure === "make-perfect-square-quotient") {
      return "가장 작은 자연수 n은?";
    }
    if (structure === "divisor-count-exponent") return "a의 값은?";
    return "소인수분해한 결과는?";
  }
  if (kind === "gcd-lcm") {
    if (structure === "factored-two-both" || structure === "two-both") {
      return "최대공약수와 최소공배수는?";
    }
    if (structure === "factored-three-gcd" || structure === "three-gcd") {
      return "최대공약수는?";
    }
    if (structure === "three-lcm") return "최소공배수는?";
    if (structure === "missing-exponents") return "a+b의 값은?";
    return "다른 한 수는?";
  }
  if (kind === "radical-calculation") {
    if (structure === "perfect-square-root") return "제곱근의 값은?";
    if (structure === "square-under-root") return "근호를 없애 간단히 하면?";
    if (structure === "simplify-radical") {
      return "근호 안의 수가 가장 작은 자연수가 되도록 간단히 하면?";
    }
    if (structure === "simplify-then-combine") return "각 근호를 간단히 한 뒤 정리한 식은?";
    if (structure === "like-radicals-combined") return "동류 제곱근을 정리한 식은?";
    if (structure === "radical-parentheses") return "괄호를 풀어 정리한 식은?";
    if (structure === "rationalize-denominator") return "분모를 유리화한 식은?";
    return "계산한 값은?";
  }
  if (kind === "linear-inequality-application") return "최대로 살 수 있는 개수는?";
  if (kind === "simultaneous-application") {
    const questions: Record<string, string> = {
      "sum-difference": "두 자연수는?",
      "ticket-count": "학생과 어른은 각각 몇 명인가?",
      "animal-count": "닭과 토끼는 각각 몇 마리인가?",
      "coin-count": "100원짜리와 500원짜리는 각각 몇 개인가?",
      "rectangle-dimensions": "직사각형의 가로와 세로는?",
      "two-digit-number": "처음 두 자리 자연수는?",
      "age-relation": "아이와 어른의 현재 나이는?",
      "opposite-directions": "두 사람의 속력은?",
    };
    return questions[structure] ?? "구하는 값은?";
  }
  if (kind === "simultaneous-special") return "해의 개수는?";
  const questions: Record<MiddleCoreKind, string> = {
    "prime-factorization": "소인수분해한 결과는?",
    "gcd-lcm": "최대공약수 또는 최소공배수는?",
    "linear-equation": "x의 값은?",
    "linear-equation-application": "x의 값은?",
    "repeating-decimal": "기약분수는?",
    "exponent-laws": "계산한 식은?",
    "monomial-multiply": "계산한 식은?",
    "monomial-divide": "계산한 식은?",
    "monomial-comprehensive": "계산한 식은?",
    "polynomial-add-subtract": "계산한 식은?",
    "linear-inequality": "부등식의 해는?",
    "linear-inequality-application": "최대로 살 수 있는 개수는?",
    "simultaneous-substitution": "(x, y)는?",
    "simultaneous-elimination": "(x, y)는?",
    "simultaneous-application": "(x, y)는?",
    "simultaneous-special": "해의 개수는?",
    "linear-system-comprehensive": "구하는 해는?",
    "square-roots-real": "계산한 값은?",
    "radical-calculation": "계산한 값은?",
    "polynomial-multiply": "전개한 식은?",
    "polynomial-divide": "계산한 식은?",
    "formula-square": "전개한 식은?",
    "formula-sum-difference": "전개한 식은?",
    "formula-comprehensive": "전개한 식은?",
  };
  return questions[kind];
}

function make(
  id: string,
  kind: MiddleCoreKind,
  latex: string,
  answerLatex: string,
  solutionHint: string,
  distractors: string[],
  structure: string = kind,
  label = MIDDLE_CORE_TITLES[kind],
): MiddleCoreProblem {
  return {
    id,
    kind,
    difficulty: "basic",
    structure,
    label,
    question: questionFor(kind, structure),
    latex,
    answerLatex,
    solutionHint,
    distractors: uniqueDistractors(answerLatex, distractors),
  };
}

function primePowers(primes: number[], exponents: number[]) {
  return primes.map((prime, index) => exponents[index] === 1 ? String(prime) : `${prime}^{${exponents[index]}}`).join("\\times");
}

function buildPrimeFactorization(id: string, index: number, next: () => number): MiddleCoreProblem {
  const structures = ["factor-three-primes", "factor-repeated-primes", "factor-large", "factor-four-primes", "factor-four-digit", "make-perfect-square-product", "make-perfect-square-quotient", "divisor-count-exponent"];
  const labels = ["세 소인수로 분해", "거듭제곱으로 나타내기", "세 자리 수의 소인수분해", "네 소인수로 분해", "네 자리 수의 소인수분해", "완전제곱수 만들기", "완전제곱수 만들기", "약수의 개수와 지수"];
  if (index === 7) {
    const a = integer(next, 1, 6), b = integer(next, 1, 4), prime = [3, 5, 7][integer(next, 0, 2)];
    return make(id, "prime-factorization", `N=2^a\\times${prime}^{${b}}\\text{의 약수의 개수가 }${(a+1)*(b+1)}\\text{일 때}`, String(a), "약수의 개수는 각 소인수의 지수에 1을 더한 값들의 곱이다.", [String(a+1), String(a+2), String(a+3)], structures[index], labels[index]);
  }
  const primes = index < 3 || index > 4 ? [2, 3, [5, 7, 11][integer(next, 0, 2)]] : [2, 3, 5, [7, 11, 13][integer(next, 0, 2)]];
  const exponents = primes.map((_, i) => i < 2 ? integer(next, index === 4 ? 2 : 1, 3) : 1);
  if (index < 5) exponents[0] = 2;
  if (index === 2) { primes[2] = [5, 7][integer(next, 0, 1)]; exponents[1] = integer(next, 2, 3); }
  const value = primes.reduce((product, prime, i) => product * prime ** exponents[i], 1);
  if (index === 5 || index === 6) {
    const answer = primes.reduce((product, prime, i) => product * (exponents[i] % 2 ? prime : 1), 1);
    const expression = index === 5 ? `${value}n` : `\\dfrac{${value}}{n}`;
    return make(id, "prime-factorization", expression + "\\text{이 어떤 자연수의 제곱일 때}", String(answer), "소인수분해하여 지수가 홀수인 소인수를 한 번씩 곱한다.", [String(answer*2), String(answer*3), String(answer+1)], structures[index], labels[index]);
  }
  const answer = primePowers(primes, exponents);
  const distractors = [0,1,2].map(i => primePowers(primes, exponents.map((power,j) => j===i ? power+1 : power)));
  return make(id,"prime-factorization",String(value),answer,"작은 소수부터 나누고 같은 소인수를 거듭제곱으로 묶는다.",distractors,structures[index],labels[index]);
}

function buildGcdLcm(id: string, index: number, next: () => number): MiddleCoreProblem {
  const structures = ["factored-two-both", "factored-three-gcd", "two-both", "three-gcd", "three-lcm", "product-relation", "missing-exponents", "gcd-lcm-condition"];
  const labels = ["두 수의 지수 비교", "세 수의 지수 비교", "두 수를 직접 소인수분해", "세 수를 직접 소인수분해", "세 수를 직접 소인수분해", "한 수 역산", "지수 역산", "조건에 맞는 수"];
  const p = integer(next,1,3), q = integer(next,1,3), common = 2**p * 3**q;
  const u = [5,7,11][integer(next,0,2)], v = [13,17,19][integer(next,0,2)];
  const a = common*u, b = common*v, c = common*2, lcm = common*u*v;
  let latex: string, answer: string;
  if (index === 0 || index === 2) {
    latex = index === 0 ? `${primePowers([2,3,u],[p,q,1])},\\quad${primePowers([2,3,v],[p,q,1])}` : `${a},\\quad${b}`;
    answer = `\\text{최대공약수 }${common},\\quad\\text{최소공배수 }${lcm}`;
  } else if (index === 1 || index === 3 || index === 4) {
    latex = index === 1 ? `${primePowers([2,3,u],[p,q,1])},\\quad${primePowers([2,3,v],[p,q,1])},\\quad${primePowers([2,3],[p+1,q])}` : `${a},\\quad${b},\\quad${c}`;
    answer = String(index === 4 ? lcm*2 : common);
  } else if (index === 6) {
    const highP=p+integer(next,1,2), highQ=q+integer(next,1,2);
    latex = `\\begin{gathered}A=2^a\\times3^{${q}},\\quad B=2^{${p}}\\times3^b\\\\\\text{최대공약수는 }${common},\\ \\text{최소공배수는 }${2**highP*3**highQ}\\text{이다.}\\end{gathered}`;
    answer=String(highP+highQ);
  } else {
    latex = `\\begin{gathered}\\text{두 자연수 중 한 수는 }${a},\\\\\\text{최대공약수는 }${common},\\ \\text{최소공배수는 }${lcm}\\text{이다.}\\end{gathered}`;
    answer=String(b);
  }
  const numeric=Number(answer);
  const distractors=Number.isFinite(numeric) ? [String(numeric+1),String(numeric*2),String(numeric+3)] : [
    `\\text{최대공약수 }${common*2},\\quad\\text{최소공배수 }${lcm}`,
    `\\text{최대공약수 }${common},\\quad\\text{최소공배수 }${lcm*2}`,
    `\\text{최대공약수 }${common*3},\\quad\\text{최소공배수 }${lcm*3}`,
  ];
  const hint=index<5 ? "소인수분해한 뒤 최대공약수에는 작은 지수, 최소공배수에는 큰 지수를 택한다." : index===6 ? "소인수별로 지수의 최솟값과 최댓값을 비교한다." : "두 자연수의 곱은 최대공약수와 최소공배수의 곱과 같다.";
  return make(id,"gcd-lcm",latex,answer,hint,distractors,structures[index],labels[index]);
}

function buildPolynomialAddSubtract(id: string, index: number, next: () => number): MiddleCoreProblem {
  const a=nonzero(next,-6,6), b=nonzero(next,-7,7), c=nonzero(next,-8,8), d=nonzero(next,-5,5), e=nonzero(next,-6,6), f=nonzero(next,-7,7);
  const P=polynomial2(a,b,c), Q=polynomial2(d,e,f);
  const structures=["two-add","two-subtract","scalar-two-polynomials","three-polynomials","two-variables","fraction-coefficients","nested-parentheses","missing-polynomial"];
  const labels=["두 다항식의 덧셈","괄호 앞의 음수","계수가 있는 두 다항식","세 다항식의 계산","두 문자 다항식","분수 계수의 계산","이중 괄호 계산","다항식 역산"];
  let latex: string, answer: string;
  if (index===0 || index===1) {
    const sign=index===0 ? 1 : -1;
    latex=`(${P})${sign===1?"+":"-"}(${Q})`; answer=polynomial2(a+sign*d,b+sign*e,c+sign*f);
  } else if (index===2) {
    latex=`2(${P})-3(${Q})`; answer=polynomial2(2*a-3*d,2*b-3*e,2*c-3*f);
  } else if (index===3) {
    latex=`(${P})-(${Q})+(${polynomial2(1,2,3)})`; answer=polynomial2(a-d+1,b-e+2,c-f+3);
  } else if (index===4) {
    const two=(x: number,xy: number,y: number) => [[x,"x^2"],[xy,"xy"],[y,"y^2"]].filter(([value]) => value !== 0).map(([value,symbol],i) => (i > 0 && Number(value) > 0 ? "+" : "") + coefficient(Number(value),String(symbol))).join("") || "0";
    latex=`(${two(a,b,c)})-2(${two(d,e,f)})`; answer=two(a-2*d,b-2*e,c-2*f);
  } else if (index===5) {
    latex=`\\frac{${P}}{2}+\\frac{${Q}}{2}`; answer=`\\frac{${polynomial2(a+d,b+e,c+f)}}{2}`;
  } else if (index===6) {
    latex=`3\\{2(${P})-(${Q})\\}`; answer=polynomial2(6*a-3*d,6*b-3*e,6*c-3*f);
  } else {
    latex=`A+(${P})=${Q}`; answer=`A=${polynomial2(d-a,e-b,f-c)}`;
  }
  const wrong=index===7 ? [`A=${polynomial2(d+a,e+b,f+c)}`,`A=${polynomial2(d-a+1,e-b,f-c)}`,`A=${polynomial2(d-a,e-b+1,f-c)}`] : [`(${answer})+1`,`(${answer})-1`,`(${answer})+2`];
  return make(id,"polynomial-add-subtract",latex,answer,"괄호를 풀고 같은 문자와 차수의 항끼리 계수를 계산한다.",wrong,structures[index],labels[index]);
}

function build(
  kind: Exclude<MiddleCoreKind, "formula-comprehensive">,
  next: () => number,
  id: string,
  index: number,
): MiddleCoreProblem {
  if (kind === "prime-factorization") return buildPrimeFactorization(id, index, next);
  if (kind === "gcd-lcm") return buildGcdLcm(id, index, next);
  if (kind === "polynomial-add-subtract") return buildPolynomialAddSubtract(id, index, next);

  if (kind === "linear-equation") {
    const solution = nonzero(next, -8, 8);
    const mode = index % 3;
    const a = nonzero(next, 2, 8);
    let c = nonzero(next, -6, 6);
    while (c === a) c = nonzero(next, -6, 6);
    const b = integer(next, -9, 9);
    if (mode === 0) {
      const d = (a - c) * solution + b;
      return make(id, kind, `${linear(a, b)}=${linear(c, d)}`, `x=${solution}`,
        "x항은 한쪽으로, 상수항은 반대쪽으로 이항한 뒤 x의 계수로 나눈다.",
        [`x=${-solution}`, `x=${solution + 1}`, `x=${solution - 1}`], "both-sides");
    }
    const shift = integer(next, -5, 5);
    const right = a * (solution + shift);
    if (mode === 1) {
      return make(id, kind, `${a}(x${signed(shift)})=${right}`, `x=${solution}`,
        "양변을 괄호 앞의 수로 나눈 뒤 괄호 안의 상수를 이항한다.",
        [`x=${-solution}`, `x=${solution + shift}`, `x=${right - shift}`], "parentheses");
    }
    const denominator = 2 + (index % 4);
    const numeratorRight = solution + shift;
    return make(id, kind, `\\dfrac{x${signed(shift)}}{${denominator}}=${fraction(numeratorRight, denominator)}`, `x=${solution}`,
      "양변에 분모를 곱해 없앤 뒤 상수항을 이항한다.",
      [`x=${-solution}`, `x=${solution + shift}`, `x=${solution + denominator}`], "fraction-equation");
  }

  if (kind === "linear-equation-application") {
    const solution = 4 + index + integer(next, 0, 3);
    const mode = index % 4;
    if (mode === 0) {
      return make(id, kind, `\\text{연속한 두 정수의 합이 }${solution * 2 + 1},\\quad \\text{작은 수 }x`, `x=${solution}`,
        `x+(x+1)=${solution * 2 + 1}을 세워 푼다.`,
        [`x=${solution + 1}`, `x=${solution - 1}`, `x=${solution * 2}`], "consecutive");
    }
    if (mode === 1) {
      const multiple = 2 + (index % 3);
      return make(id, kind, `\\text{어떤 수와 그 수의 }${multiple}\\text{배의 합이 }${solution * (multiple + 1)},\\quad x`, `x=${solution}`,
        `x+${multiple}x=${solution * (multiple + 1)}을 세워 x를 구한다.`,
        [`x=${solution * multiple}`, `x=${solution + multiple}`, `x=${solution - 1}`], "multiple-sum");
    }
    if (mode === 2) {
      const gap = 3 + (index % 5);
      const perimeter = 2 * (solution + solution + gap);
      return make(id, kind, `\\text{가로 }x,\\ \\text{세로 }x+${gap}\\text{인 직사각형의 둘레가 }${perimeter}`, `x=${solution}`,
        `2\\{x+(x+${gap})\\}=${perimeter}을 세워 푼다.`,
        [`x=${solution + gap}`, `x=${solution * 2}`, `x=${solution - gap}`], "rectangle");
    }
    const gap = 5 + (index % 4);
    return make(id, kind, `\\text{두 수의 차가 }${gap}\\text{이고 합이 }${solution * 2 + gap},\\quad \\text{작은 수 }x`, `x=${solution}`,
      `x+(x+${gap})=${solution * 2 + gap}을 세워 푼다.`,
      [`x=${solution + gap}`, `x=${solution - gap}`, `x=${solution * 2}`], "sum-difference");
  }

  if (kind === "repeating-decimal") {
    const mode = index % 4;
    if (mode === 0) {
      const digit = 1 + ((index + integer(next, 0, 3)) % 8);
      const answer = fraction(digit, 9);
      return make(id, kind, `0.\\overline{${digit}}`, answer,
        `x=0.\\overline{${digit}}로 놓고 10x-x=${digit}을 이용한다.`,
        [fraction(digit, 10), fraction(digit, 99), `${digit}`], "one-digit");
    }
    if (mode === 1) {
      const value = 12 + index * 7 + integer(next, 0, 5);
      const answer = fraction(value, 99);
      return make(id, kind, `0.\\overline{${value}}`, answer,
        `x=0.\\overline{${value}}로 놓고 100x-x=${value}을 이용한다.`,
        [fraction(value, 100), fraction(value, 9), fraction(value, 90)], "two-digit");
    }
    if (mode === 2) {
      const first = integer(next, 1, 8);
      const repeat = integer(next, 1, 8);
      const numerator = first * 9 + repeat;
      const answer = fraction(numerator, 90);
      return make(id, kind, `0.${first}\\overline{${repeat}}`, answer,
        `100x-10x=${first * 10 + repeat}-${first}를 이용해 분수로 고친다.`,
        [fraction(first * 10 + repeat, 99), fraction(numerator, 99), fraction(first * 10 + repeat, 90)], "mixed-repeat");
    }
    const value = integer(next, 101, 998);
    const answer = fraction(value, 999);
    return make(id, kind, `0.\\overline{${value}}`, answer,
      `1000x-x=${value}을 이용해 x를 분수로 나타내고 약분한다.`,
      [fraction(value, 1000), fraction(value, 99), fraction(value, 900)], "three-digit");
  }

  if (kind === "exponent-laws") {
    const m = integer(next, 2, 8);
    const n = integer(next, 2, 7);
    const mode = index % 5;
    if (mode === 0) {
      return make(id, kind, `x^{${m}}\\times x^{${n}}`, `x^{${m + n}}`,
        "밑이 같으므로 지수를 더한다.",
        [`x^{${m * n}}`, `x^{${Math.abs(m - n)}}`, `2x^{${m + n}}`], "multiply");
    }
    if (mode === 1) {
      return make(id, kind, `x^{${m + n}}\\div x^{${n}}`, `x^{${m}}`,
        "밑이 같으므로 나누기에서는 지수를 뺀다.",
        [`x^{${m + 2 * n}}`, `x^{${n}}`, `x^{${m * n}}`], "divide");
    }
    if (mode === 2) {
      return make(id, kind, `\\left(x^{${m}}\\right)^{${n}}`, `x^{${m * n}}`,
        "거듭제곱의 거듭제곱은 지수를 곱한다.",
        [`x^{${m + n}}`, `x^{${m ** 2}}`, `${n}x^{${m}}`], "power");
    }
    if (mode === 3) {
      return make(id, kind, `\\left(x^{${m}}y^{${n}}\\right)^2`, `x^{${m * 2}}y^{${n * 2}}`,
        "괄호 안의 각 문자의 지수에 바깥 지수 2를 곱한다.",
        [`x^{${m + 2}}y^{${n + 2}}`, `x^{${m * 2}}y^{${n}}`, `2x^{${m}}y^{${n}}`], "two-variables-power");
    }
    return make(id, kind, `x^{${m}}y^{${n}}\\times x^2y^3`, `x^{${m + 2}}y^{${n + 3}}`,
      "같은 문자끼리 지수를 각각 더한다.",
      [`x^{${m * 2}}y^{${n * 3}}`, `x^{${m + 3}}y^{${n + 2}}`, `x^{${m}}y^{${n + 5}}`], "two-variables-multiply");
  }

  if (kind === "monomial-multiply") {
    const a = nonzero(next, -7, 7);
    const b = nonzero(next, 2, 7);
    const m = 1 + (index % 4);
    const n = 1 + ((index + 1) % 3);
    const p = 1 + ((index + 2) % 4);
    const q = index % 3;
    const answer = monomial(a * b, m + p, n + q);
    return make(id, kind, `(${monomial(a, m, n)})(${monomial(b, p, q)})`, answer,
      "계수끼리 곱하고 같은 문자의 지수끼리 더한다.",
      [monomial(a + b, m + p, n + q), monomial(a * b, m * p, n + q), monomial(a * b, m + p, n * Math.max(1, q))],
      q === 0 ? "one-variable-second" : "two-variables");
  }

  if (kind === "monomial-divide") {
    const divisorCoef = nonzero(next, 2, 6);
    const quotientCoef = nonzero(next, -6, 6);
    const divisorX = 1 + (index % 3);
    const divisorY = index % 2;
    const quotientX = 1 + ((index + 1) % 4);
    const quotientY = 1 + ((index + 2) % 3);
    const dividend = monomial(divisorCoef * quotientCoef, divisorX + quotientX, divisorY + quotientY);
    const divisor = monomial(divisorCoef, divisorX, divisorY);
    const answer = monomial(quotientCoef, quotientX, quotientY);
    return make(id, kind, `${dividend}\\div(${divisor})`, answer,
      "계수끼리 나누고 같은 문자의 지수끼리 뺀다.",
      [monomial(divisorCoef * quotientCoef, quotientX, quotientY), monomial(quotientCoef, divisorX + quotientX, divisorY + quotientY), monomial(-quotientCoef, quotientX, quotientY)],
      divisorY === 0 ? "single-divisor-variable" : "two-divisor-variables");
  }

  if (kind === "linear-inequality") {
    const boundary = nonzero(next, -7, 7);
    const a = index % 2 === 0 ? 2 + (index % 5) : -(2 + (index % 5));
    const b = integer(next, -9, 9);
    const right = a * boundary + b;
    const inclusive = index % 4 >= 2;
    const sign = inclusive ? "\\le" : "<";
    const answerSign = a > 0 ? sign : inclusive ? "\\ge" : ">";
    return make(id, kind, `${linear(a, b)}${sign}${right}`, `x${answerSign}${boundary}`,
      a > 0 ? "상수항을 이항한 뒤 양수인 x의 계수로 나눈다." : "음수인 x의 계수로 나눌 때 부등호 방향을 바꾼다.",
      [`x${sign}${boundary}`, `x${a > 0 ? ">" : "<"}${boundary}`, `x${answerSign}${-boundary}`],
      `${a > 0 ? "positive" : "negative"}-${inclusive ? "inclusive" : "strict"}`);
  }

  if (kind === "simultaneous-substitution") {
    const x = nonzero(next, -6, 6);
    const y = nonzero(next, -7, 7);
    const p = nonzero(next, -4, 4);
    const a = nonzero(next, 2, 6);
    const b = nonzero(next, -5, 5);
    if (index % 2 === 0) {
      const q = y - p * x;
      const total = a * x + b * y;
      return make(id, kind,
        `\\begin{cases}y=${linear(p, q)}\\\\${linear(a, 0)}${b > 0 ? "+" : ""}${coefficient(b, "y")}=${total}\\end{cases}`,
        `(x,y)=(${x},${y})`,
        "첫째 식의 y를 둘째 식에 대입해 x를 구한 뒤 y를 계산한다.",
        [`(x,y)=(${y},${x})`, `(x,y)=(${-x},${y})`, `(x,y)=(${x},${-y})`], "substitute-y");
    }
    const q = x - p * y;
    const total = a * x + b * y;
    return make(id, kind,
      `\\begin{cases}x=${linear(p, q, "y")}\\\\${linear(a, 0)}${b > 0 ? "+" : ""}${coefficient(b, "y")}=${total}\\end{cases}`,
      `(x,y)=(${x},${y})`,
      "첫째 식의 x를 둘째 식에 대입해 y를 구한 뒤 x를 계산한다.",
      [`(x,y)=(${y},${x})`, `(x,y)=(${-x},${y})`, `(x,y)=(${x},${-y})`], "substitute-x");
  }

  if (kind === "simultaneous-elimination") {
    const x = nonzero(next, -6, 6);
    const y = nonzero(next, -7, 7);
    const a = 2 + (index % 4);
    const b = 1 + ((index + 1) % 5);
    const c = 1 + ((index + 2) % 4);
    if (index % 2 === 0) {
      const first = a * x + b * y;
      const second = a * x - c * y;
      return make(id, kind,
        `\\begin{cases}${coefficient(a, "x")}+${coefficient(b, "y")}=${first}\\\\${coefficient(a, "x")}-${coefficient(c, "y")}=${second}\\end{cases}`,
        `(x,y)=(${x},${y})`,
        "두 식을 빼서 x항을 없애고 y를 구한 뒤 한 식에 대입한다.",
        [`(x,y)=(${y},${x})`, `(x,y)=(${-x},${y})`, `(x,y)=(${x},${-y})`], "eliminate-x");
    }
    const first = a * x + b * y;
    const second = -c * x + b * y;
    return make(id, kind,
      `\\begin{cases}${coefficient(a, "x")}+${coefficient(b, "y")}=${first}\\\\${coefficient(-c, "x")}+${coefficient(b, "y")}=${second}\\end{cases}`,
      `(x,y)=(${x},${y})`,
      "두 식을 빼서 y항을 없애고 x를 구한 뒤 한 식에 대입한다.",
      [`(x,y)=(${y},${x})`, `(x,y)=(${-x},${y})`, `(x,y)=(${x},${-y})`], "eliminate-y");
  }

  if (kind === "linear-inequality-application") {
    const unitPrice = 200 + 100 * (index % 5);
    const maximum = 4 + integer(next, 2, 8);
    const budget = unitPrice * maximum + integer(next, 1, unitPrice - 1);
    return make(id, kind,
      `\\text{한 개에 }${unitPrice}\\text{원인 물건을 }x\\text{개 살 때, }${budget}\\text{원 이하로 쓰려고 한다.}`,
      `${maximum}\\text{개}`,
      `${unitPrice}x\\le ${budget}을 풀고 자연수 x의 최댓값을 고른다.`,
      [
        `${maximum - 1}\\text{개}`,
        `${maximum + 1}\\text{개}`,
        `${Math.floor(budget / 100)}\\text{개}`,
      ],
      "budget-maximum");
  }

  if (kind === "simultaneous-application") {
    const variant = index % 8;
    if (variant === 0) {
      const larger = integer(next, 7, 15);
      const smaller = integer(next, 2, larger - 2);
      return make(id, kind,
        `\\text{두 자연수의 합은 }${larger + smaller}\\text{이고 차는 }${larger - smaller}\\text{이다.}`,
        `(${larger},${smaller})`,
        "큰 수를 x, 작은 수를 y로 놓고 합과 차에 대한 연립방정식을 푼다.",
        [`(${smaller},${larger})`, `(${larger + 1},${smaller - 1})`, `(${larger + smaller},${larger - smaller})`],
        "sum-difference");
    }
    if (variant === 1) {
      const students = integer(next, 7, 15);
      const adults = integer(next, 2, 8);
      const people = students + adults;
      const revenue = 3000 * students + 5000 * adults;
      return make(id, kind,
        `\\text{학생과 어른이 모두 }${people}\\text{명이고 입장료 합계는 }${revenue}\\text{원이다.}\\quad \\text{학생 }3000\\text{원, 어른 }5000\\text{원}`,
        `(${students},${adults})`,
        "학생 수와 어른 수를 미지수로 놓고 인원수와 입장료 합계에 대한 두 식을 세운다.",
        [`(${adults},${students})`, `(${students + 1},${adults - 1})`, `(${people},${adults})`],
        "ticket-count");
    }
    if (variant === 2) {
      const chickens = integer(next, 5, 13);
      const rabbits = integer(next, 2, 8);
      const total = chickens + rabbits;
      const legs = 2 * chickens + 4 * rabbits;
      return make(id, kind,
        `\\text{닭과 토끼가 모두 }${total}\\text{마리이고 다리 수의 합은 }${legs}\\text{개이다.}`,
        `(${chickens},${rabbits})`,
        "닭과 토끼의 수를 미지수로 놓고 마릿수와 다리 수에 대한 두 식을 세운다.",
        [`(${rabbits},${chickens})`, `(${chickens + 2},${rabbits - 1})`, `(${total},${rabbits})`],
        "animal-count");
    }
    if (variant === 3) {
      const hundreds = integer(next, 4, 12);
      const fiveHundreds = integer(next, 2, 9);
      const count = hundreds + fiveHundreds;
      const value = 100 * hundreds + 500 * fiveHundreds;
      return make(id, kind,
        `100\\text{원짜리와 }500\\text{원짜리 동전이 모두 }${count}\\text{개이고 금액은 }${value}\\text{원이다.}`,
        `(${hundreds},${fiveHundreds})`,
        "두 동전의 개수와 전체 금액에 대한 연립방정식을 세운다.",
        [`(${fiveHundreds},${hundreds})`, `(${hundreds + 1},${fiveHundreds - 1})`, `(${count},${fiveHundreds})`],
        "coin-count");
    }
    if (variant === 4) {
      const width = integer(next, 4, 10);
      const gap = integer(next, 2, 6);
      const length = width + gap;
      const perimeter = 2 * (length + width);
      return make(id, kind,
        `\\text{가로가 세로보다 }${gap}\\text{만큼 길고 둘레가 }${perimeter}\\text{인 직사각형}`,
        `(${length},${width})`,
        "가로와 세로의 차, 둘레에 대한 두 식을 세운다.",
        [`(${width},${length})`, `(${length + 1},${width - 1})`, `(${perimeter / 2},${gap})`],
        "rectangle-dimensions");
    }
    if (variant === 5) {
      const tens = integer(next, 4, 9);
      const ones = integer(next, 1, tens - 1);
      const digitSum = tens + ones;
      const difference = 9 * (tens - ones);
      const number = 10 * tens + ones;
      return make(id, kind,
        `\\text{십의 자리와 일의 자리의 합이 }${digitSum}\\text{이고, 자리 수를 바꾼 수보다 }${difference}\\text{만큼 큰 두 자리 자연수}`,
        `${number}`,
        "십의 자리와 일의 자리를 미지수로 놓고 자리값을 이용해 두 식을 세운다.",
        [`${10 * ones + tens}`, `${number + 9}`, `${number - 9}`],
        "two-digit-number");
    }
    if (variant === 6) {
      const child = integer(next, 8, 15);
      const years = integer(next, 3, 8);
      const adult = 2 * child + years;
      return make(id, kind,
        `\\text{아이와 어른의 현재 나이의 합은 }${child + adult}\\text{살이고, }${years}\\text{년 뒤 어른의 나이는 아이의 나이의 2배이다.}`,
        `(${child},${adult})`,
        "현재 나이를 미지수로 놓고 나이의 합과 몇 년 뒤의 관계를 식으로 세운다.",
        [`(${adult},${child})`, `(${child + years},${adult + years})`, `(${child + 1},${adult - 1})`],
        "age-relation");
    }
    const slower = integer(next, 3, 7);
    const speedGap = integer(next, 2, 5);
    const faster = slower + speedGap;
    const hours = integer(next, 2, 4);
    const distance = (slower + faster) * hours;
    return make(id, kind,
      `\\text{두 사람이 같은 곳에서 반대 방향으로 }${hours}\\text{시간 이동한 뒤 }${distance}\\text{km 떨어졌다. 한 사람은 다른 사람보다 시속 }${speedGap}\\text{km 빠르다.}`,
      `(${slower},${faster})`,
      "두 속력의 합과 차에 대한 연립방정식을 세운다.",
      [`(${faster},${slower})`, `(${slower + 1},${faster - 1})`, `(${distance / hours},${speedGap})`],
      "opposite-directions");
  }
  if (kind === "simultaneous-special") {
    const a = 2 + (index % 3);
    const b = 1 + ((index + 1) % 4);
    const c = integer(next, 3, 9);
    const multiple = 2 + (index % 2);
    if (index % 2 === 0) {
      return make(id, kind,
        `\\begin{cases}${a}x+${b}y=${c}\\\\${a * multiple}x+${b * multiple}y=${c * multiple + 1}\\end{cases}`,
        "\\text{해가 없다}",
        "x, y의 계수 비는 같지만 상수항의 비가 달라 두 직선은 평행하다.",
        ["\\text{해가 1개}", "\\text{해가 2개}", "\\text{해가 무수히 많다}"],
        "no-solution");
    }
    return make(id, kind,
      `\\begin{cases}${a}x+${b}y=${c}\\\\${a * multiple}x+${b * multiple}y=${c * multiple}\\end{cases}`,
      "\\text{해가 무수히 많다}",
      "둘째 식이 첫째 식의 배수이므로 두 식은 같은 직선을 나타낸다.",
      ["\\text{해가 없다}", "\\text{해가 1개}", "\\text{해가 2개}"],
      "infinitely-many");
  }

  if (kind === "square-roots-real") {
    const mode = index % 4;
    const root = integer(next, 2, 10);
    const squareFree = SQUARE_FREE[integer(next, 0, SQUARE_FREE.length - 1)];
    if (mode === 0) {
      return make(id, kind, `\\sqrt{${root * root * squareFree}}`, `${root}\\sqrt{${squareFree}}`,
        `근호 안의 제곱인수 ${root * root}을 밖으로 꺼낸다.`,
        [`${root * squareFree}`, `\\sqrt{${root * squareFree}}`, `${squareFree}\\sqrt{${root}}`], "simplify-radical");
    }
    if (mode === 1) {
      return make(id, kind, `\\sqrt{${root * root}}`, `${root}`,
        `양수 ${root}의 제곱이 ${root * root}이므로 주어진 제곱근의 값은 ${root}이다.`,
        [`${-root}`, `\\pm${root}`, `${root * root}`], "perfect-square-root");
    }
    if (mode === 2) {
      const left = squareFree;
      const right = squareFree * 4;
      return make(id, kind, `\\sqrt{${left}}\\times\\sqrt{${right}}`, `${left * 2}`,
        `한 근호로 합쳐 \\sqrt{${left * right}}을 계산한다.`,
        [`${left * 4}`, `${left}\\sqrt{2}`, `\\sqrt{${left + right}}`], "radical-product");
    }
    return make(id, kind, `\\sqrt{(${root})^2}`, `${root}`,
      "제곱한 양수의 제곱근은 원래 양수와 같다.",
      [`${-root}`, `\\pm${root}`, `${root * root}`], "square-under-root");
  }

  if (kind === "radical-calculation") {
    const mode = index % 8;
    const n = SQUARE_FREE[integer(next, 0, SQUARE_FREE.length - 1)];
    const a = integer(next, 2, 8);
    const b = integer(next, 1, 7);
    if (mode === 0) {
      return make(id, kind, `\\sqrt{${a * a}}`, `${a}`,
        `제곱해서 ${a * a}이 되는 양의 수는 ${a}이다.`,
        [`${-a}`, `\\pm${a}`, `${a * a}`], "perfect-square-root");
    }
    if (mode === 1) {
      return make(id, kind, `\\sqrt{(-${a})^2}`, `${a}`,
        `\\sqrt{x^2}=|x|이므로 \\sqrt{(-${a})^2}=${a}이다.`,
        [`-${a}`, `\\pm${a}`, `${a * a}`], "square-under-root");
    }
    if (mode === 2) {
      return make(id, kind, `\\sqrt{${a * a * n}}`, `${a}\\sqrt{${n}}`,
        `근호 안의 제곱인수 ${a * a}을 근호 밖으로 꺼낸다.`,
        [`${a * n}`, `\\sqrt{${a * n}}`, `${n}\\sqrt{${a}}`], "simplify-radical");
    }
    if (mode === 3) {
      return make(id, kind,
        `${a}\\sqrt{${n}}+${b}\\sqrt{${n}}-\\sqrt{${n}}`,
        `${a + b - 1}\\sqrt{${n}}`,
        "근호 안이 같은 항끼리 근호 앞의 계수를 한 번에 더하고 뺀다.",
        [`${a + b}\\sqrt{${n}}`, `${a * b - 1}\\sqrt{${n}}`, `${a + b - 1}\\sqrt{${2 * n}}`],
        "like-radicals-combined");
    }
    if (mode === 4) {
      const other = SQUARE_FREE[(index + 1) % SQUARE_FREE.length];
      return make(id, kind,
        `2(\\sqrt{${n}}+\\sqrt{${other}})-(\\sqrt{${n}}-2\\sqrt{${other}})`,
        `\\sqrt{${n}}+4\\sqrt{${other}}`,
        "괄호를 풀고 근호 안이 같은 항끼리 각각 정리한다.",
        [`\\sqrt{${n}}`, `3\\sqrt{${n}}`, `\\sqrt{${n}}+2\\sqrt{${other}}`],
        "radical-parentheses");
    }
    if (mode === 5) {
      return make(id, kind, `${a}\\sqrt{${n}}\\times${b}\\sqrt{${2*n}}`, `${a*b*n}\\sqrt{2}`,
        "계수끼리 곱하고 근호 안의 제곱인수를 밖으로 꺼낸다.",
        [`${a*b}\\sqrt{2}`, `${a*b*n+1}\\sqrt{2}`, `${a*b*n}\\sqrt{3}`], "radical-multiply");
    }
    if (mode === 6) {
      return make(id, kind, `\\dfrac{${a*(b+1)}\\sqrt{${3*n}}}{${b+1}\\sqrt{3}}`, `${a}\\sqrt{${n}}`,
        "계수끼리 나누고 근호 안의 수끼리 나눈다.",
        [`${a+1}\\sqrt{${n}}`, `${a}\\sqrt{${3*n}}`, `${a-1}\\sqrt{${n}}`], "radical-divide");
    }
    const numerator = n + 1;
    return make(id, kind, `\\dfrac{${numerator}}{\\sqrt{${n}}}`, `\\dfrac{${numerator}\\sqrt{${n}}}{${n}}`,
      "분자와 분모에 같은 제곱근을 곱해 분모를 유리화한다.",
      [`\\dfrac{${numerator}}{${n}}`, `${numerator}\\sqrt{${n}}`, `\\dfrac{\\sqrt{${n}}}{${numerator}}`], "rationalize-denominator");
  }
  if (kind === "polynomial-multiply") {
    const mode = index % 3;
    const a = nonzero(next, -5, 5);
    const b = nonzero(next, -7, 7);
    const c = nonzero(next, -5, 5);
    const d = nonzero(next, -7, 7);
    if (mode === 0) {
      const answer = polynomial2(a * c, a * d, 0);
      return make(id, kind, `${coefficient(a, "x")}(${linear(c, d)})`, answer,
        "단항식을 괄호 안의 두 항에 각각 분배한다.",
        [polynomial2(a * c, d, 0), polynomial2(a + c, a * d, 0), polynomial2(a * c, a + d, 0)], "monomial-binomial");
    }
    const answer = polynomial2(a * c, a * d + b * c, b * d);
    return make(id, kind, `(${linear(a, b)})(${linear(c, d)})`, answer,
      "두 일차식의 각 항을 모두 곱한 뒤 가운데 항을 합친다.",
      [
        polynomial2(a * c, a * d - b * c, b * d),
        polynomial2(a * c, a * d + b * c, b + d),
        polynomial2(a + c, a * d + b * c, b * d),
      ],
      mode === 1 ? "binomial-binomial" : "signed-binomial");
  }

  if (kind === "polynomial-divide") {
    const divisor = nonzero(next, 2, 6);
    const quotientX = nonzero(next, -6, 6);
    const quotientConstant = nonzero(next, -7, 7);
    const numerator = polynomial2(
      divisor * quotientX,
      divisor * quotientConstant,
      0,
    );
    const answer = linear(quotientX, quotientConstant);
    return make(id, kind,
      `\\dfrac{${numerator}}{${coefficient(divisor, "x")}}`,
      answer,
      "다항식의 각 항을 단항식으로 나누어 계수는 나누고 지수는 뺀다.",
      [
        linear(divisor * quotientX, quotientConstant),
        linear(quotientX, divisor * quotientConstant),
        linear(-quotientX, quotientConstant),
      ],
      "polynomial-by-monomial");
  }

  if (kind === "formula-square") {
    const a = 1 + (index % 4);
    const b = index < 4 ? -integer(next, 2, 7) : integer(next, 2, 7);
    const answer = polynomial2(a * a, 2 * a * b, b * b);
    return make(id, kind, `(${linear(a, b)})^2`, answer,
      "첫째 항의 제곱, 두 항의 곱의 2배, 둘째 항의 제곱 순서로 전개한다.",
      [
        polynomial2(a * a, a * b, b * b),
        polynomial2(a * a, -2 * a * b, b * b),
        polynomial2(a * a, 2 * a * b, -b * b),
      ],
      b > 0 ? "plus-square" : "minus-square");
  }

  const a = integer(next, 1, 7);
  const b = integer(next, 2, 9);
  return make(id, kind, `(${linear(a, b)})(${linear(a, -b)})`, polynomial2(a * a, 0, -b * b),
    "합과 차의 곱은 두 항의 제곱의 차로 계산한다.",
    [
      polynomial2(a * a, 0, b * b),
      polynomial2(a * a, -2 * a * b, b * b),
      polynomial2(a, 0, -b),
    ],
    a === 1 ? "unit-leading" : "nonunit-leading");
}

function actualKind(kind: MiddleCoreKind, index: number): AtomicMiddleCoreKind {
  if (kind === "linear-equation" && index >= 5) {
    return "linear-equation-application";
  }
  if (kind === "linear-inequality" && index >= 6) {
    return "linear-inequality-application";
  }
  if (kind === "monomial-comprehensive") {
    return MONOMIAL_COMPREHENSIVE_PARTS[index % MONOMIAL_COMPREHENSIVE_PARTS.length];
  }
  if (kind === "polynomial-add-subtract") {
    return ALGEBRAIC_EXPRESSION_COMPREHENSIVE_PARTS[index];
  }
  if (kind === "linear-system-comprehensive") {
    return LINEAR_SYSTEM_COMPREHENSIVE_PARTS[index % LINEAR_SYSTEM_COMPREHENSIVE_PARTS.length];
  }
  if (kind === "formula-comprehensive") {
    return FORMULA_COMPREHENSIVE_PARTS[index % FORMULA_COMPREHENSIVE_PARTS.length];
  }
  return kind;
}

export function isMiddleCoreKind(value: string | null): value is MiddleCoreKind {
  return MIDDLE_CORE_KINDS.includes(value as MiddleCoreKind);
}

function canonicalProblemSignature(problem: MiddleCoreProblem) {
  const compact = problem.latex.replace(/\s+/g, "");
  const cases = /\\begin\{cases\}([\s\S]+)\\end\{cases\}/.exec(compact);
  if (!cases) return `${compact}|${problem.answerLatex}`;
  const equations = cases[1]
    .split("\\\\")
    .map((equation) => equation.split("=").sort().join("="))
    .sort()
    .join(";");
  return `${equations}|${problem.answerLatex}`;
}

export function createMiddleCoreProblemSet(kind: MiddleCoreKind, seed: number) {
  const next = random(seed);
  const signatures = new Set<string>();
  const problems = Array.from({ length: 8 }, (_, index) => {
    let problem = build(actualKind(kind, index), next, `middle-core-${kind}-${index}`, index);
    let signature = canonicalProblemSignature(problem);
    for (let attempt = 0; signatures.has(signature) && attempt < 20; attempt += 1) {
      problem = build(actualKind(kind, index), next, `middle-core-${kind}-${index}`, index);
      signature = canonicalProblemSignature(problem);
    }
    if (signatures.has(signature)) {
      throw new Error(`${kind}: 순서만 바뀐 문제를 포함해 같은 문제가 반복됩니다.`);
    }
    signatures.add(signature);
    return { ...problem, difficulty: difficultyForIndex(index) };
  });
  return {
    seed,
    kind,
    problems,
  };
}

export function createFreshMiddleCoreProblemSet(
  kind: MiddleCoreKind,
  seed: number,
  previousProblems: MiddleCoreProblem[],
) {
  const previous = new Set(previousProblems.map(canonicalProblemSignature));
  let candidate = createMiddleCoreProblemSet(kind, seed);
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const overlap = candidate.problems.filter((problem) => previous.has(canonicalProblemSignature(problem))).length;
    if (overlap <= 1) return candidate;
    candidate = createMiddleCoreProblemSet(kind, (seed + (attempt + 1) * 2654435761) >>> 0);
  }
  throw new Error(`${kind}: 직전 문제지와 겹치지 않는 새 문제를 만들지 못했습니다.`);
}

export function createMiddleCoreReviewProblems(wrongKinds: MiddleCoreKind[], seed: number) {
  const uniqueKinds = [...new Set(wrongKinds)].slice(0, 2);
  const next = random(seed);
  return uniqueKinds.map((kind, index) => ({
    ...build(actualKind(kind, 6 + index), next, `middle-core-review-${seed}-${index}`, 6 + index),
    kind,
    difficulty: "advanced" as const,
  }));
}
