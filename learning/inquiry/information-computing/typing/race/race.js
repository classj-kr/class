(async function () {
  'use strict';
  const C = window.TypingRaceCore;
  const $ = (id) => document.getElementById(id);
  const memory = new Map();
  let store = { get: (k) => memory.get(k), set: (k, v) => memory.set(k, v), remove: (k) => memory.delete(k) };
  try { if (window.SiteStorage) store = await window.SiteStorage.open('typing-race'); } catch { /* 게스트는 이 탭에서만 기억 */ }

  let code = '', token = '', state = null, items = [], itemsRound = '';
  let pollTimer = 0, failures = 0, busy = false, offset = 0;
  let localIndex = 0, localScore = 0, localCombo = 0, mistakesThis = 0, erroring = false;
  let sendChain = Promise.resolve(), lastCleared = null, composing = false;
  let shownCount = -1, goShown = '', finishShown = '', resultShown = '', lastRank = null;
  const prevScores = new Map();
  const choice = { mode: 'ko-words', duration: 90, teamMode: false, teamCount: 2 };
  const serverNow = () => Date.now() + offset;
  // 순위판에 띄울 학생 프로필 아바타(연산 순위전과 같은 곳). 없으면 동물 이모지가 대신 달린다.
  const myAvatar = fetch('/api/student/profile', { cache: 'no-store', credentials: 'same-origin' })
    .then((r) => (r.ok ? r.json() : null))
    .then((data) => data?.profile?.avatar?.url || null)
    .catch(() => null);
  // 교사만 "참여하지 않고 관전하기"를 고를 수 있다.
  let isTeacher = false;
  fetch('/api/typing-race/session', { cache: 'no-store', credentials: 'same-origin' })
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
  const input = $('typeInput');

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
    key: () => tone(1400 + Math.random() * 300, 0.03, 'square', 0.025),
    good(combo) {
      const base = 520 * Math.pow(1.06, Math.min(combo, 14));
      tone(base, 0.09, 'triangle', 0.16);
      tone(base * 1.5, 0.12, 'triangle', 0.13, 0.06);
      if (combo && combo % 5 === 0) [0, 1, 2, 3].forEach((i) => tone(base * [1, 1.25, 1.5, 2][i], 0.12, 'square', 0.06, 0.12 + i * 0.06));
    },
    bad: () => tone(200, 0.14, 'sawtooth', 0.12, 0, 90),
    count: () => tone(660, 0.16, 'square', 0.12),
    go: () => { tone(880, 0.5, 'square', 0.13); tone(1320, 0.5, 'triangle', 0.1); },
    tick: () => tone(1000, 0.05, 'square', 0.06),
    whistle: () => { tone(1800, 0.25, 'square', 0.1); tone(1500, 0.35, 'square', 0.1, 0.25); },
    join: () => tone(740, 0.08, 'triangle', 0.1),
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
  sizeCanvas();
  const COLORS = ['#ff3d9a', '#27e1ff', '#ffe14d', '#4dff9a', '#b46bff', '#ff8a3d'];
  function burst(x, y, count = 26, power = 7) {
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2, v = power * (0.4 + Math.random());
      parts.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 2, life: 1, size: 3 + Math.random() * 5, color: COLORS[i % COLORS.length], spin: Math.random() * 6, gravity: 0.25, star: Math.random() < 0.3 });
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
        if (p.star) { g2.font = `${p.size * 3}px sans-serif`; g2.fillText('✦', 0, 0); }
        else if (p.paper) g2.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
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

  // ── 서버 ─────────────────────────────────────────
  async function api(path, body) {
    const sent = Date.now();
    const r = await fetch('/api/typing-race' + path, {
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

  // ── 설정 버튼 ────────────────────────────────────
  function optionRow(label, entries, current, pick, small = false) {
    const field = document.createElement('fieldset');
    field.className = 'setting-field';
    const legend = document.createElement('legend');
    legend.textContent = label;
    const row = document.createElement('div');
    row.className = 'option-row';
    for (const [value, label] of entries) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'option' + (small ? ' small' : '') + (current === value ? ' on' : '');
      b.textContent = label;
      b.setAttribute('aria-pressed', String(current === value));
      b.onclick = () => pick(value);
      row.append(b);
    }
    field.append(legend, row);
    return field;
  }
  // 대기실에서 바꾸면 학생 화면의 팀 칸도 바로 바뀌도록 서버에 알린다.
  function change(patch) {
    Object.assign(choice, patch);
    paintSettings();
    if (code && state?.me.host && state.phase !== 'running')
      action(async () => render(await api('/rooms/' + code + '/settings', choice)));
  }
  function paintSettings() {
    document.querySelectorAll('.settings').forEach((box) => {
      box.innerHTML = '';
      box.append(
        optionRow('연습 내용', Object.entries(C.MODES).map(([k, m]) => [k, m.label]), choice.mode, (mode) => change({ mode })),
        optionRow('시간', C.DURATIONS.map((s) => [s, s % 60 === 0 ? `${s / 60}분` : `${s}초`]), choice.duration, (duration) => change({ duration }), true),
        optionRow('경기 방식', [[false, '개인전'], [true, '팀전']], choice.teamMode, (teamMode) => change({ teamMode })),
      );
      if (choice.teamMode)
        box.append(
          optionRow('팀 수', C.TEAM_COUNTS.map((n) => [n, `${n}팀`]), choice.teamCount, (teamCount) => change({ teamCount }), true),
        );
    });
  }
  paintSettings();

  // ── 화면 그리기 ──────────────────────────────────
  function show(screen) {
    document.body.dataset.screen = screen;
    for (const id of ['entry', 'lobby', 'race', 'result']) $(id + 'Screen').hidden = id !== screen;
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
  const hash = (s) => [...String(s)].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);
  function render(s) {
    const previous = state;
    state = s;
    const host = s.me.host;
    document.body.classList.toggle('is-host', host);
    document.body.classList.toggle('spectator', !s.me.plays);
    $('roomBadge').hidden = false;
    $('roomBadgeCode').textContent = s.code;
    $('leaveButton').hidden = false;
    if (host && !previous) {
      Object.assign(choice, s.config);
      paintSettings();
    }
    if (s.phase === 'lobby') renderLobby(s, previous);
    else if (s.phase === 'running') renderRace(s);
    else renderResults(s);
  }
  function renderLobby(s, previous) {
    show('lobby');
    playMusic('lobby');
    document.body.classList.remove('fever');
    $('lobbyCode').textContent = s.code;
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
    $('myLobbyHint').textContent = teamMode && s.me.team === null ? '아래에서 들어갈 팀을 눌러요!' : '선생님이 출발을 누르면 달려요!';
    if (!teamMode) $('lobbyRacers').replaceChildren(...s.participants.map(item));
    else {
      $('teamColumns').style.setProperty('--teams', s.teams.length);
      $('teamColumns').replaceChildren(...s.teams.map((t) => {
        const col = document.createElement('div');
        col.className = 'team-col' + (s.me.team === t.index ? ' mine' : '') + (t.size >= C.TEAM_MAX ? ' full' : '');
        col.style.setProperty('--team-hue', t.hue);
        const head = document.createElement('button');
        head.type = 'button';
        head.className = 'team-head';
        head.innerHTML = '<b></b><span></span>';
        head.firstChild.textContent = `${t.emoji} ${t.name}팀`;
        head.lastChild.textContent = `${t.size}/${C.TEAM_MAX}`;
        head.disabled = !s.me.plays || s.me.team === t.index || t.size >= C.TEAM_MAX;
        head.onclick = () => action(async () => { render(await api('/rooms/' + code + '/team', { team: t.index })); sfx.join(); });
        const list = document.createElement('ul');
        list.className = 'lobby-racers';
        list.append(...s.participants.filter((p) => p.team === t.index).map(memberItem));
        for (let i = t.size; i < C.TEAM_MAX; i++) {
          const slot = document.createElement('li');
          slot.className = 'slot';
          slot.textContent = '빈 자리';
          list.append(slot);
        }
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
          while (next < s.teams.length && s.teams[next].size >= C.TEAM_MAX) next++;
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

  async function ensureItems(s) {
    if (s.items) { items = s.items; itemsRound = s.roundId; }
    if (itemsRound === s.roundId) return;
    const data = await api('/rooms/' + code + '?items=1');
    items = data.items || [];
    itemsRound = data.roundId;
  }
  let roundSeen = '';
  function renderRace(s) {
    show('race');
    playMusic('race');
    $('modeNow').textContent = C.MODES[s.config.mode].label;
    $('hostCode').textContent = s.code;
    if (roundSeen !== s.roundId) {
      roundSeen = s.roundId;
      localIndex = s.me.index;
      localScore = s.me.score;
      localCombo = s.me.combo;
      mistakesThis = 0;
      erroring = false;
      lastRank = null;
      prevScores.clear();
      parts.length = 0;
      $('track').innerHTML = '';
      input.value = '';
      document.body.classList.remove('fever');
      document.body.classList.toggle('sentence-mode', C.MODES[s.config.mode].sentence);
      $('typeHint').innerHTML = C.MODES[s.config.mode].sentence ? '다 치면 <kbd>Enter</kbd>' : '다 치면 <kbd>Space</kbd> 또는 <kbd>Enter</kbd>';
      ensureItems(s).then(paintWord).catch((e) => toast(e.message));
    }
    renderTeamBar(s);
    // 현황판(전체 트랙)은 교사 화면과 학생 화면 모두에 나온다.
    renderTrack(s);
    if (s.me.plays) {
      renderMini(s);
      $('scoreNow').textContent = Math.max(localScore, 0);
      const rank = s.me.rank;
      $('rankNow').textContent = rank ? rank + '위' : '-';
      if (lastRank && rank && rank !== lastRank) retrigger($('rankNow').parentElement, rank < lastRank ? 'rank-up' : 'rank-down');
      lastRank = rank;
      const leader = s.participants[0];
      const mineTeam = s.teams && s.me.team !== null ? s.teams[s.me.team] : null;
      const topTeam = s.teams?.find((t) => t.rank === 1);
      const unit = '점';
      if (mineTeam && topTeam?.value) {
        const second = s.teams.find((t) => t.rank === 2);
        $('chase').textContent = topTeam.index === mineTeam.index
          ? `${mineTeam.emoji} 우리 팀 1위!${second ? ` ${topTeam.value - second.value}${unit} 앞서는 중` : ''}`
          : `${topTeam.emoji} ${topTeam.name}팀까지 ${topTeam.value - mineTeam.value}${unit}! 힘내요!`;
      } else $('chase').textContent = !leader || !leader.score ? '' : leader.id === s.me.id
        ? (s.participants[1] ? `👑 1위 질주 중! 2위와 ${leader.score - s.participants[1].score}점 차이` : '👑 1위 질주 중!')
        : `${leader.racer} 1위까지 ${leader.score - s.me.score}점!`;
    }
  }
  // 팀전: 팀 점수 막대. 1위 팀 막대가 가장 길고 왕관을 쓴다.
  function renderTeamBar(s) {
    const bar = $('teamBar');
    bar.hidden = !s.teams;
    if (!s.teams) return;
    const shown = s.teams.filter((t) => t.size);
    const top = Math.max(1, ...shown.map((t) => t.value));
    bar.replaceChildren(...shown.map((t) => {
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
  function renderTrack(s) {
    const track = $('track');
    track.style.setProperty('--lanes', Math.max(s.participants.length, 1));
    const top = Math.max(60, ...s.participants.map((p) => p.score)) * 1.08;
    const ordered = [...s.participants].sort((a, b) => (a.team ?? 99) - (b.team ?? 99) || a.name.localeCompare(b.name, 'ko'));
    const teamOf = (p) => (s.teams && p.team !== null ? s.teams[p.team] : null);
    const alive = new Set();
    for (const p of ordered) {
      alive.add(p.id);
      let lane = track.querySelector(`[data-id="${p.id}"]`);
      if (!lane) {
        lane = document.createElement('div');
        lane.className = 'lane';
        lane.dataset.id = p.id;
        lane.innerHTML = '<span class="lane-rank"></span><span class="lane-name"></span><div class="road"><div class="car"><b class="car-score"></b></div><span class="flag">🏁</span></div>';
        lane.querySelector('.car').prepend(face(p, 'car-emoji'));
      }
      const team = teamOf(p);
      lane.style.setProperty('--hue', (team ? team.hue : hash(p.name) % 360) + 'deg');
      lane.classList.toggle('team-lane', Boolean(team));
      lane.querySelector('.lane-name').textContent = (team ? team.emoji + ' ' : '') + p.name;
      // 팀 순서대로 줄 세우되, 자리가 바뀔 때만 옮겨 차가 부드럽게 달리게 둔다.
      const slot = track.children[alive.size - 1];
      if (slot !== lane) track.insertBefore(lane, slot || null);
      lane.querySelector('.lane-rank').textContent = p.rank;
      lane.classList.toggle('leader', p.rank === 1 && p.score > 0);
      lane.classList.toggle('top3', p.rank <= 3 && p.score > 0);
      lane.classList.toggle('mine', p.id === s.me.id);
      lane.classList.toggle('fever', p.combo >= C.COMBO_CAP);
      lane.querySelector('.car').style.setProperty('--x', Math.min(1, p.score / top));
      lane.querySelector('.car-score').textContent = p.score;
      const before = prevScores.get(p.id) ?? p.score;
      if (p.score > before) {
        const pop = document.createElement('i');
        pop.className = 'car-pop';
        pop.textContent = '+' + (p.score - before);
        lane.querySelector('.car').append(pop);
        setTimeout(() => pop.remove(), 900);
      }
      prevScores.set(p.id, p.score);
    }
    track.querySelectorAll('.lane').forEach((lane) => { if (!alive.has(lane.dataset.id)) lane.remove(); });
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
      li.children[2].textContent = p.id === s.me.id ? Math.max(localScore, p.score) : p.score;
      li.children[0].after(face(p, 'mini-face'));
      return li;
    }));
  }

  function paintWord() {
    const target = items[localIndex] || '';
    const typed = [...normalized()];
    const chars = [...target];
    let done = 0;
    while (done < typed.length && done < chars.length && typed[done] === chars[done]) done++;
    // 낱말 단위로 묶어 줄이 글자 중간에서 끊기지 않게 한다.
    const groups = [];
    let group = null;
    chars.forEach((ch, i) => {
      const span = document.createElement('span');
      span.textContent = ch === ' ' ? ' ' : ch;
      span.className = i < done ? 'done' : i === done ? 'now' : '';
      if (ch === ' ') { groups.push(span); group = null; return; }
      if (!group) { group = document.createElement('span'); group.className = 'chunk'; groups.push(group); }
      group.append(span);
    });
    $('word').replaceChildren(...groups);
    $('card').classList.toggle('long', chars.length > 8);
    $('queue').replaceChildren(...items.slice(localIndex + 1, localIndex + (sentenceMode() ? 2 : 4)).map((w, i) => {
      const span = document.createElement('span');
      span.textContent = w;
      span.style.setProperty('--i', i);
      return span;
    }));
    paintCombo();
  }
  function paintCombo() {
    $('comboNow').textContent = localCombo;
    $('multiplierNow').textContent = 'x' + C.multiplier(localCombo).toFixed(1);
    document.body.classList.toggle('fever', localCombo >= C.COMBO_CAP);
    $('comboNow').parentElement.classList.toggle('hot', localCombo >= 5);
  }

  // ── 입력 ─────────────────────────────────────────
  const sentenceMode = () => Boolean(state && C.MODES[state.config.mode].sentence);
  function normalized() {
    const v = input.value.replace(/[\r\n]/g, '');
    return sentenceMode() ? v.replace(/^\s+/, '').replace(/\s+$/, (m) => (m.length > 1 ? ' ' : m)) : v.replace(/\s/g, '');
  }
  const racing = () => state?.phase === 'running' && state.me.plays && serverNow() >= state.startsAt && serverNow() <= state.deadline;
  function check(fromKey = false) {
    if (!racing()) return;
    const target = items[localIndex];
    if (!target) return;
    const value = normalized();
    const clean = sentenceMode() ? value.replace(/\s+$/, '') : value;
    if (lastCleared && Date.now() - lastCleared.at < 120 && value && lastCleared.text.endsWith(value)) {
      input.value = '';
      lastCleared = null;
      return paintWord();
    }
    if (clean === target && (!composing || fromKey)) return complete(target);
    const ok = C.onTrack(clean, target);
    if (!ok && !erroring) {
      erroring = true;
      mistakesThis++;
      sfx.bad();
      retrigger($('card'), 'shake');
      if (localCombo) floatAtCard('콤보 끊김', 'broken');
      localCombo = 0;
    } else if (ok) erroring = false;
    $('card').classList.toggle('wrong', !ok);
    paintWord();
  }
  function floatAtCard(text, cls) {
    const r = $('card').getBoundingClientRect();
    floatText(text, r.left + r.width / 2, r.top + 10, cls);
  }
  function complete(target) {
    const index = localIndex, mistakes = mistakesThis;
    localCombo = mistakes ? 0 : localCombo + 1;
    const gained = C.itemScore(target, localCombo);
    localScore += gained;
    localIndex++;
    mistakesThis = 0;
    erroring = false;
    lastCleared = { text: target, at: Date.now() };
    input.value = '';
    $('card').classList.remove('wrong');
    const r = $('card').getBoundingClientRect();
    burst(r.left + r.width / 2, r.top + r.height / 2, localCombo >= C.COMBO_CAP ? 44 : 24, localCombo >= C.COMBO_CAP ? 10 : 7);
    floatText('+' + gained, r.left + r.width / 2, r.top, localCombo >= C.COMBO_CAP ? 'fever' : '');
    if (localCombo && localCombo % 5 === 0) floatText(`${localCombo} 콤보!`, r.left + r.width / 2, r.top - 46, 'combo');
    sfx.good(localCombo);
    retrigger($('card'), 'pop');
    retrigger($('scoreNow'), 'bump');
    $('scoreNow').textContent = localScore;
    paintWord();
    const roundId = state.roundId;
    sendChain = sendChain.then(() => api('/rooms/' + code + '/type', { roundId, index, text: target, mistakes }))
      .then((data) => {
        if (state.roundId !== roundId) return;
        if (index === localIndex - 1) { localScore = data.state.me.score; localCombo = data.combo; paintCombo(); }
        render(data.state);
      })
      .catch(async (e) => {
        if (state.roundId !== roundId) return;
        toast(e.message);
        if (e.status === 409 || e.status === 429) {
          try {
            const fresh = await api('/rooms/' + code);
            localIndex = fresh.me.index;
            localScore = fresh.me.score;
            localCombo = fresh.me.combo;
            render(fresh);
            paintWord();
          } catch { /* 다음 확인 때 다시 맞춘다 */ }
        }
      });
  }
  input.addEventListener('compositionstart', () => (composing = true));
  input.addEventListener('compositionend', () => { composing = false; setTimeout(check, 0); });
  input.addEventListener('input', (e) => {
    composing = e.isComposing;
    if (e.inputType !== 'deleteContentBackward') sfx.key();
    check();
  });
  input.addEventListener('keydown', (e) => {
    const submitKey = e.key === 'Enter' || (!sentenceMode() && (e.key === ' ' || e.code === 'Space'));
    if (!submitKey) return;
    if (!e.isComposing) e.preventDefault();
    setTimeout(() => {
      check(true);
      if (normalized() && normalized() !== items[localIndex] && e.key === 'Enter' && !erroring) {
        retrigger($('card'), 'shake');
        sfx.bad();
      }
    }, 0);
  });
  for (const type of ['paste', 'drop', 'contextmenu']) input.addEventListener(type, (e) => e.preventDefault());
  $('raceScreen').addEventListener('pointerdown', (e) => { if (e.target !== input && racing()) setTimeout(() => input.focus(), 0); });

  // ── 결과 ─────────────────────────────────────────
  function renderResults(s) {
    show('result');
    input.blur();
    document.body.classList.remove('fever');
    const key = s.roundId + s.participants.map((p) => p.score).join(',');
    if (resultShown === key) return;
    const first = !resultShown.startsWith(s.roundId);
    resultShown = key;
    playMusic('lobby');
    if (first) setTimeout(() => confetti(), 200);
    const minutes = s.config.duration / 60;
    const teams = (s.teams || []).filter((t) => t.size).sort((a, b) => a.rank - b.rank);
    $('teamResult').hidden = !teams.length;
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
        card.children[3].textContent = `${t.size}명이 모은 점수`;
        card.children[4].append(...s.participants.filter((p) => p.team === t.index).map((p) => {
          const li = document.createElement('li');
          li.append(face(p, 'row-face'), `${p.name} ${p.score}`);
          return li;
        }));
        return card;
      }));
    }
    const order = [s.participants[1], s.participants[0], s.participants[2]];
    $('podium').replaceChildren(...order.map((p, i) => {
      const div = document.createElement('div');
      const place = [2, 1, 3][i];
      div.className = 'step place-' + place + (p ? '' : ' empty');
      div.style.setProperty('--delay', [0.5, 1.1, 0.2][i] + 's');
      if (p) {
        div.innerHTML = '<span class="pod-racer"></span><b class="pod-name"></b><span class="pod-score"></span><div class="block"></div>';
        div.querySelector('.pod-racer').append(face(p, 'pod-face'));
        if (place === 1) div.querySelector('.pod-racer').classList.add('crowned');
        div.querySelector('.pod-name').textContent = p.name;
        div.querySelector('.pod-score').textContent = p.score + '점';
      } else div.innerHTML = '<div class="block"></div>';
      div.querySelector('.block').textContent = place;
      return div;
    }));
    $('resultRows').replaceChildren(...s.participants.map((p) => {
      const tr = document.createElement('tr');
      tr.className = p.id === s.me.id ? 'mine' : '';
      const team = s.teams && p.team !== null ? s.teams[p.team] : null;
      for (const value of [p.rank, `${team ? team.emoji + ' ' : ''}${p.name}`, p.score, Math.round(p.strokes / minutes), p.accuracy + '%', p.bestCombo]) {
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
      : `${mine.racer} 나는 ${mine.rank}위! ${mine.score}점 · ${Math.round(mine.strokes / minutes)}타/분`;
  }

  // ── 시계 (카운트다운·남은 시간) ─────────────────────
  function clock() {
    requestAnimationFrame(clock);
    if (!state || state.phase !== 'running') {
      $('countdown').hidden = true;
      return;
    }
    const t = serverNow(), before = state.startsAt - t, left = state.deadline - t;
    if (before > 0) {
      const n = Math.ceil(before / 1000);
      $('countdown').hidden = false;
      if (shownCount !== n) {
        shownCount = n;
        $('countNum').textContent = n;
        retrigger($('countNum'), 'zoom');
        sfx.count();
      }
      input.disabled = true;
    } else if (goShown !== state.roundId) {
      goShown = state.roundId;
      shownCount = -1;
      $('countNum').textContent = 'GO!';
      retrigger($('countNum'), 'zoom');
      sfx.go();
      setTimeout(() => ($('countdown').hidden = true), 700);
      if (state.me.plays) { input.disabled = false; input.focus(); }
    }
    const sec = Math.max(0, Math.ceil(Math.min(left, state.config.duration * 1000) / 1000));
    if ($('timeLeft').textContent !== String(sec)) {
      $('timeLeft').textContent = sec;
      if (sec <= 10 && sec > 0 && before <= 0) { sfx.tick(); retrigger($('timeLeft'), 'bump'); }
    }
    document.body.classList.toggle('hurry', sec <= 10 && before <= 0);
    $('timeBar').style.transform = `scaleX(${Math.max(0, Math.min(1, left / (state.config.duration * 1000)))})`;
    if (left <= 0 && finishShown !== state.roundId) {
      finishShown = state.roundId;
      input.disabled = true;
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
    code = ''; token = ''; state = null; roundSeen = ''; resultShown = '';
    $('roomBadge').hidden = true;
    $('leaveButton').hidden = true;
    document.body.classList.remove('is-host', 'spectator', 'fever', 'hurry');
    show('entry');
    playMusic('lobby');
    history.replaceState(null, '', location.pathname);
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
    const data = await api('/rooms', { ...choice, spectate: isTeacher && $('spectateInput').checked, avatarUrl: await myAvatar });
    enter(data, data.state.code);
  });
  $('startButton').onclick = () => action(async () => render(await api('/rooms/' + code + '/start', choice)));
  $('againButton').onclick = () => action(async () => render(await api('/rooms/' + code + '/start', choice)));
  $('settingsButton').onclick = () => action(async () => render(await api('/rooms/' + code + '/lobby', {})));
  $('leaveButton').onclick = () => action(async () => {
    if (state?.me.host && !confirm('방을 닫으면 모두의 레이스가 끝나요. 닫을까요?')) return;
    try { await api('/rooms/' + code + '/leave', {}); } catch { /* 이미 닫힌 방 */ }
    leaveLocal();
  });

  const initial = new URLSearchParams(location.search).get('room') || '';
  if (/^\d{4}$/.test(initial)) join(initial);
  else playMusic('lobby'); // 방 만들기 화면
})();
