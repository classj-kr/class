export type MiddleCirclePropertiesMethodKind =
  | "central-to-inscribed"
  | "inscribed-to-central"
  | "arc-to-inscribed"
  | "same-arc"
  | "semicircle-angle"
  | "cyclic-quadrilateral"
  | "tangent-chord-angle"
  | "tangent-length"
  | "tangent-expression"
  | "tangent-perimeter"
  | "chord-length"
  | "center-to-chord"
  | "equal-chord-distance"
  | "equal-chord-length"
  | "chord-comparison"
  | "arc-sum";

export type MiddleCirclePropertiesKind =
  | "inscribed-angles"
  | "angle-applications"
  | "circle-lengths"
  | "comprehensive";

export type MiddleCirclePropertiesDifficulty = "basic" | "application" | "advanced";

export type MiddleCirclePropertiesProblem = {
  id: string;
  kind: MiddleCirclePropertiesMethodKind;
  difficulty: MiddleCirclePropertiesDifficulty;
  structure: string;
  label: string;
  latex: string;
  answerLatex: string;
  solutionHint: string;
  distractors: string[];
  visual?: { type: "geometry"; variant: string; labels?: string[] };
};

export const MIDDLE_CIRCLE_PROPERTIES_KINDS: MiddleCirclePropertiesKind[] = [
  "inscribed-angles",
  "circle-lengths",
];

export const MIDDLE_CIRCLE_PROPERTIES_METHOD_KINDS: MiddleCirclePropertiesMethodKind[] = [
  "central-to-inscribed",
  "inscribed-to-central",
  "arc-to-inscribed",
  "same-arc",
  "semicircle-angle",
  "cyclic-quadrilateral",
  "tangent-chord-angle",
  "tangent-length",
  "chord-length",
  "center-to-chord",
  "arc-sum",
];

export const MIDDLE_CIRCLE_PROPERTIES_TITLES: Record<MiddleCirclePropertiesKind, string> = {
  "inscribed-angles": "원주각과 각의 응용",
  "angle-applications": "원의 성질: 사각형과 접선의 각",
  "circle-lengths": "원의 성질: 접선과 현의 길이",
  comprehensive: "원의 성질 계산 종합",
};

const MIDDLE_CIRCLE_PROPERTIES_METHOD_TITLES: Record<MiddleCirclePropertiesMethodKind, string> = {
  "central-to-inscribed": "중심각에서 원주각",
  "inscribed-to-central": "원주각에서 중심각",
  "arc-to-inscribed": "호의 크기에서 원주각",
  "same-arc": "같은 호의 원주각",
  "semicircle-angle": "지름과 원주각",
  "cyclic-quadrilateral": "원에 내접하는 사각형",
  "tangent-chord-angle": "접선과 현이 이루는 각",
  "tangent-length": "한 점에서 그은 두 접선",
  "tangent-expression": "두 접선의 식",
  "tangent-perimeter": "두 접선과 삼각형의 둘레",
  "chord-length": "중심과 현의 길이",
  "center-to-chord": "현에서 중심까지의 거리",
  "equal-chord-distance": "같은 길이의 현과 중심거리",
  "equal-chord-length": "같은 중심거리와 현",
  "chord-comparison": "현의 길이 비교",
  "arc-sum": "호의 크기 합산",
};

const RIGHT_TRIANGLES = [
  [3, 4, 5],
  [5, 12, 13],
  [8, 15, 17],
  [7, 24, 25],
] as const;

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

function uniqueDistractors(answer: string, candidates: string[]) {
  const degreeMatch = answer.match(/^(-?\d+)\^\\circ$/);
  const numericMatch = answer.match(/^-?\d+$/);
  const derived = degreeMatch
    ? [
      degree(Number(degreeMatch[1]) + 10),
      degree(Math.max(1, Number(degreeMatch[1]) - 10)),
      degree(Number(degreeMatch[1]) * 2),
    ]
    : numericMatch
      ? [
        `${Number(answer) + 1}`,
        `${Number(answer) - 1}`,
        `${Number(answer) + 2}`,
      ]
      : [];
  const unique = [
    ...new Set([...candidates, ...derived].filter((candidate) => candidate !== answer)),
  ];
  if (unique.length < 3) {
    throw new Error(`원의 성질 문제의 실제 오답이 세 개보다 적습니다: ${answer}`);
  }
  return unique.slice(0, 3);
}

function degree(value: number) {
  return `${value}^\\circ`;
}

function difficultyForIndex(index: number): MiddleCirclePropertiesDifficulty {
  if (index < 2) return "basic";
  if (index < 5) return "application";
  return "advanced";
}

function make(
  id: string,
  kind: MiddleCirclePropertiesMethodKind,
  latex: string,
  answerLatex: string,
  solutionHint: string,
  distractors: string[],
  structure: string = kind,
): MiddleCirclePropertiesProblem {
  return {
    id,
    kind,
    difficulty: "basic",
    structure,
    label: MIDDLE_CIRCLE_PROPERTIES_METHOD_TITLES[kind],
    latex,
    answerLatex,
    solutionHint,
    distractors: uniqueDistractors(answerLatex, distractors),
    visual: { type: "geometry", variant: kind, labels: [] },
  };
}

function angleValue(next: () => number, index: number) {
  return 12 + index * 7 + integer(next, 0, 5);
}

function build(
  kind: MiddleCirclePropertiesMethodKind,
  next: () => number,
  id: string,
  index: number,
): MiddleCirclePropertiesProblem {
  const theta = angleValue(next, index);

  if (kind === "central-to-inscribed") {
    const central = theta * 2;
    return make(id, kind,
      `O:\\text{ 원의 중심},\\ P:\\text{ 큰 호 }AB\\text{ 위},\\quad \\angle AOB=${central}^\\circ,\\quad \\angle APB`,
      degree(theta),
      `같은 호 AB에 대한 원주각은 중심각의 절반이므로 ${central}\\div2를 계산한다.`,
      [degree(central), degree(180 - theta), degree(90 - theta)],
    );
  }

  if (kind === "inscribed-to-central") {
    const central = theta * 2;
    return make(id, kind,
      `O:\\text{ 원의 중심},\\ P:\\text{ 큰 호 }AB\\text{ 위},\\quad \\angle APB=${theta}^\\circ,\\quad \\angle AOB`,
      degree(central),
      `같은 호 AB에 대한 중심각은 원주각의 2배이므로 ${theta}\\times2를 계산한다.`,
      [degree(theta), degree(180 - theta), degree(90 + theta)],
    );
  }

  if (kind === "arc-to-inscribed") {
    const arc = theta * 2;
    return make(id, kind,
      `P:\\text{ 큰 호 }AB\\text{ 위},\\quad m\\widehat{AB}=${arc}^\\circ,\\quad \\angle APB`,
      degree(theta),
      `원주각의 크기는 대응하는 호의 크기의 절반이므로 ${arc}\\div2를 계산한다.`,
      [degree(arc), degree(180 - theta), degree(90 - theta)],
    );
  }

  if (kind === "same-arc") {
    return make(id, kind,
      `P,Q:\\text{ 같은 호 }AB\\text{ 위의 점},\\quad \\angle APB=${theta}^\\circ,\\quad \\angle AQB`,
      degree(theta),
      "같은 호 AB에 대한 두 원주각의 크기는 서로 같다.",
      [degree(theta * 2), degree(180 - theta), degree(90 - theta)],
    );
  }

  if (kind === "semicircle-angle") {
    const angleA = 18 + index * 6 + integer(next, 0, 4);
    const angleB = 90 - angleA;
    return make(id, kind,
      `AB:\\text{ 지름},\\quad \\angle ACB=90^\\circ,\\quad \\angle CAB=${angleA}^\\circ,\\quad \\angle ABC`,
      degree(angleB),
      `지름에 대한 원주각은 90°이므로 삼각형의 두 예각의 합 ${angleA}+x=90을 푼다.`,
      [degree(angleA), degree(180 - angleA), degree(90 + angleA)],
    );
  }

  if (kind === "cyclic-quadrilateral") {
    const angleA = 34 + index * 13 + integer(next, 0, 7);
    const angleC = 180 - angleA;
    return make(id, kind,
      `ABCD:\\text{ 원에 내접},\\quad \\angle A=${angleA}^\\circ,\\quad \\angle C`,
      degree(angleC),
      `원에 내접하는 사각형의 마주 보는 두 각의 합은 180°이므로 180-${angleA}를 계산한다.`,
      [degree(angleA), degree(90 - Math.floor(angleA / 2)), degree(360 - angleA)],
    );
  }

  if (kind === "tangent-chord-angle") {
    return make(id, kind,
      `AT:\\text{ 점 }A\\text{에서의 접선},\\ P:\\text{ 접선 반대쪽 호 }AB\\text{ 위},\\quad \\angle TAB=${theta}^\\circ,\\quad \\angle APB`,
      degree(theta),
      "접선과 현 AB가 이루는 각은 현 AB에 대한 원주각과 같다.",
      [degree(theta * 2), degree(90 - theta), degree(180 - theta)],
    );
  }

  if (kind === "tangent-length") {
    const length = 4 + index * 3 + integer(next, 0, 2);
    return make(id, kind,
      `PA,PB:\\text{ 점 }P\\text{에서 그은 접선},\\quad PA=${length},\\quad PB`,
      `${length}`,
      "한 점 P에서 원에 그은 두 접선의 길이는 같으므로 PB=PA이다.",
      [`${length + 1}`, `${length * 2}`, `${Math.max(1, length - 2)}`],
    );
  }

  if (kind === "tangent-expression") {
    const solution = integer(next, 4, 10);
    return make(id, kind,
      `PA=x+${solution},\\quad PB=2x,\\quad PA=PB`,
      `${solution}`,
      `한 점에서 그은 두 접선의 길이는 같으므로 x+${solution}=2x를 푼다.`,
      [`${solution * 2}`, `${solution + 1}`, `${Math.max(1, solution - 1)}`],
      "tangent-linear-equation",
    );
  }

  if (kind === "tangent-perimeter") {
    const tangent = integer(next, 5, 12);
    const chord = integer(next, 4, 10);
    const perimeter = tangent * 2 + chord;
    return make(id, kind,
      `PA,PB:\\text{ 접선},\\quad PA=${tangent},\\quad AB=${chord},\\quad \\triangle PAB\\text{의 둘레}`,
      `${perimeter}`,
      `PA=PB=${tangent}이므로 삼각형의 둘레는 ${tangent}+${tangent}+${chord}이다.`,
      [`${tangent + chord}`, `${tangent * 2}`, `${perimeter + tangent}`],
      "two-tangents-perimeter",
    );
  }

  if (kind === "equal-chord-distance") {
    const distance = integer(next, 3, 9);
    return make(id, kind,
      `AB=CD,\\quad OM\\perp AB,\\quad ON\\perp CD,\\quad OM=${distance},\\quad ON`,
      `${distance}`,
      "한 원에서 길이가 같은 두 현은 중심에서 같은 거리에 있다.",
      [`${distance + 1}`, `${distance * 2}`, `${Math.max(1, distance - 1)}`],
      "equal-chords-equal-distance",
    );
  }

  if (kind === "equal-chord-length") {
    const chord = 2 * integer(next, 4, 10);
    return make(id, kind,
      `OM=ON,\\quad OM\\perp AB,\\quad ON\\perp CD,\\quad AB=${chord},\\quad CD`,
      `${chord}`,
      "한 원에서 중심으로부터 같은 거리에 있는 두 현의 길이는 같다.",
      [`${chord / 2}`, `${chord + 2}`, `${chord * 2}`],
      "equal-distance-equal-chords",
    );
  }

  if (kind === "chord-comparison") {
    const near = integer(next, 2, 5);
    const far = near + integer(next, 1, 4);
    return make(id, kind,
      `OM\\perp AB,\\quad ON\\perp CD,\\quad OM=${near},\\quad ON=${far}`,
      `\\overline{AB}`,
      "한 원에서 중심에 더 가까운 현이 더 길다. OM<ON이므로 AB가 더 길다.",
      ["\\overline{CD}", "\\overline{AB}=\\overline{CD}", "\\text{판단할 수 없음}"],
      "compare-chords-by-distance",
    );
  }

  if (kind === "chord-length") {
    const [halfChordBase, distanceBase, radiusBase] = RIGHT_TRIANGLES[index % RIGHT_TRIANGLES.length];
    const scale = 1 + Math.floor(index / RIGHT_TRIANGLES.length);
    const halfChord = halfChordBase * scale;
    const distance = distanceBase * scale;
    const radius = radiusBase * scale;
    const chord = halfChord * 2;
    return make(id, kind,
      `OA=${radius},\\quad OM\\perp AB,\\quad OM=${distance},\\quad AB`,
      `${chord}`,
      `중심에서 현에 내린 수선은 현을 이등분하므로 AM=\\sqrt{${radius}^2-${distance}^2}=${halfChord},\\ AB=2AM이다.`,
      [`${halfChord}`, `${distance * 2}`, `${radius * 2}`],
    );
  }

  if (kind === "center-to-chord") {
    const [halfChordBase, distanceBase, radiusBase] = RIGHT_TRIANGLES[index % RIGHT_TRIANGLES.length];
    const scale = 1 + Math.floor(index / RIGHT_TRIANGLES.length);
    const halfChord = halfChordBase * scale;
    const distance = distanceBase * scale;
    const radius = radiusBase * scale;
    return make(id, kind,
      `OA=${radius},\\quad OM\\perp AB,\\quad AB=${halfChord * 2},\\quad OM`,
      `${distance}`,
      `AM=${halfChord}이므로 직각삼각형 OAM에서 OM=\\sqrt{${radius}^2-${halfChord}^2}를 계산한다.`,
      [`${halfChord}`, `${radius - distance}`, `${distance * 2}`],
    );
  }

  const arcAB = 52 + index * 8 + integer(next, 0, 5);
  const arcBC = 74 + index * 6 + integer(next, 0, 5);
  const remaining = 360 - arcAB - arcBC;
  return make(id, kind,
    `m\\widehat{AB}=${arcAB}^\\circ,\\quad m\\widehat{BC}=${arcBC}^\\circ,\\quad m\\widehat{CA}`,
    degree(remaining),
    `한 원의 세 호의 크기 합은 360°이므로 360-${arcAB}-${arcBC}를 계산한다.`,
    [degree(360 - arcAB), degree(360 - arcBC), degree(arcAB + arcBC)],
  );
}

function comprehensiveKind(seed: number, index: number) {
  return MIDDLE_CIRCLE_PROPERTIES_METHOD_KINDS[
    (seed * 8 + index) % MIDDLE_CIRCLE_PROPERTIES_METHOD_KINDS.length
  ];
}

const GROUP_METHOD_PLANS: Record<Exclude<MiddleCirclePropertiesKind, "comprehensive">, MiddleCirclePropertiesMethodKind[]> = {
  "inscribed-angles": [
    "central-to-inscribed", "inscribed-to-central",
    "arc-to-inscribed", "same-arc", "semicircle-angle",
    "cyclic-quadrilateral", "tangent-chord-angle", "arc-sum",
  ],
  "angle-applications": [
    "cyclic-quadrilateral", "tangent-chord-angle",
    "cyclic-quadrilateral", "tangent-chord-angle", "cyclic-quadrilateral",
    "tangent-chord-angle", "cyclic-quadrilateral", "tangent-chord-angle",
  ],
  "circle-lengths": [
    "tangent-length", "tangent-expression", "tangent-perimeter", "chord-length",
    "center-to-chord", "equal-chord-distance", "equal-chord-length", "chord-comparison",
  ],
};

const LEGACY_KIND_GROUPS: Record<MiddleCirclePropertiesMethodKind, MiddleCirclePropertiesKind> = {
  "central-to-inscribed": "inscribed-angles",
  "inscribed-to-central": "inscribed-angles",
  "arc-to-inscribed": "inscribed-angles",
  "same-arc": "inscribed-angles",
  "semicircle-angle": "inscribed-angles",
  "arc-sum": "inscribed-angles",
  "cyclic-quadrilateral": "inscribed-angles",
  "tangent-chord-angle": "inscribed-angles",
  "tangent-length": "circle-lengths",
  "tangent-expression": "circle-lengths",
  "tangent-perimeter": "circle-lengths",
  "chord-length": "circle-lengths",
  "center-to-chord": "circle-lengths",
  "equal-chord-distance": "circle-lengths",
  "equal-chord-length": "circle-lengths",
  "chord-comparison": "circle-lengths",
};

export function isMiddleCirclePropertiesKind(value: string | null): value is MiddleCirclePropertiesKind {
  return MIDDLE_CIRCLE_PROPERTIES_KINDS.includes(value as MiddleCirclePropertiesKind);
}

export function resolveMiddleCirclePropertiesKind(value: string | null): MiddleCirclePropertiesKind | null {
  if (value === "angle-applications" || value === "comprehensive") return "inscribed-angles";
  if (isMiddleCirclePropertiesKind(value)) return value;
  if (MIDDLE_CIRCLE_PROPERTIES_METHOD_KINDS.includes(value as MiddleCirclePropertiesMethodKind)) {
    return LEGACY_KIND_GROUPS[value as MiddleCirclePropertiesMethodKind];
  }
  return null;
}

export function createMiddleCirclePropertiesProblemSet(
  kind: MiddleCirclePropertiesKind,
  seed: number,
) {
  const next = random(seed);
  return {
    seed,
    kind,
    problems: Array.from({ length: 8 }, (_, index) => {
      const actualKind = kind === "comprehensive"
        ? comprehensiveKind(seed, index)
        : GROUP_METHOD_PLANS[kind][index];
      return {
        ...build(actualKind, next, `middle-circle-properties-${kind}-${index}`, index),
        difficulty: difficultyForIndex(index),
      };
    }),
  };
}

export function createMiddleCirclePropertiesReviewProblems(
  wrongKinds: MiddleCirclePropertiesMethodKind[],
  seed: number,
) {
  const uniqueKinds = [...new Set(wrongKinds)].slice(0, 2);
  const next = random(seed);
  return uniqueKinds.map((kind, index) => {
    return {
      ...build(kind, next, `middle-circle-properties-review-${seed}-${index}`, 6 + index),
      difficulty: "advanced" as const,
    };
  });
}
