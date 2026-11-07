(() => {
  "use strict";

  const tracks = [
    "/learning/games/beantrading/assets/sound/bohnanza-theme.ogg",
    "/learning/games/beantrading/assets/sound/nimble-syncopation-01.ogg",
    "/learning/games/beantrading/assets/sound/nimble-syncopation-02.ogg"
  ];
  const audio = document.getElementById("bgm");
  const savedSource = sessionStorage.getItem("classMusicPlaybackSource") || "";
  let index = Math.max(0, tracks.findIndex(track => savedSource.endsWith(track)));
  audio.src = tracks[index];

  audio.addEventListener("ended", () => {
    index = (index + 1) % tracks.length;
    // The shared controls remember a position for each track when navigating.
    // A new pass through the playlist starts at the beginning instead.
    audio.addEventListener("loadedmetadata", () => { audio.currentTime = 0; }, { once: true });
    audio.src = tracks[index];
    audio.play().catch(() => {});
  });
})();
