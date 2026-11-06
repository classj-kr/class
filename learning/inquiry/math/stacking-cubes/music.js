(() => {
  'use strict';
  // 쌓기나무 음악은 순위전 공용 곡(/assets/sound/race-music.js)을 쓴다. 보드게임 곡은 보드게임에서만 쓴다.
  // setSession(key): 연습·순위전이 진행 중이면 달리는 곡, 아니면 끈다.
  // setLobby(host): 순위전 방 만들기·대기·결과 화면. 방장 기기에서만 기본으로 들린다.
  let host = true;
  window.StackingMusic = {
    setSession(key, options = {}) {
      if (options.host !== undefined) host = options.host;
      window.RaceMusic?.set(key ? 'race' : null, { host });
    },
    setLobby(isHost = true) {
      host = isHost;
      window.RaceMusic?.set('lobby', { host });
    },
  };
})();
