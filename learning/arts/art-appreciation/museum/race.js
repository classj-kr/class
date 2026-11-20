(function () {
  'use strict';
  // 전시실 순위전 화면: 대기실(떠 있는 판), 문제 창(화면을 덮는다), 끝 벽 앞에 솟는 시상대.
  // 서버(museum-race.js)가 판을 진행하고 채점한다. 여기서는 받은 상태를 그리기만 한다.
  window.createMuseumRaceClient = function ({ THREE, scene, rooms, galleryEnd, send, roomId, selfId, teleport, sfx }) {
    const app = document.getElementById('app');
    const PODIUM_Z = galleryEnd + 3.7, STEP_DEPTH = 1.5, RISE_S = 1.25, SINK_S = 1.05, CEREMONY_MS = 8000;
    const el = (tag, className, text) => {
      const node = document.createElement(tag);
      if (className) node.className = className;
      if (text != null) node.textContent = text;
      return node;
    };
    const roomOf = id => rooms.find(r => r.id === id) || rooms[0];
    const face = (key, name) => {
      const wrap = el('span', 'race-face');
      if (/^[a-z0-9-]+\.webp$/i.test(key || '')) { const img = el('img'); img.src = '/assets/avatars/' + key; img.alt = ''; wrap.append(img); }
      else wrap.textContent = String(name || '?').slice(0, 1);
      return wrap;
    };

    // ── 화면 요소 ──
    const launch = el('button', 'race-launch'); launch.type = 'button'; launch.hidden = true; launch.dataset.sfx = 'click';
    const launchTitle = el('b', '', '순위전'), launchSub = el('small', '', '같은 방 친구와 겨루기');
    launch.append(launchTitle, launchSub);
    const lobby = el('section', 'race-lobby'); lobby.hidden = true; lobby.setAttribute('aria-label', '순위전 대기실');
    const lobbyKicker = el('p', 'race-kicker'), lobbyTitle = el('h3'), lobbyPeople = el('ul', 'race-people');
    const lobbyTeams = el('div', 'race-teams'), lobbyActions = el('div', 'race-actions');
    const startButton = el('button', 'race-primary', '시작'); startButton.type = 'button'; startButton.dataset.sfx = 'click';
    const leaveButton = el('button', 'race-secondary', '나가기'); leaveButton.type = 'button'; leaveButton.dataset.sfx = 'click';
    const lobbyNote = el('p', 'race-note');
    lobbyActions.append(startButton, leaveButton);
    lobby.append(lobbyKicker, lobbyTitle, lobbyPeople, lobbyTeams, lobbyActions, lobbyNote);

    const modal = el('dialog', 'race-modal'); modal.setAttribute('aria-label', '순위전 문제');
    const head = el('header', 'race-head'), headKicker = el('span', 'race-kicker'), headStep = el('span', 'race-step'), headScore = el('span', 'race-score');
    const quit = el('button', 'race-quit', '×'); quit.type = 'button'; quit.setAttribute('aria-label', '순위전 그만하기'); quit.dataset.sfx = 'click';
    head.append(headKicker, headStep, headScore, quit);
    const timer = el('div', 'race-timer'), timerBar = el('i'); timer.append(timerBar);
    const ready = el('section', 'race-ready'), readyNumber = el('b'), readyText = el('span');
    ready.append(readyNumber, readyText);
    const questionWrap = el('section', 'race-question'), figure = el('figure', 'race-figure'), figureImage = el('img');
    figureImage.alt = '문제 작품'; figure.append(figureImage);
    const questionText = el('p', 'race-q'), options = el('div', 'race-options'), status = el('p', 'race-status');
    questionWrap.append(figure, questionText, options, status);
    const revealWrap = el('section', 'race-reveal'), result = el('p', 'race-result'), explain = el('p', 'race-explain'), revealBoard = el('ol', 'race-board');
    revealWrap.append(result, explain, revealBoard);
    modal.append(head, timer, ready, questionWrap, revealWrap);

    const results = el('section', 'race-results'); results.hidden = true; results.setAttribute('aria-label', '순위전 결과');
    const resultsKicker = el('p', 'race-kicker'), resultsTitle = el('h3'), resultsBoard = el('ol', 'race-board');
    const resultsClose = el('button', 'race-secondary', '닫기'); resultsClose.type = 'button'; resultsClose.dataset.sfx = 'click';
    results.append(resultsKicker, resultsTitle, resultsBoard, resultsClose);
    app.append(launch, lobby, results, modal);

    let state = null, connected = false, podium = null, ceremonyStart = 0, ceremonyUntil = 0, timerKey = '', resultsTimer = 0;
    const canHover = matchMedia('(hover: hover)').matches;

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
    // 점수 차이가 막대 길이로 보이게 한다.
    function renderBoard(list, s, limit = 0) {
      const me = selfId();
      const rows = s.teamStandings ? s.teamStandings.map((t, i) => ({ rank: i + 1, key: 't' + t.index, label: t.name, color: t.color, score: t.score,
        sub: t.members.map(id => s.players.find(p => p.userId === id)?.name || '').filter(Boolean).join(' · '), mine: t.members.includes(me) }))
        : (s.standings || []).map((p, i) => ({ rank: i + 1, key: p.userId, label: p.name, avatarKey: p.avatarKey, score: p.score, mine: p.userId === me }));
      let shown = rows;
      if (limit && rows.length > limit) { shown = rows.slice(0, limit); const mine = rows.find(r => r.mine); if (mine && !shown.includes(mine)) shown.push(mine); }
      const top = Math.max(1, ...rows.map(r => r.score));
      list.replaceChildren(...shown.map(r => {
        const li = el('li', r.mine ? 'mine' : '');
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
      launch.hidden = !connected || !selfId();
      launch.disabled = false; launch.classList.remove('waiting');
      if (!s || s.phase === 'podium') { launchTitle.textContent = '순위전'; launchSub.textContent = '같은 방 친구와 겨루기'; return; }
      if (s.phase === 'lobby') {
        launchTitle.textContent = s.joined ? '순위전 대기 중' : '순위전 참가';
        launchSub.textContent = `${s.players.length}명 모였어요`;
        launch.classList.toggle('waiting', !s.joined); return;
      }
      launchTitle.textContent = '순위전 진행 중'; launchSub.textContent = `${s.players.length}명이 겨루는 중`; launch.disabled = !s.joined;
    }
    function renderLobby() {
      const s = state, show = !!s && s.phase === 'lobby' && s.joined;
      lobby.hidden = !show;
      if (!show) return;
      const room = roomOf(s.roomId), host = s.hostId === selfId();
      lobbyKicker.textContent = `GALLERY ${room.number} · 순위전`;
      lobbyTitle.textContent = `${room.title} 전시실`;
      // 이미 있던 친구는 그대로 두고, 새로 들어온 친구만 나타나는 움직임을 준다.
      const shown = new Map([...lobbyPeople.children].map(li => [li.dataset.id, li]));
      lobbyPeople.replaceChildren(...s.players.map(p => {
        let li = shown.get(p.userId);
        if (!li) { li = el('li', 'arrive'); li.dataset.id = p.userId; li.append(face(p.avatarKey, p.name), el('span', '', p.name)); li.addEventListener('animationend', () => li.classList.remove('arrive'), { once: true }); }
        li.classList.toggle('host', p.userId === s.hostId);
        return li;
      }));
      lobbyTeams.replaceChildren();
      if (host) {
        for (const size of [1, 2, 3, 4, 5, 6, 8, 10]) {
          const b = el('button', size === s.teamSize ? 'on' : '', size === 1 ? '개인전' : `${size}명 팀`); b.type = 'button'; b.dataset.sfx = 'click';
          b.setAttribute('aria-pressed', String(size === s.teamSize));
          b.addEventListener('click', () => send({ type: 'MUSEUM_RACE_TEAM', size }));
          lobbyTeams.append(b);
        }
      } else lobbyTeams.append(el('span', 'race-mode', s.teamSize === 1 ? '개인전' : `${s.teamSize}명씩 팀`));
      startButton.hidden = !host;
      startButton.disabled = s.players.length < 2;
      lobbyNote.textContent = host ? (s.players.length < 2 ? '두 명부터 시작할 수 있어요.' : '') : '연 친구가 시작을 누르면 문제가 나와요.';
      lobbyNote.hidden = !lobbyNote.textContent;
    }
    function renderModal(prev) {
      const s = state, live = !!s && s.joined && ['ready', 'question', 'reveal'].includes(s.phase);
      if (!live) { if (modal.open) modal.close(); return; }
      if (!modal.open) { document.querySelectorAll('dialog[open]').forEach(d => { if (d !== modal) d.close(); }); modal.showModal(); }
      const room = roomOf(s.roomId), team = teamOf(s, selfId());
      headKicker.textContent = `${room.title} · 순위전`;
      headStep.textContent = `${String(s.index + 1).padStart(2, '0')} / ${String(s.total).padStart(2, '0')}`;
      headScore.replaceChildren(el('span', '', `내 점수 ${s.me?.score ?? 0}`));
      if (team) { const chip = el('span', 'race-team-chip', team.name); chip.style.background = team.color; headScore.prepend(chip); }
      ready.hidden = s.phase !== 'ready';
      questionWrap.hidden = s.phase === 'ready';
      revealWrap.hidden = s.phase !== 'reveal';
      const key = `${s.index}:${s.phase}`;
      if (key !== timerKey) {
        timerKey = key;
        if (s.phase === 'question') { setTimer(s.remainingMs, s.questionMs); sfx('card'); }
        else { timerBar.style.transition = 'none'; timerBar.style.width = s.phase === 'ready' ? '100%' : '0%'; }
        if (s.phase === 'ready') sfx('tick');
        if (s.phase === 'reveal') sfx(s.me?.correct ? 'success' : s.me?.choice == null ? 'timeout' : 'error');
      }
      if (s.phase === 'ready') {
        readyNumber.textContent = String(s.index + 1);
        readyText.textContent = s.index === 0 ? '첫 문제' : s.index + 1 === s.total ? '마지막 문제' : '번째 문제';
        return;
      }
      const q = s.question;
      figure.hidden = !q.image;
      if (q.image) { if (figureImage.getAttribute('src') !== q.image) figureImage.src = q.image; } else figureImage.removeAttribute('src');
      questionText.textContent = q.q;
      const optionKey = `${s.index}|${q.options.join('|')}`;
      if (options.dataset.key !== optionKey) {
        options.dataset.key = optionKey;
        options.replaceChildren(...q.options.map((label, i) => {
          const b = el('button', 'race-option', label); b.type = 'button'; b.dataset.letter = String.fromCharCode(65 + i); b.dataset.sfx = 'none';
          b.addEventListener('click', () => answer(i));
          return b;
        }));
      }
      [...options.children].forEach((b, i) => {
        b.disabled = s.phase !== 'question' || s.me?.choice != null;
        b.classList.toggle('chosen', s.me?.choice === i);
        b.classList.toggle('right', s.phase === 'reveal' && q.answer === i);
        b.classList.toggle('missed', s.phase === 'reveal' && s.me?.choice === i && q.answer !== i);
      });
      status.textContent = s.phase === 'question' ? `${s.playerCount}명 중 ${s.answered}명이 답했어요${s.me?.choice == null && canHover ? ` · 1~${q.options.length} 숫자 키로도 고를 수 있어요` : ''}` : '';
      if (s.phase === 'reveal') {
        result.className = 'race-result ' + (s.me?.correct ? 'good' : 'plain');
        result.textContent = s.me?.correct ? `맞았어요 +${s.me.gain}${s.me.boost ? ' · 세 번 연속 +60' : ''}` : s.me?.choice == null ? '시간이 다 됐어요' : '아쉬워요';
        explain.textContent = q.explain || '';
        renderBoard(revealBoard, s, 5);
      }
    }
    function answer(choice) {
      const s = state;
      if (!s || s.phase !== 'question' || s.me?.choice != null) return;
      s.me.choice = choice; s.answered++;
      sfx('select');
      send({ type: 'MUSEUM_RACE_ANSWER', index: s.index, choice });
      renderModal();
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
      const width = Math.max(1.6, Math.max(...top.map(t => t.members.length)) * .68 + .35);
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
      const count = 240, palette = [0xf3d27a, 0xff8f9e, 0x7fc4ff, 0x8fe3a8, 0xc7a3ff, 0xffffff];
      const mesh = new THREE.InstancedMesh(new THREE.PlaneGeometry(.07, .12), new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, toneMapped: false }), count);
      const color = new THREE.Color(), bits = [];
      for (let i = 0; i < count; i++) {
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
        const at = step.members.indexOf(me);
        if (at >= 0) return { x: step.x + (at - (step.members.length - 1) / 2) * .68, z: PODIUM_Z + .1, yaw: 0, heading: 0 };
      }
      const onPodium = new Set(podium.steps.flatMap(step => step.members));
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
      if (rank && !s.teamStandings) resultsTitle.append(el('small', '', ` · 나는 ${rank}등 · ${s.me?.correct ?? 0} / ${s.total} 맞힘`));
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
      if (!podium || podium.sinking) { if (podium) clearPodium(false); podium = buildPodium(s); }
      if (s.joined && prev && prev.phase === 'reveal' && podium) startCeremony(s);
    }

    function update(dt) {
      if (!podium) return false;
      const now = performance.now(), age = (now - podium.born) / 1000;
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
      return age < RISE_S || falling || !!podium.sinking || now < ceremonyUntil;
    }

    function handle(message) {
      if (message.roomId !== roomId()) return;
      const prev = state;
      state = message.race;
      renderLaunch(); renderLobby(); renderModal(prev); renderPodium(prev);
      if (state?.phase === 'lobby' && state.joined && !(prev?.joined)) sfx('select');
    }
    function roomChanged() {
      state = null; timerKey = ''; ceremonyUntil = 0;
      clearPodium(false); clearTimeout(resultsTimer); results.hidden = true; if (modal.open) modal.close();
      renderLaunch(); renderLobby();
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
    modal.addEventListener('cancel', event => event.preventDefault());
    addEventListener('keydown', event => {
      if (!modal.open || !state || state.phase !== 'question') return;
      const n = Number(event.key);
      if (Number.isInteger(n) && n >= 1 && n <= (state.question?.options.length || 0)) { event.preventDefault(); answer(n - 1); }
    });

    return {
      handle, update, floorAt, roomChanged, setConnected, leave, ceremonyCamera,
      blocksMovement: () => modal.open || performance.now() < ceremonyUntil,
      hidesFocus: () => !!podium && performance.now() < ceremonyUntil,
      modal
    };
  };
})();
