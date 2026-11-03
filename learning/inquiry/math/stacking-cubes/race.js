(function () {
  'use strict';
  const $ = id => document.getElementById(id);
  const initialCode = new URLSearchParams(location.search).get('room') || '';
  const App = window.StackingApp;
  const workspace = document.querySelector('.workspace');
  const names = { views: '그림 보고 쌓기', copy: '따라 쌓기' };
  let code = '', token = '', state = null, pollTimer, shownRound = '', busy = false, failures = 0;
  const status = message => { $('race-status').textContent = message; };
  const store = {
    get: key => { try { return JSON.parse(localStorage.getItem('stacking-race-' + key)); } catch (_) { return null; } },
    set: (key, value) => { try { localStorage.setItem('stacking-race-' + key, JSON.stringify(value)); } catch (_) { /* private mode */ } },
    remove: key => { try { localStorage.removeItem('stacking-race-' + key); } catch (_) { /* private mode */ } }
  };

  async function api(path, body) {
    const response = await fetch('/api/stacking-race' + path, {
      method: body === undefined ? 'GET' : 'POST',
      cache: 'no-store',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: 'Bearer ' + token } : {}) },
      ...(body === undefined ? {} : { body: JSON.stringify(body) })
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw Object.assign(Error(data.message || '방에 연결하지 못했어요.'), { status: response.status });
    return data;
  }

  if (/\/coop\/?$/.test(location.pathname)) {
    window.StackingRace = {
      async openSelection(bankId, questionIds) {
        const data = await api('/rooms', { mode: 'views', bankId, questionIds, questionCount: questionIds.length });
        store.set('ticket-' + data.state.code, { token: data.token });
        location.assign('../race/?room=' + data.state.code);
      }
    };
  }
  if (!location.pathname.includes('/race') && !initialCode) return;
  document.body.classList.add('race-page');

  const clock = ms => `${Math.floor(ms / 60000)}:${String(Math.floor(ms / 1000) % 60).padStart(2, '0')}`;
  const towerCards = new Map();
  let stageState = null, bannerUntil = 0, sparkTimer;
  const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  function label(tag, text, className) {
    const node = document.createElement(tag); node.textContent = text;
    if (className) node.className = className; return node;
  }
  function stageSound() {
    const on = !StackingSounds.muted() && StackingSounds.volume() > 0;
    $('race-show-sound').textContent = on ? '소리 켜짐' : '소리 꺼짐';
    $('race-show-sound').setAttribute('aria-pressed', String(on));
    $('race-show-sound').setAttribute('aria-label', on ? '현황판 효과음 끄기' : '현황판 효과음 켜기');
  }
  $('race-show-sound').addEventListener('click', () => {
    const on = !StackingSounds.muted() && StackingSounds.volume() > 0;
    StackingSounds.setMuted(on);
    if (!on && !StackingSounds.volume()) StackingSounds.setVolume(.65);
    stageSound(); if (!on) StackingSounds.play('view');
  });
  function announceStage(text, sound, confetti = false) {
    $('race-banner').textContent = text; bannerUntil = Date.now() + 4500;
    if (sound) StackingSounds.play(sound);
    clearTimeout(sparkTimer); $('race-sparkles').replaceChildren();
    if (confetti && !reducedMotion()) {
      for (let i = 0; i < 28; i++) {
        const bit = label('i', '', 'race-spark');
        bit.style.cssText = `--x:${i * 100 / 28}%;--turn:${i % 2 ? 220 : -240}deg;--delay:${i % 5 * .045}s;background:hsl(${i * 47 % 360} 65% 60%)`;
        $('race-sparkles').append(bit);
      }
      sparkTimer = setTimeout(() => $('race-sparkles').replaceChildren(), 2200);
    }
  }
  function towerBlock(level, total, filled, animate) {
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    const y = total * 18 + 9 - level * 18;
    group.setAttribute('class', filled ? 'tower-block' : 'tower-ghost');
    group.innerHTML = `<g${animate ? ' class="tower-drop"' : ''}><path class="cube-left" d="M23 ${y} 50 ${y + 12}v18L23 ${y + 18}Z"/><path class="cube-right" d="M50 ${y + 12} 77 ${y}v18L50 ${y + 30}Z"/><path class="cube-top" d="M50 ${y - 12} 77 ${y} 50 ${y + 12} 23 ${y}Z"/></g>`;
    return group;
  }
  function renderStage(next) {
    const previous = stageState, sameRound = previous?.roundId === next.roundId && previous?.code === next.code;
    const root = $('race-ranks'), old = new Map(previous?.participants.map(p => [p.id, p]) || []);
    const towerHeight = Math.min(12, next.total);
    const before = new Map([...towerCards].map(([id, card]) => [id, card.li.getBoundingClientRect()]));
    if (!sameRound) { root.replaceChildren(); towerCards.clear(); $('race-sparkles').replaceChildren(); bannerUntil = 0; }
    root.dataset.density = next.participants.length > 20 ? 'compact' : 'normal';
    root.dataset.phase = next.phase;
    const finished = next.participants.filter(p => p.solved >= next.total).length;
    $('race-summary').replaceChildren(...[
      ['참가', `${next.participants.length}명`], ['완주', `${finished}명`], ['쌓은 정답', `${next.participants.reduce((sum, p) => sum + p.solved, 0)}개`]
    ].map(([title, value]) => { const item = label('span', title); item.append(label('b', value)); return item; }));
    for (const [id, card] of towerCards) if (!next.participants.some(p => p.id === id)) { card.li.remove(); towerCards.delete(id); }
    for (const p of next.participants) {
      let card = towerCards.get(p.id);
      if (!card) {
        const li = label('li', '', 'race-tower-card'); li.dataset.player = p.id;
        const hue = [...p.id].reduce((n, ch) => n + ch.charCodeAt(0), 0) * 37 % 360;
        li.style.setProperty('--tower-hue', hue);
        const rank = label('span', '', 'tower-rank'), name = label('strong', p.name, 'tower-name'); name.title = p.name;
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); svg.setAttribute('viewBox', `0 0 100 ${towerHeight * 18 + 42}`); svg.setAttribute('aria-hidden', 'true');
        for (let i = 0; i < towerHeight; i++) svg.append(towerBlock(i, towerHeight, false, false));
        const progress = label('div', '', 'tower-progress'); progress.setAttribute('role', 'progressbar'); progress.setAttribute('aria-label', p.name + ' 해결한 문제'); progress.setAttribute('aria-valuemin', '0'); progress.setAttribute('aria-valuemax', next.total);
        progress.append(label('i', '')); const detail = label('span', '', 'tower-detail');
        li.append(rank, name, svg, progress, detail); card = { li, rank, name, svg, progress, detail, layers: 0 }; towerCards.set(p.id, card);
      }
      card.name.textContent = p.name;
      card.rank.textContent = p.rank ? `${p.rank === 1 ? '♛ ' : ''}${p.rank}위` : next.phase === 'lobby' ? '준비' : '도전 중';
      card.li.dataset.rank = p.rank || '';
      card.li.classList.toggle('is-complete', p.solved >= next.total);
      const height = p.solved * towerHeight / next.total, layers = Math.ceil(height);
      if (layers > card.layers) {
        if (card.layers) card.svg.lastElementChild.removeAttribute('transform');
        for (let i = card.layers; i < layers; i++) card.svg.append(towerBlock(i, towerHeight, true, sameRound && old.has(p.id) && !reducedMotion()));
        card.layers = layers;
      }
      if (layers) {
        const fraction = 1 + height - layers;
        const bottom = (towerHeight - layers + 1) * 18 + 39;
        card.svg.lastElementChild.setAttribute('transform', `translate(0 ${bottom * (1 - fraction)}) scale(1 ${fraction})`);
      }
      card.progress.setAttribute('aria-valuenow', p.solved); card.progress.firstChild.style.width = `${p.solved / next.total * 100}%`;
      card.detail.textContent = next.phase === 'lobby' ? '준비 완료' : `${p.solved >= next.total ? '완주! ' : ''}${p.solved}/${next.total}${p.time != null ? ' · ' + clock(p.time) : ''}`;
      root.append(card.li);
    }
    if (sameRound && !reducedMotion()) for (const [id, card] of towerCards) {
      const a = before.get(id), b = card.li.getBoundingClientRect();
      if (a && (Math.abs(a.x - b.x) > 1 || Math.abs(a.y - b.y) > 1)) card.li.animate([{ transform: `translate(${a.x - b.x}px,${a.y - b.y}px)` }, { transform: 'translate(0,0)' }], { duration: 650, easing: 'cubic-bezier(.2,.8,.2,1)' });
    }
    const finishers = sameRound ? next.participants.filter(p => p.solved >= next.total && (old.get(p.id)?.solved ?? next.total) < next.total) : [];
    const leader = next.participants.find(p => p.rank === 1), priorLeader = previous?.participants.find(p => p.rank === 1);
    if (finishers.length) announceStage(finishers.length === 1 ? `${finishers[0].name} 완주!` : `${finishers.length}명 완주!`, 'success', true);
    else if (previous && !sameRound && next.phase === 'racing') announceStage('쌓기 시작!', 'found');
    else if (sameRound && leader && priorLeader && leader.id !== priorLeader.id) announceStage(`${leader.name}, 1위로!`, 'found');
    else if (sameRound && next.participants.some(p => p.solved > (old.get(p.id)?.solved ?? p.solved))) StackingSounds.play('add', leader?.solved || 1);
    if (Date.now() >= bannerUntil) $('race-banner').textContent = next.phase === 'lobby' ? (next.participants.length ? '모이면 출발!' : '참가자 입장 중') : next.phase === 'results' ? (leader ? `${leader.name} · ${leader.rank}위` : '이번 도전 완료') : leader ? `${leader.name} 선두!` : '첫 번째 블록의 주인공은?';
    stageState = next; stageSound();
  }
  function tick() {
    const left = state?.phase === 'racing' ? clock(Math.max(0, state.deadline - Date.now())) + ' 남음' : '';
    $('race-time').textContent = left;
    $('race-hud-time').textContent = left;
    $('race-time').classList.toggle('is-urgent', !!state?.me.host && state.phase === 'racing' && state.deadline - Date.now() < 60000);
  }

  // The board stays covered except while a student is still solving this round.
  function showPanel(open) {
    $('race-panel').hidden = !open;
    workspace.inert = open;
    $('race-hud').hidden = open || !state;
  }

  async function submit(index, heights) {
    const data = await api(`/rooms/${code}/answer`, { roundId: state.roundId, index, heights });
    render(data.state);
    return data;
  }

  function render(next) {
    if (!state || next.roundId !== state.roundId) {
      $('race-next-count').max = next.maxQuestions;
      $('race-next-count').value = next.total;
      $('race-next-mode').value = next.mode;
    }
    state = next;
    const host = next.me.host, racing = next.phase === 'racing', results = next.phase === 'results';
    const solving = !host && racing && next.me.solved < next.total;
    document.body.classList.toggle('race-host', host);
    $('race-entry').hidden = true;
    $('race-room').hidden = false;
    $('race-code-label').textContent = next.code;
    $('race-hud-code').textContent = next.code;
    $('race-phase').textContent = [next.sourceTitle || '자동 출제', names[next.mode], next.total + '문제', racing ? '진행 중' : results ? '결과' : '입장 중'].join(' · ');
    $('race-settings').hidden = !host || racing;
    if (!host || racing) $('race-next-mode').value = next.mode;
    $('race-start').hidden = !host || racing;
    $('race-start').textContent = results ? '다시 시작' : '시작';
    $('race-stop').hidden = !host || !racing;
    const mine = next.participants.find(p => p.id === next.me.id);
    $('race-hud-progress').textContent = `${next.me.solved}/${next.total}`;
    $('race-hud-rank').textContent = mine?.rank ? `${mine.rank}위` : '';
    status(host ? ''
      : racing ? (solving ? '' : '모두 풀었어요! 친구들을 기다려요.')
      : results ? '선생님이 다시 시작하면 새 판이 열려요.' : '선생님이 시작하기를 기다려요.');
    $('race-showcase').hidden = !host;
    if (host) renderStage(next);
    else $('race-ranks').replaceChildren(...next.participants.map(p => {
      const li = document.createElement('li');
      li.classList.toggle('mine', p.id === next.me.id);
      const name = document.createElement('strong');
      name.textContent = (p.rank && next.phase !== 'lobby' ? `${p.rank}위 · ` : '') + p.name;
      const detail = document.createElement('span');
      detail.textContent = next.phase === 'lobby' ? '입장' : `${p.solved}/${next.total}` + (p.time != null ? ` · ${clock(p.time)}` : '');
      li.append(name, detail);
      return li;
    }));
    if (racing && !host && shownRound !== next.roundId) {
      shownRound = next.roundId;
      App.race(next.mode, next.questions, Math.min(next.me.solved, next.total - 1), submit);
    }
    showPanel(!solving);
    tick();
  }

  function poll() {
    clearTimeout(pollTimer);
    if (!code) return;
    pollTimer = setTimeout(async () => {
      if (!document.hidden) {
        try {
          render(await api('/rooms/' + code));
          failures = 0;
        } catch (error) {
          status(error.message);
          if (error.status === 403 || error.status === 404) { showPanel(true); return; }
          failures++;
        }
      }
      poll();
    }, Math.min(10000, 2000 + failures * 2000));
  }

  function enter(data, nextCode) {
    code = nextCode;
    token = data.token;
    store.set('ticket-' + code, { token });
    history.replaceState(null, '', '?room=' + code);
    render(data.state);
    poll();
  }

  async function action(fn) {
    if (busy) return;
    busy = true;
    try { await fn(); } catch (error) { status(error.message); } finally { busy = false; }
  }

  async function joinRoom(value) {
    const saved = store.get('ticket-' + value);
    if (saved?.token) {
      token = saved.token;
      try { enter({ token, state: await api('/rooms/' + value) }, value); return; } catch (error) {
        if (error.status !== 403 && error.status !== 404) throw error;
        token = '';
        store.remove('ticket-' + value);
      }
    }
    enter(await api(`/rooms/${value}/join`, {}), value);
  }

  async function openEntry() {
    $('race-create').hidden = true;
    const session = await api('/session');
    // Students use the same room-number entrance linked from the home page.
    if (!session.isTeacher) { location.replace('/room/'); return; }
    $('race-create').hidden = false;
    // Auto-generated rooms are also available on installations without a board database.
    try {
      const response = await fetch('/api/boards/stacking-race-banks', { cache: 'no-store', credentials: 'same-origin' });
      if (!response.ok) return;
      const { banks } = await response.json();
      const source = $('race-source');
      source.replaceChildren(new Option('자동 출제', ''));
      for (const bank of banks || []) {
        const option = new Option(`${bank.title} (${bank.count}문제)`, bank.id);
        option.dataset.count = bank.count;
        source.add(option);
      }
      source.dispatchEvent(new Event('change'));
    } catch { /* The automatic source is independent of board availability. */ }
  }
  $('race-source').addEventListener('change', () => {
    const limit = Number($('race-source').selectedOptions[0].dataset.count || 200);
    $('race-count').max = limit;
    $('race-count').value = Math.min(Number($('race-count').value) || 6, limit);
  });
  $('race-open').addEventListener('click', () => action(async () => {
    if (!$('race-count').reportValidity()) return;
    const data = await api('/rooms', { mode: $('race-mode').value, bankId: $('race-source').value || undefined, questionCount: $('race-count').valueAsNumber });
    enter(data, data.state.code);
  }));
  $('race-start').addEventListener('click', () => action(async () => {
    if (!$('race-next-count').reportValidity()) return;
    render(await api(`/rooms/${code}/start`, { mode: $('race-next-mode').value, questionCount: $('race-next-count').valueAsNumber }));
  }));
  $('race-stop').addEventListener('click', () => action(async () => render(await api(`/rooms/${code}/stop`, {}))));
  $('race-leave').addEventListener('click', () => action(async () => {
    if (state?.me.host && !confirm('방을 닫으면 학생들의 순위전도 끝나요. 방을 닫을까요?')) return;
    await api(`/rooms/${code}/leave`, {}).catch(() => {});
    clearTimeout(pollTimer);
    store.remove('ticket-' + code);
    code = ''; token = ''; state = null; shownRound = '';
    App.free();
    document.body.classList.remove('race-host');
    $('race-room').hidden = true;
    $('race-entry').hidden = false;
    status('');
    showPanel(true);
    history.replaceState(null, '', location.pathname);
    await openEntry();
  }));

  showPanel(true);
  setInterval(tick, 1000);
  if (/^\d{4}$/.test(initialCode)) action(() => joinRoom(initialCode));
  else if (initialCode) location.replace('/room/');
  else action(openEntry);
})();
