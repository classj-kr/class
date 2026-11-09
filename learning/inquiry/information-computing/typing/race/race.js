(async function () {
  'use strict';
  const C = window.TypingRaceCore;
  const $ = (id) => document.getElementById(id);
  const memory = new Map();
  let store = { get: (k) => memory.get(k), set: (k, v) => memory.set(k, v), remove: (k) => memory.delete(k) };
  try { if (window.SiteStorage) store = await window.SiteStorage.open('typing-race'); } catch { /* 게스트는 이 탭에서만 기억 */ }

  let code = '', token = '', state = null;
  // 낱말판: 서버가 주는 공용 판(board)과 막 바뀐 낱말(recent). 내가 막 친 칸은 답이 오기 전에도 친 것으로 둔다.
  let board = [], recent = [], claimedLocal = new Set(), targetId = null;
  let pollTimer = 0, failures = 0, busy = false, offset = 0;
  let localScore = 0, localCombo = 0, mistakesThis = 0, erroring = false;
  // skip: 칸 앞쪽에서 이미 받은 낱말이 차지한 글자 수. 조합 중인 칸은 비우지 않고(IME가 끝 글자를 다시 붙인다) 이만큼 건너뛰어 읽는다.
  let sendChain = Promise.resolve(), skip = 0, skipKeys = 0, composing = false, muted = false;
  let shownCount = -1, goShown = '', finishShown = '', resultShown = '', lastRank = null;
  const prevScores = new Map();
  const choice = { mode: 'ko-words', duration: 90, teamMode: false, teamCount: 2, teamSize: C.TEAM_SIZE_DEFAULT };
  const serverNow = () => Date.now() + offset;
  // 순위판에 띄울 학생 프로필 아바타(연산 순위전과 같은 곳). 없으면 동물 이모지가 대신 달린다.
  // 내 아바타: 학생은 학생 프로필, 선생님은 선생님 설정에 고른 아바타. 둘 다 없으면 동물 그림을 쓴다.
  const avatarOf = (path) => fetch(path, { cache: 'no-store', credentials: 'same-origin' })
    .then((r) => (r.ok ? r.json() : null))
    .then((data) => data?.profile?.avatar?.url || null)
    .catch(() => null);
  const myAvatar = avatarOf('/api/student/profile').then((url) => url || avatarOf('/api/teacher/settings'));
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
          optionRow('한 팀 인원', C.TEAM_SIZES.map((n) => [n, `${n}명`]), choice.teamSize, (teamSize) => change({ teamSize }), true),
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
      // 6팀까지는 한 줄, 7·8팀은 네 칸씩 두 줄.
      $('teamColumns').style.setProperty('--cols', s.teams.length <= 6 ? s.teams.length : Math.ceil(s.teams.length / 2));
      $('teamColumns').classList.toggle('many', s.teams.length > 6);
      const cap = s.config.teamSize || C.TEAM_SIZE_DEFAULT;
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
        for (let i = t.size; i < cap; i++) {
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

  let roundSeen = '';
  function renderRace(s) {
    show('race');
    playMusic('race');
    $('modeNow').textContent = C.MODES[s.config.mode].label;
    $('hostCode').textContent = s.code;
    if (roundSeen !== s.roundId) {
      roundSeen = s.roundId;
      claimedLocal = new Set();
      targetId = null;
      localScore = s.me.score;
      localCombo = s.me.combo;
      mistakesThis = 0;
      erroring = false;
      lastRank = null;
      prevScores.clear();
      prevTeams.clear();
      parts.length = 0;
      $('track').innerHTML = '';
      input.value = '';
      skip = 0;
      skipKeys = 0;
      paintTyped();
      document.body.classList.remove('fever');
      document.body.classList.toggle('sentence-mode', C.MODES[s.config.mode].sentence);
      $('board').replaceChildren();
    }
    if (s.board) {
      board = s.board;
      recent = s.recent || [];
      paintBoard();
      acceptIfDone();
    }
    renderTeamBar(s);
    // 현황판(전체 트랙)은 교사 화면과 학생 화면 모두에 나온다.
    renderTrack(s);
    if (s.me.plays) {
      renderMini(s);
      $('scoreNow').textContent = Math.max(localScore, 0);
      // 팀전이면 순위 칸과 앞지르기 알림은 우리 팀 기준이다(내 점수는 그대로).
      const mineTeam = s.teams && s.me.team !== null ? s.teams[s.me.team] : null;
      const rank = mineTeam ? mineTeam.rank : s.me.rank;
      $('rankNow').parentElement.querySelector('span').textContent = mineTeam ? '우리 팀' : '순위';
      $('rankNow').textContent = rank ? rank + '위' : '-';
      if (lastRank && rank && rank !== lastRank) {
        retrigger($('rankNow').parentElement, rank < lastRank ? 'rank-up' : 'rank-down');
        if (mineTeam && rank < lastRank && mineTeam.value > 0) {
          const r = $('rankNow').parentElement.getBoundingClientRect();
          floatText(rank === 1 ? `👑 ${mineTeam.emoji} 우리 팀이 1위로!` : `⬆️ 우리 팀 ${rank}위로!`, Math.max(Math.min(170, innerWidth / 2), Math.min(r.left + r.width / 2, innerWidth - 170)), r.bottom + 4, 'team-up');
        }
      }
      lastRank = rank;
      const leader = s.participants[0];
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
    bar.classList.toggle('many', shown.length > 4);
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
  // 팀전 트랙: 팀마다 큰 레인 하나. 팀 점수만큼 달리고, 팀원 아바타 모두가 한 차에 함께 탄다.
  const prevTeams = new Map();
  function renderTeamTrack(s) {
    const track = $('track');
    track.classList.add('team-track');
    track.querySelectorAll('.lane:not([data-team])').forEach((lane) => lane.remove());
    const teams = s.teams.filter((t) => t.size);
    track.style.setProperty('--lanes', Math.max(teams.length, 1));
    const top = Math.max(60, ...teams.map((t) => t.value)) * 1.08;
    const alive = new Set();
    teams.forEach((t, i) => {
      const id = String(t.index);
      alive.add(id);
      let lane = track.querySelector(`.lane[data-team="${id}"]`);
      if (!lane) {
        lane = document.createElement('div');
        lane.className = 'lane team-lane';
        lane.dataset.team = id;
        lane.innerHTML = '<span class="lane-rank"></span><span class="lane-name"><b></b><small></small></span><div class="road"><div class="car"><div class="crew"></div><b class="car-score"></b></div><span class="flag">🏁</span></div>';
      }
      // 팀원 차례는 이름순으로 고정한다(점수 순위가 바뀔 때마다 얼굴이 자리를 바꾸지 않게).
      const members = s.participants.filter((p) => p.team === t.index).sort((a, b) => a.name.localeCompare(b.name, 'ko'));
      const crew = lane.querySelector('.crew');
      const crewKey = members.map((p) => p.id + (p.avatarUrl || p.racer)).join('|');
      if (crew.dataset.key !== crewKey) {
        crew.dataset.key = crewKey;
        crew.replaceChildren(...members.map((p) => {
          const f = face(p, 'car-emoji crew-face' + (p.id === s.me.id ? ' me' : ''));
          f.title = p.name;
          return f;
        }));
      }
      crew.dataset.size = members.length > 6 ? 'many' : members.length > 4 ? 'some' : 'few';
      lane.style.setProperty('--hue', t.hue + 'deg');
      lane.querySelector('.lane-name b').textContent = `${t.emoji} ${t.name}팀`;
      lane.querySelector('.lane-name small').textContent = `${t.size}명`;
      if (track.children[i] !== lane) track.insertBefore(lane, track.children[i] || null);
      lane.querySelector('.lane-rank').textContent = t.rank;
      lane.classList.toggle('leader', t.rank === 1 && t.value > 0);
      lane.classList.toggle('top3', t.rank <= 3 && t.value > 0);
      lane.classList.toggle('mine', s.me.team === t.index);
      lane.classList.toggle('fever', members.some((p) => p.combo >= C.COMBO_CAP));
      lane.querySelector('.car').style.setProperty('--x', Math.min(1, t.value / top));
      lane.querySelector('.car-score').textContent = t.value;
      const before = prevTeams.get(id) ?? t.value;
      if (t.value > before) {
        const pop = document.createElement('i');
        pop.className = 'car-pop';
        pop.textContent = '+' + (t.value - before);
        lane.querySelector('.car').append(pop);
        setTimeout(() => pop.remove(), 900);
        retrigger(crew, 'hop');
      }
      prevTeams.set(id, t.value);
    });
    track.querySelectorAll('.lane[data-team]').forEach((lane) => { if (!alive.has(lane.dataset.team)) lane.remove(); });
  }
  function renderTrack(s) {
    if (s.teams) return renderTeamTrack(s);
    const track = $('track');
    track.classList.remove('team-track');
    track.querySelectorAll('.lane[data-team]').forEach((lane) => lane.remove());
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
    // 팀전이면 작은 순위표도 팀 순위다.
    if (s.teams) {
      const teams = s.teams.filter((t) => t.size).sort((a, b) => a.rank - b.rank);
      $('miniBoard').replaceChildren(...teams.map((t) => {
        const li = document.createElement('li');
        li.className = 'team-line' + (s.me.team === t.index ? ' mine' : '');
        li.style.setProperty('--team-hue', t.hue);
        li.innerHTML = '<em></em><span class="mini-team"></span><b></b><strong></strong>';
        li.children[0].textContent = t.rank;
        li.children[1].textContent = t.emoji;
        li.children[2].textContent = `${t.name}팀 ${t.size}명`;
        li.children[3].textContent = t.value;
        return li;
      }));
      return;
    }
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

  // ── 낱말판 그리기 ── 칸마다 지금 치면 받을 점수(타수×콤보 + 먼저 친 순서 보너스)를 크게 단다.
  // 아무도 안 친 낱말은 금빛(🥇 1등 +5), 한 명이 치면 은빛(🥈 +3), 두 명이면 동빛(🥉 +1), 그 뒤는 흐린 칸(낱말 점수만).
  const MEDALS = ['🥇', '🥈', '🥉'];
  const TIERS = ['gold', 'silver', 'bronze'];
  const mineOf = (cell) => cell.mine || (claimedLocal.has(cell.id) ? 1 : 0);
  const open = () => [...board, ...recent].filter((cell) => !mineOf(cell));
  // 실수 없이 다음 낱말을 치면 콤보가 하나 오른다(실수가 있으면 콤보 0으로 센다). 서버와 같은 셈.
  const nextCombo = () => (mistakesThis ? 0 : localCombo + 1);
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
  function paintBoard() {
    const box = $('board');
    const typed = normalized();
    box.classList.toggle('sentence', sentenceMode());
    const alive = new Set(board.map((cell) => String(cell.id)));
    // 바뀐 칸: 옛 낱말은 제자리에서 터지듯 사라지고 새 낱말이 위에서 떨어진다.
    box.querySelectorAll('.tile').forEach((tile) => { if (!alive.has(tile.dataset.id)) leave(tile); });
    const dealing = !box.children.length;
    board.forEach((cell, i) => {
      let tile = box.querySelector(`.tile[data-id="${cell.id}"]`);
      if (!tile) {
        tile = document.createElement('div');
        tile.className = 'tile fresh-in';
        tile.dataset.id = cell.id;
        tile.style.animationDelay = dealing ? i * 70 + 'ms' : '140ms';
        tile.innerHTML = '<span class="tile-badge"><b class="tile-medal"></b><b class="tile-points"></b></span><span class="tile-word"></span><span class="tile-who"></span><i class="tile-timer"></i>';
        setTimeout(() => { tile.classList.remove('fresh-in'); tile.style.animationDelay = ''; }, 1000);
      }
      if (box.children[i] !== tile) box.insertBefore(tile, box.children[i] || null);
      const mine = mineOf(cell), count = Math.max(cell.count, mine ? 1 : 0);
      const tier = mine ? 'done' : TIERS[count] || 'plain';
      // 다른 친구가 먼저 쳐서 한 단계 내려간 칸은 번쩍인다.
      if (tile.dataset.tier && tile.dataset.tier !== tier && tier !== 'done') retrigger(tile, 'hit');
      tile.dataset.tier = tier;
      tile.classList.toggle('target', cell.id === targetId);
      tile.querySelector('.tile-medal').textContent = mine ? '✓' : MEDALS[count] || '';
      const points = tile.querySelector('.tile-points');
      const label = mine ? (mine <= 3 ? mine + '등' : '') : '+' + C.claimScore(cell.text, nextCombo(), count + 1);
      if (points.textContent !== label) {
        if (points.textContent && !mine) retrigger(points, 'tick');
        points.textContent = label;
      }
      // 친 낱말에서는 지금 친 글자까지 초록으로 칠한다.
      const word = tile.querySelector('.tile-word');
      const chars = [...cell.text];
      let done = 0;
      if (cell.id === targetId) { const t = [...typed]; while (done < t.length && t[done] === chars[done]) done++; }
      word.replaceChildren(...chars.map((ch, k) => {
        const span = document.createElement('span');
        span.textContent = ch;
        if (cell.id === targetId) span.className = k < done ? 'ok' : k === done ? 'now' : '';
        return span;
      }));
      const who = tile.querySelector('.tile-who');
      const claimKey = (cell.claims || []).map((c) => c.id).join(',');
      if (who.dataset.key !== claimKey) {
        const before = new Set((who.dataset.key || '').split(','));
        who.dataset.key = claimKey;
        who.replaceChildren(...(cell.claims || []).map((c) => face(c, 'tile-face' + (before.has(c.id) ? '' : ' new'))));
      }
      // 첫 사람이 친 뒤 남은 시간: 막대가 줄어들다 낱말이 바뀐다.
      const timer = tile.querySelector('.tile-timer');
      if (count && !timer.dataset.on) { timer.dataset.on = '1'; timer.style.animationDuration = C.HOLD_MS + 'ms'; }
    });
    paintCombo();
  }
  // 판에서 빠지는 칸: 제자리를 지킨 채(카드 위에 겹쳐) 부풀며 사라진다. 그 밑으로 새 칸이 떨어진다.
  function leave(tile) {
    const card = $('card');
    if (reduceMotion.matches || !tile.offsetWidth) return tile.remove();
    const c = card.getBoundingClientRect(), r = tile.getBoundingClientRect();
    tile.classList.remove('target', 'fresh-in', 'claim', 'hit');
    tile.classList.add('ghost');
    Object.assign(tile.style, { left: r.left - c.left - card.clientLeft + 'px', top: r.top - c.top - card.clientTop + 'px', width: r.width + 'px', height: r.height + 'px' });
    card.append(tile);
    setTimeout(() => tile.remove(), 500);
  }
  // 친 낱말이 내 로켓(아래 트랙의 내 줄)으로 날아간다. 내 줄이 화면 밖이면 오른쪽 순위표의 내 줄, 그것도 없으면 점수 칸으로.
  function fly(text, from) {
    if (reduceMotion.matches) return;
    const visible = (el) => {
      const r = el?.getBoundingClientRect();
      return r && r.width && r.top >= 0 && r.bottom <= innerHeight ? r : null;
    };
    // 팀전이면 우리 팀 차에 탄 내 아바타로 날아간다.
    const car = $('track').querySelector('.lane.mine .car-emoji.me') || $('track').querySelector('.lane.mine:not(.team-lane) .car-emoji');
    const to = visible(car) || visible($('miniBoard').querySelector('li.mine .mini-face')) || $('scoreNow').getBoundingClientRect();
    const el = document.createElement('span');
    el.className = 'fly-word' + ([...text].length > 8 ? ' long' : '');
    el.textContent = text;
    const x0 = from.left + from.width / 2, y0 = from.top + from.height / 2;
    const dx = to.left + to.width / 2 - x0, dy = to.top + to.height / 2 - y0;
    el.style.left = x0 + 'px';
    el.style.top = y0 + 'px';
    document.body.append(el);
    const at = (fx, fy, scale, turn) => `translate(-50%, -50%) translate(${dx * fx}px, ${dy * fy}px) scale(${scale}) rotate(${turn}deg)`;
    const motion = el.animate([
      { transform: at(0, 0, 1, 0), opacity: 1 },
      { transform: at(0.2, 0.08, 1.25, -6), opacity: 1, offset: 0.3 },
      { transform: at(1, 1, 0.3, 10), opacity: 0.35 },
    ], { duration: 620, easing: 'cubic-bezier(.55, 0, .8, .3)' });
    motion.onfinish = () => {
      el.remove();
      burst(x0 + dx, y0 + dy, 14, 4);
      const rocket = car?.closest('.crew') || car?.closest('.car');
      if (rocket && visible(car)) retrigger(rocket, rocket.classList.contains('crew') ? 'hop' : 'boost');
    };
  }
  function paintCombo() {
    $('comboNow').textContent = localCombo;
    $('multiplierNow').textContent = 'x' + C.multiplier(localCombo).toFixed(1);
    document.body.classList.toggle('fever', localCombo >= C.COMBO_CAP);
    $('comboNow').parentElement.classList.toggle('hot', localCombo >= 5);
  }

  // ── 입력 ─────────────────────────────────────────
  const sentenceMode = () => Boolean(state && C.MODES[state.config.mode].sentence);
  // 화면에 보이는 입력 글자: 받은 낱말 몫(skip)을 뺀 나머지. 실제 칸 글자는 투명하고 위에 이것만 그린다.
  // 영어 판은 친 키 줄로 읽는다: 한/영 키가 한글이라 ㅈ댜홋처럼 찍혀도 weight로 받는다(칸은 건드리지 않는다).
  const englishBoard = () => Boolean(state && C.MODES[state.config.mode].lang === 'en');
  let enNoted = '';
  // 칸이 잠깐 짧아져도(입력기가 받침을 떼어 다음 글자로 옮기는 사이) 경계는 그대로 둔다. 지우기 키를 눌렀을 때만 줄인다(shrinkSkip).
  function typedText() {
    if (!englishBoard()) return input.value.slice(Math.min(skip, input.value.length));
    const stream = C.keysFromHangul(input.value);
    if (stream !== input.value && enNoted !== state.roundId) { enNoted = state.roundId; toast('한/영 키가 한글로 되어 있어서 영어로 바꿔 받고 있어요.'); }
    return stream.slice(Math.min(skipKeys, stream.length));
  }
  function shrinkSkip() {
    skip = Math.min(skip, input.value.length);
    skipKeys = Math.min(skipKeys, C.keysFromHangul(input.value).length);
  }
  function paintTyped() { $('typed').textContent = typedText().replace(/[\r\n]/g, ''); }
  // 조합이 끝난 뒤에만 받은 낱말 몫을 칸에서 실제로 지운다. 영어 판은 받은 키 수가 글자 경계와 맞을 때만 자른다
  // (받침이 다음 글자로 넘어가 한 글자에 두 낱말의 키가 섞여 있으면 그대로 둔다).
  function tidy() {
    if (!skip || composing) return;
    if (!englishBoard()) { if (input.value.length >= skip) { input.value = input.value.slice(skip); skip = 0; skipKeys = 0; } return; }
    for (let cut = 0; cut <= input.value.length; cut++) {
      if (C.keysFromHangul(input.value.slice(0, cut)).length !== skipKeys) continue;
      input.value = input.value.slice(cut);
      skip = 0; skipKeys = 0;
      return;
    }
  }
  function normalized() {
    const v = typedText().replace(/[\r\n]/g, '');
    return sentenceMode() ? v.replace(/^\s+/, '').replace(/\s+$/, (m) => (m.length > 1 ? ' ' : m)) : v.replace(/\s/g, '');
  }
  const racing = () => state?.phase === 'running' && state.me.plays && serverNow() >= state.startsAt && serverNow() <= state.deadline;
  // 친 글자와 맞는 낱말들. "사"와 "사과"처럼 더 긴 낱말이 함께 맞으면 longer.
  function matches(clean) {
    const tracking = open().filter((cell) => C.onTrack(clean, cell.text));
    const exact = tracking.find((cell) => cell.text === clean);
    return { tracking, exact, longer: tracking.some((cell) => cell.text !== clean) };
  }
  const cleaned = () => (sentenceMode() ? normalized().replace(/\s+$/, '') : normalized());
  function check(fromKey = false) {
    paintTyped();
    if (!racing() || muted) return;
    const clean = cleaned();
    if (!clean) { targetId = null; erroring = false; $('card').classList.remove('wrong'); return paintBoard(); }
    // 치는 중인 낱말: 지금 고른 낱말이 계속 맞으면 그대로, 아니면 맞는 낱말 가운데 판 앞쪽 것.
    const { tracking, exact, longer } = matches(clean);
    const keep = tracking.find((cell) => cell.id === targetId);
    targetId = (keep || exact || tracking[0])?.id ?? null;
    // 다 친 순간 바로 받는다. Space·Enter는 누르지 않아도 되고, 마지막 글자가 아직 조합 중이어도 된다.
    // 더 긴 낱말이 함께 맞을 때만 다음 키(Space·Enter)를 기다린다. 서버가 그런 낱말을 판에 함께 두지 않으므로 거의 없다.
    if (exact && (!longer || fromKey)) return complete(exact);
    const ok = tracking.length > 0;
    if (!ok && !erroring) {
      erroring = true;
      mistakesThis++;
      sfx.bad();
      retrigger($('card'), 'shake');
      if (localCombo) floatAtCard('콤보 끊김', 'broken');
      localCombo = 0;
    } else if (ok) erroring = false;
    $('card').classList.toggle('wrong', !ok);
    paintBoard();
  }
  // 판이 바뀌어 더 긴 낱말이 빠지면, 기다리던 짧은 낱말을 그때 받는다.
  function acceptIfDone() {
    if (!racing() || muted || !typedText()) return;
    const { exact, longer } = matches(cleaned());
    if (exact && !longer) complete(exact);
  }
  // 다 친 낱말을 칸에서 지운다. 끝 글자가 아직 조합 중이면 칸을 건드리지 않고(비우면 IME가 그 글자를 다시 붙여
  // 앞 낱말 끝 글자가 남는다) 그 길이만큼 건너뛰어 읽는다. 조합이 끝나면 tidy()가 실제로 지운다.
  function clearField() {
    if (composing && document.activeElement === input) { skip = input.value.length; skipKeys = C.keysFromHangul(input.value).length; }
    else { input.value = ''; skip = 0; skipKeys = 0; }
    paintTyped();
  }
  function floatAtCard(text, cls) {
    const r = $('card').getBoundingClientRect();
    floatText(text, r.left + r.width / 2, r.top + 10, cls);
  }
  function complete(cell) {
    const mistakes = mistakesThis, text = cell.text;
    const guessOrder = Math.max(cell.count || 0, 0) + 1;
    localCombo = mistakes ? 0 : localCombo + 1;
    const guess = C.claimScore(text, localCombo, guessOrder);
    localScore += guess;
    mistakesThis = 0;
    erroring = false;
    claimedLocal.add(cell.id);
    targetId = null;
    clearField();
    $('card').classList.remove('wrong');
    const tile = $('board').querySelector(`.tile[data-id="${cell.id}"]`);
    const r = (tile || $('card')).getBoundingClientRect();
    burst(r.left + r.width / 2, r.top + r.height / 2, localCombo >= C.COMBO_CAP ? 44 : 24, localCombo >= C.COMBO_CAP ? 10 : 7);
    sfx.good(localCombo);
    fly(text, r);
    if (tile) retrigger(tile, 'claim');
    $('scoreNow').textContent = localScore;
    paintBoard();
    const roundId = state.roundId;
    sendChain = sendChain.then(() => api('/rooms/' + code + '/type', { roundId, slot: cell.id, text, mistakes }))
      .then((data) => {
        if (state.roundId !== roundId) return;
        // 몇 등이었는지는 서버가 정한다: 1등 +5, 2등 +3, 3등 +1. 칸에 붙어 있던 점수와 같은 셈의 수가 뜬다.
        floatText(data.order <= 3 ? `${MEDALS[data.order - 1]} ${data.order}등 +${data.gained}` : `+${data.gained}`, r.left + r.width / 2, r.top, ['fever', 'silver', 'bronze'][data.order - 1] || '');
        if (localCombo && localCombo % 5 === 0) floatText(`${localCombo} 콤보!`, r.left + r.width / 2, r.top - 44, 'combo');
        localScore = data.state.me.score;
        localCombo = data.combo;
        retrigger($('scoreNow'), 'bump');
        render(data.state);
      })
      .catch(async (e) => {
        if (state.roundId !== roundId) return;
        claimedLocal.delete(cell.id);
        toast(e.message);
        try {
          const fresh = await api('/rooms/' + code);
          localScore = fresh.me.score;
          localCombo = fresh.me.combo;
          render(fresh);
        } catch { /* 다음 확인 때 다시 맞춘다 */ }
      });
  }
  input.addEventListener('compositionstart', () => { if (!muted) composing = true; });
  input.addEventListener('compositionend', () => { if (muted) return; composing = false; setTimeout(() => { tidy(); check(); }, 0); });
  // 한글 판인데 한/영 키가 영어로 되어 있으면, 친 키를 두벌식 한글로 바꿔 받는다(애들이 한/영 때문에 막히지 않게).
  let hanEnNoted = '';
  function fixHanEn() {
    if (!state || C.MODES[state.config.mode].lang !== 'ko' || !/[A-Za-z]/.test(typedText())) return;
    input.value = input.value.slice(0, skip) + C.hangulFromKeys(input.value.slice(skip));
    if (hanEnNoted !== state.roundId) { hanEnNoted = state.roundId; toast('한/영 키가 영어로 되어 있어서 한글로 바꿔 받고 있어요.'); }
  }
  input.addEventListener('input', (e) => {
    if (muted) return;
    composing = e.isComposing;
    if (e.inputType?.startsWith('delete')) shrinkSkip();
    if (!composing) { tidy(); fixHanEn(); }
    if (e.inputType !== 'deleteContentBackward') sfx.key();
    check();
  });
  input.addEventListener('keydown', (e) => {
    const submitKey = e.key === 'Enter' || (!sentenceMode() && (e.key === ' ' || e.code === 'Space'));
    if (!submitKey) return;
    if (!e.isComposing) e.preventDefault();
    setTimeout(() => {
      check(true);
      if (normalized() && !open().some((cell) => cell.text === normalized()) && e.key === 'Enter' && !erroring) {
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
    const teams = (s.teams || []).filter((t) => t.size).sort((a, b) => a.rank - b.rank);
    $('teamResult').hidden = !teams.length;
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
    // 팀전이면 시상대에 1·2·3위 팀이 올라간다(팀원 모두가 단 위에 서고, 단 색은 팀 색). 개인 순위는 아래 표에만.
    const podium = $('podium');
    $('soloTitle').hidden = true;
    if (teams.length) {
      $('teamResult').before(podium);
      podium.classList.add('team-podium');
      podium.replaceChildren(...[teams[1], teams[0], teams[2]].map((t, i) => {
        const div = document.createElement('div');
        div.className = 'step place-' + [2, 1, 3][i] + (t ? '' : ' empty');
        div.style.setProperty('--delay', [0.5, 1.1, 0.2][i] + 's');
        if (t) {
          div.style.setProperty('--team-hue', t.hue);
          div.innerHTML = '<span class="pod-racer pod-team"></span><div class="block"><b class="pod-place"></b><b class="pod-name"></b><span class="pod-score"></span></div>';
          const members = s.participants.filter((p) => p.team === t.index);
          const crew = div.querySelector('.pod-team');
          crew.dataset.size = members.length > 6 ? 'many' : members.length > 4 ? 'some' : 'few';
          crew.append(...members.map((p) => face(p, 'pod-face')));
          if (t.rank === 1) crew.classList.add('crowned');
          div.querySelector('.pod-name').textContent = `${t.emoji} ${t.name}팀`;
          div.querySelector('.pod-score').textContent = t.value + '점';
        } else div.innerHTML = '<div class="block"><b class="pod-place"></b></div>';
        div.querySelector('.pod-place').textContent = t ? t.rank : [2, 1, 3][i];
        return div;
      }));
    } else {
      $('soloTitle').after(podium);
      podium.classList.remove('team-podium');
    }
    const order = [s.participants[1], s.participants[0], s.participants[2]];
    if (!teams.length) podium.replaceChildren(...order.map((p, i) => {
      const div = document.createElement('div');
      const place = [2, 1, 3][i];
      div.className = 'step place-' + place + (p ? '' : ' empty');
      div.style.setProperty('--delay', [0.5, 1.1, 0.2][i] + 's');
      if (p) {
        // 아바타는 단 위에 바로 서고 이름·점수는 단 안에 적는다(사이가 비면 공중에 떠 보인다).
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
      for (const value of [p.rank, `${team ? team.emoji + ' ' : ''}${p.name}`, p.score, p.accuracy + '%', p.bestCombo]) {
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
      : `${mine.avatarUrl ? '' : mine.racer + ' '}나는 ${mine.rank}위! ${mine.score}점`;
  }

  // ── 시계 (카운트다운·남은 시간) ─────────────────────
  function clock() {
    requestAnimationFrame(clock);
    if (!state || state.phase !== 'running') {
      $('countdown').hidden = true;
      return;
    }
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
