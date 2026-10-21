"use client";

import { useRecordedState, useRecordQuestions } from "@/app/components/learning-record-state";

import { useEffect, useMemo, useState } from "react";
import { SimpleProblem, TripleProblem, random, createProblemSet } from "@/lib/race-sets/complements-1";

type PrintMode = "worksheet" | "answers" | "both";
const INITIAL_SEED = 20260720;
function ResultMark({ value }: { value?: boolean }) {
  if (value === undefined) return null;
  return <span className={`counting-result ${value ? "correct" : "wrong"}`} role="status">{value ? "맞음" : "틀림"}</span>;
}

export default function ComplementsOnePage() {
  const [questionSet, setQuestionSet] = useRecordedState("arithmetic/complements-1/page:questionSet", () => createProblemSet(INITIAL_SEED));
  const [answers, setAnswers] = useRecordedState<Record<string, string>>("arithmetic/complements-1/page:answers", {});
  const [results, setResults] = useRecordedState<Record<string, boolean>>("arithmetic/complements-1/page:results", {});
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

  const expected = useMemo(() => [
    ...questionSet.subtractions.map((problem) => [problem.id, String(problem.result)] as const),
    ...questionSet.pairs.map((problem) => [problem.id, String(problem[problem.hidden])] as const),
    ...questionSet.triples.map((problem) => [problem.id, String(problem.result)] as const),
  ], [questionSet]);
  const completed = Object.values(answers).filter(Boolean).length;
  const correct = Object.values(results).filter(Boolean).length;

  function updateAnswer(id: string, value: string) {
    setAnswers((current) => ({ ...current, [id]: value.replace(/[^0-9]/g, "").slice(0, 2) }));
    setResults((current) => {
      if (!(id in current)) return current;
      const next = { ...current };
      delete next[id];
      return next;
    });
  }

  function checkAll() {
    setResults(Object.fromEntries(expected.map(([id, answer]) => [id, answers[id] === answer])));
  }

  function resetAnswers() {
    setAnswers({});
    setResults({});
  }

  function newSet() {
    if (completed > 0 && !window.confirm("쓴 답이 사라집니다. 새 문제를 만들까요?")) return;
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

  function answerBox(id: string, answer: number, answerSheet: boolean, twoDigits = false) {
    return answerSheet ? (
      <strong className={`complement-static-answer${twoDigits ? " wide" : ""}`}>{answer}</strong>
    ) : (
      <input
        className={`complement-input${twoDigits ? " wide" : ""}`}
        inputMode="numeric"
        pattern="[0-9]*"
        maxLength={twoDigits ? 2 : 1}
        value={answers[id] ?? ""}
        onChange={(event) => updateAnswer(id, event.target.value)}
        aria-label={`${id} 답`}
      />
    );
  }

  function simpleRow(problem: SimpleProblem, answerSheet: boolean) {
    const number = (field: "left" | "right" | "result") =>
      problem.hidden === field ? answerBox(problem.id, problem[field], answerSheet) : <strong>{problem[field]}</strong>;
    return (
      <div className={`complement-row simple${results[problem.id] === true ? " is-correct" : results[problem.id] === false ? " is-wrong" : ""}`} data-testid="complement-row" key={problem.id}>
        {number("left")}<span>{problem.operator}</span>{number("right")}<span>=</span>{number("result")}
        {!answerSheet && <ResultMark value={results[problem.id]} />}
      </div>
    );
  }

  function tripleRow(problem: TripleProblem, answerSheet: boolean) {
    return (
      <div className={`complement-row triple${results[problem.id] === true ? " is-correct" : results[problem.id] === false ? " is-wrong" : ""}`} data-testid="complement-row" key={problem.id}>
        <strong>{problem.values[0]}</strong><span>+</span><strong>{problem.values[1]}</strong><span>+</span><strong>{problem.values[2]}</strong><span>=</span>
        {answerBox(problem.id, problem.result, answerSheet, true)}
        {!answerSheet && <ResultMark value={results[problem.id]} />}
      </div>
    );
  }

  function renderSheet(answerSheet: boolean) {
    return (
      <div className="a4-sheet counting-sheet complement-sheet" style={{ transform: `scale(${sheetScale})` }}>
        <header className="counting-sheet-header">
          <div className="counting-sheet-title">
            <span>1학년</span>
            <strong>10 모으기·가르기{answerSheet ? " 정답" : ""}</strong>
          </div>
          <div className="counting-sheet-info">
            <span>이름 <i /></span>
            <span>날짜 <i /></span>
            <small>문제지 {questionSet.seed}</small>
          </div>
        </header>

        <div className="complement-columns">
          <section className="complement-column column-1" aria-label="10에서 빼기">
            {questionSet.subtractions.map((problem) => simpleRow(problem, answerSheet))}
          </section>
          <section className="complement-column column-2" aria-label="두 수로 10 만들기">
            {questionSet.pairs.map((problem) => simpleRow(problem, answerSheet))}
          </section>
          <section className="complement-column column-3" aria-label="세 수 더하기">
            {questionSet.triples.map((problem) => tripleRow(problem, answerSheet))}
          </section>
        </div>
      </div>
    );
  }

  useRecordQuestions("arithmetic/complements-1/page", { expected });

  return (
    <main className="counting-page complement-page">
      <div className="counting-toolbar">
        <a className="counting-back" href="/arithmetic" aria-label="연산 목록으로 돌아가기">←</a>
        <div className="counting-progress"><strong>{correct}<small>/30 정답</small></strong></div>
        <div className="toolbar">
          <button className="button secondary" type="button" onClick={newSet}>새 문제</button>
          <button className="button ghost" type="button" onClick={resetAnswers}>다시 쓰기</button>
          <div className="print-control">
            <button className="button ghost print-button" type="button" aria-expanded={printMenuOpen} aria-haspopup="menu" onClick={() => setPrintMenuOpen((open) => !open)}>인쇄</button>
            {printMenuOpen && (
              <div className="print-menu" role="menu" aria-label="인쇄 자료 선택">
                <button type="button" role="menuitem" onClick={() => printMaterials("worksheet")}>문제지만 인쇄</button>
                <button type="button" role="menuitem" onClick={() => printMaterials("answers")}>답지만 인쇄</button>
                <button type="button" role="menuitem" onClick={() => printMaterials("both")}>문제지+답지 인쇄</button>
              </div>
            )}
          </div>
          <button className="button primary" type="button" onClick={checkAll}>전체 채점</button>
        </div>
      </div>

      <div className="a4-stage counting-a4-stage worksheet-stage" style={{ width: 794 * sheetScale, height: 1123 * sheetScale }} aria-label="A4 보수 문제지">
        {renderSheet(false)}
      </div>
      <div className="a4-stage counting-a4-stage answer-stage" style={{ width: 794 * sheetScale, height: 1123 * sheetScale }} aria-label="A4 보수 전체 답지">
        {renderSheet(true)}
      </div>
    </main>
  );
}
