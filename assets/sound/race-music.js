/* 순위전 공용 음악.
   쓰는 법: RaceMusic.set('lobby' | 'race' | null, { host: true | false })
   - lobby: 방 만들기·대기·결과 화면. 한 곡을 반복한다.
   - race : 달리는 동안. 곡 모음에서 무작위로 이어 튼다.
   - 보드게임처럼 방장 기기에서만 기본으로 들린다. 참가자는 스피커 버튼으로 켤 수 있다.
   소리 크기·끄기는 사이트 공용 스피커(music-control.js)가 맡는다. 이 파일이 없으면 직접 불러온다. */
(function () {
  'use strict';
  if (window.RaceMusic) return;
  const base = (document.currentScript ? new URL('race-music/', document.currentScript.src) : new URL('/assets/sound/race-music/', location.href)).href;
  const LOBBY = 'lobby-brisk-pursuit.mp3';
  const POOL = [
    'gain-control.mp3', 'we-make-our-own-room-1.mp3', 'we-make-our-own-room-2.mp3',
    'glass-pulse-1.mp3', 'glass-pulse-2.mp3', 'glass-pulse-3.mp3', 'neon-pulse.mp3',
    'superlattice-beat.mp3', 'glossy-funk-groove.mp3', 'glossy-funk-future.mp3',
  ];
  let audio = null, mode = null, last = '', volume = 0.3, siteMuted = false, driven = false, ready = false, role = null, sentRole = null;
  try {
    const saved = Number(localStorage.getItem('classMusicVolumeValue'));
    if (saved > 0 && saved <= 1) volume = saved;
    siteMuted = ['1', 'true'].includes(localStorage.getItem('classMusicMuted'));
  } catch { /* 저장소를 못 쓰면 기본값 */ }

  function element() {
    if (audio) return audio;
    audio = document.querySelector('audio[data-race-music]');
    if (!audio) {
      audio = document.createElement('audio');
      audio.dataset.raceMusic = '';
      audio.preload = 'none';
      document.body.append(audio);
    }
    audio.addEventListener('ended', () => { if (mode === 'race') pick(); });
    audio.addEventListener('error', () => { if (mode === 'race') setTimeout(pick, 1500); });
    return audio;
  }
  // 참가자는 공용 스피커가 음소거 신호를 받기 전까지(또는 스피커가 없는 화면이면 계속) 꺼진 채로 둔다.
  const muted = () => siteMuted || (role === 'guest' && (!driven || sentRole !== 'guest'));
  function apply() {
    if (!audio) return;
    audio.volume = volume;
    audio.muted = muted();
    if (!mode || document.hidden || audio.muted) audio.pause();
    else if (audio.paused && audio.getAttribute('src')) audio.play().catch(() => {});
  }
  function pick() {
    const choices = POOL.filter((f) => f !== last);
    last = choices[Math.floor(Math.random() * choices.length)];
    load(last, false);
  }
  function load(file, loop) {
    const a = element();
    a.loop = loop;
    a.src = base + file;
    apply();
  }
  function announce() {
    if (!ready || role === sentRole) return;
    sentRole = role;
    // 보드게임과 같은 신호: 참가자는 잠시 음소거, 방장이 되면 원래대로.
    window.dispatchEvent(new CustomEvent(role === 'guest' ? 'classroommultiplayerjoined' : 'classroommultiplayerleft', { detail: { gameId: 'race' } }));
    apply();
  }

  window.ClassMusicController ??= {
    setVolume(v) { driven = true; volume = v; apply(); },
    setMuted(m) { driven = true; siteMuted = m; apply(); },
    unlock: apply,
  };
  window.RaceMusic = {
    set(next, { host = true } = {}) {
      role = next ? (host ? 'host' : 'guest') : null;
      announce();
      if (next === mode) return apply();
      mode = next;
      if (!mode) return apply();
      if (mode === 'lobby') load(LOBBY, true);
      else pick();
    },
  };

  // 공용 스피커는 페이지 load 때 저장된 설정을 다시 덮어쓴다. 그 뒤에 음소거 신호를 보내야 남는다.
  function markReady() {
    const go = () => setTimeout(() => { ready = true; announce(); }, 0);
    if (document.readyState === 'complete') go();
    else addEventListener('load', go, { once: true });
  }
  // 화면에 공용 스피커가 이미 있으면 그것을 쓰고(이 파일보다 아래에 있어도 된다), 없으면 불러온다.
  function connectSpeaker() {
    if (document.querySelector('script[src*="/assets/sound/music-control.js"]')) return markReady();
    const script = document.createElement('script');
    script.src = '/assets/sound/music-control.js?v=20261105-settings-panel';
    script.onload = markReady;
    document.head.append(script);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', connectSpeaker);
  else connectSpeaker();
  document.addEventListener('visibilitychange', apply);
  addEventListener('pointerdown', apply, { passive: true });
  addEventListener('keydown', apply);
})();
