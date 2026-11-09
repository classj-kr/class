(async function () {
  'use strict';
  const C = window.KoreanRaceCore;
  const $ = (id) => document.getElementById(id);
  const memory = new Map();
  let store = { get: (k) => memory.get(k), set: (k, v) => memory.set(k, v), remove: (k) => memory.delete(k) };
  try { if (window.SiteStorage) store = await window.SiteStorage.open('korean-race'); } catch { /* 게스트는 이 탭에서만 기억 */ }

  const params = new URLSearchParams(location.search);
  // ── 바탕: 글자 연과 날리는 글자 ─────────────────────
  // 가운데 연은 시상대·문제 카드 뒤에 겹치지 않게 위쪽 오른편으로 비켜 띄운다.
  const KITES = [[8, 22, 4, 7, 5], [26, 12, 214, 9, 6], [60, 8, 146, 8, 5.5], [72, 22, 330, 10, 6.5], [90, 30, 40, 7.5, 5]];
  const sceneLetters = (set) => (set === 'vocabulary' ? 'ABCDEFGHIJKLMNOPRSTW' : set === 'hanja' ? '人生大小山水日月火木金土天地上下' : '가나다라마바사아자차카타파하글말');
  let sceneSet = '';
  function paintScene(set) {
    if (sceneSet === set) return;
    sceneSet = set;
    const letters = sceneLetters(set);
    document.querySelector('.kites').replaceChildren(...KITES.map(([x, y, hue, sway, bob], i) => {
      const kite = document.createElement('span');
      kite.className = 'kite';
      kite.style.cssText = `--x:${x}%;--y:${y}%;--hue:${hue};--sway:${sway / 2}s;--bob:${bob}s;--delay:${-i * 1.3}s;--lean:${x < 50 ? 18 : -18}deg`;
      kite.innerHTML = '<i class="line"></i><span class="body"><b></b></span><i class="tail"></i>';
      kite.querySelector('b').textContent = letters[(i * 3) % letters.length];
      return kite;
    }));
    document.querySelector('.drift').replaceChildren(...Array.from({ length: 16 }, (_, i) => {
      const ch = document.createElement('i');
      ch.textContent = letters[(i * 7 + 2) % letters.length];
      ch.style.cssText = `--x:${(i * 37 + 5) % 96}%;--size:${18 + ((i * 11) % 18)}px;--hue:${(i * 47) % 360};--speed:${16 + ((i * 5) % 12)}s;--delay:${-i * 1.7}s`;
      return ch;
    }));
  }
  paintScene(C.SETS[params.get('set')] ? params.get('set') : 'spelling');
  // 제목은 들어온 학습 앱의 순위전이다(「맞춤법 순위전」, 「교과서 단어 순위전」).
  const TITLE_COLORS = ['#e2453c', '#e8a317', '#2f9e5b', '#2f74c0', '#8d5bd6', '#e2702d', '#1f9aa8', '#c2417a'];
  let titleSet = '';
  function paintTitle(set) {
    if (!C.SETS[set] || titleSet === set) return;
    titleSet = set;
    const text = `${C.SETS[set].label} 순위전`;
    document.title = text;
    const h1 = document.querySelector('.title-blocks');
    h1.setAttribute('aria-label', text);
    let n = 0, gap = false;
    h1.replaceChildren(...[...text].flatMap((ch) => {
      if (ch === ' ') { gap = true; return []; }
      const block = document.createElement('i');
      block.setAttribute('aria-hidden', 'true');
      block.textContent = ch;
      block.style.background = TITLE_COLORS[n % TITLE_COLORS.length];
      block.style.setProperty('--d', `${n * 0.12}s`);
      if (gap) block.classList.add('gap');
      gap = false;
      n += 1;
      return [block];
    }));
  }
  paintTitle(C.SETS[params.get('set')] ? params.get('set') : 'spelling');
  // 맞히면 연 하나가 훌쩍 솟는다.
  function liftKite() {
    const kites = document.querySelectorAll('.kite');
    if (!kites.length) return;
    const kite = kites[Math.floor(Math.random() * kites.length)];
    kite.classList.remove('lift');
    void kite.offsetWidth;
    kite.classList.add('lift');
  }
  let code = '', token = '', state = null;
  let pollTimer = 0, failures = 0, busy = false, offset = 0;
  // 지금 화면에 띄운 문제. 답을 보내거나 풀이를 보여 주는 동안에는 폴링이 바꾸지 않는다.
  let shown = null, answering = false, revealUntil = 0, revealTimer = 0, readyAt = 0, readTimer = 0;
  let localScore = 0, localCombo = 0, lastRank = null, lastFloor = 0;
  let shownCount = -1, goShown = '', finishShown = '', resultShown = '', roundSeen = '';
  const prevScores = new Map();
  const fromSet = C.SETS[params.get('set')] ? params.get('set') : 'spelling';
  const fromRange = C.validRange(fromSet, params.get('range'));
  // 들어온 자리(앞의 "~"를 뗀 것): "그 부분만"과 "처음부터 거기까지"를 고를 수 있게 한다.
  const baseRange = fromRange && fromRange.replace('~', '');
  const choice = { set: fromSet, level: C.validLevel(fromSet, params.get('level')), range: fromRange, duration: 90, teamMode: false, teamCount: 2, teamSize: C.TEAM_SIZE_DEFAULT };
  // 단계를 순위전 화면에서 바로 고르는 콘텐츠(한자 25단계): 마지막으로 고른 단계. "전체"로 바꿔도 기억해 둔다.
  let pickedStage = 1;
  const syncStage = () => { if (C.RANGE_SETS[choice.set]?.pick && choice.range) pickedStage = Number(String(choice.range).replace('~', '')) || 1; };
  syncStage();
  const serverNow = () => Date.now() + offset;
  // 들어온 학습 화면으로 돌아간다(방번호로 온 학생은 메인으로).
  if (params.get('set') && C.SETS[fromSet].app) $('backLink').href = C.SETS[fromSet].app + '/';
  // 내 아바타: 학생은 학생 프로필, 선생님은 선생님 설정에 고른 아바타. 둘 다 없으면 동물 그림을 쓴다.
  const avatarOf = (path) => fetch(path, { cache: 'no-store', credentials: 'same-origin' })
    .then((r) => (r.ok ? r.json() : null))
    .then((data) => data?.profile?.avatar?.url || null)
    .catch(() => null);
  const myAvatar = avatarOf('/api/student/profile').then((url) => url || avatarOf('/api/teacher/settings'));
  let isTeacher = false;
  fetch('/api/korean-race/session', { cache: 'no-store', credentials: 'same-origin' })
    .then((r) => (r.ok ? r.json() : null))
    .then((data) => { isTeacher = Boolean(data?.isTeacher); $('spectateRow').hidden = !isTeacher; })
    .catch(() => {});

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
    span.className = 'face emoji ' + cls;
    span.textContent = p.racer;
    return span;
  }
  const hash = (s) => [...String(s)].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);

  // ── 소리 ──────────────────────────────────────────
  function tone(freq, length, type = 'sine', volume = 0.15, delay = 0, slideTo = 0) {
    const bus = window.ClassGameSfx?.getAudioBus();
    if (!bus) return;
    const a = bus.context;
    const t = a.currentTime + delay, o = a.createOscillator(), g = a.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + length);
    g.gain.setValueAtTime(volume, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + length);
    o.connect(g).connect(bus.output);
    o.start(t);
    o.stop(t + length + 0.02);
  }
  const sfx = {
    good(combo) {
      const base = 520 * Math.pow(1.06, Math.min(combo, 14));
      tone(base, 0.09, 'triangle', 0.16);
      tone(base * 1.5, 0.12, 'triangle', 0.13, 0.06);
      if (combo && combo % 5 === 0) [1, 1.25, 1.5, 2].forEach((m, i) => tone(base * m, 0.12, 'square', 0.06, 0.12 + i * 0.06));
    },
    bad: () => tone(200, 0.16, 'sawtooth', 0.12, 0, 90),
    pick: () => tone(900, 0.04, 'square', 0.04),
    count: () => tone(660, 0.16, 'square', 0.12),
    go: () => { tone(880, 0.5, 'square', 0.13); tone(1320, 0.5, 'triangle', 0.1); },
    tick: () => tone(1000, 0.05, 'square', 0.06),
    whistle: () => { tone(1800, 0.25, 'square', 0.1); tone(1500, 0.35, 'square', 0.1, 0.25); },
    join: () => tone(740, 0.08, 'triangle', 0.1),
    floor: () => [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.16, 'triangle', 0.12, i * 0.08)),
  };

  // ── 음악: 순위전 공용 곡(대기 화면 한 곡, 달릴 때 무작위). 방장 기기에서만 기본으로 들린다.
  const playMusic = (kind) => window.RaceMusic?.set(kind === 'race' ? 'race' : 'lobby', { host: !state || state.me.host });

  // ── 효과 (파티클·꽃가루) ───────────────────────────
  const canvas = $('fx'), g2 = canvas.getContext('2d');
  const parts = [];
  let fxRunning = false;
  function sizeCanvas() {
    const r = devicePixelRatio || 1;
    canvas.width = innerWidth * r;
    canvas.height = innerHeight * r;
    g2.setTransform(r, 0, 0, r, 0, 0);
  }
  addEventListener('resize', sizeCanvas);
  // 긴 문제·팀 막대로 화면이 넘치면 아래 글자 탑 판을 줄여(120px까지) 넓은 화면에 스크롤바가 생기지 않게 한다.
  // 높이를 비웠다 다시 재지 않고 남는 자리만큼 늘리고 줄여, 스크롤바가 생겼다 없어졌다 하며 되풀이되지 않게 한다.
  function fitTowers() {
    const towers = $('towers');
    if (!towers || $('raceScreen').hidden || document.body.classList.contains('spectator')) return;
    if (innerWidth <= 860) { towers.style.height = ''; return; }
    const now = towers.getBoundingClientRect().height;
    const room = innerHeight - ($('raceScreen').getBoundingClientRect().bottom + scrollY + 12);
    const next = Math.max(120, Math.min(230, Math.floor(now + room)));
    if (Math.abs(next - now) > 1) towers.style.height = next + 'px';
  }
  addEventListener('resize', fitTowers);
  sizeCanvas();
  const COLORS = ['#e2513c', '#2f7fd0', '#f2b632', '#3fae6a', '#8d5bd6', '#ee7d2f'];
  function burst(x, y, count = 22, power = 6) {
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2, v = power * (0.4 + Math.random());
      parts.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 2, life: 1, size: 3 + Math.random() * 5, color: COLORS[i % COLORS.length], spin: Math.random() * 6, gravity: 0.25 });
    }
    runFx();
  }
  function confetti(count = 160) {
    for (let i = 0; i < count; i++) {
      parts.push({ x: Math.random() * innerWidth, y: -20 - Math.random() * innerHeight * 0.6, vx: (Math.random() - 0.5) * 2, vy: 2 + Math.random() * 3, life: 3.5, size: 6 + Math.random() * 6, color: COLORS[i % COLORS.length], spin: Math.random() * 6, gravity: 0.03, paper: true });
    }
    runFx();
  }
  function runFx() {
    if (fxRunning) return;
    fxRunning = true;
    requestAnimationFrame(function frame() {
      g2.clearRect(0, 0, innerWidth, innerHeight);
      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i];
        p.vy += p.gravity;
        p.x += p.vx + (p.paper ? Math.sin(p.life * 6 + p.spin) * 1.2 : 0);
        p.y += p.vy;
        p.life -= p.paper ? 0.006 : 0.025;
        p.spin += 0.15;
        if (p.life <= 0 || p.y > innerHeight + 30) { parts.splice(i, 1); continue; }
        g2.save();
        g2.globalAlpha = Math.min(1, p.life);
        g2.translate(p.x, p.y);
        g2.rotate(p.spin);
        g2.fillStyle = p.color;
        if (p.paper) g2.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        else g2.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        g2.restore();
      }
      if (parts.length) requestAnimationFrame(frame);
      else { fxRunning = false; g2.clearRect(0, 0, innerWidth, innerHeight); }
    });
  }
  function floatText(text, x, y, cls = '') {
    const el = document.createElement('span');
    el.className = 'float-text ' + cls;
    el.textContent = text;
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    document.body.append(el);
    setTimeout(() => el.remove(), 1100);
  }
  function retrigger(el, cls) {
    el.classList.remove(cls);
    void el.offsetWidth;
    el.classList.add(cls);
  }
  let bannerTimer = 0;
  function banner(text) {
    $('banner').textContent = text;
    retrigger($('banner'), 'show');
    clearTimeout(bannerTimer);
    bannerTimer = setTimeout(() => $('banner').classList.remove('show'), 1800);
  }

  // ── 서버 ─────────────────────────────────────────
  async function api(path, body) {
    const sent = Date.now();
    const r = await fetch('/api/korean-race' + path, {
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
  let toastTimer = 0;
  function toast(message) {
    $('toast').textContent = message;
    $('toast').classList.toggle('show', Boolean(message));
    clearTimeout(toastTimer);
    if (message) toastTimer = setTimeout(() => $('toast').classList.remove('show'), 3200);
  }
  async function action(fn) {
    if (busy) return;
    busy = true;
    try { await fn(); } catch (e) { toast(e.message); } finally { busy = false; }
  }

  // ── 문제 종류 아이콘: 메인 화면(index.html) 메뉴와 같은 그림 ─────────
  const SET_ICONS = {
    spelling: '<svg viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="2" fill="#fff8e1" stroke="#ffb300" stroke-width="1.2"/><rect x="4" y="4" width="7" height="7" stroke="#ffb300" stroke-width="0.8" fill="none"/><text x="7.5" y="9.8" font-size="6" font-weight="bold" fill="#212121" text-anchor="middle" font-family="\'Malgun Gothic\', sans-serif">ㄱ</text><rect x="13" y="4" width="7" height="7" stroke="#ffb300" stroke-width="0.8" fill="none"/><text x="16.5" y="9.8" font-size="6" font-weight="bold" fill="#212121" text-anchor="middle" font-family="\'Malgun Gothic\', sans-serif">ㄴ</text><rect x="4" y="13" width="7" height="7" stroke="#ffb300" stroke-width="0.8" fill="none"/><text x="7.5" y="18.8" font-size="6" font-weight="bold" fill="#212121" text-anchor="middle" font-family="\'Malgun Gothic\', sans-serif">ㄷ</text><circle cx="16.5" cy="16.5" r="3.5" stroke="#e53935" stroke-width="1.2" fill="none"/><path fill="#e53935" d="M19 12l2 2-6 6h-2v-2l6-6z"/></svg>',
    idioms: '<svg viewBox="0 0 24 24"><path fill="#f6d58b" d="M5 4h14v16H5z"/><path fill="#d49a3a" d="M5 4a3 3 0 0 0 0 6h2V4H5zm14 10h-2v6h2a3 3 0 1 0 0-6z"/><path fill="#8d6e63" d="M8 7h8v1.7H8zm0 3.5h6v1.7H8z"/><rect x="10" y="11" width="10" height="10" rx="1.5" fill="#c62828" stroke="#fff3d0" stroke-width=".8"/><text x="15" y="19" font-size="9.5" font-weight="bold" fill="#fff" text-anchor="middle" font-family="serif">四</text></svg>',
    proverbs: '📜',
    expressions: '<svg viewBox="0 0 24 24"><path fill="#42a5f5" d="M3 4.5A2.5 2.5 0 0 1 5.5 2h13A2.5 2.5 0 0 1 21 4.5v11a2.5 2.5 0 0 1-2.5 2.5H11l-5.5 4v-4A2.5 2.5 0 0 1 3 15.5v-11z"/><path fill="#fff3d0" d="M6.5 7h4v3.2c0 2.1-1.2 3.5-3.5 4.3l-.8-1.7c1.1-.4 1.7-1 1.9-1.8H6.5V7zm7 0h4v3.2c0 2.1-1.2 3.5-3.5 4.3l-.8-1.7c1.1-.4 1.7-1 1.9-1.8h-1.6V7z"/></svg>',
    textbook: '📗',
    sentences: '🧩',
    hanja: '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="3" fill="#d32f2f"/><rect x="5" y="5" width="14" height="14" rx="2" fill="#fff"/><text x="12" y="16" font-size="12" font-weight="bold" fill="#d32f2f" text-anchor="middle" font-family="serif">漢</text></svg>',
    vocabulary: '<svg viewBox="0 0 24 24"><rect x="5.5" y="3" width="15.5" height="18" rx="2.5" fill="#e0e7ff" stroke="#818cf8" stroke-width="0.9"/><rect x="3" y="5" width="15.5" height="18" rx="2.5" fill="#ffffff" stroke="#4f46e5" stroke-width="1.1"/><circle cx="6" cy="8.5" r="1.3" fill="#f8fafc" stroke="#64748b" stroke-width="0.8"/><path d="M4 8.5a2.5 2.5 0 0 1 4 0" fill="none" stroke="#f59e0b" stroke-width="1.3" stroke-linecap="round"/><rect x="8.5" y="8" width="8" height="1.8" rx="0.9" fill="#0284c7"/><text x="10.8" y="15" font-size="4.2" font-weight="900" fill="#1e293b" text-anchor="middle" font-family="\'Segoe UI\', sans-serif" letter-spacing="0.4">VOCAB</text><circle cx="14.8" cy="18.2" r="2.2" fill="#10b981"/><path d="M13.8 18.2l0.7 0.7 1.4-1.4" fill="none" stroke="#ffffff" stroke-width="0.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  };
  function setIcon(key) {
    const span = document.createElement('span');
    span.className = 'set-icon';
    span.setAttribute('aria-hidden', 'true');
    span.innerHTML = SET_ICONS[key] || '';
    return span;
  }
  // 아이콘 + 글자. 화면 곳곳(설정 버튼·문제 표·현황판 머리)에 같은 모양으로 붙인다.
  function setLabel(el, key, text) {
    el.replaceChildren(setIcon(key), document.createTextNode(text));
  }

  // ── 설정 버튼 ────────────────────────────────────
  function optionRow(label, entries, current, pick, small = false) {
    const field = document.createElement('fieldset');
    field.className = 'setting-field';
    const legend = document.createElement('legend');
    legend.textContent = label;
    const row = document.createElement('div');
    row.className = 'option-row';
    for (const [value, text, iconKey] of entries) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'option' + (small ? ' small' : '') + (current === value ? ' on' : '');
      if (iconKey) setLabel(b, iconKey, text);
      else b.textContent = text;
      b.setAttribute('aria-pressed', String(current === value));
      b.onclick = () => pick(value);
      row.append(b);
    }
    field.append(legend, row);
    return field;
  }
  function change(patch) {
    if (patch.set) {
      patch.level = C.validLevel(patch.set, choice.level);
      // 들어온 화면의 범위는 그 콘텐츠로 돌아올 때 다시 살린다.
      patch.range = patch.set === fromSet ? fromRange : null;
    }
    Object.assign(choice, patch);
    syncStage();
    paintSettings();
    if (code && state?.me.host && state.phase !== 'running')
      action(async () => render(await api('/rooms/' + code + '/settings', choice)));
  }
  function paintSettings() {
    document.querySelectorAll('.settings').forEach((box) => {
      box.innerHTML = '';
      // 문제 종류는 들어온 학습 앱이 정한다. 여러 앱을 고르거나 섞는 줄은 두지 않는다.
      if (choice.set === 'textbook') box.append(textbookField());
      const levels = C.levelsOf(choice.set);
      // 한자처럼 단계를 여기서 고르는 콘텐츠는 단계 줄을 늘 보인다. 고른 단계가 범위 줄의 기준이 된다.
      const stages = C.RANGE_SETS[choice.set]?.pick ? C.RANGE_SETS[choice.set].lessons : 0;
      const base = stages ? String(pickedStage) : fromRange && choice.set === fromSet ? baseRange : '';
      if (stages) {
        const row = optionRow('단계', Array.from({ length: stages }, (_, i) => [String(i + 1), String(i + 1)]), choice.range ? String(choice.range).replace('~', '') : null,
          (stage) => change({ range: String(choice.range || '').startsWith('~') ? '~' + stage : stage }), true);
        row.classList.add('stage-field');
        box.append(row);
      }
      // 문장 고르기처럼 한 차시의 문제가 너무 적은 콘텐츠는 "그 차시만" 없이 "처음부터 거기까지"와 "전체"만.
      if (base && choice.set !== 'textbook')
        box.append(optionRow('범위', [
          ...(C.RANGE_SETS[choice.set]?.uptoOnly ? [] : [[base, C.rangeLabel(choice.set, base) + '만']]),
          ...(C.rangeLabel(choice.set, '~' + base) === C.rangeLabel(choice.set, base) ? [] : [['~' + base, C.rangeLabel(choice.set, '~' + base)]]),
          [null, levels ? '수준별' : '전체'],
        ], choice.range, (range) => change({ range }), true));
      if (levels && !choice.range) box.append(optionRow('수준', levels, choice.level, (level) => change({ level }), true));
      box.append(
        optionRow('시간', C.DURATIONS.map((s) => [s, s % 60 === 0 ? `${s / 60}분` : `${s}초`]), choice.duration, (duration) => change({ duration }), true),
        optionRow('경기 방식', [[false, '개인전'], [true, '팀전']], choice.teamMode, (teamMode) => change({ teamMode })),
      );
      if (choice.teamMode) box.append(
        optionRow('팀 수', C.TEAM_COUNTS.map((n) => [n, `${n}팀`]), choice.teamCount, (teamCount) => change({ teamCount }), true),
        optionRow('한 팀 인원', C.TEAM_SIZES.map((n) => [n, `${n}명`]), choice.teamSize, (teamSize) => change({ teamSize }), true),
      );
    });
  }
  // ── 교과서 단어 시험 범위: 단원을 체크해서 고른다 ─────────
  // 학기 하나를 펼치고 과목 탭마다 단원 단추를 켜고 끈다. 다른 과목·학기에서 고른 단원도 그대로 남는다.
  let catalog = [], tbTerm = '', tbSubject = '';
  const tbPieces = () => (choice.range ? String(choice.range).split(',') : []);
  const tbUnits = (term, code) => catalog.find((t) => t.term === term)?.subjects.find((s) => s.code === code)?.units || [];
  const tbKey = (unit) => `${tbTerm}.${tbSubject}.${unit.id}`;
  // "6-2.sci"(과목 전체)는 단원 목록을 받은 뒤 단원 하나하나로 펼쳐 둔다.
  function tbExpand() {
    const out = [];
    for (const piece of tbPieces()) {
      const [term, code, unit] = piece.split('.');
      if (unit) out.push(piece);
      else tbUnits(term, code).forEach((u) => out.push(`${term}.${code}.${u.id}`));
    }
    return out;
  }
  const tbSet = (pieces) => change({ range: pieces.length ? [...new Set(pieces)].join(',') : null });
  const tbWordCount = (pieces) => pieces.reduce((sum, piece) => {
    const [term, code, unit] = piece.split('.');
    return sum + (tbUnits(term, code).find((u) => u.id === unit)?.count || 0);
  }, 0);
  const tbStartReady = () => choice.set !== 'textbook' || Boolean(choice.range);
  function tbWarn() {
    document.querySelectorAll('.range-summary').forEach((p) => { p.classList.remove('shake'); void p.offsetWidth; p.classList.add('shake'); });
  }
  function smallButton(text, onclick, cls = 'option small') {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = cls;
    b.textContent = text;
    b.onclick = onclick;
    return b;
  }
  function textbookField() {
    const field = document.createElement('fieldset');
    field.className = 'setting-field exam-range';
    const legend = document.createElement('legend');
    legend.textContent = '시험 범위';
    const summary = document.createElement('p');
    summary.className = 'range-summary';
    field.append(legend);
    if (!catalog.length) {
      summary.textContent = choice.range ? C.rangeLabel('textbook', choice.range) : '단원 목록을 불러오는 중…';
      field.append(summary);
      return field;
    }
    const picked = new Set(tbExpand());
    const head = document.createElement('div');
    head.className = 'range-head';
    const select = document.createElement('select');
    select.setAttribute('aria-label', '학년과 학기');
    for (const t of catalog) select.append(new Option(t.term.replace('-', '학년 ') + '학기', t.term, false, t.term === tbTerm));
    select.onchange = () => { tbTerm = select.value; paintSettings(); };
    const tabs = document.createElement('div');
    tabs.className = 'range-subjects';
    for (const sub of catalog.find((t) => t.term === tbTerm)?.subjects || []) {
      const on = sub.code === tbSubject;
      const b = smallButton(sub.name, () => { tbSubject = sub.code; paintSettings(); }, 'option small' + (on ? ' on' : ''));
      b.setAttribute('aria-pressed', String(on));
      const n = sub.units.filter((u) => picked.has(`${tbTerm}.${sub.code}.${u.id}`)).length;
      if (n) { const badge = document.createElement('b'); badge.className = 'range-count'; badge.textContent = n; b.append(badge); }
      tabs.append(b);
    }
    head.append(select, tabs);
    const units = tbUnits(tbTerm, tbSubject);
    const list = document.createElement('div');
    list.className = 'range-units';
    for (const u of units) {
      const key = tbKey(u), on = picked.has(key);
      const b = smallButton('', () => { if (on) picked.delete(key); else picked.add(key); tbSet([...picked]); }, 'range-unit' + (on ? ' on' : ''));
      b.setAttribute('aria-pressed', String(on));
      const title = document.createElement('span');
      title.textContent = u.title || C.rangeLabel('textbook', key);
      const count = document.createElement('small');
      count.textContent = `${u.count}낱말`;
      b.append(title, count);
      list.append(b);
    }
    const allOn = units.length > 0 && units.every((u) => picked.has(tbKey(u)));
    const tools = document.createElement('div');
    tools.className = 'range-tools';
    const all = smallButton(allOn ? '이 과목 모두 빼기' : '이 과목 모두 넣기', () => {
      units.forEach((u) => (allOn ? picked.delete(tbKey(u)) : picked.add(tbKey(u))));
      tbSet([...picked]);
    });
    const clear = smallButton('모두 지우기', () => tbSet([]));
    clear.disabled = !picked.size;
    tools.append(all, clear);
    summary.classList.toggle('empty', !picked.size);
    summary.textContent = picked.size ? `${C.rangeLabel('textbook', [...picked].join(','))} · ${tbWordCount([...picked])}낱말` : '단원을 하나 이상 골라 주세요.';
    field.append(head, list, tools, summary);
    return field;
  }
  if (fromSet === 'textbook') {
    const [term, code] = String(fromRange || '').split('.');
    tbTerm = term || '';
    tbSubject = code || 'kor';
    fetch('/api/korean-race/textbook-units', { cache: 'no-store', credentials: 'same-origin' })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        catalog = data?.terms || [];
        if (!catalog.some((t) => t.term === tbTerm)) tbTerm = catalog[0]?.term || '';
        if (choice.range) choice.range = tbExpand().join(',') || null;
        paintSettings();
      })
      .catch(() => {});
  }
  paintSettings();
  function setName(config) {
    const set = C.SETS[config.set];
    if (config.range) return `${set.label} · ${C.rangeLabel(config.set, config.range)}`;
    const level = (C.levelsOf(config.set) || []).find(([v]) => v === config.level);
    return `${set.label}${level && level[0] !== 'all' ? ' · ' + level[1] : ''}`;
  }

  // ── 화면 그리기 ──────────────────────────────────
  function show(screen) {
    document.body.dataset.screen = screen;
    for (const id of ['entry', 'lobby', 'race', 'result']) $(id + 'Screen').hidden = id !== screen;
    // 경주 중에는 시간·점수판이 맨 위 줄(돌아가기·방번호 줄)로 올라가, 그 줄이 빈 띠로 한 줄을 먹지 않는다.
    const hud = document.querySelector('.hud');
    if (screen === 'race') { if (hud.parentElement !== document.querySelector('.topbar')) $('roomBadge').before(hud); }
    else if (hud.parentElement !== $('raceScreen')) $('raceScreen').prepend(hud);
  }
  function racerItem(p, extra = '') {
    const li = document.createElement('li');
    li.className = extra;
    li.style.setProperty('--hue', (hash(p.name) % 360) + 'deg');
    const name = document.createElement('b');
    name.textContent = p.name;
    li.append(face(p, 'racer'), name);
    return li;
  }
  function render(s) {
    const previous = state;
    state = s;
    if (s.config.set === 'hanja' && previous?.config.set !== 'hanja') {
      document.fonts.load('600 1em KleeRaceHanja', '人').catch(() => {});
    }
    paintTitle(s.config.set);
    const host = s.me.host;
    document.body.classList.toggle('is-host', host);
    document.body.classList.toggle('spectator', !s.me.plays);
    $('roomBadge').hidden = false;
    $('roomBadgeCode').textContent = s.code;
    $('leaveButton').hidden = false;
    $('stopButton').hidden = !(host && s.phase === 'running');
    if (host && !previous) {
      Object.assign(choice, s.config);
      syncStage();
      paintSettings();
    }
    if (s.phase === 'lobby') renderLobby(s, previous);
    else if (s.phase === 'running') renderRace(s);
    else renderResults(s);
  }
  function renderLobby(s, previous) {
    show('lobby');
    playMusic('lobby');
    document.body.classList.remove('fever', 'warm', 'hurry');
    $('lobbyCode').textContent = s.code;
    setLabel($('lobbySet'), s.config.set, setName(s.config));
    $('lobbyRule').textContent = `${setName(s.config)} · ${s.config.duration % 60 ? s.config.duration + '초' : s.config.duration / 60 + '분'}`;
    if ($('myRacer').dataset.face !== (s.me.avatarUrl || s.me.racer)) {
      $('myRacer').dataset.face = s.me.avatarUrl || s.me.racer;
      $('myRacer').replaceChildren(face(s.me));
    }
    $('myName').textContent = s.me.name;
    $('racerCount').textContent = s.participants.length;
    const before = new Set((previous?.participants || []).map((p) => p.id));
    const item = (p) => racerItem(p, (p.id === s.me.id ? 'mine ' : '') + (previous && !before.has(p.id) ? 'new' : ''));
    const teamMode = Boolean(s.teams);
    $('lobbyRacers').hidden = teamMode;
    $('teamPanel').hidden = !teamMode;
    $('shuffleButton').hidden = !teamMode;
    paintTeamBadge(s);
    $('myLobbyHint').textContent = teamMode && s.me.team === null ? '아래에서 들어갈 팀을 눌러요!' : s.me.host ? '모두 들어오면 🏁 출발!을 눌러요.' : '선생님이 출발을 누르면 시작해요!';
    if (!teamMode) $('lobbyRacers').replaceChildren(...s.participants.map(item));
    else {
      const cap = s.config.teamSize || C.TEAM_SIZE_DEFAULT;
      $('teamColumns').style.setProperty('--teams', s.teams.length);
      $('teamColumns').dataset.count = s.teams.length;
      $('teamColumns').replaceChildren(...s.teams.map((t) => {
        const col = document.createElement('div');
        col.className = 'team-col' + (s.me.team === t.index ? ' mine' : '') + (t.size >= cap ? ' full' : '');
        col.style.setProperty('--team-hue', t.hue);
        const head = document.createElement('button');
        head.type = 'button';
        head.className = 'team-head';
        head.innerHTML = '<b></b><span></span>';
        head.firstChild.textContent = `${t.emoji} ${t.name}팀`;
        head.lastChild.textContent = `${t.size}/${cap}`;
        head.disabled = !s.me.plays || s.me.team === t.index || t.size >= cap;
        head.onclick = () => action(async () => { render(await api('/rooms/' + code + '/team', { team: t.index })); sfx.join(); });
        const list = document.createElement('ul');
        list.className = 'lobby-racers';
        list.append(...s.participants.filter((p) => p.team === t.index).map(memberItem));
        col.append(head, list);
        return col;
      }));
      const bench = s.participants.filter((p) => p.team === null);
      $('benchZone').hidden = !bench.length;
      $('benchList').replaceChildren(...bench.map(memberItem));
    }
    function memberItem(p) {
      const li = item(p);
      if (s.me.host) {
        li.classList.add('movable');
        li.title = '눌러서 다음 팀으로';
        li.onclick = () => action(async () => {
          // 다음 팀 → … → 팀 없음 순서로 돌되, 꽉 찬 팀은 건너뛴다.
          const stops = s.teams.length + 1;
          let next = p.team === null ? 0 : p.team + 1;
          while (next < s.teams.length && s.teams[next].size >= (s.config.teamSize || C.TEAM_SIZE_DEFAULT)) next++;
          next %= stops;
          render(await api('/rooms/' + code + '/assign', { playerId: p.id, team: next === s.teams.length ? null : next }));
        });
      }
      return li;
    }
    if (previous && s.participants.some((p) => !before.has(p.id))) sfx.join();
    resultShown = '';
  }
  function paintTeamBadge(s) {
    const team = s.teams && s.me.team !== null ? s.teams[s.me.team] : null;
    $('myTeam').hidden = !team;
    if (team) {
      $('myTeam').textContent = `${team.emoji} ${team.name}팀`;
      $('myTeam').style.setProperty('--team-hue', team.hue);
    }
  }
  $('shuffleButton').onclick = () => action(async () => render(await api('/rooms/' + code + '/shuffle', {})));

  function renderRace(s) {
    show('race');
    playMusic('race');
    setLabel($('modeNow'), s.config.set, setName(s.config));
    $('hostCode').textContent = s.code;
    if (roundSeen !== s.roundId) {
      roundSeen = s.roundId;
      shown = null;
      answering = false;
      revealUntil = 0;
      clearTimeout(revealTimer);
      localScore = s.me.score;
      localCombo = s.me.combo;
      lastRank = null;
      lastFloor = Math.floor(s.me.correct / C.FLOOR);
      prevScores.clear();
      parts.length = 0;
      $('towers').innerHTML = '';
      document.body.classList.remove('fever');
    }
    renderTeamBar(s);
    renderTowers(s);
    if (!s.me.plays) return;
    if (!answering && Date.now() >= revealUntil) {
      localScore = s.me.score;
      localCombo = s.me.combo;
      paintQuestion(s.me.question);
    }
    paintMine(s);
    requestAnimationFrame(fitTowers);
  }
  function paintMine(s) {
    renderMini(s);
    paintWords(s.me.words || [], s.me.correct, s.config.set === 'hanja');
    paintScore(localScore);
    paintCombo();
    const rank = s.me.rank;
    $('rankNow').textContent = rank ? rank + '위' : '-';
    if (lastRank && rank && rank !== lastRank) {
      retrigger($('rankNow').parentElement, rank < lastRank ? 'rank-up' : 'rank-down');
      // 앞지르면 알려 준다(연산 순위전처럼).
      if (rank < lastRank && s.participants.length > 1 && s.me.score > 0) banner(rank === 1 ? '👑 1위로 올라섰어요!' : `⬆️ ${rank}위로 올라섰어요!`);
    }
    lastRank = rank;
    const leader = s.participants[0];
    const mineTeam = s.teams && s.me.team !== null ? s.teams[s.me.team] : null;
    const topTeam = s.teams?.find((t) => t.rank === 1);
    if (mineTeam && topTeam?.value) {
      const rivals = s.teams.filter((t) => t.size && t.index !== mineTeam.index).sort((a, b) => b.value - a.value);
      const gap = mineTeam.value - (rivals[0]?.value ?? 0);
      $('chase').textContent = mineTeam.rank === 1
        ? (gap > 0 ? `${mineTeam.emoji} 우리 팀 1위! ${gap}점 앞서는 중` : `${mineTeam.emoji} 공동 1위! 한 문제만 더!`)
        : `${topTeam.emoji} ${topTeam.name}팀까지 ${topTeam.value - mineTeam.value}점! 힘내요!`;
    } else if (!leader || !leader.score) $('chase').textContent = '';
    else if (leader.score > s.me.score) $('chase').textContent = `1위 탑까지 ${leader.score - s.me.score}칸!`;
    else {
      const next = s.participants.find((p) => p.id !== s.me.id);
      const gap = s.me.score - (next?.score ?? 0);
      $('chase').textContent = gap > 0 ? `👑 1위! 2위와 ${gap}칸 차이` : '👑 공동 1위! 한 문제만 더!';
    }
  }
  // 점수가 한 칸씩 올라가며 바뀐다.
  let scoreShown = 0, scoreTimer = 0;
  function paintScore(value) {
    clearInterval(scoreTimer);
    if (Math.abs(value - scoreShown) > 12 || value < scoreShown) scoreShown = value;
    const tick = () => {
      if (scoreShown < value) scoreShown += 1;
      $('scoreNow').textContent = scoreShown;
      if (scoreShown >= value) clearInterval(scoreTimer);
    };
    tick();
    if (scoreShown < value) scoreTimer = setInterval(tick, 70);
  }
  // 정답·오답 도장
  function judge(ok) {
    const stamp = document.createElement('span');
    stamp.className = 'judge ' + (ok ? 'ok' : 'no');
    stamp.textContent = ok ? '정답' : '땡';
    $('card').append(stamp);
    setTimeout(() => stamp.remove(), 750);
  }
  function paintCombo() {
    $('comboNow').textContent = localCombo;
    // 다음 가산점(5연속 +2, 10연속 +3)까지 얼마나 남았는지 불꽃 막대로 보여 준다.
    const meter = localCombo >= 10 ? 1 : (localCombo % 5) / 5;
    $('comboMeter').style.setProperty('--fill', meter);
    $('comboMeter').classList.toggle('max', localCombo >= 10);
    $('worthNow').textContent = `한 문제 +${C.points(localCombo + 1)}`;
    document.body.classList.toggle('fever', localCombo >= 10);
    document.body.classList.toggle('warm', localCombo >= 5);
    $('comboNow').parentElement.classList.toggle('hot', localCombo >= 4);
    const worth = C.points(localCombo + 1);
    $('qStamp').hidden = worth < 2;
    $('qStamp').textContent = '+' + worth;
  }
  // 맞힌 말: 이번 판에 맞힌 말(속담·관용어·한자성어·바른 맞춤법·영단어)을 최근 것부터 모아 보여 준다.
  function paintWords(words, correct, hanja) {
    const box = $('myWords');
    if (box.dataset.count !== String(correct)) {
      const grew = Number(box.dataset.count || 0) < correct;
      box.dataset.count = correct;
      box.replaceChildren(...words.slice(-14).reverse().map((word, i) => {
        const chip = document.createElement('span');
        if (hanja) fillHanjaLabel(chip, word);
        else chip.textContent = word;
        chip.title = word;
        chip.style.setProperty('--hue', hash(word) % 360);
        if (grew && i === 0) chip.className = 'new';
        return chip;
      }));
      if (grew) liftKite();
    }
    $('floorNow').textContent = correct ? `${correct}개` : '';
    const floor = Math.floor(correct / C.FLOOR);
    if (floor > lastFloor) { banner(`🪁 ${floor * C.FLOOR}개 맞혔어요!`); sfx.floor(); }
    lastFloor = floor;
  }

  // ── 문제와 보기 ───────────────────────────────────
  function fillHanjaLabel(el, label) {
    const parts = /^(\p{Script=Han}+)(\([^()]+\))?$/u.exec(label);
    if (!parts) {
      el.textContent = label;
      return;
    }
    const glyph = document.createElement('span');
    glyph.className = 'hanja-glyph';
    glyph.textContent = parts[1];
    el.replaceChildren(glyph);
    if (parts[2]) {
      const reading = document.createElement('small');
      reading.textContent = parts[2];
      el.append(reading);
    }
  }

  // 한자 보기처럼 {{낱말}}로 표시한 자리는 밑줄 친 낱말로 그린다(자료를 HTML로 넣지 않고 글자 마디로 만든다).
  function fillMarked(el, text) {
    el.replaceChildren(...String(text).split(/\{\{([^{}]*)\}\}/).map((part, i) => {
      if (i % 2 === 0) return document.createTextNode(part);
      const word = document.createElement('u');
      word.textContent = part;
      return word;
    }));
  }
  function paintQuestion(q) {
    if (shown && q && shown.no === q.no) return;
    shown = q;
    const card = $('card');
    const text = $('qText');
    $('reveal').hidden = true;
    card.classList.remove('right', 'wrong', 'shake');
    if (!q) {
      $('qLabel').textContent = '';
      $('qNo').textContent = '';
      $('qAsk').textContent = '';
      text.classList.remove('hanja', 'word', 'long');
      text.textContent = '준비한 문제를 모두 풀었어요! 결과를 기다려요.';
      $('choices').replaceChildren();
      return;
    }
    card.dataset.set = q.set;
    setLabel($('qLabel'), q.set, q.label);
    $('qNo').textContent = `${q.no + 1}번째 문제`;
    $('qAsk').textContent = q.ask;
    $('qAsk').hidden = !q.ask;
    if (q.set === 'hanja') fillHanjaLabel(text, q.text);
    else {
      // 맞춤법 문장의 빈칸(___)은 칸으로 그린다.
      text.replaceChildren(...String(q.text).split(/_{2,}/).flatMap((part, i) => {
        const nodes = [];
        if (i) { const blank = document.createElement('span'); blank.className = 'blank'; nodes.push(blank); }
        nodes.push(document.createTextNode(part));
        return nodes;
      }));
    }
    text.classList.toggle('word', q.set === 'vocabulary');
    text.classList.toggle('hanja', q.set === 'hanja');
    text.classList.toggle('long', String(q.text).length > 60);
    $('choices').dataset.count = q.choices.length;
    // 보기 다섯이 ①~⑤처럼 아주 짧으면 한 줄에 나란히 놓는다.
    $('choices').classList.toggle('tiny', q.choices.length >= 5 && q.choices.every((label) => String(label).length <= 3));
    const tried = new Set(q.tried || []);
    $('choices').replaceChildren(...q.choices.map((label, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'choice' + (tried.has(i) ? ' is-wrong' : '');
      b.disabled = tried.has(i);
      b.style.setProperty('--i', i);
      b.innerHTML = '<kbd></kbd><span></span>';
      b.firstChild.textContent = i + 1;
      fillMarked(b.lastChild, label);
      b.onclick = () => answer(i);
      return b;
    }));
    retrigger(card, 'enter');
    // 문제를 읽을 짧은 시간 동안은 보기를 누를 수 없다(서버도 같은 시간을 지킨다).
    readyAt = Date.now() + C.MIN_ANSWER_MS;
    $('choices').classList.add('reading');
    clearTimeout(readTimer);
    readTimer = setTimeout(() => $('choices').classList.remove('reading'), C.MIN_ANSWER_MS);
    requestAnimationFrame(fitTowers);
  }
  const racing = () => state?.phase === 'running' && state.me.plays && serverNow() >= state.startsAt && serverNow() <= state.deadline;
  function answer(index) {
    if (!racing() || answering || !shown || Date.now() < revealUntil || Date.now() < readyAt) return;
    // 첫 문제는 출발 신호부터 센다.
    if (serverNow() - state.startsAt < C.MIN_ANSWER_MS) return;
    const buttons = [...$('choices').children];
    if (buttons[index]?.disabled) return;
    answering = true;
    sfx.pick();
    const q = shown, roundId = state.roundId;
    const open = buttons.filter((b) => !b.disabled);
    open.forEach((b) => (b.disabled = true));
    buttons[index]?.classList.add('picked');
    api('/rooms/' + code + '/answer', { roundId, index: q.no, choice: index })
      .then((data) => {
        if (state.roundId !== roundId) return;
        const card = $('card');
        const r = card.getBoundingClientRect();
        localScore = data.state.me.score;
        localCombo = data.combo;
        state = data.state;
        paintMine(data.state);
        clearTimeout(revealTimer);
        if (data.correct) {
          buttons[data.answer]?.classList.add('is-answer');
          card.classList.remove('wrong');
          card.classList.add('right');
          retrigger(card, 'cheer');
          judge(true);
          burst(r.left + r.width / 2, r.top + r.height / 3, localCombo >= 10 ? 40 : 22, localCombo >= 10 ? 9 : 6);
          floatText('+' + data.gained, r.left + r.width / 2, r.top, data.gained >= 3 ? 'mega' : data.gained >= 2 ? 'big' : '');
          if (localCombo && localCombo % 5 === 0) banner(`🔥 ${localCombo}문제 연속!`);
          sfx.good(localCombo);
          retrigger($('scoreNow'), 'bump');
          // 여러 번 만에 맞혔으면 풀이를 잠깐 보여 주고 넘어간다.
          if (data.retried && data.explain) {
            // 밑줄 낱말이 있는 보기(한자)는 그 낱말만 적는다.
            const right = String(q.choices[data.answer]);
            $('revealTitle').textContent = '맞았어요! ' + (/\{\{([^{}]*)\}\}/.exec(right)?.[1] ?? right);
            $('revealText').textContent = data.explain;
            $('reveal').hidden = false;
            revealUntil = Date.now() + C.REVEAL_MS;
          } else revealUntil = Date.now() + 380;
          revealTimer = setTimeout(() => { if (state.roundId === roundId) paintQuestion(state.me.question); }, revealUntil - Date.now());
        } else {
          // 틀리면 1점을 잃고, 그 보기에 줄을 그은 채 같은 문제를 다시 고른다.
          const picked = buttons[index];
          picked?.classList.remove('picked');
          picked?.classList.add('is-wrong');
          card.classList.add('wrong');
          retrigger(card, 'shake');
          judge(false);
          floatText(String(data.gained), r.left + r.width / 2, r.top, 'minus');
          sfx.bad();
          shown = { ...q, tried: data.tried };
          revealUntil = Date.now() + C.RETRY_LOCK_MS;
          revealTimer = setTimeout(() => {
            if (state.roundId !== roundId || shown?.no !== q.no) return;
            card.classList.remove('wrong');
            open.forEach((b) => { if (b !== picked) b.disabled = false; });
          }, C.RETRY_LOCK_MS);
        }
      })
      .catch(async (e) => {
        if (state.roundId !== roundId) return;
        toast(e.message);
        try { const fresh = await api('/rooms/' + code); shown = null; state = fresh; paintQuestion(fresh.me.question); render(fresh); }
        catch { open.forEach((b) => (b.disabled = false)); }
      })
      .finally(() => { answering = false; });
  }
  document.addEventListener('keydown', (e) => {
    if (e.repeat || e.ctrlKey || e.metaKey || e.altKey || document.body.dataset.screen !== 'race') return;
    const n = Number(e.key);
    if (n >= 1 && n <= (shown?.choices.length || 0)) { e.preventDefault(); answer(n - 1); }
  });

  // ── 현황판 ───────────────────────────────────────
  function renderTeamBar(s) {
    const bar = $('teamBar');
    bar.hidden = !s.teams;
    if (!s.teams) return;
    const shownTeams = s.teams.filter((t) => t.size);
    bar.dataset.count = shownTeams.length;
    const top = Math.max(1, ...shownTeams.map((t) => t.value));
    bar.replaceChildren(...shownTeams.map((t) => {
      const row = document.createElement('div');
      row.className = 'team-row' + (t.rank === 1 && t.value ? ' lead' : '') + (s.me.team === t.index ? ' mine' : '');
      row.style.setProperty('--team-hue', t.hue);
      row.style.setProperty('--fill', t.value / top);
      row.innerHTML = '<span class="team-name"></span><div class="team-fill"><i></i></div><strong></strong>';
      row.children[0].textContent = `${t.rank === 1 && t.value ? '👑' : t.emoji} ${t.name} ${t.size}명`;
      row.children[2].textContent = t.value;
      return row;
    }));
  }
  // 모두의 글자 탑: 점수만큼 블록이 쌓인다. 선생님 큰 화면에서는 모두, 학생 화면에서는 위쪽만 보인다.
  function renderTowers(s) {
    const box = $('towers');
    // 1위 탑이 칸의 80%쯤 차도록 맞춘다. 처음 몇 점부터 탑이 쑥쑥 자라 보이게.
    const top = Math.max(6, ...s.participants.map((p) => p.score)) * 1.22;
    const ordered = [...s.participants].sort((a, b) => (a.team ?? 99) - (b.team ?? 99) || a.name.localeCompare(b.name, 'ko'));
    box.style.setProperty('--cols', Math.max(ordered.length, 1));
    const alive = new Set();
    for (const p of ordered) {
      alive.add(p.id);
      let col = box.querySelector(`[data-id="${p.id}"]`);
      if (!col) {
        col = document.createElement('div');
        col.className = 'tower';
        col.dataset.id = p.id;
        col.innerHTML = '<div class="stack"><div class="climber"><b class="t-score"></b></div><div class="pile"></div></div><span class="t-name"></span>';
        col.querySelector('.climber').prepend(face(p, 't-face'));
      }
      const team = s.teams && p.team !== null ? s.teams[p.team] : null;
      col.style.setProperty('--hue', (team ? team.hue : hash(p.name) % 360) + 'deg');
      col.querySelector('.t-name').textContent = (team ? team.emoji + ' ' : '') + p.name;
      const slot = box.children[alive.size - 1];
      if (slot !== col) box.insertBefore(col, slot || null);
      col.classList.toggle('leader', p.rank === 1 && p.score > 0);
      col.classList.toggle('top', p.rank <= 5);
      col.classList.toggle('mine', p.id === s.me.id);
      col.classList.toggle('fever', p.combo >= 10);
      // 칸 높이에서 왕관·얼굴·점수 자리를 빼고 남은 만큼을 점수 비율로 채운다.
      const room = Math.max(40, col.querySelector('.stack').clientHeight - 78);
      col.querySelector('.pile').style.height = Math.max(4, Math.round((Math.max(0, p.score) / top) * room)) + 'px';
      col.querySelector('.t-score').textContent = p.score;
      const before = prevScores.get(p.id) ?? p.score;
      if (p.score > before) {
        const pop = document.createElement('i');
        pop.className = 't-pop';
        pop.textContent = '+' + (p.score - before);
        col.querySelector('.climber').append(pop);
        setTimeout(() => pop.remove(), 900);
        retrigger(col, 'hop');
      }
      prevScores.set(p.id, p.score);
    }
    box.querySelectorAll('.tower').forEach((col) => { if (!alive.has(col.dataset.id)) col.remove(); });
  }
  function renderMini(s) {
    const top = s.participants.slice(0, 5);
    const mine = s.participants.find((p) => p.id === s.me.id);
    if (mine && !top.includes(mine)) top.push(mine);
    $('miniBoard').replaceChildren(...top.map((p) => {
      const li = document.createElement('li');
      li.className = p.id === s.me.id ? 'mine' : '';
      li.innerHTML = '<em></em><b></b><strong></strong>';
      li.children[0].textContent = p.rank;
      li.children[1].textContent = p.name;
      li.children[2].textContent = p.id === s.me.id ? localScore : p.score;
      li.children[0].after(face(p, 'mini-face'));
      return li;
    }));
  }

  // ── 결과 ─────────────────────────────────────────
  function renderResults(s) {
    show('result');
    document.body.classList.remove('fever', 'warm', 'hurry');
    clearTimeout(revealTimer);
    const key = s.roundId + s.participants.map((p) => p.score).join(',');
    if (resultShown === key) return;
    const first = !resultShown.startsWith(s.roundId);
    resultShown = key;
    playMusic('lobby');
    if (first) setTimeout(() => confetti(), 200);
    const teams = (s.teams || []).filter((t) => t.size).sort((a, b) => a.rank - b.rank);
    $('teamResult').hidden = !teams.length;
    $('teamResult').dataset.count = teams.length;
    $('soloTitle').hidden = !teams.length;
    if (teams.length) {
      $('teamResult').replaceChildren(...teams.map((t) => {
        const card = document.createElement('div');
        card.className = 'team-card' + (t.rank === 1 ? ' winner' : '');
        card.style.setProperty('--team-hue', t.hue);
        card.style.setProperty('--delay', (t.rank === 1 ? 0.9 : 0.2 + (teams.length - t.rank) * 0.15) + 's');
        card.innerHTML = '<em></em><b></b><strong></strong><small></small><ul></ul>';
        card.children[0].textContent = t.rank === 1 ? '🏆 우승' : `${t.rank}위`;
        card.children[1].textContent = `${t.emoji} ${t.name}팀`;
        card.children[2].textContent = t.value + '점';
        card.children[3].textContent = `${t.size}명 · 맞힌 문제 ${t.correct}개`;
        card.children[4].append(...s.participants.filter((p) => p.team === t.index).map((p) => {
          const li = document.createElement('li');
          li.append(face(p, 'row-face'), `${p.name} ${p.score}`);
          return li;
        }));
        return card;
      }));
    }
    // 팀전이면 시상대에 팀이 올라간다(팀원 모두가 단 위에 선다). 개인 순위는 아래 표에만 둔다.
    const podium = $('podium');
    if (teams.length) {
      $('teamResult').before(podium);
      const teamOrder = [teams[1], teams[0], teams[2]];
      podium.classList.add('team-podium');
      podium.replaceChildren(...teamOrder.map((t, i) => {
        const div = document.createElement('div');
        const place = t ? t.rank : [2, 1, 3][i];
        div.className = 'step place-' + [2, 1, 3][i] + (t ? '' : ' empty');
        div.style.setProperty('--delay', [0.5, 1.1, 0.2][i] + 's');
        if (t) {
          div.style.setProperty('--team-hue', t.hue);
          div.innerHTML = '<span class="pod-racer pod-team"></span><div class="block"><b class="pod-place"></b><b class="pod-name"></b><span class="pod-score"></span></div>';
          const members = s.participants.filter((p) => p.team === t.index);
          div.querySelector('.pod-racer').append(...members.map((p) => face(p, 'pod-face')));
          if (place === 1) div.querySelector('.pod-racer').classList.add('crowned');
          div.querySelector('.pod-name').textContent = `${t.emoji} ${t.name}팀`;
          div.querySelector('.pod-score').textContent = t.value + '점';
        } else div.innerHTML = '<div class="block"><b class="pod-place"></b></div>';
        div.querySelector('.pod-place').textContent = place;
        return div;
      }));
    } else {
      $('soloTitle').after(podium);
      podium.classList.remove('team-podium');
    }
    $('soloTitle').hidden = true;
    const order = [s.participants[1], s.participants[0], s.participants[2]];
    if (!teams.length) podium.replaceChildren(...order.map((p, i) => {
      const div = document.createElement('div');
      const place = [2, 1, 3][i];
      div.className = 'step place-' + place + (p ? '' : ' empty');
      div.style.setProperty('--delay', [0.5, 1.1, 0.2][i] + 's');
      if (p) {
        // 아바타는 단 위에 바로 서고, 이름·점수는 단 안에 적는다(아바타와 단 사이가 비어 떠 보이지 않게).
        div.innerHTML = '<span class="pod-racer"></span><div class="block"><b class="pod-place"></b><b class="pod-name"></b><span class="pod-score"></span></div>';
        div.querySelector('.pod-racer').append(face(p, 'pod-face'));
        if (place === 1) div.querySelector('.pod-racer').classList.add('crowned');
        div.querySelector('.pod-name').textContent = p.name;
        div.querySelector('.pod-score').textContent = p.score + '점';
      } else div.innerHTML = '<div class="block"><b class="pod-place"></b></div>';
      div.querySelector('.pod-place').textContent = place;
      return div;
    }));
    $('resultRows').replaceChildren(...s.participants.map((p) => {
      const tr = document.createElement('tr');
      tr.className = p.id === s.me.id ? 'mine' : '';
      const team = s.teams && p.team !== null ? s.teams[p.team] : null;
      for (const value of [p.rank, `${team ? team.emoji + ' ' : ''}${p.name}`, p.score, p.correct, p.wrong, p.accuracy + '%', p.bestCombo]) {
        const td = document.createElement('td');
        td.textContent = value;
        tr.append(td);
      }
      tr.children[1].prepend(face(p, 'row-face'));
      return tr;
    }));
    const mine = s.participants.find((p) => p.id === s.me.id);
    const myTeam = mine && s.teams && mine.team !== null ? s.teams[mine.team] : null;
    $('myResult').textContent = !mine ? '' : myTeam
      ? `${myTeam.emoji} 우리 팀 ${myTeam.rank}위${myTeam.rank === 1 ? '! 🎉' : ''} · 나는 ${mine.score}점 (${mine.rank}위)`
      : `${mine.avatarUrl ? '' : mine.racer + ' '}나는 ${mine.rank}위! ${mine.score}점 · ${mine.correct}문제 맞힘 · 정답률 ${mine.accuracy}%`;
  }

  // ── 시계 (카운트다운·남은 시간) ─────────────────────
  let fitAt = 0;
  function clock() {
    requestAnimationFrame(clock);
    if (!state || state.phase !== 'running') {
      $('countdown').hidden = true;
      return;
    }
    // 맞힌 말·팀 막대·풀이처럼 언제 늘어날지 모르는 것이 많아, 경주 중에는 0.2초마다 탑 판 높이를 맞춘다.
    if (performance.now() - fitAt > 200) { fitAt = performance.now(); fitTowers(); }
    const t = serverNow(), before = state.startsAt - t, left = state.deadline - t;
    // 한 번 출발하면 다시 세지 않는다. 서버 시계 보정값이 출발 직후 조금 흔들려 남은 시간이 다시 0보다 커지면
    // 카운트다운이 다시 켜졌는데, '시작!'은 한 판에 한 번만 띄우므로 회색 막과 「1」이 그대로 남았다(입력도 잠겼다).
    if (before > 0 && goShown !== state.roundId) {
      const n = Math.ceil(before / 1000);
      $('countdown').hidden = false;
      if (shownCount !== n) {
        shownCount = n;
        $('countNum').textContent = n;
        retrigger($('countNum'), 'zoom');
        sfx.count();
      }
    } else if (goShown !== state.roundId) {
      goShown = state.roundId;
      shownCount = -1;
      $('countNum').textContent = '시작!';
      retrigger($('countNum'), 'zoom');
      sfx.go();
      setTimeout(() => ($('countdown').hidden = true), 700);
    }
    const sec = Math.max(0, Math.ceil(Math.min(left, state.config.duration * 1000) / 1000));
    if ($('timeLeft').textContent !== String(sec)) {
      $('timeLeft').textContent = sec;
      if (sec <= 5 && sec > 0 && before <= 0) { sfx.tick(); retrigger($('timeLeft'), 'bump'); }
    }
    document.body.classList.toggle('hurry', sec <= 10 && before <= 0);
    $('timeBar').style.transform = `scaleX(${Math.max(0, Math.min(1, left / (state.config.duration * 1000)))})`;
    if (left <= 0 && finishShown !== state.roundId) {
      finishShown = state.roundId;
      [...$('choices').children].forEach((b) => (b.disabled = true));
      $('finish').hidden = false;
      sfx.whistle();
      window.RaceMusic?.set(null);
      setTimeout(() => ($('finish').hidden = true), 1600);
      setTimeout(refresh, 1800);
    }
  }
  requestAnimationFrame(clock);

  // ── 방 들어가기·나가기 ─────────────────────────────
  async function refresh() {
    if (!code) return;
    try {
      render(await api('/rooms/' + code));
      failures = 0;
    } catch (e) {
      toast(e.message);
      if (e.status === 403 || e.status === 404) return leaveLocal();
      failures++;
    }
  }
  function poll() {
    clearTimeout(pollTimer);
    if (!code) return;
    const fast = state?.phase === 'running';
    pollTimer = setTimeout(async () => {
      if (!document.hidden) await refresh();
      poll();
    }, Math.min(10000, (fast ? 1000 : 2000) + failures * 2000));
  }
  function enter(data, newCode) {
    code = newCode;
    token = data.token;
    store.set('ticket-' + code, { token });
    history.replaceState(null, '', '?room=' + code);
    render(data.state);
    poll();
  }
  function leaveLocal() {
    clearTimeout(pollTimer);
    if (code) store.remove('ticket-' + code);
    code = ''; token = ''; state = null; roundSeen = ''; resultShown = ''; shown = null;
    $('roomBadge').hidden = true;
    $('leaveButton').hidden = true;
    $('stopButton').hidden = true;
    document.body.classList.remove('is-host', 'spectator', 'fever', 'warm', 'hurry');
    show('entry');
    playMusic('lobby');
    history.replaceState(null, '', location.pathname + (params.get('set') ? '?set=' + fromSet + (fromRange ? '&range=' + fromRange : '') : ''));
  }
  // 방번호는 메인 화면 방번호 입력에서 ?room= 으로 넘어온다.
  function join(value) {
    action(async () => {
      const saved = store.get('ticket-' + value);
      if (saved?.token) {
        token = saved.token;
        try { return enter({ token, state: await api('/rooms/' + value) }, value); }
        catch (e) {
          if (e.status !== 403 && e.status !== 404) throw e;
          token = '';
          store.remove('ticket-' + value);
        }
      }
      enter(await api('/rooms/' + value + '/join', { avatarUrl: await myAvatar }), value);
    });
  }
  $('createButton').onclick = () => action(async () => {
    if (!tbStartReady()) { tbWarn(); return; }
    const data = await api('/rooms', { ...choice, spectate: isTeacher && $('spectateInput').checked, avatarUrl: await myAvatar });
    enter(data, data.state.code);
  });
  $('startButton').onclick = () => action(async () => {
    if (!tbStartReady()) { tbWarn(); return; }
    render(await api('/rooms/' + code + '/start', choice));
  });
  $('againButton').onclick = () => action(async () => render(await api('/rooms/' + code + '/start', choice)));
  $('settingsButton').onclick = () => action(async () => render(await api('/rooms/' + code + '/lobby', {})));
  $('stopButton').onclick = () => action(async () => {
    if (!confirm('지금 판을 끝내고 결과를 볼까요?')) return;
    render(await api('/rooms/' + code + '/stop', {}));
  });
  $('leaveButton').onclick = () => action(async () => {
    if (state?.me.host && !confirm('방을 닫으면 모두의 순위전이 끝나요. 닫을까요?')) return;
    try { await api('/rooms/' + code + '/leave', {}); } catch { /* 이미 닫힌 방 */ }
    leaveLocal();
  });

  const initial = params.get('room') || '';
  if (/^\d{4}$/.test(initial)) join(initial);
  else playMusic('lobby'); // 방 만들기 화면
})();
