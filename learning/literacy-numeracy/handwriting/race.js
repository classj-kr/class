(async function () {
  'use strict';
  const $ = (id) => document.getElementById(id),
    A = window.HandwritingApp;
  const initialCode = new URLSearchParams(location.search).get('room') || '';
  const roomOnly = location.pathname.includes('/race') || Boolean(initialCode);
  if (!roomOnly) return;
  document.body.classList.add('room-only');
  document.body.dataset.roomPhase = 'entry';
  $('roomPanel').hidden = false;
  $('raceBar').hidden = false;

  // ── 공용 소리: 효과음, 순위전 음악(대기 한 곡·쓰는 동안 무작위), 스피커(규칙은 스피커 설정 안에) ──
  function addScript(src, data = {}) {
    const script = document.createElement('script');
    script.src = src;
    script.async = false; // 넣은 차례대로 실행(음악 → 스피커)
    Object.entries(data).forEach(([k, v]) => (script.dataset[k] = v));
    document.head.append(script);
    return script;
  }
  if (!window.ClassGameSfx && !document.querySelector('script[data-class-game-sfx]'))
    addScript('/assets/sound/game-sfx.js?v=20261009-explosion-file', { classGameSfx: 'true' });
  let musicWanted = ['lobby', true];
  const musicScript = addScript('/assets/sound/race-music.js?v=20261106-1');
  if (!document.querySelector('script[src*="/assets/sound/music-control.js"]'))
    addScript('/assets/sound/music-control.js?v=20261105-settings-panel', { settingsHelp: 'raceHelp' });
  const playMusic = (kind, host = true) => {
    musicWanted = [kind, host];
    window.RaceMusic?.set(kind, { host });
  };
  musicScript.onload = () => playMusic(...musicWanted);

  // ── 바탕: 수묵 산·안개·학·매화 ──
  const scene = document.createElement('div');
  scene.className = 'race-scene';
  scene.setAttribute('aria-hidden', 'true');
  scene.innerHTML = `
    <i class="sun"></i>
    <svg class="branch" viewBox="0 0 300 150"><path d="M0 18 C60 22 90 40 140 44 S220 70 292 62 M118 42 C130 70 160 84 190 96 M210 66 C222 44 240 34 262 26" fill="none" stroke="#3a2f27" stroke-width="5" stroke-linecap="round"/>
      ${[[70, 28], [132, 46], [168, 88], [196, 98], [232, 70], [258, 30], [286, 60], [100, 36]].map(([x, y], i) => `<g class="bloom" style="animation-delay:${-i * 0.5}s"><circle cx="${x}" cy="${y}" r="9" fill="#f6b8c4"/><circle cx="${x}" cy="${y}" r="3.4" fill="#e0607a"/></g>`).join('')}</svg>
    <svg class="hills" viewBox="0 0 1200 300" preserveAspectRatio="none">
      <defs>
        <linearGradient id="hwFar" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#77736b" stop-opacity=".42"/><stop offset=".75" stop-color="#77736b" stop-opacity="0"/></linearGradient>
        <linearGradient id="hwMid" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#46433d" stop-opacity=".5"/><stop offset=".8" stop-color="#46433d" stop-opacity=".02"/></linearGradient>
        <linearGradient id="hwNear" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a2824" stop-opacity=".42"/><stop offset="1" stop-color="#2a2824" stop-opacity=".12"/></linearGradient>
      </defs>
      <g class="far"><path d="M0 200 C60 170 90 120 140 110 C180 100 200 150 240 150 C290 150 310 80 370 70 C420 62 440 130 500 140 C560 150 600 100 650 95 C710 90 730 150 790 150 C850 150 880 60 950 55 C1010 50 1040 140 1100 145 C1150 148 1180 120 1200 115 V300 H0Z" fill="url(#hwFar)"/></g>
      <g class="near"><path d="M0 240 C50 220 90 170 150 165 C210 160 230 215 290 215 C350 215 380 150 450 145 C520 140 540 210 610 212 C680 214 700 160 770 155 C840 150 870 215 940 215 C1010 215 1040 170 1100 168 C1150 166 1180 200 1200 205 V300 H0Z" fill="url(#hwMid)"/></g>
      <path d="M0 276 C120 252 220 262 330 270 S560 250 700 263 S960 252 1200 266 V300 H0Z" fill="url(#hwNear)"/>
    </svg>
    ${[[62, 70, -10], [72, 95, -50], [54, 120, -80]].map(([y, s, d]) => `<i class="mist" style="--y:${y}%;--s:${s}s;--d:${d}s"></i>`).join('')}
    ${[[14, 48, -6, 58], [22, 64, -38, 44]].map(([y, s, d, w]) => `<svg class="crane" style="--y:${y}%;--s:${s}s;--d:${d}s;--w:${w}px" viewBox="0 0 60 30"><path class="wing" d="M30 15 Q18 0 2 4 Q16 10 26 17Z" fill="#2b2925"/><path class="wing" d="M30 15 Q42 0 58 4 Q44 10 34 17Z" fill="#2b2925"/><path d="M14 16 Q30 13 48 17 L56 15 L48 19 Q30 21 14 16Z" fill="#fffdf7" stroke="#2b2925" stroke-width="1"/><circle cx="55" cy="15.4" r="1.4" fill="#c63a2f"/></svg>`).join('')}
    ${Array.from({ length: 14 }, (_, i) => `<i class="petal" style="--x:${(i * 37 + 9) % 100}%;--s:${13 + ((i * 7) % 9)}s;--d:${-i * 1.6}s"></i>`).join('')}`;
  document.body.prepend(scene);

  // ── 효과: 먹방울·꽃가루 ──
  const fx = document.createElement('canvas');
  fx.className = 'race-fx';
  fx.setAttribute('aria-hidden', 'true');
  document.body.append(fx);
  const g = fx.getContext('2d'),
    parts = [];
  let fxRunning = false;
  function sizeFx() {
    const r = devicePixelRatio || 1;
    fx.width = innerWidth * r;
    fx.height = innerHeight * r;
    g.setTransform(r, 0, 0, r, 0, 0);
  }
  addEventListener('resize', sizeFx);
  sizeFx();
  const PAPER = ['#c63a2f', '#e0a92e', '#23201c', '#2f5d4a', '#f3a8b5', '#3c6fb0'];
  function splash(x, y, count = 16, power = 5, colors = ['#23201c', '#23201c', '#3d3833', '#c63a2f']) {
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2,
        v = power * (0.35 + Math.random());
      parts.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 2.2, life: 1, size: 2 + Math.random() * 5, color: colors[i % colors.length], gravity: 0.24, drop: true });
    }
    runFx();
  }
  function confetti(count = 170) {
    for (let i = 0; i < count; i++)
      parts.push({ x: Math.random() * innerWidth, y: -20 - Math.random() * innerHeight * 0.7, vx: (Math.random() - 0.5) * 2, vy: 2 + Math.random() * 3, life: 3.6, size: 6 + Math.random() * 6, color: PAPER[i % PAPER.length], spin: Math.random() * 6, gravity: 0.03, paper: true, petal: i % PAPER.length === 4 });
    runFx();
  }
  function runFx() {
    if (fxRunning) return;
    fxRunning = true;
    requestAnimationFrame(function frame() {
      g.clearRect(0, 0, innerWidth, innerHeight);
      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i];
        p.vy += p.gravity;
        p.x += p.vx + (p.paper ? Math.sin(p.life * 6 + p.spin) * 1.2 : 0);
        p.y += p.vy;
        p.life -= p.paper ? 0.006 : 0.03;
        if (p.life <= 0 || p.y > innerHeight + 30) {
          parts.splice(i, 1);
          continue;
        }
        g.save();
        g.globalAlpha = Math.min(1, p.life);
        g.fillStyle = p.color;
        g.translate(p.x, p.y);
        if (p.drop) {
          g.beginPath();
          g.ellipse(0, 0, p.size, p.size * 0.82, Math.atan2(p.vy, p.vx), 0, Math.PI * 2);
          g.fill();
        } else {
          p.spin += 0.14;
          g.rotate(p.spin);
          if (p.petal) {
            g.beginPath();
            g.ellipse(0, 0, p.size * 0.7, p.size * 0.42, 0, 0, Math.PI * 2);
            g.fill();
          } else g.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        }
        g.restore();
      }
      if (parts.length) requestAnimationFrame(frame);
      else {
        fxRunning = false;
        g.clearRect(0, 0, innerWidth, innerHeight);
      }
    });
  }
  function retrigger(el, cls) {
    el.classList.remove(cls);
    void el.offsetWidth;
    el.classList.add(cls);
  }
  let bannerTimer = 0;
  function banner(text) {
    $('raceBanner').textContent = text;
    retrigger($('raceBanner'), 'show');
    clearTimeout(bannerTimer);
    bannerTimer = setTimeout(() => $('raceBanner').classList.remove('show'), 2300);
  }

  // ── 소리: 사이트 효과음 크기·끄기를 그대로 따른다 ──
  const bus = () => window.ClassGameSfx?.getAudioBus?.() || null;
  let noiseBuffer = null;
  function tone(freq, length, type = 'sine', volume = 0.15, delay = 0, slideTo = 0) {
    const b = bus();
    if (!b) return;
    const a = b.context,
      t = a.currentTime + delay,
      o = a.createOscillator(),
      v = a.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + length);
    v.gain.setValueAtTime(0.0001, t);
    v.gain.exponentialRampToValueAtTime(volume, t + 0.008);
    v.gain.exponentialRampToValueAtTime(0.0001, t + length);
    o.connect(v).connect(b.output);
    o.start(t);
    o.stop(t + length + 0.05);
  }
  function noise(length, volume = 0.15, delay = 0, { type = 'bandpass', freq = 1800, q = 0.8, to = 0 } = {}) {
    const b = bus();
    if (!b) return;
    const a = b.context,
      t = a.currentTime + delay;
    if (!noiseBuffer || noiseBuffer.sampleRate !== a.sampleRate) {
      noiseBuffer = a.createBuffer(1, a.sampleRate * 1.5, a.sampleRate);
      const d = noiseBuffer.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    }
    const src = a.createBufferSource(),
      filter = a.createBiquadFilter(),
      v = a.createGain();
    src.buffer = noiseBuffer;
    filter.type = type;
    filter.frequency.setValueAtTime(freq, t);
    if (to) filter.frequency.exponentialRampToValueAtTime(to, t + length);
    filter.Q.value = q;
    v.gain.setValueAtTime(volume, t);
    v.gain.exponentialRampToValueAtTime(0.0001, t + length);
    src.connect(filter).connect(v).connect(b.output);
    src.start(t);
    src.stop(t + length + 0.05);
  }
  const file = (name) => window.ClassGameSfx?.play?.(name);
  const sfx = {
    join: () => {
      tone(880, 0.08, 'triangle', 0.09);
      tone(1320, 0.1, 'triangle', 0.07, 0.06);
    },
    stamp: (soft = false) => {
      tone(150, 0.2, 'sine', soft ? 0.18 : 0.34, 0, 60);
      noise(0.06, soft ? 0.08 : 0.16, 0, { freq: 900, q: 0.6 });
      if (!soft) file('stone');
    },
    drum: () => {
      tone(165, 0.32, 'sine', 0.36, 0, 70);
      noise(0.09, 0.14, 0, { freq: 700 });
    },
    // 징: 낮은 배음이 길게 운다.
    gong: (volume = 0.2) =>
      [[98, 1], [147.3, 0.6], [196.5, 0.45], [262, 0.25], [311, 0.15]].forEach(([f, m]) => tone(f, 2.6, 'sine', volume * m, 0, f * 0.985)),
    brush: () => {
      noise(0.2, 0.12, 0, { freq: 1100, to: 4200, q: 1.2 });
      tone(1046, 0.16, 'sine', 0.05, 0.1);
      tone(1568, 0.2, 'sine', 0.035, 0.16);
    },
    tick: () => file('tick') || tone(1100, 0.05, 'square', 0.05),
    drumroll(seconds) {
      for (let t = 0; t < seconds; t += 0.055) noise(0.05, 0.03 + 0.12 * (t / seconds), t, { freq: 1500 + 900 * (t / seconds), q: 0.7 });
    },
    cymbal: () => noise(1.6, 0.2, 0, { type: 'highpass', freq: 5200, q: 0.3 }),
    reveal: (i) => tone(520 + Math.min(i, 20) * 22, 0.09, 'triangle', 0.08),
    thud: () => {
      tone(118, 0.3, 'sine', 0.32, 0, 55);
      tone(392, 0.25, 'triangle', 0.07, 0.03);
    },
    fanfare: () => {
      [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.24, 'triangle', 0.12, i * 0.09));
      [523, 659, 784].forEach((f) => tone(f, 1.1, 'triangle', 0.07, 0.42));
      tone(1047, 1.2, 'triangle', 0.08, 0.42);
    },
  };

  await A.ready;
  let code = '',
    token = '',
    state = null,
    pollTimer = 0,
    shownRound = '',
    busy = false,
    failures = 0,
    previousLock = null,
    isTeacher = false,
    offset = 0,
    countShown = -1,
    goShown = '',
    finishShown = '',
    autoSent = '',
    ceremonyFor = '',
    ceremonyTimers = [],
    tilesFor = '',
    lastSec = -1,
    progressTimer = 0,
    progressSentAt = 0,
    progressSent = -1,
    myFilled = 0,
    settingsTimer = 0,
    finishAt = 0;
  const known = new Map(); // 앞 상태의 참가자(새로 들어옴·준비·제출을 알아보려고)
  const status = (message) => ($('roomStatus').textContent = message);
  const serverNow = () => Date.now() + offset;
  // 내 아바타: 학생은 학생 프로필, 선생님은 선생님 설정에 고른 아바타. 둘 다 없으면 동물 그림을 쓴다.
  const avatarOf = (path) => fetch(path, { cache: 'no-store', credentials: 'same-origin' })
    .then((r) => (r.ok ? r.json() : null))
    .then((data) => data?.profile?.avatar?.url || null)
    .catch(() => null);
  const myAvatar = avatarOf('/api/student/profile').then((url) => url || avatarOf('/api/teacher/settings'));
  async function api(path, body) {
    const sent = Date.now();
    const r = await fetch('/api/handwriting' + path, {
      method: body === undefined ? 'GET' : 'POST',
      cache: 'no-store',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: 'Bearer ' + token } : {}) },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    });
    const data = await r.json().catch(() => ({}));
    if (!r.ok) throw Object.assign(Error(data.message || '방에 연결하지 못했어요.'), { status: r.status });
    const s = data.state || data;
    if (s?.serverNow) offset = s.serverNow - (sent + Date.now()) / 2;
    return data;
  }

  // ── 얼굴: 아바타 그림, 없으면 이름 첫 글자 낙관 ──
  const hash = (s) => [...String(s)].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);
  function face(p, cls = '') {
    if (p.avatarUrl) {
      const img = document.createElement('img');
      img.className = 'face ' + cls;
      img.src = p.avatarUrl;
      img.alt = '';
      img.decoding = 'async';
      return img;
    }
    const span = document.createElement('span');
    span.className = 'face seal-face ' + cls;
    span.style.setProperty('--hue', String(hash(p.name) % 360));
    span.textContent = Array.from(String(p.name || '?').replace(/\s/g, ''))[0] || '?';
    return span;
  }
  const el = (tag, cls, text) => {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text != null) node.textContent = text;
    return node;
  };

  // ── 글감: 직접 넣기, 또는 속담·한자성어·관용어에서 무작위로(writing-texts.js) ──
  const banks = window.HANDWRITING_TEXTS || {};
  function pickText() {
    const list = banks[$('raceSource').value];
    if (!Array.isArray(list) || !list.length) return;
    const others = list.filter(([t]) => t !== $('raceText').value);
    $('raceText').value = (others.length ? others : list)[Math.floor(Math.random() * (others.length || list.length))][0];
  }
  const settings = () => ({ text: $('raceText').value.trim(), phase: $('raceMode').value });
  // 방장이 바꾼 글·모드는 대기실에서 바로 모두에게 보인다.
  function pushSettings(extra = {}) {
    clearTimeout(settingsTimer);
    if (!code || !state?.me.host || state.phase === 'writing') return;
    settingsTimer = setTimeout(async () => {
      const body = { ...settings(), ...extra };
      if (!body.text) return;
      try {
        render(await api('/rooms/' + code + '/settings', body));
        status('');
      } catch (e) {
        status(e.message);
      }
    }, extra.spectate === undefined ? 450 : 0);
  }
  $('raceSource').onchange = () => {
    const bank = $('raceSource').value !== 'custom';
    $('raceAnother').hidden = !bank;
    if (bank) pickText();
    pushSettings();
  };
  $('raceAnother').onclick = () => {
    pickText();
    pushSettings();
  };
  $('raceText').addEventListener('input', () => pushSettings());
  $('raceMode').onchange = () => pushSettings();
  $('spectateInput').onchange = () => pushSettings({ spectate: $('spectateInput').checked });

  function setLock(value) {
    if (previousLock !== value) {
      A.lock(value);
      previousLock = value;
    }
  }
  const submitted = () => state?.me.status === '제출 완료';
  function updateLock() {
    if (!state || state.phase !== 'writing' || !state.me.plays) return;
    const t = serverNow();
    setLock(submitted() || t < state.startsAt || t >= state.deadline);
  }

  // ── 쓸 글: 두루마리 위 칸에 본보기 글꼴로 ──
  function renderTiles(config) {
    const key = config.text + '|' + config.phase;
    $('modeTag').textContent = config.phase === 'solo' ? '혼자 쓰기' : '따라 쓰기';
    if (tilesFor === key) return;
    tilesFor = key;
    const words = config.text.trim().split(/\s+/),
      count = words.reduce((n, w) => n + Array.from(w).length, 0);
    const box = $('textTiles');
    const room = Math.max(240, (box.parentElement.clientWidth || 600) - 80);
    const tile = Math.max(30, Math.min(72, Math.floor(room / (count + words.length * 0.45 + 0.5))));
    box.style.setProperty('--tile', tile + 'px');
    let i = 0;
    box.replaceChildren(
      ...words.map((w) => {
        const word = el('span', 'tile-word');
        word.append(...Array.from(w).map((c) => {
          const t = el('span', 'tile', c);
          t.style.setProperty('--i', String(i++));
          return t;
        }));
        return word;
      }),
    );
  }

  // ── 대기실 참가자: 들어오면 톡 튀어나오고, 준비하면 낙관이 찍힌다 ──
  function renderLobby(s, prev) {
    const box = $('lobbyPlayers');
    const n = s.participants.length;
    box.dataset.size = n <= 8 ? 'l' : n <= 20 ? 'm' : 's';
    const alive = new Set();
    let joined = false,
      stamped = false;
    s.participants.forEach((p, index) => {
      alive.add(p.id);
      let chip = box.querySelector(`[data-id="${p.id}"]`);
      const before = prev?.get(p.id);
      if (!chip) {
        chip = el('div', 'chip');
        chip.dataset.id = p.id;
        chip.style.setProperty('--bob', -((hash(p.id) % 25) / 10) + 's');
        chip.append(face(p), el('b', 'name', p.name), el('i', 'seal', p.host ? '방장' : '준비'));
        if (prev) {
          chip.classList.add('new');
          joined = true;
        }
      }
      if (box.children[index] !== chip) box.insertBefore(chip, box.children[index] || null);
      chip.classList.toggle('mine', p.id === s.me.id);
      chip.classList.toggle('host', p.host);
      const ready = !p.host && p.ready;
      if (ready && before && !before.ready) {
        retrigger(chip, 'stamped');
        stamped = true;
      }
      chip.classList.toggle('ready', ready);
    });
    box.querySelectorAll('.chip').forEach((c) => {
      if (!alive.has(c.dataset.id)) c.remove();
    });
    if (joined) sfx.join();
    if (stamped) sfx.stamp(true);
  }

  // ── 먹길: 글자를 채운 만큼 말이 나아간다(점수가 아니라 채운 글자 수) ──
  const total = () => Array.from((state?.config.text || '').replace(/\s/g, '')).length || 1;
  function trackGeometry() {
    const track = $('raceTrack'),
      w = track.clientWidth,
      h = track.clientHeight;
    const css = getComputedStyle(track),
      tokenSize = parseFloat(css.getPropertyValue('--token')) || 32,
      nameSize = parseFloat(css.getPropertyValue('--name')) || 12,
      band = parseFloat(css.getPropertyValue('--band')) || 36;
    // 출발(왼쪽) → 다 채움(endX) → 낸 사람(finishX) → 끝 낙관(오른쪽 끝)
    const narrow = w < 600,
      startX = narrow ? 24 : 34,
      endX = Math.max(startX + 40, w - (narrow ? 92 : 128)),
      finishX = w - (narrow ? 64 : 92);
    return { w, h, room: h - band - 6, startX, endX, finishX, tokenSize, box: tokenSize + nameSize + 2, wide: tokenSize + 16 };
  }
  function buildStations() {
    const chars = Array.from(state.config.text.replace(/\s/g, ''));
    const geo = trackGeometry(),
      gap = (geo.endX - geo.startX) / chars.length;
    const big = $('raceTrack').classList.contains('big');
    const band = geo.h - geo.room - 6;
    const size = Math.max(12, Math.min(big ? 46 : Math.round(band * 0.66), Math.floor(gap * 0.8)));
    $('raceTrack').style.setProperty('--station', size + 'px');
    $('trackStations').replaceChildren(
      ...chars.map((c, i) => {
        const s = el('span', gap < 16 ? 'dot' : '', gap < 16 ? '·' : c);
        s.style.left = geo.startX + gap * (i + 0.5) + 'px';
        return s;
      }),
    );
    $('trackStations').dataset.key = state.roundId + '|' + geo.w + '|' + geo.h;
  }
  // 넓은 화면에서 쓰기 칸 아래가 남으면 그만큼 먹길을 키운다(판이 시작될 때와 창 크기가 바뀔 때만 — 쓰는 동안 칸이 움직이지 않게).
  function fitTrack() {
    const track = $('raceTrack');
    for (const k of ['--token', '--name', '--band']) track.style.removeProperty(k);
    track.style.height = '';
    if ($('trackView').hidden || !state?.me.plays || innerWidth <= 760) return;
    const base = track.offsetHeight,
      bottom = $('workspace').getBoundingClientRect().bottom,
      spare = Math.floor(innerHeight - bottom - 14);
    if (spare < 10) return;
    const h = Math.min(214, base + spare);
    const band = Math.round(Math.min(58, 36 + (h - base) * 0.16)),
      token = Math.round(Math.min(60, Math.max(32, (h - band - 22) * 0.44)));
    track.style.height = h + 'px';
    track.style.setProperty('--band', band + 'px');
    track.style.setProperty('--token', token + 'px');
    track.style.setProperty('--name', (token >= 46 ? 15 : 12) + 'px');
  }
  function paintStations() {
    if (!state?.me.plays) return;
    const doc = A.snapshot(),
      chars = Array.from(state.config.text.replace(/\s/g, ''));
    [...$('trackStations').children].forEach((s, i) => {
      const strokes = doc.cells[doc.phase]?.[i]?.length || 0;
      const need = window.HandwritingCore.model(chars[i])?.length || 1;
      const inked = strokes >= need;
      if (inked && !s.classList.contains('inked')) s.classList.add('inked');
      if (!inked) s.classList.remove('inked');
    });
  }
  function renderTrack(s, prev) {
    const track = $('raceTrack');
    track.classList.toggle('big', !s.me.plays);
    // 관전 화면(교사 큰 화면)은 사람마다 제 줄을 달린다. 사람이 많으면 한데 모여 달린다.
    const lanes = !s.me.plays && s.participants.length <= 16;
    track.classList.toggle('lanes', lanes);
    if (lanes) {
      const css = getComputedStyle(track),
        band = parseFloat(css.getPropertyValue('--band')) || 72,
        lane = (track.clientHeight - band - 6) / s.participants.length,
        size = Math.round(Math.max(28, Math.min(92, lane - 14)));
      track.style.setProperty('--token', size + 'px');
      track.style.setProperty('--name', (size >= 56 ? 22 : size >= 40 ? 18 : 15) + 'px');
      track.style.setProperty('--lane', lane + 'px');
    } else if (!s.me.plays) for (const k of ['--token', '--name', '--lane']) track.style.removeProperty(k);
    const geo = trackGeometry();
    if ($('trackStations').dataset.key !== s.roundId + '|' + geo.w + '|' + geo.h) buildStations();
    const box = $('trackTokens');
    const done = s.participants.filter((p) => p.done).length;
    $('doneCount').textContent = `${done}/${s.participants.length}`;
    // 자리: 나아간 거리(x)로 줄을 세우고, 겹치면 아래 줄로 비켜 선다.
    const items = s.participants.map((p) => {
      const value = p.done ? total() : p.id === s.me.id && !p.done ? Math.max(myFilled, p.progress) : p.progress;
      const x = p.done ? geo.finishX : geo.startX + (Math.min(value, total()) / total()) * (geo.endX - geo.startX);
      return { p, x, value };
    });
    // 낸 사람은 끝 낙관 앞에 조금 작게 줄지어 선다(오른쪽 줄부터 위로 채우고 왼쪽으로).
    const finished = lanes ? [] : items.filter((it) => it.p.done);
    if (finished.length) {
      const dh = geo.box * 0.64,
        perCol = Math.max(1, Math.floor((geo.room - geo.box) / dh) + 1),
        cols = Math.ceil(finished.length / perCol),
        // 줄지어 선 무리가 먹길의 40%를 넘지 않게 좁힌다(좁은 화면).
        dw = Math.min(geo.wide * 0.62, ((geo.finishX - geo.startX) * 0.4) / Math.max(1, cols - 1));
      finished.forEach((it, k) => {
        it.x = geo.finishX - Math.floor(k / perCol) * dw;
        it.y = geo.room - geo.box - (k % perCol) * dh;
        it.row = k % perCol;
        it.small = true;
      });
    }
    // 같은 자리에 몰리면 줄을 늘려 비켜 서고(반쯤 겹쳐도 된다), 그래도 넘치면 조금씩 옆으로 비낀다.
    const lastX = [];
    const sorted = items.filter((it) => !it.small).sort((a, b) => a.x - b.x || (a.p.id === s.me.id ? 1 : -1));
    for (const item of sorted) {
      let row = lastX.findIndex((x) => x <= item.x - geo.wide * 0.8);
      if (row < 0) row = lastX.push(0) - 1;
      lastX[row] = item.x;
      item.row = row;
    }
    const need = Math.max(1, lastX.length),
      maxRows = Math.max(1, Math.floor((geo.room - geo.box) / (geo.tokenSize * 0.45)) + 1),
      rows = Math.min(need, maxRows);
    const step = rows > 1 ? Math.min(geo.box + 4, (geo.room - geo.box) / (rows - 1)) : 0;
    for (const item of items) {
      if (item.small) continue;
      const wrap = Math.floor(item.row / rows);
      item.row %= rows;
      item.x += wrap * Math.min(12, geo.wide * 0.25) * (wrap % 2 ? 1 : -1);
    }
    if (lanes) items.forEach((item, i) => (item.lane = i));
    const alive = new Set(),
      stamps = [];
    for (const { p, x, value, row, lane, small, y: doneY } of items) {
      alive.add(p.id);
      let t = box.querySelector(`.token[data-id="${p.id}"]`);
      const before = prev?.get(p.id);
      if (!t) {
        t = el('div', 'token');
        t.dataset.id = p.id;
        t.style.setProperty('--bob', -((hash(p.id) % 26) / 10) + 's');
        t.append(face(p), el('b', 'name', p.name), el('i', 'done-seal', '✓'));
        box.append(t);
      }
      t.classList.toggle('mine', p.id === s.me.id);
      t.classList.toggle('done', p.done);
      const y = small ? doneY : lane === undefined ? geo.room - geo.box - row * step : (lane + 0.5) * (geo.room / items.length) - geo.tokenSize / 2;
      t.style.transform = `translate(${Math.round(x - geo.wide / 2)}px, ${Math.round(y)}px)` + (small ? ' scale(0.72)' : '');
      // 줄마다 지나온 길에 먹 자국이 남는다.
      let trail = box.querySelector(`.trail[data-id="${p.id}"]`);
      if (lane !== undefined) {
        if (!trail) {
          trail = el('i', 'trail');
          trail.dataset.id = p.id;
          box.prepend(trail);
        }
        trail.style.transform = `translate(${geo.startX}px, ${Math.round(y + geo.tokenSize / 2 - 6)}px)`;
        trail.style.width = Math.max(0, Math.round(x - geo.startX)) + 'px';
      } else trail?.remove();
      t.style.zIndex = p.id === s.me.id ? 20 : String(2 + row);
      if (p.id !== s.me.id && before && value > (before.shown || 0) + 0.05) retrigger(t, 'hop');
      t.dataset.shown = value;
      if (before && !before.done && p.done && p.id !== s.me.id) stamps.push([x, y]);
      known.set(p.id, { ...known.get(p.id), shown: value });
    }
    box.querySelectorAll('.token, .trail').forEach((t) => {
      if (!alive.has(t.dataset.id)) t.remove();
    });
    // 한꺼번에 여럿이 내면 낙관 하나에 사람 수를 적는다.
    if (stamps.length > 2) popStamp(geo.finishX - 40, 4, `${stamps.length}명 다 썼어요!`, false);
    else stamps.forEach(([x, y]) => popStamp(x, y, '다 썼어요!', false));
    if (stamps.length) sfx.stamp(true);
  }
  // 낸 사람 말 위로 붉은 낙관 "다 썼어요!"가 쾅 찍혔다 사라진다(x·y는 먹길 안 자리).
  function popStamp(x, y, text, mine) {
    const track = $('raceTrack'),
      w = track.clientWidth;
    const stamp = el('span', 'stamp-pop' + (mine ? ' mine' : ''), text);
    stamp.style.left = Math.min(w - (mine ? 110 : 64), Math.max(mine ? 110 : 64, x)) + 'px';
    stamp.style.top = Math.max(2, y) + 'px';
    track.append(stamp);
    setTimeout(() => stamp.remove(), 1800);
  }
  function myToken() {
    return state && $('trackTokens').querySelector(`.token[data-id="${state.me.id}"]`);
  }
  // 내 화면에서 한 글자를 다 쓰면: 붓 소리, 그 칸 테두리 밖으로 먹 물결, 먹길 위 내 말이 껑충.
  function celebrateCell(index) {
    sfx.brush();
    const pair = document.querySelector(`.cell-pair[data-index="${index}"]`);
    if (pair) {
      retrigger(pair, 'inked-ring');
      setTimeout(() => pair.classList.remove('inked-ring'), 700);
    }
    const t = myToken();
    if (t) {
      retrigger(t, 'hop');
      const r = t.getBoundingClientRect();
      setTimeout(() => splash(r.left + r.width / 2, r.top + r.height * 0.35, 14, 4.2), 120);
    }
  }
  function sendProgress(force = false) {
    clearTimeout(progressTimer);
    if (!state || state.phase !== 'writing' || !state.me.plays || submitted()) return;
    const value = Math.round(myFilled * 10) / 10;
    if (value === progressSent && !force) return;
    const wait = Math.max(0, 900 - (Date.now() - progressSentAt));
    progressTimer = setTimeout(async () => {
      progressSentAt = Date.now();
      progressSent = value;
      try {
        render(await api('/rooms/' + code + '/progress', { roundId: state.roundId, value }));
      } catch {
        /* 다음 폴링이 다시 맞춘다 */
      }
    }, wait);
  }
  $('trackTokens').addEventListener('animationend', (e) => {
    if (e.animationName === 'hop') e.target.closest('.token')?.classList.remove('hop');
  });
  window.addEventListener('handwritingchange', (e) => {
    if (!state || state.phase !== 'writing' || !state.me.plays) return;
    myFilled = A.progress().filled;
    paintStations();
    if (typeof e.detail?.complete === 'number') celebrateCell(e.detail.complete);
    if (state) renderTrack(state, known);
    sendProgress();
  });

  // ── 결과 발표: 북소리 → 아래 순위부터 → 3·2·1등 시상대 → 장원 낙관과 꽃가루 ──
  function countUp(node, to, ms, suffix = '점') {
    const start = performance.now();
    (function step(now) {
      const k = Math.min(1, (now - start) / ms);
      node.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))) + suffix;
      if (k < 1) requestAnimationFrame(step);
    })(start);
  }
  const later = (ms, fn) => ceremonyTimers.push(setTimeout(fn, ms));
  const detailOf = (r) => `모양 ${r.shape}% · ` + (r.order ? '획순 통과' : `획순 ${r.passed}/${r.total}글자`);
  function drawMine(card) {
    const doc = A.snapshot(),
      cells = doc.cells[doc.phase] || [];
    const ink = el('div', 'my-ink');
    let i = 0;
    for (const word of doc.text.trim().split(/\s+/)) {
      const w = el('span', 'ink-word');
      for (const _ of Array.from(word)) {
        const c = document.createElement('canvas');
        c.width = c.height = 76;
        const x = c.getContext('2d');
        x.scale(0.76, 0.76);
        x.lineCap = x.lineJoin = 'round';
        x.strokeStyle = x.fillStyle = '#23201c';
        for (const s of cells[i] || []) {
          const pts = s.points || [];
          if (!pts.length) continue;
          x.lineWidth = (s.width || 5.5) * 1.1;
          x.beginPath();
          x.moveTo(pts[0][0], pts[0][1]);
          pts.slice(1).forEach((p) => x.lineTo(p[0], p[1]));
          if (pts.length === 1) x.arc(pts[0][0], pts[0][1], x.lineWidth / 2, 0, Math.PI * 2);
          pts.length === 1 ? x.fill() : x.stroke();
        }
        w.append(c);
        i++;
      }
      ink.append(w);
    }
    return ink;
  }
  function rankRow(p, s, delay) {
    const row = el('div', 'rank-row' + (p.id === s.me.id ? ' mine' : '') + (p.result ? '' : ' none') + (p.rank && p.rank <= 3 ? ' top' : ''));
    row.dataset.id = p.id;
    row.classList.toggle('ready', !p.host && p.ready);
    row.style.setProperty('--d', delay + 'ms');
    const score = el('span', 's', p.result ? '0점' : '—');
    // 이번 판이 끝난 뒤에 들어온 사람은 '대기'로 둔다.
    const label = p.rank ? `${p.rank}위` : p.status === '미제출' ? '미제출' : '대기';
    row.append(el('span', 'r', label), face(p), el('span', 'n', p.name), score, el('span', 'detail', p.result ? detailOf(p.result) : p.status === '미제출' ? '시간 안에 내지 않음' : '다음 판부터'), el('i', 'seal', '준비'));
    if (p.result) later(delay, () => countUp(score, p.result.score, 600));
    return row;
  }
  function renderCeremony(s, lead = 0) {
    const rows = $('rankRows');
    // 같은 판을 다시 받으면(폴링) 준비 낙관과 드나든 사람만 고친다.
    if (ceremonyFor === s.roundId) {
      const alive = new Set();
      s.participants.forEach((p) => {
        alive.add(p.id);
        const row = rows.querySelector(`[data-id="${p.id}"]`) || rows.appendChild(rankRow(p, s, 0));
        const ready = !p.host && p.ready;
        if (ready && !row.classList.contains('ready')) sfx.stamp(true);
        row.classList.toggle('ready', ready);
      });
      rows.querySelectorAll('.rank-row').forEach((r) => {
        if (!alive.has(r.dataset.id)) r.remove();
      });
      return;
    }
    ceremonyFor = s.roundId;
    ceremonyTimers.forEach(clearTimeout);
    ceremonyTimers = [];
    const ranked = s.participants.filter((p) => p.result);
    const n = s.participants.length;
    // 아래 순위부터 하나씩. 북소리 1.6초 뒤 시작, 줄 사이는 사람 수에 맞춰 줄인다.
    const roll = lead + 1600,
      gap = Math.max(70, Math.min(260, 2600 / Math.max(1, n)));
    rows.dataset.count = n <= 8 ? 'few' : n <= 18 ? 'some' : 'many';
    rows.replaceChildren(...s.participants.map((p, i) => rankRow(p, s, roll + (n - 1 - i) * gap)));
    later(roll, () => sfx.reveal(0));
    for (let k = 1; k < Math.min(n, 24); k++) later(roll + k * gap, () => sfx.reveal(k));
    const afterRows = roll + n * gap + 250;
    // 시상대: 3등 → 2등 → (북소리) → 1등
    const top = [ranked[1], ranked[0], ranked[2]];
    const times = { 3: afterRows, 2: afterRows + 650, 1: afterRows + 650 + 1500 };
    if (!ranked.length) later(afterRows, () => banner('이번 판은 낸 글씨가 없어요'));
    const steps = {};
    $('podium').replaceChildren(
      ...top.map((p, i) => {
        const place = [2, 1, 3][i];
        const step = el('div', 'step place-' + place + (p ? '' : ' empty'));
        step.style.setProperty('--rise', lead + i * 120 + 'ms');
        const block = el('div', 'block');
        const mark = el('b', 'pod-place', '?');
        block.append(mark);
        if (p) {
          const score = el('span', 'pod-score', '0점');
          block.append(score, el('span', 'pod-detail', detailOf(p.result)));
          const racer = el('div', 'pod-racer');
          racer.append(el('b', 'pod-name', p.name), face(p, 'pod-face'));
          step.append(racer);
          if (p.rank === 1) block.append(el('b', 'jangwon', '장원'));
          later(times[place], () => {
            mark.textContent = String(p.rank);
            step.classList.remove('rolling');
            step.classList.add('show');
            countUp(score, p.result.score, 700);
          });
        } else later(times[place], () => (mark.textContent = String(place)));
        steps[place] = step;
        step.append(block);
        return step;
      }),
    );
    later(lead, () => {
      sfx.drumroll(1.6);
      Object.values(steps).forEach((st) => st.classList.add('rolling'));
    });
    later(roll, () => Object.values(steps).forEach((st) => st.classList.remove('rolling')));
    if (ranked[2]) later(times[3] + 250, sfx.thud);
    if (ranked[1]) later(times[2] + 250, sfx.thud);
    if (ranked[0]) {
      later(times[1] - 1400, () => {
        sfx.drumroll(1.35);
        steps[1].classList.add('rolling');
      });
      later(times[1] + 250, () => {
        sfx.cymbal();
        sfx.fanfare();
      });
      later(times[1] + 1000, () => {
        steps[1].classList.add('crowned');
        sfx.stamp();
        confetti();
        const champions = ranked.filter((p) => p.rank === 1).map((p) => p.name);
        banner(`장원 ${champions.join(' · ')}!`);
      });
    }
    // 내 글씨 카드: 내가 쓴 글씨(내 화면에 있는 것)와 내 점수
    const mine = s.participants.find((p) => p.id === s.me.id);
    const card = $('myCard');
    card.hidden = !mine || !s.me.plays;
    if (mine && s.me.plays) {
      card.style.setProperty('--d', times[1] + 1500 + 'ms');
      const big = el('div', 'mine-big');
      big.append(el('b', '', mine.rank ? `${mine.rank}위` : '—'), el('span', '', mine.result ? `${mine.result.score}점` : '미제출'));
      const right = el('div', '');
      right.append(drawMine(card), el('div', 'mine-detail', mine.result ? detailOf(mine.result) : '시간 안에 쓴 글씨가 없어요'));
      card.replaceChildren(big, right);
    }
  }

  // ── 화면 그리기 ──
  function render(s) {
    const prev = new Map(known);
    const prevState = state;
    state = s;
    const host = s.me.host,
      plays = s.me.plays,
      writing = s.phase === 'writing',
      results = s.phase === 'results';
    document.body.dataset.roomPhase = s.phase;
    document.body.classList.toggle('plays', plays);
    document.body.classList.toggle('spectator', !plays);
    document.body.classList.toggle('is-host', host);
    playMusic(writing ? 'race' : 'lobby', host);
    $('roomEntry').hidden = true;
    // 대기실의 방장 화면에는 큰 방번호판이 있으니 작은 방 표시는 숨긴다.
    $('roomChip').hidden = host && s.phase === 'lobby';
    $('codeLabel').textContent = s.code;
    $('bigCode').textContent = s.code;
    $('lobbyView').hidden = s.phase !== 'lobby';
    $('trackView').hidden = !writing;
    $('ceremonyView').hidden = !results;
    $('roomControls').hidden = writing;
    $('roomSettings').hidden = !host;
    $('spectateRow').hidden = !(host && isTeacher);
    $('spectateInput').checked = !plays;
    $('codeBoard').hidden = !host;
    $('meBoard').hidden = host;
    for (const id of ['raceText', 'raceMode', 'raceSource', 'raceAnother']) $(id).disabled = writing;
    $('readyButton').hidden = host || !plays || writing;
    $('readyButton').textContent = s.me.ready ? '준비 완료' : '준비';
    $('readyButton').setAttribute('aria-pressed', String(Boolean(s.me.ready)));
    const guests = s.participants.filter((p) => !p.host),
      readyCount = guests.filter((p) => p.ready).length;
    $('startRound').hidden = !host || writing;
    $('readyCount').textContent = guests.length ? `${readyCount}/${guests.length}` : '';
    $('startRound').classList.toggle('all-ready', guests.length > 0 && readyCount === guests.length);
    $('stopRound').hidden = !host || !writing;
    $('submitRound').hidden = !plays || !writing || submitted();
    $('leaveRoom').hidden = false;
    $('raceClock').hidden = !writing;
    if (host && !prevState) {
      $('raceText').value = s.config.text;
      $('raceMode').value = s.config.phase;
    }
    if (!host) {
      $('raceText').value = s.config.text;
      $('raceMode').value = s.config.phase;
    }
    if (!host) {
      $('meName').textContent = s.me.name || '';
      const key = s.me.avatarUrl || s.me.name;
      if ($('meFace').dataset.key !== key) {
        $('meFace').dataset.key = key;
        $('meFace').replaceChildren(face({ name: s.me.name || '?', avatarUrl: s.me.avatarUrl }));
      }
    }
    if (s.phase === 'lobby') {
      renderTiles(s.config);
      renderLobby(s, prevState ? prev : null);
    }
    // 판의 연습장(쓴 획)은 이 판 열쇠로 계정에 저장된다. 결과 화면에서 다시 열어도 내 글씨를 불러온다.
    if ((writing || results) && s.roundId && shownRound !== s.roundId) {
      shownRound = s.roundId;
      A.useRound(s.config.text, s.config.phase, s.code + '-' + s.roundId);
      previousLock = null;
      progressSent = -1;
      myFilled = plays ? A.progress().filled : 0;
      $('trackTokens').replaceChildren();
      $('trackStations').dataset.key = '';
      if (writing && myFilled) sendProgress(true);
      if (writing) requestAnimationFrame(() => {
        fitTrack();
        if (state) renderTrack(state, null);
      });
    }
    if (writing) {
      if (plays) updateLock();
      // 트랙은 화면이 그려진 뒤에 폭을 잰다.
      renderTrack(s, prevState?.phase === 'writing' ? prev : null);
      paintStations();
    } else if (plays && s.roundId) setLock(true);
    if (results) {
      let lead = 0;
      if (prevState?.phase === 'writing' && finishShown !== s.roundId) {
        showFinish(s.roundId, s.participants.every((p) => p.done) ? '모두 다 썼어요!' : '끝!');
        lead = 1200;
      } else if (Date.now() - finishAt < 1500) lead = 1500 - (Date.now() - finishAt);
      renderCeremony(s, lead);
    }
    known.clear();
    s.participants.forEach((p) => known.set(p.id, { ready: p.ready, done: p.done, shown: prev.get(p.id)?.shown ?? 0 }));
    s.participants.forEach((p) => {
      const t = $('trackTokens').querySelector(`.token[data-id="${p.id}"]`);
      if (t) known.get(p.id).shown = Number(t.dataset.shown) || 0;
    });
  }
  function showFinish(roundId, text) {
    finishShown = roundId;
    finishAt = Date.now();
    $('finishText').textContent = text;
    $('finishSign').hidden = false;
    retrigger($('finishText'), 'zoom');
    sfx.gong(0.24);
    setTimeout(() => ($('finishSign').hidden = true), 1500);
  }

  // ── 시계: 3·2·1, 남은 시간 막대, 마지막 30초, 끝나면 자동 제출 ──
  function clock() {
    requestAnimationFrame(clock);
    if (!state || state.phase !== 'writing') {
      if (!$('countdown').hidden) $('countdown').hidden = true;
      document.body.classList.remove('hot');
      return;
    }
    const t = serverNow(),
      before = state.startsAt - t,
      left = state.deadline - t;
    // 한 번 출발하면 다시 세지 않는다. 서버 시계 보정값이 출발 직후 조금 흔들려 남은 시간이 다시 0보다 커지면
    // 카운트다운이 다시 켜졌는데, '시작!'은 한 판에 한 번만 띄우므로 회색 막과 「1」이 그대로 남았다(입력도 잠겼다).
    if (before > 0 && goShown !== state.roundId) {
      const n = Math.ceil(before / 1000);
      $('countdown').hidden = false;
      if (countShown !== n) {
        countShown = n;
        $('countNum').textContent = n;
        $('countNum').classList.remove('go');
        retrigger($('countNum'), 'zoom');
        sfx.drum();
      }
    } else if (goShown !== state.roundId) {
      goShown = state.roundId;
      countShown = -1;
      if (before > -1500) {
        $('countdown').hidden = false;
        $('countNum').textContent = '시작!';
        $('countNum').classList.add('go');
        retrigger($('countNum'), 'zoom');
        sfx.gong(0.18);
        file('bell');
        setTimeout(() => ($('countdown').hidden = true), 800);
      } else $('countdown').hidden = true;
    }
    if (state.me.plays) updateLock();
    const duration = state.deadline - state.startsAt;
    const fill = Math.max(0, Math.min(1, left / duration));
    $('clockFill').style.transform = `scaleX(${fill})`;
    const sec = Math.max(0, Math.ceil(Math.min(left, duration) / 1000));
    if (sec !== lastSec) {
      lastSec = sec;
      $('clockText').textContent = `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`;
      if (sec <= 10 && sec > 0 && before <= 0) {
        sfx.tick();
        retrigger($('clockText'), 'bump');
      }
    }
    document.body.classList.toggle('hot', sec <= 30 && before <= 0);
    if (left <= 0 && finishShown !== state.roundId) {
      showFinish(state.roundId, '끝!');
      // 시간이 끝나면 쓴 글씨를 자동으로 낸다(제출을 잊어도 그동안 쓴 것이 남게).
      if (state.me.plays && !submitted() && autoSent !== state.roundId && A.progress().written) {
        autoSent = state.roundId;
        submit(false);
      }
      setTimeout(refresh, 1800);
      setTimeout(refresh, 4600);
    }
  }
  requestAnimationFrame(clock);

  // ── 서버 ──
  async function refresh() {
    if (!code) return;
    try {
      render(await api('/rooms/' + code));
      failures = 0;
      status('');
    } catch (e) {
      status(e.message);
      if (e.status === 403 || e.status === 404) {
        setLock(true);
        return 'gone';
      }
      failures++;
    }
  }
  function poll() {
    clearTimeout(pollTimer);
    if (!code) return;
    const fast = state?.phase === 'writing';
    pollTimer = setTimeout(
      async () => {
        if (!document.hidden && (await refresh()) === 'gone') return;
        poll();
      },
      Math.min(10000, (fast ? 1000 : 2000) + failures * 2000),
    );
  }
  function enter(data, newCode) {
    code = newCode;
    token = data.token;
    A.store.set('ticket-' + code, { token });
    history.replaceState(null, '', '?room=' + code);
    render(data.state);
    status('');
    poll();
  }
  async function action(fn) {
    if (busy) return;
    busy = true;
    try {
      await fn();
      status('');
    } catch (e) {
      status(e.message);
    } finally {
      busy = false;
    }
  }
  async function submit(ask = true) {
    if (ask && !confirm('이번 판의 글씨를 제출할까요? 제출 후에는 고칠 수 없어요.')) return;
    try {
      const s = await api('/rooms/' + code + '/result', { roundId: state.roundId, cells: A.cells() });
      render(s);
      const track = $('raceTrack');
      if (!$('trackView').hidden && track.clientWidth) {
        const geo = trackGeometry();
        popStamp(geo.finishX - 40, geo.room / 2 - 18, '다 썼어요!', true);
        const r = track.getBoundingClientRect();
        splash(r.left + geo.finishX, r.top + geo.room / 2, 26, 6, ['#c63a2f', '#c63a2f', '#23201c', '#e0a92e']);
      }
      sfx.stamp();
      status('');
    } catch (e) {
      status(e.message);
    }
  }
  // 방번호는 메인 화면 방번호 입력에서 ?room= 으로 넘어온다.
  function join(value) {
    action(async () => {
      const saved = A.store.get('ticket-' + value);
      if (saved?.token) {
        token = saved.token;
        try {
          enter({ token, state: await api('/rooms/' + value) }, value);
          return;
        } catch (e) {
          if (e.status !== 403 && e.status !== 404) throw e;
          token = '';
          A.store.remove('ticket-' + value);
        }
      }
      enter(await api('/rooms/' + value + '/join', { avatarUrl: await myAvatar }), value);
    });
  }
  // 방 만들기 → 바로 대기실. 글·모드·관전은 대기실에서 고른다.
  $('createRoom').onclick = () =>
    action(async () => {
      const data = await api('/rooms', { ...settings(), avatarUrl: await myAvatar });
      enter(data, data.state.code);
    });
  $('readyButton').onclick = () =>
    action(async () => {
      const s = await api('/rooms/' + code + '/ready', { ready: !state.me.ready });
      if (s.me.ready) sfx.stamp(true);
      render(s);
    });
  $('startRound').onclick = () =>
    action(async () => {
      clearTimeout(settingsTimer);
      render(await api('/rooms/' + code + '/start', settings()));
    });
  $('stopRound').onclick = () =>
    action(async () => {
      if (!confirm('지금 판을 끝내고 결과를 볼까요?')) return;
      render(await api('/rooms/' + code + '/stop', {}));
    });
  $('submitRound').onclick = () => {
    if (!busy) submit(true);
  };
  $('leaveRoom').onclick = () =>
    action(async () => {
      if (state?.me.host && !confirm('방을 닫으면 모두의 순위전이 끝나요. 방을 닫을까요?')) return;
      await api('/rooms/' + code + '/leave', {}).catch(() => {});
      clearTimeout(pollTimer);
      ceremonyTimers.forEach(clearTimeout);
      A.store.remove('ticket-' + code);
      code = '';
      token = '';
      state = null;
      shownRound = '';
      ceremonyFor = '';
      tilesFor = '';
      previousLock = null;
      known.clear();
      A.exitRound();
      playMusic('lobby');
      document.body.dataset.roomPhase = 'entry';
      document.body.classList.remove('plays', 'spectator', 'is-host', 'hot');
      for (const id of ['lobbyView', 'trackView', 'ceremonyView', 'roomControls', 'roomChip', 'raceClock', 'submitRound', 'stopRound', 'leaveRoom'])
        $(id).hidden = true;
      $('lobbyPlayers').replaceChildren();
      $('roomEntry').hidden = false;
      history.replaceState(null, '', location.pathname);
    });
  // 창 크기가 바뀌면 먹길 자리를 다시 잰다.
  addEventListener('resize', () => {
    if (state?.phase === 'writing') {
      fitTrack();
      renderTrack(state, null);
    }
    if (state?.phase === 'lobby') {
      tilesFor = '';
      renderTiles(state.config);
    }
  });
  // 관전 옵션은 교사에게만(대기실에서 고른다).
  try {
    isTeacher = Boolean((await api('/session')).isTeacher);
    if (state) render(state);
  } catch (e) {
    status(e.message);
  }
  if (/^\d{4}$/.test(initialCode)) join(initialCode);
})();
