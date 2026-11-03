import { CUBE_H, MAP_GAP, TILE_H, TILE_W, floorCellPoints, isStackDiagramClear, polygonPoints, stackDiagramFaces } from "../../lib/stacked-cubes-geometry";

export default function StackedCubesDiagram({ heights, showMap = false, showDirection = true, className }: { heights: number[][]; showMap?: boolean; showDirection?: boolean; className?: string }) {
  const size = heights.length;
  const faces = stackDiagramFaces(heights);
  // Old saved worksheets retain their shapes and answers. Supply the missing
  // information instead of silently replacing a student's in-progress problem.
  const showHeightMap = !isStackDiagramClear(heights, showMap);
  const displayMap = showMap || showHeightMap;

  const maxHeight = heights.reduce((max, row) => Math.max(max, ...row), 0);
  const minX = -size * TILE_W - 20;
  const maxX = size * TILE_W;
  const minY = -maxHeight * CUBE_H - TILE_H;
  const cubesMaxY = 2 * (size - 1) * TILE_H + TILE_H;
  const mapOffsetY = cubesMaxY + MAP_GAP;
  const maxY = (displayMap ? mapOffsetY + 2 * (size - 1) * TILE_H + TILE_H : cubesMaxY) + (showHeightMap ? 28 : 10);
  const width = maxX - minX;
  const height = maxY - minY;

  const arrowTailX = minX + 8;
  const arrowTailY = cubesMaxY - 30;
  const arrowTipX = arrowTailX + TILE_W * 0.85;
  const arrowTipY = arrowTailY - TILE_H * 0.85;

  return (
    <svg
      className={`stacked-cubes-diagram${className ? ` ${className}` : ""}`}
      viewBox={`${minX} ${minY} ${width} ${height}`}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="쌓기나무 그림"
      data-height-map={showHeightMap || undefined}
    >
      {faces.map(({ r, c, z, kind, points }) => (
        <polygon key={`${r}-${c}-${z}-${kind}`} className={`stacked-cube-face stacked-cube-face-${kind}`} points={polygonPoints(points)} />
      ))}
      {showDirection && (
        <g className="stacked-cubes-direction">
          <line x1={arrowTailX} y1={arrowTailY} x2={arrowTipX} y2={arrowTipY} />
          <polygon points={`${arrowTipX},${arrowTipY} ${arrowTipX - 6},${arrowTipY + 2} ${arrowTipX - 2},${arrowTipY + 6}`} />
          <text x={arrowTailX - 2} y={arrowTailY + 12}>앞</text>
        </g>
      )}
      {displayMap && heights.map((row, r) => row.map((cellHeight, c) => {
        if (cellHeight === 0 && !showHeightMap) return null;
        const x = (c - r) * TILE_W;
        const groundY = (c + r) * TILE_H;
        return (
          <g key={`map-${r}-${c}`}>
            {cellHeight > 0 && <line className="stacked-cubes-map-guide" x1={x} y1={groundY + TILE_H} x2={x} y2={groundY + mapOffsetY - TILE_H} />}
            <polygon className="stacked-cubes-map-cell" points={polygonPoints(floorCellPoints(r, c, mapOffsetY))} />
            {showHeightMap && <text className="stacked-cubes-map-number" x={x} y={groundY + mapOffsetY} dominantBaseline="central" textAnchor="middle">{cellHeight}</text>}
          </g>
        );
      }))}
      {showHeightMap && <text className="stacked-cubes-map-label" x={0} y={maxY - 5} textAnchor="middle">칸별 쌓은 개수</text>}
    </svg>
  );
}
