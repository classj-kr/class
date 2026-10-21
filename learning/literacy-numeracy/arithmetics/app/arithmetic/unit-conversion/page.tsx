"use client";

import { useRecordedState, useRecordQuestions } from "@/app/components/learning-record-state";

import { useEffect, useMemo, useState } from "react";
import { createProblemSet, matchesDecimal, sanitizeDecimal, type ConversionProblem, type DisplayPart } from "@/lib/race-sets/unit-conversion";

type PrintMode = "worksheet" | "answers" | "both";
const INITIAL_SEED = 20260721;

export default function UnitConversionPage() {
  const [questionSet, setQuestionSet] = useRecordedState("arithmetic/unit-conversion/page:questionSet", () => createProblemSet(INITIAL_SEED));
  const [answers, setAnswers] = useRecordedState<Record<string, Record<string, string>>>("arithmetic/unit-conversion/page:answers", {});
  const [results, setResults] = useRecordedState<Record<string, boolean>>("arithmetic/unit-conversion/page:results", {});
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
  const completed = problems.filter((problem) => problem.answer.some((part) => answers[problem.id]?.[part.key])).length;
  const correct = Object.values(results).filter(Boolean).length;

  function updateAnswer(problemId: string, key: string, value: string) {
    setAnswers((current) => ({
      ...current,
      [problemId]: { ...current[problemId], [key]: sanitizeDecimal(value) },
    }));
    setResults((current) => {
      if (!(problemId in current)) return current;
      const next = { ...current };
      delete next[problemId];
      return next;
    });
  }

  function checkAll() {
    setResults(Object.fromEntries(problems.map((problem) => [
      problem.id,
      problem.answer.every((part) => matchesDecimal(answers[problem.id]?.[part.key], part.value)),
    ])));
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

  function renderDisplayPart(part: DisplayPart, index: number) {
    return <span className="unit-conversion-value" key={`${part.unit}-${index}`}><strong>{part.value}</strong><small>{part.unit}</small></span>;
  }

  function renderProblem(problem: ConversionProblem, index: number, answerSheet: boolean) {
    const graded = problem.id in results;
    const isCorrect = results[problem.id] === true;
    return (
      <div className={`multiplication-question unit-conversion-question${graded ? isCorrect ? " is-correct" : " is-wrong" : ""}`} data-testid="unit-conversion-question" key={problem.id}>
        <span className="unit-conversion-index">{index + 1}</span>
        <div className="unit-conversion-expression">
          <span className="unit-conversion-parts">{problem.left.map(renderDisplayPart)}</span>
          <span className="unit-conversion-equals">=</span>
          <span className={`unit-conversion-parts answer answer-count-${problem.answer.length}`}>
            {problem.answer.map((part) => answerSheet
              ? <span className="unit-conversion-static-answer" key={part.key}><strong>{part.value}</strong><small>{part.unit}</small></span>
              : <label className="unit-conversion-answer" key={part.key}>
                  <input type="text" inputMode="decimal" maxLength={10} value={answers[problem.id]?.[part.key] ?? ""} onChange={(event) => updateAnswer(problem.id, part.key, event.target.value)} aria-label={`${problem.id} ${part.unit} 답`} />
                  <small>{part.unit}</small>
                </label>)}
          </span>
        </div>
        {!answerSheet && graded && <span className={`counting-result ${isCorrect ? "correct" : "wrong"}`} role="status">{isCorrect ? "맞음" : "틀림"}</span>}
      </div>
    );
  }

  function renderSheet(answerSheet: boolean) {
    return (
      <div className="a4-sheet counting-sheet unit-conversion-sheet" style={{ transform: `scale(${sheetScale})` }}>
        <header className="counting-sheet-header">
          <div className="counting-sheet-title"><span>4학년</span><strong>단위 변환{answerSheet ? " 정답" : ""}</strong></div>
          <div className="counting-sheet-info"><span>이름 <i /></span><span>날짜 <i /></span><small>문제지 {questionSet.seed}</small></div>
        </header>
        <div className="unit-conversion-grid">{problems.map((problem, index) => renderProblem(problem, index, answerSheet))}</div>
      </div>
    );
  }

  useRecordQuestions("arithmetic/unit-conversion/page", { problems });

  return (
    <main className="counting-page multiplication-page">
      <div className="counting-toolbar">
        <a className="counting-back" href="/arithmetic" aria-label="연산 목록으로 돌아가기">←</a>
        <div className="counting-progress"><strong>{correct}<small>/12 정답</small></strong></div>
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
      <div className="a4-stage counting-a4-stage worksheet-stage" style={{ width: 794 * sheetScale, height: 1123 * sheetScale }} aria-label="A4 4학년 길이의 단위 변환 문제지">{renderSheet(false)}</div>
      <div className="a4-stage counting-a4-stage answer-stage" style={{ width: 794 * sheetScale, height: 1123 * sheetScale }} aria-label="A4 4학년 길이의 단위 변환 전체 답지">{renderSheet(true)}</div>
    </main>
  );
}
