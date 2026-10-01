"use client";

import { useRecordedState, useRecordQuestions } from "@/app/components/learning-record-state";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { moveBetweenFractionAnswerInputs } from "../../components/fraction-answer-navigation";
import { createGradeSixMixedCalculationSet, normalizeGradeSixMixedAnswer } from "../../../lib/grade-six-mixed-calculation";
import type { GradeSixMixedCalculationOperand, GradeSixMixedCalculationProblem } from "../../../lib/grade-six-mixed-calculation";

type PrintMode = "worksheet" | "answers" | "both";
type FractionWrittenAnswer = { whole: string; numerator: string; denominator: string };
const INITIAL_SEED = 20260722;

function FractionStack({ numerator, denominator, className = "", inputOrder = false }: { numerator: ReactNode; denominator: ReactNode; className?: string; inputOrder?: boolean }) {
  return <span className={`grade-five-fraction-one-stack grade-six-mixed-fraction${className ? ` ${className}` : ""}${inputOrder ? " input-order" : ""}`}>
    {inputOrder ? <>
      <span className="grade-five-fraction-one-number denominator-slot">{denominator}</span>
      <span className="grade-five-fraction-one-line" aria-hidden="true" />
      <span className="grade-five-fraction-one-number numerator-slot">{numerator}</span>
    </> : <>
      <span className="grade-five-fraction-one-number">{numerator}</span>
      <span className="grade-five-fraction-one-line" aria-hidden="true" />
      <span className="grade-five-fraction-one-number">{denominator}</span>
    </>}
  </span>;
}

function Operand({ value }: { value: GradeSixMixedCalculationOperand }) {
  if (value.kind === "fraction") return <FractionStack numerator={value.numerator} denominator={value.denominator} />;
  if (value.kind === "mixed") return <span className="grade-six-mixed-mixed-number"><strong>{value.whole}</strong><FractionStack numerator={value.numerator} denominator={value.denominator} /></span>;
  return <span className={`grade-six-mixed-${value.kind}`}>{value.value}</span>;
}

function parsedFractionAnswer(answer: string) {
  const mixed = answer.match(/^(-?\d+) (\d+)\/(\d+)$/);
  if (mixed) return { whole: Number(mixed[1]), numerator: Number(mixed[2]), denominator: Number(mixed[3]) };
  const fraction = answer.match(/^(-?\d+)\/(\d+)$/);
  if (fraction) return { whole: 0, numerator: Number(fraction[1]), denominator: Number(fraction[2]) };
  return { whole: Number(answer), numerator: 0, denominator: 1 };
}

function StaticFractionAnswer({ answer }: { answer: string }) {
  const value = parsedFractionAnswer(answer);
  return <span className="grade-six-mixed-static-fraction">
    {value.whole !== 0 && <strong>{value.whole}</strong>}
    {value.numerator !== 0 && <FractionStack numerator={value.numerator} denominator={value.denominator} />}
  </span>;
}

export default function GradeSixMixedCalculationPage() {
  const [seed, setSeed] = useRecordedState("arithmetic/grade-6-mixed-calculation/page:seed", INITIAL_SEED);
  const [decimalAnswers, setDecimalAnswers] = useRecordedState<Record<string, string>>("arithmetic/grade-6-mixed-calculation/page:decimalAnswers", {});
  const [fractionAnswers, setFractionAnswers] = useRecordedState<Record<string, FractionWrittenAnswer>>("arithmetic/grade-6-mixed-calculation/page:fractionAnswers", {});
  const [results, setResults] = useRecordedState<Record<string, boolean>>("arithmetic/grade-6-mixed-calculation/page:results", {});
  const [sheetScale, setSheetScale] = useState(.6);
  const [printMenuOpen, setPrintMenuOpen] = useState(false);
  const problems = useMemo(() => createGradeSixMixedCalculationSet(seed), [seed]);
  const completed = problems.filter((problem) => problem.kind === "decimal"
    ? Boolean(decimalAnswers[problem.id])
    : Boolean(fractionAnswers[problem.id]?.whole || fractionAnswers[problem.id]?.numerator || fractionAnswers[problem.id]?.denominator)).length;
  const correct = Object.values(results).filter(Boolean).length;

  useEffect(() => {
    const fit = () => setSheetScale(Math.min((window.innerWidth - 32) / 794, 1));
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  function clearResult(id: string) {
    setResults((current) => {
      if (!(id in current)) return current;
      const next = { ...current };
      delete next[id];
      return next;
    });
  }

  function updateDecimalAnswer(id: string, input: string) {
    setDecimalAnswers((current) => ({ ...current, [id]: input.replace(/[^0-9.-]/g, "").slice(0, 10) }));
    clearResult(id);
  }

  function updateFractionAnswer(id: string, field: keyof FractionWrittenAnswer, input: string) {
    setFractionAnswers((current) => ({
      ...current,
      [id]: {
        whole: current[id]?.whole ?? "",
        numerator: current[id]?.numerator ?? "",
        denominator: current[id]?.denominator ?? "",
        [field]: input.replace(/[^0-9]/g, "").slice(0, field === "whole" ? 3 : 4),
      },
    }));
    clearResult(id);
  }

  function writtenAnswer(problem: GradeSixMixedCalculationProblem) {
    if (problem.kind === "decimal") return decimalAnswers[problem.id] ?? "";
    const answer = fractionAnswers[problem.id];
    if (!answer) return "";
    if (answer.numerator && answer.denominator) return `${answer.whole ? `${answer.whole} ` : ""}${answer.numerator}/${answer.denominator}`;
    return answer.whole;
  }

  function checkAll() {
    setResults(Object.fromEntries(problems.map((problem) => [problem.id, normalizeGradeSixMixedAnswer(writtenAnswer(problem)) === problem.answer])));
  }

  function reset() {
    setDecimalAnswers({});
    setFractionAnswers({});
    setResults({});
  }

  function newSet() {
    if (completed && !window.confirm("답이 사라집니다. 새 문제를 만들까요?")) return;
    setSeed((Date.now() ^ Math.floor(Math.random() * 0xffffffff)) >>> 0);
    reset();
  }

  function printMaterials(mode: PrintMode) {
    setPrintMenuOpen(false);
    document.documentElement.dataset.printMode = mode;
    window.addEventListener("afterprint", () => delete document.documentElement.dataset.printMode, { once: true });
    window.requestAnimationFrame(() => window.print());
  }

  function renderFractionInput(problem: GradeSixMixedCalculationProblem) {
    const answer = fractionAnswers[problem.id] ?? { whole: "", numerator: "", denominator: "" };
    return <span className="grade-six-mixed-answer-wrap fraction-answer">
      <span className="grade-six-mixed-fraction-answer">
        <input className="grade-six-mixed-whole-input" type="text" inputMode="numeric" maxLength={3} value={answer.whole} onChange={(event) => updateFractionAnswer(problem.id, "whole", event.target.value)} data-fraction-answer-input="true" onKeyDown={moveBetweenFractionAnswerInputs} aria-label={`${problem.id} 자연수 부분`} />
        <FractionStack
          className="answer"
          inputOrder
          denominator={<input className="grade-six-mixed-part-input denominator" type="text" inputMode="numeric" maxLength={4} value={answer.denominator} onChange={(event) => updateFractionAnswer(problem.id, "denominator", event.target.value)} data-fraction-answer-input="true" onKeyDown={moveBetweenFractionAnswerInputs} aria-label={`${problem.id} 분모`} />}
          numerator={<input className="grade-six-mixed-part-input numerator" type="text" inputMode="numeric" maxLength={4} value={answer.numerator} onChange={(event) => updateFractionAnswer(problem.id, "numerator", event.target.value)} data-fraction-answer-input="true" onKeyDown={moveBetweenFractionAnswerInputs} aria-label={`${problem.id} 분자`} />}
        />
      </span>
      <small>(분수로 쓰기)</small>
    </span>;
  }

  function renderAnswer(problem: GradeSixMixedCalculationProblem, answerSheet: boolean) {
    if (answerSheet) return problem.kind === "fraction"
      ? <StaticFractionAnswer answer={problem.answer} />
      : <span className="mixed-calculation-static-answer grade-six-mixed-static-decimal">{problem.answer}</span>;
    if (problem.kind === "fraction") return renderFractionInput(problem);
    return <span className="grade-six-mixed-answer-wrap decimal-answer">
      <input className="mixed-calculation-input grade-six-mixed-decimal-input" type="text" inputMode="decimal" value={decimalAnswers[problem.id] ?? ""} onChange={(event) => updateDecimalAnswer(problem.id, event.target.value)} aria-label={`${problem.id} 소수 답`} />
      <small>(소수로 쓰기)</small>
    </span>;
  }

  function renderProblem(problem: GradeSixMixedCalculationProblem, index: number, answerSheet: boolean) {
    const graded = problem.id in results;
    const isCorrect = results[problem.id] === true;
    return <div className={`multiplication-question mixed-calculation-question grade-six-mixed-question${graded ? isCorrect ? " is-correct" : " is-wrong" : ""}`} key={problem.id} data-testid="grade-six-mixed-calculation-question">
      <span className="mixed-calculation-index">{index + 1}</span>
      <div className="mixed-calculation-expression grade-six-mixed-expression">
        <div className="grade-six-mixed-expression-parts">
          {problem.operands.map((operand, operandIndex) => <span className="grade-six-mixed-term" key={operandIndex}>
            {operandIndex > 0 && <span className="grade-six-mixed-operator">{problem.operators[operandIndex - 1]}</span>}
            <Operand value={operand} />
          </span>)}
        </div>
        <span className="grade-six-mixed-equals">=</span>
        {renderAnswer(problem, answerSheet)}
      </div>
      {!answerSheet && graded && <span className={`counting-result ${isCorrect ? "correct" : "wrong"}`} role="status">{isCorrect ? "맞음" : "틀림"}</span>}
    </div>;
  }

  function sheet(answerSheet: boolean) {
    return <div className="a4-sheet counting-sheet mixed-calculation-sheet grade-six-mixed-calculation-sheet" style={{ transform: `scale(${sheetScale})` }}>
      <header className="counting-sheet-header"><div className="counting-sheet-title"><span>6학년</span><strong>분수·소수 혼합 계산{answerSheet ? " 정답" : ""}</strong></div><div className="counting-sheet-info"><span>이름 <i /></span><span>날짜 <i /></span><small>문제지 {seed}</small></div></header>
      <div className="mixed-calculation-grid grade-six-mixed-calculation-grid">{problems.map((problem, index) => renderProblem(problem, index, answerSheet))}</div>
    </div>;
  }

  useRecordQuestions("arithmetic/grade-6-mixed-calculation/page", { problems });

  return <main className="counting-page multiplication-page">
    <div className="counting-toolbar"><a className="counting-back" href="/arithmetic" aria-label="연산 목록으로 돌아가기">←</a><div className="counting-progress"><strong>{correct}<small>/6 정답</small></strong></div><div className="toolbar"><button className="button secondary" type="button" onClick={newSet}>새 문제</button><button className="button ghost" type="button" onClick={reset}>다시 풀기</button><div className="print-control"><button className="button ghost print-button" type="button" aria-expanded={printMenuOpen} aria-haspopup="menu" onClick={() => setPrintMenuOpen((open) => !open)}>인쇄</button>{printMenuOpen && <div className="print-menu" role="menu"><button type="button" role="menuitem" onClick={() => printMaterials("worksheet")}>문제지만 인쇄</button><button type="button" role="menuitem" onClick={() => printMaterials("answers")}>답지만 인쇄</button><button type="button" role="menuitem" onClick={() => printMaterials("both")}>문제지+답지 인쇄</button></div>}</div><button className="button primary" type="button" onClick={checkAll}>전체 채점</button></div></div>
    <div className="a4-stage counting-a4-stage worksheet-stage" style={{ width: 794 * sheetScale, height: 1123 * sheetScale }} aria-label="A4 6학년 분수·소수 혼합 계산 문제지">{sheet(false)}</div>
    <div className="a4-stage counting-a4-stage answer-stage" style={{ width: 794 * sheetScale, height: 1123 * sheetScale }} aria-label="A4 6학년 분수·소수 혼합 계산 전체 답지">{sheet(true)}</div>
  </main>;
}