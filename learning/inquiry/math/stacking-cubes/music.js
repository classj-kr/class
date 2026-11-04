(() => {
  'use strict';
  const audio = document.getElementById('stacking-bgm');
  const tracks = ['fruitbell', 'lastcard', 'glass-pulse-01', 'glass-pulse-02', 'glass-pulse-03'];
  let session = null, previous = null, index = 0, failures = 0;
  audio.muted = true; // The shared speaker restores the user's preferences before playback.

  function play() {
    if (!session || document.hidden || audio.muted || !audio.volume || failures >= tracks.length) {
      audio.pause();
      return;
    }
    const src = '/api/stacking-race/music/' + tracks[index] + '.ogg';
    if (audio.getAttribute('src') !== src) audio.src = src;
    // A browser that blocks autoplay retries on the next classroom interaction.
    if (audio.paused) audio.play().catch(() => {});
  }

  function nextTrack() {
    index = (index + 1) % tracks.length;
    play();
  }
  audio.addEventListener('ended', nextTrack);
  audio.addEventListener('playing', () => { failures = 0; });
  audio.addEventListener('error', () => { if (session) { failures++; nextTrack(); } });
  window.addEventListener('online', () => { failures = 0; play(); });
  document.addEventListener('visibilitychange', play);
  window.addEventListener('pagehide', () => audio.pause());
  window.addEventListener('pageshow', play);
  document.addEventListener('click', play, true);
  document.addEventListener('keydown', play, true);

  window.ClassMusicController = {
    setVolume(volume) { audio.volume = volume; },
    setMuted(muted) { audio.muted = muted; play(); },
    unlock: play
  };
  window.StackingMusic = {
    setSession(key) {
      if (key === session) return;
      session = key;
      if (key && key !== previous) {
        // The teacher and students start each race with the same song.
        const seed = Array.from(key).reduce((sum, c) => sum + c.charCodeAt(0), 0);
        index = seed % tracks.length;
        previous = key; failures = 0;
        audio.pause();
        audio.currentTime = 0;
      }
      play();
    }
  };
})();
