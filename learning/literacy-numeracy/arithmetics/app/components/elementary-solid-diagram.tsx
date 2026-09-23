import { createSolidDiagram, fitSolidProjection, type Point3, type SolidMeasure } from "../../lib/elementary-solid-diagrams";
import type { GeometryMeasurementProblem } from "../../lib/elementary-geometry-measurement";

const tones = { top: "#edf3fa", left: "#cbdcf0", right: "#a8c3e1", inside: "#e2eaf4" };

export default function ElementarySolidDiagram({ problem }: { problem: GeometryMeasurementProblem }) {
  const model = createSolidDiagram(problem);
  const project = fitSolidProjection(model.faces);
  const polygon = (points: Point3[]) => `${points.map((point, index) => `${index === 0 ? "M" : "L"}${project(point).join(" ")}`).join(" ")} Z`;
  const measure = ({ from, to, offset: [offsetX, dy], value, outside }: SolidMeasure, index: number) => {
    const [x1, y1] = project(from), [x2, y2] = project(to);
    const dx = outside ? Math.max(...model.faces.flatMap((face) => face.points).map((point) => project(point)[0])) - x1 + offsetX : offsetX;
    const length = Math.hypot(x2 - x1, y2 - y1);
    const tickX = -(y2 - y1) / length * 3, tickY = (x2 - x1) / length * 3;
    const vertical = Math.abs(x1 - x2) < 0.01;
    const x = (x1 + x2) / 2 + dx + (vertical ? 7 : 0);
    const y = (y1 + y2) / 2 + dy + (vertical ? 0 : dy < 0 ? -8 : 10);
    return <g key={index} className="solid-dimension">
      <g fill="none" stroke="#65758a" strokeWidth="0.8">
        <path d={`M${x1} ${y1} l${dx} ${dy} M${x2} ${y2} l${dx} ${dy}`} strokeDasharray="2 2" />
        <path d={`M${x1 + dx} ${y1 + dy} L${x2 + dx} ${y2 + dy}`} />
        <path d={`M${x1 + dx - tickX} ${y1 + dy - tickY} l${tickX * 2} ${tickY * 2} M${x2 + dx - tickX} ${y2 + dy - tickY} l${tickX * 2} ${tickY * 2}`} />
      </g>
      <text x={x} y={y} textAnchor={vertical ? "start" : "middle"} dominantBaseline="middle" fill="#17233c" stroke="white" strokeWidth="4" strokeLinejoin="round" paintOrder="stroke" fontFamily="Arial, sans-serif" fontSize="12" fontWeight="600">{value} cm</text>
    </g>;
  };
  return <svg className="elementary-solid-diagram" viewBox="0 0 340 200" role="img" aria-label={`${model.title}. ${model.note}`}>
    <title>{model.title}</title>
    <g stroke="#283c56" strokeWidth="1.5" strokeLinejoin="round">
      {model.faces.map((face, index) => <path key={index} d={[polygon(face.points), ...(face.holes ?? []).map(polygon)].join(" ")} fill={tones[face.tone]} fillRule="evenodd" />)}
      {model.seams.map(([from, to], index) => <path key={index} d={`M${project(from).join(" ")} L${project(to).join(" ")}`} fill="none" />)}
    </g>
    {model.measures.map(measure)}
  </svg>;
}
