"use client";

import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { raceReadyWorksheets } from "../../../lib/arithmetic-worksheets";
import { hasRaceCards, RACE_DURATIONS } from "../../../lib/race-cards";

type Race = { worksheetName: string; worksheetRoute: string; status: string; mode?: string; durationSeconds?: number | null };
type JoinState = { roomCode: string; participantId: string; participantToken: string; hostToken?: string; race: Race };
type Board = { participants: Array<{ id: string; name: string }>; race: Race };

function normalizedPlayerName(value: string | null) {
  return String(value ?? "").trim().replace(/[^가-힣a-zA-Z0-9]/g, "").slice(0, 20);
}

export default function ArithmeticRaceJoinPage() {
  const [roomCode, setRoomCode] = useState("");
  const [name, setName] = useState("");
  const [worksheetRoute, setWorksheetRoute] = useState(raceReadyWorksheets[0]?.route ?? "");
  const [durationSeconds, setDurationSeconds] = useState(180);
  const [joined, setJoined] = useState<JoinState | null>(null);
  const [board, setBoard] = useState<Board | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [entryRoom, setEntryRoom] = useState("");
  const joinedFromEntry = useRef("");
  const avatar = useRef<Promise<string | null> | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    // 순위표에 띄울 아바타. 학생 프로필이 없으면(교사·게스트) 이름만 보인다.
    avatar.current = fetch('/api/student/profile', { cache: 'no-store', credentials: 'same-origin' })
      .then(response => response.ok ? response.json() : null)
      .then(data => (data as { profile?: { avatar?: { url?: string } } } | null)?.profile?.avatar?.url || null)
      .catch(() => null);
    // 이름은 브라우저에 두지 않고 서버에 묻는다. 로그인(교사·학생)이나 게스트 입장에서 나온 이름을 먼저 쓰고,
    // 명단에 있는 학생이면 학습 기록과 같은 계정 이름으로 바꾼다.
    let rosterName = false;
    void fetch('/api/auth/me', { cache: 'no-store', credentials: 'same-origin' })
      .then(response => response.ok ? response.json() : null)
      .then(me => {
        const info = me as { membership?: { studentName?: string }; guestName?: string; user?: { name?: string; email?: string } } | null;
        // 이름이 없으면 구글 계정 앞부분을 쓴다.
        const candidate = normalizedPlayerName(info?.membership?.studentName || info?.guestName || info?.user?.name || null)
          || normalizedPlayerName(info?.user?.email?.split("@")[0] ?? null);
        if (candidate && !rosterName) setName(candidate);
      })
      .catch(() => {});
    void fetch('/api/learning-records/context', { cache: 'no-store', credentials: 'same-origin' })
      .then(response => response.ok ? response.json() : null)
      .then(context => {
        const student = normalizedPlayerName((context as { student?: { name?: string } } | null)?.student?.name ?? null);
        if (student) { rosterName = true; setName(student); }
      })
      .catch(() => {});

    const room = params.get("room");
    const participantId = params.get("participant");
    const participantToken = params.get("participantToken");
    const hostToken = params.get("hostToken") ?? undefined;
    if (!room || !/^\d{4}$|^\d{6}$/.test(room)) return;
    if (!participantId || !participantToken) { setRoomCode(room); setEntryRoom(room); return; }
    window.setTimeout(() => {
      setRoomCode(room);
      setJoined({ roomCode: room, participantId, participantToken, hostToken, race: { worksheetName: "", worksheetRoute: "", status: "waiting" } });
    }, 0);
  }, []);

  const activeRoom = joined?.roomCode;
  const activeHost = joined?.hostToken;
  const activeParticipant = joined?.participantId;
  const activeToken = joined?.participantToken;
  useEffect(() => {
    if (!activeRoom || !activeParticipant || !activeToken) return;
    let active = true;
    const check = async () => {
      try {
        const query = new URLSearchParams({ room: activeRoom });
        if (activeHost) query.set("hostToken", activeHost);
        else {
          query.set("participant", activeParticipant);
          query.set("participantToken", activeToken);
        }
        const response = await fetch(`/api/arithmetic-race?${query}`, { cache: "no-store" });
        const data = await response.json() as { race?: Race; participants?: Board["participants"]; error?: string };
        if (!response.ok || !data.race) throw new Error(data.error || "방 정보를 불러오지 못했습니다.");
        if (!active) return;
        setJoined((current) => current ? { ...current, race: data.race! } : current);
        if (activeHost && data.participants) setBoard({ race: data.race, participants: data.participants });
        if (data.race.status === "running") {
          const params = new URLSearchParams({ race: activeRoom, participant: activeParticipant, participantToken: activeToken });
          active = false;
          window.location.href = data.race.mode === "cards"
            ? `/arithmetic/race/play?${new URLSearchParams({ room: activeRoom, participant: activeParticipant, participantToken: activeToken })}`
            : `${data.race.worksheetRoute}?${params}`;
        }
      } catch (cause) {
        if (active) setError(cause instanceof Error ? cause.message : "방 정보를 불러오지 못했습니다.");
      }
    };
    void check();
    const poll = window.setInterval(check, 1500);
    return () => { active = false; window.clearInterval(poll); };
  }, [activeRoom, activeHost, activeParticipant, activeToken]);

  function requireName() {
    const playerName = normalizedPlayerName(name);
    if (!playerName) {
      setError("저장된 내 이름을 찾지 못했습니다. 메인 화면에서 이름을 먼저 정해 주세요.");
      return null;
    }
    return playerName;
  }

  // 아바타를 기다리느라 입장이 늦어지지 않게 잠깐만 기다린다.
  const avatarUrl = useCallback(() => Promise.race([
    avatar.current ?? Promise.resolve(null),
    new Promise<null>((resolve) => window.setTimeout(() => resolve(null), 1500)),
  ]), []);

  const saveSession = useCallback((next: JoinState) => {
    setJoined(next);
    const params = new URLSearchParams({ room: next.roomCode, participant: next.participantId, participantToken: next.participantToken });
    if (next.hostToken) params.set("hostToken", next.hostToken);
    window.history.replaceState(null, "", `/arithmetic/race?${params}`);
  }, []);

  const joinRoom = useCallback(async (code: string, playerName: string) => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/arithmetic-race", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "join", roomCode: code, name: playerName, avatarUrl: await avatarUrl() }),
      });
      const data = await response.json() as { participantId?: string; participantToken?: string; race?: Race; error?: string };
      if (!response.ok || !data.participantId || !data.participantToken || !data.race) throw new Error(data.error || "입장하지 못했습니다.");
      saveSession({ roomCode: code, participantId: data.participantId, participantToken: data.participantToken, race: data.race });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "입장하지 못했습니다.");
    } finally {
      setLoading(false);
    }
  }, [saveSession, avatarUrl]);

  useEffect(() => {
    if (!entryRoom || !name || joined || joinedFromEntry.current === entryRoom) return;
    joinedFromEntry.current = entryRoom;
    void joinRoom(entryRoom, name);
  }, [entryRoom, name, joined, joinRoom]);

  async function createRoom(event: FormEvent) {
    event.preventDefault();
    const playerName = requireName();
    if (!playerName) return;
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/arithmetic-race", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "create", worksheetRoute, name: playerName, durationSeconds, avatarUrl: await avatarUrl() }),
      });
      const data = await response.json() as { roomCode?: string; hostToken?: string; participantId?: string; participantToken?: string; race?: Race; error?: string };
      if (!response.ok || !data.roomCode || !data.hostToken || !data.participantId || !data.participantToken || !data.race) throw new Error(data.error || "방을 만들지 못했습니다.");
      saveSession({ roomCode: data.roomCode, hostToken: data.hostToken, participantId: data.participantId, participantToken: data.participantToken, race: data.race });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "방을 만들지 못했습니다.");
    } finally {
      setLoading(false);
    }
  }

  async function startRace() {
    if (!joined?.hostToken || !window.confirm("참가한 모두에게 문제를 시작할까요?")) return;
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/arithmetic-race", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "start", roomCode: joined.roomCode, hostToken: joined.hostToken }),
      });
      const data = await response.json() as { error?: string };
      if (!response.ok) throw new Error(data.error || "시작하지 못했습니다.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "시작하지 못했습니다.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="portal-page race-entry-page">
      <div className="race-entry-shell">
        <a className="catalog-back" href="/arithmetic" aria-label="기초 연산 목록으로 돌아가기">←</a>
        {joined ? (
          <section className="race-waiting-card" aria-live="polite">
            <span>방 코드</span><strong className="race-room-code">{joined.roomCode}</strong>
            <h2>{joined.race.worksheetName || "학습지 확인 중"}</h2>
            {joined.race.mode === "cards" && joined.race.durationSeconds ? <p className="race-mode-note">카드 순위전 · {joined.race.durationSeconds / 60}분 · 맞히면 +1, 넘기면 −1</p> : null}
            {joined.hostToken ? (
              <>
                <p>{board?.participants.length ?? 1}명 참가</p>
                {board ? (
                  <ul className="race-participant-list" aria-label="참가자 명단" role="list">
                    {board.participants.map((participant) => (
                      <li key={participant.id}>
                        <span>{participant.name}</span>
                        {participant.id === joined.participantId ? <span className="race-host-badge">방장 · 나</span> : null}
                      </li>
                    ))}
                  </ul>
                ) : <p>참가자 명단 불러오는 중…</p>}
                <button type="button" onClick={startRace} disabled={loading || !(board?.participants.length ?? 1)}>모두 시작</button>
                <small>방을 만든 사람이 시작합니다.</small>
              </>
            ) : <strong>방장이 시작하면 문제지로 바로 이동합니다.</strong>}
          </section>
        ) : entryRoom ? (
          <section className="race-waiting-card" aria-live="polite">
            <span>방번호</span><strong className="race-room-code">{roomCode}</strong>
            {loading ? <p>입장 중…</p> : <button type="button" disabled={!name} onClick={() => void joinRoom(entryRoom, name)}>다시 입장</button>}
          </section>
        ) : (
          <>
            <div className="race-entry-grid" style={{ gridTemplateColumns: 'minmax(0, 1fr)' }}>
              <form className="race-join-card race-create-card" onSubmit={createRoom}>
                <h2>순위전 열기</h2>
                <label>함께 풀 학습지<select value={worksheetRoute} onChange={(event) => setWorksheetRoute(event.target.value)}>{raceReadyWorksheets.map((worksheet) => <option value={worksheet.route} key={worksheet.route}>{worksheet.grade} · {worksheet.title}</option>)}</select></label>
                {hasRaceCards(worksheetRoute) ? (
                  <label>제한 시간<select value={durationSeconds} onChange={(event) => setDurationSeconds(Number(event.target.value))}>{RACE_DURATIONS.map((seconds) => <option value={seconds} key={seconds}>{seconds / 60}분</option>)}</select></label>
                ) : <small className="race-mode-note">이 학습지는 시험지 방식으로 진행합니다.</small>}
                <button type="submit" disabled={loading}>{loading ? "만드는 중" : "방 만들고 입장"}</button>
              </form>
            </div>
          </>
        )}
        {error && <p className="race-form-error" role="alert">{error}</p>}
      </div>
    </main>
  );
}
