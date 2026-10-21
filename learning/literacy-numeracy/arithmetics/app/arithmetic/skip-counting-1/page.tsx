"use client";

import { useRecordedState, useRecordQuestions } from "@/app/components/learning-record-state";

import { useEffect, useMemo, useState } from "react";
import { SkipProblem, random, createProblemSet, answerId } from "@/lib/race-sets/skip-counting-1";

type PrintMode = "worksheet" | "answers" | "both";
const INITIAL_SEED = 20260720;
export default function SkipCountingOnePage() {
  const [questionSet, setQuestionSet] = useRecordedState("arithmetic/skip-counting-1/page:questionSet", () => createProblemSet(INITIAL_SEED));
  const [answers, setAnswers] = useRecordedState<Record<string, string>>("arithmetic/skip-counting-1/page:answers", {});
  const [results, setResults] = useRecordedState<Record<string, boolean>>("arithmetic/skip-counting-1/page:results", {});
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

  const expected = useMemo(
    () => questionSet.problems.flatMap((problem) => problem.hidden.map((index) => [
      answerId(problem, index),
      String(problem.values[index]),
    ] as const)),
    [questionSet],
  );
  const completed = Object.values(answers).filter(Boolean).length;
  const correct = Object.values(results).filter(Boolean).length;

  function updateAnswer(id: string, value: string) {
    setAnswers((current) => ({ ...current, [id]: value.replace(/[^0-9]/g, "").slice(0, 3) }));
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

  function skipRow(problem: SkipProblem, answerSheet: boolean) {
    const hiddenIds = problem.hidden.map((index) => answerId(problem, index));
    const graded = hiddenIds.some((id) => id in results);
    const rowCorrect = graded && hiddenIds.every((id) => results[id]);
    return (
      <div
        className={`skip-row${graded ? rowCorrect ? " is-correct" : " is-wrong" : ""}`}
        data-testid="skip-row"
        key={problem.id}
      >
        {problem.values.map((value, index) => (
          <span className="skip-part" key={index}>
            {index > 0 && <i aria-hidden="true">→</i>}
            {problem.hidden.includes(index) ? answerSheet ? (
              <strong className="skip-static-answer">{value}</strong>
            ) : (
              <input
                className="skip-input"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={3}
                value={answers[answerId(problem, index)] ?? ""}
                onChange={(event) => updateAnswer(answerId(problem, index), event.target.value)}
                aria-label={`${answerId(problem, index)} 답`}
              />
            ) : <strong>{value}</strong>}
          </span>
        ))}
        {!answerSheet && graded && (
          <span className={`counting-result ${rowCorrect ? "correct" : "wrong"}`} role="status">
            {rowCorrect ? "맞음" : "틀림"}
          </span>
        )}
      </div>
    );
  }

  function renderSheet(answerSheet: boolean) {
    return (
      <div className="a4-sheet counting-sheet skip-sheet" style={{ transform: `scale(${sheetScale})` }}>
        <header className="counting-sheet-header">
          <div className="counting-sheet-title">
            <span>1학년</span>
            <strong>뛰어 세기{answerSheet ? " 정답" : ""}</strong>
          </div>
          <div className="counting-sheet-info">
            <span>이름 <i /></span>
            <span>날짜 <i /></span>
            <small>문제지 {questionSet.seed}</small>
          </div>
        </header>
        <div className="skip-list">
          {questionSet.problems.map((problem) => skipRow(problem, answerSheet))}
        </div>
      </div>
    );
  }

  useRecordQuestions("arithmetic/skip-counting-1/page", { expected });

  return (
    <main className="counting-page skip-page">
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
      <div className="a4-stage counting-a4-stage worksheet-stage" style={{ width: 794 * sheetScale, height: 1123 * sheetScale }} aria-label="A4 뛰어 세기 문제지">
        {renderSheet(false)}
      </div>
      <div className="a4-stage counting-a4-stage answer-stage" style={{ width: 794 * sheetScale, height: 1123 * sheetScale }} aria-label="A4 뛰어 세기 전체 답지">
        {renderSheet(true)}
      </div>
    </main>
  );
}
