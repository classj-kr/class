"use client";

import { useRecordedState, useRecordQuestions } from "@/app/components/learning-record-state";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import InlineMathText from "../../../components/inline-math-text";
import MathFormula from "../../../components/math-formula";
import WorksheetQuestionPrompt from "../../../components/worksheet-question-prompt";
import WorksheetChoicePanel, {
  type WorksheetChoiceProblem,
} from "../../high-school/components/worksheet-choice-panel";
import {
  createMiddleQuadraticFunctionProblemSet,
  createMiddleQuadraticFunctionReviewProblems,
  MIDDLE_QUADRATIC_FUNCTION_TITLES,
  resolveMiddleQuadraticFunctionKind,
  type MiddleQuadraticFunctionKind,
  type MiddleQuadraticFunctionMethodKind,
  type MiddleQuadraticFunctionProblem,
} from "../../../../lib/middle-quadratic-function-workouts";

const DEFAULT_KIND: MiddleQuadraticFunctionKind = "comprehensive";
const INITIAL_SEED = 20260730;
const TARGET_LABELS: Record<MiddleQuadraticFunctionMethodKind, string> = {
  "expand-vertex-form": "전개한 이차함수의 식",
  "complete-square": "꼭짓점형으로 바꾼 식",
  "vertex-axis": "꼭짓점과 대칭축",
  "extreme-value": "최댓값·최솟값",
  "equation-from-vertex-point": "이차함수의 식",
  intercepts: "x절편과 y절편",
  "line-intersections": "교점의 x좌표",
  "normalize-first": "꼭짓점과 대칭축",
};

const QUESTION_PROMPTS: Record<MiddleQuadraticFunctionMethodKind, string> = {
  "expand-vertex-form": "전개한 식은?",
  "complete-square": "꼭짓점형은?",
  "vertex-axis": "꼭짓점과 대칭축은?",
  "extreme-value": "최댓값 또는 최솟값은?",
  "equation-from-vertex-point": "이차함수의 식은?",
  intercepts: "x절편과 y절편은?",
  "line-intersections": "교점의 x좌표는?",
  "normalize-first": "꼭짓점과 대칭축은?",
};

function choiceProblem(problem: MiddleQuadraticFunctionProblem): WorksheetChoiceProblem {
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
    label: TARGET_LABELS[problem.kind],
    prompt: QUESTION_PROMPTS[problem.kind],
    latex: problem.latex,
    correctLatex: problem.answerLatex,
    choices: [...choices.slice(shift), ...choices.slice(0, shift)],
  };
}

export default function MiddleQuadraticFunctionsPage() {
  const searchParams = useSearchParams();
  const [kind, setKind] = useRecordedState<MiddleQuadraticFunctionKind>("arithmetic/middle-school/quadratic-functions/page:kind", DEFAULT_KIND);
  const [problemSet, setProblemSet] = useRecordedState("arithmetic/middle-school/quadratic-functions/page:problemSet", () => (
    createMiddleQuadraticFunctionProblemSet(DEFAULT_KIND, INITIAL_SEED)
  ));
  const [reviews, setReviews] = useRecordedState<MiddleQuadraticFunctionProblem[]>("arithmetic/middle-school/quadratic-functions/page:reviews", []);
  const [selected, setSelected] = useRecordedState<Record<string, string>>("arithmetic/middle-school/quadratic-functions/page:selected", {});
  const [results, setResults] = useRecordedState<Record<string, boolean>>("arithmetic/middle-school/quadratic-functions/page:results", {});
  const [panelOpen, setPanelOpen] = useState(false);
  const [scale, setScale] = useState(0.6);

  useEffect(() => {
    const requestedKind = resolveMiddleQuadraticFunctionKind(
      searchParams.get("kind"),
    );
    if (!requestedKind || requestedKind === kind) return;
    setKind(requestedKind);
    setProblemSet(createMiddleQuadraticFunctionProblemSet(requestedKind, INITIAL_SEED));
    setReviews([]);
    setSelected({});
    setResults({});
  }, [kind, searchParams]);

  useEffect(() => {
    const fit = () => setScale(Math.min((window.innerWidth - 32) / 794, 1));
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  const title = MIDDLE_QUADRATIC_FUNCTION_TITLES[kind];
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
      if (!(problemId in current)) return current;
      const next = { ...current };
      delete next[problemId];
      return next;
    });
  }

  function grade() {
    setResults(Object.fromEntries(choiceProblems.map((problem) => [
      problem.id,
      problem.choices.find((choice) => choice.id === selected[problem.id])?.correct === true,
    ])));
  }

  function row(problem: MiddleQuadraticFunctionProblem, index: number, answerSheet: boolean) {
    return (
      <article
        className="polynomial-question logarithm-question"
        data-testid="middle-quadratic-function-question"
        key={`${problem.id}-${answerSheet}`}
      >
        <div className="polynomial-question-number">{String(index + 1).padStart(2, "0")}</div>
        <div className="polynomial-question-body">
          <span className="polynomial-focus-label"><InlineMathText text={problem.label} /></span>
          <WorksheetQuestionPrompt label={problem.label} prompt={QUESTION_PROMPTS[problem.kind]} />
          <div className="logarithm-expression">
            <MathFormula latex={problem.latex} display />
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
          <div className="counting-sheet-title"><span>중3</span><strong><InlineMathText text={title} />{answerSheet ? " 정답" : ""}</strong></div>
          <div className="counting-sheet-info"><span>이름 <i /></span><span>날짜 <i /></span><small>문제지 {problemSet.seed}</small></div>
        </header>
        <div className="polynomial-problem-grid logarithm-grid">{problems.map((problem, index) => row(problem, index, answerSheet))}</div>
      </div>
    );
  }

  useRecordQuestions("arithmetic/middle-school/quadratic-functions/page", { problems, choiceProblems });

  return (
    <main className="counting-page polynomial-page logarithm-page numeric-choice-page middle-quadratic-page">
      <div className="counting-toolbar">
        <a className="counting-back" href="/arithmetic" aria-label="연산 목록으로 돌아가기">←</a>
        <div className="counting-progress"><strong>{Object.values(results).filter(Boolean).length}<small>/{problems.length} 정답</small></strong></div>
        <div className="toolbar">
          <button className="button secondary" type="button" onClick={() => { setProblemSet(createMiddleQuadraticFunctionProblemSet(kind, Date.now() >>> 0)); reset(); }}>새 문제</button>
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
