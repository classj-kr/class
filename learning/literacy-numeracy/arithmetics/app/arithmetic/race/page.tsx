"use client";

import { FormEvent, useEffect, useState } from "react";
import { raceReadyWorksheets } from "../../../lib/arithmetic-worksheets";

type Race = { worksheetName: string; worksheetRoute: string; status: string };
type JoinState = { roomCode: string; participantId: string; participantToken: string; hostToken?: string; race: Race };
type Board = { participants: Array<{ id: string; name: string }>; race: Race };

const PLAYER_NAME_KEY = "classPlayerName";

function normalizedPlayerName(value: string | null) {
  return String(value ?? "").trim().replace(/[^가-힣a-zA-Z0-9]/g, "").slice(0, 20);
}

export default function ArithmeticRaceJoinPage() {
  const [roomCode, setRoomCode] = useState("");
  const [name, setName] = useState("");
  const [worksheetRoute, setWorksheetRoute] = useState(raceReadyWorksheets[0]?.route ?? "");
  const [joined, setJoined] = useState<JoinState | null>(null);
  const [board, setBoard] = useState<Board | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    // 첫 화면에서 정한 이름(게스트·교사·학생 모두)을 먼저 쓰고, 명단에 있는 학생이면 학습 기록과
    // 같은 계정 이름으로 바꾼다. 계정 이름만 보면 교사와 게스트는 방을 만들 수 없다.
    const storedName = normalizedPlayerName(window.localStorage.getItem(PLAYER_NAME_KEY));
    if (storedName) setName(storedName);
    void fetch('/api/learning-records/context', { cache: 'no-store', credentials: 'same-origin' })
      .then(response => response.ok ? response.json() : null)
      .then(context => { const student = (context as { student?: { name?: string } } | null)?.student; if (student?.name) setName(normalizedPlayerName(student.name)); })
      .catch(() => { if (!storedName) setError('학생 계정의 이름을 불러오지 못했습니다. 다시 연결해 주세요.'); });

    const room = params.get("room");
    const participantId = params.get("participant");
    const participantToken = params.get("participantToken");
    const hostToken = params.get("hostToken") ?? undefined;
    if (!room || !participantId || !participantToken) return;
    window.setTimeout(() => {
      setRoomCode(room);
      setJoined({ roomCode: room, participantId, participantToken, hostToken, race: { worksheetName: "", worksheetRoute: "", status: "waiting" } });
    }, 0);
  }, []);

  useEffect(() => {
    if (!joined) return;
    let active = true;
    const check = async () => {
      try {
        const query = new URLSearchParams({ room: joined.roomCode });
        if (joined.hostToken) query.set("hostToken", joined.hostToken);
        else {
          query.set("participant", joined.participantId);
          query.set("participantToken", joined.participantToken);
        }
        const response = await fetch(`/api/arithmetic-race?${query}`, { cache: "no-store" });
        const data = await response.json() as { race?: Race; participants?: Board["participants"]; error?: string };
        if (!response.ok || !data.race) throw new Error(data.error || "방 정보를 불러오지 못했습니다.");
        if (!active) return;
        setJoined((current) => current ? { ...current, race: data.race! } : current);
        if (joined.hostToken && data.participants) setBoard({ race: data.race, participants: data.participants });
        if (data.race.status === "running") {
          const params = new URLSearchParams({ race: joined.roomCode, participant: joined.participantId, participantToken: joined.participantToken });
          window.location.href = `${data.race.worksheetRoute}?${params}`;
        }
      } catch (cause) {
        if (active) setError(cause instanceof Error ? cause.message : "방 정보를 불러오지 못했습니다.");
      }
    };
    void check();
    const poll = window.setInterval(check, 1500);
    return () => { active = false; window.clearInterval(poll); };
  }, [joined]);

  function requireName() {
    const playerName = normalizedPlayerName(name);
    if (!playerName) {
      setError("저장된 내 이름을 찾지 못했습니다. 메인 화면에서 이름을 먼저 정해 주세요.");
      return null;
    }
    return playerName;
  }

  function saveSession(next: JoinState) {
    setJoined(next);
    const params = new URLSearchParams({ room: next.roomCode, participant: next.participantId, participantToken: next.participantToken });
    if (next.hostToken) params.set("hostToken", next.hostToken);
    window.history.replaceState(null, "", `/arithmetic/race?${params}`);
  }

  async function join(event: FormEvent) {
    event.preventDefault();
    const playerName = requireName();
    if (!playerName) return;
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/arithmetic-race", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "join", roomCode, name: playerName }),
      });
      const data = await response.json() as { participantId?: string; participantToken?: string; race?: Race; error?: string };
      if (!response.ok || !data.participantId || !data.participantToken || !data.race) throw new Error(data.error || "입장하지 못했습니다.");
      saveSession({ roomCode, participantId: data.participantId, participantToken: data.participantToken, race: data.race });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "입장하지 못했습니다.");
    } finally {
      setLoading(false);
    }
  }

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
        body: JSON.stringify({ action: "create", worksheetRoute, name: playerName }),
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
            {joined.hostToken ? <><p>{board?.participants.length ?? 1}명 참가</p><button type="button" onClick={startRace} disabled={loading || !(board?.participants.length ?? 1)}>모두 시작</button><small>방을 만든 사람이 시작합니다.</small></> : <strong>방장이 시작하면 문제지로 바로 이동합니다.</strong>}
          </section>
        ) : (
          <>
            <div className="race-entry-grid race-boardgame-grid">
              <form className="race-join-card race-create-card" onSubmit={createRoom}>
                <span className="race-card-kicker">내가 방장</span><h2>방 만들기</h2>
                <label>함께 풀 학습지<select value={worksheetRoute} onChange={(event) => setWorksheetRoute(event.target.value)}>{raceReadyWorksheets.map((worksheet) => <option value={worksheet.route} key={worksheet.route}>{worksheet.grade} · {worksheet.title}</option>)}</select></label>
                <button type="submit" disabled={loading}>{loading ? "만드는 중" : "방 만들고 입장"}</button>
              </form>
              <form className="race-join-card" onSubmit={join}>
                <span className="race-card-kicker">친구 방</span><h2>방 참가</h2>
                <label>방 코드<input value={roomCode} onChange={(event) => setRoomCode(event.target.value.replace(/[^0-9]/g, "").slice(0, 6))} inputMode="numeric" maxLength={6} required /></label>
                <button type="submit" disabled={loading}>{loading ? "입장 중" : "입장"}</button>
              </form>
            </div>
          </>
        )}
        {error && <p className="race-form-error" role="alert">{error}</p>}
      </div>
    </main>
  );
}
