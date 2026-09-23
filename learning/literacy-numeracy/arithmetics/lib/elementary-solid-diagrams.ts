import type { GeometryMeasurementProblem } from "./elementary-geometry-measurement";

export type Point3 = [number, number, number];
export type Point2 = [number, number];
export type SolidFace = { points: Point3[]; tone: "top" | "left" | "right" | "inside"; holes?: Point3[][] };
export type SolidMeasure = { from: Point3; to: Point3; offset: Point2; value: number; outside?: boolean };
export type SolidDiagram = {
  title: string;
  note: string;
  faces: SolidFace[];
  seams: [Point3, Point3][];
  measures: SolidMeasure[];
};

function cuboid(x: number, y: number, z: number, length: number, width: number, height: number): SolidFace[] {
  const X = x + length, Y = y + width, Z = z + height;
  return [
    { tone: "top", points: [[x, y, Z], [X, y, Z], [X, Y, Z], [x, Y, Z]] },
    { tone: "left", points: [[x, Y, z], [X, Y, z], [X, Y, Z], [x, Y, Z]] },
    { tone: "right", points: [[X, y, z], [X, Y, z], [X, Y, Z], [X, y, Z]] },
  ];
}

function baseMeasures(length: number, width: number, height: number): SolidMeasure[] {
  return [
    { from: [0, width, 0], to: [length, width, 0], offset: [-7, 16], value: length },
    { from: [length, width, 0], to: [length, 0, 0], offset: [7, 16], value: width },
    { from: [length, 0, 0], to: [length, 0, height], offset: [22, 0], value: height },
  ];
}

/** All vertices and dimension endpoints use the same centimetre coordinates. */
export function createSolidDiagram(problem: GeometryMeasurementProblem): SolidDiagram {
  const d = problem.dimensions;
  if (problem.kind === "open-box") {
    const { length: l, width: w, height: h } = d;
    return {
      title: "윗면이 없는 직육면체 상자",
      note: "상자의 두께는 생각하지 않습니다. 겉넓이는 다섯 면의 넓이 합, 부피는 담을 수 있는 공간의 크기입니다.",
      faces: [
        { tone: "inside", points: [[0, 0, 0], [l, 0, 0], [l, w, 0], [0, w, 0]] },
        { tone: "inside", points: [[0, 0, 0], [l, 0, 0], [l, 0, h], [0, 0, h]] },
        { tone: "top", points: [[0, 0, 0], [0, w, 0], [0, w, h], [0, 0, h]] },
        ...cuboid(0, 0, 0, l, w, h).slice(1),
      ],
      seams: [],
      measures: baseMeasures(l, w, h),
    };
  }
  if (problem.kind === "l-stacked-cubes") {
    const s = d.side;
    return {
      title: "정육면체 세 개를 ㄴ자 모양으로 붙인 입체",
      note: `한 모서리가 ${s} cm인 정육면체 세 개를 그림처럼 ㄴ자 모양으로 빈틈없이 붙였습니다.`,
      faces: [
        { tone: "top", points: [[s, 0, s], [2 * s, 0, s], [2 * s, s, s], [s, s, s]] },
        { tone: "left", points: [[0, s, 0], [2 * s, s, 0], [2 * s, s, s], [s, s, s], [s, s, 2 * s], [0, s, 2 * s]] },
        { tone: "right", points: [[2 * s, 0, 0], [2 * s, s, 0], [2 * s, s, s], [2 * s, 0, s]] },
        { tone: "top", points: [[0, 0, 2 * s], [s, 0, 2 * s], [s, s, 2 * s], [0, s, 2 * s]] },
        { tone: "right", points: [[s, 0, s], [s, s, s], [s, s, 2 * s], [s, 0, 2 * s]] },
      ],
      seams: [[[0, s, s], [s, s, s]], [[s, s, 0], [s, s, s]]],
      measures: [{ from: [0, s, 0], to: [s, s, 0], offset: [-7, 16], value: s }],
    };
  }
  if (problem.kind === "stacked-prisms") {
    const { baseLength: l, baseWidth: w, baseHeight: h, topLength: a, topWidth: b, topHeight: c } = d;
    const x = (l - a) / 2, y = (w - b) / 2;
    const base = cuboid(0, 0, 0, l, w, h);
    base[0].holes = [[[x, y, h], [x + a, y, h], [x + a, y + b, h], [x, y + b, h]]];
    return {
      title: "큰 직육면체 위에 작은 직육면체를 붙인 입체",
      note: "작은 직육면체의 밑면 전체를 큰 직육면체의 윗면에 붙였습니다.",
      faces: [...base, ...cuboid(x, y, h, a, b, c)],
      seams: [],
      measures: [
        ...baseMeasures(l, w, h),
        { from: [x, y, h + c], to: [x + a, y, h + c], offset: [7, -16], value: a },
        { from: [x, y, h + c], to: [x, y + b, h + c], offset: [-7, -16], value: b },
        { from: [x + a, y, h], to: [x + a, y, h + c], offset: [22, 0], value: c },
      ],
    };
  }
  if (problem.kind === "corner-cut-cube") {
    const s = d.side, r = d.removedSide, c = s - r;
    return {
      title: "꼭짓점 한 곳에서 작은 정육면체를 잘라 낸 입체",
      note: `한 모서리가 ${s} cm인 정육면체의 꼭짓점 한 곳에서 한 모서리가 ${r} cm인 정육면체를 잘라 냈습니다.`,
      faces: [
        { tone: "top", points: [[c, c, c], [s, c, c], [s, s, c], [c, s, c]] },
        { tone: "right", points: [[c, c, c], [c, s, c], [c, s, s], [c, c, s]] },
        { tone: "left", points: [[c, c, c], [s, c, c], [s, c, s], [c, c, s]] },
        { tone: "top", points: [[0, 0, s], [s, 0, s], [s, c, s], [c, c, s], [c, s, s], [0, s, s]] },
        { tone: "left", points: [[0, s, 0], [s, s, 0], [s, s, c], [c, s, c], [c, s, s], [0, s, s]] },
        { tone: "right", points: [[s, 0, 0], [s, s, 0], [s, s, c], [s, c, c], [s, c, s], [s, 0, s]] },
      ],
      seams: [],
      measures: [
        { from: [0, s, 0], to: [s, s, 0], offset: [-7, 16], value: s },
        { from: [s, c, c], to: [s, c, s], offset: [16, 0], value: r, outside: true },
      ],
    };
  }

  if (problem.cubes) {
    const side = d.side;
    const occupied = new Set(problem.cubes.map(cube => cube.join(",")));
    const faces: SolidFace[] = [];
    const ordered = [...problem.cubes].sort((a, b) => a.reduce((sum, v) => sum + v, 0) - b.reduce((sum, v) => sum + v, 0));
    for (const cube of ordered) {
      const [x, y, z] = cube.map(value => value * side);
      const cellFaces = cuboid(x, y, z, side, side, side);
      for (const [faceIndex, axis] of [2, 1, 0].entries()) {
        const neighbor = cube.map((value, i) => value + (i === axis ? 1 : 0)).join(",");
        if (!occupied.has(neighbor)) faces.push(cellFaces[faceIndex]);
      }
    }
    const titles: Record<string, string> = { "cube-stairs": "세 층 계단 모양", "cube-bridge": "가운데 아래가 빈 다리 모양", "cube-t": "ㅗ자 모양", "cube-corner": "세 방향으로 뻗은 모양" };
    const front = problem.cubes.filter(([, , z]) => z === 0).sort((a, b) => b[1] - a[1] || a[0] - b[0])[0];
    const [x, y] = front.map(value => value * side);
    return { title: titles[problem.kind], note: "한 모서리가 " + side + " cm인 정육면체 " + problem.cubes.length + "개를 그림처럼 면끼리 빈틈없이 붙였습니다.", faces, seams: [], measures: [{ from: [x, y + side, 0], to: [x + side, y + side, 0], value: side, offset: [-7,16] }] };
  }
  throw new Error(`Unsupported solid diagram: ${problem.kind}`);
}

export function projectSolidPoint([x, y, z]: Point3): Point2 {
  return [(x - y) * Math.sqrt(3) / 2, (x + y) / 2 - z];
}

/** Reserve room around the shape for dimension lines, ticks and labels. */
export function fitSolidProjection(faces: SolidFace[]) {
  const points = faces.flatMap((face) => [...face.points, ...(face.holes ?? []).flat()]).map(projectSolidPoint);
  const minX = Math.min(...points.map(([x]) => x)), maxX = Math.max(...points.map(([x]) => x));
  const minY = Math.min(...points.map(([, y]) => y)), maxY = Math.max(...points.map(([, y]) => y));
  const scale = Math.min(234 / (maxX - minX), 136 / (maxY - minY));
  return (point: Point3): Point2 => {
    const [x, y] = projectSolidPoint(point);
    return [158 + (x - (minX + maxX) / 2) * scale, 99 + (y - (minY + maxY) / 2) * scale];
  };
}
