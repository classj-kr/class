(() => {
    "use strict";

    const audio = document.getElementById("bgm");
    const tracks = ["assets/sound/jeongjo-banquet.ogg", "assets/sound/focus-time.ogg"];
    let index = Math.floor(Math.random() * tracks.length);

    audio.addEventListener("loadedmetadata", () => {
        // Start each track at its beginning after the shared controls restore saved positions.
        queueMicrotask(() => { audio.currentTime = 0; });
    });
    audio.addEventListener("ended", () => {
        index = (index + 1) % tracks.length;
        audio.src = tracks[index];
        audio.play().catch(() => {});
    });
    audio.src = tracks[index];
})();
