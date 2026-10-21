"use client";

import { useRecordedState, useRecordQuestions } from "@/app/components/learning-record-state";

import { useEffect, useMemo, useState } from "react";
import { createProblemSet, type LengthProblem, type LengthValue } from "@/lib/race-sets/grade-3-length";

type PrintMode = "worksheet" | "answers" | "both";
const INITIAL_SEED = 20260720;
export default function GradeThreeLengthPage() {
  const [questionSet, setQuestionSet] = useRecordedState("arithmetic/grade-3-length/page:questionSet", () => createProblemSet(INITIAL_SEED));
  const [answers, setAnswers] = useRecordedState<Record<string, string>>("arithmetic/grade-3-length/page:answers", {});
  const [results, setResults] = useRecordedState<Record<string, boolean>>("arithmetic/grade-3-length/page:results", {});
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

  const expected = useMemo(() => questionSet.problems.map((problem) => [problem.id, String(problem.result.major), String(problem.result.minor)] as const), [questionSet]);
  const completed = Object.values(answers).filter(Boolean).length;
  const correct = Object.values(results).filter(Boolean).length;

  function updateAnswer(id: string, part: "major" | "minor", value: string) {
    setAnswers((current) => ({ ...current, [`${id}-${part}`]: value.replace(/[^0-9]/g, "").slice(0, 3) }));
    setResults((current) => {
      if (!(id in current)) return current;
      const next = { ...current };
      delete next[id];
      return next;
    });
  }

  function checkAll() {
    setResults(Object.fromEntries(expected.map(([id, major, minor]) => [id, answers[`${id}-major`] === major && answers[`${id}-minor`] === minor])));
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

  function renderValue(problem: LengthProblem, value: LengthValue) {
    return <div className="length-operation-value"><strong>{value.major}</strong><span>{problem.units.major}</span><strong>{value.minor}</strong><span>{problem.units.minor}</span></div>;
  }

  function renderAnswer(problem: LengthProblem, answerSheet: boolean) {
    if (answerSheet) {
      return <div className="length-operation-value"><strong className="length-operation-static">{problem.result.major}</strong><span>{problem.units.major}</span><strong className="length-operation-static minor">{problem.result.minor}</strong><span>{problem.units.minor}</span></div>;
    }
    return (
      <div className="length-operation-value">
        <input className="length-operation-input" type="text" inputMode="numeric" pattern="[0-9]*" maxLength={2} value={answers[`${problem.id}-major`] ?? ""} onChange={(event) => updateAnswer(problem.id, "major", event.target.value)} aria-label={`${problem.id} ${problem.units.major} 답`} />
        <span>{problem.units.major}</span>
        <input className="length-operation-input minor" type="text" inputMode="numeric" pattern="[0-9]*" maxLength={3} value={answers[`${problem.id}-minor`] ?? ""} onChange={(event) => updateAnswer(problem.id, "minor", event.target.value)} aria-label={`${problem.id} ${problem.units.minor} 답`} />
        <span>{problem.units.minor}</span>
      </div>
    );
  }

  function renderProblem(problem: LengthProblem, index: number, answerSheet: boolean) {
    const graded = problem.id in results;
    const isCorrect = results[problem.id] === true;
    return (
      <div className={`length-question length-operation-question${graded ? isCorrect ? " is-correct" : " is-wrong" : ""}`} data-testid="grade-three-length-question" key={problem.id}>
        <span className="length-operation-number">{index + 1}</span>
        <div className="length-operation-line"><b aria-hidden="true" />{renderValue(problem, problem.left)}</div>
        <div className="length-operation-line"><b>{problem.operator}</b>{renderValue(problem, problem.right)}</div>
        <span className="length-operation-rule" aria-hidden="true" />
        <div className="length-operation-line"><b aria-hidden="true" />{renderAnswer(problem, answerSheet)}</div>
        {!answerSheet && graded && <span className={`counting-result ${isCorrect ? "correct" : "wrong"}`} role="status">{isCorrect ? "맞음" : "틀림"}</span>}
      </div>
    );
  }

  function renderSheet(answerSheet: boolean) {
    return (
      <div className="a4-sheet counting-sheet length-sheet" style={{ transform: `scale(${sheetScale})` }}>
        <header className="counting-sheet-header">
          <div className="counting-sheet-title"><span>3학년</span><strong>길이의 덧셈·뺄셈{answerSheet ? " 정답" : ""}</strong></div>
          <div className="counting-sheet-info"><span>이름 <i /></span><span>날짜 <i /></span><small>문제지 {questionSet.seed}</small></div>
        </header>
        <div className="length-operation-grid">{questionSet.problems.map((problem, index) => renderProblem(problem, index, answerSheet))}</div>
      </div>
    );
  }

  useRecordQuestions("arithmetic/grade-3-length/page", { expected });

  return (
    <main className="counting-page length-page">
      <div className="counting-toolbar">
        <a className="counting-back" href="/arithmetic" aria-label="연산 목록으로 돌아가기">←</a>
        <div className="counting-progress"><strong>{correct}<small>/9 정답</small></strong></div>
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
      <div className="a4-stage counting-a4-stage worksheet-stage" style={{ width: 794 * sheetScale, height: 1123 * sheetScale }} aria-label="A4 3학년 길이 문제지">{renderSheet(false)}</div>
      <div className="a4-stage counting-a4-stage answer-stage" style={{ width: 794 * sheetScale, height: 1123 * sheetScale }} aria-label="A4 3학년 길이 전체 답지">{renderSheet(true)}</div>
    </main>
  );
}
