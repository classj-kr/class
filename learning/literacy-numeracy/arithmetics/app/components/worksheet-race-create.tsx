"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { raceWorksheetByRoute } from "../../lib/arithmetic-worksheets";

// 순위전 바로 가기. 다른 학습 앱처럼 오른쪽 아래 학습 기록 단추 옆에 둔다.
// /assets/learning-records.js 가 a.race-link 를 기록 단추 줄로 옮기므로, React 가 그리지 않는 맨 DOM 으로 만든다.
// 누르면 대기실이 바로 방을 만들고, 제한 시간은 대기실에서 방장이 고른다.
export default function WorksheetRaceCreate() {
  const pathname = usePathname(), params = useSearchParams();
  const route = raceWorksheetByRoute(pathname.replace(/\/$/, ""))?.route ?? null;
  const inRace = params.has("race") || params.has("participantToken");

  useEffect(() => {
    if (!route || inRace) return;
    const link = document.createElement("a");
    link.className = "race-link";
    link.href = `/arithmetic/race?${new URLSearchParams({ worksheet: route })}`;
    link.textContent = "🏁 순위전";
    document.body.appendChild(link);
    // 기록 연결이 끝내 안 되어 옮겨지지 않았을 때만 같은 자리에 혼자 보인다.
    const fallback = window.setTimeout(() => { if (link.parentNode === document.body) link.classList.add("is-standalone"); }, 2500);
    return () => { window.clearTimeout(fallback); link.remove(); };
  }, [route, inRace]);

  return null;
}
