(function () {
  'use strict';
  const $ = id => document.getElementById(id);
  const initialCode = new URLSearchParams(location.search).get('room') || '';
  if (!location.pathname.includes('/race') && !initialCode) return;
  const App = window.StackingApp;
  const workspace = document.querySelector('.workspace');
  const names = { views: '그림 보고 쌓기', copy: '따라 쌓기' };
  let code = '', token = '', state = null, pollTimer, shownRound = '', busy = false, failures = 0;
  document.body.classList.add('race-page');
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

  const clock = ms => `${Math.floor(ms / 60000)}:${String(Math.floor(ms / 1000) % 60).padStart(2, '0')}`;
  function tick() {
    const left = state?.phase === 'racing' ? clock(Math.max(0, state.deadline - Date.now())) + ' 남음' : '';
    $('race-time').textContent = left;
    $('race-hud-time').textContent = left;
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
    state = next;
    const host = next.me.host, racing = next.phase === 'racing', results = next.phase === 'results';
    const solving = !host && racing && next.me.solved < next.total;
    document.body.classList.toggle('race-host', host);
    $('race-entry').hidden = true;
    $('race-room').hidden = false;
    $('race-code-label').textContent = next.code;
    $('race-hud-code').textContent = next.code;
    $('race-phase').textContent = racing ? `${names[next.mode]} · 진행 중` : results ? '결과' : `${names[next.mode]} · 입장 중`;
    $('race-settings').hidden = !host || racing;
    if (!host || racing) $('race-next-mode').value = next.mode;
    $('race-start').hidden = !host || racing;
    $('race-start').textContent = results ? '다시 시작' : '시작';
    $('race-stop').hidden = !host || !racing;
    const mine = next.participants.find(p => p.id === next.me.id);
    $('race-hud-progress').textContent = `${next.me.solved}/${next.total}`;
    $('race-hud-rank').textContent = mine?.rank ? `${mine.rank}위` : '';
    status(host ? (racing ? '' : results ? '' : '학생들이 방번호로 들어오면 시작하세요.')
      : racing ? (solving ? '' : '모두 풀었어요! 친구들을 기다려요.')
      : results ? '선생님이 다시 시작하면 새 판이 열려요.' : '선생님이 시작하기를 기다려요.');
    $('race-ranks').replaceChildren(...next.participants.map(p => {
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

  $('race-code').value = initialCode.replace(/\D/g, '').slice(0, 4);
  $('race-code').addEventListener('input', () => { $('race-code').value = $('race-code').value.replace(/\D/g, '').slice(0, 4); });
  $('race-join').addEventListener('submit', event => {
    event.preventDefault();
    action(async () => {
      const value = $('race-code').value;
      if (!/^\d{4}$/.test(value)) throw Error('방번호 4자리를 입력해 주세요.');
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
    });
  });
  $('race-open').addEventListener('click', () => action(async () => {
    const data = await api('/rooms', { mode: $('race-mode').value });
    enter(data, data.state.code);
  }));
  $('race-start').addEventListener('click', () => action(async () => render(await api(`/rooms/${code}/start`, { mode: $('race-next-mode').value }))));
  $('race-stop').addEventListener('click', () => action(async () => render(await api(`/rooms/${code}/stop`, {}))));
  $('race-leave').addEventListener('click', () => action(async () => {
    if (state?.me.host && !confirm('방을 닫으면 학생들의 순위전도 끝나요. 방을 닫을까요?')) return;
    await api(`/rooms/${code}/leave`, {}).catch(() => {});
    clearTimeout(pollTimer);
    store.remove('ticket-' + code);
    code = ''; token = ''; state = null; shownRound = '';
    App.free();
    $('race-room').hidden = true;
    $('race-entry').hidden = false;
    status('');
    showPanel(true);
    history.replaceState(null, '', location.pathname);
  }));

  showPanel(true);
  setInterval(tick, 1000);
  api('/session').then(session => { $('race-create').hidden = !session.isTeacher; }).catch(error => status(error.message));
  if (/^\d{4}$/.test(initialCode)) $('race-join').requestSubmit();
})();
