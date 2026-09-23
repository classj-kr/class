export type MiddleTrigonometryMethodKind =
  | "single-ratio"
  | "three-ratios"
  | "pythagorean-first"
  | "special-angle"
  | "special-angle-expression"
  | "side-from-sine"
  | "side-from-cosine"
  | "side-from-tangent"
  | "ratio-scale"
  | "radical-side"
  | "fraction-decimal";

export type MiddleTrigonometryKind =
  | "ratios"
  | "special-angles"
  | "side-lengths"
  | "comprehensive";

export type MiddleTrigonometryDifficulty = "basic" | "application" | "advanced";

export type MiddleTrigonometryProblem = {
  id: string;
  kind: MiddleTrigonometryMethodKind;
  difficulty: MiddleTrigonometryDifficulty;
  structure: string;
  label: string;
  question: string;
  latex: string;
  answerLatex: string;
  solutionHint: string;
  distractors: string[];
  visual?: { type: "geometry"; variant: string; labels?: string[] };
};

export const MIDDLE_TRIGONOMETRY_KINDS: MiddleTrigonometryKind[] = [
  "ratios",
  "side-lengths",
];

export const MIDDLE_TRIGONOMETRY_METHOD_KINDS: MiddleTrigonometryMethodKind[] = [
  "single-ratio",
  "three-ratios",
  "pythagorean-first",
  "special-angle",
  "special-angle-expression",
  "side-from-sine",
  "side-from-cosine",
  "side-from-tangent",
  "ratio-scale",
  "radical-side",
  "fraction-decimal",
];

export const MIDDLE_TRIGONOMETRY_TITLES: Record<MiddleTrigonometryKind, string> = {
  ratios: "삼각비의 값과 특수각",
  "special-angles": "삼각비: 특수각 계산",
  "side-lengths": "삼각비: 변의 길이 계산",
  comprehensive: "삼각비 계산 종합",
};

const MIDDLE_TRIGONOMETRY_METHOD_TITLES: Record<MiddleTrigonometryMethodKind, string> = {
  "single-ratio": "세 변에서 한 비 구하기",
  "three-ratios": "세 삼각비 한꺼번에",
  "pythagorean-first": "피타고라스 정리 후 계산",
  "special-angle": "특수각의 값",
  "special-angle-expression": "특수각 식 계산",
  "side-from-sine": "사인으로 변의 길이",
  "side-from-cosine": "코사인으로 변의 길이",
  "side-from-tangent": "탄젠트로 변의 길이",
  "ratio-scale": "닮음비와 변의 길이",
  "radical-side": "특수각과 근호 길이",
  "fraction-decimal": "분수·소수로 길이 계산",
};

type Triple = readonly [opposite: number, adjacent: number, hypotenuse: number];
const TRIPLES: Triple[] = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25]];

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

function gcd(left: number, right: number): number {
  return right === 0 ? Math.abs(left) : gcd(right, left % right);
}

function fraction(numerator: number, denominator: number) {
  if (denominator === 0) return "0";
  const divisor = gcd(numerator, denominator);
  const top = numerator / divisor;
  const bottom = denominator / divisor;
  if (bottom === 1) return `${top}`;
  return `\\dfrac{${top}}{${bottom}}`;
}

function uniqueDistractors(answer: string, candidates: string[]) {
  const numeric = /^-?\d+$/.test(answer) ? Number(answer) : null;
  const derived = numeric === null ? [] : [`${numeric + 1}`, `${numeric - 1}`, `${numeric + 2}`];
  const unique = [
    ...new Set([...candidates, ...derived].filter((candidate) => candidate !== answer)),
  ];
  if (unique.length < 3) {
    throw new Error(`삼각비 문제의 실제 오답이 세 개보다 적습니다: ${answer}`);
  }
  return unique.slice(0, 3);
}

function difficultyForIndex(index: number): MiddleTrigonometryDifficulty {
  if (index < 2) return "basic";
  if (index < 5) return "application";
  return "advanced";
}

function triangleLatex(opposite: number, adjacent: number, hypotenuse: number) {
  return `\\triangle ABC,\\quad \\angle C=90^\\circ,\\quad \\overline{BC}=${opposite},\\ \\overline{AC}=${adjacent},\\ \\overline{AB}=${hypotenuse}`;
}

function ratioAnswer(name: "sin" | "cos" | "tan", triple: Triple) {
  const [opposite, adjacent, hypotenuse] = triple;
  if (name === "sin") return fraction(opposite, hypotenuse);
  if (name === "cos") return fraction(adjacent, hypotenuse);
  return fraction(opposite, adjacent);
}

function make(
  id: string,
  kind: MiddleTrigonometryMethodKind,
  latex: string,
  answerLatex: string,
  solutionHint: string,
  distractors: string[],
  structure: string = kind,
): MiddleTrigonometryProblem {
  const question = questionFor(kind, structure);
  return {
    id,
    kind,
    difficulty: "basic",
    structure,
    label: MIDDLE_TRIGONOMETRY_METHOD_TITLES[kind],
    question,
    latex,
    answerLatex,
    solutionHint,
    distractors: uniqueDistractors(answerLatex, distractors),
    visual: { type: "geometry", variant: kind, labels: [] },
  };
}

function questionFor(kind: MiddleTrigonometryMethodKind, structure: string) {
  if (kind === "single-ratio") return `$\\${structure.replace("single-", "")} A$의 값은?`;
  if (kind === "three-ratios") return "$\\sin A,\\ \\cos A,\\ \\tan A$의 값은?";
  if (kind === "pythagorean-first") return `$\\${structure.replace("pythagorean-", "")} A$의 값은?`;
  if (kind === "special-angle") return `$${structure}$의 값은?`;
  if (kind === "special-angle-expression") return `$${structure}$의 계산 결과는?`;
  if (kind === "side-from-sine" || kind === "side-from-tangent" || kind === "fraction-decimal") {
    return "$\\overline{BC}$의 길이는?";
  }
  if (kind === "side-from-cosine") return "$\\overline{AC}$의 길이는?";
  if (kind === "ratio-scale") {
    return structure === "scale-height" ? "$\\overline{BC}$의 길이는?" : "$\\overline{AC}$의 길이는?";
  }
  if (kind === "radical-side") {
    return structure === "45-leg-to-hypotenuse" ? "$\\overline{AB}$의 길이는?" : "$\\overline{AC}$의 길이는?";
  }
  return "변의 길이는?";
}

const SPECIAL_VALUES = [
  { latex: "\\sin 30^\\circ", answer: "\\dfrac{1}{2}", wrong: ["\\dfrac{\\sqrt{2}}{2}", "\\dfrac{\\sqrt{3}}{2}", "\\sqrt{3}"] },
  { latex: "\\cos 30^\\circ", answer: "\\dfrac{\\sqrt{3}}{2}", wrong: ["\\dfrac{1}{2}", "\\dfrac{\\sqrt{2}}{2}", "\\dfrac{1}{\\sqrt{3}}"] },
  { latex: "\\tan 30^\\circ", answer: "\\dfrac{\\sqrt{3}}{3}", wrong: ["\\sqrt{3}", "\\dfrac{1}{2}", "\\dfrac{\\sqrt{3}}{2}"] },
  { latex: "\\sin 45^\\circ", answer: "\\dfrac{\\sqrt{2}}{2}", wrong: ["\\dfrac{1}{2}", "\\dfrac{\\sqrt{3}}{2}", "1"] },
  { latex: "\\cos 45^\\circ", answer: "\\dfrac{\\sqrt{2}}{2}", wrong: ["\\dfrac{1}{2}", "\\dfrac{\\sqrt{3}}{2}", "1"] },
  { latex: "\\tan 45^\\circ", answer: "1", wrong: ["\\dfrac{1}{2}", "\\sqrt{2}", "\\sqrt{3}"] },
  { latex: "\\sin 60^\\circ", answer: "\\dfrac{\\sqrt{3}}{2}", wrong: ["\\dfrac{1}{2}", "\\dfrac{\\sqrt{2}}{2}", "\\sqrt{3}"] },
  { latex: "\\cos 60^\\circ", answer: "\\dfrac{1}{2}", wrong: ["\\dfrac{\\sqrt{2}}{2}", "\\dfrac{\\sqrt{3}}{2}", "1"] },
  { latex: "\\tan 60^\\circ", answer: "\\sqrt{3}", wrong: ["\\dfrac{\\sqrt{3}}{3}", "1", "\\dfrac{\\sqrt{3}}{2}"] },
] as const;

const SPECIAL_EXPRESSIONS = [
  { latex: "2\\sin 30^\\circ", answer: "1" },
  { latex: "\\sin 30^\\circ+\\cos 60^\\circ", answer: "1" },
  { latex: "\\tan 45^\\circ+\\cos 60^\\circ", answer: "\\dfrac{3}{2}" },
  { latex: "\\sin 60^\\circ\\cos 30^\\circ", answer: "\\dfrac{3}{4}" },
  { latex: "\\tan 30^\\circ\\tan 60^\\circ", answer: "1" },
  { latex: "2\\sin 45^\\circ\\cos 45^\\circ", answer: "1" },
  { latex: "\\sin^2 30^\\circ+\\cos^2 30^\\circ", answer: "1" },
  { latex: "\\dfrac{\\sin 60^\\circ}{\\cos 30^\\circ}", answer: "1" },
] as const;

function build(
  kind: MiddleTrigonometryMethodKind,
  next: () => number,
  id: string,
  variantHint: number,
): MiddleTrigonometryProblem {
  const base = TRIPLES[integer(next, 0, TRIPLES.length - 1)];
  const scale = integer(next, 1, variantHint < 5 ? 4 : 7);
  const triple = base.map((value) => value * scale) as unknown as Triple;
  const [opposite, adjacent, hypotenuse] = triple;

  if (kind === "single-ratio") {
    const ratioName = (["sin", "cos", "tan"] as const)[variantHint % 3];
    const answer = ratioAnswer(ratioName, triple);
    return make(id, kind, `${triangleLatex(opposite, adjacent, hypotenuse)},\\quad \\${ratioName} A`,
      answer,
      `${ratioName === "sin" ? "높이/빗변" : ratioName === "cos" ? "밑변/빗변" : "높이/밑변"}에 해당하는 두 변을 나누고 약분한다.`,
      [
        fraction(adjacent, hypotenuse),
        fraction(opposite, adjacent),
        fraction(hypotenuse, opposite),
        fraction(adjacent, opposite),
        fraction(hypotenuse, adjacent),
      ],
      `single-${ratioName}`);
  }

  if (kind === "three-ratios") {
    const answer = `\\left(${fraction(opposite, hypotenuse)},\\ ${fraction(adjacent, hypotenuse)},\\ ${fraction(opposite, adjacent)}\\right)`;
    return make(id, kind, triangleLatex(opposite, adjacent, hypotenuse), answer,
      "각 A를 기준으로 높이·밑변·빗변을 구분해 sin, cos, tan 순서로 쓴다.",
      [
        `\\left(${fraction(adjacent, hypotenuse)},\\ ${fraction(opposite, hypotenuse)},\\ ${fraction(adjacent, opposite)}\\right)`,
        `\\left(${fraction(opposite, adjacent)},\\ ${fraction(adjacent, hypotenuse)},\\ ${fraction(opposite, hypotenuse)}\\right)`,
        `\\left(${fraction(opposite, hypotenuse)},\\ ${fraction(adjacent, hypotenuse)},\\ ${fraction(adjacent, opposite)}\\right)`,
      ]);
  }

  if (kind === "pythagorean-first") {
    const ratioName = variantHint % 2 === 0 ? "sin" : "cos";
    const answer = ratioAnswer(ratioName, triple);
    return make(id, kind,
      `\\triangle ABC,\\quad \\angle C=90^\\circ,\\quad \\overline{BC}=${opposite},\\ \\overline{AC}=${adjacent},\\quad \\${ratioName} A`,
      answer,
      `AB=\\sqrt{${opposite}^2+${adjacent}^2}=${hypotenuse}를 먼저 구한 뒤 ${ratioName}의 비를 만든다.`,
      [
        fraction(adjacent, hypotenuse),
        fraction(opposite, adjacent),
        fraction(hypotenuse, adjacent),
        fraction(adjacent, opposite),
        fraction(hypotenuse, opposite),
      ],
      `pythagorean-${ratioName}`);
  }

  if (kind === "special-angle") {
    const item = SPECIAL_VALUES[variantHint % SPECIAL_VALUES.length];
    return make(id, kind, item.latex, item.answer,
      "30°·45°·60°의 기본 삼각비 표에서 해당 값을 바로 찾는다.",
      [...item.wrong],
      item.latex);
  }

  if (kind === "special-angle-expression") {
    const item = SPECIAL_EXPRESSIONS[variantHint % SPECIAL_EXPRESSIONS.length];
    return make(id, kind, item.latex, item.answer,
      "각 특수각의 삼각비를 정확한 값으로 바꾼 뒤 곱셈을 먼저 계산한다.",
      ["\\dfrac{1}{2}", "\\dfrac{\\sqrt{2}}{2}", "\\dfrac{\\sqrt{3}}{2}", "\\dfrac{3}{4}", "\\dfrac{3}{2}", "2"],
      item.latex);
  }

  if (kind === "side-from-sine") {
    const answer = `${opposite}`;
    return make(id, kind, `\\angle C=90^\\circ,\\quad \\sin A=${fraction(base[0], base[2])},\\quad \\overline{AB}=${hypotenuse},\\quad \\overline{BC}`,
      answer,
      `BC=AB\\times\\sin A=${hypotenuse}\\times${fraction(base[0], base[2])}로 계산한다.`,
      [`${adjacent}`, `${base[0]}`, `${hypotenuse - opposite}`]);
  }

  if (kind === "side-from-cosine") {
    const answer = `${adjacent}`;
    return make(id, kind, `\\angle C=90^\\circ,\\quad \\cos A=${fraction(base[1], base[2])},\\quad \\overline{AB}=${hypotenuse},\\quad \\overline{AC}`,
      answer,
      `AC=AB\\times\\cos A=${hypotenuse}\\times${fraction(base[1], base[2])}로 계산한다.`,
      [`${opposite}`, `${base[1]}`, `${hypotenuse - adjacent}`]);
  }

  if (kind === "side-from-tangent") {
    const answer = `${opposite}`;
    return make(id, kind, `\\angle C=90^\\circ,\\quad \\tan A=${fraction(base[0], base[1])},\\quad \\overline{AC}=${adjacent},\\quad \\overline{BC}`,
      answer,
      `BC=AC\\times\\tan A=${adjacent}\\times${fraction(base[0], base[1])}로 계산한다.`,
      [`${adjacent}`, `${base[0]}`, `${hypotenuse}`]);
  }

  if (kind === "ratio-scale") {
    const ratioBase = TRIPLES[variantHint % TRIPLES.length];
    const newScale = 2 + Math.floor(variantHint / TRIPLES.length);
    const known = ratioBase[2] * newScale;
    const heightMode = variantHint % 2 === 0;
    const target = heightMode ? ratioBase[0] : ratioBase[1];
    const ratioName = heightMode ? "sin" : "cos";
    const targetSegment = heightMode ? "BC" : "AC";
    const answer = `${target * newScale}`;
    return make(id, kind,
      `\\${ratioName} A=${fraction(target, ratioBase[2])},\\quad \\overline{AB}=${known},\\quad \\overline{${targetSegment}}`,
      answer,
      `구하는 변:빗변=${target}:${ratioBase[2]}이므로 빗변에 맞춘 배수를 구하는 변에도 곱한다.`,
      [`${(heightMode ? ratioBase[1] : ratioBase[0]) * newScale}`, `${target}`, `${known - target * newScale}`],
      heightMode ? "scale-height" : "scale-adjacent");
  }

  if (kind === "radical-side") {
    const k = integer(next, 2, variantHint < 5 ? 8 : 12);
    const mode = variantHint % 4;
    if (mode === 0) {
      return make(id, kind, `\\angle C=90^\\circ,\\quad \\angle A=45^\\circ,\\quad \\overline{AC}=${k},\\quad \\overline{AB}`,
        `${k}\\sqrt{2}`, "45° 직각삼각형의 변의 비 1:1:√2를 적용한다.",
        [`${k}`, `${2 * k}`, `${k}\\sqrt{3}`], "45-leg-to-hypotenuse");
    }
    if (mode === 1) {
      return make(id, kind, `\\angle C=90^\\circ,\\quad \\angle A=45^\\circ,\\quad \\overline{AB}=${2 * k},\\quad \\overline{AC}`,
        `${k}\\sqrt{2}`, `AC=${2 * k}\\times\\cos45^\\circ=${2 * k}\\times\\dfrac{\\sqrt2}{2}로 계산한다.`,
        [`${k}`, `${2 * k}\\sqrt{2}`, `${k}\\sqrt{3}`], "45-hypotenuse-to-leg");
    }
    if (mode === 2) {
      return make(id, kind, `\\angle C=90^\\circ,\\quad \\angle A=30^\\circ,\\quad \\overline{BC}=${k},\\quad \\overline{AC}`,
        `${k}\\sqrt{3}`, "30° 직각삼각형의 변의 비 1:√3:2를 적용한다.",
        [`${k}\\sqrt{2}`, `${2 * k}`, `${k}`], "30-short-to-long");
    }
    return make(id, kind, `\\angle C=90^\\circ,\\quad \\angle A=30^\\circ,\\quad \\overline{AB}=${2 * k},\\quad \\overline{AC}`,
      `${k}\\sqrt{3}`, `AC=${2 * k}\\times\\cos30^\\circ=${2 * k}\\times\\dfrac{\\sqrt3}{2}로 계산한다.`,
      [`${k}\\sqrt{2}`, `${2 * k}\\sqrt{3}`, `${k}`], "30-hypotenuse-to-long");
  }

  const decimalMode = variantHint % 2 === 1;
  const decimalBase = decimalMode ? TRIPLES[variantHint % 4 === 1 ? 0 : 3] : base;
  const decimalScale = scale;
  const decimalHypotenuse = decimalBase[2] * decimalScale;
  const decimalOpposite = decimalBase[0] * decimalScale;
  const ratio = decimalBase[0] / decimalBase[2];
  const ratioLatex = decimalMode ? `${ratio}` : fraction(decimalBase[0], decimalBase[2]);
  const answer = `${decimalOpposite}`;
  return make(id, kind, `\\angle C=90^\\circ,\\quad \\sin A=${ratioLatex},\\quad \\overline{AB}=${decimalHypotenuse},\\quad \\overline{BC}`,
    answer,
    `BC=AB\\times\\sin A=${decimalHypotenuse}\\times${ratioLatex}로 계산한다.`,
    [`${decimalBase[1] * decimalScale}`, `${decimalBase[0]}`, `${decimalHypotenuse}`],
    decimalMode ? "decimal-ratio" : "fraction-ratio");
}

function comprehensiveKind(seed: number, index: number) {
  return MIDDLE_TRIGONOMETRY_METHOD_KINDS[
    (seed * 8 + index) % MIDDLE_TRIGONOMETRY_METHOD_KINDS.length
  ];
}

const GROUP_METHOD_PLANS: Record<Exclude<MiddleTrigonometryKind, "comprehensive">, MiddleTrigonometryMethodKind[]> = {
  ratios: [
    "single-ratio", "three-ratios",
    "pythagorean-first", "special-angle", "special-angle-expression",
    "pythagorean-first", "special-angle-expression", "radical-side",
  ],
  "special-angles": [
    "special-angle", "special-angle-expression",
    "special-angle", "radical-side", "special-angle-expression",
    "radical-side", "special-angle-expression", "radical-side",
  ],
  "side-lengths": [
    "side-from-sine", "side-from-cosine",
    "side-from-tangent", "ratio-scale", "fraction-decimal",
    "radical-side", "radical-side", "fraction-decimal",
  ],
};

const LEGACY_KIND_GROUPS: Record<MiddleTrigonometryMethodKind, MiddleTrigonometryKind> = {
  "single-ratio": "ratios",
  "three-ratios": "ratios",
  "pythagorean-first": "ratios",
  "special-angle": "ratios",
  "special-angle-expression": "ratios",
  "radical-side": "side-lengths",
  "side-from-sine": "side-lengths",
  "side-from-cosine": "side-lengths",
  "side-from-tangent": "side-lengths",
  "ratio-scale": "side-lengths",
  "fraction-decimal": "side-lengths",
};

export function isMiddleTrigonometryKind(value: string | null): value is MiddleTrigonometryKind {
  return MIDDLE_TRIGONOMETRY_KINDS.includes(value as MiddleTrigonometryKind);
}

export function resolveMiddleTrigonometryKind(value: string | null): MiddleTrigonometryKind | null {
  if (value === "special-angles") return "ratios";
  if (value === "comprehensive") return "side-lengths";
  if (isMiddleTrigonometryKind(value)) return value;
  if (MIDDLE_TRIGONOMETRY_METHOD_KINDS.includes(value as MiddleTrigonometryMethodKind)) {
    return LEGACY_KIND_GROUPS[value as MiddleTrigonometryMethodKind];
  }
  return null;
}

export function createMiddleTrigonometryProblemSet(kind: MiddleTrigonometryKind, seed: number) {
  const next = random(seed);
  return {
    seed,
    kind,
    problems: Array.from({ length: 8 }, (_, index) => {
      const actualKind = kind === "comprehensive"
        ? comprehensiveKind(seed, index)
        : GROUP_METHOD_PLANS[kind][index];
      return {
        ...build(actualKind, next, `middle-trigonometry-${kind}-${index}`, index),
        difficulty: difficultyForIndex(index),
      };
    }),
  };
}

export function createMiddleTrigonometryReviewProblems(
  wrongKinds: MiddleTrigonometryMethodKind[],
  seed: number,
) {
  const uniqueKinds = [...new Set(wrongKinds)].slice(0, 2);
  const next = random(seed);
  return uniqueKinds.map((kind, index) => {
    return {
      ...build(kind, next, `middle-trigonometry-review-${seed}-${index}`, 6 + index),
      difficulty: "advanced" as const,
    };
  });
}
