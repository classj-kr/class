"use client";

import { useRecordedState, useRecordQuestions } from "@/app/components/learning-record-state";

import { useEffect, useState } from "react";
import {
  createStackedCubesProblemSet, sameViewGrids,
  type StackProblem, type ViewGrids,
} from "../../../lib/stacked-cubes-workouts";
import StackedCubesDiagram from "../../components/stacked-cubes-diagram";
import StackedCubesViewGrid from "../../components/stacked-cubes-view-grid";

type PrintMode = "worksheet" | "answers" | "both";
type ViewField = keyof ViewGrids;
const VIEW_FIELDS: Array<{ field: ViewField; label: string }> = [
  { field: "top", label: "위" },
  { field: "front", label: "앞" },
  { field: "side", label: "옆" },
];

function blankGrid(size: number): boolean[][] {
  return Array.from({ length: size }, () => Array<boolean>(size).fill(false));
}

function blankViews(size: number): ViewGrids {
  return { top: blankGrid(size), front: blankGrid(size), side: blankGrid(size) };
}

export default function GradeSixStackedCubesPage() {
  const [questionSet, setQuestionSet] = useRecordedState("arithmetic/grade-6-stacked-cubes/page:questionSet", () => createStackedCubesProblemSet(20260807));
  const [counts, setCounts] = useRecordedState<Record<string, string>>("arithmetic/grade-6-stacked-cubes/page:counts", {});
  const [views, setViews] = useRecordedState<Record<string, ViewGrids>>("arithmetic/grade-6-stacked-cubes/page:views", {});
  const [results, setResults] = useRecordedState<Record<string, boolean>>("arithmetic/grade-6-stacked-cubes/page:results", {});
  const [sheetScale, setSheetScale] = useState(0.6);
  const [printMenuOpen, setPrintMenuOpen] = useState(false);

  useEffect(() => {
    function fitA4Sheet() {
      setSheetScale(Math.min((window.innerWidth - 32) / 794, 1));
    }
    fitA4Sheet();
    window.addEventListener("resize", fitA4Sheet);
    return () => window.removeEventListener("resize", fitA4Sheet);
  }, []);

  const completed = Object.keys(counts).length + Object.keys(views).length;
  const correctProblems = questionSet.problems.filter((problem) => results[problem.id] === true).length;

  function updateCount(id: string, value: string) {
    setCounts((current) => ({ ...current, [id]: value.replace(/[^0-9]/g, "").slice(0, 2) }));
    setResults((current) => {
      if (!(id in current)) return current;
      const next = { ...current };
      delete next[id];
      return next;
    });
  }

  function toggleView(problem: StackProblem, field: ViewField, row: number, col: number) {
    setViews((current) => {
      const grids = current[problem.id] ?? blankViews(problem.size);
      const nextGrid = grids[field].map((line) => [...line]);
      nextGrid[row][col] = !nextGrid[row][col];
      return { ...current, [problem.id]: { ...grids, [field]: nextGrid } };
    });
    setResults((current) => {
      if (!(problem.id in current)) return current;
      const next = { ...current };
      delete next[problem.id];
      return next;
    });
  }

  function resetAnswers() {
    setCounts({});
    setViews({});
    setResults({});
  }

  function newSet() {
    if (completed > 0 && !window.confirm("쓴 답이 사라집니다. 새 문제를 만들까요?")) return;
    setQuestionSet(createStackedCubesProblemSet((Date.now() ^ Math.floor(Math.random() * 0xffffffff)) >>> 0));
    resetAnswers();
  }

  function checkAll() {
    setResults(Object.fromEntries(questionSet.problems.map((problem) => {
      if (problem.kind === "three-view") {
        const answer = views[problem.id] ?? blankViews(problem.size);
        const isCorrect = VIEW_FIELDS.every(({ field }) => sameViewGrids(answer[field], problem.views[field]));
        return [problem.id, isCorrect];
      }
      return [problem.id, counts[problem.id] === String(problem.total)];
    })));
  }

  function printMaterials(mode: PrintMode) {
    setPrintMenuOpen(false);
    document.documentElement.dataset.printMode = mode;
    const clearPrintMode = () => delete document.documentElement.dataset.printMode;
    window.addEventListener("afterprint", clearPrintMode, { once: true });
    window.requestAnimationFrame(() => window.print());
  }

  function renderCountProblem(problem: StackProblem, index: number, answerSheet: boolean) {
    return (
      <article className="stack-problem stack-count-problem" data-testid="stack-problem" key={problem.id}>
        <p><b>{index + 1}</b>쌓기나무의 개수를 구하시오.</p>
        <div className="stack-count-body">
          <StackedCubesDiagram heights={problem.heights} showMap={problem.kind === "count-map"} />
          <div className="stack-count-answer">
            <span>→</span>
            {answerSheet
              ? <strong className="stack-count-static-answer">{problem.total}</strong>
              : <input
                className="stack-count-input"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={2}
                value={counts[problem.id] ?? ""}
                onChange={(event) => updateCount(problem.id, event.target.value)}
                aria-label={`${index + 1}번 답`}
              />}
            <em>개</em>
          </div>
        </div>
      </article>
    );
  }

  function renderViewProblem(problem: StackProblem, index: number, answerSheet: boolean) {
    const answer = views[problem.id] ?? blankViews(problem.size);
    return (
      <article className="stack-problem stack-view-problem" data-testid="stack-problem" key={problem.id}>
        <p><b>{index + 1}</b>쌓기나무를 위, 앞, 옆에서 본 모양을 그리시오.</p>
        <div className="stack-view-body">
          <StackedCubesDiagram heights={problem.heights} showDirection />
          <div className="stack-view-grids">
            {VIEW_FIELDS.map(({ field, label }) => (
              <StackedCubesViewGrid
                key={field}
                size={problem.size}
                label={`<${label}>`}
                value={answerSheet ? problem.views[field] : answer[field]}
                readOnly={answerSheet}
                correct={answerSheet ? problem.views[field] : undefined}
                onToggle={answerSheet ? undefined : (row, col) => toggleView(problem, field, row, col)}
              />
            ))}
          </div>
        </div>
      </article>
    );
  }

  function renderProblem(problem: StackProblem, index: number, answerSheet: boolean) {
    const graded = problem.id in results;
    const isCorrect = graded && results[problem.id];
    const body = problem.kind === "three-view"
      ? renderViewProblem(problem, index, answerSheet)
      : renderCountProblem(problem, index, answerSheet);
    return (
      <div className={`stack-problem-wrap${graded ? isCorrect ? " is-correct" : " is-wrong" : ""}`} key={problem.id}>
        {body}
        {!answerSheet && graded && <span className={`counting-result ${isCorrect ? "correct" : "wrong"}`} role="status">{isCorrect ? "맞음" : "틀림"}</span>}
      </div>
    );
  }

  function renderSheet(answerSheet: boolean) {
    return (
      <div className="a4-sheet counting-sheet stack-sheet" style={{ transform: `scale(${sheetScale})` }}>
        <header className="counting-sheet-header">
          <div className="counting-sheet-title"><span>6학년</span><strong>쌓기나무의 개수와 세 방향 모양{answerSheet ? " 정답" : ""}</strong></div>
          <div className="counting-sheet-info"><span>이름 <i /></span><span>날짜 <i /></span><small>문제지 {questionSet.seed}</small></div>
        </header>
        <div className="stack-grid">{questionSet.problems.map((problem, index) => renderProblem(problem, index, answerSheet))}</div>
      </div>
    );
  }

  useRecordQuestions("arithmetic/grade-6-stacked-cubes/page", {  });

  return (
    <main className="counting-page stack-page">
      <div className="counting-toolbar">
        <a className="counting-back" href="/arithmetic" aria-label="연산 목록으로 돌아가기">←</a>
        <div className="counting-progress"><strong>{correctProblems}<small>/10 정답</small></strong></div>
        <div className="toolbar">
          <button className="button secondary" type="button" onClick={newSet}>새 문제</button>
          <button className="button ghost" type="button" onClick={resetAnswers}>다시 풀기</button>
          <div className="print-control">
            <button className="button ghost print-button" type="button" aria-expanded={printMenuOpen} aria-haspopup="menu" onClick={() => setPrintMenuOpen((open) => !open)}>인쇄</button>
            {printMenuOpen && <div className="print-menu" role="menu" aria-label="인쇄 자료 선택">
              <button type="button" role="menuitem" onClick={() => printMaterials("worksheet")}>문제지만 인쇄</button>
              <button type="button" role="menuitem" onClick={() => printMaterials("answers")}>답지만 인쇄</button>
              <button type="button" role="menuitem" onClick={() => printMaterials("both")}>문제지+답지 인쇄</button>
            </div>}
          </div>
          <button className="button primary" type="button" onClick={checkAll}>전체 채점</button>
        </div>
      </div>
      <div className="a4-stage counting-a4-stage worksheet-stage" style={{ width: 794 * sheetScale, height: 1123 * sheetScale }} aria-label="A4 6학년 쌓기나무 문제지">{renderSheet(false)}</div>
      <div className="a4-stage counting-a4-stage answer-stage" style={{ width: 794 * sheetScale, height: 1123 * sheetScale }} aria-label="A4 6학년 쌓기나무 전체 답지">{renderSheet(true)}</div>
    </main>
  );
}
