"use client";

import { useRecordedState, useRecordQuestions } from "@/app/components/learning-record-state";

import { useEffect, useMemo, useState } from "react";

type Friend = "토끼" | "거북이" | "호랑이";
type Counts = Record<Friend, number>;
type PrintMode = "worksheet" | "answers" | "both";
type ProblemSet = {
  seed: number;
  initial: Counts;
  first: { toTurtle: number; toTiger: number; after: Counts };
  second: { toTiger: number; fromRabbit: number; after: Counts };
  third: { fromRabbit: number; toTurtle: number; after: Counts; asked: Friend };
};

const INITIAL_SEED = 20260720;
const FRIENDS: Friend[] = ["토끼", "거북이", "호랑이"];

function random(seed: number) {
  let value = seed >>> 0;
  return () => {
    value += 0x6d2b79f5;
    let next = value;
    next = Math.imul(next ^ (next >>> 15), next | 1);
    next ^= next + Math.imul(next ^ (next >>> 7), next | 61);
    return ((next ^ (next >>> 14)) >>> 0) / 4294967296;
  };
}

function integer(next: () => number, minimum: number, maximum: number) {
  return minimum + Math.floor(next() * (maximum - minimum + 1));
}

function createProblemSet(seed: number): ProblemSet {
  const next = random(seed);
  const rabbitCards = integer(next, 7, 9);
  const initial: Counts = {
    토끼: rabbitCards,
    거북이: rabbitCards - integer(next, 3, 5),
    호랑이: integer(next, 1, 3),
  };

  const firstToSeulgi = integer(next, 1, 2);
  const firstToCourage = 1;
  const firstAfter: Counts = {
    토끼: initial.토끼 - firstToSeulgi - firstToCourage,
    거북이: initial.거북이 + firstToSeulgi,
    호랑이: initial.호랑이 + firstToCourage,
  };

  const secondToCourage = integer(next, 1, 2);
  const secondFromWisdom = integer(next, 1, 2);
  const secondAfter: Counts = {
    토끼: firstAfter.토끼 - secondFromWisdom,
    거북이: firstAfter.거북이 - secondToCourage + secondFromWisdom,
    호랑이: firstAfter.호랑이 + secondToCourage,
  };

  const thirdFromWisdom = integer(next, 1, 2);
  const thirdToSeulgi = integer(next, 1, 3);
  const thirdAfter: Counts = {
    토끼: secondAfter.토끼 - thirdFromWisdom,
    거북이: secondAfter.거북이 + thirdToSeulgi,
    호랑이: secondAfter.호랑이 + thirdFromWisdom - thirdToSeulgi,
  };

  return {
    seed,
    initial,
    first: { toTurtle: firstToSeulgi, toTiger: firstToCourage, after: firstAfter },
    second: { toTiger: secondToCourage, fromRabbit: secondFromWisdom, after: secondAfter },
    third: {
      fromRabbit: thirdFromWisdom,
      toTurtle: thirdToSeulgi,
      after: thirdAfter,
      asked: FRIENDS[integer(next, 0, 2)],
    },
  };
}

function fieldId(question: number, friend?: Friend) {
  return friend ? `q${question}-${friend}` : `q${question}`;
}

function emptyAnswers() {
  return Object.fromEntries([
    ...FRIENDS.map((friend) => fieldId(1, friend)),
    ...FRIENDS.map((friend) => fieldId(2, friend)),
    fieldId(3),
  ].map((id) => [id, ""]));
}

function ResultMark({ value }: { value?: boolean }) {
  if (value === undefined) return null;
  return <span className={`counting-result ${value ? "correct" : "wrong"}`} role="status">{value ? "맞음" : "틀림"}</span>;
}

export default function GiveAndTakeOnePage() {
  const [questionSet, setQuestionSet] = useRecordedState("arithmetic/give-and-take-1/page:questionSet", () => createProblemSet(INITIAL_SEED));
  const [answers, setAnswers] = useRecordedState<Record<string, string>>("arithmetic/give-and-take-1/page:answers", emptyAnswers);
  const [results, setResults] = useRecordedState<Record<number, boolean>>("arithmetic/give-and-take-1/page:results", {});
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

  const completed = useMemo(() => Object.values(answers).filter(Boolean).length, [answers]);
  const correct = Object.values(results).filter(Boolean).length;

  function updateAnswer(question: number, id: string, value: string) {
    setAnswers((current) => ({ ...current, [id]: value.replace(/[^0-9]/g, "").slice(0, 2) }));
    setResults((current) => {
      if (!(question in current)) return current;
      const next = { ...current };
      delete next[question];
      return next;
    });
  }

  function checkAll() {
    setResults({
      1: FRIENDS.every((friend) => Number(answers[fieldId(1, friend)]) === questionSet.first.after[friend]),
      2: FRIENDS.every((friend) => Number(answers[fieldId(2, friend)]) === questionSet.second.after[friend]),
      3: Number(answers[fieldId(3)]) === questionSet.third.after[questionSet.third.asked],
    });
  }

  function resetAnswers() {
    setAnswers(emptyAnswers());
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

  function answerBox(question: number, friend: Friend | undefined, answer: number, answerSheet: boolean) {
    const id = fieldId(question, friend);
    return answerSheet ? (
      <strong className="give-static-answer">{answer}</strong>
    ) : (
      <input
        className="give-answer-input"
        inputMode="numeric"
        pattern="[0-9]*"
        maxLength={2}
        value={answers[id]}
        onChange={(event) => updateAnswer(question, id, event.target.value)}
        aria-label={`${question}번${friend ? ` ${friend}` : ""} 답`}
      />
    );
  }

  function peopleAnswers(question: number, counts: Counts, answerSheet: boolean) {
    return (
      <div className="give-people-answers">
        {FRIENDS.map((friend) => (
          <label key={friend}>
            <span>{friend}</span>
            {answerBox(question, friend, counts[friend], answerSheet)}
            <small>장</small>
          </label>
        ))}
      </div>
    );
  }

  function renderSheet(answerSheet: boolean) {
    return (
      <div className="a4-sheet counting-sheet give-sheet" style={{ transform: `scale(${sheetScale})` }}>
        <header className="counting-sheet-header">
          <div className="counting-sheet-title">
            <span>1학년</span>
            <strong>주고받은 뒤의 수 구하기{answerSheet ? " 정답" : ""}</strong>
          </div>
          <div className="counting-sheet-info">
            <span>이름 <i /></span>
            <span>날짜 <i /></span>
            <small>문제지 {questionSet.seed}</small>
          </div>
        </header>

        <div className="give-sheet-body">
          <section className="give-intro">
            <h2>글을 읽고 물음에 답하시오. [1~3번]</h2>
            <p>
              토끼, 거북이, 호랑이는 카드 놀이를 하려고 합니다. 토끼는 카드를 <strong>{questionSet.initial.토끼}장</strong>,
              거북이는 <strong>{questionSet.initial.거북이}장</strong>, 호랑이는 <strong>{questionSet.initial.호랑이}장</strong> 가지고 있습니다.
            </p>
          </section>

          <section className={`give-question${results[1] === true ? " is-correct" : results[1] === false ? " is-wrong" : ""}`} data-testid="give-question">
            <span className="give-question-number">1</span>
            <p>첫 번째 놀이에서 토끼는 거북이에게 카드 <strong>{questionSet.first.toTurtle}장</strong>을 주고, 호랑이에게 카드 <strong>{questionSet.first.toTiger}장</strong>을 주었습니다.</p>
            <h3>세 친구가 가지고 있는 카드는 각각 몇 장입니까?</h3>
            {peopleAnswers(1, questionSet.first.after, answerSheet)}
            {!answerSheet && <ResultMark value={results[1]} />}
          </section>

          <section className={`give-question${results[2] === true ? " is-correct" : results[2] === false ? " is-wrong" : ""}`} data-testid="give-question">
            <span className="give-question-number">2</span>
            <p>두 번째 놀이에서 거북이는 호랑이에게 카드 <strong>{questionSet.second.toTiger}장</strong>을 주고, 토끼에게 카드 <strong>{questionSet.second.fromRabbit}장</strong>을 받았습니다.</p>
            <h3>세 친구가 가지고 있는 카드는 각각 몇 장입니까?</h3>
            {peopleAnswers(2, questionSet.second.after, answerSheet)}
            {!answerSheet && <ResultMark value={results[2]} />}
          </section>

          <section className={`give-question${results[3] === true ? " is-correct" : results[3] === false ? " is-wrong" : ""}`} data-testid="give-question">
            <span className="give-question-number">3</span>
            <p>세 번째 놀이에서 호랑이는 토끼에게 카드 <strong>{questionSet.third.fromRabbit}장</strong>을 받고, 거북이에게 카드 <strong>{questionSet.third.toTurtle}장</strong>을 주었습니다.</p>
            <h3>{questionSet.third.asked}가 가지고 있는 카드는 몇 장입니까?</h3>
            <div className="give-single-answer">
              {answerBox(3, undefined, questionSet.third.after[questionSet.third.asked], answerSheet)}
              <small>장</small>
            </div>
            {!answerSheet && <ResultMark value={results[3]} />}
          </section>
        </div>
      </div>
    );
  }

  useRecordQuestions("arithmetic/give-and-take-1/page", {  });

  return (
    <main className="counting-page give-page">
      <div className="counting-toolbar">
        <a className="counting-back" href="/arithmetic" aria-label="연산 목록으로 돌아가기">←</a>
        <div className="counting-progress"><strong>{correct}<small>/3 정답</small></strong></div>
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

      <div className="a4-stage counting-a4-stage worksheet-stage" style={{ width: 794 * sheetScale, height: 1123 * sheetScale }} aria-label="A4 주고받기 문제지">
        {renderSheet(false)}
      </div>
      <div className="a4-stage counting-a4-stage answer-stage" style={{ width: 794 * sheetScale, height: 1123 * sheetScale }} aria-label="A4 주고받기 전체 답지">
        {renderSheet(true)}
      </div>
    </main>
  );
}
