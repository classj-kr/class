"use client";

import { useRecordedState, useRecordQuestions } from "@/app/components/learning-record-state";

import { useEffect, useMemo, useState } from "react";
import { ReadingProblem, random, createProblemSet, normalizeAnswer } from "@/lib/race-sets/number-reading-1";

type PrintMode = "worksheet" | "answers" | "both";
const INITIAL_SEED = 20260720;
export default function NumberReadingOnePage() {
  const [questionSet, setQuestionSet] = useRecordedState("arithmetic/number-reading-1/page:questionSet", () => createProblemSet(INITIAL_SEED));
  const [answers, setAnswers] = useRecordedState<Record<string, string>>("arithmetic/number-reading-1/page:answers", {});
  const [results, setResults] = useRecordedState<Record<string, boolean>>("arithmetic/number-reading-1/page:results", {});
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

  const allProblems = useMemo(
    () => [...questionSet.sinoKorean, ...questionSet.nativeKorean],
    [questionSet],
  );
  const completed = Object.values(answers).filter((value) => normalizeAnswer(value)).length;
  const correct = Object.values(results).filter(Boolean).length;

  function updateAnswer(id: string, value: string) {
    setAnswers((current) => ({ ...current, [id]: value.slice(0, 8) }));
    setResults((current) => {
      if (!(id in current)) return current;
      const next = { ...current };
      delete next[id];
      return next;
    });
  }

  function checkAll() {
    setResults(Object.fromEntries(allProblems.map((problem) => [
      problem.id,
      normalizeAnswer(answers[problem.id] ?? "") === problem.answer,
    ])));
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

  function readingRow(problem: ReadingProblem, answerSheet: boolean) {
    const result = results[problem.id];
    return (
      <div
        className={`reading-row${result === true ? " is-correct" : result === false ? " is-wrong" : ""}`}
        data-testid="reading-row"
        key={problem.id}
      >
        <strong>{problem.number}</strong>
        <span>→</span>
        {answerSheet ? (
          <strong className="reading-static-answer">{problem.answer}</strong>
        ) : (
          <input
            className="reading-input"
            type="text"
            inputMode="text"
            maxLength={8}
            value={answers[problem.id] ?? ""}
            onChange={(event) => updateAnswer(problem.id, event.target.value)}
            aria-label={`${problem.id} 답`}
          />
        )}
        {!answerSheet && result !== undefined && (
          <span className={`counting-result ${result ? "correct" : "wrong"}`} role="status">
            {result ? "맞음" : "틀림"}
          </span>
        )}
      </div>
    );
  }

  function renderSheet(answerSheet: boolean) {
    return (
      <div className="a4-sheet counting-sheet reading-sheet" style={{ transform: `scale(${sheetScale})` }}>
        <header className="counting-sheet-header">
          <div className="counting-sheet-title">
            <span>1학년</span>
            <strong>두 자리 수 읽기{answerSheet ? " 정답" : ""}</strong>
          </div>
          <div className="counting-sheet-info">
            <span>이름 <i /></span>
            <span>날짜 <i /></span>
            <small>문제지 {questionSet.seed}</small>
          </div>
        </header>

        <div className="reading-columns">
          <section className="reading-column sino" aria-label="한자(일 이 삼···)">
            <h2>▼ 한자(일 이 삼···)</h2>
            {questionSet.sinoKorean.map((problem) => readingRow(problem, answerSheet))}
          </section>
          <section className="reading-column native" aria-label="우리말(하나 둘 셋···)">
            <h2>▼ 우리말(하나 둘 셋···)</h2>
            {questionSet.nativeKorean.map((problem) => readingRow(problem, answerSheet))}
          </section>
        </div>
      </div>
    );
  }

  useRecordQuestions("arithmetic/number-reading-1/page", { allProblems });

  return (
    <main className="counting-page reading-page">
      <div className="counting-toolbar">
        <a className="counting-back" href="/arithmetic" aria-label="연산 목록으로 돌아가기">←</a>
        <div className="counting-progress"><strong>{correct}<small>/18 정답</small></strong></div>
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

      <div className="a4-stage counting-a4-stage worksheet-stage" style={{ width: 794 * sheetScale, height: 1123 * sheetScale }} aria-label="A4 수 읽기 문제지">
        {renderSheet(false)}
      </div>
      <div className="a4-stage counting-a4-stage answer-stage" style={{ width: 794 * sheetScale, height: 1123 * sheetScale }} aria-label="A4 수 읽기 전체 답지">
        {renderSheet(true)}
      </div>
    </main>
  );
}
