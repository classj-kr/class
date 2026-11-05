"use client";

import { CSSProperties, FormEvent, ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { cardFields, raceCard, type RaceCard, type RaceField, type RacePart } from "../../../../lib/race-cards";
import { RaceAvatar, RaceBackdrop, RaceLogo, RaceTrack, raceCue } from "../../../components/arithmetic-race-scene";

type Race = { roomCode: string; worksheetName: string; worksheetRoute: string; seed: number; status: string; startedAt: number | null; endsAt: number | null; durationSeconds: number | null };
type Me = { id: string; name: string; score: number; cardIndex: number; correctCount: number; wrongCount: number; skipCount: number; rank?: number | null };
type Entry = { id: string; name: string; score: number; correctCount: number; rank: number; avatarUrl?: string | null };
type Credentials = { room: string; participant: string; participantToken: string };
type Outcome = "correct" | "wrong" | "skip";
// play: 푸는 중, wrong: 흔들림, reveal: 포기해서 정답을 보여 줌, leave: 카드가 날아감
type Phase = "play" | "correct" | "wrong" | "reveal" | "leave";
type Flash = { text: string; kind: string; key: number } | null;

const POINTS: Record<Outcome, string> = { correct: "+1", wrong: "−1", skip: "−2" };
const MEDALS = ["🥇", "🥈", "🥉"];
const BURST_COLORS = ["#ff3d9a", "#ffe14d", "#4dff9a", "#27e1ff", "#b46bff", "#ff8a3d"];
// 색종이 조각의 방향과 거리. 매번 같아도 충분히 흩어져 보인다.
const BURST = Array.from({ length: 18 }, (_, index) => {
  const angle = (index / 18) * Math.PI * 2 + (index % 3) * 0.3;
  const distance = 90 + (index * 37) % 80;
  return { x: Math.round(Math.cos(angle) * distance), y: Math.round(Math.sin(angle) * distance), color: BURST_COLORS[index % BURST_COLORS.length], spin: (index * 73) % 360 };
});
const RAIN = Array.from({ length: 36 }, (_, index) => ({ left: (index * 29) % 100, delay: (index * 0.17) % 2.4, color: BURST_COLORS[index % BURST_COLORS.length], spin: (index * 47) % 360 }));

// 사이트 공통 효과음(assets/sound/game-sfx.js). 없거나 꺼져 있으면 조용히 넘어간다.
function sound(name: "success" | "error" | "back" | "tick" | "timeout" | "bell") {
  try { (window as unknown as { ClassGameSfx?: { play: (name: string) => void } }).ClassGameSfx?.play(name); } catch { /* 소리 없이 진행 */ }
}

function wait(milliseconds: number) {
  return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
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
  const [phase, setPhase] = useState<Phase>("play");
  const [reveal, setReveal] = useState("");
  const [pop, setPop] = useState<Flash>(null);
  const [burst, setBurst] = useState(0);
  const [banner, setBanner] = useState<Flash>(null);
  const [toast, setToast] = useState<Flash>(null);
  const [streak, setStreak] = useState(0);
  const [error, setError] = useState("");
  const [now, setNow] = useState(0);
  const [launch, setLaunch] = useState(false);
  const offset = useRef(0);
  const inputs = useRef<Record<string, HTMLInputElement | null>>({});
  const lastRank = useRef<number | null>(null);
  const wasCounting = useRef(false);
  const finishSoundPlayed = useRef(false);

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
      setNow(Date.now() + offset.current);
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
  const countdown = race?.status === "running" && race.startedAt && now > 0 && now < race.startedAt
    ? Math.min(3, Math.ceil((race.startedAt - now) / 1000)) : null;
  const playing = race?.status === "running" && now > 0 && countdown === null && remaining !== null && remaining > 0;
  useEffect(() => {
    if (countdown !== null) { wasCounting.current = true; raceCue("count"); return; }
    if (!playing || !wasCounting.current) return;
    wasCounting.current = false;
    setLaunch(true); raceCue("go");
    const timer = window.setTimeout(() => setLaunch(false), 900);
    return () => window.clearTimeout(timer);
  }, [countdown, playing]);
  useEffect(() => {
    if (finished && !finishSoundPlayed.current) { finishSoundPlayed.current = true; raceCue("victory"); }
  }, [finished]);
  const secondsLeft = remaining !== null ? Math.ceil(remaining / 1000) : null;
  useEffect(() => {
    if (secondsLeft === null || race?.status !== "running") return;
    if (secondsLeft > 0 && secondsLeft <= 5) sound("tick");
  }, [secondsLeft, race?.status]);

  const myRank = ranking.find((entry) => entry.id === me?.id)?.rank ?? null;
  // 순위가 오르면 위에서 알림을 내린다.
  useEffect(() => {
    const previous = lastRank.current;
    lastRank.current = myRank;
    if (!playing || previous === null || myRank === null || myRank >= previous) return;
    const timer = window.setTimeout(() => {
      setToast({ text: myRank === 1 ? "👑 선두로 올라섰어요!" : `⬆ ${myRank}위로 추월!`, kind: "up", key: Date.now() });
      raceCue("rank");
    }, 0);
    return () => window.clearTimeout(timer);
  }, [myRank, playing]);

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
    // 카드가 바뀌거나 틀려서 다시 풀 때 첫 칸으로 간다.
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
      const data = await response.json() as { outcome?: Outcome; answer?: string; participant?: Me; error?: string };
      if (data.participant) setMe((current) => ({ ...current, ...data.participant! }));
      if (!response.ok || !data.outcome) {
        if (data.participant) { setCardIndex(data.participant.cardIndex); setValues({}); }
        if (data.error) setError(data.error);
        return;
      }
      const outcome = data.outcome;
      setError("");
      void load();
      const next = data.participant?.cardIndex ?? (outcome === "wrong" ? cardIndex : cardIndex + 1);
      setPop({ text: POINTS[outcome], kind: outcome, key: Date.now() });

      if (outcome === "wrong") {
        // 틀리면 1점을 잃고 같은 카드를 다시 푼다.
        sound("error");
        setStreak(0);
        setPhase("wrong");
        setValues({});
        await wait(450);
        setPhase("play");
        return;
      }

      if (outcome === "correct") {
        sound("success");
        setPhase("correct");
        setBurst(Date.now());
        const streakNow = streak + 1;
        setStreak(streakNow);
        if (streakNow % 5 === 0) {
          setBanner({ text: `🔥 ${streakNow}연속!`, kind: streakNow >= 10 ? "mega" : "combo", key: Date.now() });
          sound("bell");
        }
        await wait(120);
      } else {
        // 포기: 2점을 잃고 카드를 뒤집어 정답을 보여 준 뒤 넘어간다.
        sound("back");
        setStreak(0);
        setReveal(data.answer ?? "");
        setPhase("reveal");
        await wait(1100);
      }
      setPhase("leave");
      await wait(outcome === "correct" ? 220 : 260);
      setValues({});
      setReveal("");
      setCardIndex(next);
      setPhase("play");
    } catch {
      setError("연결이 불안정합니다. 다시 눌러 주세요.");
      setPhase("play");
    } finally {
      setBusy(false);
    }
  }

  function moveOrSend() {
    const empty = fields.find((field) => !(values[field.blank] ?? "").trim());
    if (empty) { setFocused(empty.blank); inputs.current[empty.blank]?.focus({ preventScroll: true }); return; }
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
      />
    );
  }

  const row = (entry: Entry) => (
    <li key={entry.id} className={entry.id === me?.id ? "is-me" : ""}>
      <em>{entry.rank <= 3 ? MEDALS[entry.rank - 1] : entry.rank}</em>
      {entry.avatarUrl
        ? <img className="card-race-avatar" src={entry.avatarUrl} alt="" width={32} height={32} />
        : <i className="card-race-avatar" aria-hidden="true">{entry.name.slice(0, 1)}</i>}
      <span>{entry.name}</span><b>{entry.score}</b>
    </li>
  );
  const progress = race?.durationSeconds && remaining !== null ? Math.max(0, Math.min(1, remaining / (race.durationSeconds * 1000))) : 1;
  const keys = ["7", "8", "9", "4", "5", "6", "1", "2", "3", hasDecimal ? "." : "⌫", "0", hasDecimal ? "⌫" : "확인"];
  if (hasDecimal) keys.push("확인");
  const score = me?.score ?? 0;

  if (finished && race) {
    const podium = [ranking[1], ranking[0], ranking[2]];
    return (
      <main className="portal-page card-race-page math-race is-finished">
        <RaceBackdrop /><RaceLogo compact />
        {(
          <div className="card-race-rain" aria-hidden="true">
            {RAIN.map((piece, index) => <i key={index} style={{ left: `${piece.left}%`, animationDelay: `${piece.delay}s`, background: piece.color, rotate: `${piece.spin}deg` }} />)}
          </div>
        )}
        <section className="card-race-result">
          <span>{myRank === 1 ? "멋진 질주였어요!" : "끝까지 해냈어요!"}</span>
          <h2>{myRank ? `${myRank <= 3 ? MEDALS[myRank - 1] + " " : ""}${myRank}위` : "결과"}</h2>
          <p><b className={score < 0 ? "is-negative" : ""}>{score}점</b> · 맞힘 {me?.correctCount ?? 0} · 틀림 {me?.wrongCount ?? 0} · 포기 {me?.skipCount ?? 0}</p>
          <div className="card-race-podium" aria-label="1·2·3위">
            {podium.map((entry, index) => entry ? (
              <div key={entry.id} className={`step step-${entry.rank}${entry.id === me?.id ? " is-me" : ""}`} style={{ animationDelay: `${[0.3, 0.6, 0][index]}s` }}>
                <span className="medal">{MEDALS[entry.rank - 1]}</span>
                <RaceAvatar {...entry} />
                <strong>{entry.name}</strong>
                <b>{entry.score}점</b>
                <i>{entry.rank}</i>
              </div>
            ) : <div key={index} className="step empty" />)}
          </div>
          <ol className="card-race-board final">
            {ranking.slice(3).map(row)}
          </ol>
          <a className="card-race-home" href="/arithmetic">기초 연산으로</a>
        </section>
      </main>
    );
  }

  return (
    <main className={`portal-page card-race-page math-race${phase === "wrong" ? " is-shaking" : ""}${streak >= 5 ? " is-fever" : ""}`}>
      <RaceBackdrop /><RaceLogo compact />
      <p className="math-race-context">{race?.worksheetName || "경기 준비 중"}</p>
      <header className="card-race-top">
        <div className="math-race-stat"><span>내 순위</span><strong className="math-race-rank">{myRank ? `${myRank}위` : "—"}</strong><small>방 {credentials?.room}</small></div>
        <div className="math-race-stat"><span>내 점수</span><strong key={`score-${score}`} className={`card-race-score${score < 0 ? " is-negative" : ""}`}>{score}<small>점</small></strong></div>
        <div className={`math-race-stat math-race-combo${streak >= 5 ? " is-hot" : ""}`}><span>연속 정답</span><strong key={streak}>{streak}<small>콤보</small></strong><div aria-hidden="true">{[1, 2, 3, 4, 5].map(value => <i key={value} className={value <= (streak ? (streak - 1) % 5 + 1 : 0) ? "on" : ""} />)}</div></div>
        <div className="math-race-stat"><span>남은 시간</span><time className={playing && remaining < 10000 ? "is-hurry" : ""}>{remaining !== null ? clock(Math.min(remaining, (race?.durationSeconds ?? 0) * 1000)) : "--:--"}</time></div>
      </header>
      <div className={`card-race-timebar${remaining !== null && remaining < 10000 ? " is-hurry" : ""}`} aria-hidden="true"><i style={{ transform: `scaleX(${progress})` }} /></div>

      {toast && <p key={`toast-${toast.key}`} className="card-race-toast" role="status" onAnimationEnd={() => setToast(null)}>{toast.text}</p>}
      {banner && <p key={`banner-${banner.key}`} className={`card-race-banner ${banner.kind}`} aria-hidden="true" onAnimationEnd={() => setBanner(null)}>{banner.text}</p>}
      {(countdown !== null || launch) && <div className={`math-race-countdown${launch ? " is-go" : ""}`} role="status"><span>{launch ? "달려볼까요?" : "손을 준비해요"}</span><strong key={countdown ?? "go"}>{countdown ?? "GO!"}</strong></div>}

      <div className="card-race-layout">
        <section className="card-race-stage">
          {/* 같은 자리의 형제끼리 key 가 겹치면(4연속과 4번 카드) 지난 표시가 남아 쌓이므로 이름을 붙여 구분한다. */}
          {!playing ? (
            <div className="card-race-card waiting"><span className="math-race-ready-symbol" aria-hidden="true">＋</span>{countdown !== null ? "곧 출발해요!" : race?.status === "waiting" ? "친구들을 기다리는 중" : "준비 중…"}</div>
          ) : card ? (
            <form key={`card-${cardIndex}`} className={`card-race-card phase-${phase}`} onSubmit={submit}>
              <span className="card-race-number">{(cardIndex ?? 0) + 1}번째 미션</span>
              {card.prompt && <p className="card-race-prompt">{card.prompt}</p>}
              <div className={`card-race-question${fields.length >= 3 || card.parts.some((part) => typeof part === "object" && "svg" in part) ? " is-dense" : ""}`}>{card.parts.map((part, index) => renderPart(part, String(index)))}</div>
              {card.choices ? (
                <div className="card-race-choices">
                  {card.choices.map((choice) => (
                    <button type="button" key={choice} disabled={busy} onClick={() => void send(false, { choice })}>{choice}</button>
                  ))}
                </div>
              ) : null}
              <div className="card-race-actions">
                <button type="button" className="card-race-skip" onClick={() => void send(true)} disabled={busy}>포기 −2</button>
                {!card.choices && <button type="submit" disabled={busy || !complete}>확인</button>}
              </div>
              {phase === "reveal" && (
                <div className="card-race-reveal" aria-live="polite"><span>정답</span><strong>{reveal}</strong></div>
              )}
            </form>
          ) : null}
          {burst > 0 && (
            <div key={`burst-${burst}`} className="card-race-burst" aria-hidden="true">
              {BURST.map((piece, index) => <i key={index} style={{ "--x": `${piece.x}px`, "--y": `${piece.y}px`, background: piece.color, rotate: `${piece.spin}deg` } as CSSProperties} />)}
            </div>
          )}
          {pop && <p key={`pop-${pop.key}`} className={`card-race-pop ${pop.kind}`} onAnimationEnd={() => setPop(null)}>{pop.text}</p>}
          {playing && numericOnly && (
            <div className="card-race-keypad" aria-label="숫자 패드">
              {keys.map((key) => <button type="button" key={key} onMouseDown={(event) => event.preventDefault()} onClick={() => press(key)} disabled={busy || (key === "확인" && !complete)} className={key === "확인" ? "ok" : ""}>{key}</button>)}
            </div>
          )}
        </section>

        <aside className="card-race-side" aria-label="실시간 순위">
          <RaceTrack entries={ranking} myId={me?.id} playing={playing} />
          <p className="math-race-chase">{myRank === 1 ? "👑 선두를 달리는 중!" : myRank && ranking[0] ? `선두까지 ${Math.max(0, ranking[0].score - score)}점! 한 문제씩 따라가요.` : "정답을 맞힐수록 앞으로!"}</p>
          <p className="card-race-rule">맞히면 +1 · 틀리면 −1 · 포기 −2</p>
        </aside>
      </div>
      {error && <p className="race-form-error" role="alert">{error}</p>}
    </main>
  );
}
