"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { RaceAvatar, RaceBackdrop } from "../../components/arithmetic-race-scene";
import { RACE_DURATIONS, RACE_TEAM_COUNTS, RACE_TEAM_SIZES, RACE_TEAMS } from "../../../lib/arithmetic-race-teams";
import { rememberRaceHost, useRaceMusic } from "../../components/race-music";

type Race = { worksheetName: string; worksheetRoute: string; status: string; mode?: string; durationSeconds?: number | null; teamCount?: number | null; teamSize?: number | null };
type JoinState = { roomCode: string; participantId: string; participantToken: string; hostToken?: string; race: Race };
type Person = { id: string; name: string; avatarUrl?: string | null; team?: number | null };
type Board = { participants: Person[]; race: Race };

function normalizedPlayerName(value: string | null) {
  return String(value ?? "").trim().replace(/[^가-힣a-zA-Z0-9]/g, "").slice(0, 20);
}

export default function ArithmeticRaceJoinPage() {
  const [roomCode, setRoomCode] = useState("");
  const [name, setName] = useState("");
  const [joined, setJoined] = useState<JoinState | null>(null);
  const [board, setBoard] = useState<Board | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [entryRoom, setEntryRoom] = useState("");
  const [refresh, setRefresh] = useState(0);
  const [createRoute, setCreateRoute] = useState("");
  const joinedFromEntry = useRef("");
  const creatingRoom = useRef(false);
  const avatar = useRef<Promise<string | null> | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    // 순위표에 띄울 아바타. 학생은 학생 프로필, 선생님은 선생님 설정의 아바타. 둘 다 없으면(게스트) 이름만 보인다.
    const avatarOf = (path: string) => fetch(path, { cache: 'no-store', credentials: 'same-origin' })
      .then(response => response.ok ? response.json() : null)
      .then(data => (data as { profile?: { avatar?: { url?: string } } } | null)?.profile?.avatar?.url || null)
      .catch(() => null);
    avatar.current = avatarOf('/api/student/profile').then(url => url || avatarOf('/api/teacher/settings'));
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
    // 학습지 오른쪽 아래의 「🏁 순위전」은 ?worksheet= 로 온다. 묻지 않고 바로 방을 만든다.
    const worksheet = params.get("worksheet");
    if (!room && worksheet) { window.setTimeout(() => setCreateRoute(worksheet), 0); return; }
    if (!room || !/^\d{4}$|^\d{6}$/.test(room)) { window.location.replace("/arithmetic"); return; }
    if (!participantId || !participantToken) { setRoomCode(room); setEntryRoom(room); return; }
    window.setTimeout(() => {
      setRoomCode(room);
      setJoined({ roomCode: room, participantId, participantToken, hostToken, race: { worksheetName: "", worksheetRoute: "", status: "waiting" } });
    }, 0);
  }, []);

  const activeRoom = joined?.roomCode;
  const activeHost = joined?.hostToken;
  // 대기실 음악. 방장 기기에서만 기본으로 들린다.
  useRaceMusic("lobby", Boolean(activeHost));
  useEffect(() => { if (activeRoom) rememberRaceHost(activeRoom, Boolean(activeHost)); }, [activeRoom, activeHost]);
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
        if (data.participants) setBoard({ race: data.race, participants: data.participants });
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
  }, [activeRoom, activeHost, activeParticipant, activeToken, refresh]);

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

  // 방을 만들고 방장으로 들어간다. 이름은 학습 기록과 같은 계정 이름을 먼저 쓴다.
  useEffect(() => {
    if (!createRoute || creatingRoom.current) return;
    creatingRoom.current = true;
    void (async () => {
      setLoading(true);
      try {
        type Identity = { student?: { name?: string }; membership?: { studentName?: string }; guestName?: string; user?: { name?: string; email?: string } };
        const read = async (url: string): Promise<Identity | null> => {
          try {
            const response = await fetch(url, { cache: "no-store", credentials: "same-origin", signal: AbortSignal.timeout(5000) });
            return response.ok ? await response.json() : null;
          } catch { return null; }
        };
        const [me, context] = await Promise.all([read("/api/auth/me"), read("/api/learning-records/context")]);
        const playerName = normalizedPlayerName(context?.student?.name || me?.membership?.studentName || me?.guestName || me?.user?.name || null)
          || normalizedPlayerName(me?.user?.email?.split("@")[0] ?? null);
        if (!playerName) throw new Error("저장된 내 이름을 찾지 못했습니다. 메인 화면에서 이름을 먼저 정해 주세요.");
        const response = await fetch("/api/arithmetic-race", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ action: "create", worksheetRoute: createRoute, name: playerName, avatarUrl: await avatarUrl() }),
        });
        const data = await response.json() as { roomCode?: string; participantId?: string; participantToken?: string; hostToken?: string; race?: Race; error?: string };
        if (!response.ok || !data.roomCode || !data.participantId || !data.participantToken || !data.hostToken || !data.race) throw new Error(data.error || "방을 만들지 못했습니다.");
        setRoomCode(data.roomCode);
        saveSession({ roomCode: data.roomCode, participantId: data.participantId, participantToken: data.participantToken, hostToken: data.hostToken, race: data.race });
      } catch (cause) {
        setError(cause instanceof Error ? cause.message : "방을 만들지 못했습니다.");
      } finally {
        setLoading(false);
      }
    })();
  }, [createRoute, saveSession, avatarUrl]);

  useEffect(() => {
    if (!entryRoom || !name || joined || joinedFromEntry.current === entryRoom) return;
    joinedFromEntry.current = entryRoom;
    void joinRoom(entryRoom, name);
  }, [entryRoom, name, joined, joinRoom]);

  // 제한 시간·팀전 설정·팀 고르기·섞기. 바로 다시 불러와 화면에 반영한다.
  async function lobbyAction(body: Record<string, unknown>, failure = "팀을 바꾸지 못했습니다.") {
    if (!joined) return;
    setError("");
    try {
      const response = await fetch("/api/arithmetic-race", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ roomCode: joined.roomCode, hostToken: joined.hostToken, participantId: joined.participantId, participantToken: joined.participantToken, ...body }),
      });
      const data = await response.json() as { error?: string };
      if (!response.ok) throw new Error(data.error || failure);
      setRefresh((value) => value + 1);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : failure);
    }
  }

  async function startRace() {
    if (!joined?.hostToken) return;
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

  const teamCount = joined?.race.mode === "cards" ? joined.race.teamCount ?? null : null;
  const teamSize = teamCount ? joined?.race.teamSize ?? null : null;
  const myTeam = board?.participants.find((participant) => participant.id === joined?.participantId)?.team ?? null;
  // 다섯 팀부터는 대기실을 넓히고, 좁은 화면에서는 두 줄로 나눈다.
  const manyTeams = Boolean(board && teamCount && teamCount > 4);

  return (
    <main className={`portal-page race-entry-page math-race math-race-lobby${manyTeams ? " has-many-teams" : ""}`}>
      <RaceBackdrop />
      <div className="race-entry-shell">
        <a className="catalog-back" href="/arithmetic" aria-label="기초 연산 목록으로 돌아가기">←</a>
        {joined ? (
          <section className="race-waiting-card" aria-live="polite">
            <span>친구를 초대해요</span><strong className="race-room-code">{joined.roomCode}</strong>
            <h2>{joined.race.worksheetName || "학습지 확인 중"}</h2>
            {joined.race.mode === "cards" && joined.race.durationSeconds ? <p className="race-mode-note">{joined.hostToken ? null : <b>{joined.race.durationSeconds / 60}분</b>}<span>맞히면 +1 · 5연속부터 +2 · 10연속부터 +3 · 틀리면 −1 · 포기 −2{teamCount ? " · 팀 점수는 팀원 점수의 합" : ""}</span></p> : null}
            <div className="math-race-ready"><i aria-hidden="true" />{board ? `${board.participants.length}명 준비 완료` : "출발 준비 중"}</div>
            {joined.hostToken && joined.race.mode === "cards" ? <>
              <div className="math-race-team-setup math-race-time-setup" role="group" aria-label="제한 시간">
                {RACE_DURATIONS.map((seconds) => <button key={seconds} type="button" aria-pressed={joined.race.durationSeconds === seconds}
                  onClick={() => void lobbyAction({ action: "duration", durationSeconds: seconds }, "시간을 바꾸지 못했습니다.")}>{seconds / 60}분</button>)}
              </div>
              <div className="math-race-team-setup" role="group" aria-label="경기 방식">
                {[null, ...RACE_TEAM_COUNTS].map((count) => <button key={count ?? "solo"} type="button" aria-pressed={(joined.race.teamCount ?? null) === count}
                  onClick={() => void lobbyAction({ action: "teams", teamCount: count })}>{count ? `${count}팀` : "개인전"}</button>)}
                {teamCount ? <button type="button" className="math-race-shuffle" onClick={() => void lobbyAction({ action: "shuffle" })}>🔀 섞기</button> : null}
              </div>
              {teamCount ? <div className="math-race-team-setup" role="group" aria-label="한 팀 인원">
                {[null, ...RACE_TEAM_SIZES].map((size) => <button key={size ?? "free"} type="button" aria-pressed={teamSize === size}
                  onClick={() => void lobbyAction({ action: "teamSize", teamSize: size }, "한 팀 인원을 바꾸지 못했습니다.")}>{size ? `한 팀 ${size}명` : "인원 제한 없음"}</button>)}
              </div> : null}
            </> : null}
            {board && teamCount ? <>
              <div className="math-race-team-pick" style={{ "--teams": teamCount, "--wrap": teamCount > 4 ? Math.ceil(teamCount / 2) : teamCount } as CSSProperties}>
                {RACE_TEAMS.slice(0, teamCount).map((team, index) => {
                  const members = board.participants.filter((participant) => participant.team === index);
                  const mine = myTeam === index;
                  const full = teamSize !== null && members.length >= teamSize;
                  return <section key={team.name} className={`math-race-team-column${mine ? " is-mine" : ""}`} style={{ "--hue": team.hue } as CSSProperties}>
                    <button type="button" className="math-race-team-head" aria-pressed={mine} disabled={full && !mine} onClick={() => void lobbyAction({ action: "team", team: index })}>
                      <i aria-hidden="true">{team.emoji}</i><b>{team.name}</b><small>{teamSize ? `${members.length}/${teamSize}` : `${members.length}명`}</small>
                    </button>
                    <ul aria-label={`${team.name} 명단`}>{members.map((participant) => <li key={participant.id}><RaceAvatar {...participant} /><span>{participant.name}</span>{participant.id === joined.participantId ? <em>나</em> : null}</li>)}</ul>
                  </section>;
                })}
              </div>
              {board.participants.some((participant) => participant.team === null || participant.team === undefined) ? <p className="math-race-team-waiting">
                {myTeam === null ? "들어갈 팀을 눌러요. " : ""}아직 팀이 없는 {board.participants.filter((participant) => participant.team === null || participant.team === undefined).length}명은 출발할 때 사람이 적은 팀에 들어가요.
              </p> : null}
            </> : board ? <ul className="race-participant-list" aria-label="참가자 명단">
              {board.participants.map((participant, index) => <li key={participant.id} style={{ animationDelay: `${index * .07}s` }}>
                <RaceAvatar {...participant} /><span>{participant.name}</span>
                {participant.id === joined.participantId ? <span className="race-host-badge">{joined.hostToken ? "방장 · 나" : "나"}</span> : null}
              </li>)}
            </ul> : null}
            {joined.hostToken ? (
              <>
                <button className="math-race-start" type="button" onClick={startRace} disabled={loading || !(board?.participants.length ?? 1)}>{loading ? "준비 중…" : "🏁 출발!"}</button>
              </>
            ) : <strong className="math-race-wait-message">모두 모이면 함께 출발해요!</strong>}
          </section>
        ) : entryRoom ? (
          <section className="race-waiting-card" aria-live="polite">
            <span>방번호</span><strong className="race-room-code">{roomCode}</strong>
            {loading ? <p>입장 중…</p> : <button type="button" disabled={!name} onClick={() => void joinRoom(entryRoom, name)}>다시 입장</button>}
          </section>
        ) : createRoute && !error ? (
          <section className="race-waiting-card" aria-live="polite"><p>방을 만드는 중…</p></section>
        ) : null}
        {error && <p className="race-form-error" role="alert">{error}</p>}
      </div>
    </main>
  );
}
