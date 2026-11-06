"use client";

import { useEffect } from "react";

// 순위전 공용 음악(/assets/sound/race-music.js). 대기 화면은 한 곡, 푸는 동안은 무작위 곡.
// 보드게임처럼 방장 기기에서만 기본으로 들린다.
type RaceMusicMode = "lobby" | "race" | null;
type RaceMusicApi = { set(mode: RaceMusicMode, options: { host: boolean }): void };

const HOST_KEY = "arithmetic-race-host-room";

export function isRaceScreen() {
  return location.pathname.startsWith("/arithmetic/race") || new URLSearchParams(location.search).has("race");
}

// 대기실에서 방장인지 기억해 두었다가, 문제 화면(새로 열린 쪽)에서도 같은 기본값을 쓴다.
export function rememberRaceHost(room: string, host: boolean) {
  try {
    if (host) sessionStorage.setItem(HOST_KEY, room);
    else if (sessionStorage.getItem(HOST_KEY) === room) sessionStorage.removeItem(HOST_KEY);
  } catch { /* 저장소를 못 쓰면 참가자로 본다 */ }
}

export function isRememberedHost(room: string | null | undefined) {
  try { return Boolean(room) && sessionStorage.getItem(HOST_KEY) === room; } catch { return false; }
}

export function useRaceMusic(mode: RaceMusicMode, host: boolean) {
  useEffect(() => {
    let timer = 0;
    const apply = () => {
      const music = (window as unknown as { RaceMusic?: RaceMusicApi }).RaceMusic;
      if (music) music.set(mode, { host });
      else if (mode && isRaceScreen()) timer = window.setTimeout(apply, 300); // 스크립트가 아직 불러와지는 중
    };
    apply();
    return () => window.clearTimeout(timer);
  }, [mode, host]);
}
