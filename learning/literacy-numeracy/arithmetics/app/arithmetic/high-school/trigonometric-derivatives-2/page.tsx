"use client";

import { useRecordedState, useRecordQuestions } from "@/app/components/learning-record-state";

import { useEffect, useMemo, useState } from "react";
import {
  createTrigonometricDerivativeTwoChoices,
  createTrigonometricDerivativeTwoProblemSet,
  createTrigonometricDerivativeTwoReviewProblems,
  formatTrigonometricDerivativeTwoProblemLatex,
  type TrigonometricDerivativeTwoProblem,
} from "../../../../lib/trigonometric-derivative-two-workouts";
import MathFormula from "../../../components/math-formula";
import WorksheetQuestionPrompt from "../../../components/worksheet-question-prompt";
import WorksheetChoicePanel, { type WorksheetChoiceProblem } from "../components/worksheet-choice-panel";

export default function TrigonometricDerivativesTwoPage() {
  const [questionSet, setQuestionSet] = useRecordedState("arithmetic/high-school/trigonometric-derivatives-2/page:questionSet", () => createTrigonometricDerivativeTwoProblemSet(20260729));
  const [reviews, setReviews] = useRecordedState<TrigonometricDerivativeTwoProblem[]>("arithmetic/high-school/trigonometric-derivatives-2/page:reviews", []);
  const [selected, setSelected] = useRecordedState<Record<string, string>>("arithmetic/high-school/trigonometric-derivatives-2/page:selected", {});
  const [results, setResults] = useRecordedState<Record<string, boolean>>("arithmetic/high-school/trigonometric-derivatives-2/page:results", {});
  const [panelOpen, setPanelOpen] = useState(false);
  const [scale, setScale] = useState(0.6);
  const problems = useMemo(() => [...questionSet.problems, ...reviews], [questionSet.problems, reviews]);
  const wrong = questionSet.problems.filter((problem) => results[problem.id] === false);
  const choiceProblems: WorksheetChoiceProblem[] = problems.map((problem) => ({
    id: problem.id,
    label: problem.label,
    prompt: "도함수는?",
    latex: formatTrigonometricDerivativeTwoProblemLatex(problem),
    correctLatex: problem.answer.latex,
    choices: createTrigonometricDerivativeTwoChoices(problem).map((choice) => ({
      id: choice.id,
      latex: `f^{\\prime}(x)=${choice.latex}`,
      correct: choice.correct,
    })),
  }));

  useEffect(() => {
    const fit = () => setScale(Math.min((window.innerWidth - 32) / 794, 1));
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  function reset() {
    setSelected({});
    setResults({});
    setReviews([]);
  }

  function choose(problemId: string, choiceId: string) {
    setSelected((current) => ({ ...current, [problemId]: choiceId }));
    setResults((current) => {
      if (!(problemId in current)) return current;
      const next = { ...current };
      delete next[problemId];
      return next;
    });
  }

  function checkAll() {
    setResults(Object.fromEntries(choiceProblems.map((problem) => [
      problem.id,
      problem.choices.find((choice) => choice.id === selected[problem.id])?.correct === true,
    ])));
  }

  function row(problem: TrigonometricDerivativeTwoProblem, index: number, answerSheet: boolean) {
    return (
      <article className="polynomial-question derivative-question trig-derivative-question" data-testid="trigonometric-derivative-two-question" key={problem.id}>
        <div className="polynomial-question-number">{String(index + 1).padStart(2, "0")}</div>
        <div className="polynomial-question-body">
          <span className="polynomial-focus-label">{problem.label}</span>
          <WorksheetQuestionPrompt label={problem.label} prompt="도함수는?" />
          <div className="derivative-expression trig-derivative-expression"><MathFormula latex={formatTrigonometricDerivativeTwoProblemLatex(problem)} /><div className="derivative-expression-target"><MathFormula latex="f^{\prime}(x)" /></div></div>
          {answerSheet && <div className="derivative-static-answer"><MathFormula latex={problem.answer.latex} /></div>}
        </div>
      </article>
    );
  }

  function sheet(answerSheet: boolean) {
    return (
      <div className={`a4-sheet counting-sheet polynomial-sheet derivative-sheet trig-derivative-sheet polynomial-sheet-${problems.length}`} style={{ transform: `scale(${scale})` }}>
        <header className="counting-sheet-header polynomial-sheet-header">
          <div className="counting-sheet-title"><span>미적분Ⅱ</span><strong>sec·csc·cot 미분{answerSheet ? " 정답" : ""}</strong></div>
          <div className="counting-sheet-info"><span>이름 <i /></span><span>날짜 <i /></span><small>문제지 {questionSet.seed}</small></div>
        </header>
        <div className="polynomial-instruction"><b>sec·csc·cot을 포함한 함수의 도함수를 구하세요. 빈 공간에 풀이 과정을 쓰세요.</b><span>답안 입력에서 4지선다 채점</span></div>
        <div className="polynomial-problem-grid derivative-problem-grid trig-derivative-problem-grid">{problems.map((problem, index) => row(problem, index, answerSheet))}</div>
      </div>
    );
  }

  useRecordQuestions("arithmetic/high-school/trigonometric-derivatives-2/page", { problems, choiceProblems });

  return (
    <main className="counting-page polynomial-page derivative-page trig-derivative-page trig-derivative-two-page">
      <div className="counting-toolbar">
        <a className="counting-back" href="/arithmetic" aria-label="연산 목록으로 돌아가기">←</a>
        <div className="counting-progress"><strong>{Object.values(results).filter(Boolean).length}<small>/{problems.length} 정답</small></strong></div>
        <div className="toolbar">
          <button className="button secondary" onClick={() => { setQuestionSet(createTrigonometricDerivativeTwoProblemSet(Date.now() >>> 0)); reset(); }}>새 문제</button>
          <button className="button ghost" onClick={reset}>다시 풀기</button>
          <button className="button secondary" onClick={() => setPanelOpen(true)}>답안 입력</button>
          <button className="button ghost" onClick={() => window.print()}>인쇄</button>
          <button className="button primary" onClick={checkAll}>전체 채점</button>
        </div>
      </div>
      <div className="a4-stage counting-a4-stage worksheet-stage" style={{ width: 794 * scale, height: 1123 * scale }}>{sheet(false)}</div>
      <div className="a4-stage counting-a4-stage answer-stage" style={{ width: 794 * scale, height: 1123 * scale }}>{sheet(true)}</div>
      {panelOpen && <WorksheetChoicePanel title="sec·csc·cot 미분" problems={choiceProblems} selected={selected} results={results} onSelect={choose} onGrade={checkAll} onClose={() => setPanelOpen(false)} />}
    </main>
  );
}
