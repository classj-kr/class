(() => {
    "use strict";

    const TRACK_INDEX_KEY = "classIdiomsBgmTrackIndex";
    const tracks = [
        "assets/audio/paper-lantern-drift.ogg",
        "assets/audio/idiom-study-beat.ogg",
        "assets/audio/hanjabi-rainy-night.ogg"
    ];
    const audio = document.getElementById("bgm");
    if (!audio || !tracks.length) return;
    if (new URLSearchParams(location.search).has("record")) document.body.dataset.musicPausedForReading = "true";

    const savedIndex = 0;
    let trackIndex = Number.isInteger(savedIndex) && savedIndex >= 0 && savedIndex < tracks.length
        ? savedIndex
        : 0;

    function selectTrack(index, shouldPlay = false) {
        trackIndex = (index + tracks.length) % tracks.length;
        audio.src = tracks[trackIndex];
        if (shouldPlay && document.body.dataset.musicPausedForReading !== "true") audio.play().catch(() => {});
    }

    selectTrack(trackIndex);
    audio.addEventListener("ended", () => selectTrack(trackIndex + 1, true));
})();
