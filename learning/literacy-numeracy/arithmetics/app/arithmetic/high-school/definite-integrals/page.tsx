"use client";

import { useRecordedState, useRecordQuestions } from "@/app/components/learning-record-state";

import { useEffect, useMemo, useState } from "react";
import {
  createDefiniteIntegralProblemSet,
  createDefiniteIntegralReviewProblems,
  type DefiniteIntegralProblem,
} from "../../../../lib/definite-integral-workouts";
import MathFormula from "../../../components/math-formula";
import WorksheetQuestionPrompt from "../../../components/worksheet-question-prompt";
import WorksheetChoicePanel, { type WorksheetChoiceProblem } from "../components/worksheet-choice-panel";

export default function DefiniteIntegralsPage() {
  const [set, setSet] = useRecordedState("arithmetic/high-school/definite-integrals/page:set", () => createDefiniteIntegralProblemSet(20260810));
  const [reviews, setReviews] = useRecordedState<DefiniteIntegralProblem[]>("arithmetic/high-school/definite-integrals/page:reviews", []);
  const [selected, setSelected] = useRecordedState<Record<string, string>>("arithmetic/high-school/definite-integrals/page:selected", {});
  const [results, setResults] = useRecordedState<Record<string, boolean>>("arithmetic/high-school/definite-integrals/page:results", {});
  const [panelOpen, setPanelOpen] = useState(false);
  const [scale, setScale] = useState(0.6);
  const problems = useMemo(() => [...set.problems, ...reviews], [set.problems, reviews]);
  const wrong = set.problems.filter((problem) => results[problem.id] === false);
  const choiceProblems: WorksheetChoiceProblem[] = problems.map((problem) => ({
    id: problem.id,
    label: problem.label,
    prompt: problem.prompt,
    latex: `${problem.latex}=?`,
    correctLatex: problem.answerLatex,
    choices: problem.choices,
  }));

  useEffect(() => {
    const fit = () => setScale(Math.min((window.innerWidth - 32) / 794, 1));
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  function reset() { setSelected({}); setResults({}); setReviews([]); }
  function checkAll() {
    setResults(Object.fromEntries(choiceProblems.map((problem) => [
      problem.id,
      problem.choices.find(({ id }) => id === selected[problem.id])?.correct === true,
    ])));
  }
  function row(problem: DefiniteIntegralProblem, index: number, answerSheet: boolean) {
    return (
      <article className="polynomial-question derivative-question trig-derivative-question" key={problem.id} data-testid="definite-integral-question">
        <div className="polynomial-question-number">{String(index + 1).padStart(2, "0")}</div>
        <div className="polynomial-question-body">
          <span className="polynomial-focus-label">{problem.label}</span>
          <WorksheetQuestionPrompt label={problem.label} prompt={problem.prompt} />
          <div className="derivative-expression trig-derivative-expression"><MathFormula latex={`${problem.latex}=?`} /></div>
          {answerSheet && <div className="derivative-static-answer"><MathFormula latex={problem.answerLatex} /></div>}
        </div>
      </article>
    );
  }
  function sheet(answerSheet: boolean) {
    return (
      <div className={`a4-sheet counting-sheet polynomial-sheet derivative-sheet trig-derivative-sheet polynomial-sheet-${problems.length}`} style={{ transform: `scale(${scale})` }}>
        <header className="counting-sheet-header polynomial-sheet-header">
          <div className="counting-sheet-title"><span>미적분Ⅱ</span><strong>정적분 계산{answerSheet ? " 정답" : ""}</strong></div>
          <div className="counting-sheet-info"><span>이름 <i /></span><span>날짜 <i /></span><small>문제지 {set.seed}</small></div>
        </header>
        <div className="polynomial-problem-grid derivative-problem-grid trig-derivative-problem-grid">{problems.map((problem, index) => row(problem, index, answerSheet))}</div>
      </div>
    );
  }

  useRecordQuestions("arithmetic/high-school/definite-integrals/page", { problems, choiceProblems });

  return (
    <main className="counting-page polynomial-page derivative-page trig-derivative-page formula-only-page">
      <div className="counting-toolbar">
        <a className="counting-back" href="/arithmetic" aria-label="연산 목록으로 돌아가기">←</a>
        <div className="counting-progress"><strong>{Object.values(results).filter(Boolean).length}<small>/{problems.length} 정답</small></strong></div>
        <div className="toolbar">
          <button className="button secondary" onClick={() => { setSet(createDefiniteIntegralProblemSet(Date.now() >>> 0)); reset(); }}>새 문제</button>
          <button className="button ghost" onClick={reset}>다시 풀기</button>
          <button className="button secondary" onClick={() => setPanelOpen(true)}>답안 입력</button>
          <button className="button ghost" onClick={() => window.print()}>인쇄</button>
          <button className="button primary" onClick={checkAll}>전체 채점</button>
        </div>
      </div>
      {panelOpen && <WorksheetChoicePanel title="정적분 계산" problems={choiceProblems} selected={selected} results={results} onSelect={(problemId, choiceId) => { setSelected((current) => ({ ...current, [problemId]: choiceId })); setResults((current) => { const next = { ...current }; delete next[problemId]; return next; }); }} onGrade={checkAll} onClose={() => setPanelOpen(false)} />}
      <div className="a4-stage counting-a4-stage worksheet-stage" style={{ width: 794 * scale, height: 1123 * scale }} aria-label="A4 정적분 계산 문제지">{sheet(false)}</div>
      <div className="a4-stage counting-a4-stage answer-stage" style={{ width: 794 * scale, height: 1123 * scale }} aria-label="A4 정적분 계산 정답지">{sheet(true)}</div>
    </main>
  );
}
