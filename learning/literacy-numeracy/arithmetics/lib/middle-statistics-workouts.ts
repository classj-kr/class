export type MiddleStatisticsMethodKind =
  | "mean"
  | "missing-from-mean"
  | "frequency-mean"
  | "histogram-frequency"
  | "frequency-polygon-maximum"
  | "total-frequency"
  | "relative-frequency"
  | "missing-frequency"
  | "relative-percentage"
  | "median"
  | "mode"
  | "range"
  | "deviations"
  | "variance"
  | "standard-deviation"
  | "variance-from-deviations"
  | "compare-spread";

export type MiddleStatisticsKind =
  | "representative-values"
  | "mean-applications"
  | "dispersion"
  | "comprehensive";

export type MiddleStatisticsDifficulty = "basic" | "application" | "advanced";

export type MiddleStatisticsProblem = {
  id: string;
  kind: MiddleStatisticsMethodKind;
  difficulty: MiddleStatisticsDifficulty;
  structure: string;
  label: string;
  latex: string;
  answerLatex: string;
  solutionHint: string;
  distractors: string[];
  visual?: MiddleStatisticsVisual;
};

export type MiddleStatisticsVisual = {
  type: "histogram" | "frequency-polygon";
  values: number[];
  labels: string[];
  highlight?: number;
};

export const MIDDLE_STATISTICS_KINDS: MiddleStatisticsKind[] = [
  "representative-values",
  "mean-applications",
  "dispersion",
  "comprehensive",
];

export const MIDDLE_STATISTICS_METHOD_KINDS: MiddleStatisticsMethodKind[] = [
  "mean",
  "missing-from-mean",
  "frequency-mean",
  "histogram-frequency",
  "frequency-polygon-maximum",
  "total-frequency",
  "relative-frequency",
  "missing-frequency",
  "relative-percentage",
  "median",
  "mode",
  "range",
  "deviations",
  "variance",
  "standard-deviation",
  "variance-from-deviations",
  "compare-spread",
];

export const MIDDLE_STATISTICS_TITLES: Record<MiddleStatisticsKind, string> = {
  "representative-values": "대푯값·도수·상대도수",
  "mean-applications": "통계: 평균 활용",
  dispersion: "통계: 산포도 계산",
  comprehensive: "대푯값과 산포도 계산 종합",
};

const MIDDLE_STATISTICS_METHOD_TITLES: Record<MiddleStatisticsMethodKind, string> = {
  mean: "평균 계산",
  "missing-from-mean": "평균으로 빠진 값 구하기",
  "frequency-mean": "도수 자료의 평균",
  "histogram-frequency": "히스토그램 읽기",
  "frequency-polygon-maximum": "도수분포다각형 읽기",
  "total-frequency": "전체 도수",
  "relative-frequency": "상대도수",
  "missing-frequency": "빠진 도수",
  "relative-percentage": "상대도수의 백분율",
  median: "중앙값 계산",
  mode: "최빈값 찾기",
  range: "범위 계산",
  deviations: "편차 계산",
  variance: "분산 계산",
  "standard-deviation": "표준편차 계산",
  "variance-from-deviations": "편차에서 분산 구하기",
  "compare-spread": "두 자료의 산포도 비교",
};

const DEVIATION_PATTERNS = [
  [-2, -1, 0, 1, 2],
  [-3, -1, 0, 1, 3],
  [-2, -2, 0, 2, 2],
] as const;
const SPREAD_PATTERNS = [
  [-1, -1, 1, 1],
  [-2, -1, 0, 1, 2],
  [-1, -1, -1, 1, 1, 1],
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

function dataLatex(values: readonly number[]) {
  return `\\{${values.join(",\\ ")}\\}`;
}

function tupleLatex(values: readonly number[]) {
  return `(${values.join(",\\ ")})`;
}

function uniqueDistractors(answer: string, candidates: string[]) {
  const numeric = /^-?\d+(?:\.\d+)?$/.test(answer) ? Number(answer) : null;
  const fractionMatch = answer.match(/^\\dfrac\{(-?\d+)\}\{(\d+)\}$/);
  const derived = numeric !== null
    ? [`${numeric + 1}`, `${numeric - 1}`, `${numeric + 2}`]
    : fractionMatch
      ? [
        fraction(Number(fractionMatch[1]) + 1, Number(fractionMatch[2])),
        fraction(Number(fractionMatch[1]) - 1, Number(fractionMatch[2])),
        fraction(Number(fractionMatch[1]), Number(fractionMatch[2]) + 1),
      ]
      : [];
  const unique = [
    ...new Set([...candidates, ...derived].filter((candidate) => candidate !== answer)),
  ];
  if (unique.length < 3) {
    throw new Error(`통계 문제의 실제 오답이 세 개보다 적습니다: ${answer}`);
  }
  return unique.slice(0, 3);
}

function difficultyForIndex(index: number): MiddleStatisticsDifficulty {
  if (index < 2) return "basic";
  if (index < 5) return "application";
  return "advanced";
}

function make(
  id: string,
  kind: MiddleStatisticsMethodKind,
  latex: string,
  answerLatex: string,
  solutionHint: string,
  distractors: string[],
  structure: string = kind,
  visual?: MiddleStatisticsVisual,
): MiddleStatisticsProblem {
  return {
    id,
    kind,
    difficulty: "basic",
    structure,
    label: MIDDLE_STATISTICS_METHOD_TITLES[kind],
    latex,
    answerLatex,
    solutionHint,
    distractors: uniqueDistractors(answerLatex, distractors),
    visual,
  };
}

function spreadData(mean: number, scale: number, patternIndex: number) {
  const pattern = SPREAD_PATTERNS[patternIndex % SPREAD_PATTERNS.length];
  return pattern.map((deviation) => mean + deviation * scale);
}

function varianceForSpread(scale: number, patternIndex: number) {
  return patternIndex % SPREAD_PATTERNS.length === 1 ? 2 * scale * scale : scale * scale;
}

function standardDeviationLatex(scale: number, patternIndex: number) {
  if (patternIndex % SPREAD_PATTERNS.length !== 1) return `${scale}`;
  return scale === 1 ? "\\sqrt{2}" : `${scale}\\sqrt{2}`;
}

function rotate<T>(values: T[], shift: number) {
  const offset = shift % values.length;
  return [...values.slice(offset), ...values.slice(0, offset)];
}

function build(
  kind: MiddleStatisticsMethodKind,
  next: () => number,
  id: string,
  index: number,
): MiddleStatisticsProblem {
  const mean = 12 + index * 4 + integer(next, 0, 3);
  const scale = 1 + (index % 4);

  if (kind === "mean") {
    const pattern = DEVIATION_PATTERNS[index % DEVIATION_PATTERNS.length];
    const values = rotate(pattern.map((deviation) => mean + deviation * scale), index + 1);
    return make(id, kind, dataLatex(values), `${mean}`,
      `자료의 합을 자료 수 ${values.length}로 나눈다. 편차의 합이 0이므로 평균은 ${mean}이다.`,
      [`${mean + scale}`, `${mean - scale}`, `${values.reduce((sum, value) => sum + value, 0)}`],
      `mean-${pattern.length}-${index % DEVIATION_PATTERNS.length}`);
  }

  if (kind === "missing-from-mean") {
    const count = 5 + (index % 2);
    const targetSum = mean * count;
    const known = Array.from({ length: count - 1 }, (_, position) => (
      mean + (position - Math.floor((count - 2) / 2)) * scale
    ));
    const missing = targetSum - known.reduce((sum, value) => sum + value, 0);
    return make(id, kind,
      `\\text{평균}=${mean},\\quad ${dataLatex([...known, Number.NaN]).replace("NaN", "x")}`,
      `${missing}`,
      `전체 합 ${mean}\\times${count}에서 알려진 값의 합을 빼서 x를 구한다.`,
      [`${mean}`, `${missing + scale}`, `${targetSum}`],
      `missing-${count}`);
  }

  if (kind === "frequency-mean") {
    const gap = 2 + (index % 4);
    const values = [mean - gap, mean, mean + gap];
    const sideFrequency = 1 + (index % 3);
    const centerFrequency = 2 + ((index + 1) % 3);
    const totalFrequency = sideFrequency * 2 + centerFrequency;
    return make(id, kind,
      `\\begin{array}{c|ccc}\\text{값}&${values.join("&")}\\\\\\hline\\text{도수}&${sideFrequency}&${centerFrequency}&${sideFrequency}\\end{array}`,
      `${mean}`,
      `각 값에 도수를 곱해 더한 뒤 전체 도수 ${totalFrequency}로 나눈다.`,
      [`${mean + gap}`, `${mean - gap}`, `${totalFrequency}`],
      `frequency-${sideFrequency}-${centerFrequency}`);
  }

  if (kind === "histogram-frequency") {
    const labels = ["0~10", "10~20", "20~30", "30~40"];
    const values = [3 + index % 3, 5 + (index + 1) % 4, 4 + (index + 2) % 3, 2 + (index + 3) % 3];
    const targetIndex = (index + 1) % values.length;
    const answer = values[targetIndex];
    return make(id, kind, "", `${answer}`,
      "색칠한 계급의 막대 위에 표시된 도수를 읽는다.",
      values.filter((_, valueIndex) => valueIndex !== targetIndex).map(String),
      `histogram-frequency-${targetIndex}-${values.join("-")}`,
      { type: "histogram", values, labels, highlight: targetIndex });
  }

  if (kind === "frequency-polygon-maximum") {
    const labels = ["0~10", "10~20", "20~30", "30~40"];
    const values = [3 + index % 3, 4 + (index + 1) % 3, 3 + (index + 2) % 3, 2 + (index + 3) % 3];
    const maximumIndex = (index + 2) % values.length;
    values[maximumIndex] = Math.max(...values) + 3;
    const answer = `\\text{${labels[maximumIndex]}}`;
    return make(id, kind, "", answer,
      "도수분포다각형에서 점의 높이가 가장 높은 계급을 찾는다.",
      labels.filter((_, labelIndex) => labelIndex !== maximumIndex).map((label) => `\\text{${label}}`),
      `frequency-polygon-maximum-${maximumIndex}-${values.join("-")}`,
      { type: "frequency-polygon", values, labels, highlight: maximumIndex });
  }
  if (kind === "total-frequency") {
    const frequencies = [2 + index % 3, 3 + index % 4, 4 + index % 2, 2 + (index + 1) % 4];
    const total = frequencies.reduce((sum, value) => sum + value, 0);
    return make(id, kind,
      `\\begin{array}{c|cccc}\\text{계급}&A&B&C&D\\\\\\hline\\text{도수}&${frequencies.join("&")}\\end{array}`,
      `${total}`,
      "전체 도수는 각 계급의 도수를 모두 더한 값이다.",
      [`${total - frequencies[0]}`, `${total + 1}`, `${frequencies.length}`],
      `total-frequency-${frequencies.join("-")}`);
  }

  if (kind === "relative-frequency") {
    const total = 20 + 5 * (index % 3);
    const frequency = 4 + 2 * (index % 4);
    const answer = fraction(frequency, total);
    return make(id, kind, `\\text{전체 도수}=${total},\\quad \\text{해당 계급의 도수}=${frequency}`, answer,
      `상대도수=\\dfrac{${frequency}}{${total}}로 계산하고 약분한다.`,
      [fraction(total, frequency), fraction(frequency, total - frequency), fraction(frequency + 1, total)],
      `relative-frequency-${frequency}-${total}`);
  }

  if (kind === "missing-frequency") {
    const known = [3 + index % 3, 4 + index % 4, 5 + index % 2];
    const missing = 2 + (index % 5);
    const total = known.reduce((sum, value) => sum + value, 0) + missing;
    return make(id, kind,
      `\\text{전체 도수}=${total},\\quad \\text{도수}=(${known[0]},${known[1]},x,${known[2]})`,
      `${missing}`,
      "전체 도수에서 알려진 세 도수의 합을 뺀다.",
      [`${total}`, `${missing + 1}`, `${known.reduce((sum, value) => sum + value, 0)}`],
      `missing-frequency-${known.join("-")}`);
  }

  if (kind === "relative-percentage") {
    const denominator = [10, 20, 25, 50][index % 4];
    const numerator = denominator / 5;
    const answer = (numerator / denominator) * 100;
    return make(id, kind, `\\text{도수}=${numerator},\\quad \\text{전체 도수}=${denominator}`, `${answer}\\%`,
      "도수를 전체 도수로 나눈 뒤 100을 곱해 백분율로 나타낸다.",
      [`${numerator}\\%`, `${100 - answer}\\%`, `${answer + 10}\\%`],
      `relative-percentage-${numerator}-${denominator}`);
  }

  if (kind === "median") {
    const oddMode = index % 2 === 0;
    const count = oddMode ? 5 : 6;
    const sorted = Array.from({ length: count }, (_, position) => mean + (position - Math.floor(count / 2)) * 2);
    const values = rotate(sorted, index + 2);
    const median = oddMode
      ? sorted[Math.floor(count / 2)]
      : (sorted[count / 2 - 1] + sorted[count / 2]) / 2;
    return make(id, kind, dataLatex(values), `${median}`,
      oddMode
        ? `자료를 작은 순서로 놓고 가운데인 ${Math.floor(count / 2) + 1}번째 값을 찾는다.`
        : `자료를 작은 순서로 놓고 가운데 두 값의 평균을 계산한다.`,
      [`${sorted[0]}`, `${sorted[count - 1]}`, `${median + 2}`],
      oddMode ? "odd-count" : "even-count");
  }

  if (kind === "mode") {
    const mode = mean;
    const values = rotate([
      mode - 3, mode, mode + 2, mode, mode - 1, mode, mode + 4,
      ...(index % 2 === 0 ? [] : [mode + 2]),
    ], index + 1);
    return make(id, kind, dataLatex(values), `${mode}`,
      `${mode}이 가장 많이 나타나므로 최빈값은 ${mode}이다.`,
      [`${mode + 2}`, `${mode - 1}`, `${values.length}`],
      index % 2 === 0 ? "three-occurrences" : "three-vs-two");
  }

  if (kind === "range") {
    const minimum = 3 + index * 2 + integer(next, 0, 2);
    const maximum = minimum + 8 + index * 3;
    const values = rotate([minimum, minimum + 3, maximum - 2, minimum + 5, maximum], index + 1);
    const answer = maximum - minimum;
    return make(id, kind, dataLatex(values), `${answer}`,
      `가장 큰 값 ${maximum}에서 가장 작은 값 ${minimum}을 뺀다.`,
      [`${maximum}`, `${minimum}`, `${maximum + minimum}`]);
  }

  if (kind === "deviations") {
    const pattern = DEVIATION_PATTERNS[index % DEVIATION_PATTERNS.length];
    const values = pattern.map((deviation) => mean + deviation * scale);
    const deviations = values.map((value) => value - mean);
    return make(id, kind, `\\text{평균}=${mean},\\quad ${dataLatex(values)}`, tupleLatex(deviations),
      "각 자료의 값에서 평균을 빼고 주어진 자료의 순서대로 편차를 쓴다.",
      [
        tupleLatex(deviations.map((value) => -value)),
        tupleLatex(values),
        tupleLatex(deviations.map((value) => Math.abs(value))),
      ],
      `deviations-${index % DEVIATION_PATTERNS.length}`);
  }

  if (kind === "variance" || kind === "standard-deviation") {
    const patternIndex = index % SPREAD_PATTERNS.length;
    const values = rotate(spreadData(mean, scale, patternIndex), index + 1);
    const variance = varianceForSpread(scale, patternIndex);
    if (kind === "variance") {
      return make(id, kind, dataLatex(values), `${variance}`,
        `평균 ${mean}에서의 편차를 제곱해 더하고 자료 수 ${values.length}로 나눈다.`,
        [`${scale}`, `${variance * values.length}`, `${variance + scale}`],
        `variance-${patternIndex}`);
    }
    const answer = standardDeviationLatex(scale, patternIndex);
    return make(id, kind, dataLatex(values), answer,
      `분산 ${variance}의 양의 제곱근을 구해 표준편차로 쓴다.`,
      [`${variance}`, `${scale}\\sqrt{${variance}}`, `${variance * variance}`],
      `standard-deviation-${patternIndex}`);
  }

  if (kind === "variance-from-deviations") {
    const patternIndex = index % SPREAD_PATTERNS.length;
    const deviations = SPREAD_PATTERNS[patternIndex].map((value) => value * scale);
    const variance = varianceForSpread(scale, patternIndex);
    return make(id, kind, `\\text{편차}=${tupleLatex(deviations)}`, `${variance}`,
      `편차를 각각 제곱해 더하고 편차의 개수 ${deviations.length}로 나눈다.`,
      [`${scale}`, `${variance * deviations.length}`, `${variance + scale}`],
      `deviation-variance-${patternIndex}`);
  }

  const smallScale = 1 + (index % 3);
  const largeScale = smallScale + 2 + (index % 2);
  const smallFirst = index % 2 === 0;
  const dataA = spreadData(mean, smallFirst ? smallScale : largeScale, 0);
  const dataB = spreadData(mean, smallFirst ? largeScale : smallScale, 0);
  const answer = smallFirst ? "A" : "B";
  return make(id, kind, `A=${dataLatex(dataA)},\\quad B=${dataLatex(dataB)}`, answer,
    `두 자료의 평균은 같으므로 평균에서 덜 떨어진 자료 ${answer}의 분산과 표준편차가 더 작다.`,
    [smallFirst ? "B" : "A", "A=B", "\\text{판단 불가}"],
    smallFirst ? "a-smaller" : "b-smaller");
}

function comprehensiveKind(seed: number, index: number) {
  return MIDDLE_STATISTICS_METHOD_KINDS[
    (seed * 8 + index) % MIDDLE_STATISTICS_METHOD_KINDS.length
  ];
}

const GROUP_METHOD_PLANS: Record<Exclude<MiddleStatisticsKind, "comprehensive">, MiddleStatisticsMethodKind[]> = {
  "representative-values": [
    "mean", "median", "mode", "histogram-frequency",
    "missing-from-mean", "frequency-mean",
    "frequency-polygon-maximum", "relative-frequency",
  ],
  "mean-applications": [
    "mean", "missing-from-mean",
    "frequency-mean", "mean", "missing-from-mean",
    "frequency-mean", "missing-from-mean", "frequency-mean",
  ],
  dispersion: [
    "deviations", "variance",
    "standard-deviation", "variance-from-deviations", "compare-spread",
    "variance", "standard-deviation", "compare-spread",
  ],
};

const LEGACY_KIND_GROUPS: Record<MiddleStatisticsMethodKind, MiddleStatisticsKind> = {
  mean: "representative-values",
  median: "representative-values",
  mode: "representative-values",
  range: "representative-values",
  "missing-from-mean": "mean-applications",
  "frequency-mean": "mean-applications",
  "histogram-frequency": "representative-values",
  "frequency-polygon-maximum": "representative-values",
  "total-frequency": "representative-values",
  "relative-frequency": "representative-values",
  "missing-frequency": "representative-values",
  "relative-percentage": "representative-values",
  deviations: "dispersion",
  variance: "dispersion",
  "standard-deviation": "dispersion",
  "variance-from-deviations": "dispersion",
  "compare-spread": "dispersion",
};

export function isMiddleStatisticsKind(value: string | null): value is MiddleStatisticsKind {
  return MIDDLE_STATISTICS_KINDS.includes(value as MiddleStatisticsKind);
}

export function resolveMiddleStatisticsKind(value: string | null): MiddleStatisticsKind | null {
  if (isMiddleStatisticsKind(value)) return value;
  if (MIDDLE_STATISTICS_METHOD_KINDS.includes(value as MiddleStatisticsMethodKind)) {
    return LEGACY_KIND_GROUPS[value as MiddleStatisticsMethodKind];
  }
  return null;
}

export function createMiddleStatisticsProblemSet(kind: MiddleStatisticsKind, seed: number) {
  const next = random(seed);
  return {
    seed,
    kind,
    problems: Array.from({ length: 8 }, (_, index) => {
      const actualKind = kind === "comprehensive"
        ? comprehensiveKind(seed, index)
        : GROUP_METHOD_PLANS[kind][index];
      return {
        ...build(actualKind, next, `middle-statistics-${kind}-${index}`, index),
        difficulty: difficultyForIndex(index),
      };
    }),
  };
}

export function createMiddleStatisticsReviewProblems(
  wrongKinds: MiddleStatisticsMethodKind[],
  seed: number,
) {
  const uniqueKinds = [...new Set(wrongKinds)].slice(0, 2);
  const next = random(seed);
  return uniqueKinds.map((kind, index) => {
    return {
      ...build(kind, next, `middle-statistics-review-${seed}-${index}`, 6 + index),
      difficulty: "advanced" as const,
    };
  });
}
