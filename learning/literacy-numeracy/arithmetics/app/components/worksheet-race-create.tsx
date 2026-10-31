"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { usePathname, useSearchParams } from "next/navigation";
import { raceWorksheetByRoute } from "../../lib/arithmetic-worksheets";
import { hasRaceCards, RACE_DURATIONS } from "../../lib/race-cards";

function playerName(value: unknown) {
  return String(value ?? "").trim().replace(/[^가-힣a-zA-Z0-9]/g, "").slice(0, 20);
}

export default function WorksheetRaceCreate() {
  const pathname = usePathname(), params = useSearchParams();
  const worksheet = raceWorksheetByRoute(pathname.replace(/\/$/, ""));
  const inRace = params.has("race") || params.has("participantToken");
  const [toolbar, setToolbar] = useState<Element | null>(null);
  const [duration, setDuration] = useState(180);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const creating = useRef(false);

  useEffect(() => {
    setToolbar(null);
    if (!worksheet || inRace) return;
    const locate = () => setToolbar(document.querySelector(".counting-toolbar .toolbar, .counting-toolbar"));
    locate();
    const observer = new MutationObserver(locate);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [pathname, worksheet, inRace]);

  async function create() {
    if (!worksheet || creating.current) return;
    creating.current = true; setBusy(true); setError("");
    try {
      type Identity = {student?: {name?: string}; membership?: {studentName?: string}; guestName?: string; user?: {name?: string; email?: string}; profile?: {avatar?: {url?: string}}};
      const read = async (url: string): Promise<Identity | null> => {
        try {
          const response = await fetch(url, { cache: "no-store", credentials: "same-origin", signal: AbortSignal.timeout(5000) });
          return response.ok ? await response.json() : null;
        } catch { return null; }
      };
      const [me, context, profile] = await Promise.all([
        read("/api/auth/me"), read("/api/learning-records/context"), read("/api/student/profile"),
      ]);
      const name = playerName(context?.student?.name || me?.membership?.studentName || me?.guestName || me?.user?.name)
        || playerName(me?.user?.email?.split("@")[0]);
      if (!name) throw new Error("저장된 내 이름을 찾지 못했습니다. 메인 화면에서 이름을 먼저 정해 주세요.");
      const response = await fetch("/api/arithmetic-race", {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "create", worksheetRoute: worksheet.route, name,
          durationSeconds: duration, avatarUrl: profile?.profile?.avatar?.url || null }),
      });
      const data = await response.json() as {roomCode?: string; participantId?: string; participantToken?: string; hostToken?: string; error?: string};
      if (!response.ok || !data.roomCode || !data.participantId || !data.participantToken || !data.hostToken)
        throw new Error(data.error || "방을 만들지 못했습니다.");
      const query = new URLSearchParams({ room: data.roomCode, participant: data.participantId,
        participantToken: data.participantToken, hostToken: data.hostToken });
      window.location.assign(`/arithmetic/race?${query}`);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "방을 만들지 못했습니다.");
      creating.current = false; setBusy(false);
    }
  }

  if (!worksheet || inRace || !toolbar) return null;
  return <>
    {createPortal(
    <button ref={trigger} className="button secondary worksheet-race-trigger" type="button"
      onClick={() => { setError(""); dialog.current?.showModal(); }}>순위전 만들기</button>, toolbar)}
    <dialog ref={dialog} className="worksheet-race-dialog" aria-labelledby="worksheet-race-title"
      onCancel={event => { if (busy) event.preventDefault(); }} onClose={() => trigger.current?.focus()}>
      <form onSubmit={event => { event.preventDefault(); void create(); }}>
        <h2 id="worksheet-race-title">순위전 만들기</h2>
        <p>{worksheet.grade} · {worksheet.title}</p>
        {hasRaceCards(worksheet.route) ? <label>제한 시간<select value={duration}
          disabled={busy} onChange={event => setDuration(Number(event.target.value))}>
          {RACE_DURATIONS.map(seconds => <option key={seconds} value={seconds}>{seconds / 60}분</option>)}
        </select></label> : <p>이 학습지의 문제를 함께 풀어요.</p>}
        {error && <p role="alert">{error}</p>}
        <div className="toolbar"><button type="button" className="button ghost" disabled={busy}
          onClick={() => dialog.current?.close()}>취소</button>
          <button type="submit" className="button primary" disabled={busy}>{busy ? "만드는 중…" : "방 만들고 입장"}</button></div>
      </form>
    </dialog>
  </>;
}
