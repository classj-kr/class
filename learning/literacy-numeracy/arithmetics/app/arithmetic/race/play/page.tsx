"use client";

import { FormEvent, ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { cardFields, raceCard, type RaceCard, type RaceField, type RacePart } from "../../../../lib/race-cards";

type Race = { roomCode: string; worksheetName: string; worksheetRoute: string; seed: number; status: string; startedAt: number | null; endsAt: number | null; durationSeconds: number | null };
type Me = { id: string; name: string; score: number; cardIndex: number; correctCount: number; wrongCount: number; skipCount: number; rank?: number | null };
type Entry = { id: string; name: string; score: number; correctCount: number; rank: number };
type Credentials = { room: string; participant: string; participantToken: string };
type Feedback = { kind: "correct" | "wrong" | "skip"; answer: string; key: number } | null;

// 사이트 공통 효과음(assets/sound/game-sfx.js). 없거나 꺼져 있으면 조용히 넘어간다.
function sound(name: "success" | "error" | "back" | "tick" | "timeout") {
  try { (window as unknown as { ClassGameSfx?: { play: (name: string) => void } }).ClassGameSfx?.play(name); } catch { /* 소리 없이 진행 */ }
}

function clock(milliseconds: number) {
  const seconds = Math.max(0, Math.ceil(milliseconds / 1000));
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

function cleanValue(field: RaceField, value: string) {
  if (field.kind === "text") return value.slice(0, 24);
  if (field.kind === "decimal") return value.replace(/[^\d.]/g, "").replace(/(\..*)\./g, "$1").slice(0, 10);
  return value.replace(/[^\d]/g, "").slice(0, 10);
}

export default function ArithmeticRaceCardsPage() {
  const [credentials, setCredentials] = useState<Credentials | null>(null);
  const [race, setRace] = useState<Race | null>(null);
  const [me, setMe] = useState<Me | null>(null);
  const [ranking, setRanking] = useState<Entry[]>([]);
  const [cardIndex, setCardIndex] = useState<number | null>(null);
  const [values, setValues] = useState<Record<string, string>>({});
  const [focused, setFocused] = useState("");
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [streak, setStreak] = useState(0);
  const [error, setError] = useState("");
  const [now, setNow] = useState(0);
  const offset = useRef(0);
  const inputs = useRef<Record<string, HTMLInputElement | null>>({});

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const room = params.get("room"), participant = params.get("participant"), participantToken = params.get("participantToken");
    const timer = window.setTimeout(() => {
      if (room && participant && participantToken) setCredentials({ room, participant, participantToken });
      else setError("입장 정보가 없습니다. 방번호로 다시 들어와 주세요.");
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const load = useCallback(async () => {
    if (!credentials) return;
    try {
      const query = new URLSearchParams({ room: credentials.room, participant: credentials.participant, participantToken: credentials.participantToken });
      const response = await fetch(`/api/arithmetic-race?${query}`, { cache: "no-store" });
      const data = await response.json() as { race?: Race; participant?: Me; ranking?: Entry[]; serverNow?: number; error?: string };
      if (!response.ok || !data.race) throw new Error(data.error || "방 정보를 불러오지 못했습니다.");
      if (data.serverNow) offset.current = data.serverNow - Date.now();
      setRace(data.race);
      setRanking(data.ranking ?? []);
      if (data.participant) {
        setMe(data.participant);
        setCardIndex((current) => current === null ? data.participant!.cardIndex : current);
      }
      setError("");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "방 정보를 불러오지 못했습니다.");
    }
  }, [credentials]);

  useEffect(() => {
    if (!credentials) return;
    const first = window.setTimeout(load, 0);
    const poll = window.setInterval(load, 1500);
    const tick = window.setInterval(() => setNow(Date.now() + offset.current), 200);
    return () => { window.clearTimeout(first); window.clearInterval(poll); window.clearInterval(tick); };
  }, [credentials, load]);

  const remaining = race?.endsAt ? race.endsAt - now : null;
  const finished = remaining !== null && now > 0 && remaining <= 0;
  const playing = race?.status === "running" && remaining !== null && remaining > 0;
  const secondsLeft = remaining !== null ? Math.ceil(remaining / 1000) : null;
  useEffect(() => {
    if (secondsLeft === null || race?.status !== "running") return;
    if (secondsLeft === 0) sound("timeout");
    else if (secondsLeft > 0 && secondsLeft <= 5) sound("tick");
  }, [secondsLeft, race?.status]);
  const card: RaceCard | null = race && cardIndex !== null ? raceCard(race.worksheetRoute, race.seed, cardIndex) : null;
  const fields = card && !card.choices ? cardFields(card) : [];
  const numericOnly = fields.length > 0 && fields.every((field) => field.kind !== "text");
  const hasDecimal = fields.some((field) => field.kind === "decimal");
  const complete = fields.length > 0 && fields.every((field) => (values[field.blank] ?? "").trim());
  const activeField = fields.find((field) => field.blank === focused) ?? fields[0];

  useEffect(() => {
    if (!playing || busy || !fields.length) return;
    const first = fields[0].blank;
    const timer = window.setTimeout(() => { setFocused(first); inputs.current[first]?.focus({ preventScroll: true }); }, 0);
    return () => window.clearTimeout(timer);
    // 카드가 바뀔 때만 첫 칸으로 간다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, busy, cardIndex]);

  async function send(skip: boolean, answers: Record<string, string> = values) {
    if (!credentials || !race || cardIndex === null || busy || !playing) return;
    setBusy(true);
    try {
      const response = await fetch("/api/arithmetic-race", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "card", roomCode: credentials.room, participantId: credentials.participant, participantToken: credentials.participantToken, cardIndex, answers, skip }),
      });
      const data = await response.json() as { outcome?: "correct" | "wrong" | "skip"; answer?: string; participant?: Me; error?: string };
      if (data.participant) setMe((current) => ({ ...current, ...data.participant! }));
      if (!response.ok || !data.outcome) {
        if (data.participant) { setCardIndex(data.participant.cardIndex); setValues({}); }
        if (data.error) setError(data.error);
        return;
      }
      setFeedback({ kind: data.outcome, answer: data.answer ?? "", key: Date.now() });
      sound(data.outcome === "correct" ? "success" : data.outcome === "wrong" ? "error" : "back");
      setStreak((current) => data.outcome === "correct" ? current + 1 : 0);
      // 틀렸을 때만 정답을 잠깐 보여 주고 넘어간다.
      if (data.outcome === "wrong") await new Promise((resolve) => window.setTimeout(resolve, 1100));
      setValues({});
      setCardIndex(data.participant?.cardIndex ?? cardIndex + 1);
    } catch {
      setError("연결이 불안정합니다. 다시 눌러 주세요.");
    } finally {
      setBusy(false);
    }
  }

  function moveOrSend() {
    const empty = fields.find((field) => !(values[field.blank] ?? "").trim());
    if (empty) { setFocused(empty.blank); inputs.current[empty.blank]?.focus(); return; }
    void send(false);
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    moveOrSend();
  }

  function press(key: string) {
    if (!activeField) return;
    if (key === "확인") return moveOrSend();
    const id = activeField.blank;
    setValues((current) => {
      const value = current[id] ?? "";
      const next = key === "⌫" ? value.slice(0, -1) : cleanValue(activeField, value + key);
      return { ...current, [id]: next };
    });
    inputs.current[id]?.focus({ preventScroll: true });
  }

  function renderPart(part: RacePart | undefined, key: string): ReactNode {
    if (part === undefined) return null;
    if (typeof part === "string") return <span key={key} className="card-race-text">{part}</span>;
    if ("br" in part) return <span key={key} className="card-race-break" />;
    if ("group" in part) return <span key={key} className="card-race-group">{part.group.map((piece, index) => renderPart(piece, `${key}.${index}`))}</span>;
    if ("svg" in part) return <span key={key} className="card-race-figure" dangerouslySetInnerHTML={{ __html: part.svg }} />;
    if ("fraction" in part) {
      return (
        <span key={key} className="card-race-mixed">
          {part.fraction.whole !== undefined && <span className="card-race-whole">{renderPart(part.fraction.whole, `${key}w`)}</span>}
          <span className="card-race-fraction">
            <span>{renderPart(part.fraction.numerator, `${key}n`)}</span>
            <span>{renderPart(part.fraction.denominator, `${key}d`)}</span>
          </span>
        </span>
      );
    }
    const id = part.blank;
    const wrong = busy && feedback?.kind === "wrong";
    return (
      <input
        key={key}
        ref={(element) => { inputs.current[id] = element; }}
        className={`card-race-answer${part.kind === "text" ? " is-text" : ""}`}
        style={part.width ? { width: `${part.width}em` } : undefined}
        value={values[id] ?? ""}
        onFocus={() => setFocused(id)}
        // 확인 버튼이 꺼져 있으면 Enter 제출이 막히므로 직접 다음 칸으로 보낸다.
        onKeyDown={(event) => { if (event.key === "Enter" && !event.nativeEvent.isComposing) { event.preventDefault(); moveOrSend(); } }}
        onChange={(event) => setValues((current) => ({ ...current, [id]: cleanValue(part, event.target.value) }))}
        inputMode={part.kind === "text" ? "text" : part.kind === "decimal" ? "decimal" : "numeric"}
        autoComplete="off"
        aria-label="답"
        readOnly={busy}
        data-wrong={wrong || undefined}
      />
    );
  }

  const myRank = ranking.find((entry) => entry.id === me?.id)?.rank ?? null;
  const top = ranking.slice(0, 5);
  const progress = race?.durationSeconds && remaining !== null ? Math.max(0, Math.min(1, remaining / (race.durationSeconds * 1000))) : 1;
  const keys = ["7", "8", "9", "4", "5", "6", "1", "2", "3", hasDecimal ? "." : "⌫", "0", hasDecimal ? "⌫" : "확인"];
  if (hasDecimal) keys.push("확인");

  if (finished && race) {
    return (
      <main className="portal-page card-race-page">
        <section className="card-race-result">
          <span>끝!</span>
          <h1>{myRank ? `${myRank}위` : "결과"}</h1>
          <p><b>{me?.score ?? 0}점</b> · 맞힘 {me?.correctCount ?? 0} · 틀림 {me?.wrongCount ?? 0} · 넘김 {me?.skipCount ?? 0}</p>
          <ol className="card-race-board final">
            {ranking.map((entry) => (
              <li key={entry.id} className={entry.id === me?.id ? "is-me" : ""}><em>{entry.rank}</em><span>{entry.name}</span><b>{entry.score}</b></li>
            ))}
          </ol>
          <a className="card-race-home" href="/arithmetic">기초 연산으로</a>
        </section>
      </main>
    );
  }

  return (
    <main className="portal-page card-race-page">
      <header className="card-race-top">
        <span className="card-race-room">방 {credentials?.room}</span>
        <strong className="card-race-score">{me?.score ?? 0}<small>점</small></strong>
        <time className={remaining !== null && remaining < 10000 ? "is-hurry" : ""}>{remaining !== null ? clock(remaining) : "--:--"}</time>
      </header>
      <div className="card-race-timebar" aria-hidden="true"><i style={{ transform: `scaleX(${progress})` }} /></div>

      <div className="card-race-layout">
        <section className="card-race-stage">
          {streak >= 3 && <p className="card-race-streak" key={streak}>🔥 {streak}연속</p>}
          {!playing ? (
            <div className="card-race-card waiting">{race?.status === "waiting" ? "방장이 시작하기를 기다리는 중" : "준비 중…"}</div>
          ) : card ? (
            <form key={cardIndex} className={`card-race-card${feedback?.kind === "wrong" && busy ? " is-wrong" : ""}`} onSubmit={submit}>
              <span className="card-race-number">#{(cardIndex ?? 0) + 1}</span>
              {card.prompt && <p className="card-race-prompt">{card.prompt}</p>}
              <div className={`card-race-question${fields.length >= 3 || card.parts.some((part) => typeof part === "object" && "svg" in part) ? " is-dense" : ""}`}>{card.parts.map((part, index) => renderPart(part, String(index)))}</div>
              {card.choices ? (
                <div className="card-race-choices">
                  {card.choices.map((choice) => (
                    <button type="button" key={choice} disabled={busy} onClick={() => void send(false, { choice })}
                      className={busy && feedback?.kind === "wrong" && feedback.answer === choice ? "is-answer" : ""}>{choice}</button>
                  ))}
                </div>
              ) : null}
              <div className="card-race-actions">
                <button type="button" className="card-race-skip" onClick={() => void send(true)} disabled={busy}>넘기기 −1</button>
                {!card.choices && <button type="submit" disabled={busy || !complete}>확인</button>}
              </div>
            </form>
          ) : null}
          {feedback && feedback.kind !== "wrong" && <p key={feedback.key} className={`card-race-pop ${feedback.kind}`}>{feedback.kind === "correct" ? "+1" : "−1"}</p>}
          {feedback && feedback.kind === "wrong" && busy && <p className="card-race-pop wrong">정답 {feedback.answer}</p>}
          {playing && numericOnly && (
            <div className="card-race-keypad" aria-label="숫자 패드">
              {keys.map((key) => <button type="button" key={key} onMouseDown={(event) => event.preventDefault()} onClick={() => press(key)} disabled={busy || (key === "확인" && !complete)} className={key === "확인" ? "ok" : ""}>{key}</button>)}
            </div>
          )}
        </section>

        <aside className="card-race-side" aria-label="실시간 순위">
          <h2>실시간 순위 {myRank ? <small>나 {myRank}위</small> : null}</h2>
          <ol className="card-race-board">
            {top.map((entry) => (
              <li key={entry.id} className={entry.id === me?.id ? "is-me" : ""}><em>{entry.rank}</em><span>{entry.name}</span><b>{entry.score}</b></li>
            ))}
          </ol>
          <p className="card-race-rule">맞히면 +1 · 틀리면 0 · 넘기면 −1</p>
        </aside>
      </div>
      {error && <p className="race-form-error" role="alert">{error}</p>}
    </main>
  );
}
