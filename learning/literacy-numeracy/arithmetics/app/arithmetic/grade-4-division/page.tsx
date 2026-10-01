"use client";

import { useRecordedState, useRecordQuestions } from "@/app/components/learning-record-state";

import { useEffect, useMemo, useState } from "react";
import DivisionBracket, { blankDivisionBracketAnswer, divisionBracketAnswered, divisionBracketIsCorrect, type DivisionBracketAnswer } from "../../components/division-bracket";

type PrintMode = "worksheet" | "answers" | "both";
type Problem = { id: string; dividend: number; divisor: number; quotient: number; remainder: number };
type ProblemSet = { seed: number; problems: Problem[] };

const INITIAL_SEED = 20260720;

function random(seed: number) {
  let value = seed >>> 0;
  return () => {
    value += 0x6d2b79f5;
    let next = value;
    next = Math.imul(next ^ (next >>> 15), next | 1);
    next ^= next + Math.imul(next ^ (next >>> 7), next | 61);
    return ((next ^ (next >>> 14)) >>> 0) / 4294967296;
  };
}

function integer(next: () => number, minimum: number, maximum: number) {
  return minimum + Math.floor(next() * (maximum - minimum + 1));
}

function makeProblem(id: string, dividend: number, divisor: number): Problem {
  return { id, dividend, divisor, quotient: Math.floor(dividend / divisor), remainder: dividend % divisor };
}

function createProblemSet(seed: number): ProblemSet {
  const next = random(seed);
  const problems: Problem[] = [];

  function addProblem(dividend: number, divisor: number) {
    problems.push(makeProblem(`grade-four-division-${problems.length}`, dividend, divisor));
  }

  // XLSM의 B6:C6, E6:F6, H6:I6 수식 계열
  let dividend = integer(next, 555, 809);
  addProblem(dividend, integer(next, Number(String(dividend).slice(0, 2)) + 1, 99));
  addProblem(integer(next, 666, 999), integer(next, 14, 29));
  let divisor = integer(next, 11, 99);
  addProblem(integer(next, divisor, 999), divisor);

  // XLSM의 B15:C15, E15:F15, H15:I15 수식 계열
  divisor = integer(next, 11, 99);
  addProblem(integer(next, divisor * 10, 990) + integer(next, 0, 9), divisor);
  divisor = integer(next, 11, 99);
  addProblem(integer(next, divisor * 10, 990) + integer(next, 0, 9), divisor);
  dividend = integer(next, 555, 989);
  addProblem(dividend, integer(next, Number(String(dividend).slice(0, 2)) + 1, 99));

  // XLSM의 B24:C24, H24:I24 수식 계열
  divisor = integer(next, 11, 99);
  addProblem(integer(next, divisor, 999), divisor);

  // XLSM의 B32:C32, E32:F32, H32:I32 수식 계열
  dividend = integer(next, 333, 777);
  const leadingPair = Number(String(dividend).slice(0, 2));
  addProblem(dividend, integer(next, leadingPair + 1, leadingPair + 20));
  divisor = integer(next, 11, 59);
  addProblem(integer(next, divisor * 10, 990) + integer(next, 0, 9), divisor);
  divisor = integer(next, 11, 99);
  addProblem(integer(next, divisor, 999), divisor);

  return { seed, problems };
}

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
