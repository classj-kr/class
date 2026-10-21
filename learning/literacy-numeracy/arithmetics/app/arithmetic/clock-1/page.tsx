"use client";

import { useRecordedState, useRecordQuestions } from "@/app/components/learning-record-state";

import { useEffect, useState } from "react";
import { ClockProblem, ClockResponse, PROBLEM_COUNT, CLOCK_NUMBERS, random, createProblemSet } from "@/lib/race-sets/clock-1";

type PrintMode = "worksheet" | "answers" | "both";
const INITIAL_SEED = 20260720;
function ClockFace({ hour, minute, label }: { hour: number; minute: number; label: string }) {
  const hourAngle = (hour % 12) * 30 + minute * 0.5;
  const minuteAngle = minute * 6;
  return (
    <div className="analog-clock" role="img" aria-label={label}>
      {CLOCK_NUMBERS.map((number) => {
        const angle = number * 30;
        const radians = (angle * Math.PI) / 180;
        return (
          <span
            className="clock-number"
            key={number}
            style={{ left: `${50 + Math.sin(radians) * 39}%`, top: `${50 - Math.cos(radians) * 39}%` }}
          >
            {number}
          </span>
        );
      })}
      <span className="clock-hand hour-hand" style={{ transform: `translateX(-50%) rotate(${hourAngle}deg)` }} />
      <span className="clock-hand minute-hand" style={{ transform: `translateX(-50%) rotate(${minuteAngle}deg)` }} />
      <span className="clock-center" />
    </div>
  );
}

function cleanDigits(value: string) {
  return value.replace(/[^0-9]/g, "").slice(0, 2);
}

function normalizeReading(value: string) {
  return value.replace(/\s+/g, "");
}

function numericAnswerMatches(value: string | undefined, expected: number) {
  return Boolean(value && /^\d{1,2}$/.test(value) && Number(value) === expected);
}

export default function ClockOnePage() {
  const [questionSet, setQuestionSet] = useRecordedState("arithmetic/clock-1/page:questionSet", () => createProblemSet(INITIAL_SEED));
  const [responses, setResponses] = useRecordedState<Record<string, ClockResponse>>("arithmetic/clock-1/page:responses", {});
  const [results, setResults] = useRecordedState<Record<string, boolean>>("arithmetic/clock-1/page:results", {});
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

  const correct = Object.values(results).filter(Boolean).length;
  const completed = Object.values(responses).some((response) => Object.values(response).some(Boolean));

  function updateResponse(id: string, field: keyof ClockResponse, value: string) {
    const nextValue = field === "reading" ? value.slice(0, 18) : cleanDigits(value);
    setResponses((current) => ({ ...current, [id]: { ...current[id], [field]: nextValue } }));
    setResults((current) => {
      if (!(id in current)) return current;
      const next = { ...current };
      delete next[id];
      return next;
    });
  }

  function checkAll() {
    setResults(Object.fromEntries(questionSet.problems.map((problem) => {
      const response = responses[problem.id] ?? {};
      const isCorrect = numericAnswerMatches(response.hour, problem.hour)
        && numericAnswerMatches(response.minute, problem.minute)
        && normalizeReading(response.reading ?? "") === normalizeReading(problem.reading);
      return [problem.id, isCorrect];
    })));
  }

  function resetAnswers() {
    setResponses({});
    setResults({});
  }

  function newSet() {
    if (completed && !window.confirm("쓴 답이 사라집니다. 새 문제를 만들까요?")) return;
    setQuestionSet(createProblemSet((Date.now() ^ questionSet.seed ^ Math.floor(Math.random() * 0xffffffff)) >>> 0));
    resetAnswers();
  }

  function printMaterials(mode: PrintMode) {
    setPrintMenuOpen(false);
    document.documentElement.dataset.printMode = mode;
    const clearPrintMode = () => delete document.documentElement.dataset.printMode;
    window.addEventListener("afterprint", clearPrintMode, { once: true });
    window.requestAnimationFrame(() => window.print());
  }

  function renderProblem(problem: ClockProblem, index: number, answerSheet: boolean) {
    const response = responses[problem.id] ?? {};
    const graded = problem.id in results;
    const isCorrect = results[problem.id] === true;
    return (
      <section className={`clock-question${graded ? isCorrect ? " is-correct" : " is-wrong" : ""}`} data-testid="clock-question" key={problem.id}>
        <b className="clock-question-number">{index + 1}</b>
        <ClockFace hour={problem.hour} minute={problem.minute} label={`${index + 1}번 시계`} />
        <div className="clock-answer-lines">
          <div className="clock-write-row">
            <strong>숫자 쓰기</strong>
            {answerSheet ? <b className="clock-static-number">{problem.hour}</b> : (
              <input className="clock-input clock-number-input" type="text" inputMode="numeric" pattern="[0-9]*" maxLength={2} value={response.hour ?? ""} onChange={(event) => updateResponse(problem.id, "hour", event.target.value)} aria-label={`${index + 1}번 시`} />
            )}
            <span>시</span>
            {answerSheet ? <b className="clock-static-number">{problem.minute}</b> : (
              <input className="clock-input clock-number-input" type="text" inputMode="numeric" pattern="[0-9]*" maxLength={2} value={response.minute ?? ""} onChange={(event) => updateResponse(problem.id, "minute", event.target.value)} aria-label={`${index + 1}번 분`} />
            )}
            <span>분</span>
          </div>
          <div className="clock-read-row">
            <strong>읽기</strong>
            {answerSheet ? <b className="clock-static-reading">{problem.reading}</b> : (
              <input className="clock-input clock-reading-input" type="text" maxLength={18} value={response.reading ?? ""} onChange={(event) => updateResponse(problem.id, "reading", event.target.value)} aria-label={`${index + 1}번 시각 읽기`} />
            )}
          </div>
        </div>
        {!answerSheet && graded && <span className={`counting-result ${isCorrect ? "correct" : "wrong"}`} role="status">{isCorrect ? "맞음" : "틀림"}</span>}
      </section>
    );
  }

  function renderSheet(answerSheet: boolean) {
    return (
      <div className="a4-sheet counting-sheet clock-sheet" style={{ transform: `scale(${sheetScale})` }}>
        <header className="counting-sheet-header">
          <div className="counting-sheet-title"><span>2학년</span><strong>시각 읽기와 쓰기{answerSheet ? " 정답" : ""}</strong></div>
          <div className="counting-sheet-info"><span>이름 <i /></span><span>날짜 <i /></span></div>
        </header>
        <div className="clock-grid">{questionSet.problems.map((problem, index) => renderProblem(problem, index, answerSheet))}</div>
      </div>
    );
  }

  useRecordQuestions("arithmetic/clock-1/page", {  });

  return (
    <main className="counting-page clock-page">
      <div className="counting-toolbar">
        <a className="counting-back" href="/arithmetic" aria-label="연산 목록으로 돌아가기">←</a>
        <div className="counting-progress"><strong>{correct}<small>/{PROBLEM_COUNT} 정답</small></strong></div>
        <div className="toolbar">
          <button className="button secondary" type="button" onClick={newSet}>새 문제</button>
          <button className="button ghost" type="button" onClick={resetAnswers}>다시 쓰기</button>
          <div className="print-control">
            <button className="button ghost print-button" type="button" aria-expanded={printMenuOpen} aria-haspopup="menu" onClick={() => setPrintMenuOpen((open) => !open)}>인쇄</button>
            {printMenuOpen && <div className="print-menu" role="menu" aria-label="인쇄 자료 선택">
              <button type="button" role="menuitem" onClick={() => printMaterials("worksheet")}>문제지만 인쇄</button>
              <button type="button" role="menuitem" onClick={() => printMaterials("answers")}>답지만 인쇄</button>
              <button type="button" role="menuitem" onClick={() => printMaterials("both")}>문제지+답지 인쇄</button>
            </div>}
          </div>
          <button className="button primary" type="button" onClick={checkAll}>전체 채점</button>
        </div>
      </div>
      <div className="a4-stage counting-a4-stage worksheet-stage" style={{ width: 794 * sheetScale, height: 1123 * sheetScale }} aria-label="A4 시계 문제지">{renderSheet(false)}</div>
      <div className="a4-stage counting-a4-stage answer-stage" style={{ width: 794 * sheetScale, height: 1123 * sheetScale }} aria-label="A4 시계 전체 답지">{renderSheet(true)}</div>
    </main>
  );
}
