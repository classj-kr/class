"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { createElementaryGeometryMeasurementSet, normalizeGeometryMeasurementAnswer, type GeometryMeasurementMode, type GeometryMeasurementProblem } from "../../lib/elementary-geometry-measurement";

import { createSolidDiagram } from "../../lib/elementary-solid-diagrams";
import ElementarySolidDiagram from "./elementary-solid-diagram";

type Field = "first" | "second";
type Answers = Record<string, Partial<Record<Field, string>>>;
const ink = "#17233c";
const fill = "#dce8f7";

function Label({ x, y, children }: { x: number; y: number; children: ReactNode }) {
  return <text x={x} y={y} textAnchor="middle" fontSize="13" fontWeight="700" fill={ink}>{children}</text>;
}

function OrthogonalDiagram({ problem }: { problem: GeometryMeasurementProblem }) {
  const cells = problem.cells ?? [];
  const cellWidth = problem.dimensions.cellWidth;
  const cellHeight = problem.dimensions.cellHeight;
  const occupied = new Set(cells.map(([x, y]) => `${x},${y}`));
  const columns = Math.max(...cells.map(([x]) => x)) + 1;
  const rows = Math.max(...cells.map(([, y]) => y)) + 1;
  const scale = Math.min(180 / (columns * cellWidth), 128 / (rows * cellHeight));
  const width = cellWidth * scale;
  const height = cellHeight * scale;
  const originX = (280 - columns * width) / 2;
  const originY = (155 - rows * height) / 2 + 4;
  const topCell = cells.find(([x, y]) => !occupied.has(`${x},${y - 1}`)) ?? cells[0];
  const leftCell = cells.find(([x, y]) => !occupied.has(`${x - 1},${y}`)) ?? cells[0];
  const topMeasureX = originX + topCell[0] * width;
  const topMeasureY = originY + topCell[1] * height - 8;
  const leftMeasureX = originX + leftCell[0] * width - 9;
  const leftMeasureY = originY + leftCell[1] * height;
  const edges = cells.flatMap(([x, y]) => {
    const left = originX + x * width;
    const top = originY + y * height;
    return [
      !occupied.has(`${x},${y - 1}`) && <line key={`${x}-${y}-t`} x1={left} y1={top} x2={left + width} y2={top} />,
      !occupied.has(`${x + 1},${y}`) && <line key={`${x}-${y}-r`} x1={left + width} y1={top} x2={left + width} y2={top + height} />,
      !occupied.has(`${x},${y + 1}`) && <line key={`${x}-${y}-b`} x1={left} y1={top + height} x2={left + width} y2={top + height} />,
      !occupied.has(`${x - 1},${y}`) && <line key={`${x}-${y}-l`} x1={left} y1={top} x2={left} y2={top + height} />,
    ].filter(Boolean);
  });
  return <svg viewBox="0 0 280 180" role="img" aria-label="회전하거나 뒤집은 여러 가지 직각 다각형">
    {cells.map(([x, y]) => <rect key={`${x}-${y}`} x={originX + x * width} y={originY + y * height} width={width} height={height} fill={fill} />)}
    <g stroke={ink} strokeWidth="2" strokeLinecap="round">{edges}</g>
    <line x1={topMeasureX} y1={topMeasureY} x2={topMeasureX + width} y2={topMeasureY} stroke="#d05a44" strokeWidth="2" />
    <Label x={topMeasureX + width / 2} y={topMeasureY - 4}>{cellWidth}cm</Label>
    <line x1={leftMeasureX} y1={leftMeasureY} x2={leftMeasureX} y2={leftMeasureY + height} stroke="#315bb5" strokeWidth="2" />
    <Label x={leftMeasureX - 13} y={leftMeasureY + height / 2 + 5}>{cellHeight}cm</Label>
  </svg>;
}
function Diagram({ problem, plane }: { problem: GeometryMeasurementProblem; plane: boolean }) {
  const d = problem.dimensions;
  if (!plane) return <ElementarySolidDiagram problem={problem} />;
  if (problem.kind === "orthogonal") return <OrthogonalDiagram problem={problem} />;
  if (problem.kind === "l-shape") return <svg viewBox="0 0 280 180" role="img" aria-label="한 모서리를 잘라 낸 L자 도형"><path d="M45 25 H225 V85 H170 V155 H45 Z" fill={fill} stroke={ink} strokeWidth="2" /><Label x={135} y={174}>{d.width}cm</Label><Label x={24} y={94}>{d.height}cm</Label><Label x={198} y={78}>{d.cutWidth}cm</Label><Label x={247} y={121}>{d.cutHeight}cm</Label></svg>;
  if (problem.kind === "frame") return <svg viewBox="0 0 280 180" role="img" aria-label="가운데가 뚫린 직사각형 액자"><path d="M35 20 H245 V160 H35 Z M85 58 H195 V122 H85 Z" fill={fill} stroke={ink} strokeWidth="2" fillRule="evenodd" /><Label x={140} y={177}>{d.width}cm</Label><Label x={16} y={94}>{d.height}cm</Label><Label x={140} y={53}>{d.innerWidth}cm</Label><Label x={211} y={94}>{d.innerHeight}cm</Label></svg>;
  if (problem.kind === "u-shape") return <svg viewBox="0 0 280 180" role="img" aria-label="윗부분에 직사각형 홈이 파인 도형"><path d="M40 25 H105 V95 H175 V25 H240 V160 H40 Z" fill={fill} stroke={ink} strokeWidth="2" /><Label x={140} y={177}>{d.width}cm</Label><Label x={18} y={96}>{d.height}cm</Label><Label x={140} y={89}>{d.notchWidth}cm</Label><Label x={190} y={63}>{d.notchHeight}cm</Label></svg>;
  if (problem.kind === "c-shape") return <svg viewBox="0 0 280 180" role="img" aria-label="오른쪽이 파인 직각 다각형"><path d="M40 25 H240 V60 H165 V120 H240 V155 H40 Z" fill={fill} stroke={ink} strokeWidth="2" /><line x1="40" y1="16" x2="240" y2="16" stroke="#d05a44" strokeWidth="2" /><Label x={140} y={12}>{d.width}cm</Label><line x1="29" y1="25" x2="29" y2="155" stroke="#315bb5" strokeWidth="2" /><Label x={15} y={94}>{d.height}cm</Label><line x1="165" y1="51" x2="240" y2="51" stroke="#d05a44" strokeWidth="2" /><Label x={202} y={47}>{d.cutWidth}cm</Label><line x1="156" y1="60" x2="156" y2="120" stroke="#315bb5" strokeWidth="2" /><Label x={143} y={94}>{d.cutHeight}cm</Label></svg>;
  if (problem.kind === "house") return <svg viewBox="0 0 280 180" role="img" aria-label="직사각형과 삼각형을 붙인 집 모양"><path d="M55 72 L140 15 L225 72 V160 H55 Z" fill={fill} stroke={ink} strokeWidth="2" /><line x1="55" y1="72" x2="225" y2="72" stroke={ink} strokeDasharray="5 4" /><Label x={140} y={177}>{d.width}cm</Label><Label x={34} y={118}>{d.height}cm</Label><Label x={90} y={37}>{d.roofSide}cm</Label><Label x={154} y={50}>높이 {d.roofHeight}cm</Label></svg>;
  return null;
}

export default function ElementaryGeometryMeasurement({ mode }: { mode: GeometryMeasurementMode }) {
  const plane = mode === "plane";
  const grade = plane ? "5학년" : "6학년";
  const title = plane ? "다각형의 둘레와 넓이" : "직육면체의 겉넓이·부피";
  const [seed, setSeed] = useState(plane ? 20260822 : 20260823);
  const [answers, setAnswers] = useState<Answers>({});
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [scale, setScale] = useState(0.6);
  const [printOpen, setPrintOpen] = useState(false);
  const problems = useMemo(() => createElementaryGeometryMeasurementSet(mode, seed), [mode, seed]);
  const correct = problems.filter((problem) => results[`${problem.id}-first`] === true && results[`${problem.id}-second`] === true).length;

  useEffect(() => {
    const fit = () => setScale(Math.min((innerWidth - 32) / 794, 1));
    fit();
    addEventListener("resize", fit);
    return () => removeEventListener("resize", fit);
  }, []);

  const update = (id: string, field: Field, value: string) => {
    setAnswers((now) => ({ ...now, [id]: { ...now[id], [field]: value.replace(/[^0-9.,-]/g, "").slice(0, 10) } }));
    setResults((now) => { const next = { ...now }; delete next[`${id}-${field}`]; return next; });
  };
  const reset = () => { setAnswers({}); setResults({}); };
  const fresh = () => {
    if (Object.values(answers).some((answer) => Object.values(answer).some(Boolean)) && !confirm("답이 사라집니다. 새 문제를 만들까요?")) return;
    setSeed((Date.now() ^ Math.floor(Math.random() * 0xffffffff)) >>> 0);
    reset();
  };
  const check = () => setResults(Object.fromEntries(
    problems.flatMap((problem) =>
      (["first", "second"] as const).map((field) =>
        [`${problem.id}-${field}`, normalizeGeometryMeasurementAnswer(answers[problem.id]?.[field] ?? "") === problem[field]],
      ),
    ),
  ));
  const print = (printMode: "worksheet" | "answers" | "both") => { setPrintOpen(false); document.documentElement.dataset.printMode = printMode; addEventListener("afterprint", () => delete document.documentElement.dataset.printMode, { once: true }); requestAnimationFrame(() => window.print()); };
  const answerField = (problem: GeometryMeasurementProblem, field: Field, key: boolean) => {
    const label = field === "first" ? problem.firstLabel : problem.secondLabel;
    const unit = field === "first" ? problem.firstUnit : problem.secondUnit;
    const resultId = `${problem.id}-${field}`;
    return <div className="circle-equation"><span>{label}</span><strong>=</strong>{key ? <em className="circle-static-answer">{problem[field]}</em> : <input type="text" inputMode="decimal" value={answers[problem.id]?.[field] ?? ""} onChange={(event) => update(problem.id, field, event.target.value)} aria-label={`${label} 답`} />}<small>{unit}</small>{!key && resultId in results && <b className={results[resultId] ? "correct" : "wrong"}>{results[resultId] ? "맞음" : "틀림"}</b>}</div>;
  };
  const question = (problem: GeometryMeasurementProblem, index: number, key: boolean) => {
    const firstResult = results[`${problem.id}-first`];
    const secondResult = results[`${problem.id}-second`];
    const graded = firstResult !== undefined && secondResult !== undefined;
    return <article className={`circle-question geometry-measurement-question${plane ? "" : " solid-measurement-question"}${graded ? firstResult && secondResult ? " is-correct" : " is-wrong" : ""}`} key={problem.id} data-geometry-kind={problem.kind}><span className="circle-index">{index + 1}</span><Diagram problem={problem} plane={plane} /><div className="circle-answer-pair">{!plane && <p className="solid-measurement-note">{createSolidDiagram(problem).note}</p>}{answerField(problem, "first", key)}{answerField(problem, "second", key)}</div></article>;
  };
  const sheet = (key: boolean) => <div className="a4-sheet counting-sheet circle-sheet geometry-measurement-sheet" style={{ transform: `scale(${scale})` }}><header className="counting-sheet-header"><div className="counting-sheet-title"><span>{grade}</span><strong>{title}{key ? " 정답" : ""}</strong></div><div className="counting-sheet-info"><span>이름 <i /></span><span>날짜 <i /></span><small>문제지 {seed}</small></div></header><p className="circle-guide">그림에 표시된 길이를 이용하여 {plane ? "도형의 둘레와 넓이" : "입체도형의 겉넓이와 부피"}를 구하세요.</p><div className="circle-grid">{problems.map((problem, index) => question(problem, index, key))}</div></div>;

  return <main className="counting-page multiplication-page"><div className="counting-toolbar"><a className="counting-back" href="/arithmetic" aria-label="연산 목록으로 돌아가기">←</a><div className="counting-progress"><strong>{correct}<small>/{problems.length}문제 정답</small></strong></div><div className="toolbar"><button className="button secondary" onClick={fresh}>새 문제</button><button className="button ghost" onClick={reset}>다시 풀기</button><div className="print-control"><button className="button ghost print-button" onClick={() => setPrintOpen(!printOpen)}>인쇄</button>{printOpen && <div className="print-menu"><button onClick={() => print("worksheet")}>문제지만 인쇄</button><button onClick={() => print("answers")}>답지만 인쇄</button><button onClick={() => print("both")}>문제지+답지 인쇄</button></div>}</div><button className="button primary" onClick={check}>전체 채점</button></div></div><div className="a4-stage counting-a4-stage worksheet-stage" style={{ width: 794 * scale, height: 1123 * scale }}>{sheet(false)}</div><div className="a4-stage counting-a4-stage answer-stage" style={{ width: 794 * scale, height: 1123 * scale }}>{sheet(true)}</div></main>;
}
