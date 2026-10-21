"use client";

import { useRecordedState, useRecordQuestions } from "@/app/components/learning-record-state";

import { useEffect, useMemo, useState } from "react";
import { Problem, random, createProblemSet } from "@/lib/race-sets/grade-3-add-subtract-2";

type PrintMode = "worksheet" | "answers" | "both";
const INITIAL_SEED = 20260720;

function ResultMark({ value }: { value?: boolean }) {
  if (value === undefined) return null;
  return <span className={`counting-result ${value ? "correct" : "wrong"}`} role="status">{value ? "맞음" : "틀림"}</span>;
}

export default function GradeThreeAdditionSubtractionTwoPage() {
  const [questionSet, setQuestionSet] = useRecordedState("arithmetic/grade-3-add-subtract-2/page:questionSet", () => createProblemSet(INITIAL_SEED));
  const [answers, setAnswers] = useRecordedState<Record<string, string>>("arithmetic/grade-3-add-subtract-2/page:answers", {});
  const [results, setResults] = useRecordedState<Record<string, boolean>>("arithmetic/grade-3-add-subtract-2/page:results", {});
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

  const problems = useMemo(() => [...questionSet.additions, ...questionSet.subtractions], [questionSet]);
  const expected = useMemo(() => problems.map((problem) => [problem.id, String(problem.result)] as const), [problems]);
  const completed = Object.values(answers).filter(Boolean).length;
  const correct = Object.values(results).filter(Boolean).length;

  function updateAnswer(id: string, value: string) {
    setAnswers((current) => ({ ...current, [id]: value.replace(/[^0-9]/g, "").slice(0, 4) }));
    setResults((current) => {
      if (!(id in current)) return current;
      const next = { ...current };
      delete next[id];
      return next;
    });
  }

  function checkAll() {
    setResults(Object.fromEntries(expected.map(([id, answer]) => [id, answers[id] === answer])));
  }

  function resetAnswers() {
    setAnswers({});
    setResults({});
  }

  function newSet() {
    if (completed > 0 && !window.confirm("쓴 답이 사라집니다. 새 문제를 만들까요?")) return;
    setQuestionSet(createProblemSet((Date.now() ^ Math.floor(Math.random() * 0xffffffff)) >>> 0));
    resetAnswers();
  }

  function printMaterials(mode: PrintMode) {
    setPrintMenuOpen(false);
    document.documentElement.dataset.printMode = mode;
    const clearPrintMode = () => delete document.documentElement.dataset.printMode;
    window.addEventListener("afterprint", clearPrintMode, { once: true });
    window.requestAnimationFrame(() => window.print());
  }

  function renderProblem(problem: Problem, answerSheet: boolean) {
    const result = results[problem.id];
    return (
      <div className={`complement-row simple grade-three-two-row${result === true ? " is-correct" : result === false ? " is-wrong" : ""}`} data-testid="grade-three-two-row" key={problem.id}>
        <strong>{problem.left}</strong><span>{problem.operator}</span><strong>{problem.right}</strong><span>=</span>
        {answerSheet ? (
          <strong className="complement-static-answer grade-three-two-wide">{problem.result}</strong>
        ) : (
          <input
            className="complement-input grade-three-two-wide"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={4}
            value={answers[problem.id] ?? ""}
            onChange={(event) => updateAnswer(problem.id, event.target.value)}
            aria-label={`${problem.id} 답`}
          />
        )}
        {!answerSheet && <ResultMark value={result} />}
      </div>
    );
  }

  function renderSheet(answerSheet: boolean) {
    return (
      <div className="a4-sheet counting-sheet mental-math-sheet complement-sheet grade-three-two-sheet" style={{ transform: `scale(${sheetScale})` }}>
        <header className="counting-sheet-header">
          <div className="counting-sheet-title"><span>3학년</span><strong>몇백에 가까운 수 계산{answerSheet ? " 정답" : ""}</strong></div>
          <div className="counting-sheet-info"><span>이름 <i /></span><span>날짜 <i /></span><small>문제지 {questionSet.seed}</small></div>
        </header>
        <div className="complement-columns grade-three-two-columns">
          <section className="complement-column grade-three-two-column column-1" aria-label="세 자리 덧셈">
            {questionSet.additions.map((problem) => renderProblem(problem, answerSheet))}
          </section>
          <section className="complement-column grade-three-two-column column-2" aria-label="세 자리 뺄셈">
            {questionSet.subtractions.map((problem) => renderProblem(problem, answerSheet))}
          </section>
        </div>
      </div>
    );
  }

  useRecordQuestions("arithmetic/grade-3-add-subtract-2/page", { problems, expected });

  return (
    <main className="counting-page complement-page">
      <div className="counting-toolbar">
        <a className="counting-back" href="/arithmetic" aria-label="연산 목록으로 돌아가기">←</a>
        <div className="counting-progress"><strong>{correct}<small>/20 정답</small></strong></div>
        <div className="toolbar">
          <button className="button secondary" type="button" onClick={newSet}>새 문제</button>
          <button className="button ghost" type="button" onClick={resetAnswers}>다시 쓰기</button>
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
      <div className="a4-stage counting-a4-stage worksheet-stage" style={{ width: 794 * sheetScale, height: 1123 * sheetScale }} aria-label="A4 3학년 덧셈뺄셈② 문제지">{renderSheet(false)}</div>
      <div className="a4-stage counting-a4-stage answer-stage" style={{ width: 794 * sheetScale, height: 1123 * sheetScale }} aria-label="A4 3학년 덧셈뺄셈② 전체 답지">{renderSheet(true)}</div>
    </main>
  );
}
