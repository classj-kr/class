// 도형 측정 학습지 카드: 다각형·직육면체·원의 둘레와 넓이, 쌓기나무.
import { blank, type RaceCard, type RaceDeck, type RacePart } from "../race-card-model.ts";
import { createElementaryGeometryMeasurementSet, type GeometryMeasurementProblem } from "../elementary-geometry-measurement.ts";
import { createSolidDiagram, fitSolidProjection, type Point3, type SolidMeasure } from "../elementary-solid-diagrams.ts";
import { createGradeSixCircleSet, type CircleProblem } from "../grade-six-circle.ts";
import { createStackedCubesProblemSet, type StackProblem } from "../stacked-cubes-workouts.ts";

const INK = "#17233c";
const r2 = (value: number) => Math.round(value * 100) / 100;

// 둘레 쪽 여백을 두고 width·height를 붙인 SVG 문자열.
function svg(x: number, y: number, width: number, height: number, label: string, body: string): { svg: string } {
  return { svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${r2(x)} ${r2(y)} ${r2(width)} ${r2(height)}" width="${r2(width)}" height="${r2(height)}" role="img" aria-label="${label}" font-family="Arial, sans-serif">${body}</svg>` };
}

function text(x: number, y: number, value: string, size = 13) {
  return `<text x="${r2(x)}" y="${r2(y)}" text-anchor="middle" font-size="${size}" font-weight="700" fill="${INK}">${value}</text>`;
}

// 답 칸 하나짜리 카드.
function ask(figure: { svg: string }, label: string, unit: string, answer: number, prompt?: string, kind: "number" | "decimal" = "number"): RaceCard {
  const parts: RacePart[] = [figure, { br: true }, `${label} =`, blank("a", kind), unit];
  return prompt ? { prompt, parts, answers: { a: [String(answer)] } } : { parts, answers: { a: [String(answer)] } };
}

// 5학년 다각형: 학습지 그림을 그대로 옮긴다.
function planeFigure(problem: GeometryMeasurementProblem) {
  const d = problem.dimensions;
  const shape = (path: string, extra = "") => `<path d="${path}" fill="#dce8f7" stroke="${INK}" stroke-width="2"${extra} />`;
  const line = (x1: number, y1: number, x2: number, y2: number, color: string) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="2" />`;
  const box = (label: string, body: string) => svg(-6, -6, 292, 192, label, body);
  if (problem.kind === "l-shape") return box("한 모서리를 잘라 낸 L자 도형", shape("M45 25 H225 V85 H170 V155 H45 Z") + text(135, 174, `${d.width}cm`) + text(24, 94, `${d.height}cm`) + text(198, 78, `${d.cutWidth}cm`) + text(247, 121, `${d.cutHeight}cm`));
  if (problem.kind === "frame") return box("가운데가 뚫린 직사각형 액자", shape("M35 20 H245 V160 H35 Z M85 58 H195 V122 H85 Z", ' fill-rule="evenodd"') + text(140, 177, `${d.width}cm`) + text(16, 94, `${d.height}cm`) + text(140, 53, `${d.innerWidth}cm`) + text(211, 94, `${d.innerHeight}cm`));
  if (problem.kind === "u-shape") return box("윗부분에 직사각형 홈이 파인 도형", shape("M40 25 H105 V95 H175 V25 H240 V160 H40 Z") + text(140, 177, `${d.width}cm`) + text(18, 96, `${d.height}cm`) + text(140, 89, `${d.notchWidth}cm`) + text(190, 63, `${d.notchHeight}cm`));
  if (problem.kind === "c-shape") return box("오른쪽이 파인 직각 다각형", shape("M40 25 H240 V60 H165 V120 H240 V155 H40 Z") + line(40, 16, 240, 16, "#d05a44") + text(140, 12, `${d.width}cm`) + line(29, 25, 29, 155, "#315bb5") + text(15, 94, `${d.height}cm`) + line(165, 51, 240, 51, "#d05a44") + text(202, 47, `${d.cutWidth}cm`) + line(156, 60, 156, 120, "#315bb5") + text(143, 94, `${d.cutHeight}cm`));
  throw new Error(`도형 그림 없음: ${problem.kind}`);
}

// 6학년 직육면체: elementary-solid-diagram.tsx와 같은 투영·치수선.
const TONES = { top: "#edf3fa", left: "#cbdcf0", right: "#a8c3e1", inside: "#e2eaf4" };
function solidFigure(problem: GeometryMeasurementProblem) {
  const model = createSolidDiagram(problem);
  const project = fitSolidProjection(model.faces);
  const at = (point: Point3) => project(point).map(r2).join(" ");
  const polygon = (points: Point3[]) => `${points.map((point, index) => `${index === 0 ? "M" : "L"}${at(point)}`).join(" ")} Z`;
  const measure = ({ from, to, offset: [offsetX, dy], value, outside }: SolidMeasure) => {
    const [x1, y1] = project(from), [x2, y2] = project(to);
    const dx = outside ? Math.max(...model.faces.flatMap((face) => face.points).map((point) => project(point)[0])) - x1 + offsetX : offsetX;
    const length = Math.hypot(x2 - x1, y2 - y1);
    const tickX = -(y2 - y1) / length * 3, tickY = (x2 - x1) / length * 3;
    const vertical = Math.abs(x1 - x2) < 0.01;
    const x = (x1 + x2) / 2 + dx + (vertical ? 7 : 0);
    const y = (y1 + y2) / 2 + dy + (vertical ? 0 : dy < 0 ? -8 : 10);
    const n = (values: number[]) => values.map(r2).join(" ");
    return `<g fill="none" stroke="#65758a" stroke-width="0.8"><path d="M${n([x1, y1])} l${n([dx, dy])} M${n([x2, y2])} l${n([dx, dy])}" stroke-dasharray="2 2" /><path d="M${n([x1 + dx, y1 + dy])} L${n([x2 + dx, y2 + dy])}" /><path d="M${n([x1 + dx - tickX, y1 + dy - tickY])} l${n([tickX * 2, tickY * 2])} M${n([x2 + dx - tickX, y2 + dy - tickY])} l${n([tickX * 2, tickY * 2])}" /></g>`
      + `<text x="${r2(x)}" y="${r2(y)}" text-anchor="${vertical ? "start" : "middle"}" dominant-baseline="middle" fill="${INK}" stroke="white" stroke-width="4" stroke-linejoin="round" paint-order="stroke" font-size="12" font-weight="600">${value} cm</text>`;
  };
  const faces = model.faces.map((face) => `<path d="${[polygon(face.points), ...(face.holes ?? []).map(polygon)].join(" ")}" fill="${TONES[face.tone]}" fill-rule="evenodd" />`).join("");
  const seams = model.seams.map(([from, to]) => `<path d="M${at(from)} L${at(to)}" fill="none" />`).join("");
  return { figure: svg(0, 0, 340, 200, model.title, `<g stroke="#283c56" stroke-width="1.5" stroke-linejoin="round">${faces}${seams}</g>${model.measures.map(measure).join("")}`), note: model.note };
}

function measurementDeck(mode: "plane" | "solid"): RaceDeck {
  return (seed) => createElementaryGeometryMeasurementSet(mode, seed).flatMap((problem) => {
    const { figure, note } = mode === "plane" ? { figure: planeFigure(problem), note: undefined } : solidFigure(problem);
    return [
      ask(figure, problem.firstLabel, problem.firstUnit, problem.first, note),
      ask(figure, problem.secondLabel, problem.secondUnit, problem.second, note),
    ];
  });
}

// 6학년 원: grade-6-circle/page.tsx의 그림을 문자열로 옮긴다.
function circleFigure(problem: CircleProblem) {
  const d = problem.dimensions;
  const gray = `fill="#d9d9d9" stroke="${INK}" stroke-width="1.8"`;
  const white = `fill="white" stroke="${INK}" stroke-width="1.8"`;
  const label = (x: number, y: number, value: string) => text(x, y, value, 11);
  const red = (x1: number, y1: number, x2: number, y2: number) => `<line x1="${r2(x1)}" y1="${r2(y1)}" x2="${r2(x2)}" y2="${r2(y2)}" stroke="#d55b3e" stroke-width="1.5" />`;
  const ink = (x1: number, y1: number, x2: number, y2: number) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${INK}" />`;
  const dot = (cx: number, cy: number) => `<circle cx="${cx}" cy="${cy}" r="2" fill="${INK}" />`;
  const square = (style: string) => `<rect x="50" y="10" width="160" height="160" ${style} />`;
  const box = (height: number, name: string, body: string) => svg(-4, -6, 268, height + 10, name, body);
  const cm = (value: number) => `${value}cm`;
  switch (problem.kind) {
    case "square-yin-yang": return box(180, "정사각형과 S자 모양의 색칠한 부분", square(gray) + `<circle cx="130" cy="90" r="80" ${white} /><path d="M50 90 A80 80 0 0 0 210 90 A40 40 0 0 0 130 90 A40 40 0 0 1 50 90 Z" ${gray} />` + red(50, 90, 130, 90) + label(88, 82, cm(d.radius)));
    case "offset-half-circle": {
      const r = 66 * d.innerRadius / d.outerRadius, cx = 196 - r;
      return box(210, "큰 원의 아래 반원에서 작은 아래 반원을 빼고 위 반원을 더한 부분", `<circle cx="130" cy="76" r="66" ${white} /><path d="M64 76 A66 66 0 0 0 196 76 Z" ${gray} /><circle cx="${r2(cx)}" cy="76" r="${r2(r)}" ${white} /><path d="M${r2(cx - r)} 76 A${r2(r)} ${r2(r)} 0 0 1 196 76 Z" ${gray} />` + ink(64, 76, 196, 76) + label(130, 171, "큰 원의 반지름 " + cm(d.outerRadius)) + label(130, 192, "작은 원의 반지름 " + cm(d.innerRadius)));
    }
    case "inward-semicircle-square": return box(180, "정사각형에서 네 꼭짓점 중심의 사분원을 뺀 부분", square(gray) + `<path d="M50 10 H130 A80 80 0 0 1 50 90 Z M210 10 V90 A80 80 0 0 1 130 10 Z M210 170 H130 A80 80 0 0 1 210 90 Z M50 170 V90 A80 80 0 0 1 130 170 Z" ${white} />` + label(130, 178, "한 변 " + cm(d.side)));
    case "double-circle-rectangle": return box(180, "서로 맞닿은 같은 원 두 개를 직사각형에서 뺀 부분", `<rect x="90" y="10" width="80" height="160" ${gray} /><circle cx="130" cy="50" r="40" ${white} /><circle cx="130" cy="130" r="40" ${white} />` + red(130, 50, 170, 50) + label(66, 94, cm(d.height)) + label(151, 44, cm(d.radius)));
    case "quarter-annulus": {
      const inner = 140 * d.inner / d.outer;
      return box(200, "중심이 같은 두 사분원 사이의 부분", `<path d="M200 165 A140 140 0 0 0 60 25 L60 ${r2(165 - inner)} A${r2(inner)} ${r2(inner)} 0 0 1 ${r2(60 + inner)} 165 Z" ${gray} />` + red(60, 165, 200, 165) + red(60, 165, 60, 165 - inner) + dot(60, 165) + label(135, 183, "바깥 반지름 " + cm(d.outer)) + label(112, 155, "안쪽 " + cm(d.inner)));
    }
    case "annulus": {
      const inner = 78 * d.inner / d.outer;
      return box(180, "중심이 같은 두 원 사이의 고리", `<circle cx="130" cy="90" r="78" ${gray} /><circle cx="130" cy="90" r="${r2(inner)}" ${white} />` + dot(130, 90) + red(130, 90, 130 + inner, 90) + red(130 + inner, 90, 208, 90) + label(130 + inner / 2, 81, cm(d.inner)) + label(169 + inner / 2, 105, cm(d.width)));
    }
    case "one-sixth-sector": return box(180, "원을 육등분한 한 부채꼴의 색칠한 부분", `<circle cx="130" cy="90" r="78" ${white} /><path d="M130 90 L208 90 A78 78 0 0 0 169 22 Z" ${gray} />` + ink(130, 90, 91, 22) + ink(130, 90, 52, 90) + ink(130, 90, 91, 158) + ink(130, 90, 169, 158) + label(166, 105, "반지름 " + cm(d.radius)));
    case "circle-square-hole": {
      const side = 156 * d.squareSide / (2 * d.radius);
      return box(200, "원에서 안쪽 정사각형을 뺀 부분", `<circle cx="130" cy="90" r="78" ${gray} /><rect x="${r2(130 - side / 2)}" y="${r2(90 - side / 2)}" width="${r2(side)}" height="${r2(side)}" ${white} />` + red(130, 90, 208, 90) + dot(130, 90) + label(174, 82, cm(d.radius)) + label(130, 187, "정사각형의 한 변 " + cm(d.squareSide)));
    }
    case "semicircle-circle-hole": return box(190, "반원에서 지름과 호에 맞닿은 작은 원을 뺀 부분", `<path d="M35 155 A95 95 0 0 1 225 155 L35 155 Z" ${gray} /><circle cx="130" cy="107.5" r="47.5" ${white} />` + dot(130, 107.5) + red(130, 107.5, 177.5, 107.5) + red(130, 155, 225, 155) + label(156, 100, cm(d.innerRadius)) + label(176, 178, cm(d.outerRadius)));
    case "square-semicircle-hole": return box(180, "정사각형에서 위쪽 반원을 뺀 색칠한 부분", square(gray) + `<path d="M50 90 A80 80 0 0 1 210 90 L50 90 Z" ${white} />` + label(130, 105, "한 변 " + cm(d.side)));
    case "circle-yin-yang": return box(180, "두 반원으로 경계가 굽은 원 안의 색칠한 부분", `<circle cx="130" cy="90" r="78" ${white} /><path d="M52 90 A78 78 0 0 1 208 90 A39 39 0 0 0 130 90 A39 39 0 0 1 52 90 Z" ${gray} />` + red(52, 90, 130, 90) + label(89, 81, cm(d.radius)));
    case "square-top-bottom-cutouts": return box(180, "정사각형의 위아래 반원을 뺀 색칠한 부분", square(gray) + `<path d="M50 10 A80 80 0 0 0 210 10 L50 10 Z" ${white} /><path d="M50 170 A80 80 0 0 1 210 170 L50 170 Z" ${white} />` + label(130, 9, "한 변 " + cm(d.side)));
    case "eccentric-circle-hole": return box(180, "큰 원에 안쪽으로 맞닿은 작은 원을 뺀 부분", `<circle cx="130" cy="90" r="78" ${gray} /><circle cx="91" cy="90" r="39" ${white} />` + dot(130, 90) + dot(91, 90) + red(91, 90, 130, 90) + red(130, 90, 208, 90) + label(110, 81, cm(d.innerRadius)) + label(170, 105, cm(d.outerRadius)));
    case "corner-quarter-shading": return box(180, "정사각형 네 모서리의 사분원이 색칠된 부분", square(white) + ["M50 10 H130 A80 80 0 0 1 50 90 Z", "M210 10 V90 A80 80 0 0 1 130 10 Z", "M210 170 H130 A80 80 0 0 1 210 90 Z", "M50 170 V90 A80 80 0 0 1 130 170 Z"].map((path) => `<path d="${path}" ${gray} />`).join("") + label(130, 9, "한 변 " + cm(d.side)));
    case "square-circle-hole": return box(180, "정사각형에서 내접원을 뺀 색칠한 부분", square(gray) + `<circle cx="130" cy="90" r="80" ${white} />` + label(130, 177, "한 변 " + cm(d.side)));
    default: return box(200, "큰 반원에서 왼쪽 작은 반원을 뺀 색칠한 부분", `<path d="M30 155 A100 100 0 0 1 230 155 L30 155 Z" ${gray} /><path d="M30 155 A50 50 0 0 1 130 155 L30 155 Z" ${white} /><line x1="130" y1="155" x2="230" y2="155" stroke="${INK}" stroke-width="1.8" />` + label(130, 177, "큰 반원의 반지름 " + cm(d.outerRadius)) + label(130, 194, "작은 반원의 반지름 " + cm(d.innerRadius)));
  }
}

const CIRCLE_GUIDE = "원주율 3.14 · 소수 셋째 자리에서 반올림";
const circleDeck: RaceDeck = (seed) => createGradeSixCircleSet(seed).flatMap((problem) => {
  const figure = circleFigure(problem);
  return [
    ask(figure, "둘레", "cm", problem.perimeter, `색칠한 부분의 둘레 (${CIRCLE_GUIDE})`, "decimal"),
    ask(figure, "넓이", "cm²", problem.area, `색칠한 부분의 넓이 (${CIRCLE_GUIDE})`, "decimal"),
  ];
});

// 6학년 쌓기나무: stacked-cubes-diagram.tsx와 같은 등각 그림.
const TILE_W = 34, TILE_H = 17, CUBE_H = 30, MAP_GAP = 22;
function stackFigure(heights: number[][], showMap: boolean) {
  const size = heights.length;
  const cubes: { r: number; c: number; z: number; isTop: boolean }[] = [];
  for (let r = 0; r < size; r += 1) for (let c = 0; c < size; c += 1) for (let z = 0; z < heights[r][c]; z += 1) cubes.push({ r, c, z, isTop: z === heights[r][c] - 1 });
  cubes.sort((a, b) => a.r + a.c - (b.r + b.c));
  const face = (points: number[][], fill: string) => `<polygon points="${points.map((point) => point.join(",")).join(" ")}" fill="${fill}" stroke="#8f7a4f" stroke-width="1" stroke-linejoin="round" />`;
  const body = cubes.map(({ r, c, z, isTop }) => {
    const x = (c - r) * TILE_W, y = (c + r) * TILE_H - (z + 1) * CUBE_H;
    return face([[x - TILE_W, y], [x, y + TILE_H], [x, y + TILE_H + CUBE_H], [x - TILE_W, y + CUBE_H]], "#c9b586")
      + face([[x, y + TILE_H], [x + TILE_W, y], [x + TILE_W, y + CUBE_H], [x, y + TILE_H + CUBE_H]], "#dcc99e")
      + (isTop ? face([[x, y - TILE_H], [x + TILE_W, y], [x, y + TILE_H], [x - TILE_W, y]], "#f1e6c9") : "");
  }).join("");
  const maxHeight = Math.max(...heights.flat());
  const minX = -size * TILE_W - 20, maxX = size * TILE_W;
  const minY = -maxHeight * CUBE_H - TILE_H;
  const cubesMaxY = 2 * (size - 1) * TILE_H + TILE_H + CUBE_H;
  const mapOffsetY = cubesMaxY + MAP_GAP;
  const maxY = (showMap ? mapOffsetY + 2 * (size - 1) * TILE_H + TILE_H : cubesMaxY) + 10;
  const tailX = minX + 8, tailY = cubesMaxY - 30, tipX = tailX + TILE_W * 0.85, tipY = tailY - TILE_H * 0.85;
  const arrow = `<g fill="#9a8f7a"><line x1="${tailX}" y1="${tailY}" x2="${r2(tipX)}" y2="${r2(tipY)}" stroke="#9a8f7a" stroke-width="2.5" /><polygon points="${r2(tipX)},${r2(tipY)} ${r2(tipX - 6)},${r2(tipY + 2)} ${r2(tipX - 2)},${r2(tipY + 6)}" /><text x="${tailX - 2}" y="${tailY + 12}" font-size="17" font-weight="800">앞</text></g>`;
  const map = showMap ? heights.flatMap((row, r) => row.map((height, c) => {
    if (!height) return "";
    const x = (c - r) * TILE_W, y = (c + r) * TILE_H + mapOffsetY, groundY = (c + r) * TILE_H;
    return `<line x1="${x}" y1="${groundY + TILE_H}" x2="${x}" y2="${groundY + mapOffsetY - TILE_H}" stroke="#9a8f7a" stroke-width="1" stroke-dasharray="3 3" /><polygon points="${x},${y - TILE_H} ${x + TILE_W},${y} ${x},${y + TILE_H} ${x - TILE_W},${y}" fill="white" stroke="#928979" stroke-width="1" />`;
  })).join("") : "";
  return svg(minX - 4, minY - 4, maxX - minX + 8, maxY - minY + 8, "쌓기나무 그림", body + arrow + map);
}

// 세 방향 모양은 칸 누르기 대신 색칠할 칸 수를 묻는다.
const VIEW_LABELS = [["top", "위"], ["front", "앞"], ["side", "옆"]] as const;
function stackCards(problem: StackProblem): RaceCard[] {
  if (problem.kind !== "three-view") {
    const figure = stackFigure(problem.heights, problem.kind === "count-map");
    return [{ prompt: "쌓기나무의 개수를 구하시오.", parts: [figure, { br: true }, blank(), "개"], answers: { a: [String(problem.total)] } }];
  }
  const figure = stackFigure(problem.heights, false);
  return VIEW_LABELS.map(([field, label]) => ({
    prompt: `${label}에서 본 모양을 그리면 몇 칸을 색칠할까요?`,
    parts: [figure, { br: true }, `${label}에서 본 모양:`, blank(), "칸"],
    answers: { a: [String(problem.views[field].flat().filter(Boolean).length)] },
  }));
}

export const decks: Record<string, RaceDeck> = {
  "/arithmetic/grade-5-polygon-measurement": measurementDeck("plane"),
  "/arithmetic/grade-6-box-measurement": measurementDeck("solid"),
  "/arithmetic/grade-6-circle": circleDeck,
  "/arithmetic/grade-6-stacked-cubes": (seed) => createStackedCubesProblemSet(seed).problems.flatMap(stackCards),
};
