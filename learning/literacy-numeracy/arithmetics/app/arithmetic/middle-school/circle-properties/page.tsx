"use client";

import { useRecordedState, useRecordQuestions } from "@/app/components/learning-record-state";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import InlineMathText from "../../../components/inline-math-text";
import MathFormula from "../../../components/math-formula";
import MiddleCurriculumVisual from "../../../components/middle-curriculum-visual";
import WorksheetQuestionPrompt from "../../../components/worksheet-question-prompt";
import WorksheetChoicePanel, {
  type WorksheetChoiceProblem,
} from "../../high-school/components/worksheet-choice-panel";
import {
  createMiddleCirclePropertiesProblemSet,
  createMiddleCirclePropertiesReviewProblems,
  MIDDLE_CIRCLE_PROPERTIES_TITLES,
  resolveMiddleCirclePropertiesKind,
  type MiddleCirclePropertiesKind,
  type MiddleCirclePropertiesMethodKind,
  type MiddleCirclePropertiesProblem,
} from "../../../../lib/middle-circle-properties-workouts";

const DEFAULT_KIND: MiddleCirclePropertiesKind = "inscribed-angles";
const INITIAL_SEED = 20260801;
const TARGET_LABELS: Record<MiddleCirclePropertiesMethodKind, string> = {
  "central-to-inscribed": "원주각의 크기는?",
  "inscribed-to-central": "중심각의 크기는?",
  "arc-to-inscribed": "원주각의 크기는?",
  "same-arc": "∠AQB의 크기는?",
  "semicircle-angle": "∠ABC의 크기는?",
  "cyclic-quadrilateral": "∠C의 크기는?",
  "tangent-chord-angle": "∠APB의 크기는?",
  "tangent-length": "PB의 길이는?",
  "tangent-expression": "$x$의 값은?",
  "tangent-perimeter": "$\\triangle PAB$의 둘레는?",
  "chord-length": "현 AB의 길이는?",
  "center-to-chord": "OM의 길이는?",
  "equal-chord-distance": "ON의 길이는?",
  "equal-chord-length": "현 CD의 길이는?",
  "chord-comparison": "더 긴 현은?",
  "arc-sum": "호 CA의 크기는?",
};

function choiceProblem(problem: MiddleCirclePropertiesProblem): WorksheetChoiceProblem {
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
    prompt: TARGET_LABELS[problem.kind],
    latex: problem.latex,
    correctLatex: problem.answerLatex,
    choices: [...choices.slice(shift), ...choices.slice(0, shift)],
  };
}

export default function MiddleCirclePropertiesPage() {
  const searchParams = useSearchParams();
  const [kind, setKind] = useRecordedState<MiddleCirclePropertiesKind>("arithmetic/middle-school/circle-properties/page:kind", DEFAULT_KIND);
  const [problemSet, setProblemSet] = useRecordedState("arithmetic/middle-school/circle-properties/page:problemSet", () => (
    createMiddleCirclePropertiesProblemSet(DEFAULT_KIND, INITIAL_SEED)
  ));
  const [reviews, setReviews] = useRecordedState<MiddleCirclePropertiesProblem[]>("arithmetic/middle-school/circle-properties/page:reviews", []);
  const [selected, setSelected] = useRecordedState<Record<string, string>>("arithmetic/middle-school/circle-properties/page:selected", {});
  const [results, setResults] = useRecordedState<Record<string, boolean>>("arithmetic/middle-school/circle-properties/page:results", {});
  const [panelOpen, setPanelOpen] = useState(false);
  const [scale, setScale] = useState(0.6);

  useEffect(() => {
    const requestedKind = resolveMiddleCirclePropertiesKind(
      searchParams.get("kind"),
    );
    if (!requestedKind || requestedKind === kind) return;
    setKind(requestedKind);
    setProblemSet(createMiddleCirclePropertiesProblemSet(requestedKind, INITIAL_SEED));
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

  const title = MIDDLE_CIRCLE_PROPERTIES_TITLES[kind];
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

  function row(problem: MiddleCirclePropertiesProblem, index: number, answerSheet: boolean) {
    return (
      <article
        className="polynomial-question logarithm-question"
        data-testid="middle-circle-properties-question"
        key={`${answerSheet ? "answer" : "question"}-${problem.id}`}
      >
        <div className="polynomial-question-number">{String(index + 1).padStart(2, "0")}</div>
        <div className="polynomial-question-body">
          <span className="polynomial-focus-label"><InlineMathText text={problem.label} /></span>
          <WorksheetQuestionPrompt label={problem.label} prompt={TARGET_LABELS[problem.kind]} />
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
          <div className="counting-sheet-title"><span>중3</span><strong><InlineMathText text={title} />{answerSheet ? " 정답" : ""}</strong></div>
          <div className="counting-sheet-info"><span>이름 <i /></span><span>날짜 <i /></span><small>문제지 {problemSet.seed}</small></div>
        </header>
        <div className="polynomial-instruction"><b>주어진 각도와 길이로 구하는 값을 계산하세요.</b><span>답안 입력에서 4지선다 채점</span></div>
        <div className="polynomial-problem-grid logarithm-grid">{problems.map((problem, index) => row(problem, index, answerSheet))}</div>
      </div>
    );
  }

  useRecordQuestions("arithmetic/middle-school/circle-properties/page", { problems, choiceProblems });

  return (
    <main className="counting-page polynomial-page logarithm-page numeric-choice-page middle-quadratic-page">
      <div className="counting-toolbar">
        <a className="counting-back" href="/arithmetic" aria-label="연산 목록으로 돌아가기">←</a>
        <div className="counting-progress"><strong>{Object.values(results).filter(Boolean).length}<small>/{problems.length} 정답</small></strong></div>
        <div className="toolbar">
          <button className="button secondary" type="button" onClick={() => { setProblemSet(createMiddleCirclePropertiesProblemSet(kind, Date.now() >>> 0)); reset(); }}>새 문제</button>
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
