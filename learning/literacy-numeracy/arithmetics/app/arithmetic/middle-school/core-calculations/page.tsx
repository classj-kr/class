"use client";

import { useRecordedState, useRecordQuestions } from "@/app/components/learning-record-state";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import InlineMathText from "../../../components/inline-math-text";
import MathFormula from "../../../components/math-formula";
import WorksheetQuestionPrompt from "../../../components/worksheet-question-prompt";
import WorksheetChoicePanel, {
  type WorksheetChoiceProblem,
} from "../../high-school/components/worksheet-choice-panel";
import {
  createFreshMiddleCoreProblemSet,
  createMiddleCoreProblemSet,
  createMiddleCoreReviewProblems,
  isMiddleCoreKind,
  MIDDLE_CORE_TITLES,
  type MiddleCoreKind,
  type MiddleCoreProblem,
} from "../../../../lib/middle-core-workouts";

const DEFAULT_KIND: MiddleCoreKind = "prime-factorization";
const INITIAL_SEED = 20260803;
const MERGED_LINEAR_SYSTEM_KINDS = new Set([
  "simultaneous-substitution",
  "simultaneous-elimination",
  "simultaneous-application",
  "simultaneous-special",
]);
function choiceProblem(problem: MiddleCoreProblem): WorksheetChoiceProblem {
  const choices = [
    { id: `${problem.id}-correct`, latex: problem.answerLatex, correct: true },
    ...problem.distractors.map((latex, index) => ({
      id: `${problem.id}-wrong-${index}`,
      latex,
      correct: false,
    })),
  ];
  const shift = [...problem.id].reduce((total, character) => total + character.charCodeAt(0), 0) % choices.length;
  return {
    id: problem.id,
    label: problem.label,
    prompt: problem.question,
    latex: problem.latex,
    correctLatex: problem.answerLatex,
    choices: [...choices.slice(shift), ...choices.slice(0, shift)],
  };
}

export default function MiddleCoreCalculationsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [kind, setKind] = useRecordedState<MiddleCoreKind>("arithmetic/middle-school/core-calculations/page:kind", DEFAULT_KIND);
  const [problemSet, setProblemSet] = useRecordedState("arithmetic/middle-school/core-calculations/page:problemSet", () => (
    createMiddleCoreProblemSet(DEFAULT_KIND, INITIAL_SEED)
  ));
  const [reviews, setReviews] = useRecordedState<MiddleCoreProblem[]>("arithmetic/middle-school/core-calculations/page:reviews", []);
  const [selected, setSelected] = useRecordedState<Record<string, string>>("arithmetic/middle-school/core-calculations/page:selected", {});
  const [results, setResults] = useRecordedState<Record<string, boolean>>("arithmetic/middle-school/core-calculations/page:results", {});
  const [panelOpen, setPanelOpen] = useState(false);
  const [scale, setScale] = useState(0.6);

  useEffect(() => {
    const requestedKind = searchParams.get("kind");
    if (requestedKind === "linear-expression") {
      router.replace("/arithmetic/middle-school/core-calculations?kind=linear-equation");
      return;
    }
    if (requestedKind === "linear-inequality-application") {
      router.replace("/arithmetic/middle-school/core-calculations?kind=linear-inequality");
      return;
    }
    if (requestedKind && MERGED_LINEAR_SYSTEM_KINDS.has(requestedKind)) {
      router.replace("/arithmetic/middle-school/core-calculations?kind=linear-system-comprehensive");
      return;
    }
    if (!isMiddleCoreKind(requestedKind) || requestedKind === kind) return;
    setKind(requestedKind);
    setProblemSet(createMiddleCoreProblemSet(requestedKind, INITIAL_SEED));
    setReviews([]);
    setSelected({});
    setResults({});
  }, [kind, router, searchParams]);

  useEffect(() => {
    const fit = () => setScale(Math.min((window.innerWidth - 32) / 794, 1));
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  const title = MIDDLE_CORE_TITLES[kind];
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
    for (const problem of choiceProblems) {
      const choice = problem.choices.find((item) => item.id === selected[problem.id]);
      if (choice) next[problem.id] = choice.correct;
    }
    setResults(next);
  }

  function row(problem: MiddleCoreProblem, index: number, answerSheet: boolean) {
    return (
      <article
        className="polynomial-question logarithm-question"
        data-testid="middle-core-question"
        key={`${answerSheet ? "answer" : "question"}-${problem.id}`}
      >
        <div className="polynomial-question-number">{String(index + 1).padStart(2, "0")}</div>
        <div className="polynomial-question-body">
          <span className="polynomial-focus-label"><InlineMathText text={problem.label} /></span>
          <WorksheetQuestionPrompt label={problem.label} prompt={problem.question} />
          <div className="logarithm-expression">
            <MathFormula latex={problem.latex} />
          </div>
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
          <div className="counting-sheet-title"><span>중학교 연산</span><strong><InlineMathText text={title} />{answerSheet ? " 정답" : ""}</strong></div>
          <div className="counting-sheet-info"><span>이름 <i /></span><span>날짜 <i /></span><small>문제지 {problemSet.seed}</small></div>
        </header>
        <div className="polynomial-instruction"><b>식을 정확히 계산하고 알맞은 답을 고르세요.</b><span>답안 입력에서 4지선다 채점</span></div>
        <div className="polynomial-problem-grid logarithm-grid">{problems.map((problem, index) => row(problem, index, answerSheet))}</div>
      </div>
    );
  }

  useRecordQuestions("arithmetic/middle-school/core-calculations/page", { problems, choiceProblems });

  return (
    <main className="counting-page polynomial-page logarithm-page numeric-choice-page middle-quadratic-page middle-core-page">
      <div className="counting-toolbar">
        <a className="counting-back" href="/arithmetic" aria-label="연산 목록으로 돌아가기">←</a>
        <div className="counting-progress"><strong>{Object.values(results).filter(Boolean).length}<small>/{problems.length} 정답</small></strong></div>
        <div className="toolbar">
          <button className="button secondary" type="button" onClick={() => { setProblemSet(createFreshMiddleCoreProblemSet(kind, Date.now() >>> 0, problemSet.problems)); reset(); }}>새 문제</button>
          <button className="button ghost" type="button" onClick={reset}>다시 풀기</button>
          <button className="button secondary" type="button" onClick={() => setPanelOpen(true)}>답안 입력</button>
          <button className="button ghost" type="button" onClick={() => window.print()}>인쇄</button>
          <button className="button primary" type="button" onClick={grade}>전체 채점</button>
        </div>
      </div>
      <div className="a4-stage counting-a4-stage worksheet-stage" style={{ width: 794 * scale, height: 1123 * scale }} aria-label={`A4 ${title} 문제지`}>{sheet(false)}</div>
      <div className="a4-stage counting-a4-stage answer-stage" style={{ width: 794 * scale, height: 1123 * scale }} aria-label={`A4 ${title} 정답지`}>{sheet(true)}</div>
      {panelOpen && <WorksheetChoicePanel title={title} problems={choiceProblems} selected={selected} results={results} onSelect={choose} onGrade={grade} onClose={() => setPanelOpen(false)} />}
    </main>
  );
}
