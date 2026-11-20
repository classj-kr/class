(function () {
  'use strict';
  // 전시실 순위전 「작품 찾아 달리기」 화면.
  // 단서가 나오면 전시실을 달려 그 작품 앞에서 누른다. 문제 창으로 화면을 가리지 않고, 친구들이 뛰어다니는 모습이 그대로 보인다.
  // 서버(museum-race.js)가 판을 진행하고 채점한다. 여기서는 받은 상태를 그리기만 한다.
  window.createMuseumRaceClient = function ({ THREE, scene, rooms, galleryEnd, send, roomId, selfId, teleport, sfx }) {
    const app = document.getElementById('app');
    const PER_ROW = 5, PODIUM_Z = galleryEnd + 3.7, STEP_DEPTH = 1.5, RISE_S = 1.25, SINK_S = 1.05, CEREMONY_MS = 8000, WALL_X = 11.6 / 2 - .31;
    const el = (tag, className, text) => {
      const node = document.createElement(tag);
      if (className) node.className = className;
      if (text != null) node.textContent = text;
      return node;
    };
    const button = (className, text, label) => { const b = el('button', className, text); b.type = 'button'; b.dataset.sfx = 'click'; if (label) b.setAttribute('aria-label', label); return b; };
    const roomOf = id => rooms.find(r => r.id === id) || rooms[0];
    const face = (key, name) => {
      const wrap = el('span', 'race-face');
      if (/^[a-z0-9-]+\.webp$/i.test(key || '')) { const img = el('img'); img.src = '/assets/avatars/' + key; img.alt = ''; wrap.append(img); }
      else wrap.textContent = String(name || '?').slice(0, 1);
      return wrap;
    };
    // 작품 자리: museum.js addFramedWork 와 같은 규칙(짝수째 왼쪽 벽, 홀수째 오른쪽 벽, 5.15 간격).
    const workSpot = (room, workId) => {
      const i = room.works.findIndex(w => w.id === workId);
      if (i < 0) return null;
      const side = i % 2 === 0 ? -1 : 1;
      return { side, z: 1 - Math.floor(i / 2) * 5.15, work: room.works[i] };
    };

    // ── 화면 요소 ──
    const launch = button('race-launch'); launch.hidden = true;
    const launchTitle = el('b', '', '순위전'), launchSub = el('small', '', '작품 찾아 달리기');
    launch.append(launchTitle, launchSub);
    const lobby = el('section', 'race-lobby'); lobby.hidden = true; lobby.setAttribute('aria-label', '순위전 대기실');
    const lobbyKicker = el('p', 'race-kicker'), lobbyTitle = el('h3'), lobbyPeople = el('ul', 'race-people');
    const lobbyTeams = el('div', 'race-teams'), lobbyPick = el('div', 'race-pick'), lobbyTimes = el('div', 'race-teams race-times'), lobbyActions = el('div', 'race-actions');
    const timeLabel = seconds => seconds % 60 ? `${seconds}초` : `${seconds / 60}분`;
    const startButton = button('race-primary', '시작'), leaveButton = button('race-secondary', '나가기');
    const lobbyNote = el('p', 'race-note');
    lobbyActions.append(startButton, leaveButton);
    lobby.append(lobbyKicker, lobbyTitle, lobbyPeople, lobbyTeams, lobbyPick, lobbyTimes, lobbyActions, lobbyNote);

    const hud = el('section', 'race-hud'); hud.hidden = true; hud.setAttribute('aria-live', 'polite');
    const hudHead = el('div', 'race-hud-head'), hudStep = el('span', 'race-kicker'), hudClock = el('span', 'race-clock'), hudScore = el('span', 'race-score');
    const quit = button('race-quit', '×', '순위전 그만하기');
    hudHead.append(hudStep, hudClock, hudScore, quit);
    const clue = el('p', 'race-clue'), timer = el('div', 'race-timer'), timerBar = el('i'), status = el('p', 'race-status');
    timer.append(timerBar);
    hud.append(hudHead, clue, timer, status);
    const count = el('div', 'race-count'); count.hidden = true; count.setAttribute('aria-hidden', 'true');
    const live = el('ol', 'race-board race-live'); live.hidden = true; live.setAttribute('aria-label', '지금 순위');

    const results = el('section', 'race-results'); results.hidden = true; results.setAttribute('aria-label', '순위전 결과');
    const resultsKicker = el('p', 'race-kicker'), resultsTitle = el('h3'), resultsBoard = el('ol', 'race-board');
    const resultsClose = button('race-secondary', '닫기');
    results.append(resultsKicker, resultsTitle, resultsBoard, resultsClose);
    app.append(launch, lobby, live, hud, count, results);

    let state = null, connected = false, podium = null, ceremonyStart = 0, ceremonyUntil = 0, timerKey = '', resultsTimer = 0;
    let clockEnd = 0, clockRunning = false;
    function paintClock() {
      const left = Math.max(0, clockRunning ? clockEnd - performance.now() : clockEnd - performance.now() + 0), sec = Math.ceil(left / 1000);
      hudClock.textContent = `남은 시간 ${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`;
      hudClock.classList.toggle('low', clockRunning && sec <= 10);
    }
    setInterval(() => { if (!hud.hidden && clockRunning) paintClock(); }, 250);
    let frozenUntil = 0, lastClaimSeq = 0, highlight = null, burst = null, countTimer = 0, frozenTimer = 0, pendingClaim = '';

    function setTimer(remainingMs, totalMs) {
      timerBar.style.transition = 'none';
      timerBar.style.width = `${Math.max(0, Math.min(100, remainingMs / totalMs * 100))}%`;
      void timerBar.offsetWidth;
      timerBar.style.transition = `width ${Math.max(0, remainingMs)}ms linear`;
      timerBar.style.width = '0%';
    }
    function teamOf(s, userId) {
      const p = s.players.find(x => x.userId === userId);
      return p && Number.isInteger(p.team) ? { ...s.teams[p.team], index: p.team } : null;
    }
    // 점수 차이가 막대 길이로 보이게 한다. 이번 작품을 찾은 사람은 표시가 붙는다.
    function renderBoard(list, s, limit = 0) {
      const me = selfId(), found = new Set((s.found || []).map(f => f.userId));
      const rows = s.teamStandings ? s.teamStandings.map((t, i) => ({ rank: i + 1, label: t.name, color: t.color, score: t.score,
        sub: t.members.map(id => s.players.find(p => p.userId === id)?.name || '').filter(Boolean).join(' · '), mine: t.members.includes(me),
        done: t.members.length > 0 && t.members.every(id => found.has(id)) }))
        : (s.standings || []).map((p, i) => ({ rank: i + 1, label: p.name, avatarKey: p.avatarKey, score: p.score, mine: p.userId === me, done: found.has(p.userId) }));
      let shown = rows;
      if (limit && rows.length > limit) { shown = rows.slice(0, limit); const mine = rows.find(r => r.mine); if (mine && !shown.includes(mine)) shown.push(mine); }
      const top = Math.max(1, ...rows.map(r => r.score));
      list.replaceChildren(...shown.map(r => {
        const li = el('li', [r.mine ? 'mine' : '', r.done ? 'done' : ''].join(' ').trim());
        li.append(el('span', 'race-rank', String(r.rank)));
        if (r.color) { const swatch = el('span', 'race-swatch'); swatch.style.background = r.color; li.append(swatch); } else li.append(face(r.avatarKey, r.label));
        const name = el('span', 'race-name', r.label); if (r.sub) name.append(el('small', '', r.sub));
        const bar = el('span', 'race-bar'), fill = el('i'); fill.style.width = `${Math.round(r.score / top * 100)}%`; if (r.color) fill.style.background = r.color; bar.append(fill);
        li.append(name, bar, el('b', 'race-points', String(r.score)));
        return li;
      }));
    }

    function renderLaunch() {
      const s = state;
      launch.hidden = !connected || !selfId() || !!(s && s.joined && ['ready', 'hunt', 'reveal'].includes(s.phase));
      launch.disabled = false; launch.classList.remove('waiting');
      if (!s || s.phase === 'podium') { launchTitle.textContent = '순위전'; launchSub.textContent = '작품 찾아 달리기'; return; }
      if (s.phase === 'lobby') {
        launchTitle.textContent = s.joined ? '순위전 대기 중' : '순위전 참가';
        launchSub.textContent = `${s.players.length}명 모였어요`;
        launch.classList.toggle('waiting', !s.joined); return;
      }
      launchTitle.textContent = '순위전 진행 중'; launchSub.textContent = `${s.players.length}명이 달리는 중`; launch.disabled = true;
    }
    function renderLobby() {
      const s = state, show = !!s && s.phase === 'lobby' && s.joined;
      lobby.hidden = !show;
      if (!show) return;
      const room = roomOf(s.roomId), host = s.hostId === selfId();
      lobbyKicker.textContent = `GALLERY ${room.number} · 순위전`;
      lobbyTitle.textContent = `${room.title} 전시실 작품 찾아 달리기`;
      // 이미 있던 친구는 그대로 두고, 새로 들어온 친구만 나타나는 움직임을 준다.
      const shown = new Map([...lobbyPeople.children].map(li => [li.dataset.id, li]));
      lobbyPeople.replaceChildren(...s.players.map(p => {
        let li = shown.get(p.userId);
        if (!li) {
          li = el('li', 'arrive'); li.dataset.id = p.userId; li.append(face(p.avatarKey, p.name), el('span', '', p.name));
          li.addEventListener('animationend', () => li.classList.remove('arrive'), { once: true });
        }
        li.classList.toggle('host', p.userId === s.hostId);
        li.style.borderColor = Number.isInteger(p.team) && s.teamCount ? s.teams[p.team].color : '';
        // 연 사람은 이름을 눌러 그 학생을 다음 팀으로 옮긴다.
        const movable = host && s.teamCount > 0;
        li.classList.toggle('movable', movable);
        li.title = movable ? '눌러서 다음 팀으로' : '';
        li.tabIndex = movable ? 0 : -1;
        li.onclick = movable ? () => send({ type: 'MUSEUM_RACE_ASSIGN', userId: p.userId, team: ((Number.isInteger(p.team) ? p.team : -1) + 1) % s.teamCount }) : null;
        li.onkeydown = movable ? event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); li.onclick(); } } : null;
        return li;
      }));
      // 연 사람은 개인전이나 팀 수를 고른다. 팀 인원은 정하지 않는다(1명 대 10명도 된다).
      lobbyTeams.replaceChildren();
      if (host) {
        for (const n of [0, 2, 3, 4, 5, 6, 7, 8]) {
          const b = button(n === s.teamCount ? 'on' : '', n ? `${n}팀` : '개인전');
          b.setAttribute('aria-pressed', String(n === s.teamCount));
          b.addEventListener('click', () => send({ type: 'MUSEUM_RACE_TEAMS', count: n }));
          lobbyTeams.append(b);
        }
        if (s.teamCount) {
          const mix = button('race-shuffle', '랜덤 배정');
          mix.addEventListener('click', () => send({ type: 'MUSEUM_RACE_SHUFFLE' }));
          lobbyTeams.append(mix);
        }
      } else lobbyTeams.append(el('span', 'race-mode', `${s.teamCount ? `${s.teamCount}팀 대항` : '개인전'} · ${timeLabel(s.duration)}`));
      // 제한시간은 다른 순위전과 같이 고른다.
      lobbyTimes.replaceChildren();
      lobbyTimes.hidden = !host;
      if (host) for (const seconds of s.durations || []) {
        const b = button(seconds === s.duration ? 'on' : '', timeLabel(seconds));
        b.setAttribute('aria-pressed', String(seconds === s.duration));
        b.addEventListener('click', () => send({ type: 'MUSEUM_RACE_TIME', seconds }));
        lobbyTimes.append(b);
      }
      // 팀전이면 누구나 팀 색을 눌러 자기 팀을 고른다.
      lobbyPick.replaceChildren();
      lobbyPick.hidden = !s.teamCount;
      const mine = s.players.find(p => p.userId === selfId())?.team;
      for (let i = 0; i < s.teamCount; i++) {
        const members = s.players.filter(p => p.team === i);
        const b = button(i === mine ? 'mine' : '', '', `${s.teams[i].name}에 들어가기`);
        b.style.setProperty('--team', s.teams[i].color);
        b.setAttribute('aria-pressed', String(i === mine));
        b.append(el('b', '', `${s.teams[i].name} ${members.length}명`), el('small', '', members.map(p => p.name).join(' · ') || '아직 없음'));
        b.addEventListener('click', () => send({ type: 'MUSEUM_RACE_PICK', team: i }));
        lobbyPick.append(b);
      }
      startButton.hidden = !host;
      startButton.disabled = s.players.length < 2;
      lobbyNote.textContent = host ? (s.players.length < 2 ? '두 명부터 시작할 수 있어요.' : '') : '연 친구가 시작을 누르면 입구에 모여 출발해요.';
      lobbyNote.hidden = !lobbyNote.textContent;
    }

    // ── 경기 중 ──
    // 처음에는 모두 입구에 한 줄로 선다.
    function startSpot(s) {
      const k = Math.max(0, s.players.findIndex(p => p.userId === selfId())), row = Math.floor(k / 7), col = k % 7;
      return { x: -3.6 + col * 1.2 + (row % 2) * .6, z: Math.min(6.3, 4.3 + row), yaw: 0, heading: Math.PI };
    }
    function renderCount() {
      const s = state;
      clearInterval(countTimer);
      if (!s || !s.joined || s.phase !== 'ready') { count.hidden = true; return; }
      const end = performance.now() + s.remainingMs;
      const tick = () => {
        const left = Math.ceil((end - performance.now()) / 1000);
        if (left <= 0) { count.hidden = true; clearInterval(countTimer); return; }
        if (count.textContent !== String(left)) { count.textContent = String(left); count.classList.remove('beat'); void count.offsetWidth; count.classList.add('beat'); sfx('tick'); }
        count.hidden = false;
      };
      count.textContent = '';
      tick(); countTimer = setInterval(tick, 100);
    }
    function renderHud(prev) {
      const s = state, racing = !!s && s.joined && ['ready', 'hunt', 'reveal'].includes(s.phase);
      document.body.classList.toggle('racing', racing);
      hud.hidden = live.hidden = !racing;
      if (!racing) { timerKey = ''; return; }
      if (s.phase === 'ready' && s.index === 0 && (!prev || prev.phase === 'lobby')) { teleport(startSpot(s)); sfx('bell'); }
      const team = teamOf(s, selfId()), me = s.me || {};
      hudStep.textContent = `작품 찾기 ${String(s.index + 1).padStart(2, '0')}`;
      // 전체 남은 시간: 첫 단서를 찾기 시작할 때부터 줄어든다.
      clockEnd = performance.now() + s.raceLeftMs; clockRunning = !(s.phase === 'ready' && s.index === 0);
      paintClock();
      hudScore.replaceChildren(el('span', '', `내 점수 ${me.score ?? 0}`));
      if (team) { const chip = el('span', 'race-team-chip', team.name); chip.style.background = team.color; hudScore.prepend(chip); }
      clue.textContent = s.clue;
      const key = `${s.index}:${s.phase}`;
      if (key !== timerKey) {
        timerKey = key;
        if (s.phase === 'hunt') setTimer(s.remainingMs, s.phaseMs);
        else { timerBar.style.transition = 'none'; timerBar.style.width = s.phase === 'ready' ? '100%' : '0%'; }
        if (s.phase === 'ready') { clearHighlight(); hud.classList.remove('solved'); frozenUntil = 0; }
        if (s.phase === 'reveal') { showHighlight(s.answer.workId, 'reveal'); sfx(me.found ? 'card' : 'timeout'); }
      }
      if (me.claim && me.claim.seq !== lastClaimSeq) {
        lastClaimSeq = me.claim.seq;
        if (me.claim.result === 'right') {
          sfx('success'); hud.classList.add('solved');
          const spot = workSpot(roomOf(s.roomId), pendingClaim);
          if (spot) { showHighlight(spot.work.id, 'mine'); startBurst(spot); }
        } else if (me.claim.result === 'wrong') {
          sfx('error'); frozenUntil = performance.now() + (me.frozenMs || 0);
          hud.classList.remove('shake'); void hud.offsetWidth; hud.classList.add('shake');
        } else sfx('tick');
      }
      const frozen = performance.now() < frozenUntil;
      status.className = 'race-status';
      clearTimeout(frozenTimer);
      if (s.phase === 'ready') status.textContent = s.index === 0 ? '단서를 읽고 출발 준비' : '다음 단서';
      else if (s.phase === 'reveal') {
        status.replaceChildren(el('b', 'race-answer', `〈${s.answer.title}〉`), document.createTextNode(` ${s.answer.artist}`));
        status.classList.add('reveal');
      } else if (me.found) {
        status.textContent = `${me.found.order === 1 ? '제일 먼저' : `${me.found.order}번째로`} 찾았어요${me.claim?.gain ? ` +${me.claim.gain}` : ''}`;
        status.classList.add('good');
      } else if (frozen) {
        status.textContent = '이 작품이 아니에요 · 잠깐 멈춤'; status.classList.add('frozen');
        frozenTimer = setTimeout(() => { if (state === s) renderHud(s); }, frozenUntil - performance.now() + 30);
      } else if (me.claim?.result === 'far') status.textContent = '그림 바로 앞까지 가서 눌러요';
      else status.textContent = `찾은 친구 ${s.found.length} / ${s.players.length}`;
      renderBoard(live, s, innerWidth <= 900 ? 3 : 8);
    }
    function hunting() {
      const s = state;
      return !!s && s.joined && s.phase === 'hunt' && !s.me?.found && performance.now() >= frozenUntil;
    }
    function claim(work) {
      const s = state;
      if (!hunting() || !work) return;
      pendingClaim = work.id;
      sfx('select');
      send({ type: 'MUSEUM_RACE_CLAIM', index: s.index, workId: work.id });
    }

    // 정답 작품을 비추는 빛(판이 끝나면 모두에게), 내가 찾은 작품의 옅은 빛(나에게만).
    function clearHighlight() {
      if (!highlight) return;
      scene.remove(highlight.group);
      highlight.group.traverse(o => { o.geometry?.dispose(); for (const m of [].concat(o.material || [])) m.dispose(); });
      highlight = null;
    }
    function showHighlight(workId, mode) {
      const spot = workSpot(roomOf(roomId()), workId);
      if (!spot || (highlight?.workId === workId && highlight.mode === mode)) return;
      clearHighlight();
      const glowMat = () => new THREE.MeshBasicMaterial({ color: 0xffd98a, transparent: true, opacity: .2, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, toneMapped: false });
      const group = new THREE.Group();
      const glow = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 3.6), glowMat());
      glow.position.set(spot.side * (WALL_X - .12), 3.12, spot.z); glow.rotation.y = spot.side < 0 ? Math.PI / 2 : -Math.PI / 2; group.add(glow);
      const parts = [glow];
      if (mode === 'reveal') {
        const beam = new THREE.Mesh(new THREE.CylinderGeometry(.25, 1.25, 6.2, 32, 1, true), glowMat()); beam.position.set(spot.side * (WALL_X - 1.25), 3.1, spot.z); group.add(beam);
        const ring = new THREE.Mesh(new THREE.RingGeometry(.9, 1.25, 48), glowMat()); ring.rotation.x = -Math.PI / 2; ring.position.set(spot.side * (WALL_X - 1.25), .02, spot.z); group.add(ring);
        parts.push(beam, ring);
      }
      scene.add(group);
      highlight = { group, parts, workId, mode };
    }
    function startBurst(spot) {
      if (burst) { scene.remove(burst.mesh); burst.mesh.geometry.dispose(); burst.mesh.material.dispose(); }
      const n = 70, mesh = new THREE.InstancedMesh(new THREE.PlaneGeometry(.08, .08), new THREE.MeshBasicMaterial({ color: 0xffe08a, side: THREE.DoubleSide, toneMapped: false }), n);
      const bits = Array.from({ length: n }, () => ({ x: spot.side * (WALL_X - .3), y: 3.1 + (Math.random() - .5) * 2.4, z: spot.z + (Math.random() - .5) * 2.2,
        vx: -spot.side * (1.2 + Math.random() * 2.8), vy: Math.random() * 2.6, vz: (Math.random() - .5) * 2.6, r: Math.random() * 6 }));
      mesh.frustumCulled = false; scene.add(mesh);
      burst = { mesh, bits, dummy: new THREE.Object3D(), born: performance.now() };
    }

    // ── 시상대 ──
    function numberTexture(text, color) {
      const c = document.createElement('canvas'); c.width = c.height = 256;
      const g = c.getContext('2d');
      g.fillStyle = color; g.textAlign = 'center'; g.textBaseline = 'middle'; g.font = '700 190px Georgia, serif';
      g.shadowColor = 'rgba(0,0,0,.35)'; g.shadowBlur = 8; g.fillText(text, 128, 138);
      const t = new THREE.CanvasTexture(c); t.encoding = THREE.sRGBEncoding; return t;
    }
    function buildPodium(s) {
      const top = (s.teamStandings
        ? s.teamStandings.map(t => ({ members: t.members, color: t.color }))
        : s.standings.map(p => ({ members: [p.userId] }))).slice(0, 3);
      if (!top.length) return null;
      // 팀이 커도 전시실 너비 안에 들도록 계단 너비를 묶고, 한 계단에 두 줄까지 세운다.
      const width = Math.min(3.6, Math.max(1.6, Math.min(PER_ROW, Math.max(...top.map(t => t.members.length))) * .62 + .35));
      const layout = [{ place: 1, x: 0, h: .8, tone: '#f3d27a' }, { place: 2, x: -width, h: .54, tone: '#e4e8ee' }, { place: 3, x: width, h: .36, tone: '#e0a978' }];
      const group = new THREE.Group(); group.position.y = -1.05; scene.add(group);
      const marble = new THREE.MeshStandardMaterial({ color: 0xf4eee3, roughness: .38, metalness: .02, emissive: 0x9a8f7c, emissiveIntensity: .62 });
      const trim = new THREE.MeshStandardMaterial({ color: 0xd9ad55, roughness: .35, metalness: .3, emissive: 0x6b4a14, emissiveIntensity: .7 });
      const steps = top.map((entry, i) => {
        const spec = layout[i];
        const body = new THREE.Mesh(new THREE.BoxGeometry(width - .06, spec.h, STEP_DEPTH), marble); body.position.set(spec.x, spec.h / 2, PODIUM_Z); group.add(body);
        const edge = new THREE.Mesh(new THREE.BoxGeometry(width - .02, .045, .05), trim); edge.position.set(spec.x, spec.h - .02, PODIUM_Z + STEP_DEPTH / 2 + .005); group.add(edge);
        const size = Math.min(.62, spec.h * .82);
        const label = new THREE.Mesh(new THREE.PlaneGeometry(size, size), new THREE.MeshBasicMaterial({ map: numberTexture(String(spec.place), spec.tone), transparent: true, toneMapped: false }));
        label.position.set(spec.x, spec.h * .5, PODIUM_Z + STEP_DEPTH / 2 + .006); group.add(label);
        if (entry.color) {
          const band = new THREE.Mesh(new THREE.PlaneGeometry(width - .1, .07), new THREE.MeshBasicMaterial({ color: entry.color, toneMapped: false }));
          band.position.set(spec.x, spec.h - .1, PODIUM_Z + STEP_DEPTH / 2 + .007); group.add(band);
        }
        return { ...spec, width, members: entry.members };
      });
      // 1등 위로 내려오는 빛기둥(조명을 새로 켜지 않고 빛나는 원뿔로 흉내 낸다).
      const beamHeight = 6.1 - steps[0].h;
      const beam = new THREE.Mesh(new THREE.CylinderGeometry(.18, width * .62, beamHeight, 32, 1, true),
        new THREE.MeshBasicMaterial({ color: 0xffe3a6, transparent: true, opacity: .13, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, toneMapped: false }));
      beam.position.set(0, steps[0].h + beamHeight / 2, PODIUM_Z); group.add(beam);
      const confetti = makeConfetti();
      return { group, steps, beam, confetti, born: performance.now(), sinking: 0 };
    }
    function makeConfetti() {
      const total = 240, palette = [0xf3d27a, 0xff8f9e, 0x7fc4ff, 0x8fe3a8, 0xc7a3ff, 0xffffff];
      const mesh = new THREE.InstancedMesh(new THREE.PlaneGeometry(.07, .12), new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, toneMapped: false }), total);
      const color = new THREE.Color(), bits = [];
      for (let i = 0; i < total; i++) {
        mesh.setColorAt(i, color.setHex(palette[i % palette.length]));
        bits.push({ x: (Math.random() - .5) * 8.4, y: 3 + Math.random() * 4.5, z: PODIUM_Z + (Math.random() - .25) * 6, v: .7 + Math.random() * .8,
          sway: Math.random() * 6.28, spin: (Math.random() - .5) * 9, rx: Math.random() * 6.28, ry: Math.random() * 6.28 });
      }
      mesh.frustumCulled = false; scene.add(mesh);
      return { mesh, bits, dummy: new THREE.Object3D() };
    }
    function disposePodium(p) {
      for (const root of [p.group, p.confetti.mesh]) {
        scene.remove(root);
        root.traverse(o => { if (o.geometry) o.geometry.dispose(); for (const m of [].concat(o.material || [])) { m.map?.dispose(); m.dispose(); } });
      }
    }
    function clearPodium(animated) {
      if (!podium) return;
      if (animated && !podium.sinking) podium.sinking = performance.now();
      else if (!animated) { disposePodium(podium); podium = null; }
    }
    // 시상대 위에 선 사람은 계단 높이만큼 올라선다(시상대가 솟고 가라앉을 때 함께 움직인다).
    function floorAt(x, z) {
      if (!podium) return 0;
      for (const step of podium.steps) {
        if (Math.abs(x - step.x) <= step.width / 2 && Math.abs(z - PODIUM_Z) <= STEP_DEPTH / 2) return Math.max(0, step.h + podium.group.position.y);
      }
      return 0;
    }
    // 1·2·3등은 자기 계단에, 나머지 참가자는 시상대 앞에 모여 선다. 모든 화면이 같은 결과로 같은 자리를 계산한다.
    function ceremonySpot(s) {
      const me = selfId();
      for (const step of podium.steps) {
        const at = step.members.indexOf(me), perRow = Math.max(1, Math.min(PER_ROW, Math.floor((step.width - .2) / .62)));
        if (at >= 0 && at < perRow * 2) {
          const row = Math.floor(at / perRow), inRow = Math.min(perRow, step.members.length - row * perRow), col = at % perRow;
          return { x: step.x + (col - (inRow - 1) / 2) * .62, z: PODIUM_Z + (step.members.length > perRow ? .35 - row * .62 : .1), yaw: 0, heading: 0 };
        }
      }
      const onPodium = new Set(podium.steps.flatMap(step => step.members.slice(0, Math.max(1, Math.min(PER_ROW, Math.floor((step.width - .2) / .62))) * 2)));
      const crowd = s.standings.map(p => p.userId).filter(id => !onPodium.has(id));
      const k = Math.max(0, crowd.indexOf(me)), row = Math.floor(k / 7), col = k % 7;
      return { x: Math.max(-4.4, Math.min(4.4, -3.6 + col * 1.2 + (row % 2) * .6)), z: PODIUM_Z + 4.6 + row * 1.25, yaw: 0, heading: Math.PI };
    }
    function startCeremony(s) {
      ceremonyStart = performance.now(); ceremonyUntil = ceremonyStart + CEREMONY_MS;
      teleport(ceremonySpot(s));
      const room = roomOf(s.roomId), rank = s.standings.findIndex(p => p.userId === selfId()) + 1;
      resultsKicker.textContent = `GALLERY ${room.number} · 순위전 결과`;
      resultsTitle.textContent = s.teamStandings ? `${s.teamStandings[0].name} 우승` : `${s.standings[0].name} 1등`;
      if (rank && !s.teamStandings) resultsTitle.append(el('small', '', ` · 나는 ${rank}등 · ${s.total}점 중 ${s.me?.correct ?? 0}점 찾음`));
      renderBoard(resultsBoard, s, innerWidth <= 620 ? 3 : 0);
      // 시상대가 솟고 카메라가 물러난 다음에 결과판을 띄운다.
      clearTimeout(resultsTimer);
      resultsTimer = setTimeout(() => { if (state?.phase === 'podium') results.hidden = false; }, 3000);
      sfx('bell');
    }
    // 시상식 동안 카메라는 1등 얼굴 가까이에서 시작해 시상대 전체가 보이게 천천히 물러난다.
    function ceremonyCamera(aspect) {
      if (!podium || podium.sinking || !ceremonyUntil) return null;
      const now = performance.now();
      if (now >= ceremonyUntil) return null;
      const raw = Math.min(1, (now - ceremonyStart) / (CEREMONY_MS * .7)), t = raw < .5 ? 2 * raw * raw : 1 - Math.pow(-2 * raw + 2, 2) / 2;
      const h = podium.steps[0].h + Math.min(0, podium.group.position.y);
      const far = Math.max(7.5, Math.min(12, 2.9 / (.6 * Math.max(.3, aspect))));
      const mix = (a, b) => a + (b - a) * t;
      return { x: 0, y: mix(h + 1.5, 2.6), z: PODIUM_Z + mix(2.7, far), tx: 0, ty: mix(h + .75, .95), tz: PODIUM_Z };
    }
    function renderPodium(prev) {
      const s = state;
      if (!s || s.phase !== 'podium') { clearPodium(true); clearTimeout(resultsTimer); results.hidden = true; ceremonyUntil = 0; return; }
      clearHighlight();
      if (!podium || podium.sinking) { if (podium) clearPodium(false); podium = buildPodium(s); }
      if (s.joined && prev && prev.phase === 'reveal' && podium) startCeremony(s);
    }

    function update(dt) {
      const now = performance.now();
      let busy = false;
      if (highlight) {
        const pulse = .5 + .5 * Math.sin(now * .006);
        for (const part of highlight.parts) part.material.opacity = highlight.mode === 'reveal' ? .14 + pulse * .16 : .07 + pulse * .07;
        busy = true;
      }
      if (burst) {
        const age = (now - burst.born) / 1000, { mesh, bits, dummy } = burst;
        for (let i = 0; i < bits.length; i++) {
          const b = bits[i];
          b.x += b.vx * dt; b.y += b.vy * dt; b.z += b.vz * dt; b.vy -= 4.2 * dt; b.r += 7 * dt;
          dummy.position.set(b.x, Math.max(.02, b.y), b.z); dummy.rotation.set(b.r, b.r * .6, 0); dummy.scale.setScalar(Math.max(.01, 1 - age / 1.4)); dummy.updateMatrix(); mesh.setMatrixAt(i, dummy.matrix);
        }
        mesh.instanceMatrix.needsUpdate = true;
        if (age > 1.4) { scene.remove(mesh); mesh.geometry.dispose(); mesh.material.dispose(); burst = null; }
        busy = true;
      }
      if (!podium) return busy;
      const age = (now - podium.born) / 1000;
      if (podium.sinking) {
        const t = Math.min(1, (now - podium.sinking) / 1000 / SINK_S);
        podium.group.position.y = -1.05 * t * t;
        if (t >= 1) { disposePodium(podium); podium = null; return true; }
      } else if (age < RISE_S) {
        const t = age / RISE_S, c = 1.5;
        podium.group.position.y = -1.05 + 1.05 * (1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2));
      } else podium.group.position.y = 0;
      podium.beam.material.opacity = .11 + Math.sin(now * .003) * .03;
      const { mesh, bits, dummy } = podium.confetti, raining = age < 9;
      let falling = false;
      for (let i = 0; i < bits.length; i++) {
        const b = bits[i];
        b.y -= b.v * dt; b.x += Math.sin(now * .002 + b.sway) * .35 * dt; b.rx += b.spin * dt; b.ry += b.spin * .7 * dt;
        if (b.y < 0) { if (raining) { b.y = 5.6 + Math.random() * 1.2; b.x = (Math.random() - .5) * 8.4; } else b.y = -9; }
        if (b.y > -1) falling = true;
        dummy.position.set(b.x, b.y, b.z); dummy.rotation.set(b.rx, b.ry, 0); dummy.updateMatrix(); mesh.setMatrixAt(i, dummy.matrix);
      }
      mesh.instanceMatrix.needsUpdate = true;
      return busy || age < RISE_S || falling || !!podium.sinking || now < ceremonyUntil;
    }

    function handle(message) {
      if (message.roomId !== roomId()) return;
      const prev = state;
      state = message.race;
      renderLaunch(); renderLobby(); renderHud(prev); renderCount(); renderPodium(prev);
      if (state?.phase === 'reveal' && !state.joined) showHighlight(state.answer.workId, 'reveal');
      if (state && state.phase === 'ready' && !state.joined) clearHighlight();
      if (!state) clearHighlight();
      if (state?.phase === 'lobby' && state.joined && !(prev?.joined)) sfx('select');
    }
    function roomChanged() {
      state = null; timerKey = ''; ceremonyUntil = 0; frozenUntil = 0;
      clearPodium(false); clearHighlight(); clearTimeout(resultsTimer); clearInterval(countTimer);
      results.hidden = true; count.hidden = true;
      renderLaunch(); renderLobby(); renderHud(null);
    }
    function setConnected(value) {
      connected = value;
      if (!value) roomChanged(); else renderLaunch();
    }
    function leave() {
      if (state?.joined && state.phase !== 'podium') send({ type: 'MUSEUM_RACE_LEAVE' });
    }

    launch.addEventListener('click', () => {
      const s = state;
      if (s && s.phase === 'lobby' && s.joined) { lobby.classList.remove('nudge'); void lobby.offsetWidth; lobby.classList.add('nudge'); return; }
      if (s && !['lobby', 'podium'].includes(s.phase)) return;
      send({ type: 'MUSEUM_RACE_OPEN' });
    });
    startButton.addEventListener('click', () => send({ type: 'MUSEUM_RACE_START' }));
    leaveButton.addEventListener('click', () => send({ type: 'MUSEUM_RACE_LEAVE' }));
    resultsClose.addEventListener('click', () => { results.hidden = true; ceremonyUntil = 0; });
    quit.addEventListener('click', () => { if (confirm('순위전을 그만할까요?')) send({ type: 'MUSEUM_RACE_LEAVE' }); });

    const inRace = () => !!state && state.joined && ['ready', 'hunt', 'reveal'].includes(state.phase);
    return {
      handle, update, floorAt, roomChanged, setConnected, leave, ceremonyCamera, claim, hunting, inRace,
      blocksMovement: () => (!!state && state.joined && state.phase === 'ready') || performance.now() < frozenUntil || performance.now() < ceremonyUntil,
      hidesFocus: () => !!podium && performance.now() < ceremonyUntil
    };
  };
})();
