"use client";

import { useRecordedState, useRecordQuestions } from "@/app/components/learning-record-state";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { moveBetweenFractionAnswerInputs } from "../../components/fraction-answer-navigation";
import {
  createGradeThreeFractionOneSet,
  type GradeThreeFractionRelationProblem as RelationProblem,
  type GradeThreeFractionValueProblem as ValueProblem,
} from "../../../lib/grade-three-fraction-one";

type PrintMode = "worksheet" | "answers" | "both";
type Problem = ValueProblem | RelationProblem;
type Answer = { value: string; numerator: string; denominator: string };

const INITIAL_SEED = 20260720;

function vowelEnding(number: number) {
  return [2, 4, 5, 9].includes(number % 10);
}

function FractionStack({ numerator, denominator, className = "", inputOrder = false }: { numerator: ReactNode; denominator: ReactNode; className?: string; inputOrder?: boolean }) {
  return (
    <span className={`grade-three-fraction-stack ${className}${inputOrder ? " input-order" : ""}`}>
      {inputOrder ? (
        <>
          <span className="grade-three-fraction-number denominator-slot">{denominator}</span>
          <span className="grade-three-fraction-line" aria-hidden="true" />
          <span className="grade-three-fraction-number numerator-slot">{numerator}</span>
        </>
      ) : (
        <>
          <span className="grade-three-fraction-number">{numerator}</span>
          <span className="grade-three-fraction-line" aria-hidden="true" />
          <span className="grade-three-fraction-number">{denominator}</span>
        </>
      )}
    </span>
  );
}

export default function GradeThreeFractionOnePage() {
  const [questionSet, setQuestionSet] = useRecordedState("arithmetic/grade-3-fraction-1/page:questionSet", () => createGradeThreeFractionOneSet(INITIAL_SEED));
  const [answers, setAnswers] = useRecordedState<Record<string, Answer>>("arithmetic/grade-3-fraction-1/page:answers", {});
  const [results, setResults] = useRecordedState<Record<string, boolean>>("arithmetic/grade-3-fraction-1/page:results", {});
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

  const problems = useMemo<Problem[]>(() => [...questionSet.valueProblems, ...questionSet.relationProblems], [questionSet]);
  const completed = problems.filter((problem) => {
    const answer = answers[problem.id];
    return problem.kind === "value" ? Boolean(answer?.value) : Boolean(answer?.numerator && answer?.denominator);
  }).length;
  const correct = Object.values(results).filter(Boolean).length;

  function updateAnswer(id: string, field: keyof Answer, value: string) {
    setAnswers((current) => ({
      ...current,
      [id]: {
        value: current[id]?.value ?? "",
        numerator: current[id]?.numerator ?? "",
        denominator: current[id]?.denominator ?? "",
        [field]: value.replace(/[^0-9]/g, "").slice(0, 2),
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
      const isCorrect = problem.kind === "value"
        ? answer?.value === String(problem.answer)
        : answer?.numerator === String(problem.numerator) && answer?.denominator === String(problem.denominator);
      return [problem.id, isCorrect];
    })));
  }

  function resetAnswers() {
    setAnswers({});
    setResults({});
  }

  function newSet() {
    if (completed > 0 && !window.confirm("쓴 답이 사라집니다. 새 문제를 만들까요?")) return;
    setQuestionSet(createGradeThreeFractionOneSet((Date.now() ^ Math.floor(Math.random() * 0xffffffff)) >>> 0));
    resetAnswers();
  }

  function printMaterials(mode: PrintMode) {
    setPrintMenuOpen(false);
    document.documentElement.dataset.printMode = mode;
    const clearPrintMode = () => delete document.documentElement.dataset.printMode;
    window.addEventListener("afterprint", clearPrintMode, { once: true });
    window.requestAnimationFrame(() => window.print());
  }

  function resultClass(problem: Problem) {
    if (!(problem.id in results)) return "";
    return results[problem.id] ? " is-correct" : " is-wrong";
  }

  function renderValueProblem(problem: ValueProblem, index: number, answerSheet: boolean) {
    const answer = answers[problem.id] ?? { value: "", numerator: "", denominator: "" };
    const isCorrect = results[problem.id] === true;
    return (
      <div className={`multiplication-question grade-three-fraction-question value${resultClass(problem)}`} data-testid="grade-three-fraction-question" key={problem.id}>
        <span className="grade-three-fraction-index">{index + 1}</span>
        <span className="grade-three-fraction-word"><strong>{problem.whole}</strong>의</span>
        <span className="grade-three-fraction-word grade-three-fraction-symbol-word">
          <FractionStack numerator={problem.numerator} denominator={problem.denominator} />
          {[1, 3, 6, 7, 8].includes(problem.numerator) ? "은" : "는"}
        </span>
        {answerSheet
          ? <strong className="grade-three-fraction-static">{problem.answer}</strong>
          : <input className="grade-three-fraction-value-input" type="text" inputMode="numeric" pattern="[0-9]*" maxLength={2} value={answer.value} onChange={(event) => updateAnswer(problem.id, "value", event.target.value)} data-fraction-answer-input="true" onKeyDown={moveBetweenFractionAnswerInputs} aria-label={`${index + 1}번 답`} />}
        {!answerSheet && problem.id in results && <span className={`counting-result ${isCorrect ? "correct" : "wrong"}`} role="status">{isCorrect ? "맞음" : "틀림"}</span>}
      </div>
    );
  }

  function renderRelationProblem(problem: RelationProblem, index: number, answerSheet: boolean) {
    const answer = answers[problem.id] ?? { value: "", numerator: "", denominator: "" };
    const isCorrect = results[problem.id] === true;
    const fraction = answerSheet
      ? <FractionStack className="grade-three-fraction-static" numerator={problem.numerator} denominator={problem.denominator} />
      : <FractionStack
          className="grade-three-fraction-answer"
          inputOrder
          numerator={<input className="grade-three-fraction-part-input" type="text" inputMode="numeric" pattern="[0-9]*" maxLength={2} value={answer.numerator} onChange={(event) => updateAnswer(problem.id, "numerator", event.target.value)} data-fraction-answer-input="true" onKeyDown={moveBetweenFractionAnswerInputs} aria-label={`${index + 1}번 분자 답`} />}
          denominator={<input className="grade-three-fraction-part-input" type="text" inputMode="numeric" pattern="[0-9]*" maxLength={2} value={answer.denominator} onChange={(event) => updateAnswer(problem.id, "denominator", event.target.value)} data-fraction-answer-input="true" onKeyDown={moveBetweenFractionAnswerInputs} aria-label={`${index + 1}번 분모 답`} />}
        />;
    return (
      <div className={`multiplication-question grade-three-fraction-question relation${resultClass(problem)}`} data-testid="grade-three-fraction-question" key={problem.id}>
        <span className="grade-three-fraction-index">{index + 1}</span>
        <span className="grade-three-fraction-sentence">
          <span className="grade-three-fraction-word"><strong>{problem.whole}</strong>{vowelEnding(problem.whole) ? "를" : "을"}</span>
          <span className="grade-three-fraction-word"><strong>{problem.part}</strong>씩</span>
          <span>묶으면</span>
          <span className="grade-three-fraction-word"><strong>{problem.selected}</strong>{vowelEnding(problem.selected) ? "는" : "은"}</span>
          <span className="grade-three-fraction-word"><strong>{problem.whole}</strong>의</span>
          <span className="grade-three-fraction-word grade-three-fraction-symbol-word">{fraction}입니다.</span>
        </span>
        {!answerSheet && problem.id in results && <span className={`counting-result ${isCorrect ? "correct" : "wrong"}`} role="status">{isCorrect ? "맞음" : "틀림"}</span>}
      </div>
    );
  }

  function renderSheet(answerSheet: boolean) {
    return (
      <div className="a4-sheet counting-sheet grade-three-fraction-sheet" style={{ transform: `scale(${sheetScale})` }}>
        <header className="counting-sheet-header">
          <div className="counting-sheet-title"><span>3학년</span><strong>분수만큼 구하기{answerSheet ? " 정답" : ""}</strong></div>
          <div className="counting-sheet-info"><span>이름 <i /></span><span>날짜 <i /></span><small>문제지 {questionSet.seed}</small></div>
        </header>
        <div className="grade-three-fraction-content">
          <div className="grade-three-fraction-value-grid">{questionSet.valueProblems.map((problem, index) => renderValueProblem(problem, index, answerSheet))}</div>
          <div className="grade-three-fraction-relation-grid">{questionSet.relationProblems.map((problem, index) => renderRelationProblem(problem, index + 10, answerSheet))}</div>
        </div>
      </div>
    );
  }

  useRecordQuestions("arithmetic/grade-3-fraction-1/page", { problems });

  return (
    <main className="counting-page multiplication-page">
      <div className="counting-toolbar">
        <a className="counting-back" href="/arithmetic" aria-label="연산 목록으로 돌아가기">←</a>
        <div className="counting-progress"><strong>{correct}<small>/15 정답</small></strong></div>
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
      <div className="a4-stage counting-a4-stage worksheet-stage" style={{ width: 794 * sheetScale, height: 1123 * sheetScale }} aria-label="A4 3학년 분수① 문제지">{renderSheet(false)}</div>
      <div className="a4-stage counting-a4-stage answer-stage" style={{ width: 794 * sheetScale, height: 1123 * sheetScale }} aria-label="A4 3학년 분수① 전체 답지">{renderSheet(true)}</div>
    </main>
  );
}
