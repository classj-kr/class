"use client";

import { useRecordedState, useRecordQuestions } from "@/app/components/learning-record-state";

import { useEffect, useMemo, useState } from "react";
import DivisionBracket, { blankDivisionBracketAnswer, divisionBracketAnswered, divisionBracketIsCorrect, type DivisionBracketAnswer } from "../../components/division-bracket";
import { createProblemSet, type Problem } from "@/lib/race-sets/grade-4-division";

type PrintMode = "worksheet" | "answers" | "both";
const INITIAL_SEED = 20260720;

export default function GradeFourDivisionPage() {
  const [questionSet, setQuestionSet] = useRecordedState("arithmetic/grade-4-division/page:questionSet", () => createProblemSet(INITIAL_SEED));
  const [answers, setAnswers] = useRecordedState<Record<string, DivisionBracketAnswer>>("arithmetic/grade-4-division/page:answers", {});
  const [results, setResults] = useRecordedState<Record<string, boolean>>("arithmetic/grade-4-division/page:results", {});
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
  const completed = Object.values(answers).filter(divisionBracketAnswered).length;
  const correct = Object.values(results).filter(Boolean).length;

  function updateQuotient(problem: Problem, value: string) {
    const digits = value.replace(/[^0-9]/g, "").slice(0, String(problem.quotient).length);
    setAnswers((current) => ({
      ...current,
      [problem.id]: { ...(current[problem.id] ?? blankDivisionBracketAnswer()), quotient: digits },
    }));
    setResults((current) => {
      if (!(problem.id in current)) return current;
      const next = { ...current };
      delete next[problem.id];
      return next;
    });
  }

  function updateRemainder(problem: Problem, value: string) {
    const digit = value.replace(/[^0-9]/g, "").slice(0, String(problem.divisor).length);
    setAnswers((current) => ({
      ...current,
      [problem.id]: { ...(current[problem.id] ?? blankDivisionBracketAnswer()), remainder: digit },
    }));
    setResults((current) => {
      if (!(problem.id in current)) return current;
      const next = { ...current };
      delete next[problem.id];
      return next;
    });
  }

  function checkAll() {
    setResults(Object.fromEntries(problems.map((problem) => [problem.id, divisionBracketIsCorrect(answers[problem.id], problem.quotient, problem.remainder)])));
  }

  function resetAnswers() {
    setAnswers({});
    setResults({});
  }

  function newSet() {
    if (completed > 0 && !window.confirm("답이 사라집니다. 새 문제를 만들까요?")) return;
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

  function renderProblem(problem: Problem, index: number, answerSheet: boolean) {
    const graded = problem.id in results;
    const isCorrect = results[problem.id] === true;
    return (
      <div className={`multiplication-question grade-four-division-question${graded ? isCorrect ? " is-correct" : " is-wrong" : ""}`} data-testid="grade-four-division-question" key={problem.id}>
        <span className="grade-four-division-index">{index + 1}</span>
        <div className="division-bracket-question">
          <DivisionBracket
            id={problem.id}
            dividend={problem.dividend}
            divisor={problem.divisor}
            quotient={problem.quotient}
            remainder={problem.remainder}
            answerSheet={answerSheet}
            answer={answers[problem.id]}
            onQuotientChange={(value) => updateQuotient(problem, value)}
            onRemainderChange={(value) => updateRemainder(problem, value)}
          />
        </div>
        {!answerSheet && graded && <span className={`counting-result ${isCorrect ? "correct" : "wrong"}`} role="status">{isCorrect ? "맞음" : "틀림"}</span>}
      </div>
    );
  }

  function renderSheet(answerSheet: boolean) {
    return (
      <div className="a4-sheet counting-sheet grade-four-division-sheet" style={{ transform: `scale(${sheetScale})` }}>
        <header className="counting-sheet-header">
          <div className="counting-sheet-title"><span>4학년</span><strong>세 자리 수 ÷ 두 자리 수{answerSheet ? " 정답" : ""}</strong></div>
          <div className="counting-sheet-info"><span>이름 <i /></span><span>날짜 <i /></span><small>문제지 {questionSet.seed}</small></div>
        </header>
        <div className="grade-four-division-grid">{questionSet.problems.map((problem, index) => renderProblem(problem, index, answerSheet))}</div>
      </div>
    );
  }

  useRecordQuestions("arithmetic/grade-4-division/page", { problems });

  return (
    <main className="counting-page multiplication-page">
      <div className="counting-toolbar">
        <a className="counting-back" href="/arithmetic" aria-label="연산 목록으로 돌아가기">←</a>
        <div className="counting-progress"><strong>{correct}<small>/10 정답</small></strong></div>
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
      <div className="a4-stage counting-a4-stage worksheet-stage" style={{ width: 794 * sheetScale, height: 1123 * sheetScale }} aria-label="A4 4학년 나눗셈 문제지">{renderSheet(false)}</div>
      <div className="a4-stage counting-a4-stage answer-stage" style={{ width: 794 * sheetScale, height: 1123 * sheetScale }} aria-label="A4 4학년 나눗셈 전체 답지">{renderSheet(true)}</div>
    </main>
  );
}
