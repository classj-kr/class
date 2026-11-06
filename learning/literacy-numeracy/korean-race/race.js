(async function () {
  'use strict';
  const C = window.KoreanRaceCore;
  const $ = (id) => document.getElementById(id);
  const memory = new Map();
  let store = { get: (k) => memory.get(k), set: (k, v) => memory.set(k, v), remove: (k) => memory.delete(k) };
  try { if (window.SiteStorage) store = await window.SiteStorage.open('korean-race'); } catch { /* 게스트는 이 탭에서만 기억 */ }

  const params = new URLSearchParams(location.search);
  let code = '', token = '', state = null;
  let pollTimer = 0, failures = 0, busy = false, offset = 0;
  // 지금 화면에 띄운 문제. 답을 보내거나 풀이를 보여 주는 동안에는 폴링이 바꾸지 않는다.
  let shown = null, answering = false, revealUntil = 0, revealTimer = 0, readyAt = 0, readTimer = 0;
  let localScore = 0, localCombo = 0, lastRank = null, lastFloor = 0;
  let shownCount = -1, goShown = '', finishShown = '', resultShown = '', roundSeen = '';
  const prevScores = new Map();
  const fromSet = C.SETS[params.get('set')] ? params.get('set') : 'spelling';
  const choice = { set: fromSet, level: C.validLevel(fromSet, params.get('level')), duration: 90, teamMode: false, teamCount: 2 };
  const serverNow = () => Date.now() + offset;
  // 들어온 학습 화면으로 돌아간다(방번호로 온 학생은 메인으로).
  if (params.get('set') && C.SETS[fromSet].app) $('backLink').href = C.SETS[fromSet].app + '/';
  const myAvatar = fetch('/api/student/profile', { cache: 'no-store', credentials: 'same-origin' })
    .then((r) => (r.ok ? r.json() : null))
    .then((data) => data?.profile?.avatar?.url || null)
    .catch(() => null);
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

  // ── 설정 버튼 ────────────────────────────────────
  function optionRow(label, entries, current, pick, small = false) {
    const field = document.createElement('fieldset');
    field.className = 'setting-field';
    const legend = document.createElement('legend');
    legend.textContent = label;
    const row = document.createElement('div');
    row.className = 'option-row';
    for (const [value, text] of entries) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'option' + (small ? ' small' : '') + (current === value ? ' on' : '');
      b.textContent = text;
      b.setAttribute('aria-pressed', String(current === value));
      b.onclick = () => pick(value);
      row.append(b);
    }
    field.append(legend, row);
    return field;
  }
  function change(patch) {
    if (patch.set) patch.level = C.validLevel(patch.set, choice.level);
    Object.assign(choice, patch);
    paintSettings();
    if (code && state?.me.host && state.phase !== 'running')
      action(async () => render(await api('/rooms/' + code + '/settings', choice)));
  }
  function paintSettings() {
    document.querySelectorAll('.settings').forEach((box) => {
      box.innerHTML = '';
      box.append(optionRow('문제', Object.entries(C.SETS).map(([k, s]) => [k, `${s.emoji} ${s.label}`]), choice.set, (set) => change({ set })));
      const levels = C.levelsOf(choice.set);
      if (levels) box.append(optionRow('수준', levels, choice.level, (level) => change({ level }), true));
      box.append(
        optionRow('시간', C.DURATIONS.map((s) => [s, s % 60 === 0 ? `${s / 60}분` : `${s}초`]), choice.duration, (duration) => change({ duration }), true),
        optionRow('경기 방식', [[false, '개인전'], [true, '팀전']], choice.teamMode, (teamMode) => change({ teamMode })),
      );
      if (choice.teamMode) box.append(optionRow('팀 수', C.TEAM_COUNTS.map((n) => [n, `${n}팀`]), choice.teamCount, (teamCount) => change({ teamCount }), true));
    });
  }
  paintSettings();
  function setName(config) {
    const set = C.SETS[config.set];
    const level = (C.levelsOf(config.set) || []).find(([v]) => v === config.level);
    return `${set.emoji} ${set.label}${level && level[0] !== 'all' ? ' · ' + level[1] : ''}`;
  }

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
  function render(s) {
    const previous = state;
    state = s;
    const host = s.me.host;
    document.body.classList.toggle('is-host', host);
    document.body.classList.toggle('spectator', !s.me.plays);
    $('roomBadge').hidden = false;
    $('roomBadgeCode').textContent = s.code;
    $('leaveButton').hidden = false;
    $('stopButton').hidden = !(host && s.phase === 'running');
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
    document.body.classList.remove('fever', 'hurry');
    $('lobbyCode').textContent = s.code;
    $('lobbySet').textContent = setName(s.config);
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

  function renderRace(s) {
    show('race');
    playMusic('race');
    $('modeNow').textContent = setName(s.config);
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
  }
  function paintMine(s) {
    renderMini(s);
    paintBlocks(s.me.blocks, s.me.correct);
    $('scoreNow').textContent = localScore;
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
  function paintCombo() {
    $('comboNow').textContent = localCombo;
    $('worthNow').textContent = `한 문제 +${C.points(localCombo + 1)}`;
    document.body.classList.toggle('fever', localCombo >= 10);
    $('comboNow').parentElement.classList.toggle('hot', localCombo >= 4);
    const worth = C.points(localCombo + 1);
    $('qStamp').hidden = worth < 2;
    $('qStamp').textContent = '+' + worth;
  }
  // 내 글자 탑: 맞힌 낱말의 첫 글자가 블록이 되어 쌓인다. 열 개면 한 층.
  function paintBlocks(blocks, correct) {
    const box = $('myBlocks');
    const visible = blocks.slice(-30);
    if (box.dataset.count !== String(correct)) {
      const grew = Number(box.dataset.count || 0) < correct;
      box.dataset.count = correct;
      box.replaceChildren(...visible.map((ch, i) => {
        const b = document.createElement('i');
        b.textContent = ch;
        b.style.setProperty('--hue', (hash(ch) % 360) + 'deg');
        if (grew && i === visible.length - 1) b.className = 'drop';
        return b;
      }));
    }
    const floor = Math.floor(correct / C.FLOOR);
    $('floorNow').textContent = floor ? `${floor}층` : '';
    if (floor > lastFloor) { banner(`🧱 ${floor}층 완성!`); sfx.floor(); }
    lastFloor = floor;
  }

  // ── 문제와 보기 ───────────────────────────────────
  function paintQuestion(q) {
    if (shown && q && shown.no === q.no) return;
    shown = q;
    const card = $('card');
    $('reveal').hidden = true;
    card.classList.remove('right', 'wrong', 'shake');
    if (!q) {
      $('qLabel').textContent = '';
      $('qNo').textContent = '';
      $('qAsk').textContent = '';
      $('qText').textContent = '준비한 문제를 모두 풀었어요! 결과를 기다려요.';
      $('choices').replaceChildren();
      return;
    }
    card.dataset.set = q.set;
    $('qLabel').textContent = C.SETS[q.set].emoji + ' ' + q.label;
    $('qNo').textContent = `${q.no + 1}번째 문제`;
    $('qAsk').textContent = q.ask;
    // 맞춤법 문장의 빈칸(___)은 칸으로 그린다.
    const text = $('qText');
    text.replaceChildren(...String(q.text).split(/_{2,}/).flatMap((part, i) => {
      const nodes = [];
      if (i) { const blank = document.createElement('span'); blank.className = 'blank'; nodes.push(blank); }
      nodes.push(document.createTextNode(part));
      return nodes;
    }));
    text.classList.toggle('word', q.set === 'vocabulary');
    text.classList.toggle('long', String(q.text).length > 60);
    $('choices').dataset.count = q.choices.length;
    const tried = new Set(q.tried || []);
    $('choices').replaceChildren(...q.choices.map((label, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'choice' + (tried.has(i) ? ' is-wrong' : '');
      b.disabled = tried.has(i);
      b.innerHTML = '<kbd></kbd><span></span>';
      b.firstChild.textContent = i + 1;
      b.lastChild.textContent = label;
      b.onclick = () => answer(i);
      return b;
    }));
    retrigger(card, 'enter');
    // 문제를 읽을 짧은 시간 동안은 보기를 누를 수 없다(서버도 같은 시간을 지킨다).
    readyAt = Date.now() + C.MIN_ANSWER_MS;
    $('choices').classList.add('reading');
    clearTimeout(readTimer);
    readTimer = setTimeout(() => $('choices').classList.remove('reading'), C.MIN_ANSWER_MS);
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
          burst(r.left + r.width / 2, r.top + r.height / 3, localCombo >= 10 ? 40 : 22, localCombo >= 10 ? 9 : 6);
          floatText('+' + data.gained, r.left + r.width / 2, r.top, data.gained >= 3 ? 'mega' : data.gained >= 2 ? 'big' : '');
          if (localCombo && localCombo % 5 === 0) banner(`🔥 ${localCombo}문제 연속!`);
          sfx.good(localCombo);
          retrigger($('scoreNow'), 'bump');
          // 여러 번 만에 맞혔으면 풀이를 잠깐 보여 주고 넘어간다.
          if (data.retried && data.explain) {
            $('revealTitle').textContent = '맞았어요! ' + q.choices[data.answer];
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
    const top = Math.max(20, ...s.participants.map((p) => p.score)) * 1.1;
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
    document.body.classList.remove('fever', 'hurry');
    clearTimeout(revealTimer);
    const key = s.roundId + s.participants.map((p) => p.score).join(',');
    if (resultShown === key) return;
    const first = !resultShown.startsWith(s.roundId);
    resultShown = key;
    playMusic('lobby');
    if (first) setTimeout(() => confetti(), 200);
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
        card.children[3].textContent = `${t.size}명 · 맞힌 문제 ${t.correct}개`;
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
      : `${mine.racer} 나는 ${mine.rank}위! ${mine.score}점 · ${mine.correct}문제 맞힘 · 정답률 ${mine.accuracy}%`;
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
    document.body.classList.remove('is-host', 'spectator', 'fever', 'hurry');
    show('entry');
    playMusic('lobby');
    history.replaceState(null, '', location.pathname + (params.get('set') ? '?set=' + fromSet : ''));
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
