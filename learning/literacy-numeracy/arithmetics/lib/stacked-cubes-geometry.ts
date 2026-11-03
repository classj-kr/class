// The worksheet, race cards and visibility check use the same projection.
export const TILE_W = 34;
export const TILE_H = 17;
export const CUBE_H = 30;
export const MAP_GAP = 22;

export type StackPoint = [number, number];
export type StackFace = {
  r: number;
  c: number;
  z: number;
  kind: "ground" | "left" | "right" | "top";
  points: StackPoint[];
};

export function floorCellPoints(r: number, c: number, offsetY = 0): StackPoint[] {
  const x = (c - r) * TILE_W;
  const y = (c + r) * TILE_H + offsetY;
  return [[x, y - TILE_H], [x + TILE_W, y], [x, y + TILE_H], [x - TILE_W, y]];
}

export function stackDiagramFaces(heights: number[][]): StackFace[] {
  const faces: StackFace[] = heights.flatMap((row, r) => row.map((_, c) => ({
    r, c, z: -1, kind: "ground" as const, points: floorCellPoints(r, c),
  })));
  const cubes: Array<{ r: number; c: number; z: number }> = [];
  heights.forEach((row, r) => row.forEach((height, c) => {
    for (let z = 0; z < height; z += 1) cubes.push({ r, c, z });
  }));
  cubes.sort((a, b) => a.r + a.c - (b.r + b.c));
  for (const { r, c, z } of cubes) {
    const x = (c - r) * TILE_W;
    const y = (c + r) * TILE_H - (z + 1) * CUBE_H;
    faces.push(
      { r, c, z, kind: "left", points: [[x - TILE_W, y], [x, y + TILE_H], [x, y + TILE_H + CUBE_H], [x - TILE_W, y + CUBE_H]] },
      { r, c, z, kind: "right", points: [[x, y + TILE_H], [x + TILE_W, y], [x + TILE_W, y + CUBE_H], [x, y + TILE_H + CUBE_H]] },
    );
    if (z === heights[r][c] - 1) faces.push({ r, c, z, kind: "top", points: floorCellPoints(r, c, -(z + 1) * CUBE_H) });
  }
  return faces;
}

export function polygonPoints(points: StackPoint[]): string {
  return points.map((point) => point.join(",")).join(" ");
}

function cross(a: StackPoint, b: StackPoint, p: StackPoint) {
  return (b[0] - a[0]) * (p[1] - a[1]) - (b[1] - a[1]) * (p[0] - a[0]);
}

// All projected faces are convex and have the same winding. Clip their
// interiors; shared edges do not count as occlusion.
function overlapArea(subject: StackPoint[], clip: StackPoint[]) {
  let points = subject;
  for (let edge = 0; edge < clip.length && points.length; edge += 1) {
    const a = clip[edge], b = clip[(edge + 1) % clip.length];
    const input = points;
    points = [];
    for (let i = 0; i < input.length; i += 1) {
      const start = input[i], end = input[(i + 1) % input.length];
      const ds = cross(a, b, start), de = cross(a, b, end);
      if ((ds >= 0) !== (de >= 0)) {
        const t = ds / (ds - de);
        points.push([start[0] + t * (end[0] - start[0]), start[1] + t * (end[1] - start[1])]);
      }
      if (de >= 0) points.push(end);
    }
  }
  return Math.abs(points.reduce((sum, point, i) => {
    const next = points[(i + 1) % points.length];
    return sum + point[0] * next[1] - point[1] * next[0];
  }, 0)) / 2;
}

/** Conservative sufficient condition, not a solver for every solvable drawing.
 * Each column's entire top must be visible. Without a footprint, every empty
 * floor cell must also be visible, excluding cubes hidden behind the drawing.
 * With the displayed floor and no gaps under a cube, these determine all heights.
 */
export function isStackDiagramClear(heights: number[][], hasFootprint = false): boolean {
  const faces = stackDiagramFaces(heights);
  return faces.every((face, index) => {
    const isRequired = face.kind === "top" || (!hasFootprint && face.kind === "ground" && heights[face.r][face.c] === 0);
    return !isRequired || faces.slice(index + 1).every((other) => overlapArea(face.points, other.points) < 1e-6);
  });
}

export const STACKING_GUIDE = "쌓기나무는 표시된 바닥 안에만, 각 칸의 아래부터 빈칸 없이 쌓았습니다.";
