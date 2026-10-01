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
  createMiddleStatisticsProblemSet,
  createMiddleStatisticsReviewProblems,
  MIDDLE_STATISTICS_TITLES,
  resolveMiddleStatisticsKind,
  type MiddleStatisticsKind,
  type MiddleStatisticsMethodKind,
  type MiddleStatisticsProblem,
} from "../../../../lib/middle-statistics-workouts";

const DEFAULT_KIND: MiddleStatisticsKind = "representative-values";
const INITIAL_SEED = 20260802;
const TARGET_LABELS: Record<MiddleStatisticsMethodKind, string> = {
  mean: "평균은?",
  "missing-from-mean": "x의 값은?",
  "frequency-mean": "평균은?",
  "histogram-frequency": "색칠한 계급의 도수는?",
  "frequency-polygon-maximum": "도수가 가장 큰 계급은?",
  "total-frequency": "전체 도수는?",
  "relative-frequency": "상대도수는?",
  "missing-frequency": "x의 값은?",
  "relative-percentage": "백분율은?",
  median: "중앙값은?",
  mode: "최빈값은?",
  range: "범위는?",
  deviations: "편차는?",
  variance: "분산은?",
  "standard-deviation": "표준편차는?",
  "variance-from-deviations": "분산은?",
  "compare-spread": "산포도가 더 작은 자료는?",
};

function choiceProblem(problem: MiddleStatisticsProblem): WorksheetChoiceProblem {
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
    visual: problem.visual ? <MiddleCurriculumVisual visual={problem.visual} /> : undefined,
    correctLatex: problem.answerLatex,
    choices: [...choices.slice(shift), ...choices.slice(0, shift)],
  };
}

export default function MiddleStatisticsPage() {
  const searchParams = useSearchParams();
  const [kind, setKind] = useRecordedState<MiddleStatisticsKind>("arithmetic/middle-school/statistics/page:kind", DEFAULT_KIND);
  const [problemSet, setProblemSet] = useRecordedState("arithmetic/middle-school/statistics/page:problemSet", () => (
    createMiddleStatisticsProblemSet(DEFAULT_KIND, INITIAL_SEED)
  ));
  const [reviews, setReviews] = useRecordedState<MiddleStatisticsProblem[]>("arithmetic/middle-school/statistics/page:reviews", []);
  const [selected, setSelected] = useRecordedState<Record<string, string>>("arithmetic/middle-school/statistics/page:selected", {});
  const [results, setResults] = useRecordedState<Record<string, boolean>>("arithmetic/middle-school/statistics/page:results", {});
  const [panelOpen, setPanelOpen] = useState(false);
  const [scale, setScale] = useState(0.6);

  useEffect(() => {
    const requestedKind = resolveMiddleStatisticsKind(
      searchParams.get("kind"),
    );
    if (!requestedKind || requestedKind === kind) return;
    setKind(requestedKind);
    setProblemSet(createMiddleStatisticsProblemSet(requestedKind, INITIAL_SEED));
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

  const title = MIDDLE_STATISTICS_TITLES[kind];
  const subject = kind === "representative-values" || kind === "mean-applications"
    ? "중1"
    : "중3";
  const instruction = kind === "representative-values" || kind === "mean-applications"
    ? "주어진 자료의 대푯값·도수·상대도수를 계산하세요."
    : "주어진 자료의 대푯값 또는 산포도를 계산하세요.";
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

  function row(problem: MiddleStatisticsProblem, index: number, answerSheet: boolean) {
    return (
      <article
        className="polynomial-question logarithm-question"
        data-testid="middle-statistics-question"
        key={`${answerSheet ? "answer" : "question"}-${problem.id}`}
      >
        <div className="polynomial-question-number">{String(index + 1).padStart(2, "0")}</div>
        <div className="polynomial-question-body">
          <span className="polynomial-focus-label"><InlineMathText text={problem.label} /></span>
          <WorksheetQuestionPrompt
            className="logarithm-prompt middle-statistics-prompt"
            label={problem.label}
            prompt={TARGET_LABELS[problem.kind]}
          />
          {problem.visual && (
            <div className="middle-statistics-visual">
              <MiddleCurriculumVisual visual={problem.visual} />
            </div>
          )}
          {problem.latex && (
            <div className="logarithm-expression">
              <MathFormula latex={problem.latex} />
            </div>
          )}
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
          <div className="counting-sheet-title"><span>{subject}</span><strong><InlineMathText text={title} />{answerSheet ? " 정답" : ""}</strong></div>
          <div className="counting-sheet-info"><span>이름 <i /></span><span>날짜 <i /></span><small>문제지 {problemSet.seed}</small></div>
        </header>
        <div className="polynomial-instruction"><b>{instruction}</b><span>답안 입력에서 4지선다 채점</span></div>
        <div className="polynomial-problem-grid logarithm-grid">{problems.map((problem, index) => row(problem, index, answerSheet))}</div>
      </div>
    );
  }

  useRecordQuestions("arithmetic/middle-school/statistics/page", { problems, choiceProblems });

  return (
    <main className="counting-page polynomial-page logarithm-page numeric-choice-page middle-quadratic-page">
      <div className="counting-toolbar">
        <a className="counting-back" href="/arithmetic" aria-label="연산 목록으로 돌아가기">←</a>
        <div className="counting-progress"><strong>{Object.values(results).filter(Boolean).length}<small>/{problems.length} 정답</small></strong></div>
        <div className="toolbar">
          <button className="button secondary" type="button" onClick={() => { setProblemSet(createMiddleStatisticsProblemSet(kind, Date.now() >>> 0)); reset(); }}>새 문제</button>
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
