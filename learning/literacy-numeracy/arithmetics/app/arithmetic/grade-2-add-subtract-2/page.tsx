"use client";

import { useRecordedState, useRecordQuestions } from "@/app/components/learning-record-state";

import { useEffect, useMemo, useState } from "react";
import { DigitField, DigitProblem, random, digits, createProblemSet, answerId } from "@/lib/race-sets/grade-2-add-subtract-2";

type PrintMode = "worksheet" | "answers" | "both";
const INITIAL_SEED = 20260720;

export default function GradeTwoAdditionSubtractionTwoPage() {
  const [questionSet, setQuestionSet] = useRecordedState("arithmetic/grade-2-add-subtract-2/page:questionSet", () => createProblemSet(INITIAL_SEED));
  const [answers, setAnswers] = useRecordedState<Record<string, string>>("arithmetic/grade-2-add-subtract-2/page:answers", {});
  const [results, setResults] = useRecordedState<Record<string, boolean>>("arithmetic/grade-2-add-subtract-2/page:results", {});
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

  const expected = useMemo(
    () => questionSet.problems.flatMap((problem) => {
      const values = digits(problem);
      return problem.hidden.map((field) => [answerId(problem, field), values[field]] as const);
    }),
    [questionSet],
  );
  const completed = Object.values(answers).filter(Boolean).length;
  const correct = questionSet.problems.filter((problem) =>
    problem.hidden.every((field) => results[answerId(problem, field)] === true),
  ).length;

  function updateAnswer(id: string, value: string) {
    setAnswers((current) => ({ ...current, [id]: value.replace(/[^0-9]/g, "").slice(0, 1) }));
    setResults((current) => {
      if (!(id in current)) return current;
      const next = { ...current };
      delete next[id];
      return next;
    });
  }

  function checkAll() {
    setResults(Object.fromEntries(expected.map(([id, value]) => [id, answers[id] === value])));
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

  function renderDigit(problem: DigitProblem, field: DigitField, answerSheet: boolean) {
    const value = digits(problem)[field];
    if (!problem.hidden.includes(field)) return <span className="digit-value">{value}</span>;
    if (answerSheet) return <strong className="digit-static-answer">{value}</strong>;
    const id = answerId(problem, field);
    return (
      <input
        className="digit-input"
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        maxLength={1}
        value={answers[id] ?? ""}
        onChange={(event) => updateAnswer(id, event.target.value)}
        aria-label={`${id} 답`}
      />
    );
  }

  function renderNumber(problem: DigitProblem, fields: DigitField[], answerSheet: boolean) {
    return <span className="digit-number">{fields.map((field) => <span key={field}>{renderDigit(problem, field, answerSheet)}</span>)}</span>;
  }

  function renderProblem(problem: DigitProblem, answerSheet: boolean) {
    const ids = problem.hidden.map((field) => answerId(problem, field));
    const graded = ids.some((id) => id in results);
    const isCorrect = graded && ids.every((id) => results[id]);
    return (
      <div className={`digit-equation${graded ? isCorrect ? " is-correct" : " is-wrong" : ""}`} data-testid="digit-equation" key={problem.id}>
        <div className="digit-operation">
          <span className="digit-line"><i aria-hidden="true" />{renderNumber(problem, ["topTens", "topOnes"], answerSheet)}</span>
          <span className="digit-line"><i>{problem.operator}</i>{renderNumber(problem, ["bottomTens", "bottomOnes"], answerSheet)}</span>
          <b aria-hidden="true" />
          <span className="digit-line result"><i aria-hidden="true" />{renderNumber(problem, ["resultHundreds", "resultTens", "resultOnes"], answerSheet)}</span>
        </div>
        {!answerSheet && graded && (
          <span className={`counting-result ${isCorrect ? "correct" : "wrong"}`} role="status">
            {isCorrect ? "맞음" : "틀림"}
          </span>
        )}
      </div>
    );
  }

  function renderSheet(answerSheet: boolean) {
    return (
      <div className="a4-sheet counting-sheet digit-sheet" style={{ transform: `scale(${sheetScale})` }}>
        <header className="counting-sheet-header">
          <div className="counting-sheet-title">
            <span>2학년</span>
            <strong>세로셈 빈칸{answerSheet ? " 정답" : ""}</strong>
          </div>
          <div className="counting-sheet-info">
            <span>이름 <i /></span>
            <span>날짜 <i /></span>
            <small>문제지 {questionSet.seed}</small>
          </div>
        </header>
        <div className="digit-grid">{questionSet.problems.map((problem) => renderProblem(problem, answerSheet))}</div>
      </div>
    );
  }

  useRecordQuestions("arithmetic/grade-2-add-subtract-2/page", { expected });

  return (
    <main className="counting-page digit-page">
      <div className="counting-toolbar">
        <a className="counting-back" href="/arithmetic" aria-label="연산 목록으로 돌아가기">←</a>
        <div className="counting-progress"><strong>{correct}<small>/12 정답</small></strong></div>
        <div className="toolbar">
          <button className="button secondary" type="button" onClick={newSet}>새 문제</button>
          <button className="button ghost" type="button" onClick={resetAnswers}>다시 쓰기</button>
          <div className="print-control">
            <button className="button ghost print-button" type="button" aria-expanded={printMenuOpen} aria-haspopup="menu" onClick={() => setPrintMenuOpen((open) => !open)}>인쇄</button>
            {printMenuOpen && (
              <div className="print-menu" role="menu" aria-label="인쇄 자료 선택">
                <button type="button" role="menuitem" onClick={() => printMaterials("worksheet")}>문제지만 인쇄</button>
                <button type="button" role="menuitem" onClick={() => printMaterials("answers")}>답지만 인쇄</button>
                <button type="button" role="menuitem" onClick={() => printMaterials("both")}>문제지+답지 인쇄</button>
              </div>
            )}
          </div>
          <button className="button primary" type="button" onClick={checkAll}>전체 채점</button>
        </div>
      </div>
      <div className="a4-stage counting-a4-stage worksheet-stage" style={{ width: 794 * sheetScale, height: 1123 * sheetScale }} aria-label="A4 2학년 세로셈 빈칸 문제지">
        {renderSheet(false)}
      </div>
      <div className="a4-stage counting-a4-stage answer-stage" style={{ width: 794 * sheetScale, height: 1123 * sheetScale }} aria-label="A4 2학년 세로셈 빈칸 전체 답지">
        {renderSheet(true)}
      </div>
    </main>
  );
}
