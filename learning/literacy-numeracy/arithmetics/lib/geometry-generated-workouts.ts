import type { GeometryChoiceItem } from "../app/arithmetic/high-school/components/geometry-choice-worksheet";

type Next = () => number;

function rng(seed: number): Next {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 0x100000000;
  };
}

function integer(next: Next, min: number, max: number) {
  return min + Math.floor(next() * (max - min + 1));
}

function nonzero(next: Next, min = -6, max = 6) {
  let value = 0;
  while (value === 0) value = integer(next, min, max);
  return value;
}

function greatestCommonDivisor(left: number, right: number) {
  let a = Math.abs(left);
  let b = Math.abs(right);
  while (b !== 0) [a, b] = [b, a % b];
  return a;
}

function fractionLatex(numerator: number, denominator: number) {
  if (denominator === 0) throw new Error("분모는 0일 수 없습니다.");
  if (numerator === 0) return "0";
  const sign = numerator * denominator < 0 ? "-" : "";
  const divisor = greatestCommonDivisor(numerator, denominator);
  const absoluteNumerator = Math.abs(numerator) / divisor;
  const absoluteDenominator = Math.abs(denominator) / divisor;
  return absoluteDenominator === 1
    ? `${sign}${absoluteNumerator}`
    : `${sign}\\frac{${absoluteNumerator}}{${absoluteDenominator}}`;
}

function signed(value: number) {
  return value < 0 ? `${value}` : `+${value}`;
}

function shifted(variable: string, value: number) {
  if (value === 0) return variable;
  return `(${variable}${signed(-value)})`;
}

function signedTerm(value: number, variable = "") {
  if (value === 0) return "";
  const magnitude = Math.abs(value);
  return `${value < 0 ? "-" : "+"}${magnitude === 1 && variable ? "" : magnitude}${variable}`;
}

function coordinateTriple(x: number, y: number, z: number, denominator = 1) {
  return `\\left(${fractionLatex(x, denominator)},${fractionLatex(y, denominator)},${fractionLatex(z, denominator)}\\right)`;
}

function coordinatePair(x: number, y: number, denominator = 1) {
  return `\\left(${fractionLatex(x, denominator)},${fractionLatex(y, denominator)}\\right)`;
}

function choiceList(id: string, answer: string, distractors: string[]) {
  const unique = [...new Set([answer, ...distractors.filter((value) => value !== answer)])].slice(0, 4);
  if (unique.length < 4) throw new Error(`${id}: 실제 오답 후보가 3개보다 적습니다.`);
  return unique.map((latex, index) => ({ id: `${id}-${index}`, latex, correct: index === 0 }));
}

function item(id: string, label: string, latex: string, answer: string, distractors: string[], prompt?: string, visualVariant?: string): GeometryChoiceItem {
  return { id, label, prompt, latex, correctLatex: answer, choices: choiceList(id, answer, distractors), visualVariant };
}

export function createConicProblems(seed: number): GeometryChoiceItem[] {
  const next = rng(seed);
  const a = integer(next, 4, 8);
  const b = integer(next, 2, a - 1);
  const a2 = a * a;
  const b2 = b * b;
  const c2 = a2 - b2;
  const p = integer(next, 2, 6);
  const t = integer(next, 2, 4);
  const h = nonzero(next, -4, 4);
  const k = nonzero(next, -4, 4);
  return [
    item("c1", "타원의 초점", `\\frac{x^2}{${a2}}+\\frac{y^2}{${b2}}=1`, `(\\pm\\sqrt{${c2}},0)`, [`(0,\\pm\\sqrt{${c2}})`, `(\\pm${a},0)`, `(\\pm\\sqrt{${a2 + b2}},0)`]),
    item("c2", "쌍곡선의 초점", `\\frac{x^2}{${a2}}-\\frac{y^2}{${b2}}=1`, `(\\pm\\sqrt{${a2 + b2}},0)`, [`(\\pm${a},0)`, `(0,\\pm${b})`, `(\\pm\\sqrt{${c2}},0)`]),
    item("c3", "포물선의 계수 계산", `y^2=4qx,\\quad P(${p * t * t},${2 * p * t})`, `q=${p}`, [`q=${p + 1}`, `q=${p + 2}`, `q=${p + 3}`], "점 $P$를 지나는 포물선의 $q$는?"),
    item("c4", "타원의 중심 계산", `\\frac{x^2${signedTerm(-2 * h, "x")}${signedTerm(h * h)}}{${a2}}+\\frac{y^2${signedTerm(-2 * k, "y")}${signedTerm(k * k)}}{${b2}}=1`, `(${h},${k})`, [`(${-h},${-k})`, `(${k},${h})`, `(${-h},${k})`, `(${h},${-k})`, `(${-k},${h})`], "완전제곱식으로 고쳐 구한 중심은?"),
    item("c5", "타원의 이심률", `\\frac{x^2}{${a2}}+\\frac{y^2}{${b2}}=1,\\quad e=?`, `\\frac{\\sqrt{${c2}}}{${a}}`, [`\\frac{${b}}{${a}}`, `\\frac{${a}}{\\sqrt{${c2}}}`, `\\frac{\\sqrt{${c2}}}{${b}}`]),
    item("c6", "쌍곡선의 점근선 계산", `${b2}x^2${signedTerm(-2 * b2 * h, "x")}${signedTerm(b2 * h * h)}${signedTerm(-a2, "y^2")}${signedTerm(2 * a2 * k, "y")}${signedTerm(-a2 * k * k)}=${a2 * b2}`, `${shifted("y", k)}=\\pm${fractionLatex(b, a)}${shifted("x", h)}`, [`${shifted("y", k)}=\\pm${fractionLatex(a, b)}${shifted("x", h)}`, `${shifted("y", -k)}=\\pm${fractionLatex(b, a)}${shifted("x", -h)}`, `${shifted("y", k)}=\\pm${fractionLatex(b, a)}${shifted("x", -h)}`], "완전제곱식으로 고쳐 구한 두 점근선은?"),
    item("c7", "평행이동한 포물선의 준선", `x^2${signedTerm(-2 * h, "x")}${signedTerm(h * h)}=${-4 * p}${shifted("y", k)}`, `y=${k + p}`, [`y=${k - p}`, `x=${h + p}`, `x=${h - p}`, `y=${p}`, `y=${-p}`], "완전제곱식으로 고쳐 구한 준선은?"),
  ];
}

export function createConicMoveTangentProblems(seed: number): GeometryChoiceItem[] {
  const next = rng(seed);
  const m = integer(next, 1, 3);
  const n = integer(next, 1, 3);
  const h = nonzero(next, -4, 4);
  const k = nonzero(next, -4, 4);
  const p = integer(next, 2, 5);
  const t = integer(next, 2, 4);
  const ellipseA2 = 25 * m * m;
  const ellipseB2 = 25 * n * n;
  const hyperbolaA2 = 9 * m * m;
  const hyperbolaB2 = 9 * n * n;
  const movedEllipse = `\\frac{${shifted("x", h)}^2}{${ellipseA2}}+\\frac{${shifted("y", k)}^2}{${ellipseB2}}=1`;
  return [
    item("t1", "타원의 일반점에서의 접선", `\\frac{x^2}{${ellipseA2}}+\\frac{y^2}{${ellipseB2}}=1,\\quad P(${3 * m},${4 * n})`, `\\frac{3x}{${25 * m}}+\\frac{4y}{${25 * n}}=1`, [`\\frac{3x}{${5 * m}}+\\frac{4y}{${5 * n}}=1`, `\\frac{4x}{${25 * m}}+\\frac{3y}{${25 * n}}=1`, `\\frac{3x}{${25 * m}}-\\frac{4y}{${25 * n}}=1`]),
    item("t2", "타원의 다른 일반점에서의 접선", `\\frac{x^2}{${ellipseA2}}+\\frac{y^2}{${ellipseB2}}=1,\\quad P(${4 * m},${3 * n})`, `\\frac{4x}{${25 * m}}+\\frac{3y}{${25 * n}}=1`, [`\\frac{3x}{${25 * m}}+\\frac{4y}{${25 * n}}=1`, `\\frac{4x}{${5 * m}}+\\frac{3y}{${5 * n}}=1`, `\\frac{4x}{${25 * m}}-\\frac{3y}{${25 * n}}=1`]),
    item("t3", "쌍곡선의 일반점에서의 접선", `\\frac{x^2}{${hyperbolaA2}}-\\frac{y^2}{${hyperbolaB2}}=1,\\quad P(${5 * m},${4 * n})`, `\\frac{5x}{${9 * m}}-\\frac{4y}{${9 * n}}=1`, [`\\frac{5x}{${9 * m}}+\\frac{4y}{${9 * n}}=1`, `\\frac{4x}{${9 * m}}-\\frac{5y}{${9 * n}}=1`, `\\frac{5x}{${3 * m}}-\\frac{4y}{${3 * n}}=1`]),
    item("t4", "포물선의 매개변수 접선", `y^2=${4 * p}x,\\quad P(${p * t * t},${2 * p * t})`, `${t}y=x+${p * t * t}`, [`${t}y=x-${p * t * t}`, `y=${t}x+${p * t * t}`, `${t}x=y+${p * t * t}`]),
    item("t5", "세로 포물선의 매개변수 접선", `x^2=${4 * p}y,\\quad P(${2 * p * t},${p * t * t})`, `${t}x=y+${p * t * t}`, [`${t}x=y-${p * t * t}`, `x=${t}y+${p * t * t}`, `${t}y=x+${p * t * t}`]),
    item("t6", "평행이동한 타원의 접선", `${movedEllipse},\\quad P(${h + 3 * m},${k + 4 * n})`, `\\frac{3${shifted("x", h)}}{${25 * m}}+\\frac{4${shifted("y", k)}}{${25 * n}}=1`, [`\\frac{3${shifted("x", -h)}}{${25 * m}}+\\frac{4${shifted("y", -k)}}{${25 * n}}=1`, `\\frac{3${shifted("x", h)}}{${5 * m}}+\\frac{4${shifted("y", k)}}{${5 * n}}=1`, `\\frac{4${shifted("x", h)}}{${25 * m}}+\\frac{3${shifted("y", k)}}{${25 * n}}=1`]),
    item("t7", "평행이동한 포물선의 접선", `${shifted("y", k)}^2=${4 * p}${shifted("x", h)},\\quad P(${h + p * t * t},${k + 2 * p * t})`, `${t}${shifted("y", k)}=${shifted("x", h)}+${p * t * t}`, [`${t}${shifted("y", k)}=${shifted("x", h)}-${p * t * t}`, `${shifted("y", k)}=${t}${shifted("x", h)}+${p * t * t}`, `${t}${shifted("x", h)}=${shifted("y", k)}+${p * t * t}`]),
  ];
}

export function createPlaneVectorProblems(seed: number): GeometryChoiceItem[] {
  const next = rng(seed);
  const ax = nonzero(next), ay = nonzero(next), bx = nonzero(next), by = nonzero(next);
  const scale = integer(next, 2, 4);
  const ratio = integer(next, 1, 3);
  return [
    item("v1", "벡터의 합", `(${ax},${ay})+(${bx},${by})=?`, `(${ax + bx},${ay + by})`, [`(${ax - bx},${ay - by})`, `(${ax + bx},${ay - by})`, `(${bx - ax},${by - ay})`, `(${ax - bx},${ay + by})`, `(${-ax - bx},${ay + by})`]),
    item("v2", "벡터의 크기", `\\left|(${3 * scale},${4 * scale})\\right|=?`, `${5 * scale}`, [`${7 * scale}`, `${25 * scale}`, `${scale}`]),
    item("v3", "실수배와 합", `${scale}(${ax},${ay})-(${bx},${by})=?`, `(${scale * ax - bx},${scale * ay - by})`, [`(${scale * ax + bx},${scale * ay + by})`, `(${ax - scale * bx},${ay - scale * by})`, `(${scale * ax - bx},${scale * ay + by})`, `(${scale * ax + bx},${scale * ay - by})`, `(${ax - bx},${ay - by})`]),
    item("v4", "단위벡터", `\\vec a=(${3 * scale},${4 * scale}),\\quad \\frac{\\vec a}{|\\vec a|}=?`, `\\left(\\frac35,\\frac45\\right)`, [`(${3 * scale},${4 * scale})`, `\\left(\\frac45,\\frac35\\right)`, `\\left(\\frac15,\\frac15\\right)`]),
    item("v5", "평행 조건", `(k,${scale * by})\\parallel(${bx},${by}),\\quad k=?`, `k=${scale * bx}`, [`k=${bx}`, `k=${scale * by}`, `k=${-scale * bx}`, `k=${scale * bx + by}`, `k=${scale * bx - by}`]),
    item("v6", "위치벡터", `\\overrightarrow{OA}=(${ax},${ay}),\\quad\\overrightarrow{AB}=(${bx},${by}),\\quad\\overrightarrow{OB}=?`, `(${ax + bx},${ay + by})`, [`(${ax - bx},${ay - by})`, `(${bx - ax},${by - ay})`, `(${ax + bx},${ay - by})`, `(${ax - bx},${ay + by})`, `(${-ax - bx},${-ay - by})`]),
    item("v7", "내분점의 위치벡터 계산", `AP:PB=${ratio}:1,\\quad\\vec a=(${ax},${ay}),\\quad\\vec b=(${bx},${by})`, `\\vec p=${coordinatePair(ax + ratio * bx, ay + ratio * by, ratio + 1)}`, [`\\vec p=${coordinatePair(ratio * ax + bx, ratio * ay + by, ratio + 1)}`, `\\vec p=${coordinatePair(ax + ratio * bx + ratio + 1, ay + ratio * by, ratio + 1)}`, `\\vec p=${coordinatePair(ax + ratio * bx, ay + ratio * by + ratio + 1, ratio + 1)}`, `\\vec p=${coordinatePair(ax + ratio * bx + ratio + 1, ay + ratio * by + ratio + 1, ratio + 1)}`], "내분점 $P$의 위치벡터를 계산하면?"),
  ];
}

export function createProjectionProblems(seed: number): GeometryChoiceItem[] {
  const next = rng(seed);
  const ax = nonzero(next), ay = nonzero(next), bx = nonzero(next), by = nonzero(next);
  const dot = ax * bx + ay * by;
  const perpendicularX = by;
  const perpendicularY = -bx;
  const scale = integer(next, 2, 5);
  const projectionFactorNumerator = dot;
  const projectionFactorDenominator = bx * bx + by * by;
  const triples = [[3, 4, 5], [5, 12, 13], [8, 15, 17]] as const;
  const [angleX, angleY, angleLength] = triples[integer(next, 0, triples.length - 1)];
  const orthogonalScale = integer(next, 1, 3);
  const scalarX = 3 * scale + 4 * orthogonalScale;
  const scalarY = 4 * scale - 3 * orthogonalScale;
  const projectionXNumerator = projectionFactorNumerator * bx;
  const projectionYNumerator = projectionFactorNumerator * by;
  const perpendicularXNumerator = ax * projectionFactorDenominator - projectionXNumerator;
  const perpendicularYNumerator = ay * projectionFactorDenominator - projectionYNumerator;
  return [
    item("p1", "내적", `\\vec a=(${ax},${ay}),\\quad\\vec b=(${bx},${by}),\\quad\\vec a\\cdot\\vec b=?`, `${dot}`, [`${ax * bx - ay * by}`, `${ax + ay + bx + by}`, `${-dot}`, `${ax * by + ay * bx}`, `${ax * bx}`, `${ay * by}`]),
    item("p2", "수직 조건", `(k,${scale})\\perp(${perpendicularX},${perpendicularY}),\\quad k=?`, `k=${fractionLatex(scale * bx, by)}`, [`k=${fractionLatex(-scale * bx, by)}`, `k=${scale}`, `k=${perpendicularX}`, `k=${fractionLatex(-scale * by, bx)}`, `k=${scale * perpendicularX}`, `k=${-scale}`, "k=0"]),
    item("p3", "두 벡터가 이루는 각 계산", `\\vec a=(1,0),\\quad\\vec b=(${angleX},${angleY}),\\quad\\cos\\theta=?`, `\\frac{${angleX}}{${angleLength}}`, [`\\frac{${angleY}}{${angleLength}}`, `\\frac{${angleX}}{${angleY}}`, `\\frac{${angleLength}}{${angleX}}`]),
    item("p4", "스칼라 정사영 계산", `\\vec a=(${scalarX},${scalarY}),\\quad\\vec b=(3,4),\\quad\\frac{\\vec a\\cdot\\vec b}{|\\vec b|}=?`, `${5 * scale}`, [`${3 * scale}`, `${4 * scale}`, `${25 * scale}`]),
    item("p5", "벡터 정사영 계산", `\\vec a=(${ax},${ay}),\\quad\\vec b=(${bx},${by}),\\quad\\mathrm{proj}_{\\vec b}\\vec a=?`, coordinatePair(projectionXNumerator, projectionYNumerator, projectionFactorDenominator), [coordinatePair(projectionXNumerator + projectionFactorDenominator, projectionYNumerator, projectionFactorDenominator), coordinatePair(projectionXNumerator, projectionYNumerator + projectionFactorDenominator, projectionFactorDenominator), coordinatePair(projectionXNumerator + projectionFactorDenominator, projectionYNumerator + projectionFactorDenominator, projectionFactorDenominator)]),
    item("p6", "수직 성분 계산", `\\vec a=(${ax},${ay}),\\quad\\vec b=(${bx},${by}),\\quad\\vec a_{\\perp}=?`, coordinatePair(perpendicularXNumerator, perpendicularYNumerator, projectionFactorDenominator), [coordinatePair(perpendicularXNumerator + projectionFactorDenominator, perpendicularYNumerator, projectionFactorDenominator), coordinatePair(perpendicularXNumerator, perpendicularYNumerator + projectionFactorDenominator, projectionFactorDenominator), coordinatePair(perpendicularXNumerator + projectionFactorDenominator, perpendicularYNumerator + projectionFactorDenominator, projectionFactorDenominator)]),
    item("p7", "좌표축과 이루는 각", `\\vec a=(${3 * scale},${4 * scale}),\\quad\\cos\\angle(\\vec a,\\ x\\text{축})=?`, `\\frac35`, [`\\frac45`, `\\frac34`, `\\frac53`], "$\\cos\\angle(\\vec a, x\\text{축})$는?"),
  ];
}

export function createVectorGeometryProblems(seed: number): GeometryChoiceItem[] {
  const next = rng(seed);
  const a = nonzero(next), b = nonzero(next), c = nonzero(next);
  const px = nonzero(next), py = nonzero(next);
  const dx = nonzero(next), dy = nonzero(next);
  const distanceNumerator = Math.abs(a * px + b * py + c);
  const lineScale = integer(next, 2, 5);
  const triangleX = nonzero(next);
  const triangleY = nonzero(next);
  const determinant = Math.abs(triangleX * dy - triangleY * dx);
  const triangleArea = fractionLatex(determinant, 2);
  return [
    item("g1", "직선의 기울기 계산", `${a}x${signed(b)}y${signed(c)}=0,\\quad m=?`, `m=${fractionLatex(-a, b)}`, [`m=${fractionLatex(a, b)}`, `m=${fractionLatex(-b, a)}`, `m=${fractionLatex(b, a)}`, "m=0", "m=2", "m=-2"]),
    item("g2", "법선벡터의 크기 계산", `\\vec n=(${a},${b}),\\quad |\\vec n|=?`, `\\sqrt{${a * a + b * b}}`, [`${a * a + b * b}`, `\\sqrt{${a * a + b * b + 1}}`, `${Math.abs(a) + Math.abs(b)}`]),
    item("g3", "직선 위 점의 좌표 계산", `(x,y)=(${px},${py})+t(${dx},${dy}),\\quad t=${lineScale}`, `(${px + lineScale * dx},${py + lineScale * dy})`, [`(${px - lineScale * dx},${py - lineScale * dy})`, `(${px + dx},${py + dy})`, `(${px + lineScale * dy},${py + lineScale * dx})`, `(${lineScale * dx},${lineScale * dy})`]),
    item("g4", "점과 직선 사이의 거리", `P(${px},${py}),\\quad ${a}x${signed(b)}y${signed(c)}=0`, `\\frac{${distanceNumerator}}{\\sqrt{${a * a + b * b}}}`, [`\\frac{${distanceNumerator}}{${a * a + b * b}}`, `${distanceNumerator}`, `\\sqrt{${a * a + b * b}}`]),
    item("g5", "삼각형의 넓이 계산", `\\overrightarrow{AB}=(${triangleX},${triangleY}),\\quad\\overrightarrow{AC}=(${dx},${dy})`, triangleArea, [fractionLatex(determinant + 2, 2), fractionLatex(determinant + 4, 2), `${determinant + 3}`]),
    item("g6", "좌표축까지 거리의 합", `P(${px},${py}),\\quad d_x+d_y=?`, `${Math.abs(px) + Math.abs(py)}`, [`${Math.abs(px)}`, `${Math.abs(py)}`, `\\sqrt{${px * px + py * py}}`, `${Math.abs(px) + Math.abs(py) + 1}`], "$P$에서 두 좌표축까지 거리의 합은?"),
    item("g7", "두 직선의 수직 조건", `\\vec d_1=(${dx},${dy}),\\quad\\vec d_2=(k,${dx}),\\quad\\vec d_1\\perp\\vec d_2`, `k=${-dy}`, [`k=${dy}`, `k=${dx}`, `k=${-dx}`, "k=0", `k=${dx + dy}`, `k=${dx - dy}`]),
  ];
}

export function createSpaceCoordinateProblems(seed: number): GeometryChoiceItem[] {
  const next = rng(seed);
  const ax = nonzero(next), ay = nonzero(next), az = nonzero(next);
  const dx = nonzero(next, -4, 4), dy = nonzero(next, -4, 4), dz = nonzero(next, -4, 4);
  const bx = ax + dx, by = ay + dy, bz = az + dz;
  const cx = nonzero(next), cy = nonzero(next), cz = nonzero(next);
  const radius = integer(next, 2, 7);
  const ratio = integer(next, 2, 4);
  const sphereConstant = cx * cx + cy * cy + cz * cz - radius * radius;
  const generalSphere = `x^2+y^2+z^2${signedTerm(-2 * cx, "x")}${signedTerm(-2 * cy, "y")}${signedTerm(-2 * cz, "z")}${signedTerm(sphereConstant)}=0`;
  const planeIndex = integer(next, 0, 2);
  const planeNames = ["xy", "xz", "yz"];
  const tangentRadius = Math.abs([cz, cy, cx][planeIndex]);
  const tangentSphere = `${shifted("x", cx)}^2+${shifted("y", cy)}^2+${shifted("z", cz)}^2=${tangentRadius * tangentRadius}`;
  const planeCenteredSphere = [
    `${shifted("x", cx)}^2+${shifted("y", cy)}^2+z^2=${tangentRadius * tangentRadius}`,
    `${shifted("x", cx)}^2+y^2+${shifted("z", cz)}^2=${tangentRadius * tangentRadius}`,
    `x^2+${shifted("y", cy)}^2+${shifted("z", cz)}^2=${tangentRadius * tangentRadius}`,
  ][planeIndex];
  const reflected = [
    [ax, ay, -az],
    [ax, -ay, az],
    [-ax, ay, az],
  ][planeIndex];
  const reflectionDistance = 2 * Math.abs([az, ay, ax][planeIndex]);
  const equalityCoordinate = nonzero(next, -5, 5);
  const equalityOffset = nonzero(next, -4, 4);
  return [
    item("s1", "공간에서 두 점 사이의 거리", `A(${ax},${ay},${az}),\\quad B(${bx},${by},${bz})`, `\\sqrt{${dx * dx + dy * dy + dz * dz}}`, [`\\sqrt{${Math.abs(dx) + Math.abs(dy) + Math.abs(dz)}}`, `${dx * dx + dy * dy + dz * dz}`, `\\sqrt{${dx * dx + dy * dy}}`, `\\sqrt{${dx * dx + dz * dz}}`, `\\sqrt{${dy * dy + dz * dz}}`, `${Math.abs(dx) + Math.abs(dy) + Math.abs(dz)}`, `\\max\\{${Math.abs(dx)},${Math.abs(dy)},${Math.abs(dz)}\\}`]),
    item("s2", "선분의 중점", `A(${ax},${ay},${az}),\\quad B(${bx},${by},${bz})`, coordinateTriple(ax + bx, ay + by, az + bz, 2), [coordinateTriple(ax + bx + 2, ay + by, az + bz, 2), `(${ax},${ay},${az})`, `(${bx},${by},${bz})`]),
    item("s3", "내분점의 좌표", `AP:PB=${ratio}:1,\\quad A(${ax},${ay},${az}),\\quad B(${bx},${by},${bz})`, `P=${coordinateTriple(ax + ratio * bx, ay + ratio * by, az + ratio * bz, ratio + 1)}`, [`P=${coordinateTriple(ratio * ax + bx, ratio * ay + by, ratio * az + bz, ratio + 1)}`, `P=(${ax},${ay},${az})`, `P=(${bx},${by},${bz})`, `P=${coordinateTriple(ax + bx, ay + by, az + bz, 2)}`], "내분점 $P$의 좌표는?"),
    item("s4", "구의 중심과 반지름", generalSphere, `C=(${cx},${cy},${cz}),\\quad r=${radius}`, [`C=(${-cx},${-cy},${-cz}),\\quad r=${radius}`, `C=(${cx},${cy},${cz}),\\quad r=${radius * radius}`, `C=(${2 * cx},${2 * cy},${2 * cz}),\\quad r=${radius}`, `C=(${cx},${cy},${cz}),\\quad r=\\sqrt{${cx * cx + cy * cy + cz * cz + radius * radius}}`], "완전제곱식으로 고쳐 구한 중심과 반지름은?"),
    item("s5", "좌표평면에 접하는 구", `C=(${cx},${cy},${cz}),\\quad ${planeNames[planeIndex]}\\text{평면에 접한다}`, tangentSphere, [`${shifted("x", -cx)}^2+${shifted("y", -cy)}^2+${shifted("z", -cz)}^2=${tangentRadius * tangentRadius}`, `${shifted("x", cx)}^2+${shifted("y", cy)}^2+${shifted("z", cz)}^2=${(tangentRadius + 1) * (tangentRadius + 1)}`, planeCenteredSphere], "구의 방정식은?"),
    item("s6", "좌표평면 대칭점 사이의 거리", `P(${ax},${ay},${az})\\text{의 }${planeNames[planeIndex]}\\text{평면 대칭점을 }Q(${reflected.join(",")})\\text{라 하자}`, `PQ=${reflectionDistance}`, [`PQ=${Math.abs([az, ay, ax][planeIndex])}`, `PQ=${reflectionDistance + 1}`, `PQ=${reflectionDistance + 2}`, `PQ=${reflectionDistance * 2}`], "$PQ$는?"),
    item("s7", "등거리 조건", `P=(0,t,${equalityOffset}),\\quad A=(${Math.abs(equalityOffset)},0,${equalityOffset}),\\quad B=(${-Math.abs(equalityOffset)},${2 * equalityCoordinate},${equalityOffset}),\\quad PA=PB`, `t=${equalityCoordinate}`, [`t=${-equalityCoordinate}`, `t=${2 * equalityCoordinate}`, "t=0", `t=${equalityCoordinate + 1}`, `t=${equalityCoordinate - 1}`], "$t$는?"),
  ];
}

export function createSpaceGeometryProjectionProblems(seed: number): GeometryChoiceItem[] {
  const next = rng(seed);
  const scale = integer(next, 2, 5);
  const hx = nonzero(next, -4, 4);
  const hy = nonzero(next, -4, 4);
  const hz = nonzero(next, -4, 4);
  const distanceScale = integer(next, 1, 4);
  const projectionScale = integer(next, 1, 4);
  const perpendicularScale = integer(next, 1, 3);
  const planeConstant = hx + 2 * hy + 2 * hz;
  const pointX = hx + distanceScale;
  const pointY = hy + 2 * distanceScale;
  const pointZ = hz + 2 * distanceScale;
  const projectionX = 3 * projectionScale + 4 * perpendicularScale;
  const projectionY = 4 * projectionScale - 3 * perpendicularScale;
  const projectionZ = nonzero(next, -4, 4);
  const originalArea = 12 * scale;
  const projectedArea = originalArea / 2;
  const angleTriples = [[3, 4, 5], [5, 12, 13], [8, 15, 17]] as const;
  const [angleX, angleY, angleLength] = angleTriples[integer(next, 0, angleTriples.length - 1)];
  const threePerpendicularScale = integer(next, 1, 3);
  return [
    item("sg1", "두 직선이 이루는 각 계산", `\\begin{gathered}\\ell_1:\\vec x=(1,0,0)+s(${angleLength},0,0)\\\\[4pt]\\ell_2:\\vec x=(0,1,0)+t(${angleX},${angleY},0)\\end{gathered}`, `\\cos\\theta=\\frac{${angleX}}{${angleLength}}`, [`\\cos\\theta=\\frac{${angleY}}{${angleLength}}`, `\\cos\\theta=\\frac{${angleX}}{${angleY}}`, `\\cos\\theta=\\frac{${angleLength}}{${angleX}}`], "두 직선이 이루는 각 $\\theta$의 $\\cos\\theta$는?", "space-lines-angle"),
    item("sg3", "두 평면이 이루는 각 계산", `\\begin{gathered}\\alpha:${angleLength}x=${scale * angleLength}\\\\[4pt]\\beta:${angleX}x+${angleY}y=${2 * scale}\\end{gathered}`, `\\cos\\theta=\\frac{${angleX}}{${angleLength}}`, [`\\cos\\theta=\\frac{${angleY}}{${angleLength}}`, `\\cos\\theta=\\frac{${angleX}}{${angleY}}`, `\\cos\\theta=\\frac{${angleLength}}{${angleX}}`], "두 평면이 이루는 각 $\\theta$의 $\\cos\\theta$는?", "space-planes-angle"),
    item("sg4", "점과 평면 사이의 거리", `\\begin{gathered}P(${pointX},${pointY},${pointZ})\\\\[4pt]\\alpha:x+2y+2z=${planeConstant}\\end{gathered}`, `${3 * distanceScale}`, [`${distanceScale}`, `${9 * distanceScale}`, `\\sqrt{${3 * distanceScale}}`], "점 P와 평면 α 사이의 거리는?", "space-point-plane-distance"),
    item("sg5", "평행한 두 평면 사이의 거리", `\\begin{gathered}\\alpha:x+2y+2z=${planeConstant}\\\\[4pt]\\beta:x+2y+2z=${planeConstant + 3 * scale}\\end{gathered}`, `${scale}`, [`${3 * scale}`, `${9 * scale}`, `\\frac{${scale}}{3}`], "두 평면 사이의 거리는?", "space-parallel-planes"),
    item("sg6", "평면에 내린 수선의 발", `\\begin{gathered}P(${pointX},${pointY},${pointZ})\\\\[4pt]\\alpha:x+2y+2z=${planeConstant}\\end{gathered}`, `H=(${hx},${hy},${hz})`, [`H=(${pointX},${pointY},${pointZ})`, `H=(${hx},${hy},${pointZ})`, `H=(${-hx},${-hy},${-hz})`, `H=(${pointX},${hy},${hz})`, `H=(${hx},${pointY},${hz})`], "수선의 발 H의 좌표는?", "space-perpendicular-foot"),
    item("sg7", "직선 방향으로의 벡터 정사영", `\\begin{gathered}\\vec a=(${projectionX},${projectionY},${projectionZ})\\\\[4pt]\\vec b=(3,4,0)\\end{gathered}`, `(${3 * projectionScale},${4 * projectionScale},0)`, [`(${projectionX},${projectionY},0)`, `(${4 * projectionScale},${3 * projectionScale},0)`, `(${-3 * projectionScale},${-4 * projectionScale},0)`], "$\\mathrm{proj}_{\\vec b}\\vec a$는?", "space-vector-projection"),
    item("sg8", "평면도형의 정사영 넓이", `\\begin{gathered}S=${originalArea}\\\\[4pt]\\theta=60^\\circ\\end{gathered}`, `${projectedArea}`, [`${originalArea}`, `${originalArea * 2}`, `${originalArea * 3 / 2}`], "정사영의 넓이는?", "space-area-projection"),
    item("sg9", "삼수선과 거리 계산", `\\begin{gathered}PH\\perp\\alpha,\\quad HA\\perp AB\\\\[3pt]PH=${3 * threePerpendicularScale},\\quad HA=${4 * threePerpendicularScale},\\quad AB=${12 * threePerpendicularScale}\\end{gathered}`, `PB=${13 * threePerpendicularScale}`, [`PB=${12 * threePerpendicularScale}`, `PB=${17 * threePerpendicularScale}`, `PB=${5 * threePerpendicularScale}`], "삼수선의 정리와 피타고라스 정리로 구한 $PB$는?", "space-three-perpendiculars"),
  ];
}
