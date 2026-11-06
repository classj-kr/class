"use client";

import { useEffect } from "react";
import { isRaceScreen } from "./race-music";

export default function SharedSoundControls() {
  useEffect(() => {
    // The shared controls decorate the DOM, so load them after React hydrates it.
    // Keep the script across client navigation and Strict Mode effect replays.
    if (document.querySelector("script[data-arithmetic-settings]")) return;
    // 순위전 화면은 공용 순위전 음악을 먼저 붙여, 스피커가 그 음악을 맡게 한다.
    if (isRaceScreen()) {
      const music = document.createElement("script");
      music.src = "/assets/sound/race-music.js?v=20261106-1";
      music.async = false;
      document.head.appendChild(music);
    }
    const script = document.createElement("script");
    script.src = "/assets/sound/music-control.js?v=20261105-settings-panel";
    script.async = false;
    if (!isRaceScreen()) script.dataset.sfxControls = "";
    script.dataset.arithmeticSettings = "";
    document.head.appendChild(script);
  }, []);

  return null;
}
