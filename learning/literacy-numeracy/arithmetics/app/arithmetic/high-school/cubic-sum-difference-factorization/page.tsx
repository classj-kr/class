"use client";

import { useRecordedState, useRecordQuestions } from "@/app/components/learning-record-state";

import { useEffect, useMemo, useState } from "react";
import MathFormula from "../../../components/math-formula";
import WorksheetQuestionPrompt from "../../../components/worksheet-question-prompt";
import WorksheetChoicePanel, {
  type WorksheetChoiceProblem,
} from "../components/worksheet-choice-panel";
import {
  createHighCubicFactorizationProblemSet,
  createHighCubicFactorizationReviewProblems,
  type HighCubicFactorizationProblem,
} from "../../../../lib/high-cubic-factorization-workouts";

const INITIAL_SEED = 20260804;

function choiceProblem(problem: HighCubicFactorizationProblem): WorksheetChoiceProblem {
  const choices = [
    { id: `${problem.id}-correct`, latex: problem.answerLatex, correct: true },
    ...problem.distractors.map((latex, index) => ({
      id: `${problem.id}-wrong-${index}`,
      latex,
      correct: false,
    })),
  ];
  const shift = [...problem.id].reduce((total, character) => total + character.charCodeAt(0), 0) % 4;
  return {
    id: problem.id,
    label: "인수분해한 식은?",
    prompt: "인수분해한 식은?",
    latex: problem.latex,
    correctLatex: problem.answerLatex,
    choices: [...choices.slice(shift), ...choices.slice(0, shift)],
  };
}

export default function CubicSumDifferenceFactorizationPage() {
  const [problemSet, setProblemSet] = useRecordedState("arithmetic/high-school/cubic-sum-difference-factorization/page:problemSet", () => (
    createHighCubicFactorizationProblemSet(INITIAL_SEED)
  ));
  const [reviews, setReviews] = useRecordedState<HighCubicFactorizationProblem[]>("arithmetic/high-school/cubic-sum-difference-factorization/page:reviews", []);
  const [selected, setSelected] = useRecordedState<Record<string, string>>("arithmetic/high-school/cubic-sum-difference-factorization/page:selected", {});
  const [results, setResults] = useRecordedState<Record<string, boolean>>("arithmetic/high-school/cubic-sum-difference-factorization/page:results", {});
  const [panelOpen, setPanelOpen] = useState(false);
  const [scale, setScale] = useState(0.6);

  useEffect(() => {
    const fit = () => setScale(Math.min((window.innerWidth - 32) / 794, 1));
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  const problems = useMemo(() => [...problemSet.problems, ...reviews], [problemSet.problems, reviews]);
  const choiceProblems = useMemo(() => problems.map(choiceProblem), [problems]);
  const wrong = problemSet.problems.filter((problem) => results[problem.id] === false);

  function reset() {
    setSelected({});
    setResults({});
    setReviews([]);
  }

  function choose(problemId: string, choiceId: string) {
    setSelected((current) => ({ ...current, [problemId]: choiceId }));
    setResults((current) => {
      const next = { ...current };
      delete next[problemId];
      return next;
    });
  }

  function grade() {
    const next: Record<string, boolean> = {};
    for (const item of choiceProblems) {
      const choice = item.choices.find(({ id }) => id === selected[item.id]);
      if (choice) next[item.id] = choice.correct;
    }
    setResults(next);
  }

  function row(problem: HighCubicFactorizationProblem, index: number, answerSheet: boolean) {
    return (
      <article
        className="polynomial-question logarithm-question"
        data-testid="high-cubic-factorization-question"
        key={`${answerSheet ? "answer" : "question"}-${problem.id}`}
      >
        <div className="polynomial-question-number">{String(index + 1).padStart(2, "0")}</div>
        <div className="polynomial-question-body">
          <span className="polynomial-focus-label">{problem.label}</span>
          <WorksheetQuestionPrompt label={problem.label} prompt="인수분해한 식은?" />
          <div className="logarithm-expression"><MathFormula latex={problem.latex} /></div>
          {answerSheet && (
            <div className="middle-equation-static-answer">
              <strong>정답</strong>
              <MathFormula latex={problem.answerLatex} />
            </div>
          )}
        </div>
      </article>
    );
  }

  function sheet(answerSheet: boolean) {
    return (
      <div className={`a4-sheet counting-sheet polynomial-sheet logarithm-sheet polynomial-sheet-${problems.length}`} style={{ transform: `scale(${scale})` }}>
        <header className="counting-sheet-header polynomial-sheet-header">
          <div className="counting-sheet-title">
            <span>공통수학 1</span>
            <strong>세제곱의 합·차 인수분해{answerSheet ? " 정답" : ""}</strong>
          </div>
          <div className="counting-sheet-info">
            <span>이름 <i /></span><span>날짜 <i /></span><small>문제지 {problemSet.seed}</small>
          </div>
        </header>
        <div className="polynomial-instruction">
          <b>세제곱 구조를 찾아 완전히 인수분해하세요.</b>
          <span>답안 입력에서 4지선다 채점</span>
        </div>
        <div className="polynomial-problem-grid logarithm-grid">
          {problems.map((item, index) => row(item, index, answerSheet))}
        </div>
      </div>
    );
  }

  useRecordQuestions("arithmetic/high-school/cubic-sum-difference-factorization/page", { problems, choiceProblems });

  return (
    <main className="counting-page polynomial-page logarithm-page numeric-choice-page middle-quadratic-page factorization-page">
      <div className="counting-toolbar">
        <a className="counting-back" href="/arithmetic" aria-label="연산 목록으로 돌아가기">←</a>
        <div className="counting-progress">
          <strong>{Object.values(results).filter(Boolean).length}<small>/{problems.length} 정답</small></strong>
        </div>
        <div className="toolbar">
          <button className="button secondary" type="button" onClick={() => { setProblemSet(createHighCubicFactorizationProblemSet(Date.now() >>> 0)); reset(); }}>새 문제</button>
          <button className="button ghost" type="button" onClick={reset}>다시 풀기</button>
          <button className="button secondary" type="button" onClick={() => setPanelOpen(true)}>답안 입력</button>
          <button className="button ghost" type="button" onClick={() => window.print()}>인쇄</button>
          <button className="button primary" type="button" onClick={grade}>전체 채점</button>
        </div>
      </div>
      <div className="a4-stage counting-a4-stage worksheet-stage" style={{ width: 794 * scale, height: 1123 * scale }} aria-label="A4 세제곱의 합·차 인수분해 문제지">{sheet(false)}</div>
      <div className="a4-stage counting-a4-stage answer-stage" style={{ width: 794 * scale, height: 1123 * scale }} aria-label="A4 세제곱의 합·차 인수분해 정답지">{sheet(true)}</div>
      {panelOpen && (
        <WorksheetChoicePanel
          title="세제곱의 합·차 인수분해"
          problems={choiceProblems}
          selected={selected}
          results={results}
          onSelect={choose}
          onGrade={grade}
          onClose={() => setPanelOpen(false)}
        />
      )}
    </main>
  );
}
