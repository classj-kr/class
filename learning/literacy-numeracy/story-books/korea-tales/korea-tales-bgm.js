(() => {
    "use strict";

    const TRACK_INDEX_KEY = "classKoreaTalesBgmTrackIndex";
    const tracks = [
        "../assets/audio/moonlit-tale-house.ogg"
    ];
    const audio = document.getElementById("bgm");
    if (!audio || !tracks.length) return;

    const savedIndex = 0;
    let trackIndex = Number.isInteger(savedIndex) && savedIndex >= 0 && savedIndex < tracks.length
        ? savedIndex
        : 0;

    function selectTrack(index, shouldPlay = false) {
        trackIndex = (index + tracks.length) % tracks.length;
        audio.src = tracks[trackIndex];
        if (shouldPlay) audio.play().catch(() => {});
    }

    selectTrack(trackIndex);
    audio.addEventListener("ended", () => selectTrack(trackIndex + 1, true));
})();
