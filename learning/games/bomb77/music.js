(() => {
    "use strict";

    const TRACKS = Object.freeze([
        "/learning/games/bomb77/assets/sound/stone-road-time.m4a",
        "/learning/games/bomb77/assets/sound/midnight-pulse.m4a"
    ]);
    const INDEX_KEY = "bomb77MusicIndex";
    const audio = document.createElement("audio");
    audio.id = "bgm";
    // Leave room for the explosion when both sliders are at maximum.
    audio.dataset.musicGain = "0.7";
    audio.preload = "metadata";
    audio.playsInline = true;
    audio.setAttribute("aria-hidden", "true");
    document.body.appendChild(audio);

    let index = Math.max(0, Math.min(TRACKS.length - 1, Number(sessionStorage.getItem(INDEX_KEY)) || 0));
    let recovering = false;

    function loadTrack(nextIndex, { autoplay = false } = {}) {
        index = ((nextIndex % TRACKS.length) + TRACKS.length) % TRACKS.length;
        sessionStorage.setItem(INDEX_KEY, String(index));
        audio.src = TRACKS[index];
        audio.dataset.trackIndex = String(index);
        audio.load();
        if (autoplay) audio.play().catch(() => {});
    }

    audio.addEventListener("ended", () => loadTrack(index + 1, { autoplay: true }));
    audio.addEventListener("error", () => {
        if (recovering) return;
        recovering = true;
        loadTrack(index + 1, { autoplay: true });
        setTimeout(() => { recovering = false; }, 1000);
    });

    loadTrack(index);
    window.Bomb77Music = Object.freeze({ tracks: TRACKS, next: () => loadTrack(index + 1, { autoplay: true }) });
})();
