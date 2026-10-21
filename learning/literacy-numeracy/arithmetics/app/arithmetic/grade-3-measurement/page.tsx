"use client";

import { useRecordedState, useRecordQuestions } from "@/app/components/learning-record-state";

import { useEffect, useMemo, useState } from "react";
import { createProblemSet, expectedField, type Answer, type Problem, type Quantity } from "@/lib/race-sets/grade-3-measurement";

type PrintMode = "worksheet" | "answers" | "both";
const INITIAL_SEED = 20260720;

export default function GradeThreeMeasurementPage() {
  const [questionSet, setQuestionSet] = useRecordedState("arithmetic/grade-3-measurement/page:questionSet", () => createProblemSet(INITIAL_SEED));
  const [answers, setAnswers] = useRecordedState<Record<string, Answer>>("arithmetic/grade-3-measurement/page:answers", {});
  const [results, setResults] = useRecordedState<Record<string, boolean>>("arithmetic/grade-3-measurement/page:results", {});
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

  const problems = useMemo(() => questionSet.problems, [questionSet]);
  const completed = problems.filter((problem) => {
    const answer = answers[problem.id];
    return Boolean((problem.answer.major === 0 || answer?.major) && (problem.answer.minor === 0 || answer?.minor));
  }).length;
  const correct = Object.values(results).filter(Boolean).length;

  function updateAnswer(id: string, field: keyof Answer, value: string) {
    setAnswers((current) => ({
      ...current,
      [id]: {
        major: current[id]?.major ?? "",
        minor: current[id]?.minor ?? "",
        [field]: value.replace(/[^0-9]/g, "").slice(0, field === "major" ? 2 : 3),
      },
    }));
    setResults((current) => {
      if (!(id in current)) return current;
      const next = { ...current };
      delete next[id];
      return next;
    });
  }

  function checkAll() {
    setResults(Object.fromEntries(problems.map((problem) => {
      const answer = answers[problem.id];
      return [problem.id, expectedField(answer?.major, problem.answer.major) && expectedField(answer?.minor, problem.answer.minor)];
    })));
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

  function renderQuantity(value: Quantity, problem: Problem) {
    return <span className="measurement-quantity"><strong>{value.major}</strong><span>{problem.majorUnit}</span><strong>{value.minor}</strong><span>{problem.minorUnit}</span></span>;
  }

  function renderProblem(problem: Problem, index: number, answerSheet: boolean) {
    const answer = answers[problem.id] ?? { major: "", minor: "" };
    const graded = problem.id in results;
    const isCorrect = results[problem.id] === true;
    return (
      <div className={`multiplication-question measurement-question${graded ? isCorrect ? " is-correct" : " is-wrong" : ""}`} data-testid="measurement-question" key={problem.id}>
        <span className="measurement-number">{index + 1}</span>
        <div className="measurement-operation">
          <div className="measurement-operand">{renderQuantity(problem.left, problem)}</div>
          <div className="measurement-operand"><b>{problem.operator}</b>{renderQuantity(problem.right, problem)}</div>
          <div className="measurement-rule" />
          {answerSheet
            ? <span className="measurement-static-answer"><strong>{problem.answer.major || ""}</strong><span>{problem.answer.major > 0 ? problem.majorUnit : ""}</span><strong>{problem.answer.minor || ""}</strong><span>{problem.answer.minor > 0 ? problem.minorUnit : ""}</span></span>
            : <span className="measurement-answer">
                <input type="text" inputMode="numeric" pattern="[0-9]*" maxLength={2} value={answer.major} onChange={(event) => updateAnswer(problem.id, "major", event.target.value)} aria-label={`${index + 1}번 ${problem.majorUnit} 답`} /><span>{problem.majorUnit}</span>
                <input type="text" inputMode="numeric" pattern="[0-9]*" maxLength={3} value={answer.minor} onChange={(event) => updateAnswer(problem.id, "minor", event.target.value)} aria-label={`${index + 1}번 ${problem.minorUnit} 답`} /><span>{problem.minorUnit}</span>
              </span>}
        </div>
        {!answerSheet && graded && <span className={`counting-result ${isCorrect ? "correct" : "wrong"}`} role="status">{isCorrect ? "맞음" : "틀림"}</span>}
      </div>
    );
  }

  function renderSheet(answerSheet: boolean) {
    return (
      <div className="a4-sheet counting-sheet measurement-sheet" style={{ transform: `scale(${sheetScale})` }}>
        <header className="counting-sheet-header">
          <div className="counting-sheet-title"><span>3학년</span><strong>무게와 들이의 계산{answerSheet ? " 정답" : ""}</strong></div>
          <div className="counting-sheet-info"><span>이름 <i /></span><span>날짜 <i /></span><small>문제지 {questionSet.seed}</small></div>
        </header>
        <div className="measurement-grid">{questionSet.problems.map((problem, index) => renderProblem(problem, index, answerSheet))}</div>
      </div>
    );
  }

  useRecordQuestions("arithmetic/grade-3-measurement/page", { problems });

  return (
    <main className="counting-page multiplication-page">
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
      <div className="a4-stage counting-a4-stage worksheet-stage" style={{ width: 794 * sheetScale, height: 1123 * sheetScale }} aria-label="A4 3학년 무게와 들이 문제지">{renderSheet(false)}</div>
      <div className="a4-stage counting-a4-stage answer-stage" style={{ width: 794 * sheetScale, height: 1123 * sheetScale }} aria-label="A4 3학년 무게와 들이 전체 답지">{renderSheet(true)}</div>
    </main>
  );
}
