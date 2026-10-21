"use client";

import { useRecordedState, useRecordQuestions } from "@/app/components/learning-record-state";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { moveBetweenFractionAnswerInputs } from "../../components/fraction-answer-navigation";
import { createProblemSet, type Answer, type FractionValue, type Problem } from "@/lib/race-sets/grade-4-fraction";

type PrintMode = "worksheet" | "answers" | "both";

const INITIAL_SEED = 20260720;

function FractionStack({ numerator, denominator, className = "", inputOrder = false }: { numerator: ReactNode; denominator: ReactNode; className?: string; inputOrder?: boolean }) {
  return (
    <span className={`grade-four-fraction-stack ${className}${inputOrder ? " input-order" : ""}`}>
      {inputOrder ? (
        <>
          <span className="grade-four-fraction-number denominator-slot">{denominator}</span>
          <span className="grade-four-fraction-line" aria-hidden="true" />
          <span className="grade-four-fraction-number numerator-slot">{numerator}</span>
        </>
      ) : (
        <>
          <span className="grade-four-fraction-number">{numerator}</span>
          <span className="grade-four-fraction-line" aria-hidden="true" />
          <span className="grade-four-fraction-number">{denominator}</span>
        </>
      )}
    </span>
  );
}

function MixedValue({ fraction }: { fraction: FractionValue }) {
  return (
    <span className="grade-four-fraction-value">
      <strong>{fraction.whole}</strong>
      {fraction.numerator > 0 && <FractionStack numerator={fraction.numerator} denominator={fraction.denominator} />}
    </span>
  );
}

export default function GradeFourFractionPage() {
  const [questionSet, setQuestionSet] = useRecordedState("arithmetic/grade-4-fraction/page:questionSet", () => createProblemSet(INITIAL_SEED));
  const [answers, setAnswers] = useRecordedState<Record<string, Answer>>("arithmetic/grade-4-fraction/page:answers", {});
  const [results, setResults] = useRecordedState<Record<string, boolean>>("arithmetic/grade-4-fraction/page:results", {});
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
  const completed = Object.values(answers).filter((answer) => answer.whole || answer.numerator || answer.denominator).length;
  const correct = Object.values(results).filter(Boolean).length;

  function updateAnswer(id: string, field: keyof Answer, input: string) {
    const maximumLength = field === "whole" ? 2 : 1;
    setAnswers((current) => ({
      ...current,
      [id]: {
        whole: current[id]?.whole ?? "",
        numerator: current[id]?.numerator ?? "",
        denominator: current[id]?.denominator ?? "",
        [field]: input.replace(/[^0-9]/g, "").slice(0, maximumLength),
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
      const fractionCorrect = problem.answer.numerator === 0
        ? (!answer?.numerator || answer.numerator === "0") && (!answer?.denominator || answer.denominator === String(problem.answer.denominator))
        : answer?.numerator === String(problem.answer.numerator) && answer?.denominator === String(problem.answer.denominator);
      return [problem.id, answer?.whole === String(problem.answer.whole) && fractionCorrect];
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

  function renderAnswer(problem: Problem, answerSheet: boolean) {
    if (answerSheet) return <span className="grade-four-fraction-static-answer"><MixedValue fraction={problem.answer} /></span>;
    const answer = answers[problem.id] ?? { whole: "", numerator: "", denominator: "" };
    return (
      <span className="grade-four-fraction-answer">
        <input className="grade-four-fraction-whole-input" type="text" inputMode="numeric" pattern="[0-9]*" maxLength={2} value={answer.whole} onChange={(event) => updateAnswer(problem.id, "whole", event.target.value)} data-fraction-answer-input="true" onKeyDown={moveBetweenFractionAnswerInputs} aria-label={`${problem.id} 자연수 부분`} />
        <FractionStack
          className="answer"
          inputOrder
          numerator={<input className="grade-four-fraction-part-input numerator" type="text" inputMode="numeric" pattern="[0-9]*" maxLength={1} value={answer.numerator} onChange={(event) => updateAnswer(problem.id, "numerator", event.target.value)} data-fraction-answer-input="true" onKeyDown={moveBetweenFractionAnswerInputs} aria-label={`${problem.id} 분자`} />}
          denominator={<input className="grade-four-fraction-part-input denominator" type="text" inputMode="numeric" pattern="[0-9]*" maxLength={1} value={answer.denominator} onChange={(event) => updateAnswer(problem.id, "denominator", event.target.value)} data-fraction-answer-input="true" onKeyDown={moveBetweenFractionAnswerInputs} aria-label={`${problem.id} 분모`} />}
        />
      </span>
    );
  }

  function renderProblem(problem: Problem, index: number, answerSheet: boolean) {
    const graded = problem.id in results;
    const isCorrect = results[problem.id] === true;
    return (
      <div className={`multiplication-question grade-four-fraction-question${graded ? isCorrect ? " is-correct" : " is-wrong" : ""}`} data-testid="grade-four-fraction-question" key={problem.id}>
        <span className="grade-four-fraction-index">{index + 1}</span>
        <div className="grade-four-fraction-expression">
          <MixedValue fraction={problem.left} />
          <span className="grade-four-fraction-operator">{problem.operator}</span>
          <MixedValue fraction={problem.right} />
          <span>=</span>
          {renderAnswer(problem, answerSheet)}
        </div>
        {!answerSheet && graded && <span className={`counting-result ${isCorrect ? "correct" : "wrong"}`} role="status">{isCorrect ? "맞음" : "틀림"}</span>}
      </div>
    );
  }

  function renderSheet(answerSheet: boolean) {
    return (
      <div className="a4-sheet counting-sheet grade-four-fraction-sheet" style={{ transform: `scale(${sheetScale})` }}>
        <header className="counting-sheet-header">
          <div className="counting-sheet-title"><span>4학년</span><strong>분모가 같은 대분수의 덧셈·뺄셈{answerSheet ? " 정답" : ""}</strong></div>
          <div className="counting-sheet-info"><span>이름 <i /></span><span>날짜 <i /></span><small>문제지 {questionSet.seed}</small></div>
        </header>
        <div className="grade-four-fraction-columns">
          {[questionSet.problems.slice(0, 5), questionSet.problems.slice(5)].map((column, columnIndex) => (
            <div className="grade-four-fraction-column" key={columnIndex}>
              {column.map((problem, index) => renderProblem(problem, columnIndex * 5 + index, answerSheet))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  useRecordQuestions("arithmetic/grade-4-fraction/page", { problems });

  return (
    <main className="counting-page multiplication-page">
      <div className="counting-toolbar">
        <a className="counting-back" href="/arithmetic" aria-label="연산 목록으로 돌아가기">←</a>
        <div className="counting-progress"><strong>{correct}<small>/10 정답</small></strong></div>
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
      <div className="a4-stage counting-a4-stage worksheet-stage" style={{ width: 794 * sheetScale, height: 1123 * sheetScale }} aria-label="A4 4학년 분수 문제지">{renderSheet(false)}</div>
      <div className="a4-stage counting-a4-stage answer-stage" style={{ width: 794 * sheetScale, height: 1123 * sheetScale }} aria-label="A4 4학년 분수 전체 답지">{renderSheet(true)}</div>
    </main>
  );
}
