(() => {
    "use strict";
    const audio = document.getElementById("bgm");
    if (!audio) return;
    const tracks = [
        "assets/sound/royal-banquet.ogg",
        "assets/sound/wake-up-time.ogg"
    ];
    let index = Math.floor(Math.random() * tracks.length);
    let freshTrack = true;
    const select = () => {
        freshTrack = true;
        audio.src = new URL(tracks[index], document.baseURI).href;
        audio.load();
    };
    audio.addEventListener("loadeddata", () => {
        // A new round starts at the beginning even if the site remembers an old position.
        if (freshTrack) { audio.currentTime = 0; freshTrack = false; }
    });
    audio.addEventListener("ended", () => {
        index = (index + 1) % tracks.length;
        select();
        audio.play().catch(() => {});
    });
    select();
})();
