"use client";

import { useEffect } from "react";

export default function SharedSoundControls() {
  useEffect(() => {
    // The shared controls decorate the DOM, so load them after React hydrates it.
    // Keep the script across client navigation and Strict Mode effect replays.
    if (document.querySelector("script[data-arithmetic-settings]")) return;
    const script = document.createElement("script");
    script.src = "/assets/sound/music-control.js?v=20261105-settings-panel";
    script.dataset.sfxControls = "";
    script.dataset.arithmeticSettings = "";
    document.head.appendChild(script);
  }, []);

  return null;
}
