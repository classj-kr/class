export type GeometryMeasurementMode = "plane" | "solid";

export type GeometryMeasurementProblem = {
  id: string;
  kind: string;
  dimensions: Record<string, number>;
  cells?: [number, number][];
  cubes?: [number, number, number][];
  first: number;
  second: number;
  firstLabel: "둘레" | "겉넓이";
  secondLabel: "넓이" | "부피";
  firstUnit: "cm" | "cm²";
  secondUnit: "cm²" | "cm³";
};

function seededRandom(seed: number) {
  let value = seed >>> 0;
  return () => {
    value += 0x6d2b79f5;
    let mixed = Math.imul(value ^ (value >>> 15), value | 1);
    mixed ^= mixed + Math.imul(mixed ^ (mixed >>> 7), mixed | 61);
    return ((mixed ^ (mixed >>> 14)) >>> 0) / 0x100000000;
  };
}

function pick<T>(random: () => number, values: readonly T[]) {
  return values[Math.floor(random() * values.length)];
}

type Cell = readonly [number, number];

const ORTHOGONAL_SHAPE_BANK: { name: string; cells: readonly Cell[] }[] = [
  { name: "L", cells: [[0, 0], [0, 1], [0, 2], [1, 2], [2, 2]] },
  { name: "T", cells: [[0, 0], [1, 0], [2, 0], [1, 1], [1, 2], [1, 3]] },
  { name: "U", cells: [[0, 0], [0, 1], [0, 2], [1, 2], [2, 2], [2, 1], [2, 0]] },
  { name: "H", cells: [[0, 0], [0, 1], [0, 2], [1, 1], [2, 0], [2, 1], [2, 2]] },
  { name: "cross", cells: [[1, 0], [0, 1], [1, 1], [2, 1], [1, 2]] },
  { name: "stairs", cells: [[0, 0], [0, 1], [1, 1], [0, 2], [1, 2], [2, 2]] },
  { name: "zigzag", cells: [[0, 0], [1, 0], [1, 1], [2, 1], [2, 2], [3, 2]] },
  { name: "C", cells: [[0, 0], [1, 0], [2, 0], [0, 1], [0, 2], [1, 2], [2, 2]] },
  { name: "E", cells: [[0, 0], [1, 0], [2, 0], [0, 1], [0, 2], [1, 2], [2, 2], [0, 3], [0, 4], [1, 4], [2, 4]] },
  { name: "frame", cells: [[0, 0], [1, 0], [2, 0], [0, 1], [2, 1], [0, 2], [1, 2], [2, 2]] },
  { name: "double-notch", cells: [[0, 0], [2, 0], [3, 0], [0, 1], [1, 1], [2, 1], [3, 1], [0, 2], [1, 2], [3, 2]] },
  { name: "tower", cells: [[1, 0], [0, 1], [1, 1], [2, 1], [0, 2], [1, 2], [2, 2], [1, 3]] },
];

function transformCells(cells: readonly Cell[], rotation: number, mirror: boolean): [number, number][] {
  const transformed = cells.map(([sourceX, sourceY]) => {
    let x = mirror ? -sourceX : sourceX;
    let y = sourceY;
    for (let turn = 0; turn < rotation; turn += 1) [x, y] = [-y, x];
    return [x, y] as [number, number];
  });
  const minimumX = Math.min(...transformed.map(([x]) => x));
  const minimumY = Math.min(...transformed.map(([, y]) => y));
  return transformed.map(([x, y]) => [x - minimumX, y - minimumY]);
}

function orthogonalPerimeter(cells: readonly [number, number][], cellWidth: number, cellHeight: number) {
  const occupied = new Set(cells.map(([x, y]) => `${x},${y}`));
  return cells.reduce((sum, [x, y]) => sum
    + (!occupied.has(`${x - 1},${y}`) ? cellHeight : 0)
    + (!occupied.has(`${x + 1},${y}`) ? cellHeight : 0)
    + (!occupied.has(`${x},${y - 1}`) ? cellWidth : 0)
    + (!occupied.has(`${x},${y + 1}`) ? cellWidth : 0), 0);
}

export function createElementaryGeometryMeasurementSet(mode: GeometryMeasurementMode, seed: number): GeometryMeasurementProblem[] {
  const random = seededRandom(seed ^ (mode === "plane" ? 0x51a7 : 0x60b5));
  if (mode === "plane") {
    const templates = ["l-shape", "frame", "u-shape", "c-shape"] as const;
    const shuffled = [...templates];
    for (let index = shuffled.length - 1; index > 0; index -= 1) {
      const target = Math.floor(random() * (index + 1));
      [shuffled[index], shuffled[target]] = [shuffled[target], shuffled[index]];
    }
    return shuffled.map((kind, index): GeometryMeasurementProblem => {
      if (kind === "l-shape") {
        const width = pick(random, [12, 14, 16, 18]);
        const height = pick(random, [9, 10, 12]);
        const cutWidth = pick(random, [3, 4, 5, 6]);
        const cutHeight = pick(random, [3, 4, 5]);
        return { id: `l-shape-${seed}-${index}`, kind, dimensions: { width, height, cutWidth, cutHeight }, first: 2 * (width + height), second: width * height - cutWidth * cutHeight, firstLabel: "둘레" as const, secondLabel: "넓이" as const, firstUnit: "cm" as const, secondUnit: "cm²" as const };
      }
      if (kind === "frame") {
        const width = pick(random, [14, 16, 18]);
        const height = pick(random, [10, 12, 14]);
        const innerWidth = pick(random, [4, 6, 8]);
        const innerHeight = pick(random, [3, 4, 5, 6]);
        return { id: `frame-${seed}-${index}`, kind, dimensions: { width, height, innerWidth, innerHeight }, first: 2 * (width + height + innerWidth + innerHeight), second: width * height - innerWidth * innerHeight, firstLabel: "둘레" as const, secondLabel: "넓이" as const, firstUnit: "cm" as const, secondUnit: "cm²" as const };
      }
      if (kind === "u-shape") {
        const width = pick(random, [14, 16, 18]);
        const height = pick(random, [10, 12, 14]);
        const notchWidth = pick(random, [4, 6, 8]);
        const notchHeight = pick(random, [3, 4, 5]);
        return { id: `u-shape-${seed}-${index}`, kind, dimensions: { width, height, notchWidth, notchHeight }, first: 2 * (width + height) + 2 * notchHeight, second: width * height - notchWidth * notchHeight, firstLabel: "둘레" as const, secondLabel: "넓이" as const, firstUnit: "cm" as const, secondUnit: "cm²" as const };
      }
      const width = pick(random, [14, 16, 18]);
      const height = pick(random, [10, 12, 14]);
      const cutWidth = pick(random, [4, 5, 6]);
      const cutHeight = pick(random, [3, 4, 5, 6]);
      return { id: `c-shape-${seed}-${index}`, kind, dimensions: { width, height, cutWidth, cutHeight }, first: 2 * (width + height) + 2 * cutWidth, second: width * height - cutWidth * cutHeight, firstLabel: "둘레" as const, secondLabel: "넓이" as const, firstUnit: "cm" as const, secondUnit: "cm²" as const };
    });
  }
  const bank = createElementarySolidMeasurementBank(seed);
  for (let index = bank.length - 1; index > 0; index--) {
    const target = Math.floor(random() * (index + 1));
    [bank[index], bank[target]] = [bank[target], bank[index]];
  }
  return bank.slice(0, 4);
}

export function createElementarySolidMeasurementBank(seed: number): GeometryMeasurementProblem[] {
  const random = seededRandom(seed ^ 0x60b5);
  const length = pick(random, [8, 10, 12]);
  const width = pick(random, [5, 6, 7]);
  const height = pick(random, [4, 5, 6]);
  const cubeSide = pick(random, [3, 4, 5]);
  const baseLength = pick(random, [8, 10, 12]);
  const baseWidth = pick(random, [6, 8]);
  const baseHeight = pick(random, [3, 4]);
  const topLength = baseLength / 2;
  const topWidth = baseWidth / 2;
  const topHeight = pick(random, [2, 3, 4]);
  const side = pick(random, [6, 8, 10]);
  const removedSide = side / 2;
  const bank: GeometryMeasurementProblem[] = [
    { id: `open-${seed}`, kind: "open-box", dimensions: { length, width, height }, first: length * width + 2 * length * height + 2 * width * height, second: length * width * height, firstLabel: "겉넓이", secondLabel: "부피", firstUnit: "cm²", secondUnit: "cm³" },
    { id: `l-stacked-${seed}`, kind: "l-stacked-cubes", dimensions: { side: cubeSide }, first: 14 * cubeSide ** 2, second: 3 * cubeSide ** 3, firstLabel: "겉넓이", secondLabel: "부피", firstUnit: "cm²", secondUnit: "cm³" },
    { id: `stacked-${seed}`, kind: "stacked-prisms", dimensions: { baseLength, baseWidth, baseHeight, topLength, topWidth, topHeight }, first: 2 * (baseLength * baseWidth + baseLength * baseHeight + baseWidth * baseHeight) + 2 * (topLength * topWidth + topLength * topHeight + topWidth * topHeight) - 2 * topLength * topWidth, second: baseLength * baseWidth * baseHeight + topLength * topWidth * topHeight, firstLabel: "겉넓이", secondLabel: "부피", firstUnit: "cm²", secondUnit: "cm³" },
    { id: `cut-${seed}`, kind: "corner-cut-cube", dimensions: { side, removedSide }, first: 6 * side ** 2, second: side ** 3 - removedSide ** 3, firstLabel: "겉넓이", secondLabel: "부피", firstUnit: "cm²", secondUnit: "cm³" },
  ];
  const cubeShapes: { kind: string; cubes: [number, number, number][] }[] = [
    { kind: "cube-stairs", cubes: [[0,0,0],[1,0,0],[2,0,0],[0,0,1],[1,0,1],[0,0,2]] },
    { kind: "cube-bridge", cubes: [[0,0,0],[2,0,0],[0,0,1],[1,0,1],[2,0,1]] },
    { kind: "cube-t", cubes: [[0,0,0],[1,0,0],[2,0,0],[1,0,1]] },
    { kind: "cube-corner", cubes: [[0,0,0],[1,0,0],[0,1,0],[0,0,1]] },
  ];
  for (const { kind, cubes } of cubeShapes) {
    const side = pick(random, [3, 4, 5]);
    const occupied = new Set(cubes.map(cube => cube.join(",")));
    const shared = cubes.reduce((sum, cube) => sum + [0,1,2].filter(axis => occupied.has(cube.map((value, i) => value + (axis === i ? 1 : 0)).join(","))).length, 0);
    bank.push({ id: kind + "-" + seed, kind, cubes, dimensions: { side }, first: (6 * cubes.length - 2 * shared) * side ** 2, second: cubes.length * side ** 3, firstLabel: "겉넓이", secondLabel: "부피", firstUnit: "cm²", secondUnit: "cm³" });
  }
  return bank;
}

export function normalizeGeometryMeasurementAnswer(value: string) {
  const normalized = value.replace(/,/g, "").trim();
  return /^-?\d+(?:\.\d+)?$/.test(normalized) ? Number(normalized) : Number.NaN;
}
