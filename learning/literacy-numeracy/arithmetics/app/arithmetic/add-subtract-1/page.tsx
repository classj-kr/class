"use client";

import { useRecordedState, useRecordQuestions } from "@/app/components/learning-record-state";

import { useEffect, useMemo, useState } from "react";
import { Field, Equation, AdditionSubtractionVariant, random, createProblemSet, answerId, expectedEntries } from "@/lib/race-sets/add-subtract-1";

type PrintMode = "worksheet" | "answers" | "both";
const INITIAL_SEED = 20260720;

function EquationRow({
  equation,
  answerSheet,
  answers,
  results,
  onAnswer,
  maxLength,
}: {
  equation: Equation;
  answerSheet: boolean;
  answers: Record<string, string>;
  results: Record<string, boolean>;
  onAnswer: (id: string, value: string) => void;
  maxLength: number;
}) {
  const hiddenIds = equation.hidden.map((field) => answerId(equation, field));
  const graded = hiddenIds.some((id) => id in results);
  const rowCorrect = graded && hiddenIds.every((id) => results[id]);

  function number(field: Field) {
    const id = answerId(equation, field);
    if (!answerSheet && equation.hidden.includes(field)) {
      const result = results[id];
      return (
        <input
          className={`addsub-input ${result === true ? "is-correct" : result === false ? "is-wrong" : ""}`}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={maxLength}
          value={answers[id] ?? ""}
          onChange={(event) => onAnswer(id, event.target.value.replace(/[^0-9]/g, ""))}
          aria-label={`${equation.id} ${field} 답`}
        />
      );
    }
    return <strong>{equation[field]}</strong>;
  }

  return (
    <div className={`addsub-equation-row${graded ? (rowCorrect ? " is-correct" : " is-wrong") : ""}`}>
      {number("left")}
      <span>{equation.operator}</span>
      {number("right")}
      <span>=</span>
      {number("result")}
      {!answerSheet && equation.hidden.length > 0 && graded && (
        <span className={`counting-result ${rowCorrect ? "correct" : "wrong"}`} role="status">
          {rowCorrect ? "맞음" : "틀림"}
        </span>
      )}
    </div>
  );
}

export function AdditionSubtractionWorksheet({ variant, mentalMath = false }: { variant: AdditionSubtractionVariant; mentalMath?: boolean }) {
  const title =
    variant === "grade-two-missing-parts"
      ? "덧셈·뺄셈 빈칸"
      : variant === "two-digit"
      ? "두 자리 수 덧셈·뺄셈"
      : variant === "within-twenty"
        ? "10을 넘는 덧셈·뺄셈"
        : variant === "missing-parts"
          ? "덧셈·뺄셈 빈칸 채우기"
          : "한 자리 수 덧셈·뺄셈";
  const maxLength = variant === "single-digit" ? 1 : variant === "grade-two-missing-parts" ? 3 : 2;
  const grade = variant === "grade-two-missing-parts" ? "2학년" : "1학년";
  const [questionSet, setQuestionSet] = useRecordedState("arithmetic/add-subtract-1/page:questionSet", () => createProblemSet(INITIAL_SEED, variant));
  const [answers, setAnswers] = useRecordedState<Record<string, string>>("arithmetic/add-subtract-1/page:answers", {});
  const [results, setResults] = useRecordedState<Record<string, boolean>>("arithmetic/add-subtract-1/page:results", {});
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

  const expected = useMemo(() => expectedEntries(questionSet), [questionSet]);
  const completed = Object.values(answers).filter(Boolean).length;
  const correct = Object.values(results).filter(Boolean).length;

  function updateAnswer(id: string, value: string) {
    setAnswers((current) => ({ ...current, [id]: value }));
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
    setQuestionSet(createProblemSet((Date.now() ^ Math.floor(Math.random() * 0xffffffff)) >>> 0, variant));
    resetAnswers();
  }

  function printMaterials(mode: PrintMode) {
    setPrintMenuOpen(false);
    document.documentElement.dataset.printMode = mode;
    const clearPrintMode = () => delete document.documentElement.dataset.printMode;
    window.addEventListener("afterprint", clearPrintMode, { once: true });
    window.requestAnimationFrame(() => window.print());
  }

  function renderSheet(answerSheet: boolean) {
    const columns = [questionSet.additions, questionSet.subtractions, questionSet.mixed];
    return (
      <div className={`a4-sheet counting-sheet${mentalMath ? " mental-math-sheet" : ""} addsub-sheet${variant === "single-digit" ? "" : " two-digit"}`} style={{ transform: `scale(${sheetScale})` }}>
        <header className="counting-sheet-header">
          <div className="counting-sheet-title">
            <span>{grade}</span>
            <strong>{title}{answerSheet ? " 정답" : ""}</strong>
          </div>
          <div className="counting-sheet-info">
            <span>이름 <i /></span>
            <span>날짜 <i /></span>
            <small>문제지 {questionSet.seed}</small>
          </div>
        </header>

        <div className="addsub-columns">
          {columns.map((equations, columnIndex) => (
            <section className={`addsub-column column-${columnIndex + 1}`} key={columnIndex} aria-label={`${columnIndex + 1}단`}>
              {equations.map((equation) => (
                <EquationRow
                  key={equation.id}
                  equation={equation}
                  answerSheet={answerSheet}
                  answers={answers}
                  results={results}
                  onAnswer={updateAnswer}
                  maxLength={maxLength}
                />
              ))}
            </section>
          ))}
        </div>
      </div>
    );
  }

  useRecordQuestions("arithmetic/add-subtract-1/page", { expected });

  return (
    <main className="counting-page addsub-page">
      <div className="counting-toolbar addsub-toolbar">
        <a className="counting-back" href="/arithmetic" aria-label="연산 목록으로 돌아가기">←</a>
        <div className="counting-progress"><strong>{correct}<small>/30 정답</small></strong></div>
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

      <div className="a4-stage counting-a4-stage worksheet-stage" style={{ width: 794 * sheetScale, height: 1123 * sheetScale }} aria-label={`A4 ${title} 문제지`}>
        {renderSheet(false)}
      </div>
      <div className="a4-stage counting-a4-stage answer-stage" style={{ width: 794 * sheetScale, height: 1123 * sheetScale }} aria-label={`A4 ${title} 전체 답지`}>
        {renderSheet(true)}
      </div>
    </main>
  );
}

export default function AdditionSubtractionOnePage() {
  return <AdditionSubtractionWorksheet variant="single-digit" />;
}
