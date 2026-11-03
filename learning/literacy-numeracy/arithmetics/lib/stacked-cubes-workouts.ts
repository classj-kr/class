import { isStackDiagramClear } from "./stacked-cubes-geometry.ts";

export type StackKind = "count" | "count-map" | "three-view";

export type ViewGrids = { top: boolean[][]; front: boolean[][]; side: boolean[][] };

export type StackProblem = {
  id: string;
  kind: StackKind;
  heights: number[][];
  size: number;
  total: number;
  views: ViewGrids;
};

export type StackProblemSet = { seed: number; problems: StackProblem[] };

export const GRID_SIZE = 3;
export const MAX_HEIGHT = 3;

type Layers = 2 | 3;
const PROBLEM_PLAN: [StackKind, Layers][] = [
  ["three-view", 2], ["three-view", 3],
  ["count", 2], ["count", 2], ["count", 3], ["count", 3],
  ["count-map", 2], ["count-map", 3], ["count-map", 3], ["count-map", 3],
];

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

function emptyGrid(size: number): boolean[][] {
  return Array.from({ length: size }, () => Array<boolean>(size).fill(false));
}

type Cell = [number, number];

function growBase(next: () => number, size: number, count: number, backFirst: boolean): Cell[] {
  const used = emptyGrid(size);
  const first: Cell = backFirst ? [0, 0] : [integer(next, 0, size - 1), integer(next, 0, size - 1)];
  const cells = [first];
  used[first[0]][first[1]] = true;
  while (cells.length < count) {
    const candidates: Cell[] = [];
    for (let r = 0; r < size; r += 1) {
      for (let c = 0; c < size; c += 1) {
        if (used[r][c]) continue;
        const available = backFirst
          ? (r === 0 || used[r - 1][c]) && (c === 0 || used[r][c - 1])
          : used[r - 1]?.[c] || used[r + 1]?.[c] || used[r][c - 1] || used[r][c + 1];
        if (available) candidates.push([r, c]);
      }
    }
    const cell = candidates[integer(next, 0, candidates.length - 1)];
    used[cell[0]][cell[1]] = true;
    cells.push(cell);
  }
  return cells;
}

function buildHeights(next: () => number, size: number, count: number, layers: Layers, hasMap: boolean): number[][] {
  let cells = growBase(next, size, hasMap ? size * size : count, true);
  if (hasMap) {
    const footprint = emptyGrid(size);
    for (const [r, c] of growBase(next, size, count, false)) footprint[r][c] = true;
    cells = cells.filter(([r, c]) => footprint[r][c]);
  }

  // Each upper layer occupies a shorter prefix of the back-to-front order.
  // At least three columns rise above the base and each height remains visible.
  const secondLayer = integer(next, Math.ceil(count / 2), count - 1);
  const thirdLayer = layers === MAX_HEIGHT ? integer(next, 1, secondLayer - 1) : 0;
  const heights = Array.from({ length: size }, () => Array<number>(size).fill(0));
  cells.forEach(([r, c], index) => {
    heights[r][c] = 1 + Number(index < secondLayer) + Number(index < thirdLayer);
  });
  return heights;
}

function barsToGrid(bars: number[], size: number): boolean[][] {
  return Array.from({ length: size }, (_, row) => bars.map((height) => size - row <= height));
}

export function computeViews(heights: number[][], size: number): ViewGrids {
  const top = heights.map((row) => row.map((height) => height > 0));
  const frontHeights = Array.from({ length: size }, (_, col) => Math.max(...heights.map((row) => row[col])));
  const sideHeights = heights.map((row) => Math.max(...row));
  return { top, front: barsToGrid(frontHeights, size), side: barsToGrid(sideHeights, size) };
}

function total(heights: number[][]) {
  return heights.reduce((sum, row) => sum + row.reduce((rowSum, height) => rowSum + height, 0), 0);
}

function buildProblem(next: () => number, kind: StackKind, layers: Layers, id: string): StackProblem {
  const size = GRID_SIZE;
  const count = integer(next, 5, kind === "three-view" ? 7 : 8);
  const heights = buildHeights(next, size, count, layers, kind === "count-map");
  if (!isStackDiagramClear(heights, kind === "count-map")) throw new Error("Stacked-cubes problem conceals a required cell");
  return { id, kind, heights, size, total: total(heights), views: computeViews(heights, size) };
}

export function createStackedCubesProblemSet(seed: number): StackProblemSet {
  const next = random(seed);
  return {
    seed,
    problems: PROBLEM_PLAN.map(([kind, layers], index) => buildProblem(next, kind, layers, `stacked-cubes-${index}`)),
  };
}

export function sameViewGrids(a: boolean[][], b: boolean[][]) {
  return a.every((row, r) => row.every((value, c) => value === b[r][c]));
}
