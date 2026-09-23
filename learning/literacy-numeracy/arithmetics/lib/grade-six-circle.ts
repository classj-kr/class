export type CircleCompositeKind =
  | "square-yin-yang"
  | "offset-half-circle"
  | "inward-semicircle-square"
  | "double-circle-rectangle"
  | "quarter-annulus"
  | "annulus"
  | "one-sixth-sector"
  | "circle-square-hole"
  | "semicircle-circle-hole"
  | "square-semicircle-hole"
  | "circle-yin-yang"
  | "square-top-bottom-cutouts"
  | "eccentric-circle-hole"
  | "corner-quarter-shading"
  | "square-circle-hole"
  | "semicircle-side-hole";

export type CircleProblem = {
  id: string;
  kind: CircleCompositeKind;
  unit: "cm";
  dimensions: Record<string, number>;
  perimeter: number;
  area: number;
};

const PI = 3.14;

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

function integer(next: () => number, minimum: number, maximum: number) {
  return minimum + Math.floor(next() * (maximum - minimum + 1));
}

function even(next: () => number, minimum: number, maximum: number) {
  return integer(next, Math.ceil(minimum / 2), Math.floor(maximum / 2)) * 2;
}

function rounded(value: number) {
  return Number(value.toFixed(2));
}

function shuffle<T>(values: readonly T[], next: () => number) {
  const result = [...values];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(next() * (index + 1));
    [result[index], result[swap]] = [result[swap], result[index]];
  }
  return result;
}

function problem(kind: CircleCompositeKind, dimensions: Record<string, number>, perimeter: number, area: number): CircleProblem {
  return { id: "grade-six-circle-" + kind, kind, unit: "cm", dimensions, perimeter: rounded(perimeter), area: rounded(area) };
}

export function createGradeSixCircleSet(seed: number): CircleProblem[] {
  const next = random(seed);
  const squareYinRadius = integer(next, 5, 9);
  const offset = integer(next, 4, 7);
  const offsetInner = integer(next, 3, 6);
  const offsetOuter = offset + offsetInner;
  const inwardSide = even(next, 14, 24);
  const doubleRadius = integer(next, 3, 6);
  const quarterOuter = integer(next, 9, 15);
  const quarterInner = integer(next, 3, quarterOuter - 4);
  const annulusInner = integer(next, 2, 5);
  const annulusWidth = integer(next, 3, 7);
  const annulusOuter = annulusInner + annulusWidth;
  const sectorRadius = integer(next, 4, 10);
  const inscribedRadius = integer(next, 5, 10);
  const inscribedSide = integer(next, inscribedRadius, Math.floor(inscribedRadius * 1.3));
  const semicircleCircleRadius = even(next, 8, 16);
  const semicircleHoleRadius = semicircleCircleRadius / 2;
  const squareSemicircleSide = even(next, 12, 24);
  const circleYinRadius = even(next, 6, 14);
  const topBottomSide = even(next, 12, 24);
  const eccentricOuter = even(next, 8, 18);
  const eccentricInner = eccentricOuter / 2;
  const cornerSide = even(next, 12, 24);
  const cornerRadius = cornerSide / 2;
  const squareHoleSide = even(next, 10, 22);
  const squareHoleRadius = squareHoleSide / 2;
  const sideHoleRadius = even(next, 8, 18);
  const smallSideHoleRadius = sideHoleRadius / 2;

  return shuffle([
    problem("square-yin-yang", { radius: squareYinRadius }, 8 * squareYinRadius + 2 * PI * squareYinRadius, 4 * squareYinRadius ** 2 - PI * squareYinRadius ** 2 / 2),
    problem("offset-half-circle", { offset, innerRadius: offsetInner, outerRadius: offsetOuter }, PI * offsetOuter + 2 * offsetOuter + 2 * PI * offsetInner, PI * offsetOuter ** 2 / 2),
    problem("inward-semicircle-square", { side: inwardSide }, PI * inwardSide, inwardSide ** 2 - PI * inwardSide ** 2 / 4),
    problem("double-circle-rectangle", { radius: doubleRadius, width: 2 * doubleRadius, height: 4 * doubleRadius }, 12 * doubleRadius + 4 * PI * doubleRadius, 8 * doubleRadius ** 2 - 2 * PI * doubleRadius ** 2),
    problem("quarter-annulus", { outer: quarterOuter, inner: quarterInner }, PI * (quarterOuter + quarterInner) / 2 + 2 * (quarterOuter - quarterInner), PI * (quarterOuter ** 2 - quarterInner ** 2) / 4),
    problem("annulus", { outer: annulusOuter, inner: annulusInner, width: annulusWidth }, 2 * PI * (annulusOuter + annulusInner), PI * (annulusOuter ** 2 - annulusInner ** 2)),
    problem("one-sixth-sector", { radius: sectorRadius }, 2 * sectorRadius + PI * sectorRadius / 3, PI * sectorRadius ** 2 / 6),
    problem("circle-square-hole", { radius: inscribedRadius, squareSide: inscribedSide }, 2 * PI * inscribedRadius + 4 * inscribedSide, PI * inscribedRadius ** 2 - inscribedSide ** 2),
    problem("semicircle-circle-hole", { outerRadius: semicircleCircleRadius, innerRadius: semicircleHoleRadius }, PI * semicircleCircleRadius + 2 * semicircleCircleRadius + 2 * PI * semicircleHoleRadius, PI * semicircleCircleRadius ** 2 / 2 - PI * semicircleHoleRadius ** 2),
    problem("square-semicircle-hole", { side: squareSemicircleSide }, 5 * squareSemicircleSide + PI * squareSemicircleSide / 2, squareSemicircleSide ** 2 - PI * squareSemicircleSide ** 2 / 8),
    problem("circle-yin-yang", { radius: circleYinRadius }, 2 * PI * circleYinRadius, PI * circleYinRadius ** 2 / 2),
    problem("square-top-bottom-cutouts", { side: topBottomSide }, 2 * topBottomSide + PI * topBottomSide, topBottomSide ** 2 - PI * topBottomSide ** 2 / 4),
    problem("eccentric-circle-hole", { outerRadius: eccentricOuter, innerRadius: eccentricInner }, 2 * PI * (eccentricOuter + eccentricInner), PI * (eccentricOuter ** 2 - eccentricInner ** 2)),
    problem("corner-quarter-shading", { side: cornerSide, radius: cornerRadius }, 4 * cornerSide + 2 * PI * cornerRadius, PI * cornerRadius ** 2),
    problem("square-circle-hole", { side: squareHoleSide, radius: squareHoleRadius }, 4 * squareHoleSide + 2 * PI * squareHoleRadius, squareHoleSide ** 2 - PI * squareHoleRadius ** 2),
    problem("semicircle-side-hole", { outerRadius: sideHoleRadius, innerRadius: smallSideHoleRadius }, PI * sideHoleRadius + PI * smallSideHoleRadius + sideHoleRadius, PI * sideHoleRadius ** 2 / 2 - PI * smallSideHoleRadius ** 2 / 2),
  ], next).slice(0, 3);
}

export function normalizeCircleAnswer(input: string) {
  const value = Number(input.replace(/[^0-9.-]/g, ""));
  return input.trim() && Number.isFinite(value) ? value : null;
}
